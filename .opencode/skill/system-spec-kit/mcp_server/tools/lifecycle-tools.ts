// ---------------------------------------------------------------
// MODULE: Lifecycle Tools
// ---------------------------------------------------------------
// Dispatch for L6-L7 lifecycle tools: index_scan, preflight,
// postflight, learning_history (T303).
// ---------------------------------------------------------------

import {
  handleMemoryIndexScan,
  handleTaskPreflight,
  handleTaskPostflight,
  handleGetLearningHistory,
} from '../handlers';

import {
  MCPResponse, parseArgs,
  ScanArgs, PreflightArgs, PostflightArgs, LearningHistoryArgs,
} from './types';

/** Tool names handled by this module */
export const TOOL_NAMES = new Set([
  'memory_index_scan',
  'task_preflight',
  'task_postflight',
  'memory_get_learning_history',
]);

/** Dispatch a tool call. Returns null if tool name not handled. */
export async function handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
  switch (name) {
    case 'memory_index_scan':          return handleMemoryIndexScan(parseArgs<ScanArgs>(args));
    case 'task_preflight':             return handleTaskPreflight(parseArgs<PreflightArgs>(args));
    case 'task_postflight':            return handleTaskPostflight(parseArgs<PostflightArgs>(args));
    case 'memory_get_learning_history': return handleGetLearningHistory(parseArgs<LearningHistoryArgs>(args));
    default: return null;
  }
}
