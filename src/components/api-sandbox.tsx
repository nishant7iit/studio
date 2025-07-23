
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
import { Code, Terminal, AlertTriangle, X, Save } from 'lucide-react';
import { SidebarContent as SandboxSidebarContent } from '@/components/sidebar-content';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const generateId = (): string => {
    if (typeof window === 'undefined') {
      // Return a placeholder or handle server-side case
      return `ssr_id_${Math.random()}`;
    }
    return `id_${Math.random().toString(36).substring(2, 11)}`;
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
  const [showCorsWarning, setShowCorsWarning] = useState(false);

  useEffect(() => {
    // Only run on the client
    if (typeof window !== 'undefined' && !activeRequest) {
        const defaultRequest: ApiRequest = {
          id: generateId(),
          name: 'Untitled Request',
          method: 'GET',
          url: 'https://jsonplaceholder.typicode.com/todos/1',
          queryParams: [{ id: generateId(), key: '', value: '', enabled: true }],
          headers: [{ id: generateId(), key: 'Content-Type', value: 'application/json', enabled: true }],
          body: '',
          bodyType: 'none',
        };
        setActiveRequest(defaultRequest);
    }
  }, [activeRequest]);


  const updateRequest = (updatedFields: Partial<ApiRequest>) => {
    if (activeRequest) {
      setActiveRequest(prev => prev ? { ...prev, ...updatedFields } : null);
    }
  };

  const handleSelectRequest = (request: ApiRequest) => {
    setActiveRequest(request);
    setResponse(null);
  };
  
  const handleSaveRequest = () => {
    if (!activeRequest) return;

    let isNewToCollections = true;
    const updatedCollections = collections.map(collection => {
      const requestIndex = collection.children?.findIndex(child => child.id === activeRequest.id);
      if (requestIndex !== -1 && requestIndex !== undefined && collection.children) {
        isNewToCollections = false;
        const updatedChildren = [...collection.children];
        updatedChildren[requestIndex] = {
            id: activeRequest.id,
            name: activeRequest.name,
            type: 'request',
            request: activeRequest,
        };
        return { ...collection, children: updatedChildren };
      }
      return collection;
    });

    if (isNewToCollections) {
      toast({
        title: "Request not in a collection",
        description: "Save this request to a new or existing collection first.",
      });
      // Optionally, open a dialog to select/create a collection.
      // For now, we just notify.
    } else {
       setCollections(updatedCollections);
       toast({
        title: "Request Saved",
        description: `"${activeRequest.name}" has been updated.`,
      });
    }
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };


  const handleSendRequest = async () => {
    if (!activeRequest) return;
    
    if (!validateUrl(activeRequest.url)) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid URL before sending a request.",
      });
      return;
    }
    
    setLoading(true);
    setResponse(null);
    setShowCorsWarning(false);
    const startTime = Date.now();
    
    try {
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
        if (activeRequest.bodyType === 'json' && activeRequest.body) {
          body = activeRequest.body;
          if (!headers.has('Content-Type')) {
            headers.append('Content-Type', 'application/json');
          }
        } else if (activeRequest.bodyType === 'form-urlencoded' && activeRequest.body) {
          const bodyParams = JSON.parse(activeRequest.body);
          const urlSearchParams = new URLSearchParams();
          for(const key in bodyParams) {
              urlSearchParams.append(key, bodyParams[key]);
          }
          body = urlSearchParams;
          if (!headers.has('Content-Type')) {
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
          }
        }
      }

      const res = await fetch(url.toString(), {
        method: activeRequest.method,
        headers,
        body,
        mode: 'cors',
      });

      const endTime = Date.now();
      
      const responseBody = await res.text();
      const responseSize = new Blob([responseBody]).size;

      let responseData;
      try {
        responseData = JSON.parse(responseBody);
      } catch (e) {
        responseData = responseBody;
      }

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
        raw: responseBody,
      };
      setResponse(newResponse);

      const newHistoryItem: RequestHistoryItem = {
        id: `hist_${generateId()}`,
        request: activeRequest,
        response: newResponse,
        timestamp: Date.now(),
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 50));

    } catch (error: any) {
      const endTime = Date.now();
      const isCorsError = error instanceof TypeError && (error.message.includes('Failed to fetch') || error.message.includes('CORS'));
      if (isCorsError) {
        setShowCorsWarning(true);
      }
      const errorResponse: ApiResponse = {
        status: 0,
        statusText: 'Client Error',
        headers: {},
        data: { error: 'Failed to fetch. This might be due to a CORS issue, network problem, or invalid URL.', details: error.message },
        time: endTime - startTime,
        size: 0,
        raw: error.message,
      };
      setResponse(errorResponse);
       toast({
        variant: "destructive",
        title: "Request Failed",
        description: error.message || "Could not send request. Check the console for more details.",
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
        headers: JSON.stringify(Object.fromEntries(activeRequest.headers.filter(h => h.enabled && h.key).map(h => [h.key, h.value]))),
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
  }, [isCodeGenOpen, codeLanguage]);

  if (!activeRequest) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Terminal className="w-8 h-8 animate-spin" />
        </div>
    );
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
          <header className="p-2 border-b flex items-center justify-between gap-2 shrink-0">
            <SidebarTrigger/>
            <h2 className="font-semibold truncate flex-1">{activeRequest.name}</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSaveRequest}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Dialog open={isCodeGenOpen} onOpenChange={setIsCodeGenOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Code className="mr-2 h-4 w-4" />
                    Code
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
          
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 overflow-hidden">
            <div className="flex flex-col overflow-y-auto">
                <RequestPanel 
                    request={activeRequest}
                    onUpdateRequest={updateRequest}
                    onSend={handleSendRequest}
                    loading={loading}
                />
                {showCorsWarning && (
                    <div className="pt-4">
                        <Alert variant="destructive" className="relative">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>CORS Error</AlertTitle>
                            <AlertDescription>
                                The request was blocked by the browser's CORS policy. This is a security feature to prevent cross-origin requests. You can often resolve this by using a CORS proxy or ensuring the server is configured to allow requests from this origin.
                            </AlertDescription>
                            <button onClick={() => setShowCorsWarning(false)} className="absolute top-2 right-2">
                                <X className="h-4 w-4" />
                            </button>
                        </Alert>
                    </div>
                )}
            </div>

            <div className="flex flex-col overflow-y-auto h-full">
              <ResponsePanel response={response} loading={loading} />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
