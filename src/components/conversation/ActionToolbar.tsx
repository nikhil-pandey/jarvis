'use client';

import {Button} from '@/components/ui/button';
import {Check, Copy, Volume2, VolumeX, X} from 'lucide-react';
import {cn} from '@/lib/utils';
import {useState, useRef} from 'react';
import type {ConversationItemProps} from '@/types/conversation';

interface ActionToolbarProps {
  item: ConversationItemProps['item'];
  isUser: boolean;
  onDelete: (id: string) => void;
  readOnly?: boolean;
}

export function ActionToolbar({
  item,
  isUser,
  onDelete,
  readOnly = false,
}: ActionToolbarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleCopy = async () => {
    const text = item.formatted.transcript || item.formatted.text || '';
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  return (
    <>
      <div className={cn(
        "absolute -right-1 -top-3 flex items-center gap-1",
        "opacity-0 transition-opacity duration-200",
        "group-hover:opacity-100"
      )}>
        {item.formatted.file && !readOnly && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-6 w-6 rounded-full bg-gray-900/90 hover:bg-gray-800",
              isUser ? "text-blue-100" : "text-gray-300"
            )}
            onClick={handlePlayback}
          >
            {isPlaying ? (
              <VolumeX className="h-3 w-3" />
            ) : (
              <Volume2 className="h-3 w-3" />
            )}
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full bg-gray-900/90 hover:bg-gray-800"
          onClick={handleCopy}
        >
          {isCopied ? (
            <Check className="h-3 w-3 text-green-400" />
          ) : (
            <Copy className="h-3 w-3 text-gray-400" />
          )}
        </Button>
        {!readOnly && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full bg-gray-900/90 hover:bg-gray-800 text-red-400 hover:text-red-300"
            onClick={() => onDelete(item.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      {item.formatted.file && !readOnly && (
        <audio
          ref={audioRef}
          src={item.formatted.file.url}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
          controls
        />
      )}
    </>
  );
} 