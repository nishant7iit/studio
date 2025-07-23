

"use client";

import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, CheckCircle, ChevronRight, BrainCircuit, Rocket, Zap, Book, Wifi, Handshake, Database, Globe, User, FileText, Server } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ApiChatbot } from './api-chatbot';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Progress } from './ui/progress';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.2 }
  },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const arrowVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1, transition: { duration: 1, ease: "easeInOut" } }
}

const Section = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <motion.section 
        className={cn("py-12", className)}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
    >
        {children}
    </motion.section>
);

const SectionTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <motion.h2 variants={itemVariants} className={cn("text-3xl md:text-4xl font-bold text-center mb-8 text-primary", className)}>{children}</motion.h2>
);

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-secondary p-4 rounded-lg font-code text-sm my-4 overflow-x-auto">
        <pre><code>{children}</code></pre>
    </div>
);


const AnimatedDataFlow = () => {
    return (
        <div className="relative w-full h-32 flex items-center justify-center">
            {/* Client */}
            <motion.div 
                className="z-10 flex flex-col items-center"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <User className="w-10 h-10 text-primary" />
                <span className="text-sm mt-1">You</span>
            </motion.div>

            {/* Server */}
            <motion.div 
                className="z-10 flex flex-col items-center"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Server className="w-10 h-10 text-accent" />
                <span className="text-sm mt-1">Server</span>
            </motion.div>

            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-600" />
            
            {/* Data Packets */}
            <motion.div 
                className="absolute top-1/2 -mt-1 w-3 h-2 bg-primary rounded-full"
                animate={{
                    x: [-60, 60],
                    opacity: [1, 0],
                    transition: {
                        repeat: Infinity,
                        duration: 3,
                        ease: "linear"
                    }
                }}
            />
            <motion.div 
                className="absolute top-1/2 -mt-1 w-3 h-2 bg-accent rounded-full"
                animate={{
                    x: [60, -60],
                    opacity: [1, 0],
                    transition: {
                        repeat: Infinity,
                        duration: 3,
                        delay: 1.5,
                        ease: "linear"
                    }
                }}
            />
        </div>
    );
};

const QuickAccessMenu = () => {
    const menuItems = [
        { name: "Fundamentals", icon: Book },
        { name: "Structure", icon: BrainCircuit },
        { name: "Requests", icon: Rocket },
        { name: "Responses", icon: Zap }
    ];
    return (
        <div className="flex flex-wrap justify-center gap-4 mt-6">
            {menuItems.map((item, index) => (
                <motion.button 
                    key={item.name}
                    variants={itemVariants}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/80 rounded-full text-sm"
                >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                </motion.button>
            ))}
        </div>
    );
};


