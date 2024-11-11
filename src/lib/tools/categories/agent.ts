import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { GptAgentToolSettings } from '@/types/tools';
import { createToolCategory } from '../createCategory';

export const agentTools = createToolCategory({
  id: 'agent',
  name: 'Agents',
  description: 'AI agent tools',
  tools: {
    agent_with_tools: {
      settings: GptAgentToolSettings,
      definition: {
        name: 'agent_with_tools',
        type: 'function',
        description: 'Execute a autonomous agent that can use specified tools to accomplish a given task. You can take a complex task and break it down into smaller steps that can be accomplished with the available tools and then use this tool to execute the agent. Make sure there is no overlap between the tasks if you are using this tool multiple times. The agent is highly capable so you can be sure that it will complete the task. You do not need to verify the output of the agent, just let it run.',
        parameters: zodToJsonSchema(z.object({
          task: z.string().describe('The task description including context and expected output format')
        }))
      },
      execute: async ({task}, settings) => {
        const response = await fetch('/api/system/gpt-agent', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ task, settings })
        });
        return response.json();
      },
      enabled: false
    }
  }
}); 