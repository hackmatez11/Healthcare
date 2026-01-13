import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Waves, Brain, Upload, Zap, AlertCircle, CheckCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Generate sample EEG-like data
const generateSignalData = (points: number, amplitude: number) => {
  return Array.from({ length: points }, (_, i) => ({
    time: i,
    alpha: Math.sin(i * 0.1) * amplitude + Math.random() * 10 - 5,
    beta: Math.sin(i * 0.2 + 1) * amplitude * 0.7 + Math.random() * 8 - 4,
    theta: Math.sin(i * 0.05) * amplitude * 1.2 + Math.random() * 12 - 6,
  }));
};

const eegData = generateSignalData(100, 30);

const analysisResults = [
  { band: "Alpha (8-13 Hz)", power: 45, status: "normal", description: "Associated with relaxation and calm focus" },
  { band: "Beta (13-30 Hz)", power: 32, status: "normal", description: "Associated with active thinking and concentration" },
  { band: "Theta (4-8 Hz)", power: 18, status: "elevated", description: "Associated with drowsiness and light sleep" },
  { band: "Delta (0.5-4 Hz)", power: 5, status: "normal", description: "Associated with deep sleep" },
];

export default function SignalAnalysis() {
  const [hasData, setHasData] = useState(true);

  return (
    <Layout>
      <PageHeader
        icon={Activity}
        title="Signal Analysis"
        description="Analyze EEG and audio signals for neurological health monitoring and insights."
      />

      <Tabs defaultValue="eeg" className="space-y-6">
        <TabsList>
          <TabsTrigger value="eeg" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            EEG Analysis
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Waves className="w-4 h-4" />
            Audio Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="eeg">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Signal Visualization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-card rounded-2xl shadow-card border border-border p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-semibold text-lg text-foreground">
                  EEG Signal Visualization
                </h3>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Data
                </Button>
              </div>

              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={eegData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="alpha" stroke="hsl(199, 89%, 48%)" strokeWidth={1.5} dot={false} name="Alpha" />
                    <Line type="monotone" dataKey="beta" stroke="hsl(262, 83%, 58%)" strokeWidth={1.5} dot={false} name="Beta" />
                    <Line type="monotone" dataKey="theta" stroke="hsl(172, 66%, 45%)" strokeWidth={1.5} dot={false} name="Theta" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground">Alpha</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple" />
                  <span className="text-sm text-muted-foreground">Beta</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <span className="text-sm text-muted-foreground">Theta</span>
                </div>
              </div>
            </motion.div>

            {/* Analysis Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-card rounded-2xl shadow-card border border-border p-5">
                <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Frequency Analysis
                </h3>
                <div className="space-y-3">
                  {analysisResults.map((result) => (
                    <div key={result.band} className="p-3 bg-muted rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{result.band}</span>
                        <div className="flex items-center gap-1">
                          {result.status === "normal" ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-warning" />
                          )}
                          <span className={`text-xs ${result.status === "normal" ? "text-success" : "text-warning"}`}>
                            {result.status}
                          </span>
                        </div>
                      </div>
                      <div className="relative h-2 bg-border rounded-full overflow-hidden mb-2">
                        <div
                          className="absolute left-0 top-0 h-full gradient-primary rounded-full"
                          style={{ width: `${result.power}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{result.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-5 border border-primary/20">
                <h4 className="font-semibold text-foreground mb-2">Summary</h4>
                <p className="text-sm text-muted-foreground">
                  EEG patterns show normal brain activity with slightly elevated theta waves, 
                  suggesting mild drowsiness. Consider getting adequate rest.
                </p>
              </div>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="audio">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl shadow-card border border-border p-8 text-center"
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Waves className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-xl text-foreground mb-2">
              Audio Signal Analysis
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Upload audio recordings for analysis. Our AI can detect voice patterns, 
              respiratory sounds, and other health-related audio biomarkers.
            </p>
            <Button className="gradient-primary text-primary-foreground">
              <Upload className="w-4 h-4 mr-2" />
              Upload Audio File
            </Button>
          </motion.div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
