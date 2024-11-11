import { createToolRegistry } from '@/lib/tools/createRegistry';
import { weatherTools } from '@/lib/tools/categories/weather';
import { systemTools } from '@/lib/tools/categories/system';
import { editorTools } from '@/lib/tools/categories/editor';
import { agentTools } from '@/lib/tools/categories/agent';
import { dataTools } from '@/lib/tools/categories/data';

export const { TOOL_REGISTRY, TOOL_GROUPS } = createToolRegistry([
  weatherTools,
  systemTools,
  editorTools,
  agentTools,
  dataTools
]); 