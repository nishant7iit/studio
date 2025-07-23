
"use client";

import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, User, FileText, Server, CheckCircle } from 'lucide-react';
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

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-center mb-8 text-primary">{children}</motion.h2>
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
            <Button variant="ghost" onClick={() => router.push('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sandbox
            </Button>
          <h1 className="text-xl md:text-2xl font-bold text-primary">API Learning Center</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="text-center">
                <motion.div variants={itemVariants}>
                    <BookOpen className="w-16 h-16 mx-auto text-accent mb-4" />
                </motion.div>
                <CardTitle className="text-4xl">Welcome to the World of APIs</CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.p variants={itemVariants} initial="hidden" animate="visible" className="max-w-3xl mx-auto text-lg text-muted-foreground text-center">
                Ever wondered how apps on your phone get weather updates, or how you can log in to a website with your Google account? The answer is APIs! Let's demystify them together.
            </motion.p>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
            <CardHeader>
                <SectionTitle>The Restaurant Analogy</SectionTitle>
            </CardHeader>
            <CardContent>
             <motion.div 
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-4"
             >
                <motion.div variants={itemVariants} className="flex flex-col items-center p-6 bg-card rounded-lg w-full md:w-2/3">
                    <div className="bg-accent rounded-full p-4 mb-4">
                       <User className="w-10 h-10 text-accent-foreground"/>
                    </div>
                    <h3 className="font-bold text-xl mb-2">You (The Client)</h3>
                    <p className="text-muted-foreground">You are at a restaurant, ready to order from the menu. You know what you want, but you can't go into the kitchen yourself. You need to make a structured <span className="font-bold text-primary">Request</span>.</p>
                </motion.div>

                <motion.svg width="50" height="100" viewBox="0 0 50 100" variants={itemVariants}>
                    <motion.path d="M 25 0 V 80" stroke="hsl(var(--primary))" strokeWidth="2" variants={arrowVariants} />
                    <motion.path d="M 20 70 L 25 80 L 30 70" stroke="hsl(var(--primary))" fill="transparent" strokeWidth="2" variants={arrowVariants}/>
                    <text x="30" y="45" fill="hsl(var(--muted-foreground))" fontSize="12" textAnchor="start">Request</text>
                </motion.svg>
                
                <motion.div variants={itemVariants} className="flex flex-col items-center p-6 bg-card rounded-lg w-full md:w-2/3">
                   <div className="bg-accent rounded-full p-4 mb-4">
                      <FileText className="w-10 h-10 text-accent-foreground"/>
                   </div>
                    <h3 className="font-bold text-xl mb-2">The Menu (The API)</h3>
                    <p className="text-muted-foreground">The menu provides a list of dishes you can order, along with a description of each dish. The API is like a menu that provides a list of defined requests that one can make.</p>
                </motion.div>

                <motion.svg width="50" height="100" viewBox="0 0 50 100" variants={itemVariants}>
                    <motion.path d="M 25 0 V 80" stroke="hsl(var(--primary))" strokeWidth="2" variants={arrowVariants} />
                    <motion.path d="M 20 70 L 25 80 L 30 70" stroke="hsl(var(--primary))" fill="transparent" strokeWidth="2" variants={arrowVariants}/>
                </motion.svg>

                <motion.div variants={itemVariants} className="flex flex-col items-center p-6 bg-card rounded-lg w-full md:w-2/3">
                    <div className="bg-accent rounded-full p-4 mb-4">
                       <Server className="w-10 h-10 text-accent-foreground"/>
                    </div>
                    <h3 className="font-bold text-xl mb-2">The Kitchen (The Server)</h3>
                    <p className="text-muted-foreground">The kitchen receives the order, prepares the food, and sends it out. The server processes the request, retrieves the data, and sends back a <span className="font-bold text-green-500">Response</span>.</p>
                </motion.div>

                <motion.svg width="50" height="100" viewBox="0 0 50 100" variants={itemVariants}>
                    <motion.path d="M 25 100 V 20" stroke="hsl(var(--green-500))" strokeWidth="2"  className="stroke-green-500" variants={arrowVariants} />
                    <motion.path d="M 20 30 L 25 20 L 30 30" stroke="hsl(var(--green-500))" className="stroke-green-500" fill="transparent" strokeWidth="2" variants={arrowVariants}/>
                    <text x="30" y="65" fill="hsl(var(--muted-foreground))" fontSize="12" textAnchor="start">Response</text>
                </motion.svg>

                 <motion.div variants={itemVariants} className="flex flex-col items-center p-6 bg-card rounded-lg w-full md:w-2/3">
                   <div className="bg-accent rounded-full p-4 mb-4">
                      <User className="w-10 h-10 text-accent-foreground"/>
                   </div>
                    <h3 className="font-bold text-xl mb-2">You Get Your Food</h3>
                    <p className="text-muted-foreground">Your food is delivered to your table! The application receives the data it requested and can display it to the user.</p>
                </motion.div>

             </motion.div>
             <p className="text-center mt-12 text-lg max-w-3xl mx-auto">An <span className="font-bold">API</span> (Application Programming Interface) is that menu, a contract that allows different applications to talk to each other in a structured and predictable way.</p>
            </CardContent>
        </Card>

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
                    <Button size="lg" onClick={() => router.push('/')}>
                        Go to the Sandbox & Start Practicing
                        <ArrowLeft className="ml-2 h-4 w-4" />
                    </Button>
                </motion.div>
            </div>
        </Section>

      </main>

      <ApiChatbot />
    </div>
  );
}
