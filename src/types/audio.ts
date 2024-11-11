export interface AudioConfig {
  sampleRate: number;
}

export interface FrequencyData {
  values: Float32Array;
  type?: 'voice' | 'music';
}

export interface AudioTrackOffset {
  trackId: string;
  offset: number;
}

export interface WavRecorderStatus {
  status: 'idle' | 'recording' | 'paused';
  frequencies?: FrequencyData;
}

export interface AudioData {
  mono: Int16Array;
  stereo?: Int16Array;
} 