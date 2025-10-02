'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IntervieweeView } from '@/components/interviewee-view';
import { InterviewerView } from '@/components/interviewer-view';
import { useAssessAI } from '@/hooks/use-assess-ai-store';
import { WelcomeBackModal } from '@/components/welcome-back-modal';
import { Icons } from './icons';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';

interface MainLayoutContentProps {
  selectedRole: 'interviewee' | 'interviewer';
  onSwitchRole: () => void;
}

function MainLayoutContent({ selectedRole, onSwitchRole }: MainLayoutContentProps) {
  const { isRestored, activeCandidate, resetActiveInterview } = useAssessAI();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState(selectedRole);
  const hasShownModal = useRef(false);

  useEffect(() => {
    if (isRestored && activeCandidate?.status === 'in-progress' && !hasShownModal.current) {
      setShowWelcomeModal(true);
      hasShownModal.current = true;
    }
  }, [isRestored, activeCandidate]);
  
  useEffect(() => {
    if (selectedRole === 'interviewer') {
        router.push('/dashboard');
    }
    setSelectedTab(selectedRole);
  }, [selectedRole, router]);

  const handleStartOver = () => {
    resetActiveInterview();
    setShowWelcomeModal(false);
  };

  if (!isRestored) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Icons.logo className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }
  
  // This layout is now primarily for the interviewee flow.
  // The interviewer flow is handled by the /dashboard route.
  if (selectedRole !== 'interviewee') {
      // You can return a loader or null here, as it should redirect shortly.
      return (
        <div className="flex h-screen items-center justify-center">
          <Icons.logo className="h-12 w-12 animate-pulse text-primary" />
        </div>
      );
  }


  return (
    <div className="container mx-auto p-4 md:p-8">
       <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Icons.logo className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">AssessAI</h1>
            <p className="text-muted-foreground">AI-Powered Interview Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" onClick={onSwitchRole}>
            <LogOut className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </header>
        
      <IntervieweeView />
      
      <WelcomeBackModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        onContinue={() => setShowWelcomeModal(false)}
        onStartOver={handleStartOver}
      />
    </div>
  );
}


export function MainLayout({ selectedRole, onSwitchRole }: { selectedRole: 'interviewee' | 'interviewer', onSwitchRole: () => void }) {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Icons.logo className="h-12 w-12 animate-pulse text-primary" /></div>}>
      <MainLayoutContent selectedRole={selectedRole} onSwitchRole={onSwitchRole} />
    </Suspense>
  )
}
