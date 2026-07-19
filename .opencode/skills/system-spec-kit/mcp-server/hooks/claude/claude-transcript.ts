// ───────────────────────────────────────────────────────────────
// MODULE: Claude Transcript Parser
// ───────────────────────────────────────────────────────────────
// Parses Claude Code transcript JSONL files to extract token usage,
// model info, and conversation content.

import { closeSync, createReadStream, openSync, readSync, statSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { hookLog } from './shared.js';

/** Token usage from a single assistant message */
export interface MessageUsage {
  promptTokens: number;
  completionTokens: number;
  cacheCreationTokens: number;
  cacheReadTokens: number;
  totalTokens: number;
  model?: string;
}

/** Aggregated token usage for an entire transcript */
export interface TranscriptUsage {
  promptTokens: number;
  completionTokens: number;
  cacheCreationTokens: number;
  cacheReadTokens: number;
  totalTokens: number;
  messageCount: number;
  model: string | null;
}

/** Normalized assistant turn emitted from a Claude transcript replay. */
export interface TranscriptTurn {
  claudeSessionId: string | null;
  transcriptPath: string;
  lineNo: number;
  byteStart: number;
  byteEnd: number;
  role: string;
  model: string | null;
  promptTokens: number;
  completionTokens: number;
  cacheCreationTokens: number;
  cacheReadTokens: number;
  totalTokens: number;
}

/** Usage data from Claude API responses */
interface UsageData {
  input_tokens?: number;
  output_tokens?: number;
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
}

/** A message within the transcript */
interface TranscriptMessage {
  role?: string;
  usage?: UsageData;
  model?: string;
  content?: unknown;
}

/** Parsed transcript line */
interface TranscriptLine {
  sessionId?: string;
  type?: string;
  message?: TranscriptMessage;
  [key: string]: unknown;
}

function countLinesBeforeOffset(filePath: string, startOffset: number): number {
  if (startOffset <= 0) {
    return 0;
  }

  const chunkSize = 64 * 1024;
  const buffer = Buffer.alloc(chunkSize);
  let fd: number | null = null;
  let lineCount = 0;
  let bytesConsumed = 0;

  try {
    fd = openSync(filePath, 'r');
    while (bytesConsumed < startOffset) {
      const bytesToRead = Math.min(chunkSize, startOffset - bytesConsumed);
      const bytesRead = readSync(fd, buffer, 0, bytesToRead, bytesConsumed);
      if (bytesRead <= 0) {
        break;
      }

      for (let index = 0; index < bytesRead; index += 1) {
        if (buffer[index] === 0x0a) {
          lineCount += 1;
        }
      }

      bytesConsumed += bytesRead;
    }
  } finally {
    if (fd !== null) {
      closeSync(fd);
    }
  }

  return lineCount;
}

function toTranscriptTurn(
  parsed: TranscriptLine,
  filePath: string,
  lineNo: number,
  byteStart: number,
  byteEnd: number,
): TranscriptTurn | null {
  const msg: TranscriptMessage = parsed.message ?? {};
  const usage = msg.usage;
  if (!usage) {
    return null;
  }

  const promptTokens = usage.input_tokens ?? 0;
  const completionTokens = usage.output_tokens ?? 0;
  const cacheCreationTokens = usage.cache_creation_input_tokens ?? 0;
  const cacheReadTokens = usage.cache_read_input_tokens ?? 0;

  return {
    claudeSessionId: typeof parsed.sessionId === 'string' ? parsed.sessionId : null,
    transcriptPath: filePath,
    lineNo,
    byteStart,
    byteEnd,
    role: msg.role ?? 'assistant',
    model: msg.model ?? null,
    promptTokens,
    completionTokens,
    cacheCreationTokens,
    cacheReadTokens,
    totalTokens: promptTokens + completionTokens,
  };
}

/** Parse a transcript JSONL file and extract token usage.
 *  Supports incremental parsing via startOffset (byte offset). */
export async function parseTranscript(
  filePath: string,
  startOffset: number = 0,
): Promise<{ usage: TranscriptUsage; newOffset: number }> {
  const usage: TranscriptUsage = {
    promptTokens: 0,
    completionTokens: 0,
    cacheCreationTokens: 0,
    cacheReadTokens: 0,
    totalTokens: 0,
    messageCount: 0,
    model: null,
  };

  try {
    const { size: fileSize } = statSync(filePath);
    if (startOffset >= fileSize) {
      return { usage, newOffset: fileSize };
    }

    const stream = createReadStream(filePath, {
      encoding: 'utf-8',
      start: startOffset,
    });
    const lineReader = createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    for await (const line of lineReader) {
      if (!line.trim()) {
        continue;
      }

      try {
        const parsed = JSON.parse(line) as TranscriptLine;
        const msg: TranscriptMessage = parsed.message ?? {};

        if (msg.usage) {
          const u = msg.usage;
          const prompt = u.input_tokens ?? 0;
          const completion = u.output_tokens ?? 0;
          const cacheCreation = u.cache_creation_input_tokens ?? 0;
          const cacheRead = u.cache_read_input_tokens ?? 0;

          usage.promptTokens += prompt;
          usage.completionTokens += completion;
          usage.cacheCreationTokens += cacheCreation;
          usage.cacheReadTokens += cacheRead;
          usage.totalTokens += prompt + completion;
          usage.messageCount++;
        }

        if (msg.model && !usage.model) {
          usage.model = msg.model;
        }
      } catch {
        // Skip malformed JSON lines
      }
    }

    return { usage, newOffset: fileSize };
  } catch (err: unknown) {
    hookLog('warn', 'transcript', `Failed to parse transcript: ${err instanceof Error ? err.message : String(err)}`);
    return { usage, newOffset: startOffset };
  }
}

/** Parse a transcript JSONL file into deterministic assistant turns.
 *  Supports incremental replay via byte offset and emits byte ranges for idempotent keys. */
export async function parseTranscriptTurns(
  filePath: string,
  startOffset: number = 0,
): Promise<{ turns: TranscriptTurn[]; newOffset: number }> {
  const turns: TranscriptTurn[] = [];

  try {
    const { size: fileSize } = statSync(filePath);
    if (startOffset >= fileSize) {
      return { turns, newOffset: fileSize };
    }

    const stream = createReadStream(filePath, {
      encoding: 'utf-8',
      start: startOffset,
    });
    const lineReader = createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    let currentOffset = startOffset;
    let lineNo = countLinesBeforeOffset(filePath, startOffset);

    for await (const line of lineReader) {
      lineNo += 1;
      const byteLength = Buffer.byteLength(line + '\n', 'utf-8');
      const byteStart = currentOffset;
      const byteEnd = currentOffset + byteLength;
      currentOffset = byteEnd;

      if (!line.trim()) {
        continue;
      }

      try {
        const parsed = JSON.parse(line) as TranscriptLine;
        const turn = toTranscriptTurn(parsed, filePath, lineNo, byteStart, byteEnd);
        if (turn) {
          turns.push(turn);
        }
      } catch {
        // Skip malformed JSON lines
      }
    }

    return { turns, newOffset: fileSize };
  } catch (err: unknown) {
    hookLog('warn', 'transcript', `Failed to parse transcript turns: ${err instanceof Error ? err.message : String(err)}`);
    return { turns, newOffset: startOffset };
  }
}

/** An assistant turn's plain text plus the time it was emitted. */
export interface AssistantTextTurn {
  text: string;
  timestamp: number;
}

/**
 * Flatten a transcript message's `content` (string or Anthropic content-block
 * array) into plain text. Only text blocks contribute; tool_use/tool_result and
 * other block kinds are ignored because the true-citation signal is about what
 * the assistant WROTE, not what tools returned.
 */
function flattenAssistantContent(content: unknown): string {
  if (typeof content === 'string') {
    return content;
  }
  if (Array.isArray(content)) {
    const parts: string[] = [];
    for (const block of content) {
      if (typeof block === 'string') {
        parts.push(block);
        continue;
      }
      if (block && typeof block === 'object') {
        const candidate = block as { type?: unknown; text?: unknown };
        if (candidate.type === 'text' && typeof candidate.text === 'string') {
          parts.push(candidate.text);
        }
      }
    }
    return parts.join('\n');
  }
  return '';
}

/**
 * Resolve a per-turn timestamp from a transcript line. Real Claude transcripts
 * carry an ISO `timestamp` on each row; the fallback keeps mining usable on
 * minimal fixtures by treating ordering as monotonic when no timestamp exists.
 */
function resolveTurnTimestamp(parsed: TranscriptLine, fallback: number): number {
  const raw = parsed.timestamp;
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return raw;
  }
  if (typeof raw === 'string') {
    const ms = Date.parse(raw);
    if (!Number.isNaN(ms)) {
      return ms;
    }
  }
  return fallback;
}

