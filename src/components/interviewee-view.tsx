'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useAssessAI } from '@/hooks/use-assess-ai-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { generateAllInterviewQuestions, getCandidateSummary, getCandidateReport } from '@/app/actions';
import { INTERVIEW_STRUCTURE } from '@/lib/constants';
import { Bot, CheckCircle, ChevronRight, FileText, Loader2, Send, UploadCloud, FileDown, ArrowLeft, BrainCircuit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { extractResumeInfo } from '@/app/actions';
import { cn } from '@/lib/utils';
import type { InterviewQuestion } from '@/lib/types';
import { Icons } from './icons';
import { Label } from './ui/label';

const infoSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  resumeText: z.string().min(50, { message: 'Resume text must be at least 50 characters.' }),
  fileDataUri: z.string().optional(),
});

function VerboseLoader({ title, logs }: { title: string, logs: string[] }) {
    const [currentLog, setCurrentLog] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentLog(prev => {
                if (prev < logs.length - 1) {
                    return prev + 1;
                }
                clearInterval(interval);
                return prev;
            });
        }, 1500);
        return () => clearInterval(interval);
    }, [logs.length]);

    return (
        <Card className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center gap-4 p-8 min-h-[400px] bg-card/50">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-semibold text-lg">{title}</p>
            <div className="w-full max-w-md bg-background/50 p-4 rounded-lg mt-4 border">
                <div className="space-y-2">
                    {logs.slice(0, currentLog + 1).map((log, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in duration-500">
                           {index < currentLog ? (
                             <CheckCircle className="h-4 w-4 text-green-500" />
                           ) : (
                             <Loader2 className="h-4 w-4 animate-spin" />
                           )}
                           <span>{log}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}

function LandingPage({onStartClick}: {onStartClick: () => void}) {
    return (
        <div className="rounded-lg bg-card/50 text-card-foreground border shadow-xl w-full backdrop-blur-sm">
            <div className="p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-6">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
                        Welcome to Your AI-Powered Interview
                    </h1>
                    <p className="text-muted-foreground md:text-lg">
                        You're about to start an automated technical interview. The AI will ask you a series of questions based on your resume to assess your skills. Good luck!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                         <Button size="lg" onClick={onStartClick}>
                            Get Started <ChevronRight className="ml-2"/>
                         </Button>
                    </div>
                </div>
                <div className="flex-1 flex justify-center items-center">
                   <Icons.logo className="h-48 w-48 text-primary opacity-80" />
                </div>
            </div>
        </div>
    )
}

function InfoForm() {
  const { updateActiveCandidate, resetActiveInterview } = useAssessAI();
  const [isParsing, setIsParsing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof infoSchema>>({
    resolver: zodResolver(infoSchema),
    defaultValues: { name: '', email: '', phone: '', resumeText: '' },
  });

  const onSubmit = (values: z.infer<typeof infoSchema>) => {
    updateActiveCandidate({ ...values, status: 'in-progress' });
  }
  
  const PARSE_LOGS = [
      "Initializing AI model...",
      "Connecting to secure server...",
      "Analyzing document structure...",
      "Extracting key information...",
      "Populating form fields...",
      "Finalizing...",
  ];


  const handleFile = useCallback(async (file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({ variant: 'destructive', title: 'Error', description: 'File size cannot exceed 5MB.' });
      return;
    }

    setIsParsing(true);
    
    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = (e) => reject(new Error('Could not read the file.'));
            reader.readAsDataURL(file);
        });
    };

    try {
        const dataUri = await readFileAsDataURL(file);
        const result = await extractResumeInfo({ fileDataUri: dataUri });

        if (result && result.resumeText) {
            form.setValue('name', result.name === 'Not specified' ? '' : result.name, { shouldValidate: true });
            form.setValue('email', result.email === 'Not specified' ? '' : result.email, { shouldValidate: true });
            form.setValue('phone', result.phone === 'Not specified' ? '' : result.phone, { shouldValidate: true });
            form.setValue('resumeText', result.resumeText, { shouldValidate: true });
            form.setValue('fileDataUri', dataUri, { shouldValidate: true });
            
            if (result.name === 'Not specified' || result.email === 'Not specified') {
                 toast({ 
                    variant: "default",
                    title: 'Partial Parse', 
                    description: "AI parsed your resume, but some fields might be missing. Please review.",
                    duration: 9000
                });
            }
            else {
                 toast({ title: 'Success', description: 'Resume parsed successfully.' });
            }
        } else {
             toast({ 
                variant: 'destructive', 
                title: 'Error Parsing Resume', 
                description: 'Failed to parse resume. The AI could not extract any information. Please try another file or fill the form manually.',
                duration: 9000
            });
            form.reset({ name: '', email: '', phone: '', resumeText: '', fileDataUri: undefined });
        }
    } catch (error: any) {
        console.error('Error in handleFile:', error);
        toast({ 
            variant: 'destructive', 
            title: 'File Upload Error', 
            description: error.message || 'An unexpected error occurred. Please try again or fill the form manually.' 
        });
    } finally {
        setIsParsing(false);
    }
  }, [form, toast]);
  
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);
  
  const resumeTextValue = form.watch('resumeText');

  if (isParsing) {
      return <VerboseLoader title="Parsing Your Resume..." logs={PARSE_LOGS} />;
  }


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl bg-card/50 backdrop-blur-sm border">
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Start Your Interview</CardTitle>
                <CardDescription>To begin, upload your resume or fill in your details manually.</CardDescription>
            </div>
             <Button variant="ghost" onClick={resetActiveInterview}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             {!resumeTextValue ? (
              <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrop}
                  onDrop={handleDrop}
                  className={cn(
                      "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-background/50 hover:bg-background/80 transition-colors",
                      dragActive ? "border-primary" : "border-border",
                  )}
              >
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                    disabled={isParsing}
                  />
                  <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                          <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
                          <p className="mb-2 text-sm font-semibold text-foreground">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX (MAX. 5MB)</p>
                      </div>
                    </label>
              </div>
              ) : (
                <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Resume Uploaded</AlertTitle>
                    <AlertDescription className="flex justify-between items-center">
                        Your resume has been parsed. You can now proceed.
                        <Button variant="link" size="sm" onClick={() => form.reset({ name: '', email: '', phone: '', resumeText: ''})}>
                            Upload another
                        </Button>
                    </AlertDescription>
                </Alert>
              )}
              
              <FormField
                  control={form.control}
                  name="resumeText"
                  render={({ field }) => (
                      <FormItem className="hidden">
                          <FormControl>
                              <Textarea {...field} readOnly />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )}
              />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="(123) 456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <Button type="submit" className="w-full" size="lg" disabled={!form.formState.isValid}>Start Interview</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function InterviewChat() {
  const { activeCandidate, setAllQuestionsForActiveCandidate, addAnswerToActiveCandidate, updateActiveCandidate } = useAssessAI();
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const currentQuestion = activeCandidate!.questions[activeCandidate!.currentQuestionIndex];
  
  const fetchAllQuestions = useCallback(async () => {
    if (!activeCandidate || activeCandidate.questions.length > 0 || !activeCandidate.resumeText) return;

    setIsLoading(true);
    try {
        const questions = await generateAllInterviewQuestions(activeCandidate.resumeText);
        setAllQuestionsForActiveCandidate(questions);
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch interview questions. Please try again.' });
        updateActiveCandidate({ status: 'error' });
    } finally {
        setIsLoading(false);
    }
  }, [activeCandidate, setAllQuestionsForActiveCandidate, toast, updateActiveCandidate]);


  useEffect(() => {
    if (activeCandidate && activeCandidate.questions.length === 0) {
      fetchAllQuestions();
    }
  }, [activeCandidate, fetchAllQuestions]);

  const handleNext = useCallback(async () => {
    addAnswerToActiveCandidate(currentAnswer);
    setCurrentAnswer('');

    if (activeCandidate && activeCandidate.currentQuestionIndex + 1 >= INTERVIEW_STRUCTURE.length) {
      updateActiveCandidate({ status: 'generating-summary' });
    }
  }, [addAnswerToActiveCandidate, currentAnswer, activeCandidate, updateActiveCandidate]);
  
  const QUESTION_GEN_LOGS = useMemo(() => {
    const textSample = activeCandidate?.resumeText?.substring(0, 30) || '...';
    return [
        "Analyzing your resume...",
        `Identifying key skills like ${textSample + '...'}`,
        "Formulating 'Easy' questions...",
        "Crafting 'Medium' difficulty questions...",
        "Devising 'Hard' scenario-based questions...",
        "Finalizing question set...",
    ];
}, [activeCandidate?.resumeText]);


  if (isLoading && activeCandidate?.questions.length === 0) {
    return (
       <VerboseLoader title="Generating Your Interview..." logs={QUESTION_GEN_LOGS} />
    );
  }

  if (!currentQuestion) {
    return null;
  }

  const progress = ((activeCandidate!.currentQuestionIndex) / INTERVIEW_STRUCTURE.length) * 100;

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl bg-card/50 backdrop-blur-sm border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Question {activeCandidate!.currentQuestionIndex + 1} of {INTERVIEW_STRUCTURE.length}</CardTitle>
        </div>
        <Progress value={progress} className="w-full h-2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
            <div className="flex gap-4 items-start">
                <div className="bg-secondary rounded-full p-2 border"><Bot className="h-6 w-6 text-secondary-foreground"/></div>
                <div className="bg-background/70 rounded-lg p-4 flex-1 border">
                    <p className="font-semibold text-lg">{currentQuestion.question}</p>
                </div>
            </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="answer">Your Answer</Label>
          <Textarea
            id="answer"
            placeholder="Type your answer here..."
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            className="min-h-[150px] text-base"
          />
        </div>
        <Button onClick={handleNext} disabled={!currentAnswer.trim()} className="w-full" size="lg">
          <Send className="mr-2 h-4 w-4"/>
          Submit Answer
        </Button>
      </CardContent>
    </Card>
  );
}

