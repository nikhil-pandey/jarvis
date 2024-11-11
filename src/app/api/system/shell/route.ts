import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { z } from 'zod';

const execAsync = promisify(exec);

const ShellSettings = z.object({
  baseDirectory: z.string(),
  allowedCommands: z.array(z.string()),
  timeout: z.string().optional().default('30000'),
  maxBuffer: z
    .string()
    .optional()
    .default('1024000'),
});

function isCommandAllowed(command: string, allowedCommands: string[]): boolean {
  return allowedCommands.some(pattern => {
    if (pattern.startsWith('^') && pattern.endsWith('$')) {
      return new RegExp(pattern).test(command);
    }
    return command.startsWith(pattern);
  });
}

export async function POST(request: Request) {
  try {
    const { command, settings } = await request.json();
    const parsedSettings = ShellSettings.parse(settings);

    if (!command) {
      return NextResponse.json({ error: 'Missing command parameter.' }, { status: 400 });
    }

    if (!isCommandAllowed(command, parsedSettings.allowedCommands)) {
      return NextResponse.json({ error: 'Command not allowed.' }, { status: 403 });
    }

    const options = {
      cwd: path.resolve(parsedSettings.baseDirectory),
      timeout: parseInt(parsedSettings.timeout),
      maxBuffer: parseInt(parsedSettings.maxBuffer),
    };

    console.log('Executing shell command: ', command);
    console.log('Shell options: ', options);

    const { stdout, stderr } = await execAsync(command, options);

    return NextResponse.json({
      stdout,
      stderr,
      success: !stderr,
    });
  } catch (error) {
    console.trace('Error executing shell command:', error);
    return NextResponse.json(
      {
        error: 'Command execution failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
