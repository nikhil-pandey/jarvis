'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Send, Power } from 'lucide-react';

interface ActionButtonsProps {
  onSubmit: () => void;
  onDisconnect: () => void;
}

export function ActionButtons({ onSubmit, onDisconnect }: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <Button
        onClick={onSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-4 py-2 flex items-center gap-2"
      >
        <Send size={20} />
        <span>Send</span>
      </Button>

      <Button
        variant="destructive"
        onClick={onDisconnect}
        className="text-white h-10 px-4 py-2 flex items-center gap-2"
      >
        <Power size={20} />
        <span>Disconnect</span>
      </Button>
    </div>
  );
} 