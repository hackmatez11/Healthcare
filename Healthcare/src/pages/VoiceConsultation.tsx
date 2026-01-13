import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, FileText, Download, Play, Pause, Clock, User } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function VoiceConsultation() {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);

  const toggleRecording = () => {
    if (isRecording) {
      setHasRecording(true);
    }
    setIsRecording(!isRecording);
  };

  return (
    <Layout>
      <PageHeader
        icon={Mic}
        title="Voice Consultation"
        description="Record doctor-patient conversations for automatic transcription and prescription generation."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recording Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-card border border-border p-6"
        >
          <h3 className="font-display font-semibold text-lg text-foreground mb-6">
            Voice Recording
          </h3>

          <div className="flex flex-col items-center py-8">
            <motion.button
              onClick={toggleRecording}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "w-32 h-32 rounded-full flex items-center justify-center transition-all",
                isRecording
                  ? "bg-destructive shadow-lg shadow-destructive/30"
                  : "gradient-primary shadow-lg shadow-primary/30"
              )}
            >
              {isRecording ? (
                <MicOff className="w-12 h-12 text-destructive-foreground" />
              ) : (
                <Mic className="w-12 h-12 text-primary-foreground" />
              )}
            </motion.button>

            {isRecording && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 flex items-center gap-2"
              >
                <span className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                <span className="text-destructive font-medium">Recording in progress...</span>
              </motion.div>
            )}

            {!isRecording && !hasRecording && (
              <p className="mt-6 text-muted-foreground text-center">
                Click the microphone to start recording the consultation
              </p>
            )}

            {hasRecording && !isRecording && (
              <div className="mt-6 w-full">
                <div className="flex items-center justify-between p-4 bg-muted rounded-xl mb-4">
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Play className="w-4 h-4" />
                    </Button>
                    <div>
                      <p className="font-medium text-foreground">Consultation Recording</p>
                      <p className="text-sm text-muted-foreground">Duration: 15:32</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 gradient-primary text-primary-foreground">
                    Generate Transcript
                  </Button>
                  <Button variant="outline" className="flex-1">
                    New Recording
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Audio Waveform Placeholder */}
          {isRecording && (
            <div className="flex items-center justify-center gap-1 h-16">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: [8, Math.random() * 40 + 8, 8],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.05,
                  }}
                  className="w-1 bg-primary rounded-full"
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Transcription & Prescription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Transcript */}
          <div className="bg-card rounded-2xl shadow-card border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Transcript
              </h3>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <ScrollArea className="h-48">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground">Dr. Chen</span>
                      <span className="text-xs text-muted-foreground">00:15</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Good morning! How are you feeling today? I see you've been experiencing some headaches.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground">Patient</span>
                      <span className="text-xs text-muted-foreground">00:28</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Yes, doctor. The headaches have been quite severe, especially in the mornings. I've also been feeling a bit dizzy.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground">Dr. Chen</span>
                      <span className="text-xs text-muted-foreground">00:45</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      I understand. Let me check your blood pressure. Have you been taking your regular medications?
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Generated Prescription */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/20 p-6">
            <h3 className="font-display font-semibold text-lg text-foreground mb-4">
              Generated Prescription
            </h3>

            <div className="space-y-4">
              <div className="bg-card rounded-xl p-4">
                <p className="font-medium text-foreground mb-2">Diagnosis</p>
                <p className="text-sm text-muted-foreground">
                  Tension-type headache with associated vertigo
                </p>
              </div>

              <div className="bg-card rounded-xl p-4">
                <p className="font-medium text-foreground mb-2">Medications</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Paracetamol 500mg - 1 tablet twice daily</li>
                  <li>• Betahistine 8mg - 1 tablet three times daily</li>
                </ul>
              </div>

              <div className="bg-card rounded-xl p-4">
                <p className="font-medium text-foreground mb-2">Instructions</p>
                <p className="text-sm text-muted-foreground">
                  Take medications after meals. Avoid screen time before bed. Follow up in 1 week.
                </p>
              </div>

              <Button className="w-full gradient-primary text-primary-foreground">
                <Download className="w-4 h-4 mr-2" />
                Download Prescription
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
