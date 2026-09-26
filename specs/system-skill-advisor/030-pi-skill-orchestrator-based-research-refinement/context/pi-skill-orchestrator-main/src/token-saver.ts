import { createHash } from "node:crypto";

export const TOKEN_RETRIEVE_TOOL = "token_retrieve";
export const TOKEN_TOOL_SEARCH_TOOL = "token_tool_search";
export const TOKEN_SAVER_MIN_CHARS = 800;
export const TOKEN_SAVER_GUIDANCE = [
  "Token Saver is enabled.",
  "Keep responses concise and do not restate tool output or earlier context unless the user asks.",
  `Some large tool results may be compacted. If required detail is missing, call \`${TOKEN_RETRIEVE_TOOL}\` with the recovery id shown in the compacted result. Recovery ids work only while that exact original remains in the current in-memory Token Saver cache.`,
  `Some non-core tool schemas may be deferred. If the active tools cannot perform the task, call \`${TOKEN_TOOL_SEARCH_TOOL}\` with the capability you need.`,
].join(" ");

const MAX_STORE_ENTRIES = 128;
const MAX_STORE_CHARS = 16 * 1024 * 1024;
const MAX_TRANSFORM_CACHE_ENTRIES = 256;
const MAX_SEEN_OUTPUTS = 512;
const CACHE_TTL_MS = 30 * 60 * 1000;
const ERROR_RE = /\b(?:error|fatal|fail(?:ed|ure)?|exception|traceback|panic|assert(?:ion)?|segfault|denied|invalid|critical)\b/i;
const WARNING_RE = /\b(?:warn(?:ing)?|deprecated|retry|timeout|timed out)\b/i;
const PASS_RE = /\b(?:pass(?:ed)?|ok|success(?:ful)?|✓)\b/i;
const CONTROL_RE = /\x1B(?:[@-_][0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1B\\))/g;
const PROGRESS_RE = /(?:^|\s)(?:\d{1,3}%|\[[=#> .-]{8,}\]|[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏])(?:\s|$)/;
const CODE_EXT_RE = /\.(?:c|cc|cpp|cxx|h|hh|hpp|cs|go|java|js|jsx|mjs|cjs|kt|kts|php|py|rb|rs|swift|ts|tsx|vue|svelte|sh|bash|zsh)$/i;
const CONFIG_EXT_RE = /\.(?:ya?ml|toml|ini|cfg|conf|properties)$/i;
const TABLE_BORDER_RE = /^\s*\|?.*\|.*\|\s*$/;

export type TokenSaverStrategy =
  | "json"
  | "search"
  | "test"
  | "log"
  | "diff"
  | "code"
  | "table"
  | "config"
  | "tree"
  | "text"
  | "error"
  | "dedupe";

export interface TokenSaverCompression {
  changed: boolean;
  text: string;
  id?: string;
  strategy?: TokenSaverStrategy;
  originalChars: number;
  compressedChars: number;
  savedChars: number;
  cacheHit?: boolean;
}

export interface TokenSaverStats {
  compressions: number;
  cacheHits: number;
  retrievals: number;
  originalChars: number;
  compressedChars: number;
  savedChars: number;
  estimatedTokensSaved: number;
  storedEntries: number;
  storedChars: number;
  byStrategy: Record<string, { count: number; savedChars: number }>;
  prefixObservations: number;
  prefixChanges: number;
  lastPrefixHash?: string;
  toolSearches: number;
  toolsActivated: number;
  toolDescriptionCharsSaved: number;
}


export interface TokenSaverToolMetadata {
  name: string;
  description?: string;
}

export function sanitizeToolMetadataText(value: unknown, maxChars = 180): string {
  if (typeof value !== "string") return "";
  const clean = value
    .replace(CONTROL_RE, "")
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const limit = Math.max(1, Math.trunc(maxChars || 1));
  if (clean.length <= limit) return clean;
  if (limit === 1) return "…";
  return `${clean.slice(0, limit - 1).trimEnd()}…`;
}

export function rankDeferredTools<T extends TokenSaverToolMetadata>(tools: T[], query: string, limit = 5): T[] {
  const terms = textTerms(query);
  return tools
    .map((tool) => {
      const name = tool.name.toLowerCase();
      const description = (tool.description ?? "").toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (name === term) score += 20;
        else if (name.includes(term)) score += 8;
        if (description.includes(term)) score += term.length >= 8 ? 4 : 2;
      }
      if (!terms.length && query.trim() && `${name} ${description}`.includes(query.trim().toLowerCase())) score += 5;
      return { tool, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name))
    .slice(0, Math.max(1, Math.min(8, Math.trunc(limit || 5))))
    .map((entry) => entry.tool);
}

function compactDescription(description: unknown, maxChars: number): { value: unknown; saved: number } {
  if (typeof description !== "string") return { value: description, saved: 0 };
  const limit = Math.max(1, Math.trunc(maxChars || 1));
  if (description.length <= limit) return { value: description, saved: 0 };
  const value = limit === 1 ? "…" : `${description.slice(0, limit - 1).trimEnd()}…`;
  return { value, saved: Math.max(0, description.length - value.length) };
}

/**
 * Headroom-style tool-description compaction at the provider payload boundary.
 * Only the top-level human description is shortened. Parameter descriptions
 * and schemas stay byte-for-byte unchanged because they define call semantics.
 */
export function compactProviderToolDescriptions(payload: unknown, maxChars = 420): { payload: unknown; changed: boolean; savedChars: number } {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return { payload, changed: false, savedChars: 0 };
  const root = payload as Record<string, unknown>;
  if (!Array.isArray(root.tools) || root.tools.length === 0) return { payload, changed: false, savedChars: 0 };

  let changed = false;
  let savedChars = 0;
  const tools = root.tools.map((raw) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return raw;
    const tool = raw as Record<string, unknown>;
    let next: Record<string, unknown> | undefined;

    if ("description" in tool) {
      const compacted = compactDescription(tool.description, maxChars);
      if (compacted.saved > 0) {
        next = { ...tool, description: compacted.value };
        savedChars += compacted.saved;
        changed = true;
      }
    }

    // OpenAI chat-completions tool shape: {type:"function", function:{...}}.
    if (tool.function && typeof tool.function === "object" && !Array.isArray(tool.function)) {
      const fn = tool.function as Record<string, unknown>;
      const compacted = compactDescription(fn.description, maxChars);
      if (compacted.saved > 0) {
        next = { ...(next ?? tool), function: { ...fn, description: compacted.value } };
        savedChars += compacted.saved;
        changed = true;
      }
    }
    return next ?? raw;
  });

  return changed ? { payload: { ...root, tools }, changed: true, savedChars } : { payload, changed: false, savedChars: 0 };
}

function requestsExactStructuredOutput(input: Record<string, unknown>): boolean {
  const format = typeof input.format === "string" ? input.format.toLowerCase() : "";
  if (["json", "jsonl", "ndjson", "xml", "yaml", "yml"].includes(format)) return true;
  const command = typeof input.command === "string" ? input.command.toLowerCase() : "";
  return /(?:^|\s)(?:--json(?:\s|$|=)|--format(?:=|\s+)json(?:\s|$)|--output(?:=|\s+)json(?:\s|$)|-o\s+json(?:\s|$))/.test(command);
}

function shouldProtectExactRead(toolName: string, input: Record<string, unknown>, query: string): boolean {
  const editIntent = /\b(?:edit|modify|change|fix|patch|implement|refactor|rewrite|replace|update|repair)\b/i.test(query);
  if (!editIntent) return false;
  const tool = toolName.toLowerCase();
  const path = typeof input.path === "string" ? input.path : typeof input.file_path === "string" ? input.file_path : "";
  if (tool === "read" && CODE_EXT_RE.test(path)) return true;
  if (tool !== "bash") return false;
  const command = typeof input.command === "string" ? input.command : "";
  if (!/^\s*(?:cat|head|tail|sed|nl|bat)\b/i.test(command)) return false;
  // Preserve quoted source paths too. A shell read such as `cat "src/my file.ts"`
  // is still an exact source read during an edit-oriented task.
  const tokens: string[] = command.match(/"[^"\r\n]+"|'[^'\r\n]+'|[^\s]+/g) ?? [];
  return tokens.some((token) => {
    const unquoted = token.length >= 2 && ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'")))
      ? token.slice(1, -1)
      : token;
    return CODE_EXT_RE.test(unquoted);
  });
}

interface StoredOriginal {
  id: string;
  text: string;
  toolName: string;
  createdAt: number;
  lastAccess: number;
  lines: number;
}

interface CachedCompression {
  expiresAt: number;
  compression: Omit<TokenSaverCompression, "cacheHit">;
}

export interface RetrievalResult {
  id: string;
  text: string;
  startLine: number;
  endLine: number;
  totalLines: number;
  hasMore: boolean;
  nextStartLine?: number;
}

function flatString(value: unknown): string {
  if (typeof value === "string") return value;
  if (value === undefined) return "";
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function stripAnsi(text: string): string {
  return text.replace(CONTROL_RE, "");
}

function normalizeNewlines(text: string): string {
  return text.replace(/\r\n?/g, "\n");
}

function splitLinesPreserveEndings(text: string): Array<{ content: string; separator: string }> {
  const lines: Array<{ content: string; separator: string }> = [];
  const newline = /\r\n|\r|\n/g;
  let start = 0;
  for (const match of text.matchAll(newline)) {
    const index = match.index ?? start;
    lines.push({ content: text.slice(start, index), separator: match[0] });
    start = index + match[0].length;
  }
  lines.push({ content: text.slice(start), separator: "" });
  return lines;
}

function textTerms(text: string): string[] {
  const stop = new Set([
    "about", "after", "again", "also", "and", "are", "but", "can", "could", "does", "for", "from", "have",
    "how", "into", "its", "just", "more", "not", "only", "our", "that", "the", "their", "this", "use", "using",
    "was", "what", "when", "where", "which", "will", "with", "would", "you", "your",
  ]);
  return [...new Set((text.toLowerCase().match(/[a-z0-9_.:/-]{3,}/g) ?? []).filter((term) => !stop.has(term)))].slice(0, 48);
}

function relevanceScore(text: string, terms: string[]): number {
  if (!terms.length) return 0;
  const hay = text.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (!hay.includes(term)) continue;
    score += term.length >= 8 ? 3 : 1;
  }
  return score;
}

function isPrimitive(value: unknown): boolean {
  return value === null || ["string", "number", "boolean"].includes(typeof value);
}

function compactPrimitive(value: unknown, max = 320): unknown {
  if (typeof value !== "string" || value.length <= max) return value;
  const head = Math.max(80, Math.floor(max * 0.65));
  const tail = Math.max(40, max - head - 20);
  return `${value.slice(0, head)}…[${value.length - head - tail} chars omitted]…${value.slice(-tail)}`;
}

function errorish(value: unknown): boolean {
  return ERROR_RE.test(flatString(value));
}

function stddev(values: number[]): { mean: number; std: number } {
  if (!values.length) return { mean: 0, std: 0 };
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return { mean, std: Math.sqrt(variance) };
}

function smartArray(items: unknown[], query: string, cap: number): { items: unknown[]; constants: Record<string, unknown>; selected: number[] } {
  if (items.length <= cap) {
    return { items: items.map((value) => compactObjectStrings(value)), constants: {}, selected: items.map((_, index) => index) };
  }

  const selected = new Set<number>();
  const essential = new Set<number>();
  const add = (index: number) => {
    if (index >= 0 && index < items.length) selected.add(index);
  };
  const addEssential = (index: number) => {
    if (index >= 0 && index < items.length) { selected.add(index); essential.add(index); }
  };
  for (let index = 0; index < Math.min(3, items.length); index += 1) addEssential(index);
  for (let index = Math.max(0, items.length - 2); index < items.length; index += 1) addEssential(index);
  items.forEach((item, index) => { if (errorish(item)) addEssential(index); });

  const terms = textTerms(query);
  const relevant = items
    .map((item, index) => ({ index, score: relevanceScore(flatString(item), terms) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, Math.max(4, Math.floor(cap / 3)));
  relevant.forEach((entry) => add(entry.index));

  const objectItems = items.filter((item): item is Record<string, unknown> => !!item && typeof item === "object" && !Array.isArray(item));
  const allObjects = objectItems.length === items.length;
  const constants: Record<string, unknown> = {};

  if (allObjects && objectItems.length > 2) {
    const commonKeys = Object.keys(objectItems[0] ?? {}).filter((key) => objectItems.every((item) => key in item));
    for (const key of commonKeys) {
      const values = objectItems.map((item) => item[key]);
      if (values.every(isPrimitive) && values.every((value) => flatString(value) === flatString(values[0]))) {
        constants[key] = compactPrimitive(values[0]);
      }
      if (values.every((value) => typeof value === "number" && Number.isFinite(value))) {
        const nums = values as number[];
        const { mean, std } = stddev(nums);
        if (std > 0) {
          nums.forEach((value, index) => {
            if (Math.abs(value - mean) / std >= 2) addEssential(index);
          });
          const deltas = nums.slice(1).map((value, index) => Math.abs(value - nums[index]));
          const deltaStats = stddev(deltas);
          if (deltaStats.std > 0) {
            deltas.forEach((delta, index) => {
              if (delta >= deltaStats.mean + 2 * deltaStats.std) {
                addEssential(index);
                addEssential(index + 1);
              }
            });
          }
        }
      }
    }

    // Low-cardinality categorical changes often mark real state transitions.
    // Unique IDs, timestamps, and counters change every row and are not useful
    // categorical change points.
    for (const key of commonKeys) {
      const values = objectItems.map((item) => item[key]);
      if (!values.every((value) => typeof value === "string" || typeof value === "boolean" || value === null)) continue;
      const unique = new Set(values.map(flatString));
      if (unique.size > Math.max(8, Math.floor(values.length * 0.1))) continue;
      for (let index = 1; index < values.length; index += 1) {
        if (flatString(values[index]) !== flatString(values[index - 1])) {
          addEssential(index - 1);
          addEssential(index);
        }
      }
    }
  }

  // Spread-sample the remaining data so the compressed result is still representative.
  const target = Math.max(8, cap);
  if (selected.size < target) {
    const slots = target - selected.size;
    for (let step = 1; step <= slots; step += 1) {
      add(Math.round((step * (items.length - 1)) / (slots + 1)));
    }
  }

  let indexes = [...selected].sort((a, b) => a - b);
  if (indexes.length > target) {
    const ranked = indexes
      .filter((index) => !essential.has(index))
      .map((index) => ({ index, score: relevanceScore(flatString(items[index]), terms) }))
      .sort((a, b) => b.score - a.score || a.index - b.index);
    indexes = [...essential, ...ranked.slice(0, Math.max(0, target - essential.size)).map((entry) => entry.index)]
      .filter((index) => index >= 0 && index < items.length)
      .sort((a, b) => a - b);
  }

  const removeConstants = Object.keys(constants).length > 0;
  const compacted = indexes.map((index) => {
    const value = compactObjectStrings(items[index]);
    if (!removeConstants || !value || typeof value !== "object" || Array.isArray(value)) return value;
    const clone = { ...(value as Record<string, unknown>) };
    for (const key of Object.keys(constants)) delete clone[key];
    return clone;
  });

  return { items: compacted, constants, selected: indexes };
}

function compactObjectStrings(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => compactObjectStrings(item));
  if (!value || typeof value !== "object") return compactPrimitive(value);
  const out: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    out[key] = compactObjectStrings(item);
  }
  return out;
}

function compressJson(text: string, query: string, pressure: number): string | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }
  const cap = Math.min(80, Math.round(32 * (1 + pressure * 0.25)));
  let changed = false;
  const summaries: string[] = [];

  const visit = (value: unknown, path: string): unknown => {
    if (Array.isArray(value)) {
      if (value.length > cap) {
        const result = smartArray(value, query, cap);
        changed ||= result.selected.length < value.length || Object.keys(result.constants).length > 0;
        summaries.push(`${path || "$"}: ${value.length}→${result.selected.length} items${Object.keys(result.constants).length ? `; ${Object.keys(result.constants).length} constant fields factored out` : ""}`);
        return {
          __token_saver_array__: {
            original_items: value.length,
            shown_items: result.selected.length,
            original_indexes: result.selected,
            ...(Object.keys(result.constants).length ? { constants: result.constants } : {}),
          },
          items: result.items,
        };
      }
      return value.map((item, index) => visit(item, `${path}[${index}]`));
    }
    if (!value || typeof value !== "object") return compactPrimitive(value);
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      out[key] = visit(item, path ? `${path}.${key}` : key);
    }
    return out;
  };

  const compacted = visit(parsed, "");
  const rendered = JSON.stringify(compacted, null, 2);
  if (!changed && rendered.length >= text.length * 0.9) return null;
  const prefix = summaries.length ? `[JSON compacted: ${summaries.slice(0, 4).join(" | ")} ]\n` : "";
  return prefix + rendered;
}

