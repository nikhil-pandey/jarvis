import {useCallback, useRef, useState} from 'react';
import {WavRecorder} from '@/lib/wavtools';
import type {AudioData, FrequencyData, WavRecorderStatus} from '@/types/audio';
import type {UseAudioRecordingReturn} from '@/types/hooks';

export function useAudioRecording(): UseAudioRecordingReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<WavRecorderStatus>({status: 'idle'});
  const recorderRef = useRef<WavRecorder>(new WavRecorder({sampleRate: 24000}));
  const audioCallbackRef = useRef<((data: AudioData) => void) | null>(null);

  const startRecording = useCallback(async (onData?: (data: AudioData) => void) => {
    const recorder = recorderRef.current;
    audioCallbackRef.current = onData || null;
    await recorder.record((data: AudioData) => {
      if (audioCallbackRef.current) {
        audioCallbackRef.current(data);
      }
    });
    setIsRecording(true);
    setStatus({status: 'recording'});
  }, []);

  const stopRecording = useCallback(async () => {
    const recorder = recorderRef.current;
    await recorder.pause();
    setIsRecording(false);
    setStatus({status: 'paused'});
  }, []);

  const getFrequencies = useCallback((type: 'voice' | 'music' = 'voice'): FrequencyData => {
    if (!recorderRef.current || !isRecording) {
      return {values: new Float32Array([0])};
    }
    const recorder = recorderRef.current;
    return recorder.analyser
      ? recorder.getFrequencies(type)
      : {values: new Float32Array([0])};
  }, []);

  const connect = useCallback(async () => {
    const recorder = recorderRef.current;
    await recorder.begin();
  }, []);

  const disconnect = useCallback(async () => {
    const recorder = recorderRef.current;
    await recorder.end();
    setIsRecording(false);
    setStatus({status: 'idle'});
  }, []);

  return {
    isRecording,
    status,
    startRecording,
    stopRecording,
    getFrequencies,
    connect,
    disconnect
  };
} 