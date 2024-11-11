import type { ToolCategory } from './createCategory';
import type { ToolGroup } from '@/types/tools';

export function createToolRegistry(categories: ToolCategory[]) {
  const TOOL_REGISTRY: Record<string, any> = {};
  const TOOL_GROUPS: ToolGroup[] = [];

  categories.forEach(category => {
    // Add tools to registry
    Object.entries(category.tools).forEach(([id, tool]) => {
      TOOL_REGISTRY[id] = tool;
    });

    // Create tool group
    TOOL_GROUPS.push({
      id: category.id,
      name: category.name,
      description: category.description,
      tools: Object.keys(category.tools)
    });
  });

  return { TOOL_REGISTRY, TOOL_GROUPS };
} 