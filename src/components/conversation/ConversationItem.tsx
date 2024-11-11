import {ConversationContent} from './ConversationContent';
import {cn} from "@/lib/utils";
import type {ConversationItemProps} from '@/types/conversation';
import {ActionToolbar} from './ActionToolbar';

export function ConversationItem({item, onDelete, readOnly = false}: ConversationItemProps) {
  const isUser = item.role === 'user';
  const isTool = item.type === 'function_call' || item.type === 'function_call_output';

  return (
    <div className="group pt-4 first:pt-0">
      <div className={cn(
        "relative flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}>
        <div className={cn(
          "relative max-w-[85%] min-w-[240px] rounded-xl px-4 py-3",
          "backdrop-blur-sm transition-all duration-200",
          "border shadow-lg hover:shadow-blue-500/10",
          isUser && "bg-blue-600/20 border-blue-500/30 text-gray-100",
          !isUser && !isTool && "bg-gray-900/40 border-gray-800 text-gray-200",
          isTool && "bg-purple-950/60 border-purple-400/40 text-gray-50",
        )}>
          <ActionToolbar
            item={item}
            isUser={isUser}
            onDelete={onDelete}
            readOnly={readOnly}
          />

          <div className="space-y-2">
            {isTool && (
              <ToolLabel type={item.type} />
            )}
            <div className="flex items-start justify-between gap-4">
              <ConversationContent item={item} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolLabel({type}: {type: string}) {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-full bg-purple-400/20 px-2 py-0.5 text-xs font-medium text-purple-200 border border-purple-400/40">
        {type === 'function_call' ? 'Tool Call' : 'Tool Response'}
      </div>
    </div>
  );
}