'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating dashboard analytics.
 *
 * - generateDashboardAnalytics - A function that takes candidate data and returns aggregated analytics.
 * - GenerateDashboardAnalyticsInput - The input type for the generateDashboardAnalytics function.
 * - GenerateDashboardAnalyticsOutput - The return type for the generateDashboardAnalytics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CandidateAnalyticsSchema = z.object({
  id: z.string(),
  name: z.string(),
  score: z.number().nullable(),
  summary: z.string().nullable(),
});

const GenerateDashboardAnalyticsInputSchema = z.object({
  candidates: z.array(CandidateAnalyticsSchema),
});
export type GenerateDashboardAnalyticsInput = z.infer<typeof GenerateDashboardAnalyticsInputSchema>;

const GenerateDashboardAnalyticsOutputSchema = z.object({
  overallSummary: z.string().describe("A high-level summary of the candidate pool's overall performance, key trends, and distribution of skills."),
  averageScore: z.number().describe('The average score across all candidates.'),
  scoreDistribution: z.array(z.object({
    range: z.string().describe("The score range (e.g., '0-20', '21-40')."),
    count: z.number().describe('The number of candidates in this range.'),
  })).describe('An array of objects representing the distribution of scores.'),
  commonStrengths: z.array(z.string()).describe('A list of the most common strengths or positive keywords found across all candidate summaries.'),
  commonWeaknesses: z.array(z.string()).describe('A list of the most common weaknesses or areas for improvement found across all candidate summaries.'),
});
export type GenerateDashboardAnalyticsOutput = z.infer<typeof GenerateDashboardAnalyticsOutputSchema>;


export async function generateDashboardAnalytics(input: GenerateDashboardAnalyticsInput): Promise<GenerateDashboardAnalyticsOutput> {
  return generateDashboardAnalyticsFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateDashboardAnalyticsPrompt',
  input: { schema: GenerateDashboardAnalyticsInputSchema },
  output: { schema: GenerateDashboardAnalyticsOutputSchema },
  prompt: `You are a senior hiring analyst tasked with providing a high-level overview of a pool of candidates based on their interview scores and AI-generated summaries.

Analyze the following candidate data:
{{#each candidates}}
- Candidate: {{name}}
  Score: {{score}}
  Summary: {{summary}}
{{/each}}

Based on this data, provide the following analytics:
1.  **Overall Summary**: A concise, high-level summary of the candidate pool. What are the general trends? Is the pool strong or weak?
2.  **Average Score**: Calculate the average score for all candidates.
3.  **Score Distribution**: Group candidates into the following score ranges: 0-20, 21-40, 41-60, 61-80, 81-100. Provide the count for each range.
4.  **Common Strengths**: Identify and list up to 5 common positive keywords or skills mentioned in the summaries (e.g., "React", "communication", "problem-solving").
5.  **Common Weaknesses**: Identify and list up to 5 common areas for improvement or negative keywords (e.g., "nervous", "lacks depth", "unfamiliar with X").

Return the data in the specified structured format.
`,
});


const generateDashboardAnalyticsFlow = ai.defineFlow(
  {
    name: 'generateDashboardAnalyticsFlow',
    inputSchema: GenerateDashboardAnalyticsInputSchema,
    outputSchema: GenerateDashboardAnalyticsOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
