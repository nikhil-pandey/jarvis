import {useCallback, useEffect, useRef, useState} from 'react';
import {RealtimeClient} from '@openai/realtime-api-beta';
import type {
  UseRealtimeClientReturn,
} from '@/types/hooks';
import type {ClientState, SessionConfig} from '@/types/client';
import type {RealtimeEvent} from '@/types/events';
import {ItemType, ToolDefinitionType} from '@openai/realtime-api-beta/dist/lib/client';
import {ConnectionSettings} from '@/types/settings';
import {AudioData} from '@/types/audio';
import {useToast} from './use-toast';

export function useRealtimeClient(
  settings: ConnectionSettings,
  onAudioOutput?: (audio: Int16Array, trackId: string) => void,
  onInterrupt?: () => Promise<{ trackId: string | null; offset: number; currentTime: number; }>,
): UseRealtimeClientReturn {
  const [state, setState] = useState<ClientState>({
    isConnected: false,
  });
  const [items, setItems] = useState<ItemType[]>([]);
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const clientRef = useRef<RealtimeClient | null>(null);
  const startTimeRef = useRef<string>(new Date().toISOString());
  const {toast} = useToast();

  // Set up client when settings change
  useEffect(() => {
    if (!settings.apiKey){
      console.log("No API key");
      return;
    }

    clientRef.current = settings.isAzure ?
      new RealtimeClient({
        url: `wss://${settings.endpoint.replace('https://', '')}/openai/realtime?api-version=${settings.apiVersion}&deployment=${settings.deployment}`,
        apiKey: settings.apiKey,
        dangerouslyAllowAPIKeyInBrowser: true,
      })
      : new RealtimeClient({
        apiKey: settings.apiKey,
        dangerouslyAllowAPIKeyInBrowser: true,
      });

    const client = clientRef.current;

    // Set up event listeners
    client.on('realtime.event', (realtimeEvent: RealtimeEvent) => {
      setEvents(prevEvents => {
        const lastEvent = prevEvents[prevEvents.length - 1];
        if (lastEvent?.event.type === realtimeEvent.event.type) {
          lastEvent.count = (lastEvent.count || 0) + 1;
          return prevEvents.slice(0, -1).concat(lastEvent);
        }
        return prevEvents.concat(realtimeEvent);
      });
    });

    client.on('conversation.updated', async ({ item, delta }: { item: ItemType; delta: { audio?: Int16Array } }) => {
      const items = client.conversation.getItems();
      if (item.status === 'completed' && item.formatted.audio?.length) {
        const wavFile = await WavRecorder.decode(
          item.formatted.audio,
          24000,
          24000
        );
        item.formatted.file = wavFile;
      }
      setItems(items);

      // Handle audio output
      if (delta?.audio && onAudioOutput) {
        onAudioOutput(delta.audio, item.id);
      }
    });

    client.on('conversation.interrupted', async () => {
      // if (onInterrupt) {
      //   const result = await onInterrupt();
      //   if (result?.trackId) {
      //     await client.cancelResponse(result.trackId, result.offset);
      //   }
      // }
    });

    client.on('error', (error: never) => {
      console.error('RealtimeClient error:', error);
    });

    return () => {
      client.reset();
      clientRef.current = null;
    };
  }, [settings, onAudioOutput, onInterrupt]);

  const connect = useCallback(async () => {
    if (!clientRef.current){
      console.log("No client");
      toast({
        title: 'Missing API key',
        description: 'Please enter an API key to connect to the server',
        variant: 'destructive',
      });
      return;
    }
    const client = clientRef.current;
    startTimeRef.current = new Date().toISOString();
    await client.connect();
    setState(prev => ({...prev, isConnected: true}));
    setItems(client.conversation.getItems());
  }, []);

  const disconnect = useCallback(async () => {
    if (!clientRef.current) return;
    const client = clientRef.current;
    await client.disconnect();
    setState(prev => ({...prev, isConnected: false}));
    setItems([]);
    setEvents([]);
  }, []);

  const updateSession = useCallback((config: SessionConfig) => {
    if (!clientRef.current) return;
    const client = clientRef.current;
    client.updateSession(config);
  }, []);

  const deleteItem = useCallback((id: string) => {
    if (!clientRef.current) return;
    const client = clientRef.current;
    client.deleteItem(id);
  }, []);

  const sendAudioChunk = useCallback((audioData: AudioData) => {
    if (!clientRef.current) return;
    const client = clientRef.current;
    client.appendInputAudio(audioData.mono);
  }, []);

  const createResponse = useCallback(() => {
    if (!clientRef.current) return;
    const client = clientRef.current;
    client.createResponse();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addTool = useCallback((definition: ToolDefinitionType, handler: any) => {
    if (!clientRef.current) return;
    const client = clientRef.current;
    client.addTool(definition, handler);
  }, []);

  const removeTool = useCallback((name: string) => {
    if (!clientRef.current) return;
    const client = clientRef.current;
    client.removeTool(name);
  }, []);

  const sendTextMessage = useCallback((message: string) => {
    if (!clientRef.current) return;
    const client = clientRef.current;
    client.sendUserMessageContent([{type: 'input_text', text: message}]);
  }, []);

  return {
    state,
    items,
    events,
    startTime: startTimeRef.current,
    connect,
    disconnect,
    sendAudioChunk,
    updateSession,
    deleteItem,
    createResponse,
    addTool,
    removeTool,
    sendTextMessage,
  };
}