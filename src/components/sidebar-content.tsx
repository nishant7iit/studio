"use client";

import { ApiRequest, CollectionItem, RequestHistoryItem } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { History, Folder, FileText, Plus, MoreVertical, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface SidebarContentProps {
  history: RequestHistoryItem[];
  collections: CollectionItem[];
  onSelectRequest: (request: ApiRequest) => void;
  setCollections: (collections: CollectionItem[]) => void;
  activeRequestId: string;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

export function SidebarContent({ history, collections, onSelectRequest, setCollections, activeRequestId }: SidebarContentProps) {

  const handleAddCollection = () => {
    const newCollection: CollectionItem = {
      id: generateId(),
      name: 'New Collection',
      type: 'folder',
      children: [],
    };
    setCollections([...collections, newCollection]);
  };
  
  const handleRemoveCollection = (id: string) => {
    setCollections(collections.filter(c => c.id !== id));
  };
  
  const handleAddRequestToCollection = (collectionId: string) => {
     const newRequest: ApiRequest = {
        id: generateId(),
        name: 'New Request',
        method: 'GET',
        url: '',
        queryParams: [],
        headers: [],
        body: '',
        bodyType: 'none',
      };
      
      const newCollections = collections.map(c => {
        if(c.id === collectionId) {
            return {
                ...c,
                children: [...(c.children || []), { id: newRequest.id, name: newRequest.name, type: 'request', request: newRequest }]
            }
        }
        return c;
      });

      setCollections(newCollections);
  };


  const renderCollection = (item: CollectionItem) => (
    <AccordionItem value={item.id} key={item.id} className="border-none">
       <AccordionTrigger className="hover:no-underline hover:bg-sidebar-accent rounded-md px-2 py-1.5 group">
         <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-accent"/>
            <span className="text-sm font-medium">{item.name}</span>
         </div>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                 <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                    <MoreVertical className="w-4 h-4" />
                 </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleAddRequestToCollection(item.id)}>
                    <Plus className="w-4 h-4 mr-2" /> Add Request
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRemoveCollection(item.id)} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
       </AccordionTrigger>
       <AccordionContent className="pl-4 pt-1">
         <div className="space-y-1">
          {item.children?.map(child => (
            <div key={child.id} data-active={activeRequestId === child.id} className="group flex items-center justify-between rounded-md text-sm font-medium hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent">
                <button onClick={() => child.request && onSelectRequest(child.request)} className="flex items-center gap-2 p-2 flex-1">
                    <span className={`font-mono text-xs w-12 text-left ${
                      child.request?.method === 'GET' ? 'text-green-500' :
                      child.request?.method === 'POST' ? 'text-orange-500' :
                      child.request?.method === 'PUT' ? 'text-blue-500' :
                      child.request?.method === 'DELETE' ? 'text-red-500' : ''
                    }`}>{child.request?.method}</span>
                    <span>{child.name}</span>
                </button>
            </div>
          ))}
         </div>
       </AccordionContent>
    </AccordionItem>
  );

  return (
    <Tabs defaultValue="collections" className="w-full p-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:border-t">
       <div className="group-data-[collapsible=icon]:hidden">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
       </div>
        <TabsContent value="collections" className="mt-2 group-data-[collapsible=icon]:hidden">
            <div className="flex justify-end mb-2">
                <Button variant="ghost" size="sm" onClick={handleAddCollection}>
                    <Plus className="w-4 h-4 mr-2"/>
                    New Collection
                </Button>
            </div>
            <Accordion type="multiple" className="w-full space-y-1">
                {collections.map(renderCollection)}
            </Accordion>
        </TabsContent>
        <TabsContent value="history" className="mt-2 group-data-[collapsible=icon]:hidden">
            <div className="space-y-1">
            {history.map(item => (
                <button
                    key={item.id}
                    onClick={() => onSelectRequest(item.request)}
                    data-active={activeRequestId === item.request.id}
                    className="w-full text-left p-2 rounded-md hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent"
                >
                    <div className="flex items-center gap-2">
                        <span className={`font-mono text-xs w-12 text-left ${
                        item.request.method === 'GET' ? 'text-green-500' :
                        item.request.method === 'POST' ? 'text-orange-500' :
                        item.request.method === 'PUT' ? 'text-blue-500' :
                        item.request.method === 'DELETE' ? 'text-red-500' : ''
                        }`}>{item.request.method}</span>
                        <span className="truncate flex-1">{item.request.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 pl-[56px]">
                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                    </div>
                </button>
            ))}
            </div>
        </TabsContent>
    </Tabs>
  )
}
