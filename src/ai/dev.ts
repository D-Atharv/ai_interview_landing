import { config } from 'dotenv';
config();

import '@/ai/flows/generate-candidate-summary.ts';
import '@/ai/flows/generate-interview-questions.ts';
import '@/ai/flows/extract-resume-info.ts';
import '@/ai/flows/generate-dashboard-analytics.ts';

    