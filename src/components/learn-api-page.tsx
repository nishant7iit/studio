
"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Server, 
  Smartphone, 
  Zap, 
  Network, 
  Handshake, 
  ToyBrick, 
  User, 
  FileText, 
  Building, 
  ArrowRight,
  CloudSun,
  ShoppingCart,
  MessageSquare,
  Map,
  Badge,
  Mail,
  FilePlus,
  FileCheck,
  Trash2,
} from 'lucide-react';
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
              style={{ offsetMotion: `path("M0,0 H${(document.querySelector('.relative.w-full.h-px')?.clientWidth || 0)}px")` }}
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
              animate={{ width: '10%' }} 
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

// Part 2: Prerequisites Section
const PrerequisiteBlock = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="bg-card border rounded-lg p-6 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-shadow"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="text-primary mb-4"
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{children}</p>
    </motion.div>
  );
};

const PrerequisitesSection = () => (
  <div className="py-16">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12"
    >
      <h2 className="text-3xl font-bold">First, The Foundations</h2>
      <p className="text-muted-foreground mt-2">Before we dive into APIs, let's cover a few key concepts.</p>
    </motion.div>
    <div className="grid md:grid-cols-3 gap-8">
      <PrerequisiteBlock
        icon={<Network className="w-12 h-12" />}
        title="The Internet"
      >
        A global network of computers that allows users to share information and communicate with each other. It's the highway system for data.
      </PrerequisiteBlock>
      <PrerequisiteBlock
        icon={<Handshake className="w-12 h-12" />}
        title="Client & Server"
      >
        The Client (your device) asks for information, and the Server (a powerful computer) provides it. This is the fundamental relationship of the web.
      </PrerequisiteBlock>
      <PrerequisiteBlock
        icon={<ToyBrick className="w-12 h-12" />}
        title="What is Data?"
      >
        Simply put, data is just information. It can be text, images, numbers, or anything else that can be stored and processed by a computer.
      </PrerequisiteBlock>
    </div>
  </div>
);

// Part 3: API Fundamentals
const ApiFundamentalsSection = () => {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="py-16 bg-muted rounded-lg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 px-4"
      >
        <h2 className="text-3xl font-bold">What Even IS an API?</h2>
        <p className="text-muted-foreground mt-2">API stands for Application Programming Interface. Let's break that down.</p>
      </motion.div>
      
      <div className="container mx-auto px-4">
        <Card className="shadow-lg">
            <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-center mb-8">The Restaurant Analogy</h3>
                <motion.div 
                    className="flex flex-col md:flex-row items-center justify-between gap-4"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {/* You (Client) */}
                    <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
                        <User className="w-16 h-16 text-primary p-3 bg-primary/10 rounded-full mb-2"/>
                        <h4 className="font-bold">You (Client)</h4>
                        <p className="text-sm text-muted-foreground">You know what you want to eat.</p>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="transform md:-rotate-0 rotate-90">
                        <ArrowRight className="w-12 h-12 text-muted-foreground"/>
                    </motion.div>
                    
                    {/* Waiter (API) */}
                    <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
                        <FileText className="w-16 h-16 text-accent p-3 bg-accent/10 rounded-full mb-2"/>
                        <h4 className="font-bold">The Waiter (API)</h4>
                        <p className="text-sm text-muted-foreground">Takes your order in a structured way.</p>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="transform md:-rotate-0 rotate-90">
                         <ArrowRight className="w-12 h-12 text-muted-foreground"/>
                    </motion.div>
                    
                    {/* Kitchen (Server) */}
                    <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
                        <Server className="w-16 h-16 text-green-500 p-3 bg-green-500/10 rounded-full mb-2"/>
                        <h4 className="font-bold">The Kitchen (Server)</h4>
                        <p className="text-sm text-muted-foreground">Prepares your meal based on the order.</p>
                    </motion.div>
                </motion.div>
                 <p className="text-center mt-8 text-muted-foreground max-w-2xl mx-auto">
                    In this analogy, the API is the waiter. It's the messenger that takes your structured request (your order), delivers it to the system that has the data (the kitchen), and brings the response back to you. It's a standardized way for different applications to talk to each other.
                 </p>
            </CardContent>
        </Card>

        <div className="text-center mt-16">
            <h3 className="text-2xl font-bold">An API is a Bridge</h3>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Think of two separate applications as islands. An API acts as a bridge between them, allowing them to share data and functionality securely and efficiently.</p>
            <div className="flex justify-center items-center gap-4 mt-8">
                <Building className="w-16 h-16 text-primary" />
                <div className="w-24 h-2 bg-border relative overflow-hidden rounded-full">
                    <motion.div 
                        className="h-full bg-primary absolute left-0"
                        initial={{x: "-100%"}}
                        whileInView={{ x: ["-100%", "0%", "100%"]}}
                        viewport={{ once: true }}
                        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
                    />
                </div>
                <Zap className="w-16 h-16 text-accent" />
            </div>
        </div>
      </div>
    </div>
  );
};

