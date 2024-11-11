export interface RealtimeEvent {
  time: string;
  source: 'client' | 'server';
  count?: number;
  event: { [key: string]: never };
}

export interface EventLogEntry {
  time: Date;
  source: 'client' | 'server';
  event: RealtimeEvent;
  count?: number;
} 