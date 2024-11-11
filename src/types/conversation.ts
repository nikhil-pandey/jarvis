// @link https://github.com/nikhil-pandey/openai-realtime-api-beta/blob/main/lib/client.js#L160
export enum Role {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
}

export interface ConversationItem {
  id: string;
  type: 'text' | 'function_call' | 'function_call_output';
  role?: Role;
  status: 'in_progress' | 'completed' | 'cancelled';
  formatted: {
    text?: string;
    transcript?: string;
    audio?: Int16Array;
    tool?: {
      name: string;
      arguments: string;
    };
    output?: string;
    file?: {
      url: string;
    };
  };
}

export interface ConversationItemProps {
  item: ConversationItem;
  onDelete: (id: string) => void;
  readOnly?: boolean;
}

export interface ConversationPanelProps {
  items: ConversationItem[];
  onDeleteItem: (id: string) => void;
  readOnly?: boolean;
} 