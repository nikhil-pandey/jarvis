'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import type { ToolGroup, ToolRegistryEntry } from '@/types/tools';
import { ToolItem } from './ToolItem';

interface ToolsPanelProps {
  tools: Record<string, ToolRegistryEntry>;
  toolGroups: ToolGroup[];
  onToolToggle: (toolId: string, enabled: boolean) => void;
  onToolGroupToggle: (groupId: string, enabled: boolean) => void;
  onToolSettingsClick: (toolId: string) => void;
}

export function ToolsPanel({
  tools,
  toolGroups,
  onToolToggle,
  onToolGroupToggle,
  onToolSettingsClick
}: ToolsPanelProps) {
  const isGroupEnabled = (group: ToolGroup) => {
    return group.tools.every(toolId => tools[toolId]?.enabled);
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-2 space-y-2">
        {toolGroups.map((group) => {
          const enabled = isGroupEnabled(group);

          return (
            <Card key={group.id} className="p-2 bg-black/20 border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-200">{group.name}</h3>
                  {group.description && (
                    <p className="text-xs text-gray-400">{group.description}</p>
                  )}
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={(checked) => onToolGroupToggle(group.id, checked)}
                  className="scale-75 data-[state=checked]:bg-green-600"
                />
              </div>
              <div className="space-y-1">
                {group.tools.map((toolId) => {
                  const tool = tools[toolId];
                  if (!tool) return null;
                  
                  return (
                    <ToolItem
                      key={toolId}
                      tool={tool}
                      onToggle={(enabled) => onToolToggle(toolId, enabled)}
                      onSettingsClick={() => onToolSettingsClick(toolId)}
                    />
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
} 