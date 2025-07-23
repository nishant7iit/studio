"use client";

import { ApiRequest, HttpMethod } from '@/lib/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { KeyValueEditor } from './key-value-editor';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RequestPanelProps {
  request: ApiRequest;
  onUpdateRequest: (updatedFields: Partial<ApiRequest>) => void;
  onSend: () => void;
  loading: boolean;
}

export function RequestPanel({ request, onUpdateRequest, onSend, loading }: RequestPanelProps) {
  const handleMethodChange = (method: HttpMethod) => {
    onUpdateRequest({ method });
  };
  
  const handleBodyTypeChange = (bodyType: 'none' | 'json' | 'form-urlencoded') => {
    onUpdateRequest({ bodyType });
  };

  const getMethodClass = (method: HttpMethod) => {
    switch (method) {
      case 'GET': return 'text-green-500';
      case 'POST': return 'text-orange-500';
      case 'PUT': return 'text-blue-500';
      case 'PATCH': return 'text-purple-500';
      case 'DELETE': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Card className="shadow-md">
      <CardContent className="p-0">
        <div className="flex gap-0">
          <Select value={request.method} onValueChange={handleMethodChange}>
            <SelectTrigger className={cn(
              "w-[120px] rounded-r-none border-r-0 focus:ring-0 focus:ring-offset-0",
              getMethodClass(request.method)
            )}>
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="PATCH">PATCH</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
              <SelectItem value="HEAD">HEAD</SelectItem>
              <SelectItem value="OPTIONS">OPTIONS</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-1 relative">
            <Input
                placeholder="https://api.example.com/data"
                value={request.url}
                onChange={e => onUpdateRequest({ url: e.target.value })}
                className="font-code rounded-l-none pr-28"
            />
             <Button onClick={onSend} disabled={loading} className="w-[100px] absolute right-1 top-1/2 -translate-y-1/2 h-8">
              {loading ? <Loader2 className="animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Send
            </Button>
          </div>
        </div>

        <div className="p-4">
          <Tabs defaultValue="params" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="params">Query Params</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="body">Body</TabsTrigger>
            </TabsList>
            <TabsContent value="params" className="mt-4">
              <KeyValueEditor
                value={request.queryParams}
                onChange={v => onUpdateRequest({ queryParams: v })}
              />
            </TabsContent>
            <TabsContent value="headers" className="mt-4">
              <KeyValueEditor
                value={request.headers}
                onChange={v => onUpdateRequest({ headers: v })}
              />
            </TabsContent>
            <TabsContent value="body" className="mt-4">
              <div className="space-y-4">
                <Select value={request.bodyType} onValueChange={handleBodyTypeChange} disabled={request.method === 'GET' || request.method === 'HEAD'}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Body Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="form-urlencoded">Form URL Encoded</SelectItem>
                  </SelectContent>
                </Select>
                {request.bodyType === 'json' && (
                  <Textarea
                    placeholder='{ "key": "value" }'
                    value={request.body}
                    onChange={e => onUpdateRequest({ body: e.target.value })}
                    className="font-code min-h-[200px]"
                    disabled={request.method === 'GET' || request.method === 'HEAD'}
                  />
                )}
                {request.bodyType === 'form-urlencoded' && (
                   <Textarea
                    placeholder='{ "key1": "value1", "key2": "value2" }'
                    value={request.body}
                    onChange={e => onUpdateRequest({ body: e.target.value })}
                    className="font-code min-h-[200px]"
                    disabled={request.method === 'GET' || request.method === 'HEAD'}
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
