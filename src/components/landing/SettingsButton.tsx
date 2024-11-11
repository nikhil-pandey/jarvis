'use client';

import React, {useState} from 'react';
import {SettingsIcon} from 'lucide-react';
import {SettingsDialog} from '../settings/SettingsDialog';
import type {Settings} from '@/types/settings';

interface SettingsButtonProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export function SettingsButton({settings, onSettingsChange}: SettingsButtonProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="p-2 rounded-full hover:bg-gray-800 transition-colors"
      >
        <SettingsIcon size={24} />
      </button>

      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={(newSettings) => {
          onSettingsChange(newSettings);
        }}
      />
    </>
  );
}