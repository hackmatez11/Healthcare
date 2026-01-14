import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp, TrendingDown, Minus, Calendar, Activity,
    Zap, Heart, Award, Target, AlertCircle, CheckCircle,
    Brain, Sparkles
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { cn } from "@/lib/utils";
import type { AnalyticsData, MentalHealthInsight } from "@/services/analyticsService";

interface AnalyticsDashboardProps {
    data: AnalyticsData;
    onAcknowledgeInsight?: (insightId: string) => void;
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export function MentalHealthAnalytics({ data, onAcknowledgeInsight }: AnalyticsDashboardProps) {
    const getTrendIcon = () => {
        switch (data.moodTrend) {
            case 'improving':
                return <TrendingUp className="w-5 h-5 text-success" />;
            case 'declining':
                return <TrendingDown className="w-5 h-5 text-destructive" />;
            default:
                return <Minus className="w-5 h-5 text-warning" />;
        }
    };

    const getTrendColor = () => {
        switch (data.moodTrend) {
            case 'improving':
                return 'text-success';
            case 'declining':
                return 'text-destructive';
            default:
                return 'text-warning';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-success';
        if (score >= 40) return 'text-warning';
        return 'text-destructive';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        if (score >= 20) return 'Needs Attention';
        return 'Critical';
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high':
                return 'destructive';
            case 'medium':
                return 'warning';
            default:
                return 'default';
        }
    };

    return (
        <div className="space-y-6">
            {/* Mental Health Score */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-purple/10 to-primary/10 rounded-2xl p-6 border border-purple/20"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Brain className="w-6 h-6 text-purple" />
                        <h3 className="font-display font-semibold text-lg text-foreground">
                            Mental Health Score
                        </h3>
                    </div>
                    <Badge variant="outline" className="text-sm">
                        Last 30 Days
                    </Badge>
                </div>

                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className={cn("text-5xl font-bold", getScoreColor(data.mentalHealthScore))}>
                                {data.mentalHealthScore}
                            </span>
                            <span className="text-2xl text-muted-foreground">/100</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                            {getScoreLabel(data.mentalHealthScore)}
                        </p>
                        <Progress value={data.mentalHealthScore} className="h-3" />
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        {getTrendIcon()}
                        <span className={cn("text-sm font-medium capitalize", getTrendColor())}>
                            {data.moodTrend}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Key Metrics */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{data.streakDays}</p>
                                <p className="text-xs text-muted-foreground">Day Streak</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <Card className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-success" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{data.weeklyAverage.toFixed(1)}</p>
                                <p className="text-xs text-muted-foreground">Weekly Avg</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                                <Heart className="w-5 h-5 text-warning" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{data.monthlyAverage.toFixed(1)}</p>
                                <p className="text-xs text-muted-foreground">Monthly Avg</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                >
                    <Card className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-purple/10 flex items-center justify-center">
                                <Target className="w-5 h-5 text-purple" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{data.totalEntries}</p>
                                <p className="text-xs text-muted-foreground">Total Entries</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Insights */}
            {data.insights && data.insights.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                >
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple" />
                        <h3 className="font-display font-semibold text-lg text-foreground">
                            AI-Powered Insights
                        </h3>
                    </div>

                    {data.insights.slice(0, 3).map((insight, index) => (
                        <Card key={insight.id || index} className="p-4">
                            <div className="flex items-start gap-3">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                                    insight.severity === 'high' ? 'bg-destructive/10' :
                                        insight.severity === 'medium' ? 'bg-warning/10' : 'bg-primary/10'
                                )}>
                                    {insight.severity === 'high' ? (
                                        <AlertCircle className="w-5 h-5 text-destructive" />
                                    ) : (
                                        <Sparkles className="w-5 h-5 text-primary" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <p className="text-sm font-medium text-foreground">{insight.insight_text}</p>
                                        <Badge variant={getSeverityColor(insight.severity) as any} className="text-xs">
                                            {insight.severity}
                                        </Badge>
                                    </div>

                                    {insight.recommendations && insight.recommendations.length > 0 && (
                                        <div className="space-y-1 mb-3">
                                            <p className="text-xs font-medium text-muted-foreground">Recommendations:</p>
                                            <ul className="space-y-1">
                                                {insight.recommendations.slice(0, 2).map((rec, i) => (
                                                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                                        <CheckCircle className="w-3 h-3 text-success mt-0.5 flex-shrink-0" />
                                                        <span>{rec}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {!insight.acknowledged && onAcknowledgeInsight && insight.id && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onAcknowledgeInsight(insight.id!)}
                                            className="text-xs"
                                        >
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Got it
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </motion.div>
            )}

            {/* Most Effective Activity */}
            {data.mostEffectiveActivity && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                >
                    <Card className="p-5 bg-gradient-to-br from-success/5 to-primary/5 border-success/20">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                                <Award className="w-6 h-6 text-success" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Most Effective Activity</p>
                                <p className="text-lg font-bold text-foreground capitalize">
                                    {data.mostEffectiveActivity.replace('_', ' ')}
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
