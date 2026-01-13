import { motion } from "framer-motion";
import { Watch, Heart, Activity, Moon, Footprints, Flame, TrendingUp, AlertTriangle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const heartRateData = [
  { time: "00:00", value: 62 },
  { time: "04:00", value: 58 },
  { time: "08:00", value: 75 },
  { time: "12:00", value: 82 },
  { time: "16:00", value: 78 },
  { time: "20:00", value: 70 },
  { time: "24:00", value: 65 },
];

const sleepData = [
  { day: "Mon", deep: 2.5, light: 4, rem: 1.5 },
  { day: "Tue", deep: 2, light: 4.5, rem: 1.2 },
  { day: "Wed", deep: 2.8, light: 3.8, rem: 1.8 },
  { day: "Thu", deep: 2.2, light: 4.2, rem: 1.4 },
  { day: "Fri", deep: 2.6, light: 4, rem: 1.6 },
  { day: "Sat", deep: 3, light: 4.5, rem: 2 },
  { day: "Sun", deep: 2.4, light: 4.3, rem: 1.5 },
];

const metrics = [
  { icon: Heart, label: "Heart Rate", value: "72", unit: "bpm", color: "text-coral", bg: "bg-coral/10", trend: "+2%" },
  { icon: Footprints, label: "Steps Today", value: "8,432", unit: "steps", color: "text-primary", bg: "bg-primary/10", trend: "+15%" },
  { icon: Moon, label: "Sleep Score", value: "85", unit: "/100", color: "text-purple", bg: "bg-purple/10", trend: "+5%" },
  { icon: Flame, label: "Calories", value: "1,847", unit: "kcal", color: "text-warning", bg: "bg-warning/10", trend: "+8%" },
];

const predictions = [
  {
    title: "Cardiovascular Health",
    score: 87,
    status: "good",
    message: "Your heart rate patterns indicate good cardiovascular health. Keep up the regular exercise!",
  },
  {
    title: "Sleep Quality",
    score: 72,
    status: "moderate",
    message: "Your sleep patterns show room for improvement. Try maintaining a consistent sleep schedule.",
  },
  {
    title: "Stress Level",
    score: 65,
    status: "moderate",
    message: "Elevated stress detected based on HRV data. Consider meditation or relaxation techniques.",
  },
];

export default function HealthPrediction() {
  return (
    <Layout>
      <PageHeader
        icon={Watch}
        title="Health Prediction"
        description="AI-powered health insights based on your wearable device data for preventive healthcare."
        gradient="bg-success"
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-2xl shadow-card border border-border p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${metric.bg} flex items-center justify-center`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <span className="text-xs font-medium text-success">{metric.trend}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
            <p className="text-2xl font-display font-bold text-foreground">
              {metric.value}
              <span className="text-sm font-normal text-muted-foreground ml-1">{metric.unit}</span>
            </p>
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
              Heart Rate (24h)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={heartRateData}>
                  <defs>
                    <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(12, 76%, 61%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(12, 76%, 61%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[50, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(12, 76%, 61%)"
                    fill="url(#heartGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
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
              Sleep Patterns (Weekly)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sleepData}>
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
                  <Line type="monotone" dataKey="deep" stroke="hsl(262, 83%, 58%)" strokeWidth={2} dot={{ r: 4 }} name="Deep Sleep" />
                  <Line type="monotone" dataKey="light" stroke="hsl(199, 89%, 48%)" strokeWidth={2} dot={{ r: 4 }} name="Light Sleep" />
                  <Line type="monotone" dataKey="rem" stroke="hsl(172, 66%, 45%)" strokeWidth={2} dot={{ r: 4 }} name="REM" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Predictions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-card rounded-2xl shadow-card border border-border p-6">
            <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Health Predictions
            </h3>
            <div className="space-y-4">
              {predictions.map((pred) => (
                <div key={pred.title} className="p-4 bg-muted rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{pred.title}</span>
                    <span
                      className={`text-sm font-semibold ${
                        pred.score >= 80 ? "text-success" : pred.score >= 60 ? "text-warning" : "text-destructive"
                      }`}
                    >
                      {pred.score}/100
                    </span>
                  </div>
                  <Progress value={pred.score} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">{pred.message}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-warning/10 to-coral/10 rounded-2xl p-5 border border-warning/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Health Alert</h4>
                <p className="text-sm text-muted-foreground">
                  Your resting heart rate has been slightly elevated this week. Consider reducing caffeine intake and getting more rest.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
