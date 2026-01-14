import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Brain, Smile, Meh, Frown, TrendingUp, MessageCircle, Heart, Sun, Moon, Cloud, Gamepad2, BarChart3 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { WellnessModal, WellnessActivityType } from "@/components/mental-health/WellnessModal";
import { MentalHealthGames, GameType } from "@/components/mental-health/MentalHealthGames";
import { MentalHealthAnalytics } from "@/components/mental-health/MentalHealthAnalytics";
import {
  saveMoodEntry,
  getWeeklyMoodData,
  getMoodStats,
  saveWellnessActivity,
  saveMoodEntryLocal,
  getWeeklyMoodDataLocal,
  getMoodEntriesLocal,
  type MoodStats,
} from "@/services/mentalHealthService";
import {
  getAnalyticsData,
  acknowledgeInsight,
  type AnalyticsData,
} from "@/services/analyticsService";

const moods = [
  { icon: Smile, label: "Great", value: 5, color: "text-success" },
  { icon: Smile, label: "Good", value: 4, color: "text-primary" },
  { icon: Meh, label: "Okay", value: 3, color: "text-warning" },
  { icon: Frown, label: "Low", value: 2, color: "text-coral" },
  { icon: Frown, label: "Struggling", value: 1, color: "text-destructive" },
];

const resources = [
  { title: "Guided Meditation", duration: "10 min", icon: Moon, type: "meditation" as WellnessActivityType },
  { title: "Breathing Exercise", duration: "5 min", icon: Cloud, type: "breathing" as WellnessActivityType },
  { title: "Gratitude Journal", duration: "15 min", icon: Sun, type: "gratitude" as WellnessActivityType },
  { title: "Talk to a Counselor", duration: "Available 24/7", icon: MessageCircle, type: "counselor" as WellnessActivityType },
];

