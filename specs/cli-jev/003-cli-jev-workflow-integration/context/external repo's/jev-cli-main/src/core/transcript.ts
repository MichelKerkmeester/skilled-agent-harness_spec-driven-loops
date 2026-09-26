// Transcript adapters: turn a Claude Code session log (.jsonl) or a plain
// Message[] JSON file into the compaction library's Message shape.

import type { Message, ToolResult, ToolUse } from "../vendor/compaction/types.js";

export type TranscriptFormat = "claude-code-jsonl" | "messages-json";

export interface ParsedTranscript {
  format: TranscriptFormat;
  messages: Message[];
  /** Entries skipped from a session log (sidechains, non-message records). */
  skipped: number;
}

interface Block {
  type?: string;
  text?: string;
  id?: string;
  name?: string;
  input?: unknown;
  tool_use_id?: string;
  content?: unknown;
  is_error?: boolean;
}

function blockText(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((b: Block) => (b && typeof b === "object" && typeof b.text === "string" ? b.text : ""))
      .filter(Boolean)
      .join("\n");
  }
  if (content === null || content === undefined) return "";
  try {
    return JSON.stringify(content);
  } catch {
    return String(content);
  }
}

/** Convert one Claude Code session record into a Message, or null if it is not a message. */
export function sessionRecordToMessage(record: unknown): Message | null {
  if (!record || typeof record !== "object") return null;
  const r = record as {
    type?: string;
    isSidechain?: boolean;
    message?: { role?: string; content?: unknown };
  };
  if ((r.type !== "user" && r.type !== "assistant") || r.isSidechain) return null;
  const content = r.message?.content;
  const role = r.type;
  const texts: string[] = [];
  const toolUses: ToolUse[] = [];
  const toolResults: ToolResult[] = [];
  if (typeof content === "string") texts.push(content);
  else if (Array.isArray(content)) {
    for (const raw of content as Block[]) {
      if (!raw || typeof raw !== "object") continue;
      if (raw.type === "text" && typeof raw.text === "string") texts.push(raw.text);
      else if (raw.type === "tool_use" && typeof raw.id === "string") {
        toolUses.push({
          tool_use_id: raw.id,
          tool: typeof raw.name === "string" ? raw.name : "tool",
          input: raw.input && typeof raw.input === "object" ? (raw.input as Record<string, unknown>) : {},
        });
      } else if (raw.type === "tool_result" && typeof raw.tool_use_id === "string") {
        toolResults.push({
          tool_use_id: raw.tool_use_id,
          text: blockText(raw.content),
          isError: Boolean(raw.is_error),
        });
      }
    }
  }
  const message: Message = { role, text: texts.join("\n"), toolUses };
  if (toolResults.length > 0) message.toolResults = toolResults;
  if (message.text.trim().length === 0 && toolUses.length === 0 && toolResults.length === 0) return null;
  return message;
}

function isMessageArray(v: unknown): v is Message[] {
  return (
    Array.isArray(v) &&
    v.every(
      (m) =>
        m &&
        typeof m === "object" &&
        ((m as Message).role === "user" || (m as Message).role === "assistant") &&
        ((m as Message).text === undefined || typeof (m as Message).text === "string") &&
        ((m as Message).toolUses === undefined || Array.isArray((m as Message).toolUses)),
    )
  );
}

/**
 * Parse a transcript. A JSON array of Message objects is used as is; anything
 * else is treated as JSONL, one Claude Code session record per line.
 */
export function parseTranscript(raw: string): ParsedTranscript {
  const trimmed = raw.trim();
  if (trimmed.length === 0) throw new Error("Transcript is empty.");
  if (trimmed.startsWith("[")) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch (err) {
      throw new Error(`Transcript is not valid JSON: ${(err as Error).message}`);
    }
    if (!isMessageArray(parsed)) {
      throw new Error(
        "A JSON transcript must be an array of {role, text?, toolUses?[], toolResults?[]} messages.",
      );
    }
    // `text` and `toolUses` may be omitted (a tool-result-only message has neither).
    const messages = parsed.map((m) => ({ ...m, text: m.text ?? "", toolUses: m.toolUses ?? [] }));
    return { format: "messages-json", messages, skipped: 0 };
  }
  const messages: Message[] = [];
  let skipped = 0;
  const lines = trimmed.split(/\r?\n/);
  lines.forEach((line, i) => {
    if (line.trim().length === 0) return;
    let record: unknown;
    try {
      record = JSON.parse(line);
    } catch (err) {
      throw new Error(`Transcript line ${i + 1} is not valid JSON: ${(err as Error).message}`);
    }
    const message = sessionRecordToMessage(record);
    if (message) messages.push(message);
    else skipped++;
  });
  if (messages.length === 0) throw new Error("Transcript contains no user or assistant messages.");
  return { format: "claude-code-jsonl", messages, skipped };
}
