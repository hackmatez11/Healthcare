import { useState } from "react";
import { motion } from "framer-motion";
import { ScanLine, Upload, Image, Check, AlertTriangle, Info } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function SkinDetection() {
  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<null | {
    condition: string;
    confidence: number;
    severity: "low" | "medium" | "high";
    recommendations: string[];
  }>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file upload
    simulateAnalysis();
  };

  const simulateAnalysis = () => {
    setAnalyzing(true);
    setProgress(0);
    setResult(null);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          setResult({
            condition: "Eczema (Atopic Dermatitis)",
            confidence: 87,
            severity: "medium",
            recommendations: [
              "Keep the affected area moisturized",
              "Avoid scratching to prevent infection",
              "Use mild, fragrance-free soaps",
              "Consult a dermatologist for prescription treatment",
            ],
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <Layout>
      <PageHeader
        icon={ScanLine}
        title="Skin Disease Detection"
        description="Upload an image of your skin condition for AI-powered analysis and recommendations."
        gradient="bg-secondary"
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 h-[400px] flex flex-col items-center justify-center",
              dragActive
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            {analyzing ? (
              <div className="text-center w-full max-w-sm">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary/10 flex items-center justify-center mb-4">
                  <ScanLine className="w-8 h-8 text-secondary animate-pulse" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  Analyzing Image...
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our AI is examining the skin condition
                </p>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Upload className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                  Upload Skin Image
                </h3>
                <p className="text-muted-foreground text-center mb-6 max-w-sm">
                  Drag and drop an image or click to browse. Supported formats: JPG, PNG
                </p>
                <Button onClick={simulateAnalysis} className="gradient-primary text-primary-foreground">
                  <Image className="w-4 h-4 mr-2" />
                  Select Image
                </Button>
              </>
            )}
          </div>
        </motion.div>

        {/* Results Area */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {result ? (
            <div className="bg-card rounded-2xl shadow-card border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    result.severity === "low"
                      ? "bg-success/10"
                      : result.severity === "medium"
                      ? "bg-warning/10"
                      : "bg-destructive/10"
                  )}
                >
                  {result.severity === "low" ? (
                    <Check className="w-6 h-6 text-success" />
                  ) : (
                    <AlertTriangle
                      className={cn(
                        "w-6 h-6",
                        result.severity === "medium" ? "text-warning" : "text-destructive"
                      )}
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-foreground">
                    {result.condition}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {result.confidence}% confidence · {result.severity} severity
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-foreground mb-3">Confidence Level</h4>
                <div className="flex items-center gap-3">
                  <Progress value={result.confidence} className="flex-1 h-3" />
                  <span className="text-sm font-medium text-foreground">{result.confidence}%</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    This analysis is for informational purposes only. Please consult a dermatologist for professional medical advice.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl shadow-card border border-border p-6 h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <ScanLine className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                No Analysis Yet
              </h3>
              <p className="text-muted-foreground max-w-sm">
                Upload an image of the skin condition to receive AI-powered analysis and recommendations.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
