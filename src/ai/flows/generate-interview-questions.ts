'use server';

/**
 * @fileOverview Dynamically generates interview questions based on a candidate's resume.
 *
 * - generateInterviewQuestions - A function that generates interview questions.
 * - GenerateInterviewQuestionsInput - The input type for the generateInterviewQuestions function.
 * - GenerateInterviewQuestionsOutput - The return type for the generateInterviewQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInterviewQuestionsInputSchema = z.object({
  resumeText: z.string().describe("The full text content of the candidate's resume."),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).describe('The difficulty level of the interview questions.'),
  numQuestions: z.number().describe('The number of questions to generate for the specified difficulty level.'),
});
export type GenerateInterviewQuestionsInput = z.infer<typeof GenerateInterviewQuestionsInputSchema>;

const GenerateInterviewQuestionsOutputSchema = z.object({
  questions: z.array(z.string()).describe('An array of generated interview questions.'),
});
export type GenerateInterviewQuestionsOutput = z.infer<typeof GenerateInterviewQuestionsOutputSchema>;

export async function generateInterviewQuestions(input: GenerateInterviewQuestionsInput): Promise<GenerateInterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInterviewQuestionsPrompt',
  input: {schema: GenerateInterviewQuestionsInputSchema},
  output: {schema: GenerateInterviewQuestionsOutputSchema},
  prompt: `You are an expert technical recruiter and interviewer. Your task is to generate one interview question based on the provided resume.

  The question should be of {{difficulty}} difficulty.

  Analyze the resume to identify the candidate's skills, technologies, and experiences. The question you generate MUST be directly related to the content of the resume.

  - For 'Easy' questions, ask about a fundamental concept of a technology mentioned.
  - For 'Medium' questions, ask about a specific project or experience listed.
  - For 'Hard' questions, pose a challenging scenario or a system design question related to their most advanced skills.

  Generate exactly {{numQuestions}} question.

  Resume Content:
  ---
  {{resumeText}}
  ---
  `,
});

const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: GenerateInterviewQuestionsInputSchema,
    outputSchema: GenerateInterviewQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    