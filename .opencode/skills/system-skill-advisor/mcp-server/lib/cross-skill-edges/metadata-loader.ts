// ───────────────────────────────────────────────────────────────
// MODULE: Cross-Skill Edges Metadata Loader
// ───────────────────────────────────────────────────────────────
// Load all skill graph-metadata.json files from disk and normalize.

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import type { SkillMetadataRecord } from './types.js';

const SKILL_METADATA_FILENAME = 'graph-metadata.json';

// ───────────────────────────────────────────────────────────────
// 1. DISCOVERY
// ───────────────────────────────────────────────────────────────

/**
 * Discover all graph-metadata.json files under a skill directory.
 * Mirrors the pattern from lib/skill-graph/ but independent implementation.
 */
function discoverGraphMetadataFiles(skillDir: string): string[] {
  if (!existsSync(skillDir)) {
    return [];
  }

  const discovered: string[] = [];
  const stack: string[] = [skillDir];

  while (stack.length > 0) {
    // The loop guard guarantees a directory is available to pop.
    const currentDir = stack.pop()!;
    const entries = readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = join(currentDir, entry.name);
      if (entry.isDirectory()) {
        stack.push(entryPath);
        continue;
      }

      if (entry.isFile() && entry.name === SKILL_METADATA_FILENAME) {
        discovered.push(entryPath);
      }
    }
  }

  return discovered.sort((left, right) => left.localeCompare(right));
}

// ───────────────────────────────────────────────────────────────
// 2. PARSING
// ───────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireString(value: unknown, fieldName: string, sourcePath: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${sourcePath}: ${fieldName} must be a non-empty string`);
  }
  return value;
}

function requireStringArray(value: unknown, fieldName: string, sourcePath: string): string[] {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string')) {
    throw new Error(`${sourcePath}: ${fieldName} must be an array of strings`);
  }
  return value;
}

function computeContentHash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

/**
 * Parse a single graph-metadata.json file into a SkillMetadataRecord.
 * Skips files that are not skill metadata (e.g., test fixtures).
 */
function parseSkillMetadata(sourcePath: string): SkillMetadataRecord | null {
  try {
    const content = readFileSync(sourcePath, 'utf8');
    const parsedJson = JSON.parse(content) as unknown;

    if (!isRecord(parsedJson)) {
      return null;  // Not a skill metadata file
    }

    // Check if this looks like skill metadata
    const hasSkillFields = typeof parsedJson.skill_id === 'string' ||
                          typeof parsedJson.family === 'string' ||
                          isRecord(parsedJson.edges);

    if (!hasSkillFields) {
      return null;  // Not a skill metadata file
    }

    const schemaVersion = parsedJson.schema_version;
    if (schemaVersion !== 1 && schemaVersion !== 2) {
      throw new Error(`${sourcePath}: schema_version must be 1 or 2`);
    }

    const skillId = requireString(parsedJson.skill_id, 'skill_id', sourcePath);
    const folderName = basename(dirname(sourcePath));
    if (skillId !== folderName) {
      throw new Error(`${sourcePath}: skill_id "${skillId}" does not match folder name "${folderName}"`);
    }

    const family = requireString(parsedJson.family, 'family', sourcePath);
    const category = requireString(parsedJson.category, 'category', sourcePath);
    const domains = requireStringArray(parsedJson.domains, 'domains', sourcePath);
    const intentSignals = requireStringArray(parsedJson.intent_signals, 'intent_signals', sourcePath);

    const derived = isRecord(parsedJson.derived) ? parsedJson.derived : null;

    // Parse edges if present — validate each element's shape before accepting
    let edges: SkillMetadataRecord['edges'] = undefined;
    if (isRecord(parsedJson.edges)) {
      edges = {};
      const edgeTypes = ['enhances', 'siblings', 'depends_on', 'conflicts_with', 'prerequisite_for'];
      for (const edgeType of edgeTypes) {
        const rawEdgeList = parsedJson.edges[edgeType];
        if (Array.isArray(rawEdgeList)) {
          const validEdges: Array<{ target: string; weight: number; context: string }> = [];
          for (const entry of rawEdgeList) {
            if (!isRecord(entry)) continue;
            const target = entry.target;
            const weight = entry.weight;
            const context = entry.context;
            if (typeof target !== 'string' || target.length === 0) continue;
            if (typeof weight !== 'number' || !Number.isFinite(weight)) continue;
            // context may be null or string per InboundEnhanceCandidate; coerce to string for the loaded shape
            const normalizedContext = typeof context === 'string' ? context : '';
            validEdges.push({ target, weight, context: normalizedContext });
          }
          if (validEdges.length > 0) {
            edges[edgeType as keyof typeof edges] = validEdges;
          }
        }
      }
    }

    // Parse enhance_when if present (optional schema-additive field).
    // Accept object form OR array-of-objects form; reject primitives / non-objects.
    let enhance_when: SkillMetadataRecord['enhance_when'] = undefined;
    if (parsedJson.enhance_when !== undefined && parsedJson.enhance_when !== null) {
      const raw = parsedJson.enhance_when;
      const candidates = Array.isArray(raw) ? raw : [raw];
      const validRules = candidates.filter((entry) => isRecord(entry));
      if (validRules.length === 0) {
        console.warn(`[cross-skill-edges] ${sourcePath}: enhance_when must be an object or array of objects — ignored`);
      } else {
        enhance_when = (Array.isArray(raw) ? validRules : validRules[0]) as SkillMetadataRecord['enhance_when'];
      }
    }

    const contentHash = computeContentHash(content);

    return {
      skillId,
      family,
      category,
      domains,
      intentSignals,
      derived,
      filePath: sourcePath,
      contentHash,
      edges,
      enhance_when,
    };
  } catch (error: unknown) {
    // Log error but don't fail entire load
    console.warn(`[cross-skill-edges] Failed to parse ${sourcePath}:`, error instanceof Error ? error.message : String(error));
    return null;
  }
}

