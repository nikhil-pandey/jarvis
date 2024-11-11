'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BaseToolSettingsType } from '@/types/tools';

type ToolSettingsStore = {
  settings: Record<string, BaseToolSettingsType>;
  updateSettings: (toolId: string, settings: BaseToolSettingsType) => void;
  getSettings: (toolId: string) => BaseToolSettingsType;
};

export const useToolSettings = create<ToolSettingsStore>()(
  persist(
    (set, get) => ({
      settings: {},
      updateSettings: (toolId, settings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            [toolId]: settings,
          },
        }));
      },
      getSettings: (toolId) => {
        const state = get();
        return state.settings[toolId] || {};
      },
    }),
    {
      name: 'tool-settings',
    }
  )
); 