function tryNdjson(text: string, query: string, pressure: number): string | null {
  const lines = text.split("\n").filter((line) => line.trim());
  if (lines.length < 8) return null;
  const parsed: unknown[] = [];
  for (const line of lines) {
    try { parsed.push(JSON.parse(line)); } catch { return null; }
  }
  const cap = Math.min(80, Math.round(32 * (1 + pressure * 0.25)));
  if (parsed.length <= cap) return null;
  const result = smartArray(parsed, query, cap);
  return [
    `[NDJSON compacted: ${parsed.length}→${result.items.length} events]`,
    ...result.items.map((item) => JSON.stringify(item)),
  ].join("\n");
}

function dedupeLines(lines: string[]): string[] {
  const out: string[] = [];
  let previous = "";
  let count = 0;
  const flush = () => {
    if (!previous) return;
    out.push(count > 1 ? `${previous}  ×${count}` : previous);
  };
  for (const line of lines) {
    const normalized = line.trimEnd();
    if (normalized === previous) {
      count += 1;
      continue;
    }
    flush();
    previous = normalized;
    count = 1;
  }
  flush();
  return out;
}

function normalizeLogPattern(line: string): string {
  return line
    .replace(/^\s*\d{4}-\d{2}-\d{2}[T ][0-9:.+-Z]+\s*/i, "")
    .replace(/\b0x[0-9a-f]+\b/gi, "<hex>")
    .replace(/\b[0-9a-f]{8,}\b/gi, "<id>")
    .replace(/\b\d{4,}\b/g, "<n>")
    .trim();
}

