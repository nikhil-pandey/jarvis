'use client';

import React, {useEffect, useRef, useState} from 'react';
import type {AutoScrollProps} from '@/types/components';

export function AutoScrollContainer({ 
  children, 
  enabled = true, 
  threshold = 150 
}: AutoScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const lastScrollTopRef = useRef(0);
  const scrollFrameRef = useRef<number>();
  const scrollHeightRef = useRef(0);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    // Batch scroll updates using RAF
    const updateScroll = () => {
      if (!autoScroll || !container) return;
      
      const scrollHeight = container.scrollHeight;
      // Only scroll if height has changed
      if (scrollHeight !== scrollHeightRef.current) {
        container.scrollTop = scrollHeight;
        lastScrollTopRef.current = scrollHeight;
        scrollHeightRef.current = scrollHeight;
      }
      scrollFrameRef.current = requestAnimationFrame(updateScroll);
    };

    // Start scroll loop
    scrollFrameRef.current = requestAnimationFrame(updateScroll);

    // Handle manual scrolling
    const handleScroll = () => {
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      
      // Only update autoScroll if user has scrolled significantly
      if (Math.abs(scrollTop - lastScrollTopRef.current) > 50) {
        setAutoScroll(distanceFromBottom <= threshold);
        lastScrollTopRef.current = scrollTop;
      }
    };

    // Handle user interaction
    const handleUserInteraction = () => {
      if (!container) return;
      
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      setAutoScroll(distanceFromBottom <= threshold);
    };

    // Throttled scroll handler
    let scrollTimeout: NodeJS.Timeout;
    const throttledScrollHandler = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 100);
    };

    container.addEventListener('scroll', throttledScrollHandler, { passive: true });
    container.addEventListener('wheel', handleUserInteraction, { passive: true });
    container.addEventListener('touchstart', handleUserInteraction, { passive: true });

    return () => {
      if (scrollFrameRef.current) {
        cancelAnimationFrame(scrollFrameRef.current);
      }
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      container.removeEventListener('scroll', throttledScrollHandler);
      container.removeEventListener('wheel', handleUserInteraction);
      container.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [enabled, threshold, autoScroll]);

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-y-auto"
      style={{ 
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgb(75 85 99) transparent',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {children}
    </div>
  );
} 