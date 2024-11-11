export interface RealtimeClientConfig {
  url?: string;
  apiKey: string;
  dangerouslyAllowAPIKeyInBrowser?: boolean;
  deployment?: string;
}

export type Voice = 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'sage' | 'shimmer' | 'verse';
export type AudioFormatType = 'pcm16' | 'g711_ulaw' | 'g711_alaw';
export type AudioTranscriptionType = {
  model: 'whisper-1';
};

export type TurnDetectionServerVadType = {
  type: 'server_vad';
  threshold?: number;
  prefix_padding_ms?: number;
  silence_duration_ms?: number;
};

export type ToolChoiceType = 'auto' | 'none' | 'required' | {
  type: 'function';
  name: string;
};

export interface SessionConfig {
  modalities?: string[];
  instructions?: string;
  voice: Voice;
  input_audio_format?: AudioFormatType;
  output_audio_format?: AudioFormatType;
  input_audio_transcription?: AudioTranscriptionType;
  turn_detection?: TurnDetectionServerVadType | null;
  tool_choice?: ToolChoiceType;
  temperature?: number;
  max_response_output_tokens?: number | 'inf';
}

export const getDefaultSessionConfig = (): SessionConfig => ({
  modalities: ['text', 'audio'],
  instructions: '',
  voice: 'alloy',
  input_audio_format: 'pcm16',
  output_audio_format: 'pcm16',
  input_audio_transcription: {
    model: 'whisper-1'
  },
  turn_detection: {
    type: 'server_vad',
    threshold: 0.5,
    prefix_padding_ms: 300,
    silence_duration_ms: 200
  },
  tool_choice: 'auto',
  temperature: 0.8,
  max_response_output_tokens: 4096
});

export type TurnEndType = 'none' | 'server_vad';

export interface ClientState {
  isConnected: boolean;
}