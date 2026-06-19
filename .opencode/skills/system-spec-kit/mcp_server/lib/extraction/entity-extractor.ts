// ───────────────────────────────────────────────────────────────
// MODULE: Entity Extractor
// ───────────────────────────────────────────────────────────────
// Feature catalog: Auto entity extraction
// Feature-flagged via SPECKIT_AUTO_ENTITIES
// Pure-TS rule-based extraction, zero npm dependencies.
import fs from 'node:fs';

import { isEntityDenied } from './entity-denylist.js';
import { normalizeEntityName, computeEdgeDensity } from '../search/entity-linker.js';

import type Database from 'better-sqlite3';

// Re-export canonical versions from entity-linker for backward compatibility
export { normalizeEntityName, computeEdgeDensity };

// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
/** A single entity extracted from memory content. */
export interface ExtractedEntity {
  /** The raw entity text as found in content. */
  text: string;
  /** Classification of how the entity was detected. */
  type: 'proper_noun' | 'technology' | 'key_phrase' | 'heading' | 'quoted';
  /** Number of occurrences in the source content. */
  frequency: number;
}

export interface RebuildAutoEntitiesOptions {
  specFolder?: string | null;
  dryRun?: boolean;
}

export interface RebuildAutoEntitiesResult {
  dryRun: boolean;
  specFolder: string | null;
  memoriesScanned: number;
  memoriesReprocessed: number;
  autoRowsRemoved: number;
  extractedEntities: number;
  storedEntities: number;
  catalogEntriesRebuilt: number;
}

interface AutoEntitySourceRow {
  id: number;
  spec_folder: string | null;
  content_text: string | null;
}

interface CatalogEntityRow {
  memory_id: number;
  entity_text: string;
  entity_type: ExtractedEntity['type'];
}

export interface RefreshAutoEntitiesForMemoryResult {
  removed: number;
  stored: number;
  catalogRebuilt: boolean;
}

// ───────────────────────────────────────────────────────────────
// 2. EXTRACTION RULES

// ───────────────────────────────────────────────────────────────
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

// ───────────────────────────────────────────────────────────────
// 3. FILTERING

// ───────────────────────────────────────────────────────────────
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

// ───────────────────────────────────────────────────────────────
// 4. STORAGE

// ───────────────────────────────────────────────────────────────
/**
 * Store extracted entities in the memory_entities table.
 *
 * Uses INSERT OR REPLACE on the UNIQUE(memory_id, entity_text) constraint.
 *
 * @param db - An initialized better-sqlite3 Database instance.
 * @param memoryId - The memory_index row ID to associate entities with.
 * @param entities - Filtered entities to store.
 * @returns Count of entities stored.
 */
export function storeEntities(
  db: Database.Database,
  memoryId: number,
  entities: ExtractedEntity[],
): { stored: number } {
  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO memory_entities
        (memory_id, entity_text, entity_type, frequency, created_by)
      VALUES (?, ?, ?, ?, 'auto')
    `);

    let stored = 0;
    const runInTransaction = db.transaction(() => {
      for (const entity of entities) {
        stmt.run(memoryId, entity.text, entity.type, entity.frequency);
        stored++;
      }
    });
    runInTransaction();

    return { stored };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[entity-extractor] storeEntities failed: ${msg}`);
    return { stored: 0 };
  }
}

export function refreshAutoEntitiesForMemory(
  db: Database.Database,
  memoryId: number,
  entities: ExtractedEntity[],
): RefreshAutoEntitiesForMemoryResult {
  try {
    const deleteStmt = db.prepare(`
      DELETE FROM memory_entities
      WHERE memory_id = ?
        AND created_by = 'auto'
    `);
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO memory_entities
        (memory_id, entity_text, entity_type, frequency, created_by)
      VALUES (?, ?, ?, ?, 'auto')
    `);

    let removed = 0;
    let stored = 0;
    const runInTransaction = db.transaction(() => {
      removed = deleteStmt.run(memoryId).changes;
      for (const entity of entities) {
        insertStmt.run(memoryId, entity.text, entity.type, entity.frequency);
        stored++;
      }
    });
    runInTransaction();

    if (removed > 0) {
      rebuildEntityCatalog(db);
      return { removed, stored, catalogRebuilt: true };
    }

    if (entities.length > 0) {
      updateEntityCatalog(db, entities);
    }

    return { removed, stored, catalogRebuilt: false };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[entity-extractor] refreshAutoEntitiesForMemory failed: ${msg}`);
    return { removed: 0, stored: 0, catalogRebuilt: false };
  }
}

