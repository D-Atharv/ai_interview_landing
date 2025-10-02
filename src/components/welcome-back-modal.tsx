'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface WelcomeBackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onStartOver: () => void;
}

export function WelcomeBackModal({ isOpen, onClose, onContinue, onStartOver }: WelcomeBackModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Welcome Back!</AlertDialogTitle>
          <AlertDialogDescription>
            You have an interview in progress. Would you like to continue where you left off or start a new one?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onStartOver} variant="outline">
            Start Over
          </AlertDialogAction>
          <AlertDialogAction onClick={onContinue}>
            Continue Interview
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
