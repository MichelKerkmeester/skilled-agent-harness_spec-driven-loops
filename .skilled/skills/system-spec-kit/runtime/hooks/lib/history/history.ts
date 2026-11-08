// ───────────────────────────────────────────────────────────────────
// MODULE: History Entry Contract
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

/** Message roles an adapter can project into the lookup core. */
export type HistoryEntryRole = 'user' | 'assistant' | 'toolResult';

/** Plain public text. */
export type HistoryTextBlock = {
  type: 'text';
  text: string;
};

/** Provider-private reasoning that the public projection must remove. */
export type HistoryThinkingBlock = {
  type: 'thinking';
  thinking: string;
  signature?: string;
  redacted?: string;
};

/** A tool invocation as the adapter read it. */
export type HistoryToolCallBlock = {
  type: 'toolCall';
  id: string;
  name: string;
  arguments: unknown;
  thoughtSignature?: string;
};

/** A native image attachment. Image bytes never become text. */
export type HistoryImageBlock = {
  type: 'image';
  data: string;
  mimeType: string;
};

export type HistoryContentBlock =
  | HistoryTextBlock
  | HistoryThinkingBlock
  | HistoryToolCallBlock
  | HistoryImageBlock;

/**
 * The single entry shape an adapter builds before calling the lookup core.
 *
 * It carries no transcript path, store handle, provider signature or session
 * identity. The matching `history-entry.schema.json` publishes the same shape
 * so a runtime reader can validate its own output first.
 */
export type HistoryEntry = {
  id: string;
  role: HistoryEntryRole;
  sequence: number;
  timestamp: string;
  content: HistoryContentBlock[];
  toolCallId?: string;
  isError?: boolean;
};

/**
 * Published field order for the entry contract. The compile-time guards below
 * fail the build when this list and `HistoryEntry` drift apart in either
 * direction, and the contract suite compares it with the JSON Schema.
 */
export const HISTORY_ENTRY_KEYS = [
  'id',
  'role',
  'sequence',
  'timestamp',
  'content',
  'toolCallId',
  'isError',
] as const satisfies readonly (keyof HistoryEntry)[];

/** Published required fields for the entry contract. */
export const HISTORY_ENTRY_REQUIRED_KEYS = [
  'id',
  'role',
  'sequence',
  'timestamp',
  'content',
] as const satisfies readonly RequiredHistoryEntryKey[];

type RequiredHistoryEntryKey = {
  [Key in keyof HistoryEntry]-?: undefined extends HistoryEntry[Key] ? never : Key;
}[keyof HistoryEntry];

type MissingHistoryEntryKey = Exclude<keyof HistoryEntry, (typeof HISTORY_ENTRY_KEYS)[number]>;
type MissingRequiredHistoryEntryKey = Exclude<RequiredHistoryEntryKey, (typeof HISTORY_ENTRY_REQUIRED_KEYS)[number]>;
type ExtraRequiredHistoryEntryKey = Exclude<(typeof HISTORY_ENTRY_REQUIRED_KEYS)[number], RequiredHistoryEntryKey>;

/** Compile-time proof that the published key list covers every entry field. */
export const HISTORY_ENTRY_KEYS_COMPLETE: MissingHistoryEntryKey extends never ? true : never = true;
/** Compile-time proof that the published required list equals the non-optional fields. */
export const HISTORY_ENTRY_REQUIRED_KEYS_COMPLETE:
  MissingRequiredHistoryEntryKey extends never
    ? ExtraRequiredHistoryEntryKey extends never
      ? true
      : never
    : never = true;

/** Tool names that belong to paging itself and never reach a caller. */
export const PAGING_TOOL_NAMES = [
  'search_history',
  'browse_history',
  'load_history',
  'read_context_output',
] as const;

export type PagingToolName = (typeof PAGING_TOOL_NAMES)[number];

/** Tool invocations collected from one assistant turn. */
export type HistoryMetadata = {
  tools: string[];
  files: string[];
  failed: boolean;
};

