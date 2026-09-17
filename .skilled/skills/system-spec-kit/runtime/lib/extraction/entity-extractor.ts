// ───────────────────────────────────────────────────────────────────
// MODULE: Entity Extractor
// ───────────────────────────────────────────────────────────────────
// Pure-TS rule-based extraction of entities from generated packet metadata
// content (headings, quoted strings, proper nouns, …). Zero npm dependencies.
import fs from 'node:fs';

import { isEntityDenied } from './entity-denylist.js';

/**
 * Canonical entity-name normalization. Extraction is the only surviving owner,
 * so the function lives here rather than in the search layer it used to share
 * with the link-time index.
 *
 * @param name - Raw entity name to normalize.
 * @returns Normalized lowercase entity name.
 * @example
 * ```ts
 * normalizeEntityName('TF-IDF');
 * // 'tf idf'
 * ```
 */
export function normalizeEntityName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

/** A single entity extracted from memory content. */
export interface ExtractedEntity {
  /** The raw entity text as found in content. */
  text: string;
  /** Classification of how the entity was detected. */
  type: 'proper_noun' | 'technology' | 'key_phrase' | 'heading' | 'quoted';
  /** Number of occurrences in the source content. */
  frequency: number;
}

// ───────────────────────────────────────────────────────────────────
// 2. EXTRACTION RULES
// ───────────────────────────────────────────────────────────────────

/**
 * A declarative entity-extraction rule: a regex applied over content whose
 * captured group becomes an entity of `type`. Keeping rules as data (rather
 * than inlined regex literals) lets new entity types be added by editing a
 * config file instead of code, while the built-in set below stays the
 * fail-closed source of truth.
 */
export interface EntityExtractionRule {
  /** Entity classification assigned to every match of this rule. */
  type: ExtractedEntity['type'];
  /** RegExp source string. Must be globally matchable (flags include 'g'). */
  pattern: string;
  /** RegExp flags. Must contain 'g' so the match loop terminates. */
  flags: string;
  /** 1-based capture group whose text is the entity. */
  captureGroup: number;
  /** When true, the captured text is trimmed (matches the heading rule). */
  trim?: boolean;
}

const ENTITY_TYPES: ReadonlySet<ExtractedEntity['type']> = new Set([
  'proper_noun',
  'technology',
  'key_phrase',
  'heading',
  'quoted',
]);

/**
 * Built-in rule set — the canonical, always-available source of truth.
 * Reproduces the five historical inline rules exactly, in order. An external
 * override (see loadEntityExtractionRules) may replace these, but any failure
 * to load or validate it falls back here so extraction never crashes.
 */
const BUILTIN_ENTITY_RULES: readonly EntityExtractionRule[] = [
  // Rule 1: Capitalized multi-word sequences (proper nouns).
  { type: 'proper_noun', pattern: '\\b([A-Z][a-z]+(?:\\s+[A-Z][a-z]+)+)\\b', flags: 'g', captureGroup: 1 },
  // Rule 2: Technology names from code fence annotations.
  { type: 'technology', pattern: '```(\\w+)', flags: 'g', captureGroup: 1 },
  // Rule 3: Words after key phrases. Keywords are case-insensitive via explicit
  // alternation (no `i` flag, since continuation words must start uppercase to
  // avoid capturing common English words). Tokens may include internal dots
  // (e.g. "Node.js") but a trailing sentence period ends the match.
  { type: 'key_phrase', pattern: '\\b(?:[Uu]sing|[Ww]ith|[Vv]ia|[Ii]mplements)\\s+([A-Za-z][\\w-]*(?:\\.[A-Za-z0-9_-]+)*(?:\\s+[A-Z][\\w-]*(?:\\.[A-Za-z0-9_-]+)*)*)', flags: 'g', captureGroup: 1 },
  // Rule 4: Markdown heading content (## through ####).
  { type: 'heading', pattern: '^#{2,4}\\s+(.+)$', flags: 'gm', captureGroup: 1, trim: true },
  // Rule 5: Quoted strings (double quotes, 2-50 chars).
  { type: 'quoted', pattern: '"([^"]{2,50})"', flags: 'g', captureGroup: 1 },
];

let cachedEntityRules: readonly EntityExtractionRule[] | null = null;

function isValidEntityRule(value: unknown): value is EntityExtractionRule {
  if (!value || typeof value !== 'object') return false;
  const rule = value as Record<string, unknown>;
  if (typeof rule.type !== 'string' || !ENTITY_TYPES.has(rule.type as ExtractedEntity['type'])) return false;
  if (typeof rule.pattern !== 'string' || rule.pattern.length === 0) return false;
  // 'g' is mandatory: without it the exec() loop never advances and would hang.
  if (typeof rule.flags !== 'string' || !rule.flags.includes('g')) return false;
  if (typeof rule.captureGroup !== 'number' || !Number.isInteger(rule.captureGroup) || rule.captureGroup < 1) return false;
  if (rule.trim !== undefined && typeof rule.trim !== 'boolean') return false;
  try {
    new RegExp(rule.pattern, rule.flags);
  } catch {
    return false;
  }
  return true;
}

