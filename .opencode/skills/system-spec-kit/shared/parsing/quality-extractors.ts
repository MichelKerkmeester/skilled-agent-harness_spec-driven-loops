// ---------------------------------------------------------------
// MODULE: Quality Extractors
// ---------------------------------------------------------------

import { parseFrontmatter } from '../frontmatter/parse-frontmatter.js';

/**
 * Extract the YAML frontmatter block (between --- delimiters).
 * Returns empty string when no frontmatter is found — body text must never
 * be parsed as metadata.
 */
function extractFrontmatter(content: string): string {
  const raw = parseFrontmatter(content).raw;
  if (raw === null) return '';
  // Inner block text between the fence lines, line-read verbatim; a CRLF
  // terminator's \r belongs to the fence, not the value.
  return raw.slice(raw.indexOf('\n') + 1, raw.lastIndexOf('\n')).replace(/\r$/, '');
}

/**
 * Extract quality score from frontmatter content.
 * Canonical shared implementation — replaces duplicates in memory-indexer.ts and memory-parser.ts.
 */
export function extractQualityScore(content: string): number {
  const fm = extractFrontmatter(content);
  const match = fm.match(/quality_score:\s*([0-9.]+)/i);
  if (!match) return 0;
  const parsed = Number.parseFloat(match[1]);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(1, parsed));
}

/**
 * Extract quality flags from frontmatter content.
 * Canonical shared implementation — replaces duplicates in memory-indexer.ts and memory-parser.ts.
 */
export function extractQualityFlags(content: string): string[] {
  const fm = extractFrontmatter(content);
  const blockMatch = fm.match(/quality_flags:\s*\n([\s\S]*?)(?:\n\S|$)/i);
  if (!blockMatch) return [];
  const lines = blockMatch[1].split('\n');
  const flags: string[] = [];
  for (const line of lines) {
    const flagMatch = line.match(/^\s*-\s*['"]?([^'"]+)['"]?\s*$/);
    if (flagMatch) flags.push(flagMatch[1].trim());
  }
  return flags;
}
