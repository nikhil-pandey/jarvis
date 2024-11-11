import {FrequencyData} from "./audio";
import type { ConversationItem } from './conversation';
import {RealtimeEvent} from "./events";
import {ToolGroup} from "./tools";
import {ToolRegistryEntry} from "./tools";
export interface AudioVisualizationProps {
  getClientFrequencies: (type?: 'voice' | 'music') => FrequencyData;
  getServerFrequencies: (type?: 'voice' | 'music') => FrequencyData;
  config: {
    barCount: number;
    minDecibels: number;
    smoothingTimeConstant: number;
    clientColor: string;
    serverColor: string;
  };
}

export interface ControlPanelProps {
  isConnected: boolean;
  isRecording: boolean;
  turnEndType: 'server_vad' | 'none' | null;
  onTextSubmit: (message: string) => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onRecordingStart: () => void;
  onRecordingStop: () => void;
  onTurnEndTypeChange: (type: 'server_vad' | 'none') => void;
}

export interface AutoScrollProps {
  children: React.ReactNode;
  enabled?: boolean;
  threshold?: number;
}

export interface ChatInterfaceProps {
  items: ConversationItem[];
  isConnected: boolean;
  isRecording: boolean;
  turnEndType: 'server_vad' | 'none' | null;
  onTextSubmit: (text: string) => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onRecordingStart: () => void;
  onRecordingStop: () => void;
  onTurnEndTypeChange: (type: 'server_vad' | 'none') => void;
  onDeleteItem: (id: string) => void;
}

export interface LeftSidebarProps {
  events: RealtimeEvent[];
  startTime: string;
  tools: Record<string, ToolRegistryEntry>;
  toolGroups: ToolGroup[];
  onToolToggle: (toolId: string, enabled: boolean) => void;
  onToolGroupToggle: (groupId: string, enabled: boolean) => void;
  onToolSettingsClick: (toolId: string) => void;
} 