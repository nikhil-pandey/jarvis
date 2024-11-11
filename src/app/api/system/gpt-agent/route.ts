import { NextResponse } from 'next/server';
import { OpenAI, AzureOpenAI } from 'openai';
import { z } from 'zod';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { handleAxiosError } from '@/lib/errors';

const RequestSchema = z.object({
  task: z.string(),
  settings: z.object({
    systemPrompt: z.string().optional(),
    userPrompt: z.string().optional(),
    temperature: z.string().optional(),
    model: z.string().optional(),
    apiKey: z.string().optional(),
    endpoint: z.string().optional(),
    deployment: z.string().optional(),
    apiVersion: z.string().optional(),
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { task, settings } = RequestSchema.parse(body);

    if (!settings.apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // if endpoint and deployment create azure openai client
    let client;
    if (settings.endpoint && settings.deployment) {
      client = new AzureOpenAI({
        apiKey: settings.apiKey,
        endpoint: settings.endpoint,
        deployment: settings.deployment,
        apiVersion: settings.apiVersion,
      });
    } else {
      client = new OpenAI({
        apiKey: settings.apiKey,
      });
    }

    // Prepare the messages array with proper typing
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: settings.systemPrompt || 'You are a helpful assistant.' },
      { role: 'user', content: `${settings.userPrompt || ''}${task}` },
    ];

    const response = await client.chat.completions.create({
      messages,
      model: settings.model || 'gpt-4o-mini',
      temperature: parseFloat(settings.temperature || '1.0'),
    });

    return NextResponse.json({
      output: response.choices[0].message.content,
    });
  } catch (error) {
    console.trace('Error in GPT agent execution:', error);
    const errorResponse = handleAxiosError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
} 