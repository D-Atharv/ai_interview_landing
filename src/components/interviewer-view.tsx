'use client';

import { useState, useMemo } from 'react';
import { useAssessAI } from '@/hooks/use-assess-ai-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CandidateDetailSheet } from './candidate-detail-sheet';
import type { Candidate } from '@/lib/types';
import { Search, ArrowUpDown } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface InterviewerViewProps {
    onSelectCandidate: (candidateId: string) => void;
}

export function InterviewerView({ onSelectCandidate }: InterviewerViewProps) {
  const { candidates } = useAssessAI();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'name'>('date');

  const completedCandidates = useMemo(() => {
    return candidates
      .filter(c => c.status === 'completed' && c.name)
      .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
          if (sortBy === 'score') {
              return (b.score ?? -1) - (a.score ?? -1);
          }
          if (sortBy === 'date') {
            return b.createdAt - a.createdAt;
          }
          if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
          }
          return 0;
      });
  }, [candidates, searchTerm, sortBy]);
  
  const getBadgeVariant = (status: Candidate['status']) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      default:
        return 'outline';
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate Dashboard</CardTitle>
        <CardDescription>Review submitted interviews and AI-generated scores.</CardDescription>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search candidates by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto capitalize">
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        Sort by: {sortBy}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => setSortBy('score')}>Score</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setSortBy('date')}>Date</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setSortBy('name')}>Name</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {completedCandidates.length > 0 ? (
              completedCandidates.map((candidate) => (
                <TableRow key={candidate.id} onClick={() => setSelectedCandidate(candidate)} className="cursor-pointer">
                  <TableCell className="font-medium">{candidate.name}</TableCell>
                  <TableCell className="text-right font-bold text-lg">{candidate.score}</TableCell>
                  <TableCell className="max-w-sm truncate text-muted-foreground">{candidate.summary}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{new Date(candidate.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No completed interviews yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {selectedCandidate && (
        <CandidateDetailSheet
          candidate={selectedCandidate}
          isOpen={!!selectedCandidate}
          onOpenChange={(isOpen) => !isOpen && setSelectedCandidate(null)}
        />
      )}
    </Card>
  );
}
