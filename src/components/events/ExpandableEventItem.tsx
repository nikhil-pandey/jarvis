'use client';

import React, { useState } from 'react';
import { EventItem } from './EventItem';
import type { RealtimeEvent } from '@/types/events';

interface ExpandableEventItemProps {
  entry: RealtimeEvent;
  startTime: string;
  isLastEvent: boolean;
}

export function ExpandableEventItem({ entry, startTime, isLastEvent }: ExpandableEventItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <EventItem
      entry={entry}
      startTime={startTime}
      isExpanded={isExpanded}
      isLastEvent={isLastEvent}
      onToggleExpand={() => setIsExpanded(!isExpanded)}
    />
  );
} 