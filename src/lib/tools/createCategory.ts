import type { ToolDefinitionType } from '@openai/realtime-api-beta/dist/lib/client';
import { z } from 'zod';

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  tools: Record<string, {
    settings: z.ZodType;
    definition: ToolDefinitionType;
    execute: (args: unknown, settings: unknown) => Promise<unknown>;
    enabled: boolean;
  }>;
}

export function createToolCategory(category: ToolCategory): ToolCategory {
  return category;
} 