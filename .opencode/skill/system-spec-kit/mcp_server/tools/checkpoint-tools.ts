// ---------------------------------------------------------------
// MODULE: Checkpoint Tools
// ---------------------------------------------------------------
// Dispatch for L5 checkpoint tools: create, list, restore,
// delete (T303).
// ---------------------------------------------------------------

import {
  handleCheckpointCreate,
  handleCheckpointList,
  handleCheckpointRestore,
  handleCheckpointDelete,
} from '../handlers';

import {
  MCPResponse, parseArgs,
  CheckpointCreateArgs, CheckpointListArgs,
  CheckpointRestoreArgs, CheckpointDeleteArgs,
} from './types';

/** Tool names handled by this module */
export const TOOL_NAMES = new Set([
  'checkpoint_create',
  'checkpoint_list',
  'checkpoint_restore',
  'checkpoint_delete',
]);

/** Dispatch a tool call. Returns null if tool name not handled. */
export async function handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
  switch (name) {
    case 'checkpoint_create':  return handleCheckpointCreate(parseArgs<CheckpointCreateArgs>(args));
    case 'checkpoint_list':    return handleCheckpointList(parseArgs<CheckpointListArgs>(args));
    case 'checkpoint_restore': return handleCheckpointRestore(parseArgs<CheckpointRestoreArgs>(args));
    case 'checkpoint_delete':  return handleCheckpointDelete(parseArgs<CheckpointDeleteArgs>(args));
    default: return null;
  }
}
