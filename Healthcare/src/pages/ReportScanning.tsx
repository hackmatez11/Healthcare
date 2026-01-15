import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, FileImage, Zap, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { medicalAnalysisService, type AnalysisResponse } from "@/services/medicalAnalysisService";
import { useToast } from "@/hooks/use-toast";

const reportTypes = [
  { id: "xray", label: "X-Ray", icon: FileImage, analyzeFunc: 'analyzeXRay' },
  { id: "mri", label: "MRI Scan", icon: FileImage, analyzeFunc: 'analyzeMRI' },
  { id: "ct", label: "CT Scan", icon: FileImage, analyzeFunc: 'analyzeCT' },
  { id: "report", label: "Lab Report", icon: FileText, analyzeFunc: 'analyzeLabReport' },
];

export default function ReportScanning() {
  const [selectedType, setSelectedType] = useState("xray");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type) && !file.name.endsWith('.dcm')) {
        toast({
          title: "Invalid file type",
          description: "Please select a JPEG, PNG, PDF, or DICOM file",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    setAnalyzing(true);
    setResult(null);

    try {
      const currentType = reportTypes.find(t => t.id === selectedType);
      if (!currentType) return;

      let analysisResult: AnalysisResponse;

      // Call the appropriate analysis function based on type
      switch (currentType.analyzeFunc) {
        case 'analyzeXRay':
          analysisResult = await medicalAnalysisService.analyzeXRay(file);
          break;
        case 'analyzeMRI':
          analysisResult = await medicalAnalysisService.analyzeMRI(file);
          break;
        case 'analyzeCT':
          analysisResult = await medicalAnalysisService.analyzeCT(file);
          break;
        case 'analyzeLabReport':
          analysisResult = await medicalAnalysisService.analyzeLabReport(file);
          break;
        default:
          throw new Error('Invalid analysis type');
      }

      setResult(analysisResult);
      toast({
        title: "Analysis Complete",
        description: "Your medical image has been analyzed successfully",
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Layout>
      <PageHeader
        icon={FileText}
        title="Medical Report Scanning"
        description="Upload X-rays, MRI scans, or lab reports for AI-powered analysis and interpretation."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl shadow-card border border-border p-6"
          >
            <Tabs value={selectedType} onValueChange={setSelectedType}>
              <TabsList className="grid grid-cols-4 mb-6">
                {reportTypes.map((type) => (
                  <TabsTrigger key={type.id} value={type.id} className="flex items-center gap-2">
                    <type.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{type.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {reportTypes.map((type) => (
                <TabsContent key={type.id} value={type.id}>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      {analyzing ? (
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      ) : (
                        <type.icon className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {analyzing ? `Analyzing ${type.label}...` : `Upload ${type.label}`}
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      {analyzing
                        ? "AI is analyzing your medical image. This may take a moment..."
                        : `Drag and drop your ${type.label.toLowerCase()} file or click to browse. Supported formats: DICOM, JPG, PNG, PDF`
                      }
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf,.dcm"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      onClick={triggerFileInput}
                      disabled={analyzing}
                      className="gradient-primary text-primary-foreground"
                    >
                      {analyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Select File
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>

          {/* Analysis Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-card rounded-2xl shadow-card border border-border p-6"
            >
              <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                AI Analysis Results
              </h3>

              <div className="bg-muted rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="font-medium text-foreground">Analysis Complete</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Model: {result.model} • {new Date(result.timestamp).toLocaleString()}
                </p>
              </div>

              <div className="prose prose-sm max-w-none">
                <div className="bg-background rounded-xl p-4 border border-border">
                  <h4 className="font-semibold text-foreground mb-3">Detailed Analysis</h4>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {result.analysis}
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-warning/10 rounded-xl border border-warning/20">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Important:</strong> This AI analysis is for informational purposes only and should not replace professional medical advice. Please consult with a qualified healthcare provider for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl shadow-card border border-border p-5"
          >
            <h3 className="font-display font-semibold text-foreground mb-4">Recent Scans</h3>
            <div className="space-y-3">
              {[
                { name: "Chest X-Ray", date: "Jan 10, 2026", status: "analyzed" },
                { name: "MRI Brain", date: "Jan 5, 2026", status: "analyzed" },
                { name: "Blood Work", date: "Dec 28, 2025", status: "analyzed" },
              ].map((scan) => (
                <div
                  key={scan.name}
                  className="flex items-center justify-between p-3 bg-muted rounded-xl"
                >
                  <div>
                    <p className="font-medium text-sm text-foreground">{scan.name}</p>
                    <p className="text-xs text-muted-foreground">{scan.date}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full">
                    {scan.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-5 border border-primary/20"
          >
            <h4 className="font-display font-semibold text-foreground mb-2">
              How it works
            </h4>
            <ol className="text-sm text-muted-foreground space-y-2">
              <li className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">1</span>
                Upload your medical image
              </li>
              <li className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">2</span>
                AI analyzes the image
              </li>
              <li className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">3</span>
                Review findings & share with doctor
              </li>
            </ol>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
