import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KustoToolSettings, KustoToolSettingsType } from '@/types/tools';
import { createToolCategory } from '../createCategory';

export const dataTools = createToolCategory({
  id: 'data',
  name: 'Data Tools',
  description: 'Tools for data querying and analysis',
  tools: {
    query_kusto: {
      settings: KustoToolSettings,
      definition: {
        name: 'query_kusto',
        type: 'function',
        description: 'Execute a Kusto query against Azure Data Explorer',
        parameters: zodToJsonSchema(z.object({
          query: z.string().describe('The Kusto query to execute')
        }))
      },
      execute: async ({query}, settings: KustoToolSettingsType) => {
        const response = await fetch('/api/kusto', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ query, settings })
        });
        return response.json();
      },
      enabled: false
    }
  }
}); 