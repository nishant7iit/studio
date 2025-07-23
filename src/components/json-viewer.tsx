"use client";

import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface JsonViewerProps {
  data: any;
}

const JsonNode: React.FC<{ nodeKey: string, value: any, isRoot?: boolean }> = ({ nodeKey, value, isRoot = false }) => {
  const [isExpanded, setIsExpanded] = useState(isRoot);
  const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
  const isArray = Array.isArray(value);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const renderValue = () => {
    if (typeof value === 'string') return <span className="text-green-500">"{value}"</span>;
    if (typeof value === 'number') return <span className="text-blue-500">{value}</span>;
    if (typeof value === 'boolean') return <span className="text-purple-500">{String(value)}</span>;
    if (value === null) return <span className="text-gray-500">null</span>;
    return null;
  };

  if (isObject || isArray) {
    const braceOpen = isArray ? '[' : '{';
    const braceClose = isArray ? ']' : '}';
    const entries = Object.entries(value);

    return (
      <div className="font-code">
        <div className="flex items-center cursor-pointer" onClick={toggleExpand}>
          {entries.length > 0 && (
            isExpanded ? <ChevronDown className="w-4 h-4 mr-1 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 mr-1 flex-shrink-0" />
          )}
          <span className="text-gray-600 dark:text-gray-400">{nodeKey}:</span>
          <span className="ml-1">{braceOpen}</span>
          {!isExpanded && <span className="ml-1 text-gray-500">...</span>}
          {!isExpanded && <span>{braceClose}</span>}
        </div>
        {isExpanded && (
          <div className="pl-6 border-l border-gray-200 dark:border-gray-700 ml-2">
            {entries.map(([key, val]) => (
              <JsonNode key={key} nodeKey={key} value={val} />
            ))}
            <div>{braceClose}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="font-code flex">
      <span className="text-gray-600 dark:text-gray-400 mr-1">{nodeKey}:</span>
      {renderValue()}
    </div>
  );
};


export const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  if (typeof data !== 'object' || data === null) {
    return <pre className="p-4 text-sm bg-secondary rounded-md"><code className="font-code">{String(data)}</code></pre>;
  }

  return (
    <div className="p-4 bg-secondary rounded-md">
       <JsonNode nodeKey="Response" value={data} isRoot={true} />
    </div>
  );
};
