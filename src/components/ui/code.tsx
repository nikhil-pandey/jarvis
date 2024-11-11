import * as React from "react"
import { cn } from "@/lib/utils"

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  language?: string;
  inline?: boolean;
}

const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ className, inline, language, children, ...props }, ref) => {
    const Component = inline ? 'code' : 'pre';
    
    return (
      <Component
        ref={ref}
        className={cn(
          // Base styles
          "font-mono text-sm",
          // Inline code styles
          inline && "px-1 py-0.5 rounded-md bg-muted/50 text-foreground",
          // Block code styles
          !inline && "rounded-lg border bg-muted/50 px-3 py-2 w-full text-foreground",
          // Language class for syntax highlighting if needed
          language && `language-${language}`,
          className
        )}
        {...props}
      >
        {/* Ensure proper content wrapping */}
        {inline ? children : (
          <code className="w-full whitespace-pre-wrap">
            {children}
          </code>
        )}
      </Component>
    )
  }
)
Code.displayName = "Code"

export { Code }