function SummaryView() {
    const { activeCandidate, updateActiveCandidate } = useAssessAI();
    const { toast } = useToast();

    const generateSummary = useCallback(async () => {
        if (!activeCandidate || !activeCandidate.resumeText || activeCandidate.questions.length < INTERVIEW_STRUCTURE.length) return;
        
        try {
            const answers = activeCandidate.questions.map(q => q.answer || '');
            const summaryData = await getCandidateSummary({
                resumeText: activeCandidate.resumeText,
                interviewAnswers: answers,
            });

            if (summaryData) {
                updateActiveCandidate({ 
                    status: 'completed',
                    score: summaryData.score,
                    summary: summaryData.summary
                });
            } else {
                 updateActiveCandidate({ status: 'error' });
                 toast({ variant: 'destructive', title: 'Error', description: 'Could not generate interview summary.' });
            }

        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not generate interview summary.' });
            updateActiveCandidate({ status: 'error' });
        }
    }, [activeCandidate, updateActiveCandidate, toast]);
    
    useEffect(() => {
        if (activeCandidate?.status === 'generating-summary') {
            generateSummary();
        }
    }, [activeCandidate?.status, generateSummary]);

    const SUMMARY_LOGS = [
        "Compiling all your answers...",
        "Evaluating responses against resume...",
        "Analyzing technical depth and clarity...",
        "Calculating performance score...",
        "Generating final summary and feedback...",
        "Done!"
    ];

    if (activeCandidate?.status === 'generating-summary') {
        return (
            <VerboseLoader title="Analyzing Your Performance..." logs={SUMMARY_LOGS} />
        );
    }
    
    if (activeCandidate?.status !== 'completed') {
        return null;
    }
    
     const handleDownload = () => {
        if (activeCandidate.fileDataUri) {
            const link = document.createElement('a');
            link.href = activeCandidate.fileDataUri;
            const fileExtension = activeCandidate.fileDataUri.split(';')[0].split('/')[1];
            link.download = `resume-${activeCandidate.name.replace(/\s+/g, '_')}.${fileExtension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            toast({
                variant: 'destructive',
                title: 'No file available',
                description: 'The original resume file was not saved.',
            });
        }
    };


    return (
        <Card className="w-full max-w-3xl mx-auto shadow-xl bg-card/50 backdrop-blur-sm border">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl">Interview Complete!</CardTitle>
                <CardDescription>Thank you for your time. Here is your AI-generated feedback.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="flex items-center justify-center">
                    <div className="relative h-48 w-48">
                        <svg className="h-full w-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-border" strokeWidth="2"></circle>
                            <motion.circle 
                                cx="18" 
                                cy="18" 
                                r="16" 
                                fill="none" 
                                className="stroke-current text-primary" 
                                strokeWidth="2" 
                                strokeDasharray="100"
                                strokeDashoffset={100 - (activeCandidate.score || 0)}
                                strokeLinecap="round" 
                                transform="rotate(-90 18 18)"
                                initial={{ strokeDashoffset: 100 }}
                                animate={{ strokeDashoffset: 100 - (activeCandidate.score || 0) }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-bold">{activeCandidate.score}</span>
                            <span className="text-sm text-muted-foreground">/ 100</span>
                        </div>
                    </div>
                </div>
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertTitle>Performance Summary</AlertTitle>
                  <AlertDescription className="prose prose-sm dark:prose-invert max-w-none">
                    {activeCandidate.summary}
                  </AlertDescription>
                </Alert>
                 {activeCandidate.fileDataUri && (
                    <Button onClick={handleDownload} variant="outline" className="w-full">
                        <FileDown className="mr-2" />
                        Download Original Resume
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

export function IntervieweeView() {
  const { activeCandidate, updateActiveCandidate } = useAssessAI();

  const handleStartClick = () => {
    // The active candidate is guaranteed to exist by the provider's logic
    if (activeCandidate) {
      updateActiveCandidate({ status: 'collecting-info' });
    }
  };
  
  const renderContent = () => {
    // This default case is crucial for initial render before hydration
    if (!activeCandidate) {
       return <LandingPage onStartClick={handleStartClick} />;
    }

    switch (activeCandidate.status) {
      case 'not-started':
        return <LandingPage onStartClick={handleStartClick} />;
      case 'collecting-info':
        return <InfoForm />;
      case 'in-progress':
        return <InterviewChat />;
      case 'generating-summary':
      case 'completed':
        return <SummaryView />;
      case 'error':
        return (
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertTitle>An Error Occurred</AlertTitle>
            <AlertDescription>We're sorry, something went wrong. Please refresh and try again.</AlertDescription>
          </Alert>
        );
      default:
        return <LandingPage onStartClick={handleStartClick} />;
    }
  };

  return <div className="py-8">{renderContent()}</div>;
}
