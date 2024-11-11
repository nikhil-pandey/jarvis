'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Code } from '@/components/ui/code';
import { Markdown } from '@/components/ui/markdown';
import { ConversationItemProps } from '@/types/conversation';
import { cn } from "@/lib/utils";

export function ConversationContent({ item }: Pick<ConversationItemProps, 'item'>) {
  if (item.type === 'function_call_output') {
    const output = item?.formatted?.output || '';
    if (output.trim().startsWith('{') && output.trim().endsWith('}')) {
      try {
        const parsedOutput = JSON.parse(output);
        return (
          <ScrollArea className="max-h-[200px] w-full">
            <div className="space-y-2">
              {Object.entries(parsedOutput).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <div className="text-sm text-gray-400">{key}</div>
                  <Code className="text-sm whitespace-pre-wrap bg-gray-900/75 border-gray-800/50 text-gray-100">
                    {JSON.stringify(value, null, 2)}
                  </Code>
                </div>
              ))}
            </div>
          </ScrollArea>
        );
      } catch (e) {
        return (
          <Code className="text-sm whitespace-pre-wrap bg-gray-900/75 border-gray-800/50 text-gray-100">
            {output}
          </Code>
        );
      }
    }
    return (
      <Code className="text-sm whitespace-pre-wrap bg-gray-900/75 border-gray-800/50 text-gray-100">
        {output}
      </Code>
    );
  }

  if (item.formatted.tool) {
    const args = item?.formatted?.tool?.arguments || '';
    if (args.trim().startsWith('{') && args.trim().endsWith('}')) {
      try {
        const parsedArgs = JSON.parse(args);
        return (
          <div className="space-y-2 w-full">
            <div className="font-medium text-sm text-purple-300">
              {item.formatted.tool.name}
            </div>
            <ScrollArea className="max-h-[200px]">
              <div className="space-y-2">
                {Object.entries(parsedArgs).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="text-sm text-purple-200">{key}</div>
                    <Code className="text-xs bg-gray-900/75 border-gray-800/50 text-purple-200">
                      {JSON.stringify(value, null, 2)}
                    </Code>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        );
      } catch (e) {
        return (
          <div className="space-y-2 w-full">
            <div className="font-medium text-sm text-purple-300">
              {item.formatted.tool.name}
            </div>
            <Code className="text-xs bg-gray-900/75 border-gray-800/50 text-purple-200">
              {args}
            </Code>
          </div>
        );
      }
    }
    return (
      <div className="space-y-2 w-full">
        <div className="font-medium text-sm text-purple-300">
          {item.formatted.tool.name}
        </div>
        <Code className="text-xs bg-gray-900/75 border-gray-800/50 text-purple-200">
          {args}
        </Code>
      </div>
    );
  }

  const content = item.formatted.transcript ||
    (item.formatted.audio?.length
      ? '(awaiting transcript)'
      : item.formatted.text ||
      '(item sent)');

  return (
    <div className={cn(
      "text-sm leading-relaxed",
      item.role === 'assistant' ? 'prose-pre:my-0' : ''
    )}>
      <Markdown 
        content={content || ''} 
        className={cn(
          "prose-headings:text-gray-100",
          "prose-a:text-blue-400 hover:prose-a:text-blue-300", 
          "prose-code:text-gray-100 prose-code:bg-gray-800/75",
          "prose-pre:bg-gray-900/75 prose-pre:border prose-pre:border-gray-800/50",
          "prose-strong:text-gray-100 prose-strong:font-semibold",
          "prose-em:text-gray-200",
          "prose-ul:text-gray-200 prose-ol:text-gray-200",
          "prose-blockquote:text-gray-300 prose-blockquote:border-gray-700",
          item.role === 'user' 
            ? "prose-invert prose-p:text-gray-100" 
            : "prose-foreground prose-p:text-gray-200"
        )}
      />
    </div>
  );
}