// ───────────────────────────────────────────────────────────────
// 5. ENTITY CATALOG

// ───────────────────────────────────────────────────────────────
/**
 * Upsert entities into entity_catalog with alias normalization.
 *
 * For each entity:
 *   1. normalizeEntityName(text) -> canonical_name
 *   2. INSERT new catalog entry or UPDATE existing:
 *      - Increment memory_count
 *      - Append text as alias if not already present
 *
 * @param db - An initialized better-sqlite3 Database instance.
 * @param entities - Filtered entities to catalog.
 * @returns Count of entities upserted.
 */
export function updateEntityCatalog(
  db: Database.Database,
  entities: ExtractedEntity[],
): { upserted: number } {
  try {
    let upserted = 0;

    const selectStmt = db.prepare(
      'SELECT id, aliases, memory_count FROM entity_catalog WHERE canonical_name = ?',
    );
    const insertStmt = db.prepare(`
      INSERT INTO entity_catalog (canonical_name, aliases, entity_type, memory_count, created_at)
      VALUES (?, ?, ?, 1, datetime('now'))
    `);
    const updateStmt = db.prepare(`
      UPDATE entity_catalog
      SET aliases = ?, memory_count = memory_count + 1
      WHERE id = ?
    `);

    const runInTransaction = db.transaction(() => {
      for (const entity of entities) {
        const canonical = normalizeEntityName(entity.text);
        if (!canonical) continue;

        const existing = selectStmt.get(canonical) as
          | { id: number; aliases: string; memory_count: number }
          | undefined;

        if (existing) {
          // Append alias if new variant
          let aliases: string[];
          try {
            aliases = JSON.parse(existing.aliases);
            if (!Array.isArray(aliases)) aliases = [];
          } catch {
            aliases = [];
          }

          if (!aliases.includes(entity.text)) {
            aliases.push(entity.text);
          }

          updateStmt.run(JSON.stringify(aliases), existing.id);
        } else {
          // Insert new catalog entry
          const aliases = JSON.stringify([entity.text]);
          insertStmt.run(canonical, aliases, entity.type);
        }

        upserted++;
      }
    });
    runInTransaction();

    return { upserted };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[entity-extractor] updateEntityCatalog failed: ${msg}`);
    return { upserted: 0 };
  }
}

/**
 * Rebuild entity_catalog deterministically from current memory_entities rows.
 */
export function rebuildEntityCatalog(db: Database.Database): { rebuilt: number } {
  try {
    const rows = db.prepare(`
      SELECT memory_id, entity_text, entity_type
      FROM memory_entities
      ORDER BY id ASC
    `).all() as CatalogEntityRow[];

    const aggregates = new Map<string, {
      aliases: Set<string>;
      entityType: ExtractedEntity['type'];
      memoryIds: Set<number>;
    }>();

    for (const row of rows) {
      const canonical = normalizeEntityName(row.entity_text);
      if (!canonical) {
        continue;
      }

      const existing = aggregates.get(canonical);
      if (existing) {
        existing.aliases.add(row.entity_text);
        existing.memoryIds.add(row.memory_id);
        continue;
      }

      aggregates.set(canonical, {
        aliases: new Set([row.entity_text]),
        entityType: row.entity_type,
        memoryIds: new Set([row.memory_id]),
      });
    }

    const deleteStmt = db.prepare('DELETE FROM entity_catalog');
    const insertStmt = db.prepare(`
      INSERT INTO entity_catalog (canonical_name, aliases, entity_type, memory_count, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);

    const runInTransaction = db.transaction(() => {
      deleteStmt.run();

      for (const canonical of Array.from(aggregates.keys()).sort()) {
        const aggregate = aggregates.get(canonical);
        if (!aggregate) {
          continue;
        }

        insertStmt.run(
          canonical,
          JSON.stringify(Array.from(aggregate.aliases).sort()),
          aggregate.entityType,
          aggregate.memoryIds.size,
        );
      }
    });
    runInTransaction();

    return { rebuilt: aggregates.size };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[entity-extractor] rebuildEntityCatalog failed: ${msg}`);
    return { rebuilt: 0 };
  }
}

/**
 * Rebuild auto-generated entity rows from current memory content.
 *
 * This provides a deterministic cleanup path for pre-fix entity rows by
 * deleting only `created_by='auto'` entries in scope, re-extracting from the
 * live `memory_index.content_text`, and then rebuilding `entity_catalog`
 * exactly from the resulting entity rows.
 */
export function rebuildAutoEntities(
  db: Database.Database,
  options: RebuildAutoEntitiesOptions = {},
): RebuildAutoEntitiesResult {
  const specFolder = typeof options.specFolder === 'string' && options.specFolder.trim().length > 0
    ? options.specFolder.trim()
    : null;
  const dryRun = options.dryRun === true;

  const memories = db.prepare(`
    SELECT id, spec_folder, content_text
    FROM memory_index
    WHERE (? IS NULL OR spec_folder = ?)
    ORDER BY id ASC
  `).all(specFolder, specFolder) as AutoEntitySourceRow[];

  const extractedByMemory = memories.map((memory) => {
    const filtered = filterEntities(extractEntities(memory.content_text ?? ''));
    return { memoryId: memory.id, entities: filtered, hasContent: (memory.content_text ?? '').trim().length > 0 };
  });

  const autoRowCount = db.prepare(`
    SELECT COUNT(*) AS count
    FROM memory_entities me
    WHERE me.created_by = 'auto'
      AND EXISTS (
        SELECT 1
        FROM memory_index m
        WHERE m.id = me.memory_id
          AND (? IS NULL OR m.spec_folder = ?)
      )
  `).get(specFolder, specFolder) as { count?: number };

  const extractedEntities = extractedByMemory.reduce((sum, row) => sum + row.entities.length, 0);
  const memoriesReprocessed = extractedByMemory.filter((row) => row.hasContent).length;

  if (dryRun) {
    return {
      dryRun: true,
      specFolder,
      memoriesScanned: memories.length,
      memoriesReprocessed,
      autoRowsRemoved: autoRowCount.count ?? 0,
      extractedEntities,
      storedEntities: extractedEntities,
      catalogEntriesRebuilt: 0,
    };
  }

  const deleteAutoRows = db.prepare(`
    DELETE FROM memory_entities
    WHERE created_by = 'auto'
      AND EXISTS (
        SELECT 1
        FROM memory_index m
        WHERE m.id = memory_entities.memory_id
          AND (? IS NULL OR m.spec_folder = ?)
      )
  `);

  let storedEntities = 0;
  const runInTransaction = db.transaction(() => {
    deleteAutoRows.run(specFolder, specFolder);

    for (const row of extractedByMemory) {
      if (row.entities.length === 0) {
        continue;
      }

      storedEntities += storeEntities(db, row.memoryId, row.entities).stored;
    }
  });
  runInTransaction();

  const rebuiltCatalog = rebuildEntityCatalog(db);

  return {
    dryRun: false,
    specFolder,
    memoriesScanned: memories.length,
    memoriesReprocessed,
    autoRowsRemoved: autoRowCount.count ?? 0,
    extractedEntities,
    storedEntities,
    catalogEntriesRebuilt: rebuiltCatalog.rebuilt,
  };
}

// 6. INTERNAL HELPERS (exported for testing)
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
    const key = item.text.toLowerCase().trim();
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
