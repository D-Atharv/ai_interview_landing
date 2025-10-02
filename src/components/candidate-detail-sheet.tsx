'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import type { Candidate } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { Bot, User } from 'lucide-react';
import { Badge } from './ui/badge';

interface CandidateDetailSheetProps {
  candidate: Candidate;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CandidateDetailSheet({ candidate, isOpen, onOpenChange }: CandidateDetailSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl">
        <ScrollArea className="h-full pr-6">
            <SheetHeader className="text-left">
            <SheetTitle className="text-2xl">{candidate.name}</SheetTitle>
            <SheetDescription>
                {candidate.email} &bull; {candidate.phone}
            </SheetDescription>
            <div className="flex items-baseline gap-2 pt-2">
                <p className="text-3xl font-bold">{candidate.score}</p>
                <p className="text-muted-foreground">/ 100</p>
            </div>
            </SheetHeader>
            <Separator className="my-6" />

            <div className="space-y-6">
            <div>
                <h3 className="font-semibold text-lg mb-2">AI Summary</h3>
                <p className="text-muted-foreground">{candidate.summary}</p>
            </div>
            
            <div>
                <h3 className="font-semibold text-lg mb-4">Interview Transcript</h3>
                <div className="space-y-6">
                {candidate.questions.map((q, index) => (
                    <div key={index} className="space-y-4">
                    <div className="flex gap-4 items-start">
                        <div className="bg-secondary rounded-full p-2"><Bot className="h-5 w-5 text-secondary-foreground"/></div>
                        <div className="bg-muted rounded-lg p-3 flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <p className="font-semibold">Question {index + 1}</p>
                                <Badge variant="outline">{q.difficulty}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{q.question}</p>
                        </div>
                    </div>
                     <div className="flex gap-4 items-start">
                        <div className="bg-primary rounded-full p-2"><User className="h-5 w-5 text-primary-foreground"/></div>
                        <div className="rounded-lg p-3 flex-1 border">
                            <p className="font-semibold">Candidate's Answer</p>
                            <p className="text-sm text-muted-foreground">{q.answer || "No answer provided."}</p>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-lg mb-2">Resume</h3>
                <div className="border rounded-md p-4 max-h-60 overflow-y-auto bg-muted/50">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
                        {candidate.resumeText}
                    </p>
                </div>
            </div>
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
