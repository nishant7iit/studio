"use client";

import { ApiResponse } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableRow } from './ui/table';
import { Clock, HardDrive, Server } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { ScrollArea } from './ui/scroll-area';
import { JsonViewer } from './json-viewer';

interface ResponsePanelProps {
  response: ApiResponse | null;
  loading: boolean;
}

export function ResponsePanel({ response, loading }: ResponsePanelProps) {
  if (loading) {
    return (
      <Card className="h-full">
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
      <Card className="h-full flex items-center justify-center min-h-[200px]">
        <div className="text-center text-muted-foreground animate-pulse">
          <Server className="mx-auto h-12 w-12" />
          <p className="mt-4 font-medium">Send a request to see the response</p>
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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Response</CardTitle>
          <div className="flex items-center gap-4 text-xs">
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
      <CardContent className="flex-1 flex flex-col min-h-0">
        <Tabs defaultValue="body" className="flex-1 flex flex-col">
          <TabsList>
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>
          <TabsContent value="body" className="mt-4 flex-1 min-h-0">
            <ScrollArea className="h-full">
              <JsonViewer data={response.data} />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="headers" className="mt-4 flex-1 min-h-0">
            <ScrollArea className="h-full rounded-md border">
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
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
