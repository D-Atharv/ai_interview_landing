'use client';
import { useEffect, useState } from 'react';
import { useAssessAI } from '@/hooks/use-assess-ai-store';
import { getDashboardAnalytics } from '@/app/actions';
import type { GenerateDashboardAnalyticsOutput } from '@/ai/flows/generate-dashboard-analytics';
import { StatCard } from '@/components/dashboard/stat-card';
import { ScoreDistributionChart } from '@/components/dashboard/score-distribution-chart';
import { KeywordCloud } from '@/components/dashboard/keyword-cloud';
import { CandidateTable } from '@/components/dashboard/candidate-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Star, BarChart, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function DashboardLoadingSkeleton() {
    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Skeleton className="h-80" />
                 <div className="space-y-8">
                    <Skeleton className="h-36" />
                    <Skeleton className="h-36" />
                </div>
            </div>
            <Skeleton className="h-96" />
        </div>
    );
}

export default function DashboardPage() {
  const { candidates } = useAssessAI();
  const [analytics, setAnalytics] = useState<GenerateDashboardAnalyticsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      const completedCandidates = candidates.filter(c => c.status === 'completed' && c.name);
      
      if (completedCandidates.length > 0) {
        const analyticsInput = {
          candidates: completedCandidates.map(c => ({
            id: c.id,
            name: c.name,
            score: c.score,
            summary: c.summary,
          })),
        };
        const result = await getDashboardAnalytics(analyticsInput);
        setAnalytics(result);
      } else {
        setAnalytics(null);
      }
      setIsLoading(false);
    };

    fetchAnalytics();
  }, [candidates]);
  
  const completedCandidates = candidates.filter(c => c.status === 'completed' && c.name);

  if (isLoading) {
    return <DashboardLoadingSkeleton />;
  }
  
  if (completedCandidates.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle>No Data Available</CardTitle>
                <CardDescription>There are no completed interviews yet. Analytics will be shown here once candidates complete their interviews.</CardDescription>
            </CardHeader>
        </Card>
      </div>
    );
  }

  if (!analytics) {
      return (
        <div className="flex items-center justify-center h-full">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
                    <CardTitle className="mt-4">Error</CardTitle>
                    <CardDescription>Could not generate dashboard analytics. Please try again later.</CardDescription>
                </CardHeader>
            </Card>
        </div>
      );
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold">Interviewer Dashboard</h1>
            <p className="text-muted-foreground">An AI-powered overview of your candidate pool.</p>
        </div>
         <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2" />
            Back
          </Link>
        </Button>
      </header>
      
      <Card>
        <CardHeader>
            <CardTitle>AI Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">{analytics.overallSummary}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Candidates"
          value={completedCandidates.length}
          icon={<Users />}
        />
        <StatCard
          title="Average Score"
          value={`${analytics.averageScore.toFixed(1)} / 100`}
          icon={<Star />}
        />
        <StatCard
          title="Score Spread"
          value={`${Math.min(...completedCandidates.map(c=>c.score!))}-${Math.max(...completedCandidates.map(c=>c.score!))}`}
          icon={<BarChart />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <ScoreDistributionChart data={analytics.scoreDistribution} />
        </div>
        <div className="lg:col-span-2 space-y-8">
          <KeywordCloud title="Common Strengths" keywords={analytics.commonStrengths} variant="positive" />
          <KeywordCloud title="Common Weaknesses" keywords={analytics.commonWeaknesses} variant="negative" />
        </div>
      </div>
      
      <CandidateTable candidates={completedCandidates} />

    </div>
  );
}
