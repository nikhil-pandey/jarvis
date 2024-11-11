import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { ConnectionTab } from './ConnectionTab';
import { VoiceTab } from './ChatTab';
import { ExportTab } from './ExportTab';
import type { Settings } from '@/types/settings';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
};

export function SettingsDialog({ isOpen, onClose, settings, onSettingsChange }: Props) {
  const [activeTab, setActiveTab] = useState<'connection' | 'voice' | 'export'>('connection');
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  // Reset local settings when dialog opens
  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleCancel = () => {
    setLocalSettings(settings); // Reset to original settings
    onClose();
  };

  const tabs = [
    { id: 'connection', label: 'Connection' },
    { id: 'voice', label: 'Voice' },
    { id: 'export', label: 'Export' },
  ] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-2xl h-[80vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-gray-100">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-800 text-gray-400 hover:text-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Fixed Tabs */}
        <div className="border-b border-gray-800">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-blue-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 p-4">
          {activeTab === 'connection' && (
            <ConnectionTab
              settings={localSettings.connection}
              onChange={(newConnectionSettings) =>
                setLocalSettings({ ...localSettings, connection: newConnectionSettings })
              }
            />
          )}
          {activeTab === 'voice' && (
            <VoiceTab
              settings={localSettings.chat}
              onChange={(newVoiceSettings) =>
                setLocalSettings({ ...localSettings, chat: newVoiceSettings })
              }
            />
          )}
          {activeTab === 'export' && <ExportTab />}
        </ScrollArea>

        {/* Fixed Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-gray-800">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}