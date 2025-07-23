"use client";

import { ApiResponse } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CodeSnippetViewer } from './code-snippet-viewer';
import { Table, TableBody, TableCell, TableRow } from './ui/table';
import { Clock, HardDrive, Server } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface ResponsePanelProps {
  response: ApiResponse | null;
  loading: boolean;
}

export function ResponsePanel({ response, loading }: ResponsePanelProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Response</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-8 w-1/4" />
            </div>
            <Skeleton className="h-6 w-[120px]" />
            <Skeleton className="h-40 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!response) {
    return (
      <Card className="flex-1 flex items-center justify-center min-h-[200px]">
        <div className="text-center text-muted-foreground">
          <Server className="mx-auto h-12 w-12" />
          <p className="mt-4">Send a request to see the response here</p>
        </div>
      </Card>
    );
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-500';
    if (status >= 400 && status < 500) return 'bg-yellow-500';
    if (status >= 500) return 'bg-red-500';
    return 'bg-gray-500';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Response</CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${getStatusColor(response.status)}`}></span>
              Status: {response.status} {response.statusText}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> Time: {response.time}ms
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <HardDrive className="w-4 h-4" /> Size: {(response.size / 1024).toFixed(2)} KB
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="body">
          <TabsList>
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>
          <TabsContent value="body" className="mt-4">
            <CodeSnippetViewer
              code={JSON.stringify(response.data, null, 2)}
              language="json"
            />
          </TabsContent>
          <TabsContent value="headers" className="mt-4">
            <Table>
              <TableBody>
                {Object.entries(response.headers).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium font-code">{key}</TableCell>
                    <TableCell className="font-code">{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
