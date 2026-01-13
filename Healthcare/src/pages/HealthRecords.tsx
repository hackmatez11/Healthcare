import { motion } from "framer-motion";
import { Database, FileText, Shield, Upload, Download, Search, Folder, Clock, Lock } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const records = [
  { id: 1, name: "Blood Test Report", type: "Lab Report", date: "Jan 10, 2026", size: "2.4 MB", category: "reports" },
  { id: 2, name: "Chest X-Ray", type: "Imaging", date: "Jan 5, 2026", size: "8.1 MB", category: "imaging" },
  { id: 3, name: "Prescription - Dr. Chen", type: "Prescription", date: "Jan 3, 2026", size: "0.5 MB", category: "prescriptions" },
  { id: 4, name: "Vaccination Record", type: "Immunization", date: "Dec 15, 2025", size: "1.2 MB", category: "immunization" },
  { id: 5, name: "Annual Checkup Summary", type: "Report", date: "Dec 1, 2025", size: "3.8 MB", category: "reports" },
  { id: 6, name: "MRI Scan - Knee", type: "Imaging", date: "Nov 20, 2025", size: "12.5 MB", category: "imaging" },
];

const categories = [
  { id: "all", label: "All Records", count: records.length },
  { id: "reports", label: "Lab Reports", count: 2 },
  { id: "imaging", label: "Imaging", count: 2 },
  { id: "prescriptions", label: "Prescriptions", count: 1 },
  { id: "immunization", label: "Immunization", count: 1 },
];

export default function HealthRecords() {
  return (
    <Layout>
      <PageHeader
        icon={Database}
        title="Health Records"
        description="Securely store and access all your medical records in one centralized location."
        gradient="bg-purple"
      />

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-card rounded-2xl shadow-card border border-border p-5">
            <h3 className="font-display font-semibold text-foreground mb-4">Categories</h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors",
                    cat.id === "all" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                  )}
                >
                  <span>{cat.label}</span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full", cat.id === "all" ? "bg-primary-foreground/20" : "bg-muted")}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple/10 to-primary/10 rounded-2xl p-5 border border-purple/20">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-purple" />
              <span className="font-semibold text-foreground">Data Security</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-success" />
                End-to-end encryption
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-success" />
                HIPAA compliant
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-success" />
                Secure cloud storage
              </li>
            </ul>
          </div>

          <div className="bg-card rounded-2xl shadow-card border border-border p-5">
            <h4 className="font-semibold text-foreground mb-3">Storage Used</h4>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-2">
              <div className="absolute left-0 top-0 h-full w-1/3 gradient-primary rounded-full" />
            </div>
            <p className="text-sm text-muted-foreground">2.8 GB of 10 GB used</p>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3"
        >
          <div className="bg-card rounded-2xl shadow-card border border-border p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search records..." className="pl-10" />
              </div>
              <Button className="gradient-primary text-primary-foreground">
                <Upload className="w-4 h-4 mr-2" />
                Upload Record
              </Button>
            </div>

            {/* Records Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Size</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-medium text-foreground">{record.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-muted-foreground">{record.type}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {record.date}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-muted-foreground">{record.size}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
