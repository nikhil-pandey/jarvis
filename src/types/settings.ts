import { SessionConfig, getDefaultSessionConfig } from "./client";

export interface Settings {
  connection: ConnectionSettings;
  chat: ChatSettings;
}

export interface ConnectionSettings {
  isAzure: boolean;
  apiKey: string;
  endpoint: string;
  deployment: string;
  apiVersion: string;
}

export type ChatSettings = SessionConfig;

export const getDefaultConnectionSettings = (): ConnectionSettings => ({
  isAzure: false,
  apiKey: '',
  endpoint: '',
  deployment: '',
  apiVersion: '2024-08-01-preview'
});

export const getDefaultSettings = (): Settings => ({
  connection: getDefaultConnectionSettings(),
  chat: getDefaultSessionConfig(),
});
