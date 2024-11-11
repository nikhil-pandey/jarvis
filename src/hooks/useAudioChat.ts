'use client';

import {useEffect, useCallback} from 'react';
import {useAudioPlayback} from './useAudioPlayback';
import {useAudioRecording} from './useAudioRecording';
import {useRealtimeClient} from './useRealtimeClient';
import {useChatHistory} from './useChatHistory';
import type {ConnectionSettings, ChatSettings} from '@/types/settings';
import type {UseAudioChatReturn} from '@/types/hooks';
import type { ToolDefinitionType } from '@openai/realtime-api-beta/dist/lib/client';
import type { ToolExecutor } from '@/types/tools';
import {ConversationItem} from '@/types/conversation';

export function useAudioChat(
  connectionSettings: ConnectionSettings,
  chatSettings: ChatSettings
): UseAudioChatReturn {
  // Initialize our core hooks
  const {
    isPlaying,
    getFrequencies: getOutputFrequencies,
    playAudio,
    interrupt: interruptPlayback,
    connect: connectPlayback,
    disconnect: disconnectPlayback
  } = useAudioPlayback();

  const {
    isRecording,
    startRecording,
    stopRecording,
    getFrequencies: getInputFrequencies,
    connect: connectRecording,
    disconnect: disconnectRecording
  } = useAudioRecording();

  const {
    state,
    items,
    events,
    connect: connectClient,
    disconnect: disconnectClient,
    startTime,
    deleteItem,
    updateSession,
    sendTextMessage,
    sendAudioChunk,
    createResponse,
    addTool,
    removeTool,
  } = useRealtimeClient(
    connectionSettings,
    playAudio,
    interruptPlayback
  );

  const { addThread } = useChatHistory();

  // Ensure these functions return promises
  const addToolAsync = useCallback(async (
    definition: ToolDefinitionType,
    executor: ToolExecutor
  ): Promise<void> => {
    return Promise.resolve(addTool(definition, executor));
  }, [addTool]);

  const removeToolAsync = useCallback(async (
    toolName: string
  ): Promise<void> => {
    return Promise.resolve(removeTool(toolName));
  }, [removeTool]);

  // Handle connection/disconnection of audio devices
  useEffect(() => {
    const setupAudio = async () => {
      if (state.isConnected) {
        try {
          // Connect audio devices
          try {
            await connectRecording();
          } catch (error) {
            console.error('Failed to connect recording:', error);
          }

          try {
            await connectPlayback();
          } catch (error) {
            console.error('Failed to connect playback:', error);
          }

          // Update session with chat settings
          updateSession(chatSettings);

          // Start recording if using server VAD
          if (chatSettings.turn_detection?.type === 'server_vad') {
            await startRecording((audioData) => {
              if (state.isConnected) {
                sendAudioChunk(audioData);
              }
            });
          }
        } catch (error) {
          console.trace('Failed to setup audio:', error);
          await cleanup();
        }
      } else {
        await cleanup();
      }
    };

    setupAudio();
  }, [state.isConnected]);

  // use effect on chat settings
  useEffect(() => {
    if (state.isConnected) {
      updateSession(chatSettings);
    }
  }, [chatSettings]);

  // Cleanup function for disconnecting everything
  const cleanup = async () => {
    if (isRecording) await disconnectRecording();
    if (isPlaying) await disconnectPlayback();
    if (state.isConnected) {
      // Save conversation to history before disconnecting
      if (items.length > 0) {
        addThread({
          id: crypto.randomUUID(),
          title: "Conversation",
          items: items as ConversationItem[],
          timestamp: new Date().toISOString()
        });
      }
      await disconnectClient();
    }
  };

  // Connect to the chat
  const connect = async () => {
    await connectClient();
  };

  // Disconnect from the chat
  const disconnect = async () => {
    await cleanup();
  };

  // Start recording with audio callback
  const startAudioRecording = async () => {
    await startRecording((audioData) => {
      if (state.isConnected) {
        sendAudioChunk(audioData);
      }
    });
  };

  // Stop recording
  const stopAudioRecording = async () => {
    await stopRecording();
    await createResponse();
  };

  return {
    // Connection state
    isConnected: state.isConnected,
    isRecording,
    isPlaying,
    turnEndType: chatSettings.turn_detection?.type || 'none',

    // Audio data
    getInputFrequencies,
    getOutputFrequencies,
    startTime,

    // Conversation data
    items,
    events,

    // Actions
    connect,
    disconnect,
    startRecording: startAudioRecording,
    stopRecording: stopAudioRecording,
    deleteItem,
    sendTextMessage,
    addTool: addToolAsync,
    removeTool: removeToolAsync,

    // Session management
    updateSession
  };
} 