
"use client";

import { ApiRequest, CollectionItem, RequestHistoryItem, Environment } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { History, Folder, Plus, MoreVertical, Trash2, FilePlus, Edit, X, Globe } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useState } from "react";
import { Input } from "./ui/input";

interface SidebarContentProps {
  history: RequestHistoryItem[];
  collections: CollectionItem[];
  environments: Environment[];
  onSelectRequest: (request: ApiRequest) => void;
  setCollections: (collections: CollectionItem[] | ((prev: CollectionItem[]) => CollectionItem[])) => void;
  setEnvironments: (environments: Environment[] | ((prev: Environment[]) => Environment[])) => void;
  activeRequestId: string;
}

const generateId = (prefix: string = 'id') => `${prefix}_${Math.random().toString(36).substring(2, 11)}`;

export function SidebarContent({ 
  history, 
  collections, 
  environments, 
  onSelectRequest, 
  setCollections, 
  setEnvironments, 
  activeRequestId 
}: SidebarContentProps) {
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [collectionName, setCollectionName] = useState("");

  const handleAddCollection = () => {
    const newCollection: CollectionItem = {
      id: generateId('coll'),
      name: 'New Collection',
      type: 'folder',
      children: [],
    };
    setCollections(prev => [...prev, newCollection]);
  };
  
  const handleRemoveCollection = (id: string) => {
    setCollections(collections.filter(c => c.id !== id));
  };
  
  const handleStartEditing = (collection: CollectionItem) => {
    setEditingCollectionId(collection.id);
    setCollectionName(collection.name);
  };
  
  const handleSaveCollectionName = (id: string) => {
    setCollections(prev => prev.map(c => c.id === id ? { ...c, name: collectionName } : c));
    setEditingCollectionId(null);
  };

  const handleAddRequestToCollection = (collectionId: string) => {
     const newRequest: ApiRequest = {
        id: generateId('req'),
        name: 'New Request',
        method: 'GET',
        url: '',
        queryParams: [],
        headers: [],
        body: '',
        bodyType: 'none',
      };
      
      setCollections((prevCollections: CollectionItem[]) => prevCollections.map(c => {
        if(c.id === collectionId) {
            return {
                ...c,
                children: [...(c.children || []), { id: newRequest.id, name: newRequest.name, type: 'request', request: newRequest }]
            }
        }
        return c;
      }));
  };

  const handleRemoveRequest = (collectionId: string, requestId: string) => {
    setCollections((prevCollections: CollectionItem[]) => prevCollections.map(c => {
        if (c.id === collectionId) {
            return {
                ...c,
                children: c.children?.filter(child => child.id !== requestId)
            }
        }
        return c;
    }));
  };
  
  const handleAddEnvironment = () => {
    const newEnvironment: Environment = {
      id: generateId('env'),
      name: 'New Environment',
      variables: [],
    };
    setEnvironments(prev => [...prev, newEnvironment]);
  };
  
  const handleRemoveEnvironment = (id: string) => {
    setEnvironments(prev => prev.filter(env => env.id !== id));
  };


  const getMethodClass = (method?: string) => {
    switch (method) {
        case 'GET': return 'text-green-600';
        case 'POST': return 'text-orange-500';
        case 'PUT': return 'text-blue-500';
        case 'PATCH': return 'text-purple-500';
        case 'DELETE': return 'text-red-500';
        default: return 'text-gray-400';
    }
  };


  const renderCollection = (item: CollectionItem) => (
    <AccordionItem value={item.id} key={item.id} className="border-none">
        <div className="flex items-center group hover:bg-sidebar-accent rounded-md">
            <AccordionTrigger className="hover:no-underline px-2 py-1.5 flex-1">
                <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-accent"/>
                    {editingCollectionId === item.id ? (
                      <Input 
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                        onBlur={() => handleSaveCollectionName(item.id)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSaveCollectionName(item.id)}}
                        className="h-7 text-sm"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                </div>
            </AccordionTrigger>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="icon" className="h-6 w-6 mr-1 opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4" />
                     </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleAddRequestToCollection(item.id)}>
                        <FilePlus className="w-4 h-4 mr-2" /> Add Request
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStartEditing(item)}>
                        <Edit className="w-4 h-4 mr-2" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRemoveCollection(item.id)} className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Collection
                    </DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>
       </div>
       <AccordionContent className="pl-4 pt-1">
         <div className="space-y-1">
          {item.children?.map(child => (
            <div key={child.id} data-active={activeRequestId === child.id} className="group flex items-center justify-between rounded-md text-sm font-medium hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent">
                <button onClick={() => child.request && onSelectRequest(child.request)} className="flex items-center gap-2 p-2 flex-1 text-left">
                    <span className={`font-mono text-xs w-12 text-left font-bold ${getMethodClass(child.request?.method)}`}>
                        {child.request?.method}
                    </span>
                    <span className="truncate flex-1">{child.name}</span>
                </button>
                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveRequest(item.id, child.id)}>
                    <X className="w-3 h-3 text-destructive" />
                </Button>
            </div>
          ))}
          {(!item.children || item.children.length === 0) && (
              <p className="text-xs text-muted-foreground p-2">No requests in this collection.</p>
          )}
         </div>
       </AccordionContent>
    </AccordionItem>
  );

  return (
    <Tabs defaultValue="collections" className="w-full p-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:border-t">
       <div className="group-data-[collapsible=icon]:hidden">
        <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="environments">Environments</TabsTrigger>
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
        <TabsContent value="environments" className="mt-2 group-data-[collapsible=icon]:hidden">
           <div className="flex justify-end mb-2">
                <Button variant="ghost" size="sm" onClick={handleAddEnvironment}>
                    <Plus className="w-4 h-4 mr-2"/>
                    New Environment
                </Button>
            </div>
            <div className="space-y-1">
                {environments.map(env => (
                    <div key={env.id} className="group flex items-center justify-between rounded-md text-sm font-medium hover:bg-sidebar-accent">
                        <button className="flex items-center gap-2 p-2 flex-1 text-left">
                            <Globe className="w-4 h-4 text-accent"/>
                            <span className="truncate flex-1">{env.name}</span>
                        </button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveEnvironment(env.id)}>
                            <X className="w-3 h-3 text-destructive" />
                        </Button>
                    </div>
                ))}
            </div>
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
                        <span className={`font-mono text-xs w-12 text-left font-bold ${getMethodClass(item.request.method)}`}>
                            {item.request.method}
                        </span>
                        <span className="truncate flex-1">{item.request.name || item.request.url}</span>
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

