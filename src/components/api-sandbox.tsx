"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger, SidebarContent, SidebarHeader } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { RequestPanel } from '@/components/request-panel';
import { ResponsePanel } from '@/components/response-panel';
import { ApiRequest, ApiResponse, CollectionItem, RequestHistoryItem, HttpMethod, KeyValuePair } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { generateCodeSnippet } from '@/ai/flows/generate-code-snippets';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CodeSnippetViewer } from '@/components/code-snippet-viewer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Code, Terminal } from 'lucide-react';
import { SidebarContent as SandboxSidebarContent } from '@/components/sidebar-content';
import { useLocalStorage } from '@/hooks/use-local-storage';

const generateId = () => {
    if (typeof window !== 'undefined') {
        return Math.random().toString(36).substring(2, 11);
    }
    return '';
};


export function ApiSandbox() {
  const [activeRequest, setActiveRequest] = useState<ApiRequest | null>(null);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [history, setHistory] = useLocalStorage<RequestHistoryItem[]>('api-sandbox-history', []);
  const [collections, setCollections] = useLocalStorage<CollectionItem[]>('api-sandbox-collections', []);

  const [generatedCode, setGeneratedCode] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('cURL');
  const [isCodeGenOpen, setIsCodeGenOpen] = useState(false);
  const [isCodeGenLoading, setIsCodeGenLoading] = useState(false);
  
  useEffect(() => {
    const defaultRequest: ApiRequest = {
      id: generateId(),
      name: 'Untitled Request',
      method: 'GET',
      url: '',
      queryParams: [{ id: generateId(), key: '', value: '', enabled: true }],
      headers: [{ id: generateId(), key: '', value: '', enabled: true }],
      body: '',
      bodyType: 'none',
    };
    setActiveRequest(defaultRequest);
  }, []);


  const updateRequest = (updatedFields: Partial<ApiRequest>) => {
    if (activeRequest) {
      setActiveRequest(prev => prev ? { ...prev, ...updatedFields } : null);
    }
  };

  const handleSelectRequest = (request: ApiRequest) => {
    setActiveRequest(request);
    setResponse(null);
  };

  const handleSendRequest = async () => {
    if (!activeRequest) return;
    
    setLoading(true);
    setResponse(null);
    const startTime = Date.now();

    const url = new URL(activeRequest.url);
    activeRequest.queryParams
      .filter(p => p.enabled && p.key)
      .forEach(p => url.searchParams.append(p.key, p.value));

    const headers = new Headers();
    activeRequest.headers
      .filter(h => h.enabled && h.key)
      .forEach(h => headers.append(h.key, h.value));

    let body: BodyInit | undefined = undefined;
    if (activeRequest.method !== 'GET' && activeRequest.method !== 'HEAD') {
      if (activeRequest.bodyType === 'json') {
        body = activeRequest.body;
        if (!headers.has('Content-Type')) {
          headers.append('Content-Type', 'application/json');
        }
      } else if (activeRequest.bodyType === 'form-urlencoded') {
        body = new URLSearchParams(JSON.parse(activeRequest.body)).toString();
        if (!headers.has('Content-Type')) {
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
        }
      }
    }
    
    try {
      const res = await fetch(url.toString(), {
        method: activeRequest.method,
        headers,
        body,
      });

      const endTime = Date.now();
      const responseData = await res.json();
      const responseSize = JSON.stringify(responseData).length;

      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      const newResponse: ApiResponse = {
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        data: responseData,
        time: endTime - startTime,
        size: responseSize,
      };
      setResponse(newResponse);

      const newHistoryItem: RequestHistoryItem = {
        id: generateId(),
        request: activeRequest,
        response: newResponse,
        timestamp: Date.now(),
      };
      setHistory([newHistoryItem, ...history].slice(0, 50));

    } catch (error: any) {
      const endTime = Date.now();
      const errorResponse: ApiResponse = {
        status: 0,
        statusText: 'Network Error',
        headers: {},
        data: { error: 'Failed to fetch. This might be due to a CORS issue or network problem.', details: error.message },
        time: endTime - startTime,
        size: 0,
      };
      setResponse(errorResponse);
       toast({
        variant: "destructive",
        title: "Request Failed",
        description: "Could not send request. Check the console for CORS errors or network issues.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGenerateCode = async (lang: string) => {
    if (!activeRequest) return;
    setIsCodeGenLoading(true);
    setGeneratedCode(`Generating snippet for ${lang}...`);
    try {
      const result = await generateCodeSnippet({
        method: activeRequest.method,
        url: activeRequest.url,
        headers: JSON.stringify(Object.fromEntries(activeRequest.headers.filter(h => h.enabled).map(h => [h.key, h.value]))),
        body: activeRequest.body,
        codeLanguage: lang.split(' ')[0],
        library: lang.split(' ')[1]?.replace(/[()]/g, ''),
      });
      setGeneratedCode(result.codeSnippet);
    } catch (error) {
      console.error(error);
      setGeneratedCode('Failed to generate code snippet.');
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Could not generate code snippet.',
      });
    } finally {
      setIsCodeGenLoading(false);
    }
  };

  useEffect(() => {
    if (isCodeGenOpen && activeRequest) {
      handleGenerateCode(codeLanguage);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCodeGenOpen, codeLanguage, activeRequest]);

  if (!activeRequest) {
    return null; // Or a loading spinner
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2 justify-between">
               <div className="flex items-center gap-2">
                 <Terminal className="w-6 h-6 text-primary" />
                 <h1 className="text-lg font-semibold group-data-[collapsible=icon]:hidden">API Sandbox</h1>
               </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SandboxSidebarContent
              history={history}
              collections={collections}
              onSelectRequest={handleSelectRequest}
              setCollections={setCollections}
              activeRequestId={activeRequest.id}
            />
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex flex-col overflow-hidden">
          <header className="p-2 border-b flex items-center justify-between gap-2">
            <SidebarTrigger/>
            <h2 className="font-semibold truncate flex-1">{activeRequest.name}</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => {
                const newId = generateId();
                const newRequest = {...activeRequest, id: newId, name: `${activeRequest.name} (Copy)`};
                setActiveRequest(newRequest);
                // Optionally save to collection here
              }}>Save</Button>
              <Dialog open={isCodeGenOpen} onOpenChange={setIsCodeGenOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Code className="mr-2 h-4 w-4" />
                    Generate Code
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Generate Code Snippet</DialogTitle>
                  </DialogHeader>
                  <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cURL">cURL</SelectItem>
                      <SelectItem value="JavaScript (fetch)">JavaScript (fetch)</SelectItem>
                      <SelectItem value="JavaScript (axios)">JavaScript (axios)</SelectItem>
                      <SelectItem value="Python (requests)">Python (requests)</SelectItem>
                    </SelectContent>
                  </Select>
                  <CodeSnippetViewer code={generatedCode} language={codeLanguage.toLowerCase().split(' ')[0]} isLoading={isCodeGenLoading} />
                </DialogContent>
              </Dialog>
            </div>
          </header>
          <div className="flex-1 flex flex-col overflow-y-auto p-4 gap-4">
              <RequestPanel 
                request={activeRequest}
                onUpdateRequest={updateRequest}
                onSend={handleSendRequest}
                loading={loading}
              />
              <ResponsePanel response={response} loading={loading} />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
