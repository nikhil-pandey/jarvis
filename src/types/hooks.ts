import type { FrequencyData, WavRecorderStatus } from './audio';
import type { RealtimeEvent } from './events';
import type { ClientState, SessionConfig } from './client';
import {ItemType, ToolDefinitionType} from '@openai/realtime-api-beta/dist/lib/client';
import type { AudioData } from '@/types/audio';
import type { ToolExecutor } from '@/types/tools';

export interface UseAudioRecordingReturn {
  isRecording: boolean;
  status: WavRecorderStatus;
  startRecording: (onData?: (data: AudioData) => void) => Promise<void>;
  stopRecording: () => Promise<void>;
  getFrequencies: (type?: 'voice' | 'music') => FrequencyData;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export interface UseAudioPlaybackReturn {
  isPlaying: boolean;
  getFrequencies: (type?: 'voice' | 'music') => FrequencyData;
  playAudio: (audio: Int16Array, trackId: string) => void;
  interrupt: () => Promise<{ trackId: string | null; offset: number; currentTime: number; }>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export interface UseRealtimeClientReturn {
  state: ClientState;
  items: ItemType[];
  events: RealtimeEvent[];
  startTime: string;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendAudioChunk: (audioData: AudioData) => void;
  sendTextMessage: (message: string) => void;
  updateSession: (config: SessionConfig) => void;
  deleteItem: (id: string) => void;
  createResponse: () => void;
  addTool: (definition: ToolDefinitionType, handler: (args: never) => never) => void;
  removeTool: (name: string) => void;
}

export interface UseVisualizationReturn {
  clientCanvasRef: React.RefObject<HTMLCanvasElement>;
  serverCanvasRef: React.RefObject<HTMLCanvasElement>;
  startRenderLoop: () => void;
  stopRenderLoop: () => void;
  renderFrameRef: React.MutableRefObject<number | undefined>;
}

export interface UseAudioChatReturn {
  // Connection state
  isConnected: boolean;
  isRecording: boolean;
  isPlaying: boolean;
  turnEndType: 'server_vad' | 'none' | null;
  
  // Audio data
  getInputFrequencies: (type?: 'voice' | 'music') => FrequencyData;
  getOutputFrequencies: (type?: 'voice' | 'music') => FrequencyData;
  startTime: string;
  
  // Conversation data
  items: ItemType[];
  events: RealtimeEvent[];
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  deleteItem: (id: string) => void;
  sendTextMessage: (message: string) => void;
  
  // Session management
  updateSession: (config: SessionConfig) => void;
  addTool: (definition: ToolDefinitionType, executor: ToolExecutor) => Promise<void>;
  removeTool: (toolName: string) => Promise<void>;
}
