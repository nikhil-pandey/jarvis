'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search events..." 
}: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8 h-8 text-xs bg-gray-900/50 border-gray-800 text-gray-300 
          placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 
          focus-visible:border-gray-700 hover:bg-gray-800/70 transition-colors"
      />
    </div>
  );
} 