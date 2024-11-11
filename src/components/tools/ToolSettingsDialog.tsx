'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToolSettings } from '@/hooks/useToolSettings';
import { ToolSettingsForm } from './ToolSettingsForm';
import { TOOL_REGISTRY } from '@/lib/tools/registry';

interface ToolSettingsDialogProps {
  toolId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ToolSettingsDialog({ 
  toolId, 
  open, 
  onOpenChange 
}: ToolSettingsDialogProps) {
  const { getSettings, updateSettings } = useToolSettings();

  if (!toolId) return null;

  const tool = TOOL_REGISTRY[toolId];
  if (!tool) return null;

  const settings = getSettings(toolId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tool.definition.name} Settings</DialogTitle>
        </DialogHeader>
        <ToolSettingsForm
          toolId={toolId}
          initialSettings={settings}
          onSubmit={(newSettings) => {
            updateSettings(toolId, newSettings);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
} 