function parseEntityRules(rawConfig: unknown): EntityExtractionRule[] | null {
  const list = Array.isArray(rawConfig)
    ? rawConfig
    : (rawConfig && typeof rawConfig === 'object' && Array.isArray((rawConfig as Record<string, unknown>).rules)
        ? (rawConfig as Record<string, unknown>).rules as unknown[]
        : null);
  if (!list || list.length === 0) return null;
  const parsed: EntityExtractionRule[] = [];
  for (const entry of list) {
    if (!isValidEntityRule(entry)) return null;
    parsed.push({
      type: entry.type,
      pattern: entry.pattern,
      flags: entry.flags,
      captureGroup: entry.captureGroup,
      ...(entry.trim !== undefined ? { trim: entry.trim } : {}),
    });
  }
  return parsed;
}

/**
 * Resolve the active extraction rules. When SPECKIT_ENTITY_CONFIG_PATH points
 * at a readable, valid JSON rule file the rules come from there (new entity
 * types without a code change); otherwise the built-in set is used. Any read,
 * parse, or validation failure logs a warning and falls back to the built-in
 * rules so a malformed config never breaks extraction.
 */
export function loadEntityExtractionRules(): readonly EntityExtractionRule[] {
  if (cachedEntityRules) return cachedEntityRules;

  const overridePath = process.env.SPECKIT_ENTITY_CONFIG_PATH?.trim();
  if (overridePath) {
    try {
      const parsed = parseEntityRules(JSON.parse(fs.readFileSync(overridePath, 'utf-8')));
      if (parsed) {
        cachedEntityRules = parsed;
        return cachedEntityRules;
      }
      console.warn(`[entity-extractor] Entity config at ${overridePath} is malformed or empty; using built-in rules`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[entity-extractor] Failed to load entity config at ${overridePath} (${msg}); using built-in rules`);
    }
  }

  cachedEntityRules = BUILTIN_ENTITY_RULES;
  return cachedEntityRules;
}

/** Apply the declarative rules in order, returning raw (text, type) hits. */
function applyEntityRules(
  content: string,
  rules: readonly EntityExtractionRule[],
): Array<{ text: string; type: ExtractedEntity['type'] }> {
  const raw: Array<{ text: string; type: ExtractedEntity['type'] }> = [];
  for (const rule of rules) {
    const re = new RegExp(rule.pattern, rule.flags);
    let match: RegExpExecArray | null;
    while ((match = re.exec(content)) !== null) {
      // Guard against a zero-width match (possible only from an override regex)
      // stalling the loop; the built-in rules never match empty.
      if (match.index === re.lastIndex) re.lastIndex++;
      const captured = match[rule.captureGroup];
      if (captured === undefined) continue;
      raw.push({ text: rule.trim ? captured.trim() : captured, type: rule.type });
    }
  }
  return raw;
}

/**
 * Main extraction function — pure-TS rule-based, no npm deps.
 *
 * Rules are applied in order from the active config (built-in by default;
 * see loadEntityExtractionRules):
 *   1. Capitalized multi-word sequences (2+ words starting with uppercase) → proper_noun
 *   2. Technology names from code fence annotations → technology
 *   3. Words after key phrases ("using", "with", "via", "implements") → key_phrase
 *   4. Markdown heading content (## through ####) → heading
 *   5. Quoted strings (double quotes, 2-50 chars) → quoted
 *
 * Results are deduplicated by normalized text with summed frequencies.
 *
 * @param content - The raw text content to extract entities from.
 * @returns Array of extracted entities, deduplicated and frequency-counted.
 */
export function extractEntities(content: string): ExtractedEntity[] {
  const raw = applyEntityRules(content, loadEntityExtractionRules());
  // Deduplicate by normalized text (lowercase, trimmed), summing frequencies
  return deduplicateEntities(raw);
}

// ───────────────────────────────────────────────────────────────────
// 3. FILTERING
// ───────────────────────────────────────────────────────────────────

/**
 * Filter entities through denylist + length checks.
 *
 * Removes:
 *   - Single-character entities
 *   - Entities where ALL words are on the denylist
 *   - Entities longer than 100 characters
 *
 * @param entities - Raw extracted entities to filter.
 * @returns Filtered array with noise removed.
 */
export function filterEntities(entities: ExtractedEntity[]): ExtractedEntity[] {
  return entities.filter((entity) => {
    // Remove single-character entities
    if (entity.text.length <= 1) return false;

    // Remove entities longer than 100 characters
    if (entity.text.length > 100) return false;

    // Remove entities where ALL words are on the denylist
    const words = entity.text.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length > 0 && words.every((w) => isEntityDenied(w))) return false;

    return true;
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. INTERNAL HELPERS (exported for testing)
// ───────────────────────────────────────────────────────────────────

/**
 * Deduplicate raw extraction results by normalized text.
 * Entries with the same normalized form are merged, summing frequencies.
 * The first occurrence's type wins.
 */
function deduplicateEntities(
  raw: Array<{ text: string; type: ExtractedEntity['type'] }>,
): ExtractedEntity[] {
  const map = new Map<string, ExtractedEntity>();

  for (const item of raw) {
    const key = normalizeEntityName(item.text);
    const existing = map.get(key);
    if (existing) {
      existing.frequency += 1;
    } else {
      map.set(key, { text: item.text, type: item.type, frequency: 1 });
    }
  }

  return Array.from(map.values());
}

/** Reset the cached extraction rules so the next load re-reads the environment. */
function resetEntityRulesCache(): void {
  cachedEntityRules = null;
}

/**
 * Internal helpers exported for testing via __testables.
 */
export const __testables = {
  deduplicateEntities,
  normalizeEntityName,
  BUILTIN_ENTITY_RULES,
  applyEntityRules,
  parseEntityRules,
  resetEntityRulesCache,
};