export default function MentalHealth() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [journalEntry, setJournalEntry] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [moodData, setMoodData] = useState<{ day: string; mood: number }[]>([]);
  const [stats, setStats] = useState<MoodStats>({ stressLevel: 0, anxiety: 0, wellbeing: 0 });
  const [wellnessModalOpen, setWellnessModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<WellnessActivityType | null>(null);
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  // Load mood data on mount
  useEffect(() => {
    if (user) {
      loadMoodData();
      loadStats();
      loadAnalytics();
    } else {
      // Load from localStorage if not authenticated
      const localData = getWeeklyMoodDataLocal("guest");
      setMoodData(localData.length > 0 ? localData : getDefaultMoodData());
    }
  }, [user]);

  const loadMoodData = async () => {
    if (!user) return;

    try {
      const data = await getWeeklyMoodData(user.id);
      setMoodData(data.length > 0 ? data : getDefaultMoodData());
    } catch (error) {
      console.error("Error loading mood data:", error);
      const localData = getWeeklyMoodDataLocal(user.id);
      setMoodData(localData.length > 0 ? localData : getDefaultMoodData());
    }
  };

  const loadStats = async () => {
    if (!user) return;

    try {
      const moodStats = await getMoodStats(user.id);
      setStats(moodStats);
    } catch (error) {
      console.error("Error loading stats:", error);
      // Calculate from local data
      const localEntries = getMoodEntriesLocal(user.id);
      if (localEntries.length > 0) {
        const avgMood = localEntries.reduce((sum, e) => sum + e.mood_value, 0) / localEntries.length;
        setStats({
          stressLevel: Math.round((5 - avgMood) * 15),
          anxiety: Math.round((5 - avgMood) * 12),
          wellbeing: Math.round((avgMood / 5) * 100),
        });
      }
    }
  };

  const loadAnalytics = async () => {
    if (!user) return;

    setLoadingAnalytics(true);
    try {
      const data = await getAnalyticsData(user.id);
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const getDefaultMoodData = () => [
    { day: "Mon", mood: 0 },
    { day: "Tue", mood: 0 },
    { day: "Wed", mood: 0 },
    { day: "Thu", mood: 0 },
    { day: "Fri", mood: 0 },
    { day: "Sat", mood: 0 },
    { day: "Sun", mood: 0 },
  ];

  const handleSaveEntry = async () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Choose how you're feeling today before saving",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const userId = user?.id || "guest";

      if (user) {
        // Try to save to Supabase
        const { error } = await saveMoodEntry(userId, selectedMood, journalEntry);

        if (error) {
          // Fallback to localStorage
          saveMoodEntryLocal(userId, selectedMood, journalEntry);
          toast({
            title: "Saved locally",
            description: "Your entry has been saved to your device",
          });
        } else {
          toast({
            title: "Entry saved!",
            description: "Your mood has been recorded successfully",
          });
        }
      } else {
        // Save to localStorage for guest users
        saveMoodEntryLocal(userId, selectedMood, journalEntry);
        toast({
          title: "Entry saved!",
          description: "Your mood has been saved locally",
        });
      }

      // Reload data
      await loadMoodData();
      await loadStats();
      if (user) {
        await loadAnalytics();
      }

      // Reset form
      setSelectedMood(null);
      setJournalEntry("");
    } catch (error) {
      console.error("Error saving mood entry:", error);
      toast({
        title: "Error",
        description: "Failed to save your entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResourceClick = (activityType: WellnessActivityType) => {
    setSelectedActivity(activityType);
    setWellnessModalOpen(true);
  };

  const handleActivityComplete = async (activityType: string, duration: number) => {
    if (user) {
      try {
        await saveWellnessActivity(user.id, activityType, duration);
        toast({
          title: "Great job!",
          description: `You completed a ${activityType} session`,
        });
        await loadAnalytics();
      } catch (error) {
        console.error("Error saving wellness activity:", error);
      }
    } else {
      toast({
        title: "Activity completed!",
        description: `You completed a ${activityType} session`,
      });
    }
  };

  const handleGameClick = (gameType: GameType) => {
    setSelectedGame(gameType);
    setGameModalOpen(true);
  };

  const handleGameComplete = async () => {
    setGameModalOpen(false);
    setSelectedGame(null);
    if (user) {
      await loadAnalytics();
    }
  };

  const handleAcknowledgeInsight = async (insightId: string) => {
    const success = await acknowledgeInsight(insightId);
    if (success && user) {
      toast({
        title: "Insight acknowledged",
        description: "We'll continue to provide personalized insights",
      });
      await loadAnalytics();
    }
  };

  const statsData = useMemo(() => [
    { label: "Stress Level", value: stats.stressLevel, status: stats.stressLevel < 30 ? "Low" : stats.stressLevel < 60 ? "Moderate" : "High" },
    { label: "Anxiety", value: stats.anxiety, status: stats.anxiety < 30 ? "Minimal" : stats.anxiety < 60 ? "Moderate" : "High" },
    { label: "Overall Wellbeing", value: stats.wellbeing, status: stats.wellbeing > 70 ? "Good" : stats.wellbeing > 40 ? "Fair" : "Needs Attention" },
  ], [stats]);

  return (
    <Layout>
      <PageHeader
        icon={Brain}
        title="Mental Health"
        description="Track your emotional well-being and access mental health support resources."
        gradient="gradient-mental"
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mood Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl shadow-card border border-border p-6"
          >
            <h3 className="font-display font-semibold text-lg text-foreground mb-6">
              How are you feeling today?
            </h3>

            <div className="flex justify-between gap-3 mb-6">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                    selectedMood === mood.value
                      ? "border-purple bg-purple/5"
                      : "border-border hover:border-purple/50"
                  )}
                >
                  <mood.icon className={cn("w-8 h-8", mood.color)} />
                  <span className="text-sm font-medium text-foreground">{mood.label}</span>
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                What's on your mind? (Optional)
              </label>
              <Textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Write about your thoughts and feelings..."
                className="min-h-24 resize-none"
              />
            </div>

            <Button
              onClick={handleSaveEntry}
              className="w-full gradient-mental text-primary-foreground"
              disabled={!selectedMood || isSaving}
            >
              {isSaving ? "Saving..." : "Save Today's Entry"}
            </Button>
          </motion.div>

          {/* Mood Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl shadow-card border border-border p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple" />
                Weekly Mood Trend
              </h3>
              <span className="text-sm text-muted-foreground">This Week</span>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData}>
                  <defs>
                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 5]} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="hsl(262, 83%, 58%)"
                    strokeWidth={3}
                    dot={{ fill: "hsl(262, 83%, 58%)", strokeWidth: 2, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Mental Health Assessment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl shadow-card border border-border p-6"
          >
            <h3 className="font-display font-semibold text-lg text-foreground mb-4">
              Mental Health Assessment
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {statsData.map((metric) => (
                <div key={metric.label} className="p-4 bg-muted rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
                  <Progress value={metric.value} className="h-2 mb-2" />
                  <p className="text-sm font-medium text-foreground">{metric.status}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Quick Resources */}
          <div className="bg-card rounded-2xl shadow-card border border-border p-5">
            <h3 className="font-display font-semibold text-foreground mb-4">Wellness Resources</h3>
            <div className="space-y-3">
              {resources.map((resource) => (
                <button
                  key={resource.title}
                  onClick={() => handleResourceClick(resource.type)}
                  className="w-full flex items-center gap-3 p-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple/10 flex items-center justify-center">
                    <resource.icon className="w-5 h-5 text-purple" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{resource.title}</p>
                    <p className="text-xs text-muted-foreground">{resource.duration}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Support Banner */}
          <div className="bg-gradient-to-br from-purple/10 to-primary/10 rounded-2xl p-5 border border-purple/20">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-purple" />
              <span className="font-semibold text-foreground">Need Support?</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Our counselors are available 24/7 to provide confidential support.
            </p>
            <Button
              onClick={() => handleResourceClick("counselor")}
              className="w-full gradient-mental text-primary-foreground"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Talk to Someone
            </Button>
          </div>

          {/* Daily Affirmation */}
          <div className="bg-card rounded-2xl shadow-card border border-border p-5">
            <h4 className="font-semibold text-foreground mb-3">Today's Affirmation</h4>
            <p className="text-muted-foreground italic">
              "I am capable of handling whatever comes my way today. I choose to focus on what I can control."
            </p>
          </div>
        </motion.div>
      </div>

      {/* Wellness Modal */}
      <WellnessModal
        isOpen={wellnessModalOpen}
        onClose={() => {
          setWellnessModalOpen(false);
          setSelectedActivity(null);
        }}
        activityType={selectedActivity}
        onComplete={handleActivityComplete}
      />
    </Layout>
  );
}