// ───────────────────────────────────────────────────────────────
// 3. PUBLIC API
// ───────────────────────────────────────────────────────────────

export interface LoadSkillMetadataResult {
  records: SkillMetadataRecord[];
  errors: Array<{ skillId: string; error: string }>;
}

/**
 * Load all skill metadata files from the skills root directory.
 * Returns an array of SkillMetadataRecord objects.
 */
export async function loadAllSkillMetadata(skillsRoot: string): Promise<SkillMetadataRecord[]> {
  const { records } = await loadAllSkillMetadataWithErrors(skillsRoot);
  return records;
}

/**
 * Load all skill metadata files and surface per-file parse errors.
 * Used by propagateInboundEnhances to populate PropagateEnhancesResult.errors[].
 */
export async function loadAllSkillMetadataWithErrors(skillsRoot: string): Promise<LoadSkillMetadataResult> {
  const absoluteRoot = resolve(skillsRoot);
  const discoveredFiles = discoverGraphMetadataFiles(absoluteRoot);
  const records: SkillMetadataRecord[] = [];
  const errors: Array<{ skillId: string; error: string }> = [];

  for (const sourcePath of discoveredFiles) {
    const result = parseSkillMetadataWithError(sourcePath);
    if (result.record) {
      records.push(result.record);
    } else if (result.error) {
      errors.push({ skillId: basename(dirname(sourcePath)), error: result.error });
    }
  }

  return { records, errors };
}

/**
 * Parse a single graph-metadata.json file with explicit error surfacing.
 * Returns either a record (success), an error string (parse/validation failure),
 * or both null (file was a non-skill JSON e.g. test fixture — silently skipped).
 */
function parseSkillMetadataWithError(sourcePath: string): { record: SkillMetadataRecord | null; error: string | null } {
  try {
    const content = readFileSync(sourcePath, 'utf8');
    const parsedJson = JSON.parse(content) as unknown;

    if (!isRecord(parsedJson)) {
      return { record: null, error: null };
    }
    const hasSkillFields = typeof parsedJson.skill_id === 'string' ||
                          typeof parsedJson.family === 'string' ||
                          isRecord(parsedJson.edges);
    if (!hasSkillFields) {
      return { record: null, error: null };
    }

    const record = parseSkillMetadata(sourcePath);
    return { record, error: record ? null : 'parse failed (see console.warn for details)' };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return { record: null, error: message };
  }
}

/**
 * Group skill metadata records by family.
 * Returns a Map from family name to array of records.
 */
export function groupByFamily(records: SkillMetadataRecord[]): Map<string, SkillMetadataRecord[]> {
  const byFamily = new Map<string, SkillMetadataRecord[]>();

  for (const record of records) {
    const family = record.family;
    const familyRecords = byFamily.get(family) ?? [];
    familyRecords.push(record);
    byFamily.set(family, familyRecords);
  }

  return byFamily;
}
