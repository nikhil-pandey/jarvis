import { useCallback, useRef, useState } from 'react';
import { WavStreamPlayer } from '@/lib/wavtools';
import type { FrequencyData } from '@/types/audio';
import type { UseAudioPlaybackReturn } from '@/types/hooks';

export function useAudioPlayback(): UseAudioPlaybackReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<WavStreamPlayer>(new WavStreamPlayer({ sampleRate: 24000 }));

  const playAudio = useCallback((audio: Int16Array, trackId: string) => {
    const player = playerRef.current;
    player.add16BitPCM(audio, trackId);
    setIsPlaying(true);
  }, []);

  const interrupt = useCallback(async () => {
    const player = playerRef.current;
    return player.interrupt();
  }, []);

  const getFrequencies = useCallback((type: 'voice' | 'music' = 'voice'): FrequencyData => {
    if (!playerRef.current || !isPlaying) {
      return { values: new Float32Array([0]) };
    }
    const player = playerRef.current;
    return player.analyser 
      ? player.getFrequencies(type) 
      : { values: new Float32Array([0]) };
  }, []);

  const connect = useCallback(async () => {
    const player = playerRef.current;
    await player.connect();
  }, []);

  const disconnect = useCallback(async () => {
    const player = playerRef.current;
    await player.interrupt();
    setIsPlaying(false);
  }, []);

  return {
    isPlaying,
    getFrequencies,
    playAudio,
    interrupt,
    connect,
    disconnect,
  };
} 