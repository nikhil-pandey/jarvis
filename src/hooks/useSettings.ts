'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings, getDefaultSettings } from '@/types/settings';

type SettingsStore = {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
};

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: getDefaultSettings(),
      updateSettings: (newSettings) => 
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
          },
        })),
    }),
    {
      name: 'jarvis_settings',
    }
  )
); 