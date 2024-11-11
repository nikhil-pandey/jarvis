'use client';

import React from 'react';
import { ConversationPanel } from '../conversation/ConversationPanel';
import { AutoScrollContainer } from '../landing/AutoScrollContainer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { ChatThread } from '@/hooks/useChatHistory';

interface HistoryViewProps {
  thread: ChatThread | null;
  onClose: () => void;
}

export function HistoryView({ thread, onClose }: HistoryViewProps) {
  if (!thread) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a conversation from history to view
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-none p-2 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-200">{thread.title}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 min-h-0">
        <AutoScrollContainer>
          <div className="p-4">
            <ConversationPanel
              items={thread.items}
              readOnly
            />
          </div>
        </AutoScrollContainer>
      </div>
    </div>
  );
} 