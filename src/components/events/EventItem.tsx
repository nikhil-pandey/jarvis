import {ArrowDown, ArrowUp} from 'lucide-react';
import type {RealtimeEvent} from '@/types/events';

interface EventItemProps {
  entry: RealtimeEvent;
  startTime: string;
  isExpanded: boolean;
  isLastEvent: boolean;
  onToggleExpand: (eventId: string) => void;
}

function formatTime(timestamp: string, startTime: string): string {
  const t0 = new Date(startTime).valueOf();
  const t1 = new Date(timestamp).valueOf();
  const delta = t1 - t0;
  const hs = Math.floor(delta / 10) % 100;
  const s = Math.floor(delta / 1000) % 60;
  const m = Math.floor(delta / 60_000) % 60;
  const pad = (n: number) => {
    let s = n + '';
    while (s.length < 2) {
      s = '0' + s;
    }
    return s;
  };
  return `${pad(m)}:${pad(s)}.${pad(hs)}`;
}

export function EventItem({
  entry,
  startTime,
  isExpanded,
  onToggleExpand
}: EventItemProps) {
  const {count, event} = entry;

  if (!event?.event_id) {
    return null;
  }

  // Trim large binary data for display
  const displayEvent = {...event};
  if (event.type === 'input_audio_buffer.append' && 'audio' in event) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    displayEvent.audio = `[trimmed: ${event.audio.length} bytes]`;
  } else if (event.type === 'response.audio.delta' && 'delta' in event) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    displayEvent.delta = `[trimmed: ${event.delta.length} bytes]`;
  }

  return (
    <div
      className="text-xs border border-gray-800 rounded-md overflow-hidden bg-gray-900/20 hover:bg-gray-800/50 transition-colors"
    >
      <div
        className="flex items-center gap-2 px-2 py-1 cursor-pointer"
        onClick={() => onToggleExpand(event.event_id)}
      >
        <div className="text-[10px] tabular-nums text-gray-400 min-w-[40px]">
          {formatTime(entry.time, startTime)}
        </div>
        <div className={`flex items-center gap-1 min-w-[45px] ${event.type === 'error' ? 'text-red-400' : 'text-gray-300'}`}>
          {entry.source === 'client' ? (
            <ArrowUp className="w-2.5 h-2.5 text-blue-400" />
          ) : (
            <ArrowDown className="w-2.5 h-2.5 text-green-400" />
          )}
          <span className={`text-[10px] ${event.type === 'error' ? 'text-red-400' : ''}`}>
            {event.type === 'error' ? 'error!' : entry.source}
          </span>
        </div>
        <div className="flex-1 truncate text-gray-300">
          {event.type}
          {count && ` (${count})`}
        </div>
      </div>
      {isExpanded && (
        <div className="px-2 py-1.5 border-t border-gray-800 bg-gray-800/30 font-mono text-[10px] text-gray-300 whitespace-pre overflow-x-auto">
          {JSON.stringify(displayEvent, null, 2)}
        </div>
      )}
    </div>
  );
} 