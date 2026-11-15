// ───────────────────────────────────────────────────────────────────
// MODULE: Public History Projection
// ───────────────────────────────────────────────────────────────────

import {
  isPagingToolCall,
  metadataFor,
  type HistoryItem,
  type HistoryTextBlock,
  type ModelTurnHistoryItem,
  type UserHistoryItem,
} from './history.js';

/** A non-paging tool call with its provider signature removed. */
export type PublicAssistantToolCall = {
  type: 'toolCall';
  id: string;
  name: string;
  arguments: unknown;
};

export type PublicAssistantBlock = HistoryTextBlock | PublicAssistantToolCall;

/** A model turn whose private blocks and paging exchanges are gone. */
export type RecoveryModelTurnHistoryItem = Omit<ModelTurnHistoryItem, 'assistantMessage'> & {
  assistantMessage: {
    content: (PublicAssistantBlock | null)[];
  };
};

export type RecoveryHistoryItem = UserHistoryItem | RecoveryModelTurnHistoryItem;

/**
 * Return a public block for text and non-paging tool calls.
 *
 * Thinking, images and every paging call return null. The null slot is kept so
 * a later page can still address the original content index.
 */
export function publicAssistantBlock(block: ModelTurnHistoryItem['assistantMessage']['content'][number]): PublicAssistantBlock | null {
  if (block.type === 'text') return { type: 'text', text: block.text };
  if (block.type === 'toolCall' && !isPagingToolCall(block)) {
    return {
      type: 'toolCall',
      id: block.id,
      name: block.name,
      arguments: block.arguments,
    };
  }
  return null;
}

/** Tool-call ids that belong to paging and must not reach a caller. */
export function pagingToolCallIds(item: ModelTurnHistoryItem): Set<string> {
  const ids = new Set<string>();
  for (const block of item.assistantMessage.content) {
    if (block.type === 'toolCall' && isPagingToolCall(block)) ids.add(block.id);
  }
  return ids;
}

function hasRecoverableTurnContent(item: ModelTurnHistoryItem, excludedIds: ReadonlySet<string>): boolean {
  // Decide from the projected blocks: a turn whose only content is private has
  // nothing a caller can read, even when no paging call was excluded.
  for (const block of item.assistantMessage.content) {
    if (block.type === 'toolCall' && excludedIds.has(block.id)) continue;
    if (publicAssistantBlock(block) !== null) return true;
  }
  return item.toolResults.some((result) => !excludedIds.has(result.toolCallId));
}

/** A turn is recoverable when any public content survives the projection. */
export function isRecoverableHistoryItem(item: HistoryItem): boolean {
  return item.kind === 'user' || hasRecoverableTurnContent(item, pagingToolCallIds(item));
}

/**
 * Project one item to the public shape.
 *
 * Paging-only turns return undefined; mixed turns keep their ordinary text and
 * tool work. Metadata is rebuilt after exclusions so a paging tool name never
 * survives in a search filter.
 */
export function recoveryHistoryItem(item: HistoryItem): RecoveryHistoryItem | undefined {
  if (item.kind === 'user') return item;

  const excludedIds = pagingToolCallIds(item);
  if (!hasRecoverableTurnContent(item, excludedIds)) return undefined;

  const content = item.assistantMessage.content.map((block) =>
    block.type === 'toolCall' && excludedIds.has(block.id) ? null : publicAssistantBlock(block));
  const toolResults = item.toolResults.filter((result) => !excludedIds.has(result.toolCallId));
  const metadata = excludedIds.size === 0
    ? item.metadata
    : metadataFor(
      content.filter((block): block is PublicAssistantBlock => block !== null),
      toolResults,
      item.interruptedByRestore === true,
    );

  return {
    ...item,
    assistantMessage: { content },
    toolResults,
    metadata,
  };
}
