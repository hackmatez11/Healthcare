import { motion } from "framer-motion";
import { Heart, Utensils, Moon, Footprints, Droplets, TrendingUp, Target, Calendar } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const weeklyData = [
  { day: "Mon", sleep: 7.5, steps: 8500, water: 8, calories: 1950 },
  { day: "Tue", sleep: 6.8, steps: 6200, water: 6, calories: 2100 },
  { day: "Wed", sleep: 7.2, steps: 9100, water: 8, calories: 1850 },
  { day: "Thu", sleep: 8.0, steps: 10200, water: 9, calories: 1920 },
  { day: "Fri", sleep: 6.5, steps: 7800, water: 7, calories: 2200 },
  { day: "Sat", sleep: 8.5, steps: 12500, water: 10, calories: 2050 },
  { day: "Sun", sleep: 7.8, steps: 5400, water: 8, calories: 1980 },
];

const lifestyleMetrics = [
  { icon: Moon, label: "Avg Sleep", value: "7.4h", target: "8h", progress: 92, color: "text-purple" },
  { icon: Footprints, label: "Avg Steps", value: "8,529", target: "10k", progress: 85, color: "text-primary" },
  { icon: Droplets, label: "Hydration", value: "8 cups", target: "10 cups", progress: 80, color: "text-secondary" },
  { icon: Utensils, label: "Calories", value: "2,007", target: "2,000", progress: 100, color: "text-coral" },
];

const recommendations = [
  {
    title: "Improve Sleep Quality",
    description: "Try going to bed 30 minutes earlier on weeknights",
    priority: "high",
  },
  {
    title: "Increase Step Count",
    description: "Take a 15-minute walk after lunch to boost daily steps",
    priority: "medium",
  },
  {
    title: "Stay Hydrated",
    description: "Set reminders to drink water throughout the day",
    priority: "medium",
  },
];

export default function Lifestyle() {
  return (
    <Layout>
      <PageHeader
        icon={Heart}
        title="Lifestyle Analysis"
        description="Track and analyze your daily habits to build a healthier lifestyle."
        gradient="bg-coral"
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {lifestyleMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-2xl shadow-card border border-border p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <p className="font-display font-bold text-xl text-foreground">{metric.value}</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Target: {metric.target}</span>
                <span className="font-medium text-foreground">{metric.progress}%</span>
              </div>
              <Progress value={metric.progress} className="h-1.5" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl shadow-card border border-border p-6"
          >
            <h3 className="font-display font-semibold text-lg text-foreground mb-4">
              Weekly Activity Overview
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="steps" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} name="Steps" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl shadow-card border border-border p-6"
          >
            <h3 className="font-display font-semibold text-lg text-foreground mb-4">
              Sleep Patterns
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[5, 10]} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sleep"
                    stroke="hsl(262, 83%, 58%)"
                    strokeWidth={3}
                    dot={{ fill: "hsl(262, 83%, 58%)", strokeWidth: 2, r: 5 }}
                    name="Hours of Sleep"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Recommendations */}
          <div className="bg-card rounded-2xl shadow-card border border-border p-5">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              AI Recommendations
            </h3>
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div
                  key={rec.title}
                  className={`p-3 rounded-xl border ${
                    rec.priority === "high"
                      ? "bg-coral/5 border-coral/20"
                      : "bg-muted border-border"
                  }`}
                >
                  <h4 className="font-medium text-sm text-foreground mb-1">{rec.title}</h4>
                  <p className="text-xs text-muted-foreground">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="bg-card rounded-2xl shadow-card border border-border p-5">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-secondary" />
              Weekly Goals
            </h3>
            <div className="space-y-4">
              {[
                { label: "Exercise 5 days", progress: 60 },
                { label: "Sleep 8h avg", progress: 92 },
                { label: "Drink 10 cups water", progress: 80 },
                { label: "Eat 5 servings veggies", progress: 45 },
              ].map((goal) => (
                <div key={goal.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{goal.label}</span>
                    <span className="font-medium text-foreground">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Daily Check-in */}
          <div className="bg-gradient-to-br from-coral/10 to-warning/10 rounded-2xl p-5 border border-coral/20">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-coral" />
              <h4 className="font-semibold text-foreground">Daily Check-in</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Log your meals, activities, and mood to get personalized insights.
            </p>
            <Button className="w-full gradient-alert text-primary-foreground">
              Log Today's Activities
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
