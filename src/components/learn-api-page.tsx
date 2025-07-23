
"use client";

import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Code, Bot, Server, ArrowDown, Share2, CheckCircle, Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ApiChatbot } from './api-chatbot';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

const Section = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <motion.section 
        className={cn("py-12 px-4 md:px-8 border-b", className)}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
    >
        {children}
    </motion.section>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-primary">{children}</h2>
);

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-secondary p-4 rounded-lg font-code text-sm my-4 overflow-x-auto">
        <pre><code>{children}</code></pre>
    </div>
);

export function LearnApiPage() {
  const router = useRouter();
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
          <h1 className="text-xl md:text-2xl font-bold text-primary">API Learning Center</h1>
        </div>
      </header>

      <main className="container mx-auto">
        <Section>
            <div className="text-center">
                <BookOpen className="w-16 h-16 mx-auto text-accent mb-4" />
                <SectionTitle>Welcome to the World of APIs</SectionTitle>
                <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
                    Ever wondered how apps on your phone get weather updates, or how you can log in to a website with your Google account? The answer is APIs! Let's demystify them together.
                </p>
            </div>
        </Section>
        
        <Section>
             <SectionTitle>The Restaurant Analogy</SectionTitle>
             <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
                 <div className="flex flex-col items-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.2 }}}>
                        <div className="bg-accent rounded-full p-4 mb-4">
                           <Bot className="w-10 h-10 text-accent-foreground"/>
                        </div>
                    </motion.div>
                    <h3 className="font-bold text-lg mb-2">You (The Client)</h3>
                    <p className="text-muted-foreground">You are at a restaurant, ready to order. You know what you want, but you can't go into the kitchen yourself.</p>
                 </div>
                 <div className="flex flex-col items-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.4 }}}>
                        <div className="bg-accent rounded-full p-4 mb-4">
                           <Share2 className="w-10 h-10 text-accent-foreground"/>
                        </div>
                    </motion.div>
                     <h3 className="font-bold text-lg mb-2">The Waiter (The API)</h3>
                     <p className="text-muted-foreground">The waiter is the intermediary. You give them your order (a request), they take it to the kitchen, and bring back your food (the response).</p>
                 </div>
                 <div className="flex flex-col items-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.6 }}}>
                        <div className="bg-accent rounded-full p-4 mb-4">
                           <Server className="w-10 h-10 text-accent-foreground"/>
                        </div>
                    </motion.div>
                     <h3 className="font-bold text-lg mb-2">The Kitchen (The Server)</h3>
                     <p className="text-muted-foreground">The kitchen has all the ingredients and staff to prepare your meal. It processes the order and prepares the final product.</p>
                 </div>
             </div>
             <p className="text-center mt-8 text-lg max-w-3xl mx-auto">An API (Application Programming Interface) is that waiter, allowing different applications to talk to each other in a structured way.</p>
        </Section>

        <Section>
            <SectionTitle>Anatomy of a Request</SectionTitle>
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
        </Section>
        
        <Section>
            <SectionTitle>Anatomy of a Response</SectionTitle>
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
        </Section>

        <Section className="border-b-0">
            <div className="text-center">
                <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4"/>
                <SectionTitle>You're Ready!</SectionTitle>
                <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-8">
                   That's the core of it! You now understand the fundamental request-response cycle of APIs. The best way to learn is by doing.
                </p>
                <Button size="lg" onClick={() => router.push('/')}>
                    Go to the Sandbox & Start Practicing
                    <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
            </div>
        </Section>

      </main>

      <ApiChatbot />
    </div>
  );
}