const HeroSection = () => {
    const [progress, setProgress] = useState(10);
    const [mode, setMode] = useState<'beginner' | 'intermediate'>('beginner');

    // In a real app, you would update progress based on scroll or section completion
    React.useEffect(() => {
        const timer = setTimeout(() => setProgress(15), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-gray-900 text-white py-16 px-4 text-center rounded-b-3xl mb-12">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={sectionVariants}
            >
                <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4">The Ultimate API Learning Journey</motion.h1>
                <motion.p variants={itemVariants} className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
                    From your first request to mastering authentication, we'll guide you every step of the way.
                </motion.p>
                
                <AnimatedDataFlow />

                <motion.div variants={itemVariants} className="max-w-md mx-auto my-8">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Your Progress</span>
                        <span>{progress}% Complete</span>
                    </div>
                    <Progress value={progress} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent" />
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex justify-center gap-4 mb-8">
                    <Button 
                        onClick={() => setMode('beginner')}
                        variant={mode === 'beginner' ? 'default' : 'outline'}
                        className={mode === 'beginner' ? "bg-primary" : "text-white border-gray-600"}
                    >
                        Complete Beginner
                    </Button>
                    <Button 
                        onClick={() => setMode('intermediate')}
                        variant={mode === 'intermediate' ? 'default' : 'outline'}
                         className={mode === 'intermediate' ? "bg-primary" : "text-white border-gray-600"}
                    >
                        I Know Some Basics
                    </Button>
                </motion.div>
                
                <QuickAccessMenu />
            </motion.div>
        </div>
    );
}

const PrerequisitesSection = () => {
    const prerequisites = [
        {
            icon: Globe,
            title: "What is the Internet?",
            description: "A global network of computers that allows us to share information and communicate. Think of it as the giant road system for data.",
            animation: (
                <div className="w-full h-24 flex items-center justify-center">
                    <motion.div variants={itemVariants} className="relative w-48 h-full">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute bg-primary/50 rounded-full"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.2 + 0.5, duration: 0.5 }}
                                style={{
                                    width: i === 0 ? 40 : 20,
                                    height: i === 0 ? 40 : 20,
                                    top: i === 0 ? '30%' : `${20 + i * 25}%`,
                                    left: i === 0 ? '40%' : `${10 + i * 25}%`,
                                }}
                            />
                        ))}
                        <motion.svg className="absolute w-full h-full" initial="hidden" animate="visible">
                            <motion.line x1="30%" y1="45%" x2="50%" y2="40%" stroke="hsl(var(--primary))" variants={arrowVariants} />
                             <motion.line x1="75%" y1="55%" x2="50%" y2="40%" stroke="hsl(var(--primary))" variants={arrowVariants} transition={{delay: 0.2}}/>
                        </motion.svg>
                    </motion.div>
                </div>
            )
        },
        {
            icon: Handshake,
            title: "Client vs. Server",
            description: "A client (like your browser) asks for information, and a server provides it. It's a fundamental two-way conversation.",
            animation: (
                 <div className="w-full h-24 flex items-center justify-around">
                     <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
                        <User className="w-8 h-8 text-primary"/>
                        <span className="text-xs font-bold">Client</span>
                     </motion.div>
                      <motion.div variants={itemVariants} className="flex flex-col items-center">
                        <p className="text-xs">Request →</p>
                        <p className="text-xs">← Response</p>
                      </motion.div>
                     <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
                        <Server className="w-8 h-8 text-accent"/>
                        <span className="text-xs font-bold">Server</span>
                     </motion.div>
                 </div>
            )
        },
        {
            icon: Database,
            title: "What is Data?",
            description: "Simply put, data is information. For APIs, this is often structured in a specific format, like JSON, so computers can easily read it.",
             animation: (
                 <div className="w-full h-24 flex items-center justify-center">
                    <motion.div variants={itemVariants} className="font-code text-xs bg-gray-800 p-2 rounded-md">
                        <pre>
                            <code>{`{
  "name": "Alex",
  "isStudent": true
}`}</code>
                        </pre>
                    </motion.div>
                 </div>
             )
        }
    ];

    return (
        <Section>
            <SectionTitle>First, The Foundations</SectionTitle>
            <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-center text-muted-foreground mb-12">
                Before we talk about APIs, let's quickly cover the basic concepts they are built upon.
            </motion.p>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {prerequisites.map((item, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        <Card className="h-full">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <item.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{item.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                                {item.animation}
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
};

const ApiFundamentalsSection = () => {
    return (
        <Section>
            <SectionTitle>What even IS an API?</SectionTitle>
             <motion.p variants={itemVariants} className="max-w-3xl mx-auto text-center text-lg text-muted-foreground mb-12">
                Ever wondered how apps on your phone get weather updates, or how you can log in to a website with your Google account? The answer is APIs! Let's demystify them together using a simple analogy.
            </motion.p>
            <Card>
                <CardHeader>
                    <CardTitle className="text-center text-2xl">The Restaurant Analogy</CardTitle>
                </CardHeader>
                <CardContent>
                    <motion.div 
                        variants={sectionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-4"
                    >
                        <motion.div variants={itemVariants} className="flex flex-col items-center p-6 bg-card rounded-lg w-full md:w-2/3 border shadow-sm">
                            <div className="bg-primary/10 rounded-full p-4 mb-4">
                               <User className="w-10 h-10 text-primary"/>
                            </div>
                            <h3 className="font-bold text-xl mb-2">You (The Client)</h3>
                            <p className="text-muted-foreground">You are at a restaurant, ready to order. You know what you want, but you can't go into the kitchen yourself. You need to make a structured <span className="font-bold text-primary">Request</span>.</p>
                        </motion.div>

                        <motion.svg width="50" height="100" viewBox="0 0 50 100" variants={itemVariants}>
                            <motion.path d="M 25 0 V 80" stroke="hsl(var(--primary))" strokeWidth="2" variants={arrowVariants} />
                            <motion.path d="M 20 70 L 25 80 L 30 70" stroke="hsl(var(--primary))" fill="transparent" strokeWidth="2" variants={arrowVariants}/>
                            <text x="30" y="45" fill="hsl(var(--muted-foreground))" fontSize="12" textAnchor="start">Request</text>
                        </motion.svg>
                        
                        <motion.div variants={itemVariants} className="flex flex-col items-center p-6 bg-card rounded-lg w-full md:w-2/3 border shadow-sm">
                           <div className="bg-accent/20 rounded-full p-4 mb-4">
                              <FileText className="w-10 h-10 text-accent"/>
                           </div>
                            <h3 className="font-bold text-xl mb-2">The Menu (The API)</h3>
                            <p className="text-muted-foreground">The menu provides a list of dishes you can order. It's a contract specifying what the kitchen can prepare. An API is a "menu" of defined requests that one application can make to another.</p>
                        </motion.div>

                        <motion.svg width="50" height="100" viewBox="0 0 50 100" variants={itemVariants}>
                            <motion.path d="M 25 0 V 80" stroke="hsl(var(--primary))" strokeWidth="2" variants={arrowVariants} />
                            <motion.path d="M 20 70 L 25 80 L 30 70" stroke="hsl(var(--primary))" fill="transparent" strokeWidth="2" variants={arrowVariants}/>
                        </motion.svg>

                        <motion.div variants={itemVariants} className="flex flex-col items-center p-6 bg-card rounded-lg w-full md:w-2/3 border shadow-sm">
                            <div className="bg-accent/20 rounded-full p-4 mb-4">
                               <Server className="w-10 h-10 text-accent"/>
                            </div>
                            <h3 className="font-bold text-xl mb-2">The Kitchen (The Server)</h3>
                            <p className="text-muted-foreground">The kitchen takes your specific order, prepares it, and gets it ready. The server processes the request, retrieves the necessary data, and prepares a <span className="font-bold text-green-500">Response</span>.</p>
                        </motion.div>

                        <motion.svg width="50" height="100" viewBox="0 0 50 100" variants={itemVariants}>
                            <motion.path d="M 25 100 V 20" stroke="hsl(var(--green-500))" strokeWidth="2"  className="stroke-green-500" variants={arrowVariants} />
                            <motion.path d="M 20 30 L 25 20 L 30 30" stroke="hsl(var(--green-500))" className="stroke-green-500" fill="transparent" strokeWidth="2" variants={arrowVariants}/>
                            <text x="30" y="65" fill="hsl(var(--muted-foreground))" fontSize="12" textAnchor="start">Response</text>
                        </motion.svg>

                         <motion.div variants={itemVariants} className="flex flex-col items-center p-6 bg-card rounded-lg w-full md:w-2/3 border shadow-sm">
                           <div className="bg-primary/10 rounded-full p-4 mb-4">
                              <User className="w-10 h-10 text-primary"/>
                           </div>
                            <h3 className="font-bold text-xl mb-2">You Get Your Food</h3>
                            <p className="text-muted-foreground">Your food is delivered to your table! The application receives the data it requested and can display it to you.</p>
                        </motion.div>
                    </motion.div>
                    <p className="text-center mt-12 text-lg max-w-3xl mx-auto">So, an <span className="font-bold">API</span> (Application Programming Interface) is that menu—a reliable intermediary that allows different applications to talk to each other in a structured way.</p>
                </CardContent>
            </Card>
        </Section>
    );
}

export function LearnApiPage() {
  const router = useRouter();
  
  const handleBackToSandbox = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Button variant="ghost" onClick={handleBackToSandbox}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sandbox
            </Button>
          <h1 className="text-xl md:text-2xl font-bold text-primary">API Learning Center</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        
        <HeroSection />
        
        <PrerequisitesSection />
        
        <ApiFundamentalsSection />

        <Card className="mb-8">
            <CardHeader>
              <SectionTitle>Anatomy of a Request</SectionTitle>
            </CardHeader>
            <CardContent>
                <p className="max-w-3xl mx-auto text-center text-lg text-muted-foreground mb-12">
                    A request is a structured message you send to the server. It has a few key parts.
                </p>
                <div className="space-y-8 max-w-3xl mx-auto">
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">1. The Method</h3>
                        <p>The verb of your request. It tells the server what kind of action you want to perform. Common methods include:</p>
                        <ul className="list-disc list-inside mt-2 text-muted-foreground">
                            <li><span className="font-bold text-green-500">GET:</span> Retrieve data (e.g., get a user's profile).</li>
                            <li><span className="font-bold text-orange-500">POST:</span> Create new data (e.g., post a new tweet).</li>
                            <li><span className="font-bold text-blue-500">PUT:</span> Update existing data completely.</li>
                            <li><span className="font-bold text-purple-500">PATCH:</span> Partially update existing data.</li>
                            <li><span className="font-bold text-red-500">DELETE:</span> Remove data.</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">2. The URL (Endpoint)</h3>
                        <p>The address you're sending the request to. It specifies the resource you're interested in.</p>
                        <CodeBlock>https://api.example.com/users/123</CodeBlock>
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">3. Headers</h3>
                        <p>Extra information for the server, like metadata. This often includes authentication tokens or the format of the data you're sending.</p>
                        <CodeBlock>{`"Content-Type": "application/json"
"Authorization": "Bearer your_api_key_here"`}</CodeBlock>
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">4. The Body</h3>
                        <p>The data you're sending to the server. This is mainly used with POST, PUT, and PATCH requests.</p>
                        <CodeBlock>{`{
    "name": "John Doe",
    "email": "john.doe@example.com"
}`}</CodeBlock>
                    </div>
                </div>
            </CardContent>
        </Card>
        
        <Card className="mb-8">
            <CardHeader>
                <SectionTitle>Anatomy of a Response</SectionTitle>
            </CardHeader>
            <CardContent>
                <p className="max-w-3xl mx-auto text-center text-lg text-muted-foreground mb-12">
                    After the server processes your request, it sends back a response, which also has a specific structure.
                </p>
                <div className="space-y-8 max-w-3xl mx-auto">
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">1. Status Code</h3>
                        <p>A 3-digit number indicating the result of the request. They're grouped by their first digit:</p>
                        <ul className="list-disc list-inside mt-2 text-muted-foreground">
                            <li><span className="font-bold text-green-500">2xx (e.g. 200 OK):</span> Success!</li>
                            <li><span className="font-bold text-blue-500">3xx (e.g. 301 Moved Permanently):</span> Redirection.</li>
                            <li><span className="font-bold text-yellow-500">4xx (e.g. 404 Not Found):</span> Client error (you did something wrong).</li>
                            <li><span className="font-bold text-red-500">5xx (e.g. 500 Internal Server Error):</span> Server error (they did something wrong).</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">2. Headers</h3>
                        <p>Just like request headers, these provide metadata about the response, such as the data format.</p>
                        <CodeBlock>"Content-Type": "application/json"</CodeBlock>
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">3. The Body (Payload)</h3>
                        <p>The data you requested, usually in a format like JSON.</p>
                        <CodeBlock>{`{
    "id": 123,
    "name": "John Doe",
    "status": "Active"
}`}</CodeBlock>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Section className="border-b-0">
            <div className="text-center">
                <motion.div variants={itemVariants}>
                    <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4"/>
                </motion.div>
                <SectionTitle>You're Ready!</SectionTitle>
                <motion.p variants={itemVariants} className="max-w-3xl mx-auto text-lg text-muted-foreground mb-8">
                   That's the core of it! You now understand the fundamental request-response cycle of APIs. The best way to learn is by doing.
                </motion.p>
                <motion.div variants={itemVariants}>
                    <Button size="lg" onClick={handleBackToSandbox}>
                        Go to the Sandbox & Start Practicing
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </motion.div>
            </div>
        </Section>

      </main>

      <ApiChatbot />
    </div>
  );
}
