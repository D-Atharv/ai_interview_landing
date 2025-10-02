export interface InterviewQuestion {
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  answer?: string;
}

export type InterviewStatus =
  | 'not-started'
  | 'collecting-info'
  | 'in-progress'
  | 'generating-summary'
  | 'completed'
  | 'error';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeText: string;
  fileDataUri?: string;
  status: InterviewStatus;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  score: number | null;
  summary: string | null;
  createdAt: number;
}
