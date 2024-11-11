'use client';

import ReactMarkdown from 'react-markdown';
import {Code} from '@/components/ui/code';
import {cn} from '@/lib/utils';
import type {Components} from 'react-markdown';

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({content, className}: MarkdownProps) {
  const components: Components = {
    code({node, inline, className, children, ...props}) {
      const match = /language-(\w+)/.exec(className || '');
      if (inline) {
        return (
          <code
            className="px-1 py-0.5 rounded-md bg-muted font-mono text-sm"
            {...props}
          >
            {children}
          </code>
        );
      }
      return (
        <Code
          className="my-2"
          language={match?.[1]}
          {...props}
        >
          {children}
        </Code>
      );
    },
    // Override pre to remove default padding as we're using our Code component
    pre({children}) {
      return <>{children}</>;
    },
  };

  return (
    <ReactMarkdown
      className={cn("prose prose-sm dark:prose-invert max-w-none", className)}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
} 