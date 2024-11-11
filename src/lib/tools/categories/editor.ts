import {z} from 'zod';
import {zodToJsonSchema} from 'zod-to-json-schema';
import {TextEditorToolSettings, TextEditorToolSettingsType} from '@/types/tools';
import {createToolCategory} from '../createCategory';

export const editorTools = createToolCategory({
  id: 'editor',
  name: 'Editor Tools',
  description: 'Tools for text editing',
  tools: {
    text_editor: {
      settings: TextEditorToolSettings,
      definition: {
        name: 'text_editor',
        type: 'function',
        description: 'Custom editing tool for viewing, creating and editing files\n' +
    '* State is persistent across command calls and discussions with the user\n' +
    '* If `path` is a file, `view` displays the result of applying `cat -n`. If `path` is a directory, `view` lists non-hidden files and directories up to 2 levels deep\n' +
    '* The `create` command cannot be used if the specified `path` already exists as a file\n' +
    '* If a `command` generates a long output, it will be truncated and marked with `<response clipped>`\n' +
    '* The `undo_edit` command will revert the last edit made to the file at `path`\n\n' +
    'Notes for using the `str_replace` command:\n' +
    '* The `old_str` parameter should match EXACTLY one or more consecutive lines from the original file. Be mindful of whitespaces!\n' +
    '* If the `old_str` parameter is not unique in the file, the replacement will not be performed. Make sure to include enough context in `old_str` to make it unique\n' +
    '* The `new_str` parameter should contain the edited lines that should replace the `old_str`\n',
        parameters: zodToJsonSchema(z.object({
          command: z
            .enum(['view', 'create', 'str_replace', 'insert', 'undo_edit'])
            .describe(
              'The commands to run. Allowed options are: `view`, `create`, `str_replace`, `insert`, `undo_edit`.'
            ),
          path: z
            .string()
            .describe("Absolute path to file or directory, e.g. 'path/to/file.py' or 'path/to/directory'."),
          file_text: z
            .string()
            .optional()
            .describe(
              'Required parameter of `create` command, with the content of the file to be created.'
            ),
          old_str: z
            .string()
            .optional()
            .describe(
              'Required parameter of `str_replace` command containing the string in `path` to replace.'
            ),
          new_str: z
            .string()
            .optional()
            .describe(
              'Optional parameter of `str_replace` command containing the new string (if not given, no string will be added). Required parameter of `insert` command containing the string to insert.'
            ),
          insert_line: z
            .number()
            .int()
            .optional()
            .describe(
              'Required parameter of `insert` command. The `new_str` will be inserted AFTER the line `insert_line` of `path`.'
            ),
          view_range: z
            .array(z.number().int())
            .length(2)
            .optional()
            .describe(
              'Optional parameter of `view` command when `path` points to a file. If none is given, the full file is shown. If provided, the file will be shown in the indicated line number range, e.g. [11, 12] will show lines 11 and 12. Indexing at 1 to start. Setting `[start_line, -1]` shows all lines from `start_line` to the end of the file.'
            ),
        }))
      },
      execute: async (params: object, settings: TextEditorToolSettingsType) => {
        const response = await fetch('/api/system/text-editor', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({...params, settings})
        });
        return response.json();
      },
      enabled: false
    }
  }
}); 