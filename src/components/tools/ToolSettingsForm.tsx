'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { TOOL_REGISTRY } from '@/lib/tools/registry';
import type { BaseToolSettingsType } from '@/types/tools';

interface ToolSettingsFormProps {
  toolId: string;
  initialSettings: BaseToolSettingsType;
  onSubmit: (settings: BaseToolSettingsType) => void;
}

type SettingsState = Record<string, string | number | boolean | string[]>;
type ArrayInputsState = Record<string, string>;

export function ToolSettingsForm({ toolId, initialSettings, onSubmit }: ToolSettingsFormProps) {
  const tool = TOOL_REGISTRY[toolId];
  const [settings, setSettings] = useState<SettingsState>(initialSettings);
  const [arrayInputs, setArrayInputs] = useState<ArrayInputsState>(() => {
    // Initialize array inputs with joined string values
    const initialArrayInputs: ArrayInputsState = {};
    Object.entries(initialSettings).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        initialArrayInputs[key] = value.join(', ');
      }
    });
    return initialArrayInputs;
  });
  
  if (!tool?.settings) {
    return null;
  }

  const validateAndConvertField = (
    key: string,
    value: unknown,
    schema: z.ZodType
  ): { success: true; data: unknown } | { success: false; error: z.ZodError } => {
    let convertedValue = value;

    try {
      if (schema instanceof z.ZodNumber) {
        convertedValue = value === '' ? undefined : Number(value);
      } else if (schema instanceof z.ZodArray) {
        if (typeof value === 'string') {
          convertedValue = value.split(',').map(item => item.trim()).filter(Boolean);
        } else if (!Array.isArray(value)) {
          convertedValue = [];
        }
      }

      const parsed = schema.parse(convertedValue);
      return { success: true, data: parsed };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error };
      }
      throw error;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validatedData = Object.entries(tool.settings.shape).reduce<BaseToolSettingsType>(
      (acc, [key, schema]) => {
        const currentValue = settings[key];
        const result = validateAndConvertField(key, currentValue, schema as z.ZodType);
        
        if (result.success) {
          acc[key as keyof BaseToolSettingsType] = result.data;
        } else {
          console.warn(`Validation failed for ${key}:`, result.error);
          acc[key as keyof BaseToolSettingsType] = currentValue;
        }
        
        return acc;
      },
      {} as BaseToolSettingsType
    );

    onSubmit(validatedData);
  };

  const handleChange = (key: string, value: string | boolean, schema: z.ZodType) => {
    if (schema instanceof z.ZodArray) {
      setArrayInputs(prev => ({ ...prev, [key]: value as string }));
      
      if (typeof value === 'string' && value.endsWith(',')) {
        const arrayValue = value
          .slice(0, -1)
          .split(',')
          .map(item => item.trim())
          .filter(Boolean);
          
        setSettings(prev => ({
          ...prev,
          [key]: arrayValue
        }));
      }
    } else {
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const renderField = (key: string, schema: z.ZodType) => {
    const value = settings[key];

    if (schema instanceof z.ZodBoolean) {
      return (
        <div key={key} className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">{key}</label>
            {schema.description && (
              <p className="text-sm text-muted-foreground">{schema.description}</p>
            )}
          </div>
          <Switch
            checked={Boolean(value)}
            onCheckedChange={(checked) => handleChange(key, checked, schema)}
          />
        </div>
      );
    }

    if (schema instanceof z.ZodNumber) {
      return (
        <div key={key} className="space-y-2">
          <label className="text-sm font-medium">{key}</label>
          <Input
            type="number"
            value={value?.toString() ?? ''}
            onChange={(e) => handleChange(key, e.target.value, schema)}
          />
          {schema.description && (
            <p className="text-sm text-muted-foreground">{schema.description}</p>
          )}
        </div>
      );
    }

    if (schema instanceof z.ZodArray) {
      const inputValue = arrayInputs[key] ?? '';
      return (
        <div key={key} className="space-y-2">
          <label className="text-sm font-medium">{key}</label>
          <Input
            value={inputValue}
            onChange={(e) => handleChange(key, e.target.value, schema)}
            placeholder="Enter comma-separated values"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const arrayValue = inputValue
                  .split(',')
                  .map(item => item.trim())
                  .filter(Boolean);
                  
                setSettings(prev => ({
                  ...prev,
                  [key]: arrayValue
                }));
                setArrayInputs(prev => ({ ...prev, [key]: '' }));
              }
            }}
          />
          {schema.description && (
            <p className="text-sm text-muted-foreground">{schema.description}</p>
          )}
        </div>
      );
    }

    return (
      <div key={key} className="space-y-2">
        <label className="text-sm font-medium">{key}</label>
        <Input
          value={value?.toString() ?? ''}
          onChange={(e) => handleChange(key, e.target.value, schema)}
        />
        {schema.description && (
          <p className="text-sm text-muted-foreground">{schema.description}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {Object.entries(tool.settings.shape).map(([key, schema]) => 
        renderField(key, schema as z.ZodType)
      )}
      <Button type="submit" className="w-full">
        Save Settings
      </Button>
    </form>
  );
}