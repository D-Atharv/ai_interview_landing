"use client";

import { useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { MainLayout } from "@/components/main-layout";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Bot,
  BarChart,
  FileText,
  ArrowLeft,
  ArrowDown,
  Users,
  Upload,
  MessageCircle,
  ClipboardCheck,
  Star,
  Quote,
  Twitter,
  Linkedin,
  Github,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  CheckCircle,
  Play,
} from "lucide-react";
import React from "react";

// Enhanced grid background component
function GridBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Subtle dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, hsl(var(--primary)) 2px, transparent 0)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-500" />
    </div>
  );
}

// New Statistics Section
function StatisticsSection() {
  const stats = [
    {
      value: "10K+",
      label: "Interviews Conducted",
      icon: <Users className="w-6 h-6" />,
    },
    {
      value: "94%",
      label: "User Satisfaction",
      icon: <Star className="w-6 h-6" />,
    },
    {
      value: "2.5x",
      label: "Faster Hiring",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      value: "50+",
      label: "Tech Roles Supported",
      icon: <Shield className="w-6 h-6" />,
    },
  ];

  return (
    <section className="w-full max-w-6xl py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/20"
            >
              <div className="flex justify-center mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">{stat.icon}</div>
              </div>
              <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
              <p className="text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// New Demo Video Section
function DemoSection() {
  return (
    <section className="w-full max-w-6xl py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            See It In Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how AssessAI transforms technical interviews with real-time
            adaptive questioning and instant feedback.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative bg-card/50 backdrop-blur-sm rounded-2xl border border-border/20 p-8"
        >
          {/* Video placeholder with play button */}
          <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-primary-foreground ml-1" />
              </div>
              <p className="text-muted-foreground">Watch product demo</p>
            </div>

            {/* Floating elements */}
            <div className="absolute top-4 left-4 p-3 bg-background/80 rounded-lg backdrop-blur-sm border">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div className="absolute top-4 right-4 p-3 bg-background/80 rounded-lg backdrop-blur-sm border">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="absolute bottom-4 left-4 p-3 bg-background/80 rounded-lg backdrop-blur-sm border">
              <BarChart className="w-6 h-6 text-primary" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Enhanced Features Section with images
function EnhancedFeaturesSection() {
  const features = [
    {
      icon: <Bot className="h-12 w-12 text-primary" />,
      title: "Adaptive AI Interviews",
      description:
        "Our AI dynamically adjusts questions based on your responses and resume content for a truly personalized experience.",
      image: "/api/placeholder/400/250",
      highlights: [
        "Real-time adaptation",
        "Context-aware questioning",
        "Personalized difficulty",
      ],
    },
    {
      icon: <FileText className="h-12 w-12 text-primary" />,
      title: "Comprehensive Analytics",
      description:
        "Get detailed insights with visual charts and actionable feedback to track your progress over time.",
      image: "/api/placeholder/400/250",
      highlights: [
        "Performance metrics",
        "Progress tracking",
        "Skill gap analysis",
      ],
    },
    {
      icon: <BarChart className="h-12 w-12 text-primary" />,
      title: "Candidate Dashboard",
      description:
        "Hiring managers get AI-powered summaries and comparative analytics to make informed decisions faster.",
      image: "/api/placeholder/400/250",
      highlights: ["AI summaries", "Comparative analysis", "Bias detection"],
    },
  ];

  return (
    <section className="w-full max-w-6xl py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Powerful Features for Every Role
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Designed specifically for technical interviews with cutting-edge AI
            capabilities.
          </p>
        </motion.div>

        <div className="space-y-32">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className={cn(
                "flex flex-col gap-12 items-center",
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              )}
            >
              <div className="flex-1">
                <div className="p-2 bg-primary/10 rounded-xl w-fit mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex-1">
                <div className="relative">
                  <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-1">
                    <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/20 aspect-video flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <TrendingUp className="w-8 h-8 text-primary" />
                        </div>
                        Feature Preview
                      </div>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-accent-foreground" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Enhanced Timeline Section
function TimelineSection() {
  const targetRef = React.useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end end"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const steps = [
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Select Your Role",
      description:
        "Choose whether you're practicing for interviews or screening candidates.",
      duration: "2 min",
    },
    {
      icon: <Upload className="h-10 w-10 text-primary" />,
      title: "Upload Resume & Setup",
      description:
        "Provide your resume for hyper-personalized interview experiences.",
      duration: "3 min",
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-primary" />,
      title: "AI-Powered Interview",
      description:
        "Engage in dynamic conversations with our adaptive AI interviewer.",
      duration: "30-45 min",
    },
    {
      icon: <ClipboardCheck className="h-10 w-10 text-primary" />,
      title: "Instant Analysis & Report",
      description:
        "Receive comprehensive feedback with scores and improvement areas.",
      duration: "Instant",
    },
  ];

  return (
    <section ref={targetRef} className="w-full max-w-6xl py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to transform your interview preparation and hiring
            process.
          </p>
        </motion.div>

        <div className="relative w-full max-w-4xl mx-auto">
          {/* Enhanced timeline line */}
          <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-4 h-full w-2 bg-gradient-to-b from-border/50 to-border/30 rounded-full" />
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-4 h-full w-2 bg-gradient-to-b from-primary to-accent rounded-full"
          />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: index * 0.1,
                }}
                className="relative flex items-start gap-8"
              >
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-background rounded-full border-4 border-primary flex items-center justify-center">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                    {step.duration}
                  </div>
                </div>

                {/* Content */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex-1 bg-card/80 backdrop-blur-sm rounded-xl border border-border/20 p-6 hover:shadow-lg transition-all"
                >
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Enhanced Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "AssessAI completely changed how I prepare for technical interviews. The instant feedback helped me identify my weak spots and improve dramatically.",
      name: "Sarah Chen",
      role: "Senior Software Engineer",
      company: "TechCorp",
      avatar: "/api/placeholder/100/100",
      stars: 5,
    },
    {
      quote:
        "As a hiring manager, the AI-generated summaries save me hours each week. I can quickly identify top candidates based on objective data rather than gut feeling.",
      name: "Michael Rodriguez",
      role: "Engineering Manager",
      company: "StartupXYZ",
      avatar: "/api/placeholder/100/100",
      stars: 5,
    },
    {
      quote:
        "The adaptive questions are incredibly realistic. It's the closest thing to a real technical interview I've ever experienced online.",
      name: "David Kim",
      role: "Full Stack Developer",
      company: "DigitalAgency",
      avatar: "/api/placeholder/100/100",
      stars: 5,
    },
  ];

  return (
    <section className="w-full max-w-6xl py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Trusted by Professionals
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of developers and hiring managers transforming their
            interview processes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card/80 backdrop-blur-sm p-8 rounded-xl border border-border/20 hover:shadow-lg transition-all"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              <Quote className="w-8 h-8 text-primary mb-4 opacity-50" />
              <p className="text-foreground/90 mb-6 italic">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Enhanced Footer
function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border/20 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Icons.logo className="h-10 w-10 text-foreground" />
              <h3 className="text-2xl font-bold">AssessAI</h3>
            </div>
            <p className="text-muted-foreground max-w-md mb-6">
              The Ultimate AI Co-Pilot for Technical Interviews. Practice,
              screen, and hire with unparalleled intelligence.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {["Features", "Pricing", "Use Cases", "Updates"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {["About", "Contact", "Careers", "Blog"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/20 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AssessAI. All rights reserved.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Enhanced Landing Page with all new sections
function LandingPage({ onStepChange }: { onStepChange: (step: Step) => void }) {
  const heroTextContainer = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const heroTextChild = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
  };

  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col items-center overflow-x-hidden">
      <GridBackground />

      <header className="absolute top-0 left-0 right-0 p-6 flex justify-end w-full max-w-7xl mx-auto">
        <ThemeToggle />
      </header>

      <main className="flex-grow flex flex-col items-center justify-center w-full">
        {/* Hero Section */}
        <section className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4 relative">
          <motion.div
            variants={heroTextContainer}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-4 mb-6"
          >
            <motion.div variants={heroTextChild}>
              <Icons.logo className="h-20 w-20 text-foreground" />
            </motion.div>
            <motion.div variants={heroTextChild}>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground">
                AssessAI
              </h1>
            </motion.div>
          </motion.div>

          <motion.p
            variants={heroTextChild}
            className="max-w-4xl mx-auto mb-10 text-xl md:text-2xl text-muted-foreground leading-relaxed"
          >
            The Ultimate AI Co-Pilot for Technical Interviews.
            <span className="block mt-2 text-foreground/80">
              Practice, screen, and hire with unparalleled intelligence and
              precision.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 mb-20"
          >
            <Button
              size="lg"
              onClick={() => onStepChange("role-selection")}
              className="text-lg px-8 py-6"
            >
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              View Demo
            </Button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1,
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-default"
          >
            <span className="text-sm text-muted-foreground">
              Explore Features
            </span>
            <ArrowDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </section>

        <StatisticsSection />
        <EnhancedFeaturesSection />
        <TimelineSection />
        <DemoSection />
        <TestimonialsSection />

        {/* Final CTA Section */}
        <section className="w-full py-24 md:py-32 bg-gradient-to-b from-background to-card/30">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <Icons.logo className="h-16 w-16 text-foreground mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Interview Process?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of professionals who trust AssessAI for smarter
                technical interviews and better hiring decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => onStepChange("role-selection")}
                  className="text-lg px-8 py-6"
                >
                  Start Your Journey
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6"
                >
                  Schedule a Demo
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}


type Role = "interviewee" | "interviewer" | "none";
type Step = "landing" | "role-selection";

function RoleCard({
  role,
  title,
  icon,
  onSelectRole,
}: {
  role: Role;
  title: string;
  icon: React.ReactNode;
  onSelectRole: (role: Role) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative group cursor-pointer"
      onClick={() => onSelectRole(role)}
    >
      <div
        className={cn(
          "absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-300 animate-tilt"
        )}
      />
      <div className="relative p-8 bg-card/80 backdrop-blur-sm rounded-xl h-full flex flex-col items-center justify-center gap-6 text-card-foreground border border-border/20 shadow-xl">
        {icon}
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
      </div>
    </motion.div>
  );
}

function RoleSelection({
  onSelectRole,
  onBack,
}: {
  onSelectRole: (role: Role) => void;
  onBack: () => void;
}) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-screen px-4 text-center">
      <GridBackground />

      <motion.header
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        className="flex items-center gap-4 mb-16"
      >
        <Icons.logo className="h-16 w-16 text-foreground" />
        <div>
          <h1 className="text-5xl font-bold tracking-tighter text-foreground">
            AssessAI
          </h1>
          <p className="text-muted-foreground text-lg">
            Your AI-Powered Interview Co-Pilot
          </p>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        className="w-full max-w-4xl"
      >
        <h2 className="text-3xl font-semibold mb-10 text-foreground">
          Select Your Role
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <RoleCard
            role="interviewee"
            title="I'm an Interviewee"
            icon={<Icons.interviewee className="w-32 h-32 text-primary" />}
            onSelectRole={onSelectRole}
          />
          <RoleCard
            role="interviewer"
            title="I'm an Interviewer"
            icon={
              <Icons.interviewer className="w-32 h-32 text-muted-foreground" />
            }
            onSelectRole={onSelectRole}
          />
        </div>
      </motion.div>
      <motion.div
        className="mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2" />
          Back
        </Button>
      </motion.div>
    </div>
  );
}

function HomePageContent() {
  const [role, setRole] = useState<Role>("none");
  const [step, setStep] = useState<Step>("landing");
  const router = useRouter();

  const handleSelectRole = (selectedRole: Role) => {
    if (selectedRole === "interviewer") {
      router.push("/dashboard");
    } else {
      setRole(selectedRole);
    }
  };

  const renderStep = () => {
    switch (step) {
      case "landing":
        return <LandingPage onStepChange={setStep} />;
      case "role-selection":
        return (
          <RoleSelection
            onSelectRole={handleSelectRole}
            onBack={() => setStep("landing")}
          />
        );
      default:
        return <LandingPage onStepChange={setStep} />;
    }
  };

  if (role === "none") {
    return (
      <main className="w-full flex flex-col items-center justify-center bg-background">
        {renderStep()}
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <MainLayout
        selectedRole={role}
        onSwitchRole={() => {
          setRole("none");
          setStep("landing");
        }}
      />
    </main>
  );
}

export default function Home() {
  return <HomePageContent />;
}
