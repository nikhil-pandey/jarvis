import {ScrollArea} from '@/components/ui/scroll-area';
import {Card} from '@/components/ui/card';
import {ConversationItem} from './ConversationItem';
import type {ConversationPanelProps} from '@/types/conversation';

export function ConversationPanel({ 
  items, 
  onDeleteItem, 
  readOnly = false 
}: ConversationPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 bg-gray-900/50 border-gray-800 flex flex-col">
        <div className="flex-none border-b border-gray-800 px-4 py-3">
          <h3 className="font-medium text-sm text-gray-200">
            {readOnly ? 'History View' : 'Conversation'}
          </h3>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col space-y-4 p-4">
            {!items.length && (
              <div className="text-center text-sm text-gray-500">
                {readOnly ? 'No messages in this thread' : 'Awaiting connection...'}
              </div>
            )}
            {items.map((item) => (
              <ConversationItem
                key={item.id}
                item={item}
                readOnly={readOnly}
                onDelete={onDeleteItem}
              />
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
} 