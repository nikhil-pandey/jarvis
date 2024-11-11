import React from 'react';
import { Download, Upload } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useToolSettings } from '@/hooks/useToolSettings';
import { useChatHistory } from '@/hooks/useChatHistory';
import { useToast } from "@/hooks/use-toast";
import type { BaseToolSettingsType } from '@/types/tools';
import type { ChatThread } from '@/hooks/useChatHistory';
import type { ConversationItem } from '@/types/conversation';

// Helper to clean conversation data for export
const cleanConversationData = (thread: ChatThread): ChatThread => {
  const cleanItems = thread.items.map((item): ConversationItem => {
    const cleanFormatted = { ...item.formatted };
    // Remove audio and file data
    delete cleanFormatted.audio;
    delete cleanFormatted.file;
    
    return {
      ...item,
      formatted: cleanFormatted
    };
  });

  return {
    ...thread,
    items: cleanItems
  };
};

export function ExportTab() {
  const { settings } = useSettings();
  const toolSettings = useToolSettings((state) => state.settings);
  const updateSettings = useSettings((state) => state.updateSettings);
  const { updateSettings: updateToolSettings } = useToolSettings();
  const { threads: chatThreads, addThread } = useChatHistory();
  const { toast } = useToast();

  const handleExport = () => {
    // Clean up threads before export
    const cleanThreads = chatThreads.map(cleanConversationData);

    const exportData = {
      version: 1,
      timestamp: new Date().toISOString(),
      data: {
        settings,
        toolSettings,
        chatHistory: cleanThreads
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jarvis-settings-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Settings Exported",
      description: "Your settings and chat history have been successfully exported.",
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importData = JSON.parse(content);
        
        // Basic validation
        if (!importData.version || !importData.data) {
          throw new Error('Invalid file format');
        }

        // Import settings
        if (importData.data.settings) {
          updateSettings(importData.data.settings);
        }

        // Import tool settings
        if (importData.data.toolSettings) {
          Object.entries(importData.data.toolSettings).forEach(([toolId, settings]) => {
            updateToolSettings(toolId, settings as BaseToolSettingsType);
          });
        }

        // Import chat history
        if (importData.data.chatHistory) {
          importData.data.chatHistory.forEach((thread: ChatThread) => {
            addThread(cleanConversationData(thread));
          });
        }

        toast({
          title: "Import Successful",
          description: "Your settings and chat history have been successfully imported.",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: (error as Error).message || "Failed to import settings",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-200 mb-2">Export Settings & History</h3>
        <p className="text-sm text-gray-400 mb-4">
          Download your current settings and chat history as a JSON file. This includes all your preferences, tool configurations, and conversation history.
        </p>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          <Download size={16} />
          Export All Data
        </button>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-200 mb-2">Import Settings & History</h3>
        <p className="text-sm text-gray-400 mb-4">
          Import previously exported data. This will merge with your current settings and history.
        </p>
        <label className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-md transition-colors cursor-pointer">
          <Upload size={16} />
          Import Data
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>

      <div className="mt-8 p-4 bg-gray-800 rounded-md">
        <h4 className="text-sm font-medium text-gray-200 mb-2">Note</h4>
        <div className="text-sm text-gray-400">
          Exported data includes:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Connection settings</li>
            <li>Voice and chat preferences</li>
            <li>Tool configurations</li>
            <li>Chat conversation history</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 