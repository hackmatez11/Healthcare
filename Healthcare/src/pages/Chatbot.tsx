import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, Bot, User, Sparkles } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickQuestions = [
  "What are the symptoms of flu?",
  "How to manage high blood pressure?",
  "When should I see a doctor for headaches?",
  "What vitamins should I take daily?",
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI medical assistant. I can help answer general health questions, provide guidance on common symptoms, and help you understand when to seek professional medical care. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Thank you for your question. Based on the symptoms you've described, I recommend consulting with a healthcare professional for a proper diagnosis. In the meantime, make sure to stay hydrated and get plenty of rest. Would you like me to help you book an appointment with a specialist?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <Layout>
      <PageHeader
        icon={MessageSquare}
        title="Medical Q&A Chatbot"
        description="Get instant answers to your health questions from our AI assistant."
      />

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden h-[600px] flex flex-col">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" && "flex-row-reverse"
                    )}
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                        message.role === "assistant" ? "gradient-primary" : "bg-muted"
                      )}
                    >
                      {message.role === "assistant" ? (
                        <Bot className="w-5 h-5 text-primary-foreground" />
                      ) : (
                        <User className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "max-w-[80%] px-4 py-3 rounded-2xl",
                        message.role === "assistant"
                          ? "bg-muted text-foreground"
                          : "gradient-primary text-primary-foreground"
                      )}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className="text-xs opacity-60 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="bg-muted px-4 py-3 rounded-2xl">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-card/50">
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your health question..."
                  className="flex-1 h-12 rounded-xl"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="h-12 px-6 rounded-xl gradient-primary hover:opacity-90"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl shadow-card border border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-display font-semibold text-foreground">Quick Questions</h3>
            </div>
            <div className="space-y-2">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => handleQuickQuestion(question)}
                  className="w-full text-left px-4 py-3 text-sm text-muted-foreground bg-muted hover:bg-muted/80 rounded-xl transition-colors hover:text-foreground"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-5 border border-primary/20">
            <h4 className="font-display font-semibold text-foreground mb-2">⚠️ Important Notice</h4>
            <p className="text-sm text-muted-foreground">
              This AI assistant provides general health information only. Always consult a qualified healthcare professional for medical advice.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
