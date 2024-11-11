import React, { useState } from 'react';
import type { ConnectionSettings } from '@/types/settings';
import { Eye, EyeOff } from 'lucide-react';

type Props = {
  settings: ConnectionSettings;
  onChange: (settings: ConnectionSettings) => void;
};

export function ConnectionTab({ settings, onChange }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: keyof ConnectionSettings, value: string | boolean) => {
    onChange({
      ...settings,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.isAzure}
            onChange={(e) => handleChange('isAzure', e.target.checked)}
            className="rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-300">Use Azure OpenAI</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          API Key
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={settings.apiKey}
            onChange={(e) => handleChange('apiKey', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your API key"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {settings.isAzure && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Deployment Name
            </label>
            <input
              type="text"
              value={settings.deployment}
              onChange={(e) => handleChange('deployment', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter deployment name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Endpoint
            </label>
            <input
              type="url"
              value={settings.endpoint}
              onChange={(e) => handleChange('endpoint', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://your-endpoint.openai.azure.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              API Version
            </label>
            <input
              type="text"
              value={settings.apiVersion}
              onChange={(e) => handleChange('apiVersion', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="2024-08-01-preview"
            />
          </div>
        </>
      )}
    </div>
  );
}