/** A paired tool result. */
export type HistoryToolResultMessage = {
  toolCallId: string;
  content: HistoryContentBlock[];
  isError?: boolean;
};

/** A public user turn. */
export type UserHistoryItem = {
  id: string;
  kind: 'user';
  sequence: number;
  timestamp: string;
  userMessage: {
    content: HistoryContentBlock[];
  };
};

/** A public model turn with its paired tool results. */
export type ModelTurnHistoryItem = {
  id: string;
  kind: 'modelTurn';
  sequence: number;
  timestamp: string;
  assistantMessage: {
    content: HistoryContentBlock[];
  };
  toolResults: HistoryToolResultMessage[];
  metadata: HistoryMetadata;
  interruptedByRestore?: true;
};

export type HistoryItem = UserHistoryItem | ModelTurnHistoryItem;

export type HistoryProjectionErrorCode =
  | 'DUPLICATE_TOOL_CALL'
  | 'ORPHAN_TOOL_RESULT'
  | 'DUPLICATE_TOOL_RESULT'
  | 'MISMATCHED_TOOL_RESULT'
  | 'INCOMPLETE_TOOL_RESULTS';

/** A pairing violation found while projecting an adapter entry list. */
export class HistoryProjectionError extends Error {
  readonly code: HistoryProjectionErrorCode;

  constructor(code: HistoryProjectionErrorCode, message: string = code) {
    super(message);
    this.code = code;
    this.name = 'HistoryProjectionError';
  }
}

export type HistoryProjectionOptions = {
  /** Restore paths may keep an exchange that a live refresh would reject. */
  recoverIncomplete?: boolean;
  /** Saved entry IDs already classified as interrupted during a restore. */
  interruptedEntryIds?: ReadonlySet<string>;
};

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const PAGING_TOOL_SET = new Set<string>(PAGING_TOOL_NAMES);
const FILE_ARGUMENT_KEYS = new Set(['path', 'file', 'files', 'filepath', 'file_path']);

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

/** Narrow a content block to a tool call. */
export function isToolCallBlock(block: HistoryContentBlock): block is HistoryToolCallBlock {
  return block.type === 'toolCall';
}

function collectFiles(value: unknown, files: string[], seen: Set<string>): void {
  if (Array.isArray(value)) {
    for (const item of value) collectFiles(item, files, seen);
    return;
  }
  if (typeof value !== 'object' || value === null) return;

  for (const [key, child] of Object.entries(value)) {
    if (FILE_ARGUMENT_KEYS.has(key.toLowerCase())) {
      const candidates = typeof child === 'string'
        ? [child]
        : Array.isArray(child)
          ? child.filter((item): item is string => typeof item === 'string')
          : [];
      for (const file of candidates) {
        if (!seen.has(file)) {
          seen.add(file);
          files.push(file);
        }
      }
    }
    collectFiles(child, files, seen);
  }
}

/** Collect the public search metadata for one assistant turn. */
export function metadataFor(
  content: readonly HistoryContentBlock[],
  results: readonly HistoryToolResultMessage[],
  interruptedByRestore = false,
): HistoryMetadata {
  const files: string[] = [];
  const seenFiles = new Set<string>();
  const calls = content.filter(isToolCallBlock);
  for (const call of calls) collectFiles(call.arguments, files, seenFiles);
  return {
    tools: calls.map((call) => call.name),
    files,
    failed: interruptedByRestore || results.some((result) => result.isError === true),
  };
}

// ───────────────────────────────────────────────────────────────────
// 4. PROJECTION
// ───────────────────────────────────────────────────────────────────

/**
 * Project a neutral entry list without mutation.
 *
 * Tool calls and results are validated as a pair before any item is emitted, so
 * a caller never receives a partially paired turn. A saved incomplete exchange
 * is kept only when a restore path explicitly asks for it.
 */
