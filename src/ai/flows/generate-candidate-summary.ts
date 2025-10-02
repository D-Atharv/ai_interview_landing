'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a candidate summary based on their interview answers and resume.
 *
 * - generateCandidateSummary - A function that takes candidate data and returns a summary and score.
 * - GenerateCandidateSummaryInput - The input type for the generateCandidateSummary function.
 * - GenerateCandidateSummaryOutput - The return type for the generateCandidatesummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCandidateSummaryInputSchema = z.object({
  resumeText: z.string().describe("The text content of the candidate's resume."),
  interviewAnswers: z.array(z.string()).describe("An array of the candidate's answers to the interview questions."),
  jobTitle: z.string().describe('The job title for which the candidate is being interviewed.'),
});
export type GenerateCandidateSummaryInput = z.infer<typeof GenerateCandidateSummaryInputSchema>;

const GenerateCandidateSummaryOutputSchema = z.object({
  summary: z.string().describe("A brief summary of the candidate's performance, highlighting strengths and weaknesses based on their answers."),
  score: z.number().describe('A final score for the candidate (0-100), primarily based on interview performance.'),
});
export type GenerateCandidateSummaryOutput = z.infer<typeof GenerateCandidateSummaryOutputSchema>;

export async function generateCandidateSummary(input: GenerateCandidateSummaryInput): Promise<GenerateCandidateSummaryOutput> {
  return generateCandidateSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCandidateSummaryPrompt',
  input: {schema: GenerateCandidateSummaryInputSchema},
  output: {schema: GenerateCandidateSummaryOutputSchema},
  prompt: `You are a strict, senior technical hiring manager for a top-tier tech company. Your task is to evaluate a candidate for a {{jobTitle}} role.

  Your evaluation MUST be based PRIMARILY on the quality and depth of their interview answers. The resume provides context about their experience, but it should NOT inflate the score if the answers are poor.

  CRITICAL SCORING INSTRUCTIONS:
  - If the answers are short, nonsensical, irrelevant, or show a clear lack of understanding (e.g., one-word answers like "jsx", "error", "docs"), you MUST assign a very low score (0-20). Do not be lenient.
  - A strong resume CANNOT compensate for weak or non-existent answers. The interview performance is the most critical factor.
  - The summary must justify the score by directly referencing the quality of the answers. If the answers are poor, the summary MUST state this clearly and explain why it leads to a low score.

  Candidate's Resume for Context:
  ---
  {{resumeText}}
  ---

  Candidate's Interview Answers:
  ---
  {{#each interviewAnswers}}
  - {{{this}}}
  {{/each}}
  ---

  Evaluate the candidate and provide a final score and a brutally honest summary.`,
});

const generateCandidateSummaryFlow = ai.defineFlow(
  {
    name: 'generateCandidateSummaryFlow',
    inputSchema: GenerateCandidateSummaryInputSchema,
    outputSchema: GenerateCandidateSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
