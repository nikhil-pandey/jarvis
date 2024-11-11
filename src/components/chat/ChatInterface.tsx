import React from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AutoScrollContainer } from '../landing/AutoScrollContainer';
import { ConversationPanel } from '../conversation/ConversationPanel';
import { ControlPanel } from './ControlPanel';
import type { ChatInterfaceProps } from '@/types/components';

export function ChatInterface({
  items,
  isConnected,
  isRecording,
  turnEndType,
  onTextSubmit,
  onConnect,
  onDisconnect,
  onRecordingStart,
  onRecordingStop,
  onTurnEndTypeChange,
  onDeleteItem
}: ChatInterfaceProps) {
  if (!isConnected) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-300 mb-4">
            Connect to start chatting
          </h2>
          <Button
            variant="default"
            onClick={onConnect}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
          >
            <Zap className="mr-2 h-6 w-6" />
            Connect to Jarvis
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 min-h-0">
        <AutoScrollContainer>
          <div className="p-4">
            <ConversationPanel
              items={items}
              onDeleteItem={onDeleteItem}
            />
          </div>
        </AutoScrollContainer>
      </div>

      <div className="flex-none border-t border-gray-800">
        <ControlPanel
          isConnected={isConnected}
          isRecording={isRecording}
          turnEndType={turnEndType}
          onTextSubmit={onTextSubmit}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
          onRecordingStart={onRecordingStart}
          onRecordingStop={onRecordingStop}
          onTurnEndTypeChange={onTurnEndTypeChange}
        />
      </div>
    </>
  );
} 