'use client';

import React from 'react';
import { EventsPanel } from '../events/EventsPanel';
import { AutoScrollContainer } from './AutoScrollContainer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useTools } from '@/contexts/ToolsContext';
import type { RealtimeEvent } from '@/types/events';
import { cn } from '@/lib/utils';
import { ToolsPanel } from '../tools/ToolsPanel';
import { HistoryPanel } from '../history/HistoryPanel';
import type { ChatThread } from '@/hooks/useChatHistory';

interface LeftSidebarProps {
  events: RealtimeEvent[];
  startTime: string;
  onToolSettingsClick: (toolId: string) => void;
  onThreadSelect: (thread: ChatThread) => void;
}

export function LeftSidebar({
  events,
  startTime,
  onToolSettingsClick,
  onThreadSelect
}: LeftSidebarProps) {
  const { tools, toolGroups, enableTool, disableTool, enableToolGroup, disableToolGroup } = useTools();

  return (
    <div className="w-80 flex-none bg-gray-900 border-r border-gray-800 overflow-y-auto">
      <Tabs defaultValue="events" className="flex-1 flex flex-col h-full">
        <div className="flex-none h-12 border-b border-gray-700">
          <TabsList className="w-full h-full bg-gray-900 rounded-none border-b border-gray-800">
            <TabsTrigger
              value="events"
              className={cn(
                "flex-1 h-full rounded-none border-r border-gray-800",
                "data-[state=active]:bg-gray-800",
                "data-[state=active]:text-blue-400",
                "data-[state=inactive]:text-gray-400",
                "data-[state=inactive]:hover:text-gray-200",
                "data-[state=inactive]:hover:bg-gray-800/50",
                "transition-colors"
              )}
            >
              Events
            </TabsTrigger>
            <TabsTrigger
              value="tools"
              className={cn(
                "flex-1 h-full rounded-none",
                "data-[state=active]:bg-gray-800",
                "data-[state=active]:text-blue-400",
                "data-[state=inactive]:text-gray-400",
                "data-[state=inactive]:hover:text-gray-200",
                "data-[state=inactive]:hover:bg-gray-800/50",
                "transition-colors"
              )}
            >
              Tools
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className={cn(
                "flex-1 h-full rounded-none",
                "data-[state=active]:bg-gray-800",
                "data-[state=active]:text-blue-400",
                "data-[state=inactive]:text-gray-400",
                "data-[state=inactive]:hover:text-gray-200",
                "data-[state=inactive]:hover:bg-gray-800/50",
                "transition-colors"
              )}
            >
              History
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="events" className="flex-1 relative m-0 overflow-hidden">
          <AutoScrollContainer>
            <EventsPanel events={events} startTime={startTime} />
          </AutoScrollContainer>
        </TabsContent>

        <TabsContent value="tools" className="flex-1 relative m-0 overflow-hidden">
          <ToolsPanel
            tools={tools}
            toolGroups={toolGroups}
            onToolToggle={(toolId, enabled) => enabled ? enableTool(toolId) : disableTool(toolId)}
            onToolGroupToggle={(groupId, enabled) => enabled ? enableToolGroup(groupId) : disableToolGroup(groupId)}
            onToolSettingsClick={onToolSettingsClick}
          />
        </TabsContent>

        <TabsContent value="history" className="flex-1 relative m-0 overflow-hidden">
          <HistoryPanel onThreadSelect={onThreadSelect} />
        </TabsContent>
      </Tabs>
    </div>
  );
}