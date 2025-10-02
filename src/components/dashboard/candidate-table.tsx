'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CandidateDetailSheet } from '@/components/candidate-detail-sheet';
import type { Candidate } from '@/lib/types';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface CandidateTableProps {
  candidates: Candidate[];
}

export function CandidateTable({ candidates }: CandidateTableProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const getScoreBadgeClass = (score: number | null): string => {
      if (score === null) return 'bg-secondary text-secondary-foreground';
      if (score >= 80) return 'bg-primary text-primary-foreground';
      if (score >= 50) return 'bg-yellow-500 text-black';
      return 'bg-destructive text-destructive-foreground';
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.id} onClick={() => setSelectedCandidate(candidate)} className="cursor-pointer">
                  <TableCell className="font-medium uppercase">{candidate.name}</TableCell>
                  <TableCell className="text-muted-foreground">{candidate.email}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">{candidate.summary}</TableCell>
                  <TableCell className="text-right">
                      <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ml-auto",
                          getScoreBadgeClass(candidate.score)
                      )}>
                          {candidate.score}
                      </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedCandidate && (
        <CandidateDetailSheet
          candidate={selectedCandidate}
          isOpen={!!selectedCandidate}
          onOpenChange={(isOpen) => !isOpen && setSelectedCandidate(null)}
        />
      )}
    </>
  );
}
