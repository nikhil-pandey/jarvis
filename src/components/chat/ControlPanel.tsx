'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import type { ControlPanelProps } from '@/types/components';
import { TextInput } from './TextInput';
import { ActionButtons } from '../landing/ActionButtons';

export function ControlPanel({
  isConnected,
  isRecording,
  turnEndType,
  onTextSubmit,
  onConnect,
  onDisconnect,
  onRecordingStart,
  onRecordingStop,
  onTurnEndTypeChange,
}: ControlPanelProps) {
  const [textInput, setTextInput] = useState('');
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const trimmedText = textInput.trim();
    if (trimmedText) {
      onTextSubmit(trimmedText);
      setTextInput('');
    }
  };

  const handleVadMicClick = () => {
    if (isRecording) {
      onRecordingStop();
    } else {
      onRecordingStart();
    }
  };

  const isVad = turnEndType === 'server_vad';

  return (
    <div className="border-t border-gray-800 bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {!isConnected ? (
          <Button
            variant="default"
            onClick={onConnect}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Zap className="mr-2 h-4 w-4" />
            Connect
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <TextInput
                textInput={textInput}
                isVad={isVad}
                isRecording={isRecording}
                onTextChange={setTextInput}
                onKeyDown={handleKeyDown}
                onTurnEndTypeChange={onTurnEndTypeChange}
                onVadMicClick={handleVadMicClick}
                onRecordingStart={onRecordingStart}
                onRecordingStop={onRecordingStop}
              />
              <ActionButtons
                onSubmit={handleSubmit}
                onDisconnect={onDisconnect}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 