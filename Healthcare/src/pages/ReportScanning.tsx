import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, FileImage, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const reportTypes = [
  { id: "xray", label: "X-Ray", icon: FileImage },
  { id: "mri", label: "MRI Scan", icon: FileImage },
  { id: "ct", label: "CT Scan", icon: FileImage },
  { id: "report", label: "Lab Report", icon: FileText },
];

export default function ReportScanning() {
  const [selectedType, setSelectedType] = useState("xray");
  const [hasResult, setHasResult] = useState(false);

  const handleUpload = () => {
    setHasResult(true);
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
                      <type.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      Upload {type.label}
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Drag and drop your {type.label.toLowerCase()} file or click to browse.
                      Supported formats: DICOM, JPG, PNG, PDF
                    </p>
                    <Button onClick={handleUpload} className="gradient-primary text-primary-foreground">
                      <Upload className="w-4 h-4 mr-2" />
                      Select File
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>

          {/* Analysis Results */}
          {hasResult && (
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

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-success/10 rounded-xl p-4 border border-success/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="font-medium text-success">Normal Findings</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Lung fields appear clear</li>
                    <li>• Normal cardiac silhouette</li>
                    <li>• No pleural effusion</li>
                  </ul>
                </div>

                <div className="bg-warning/10 rounded-xl p-4 border border-warning/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-warning" />
                    <span className="font-medium text-warning">Areas of Attention</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Minor opacity in right lower lobe</li>
                    <li>• Recommend follow-up in 6 months</li>
                  </ul>
                </div>
              </div>

              <div className="bg-muted rounded-xl p-4">
                <h4 className="font-medium text-foreground mb-2">Summary</h4>
                <p className="text-sm text-muted-foreground">
                  The chest X-ray shows predominantly normal findings with a minor opacity in the right lower lobe that appears to be non-concerning. However, a follow-up examination in 6 months is recommended to monitor any changes. No urgent intervention required.
                </p>
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
