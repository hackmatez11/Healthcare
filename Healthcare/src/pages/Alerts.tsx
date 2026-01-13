import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Pill, Calendar, TestTube, AlertTriangle, Check, Clock, Settings, Plus } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const alerts = [
  {
    id: 1,
    type: "medication",
    title: "Take Metformin",
    description: "500mg after breakfast",
    time: "8:00 AM",
    status: "pending",
    icon: Pill,
  },
  {
    id: 2,
    type: "appointment",
    title: "Doctor's Appointment",
    description: "Dr. Chen - General Checkup",
    time: "Tomorrow, 10:00 AM",
    status: "upcoming",
    icon: Calendar,
  },
  {
    id: 3,
    type: "test",
    title: "Blood Test Due",
    description: "Fasting glucose test required",
    time: "Jan 15, 2026",
    status: "upcoming",
    icon: TestTube,
  },
  {
    id: 4,
    type: "emergency",
    title: "High Blood Pressure Alert",
    description: "Reading: 150/95 mmHg",
    time: "Just now",
    status: "urgent",
    icon: AlertTriangle,
  },
];

const medicationSchedule = [
  { name: "Metformin", dose: "500mg", times: ["8:00 AM", "8:00 PM"], taken: [true, false] },
  { name: "Lisinopril", dose: "10mg", times: ["8:00 AM"], taken: [true] },
  { name: "Vitamin D", dose: "1000 IU", times: ["12:00 PM"], taken: [false] },
];

export default function Alerts() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <Layout>
      <PageHeader
        icon={Bell}
        title="Alerts & Notifications"
        description="Stay on top of your medications, appointments, and health reminders."
        gradient="gradient-alert"
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Alerts */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl shadow-card border border-border p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-lg text-foreground">Active Alerts</h3>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Manage
              </Button>
            </div>

            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border transition-colors",
                    alert.status === "urgent"
                      ? "bg-destructive/5 border-destructive/20"
                      : alert.status === "pending"
                      ? "bg-warning/5 border-warning/20"
                      : "bg-muted border-border"
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      alert.status === "urgent"
                        ? "bg-destructive/10"
                        : alert.status === "pending"
                        ? "bg-warning/10"
                        : "bg-primary/10"
                    )}
                  >
                    <alert.icon
                      className={cn(
                        "w-6 h-6",
                        alert.status === "urgent"
                          ? "text-destructive"
                          : alert.status === "pending"
                          ? "text-warning"
                          : "text-primary"
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{alert.title}</h4>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{alert.time}</p>
                    {alert.status === "pending" && (
                      <Button size="sm" className="mt-2 gradient-primary text-primary-foreground">
                        <Check className="w-4 h-4 mr-1" />
                        Mark Done
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Medication Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl shadow-card border border-border p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
                <Pill className="w-5 h-5 text-primary" />
                Today's Medications
              </h3>
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            <div className="space-y-4">
              {medicationSchedule.map((med) => (
                <div key={med.name} className="p-4 bg-muted rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-foreground">{med.name}</h4>
                      <p className="text-sm text-muted-foreground">{med.dose}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {med.times.map((time, idx) => (
                      <div
                        key={time}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                          med.taken[idx]
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        )}
                      >
                        <Clock className="w-4 h-4" />
                        {time}
                        {med.taken[idx] && <Check className="w-4 h-4" />}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-card rounded-2xl shadow-card border border-border p-5">
            <h3 className="font-display font-semibold text-foreground mb-4">Notification Settings</h3>
            <div className="space-y-4">
              {[
                { label: "Push Notifications", enabled: true },
                { label: "SMS Reminders", enabled: true },
                { label: "Email Alerts", enabled: false },
                { label: "Emergency Alerts", enabled: true },
              ].map((setting) => (
                <div key={setting.label} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{setting.label}</span>
                  <Switch defaultChecked={setting.enabled} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-card border border-border p-5">
            <h3 className="font-display font-semibold text-foreground mb-4">Reminder Times</h3>
            <div className="space-y-3">
              {[
                { label: "Morning", time: "8:00 AM" },
                { label: "Afternoon", time: "2:00 PM" },
                { label: "Evening", time: "8:00 PM" },
              ].map((reminder) => (
                <div
                  key={reminder.label}
                  className="flex items-center justify-between p-3 bg-muted rounded-xl"
                >
                  <span className="text-sm font-medium text-foreground">{reminder.label}</span>
                  <span className="text-sm text-muted-foreground">{reminder.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-coral/10 to-warning/10 rounded-2xl p-5 border border-coral/20">
            <h4 className="font-semibold text-foreground mb-2">Emergency Contacts</h4>
            <p className="text-sm text-muted-foreground mb-4">
              These contacts will be notified in case of health emergencies.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Emergency Contact
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
