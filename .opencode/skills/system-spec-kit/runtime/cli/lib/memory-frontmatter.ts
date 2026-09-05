// ───────────────────────────────────────────────────────────────
// MODULE: Memory Frontmatter
// ───────────────────────────────────────────────────────────────
// Shared helpers for memory-specific frontmatter quality.

import { extractTriggerPhrases } from './trigger-extractor.js';

export const GENERIC_MEMORY_DESCRIPTION = 'Session context memory template for Spec Kit indexing.';
export const LEGACY_GENERIC_MEMORY_TRIGGER_PHRASES = [
  'memory dashboard',
  'session summary',
  'context template',
];

const GENERIC_MEMORY_DESCRIPTION_NORMALIZED = GENERIC_MEMORY_DESCRIPTION.toLowerCase();
const TITLE_CLEANUP_RE = /\s+/g;

function stripMarkdownNoise(value: string): string {
  return value
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\{\{[^}]+\}\}/g, ' ')
    .replace(/`+/g, ' ')
    .replace(/\*+/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\[(.*?)\]\([^)]+\)/g, '$1')
    .replace(/\[[^\]]+\]$/g, ' ')
    .replace(TITLE_CLEANUP_RE, ' ')
    .trim();
}

function normalizeForComparison(value: string): string {
  return stripMarkdownNoise(value).toLowerCase();
}

function truncate(value: string, maxLength: number): string {
  const normalized = value.trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  const hardCut = normalized.slice(0, maxLength - 3).trim();
  const lastSpace = hardCut.lastIndexOf(' ');
  if (lastSpace >= Math.floor(hardCut.length * 0.6)) {
    return `${hardCut.slice(0, lastSpace).trim()}...`;
  }

  return `${hardCut}...`;
}

function buildSpecTokens(specFolder: string): string[] {
  return specFolder
    .replace(/\\/g, '/')
    .split('/')
    .flatMap((segment) => segment.replace(/^\d+--?/, '').split(/[-_]/))
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length >= 3);
}

/** Check whether the full trigger-phrase list is exactly the legacy generic placeholder set. */
export function hasLegacyGenericTriggerPhrases(triggerPhrases: string[]): boolean {
  if (triggerPhrases.length !== LEGACY_GENERIC_MEMORY_TRIGGER_PHRASES.length) {
    return false;
  }

  const normalized = triggerPhrases
    .map((phrase) => normalizeForComparison(phrase))
    .sort();
  const generic = [...LEGACY_GENERIC_MEMORY_TRIGGER_PHRASES].sort();
  return generic.every((phrase, index) => normalized[index] === phrase);
}

/** Check whether any single trigger phrase matches a legacy generic placeholder. */
export function containsLegacyGenericTriggerPhrase(triggerPhrases: string[]): boolean {
  const normalized = triggerPhrases
    .map((phrase) => normalizeForComparison(phrase))
    .filter((phrase) => phrase.length > 0);

  return normalized.some((phrase) => LEGACY_GENERIC_MEMORY_TRIGGER_PHRASES.includes(phrase));
}

/** Check whether a description matches the generic placeholder memory description. */
export function hasGenericMemoryDescription(description?: string | null): boolean {
  if (!description) {
    return false;
  }

  return normalizeForComparison(description) === GENERIC_MEMORY_DESCRIPTION_NORMALIZED;
}

/** Strip markdown noise and trailing punctuation from a memory frontmatter title. */
export function sanitizeMemoryFrontmatterTitle(title?: string | null): string {
  if (!title) {
    return '';
  }

  return stripMarkdownNoise(title)
    .replace(/[\s\-:;,]+$/g, '')
    .trim();
}

/** Pick the first non-generic, sanitized candidate (summary, heading, then title) as the memory description. */
export function deriveMemoryDescription(options: {
  summary?: string | null;
  heading?: string | null;
  title?: string | null;
}): string {
  const candidates = [
    options.summary,
    options.heading,
    options.title,
  ];

  for (const candidate of candidates) {
    const cleaned = sanitizeMemoryFrontmatterTitle(candidate);
    if (!cleaned) {
      continue;
    }

    if (normalizeForComparison(cleaned) === GENERIC_MEMORY_DESCRIPTION_NORMALIZED) {
      continue;
    }

    return truncate(cleaned, 180);
  }

  return 'Session context preserved for future continuation.';
}

/** Derive a memory's trigger phrases from existing entries plus title, description and spec-folder tokens. */
export function deriveMemoryTriggerPhrases(options: {
  title?: string | null;
  description?: string | null;
  summary?: string | null;
  specFolder: string;
  existing?: string[];
}): string[] {
  const existing = Array.isArray(options.existing) ? options.existing : [];
  const cleanedExisting = existing
    .map((entry) => normalizeForComparison(entry))
    .filter((entry) => entry.length >= 3);

  if (cleanedExisting.length > 0 && !containsLegacyGenericTriggerPhrase(cleanedExisting)) {
    return Array.from(new Set(cleanedExisting)).slice(0, 12);
  }

  const source = [
    sanitizeMemoryFrontmatterTitle(options.title),
    sanitizeMemoryFrontmatterTitle(options.description),
    sanitizeMemoryFrontmatterTitle(options.summary),
    buildSpecTokens(options.specFolder).join(' '),
  ].filter(Boolean).join('\n');

  const extracted = extractTriggerPhrases(source)
    .map((phrase) => normalizeForComparison(phrase))
    .filter((phrase) => phrase.length >= 3);

  const combined = [
    ...extracted,
    ...buildSpecTokens(options.specFolder),
  ];

  const unique = Array.from(new Set(combined))
    .filter((entry) => !LEGACY_GENERIC_MEMORY_TRIGGER_PHRASES.includes(entry));

  if (unique.length === 0) {
    return [];
  }

  return unique.slice(0, 12);
}
