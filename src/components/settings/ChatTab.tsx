import React from 'react';
import type {SessionConfig, TurnDetectionServerVadType, Voice, ToolChoiceType} from '@/types/client';

type Props = {
  settings: SessionConfig;
  onChange: (settings: SessionConfig) => void;
};

export function VoiceTab({settings, onChange}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Modalities
        </label>
        <div className="flex gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.modalities?.includes('text')}
              onChange={(e) => {
                const modalities = settings.modalities || [];
                onChange({
                  ...settings,
                  modalities: e.target.checked 
                    ? [...modalities, 'text']
                    : modalities.filter(m => m !== 'text')
                });
              }}
              className="rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">Text</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox" 
              checked={settings.modalities?.includes('audio')}
              onChange={(e) => {
                const modalities = settings.modalities || [];
                onChange({
                  ...settings,
                  modalities: e.target.checked
                    ? [...modalities, 'audio']
                    : modalities.filter(m => m !== 'audio')
                });
              }}
              className="rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">Audio</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Instructions
        </label>
        <textarea
          value={settings.instructions}
          onChange={(e) => onChange({...settings, instructions: e.target.value})}
          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200 min-h-[100px]"
          placeholder="Enter instructions for the AI assistant..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Input Audio Format
          </label>
          <select
            value={settings.input_audio_format}
            onChange={(e) => onChange({...settings, input_audio_format: e.target.value as 'pcm16' | 'g711_ulaw' | 'g711_alaw'})}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200"
          >
            <option value="pcm16">PCM16</option>
            <option value="g711_ulaw">G.711 µ-law</option>
            <option value="g711_alaw">G.711 A-law</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Output Audio Format
          </label>
          <select
            value={settings.output_audio_format}
            onChange={(e) => onChange({...settings, output_audio_format: e.target.value as 'pcm16' | 'g711_ulaw' | 'g711_alaw'})}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200"
          >
            <option value="pcm16">PCM16</option>
            <option value="g711_ulaw">G.711 µ-law</option>
            <option value="g711_alaw">G.711 A-law</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Audio Transcription
        </label>
        <select
          value={settings.input_audio_transcription ? 'whisper-1' : 'none'}
          onChange={(e) => {
            const value = e.target.value;
            onChange({
              ...settings,
              input_audio_transcription: value === 'whisper-1' ? { model: 'whisper-1' } : undefined
            });
          }}
          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200"
        >
          <option value="none">None</option>
          <option value="whisper-1">Whisper-1</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Voice
        </label>
        <select
          value={settings.voice}
          onChange={(e) => onChange({...settings, voice: e.target.value as Voice})}
          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200"
        >
          <option value="alloy">Alloy</option>
          <option value="echo">Echo</option>
          <option value="shimmer">Shimmer</option>
          <option value="ash">Ash</option>
          <option value="ballad">Ballad</option>
          <option value="coral">Coral</option>
          <option value="sage">Sage</option>
          <option value="verse">Verse</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Tool Choice
        </label>
        <select
          value={typeof settings.tool_choice === 'string' ? settings.tool_choice : 'function'}
          onChange={(e) => {
            const value = e.target.value;
            onChange({
              ...settings,
              tool_choice: value === 'function' 
                ? {type: 'function', name: ''} 
                : value as ToolChoiceType
            });
          }}
          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200"
        >
          <option value="auto">Auto</option>
          <option value="none">None</option>
          <option value="required">Required</option>
          <option value="function">Function</option>
        </select>
        {typeof settings.tool_choice === 'object' && settings.tool_choice.type === 'function' && (
          <input
            type="text"
            value={settings.tool_choice.name}
            onChange={(e) => onChange({
              ...settings,
              tool_choice: {type: 'function', name: e.target.value}
            })}
            placeholder="Function name"
            className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Temperature ({settings.temperature})
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={settings.temperature}
          onChange={(e) => onChange({...settings, temperature: parseFloat(e.target.value)})}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Max Response Tokens
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={settings.max_response_output_tokens === 'inf' ? '' : settings.max_response_output_tokens}
            onChange={(e) => onChange({...settings, max_response_output_tokens: e.target.value ? parseInt(e.target.value) : 'inf'})}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200"
            placeholder="inf"
          />
          <button
            onClick={() => onChange({...settings, max_response_output_tokens: 'inf'})}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 hover:bg-gray-700"
          >
            ∞
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">
          Turn Detection
        </label>
        <div className="flex items-center gap-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={!!settings.turn_detection}
              onChange={(e) => onChange({
                ...settings,
                turn_detection: e.target.checked ? {
                  type: 'server_vad',
                  threshold: 0.5,
                  prefix_padding_ms: 300,
                  silence_duration_ms: 200
                } : null
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
          {settings.turn_detection && (
            <div className="flex gap-2">
              <div>
                <label className="block text-xs text-gray-400">Threshold</label>
                <input
                  type="number"
                  value={settings.turn_detection.threshold || 0.5}
                  onChange={(e) => onChange({
                    ...settings,
                    turn_detection: {
                      ...settings.turn_detection,
                      threshold: parseFloat(e.target.value)
                    } as TurnDetectionServerVadType
                  })}
                  className="w-20 bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-gray-200"
                  min="0"
                  max="1"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400">Prefix Padding (ms)</label>
                <input
                  type="number"
                  value={settings.turn_detection.prefix_padding_ms || 300}
                  onChange={(e) => onChange({
                    ...settings,
                    turn_detection: {
                      ...settings.turn_detection,
                      prefix_padding_ms: parseInt(e.target.value)
                    } as TurnDetectionServerVadType
                  })}
                  className="w-24 bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-gray-200"
                  min="0"
                  step="50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400">Silence Duration (ms)</label>
                <input
                  type="number"
                  value={settings.turn_detection.silence_duration_ms || 200}
                  onChange={(e) => onChange({
                    ...settings,
                    turn_detection: {
                      ...settings.turn_detection,
                      silence_duration_ms: parseInt(e.target.value)
                    } as TurnDetectionServerVadType
                  })}
                  className="w-24 bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-gray-200"
                  min="0"
                  step="50"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}