// Part 4: Interactive Discovery
const InteractiveDiscoverySection = () => {
  const AppCard = ({ icon, name }: { icon: React.ReactNode, name: string }) => (
    <motion.div
      whileHover="hover"
      className="relative bg-card border rounded-lg p-8 flex flex-col items-center justify-center text-center shadow-md hover:shadow-xl transition-shadow cursor-pointer"
    >
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-bold">{name}</h3>
      <AnimatePresence>
        <motion.div
          variants={{
            initial: { opacity: 0, y: 10 },
            hover: { opacity: 1, y: 0 },
          }}
          initial="initial"
          className="absolute bottom-4"
        >
          <Badge>Powered by APIs</Badge>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );

  return (
    <div className="py-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold">APIs Are Everywhere</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">You use apps powered by APIs every day without even realizing it. Hover over these examples to see.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <AppCard icon={<CloudSun className="w-16 h-16" />} name="Weather Apps" />
        <AppCard icon={<MessageSquare className="w-16 h-16" />} name="Social Media" />
        <AppCard icon={<ShoppingCart className="w-16 h-16" />} name="E-commerce" />
        <AppCard icon={<Map className="w-16 h-16" />} name="Mapping Services" />
      </div>
    </div>
  );
};

// Part 5: Anatomy of a Request
const AnatomyOfRequestSection = () => {
  const MethodCard = ({ icon, title, color, children }: { icon: React.ReactNode, title: string, color: string, children: React.ReactNode }) => (
    <motion.div 
      className="bg-card border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          className={cn("p-2 rounded-full", color)}
          whileHover={{ rotate: 15 }}
        >
          {icon}
        </motion.div>
        <h3 className={cn("text-xl font-bold", color.replace('bg-', 'text-'))}>{title}</h3>
      </div>
      <p className="text-muted-foreground text-sm">{children}</p>
    </motion.div>
  );

  return (
    <div className="py-16 bg-muted rounded-lg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 px-4"
      >
        <h2 className="text-3xl font-bold">The Anatomy of a Request</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">To get data from an API, you need to make a "request." Think of it as filling out a specific form to ask the server for what you need.</p>
      </motion.div>
      <div className="container mx-auto px-4">
         <h3 className="text-2xl font-bold text-center mb-8">HTTP Methods: The "Verb" of your Request</h3>
         <div className="grid md:grid-cols-2 gap-6">
            <MethodCard icon={<Mail className="w-8 h-8 text-white"/>} title="GET" color="bg-green-500">
                Retrieves data from a server. It's like asking to **read** a letter from a mailbox without changing it.
            </MethodCard>
             <MethodCard icon={<FilePlus className="w-8 h-8 text-white"/>} title="POST" color="bg-orange-500">
                Submits new data to a server. It's like putting a **new** letter into the mailbox to be filed away.
            </MethodCard>
             <MethodCard icon={<FileCheck className="w-8 h-8 text-white"/>} title="PUT" color="bg-blue-500">
                Updates existing data on a server. It's like **replacing** an entire letter in the mailbox with a new version.
            </MethodCard>
             <MethodCard icon={<Trash2 className="w-8 h-8 text-white"/>} title="DELETE" color="bg-red-500">
                Removes data from a server. It's like taking a letter out of the mailbox and **shredding** it.
            </MethodCard>
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
          <div />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <HeroSection />
        <PrerequisitesSection />
        <ApiFundamentalsSection />
        <InteractiveDiscoverySection />
        <AnatomyOfRequestSection />
      </main>

      <ApiChatbot />
    </div>
  );
}

    