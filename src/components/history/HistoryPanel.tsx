'use client';

import React from 'react';
import { ChatThread, useChatHistory } from '@/hooks/useChatHistory';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HistoryPanelProps {
  onThreadSelect: (thread: ChatThread) => void;
}

export function HistoryPanel({ onThreadSelect }: HistoryPanelProps) {
  const { threads, deleteThread } = useChatHistory();

  return (
    <div className="flex flex-col h-full bg-gray-950">
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {threads.map((thread) => (
          <div
            key={thread.id}
            className="flex items-center justify-between p-2 rounded-md border border-gray-800 bg-gray-900/20 hover:bg-gray-800/50 transition-colors cursor-pointer group"
            onClick={() => onThreadSelect(thread)}
          >
            <div className="flex-1 min-w-0">
              <h4 className="text-sm text-gray-200 truncate">{thread.title}</h4>
              <p className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(thread.timestamp), { addSuffix: true })}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.id);
              }}
            >
              <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-400" />
            </Button>
          </div>
        ))}
        {threads.length === 0 && (
          <div className="text-xs text-gray-400 py-1 px-2 bg-gray-900/50 rounded-md border border-gray-800">
            No chat history
          </div>
        )}
      </div>
    </div>
  );
} 