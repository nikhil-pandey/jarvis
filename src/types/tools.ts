import { z } from 'zod';
import type { ToolDefinitionType } from '@openai/realtime-api-beta/dist/lib/client';

// Base settings that all tools can have
export const BaseToolSettings = z.object({});

// Tool-specific settings
export const KustoToolSettings = z.object({
  clusterUri: z
    .string()
    .url()
    .describe('The Kusto cluster URI'),
  database: z.string().describe('The name of the database to query'),
  useDeviceAuth: z.boolean().optional().describe('Whether to use device authentication'),
  appId: z.string().optional().describe('The application ID for certificate authentication'),
  tenantId: z.string().describe('The tenant ID for authentication'),
  certificate: z.string().optional().describe('The certificate for authentication'),
  sendX5C: z.boolean().optional().describe('Whether to send x5c format')
});

export const TextEditorToolSettings = z.object({
  basePath: z.string().describe('Base directory for files'),
  maxFileSize: z.number().optional().describe('Maximum file size'),
  backupLimit: z.number().optional().describe('Maximum backup versions'),
  truncateLength: z.number().optional().describe('Maximum response length')
});

export const GptAgentToolSettings = z.object({
  systemPrompt: z.string().describe('System prompt'),
  model: z.string().describe('Model name'),
  apiKey: z.string().describe('API key'),
  endpoint: z.string().describe('API endpoint'),
  deployment: z.string().describe('Model deployment'),
  apiVersion: z.string().describe('API version'),
  userPrompt: z.string().optional().describe('User prompt'),
  temperature: z.number().optional().describe('Temperature')
});

export const ShellCommandToolSettings = z.object({
  baseDirectory: z.string().describe('Base directory'),
  allowedCommands: z.array(z.string()).describe('Allowed commands'),
  timeout: z.number().optional().describe('Timeout in ms'),
  maxBuffer: z.number().optional().describe('Max buffer size')
});

// Type exports
export type BaseToolSettingsType = z.infer<typeof BaseToolSettings>;
export type KustoToolSettingsType = z.infer<typeof KustoToolSettings>;
export type TextEditorToolSettingsType = z.infer<typeof TextEditorToolSettings>;
export type GptAgentToolSettingsType = z.infer<typeof GptAgentToolSettings>;
export type ShellCommandToolSettingsType = z.infer<typeof ShellCommandToolSettings>;

// Tool interfaces
export interface ToolRegistryEntry {
  settings: z.ZodType;
  definition: ToolDefinitionType;
  execute: (args: any, settings: any) => Promise<unknown>;
  enabled: boolean;
}

export interface ToolGroup {
  id: string;
  name: string;
  description?: string;
  tools: string[];
}

export type ToolExecutor = (args: Record<string, unknown>) => Promise<unknown>;

export interface ToolsContextProps {
  onToolEnabled: (definition: ToolDefinitionType, executor: ToolExecutor) => Promise<void>;
  onToolDisabled: (toolName: string) => Promise<void>;
}