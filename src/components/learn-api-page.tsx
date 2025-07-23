
"use client";

import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Code, Bot } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ApiChatbot } from './api-chatbot';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const whatIsApiContent = {
    title: "What is an API?",
    description: "An API, or Application Programming Interface, is a set of rules and tools that allows different software applications to communicate with each other. Think of it as a waiter in a restaurant. You (an application) don't go directly to the kitchen (another application's system) to get your food. Instead, you give your order to the waiter (the API), who communicates with the kitchen and brings the food back to you.",
    icon: BookOpen
}

export function LearnApiPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sandbox
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-primary">API Learning Center</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <div className="bg-accent p-2 rounded-md">
                            <whatIsApiContent.icon className="w-6 h-6 text-accent-foreground"/>
                           </div>
                           {whatIsApiContent.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-muted-foreground">{whatIsApiContent.description}</p>
                    </CardContent>
                </Card>
            </motion.div>
             <motion.div variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="bg-accent p-2 rounded-md">
                                <Code className="w-6 h-6 text-accent-foreground"/>
                            </div>
                            How do they work?
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">APIs work on a request-response cycle. Your app sends a request for data, and the API's server sends back a response. We'll explore this in detail!</p>
                    </CardContent>
                </Card>
            </motion.div>
             <motion.div variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <div className="bg-accent p-2 rounded-md">
                            <Bot className="w-6 h-6 text-accent-foreground"/>
                           </div>
                            Have Questions?
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Use the chatbot below to ask questions! It's pre-loaded with common questions and can even use AI to help you out.</p>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
      </main>

      <ApiChatbot />
    </div>
  );
}
