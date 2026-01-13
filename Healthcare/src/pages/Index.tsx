import { motion } from "framer-motion";
import {
  MessageSquare,
  ScanLine,
  FileText,
  Calendar,
  Watch,
  Mic,
  Database,
  Bell,
  Brain,
  Gamepad2,
  Activity,
  Search,
  Heart,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { FeatureCard } from "@/components/dashboard/FeatureCard";
import { StatsCard } from "@/components/dashboard/StatsCard";

const features = [
  {
    icon: MessageSquare,
    title: "Medical Q&A Chatbot",
    description: "AI-powered assistant for instant medical guidance and health questions.",
    path: "/chatbot",
    gradient: "gradient-primary",
  },
  {
    icon: ScanLine,
    title: "Skin Disease Detection",
    description: "Upload skin images for AI-powered disease identification.",
    path: "/skin-detection",
    gradient: "bg-secondary",
  },
  {
    icon: FileText,
    title: "Medical Report Scanning",
    description: "Analyze X-rays and MRI scans with AI assistance.",
    path: "/report-scanning",
    gradient: "gradient-primary",
  },
  {
    icon: Calendar,
    title: "Appointment Booking",
    description: "Schedule doctor visits based on real-time availability.",
    path: "/appointments",
    gradient: "bg-coral",
  },
  {
    icon: Watch,
    title: "Health Prediction",
    description: "Analyze wearable data for preventive health insights.",
    path: "/health-prediction",
    gradient: "bg-success",
  },
  {
    icon: Mic,
    title: "Voice Consultation",
    description: "Automatic transcription and prescription generation.",
    path: "/voice-consultation",
    gradient: "gradient-primary",
  },
  {
    icon: Database,
    title: "Health Records",
    description: "Secure, centralized storage for all medical records.",
    path: "/health-records",
    gradient: "bg-purple",
  },
  {
    icon: Bell,
    title: "Alerts & Notifications",
    description: "Reminders for medications, tests, and appointments.",
    path: "/alerts",
    gradient: "gradient-alert",
  },
  {
    icon: Brain,
    title: "Mental Health",
    description: "AI-assisted mental health screening and support.",
    path: "/mental-health",
    gradient: "gradient-mental",
  },
  {
    icon: Gamepad2,
    title: "Games & Exercise",
    description: "Gamified health activities for wellness.",
    path: "/games",
    gradient: "bg-warning",
  },
  {
    icon: Activity,
    title: "Signal Analysis",
    description: "EEG and audio signal analysis for health monitoring.",
    path: "/signal-analysis",
    gradient: "gradient-primary",
  },
  {
    icon: Search,
    title: "Cancer Detection",
    description: "AI-powered early cancer detection from medical images.",
    path: "/cancer-detection",
    gradient: "bg-destructive",
  },
  {
    icon: Heart,
    title: "Lifestyle Analysis",
    description: "Analyze daily habits for healthier living.",
    path: "/lifestyle",
    gradient: "bg-coral",
  },
   {
    icon: Users,
    title: "User Profile",
    description: "Manage your personal and medical information.",
    path: "/complete-profile",
    gradient: "gradient-primary",
   }

];

const stats = [
  { icon: Users, title: "Active Users", value: "12,847", change: "12% this month", positive: true },
  { icon: MessageSquare, title: "Consultations", value: "3,429", change: "8% this week", positive: true },
  { icon: TrendingUp, title: "Health Score", value: "87%", change: "5% improvement", positive: true },
  { icon: Clock, title: "Response Time", value: "< 2s", change: "Faster than ever", positive: true },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 lg:p-12">
          <div className="relative z-10">
            <h1 className="font-display font-bold text-3xl lg:text-4xl text-primary-foreground mb-4">
              Welcome to MedCare AI
            </h1>
            <p className="text-primary-foreground/90 text-lg max-w-2xl mb-6">
              Your comprehensive AI-powered healthcare platform. Get instant medical guidance, 
              track your health, and connect with specialists—all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-6 py-3 bg-card text-foreground font-semibold rounded-xl hover:bg-card/90 transition-colors shadow-lg">
                Start Consultation
              </button>
              <button className="px-6 py-3 bg-primary-foreground/10 text-primary-foreground font-semibold rounded-xl hover:bg-primary-foreground/20 transition-colors border border-primary-foreground/20">
                View Health Report
              </button>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-primary-foreground/10 rounded-full blur-2xl translate-y-1/2" />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, index) => (
          <StatsCard key={stat.title} {...stat} delay={index * 0.1} />
        ))}
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-6"
      >
        <h2 className="font-display font-bold text-2xl text-foreground mb-2">Healthcare Features</h2>
        <p className="text-muted-foreground">Explore our AI-powered healthcare tools</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {features.map((feature, index) => (
          <FeatureCard key={feature.path} {...feature} delay={0.4 + index * 0.05} />
        ))}
      </div>
    </Layout>
  );
};

export default Index;
