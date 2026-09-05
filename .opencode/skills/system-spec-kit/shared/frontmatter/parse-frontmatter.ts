// ───────────────────────────────────────────────────────────────────
// MODULE: Markdown Frontmatter Parsing
// ───────────────────────────────────────────────────────────────────

// Single shared frontmatter parser for every skill that reads a leading
// `---` fenced block out of a markdown document. Before this module each
// family (spec-kit, deep-loop, sk-doc, skill advisor) carried its own
// regex or indexOf split with slightly different CRLF, fence-position
// and closing-fence behavior, so the same document could parse
// differently depending on which skill read it.

import { dump as dumpYaml, load as loadYaml } from 'js-yaml';

// ---------------------------------------------------------------
// 1. TYPES
// ---------------------------------------------------------------

export interface ParsedFrontmatter {
  /**
   * Parsed YAML mapping. `{}` when the block is absent, empty, not a
   * YAML mapping, or fails to parse — callers that need the raw text
   * for line-level parsing can still use `raw`.
   */
  frontmatter: Record<string, unknown>;
  /**
   * Everything after the closing fence line's terminator. Preserves the
   * document's original line endings. Empty string when the document
   * ends at the closing fence.
   */
  body: string;
  /**
   * The complete frontmatter block including both `---` fence lines,
   * excluding the line terminator after the closing fence — the same
   * span the leading-fence regexes used to capture. `null` when the
   * document has no frontmatter block.
   */
  raw: string | null;
}

// ---------------------------------------------------------------
// 2. PARSING
// ---------------------------------------------------------------

function isFenceLine(line: string): boolean {
  return line.trimEnd() === '---';
}

/**
 * Parse a leading YAML frontmatter block from a markdown document.
 *
 * A block exists only when the document's FIRST line is exactly `---`
 * (trailing whitespace tolerated) and a later line closes it. Anything
 * else — no fence, a fence that is not on line 1, an unclosed fence —
 * is treated as a document with no frontmatter: `raw` is null and the
 * full text comes back as `body`. Later `---` lines inside the body do
 * not affect the parse; the block always closes at its own fence line.
 */
export function parseFrontmatter(markdown: string): ParsedFrontmatter {
  if (typeof markdown !== 'string' || markdown.length === 0) {
    return { frontmatter: {}, body: typeof markdown === 'string' ? markdown : '', raw: null };
  }

  const firstNewline = markdown.indexOf('\n');
  const firstLine = firstNewline === -1 ? markdown : markdown.slice(0, firstNewline);
  if (!isFenceLine(firstLine)) {
    return { frontmatter: {}, body: markdown, raw: null };
  }

  // Scan for the closing fence line, keeping offsets so the body keeps
  // its original line endings instead of being re-joined from lines.
  let offset = firstNewline + 1;
  let closingStart = -1;
  let closingEnd = -1;
  for (;;) {
    const newline = markdown.indexOf('\n', offset);
    const lineEnd = newline === -1 ? markdown.length : newline;
    const line = markdown.slice(offset, lineEnd);
    if (isFenceLine(line)) {
      closingStart = offset;
      closingEnd = newline === -1 ? markdown.length : newline + 1;
      break;
    }
    if (newline === -1) break;
    offset = newline + 1;
  }

  if (closingStart === -1) {
    return { frontmatter: {}, body: markdown, raw: null };
  }

  const innerWithTerminator = markdown.slice(firstNewline + 1, closingStart);
  let rawEnd = closingEnd;
  if (rawEnd > closingStart && markdown[rawEnd - 1] === '\n') rawEnd -= 1;
  if (rawEnd > closingStart && markdown[rawEnd - 1] === '\r') rawEnd -= 1;
  const raw = markdown.slice(0, rawEnd);

  return {
    frontmatter: parseYamlMapping(innerWithTerminator),
    body: markdown.slice(closingEnd),
    raw,
  };
}

/** Strip the single terminator that belongs to the last frontmatter line. */
function stripTrailingTerminator(text: string): string {
  let end = text.length;
  if (end > 0 && text[end - 1] === '\n') end -= 1;
  if (end > 0 && text[end - 1] === '\r') end -= 1;
  return text.slice(0, end);
}

function parseYamlMapping(yamlText: string): Record<string, unknown> {
  if (yamlText.trim().length === 0) {
    return {};
  }
  try {
    const loaded = loadYaml(yamlText);
    if (loaded === null || typeof loaded !== 'object' || Array.isArray(loaded)) {
      return {};
    }
    return loaded as Record<string, unknown>;
  } catch {
    // Malformed YAML still yields a usable block: callers that parse
    // frontmatter line-by-line (quality rules, key sniffing) read `raw`,
    // so a parse failure must not turn the block itself invisible.
    return {};
  }
}

// ---------------------------------------------------------------
// 3. SERIALIZATION
// ---------------------------------------------------------------

/**
 * Serialize frontmatter + body back into one markdown document with the
 * same leading-fence shape `parseFrontmatter` reads. Values are dumped
 * as block YAML with no line folding, so long scalar values stay on
 * their own line.
 */
export function stringifyFrontmatter(frontmatter: Record<string, unknown>, body: string): string {
  const dumped = dumpYaml(frontmatter, { lineWidth: 0 });
  return `---\n${dumped}---\n${body}`;
}
