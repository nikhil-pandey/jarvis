'use client';

import React, { useState, useCallback } from 'react';
import { LeftSidebar } from './LeftSidebar';
import { ChatInterface } from '../chat/ChatInterface';
import { ToolSettingsDialog } from '../tools/ToolSettingsDialog';
import { SettingsButton } from './SettingsButton';
import { useSettings } from '@/hooks/useSettings';
import { useAudioChat } from '@/hooks/useAudioChat';
import { ToolsProvider } from '@/contexts/ToolsContext';
import { HistoryView } from '../history/HistoryView';
import type { ConversationItem } from '@/types/conversation';
import type { ChatThread } from '@/hooks/useChatHistory';

function ChatApp() {
  const { settings, updateSettings } = useSettings();
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);

  const {
    isConnected,
    isRecording,
    turnEndType,
    startTime,
    items,
    events,
    connect,
    disconnect,
    startRecording,
    stopRecording,
    deleteItem,
    sendTextMessage,
    addTool,
    removeTool,
  } = useAudioChat(settings.connection, settings.chat);

  const handleTurnEndTypeChange = useCallback(async (type: 'server_vad' | 'none') => {
    updateSettings({
      chat: {
        ...settings.chat,
        turn_detection: type === 'server_vad' ? {type: 'server_vad'} : null
      }
    });
  }, [settings.chat, updateSettings]);

  return (
    <ToolsProvider 
      onToolEnabled={addTool}
      onToolDisabled={removeTool}
    >
      <div className="h-screen flex flex-col bg-gray-950 text-gray-100">
        <header className="h-16 flex-none bg-gray-900 border-b border-gray-800">
          <div className="h-full w-full px-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Jarvis
            </h1>
            <SettingsButton
              settings={settings}
              onSettingsChange={updateSettings}
            />
          </div>
        </header>

        <div className="flex-1 flex min-h-0">
          <LeftSidebar
            events={events}
            startTime={startTime}
            onToolSettingsClick={setSelectedToolId}
            onThreadSelect={setSelectedThread}
          />

          <ToolSettingsDialog
            toolId={selectedToolId}
            open={selectedToolId !== null}
            onOpenChange={(open) => !open && setSelectedToolId(null)}
          />

          <div className="flex-1 flex flex-col min-w-0">
            {selectedThread ? (
              <HistoryView 
                thread={selectedThread} 
                onClose={() => setSelectedThread(null)}
              />
            ) : (
              <ChatInterface
                items={items as ConversationItem[]}
                isConnected={isConnected}
                isRecording={isRecording}
                turnEndType={turnEndType}
                onTextSubmit={sendTextMessage}
                onConnect={connect}
                onDisconnect={disconnect}
                onRecordingStart={startRecording}
                onRecordingStop={stopRecording}
                onTurnEndTypeChange={handleTurnEndTypeChange}
                onDeleteItem={deleteItem}
              />
            )}
          </div>
        </div>
      </div>
    </ToolsProvider>
  );
}

export default ChatApp;