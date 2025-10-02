import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Figtree } from "next/font/google";
import { cn } from "@/lib/utils";
import { AssessAIProvider } from "@/hooks/use-assess-ai-store";
import { ThemeProvider } from "@/components/theme-provider";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "AssessAI",
  description: "An AI-Powered Interview Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="theme-ocean" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          figtree.variable
        )}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AssessAIProvider>
            {children}
            <Toaster />
          </AssessAIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
