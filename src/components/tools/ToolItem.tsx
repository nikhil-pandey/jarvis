'use client';

import React from 'react';
import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import type { ToolRegistryEntry } from '@/types/tools';
import {ZodObject} from 'zod';

interface ToolItemProps {
  tool: ToolRegistryEntry;
  onToggle: (enabled: boolean) => void;
  onSettingsClick: () => void;
}

export function ToolItem({ tool, onToggle, onSettingsClick }: ToolItemProps) {
  const zodSettingsType = tool.settings;
  const hasSettings = zodSettingsType && zodSettingsType instanceof ZodObject && Object.keys(zodSettingsType.shape).length > 0;

  return (
    <div className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-gray-800/50">
      <div className="flex items-center gap-2">
        <Switch
          className="scale-[0.65] data-[state=checked]:bg-green-600"
          checked={tool.enabled}
          onCheckedChange={onToggle}
        />
        <div>
          <div className="text-xs font-medium text-gray-200">{tool.definition.name}</div>
          <div className="text-[10px] text-gray-400">
            {tool.definition.description.slice(0, 15)}
            {tool.definition.description.length > 15 && '...'}
          </div>
        </div>
      </div>
      {hasSettings && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onSettingsClick}
          className="h-6 w-6 text-gray-400 hover:text-gray-200 hover:bg-gray-800"
        >
          <Settings2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
} 