function compressLog(text: string, query: string, pressure: number, forceErrorMode = false): string | null {
  const clean = stripAnsi(normalizeNewlines(text));
  const raw = clean.split("\n");
  if (raw.length < 12 && clean.length < TOKEN_SAVER_MIN_CHARS) return null;
  const terms = textTerms(query);
  const cap = Math.min(240, Math.round((forceErrorMode ? 180 : 100) * (1 + pressure * 0.25)));
  const patternMap = new Map<string, { line: string; count: number; first: number; error: boolean; score: number }>();
  let progressDropped = 0;

  raw.forEach((line, index) => {
    if (!line.trim()) return;
    if (PROGRESS_RE.test(line) && !ERROR_RE.test(line)) {
      progressDropped += 1;
      return;
    }
    const pattern = normalizeLogPattern(line);
    const existing = patternMap.get(pattern);
    if (existing) existing.count += 1;
    else patternMap.set(pattern, { line: line.trimEnd(), count: 1, first: index, error: ERROR_RE.test(line), score: relevanceScore(line, terms) });
  });

  const entries = [...patternMap.values()];
  if (forceErrorMode) {
    const errorIndexes = new Set<number>();
    raw.forEach((line, index) => {
      if (!ERROR_RE.test(line)) return;
      for (let at = Math.max(0, index - 3); at <= Math.min(raw.length - 1, index + 6); at += 1) errorIndexes.add(at);
    });
    for (let index = 0; index < Math.min(8, raw.length); index += 1) errorIndexes.add(index);
    for (let index = Math.max(0, raw.length - 16); index < raw.length; index += 1) errorIndexes.add(index);
    const focused = [...errorIndexes].sort((a, b) => a - b).map((index) => raw[index]).filter(Boolean);
    if (focused.length && focused.length < raw.filter(Boolean).length * 0.85) {
      return [`[error output focused: ${raw.length}→${focused.length} lines; error context and tail preserved]`, ...dedupeLines(focused)].join("\n");
    }
  }
  if (entries.length >= raw.filter(Boolean).length * 0.92 && progressDropped === 0) {
    return compressGeneric(clean, query, pressure, cap);
  }
  const errors = entries.filter((entry) => entry.error);
  const relevant = entries.filter((entry) => !entry.error && entry.score > 0).sort((a, b) => b.score - a.score || a.first - b.first);
  const ordinary = entries.filter((entry) => !entry.error && entry.score === 0).sort((a, b) => a.first - b.first);
  const chosen = [...errors];
  for (const entry of relevant) if (chosen.length < cap) chosen.push(entry);
  if (chosen.length < cap) {
    const remaining = cap - chosen.length;
    if (ordinary.length <= remaining) chosen.push(...ordinary);
    else {
      for (let step = 0; step < remaining; step += 1) {
        chosen.push(ordinary[Math.floor((step * ordinary.length) / remaining)]);
      }
    }
  }
  const uniqueChosen = [...new Map(chosen.map((entry) => [entry.first, entry])).values()].sort((a, b) => a.first - b.first);
  const rendered = uniqueChosen.map((entry) => entry.count > 1 ? `${entry.line}  ×${entry.count}` : entry.line);
  if (progressDropped) rendered.push(`[${progressDropped} progress/update lines removed]`);
  if (rendered.length < entries.length) rendered.push(`[${entries.length - rendered.length} additional patterns omitted]`);
  return rendered.join("\n");
}

