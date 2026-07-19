// ───────────────────────────────────────────────────────────────
// MODULE: Packet Synopsis Extractor
// ───────────────────────────────────────────────────────────────
// One shared synopsis extractor for the two generated fields that summarize a spec
// folder: the description in description.json and the causal_summary in graph-metadata.json.
// Both fields previously ran two divergent local extractors, so they could drift from the
// same spec.md even when nothing was stale. This helper applies one explicit precedence over
// the same source doc and exposes a per-field length limit, so the two fields move together
// and a reader can trust they describe the same thing.

import { stripYamlFrontmatter } from '../parsing/content-normalizer.js';

/** The two generated fields that derive from the shared synopsis precedence. */
export type SynopsisField = 'description' | 'causal_summary';

// Field-specific length limits. The short description is a one-line label, the causal_summary
// carries the longer overview a reader scans before opening the packet. Same precedence,
// different ceiling, so a longer source produces a fuller causal_summary while the description
// stays terse.
export const SYNOPSIS_FIELD_LIMITS: Record<SynopsisField, number> = {
  description: 150,
  causal_summary: 600,
};

const OVERVIEW_SECTION_RE = /###\s+Overview\s*\n([\s\S]*?)(?:\n###|\n##|\n<!--|$)/i;
const PROBLEM_HEADING_RE =
  /^#{1,4}\s+(problem\s+(statement|&\s*purpose|and\s+purpose)|purpose)/i;
const FRONTMATTER_DESCRIPTION_RE = /^\s*description:\s*(.+?)\s*$/im;

function stripInlineMarkers(line: string): string {
  return line.replace(/\*+/g, '').replace(/_+/g, '').replace(/^[-*>]\s+/, '').trim();
}

function firstSentence(text: string): string {
  return text.split(/\.\s/)[0].trim().replace(/\.$/, '');
}

function sentenceBoundaryWithinLimit(text: string, limit: number): number {
  let bestBoundary = -1;
  const sentenceEndRe = /[.!?](?=\s|$)/g;
  let match: RegExpExecArray | null;
  while ((match = sentenceEndRe.exec(text)) !== null) {
    const boundary = match.index + 1;
    if (boundary > limit) {
      break;
    }
    bestBoundary = boundary;
  }
  return bestBoundary;
}

function extractFrontmatterDescription(raw: string): string | null {
  const match = raw.match(/^(?:﻿)?(?:\s*<!--[\s\S]*?-->\s*)*---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return null;
  }
  const fmMatch = match[1].match(FRONTMATTER_DESCRIPTION_RE);
  if (!fmMatch) {
    return null;
  }
  const value = fmMatch[1].trim().replace(/^['"]|['"]$/g, '').trim();
  return value.length > 0 ? value : null;
}

function extractOverviewParagraph(body: string): string | null {
  const match = body.match(OVERVIEW_SECTION_RE);
  if (!match?.[1]) {
    return null;
  }
  const normalized = match[1]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('<!--'))
    .join(' ')
    .trim();
  return normalized.length > 0 ? normalized : null;
}

function extractProblemSentence(lines: string[]): string | null {
  for (let i = 0; i < lines.length; i += 1) {
    if (!PROBLEM_HEADING_RE.test(lines[i])) {
      continue;
    }
    for (let j = i + 1; j < lines.length && j < i + 10; j += 1) {
      const candidate = lines[j];
      if (candidate.length === 0) continue;
      if (candidate.startsWith('#')) break;
      const clean = stripInlineMarkers(candidate);
      if (clean.length > 0) {
        return firstSentence(clean);
      }
    }
  }
  return null;
}

function extractTitleHeading(lines: string[]): string | null {
  for (const line of lines) {
    if (line.startsWith('# ')) {
      const title = line.replace(/^#+\s+/, '').trim();
      if (title.length > 0) {
        return title;
      }
    }
  }
  return null;
}

function extractFirstBodyLine(lines: string[]): string | null {
  for (const line of lines) {
    if (line.startsWith('#') || line.length === 0) continue;
    const clean = stripInlineMarkers(line);
    if (clean.length > 0) {
      return firstSentence(clean);
    }
  }
  return null;
}

/**
 * Clamp a generated synopsis to a length limit without cutting the final word when possible.
 *
 * @param synopsis - Candidate synopsis text
 * @param limit - Maximum character length
 * @returns The original string when at or below the limit, otherwise a word-boundary clamp
 */
export function truncateSynopsisAtWordBoundary(synopsis: string, limit: number): string {
  if (synopsis.length <= limit) {
    return synopsis;
  }

  const sentenceBoundary = sentenceBoundaryWithinLimit(synopsis, limit);
  if (sentenceBoundary > 0) {
    return synopsis.slice(0, sentenceBoundary).trim();
  }

  const truncated = synopsis.slice(0, limit);
  const nextChar = synopsis[limit];
  if (nextChar === undefined || /\s/.test(nextChar)) {
    return truncated.trim();
  }

  const boundary = truncated.search(/\s+\S*$/);
  if (boundary > 0) {
    return truncated.slice(0, boundary).trim();
  }
  return truncated.trim();
}

/**
 * Derive a packet synopsis from spec.md content with one shared precedence.
 *
 * Precedence (first match wins): the Overview section paragraph, the Problem/Purpose first
 * sentence, the frontmatter description, the title heading, then the first body line. The two
 * generated fields call this with their own `field`, so they derive from the same precedence
 * over the same source doc and only the length ceiling differs.
 *
 * @param specContent - Raw spec.md content (frontmatter included)
 * @param field - Which generated field is being derived, selects the length limit
 * @returns The synopsis trimmed to the field limit, or empty string when nothing extractable
 */
export function derivePacketSynopsis(specContent: string, field: SynopsisField): string {
  const limit = SYNOPSIS_FIELD_LIMITS[field];
  if (!specContent || typeof specContent !== 'string') {
    return '';
  }

  const frontmatterDescription = extractFrontmatterDescription(specContent);
  const body = stripYamlFrontmatter(specContent).trim();
  const lines = body.split('\n').map((line) => line.trim());

  const synopsis =
    extractOverviewParagraph(body)
    ?? extractProblemSentence(lines)
    ?? frontmatterDescription
    ?? extractTitleHeading(lines)
    ?? extractFirstBodyLine(lines)
    ?? '';

  return truncateSynopsisAtWordBoundary(synopsis, limit);
}
