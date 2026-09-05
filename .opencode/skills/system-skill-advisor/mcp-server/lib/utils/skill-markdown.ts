// ───────────────────────────────────────────────────────────────
// MODULE: Skill Markdown Frontmatter Parser
// ───────────────────────────────────────────────────────────────
// Single source of truth for parsing SKILL.md frontmatter + body
// + keyword-block. Both `lib/derived/extract.ts` and
// `lib/scorer/projection.ts` need the same parsing semantics
// (YAML-style key: value lines, surrounding-quote stripping,
// `<!-- Keywords: a, b, c -->` extraction). The two callers diverge
// in which fields they pluck from the result — they must NOT diverge
// in the parsing itself.

import { parseFrontmatter as parseFrontmatterBlock } from '@spec-kit/shared/frontmatter/parse-frontmatter';

export interface ParsedSkillMarkdown {
  /** Frontmatter key/value pairs, with surrounding quotes stripped. */
  readonly frontmatter: Record<string, string>;
  /** The markdown body that follows the closing `---` fence. */
  readonly body: string;
  /** Keywords parsed from a `<!-- Keywords: a, b, c -->` HTML comment. */
  readonly keywords: string[];
}

const FRONTMATTER_LINE = /^([A-Za-z0-9_-]+):\s*(.*)$/;
const SURROUNDING_QUOTES = /^["']|["']$/g;
const KEYWORDS_BLOCK = /<!--\s*Keywords:\s*([\s\S]*?)-->/i;

/**
 * Parse a SKILL.md document into `{ frontmatter, body, keywords }`.
 *
 * Frontmatter is the YAML-ish block enclosed in a leading and trailing
 * `---` fence, split by the shared frontmatter parser. Each line is
 * matched against the canonical `^([A-Za-z0-9_-]+):\s*(.*)$` regex and
 * the value is trimmed of any surrounding single or double quotes.
 *
 * Keywords are extracted from a `<!-- Keywords: ... -->` HTML comment
 * anywhere in the document and split on `,`. Empty entries are dropped.
 */
export function parseSkillFrontmatter(raw: string): ParsedSkillMarkdown {
  const frontmatter: Record<string, string> = {};
  const parsed = parseFrontmatterBlock(raw);
  if (parsed.raw !== null) {
    for (const line of parsed.raw.split(/\r?\n/).slice(1, -1)) {
      const match = FRONTMATTER_LINE.exec(line);
      if (match) {
        frontmatter[match[1]] = match[2].replace(SURROUNDING_QUOTES, '').trim();
      }
    }
  }
  const body = parsed.raw === null ? raw : parsed.body;
  const keywordMatch = KEYWORDS_BLOCK.exec(raw);
  const keywords = keywordMatch
    ? keywordMatch[1].split(',').map((entry) => entry.trim()).filter(Boolean)
    : [];
  return { frontmatter, body, keywords };
}
