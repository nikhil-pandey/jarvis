'use client';

import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Mic, StopCircle } from 'lucide-react';

interface TextInputProps {
  textInput: string;
  isVad: boolean;
  isRecording: boolean;
  onTextChange: (text: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onTurnEndTypeChange: (type: 'server_vad' | 'none') => void;
  onVadMicClick: () => void;
  onRecordingStart: () => void;
  onRecordingStop: () => void;
}

export function TextInput({
  textInput,
  isVad,
  isRecording,
  onTextChange,
  onKeyDown,
  onTurnEndTypeChange,
  onVadMicClick,
  onRecordingStart,
  onRecordingStop,
}: TextInputProps) {
  return (
    <div className="relative flex-grow">
      <textarea
        value={textInput}
        onChange={(e) => onTextChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Type your message..."
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[2.5rem] max-h-[10rem] overflow-y-auto"
        rows={1}
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <Toggle
          pressed={isVad}
          onPressedChange={(value) => {
            onTurnEndTypeChange(value ? 'server_vad' : 'none');
            if (isRecording) {
              onRecordingStop();
            }
          }}
          size="sm"
          variant="default"
          className={`h-8 ${isVad ? 'text-white' : 'text-gray-300'} border-gray-600`}
        >
          VAD
        </Toggle>

        {isVad ? (
          <button
            onClick={onVadMicClick}
            className={`p-1.5 transition-colors rounded-md ${
              isRecording ? 'hover:bg-red-600' : 'hover:bg-blue-700'
            }`}
          >
            {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
          </button>
        ) : (
          <button
            onMouseDown={onRecordingStart}
            onMouseUp={onRecordingStop}
            className={`p-1.5 rounded-md transition-colors text-white ${
              isRecording ? 'bg-red-500' : 'hover:bg-blue-700'
            }`}
          >
            {isRecording ? 'Release to stop' : 'Press to talk'}
          </button>
        )}
      </div>
    </div>
  );
} 