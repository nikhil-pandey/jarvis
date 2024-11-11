'use client';

import React, {createContext, useContext, useState, useCallback} from 'react';
import {TOOL_REGISTRY, TOOL_GROUPS} from '@/lib/tools/registry';
import type {ToolRegistryEntry, ToolGroup, ToolExecutor} from '@/types/tools';
import type {ToolDefinitionType} from '@openai/realtime-api-beta/dist/lib/client';
import {useToolSettings} from '@/hooks/useToolSettings';

interface ToolsContextType {
  tools: Record<string, ToolRegistryEntry>;
  toolGroups: ToolGroup[];
  enableTool: (toolId: string, settings?: unknown) => Promise<void>;
  disableTool: (toolId: string) => Promise<void>;
  enableToolGroup: (groupId: string, settings?: Record<string, unknown>) => Promise<void>;
  disableToolGroup: (groupId: string) => Promise<void>;
}

const ToolsContext = createContext<ToolsContextType | null>(null);

interface ToolsProviderProps {
  children: React.ReactNode;
  onToolEnabled: (definition: ToolDefinitionType, executor: ToolExecutor) => Promise<void>;
  onToolDisabled: (toolName: string) => Promise<void>;
}

export function ToolsProvider({
  children,
  onToolEnabled,
  onToolDisabled
}: ToolsProviderProps) {
  const [tools, setTools] = useState(TOOL_REGISTRY);
  const [toolGroups] = useState<ToolGroup[]>(TOOL_GROUPS);
  const {getSettings} = useToolSettings();

  const enableTool = useCallback(async (toolId: string) => {
    const tool = tools[toolId];
    if (!tool) return;

    const toolSettings = getSettings(toolId);
    try {
      await onToolEnabled(
        tool.definition,
        async (args: Parameters<typeof tool.execute>[0]) =>
          tool.execute(args, toolSettings)
      );

      setTools(prev => ({
        ...prev,
        [toolId]: {...prev[toolId], enabled: true}
      }));
    } catch (error) {
      console.error(`Failed to enable tool ${toolId}:`, error);
      throw error;
    }
  }, [tools, onToolEnabled]);

  const disableTool = useCallback(async (toolId: string) => {
    const tool = tools[toolId];
    if (!tool) return;

    try {
      await onToolDisabled(tool.definition.name);

      setTools(prev => ({
        ...prev,
        [toolId]: {...prev[toolId], enabled: false}
      }));
    } catch (error) {
      console.error(`Failed to disable tool ${toolId}:`, error);
      throw error;
    }
  }, [tools, onToolDisabled]);

  const enableToolGroup = useCallback(async (groupId: string) => {
    const group = toolGroups.find(g => g.id === groupId);
    if (!group) return;

    const enablePromises = group.tools.map(async toolId => {
      return enableTool(toolId);
    });

    await Promise.all(enablePromises);
  }, [toolGroups, enableTool]);

  const disableToolGroup = useCallback(async (groupId: string) => {
    const group = toolGroups.find(g => g.id === groupId);
    if (!group) return;

    const disablePromises = group.tools.map(toolId => disableTool(toolId));
    await Promise.all(disablePromises);
  }, [toolGroups, disableTool]);

  return (
    <ToolsContext.Provider value={{
      tools,
      toolGroups,
      enableTool,
      disableTool,
      enableToolGroup,
      disableToolGroup
    }}>
      {children}
    </ToolsContext.Provider>
  );
}

export function useTools() {
  const context = useContext(ToolsContext);
  if (!context) {
    throw new Error('useTools must be used within a ToolsProvider');
  }
  return context;
} 