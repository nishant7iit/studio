
"use client";

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { ApiChatbot } from './api-chatbot';

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
          <h1 className="text-xl md:text-2xl font-bold text-primary">API Learning Center</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* The new 10-part implementation will be built here incrementally. */}
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Under Construction</h2>
            <p className="text-muted-foreground">A new, interactive learning experience is being built. Stay tuned!</p>
        </div>
      </main>

      <ApiChatbot />
    </div>
  );
}
