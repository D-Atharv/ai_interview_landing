
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Candidate, InterviewQuestion } from '@/lib/types';

interface AssessAIState {
  candidates: Candidate[];
  activeCandidateId: string | null;
  activeCandidate: Candidate | null;
  updateActiveCandidate: (updatedData: Partial<Candidate>) => void;
  setAllQuestionsForActiveCandidate: (questions: InterviewQuestion[]) => void;
  addAnswerToActiveCandidate: (answer: string) => void;
  resumeInterview: () => void;
  resetActiveInterview: () => void;
  isRestored: boolean;
}

const AssessAIContext = createContext<AssessAIState | undefined>(undefined);

const STORAGE_KEY = 'assess-ai-state';

// Helper to create a new, blank candidate
const createNewCandidate = (): Candidate => ({
  id: `candidate-${Date.now()}`,
  name: '',
  email: '',
  phone: '',
  resumeText: '',
  fileDataUri: '',
  status: 'not-started',
  questions: [],
  currentQuestionIndex: 0,
  score: null,
  summary: null,
  createdAt: Date.now(),
});


export function AssessAIProvider({ children }: { children: ReactNode }) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeCandidateId, setActiveCandidateId] = useState<string | null>(null);
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    let restoredCandidates: Candidate[] = [];
    let restoredActiveId: string | null = null;
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const { candidates: savedCandidates, activeCandidateId: savedActiveId } = JSON.parse(savedState);
        if (Array.isArray(savedCandidates)) {
          restoredCandidates = savedCandidates;
        }
        
        const activeCandidate = restoredCandidates.find((c: Candidate) => c.id === savedActiveId);
        if (activeCandidate && activeCandidate.status !== 'completed' && activeCandidate.status !== 'error') {
           restoredActiveId = savedActiveId;
        }
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    } finally {
        if (!restoredActiveId) {
            const newCand = createNewCandidate();
            restoredCandidates.push(newCand);
            restoredActiveId = newCand.id;
        }
        setCandidates(restoredCandidates);
        setActiveCandidateId(restoredActiveId);
        setIsRestored(true);
    }
  }, []);

  useEffect(() => {
    if (isRestored) {
        try {
            const stateToSave = JSON.stringify({ candidates, activeCandidateId });
            localStorage.setItem(STORAGE_KEY, stateToSave);
        } catch (error) {
            console.error("Failed to save state to localStorage", error);
        }
    }
  }, [candidates, activeCandidateId, isRestored]);


  const updateCandidate = useCallback((id: string, updatedData: Partial<Candidate>) => {
    setCandidates(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updatedData } : c))
    );
  }, []);

  const updateActiveCandidate = useCallback((updatedData: Partial<Candidate>) => {
    if (activeCandidateId) {
      updateCandidate(activeCandidateId, updatedData);
    }
  }, [activeCandidateId, updateCandidate]);
  
  const resetActiveInterview = useCallback(() => {
    const newCandidate = createNewCandidate();
    setCandidates(prev => [...prev.filter(c => c.status === 'completed'), newCandidate]);
    setActiveCandidateId(newCandidate.id);
  }, []);

  const setAllQuestionsForActiveCandidate = useCallback((questions: InterviewQuestion[]) => {
      if(activeCandidateId) {
          setCandidates(prev => prev.map(c => {
              if (c.id === activeCandidateId) {
                  return {...c, questions: questions}
              }
              return c;
          }))
      }
  }, [activeCandidateId]);
  
  const addAnswerToActiveCandidate = useCallback((answer: string) => {
    if (activeCandidateId) {
        setCandidates(prev => prev.map(c => {
            if (c.id === activeCandidateId) {
                const newQuestions = [...c.questions];
                // Ensure the question exists before trying to update it
                if (newQuestions[c.currentQuestionIndex]) {
                  newQuestions[c.currentQuestionIndex] = {
                      ...newQuestions[c.currentQuestionIndex],
                      answer: answer,
                  };
                }
                return {
                    ...c,
                    questions: newQuestions,
                    currentQuestionIndex: c.currentQuestionIndex + 1,
                };
            }
            return c;
        }));
    }
  }, [activeCandidateId]);

  const resumeInterview = useCallback(() => {
    // This function is mostly for the modal logic. The state is already restored.
  }, []);

  const activeCandidate = candidates.find(c => c.id === activeCandidateId) || null;

  const value = {
    candidates,
    activeCandidateId,
    activeCandidate,
    updateActiveCandidate,
    setAllQuestionsForActiveCandidate,
    addAnswerToActiveCandidate,
    resumeInterview,
    resetActiveInterview,
    isRestored
  };

  return (
    <AssessAIContext.Provider value={value}>
      {children}
    </AssessAIContext.Provider>
  );
}

export function useAssessAI() {
  const context = useContext(AssessAIContext);
  if (context === undefined) {
    throw new Error('useAssessAI must be used within an AssessAIProvider');
  }
  return context;
}
