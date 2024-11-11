'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ConversationItem } from '@/types/conversation';

const MAX_THREADS = 50; // Maximum number of threads to store
const MAX_ITEMS_PER_THREAD = 100; // Maximum messages per thread

export interface ChatThread {
  id: string;
  title: string;
  items: ConversationItem[];
  timestamp: string;
}

type ChatHistoryStore = {
  threads: ChatThread[];
  addThread: (thread: ChatThread) => void;
  deleteThread: (threadId: string) => void;
};

export const useChatHistory = create<ChatHistoryStore>()(
  persist(
    (set) => ({
      threads: [],
      addThread: (thread) =>
        set((state) => {
          // Trim items if they exceed the limit
          const trimmedThread = {
            ...thread,
            items: thread.items.slice(-MAX_ITEMS_PER_THREAD)
          };

          // Add new thread to the beginning and limit total threads
          const updatedThreads = [trimmedThread, ...state.threads]
            .slice(0, MAX_THREADS);

          return { threads: updatedThreads };
        }),
      deleteThread: (threadId) =>
        set((state) => ({
          threads: state.threads.filter((t) => t.id !== threadId),
        })),
    }),
    {
      name: 'chat_history',
      // Add storage options to handle quota errors
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null;
          
          try {
            const str = window.localStorage.getItem(name);
            return str ? JSON.parse(str) : null;
          } catch (err) {
            console.warn('Failed to load chat history:', err);
            return null;
          }
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return;

          try {
            window.localStorage.setItem(name, JSON.stringify(value));
          } catch (err) {
            console.warn('Failed to save chat history:', err);
            // If storage is full, clear it and try again
            if (err instanceof Error && err.name === 'QuotaExceededError') {
              window.localStorage.clear();
              try {
                window.localStorage.setItem(name, JSON.stringify(value));
              } catch (retryErr) {
                console.error('Still failed to save after clearing storage:', retryErr);
              }
            }
          }
        },
        removeItem: (name) => {
          if (typeof window === 'undefined') return;
          window.localStorage.removeItem(name);
        },
      },
    }
  )
);