export function projectHistoryEntries(
  entries: readonly HistoryEntry[],
  options: HistoryProjectionOptions = {},
): HistoryItem[] {
  const items: HistoryItem[] = [];

  for (let index = 0; index < entries.length; index++) {
    const entry = entries[index];
    if (entry === undefined) continue;

    if (entry.role === 'user') {
      items.push({
        id: entry.id,
        kind: 'user',
        sequence: entry.sequence,
        timestamp: entry.timestamp,
        userMessage: { content: entry.content },
      });
      continue;
    }

    if (entry.role === 'toolResult') {
      throw new HistoryProjectionError('ORPHAN_TOOL_RESULT');
    }

    const calls = entry.content.filter(isToolCallBlock);
    const expectedIds = new Set(calls.map((call) => call.id));
    if (expectedIds.size !== calls.length) throw new HistoryProjectionError('DUPLICATE_TOOL_CALL');

    const seenIds = new Set<string>();
    const results: HistoryToolResultMessage[] = [];
    let resultIndex = index + 1;
    while (resultIndex < entries.length && entries[resultIndex]?.role === 'toolResult') {
      const resultEntry = entries[resultIndex];
      if (resultEntry === undefined) break;
      const toolCallId = resultEntry.toolCallId;
      if (toolCallId === undefined || !expectedIds.has(toolCallId)) {
        throw new HistoryProjectionError('MISMATCHED_TOOL_RESULT');
      }
      if (seenIds.has(toolCallId)) throw new HistoryProjectionError('DUPLICATE_TOOL_RESULT');
      seenIds.add(toolCallId);
      results.push({
        toolCallId,
        content: resultEntry.content,
        ...(resultEntry.isError === undefined ? {} : { isError: resultEntry.isError }),
      });
      resultIndex++;
    }

    const interruptedByRestore = seenIds.size !== expectedIds.size
      && (options.recoverIncomplete === true || options.interruptedEntryIds?.has(entry.id) === true);
    if (seenIds.size !== expectedIds.size && !interruptedByRestore) {
      // A branch can end mid-exchange; only an exchange followed by more
      // entries proves an incomplete live projection rather than a live tail.
      if (resultIndex === entries.length) break;
      throw new HistoryProjectionError('INCOMPLETE_TOOL_RESULTS');
    }

    items.push({
      id: entry.id,
      kind: 'modelTurn',
      sequence: entry.sequence,
      timestamp: entry.timestamp,
      assistantMessage: { content: entry.content },
      toolResults: results,
      metadata: metadataFor(entry.content, results, interruptedByRestore),
      ...(interruptedByRestore ? { interruptedByRestore: true as const } : {}),
    });
    index = resultIndex - 1;
  }

  return items;
}

// ───────────────────────────────────────────────────────────────────
// 5. PUBLIC PREDICATES
// ───────────────────────────────────────────────────────────────────

// The lookup CLI run by node, as every printed offer writes it. A shell call that
// runs it is the model paging its own history, the same as a dedicated pager
// tool. A call that only names the file, such as reading its source, is not.
const LOOKUP_CLI_RUN = /\bnode\b[^\n]*hooks\/lib\/history\/cli\.js/;

function invokesLookupCli(value: unknown, depth = 0): boolean {
  if (typeof value === 'string') return LOOKUP_CLI_RUN.test(value);
  // A runtime may pass the command as an argument vector instead of one string.
  if (Array.isArray(value) && value.every((part) => typeof part === 'string')) {
    return LOOKUP_CLI_RUN.test(value.join(' '));
  }
  if (depth > 3 || typeof value !== 'object' || value === null) return false;
  return Object.values(value).some((child) => invokesLookupCli(child, depth + 1));
}

/**
 * True when a tool call pages history: a dedicated pager tool, or a shell call
 * that runs the lookup CLI. Without the second case a model's own lookups
 * would come back in its next lookup, nesting earlier replies inside it.
 */
export function isPagingToolCall(block: HistoryToolCallBlock): boolean {
  return PAGING_TOOL_SET.has(block.name) || invokesLookupCli(block.arguments);
}

/** True when a model turn carries at least one paging tool call. */
export function hasPagingToolCall(item: HistoryItem): boolean {
  return item.kind === 'modelTurn'
    && item.assistantMessage.content.some((block) => isToolCallBlock(block) && isPagingToolCall(block));
}
