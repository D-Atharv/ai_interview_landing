'use server';

/**
 * @fileOverview This file defines a Genkit flow for extracting information from a resume file.
 *
 * - extractResumeInfo - A function that takes a resume file data URI and returns structured information.
 * - ExtractResumeInfoInput - The input type for the extractResumeInfo function.
 * - ExtractResumeInfoOutput - The return type for the extractResumeInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractResumeInfoInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "A resume file (PDF, DOC, DOCX), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractResumeInfoInput = z.infer<typeof ExtractResumeInfoInputSchema>;

const ExtractResumeInfoOutputSchema = z.object({
  name: z.string().describe("The full name of the candidate. Extract 'Not specified' if not found."),
  email: z.string().describe("The email address of the candidate. Extract 'Not specified' if not found."),
  phone: z.string().describe("The phone number of the candidate. Extract 'Not specified' if not found."),
  resumeText: z.string().describe('The full text content extracted from the resume, preserving all original formatting (line breaks, spacing, etc.). If the file is not a valid resume, extract an empty string.'),
});
export type ExtractResumeInfoOutput = z.infer<typeof ExtractResumeInfoOutputSchema>;

export async function extractResumeInfo(input: ExtractResumeInfoInput): Promise<ExtractResumeInfoOutput> {
  return extractResumeInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractResumeInfoPrompt',
  input: {schema: ExtractResumeInfoInputSchema},
  output: {schema: ExtractResumeInfoOutputSchema},
  prompt: `You are an expert resume parser. Your task is to extract the candidate's full name, email address, phone number, and the entire text content from the provided resume file.

You MUST preserve all original formatting from the resume text, including all line breaks, spacing, and indentation.

If a specific field (like name, email, or phone) is not present in the resume, you must return 'Not specified' for that field.

If the provided file does not appear to be a resume or is unreadable, you should still return the structured output but with 'Not specified' for name, email, and phone, and an empty string for the resumeText. Do not throw an error.

Resume File:
{{media url=fileDataUri}}`,
});

const extractResumeInfoFlow = ai.defineFlow(
  {
    name: 'extractResumeInfoFlow',
    inputSchema: ExtractResumeInfoInputSchema,
    outputSchema: ExtractResumeInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
