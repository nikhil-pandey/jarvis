import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

const TextEditorSettings = z.object({
  basePath: z.string(),
  maxFileSize: z
    .string()
    .optional()
    .default('1024000'), // 1MB default
  backupLimit: z.string().optional().default('10'),
  truncateLength: z.string().optional().default('1000'),
});

// Keep track of file backups for undo functionality
const fileBackups = new Map<string, string[]>();

async function ensureBackupExists(filePath: string, content: string, backupLimit: number) {
  if (!fileBackups.has(filePath)) {
    fileBackups.set(filePath, []);
  }

  const backups = fileBackups.get(filePath)!;
  backups.push(content);

  // Maintain backup limit based on settings
  while (backups.length > backupLimit) {
    backups.shift();
  }
}

async function handleView(
  fullPath: string,
  parsedSettings: z.infer<typeof TextEditorSettings>,
  viewRange?: number[]
) {
  const stat = await fs.stat(fullPath);

  if (stat.isDirectory()) {
    const items = await fs.readdir(fullPath, { withFileTypes: true });
    const output: string[] = [];

    for (const item of items) {
      if (!item.name.startsWith('.')) {
        output.push(`${item.isDirectory() ? 'd' : 'f'} ${item.name}`);

        if (item.isDirectory()) {
          try {
            const subItems = await fs.readdir(path.join(fullPath, item.name));
            subItems
              .filter(subItem => !subItem.startsWith('.'))
              .forEach(subItem => {
                output.push(`  - ${subItem}`);
              });
          } catch (error) {
            // Skip inaccessible subdirectories
            continue;
          }
        }
      }
    }

    return output.join('\n');
  } else {
    // Check file size before reading
    if (stat.size > parseInt(parsedSettings.maxFileSize)) {
      throw new Error('File too large');
    }

    const content = await fs.readFile(fullPath, 'utf-8');
    const lines = content.split('\n');

    if (viewRange) {
      const [start, end] = viewRange;
      const adjustedEnd = end === -1 ? lines.length : end;
      return lines
        .slice(start - 1, adjustedEnd)
        .map((line, idx) => `${start + idx}: ${line}`)
        .join('\n');
    }

    return lines.map((line, idx) => `${idx + 1}: ${line}`).join('\n');
  }
}

async function handleCreate(fullPath: string, fileText: string) {
  if (await fs.stat(fullPath).catch(() => null)) {
    throw new Error('File already exists');
  }

  await fs.writeFile(fullPath, fileText);
  return 'File created successfully';
}

async function handleStrReplace(
  fullPath: string,
  oldStr: string,
  newStr: string = '',
  backupLimit: number
) {
  const content = await fs.readFile(fullPath, 'utf-8');

  // Count occurrences of oldStr
  const occurrences = content.split(oldStr).length - 1;
  if (occurrences === 0) {
    throw new Error('Old string not found in file');
  }
  if (occurrences > 1) {
    throw new Error('Old string is not unique in file');
  }

  await ensureBackupExists(fullPath, content, backupLimit);
  const updatedContent = content.replace(oldStr, newStr);
  await fs.writeFile(fullPath, updatedContent);

  return 'File updated successfully';
}

async function handleInsert(
  fullPath: string,
  insertLine: number,
  newStr: string,
  backupLimit: number
) {
  const content = await fs.readFile(fullPath, 'utf-8');
  const lines = content.split('\n');

  if (insertLine < 0 || insertLine > lines.length) {
    throw new Error('Invalid line number');
  }

  await ensureBackupExists(fullPath, content, backupLimit);
  lines.splice(insertLine, 0, newStr);
  await fs.writeFile(fullPath, lines.join('\n'));

  return 'Text inserted successfully';
}

async function handleUndoEdit(fullPath: string) {
  const backups = fileBackups.get(fullPath);
  if (!backups || backups.length === 0) {
    throw new Error('No backup available for this file');
  }

  const lastVersion = backups.pop()!;
  await fs.writeFile(fullPath, lastVersion);

  return 'Last edit undone successfully';
}

export async function POST(request: Request) {
  try {
    const { command, path: filePath, settings, ...params } = await request.json();

    const parsedSettings = TextEditorSettings.parse(settings);

    const fullPath = path.join(parsedSettings.basePath, filePath);

    // Ensure path is within allowed directory
    const normalizedPath = path.normalize(fullPath);
    const normalizedBase = path.normalize(parsedSettings.basePath);
    if (!normalizedPath.startsWith(normalizedBase)) {
      return NextResponse.json(
        { error: 'Access denied: Path outside base directory' },
        { status: 403 }
      );
    }

    let output: string;

    switch (command) {
      case 'view':
        output = await handleView(fullPath, parsedSettings, params.view_range);
        break;
      case 'create':
        if (!params.file_text) {
          throw new Error('file_text parameter is required for create command');
        }
        output = await handleCreate(fullPath, params.file_text);
        break;
      case 'str_replace':
        if (!params.old_str) {
          throw new Error('old_str parameter is required for str_replace command');
        }
        output = await handleStrReplace(
          fullPath,
          params.old_str,
          params.new_str,
          parseInt(parsedSettings.backupLimit)
        );
        break;
      case 'insert':
        if (!params.insert_line || !params.new_str) {
          throw new Error('insert_line and new_str parameters are required for insert command');
        }
        output = await handleInsert(
          fullPath,
          params.insert_line,
          params.new_str,
          parseInt(parsedSettings.backupLimit)
        );
        break;
      case 'undo_edit':
        output = await handleUndoEdit(fullPath);
        break;
      default:
        throw new Error('Invalid command');
    }

    // Truncate long outputs
    if (output.length > parseInt(parsedSettings.truncateLength)) {
      output = output.slice(0, parseInt(parsedSettings.truncateLength)) + '\n<response clipped>';
    }

    return NextResponse.json({ output });
  } catch (error) {
    console.trace('Error executing text editor command:', error);
    return NextResponse.json(
      {
        error: 'Text editor command failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
