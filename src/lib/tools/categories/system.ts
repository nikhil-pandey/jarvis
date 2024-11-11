import {z} from 'zod';
import {zodToJsonSchema} from 'zod-to-json-schema';
import {BaseToolSettings, ShellCommandToolSettings, ShellCommandToolSettingsType} from '@/types/tools';
import {createToolCategory} from '../createCategory';

export const systemTools = createToolCategory({
  id: 'system',
  name: 'System Tools',
  description: 'Tools for system operations',
  tools: {
    get_clipboard_content: {
      settings: BaseToolSettings,
      definition: {
        name: 'get_clipboard_content',
        type: 'function',
        description: 'Get the current content of the system clipboard',
        parameters: zodToJsonSchema(z.object({}))
      },
      execute: async () => {
        const content = await navigator.clipboard.readText();
        return {
          'clipboard_content': content
        };
      },
      enabled: false
    },
    set_clipboard_content: {
      settings: BaseToolSettings,
      definition: {
        name: 'set_clipboard_content',
        type: 'function',
        description: 'Set content to the system clipboard',
        parameters: zodToJsonSchema(z.object({
          content: z.string().describe('The content to set in the clipboard')
        }))
      },
      execute: async ({content}: {content: string}) => {
        await navigator.clipboard.writeText(content);
        return {
          'success': true
        };
      },
      enabled: false
    },
    run_shell_command: {
      settings: ShellCommandToolSettings,
      definition: {
        name: 'run_shell_command',
        type: 'function',
        description: 'Run commands in a bash shell\n' +
      '* When invoking this tool, the contents of the "command" parameter does NOT need to be XML-escaped.\n' +
          '* State is persistent across command calls and discussions with the user.\n' +
          "* To inspect a particular line range of a file, e.g. lines 10-25, try 'sed -n 10,25p /path/to/the/file'.\n" +
          '* Please avoid commands that may produce a very large amount of output.\n' +
          "* Please run long lived commands in the background, e.g. 'sleep 10 &' or start a server in the background.\n",
        parameters: zodToJsonSchema(z.object({
          command: z.string().describe('The bash command to run.')
        }))
      },
      execute: async ({command}, settings: ShellCommandToolSettingsType) => {
        if (!settings?.baseDirectory || !settings?.allowedCommands) {
          throw new Error('Shell command settings not properly configured');
        }

        const response = await fetch('/api/system/shell', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            command,
            settings
          })
        });

        if (!response.ok) {
          throw new Error('Shell command execution failed');
        }

        return response.json();
      },
      enabled: false
    }
  }
}); 