function compressTest(text: string, query: string, pressure: number): string | null {
  const clean = stripAnsi(normalizeNewlines(text));
  const lines = clean.split("\n");
  if (lines.length < 16) return null;
  const keep = new Set<number>();
  let passing = 0;
  let progress = 0;
  const terms = textTerms(query);

  lines.forEach((line, index) => {
    if (ERROR_RE.test(line)) {
      for (let at = Math.max(0, index - 3); at <= Math.min(lines.length - 1, index + 8); at += 1) keep.add(at);
      return;
    }
    if (/^(?:Test Suites?:|Tests?:|Ran\s+\d+|=+.*(?:passed|failed|error)|\s*\d+\s+(?:passed|failed|skipped)\b)|\b(?:total|duration|collected|summary)\b/i.test(line)) {
      keep.add(index);
      return;
    }
    if (PASS_RE.test(line)) passing += 1;
    if (PROGRESS_RE.test(line)) progress += 1;
    if (relevanceScore(line, terms) > 0) keep.add(index);
  });
  for (let index = Math.max(0, lines.length - 12); index < lines.length; index += 1) keep.add(index);
  const cap = Math.min(220, Math.round(140 * (1 + pressure * 0.25)));
  let indexes = [...keep].sort((a, b) => a - b);
  if (indexes.length > cap) indexes = indexes.slice(0, cap - 20).concat(indexes.slice(-20));
  const out = indexes.map((index) => lines[index]).filter((line) => line !== undefined);
  if (passing) out.unshift(`[passing/result lines collapsed: ~${passing}; failure detail prioritized]`);
  if (progress) out.push(`[${progress} progress lines omitted]`);
  return dedupeLines(out).join("\n");
}

function compressSearch(text: string, query: string, pressure: number): string | null {
  const clean = stripAnsi(normalizeNewlines(text));
  const lines = clean.split("\n").filter((line) => line.trim());
  if (lines.length < 20) return null;
  const terms = textTerms(query);
  const groups = new Map<string, { line: string; index: number; score: number; error: boolean }[]>();
  const other: { line: string; index: number; score: number; error: boolean }[] = [];
  const matchRe = /^(.*?)(?::|\()([0-9]+)(?::[0-9]+|\))?[:\s-](.*)$/;
  lines.forEach((line, index) => {
    const match = line.match(matchRe);
    const entry = { line: line.length > 420 ? `${line.slice(0, 360)}…${line.slice(-40)}` : line, index, score: relevanceScore(line, terms), error: ERROR_RE.test(line) };
    if (!match || !match[1]) {
      other.push(entry);
      return;
    }
    const file = match[1].trim();
    const list = groups.get(file) ?? [];
    list.push(entry);
    groups.set(file, list);
  });
  if (groups.size < 2) return compressGeneric(clean, query, pressure, Math.round(110 * (1 + pressure * 0.25)));

  const perFile = Math.min(40, Math.round(16 * (1 + pressure * 0.25)));
  const out: string[] = [];
  for (const [file, entries] of groups) {
    const essentials = entries.filter((entry) => entry.error || entry.score > 0);
    const selected = new Map<number, typeof entries[number]>();
    entries.slice(0, 2).forEach((entry) => selected.set(entry.index, entry));
    entries.slice(-1).forEach((entry) => selected.set(entry.index, entry));
    essentials.sort((a, b) => Number(b.error) - Number(a.error) || b.score - a.score).slice(0, perFile).forEach((entry) => selected.set(entry.index, entry));
    if (selected.size < perFile) {
      const candidates = entries.filter((entry) => !selected.has(entry.index));
      const count = Math.min(perFile - selected.size, candidates.length);
      for (let step = 0; step < count; step += 1) selected.set(candidates[Math.floor((step * candidates.length) / Math.max(1, count))].index, candidates[Math.floor((step * candidates.length) / Math.max(1, count))]);
    }
    const picked = [...selected.values()].sort((a, b) => a.index - b.index);
    out.push(`${file} (${entries.length} matches; showing ${picked.length})`);
    out.push(...picked.map((entry) => `  ${entry.line}`));
  }
  const errorOther = other.filter((entry) => entry.error || entry.score > 0).slice(0, 20);
  if (errorOther.length) out.push("Other:", ...errorOther.map((entry) => `  ${entry.line}`));
  return out.join("\n");
}

