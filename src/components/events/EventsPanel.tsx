'use client';

import React, { useState, useMemo } from 'react';
import type { RealtimeEvent } from '@/types/events';
import { ExpandableEventItem } from './ExpandableEventItem';
import { SearchBar } from './SearchBar';

type Props = {
  events: RealtimeEvent[];
  startTime: string;
};

export function EventsPanel({ events, startTime }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    
    const query = searchQuery.toLowerCase();
    return events.filter(entry => {
      const event = entry.event;
      if (!event?.type) return false;
      
      // Search in event type
      if ((event.type as string).toLowerCase().includes(query)) return true;
      
      // Search in stringified event data
      const eventString = JSON.stringify(event).toLowerCase();
      return eventString.includes(query);
    });
  }, [events, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-gray-950">
      <div className="p-2 border-b border-gray-800 bg-gray-900/50">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredEvents.map((entry, index) => (
          <ExpandableEventItem
            key={entry.event?.event_id}
            entry={entry}
            startTime={startTime}
            isLastEvent={index === filteredEvents.length - 1}
          />
        ))}
        {!filteredEvents.length && searchQuery && (
          <div className="text-xs text-gray-400 py-1 px-2 bg-gray-900/50 rounded-md border border-gray-800">
            No matching events found
          </div>
        )}
        {!events.length && !searchQuery && (
          <div className="text-xs text-gray-400 py-1 px-2 bg-gray-900/50 rounded-md border border-gray-800">
            Awaiting connection...
          </div>
        )}
      </div>
    </div>
  );
}