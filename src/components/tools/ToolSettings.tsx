'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TOOL_REGISTRY } from '@/lib/tools/registry';

interface ToolSettingsProps {
  toolId: string;
  settings: any;
  onSettingsChange: (settings: any) => void;
}

export function ToolSettings({ toolId, settings, onSettingsChange }: ToolSettingsProps) {
  const tool = TOOL_REGISTRY[toolId];
  if (!tool) return null;

  const renderSettingField = (key: string, schema: any) => {
    switch (schema.type) {
      case 'string':
        if (schema.enum) {
          return (
            <Select
              value={settings[key]}
              onValueChange={(value) => 
                onSettingsChange({ ...settings, [key]: value })
              }
            >
              {schema.enum.map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          );
        }
        return (
          <Input
            type="text"
            value={settings[key] || ''}
            onChange={(e) => 
              onSettingsChange({ ...settings, [key]: e.target.value })
            }
          />
        );
      case 'boolean':
        return (
          <Switch
            checked={settings[key] || false}
            onCheckedChange={(checked) => 
              onSettingsChange({ ...settings, [key]: checked })
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">{tool.definition.name} Settings</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(tool.settings.shape).map(([key, schema]) => (
          <div key={key} className="space-y-2">
            <Label>{key}</Label>
            {renderSettingField(key, schema)}
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 