function compressDiff(text: string, query: string, pressure: number): string | null {
  const clean = stripAnsi(normalizeNewlines(text));
  const lines = clean.split("\n");
  if (lines.length < 30) return null;
  const terms = textTerms(query);
  const keep = new Set<number>();
  const required = new Set<number>();
  const metadataRe = /^(?:diff --git|index |--- |\+\+\+ |@@|rename |similarity |Binary files|new file mode|deleted file mode)/;
  lines.forEach((line, index) => {
    if (metadataRe.test(line)) {
      keep.add(index);
      required.add(index);
    }
    if ((line.startsWith("+") && !line.startsWith("+++")) || (line.startsWith("-") && !line.startsWith("---"))) {
      keep.add(index);
      required.add(index);
      if (index > 0) keep.add(index - 1);
      if (index + 1 < lines.length) keep.add(index + 1);
    }
    if (ERROR_RE.test(line) || relevanceScore(line, terms) > 0) {
      keep.add(index);
      required.add(index);
    }
  });
  let indexes = [...keep].sort((a, b) => a - b);
  const cap = Math.min(360, Math.round(220 * (1 + pressure * 0.25)));
  if (indexes.length > cap) {
    const optional = indexes.filter((index) => !required.has(index));
    const room = Math.max(0, cap - required.size);
    indexes = [...new Set([...required, ...optional.slice(0, room)])].sort((a, b) => a - b);
  }
  if (indexes.length >= lines.length * 0.9) return null;
  return [`[diff compacted: ${lines.length}→${indexes.length} lines; changed lines and diff metadata preserved]`, ...indexes.map((index) => lines[index])].join("\n");
}

