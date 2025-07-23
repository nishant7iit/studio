
"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Server, Smartphone, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui/button';
import { ApiChatbot } from './api-chatbot';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';

// Part 1: Hero Section Component
const HeroSection = () => {
  const [learningMode, setLearningMode] = useState<'beginner' | 'intermediate'>('beginner');

  return (
    <div className="relative bg-neutral-900 text-white py-20 px-4 overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-grid-white/[0.07] [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"></div>
      
      {/* Animated Data Flow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-32 flex items-center justify-between opacity-20">
        <Smartphone className="w-16 h-16 text-blue-400" />
        <div className="w-full h-px bg-gradient-to-r from-blue-400 to-green-400 relative">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute -top-1 w-2 h-2 bg-white rounded-full"
              initial={{ offsetDistance: '0%' }}
              animate={{ offsetDistance: '100%' }}
              transition={{ 
                duration: 3 + i, 
                repeat: Infinity, 
                ease: 'linear'
              }}
              style={{ motionPath: `M0,0 H${(document.querySelector('.relative.w-full.h-px')?.clientWidth || 0)}px` }}
            />
          ))}
        </div>
        <Server className="w-16 h-16 text-green-400" />
      </div>

      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to the API Learning Center</h1>
        <p className="text-lg text-neutral-300 max-w-2xl mx-auto mb-8">
          Transform intimidating technical docs into an engaging, visual journey. Let's make learning fun.
        </p>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="w-full bg-neutral-700 rounded-full h-2.5">
            <motion.div
              className="bg-primary h-2.5 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '10%' }} // Static for now, will be dynamic later
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="text-sm text-neutral-400 mt-2">Your Learning Journey: 10% Complete</p>
        </div>

        {/* Learning Mode Selector */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => setLearningMode('beginner')}
            className={cn(
              "bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors",
              learningMode === 'beginner' && 'bg-primary text-primary-foreground'
            )}
          >
            Complete Beginner
          </Button>
          <Button
            onClick={() => setLearningMode('intermediate')}
            className={cn(
              "bg-transparent border border-neutral-500 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors",
              learningMode === 'intermediate' && 'bg-neutral-700 text-white'
            )}
          >
            I Know Some Basics
          </Button>
        </div>
      </div>
    </div>
  );
};

export function LearnApiPage() {
  const router = useRouter();
  
  const handleBackToSandbox = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" onClick={handleBackToSandbox}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sandbox
          </Button>
          <h1 className="text-xl md:text-2xl font-bold text-primary hidden sm:block">API Learning Center</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Part 1: Hero Section */}
        <HeroSection />

        {/* Future parts will be added here */}
        
      </main>

      <ApiChatbot />
    </div>
  );
}