/**
 * Extract assistant turns as plain text (with timestamps) from a transcript.
 *
 * Used by the true-citation emitter to discover which surfaced memory_ids the
 * assistant actually referenced after a search. Read-only and best-effort:
 * malformed lines are skipped and any I/O error yields an empty list rather
 * than throwing, so a session-stop hook is never broken by transcript mining.
 *
 * The synthetic-fallback timestamp advances by line index so that, on fixtures
 * with no per-row timestamp, later turns still sort after earlier ones — which
 * is what the post-search reference window relies on.
 */
export async function parseAssistantTextTurns(
  filePath: string,
): Promise<AssistantTextTurn[]> {
  const turns: AssistantTextTurn[] = [];

  try {
    const stream = createReadStream(filePath, { encoding: 'utf-8' });
    const lineReader = createInterface({ input: stream, crlfDelay: Infinity });

    let lineIndex = 0;
    for await (const line of lineReader) {
      lineIndex += 1;
      if (!line.trim()) {
        continue;
      }
      try {
        const parsed = JSON.parse(line) as TranscriptLine;
        const msg: TranscriptMessage = parsed.message ?? {};
        if ((msg.role ?? 'assistant') !== 'assistant') {
          continue;
        }
        const text = flattenAssistantContent(msg.content).trim();
        if (!text) {
          continue;
        }
        turns.push({ text, timestamp: resolveTurnTimestamp(parsed, lineIndex) });
      } catch {
        // Skip malformed JSON lines.
      }
    }

    return turns;
  } catch (err: unknown) {
    hookLog('warn', 'transcript', `Failed to parse assistant text turns: ${err instanceof Error ? err.message : String(err)}`);
    return turns;
  }
}

/** Estimate cost in USD based on model and token counts */
export function estimateCost(usage: TranscriptUsage): number {
  const model = (usage.model ?? '').toLowerCase();

  // Pricing per 1M tokens (approximate)
  let promptPricePerM: number;
  let completionPricePerM: number;

  if (model.includes('opus')) {
    promptPricePerM = 15;
    completionPricePerM = 75;
  } else if (model.includes('haiku')) {
    promptPricePerM = 0.25;
    completionPricePerM = 1.25;
  } else {
    // Default to Sonnet pricing
    promptPricePerM = 3;
    completionPricePerM = 15;
  }

  const promptCost = (usage.promptTokens / 1_000_000) * promptPricePerM;
  const completionCost = (usage.completionTokens / 1_000_000) * completionPricePerM;

  return Math.round((promptCost + completionCost) * 10000) / 10000;
}