function codeSignature(line: string): boolean {
  return /^\s*(?:[#@][A-Za-z_]|(?:export\s+)?(?:async\s+)?(?:function|class|interface|type|enum|struct|trait|impl|fn|def|module|namespace)\b|(?:public|private|protected|static|final|abstract|override|virtual|async|export|const|let|var|func)\b.*(?:\(|=)|(?:import|from|require|use|using|include|package)\b|(?:try|catch|except|finally)\b)/.test(line);
}

function compressCode(text: string, query: string, pressure: number): string | null {
  const clean = stripAnsi(normalizeNewlines(text));
  const lines = clean.split("\n");
  if (lines.length < 45) return null;
  const terms = textTerms(query);
  const keep = new Set<number>();
  lines.forEach((line, index) => {
    if (index < 10 || index >= lines.length - 5 || codeSignature(line) || /\b(?:TODO|FIXME|HACK|XXX)\b/.test(line) || ERROR_RE.test(line) || relevanceScore(line, terms) > 0) {
      keep.add(index);
      if (codeSignature(line) && index + 1 < lines.length && /^\s*(?:\/\/|#|\/\*|\*|"""|''')/.test(lines[index + 1])) keep.add(index + 1);
    }
  });
  const cap = Math.min(300, Math.round(180 * (1 + pressure * 0.25)));
  let indexes = [...keep].sort((a, b) => a - b);
  if (indexes.length > cap) indexes = indexes.slice(0, cap - 20).concat(indexes.slice(-20));
  if (indexes.length >= lines.length * 0.86) return null;

  const out = ["[source outline; imports/signatures/error handlers/query-relevant lines prioritized; omitted bodies available through token_retrieve]"];
  let previous = -2;
  for (const index of indexes) {
    if (index > previous + 1) out.push(`… ${index - previous - 1} lines omitted …`);
    out.push(`${String(index + 1).padStart(5, " ")} | ${lines[index]}`);
    previous = index;
  }
  return out.join("\n");
}

function compressTree(text: string, query: string, pressure: number): string | null {
  const clean = stripAnsi(normalizeNewlines(text));
  const lines = clean.split("\n").filter((line) => line.trim());
  if (lines.length < 40) return null;
  const terms = textTerms(query);
  const cap = Math.min(180, Math.round(100 * (1 + pressure * 0.25)));
  const keep = new Set<number>();
  lines.forEach((line, index) => {
    if (index < 12 || index >= lines.length - 5 || ERROR_RE.test(line) || relevanceScore(line, terms) > 0 || /(?:package\.json|README|src\/|tests?\/|\.gitignore)/i.test(line)) keep.add(index);
  });
  if (keep.size < cap) {
    const remaining = lines.map((_, index) => index).filter((index) => !keep.has(index));
    const count = Math.min(cap - keep.size, remaining.length);
    for (let step = 0; step < count; step += 1) keep.add(remaining[Math.floor((step * remaining.length) / Math.max(1, count))]);
  }
  const indexes = [...keep].sort((a, b) => a - b).slice(0, cap);
  return [`[directory/list compacted: ${lines.length}→${indexes.length} lines]`, ...indexes.map((index) => lines[index])].join("\n");
}

function compressTable(text: string, query: string, pressure: number): string | null {
  const clean = normalizeNewlines(text);
  const lines = clean.split("\n").filter((line) => line.trim());
  if (lines.length < 18) return null;
  const terms = textTerms(query);
  const cap = Math.min(120, Math.round(50 * (1 + pressure * 0.25)));
  const keep = new Set<number>([0, 1, 2]);
  for (let index = Math.max(0, lines.length - 2); index < lines.length; index += 1) keep.add(index);
  lines.forEach((line, index) => {
    if (ERROR_RE.test(line) || relevanceScore(line, terms) > 0) keep.add(index);
  });
  if (keep.size < cap) {
    const candidates = lines.map((_, index) => index).filter((index) => !keep.has(index));
    const count = Math.min(cap - keep.size, candidates.length);
    for (let step = 0; step < count; step += 1) keep.add(candidates[Math.floor((step * candidates.length) / Math.max(1, count))]);
  }
  const indexes = [...keep].sort((a, b) => a - b).slice(0, cap);
  if (indexes.length >= lines.length * 0.9) return null;
  return [`[table compacted: ${lines.length}→${indexes.length} rows; header/error/relevant rows prioritized]`, ...indexes.map((index) => lines[index])].join("\n");
}

function compressConfig(text: string, query: string, pressure: number): string | null {
  const clean = normalizeNewlines(text);
  const lines = clean.split("\n");
  if (lines.length < 30) return null;
  const terms = textTerms(query);
  const cap = Math.min(180, Math.round(110 * (1 + pressure * 0.25)));
  const selected: string[] = [];
  let omitted = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    const structural = /^(?:\[.+\]|[-A-Za-z0-9_.]+\s*[:=]|-\s+[A-Za-z0-9_.-]+\s*:)/.test(trimmed);
    const important = ERROR_RE.test(line) || relevanceScore(line, terms) > 0;
    if ((structural || important) && selected.length < cap) {
      selected.push(line.length > 420 ? `${line.slice(0, 380)}…` : line);
    } else if (trimmed) omitted += 1;
  }
  if (!omitted || selected.join("\n").length >= text.length * 0.9) return null;
  return [`[config structure compacted; ${omitted} non-structural/value lines omitted]`, ...selected].join("\n");
}

function compressGeneric(text: string, query: string, pressure: number, capOverride?: number): string | null {
  const clean = stripAnsi(normalizeNewlines(text));
  const lines = clean.split("\n");
  if (lines.length < 16 && clean.length < TOKEN_SAVER_MIN_CHARS * 2) return null;
  const terms = textTerms(query);
  const cap = Math.min(220, Math.round((capOverride ?? 100) * (1 + pressure * 0.25)));
  const keep = new Set<number>();
  lines.forEach((line, index) => {
    if (index < 8 || index >= lines.length - 5 || ERROR_RE.test(line) || WARNING_RE.test(line) || relevanceScore(line, terms) > 0 || /^\s{0,3}(?:#{1,6}\s|[-*+]\s|\d+[.)]\s)/.test(line)) keep.add(index);
  });
  let indexes = [...keep].sort((a, b) => a - b);
  if (indexes.length < cap) {
    const remaining = lines.map((_, index) => index).filter((index) => !keep.has(index) && lines[index].trim());
    const count = Math.min(cap - indexes.length, remaining.length);
    for (let step = 0; step < count; step += 1) keep.add(remaining[Math.floor((step * remaining.length) / Math.max(1, count))]);
    indexes = [...keep].sort((a, b) => a - b);
  }
  indexes = indexes.slice(0, cap);
  if (indexes.length >= lines.length * 0.9) {
    const deduped = dedupeLines(lines);
    return deduped.join("\n").length < clean.length * 0.9 ? deduped.join("\n") : null;
  }
  const out: string[] = [];
  let previous = -2;
  for (const index of indexes) {
    if (index > previous + 1) out.push(`… ${index - previous - 1} lines omitted …`);
    out.push(lines[index].length > 520 ? `${lines[index].slice(0, 450)}…${lines[index].slice(-40)}` : lines[index]);
    previous = index;
  }
  return out.join("\n");
}

function detectStrategy(toolName: string, input: Record<string, unknown>, text: string): TokenSaverStrategy {
  const lowerTool = toolName.toLowerCase();
  const command = typeof input.command === "string" ? input.command.toLowerCase() : "";
  const path = typeof input.path === "string" ? input.path : typeof input.file_path === "string" ? input.file_path : "";
  const clean = stripAnsi(text);
  const trimmed = clean.trim();

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try { JSON.parse(trimmed); return "json"; } catch {}
  }
  if (/^(?:diff --git|---\s+\S+\n\+\+\+\s+\S+)|^@@\s/m.test(clean) || /\bgit\s+diff\b/.test(command)) return "diff";
  if (/\b(?:pytest|jest|vitest|playwright|cargo\s+test|go\s+test|npm\s+(?:run\s+)?test|pnpm\s+(?:run\s+)?test|bun\s+test|rspec|rake\s+test)\b/.test(command)) return "test";
  if (["grep", "find"].includes(lowerTool) || /\b(?:rg|grep|find|ast-grep|sg)\b/.test(command)) return "search";
  if (["ls"].includes(lowerTool) || /^\s*(?:ls|tree)\b/.test(command)) return "tree";
  if (/\b(?:logs?|journalctl|kubectl\s+logs|docker\s+logs|tail\s+-f)\b/.test(command) || /(?:^|\s)(?:TRACE|DEBUG|INFO|WARN|ERROR|FATAL|CRITICAL)(?:\s|:|\])/m.test(clean)) return "log";
  if (lowerTool === "read" && CODE_EXT_RE.test(path)) return "code";
  if (lowerTool === "read" && CONFIG_EXT_RE.test(path)) return "config";
  if (TABLE_BORDER_RE.test(clean.split("\n")[0] ?? "") && clean.split("\n").filter((line) => TABLE_BORDER_RE.test(line)).length >= 5) return "table";
  if (CODE_EXT_RE.test(path) || /\b(?:function|class|interface|struct|def|fn|import|export)\b/.test(clean.slice(0, 2000))) return "code";
  return "text";
}

function marker(id: string, strategy: TokenSaverStrategy, before: number, after: number): string {
  const pct = before > 0 ? Math.max(0, Math.round(((before - after) / before) * 100)) : 0;
  return `\n[token-saver: ${strategy}; ${before}→${after} chars; ~${pct}% smaller; full=${id}]`;
}

function hashText(text: string): string {
  return createHash("sha256").update(text).digest("hex").slice(0, 24);
}

function estimatedTokens(chars: number): number {
  return Math.max(0, Math.ceil(chars / 4));
}

export class TokenSaverEngine {
  private originals = new Map<string, StoredOriginal>();
  private results = new Map<string, CachedCompression>();
  private skip = new Map<string, number>();
  private pressure = new Map<string, number>();
  private seenLargeOutputs = new Map<string, number>();
  private storedChars = 0;
  private query = "";
  private statsState = {
    compressions: 0,
    cacheHits: 0,
    retrievals: 0,
    originalChars: 0,
    compressedChars: 0,
    savedChars: 0,
    byStrategy: new Map<string, { count: number; savedChars: number }>(),
    prefixObservations: 0,
    prefixChanges: 0,
    lastPrefixHash: undefined as string | undefined,
    toolSearches: 0,
    toolsActivated: 0,
    toolDescriptionCharsSaved: 0,
  };

  observePromptPrefix(prompt: string): void {
    const hash = hashText(prompt);
    this.statsState.prefixObservations += 1;
    if (this.statsState.lastPrefixHash && this.statsState.lastPrefixHash !== hash) this.statsState.prefixChanges += 1;
    this.statsState.lastPrefixHash = hash;
  }

  setQuery(query: string): void {
    this.query = query.trim().slice(0, 4000);
  }

  recordToolSearch(activated = 0): void {
    this.statsState.toolSearches += 1;
    this.statsState.toolsActivated += Math.max(0, Math.trunc(activated));
  }

  recordToolDescriptionSavings(savedChars: number): void {
    if (Number.isFinite(savedChars) && savedChars > 0) this.statsState.toolDescriptionCharsSaved += Math.trunc(savedChars);
  }

  resetSession(): void {
    this.originals.clear();
    this.results.clear();
    this.skip.clear();
    this.pressure.clear();
    this.seenLargeOutputs.clear();
    this.storedChars = 0;
    this.query = "";
    this.statsState = {
      compressions: 0,
      cacheHits: 0,
      retrievals: 0,
      originalChars: 0,
      compressedChars: 0,
      savedChars: 0,
      byStrategy: new Map(),
      prefixObservations: 0,
      prefixChanges: 0,
      lastPrefixHash: undefined,
      toolSearches: 0,
      toolsActivated: 0,
      toolDescriptionCharsSaved: 0,
    };
  }

  clear(): void {
    this.resetSession();
  }

  private prune(now = Date.now()): void {
    for (const [key, expiresAt] of this.skip) if (expiresAt <= now) this.skip.delete(key);
    for (const [key, value] of this.results) if (value.expiresAt <= now) this.results.delete(key);
    while (this.skip.size > MAX_TRANSFORM_CACHE_ENTRIES) this.skip.delete(this.skip.keys().next().value as string);
    while (this.results.size > MAX_TRANSFORM_CACHE_ENTRIES) this.results.delete(this.results.keys().next().value as string);
    while (this.seenLargeOutputs.size > MAX_SEEN_OUTPUTS) this.seenLargeOutputs.delete(this.seenLargeOutputs.keys().next().value as string);
    while (this.originals.size > MAX_STORE_ENTRIES || this.storedChars > MAX_STORE_CHARS) {
      const oldest = [...this.originals.values()].sort((a, b) => a.lastAccess - b.lastAccess || a.createdAt - b.createdAt)[0];
      if (!oldest) break;
      this.originals.delete(oldest.id);
      this.storedChars -= oldest.text.length;
    }
  }

  private storeOriginal(text: string, toolName: string): StoredOriginal {
    const id = hashText(text);
    const existing = this.originals.get(id);
    if (existing && existing.text === text) {
      existing.lastAccess = Date.now();
      return existing;
    }
    const entry: StoredOriginal = {
      id,
      text,
      toolName,
      createdAt: Date.now(),
      lastAccess: Date.now(),
      lines: splitLinesPreserveEndings(text).length,
    };
    this.originals.set(id, entry);
    this.storedChars += text.length;
    this.prune();
    return entry;
  }

  private pressureFor(toolName: string): number {
    return Math.min(3, this.pressure.get(toolName.toLowerCase()) ?? 0);
  }

  compress(toolName: string, input: Record<string, unknown>, text: string, isError = false): TokenSaverCompression {
    const original = text;
    const working = normalizeNewlines(text);
    const originalChars = original.length;
    if (originalChars < TOKEN_SAVER_MIN_CHARS || !working.trim()) {
      return { changed: false, text, originalChars, compressedChars: originalChars, savedChars: 0 };
    }
    if (["skill", "skill_search", TOKEN_RETRIEVE_TOOL, TOKEN_TOOL_SEARCH_TOOL].includes(toolName) || /<skill-orchestrator\b|The following skill instructions were loaded/i.test(working.slice(0, 1000))) {
      return { changed: false, text, originalChars, compressedChars: originalChars, savedChars: 0 };
    }
    // RTK deliberately leaves explicitly requested machine-readable output alone.
    // It is often consumed structurally and lossy compaction can change semantics.
    if (requestsExactStructuredOutput(input) || shouldProtectExactRead(toolName, input, this.query)) {
      return { changed: false, text, originalChars, compressedChars: originalChars, savedChars: 0 };
    }
    // Never emit a recovery marker for an original that cannot fit in the
    // bounded recovery store. Reversibility takes priority over compression.
    if (originalChars > MAX_STORE_CHARS) {
      return { changed: false, text, originalChars, compressedChars: originalChars, savedChars: 0 };
    }

    this.prune();
    const originalHash = hashText(original);
    const seenKey = `${toolName.toLowerCase()}:${originalHash}`;
    const seenCount = (this.seenLargeOutputs.get(seenKey) ?? 0) + 1;
    this.seenLargeOutputs.set(seenKey, seenCount);
    if (seenCount > 1) {
      this.storeOriginal(original, toolName);
      const duplicate = `[token-saver duplicate: exact ${toolName} output already appeared earlier in this session; repeated body omitted; full=${originalHash}]`;
      if (duplicate.length < originalChars * 0.92 && originalChars - duplicate.length >= 120) {
        const compression: TokenSaverCompression = {
          changed: true,
          text: duplicate,
          id: originalHash,
          strategy: "dedupe",
          originalChars,
          compressedChars: duplicate.length,
          savedChars: originalChars - duplicate.length,
        };
        this.record("dedupe", originalChars, duplicate.length);
        return compression;
      }
    }

    const contentKey = `${toolName.toLowerCase()}:${originalHash}:${hashText(this.query)}`;
    const now = Date.now();
    const skipUntil = this.skip.get(contentKey);
    if (skipUntil && skipUntil > now) {
      return { changed: false, text, originalChars, compressedChars: originalChars, savedChars: 0 };
    }
    const cached = this.results.get(contentKey);
    if (cached && cached.expiresAt > now) {
      this.storeOriginal(original, toolName);
      this.statsState.cacheHits += 1;
      this.record(cached.compression.strategy, originalChars, cached.compression.compressedChars);
      return { ...cached.compression, cacheHit: true };
    }

    const recoveryId = originalHash;
    const pressure = this.pressureFor(toolName);
    let strategy: TokenSaverStrategy = isError ? "error" : detectStrategy(toolName, input, working);
    let compacted: string | null = null;

    try {
      if (isError) compacted = compressLog(working, this.query, pressure, true);
      else if (strategy === "json") compacted = compressJson(working.trim(), this.query, pressure) ?? tryNdjson(working, this.query, pressure);
      else if (strategy === "search") compacted = compressSearch(working, this.query, pressure);
      else if (strategy === "test") compacted = compressTest(working, this.query, pressure);
      else if (strategy === "log") compacted = compressLog(working, this.query, pressure);
      else if (strategy === "diff") compacted = compressDiff(working, this.query, pressure);
      else if (strategy === "code") compacted = compressCode(working, this.query, pressure);
      else if (strategy === "table") compacted = compressTable(working, this.query, pressure);
      else if (strategy === "config") compacted = compressConfig(working, this.query, pressure);
      else if (strategy === "tree") compacted = compressTree(working, this.query, pressure);
      else compacted = tryNdjson(working, this.query, pressure) ?? compressGeneric(working, this.query, pressure);
    } catch {
      compacted = null;
    }

    if (!compacted) {
      this.skip.set(contentKey, now + CACHE_TTL_MS);
      return { changed: false, text, originalChars, compressedChars: originalChars, savedChars: 0 };
    }

    const baseAfter = compacted.length;
    const finalText = compacted + marker(recoveryId, strategy, originalChars, baseAfter);
    // Compression must pay for its own recovery marker. Otherwise pass through.
    if (finalText.length >= originalChars * 0.92 || originalChars - finalText.length < 120) {
      this.skip.set(contentKey, now + CACHE_TTL_MS);
      return { changed: false, text, originalChars, compressedChars: originalChars, savedChars: 0 };
    }

    const compression: Omit<TokenSaverCompression, "cacheHit"> = {
      changed: true,
      text: finalText,
      id: recoveryId,
      strategy,
      originalChars,
      compressedChars: finalText.length,
      savedChars: originalChars - finalText.length,
    };
    this.storeOriginal(original, toolName);
    this.results.set(contentKey, { expiresAt: now + CACHE_TTL_MS, compression });
    this.record(strategy, originalChars, finalText.length);
    return compression;
  }

  private record(strategy: TokenSaverStrategy | undefined, before: number, after: number): void {
    if (after >= before) return;
    const saved = before - after;
    this.statsState.compressions += 1;
    this.statsState.originalChars += before;
    this.statsState.compressedChars += after;
    this.statsState.savedChars += saved;
    if (strategy) {
      const current = this.statsState.byStrategy.get(strategy) ?? { count: 0, savedChars: 0 };
      current.count += 1;
      current.savedChars += saved;
      this.statsState.byStrategy.set(strategy, current);
    }
  }

  retrieve(id: string, startLine = 1, maxLines = 240): RetrievalResult | null {
    this.prune();
    const entry = this.originals.get(id.trim());
    if (!entry) return null;
    entry.lastAccess = Date.now();
    this.statsState.retrievals += 1;
    const key = entry.toolName.toLowerCase();
    this.pressure.set(key, Math.min(3, (this.pressure.get(key) ?? 0) + 1));

    const lines = splitLinesPreserveEndings(entry.text);
    const safeStart = Math.max(1, Math.min(lines.length, Math.trunc(startLine || 1)));
    const safeMax = Math.max(1, Math.min(1000, Math.trunc(maxLines || 240)));
    const slice = lines.slice(safeStart - 1, safeStart - 1 + safeMax);
    const endLine = safeStart + slice.length - 1;
    return {
      id: entry.id,
      text: slice.map((line, index) => line.content + (index < slice.length - 1 ? line.separator : "")).join(""),
      startLine: safeStart,
      endLine,
      totalLines: lines.length,
      hasMore: endLine < lines.length,
      ...(endLine < lines.length ? { nextStartLine: endLine + 1 } : {}),
    };
  }

  stats(): TokenSaverStats {
    return {
      compressions: this.statsState.compressions,
      cacheHits: this.statsState.cacheHits,
      retrievals: this.statsState.retrievals,
      originalChars: this.statsState.originalChars,
      compressedChars: this.statsState.compressedChars,
      savedChars: this.statsState.savedChars,
      estimatedTokensSaved: estimatedTokens(this.statsState.savedChars),
      storedEntries: this.originals.size,
      storedChars: this.storedChars,
      byStrategy: Object.fromEntries([...this.statsState.byStrategy.entries()].sort(([a], [b]) => a.localeCompare(b))),
      prefixObservations: this.statsState.prefixObservations,
      prefixChanges: this.statsState.prefixChanges,
      toolSearches: this.statsState.toolSearches,
      toolsActivated: this.statsState.toolsActivated,
      toolDescriptionCharsSaved: this.statsState.toolDescriptionCharsSaved,
      ...(this.statsState.lastPrefixHash ? { lastPrefixHash: this.statsState.lastPrefixHash } : {}),
    };
  }
}

export type RoutineContinuationState = "none" | "eligible" | "blocked";

export function updateRoutineContinuationState(
  state: RoutineContinuationState,
  routine: boolean,
): RoutineContinuationState {
  if (state === "blocked") return "blocked";
  return routine ? "eligible" : "blocked";
}

export function isRoutineToolContinuation(toolName: string, input: Record<string, unknown>, text: string, isError = false): boolean {
  if (isError || ERROR_RE.test(text)) return false;
  const tool = toolName.toLowerCase();
  if (["read", "grep", "find", "ls"].includes(tool)) return true;
  if (tool !== "bash") return false;
  const command = typeof input.command === "string" ? input.command.toLowerCase() : "";
  return /^(?:\s*(?:cat|head|tail|sed|rg|grep|find|ls|tree|git\s+(?:status|log|diff)|npm\s+(?:run\s+)?test|pnpm\s+(?:run\s+)?test|pytest|cargo\s+test|go\s+test)\b)/.test(command);
}

function lowerEffort(value: unknown): unknown {
  if (typeof value !== "string") return value;
  return ["medium", "high", "xhigh", "max"].includes(value.toLowerCase()) ? "low" : value;
}

/**
 * Headroom-style effort routing, but deliberately clamp-only. We never add a
 * provider-specific field. Existing fields can only be reduced on a routine,
 * successful continuation, which avoids changing providers that do not expose
 * an effort control in their request payload.
 */
export function clampRoutineProviderEffort(payload: unknown): { payload: unknown; changed: boolean } {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return { payload, changed: false };
  const root = { ...(payload as Record<string, unknown>) };
  let changed = false;

  if ("reasoning_effort" in root) {
    const next = lowerEffort(root.reasoning_effort);
    if (next !== root.reasoning_effort) { root.reasoning_effort = next; changed = true; }
  }
  if (root.reasoning && typeof root.reasoning === "object" && !Array.isArray(root.reasoning)) {
    const reasoning = { ...(root.reasoning as Record<string, unknown>) };
    if ("effort" in reasoning) {
      const next = lowerEffort(reasoning.effort);
      if (next !== reasoning.effort) { reasoning.effort = next; changed = true; }
    }
    root.reasoning = reasoning;
  }
  if (root.output_config && typeof root.output_config === "object" && !Array.isArray(root.output_config)) {
    const output = { ...(root.output_config as Record<string, unknown>) };
    if ("effort" in output) {
      const next = lowerEffort(output.effort);
      if (next !== output.effort) { output.effort = next; changed = true; }
    }
    root.output_config = output;
  }
  if (root.thinking && typeof root.thinking === "object" && !Array.isArray(root.thinking)) {
    const thinking = { ...(root.thinking as Record<string, unknown>) };
    if (typeof thinking.budget_tokens === "number" && Number.isFinite(thinking.budget_tokens) && thinking.budget_tokens > 1024) {
      thinking.budget_tokens = 1024;
      changed = true;
    }
    root.thinking = thinking;
  }
  return { payload: changed ? root : payload, changed };
}
