'use server';

import { generateInterviewQuestions, GenerateInterviewQuestionsInput } from '@/ai/flows/generate-interview-questions';
import { generateCandidateSummary, GenerateCandidateSummaryInput } from '@/ai/flows/generate-candidate-summary';
import { extractResumeInfo as extractResumeInfoFlow, ExtractResumeInfoInput, ExtractResumeInfoOutput } from '@/ai/flows/extract-resume-info';
import { generateDashboardAnalytics as generateDashboardAnalyticsFlow, GenerateDashboardAnalyticsInput, GenerateDashboardAnalyticsOutput } from '@/ai/flows/generate-dashboard-analytics';
import { INTERVIEW_STRUCTURE } from '@/lib/constants';
import type { InterviewQuestion } from '@/lib/types';


export async function getInterviewQuestion(input: Omit<GenerateInterviewQuestionsInput, 'numQuestions'>) {
    try {
        const fullInput = { ...input, numQuestions: 1 };
        const result = await generateInterviewQuestions(fullInput);
        return result;
    } catch (error) {
        console.error("Error generating interview questions:", error);
        return { questions: [] };
    }
}

export async function generateAllInterviewQuestions(resumeText: string): Promise<InterviewQuestion[]> {
    try {
        const questionPromises = INTERVIEW_STRUCTURE.map(config => 
            generateInterviewQuestions({
                resumeText: resumeText,
                difficulty: config.difficulty,
                numQuestions: 1,
            })
        );
        
        const results = await Promise.allSettled(questionPromises);
        
        const allQuestions: InterviewQuestion[] = results.map((result, index) => {
            const config = INTERVIEW_STRUCTURE[index];
            const topic = 'general'; // Topic is now dynamic
            if (result.status === 'fulfilled' && result.value.questions.length > 0) {
                 return {
                    question: result.value.questions[0],
                    difficulty: config.difficulty,
                };
            }
            
            console.error(`Failed to generate question for difficulty: ${config.difficulty}`, result.status === 'rejected' ? result.reason : 'No question returned');
            return {
                question: `Error generating question. Please try again.`,
                difficulty: config.difficulty,
            };
        });

        return allQuestions;

    } catch (error) {
        console.error("Error generating all interview questions:", error);
        // This will now only catch errors that are not related to the promises themselves
        return INTERVIEW_STRUCTURE.map(config => ({
            question: `Error generating question. Please try again.`,
            difficulty: config.difficulty,
        }));
    }
}


export async function getCandidateSummary(input: Omit<GenerateCandidateSummaryInput, 'jobTitle'>) {
    try {
        const result = await generateCandidateSummary({
            ...input,
            jobTitle: "role based on resume"
        });
        return result;
    } catch(error) {
        console.error("Error generating candidate summary:", error);
        return null;
    }
}

export async function extractResumeInfo(input: ExtractResumeInfoInput): Promise<ExtractResumeInfoOutput | null> {
    try {
        const result = await extractResumeInfoFlow(input);
        if (!result) {
            return null;
        }
        return result;
    } catch (error) {
        console.error("Error extracting resume info:", error);
        return null;
    }
}

export async function getDashboardAnalytics(input: GenerateDashboardAnalyticsInput): Promise<GenerateDashboardAnalyticsOutput | null> {
    try {
        const result = await generateDashboardAnalyticsFlow(input);
        return result;
    } catch (error) {
        console.error("Error generating dashboard analytics:", error);
        return null;
    }
}
