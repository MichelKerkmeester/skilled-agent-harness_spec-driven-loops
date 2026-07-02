// ───────────────────────────────────────────────────────────────
// MODULE: Graph Metadata Parser
// ───────────────────────────────────────────────────────────────

import * as crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { ZodError } from 'zod';

import { extractEntities } from '../extraction/entity-extractor.js';
import { extractKeywords } from '../search/folder-discovery.js';
import {
  canClassifyAsGraphMetadataPath,
  extractSpecFolderFromGraphMetadataPath,
  GRAPH_METADATA_FILENAME,
  isSpecLeafSegment,
  resolveSpecFolderIdentity,
  SpecFolderIdentityError,
} from '../config/spec-doc-paths.js';
import {
  isGeneratedMetadataDriftGateEnabled,
  isGeneratorHardeningEnabled,
  isIdentityMergeSafetyEnabled,
} from '../config/capability-flags.js';
import { listPhaseChildren } from '../spec/is-phase-parent.js';
import { derivePacketSynopsis } from '../description/packet-synopsis.js';
import { computeSourceDocHashes } from './generated-metadata-drift.js';
import {
  createEmptyGraphMetadataManual,
  type GraphEntityReference,
  GRAPH_METADATA_ENTITY_LIMIT,
  GRAPH_METADATA_KEY_FILE_LIMIT,
  GRAPH_METADATA_KEY_TOPIC_LIMIT,
  GRAPH_METADATA_SCHEMA_VERSION,
  GRAPH_METADATA_STATUS_VALUES,
  GRAPH_METADATA_TRIGGER_PHRASE_LIMIT,
  graphMetadataLoadSchema,
  graphMetadataSchema,
  type GraphMetadata,
  type GraphMetadataDerived,
  type GraphMetadataMigrationSource,
  type GraphMetadataManual,
  type GraphMetadataStatus,
  type PacketReference,
  type SaveLineage,
} from './graph-metadata-schema.js';

const GRAPH_METADATA_STATUS_SET: ReadonlySet<string> = new Set(GRAPH_METADATA_STATUS_VALUES);

const CANONICAL_PACKET_DOCS = [
  'spec.md',
  'plan.md',
  'tasks.md',
  'checklist.md',
  'decision-record.md',
  'implementation-summary.md',
  path.join('research', 'research.md'),
  'research.md',
  'handover.md',
  'resource-map.md',
] as const;

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
const FILE_REFERENCE_RE = /`([^`\n]+\.[A-Za-z0-9._-]+)`/g;
const CANONICAL_PACKET_DOC_RE =
  /^(spec\.md|plan\.md|tasks\.md|checklist\.md|decision-record\.md|implementation-summary\.md|research\.md|research\/research\.md|handover\.md|resource-map\.md)$/;
const KEY_FILE_NOISE_RE =
  /^(node |npx |pnpm |npm |yarn |bun |python([0-9]+(\.[0-9]+)*)? |bash |sh |vitest |jest |mocha |tsx |ts-node |TMPDIR)|^v[0-9]+\.[0-9]+(\.[0-9]+)?$|^[a-z]+\/[a-z0-9+-]+$|^_memory\.continuity$|^[A-Za-z][A-Za-z0-9_-]*:\s.+$|^console\.warn(\(|$)/;
const BARE_FILE_RE = /^[^/]+\.[A-Za-z0-9._-]+$/;
const TITLE_LIKE_KEY_FILE_RE = /^([A-Z][a-z]+)( [A-Z][A-Za-z0-9._-]*)+$/;
const KEY_FILE_COMMAND_START_RE = /^(cd|echo|cat|grep|find|rm|mkdir)\s+/;
const CROSS_TRACK_SPEC_FOLDERS = ['system-spec-kit', 'skilled-agent-orchestration'] as const;
const BARE_RUNTIME_ENTITY_NAMES = new Set([
  'python',
  'node',
  'bash',
  'sh',
  'npm',
  'npx',
  'vitest',
  'jest',
  'tsc',
]);
let tempCounter = 0;

interface ParsedSpecDoc {
  relativePath: string;
  content: string;
  title: string | null;
  description: string | null;
  triggerPhrases: string[];
  importanceTier: string | null;
  status: string | null;
}

type GraphMetadataValidationError = string;

type GraphMetadataValidationSuccess =
  | { ok: true; metadata: GraphMetadata; migrated: false; errors: [] }
  | {
    ok: true;
    metadata: GraphMetadata;
    migrated: true;
    migrationSource: GraphMetadataMigrationSource;
    preservedErrors: GraphMetadataValidationError[];
    errors: [];
  };

type GraphMetadataValidationFailure = {
  ok: false;
  errors: GraphMetadataValidationError[];
};

export type GraphMetadataValidationResult =
  | GraphMetadataValidationSuccess
  | GraphMetadataValidationFailure;

export interface GraphMetadataRefreshOptions {
  now?: Date | string;
  statusOverride?: string | null;
  saveLineage?: SaveLineage;
}

export interface GraphMetadataRefreshResult {
  filePath: string;
  metadata: GraphMetadata;
  created: boolean;
}

type GraphMetadataDocReadResult =
  | { status: 'found'; content: string }
  | { status: 'missing' }
  | { status: 'unknown'; error: string };

interface CollectedPacketDocs {
  docs: ParsedSpecDoc[];
  availability: Map<string, GraphMetadataDocReadResult['status']>;
}

interface LegacyGraphMetadataParseResult {
  metadata: GraphMetadata;
  fabricatedFields: string[];
}

function toIsoString(value?: Date | string | null): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'string' && ISO_DATE_RE.test(value)) {
    return value;
  }
  return new Date().toISOString();
}

function parseJsonObject(content: string): unknown {
  return JSON.parse(content) as unknown;
}

function parseDelimitedValues(raw: string | null | undefined): string[] {
  if (!raw || typeof raw !== 'string') {
    return [];
  }

  return raw
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .split(',')
    .map((value) => value.trim().replace(/^['"]+|['"]+$/g, '').replace(/,$/, '').trim())
    .filter(Boolean);
}

function normalizeDerivedStatus(status: string | null | undefined): GraphMetadataStatus | null {
  if (typeof status !== 'string') {
    return null;
  }

  const trimmed = status.trim();
  if (!trimmed) {
    return null;
  }

  const normalized = trimmed.toLowerCase().replace(/[\s-]+/g, '_');
  switch (normalized) {
    case 'complete':
    case 'done':
    case 'completed':
      return 'complete';
    case 'active':
    case 'in_progress':
      return 'in_progress';
    case 'planned':
      return 'planned';
    default:
      // Closed enum boundary: a synonym above maps in, a value already in the closed
      // set passes through, and anything else (prose, em-dash narrative) returns null
      // rather than leaking the raw normalized string forward as a status.
      return GRAPH_METADATA_STATUS_SET.has(normalized) ? (normalized as GraphMetadataStatus) : null;
  }
}

function normalizeLegacyKey(raw: string): string {
  return raw
    .replace(/^['"]+|['"]+$/g, '')
    .replace(/[{},]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ');
}

function readLegacyValue(values: Map<string, string>, aliases: string[]): string | null {
  for (const alias of aliases) {
    const value = values.get(alias);
    if (value && value.length > 0) {
      return value;
    }
  }
  return null;
}

function readLegacyTimestamp(
  values: Map<string, string>,
  aliases: string[],
  fallback: string,
): { value: string; fabricated: boolean } {
  const rawValue = readLegacyValue(values, aliases);
  if (rawValue && ISO_DATE_RE.test(rawValue)) {
    return { value: rawValue, fabricated: false };
  }
  return { value: fallback, fabricated: true };
}

function applyMigrationMarker(
  metadata: GraphMetadata,
  migrationSource: GraphMetadataMigrationSource,
): GraphMetadata {
  return graphMetadataSchema.parse({
    ...metadata,
    migrated: true,
    migration_source: migrationSource,
  });
}

function parseLegacyGraphMetadataContent(content: string): LegacyGraphMetadataParseResult | null {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const values = new Map<string, string>();
  for (const line of lines) {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex <= 0) {
      continue;
    }
    const key = normalizeLegacyKey(line.slice(0, separatorIndex));
    const value = line
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^[\[{]+/, '')
      .replace(/[\]}]+$/, '')
      .replace(/,$/, '')
      .replace(/^['"]+|['"]+$/g, '')
      .trim();
    if (!key || !value) {
      continue;
    }
    values.set(key, value);
  }

  const packetId = readLegacyValue(values, ['packet', 'packet id']);
  const specFolder = readLegacyValue(values, ['spec folder']);
  if (!packetId || !specFolder) {
    return null;
  }

  const nowIso = new Date().toISOString();
  const createdAt = readLegacyTimestamp(values, ['created at'], nowIso);
  const lastSaveAt = readLegacyTimestamp(values, ['last save at'], nowIso);
  const lastAccessedAt = readLegacyValue(values, ['last accessed at']);
  const summary = readLegacyValue(values, ['summary', 'causal summary']) ?? '';
  const keyTopics = parseDelimitedValues(readLegacyValue(values, ['key topics'])).slice(0, GRAPH_METADATA_KEY_TOPIC_LIMIT);
  const triggerPhrasesFromLegacy = parseDelimitedValues(readLegacyValue(values, ['trigger phrases']));
  const triggerPhrases = Array.from(new Set([
    ...triggerPhrasesFromLegacy,
    ...keyTopics,
    ...extractKeywords(`${packetId} ${specFolder} ${summary}`).slice(0, 8),
  ])).slice(0, GRAPH_METADATA_TRIGGER_PHRASE_LIMIT);
  const sourceDocs = parseDelimitedValues(readLegacyValue(values, ['source docs']));
  const toPacketReferences = (raw: string | undefined): PacketReference[] => {
    return parseDelimitedValues(raw).map((packet) => ({
      packet_id: packet,
      reason: 'Imported from legacy graph-metadata.json',
      source: 'legacy',
    }));
  };

  return {
    metadata: graphMetadataSchema.parse({
      schema_version: GRAPH_METADATA_SCHEMA_VERSION,
      packet_id: packetId,
      spec_folder: specFolder,
      parent_id: readLegacyValue(values, ['parent', 'parent id']) ?? null,
      children_ids: parseDelimitedValues(readLegacyValue(values, ['children', 'children ids'])),
      manual: {
        depends_on: toPacketReferences(readLegacyValue(values, ['depends on']) ?? undefined),
        supersedes: toPacketReferences(readLegacyValue(values, ['supersedes']) ?? undefined),
        related_to: toPacketReferences(readLegacyValue(values, ['related to']) ?? undefined),
      },
      derived: {
        trigger_phrases: triggerPhrases.length > 0 ? triggerPhrases : [packetId, specFolder],
        key_topics: keyTopics,
        importance_tier: readLegacyValue(values, ['importance tier']) ?? 'normal',
        status: normalizeDerivedStatus(readLegacyValue(values, ['status'])) ?? 'planned',
        key_files: parseDelimitedValues(readLegacyValue(values, ['key files'])).slice(0, GRAPH_METADATA_KEY_FILE_LIMIT),
        entities: [],
        causal_summary: summary,
        created_at: createdAt.value,
        last_save_at: lastSaveAt.value,
        last_accessed_at: lastAccessedAt && ISO_DATE_RE.test(lastAccessedAt) ? lastAccessedAt : null,
        source_docs: sourceDocs,
      },
    }),
    fabricatedFields: [
      ...(createdAt.fabricated ? ['created_at'] : []),
      ...(lastSaveAt.fabricated ? ['last_save_at'] : []),
    ],
  };
}

function formatZodError(error: ZodError): string[] {
  return error.issues.map((issue) => {
    const location = issue.path.length > 0 ? issue.path.join('.') : 'root';
    return `${location}: ${issue.message}`;
  });
}

function formatValidationErrors(error: unknown): string[] {
  if (error instanceof ZodError) {
    return formatZodError(error);
  }
  return [error instanceof Error ? error.message : String(error)];
}

function prefixValidationErrors(prefix: string, errors: string[]): string[] {
  return errors.map((error) => `${prefix}: ${error}`);
}

/**
 * Validate raw graph metadata content against the current schema.
 *
 * @param content - Raw JSON or legacy metadata file contents
 * @returns Validation outcome with parsed metadata when successful
 */
export function validateGraphMetadataContent(content: string): GraphMetadataValidationResult {
  try {
    const parsed = parseJsonObject(content);
    const metadata = graphMetadataSchema.parse(parsed);
    if (metadata.migrated === true) {
      return {
        ok: true,
        metadata,
        migrated: true,
        migrationSource: metadata.migration_source ?? 'legacy',
        preservedErrors: [],
        errors: [],
      };
    }
    return { ok: true, metadata, migrated: false, errors: [] };
  } catch (error: unknown) {
    const originalErrors = formatValidationErrors(error);

    // A structurally-valid JSON document that fails only the strict contract (most
    // often a legacy non-enum status) must still load so a later re-derive can drop
    // the bad value. Salvage it through the tolerant load schema before treating the
    // content as a genuinely legacy key:value text file.
    let jsonParsed: unknown;
    let jsonOk = false;
    try {
      jsonParsed = parseJsonObject(content);
      jsonOk = true;
    } catch {
      jsonOk = false;
    }
    if (jsonOk && jsonParsed && typeof jsonParsed === 'object' && !Array.isArray(jsonParsed)) {
      const lenient = graphMetadataLoadSchema.safeParse(jsonParsed);
      if (lenient.success) {
        // The tolerant schema keeps the raw status string; the strict GraphMetadata type
        // models it as the closed enum. The cast is the documented load-time tolerance,
        // narrowed back to the enum the next time the folder is re-derived.
        return {
          ok: true,
          metadata: lenient.data as unknown as GraphMetadata,
          migrated: false,
          errors: [],
        };
      }
    }

    const legacyMetadata = parseLegacyGraphMetadataContent(content);
    if (legacyMetadata) {
      try {
        const migrationSource: GraphMetadataMigrationSource = 'legacy';
        const metadata = applyMigrationMarker(legacyMetadata.metadata, migrationSource);
        return {
          ok: true,
          metadata,
          migrated: true,
          migrationSource,
          preservedErrors: originalErrors,
          errors: [],
        };
      } catch (legacyError: unknown) {
        return {
          ok: false,
          errors: [
            ...prefixValidationErrors('current schema', originalErrors),
            ...prefixValidationErrors('legacy fallback', formatValidationErrors(legacyError)),
          ],
        };
      }
    }

    return {
      ok: false,
      errors: [
        ...prefixValidationErrors('current schema', originalErrors),
        'legacy fallback: content could not be parsed as legacy graph metadata',
      ],
    };
  }
}

/**
 * Load and validate a graph-metadata file from disk.
 *
 * @param filePath - Absolute path to the graph-metadata file
 * @returns Parsed metadata, or `null` when the file does not exist
 * @throws Error when the file exists but fails schema validation
 */
export function loadGraphMetadata(filePath: string): GraphMetadata | null {
  const resolvedPath = path.resolve(filePath);
  if (!fs.existsSync(resolvedPath)) {
    return null;
  }

  const content = fs.readFileSync(resolvedPath, 'utf-8');
  const validation = validateGraphMetadataContent(content);
  if (!validation.ok) {
    const detail = validation.errors.join('; ') || 'unknown validation error';
    throw new Error(`Invalid graph metadata at ${resolvedPath}: ${detail}`);
  }

  return validation.metadata;
}

function readDoc(filePath: string): GraphMetadataDocReadResult {
  try {
    return { status: 'found', content: fs.readFileSync(filePath, 'utf-8') };
  } catch (error: unknown) {
    const errorCode = typeof error === 'object' && error && 'code' in error
      ? String((error as NodeJS.ErrnoException).code)
      : null;
    if (errorCode === 'ENOENT') {
      return { status: 'missing' };
    }
    return {
      status: 'unknown',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function extractFrontmatter(content: string): string | null {
  const match = content.match(
    /^(?:\uFEFF)?(?:\s*<!--[\s\S]*?-->\s*)*---\s*\r?\n([\s\S]*?)\r?\n---(?:\s*\r?\n|$)/,
  );
  return match?.[1] ?? null;
}

function extractFrontmatterScalar(content: string, key: string): string | null {
  const frontmatter = extractFrontmatter(content);
  if (!frontmatter) {
    return null;
  }

  const match = frontmatter.match(new RegExp(`^\\s*${key}:\\s*(.+?)\\s*$`, 'mi'));
  if (!match) {
    return null;
  }

  const raw = match[1].trim();
  return raw.replace(/^['"]|['"]$/g, '').trim() || null;
}

// Many specs declare their status only in the markdown metadata table row
// (`| **Status** | Draft |`) and carry no YAML `status:` key. Reading that row
// lets a Draft/Placeholder spec report a non-complete status instead of being
// mislabelled 'complete' purely because an implementation-summary.md exists.
function extractMetadataTableStatus(content: string): string | null {
  const match = content.match(/^\|\s*\**\s*Status\s*\**\s*\|\s*([^|]+?)\s*\|/im);
  if (!match) {
    return null;
  }
  return match[1].trim() || null;
}

function extractFrontmatterArray(content: string, key: string): string[] {
  const frontmatter = extractFrontmatter(content);
  if (!frontmatter) {
    return [];
  }

  const inlineMatch = frontmatter.match(new RegExp(`(?:${key}):\\s*\\[([^\\]]+)\\]`, 'i'));
  if (inlineMatch) {
    const quotedValues = inlineMatch[1].match(/["']([^"']+)["']/g);
    if (!quotedValues) {
      return [];
    }
    return quotedValues
      .map((value) => value.replace(/^['"]|['"]$/g, '').trim())
      .filter((value) => value.length > 0);
  }

  const lines = frontmatter.split('\n');
  const values: string[] = [];
  let inBlock = false;
  for (const line of lines) {
    if (!inBlock && new RegExp(`^\\s*${key}:\\s*$`, 'i').test(line)) {
      inBlock = true;
      continue;
    }
    if (!inBlock) {
      continue;
    }
    const itemMatch = line.match(/^\s*-\s*["']?([^"'\n#]+?)["']?\s*(?:#.*)?$/);
    if (itemMatch) {
      values.push(itemMatch[1].trim());
      continue;
    }
    if (!/^\s*$/.test(line) && !/^\s*#/.test(line)) {
      break;
    }
  }
  return values.filter((value) => value.length > 0);
}

function extractTitle(content: string): string | null {
  const frontmatterTitle = extractFrontmatterScalar(content, 'title');
  if (frontmatterTitle) {
    return frontmatterTitle;
  }

  const headingMatch = content.match(/^#\s+(.+)$/m);
  return headingMatch?.[1]?.trim() || null;
}

function extractSummary(content: string): string | null {
  const overviewMatch = content.match(/###\s+Overview\s*\n([\s\S]*?)(?:\n###|\n##|\n<!--|$)/i);
  if (overviewMatch?.[1]) {
    const normalized = overviewMatch[1]
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join(' ');
    if (normalized.length > 0) {
      return normalized;
    }
  }

  const paragraphMatch = content.match(/\n([A-Z][^\n]{30,})\n/);
  return paragraphMatch?.[1]?.trim() || null;
}

function extractReferencedFilePaths(content: string): string[] {
  const referenced = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = FILE_REFERENCE_RE.exec(content)) !== null) {
    const candidate = match[1].trim();
    if (
      candidate.length > 0 &&
      !candidate.startsWith('http') &&
      !candidate.startsWith('./research/') &&
      !candidate.startsWith('../') &&
      !candidate.includes('*') &&
      !candidate.includes('...')
    ) {
      referenced.add(candidate);
    }
  }
  return Array.from(referenced);
}

function isAbsolutePathCandidate(candidate: string): boolean {
  const trimmed = candidate.trim();
  if (!trimmed) {
    return false;
  }

  const normalized = trimmed.replace(/\\/g, '/');
  return path.isAbsolute(trimmed)
    || path.posix.isAbsolute(normalized)
    || path.win32.isAbsolute(trimmed)
    || path.win32.isAbsolute(normalized);
}

function hasParentDirectorySegment(candidate: string): boolean {
  return candidate
    .replace(/\\/g, '/')
    .split('/')
    .some((segment) => segment === '..');
}

function keepKeyFile(candidate: string): boolean {
  const normalized = candidate.trim().replace(/\\/g, '/');
  if (!normalized) {
    return false;
  }
  if (isAbsolutePathCandidate(candidate)) {
    return false;
  }
  const normalizedLower = normalized.toLowerCase();
  if (normalized.startsWith('`') && normalized.endsWith('`')) {
    return false;
  }
  if (hasParentDirectorySegment(normalized)) {
    return false;
  }
  if (KEY_FILE_COMMAND_START_RE.test(normalized)) {
    return false;
  }
  if (KEY_FILE_NOISE_RE.test(normalized)) {
    return false;
  }
  if (
    normalizedLower === 'memory/metadata.json'
    || normalizedLower.endsWith('/memory/metadata.json')
  ) {
    return false;
  }
  if (normalized.includes(' | ') || normalized.includes('&&') || normalized.includes('||') || normalized.includes('>>')) {
    return false;
  }
  if ((normalized.match(/(?:^|\s)(?:--|-)[A-Za-z0-9]/g) ?? []).length >= 3) {
    return false;
  }
  if (TITLE_LIKE_KEY_FILE_RE.test(normalized)) {
    return false;
  }
  if (normalized.includes('/')) {
    const lastSegment = normalized.split('/').pop() ?? '';
    if (!lastSegment.includes('.')) {
      return false;
    }
  }
  if (BARE_FILE_RE.test(normalized) && !CANONICAL_PACKET_DOC_RE.test(normalized)) {
    return false;
  }
  return true;
}

function collectPacketDocs(specFolderPath: string): CollectedPacketDocs {
  const docs: ParsedSpecDoc[] = [];
  const availability = new Map<string, GraphMetadataDocReadResult['status']>();
  for (const relativePath of CANONICAL_PACKET_DOCS) {
    const filePath = path.join(specFolderPath, relativePath);
    const readResult = readDoc(filePath);
    availability.set(relativePath.replace(/\\/g, '/'), readResult.status);
    if (readResult.status !== 'found') {
      continue;
    }

    const frontmatterStatus = normalizeDerivedStatus(
      extractFrontmatterScalar(readResult.content, 'status'),
    );
    // spec.md commonly carries status only in its metadata table; consult that
    // table when the YAML frontmatter has no explicit status so a Draft spec is
    // not derived as 'complete' from implementation-summary presence alone.
    const tableStatus =
      relativePath === 'spec.md'
        ? normalizeDerivedStatus(extractMetadataTableStatus(readResult.content))
        : null;

    docs.push({
      relativePath: relativePath.replace(/\\/g, '/'),
      content: readResult.content,
      title: extractTitle(readResult.content),
      description: extractFrontmatterScalar(readResult.content, 'description'),
      triggerPhrases: extractFrontmatterArray(readResult.content, 'trigger_phrases'),
      importanceTier: extractFrontmatterScalar(readResult.content, 'importance_tier'),
      status: frontmatterStatus ?? tableStatus,
    });
  }

  return { docs, availability };
}

// Replace every ISO-8601 datetime substring with one stable token before hashing, so the
// volatile continuity timestamps the source docs carry (last_updated_at, last_save_at and
// the like) never move the fingerprint. This mirrors the volatile-ignoring projection the
// idempotency compare already uses: a no-op re-derive on unchanged docs stays identical
// while a real body edit changes the digest.
const VOLATILE_ISO_DATETIME_RE = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})/g;

function projectDocForFingerprint(relativePath: string, content: string): [string, string] {
  return [relativePath.replace(/\\/g, '/'), content.replace(VOLATILE_ISO_DATETIME_RE, 'ISO_TS')];
}

/**
 * Hash a set of source docs into a single drift-detection fingerprint.
 *
 * Sorts the projected (path, normalized-content) pairs so order is irrelevant and only the
 * doc set plus their non-volatile content decide the digest. Both the generator write and
 * the strict read go through this one function, so a fingerprint produced at write time and
 * one re-derived at validation time are comparable byte-for-byte.
 *
 * @param docs - The source docs to fingerprint, by packet-relative path and raw content
 * @returns A `sha256:`-prefixed hex digest of the volatile-ignoring projection
 */
export function computeSourceFingerprintFromDocs(
  docs: Array<{ relativePath: string; content: string }>,
): string {
  const projected = docs
    .map((doc) => projectDocForFingerprint(doc.relativePath, doc.content))
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  const hash = crypto.createHash('sha256').update(JSON.stringify(projected)).digest('hex');
  return `sha256:${hash}`;
}

/**
 * Re-derive the source fingerprint for a spec folder by reading its canonical docs.
 *
 * Used by the strict read path that has only a folder path. It reads the same canonical doc
 * set the generator reads, so the re-derived fingerprint matches the stored one when the
 * docs are unchanged and diverges when a source doc changed without a re-derive.
 *
 * @param specFolderPath - Absolute path to the packet/spec folder
 * @returns The `sha256:`-prefixed fingerprint over the current source docs
 */
export function computeSourceFingerprintForFolder(specFolderPath: string): string {
  const docs = collectPacketDocs(specFolderPath).docs.map((doc) => ({
    relativePath: doc.relativePath,
    content: doc.content,
  }));
  return computeSourceFingerprintFromDocs(docs);
}

function resolveSpecFolderPath(specFolderPath: string): string {
  const normalized = specFolderPath.replace(/\\/g, '/');
  const explicit = extractSpecFolderFromGraphMetadataPath(path.join(normalized, GRAPH_METADATA_FILENAME));
  if (explicit) {
    return explicit;
  }

  const segments = normalized.split('/').filter(Boolean);
  const specsIndex = segments.findIndex((segment) => segment === 'specs');
  if (specsIndex >= 0 && specsIndex < segments.length - 1) {
    return segments.slice(specsIndex + 1).join('/');
  }

  return path.basename(specFolderPath);
}

function resolveParentId(specFolder: string): string | null {
  const segments = specFolder.split('/').filter(Boolean);
  if (segments.length < 2) {
    return null;
  }
  const parentLeaf = segments[segments.length - 2] ?? '';
  if (!isSpecLeafSegment(parentLeaf)) {
    return null;
  }
  return segments.slice(0, -1).join('/');
}

export function resolveChildrenIds(specFolderPath: string, specFolder: string): string[] {
  // With the hardening flag on, the derived children resolve through the one shared
  // listPhaseChildren enumeration that isPhaseParent also consumes, so the parent
  // classification and the children list can no longer disagree on what a child is.
  // With the flag off this is byte-identical to the previous direct readdir filter.
  if (isGeneratorHardeningEnabled()) {
    return listPhaseChildren(specFolderPath)
      .map((child) => `${specFolder}/${child.name}`)
      .sort();
  }
  try {
    return fs.readdirSync(specFolderPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && isSpecLeafSegment(entry.name))
      .map((entry) => `${specFolder}/${entry.name}`)
      .sort();
  } catch {
    return [];
  }
}

interface BuildIdentity {
  specFolder: string;
  parentId: string | null;
  childrenIds: string[];
}

/**
 * Resolve the build-time identity for a spec folder, honoring the safety flag.
 *
 * With the flag on, identity comes from the one shared resolver so the graph
 * spec_folder matches the description specFolder; an outside-root path falls back to
 * the legacy computation so a non-specs path still derives rather than throwing. With
 * the flag off this is byte-identical to the previous split computation.
 */
function resolveBuildIdentity(specFolderPath: string): BuildIdentity {
  if (isIdentityMergeSafetyEnabled()) {
    try {
      return resolveSpecFolderIdentity(specFolderPath);
    } catch (error) {
      if (!(error instanceof SpecFolderIdentityError)) {
        throw error;
      }
    }
  }

  const specFolder = resolveSpecFolderPath(specFolderPath);
  return {
    specFolder,
    parentId: resolveParentId(specFolder),
    childrenIds: resolveChildrenIds(specFolderPath, specFolder),
  };
}

function selectFirstValue(values: Array<string | null | undefined>, fallback: string): string {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }
  return fallback;
}

function findSpecsRoot(specFolderPath: string): string | null {
  let current = path.resolve(specFolderPath);
  while (true) {
    if (path.basename(current) === 'specs' && path.basename(path.dirname(current)) === '.opencode') {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }
}

function isExistingFile(filePath: string): boolean {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function swapCrossTrackPath(candidate: string, currentTrack: string | null): string | null {
  if (!currentTrack || !CROSS_TRACK_SPEC_FOLDERS.includes(currentTrack as typeof CROSS_TRACK_SPEC_FOLDERS[number])) {
    return null;
  }

  const otherTrack = CROSS_TRACK_SPEC_FOLDERS.find((track) => track !== currentTrack);
  if (!otherTrack) {
    return null;
  }

  const normalized = candidate.replace(/\\/g, '/').replace(/^\.\//, '');
  const replacements: Array<[string, string]> = [
    [`${currentTrack}/`, `${otherTrack}/`],
    [`specs/${currentTrack}/`, `specs/${otherTrack}/`],
    [`.opencode/specs/${currentTrack}/`, `.opencode/specs/${otherTrack}/`],
  ];

  for (const [fromPrefix, toPrefix] of replacements) {
    if (normalized.startsWith(fromPrefix)) {
      return `${toPrefix}${normalized.slice(fromPrefix.length)}`;
    }
  }

  return null;
}

function buildKeyFileLookupPaths(
  candidate: string,
  specFolderPath: string,
  specsRoot: string | null,
  repoRoot: string | null,
): string[] {
  if (isAbsolutePathCandidate(candidate)) {
    return [];
  }

  const normalized = candidate.replace(/\\/g, '/').replace(/^\.\//, '');
  if (hasParentDirectorySegment(normalized)) {
    return [];
  }
  const lookups = new Set<string>();

  lookups.add(path.resolve(specFolderPath, normalized));
  if (repoRoot) {
    lookups.add(path.resolve(repoRoot, normalized));
    if (normalized.startsWith('.opencode/')) {
      lookups.add(path.resolve(repoRoot, normalized));
    }
    if (normalized.startsWith('specs/')) {
      lookups.add(path.resolve(repoRoot, '.opencode', normalized));
    }

    const systemSpecKitRoot = path.join(repoRoot, '.opencode', 'skills', 'system-spec-kit');
    const workspaceRoots = [
      systemSpecKitRoot,
      path.join(systemSpecKitRoot, 'mcp_server'),
      path.join(systemSpecKitRoot, 'scripts'),
    ];
    for (const root of workspaceRoots) {
      lookups.add(path.resolve(root, normalized));
    }
  }
  if (
    specsRoot
    && CROSS_TRACK_SPEC_FOLDERS.some((track) => normalized === track || normalized.startsWith(`${track}/`))
  ) {
    lookups.add(path.resolve(specsRoot, normalized));
  }

  return Array.from(lookups);
}

function resolveKeyFileCandidate(
  specFolderPath: string,
  specFolder: string,
  candidate: string,
): string | null {
  const normalized = candidate.trim().replace(/\\/g, '/').replace(/^\.\//, '');
  if (!normalized) {
    return null;
  }
  if (isAbsolutePathCandidate(candidate)) {
    return null;
  }
  if (hasParentDirectorySegment(normalized)) {
    return null;
  }

  const specsRoot = findSpecsRoot(specFolderPath);
  const repoRoot = specsRoot ? path.dirname(path.dirname(specsRoot)) : null;
  const currentTrack = specFolder.split('/').filter(Boolean)[0] ?? null;
  const candidates = [normalized];
  const swapped = swapCrossTrackPath(normalized, currentTrack);
  if (swapped && swapped !== normalized) {
    candidates.push(swapped);
  }

  for (const displayPath of candidates) {
    const lookupPaths = buildKeyFileLookupPaths(displayPath, specFolderPath, specsRoot, repoRoot);
    if (lookupPaths.some(isExistingFile)) {
      return displayPath;
    }
  }

  return null;
}

function classifyEntityKind(filePath: string): string {
  const normalized = filePath.toLowerCase();
  if (normalized.endsWith('.sh')) return 'script';
  if (normalized.endsWith('.md')) return 'doc';
  if (normalized.endsWith('.json') || normalized.endsWith('.yaml') || normalized.endsWith('.yml')) return 'config';
  if (normalized.endsWith('.test.ts') || normalized.endsWith('.vitest.ts')) return 'test';
  if (normalized.endsWith('.ts') || normalized.endsWith('.js') || normalized.endsWith('.tsx') || normalized.endsWith('.jsx')) return 'code';
  return 'file';
}

function stripSpecsRootPrefix(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/').replace(/^\.\//, '');
  for (const marker of ['/.opencode/specs/', '/specs/', '.opencode/specs/', 'specs/']) {
    const markerIndex = normalized.indexOf(marker);
    if (markerIndex >= 0) {
      return normalized.slice(markerIndex + marker.length);
    }
  }
  return normalized;
}

function shouldKeepEntityName(name: string): boolean {
  const normalized = name.trim().toLowerCase();
  return normalized.length > 0
    && normalized.length <= 80
    && !BARE_RUNTIME_ENTITY_NAMES.has(normalized);
}

function deriveEntities(
  specFolder: string,
  docs: ParsedSpecDoc[],
  keyFiles: string[],
): GraphEntityReference[] {
  const entities = new Map<string, GraphEntityReference>();
  const canonicalDocSuffixes = new Set(
    CANONICAL_PACKET_DOCS.map((docPath) => docPath.replace(/\\/g, '/')),
  );
  const specFolderPrefix = `${specFolder.replace(/\\/g, '/')}/`;

  const isCanonicalEntityPath = (filePath: string): boolean => {
    const normalized = stripSpecsRootPrefix(filePath);
    if (canonicalDocSuffixes.has(normalized)) {
      return true;
    }

    if (!normalized.startsWith(specFolderPrefix)) {
      return false;
    }

    const localDocPath = normalized.slice(specFolderPrefix.length);
    return canonicalDocSuffixes.has(localDocPath);
  };

  const isExternalCanonicalDocPath = (filePath: string): boolean => {
    const normalized = stripSpecsRootPrefix(filePath);
    const matchesCanonicalDoc = canonicalDocSuffixes.has(normalized)
      || Array.from(canonicalDocSuffixes).some((docPath) => normalized.endsWith(`/${docPath}`));
    return matchesCanonicalDoc && !isCanonicalEntityPath(filePath);
  };

  const prefersCandidate = (
    existing: GraphEntityReference,
    candidate: GraphEntityReference,
  ): boolean => {
    const existingPath = existing.path.replace(/\\/g, '/');
    const candidatePath = candidate.path.replace(/\\/g, '/');
    const existingCanonical = isCanonicalEntityPath(existingPath);
    const candidateCanonical = isCanonicalEntityPath(candidatePath);
    if (candidateCanonical && !existingCanonical) {
      return true;
    }
    if (!candidateCanonical) {
      return false;
    }

    const existingPathLike = existingPath.includes('/');
    const candidatePathLike = candidatePath.includes('/');
    return candidatePathLike && !existingPathLike;
  };

  const upsertEntityByName = (candidate: GraphEntityReference): void => {
    const nameKey = candidate.name.trim().toLowerCase();
    if (!shouldKeepEntityName(candidate.name)) {
      return;
    }

    const existing = entities.get(nameKey);
    if (!existing || prefersCandidate(existing, candidate)) {
      entities.set(nameKey, candidate);
    }
  };

  for (const filePath of keyFiles) {
    if (isExternalCanonicalDocPath(filePath)) {
      continue;
    }
    upsertEntityByName({
      name: path.basename(filePath),
      kind: classifyEntityKind(filePath),
      path: filePath,
      source: 'derived',
    });
  }

  for (const doc of docs) {
    const extracted = extractEntities(doc.content).slice(0, 6);
    for (const entity of extracted) {
      const normalizedName = entity.text.replace(/[\r\n]+/g, ' ').trim();
      if (!normalizedName || normalizedName.length > 80) {
        continue;
      }
      upsertEntityByName({
        name: normalizedName,
        kind: entity.type,
        path: doc.relativePath,
        source: 'derived',
      });
    }
  }

  return Array.from(entities.values()).slice(0, GRAPH_METADATA_ENTITY_LIMIT);
}

function normalizeUnique(values: string[]): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];
  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) {
      continue;
    }
    seen.add(trimmed);
    normalized.push(trimmed);
  }
  return normalized;
}

function deriveKeyFiles(specFolderPath: string, specFolder: string, docs: ParsedSpecDoc[]): string[] {
  const specDoc = docs.find((doc) => doc.relativePath === 'spec.md');
  const frontmatterKeyFiles = specDoc
    ? extractFrontmatterArray(specDoc.content, 'key_files').filter(keepKeyFile)
    : [];

  const preferredDoc = docs.find((doc) => doc.relativePath === 'implementation-summary.md');
  const referenced = preferredDoc
    ? extractReferencedFilePaths(preferredDoc.content).filter(keepKeyFile)
    : [];

  const fallbackRefs = docs
    .flatMap((doc) => extractReferencedFilePaths(doc.content))
    .filter(keepKeyFile);
  const merged = normalizeUnique([...frontmatterKeyFiles, ...referenced, ...fallbackRefs, ...docs.map((doc) => doc.relativePath)]);
  const resolved = merged
    .map((candidate) => resolveKeyFileCandidate(specFolderPath, specFolder, candidate))
    .filter((candidate): candidate is string => Boolean(candidate));
  return normalizeUnique(resolved).slice(0, GRAPH_METADATA_KEY_FILE_LIMIT);
}

function deriveKeyTopics(docs: ParsedSpecDoc[], triggerPhrases: string[], causalSummary: string): string[] {
  const source = [
    ...triggerPhrases,
    causalSummary,
    ...docs.flatMap((doc) => [doc.title, doc.description].filter((value): value is string => Boolean(value))),
  ].join(' ');
  return extractKeywords(source).slice(0, GRAPH_METADATA_KEY_TOPIC_LIMIT);
}

function deriveCausalSummary(docs: ParsedSpecDoc[]): string {
  const specDoc = docs.find((doc) => doc.relativePath === 'spec.md');

  // With the drift-gate flag on, the causal_summary derives from the one shared synopsis
  // extractor so it shares precedence and source with the description field and the two stop
  // diverging. With the flag off this keeps the legacy local extractor, byte-identical.
  if (isGeneratedMetadataDriftGateEnabled() && specDoc) {
    const synopsis = derivePacketSynopsis(specDoc.content, 'causal_summary');
    if (synopsis) {
      return synopsis;
    }
  } else if (specDoc) {
    const summary = extractSummary(specDoc.content);
    if (summary) {
      return summary;
    }
  }

  return selectFirstValue(
    docs.flatMap((doc) => [doc.description, doc.title]),
    'Packet metadata derived from canonical spec documents.',
  );
}

interface DerivedStatusResult {
  status: GraphMetadataStatus;
  reviewRequired: boolean;
}

function deriveStatus(
  docs: ParsedSpecDoc[],
  availability: Map<string, GraphMetadataDocReadResult['status']>,
  override?: string | null,
  existingStatus?: string | null,
): DerivedStatusResult {
  const normalizedOverride = normalizeDerivedStatus(override);
  if (normalizedOverride) {
    return { status: normalizedOverride, reviewRequired: false };
  }

  const rankedPaths = [
    'implementation-summary.md',
    'checklist.md',
    'tasks.md',
    'plan.md',
    'spec.md',
  ];
  const ranked = [
    docs.find((doc) => doc.relativePath === 'implementation-summary.md')?.status,
    docs.find((doc) => doc.relativePath === 'checklist.md')?.status,
    docs.find((doc) => doc.relativePath === 'tasks.md')?.status,
    docs.find((doc) => doc.relativePath === 'plan.md')?.status,
    docs.find((doc) => doc.relativePath === 'spec.md')?.status,
  ];
  const frontmatterStatus = normalizeDerivedStatus(selectFirstValue(ranked, ''));
  if (frontmatterStatus) {
    return { status: frontmatterStatus, reviewRequired: false };
  }

  if (rankedPaths.some((relativePath) => availability.get(relativePath) === 'unknown')) {
    return { status: 'unknown', reviewRequired: false };
  }

  const implementationSummaryDoc = docs.find((doc) => doc.relativePath === 'implementation-summary.md');
  if (!implementationSummaryDoc) {
    // Lean phase parents have no implementation-summary.md by design, so this branch
    // is their normal path. Preserve an existing status only when it is already an enum
    // value; a legacy prose value the closed enum no longer admits is dropped, falling
    // back to 'planned' with the review flag set so the bad status is not carried forward.
    const preserved = normalizeDerivedStatus(existingStatus);
    if (preserved) {
      return { status: preserved, reviewRequired: false };
    }
    const hadNonEnumExisting = typeof existingStatus === 'string' && existingStatus.trim().length > 0;
    return { status: 'planned', reviewRequired: hadNonEnumExisting };
  }

  const checklistDoc = docs.find((doc) => doc.relativePath === 'checklist.md');
  if (!checklistDoc) {
    // Folders without a checklist.md (the common Level-1 case) used to derive 'complete'
    // from implementation-summary.md's mere presence, so a freshly scaffolded but never
    // authored template read the same as a finished one. Gate on real completion evidence
    // instead: the doc's own completion_pct plus whether tasks.md still has open items.
    const completionPct = parseCompletionPct(implementationSummaryDoc.content);
    const tasksDoc = docs.find((doc) => doc.relativePath === 'tasks.md');
    const openTasks = tasksDoc ? hasOpenTaskItems(tasksDoc.content) : false;

    if (completionPct === null) {
      // Unknown completion state must never resolve to 'complete' by default; that is
      // the exact defect this branch is fixing. Preserve a valid prior status if one
      // exists, otherwise fall back to 'planned' with a review flag.
      const preserved = normalizeDerivedStatus(existingStatus);
      if (preserved) {
        return { status: preserved, reviewRequired: false };
      }
      return { status: 'planned', reviewRequired: true };
    }

    return {
      status: completionPct >= 100 && !openTasks ? 'complete' : 'in_progress',
      reviewRequired: false,
    };
  }

  return {
    status: evaluateChecklistCompletion(checklistDoc.content) === 'COMPLETE' ? 'complete' : 'in_progress',
    reviewRequired: false,
  };
}

function evaluateChecklistCompletion(content: string): 'COMPLETE' | 'INCOMPLETE' {
  const checklistItems = content.match(/^\s*[-*]\s+\[[ xX]\]\s+.+$/gm) ?? [];
  if (checklistItems.length === 0) {
    return 'INCOMPLETE';
  }
  return checklistItems.every((line) => !/\[\s\]/.test(line)) ? 'COMPLETE' : 'INCOMPLETE';
}

/**
 * Parse the `completion_pct` frontmatter field from a doc's raw content.
 *
 * Returns null when the field is absent or unparseable so callers can distinguish
 * "genuinely unknown" from a real numeric value instead of coercing to a default.
 */
export function parseCompletionPct(content: string): number | null {
  const raw = extractFrontmatterScalar(content, 'completion_pct');
  if (raw === null) {
    return null;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Whether a tasks.md (or any GFM checkbox list) has at least one unchecked item.
 *
 * Mirrors evaluateChecklistCompletion's regex so both stay consistent, but reports
 * open-ness rather than a COMPLETE/INCOMPLETE enum, and treats a doc with zero
 * checkbox items as having no open tasks rather than as incomplete.
 */
export function hasOpenTaskItems(content: string): boolean {
  const taskItems = content.match(/^\s*[-*]\s+\[[ xX]\]\s+.+$/gm) ?? [];
  return taskItems.some((line) => /\[\s\]/.test(line));
}

function deriveImportanceTier(docs: ParsedSpecDoc[]): string {
  const ranked = [
    docs.find((doc) => doc.relativePath === 'decision-record.md')?.importanceTier,
    docs.find((doc) => doc.relativePath === 'plan.md')?.importanceTier,
    docs.find((doc) => doc.relativePath === 'spec.md')?.importanceTier,
    docs.find((doc) => doc.relativePath === 'implementation-summary.md')?.importanceTier,
  ];
  return selectFirstValue(ranked, 'important');
}

/**
 * Derive graph metadata from the canonical documents in a spec folder.
 *
 * @param specFolderPath - Absolute path to the packet/spec folder
 * @param existing - Existing graph metadata used to preserve durable fields
 * @param options - Refresh controls such as timestamp and status override
 * @returns Freshly derived graph metadata validated by the schema
 */
export function deriveGraphMetadata(
  specFolderPath: string,
  existing: GraphMetadata | null = null,
  options: GraphMetadataRefreshOptions = {},
): GraphMetadata {
  const nowIso = toIsoString(options.now);
  const collectedDocs = collectPacketDocs(specFolderPath);
  const docs = collectedDocs.docs;
  const identity = resolveBuildIdentity(specFolderPath);
  const specFolder = identity.specFolder;
  const packetId = specFolder;
  const triggerPhrases = normalizeUnique(docs.flatMap((doc) => doc.triggerPhrases)).slice(0, GRAPH_METADATA_TRIGGER_PHRASE_LIMIT);
  const causalSummary = deriveCausalSummary(docs);
  const keyFiles = deriveKeyFiles(specFolderPath, specFolder, docs);
  const keyTopics = deriveKeyTopics(docs, triggerPhrases, causalSummary);
  const sourceDocs = docs.map((doc) => doc.relativePath);
  const entities = deriveEntities(specFolder, docs, keyFiles);
  const statusResult = deriveStatus(docs, collectedDocs.availability, options.statusOverride, existing?.derived.status);

  const derived: GraphMetadataDerived = {
    trigger_phrases: triggerPhrases,
    key_topics: keyTopics,
    importance_tier: deriveImportanceTier(docs),
    status: statusResult.status,
    key_files: keyFiles,
    entities,
    causal_summary: causalSummary,
    // Persisted only when the drift-gate flag is on so a flag-off derive stays byte-identical;
    // it is the cheap freshness key a later strict run compares before paying for a re-derive.
    source_doc_hashes: isGeneratedMetadataDriftGateEnabled()
      ? computeSourceDocHashes(specFolderPath)
      : undefined,
    created_at: existing?.derived.created_at ?? nowIso,
    last_save_at: nowIso,
    save_lineage: options.saveLineage,
    last_accessed_at: existing?.derived.last_accessed_at ?? null,
    source_docs: sourceDocs,
    // Written only when the hardening flag is on so a flag-off derive stays byte-identical.
    // Derived from the already-collected docs over the volatile-ignoring projection, so it
    // adds no extra tree walk and a no-op re-derive yields the same value (no churn). It
    // proves the stored causal_summary and description were re-derived from current docs.
    source_fingerprint: isGeneratorHardeningEnabled()
      ? computeSourceFingerprintFromDocs(docs.map((doc) => ({ relativePath: doc.relativePath, content: doc.content })))
      : undefined,
    // Chronology pointer is owned by the canonical save path (generate-context.ts);
    // a derive/re-derive must carry it forward, never invent or drop it.
    last_active_child_id: existing?.derived.last_active_child_id ?? null,
    last_active_at: existing?.derived.last_active_at ?? null,
  };

  return graphMetadataSchema.parse({
    schema_version: GRAPH_METADATA_SCHEMA_VERSION,
    packet_id: packetId,
    spec_folder: specFolder,
    parent_id: identity.parentId,
    status_review_required: statusResult.reviewRequired ? true : undefined,
    children_ids: identity.childrenIds,
    migrated: existing?.migrated ?? undefined,
    migration_source: existing?.migration_source ?? undefined,
    manual: existing?.manual ?? createEmptyGraphMetadataManual(),
    derived,
  });
}

/** Controls for how the merge treats lineage relationships. */
export interface MergeGraphMetadataOptions {
  /**
   * Sanctioned removal path. When set, the merge takes parent_id and children_ids
   * verbatim from the refreshed snapshot so a relationship can be dropped on purpose.
   * Without it, relationship removal can never be a side effect of a scoped scan.
   */
  prune?: boolean;
}

/**
 * Build a stable union of two child-id lists: existing entries keep their order, then
 * any refreshed entries not already present append in their order. Deterministic on the
 * same inputs, so re-running the merge never reshuffles a persisted children_ids.
 */
function unionChildrenIds(existing: string[], refreshed: string[]): string[] {
  const seen = new Set<string>();
  const union: string[] = [];
  for (const id of [...existing, ...refreshed]) {
    if (!seen.has(id)) {
      seen.add(id);
      union.push(id);
    }
  }
  return union;
}

/**
 * Merge refreshed derived metadata with persisted manual relationships.
 *
 * With the safety flag off, this is byte-identical to the previous spread merge. With
 * the flag on and an existing record present, it reconciles top-level lineage so a
 * scoped or null-deriving re-derive can no longer erase it: parent_id resolves as
 * refreshed-then-existing-then-null, children_ids default to a stable union, and a
 * non-null parent kept over a null re-derive is flagged for review. Relationship
 * removal is reserved for the explicit prune path.
 *
 * @param existing - Previously saved graph metadata, if present
 * @param refreshed - Newly derived graph metadata snapshot
 * @param options - Merge controls such as the explicit prune path
 * @returns Schema-validated merged metadata payload
 */
export function mergeGraphMetadata(
  existing: GraphMetadata | null,
  refreshed: GraphMetadata,
  options: MergeGraphMetadataOptions = {},
): GraphMetadata {
  const base = {
    ...refreshed,
    migrated: existing?.migrated ?? refreshed.migrated,
    migration_source: existing?.migration_source ?? refreshed.migration_source,
    manual: existing?.manual ?? createEmptyGraphMetadataManual(),
    derived: {
      ...refreshed.derived,
      created_at: existing?.derived.created_at ?? refreshed.derived.created_at,
      last_accessed_at: existing?.derived.last_accessed_at ?? refreshed.derived.last_accessed_at,
      last_active_child_id: existing?.derived.last_active_child_id ?? refreshed.derived.last_active_child_id ?? null,
      last_active_at: existing?.derived.last_active_at ?? refreshed.derived.last_active_at ?? null,
    },
  };

  if (!existing || !isIdentityMergeSafetyEnabled()) {
    return graphMetadataSchema.parse(base);
  }

  if (options.prune) {
    // Sanctioned removal: lineage follows the refreshed snapshot verbatim, so a
    // genuinely deleted parent or child is allowed to drop.
    return graphMetadataSchema.parse({
      ...base,
      parent_id: refreshed.parent_id,
      children_ids: refreshed.children_ids,
    });
  }

  const preservedNonNullParent = refreshed.parent_id === null && existing.parent_id !== null;
  return graphMetadataSchema.parse({
    ...base,
    parent_id: refreshed.parent_id ?? existing.parent_id ?? null,
    parent_id_review_required: preservedNonNullParent ? true : undefined,
    children_ids: unionChildrenIds(existing.children_ids, refreshed.children_ids),
  });
}

function canonicalizeForCompare(value: unknown): unknown {
  if (Array.isArray(value)) {
    // Array order is content-significant (e.g. entities, children_ids), preserve it.
    return value.map(canonicalizeForCompare);
  }
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return Object.keys(record)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = canonicalizeForCompare(record[key]);
        return acc;
      }, {});
  }
  return value;
}

/**
 * Compare two graph-metadata payloads ignoring volatile timestamp/lineage fields.
 *
 * Used to make `last_save_at` idempotent: a re-derive that produced no content change
 * must not rewrite the file (otherwise every save churns hundreds of packets' timestamps
 * and buries real diffs in the working tree). Key order is normalized so a payload loaded
 * from disk compares equal to a freshly-constructed one.
 *
 * @param a - First metadata payload
 * @param b - Second metadata payload
 * @returns True when the two are equal apart from `last_save_at` / `save_lineage`
 */
export function graphMetadataEqualIgnoringVolatile(a: GraphMetadata, b: GraphMetadata): boolean {
  const strip = (metadata: GraphMetadata): unknown => {
    const clone = JSON.parse(JSON.stringify(metadata)) as GraphMetadata;
    const derived = clone.derived as Record<string, unknown>;
    delete derived.last_save_at;
    delete derived.save_lineage;
    return canonicalizeForCompare(clone);
  };
  return JSON.stringify(strip(a)) === JSON.stringify(strip(b));
}

/**
 * Serialize graph metadata as stable pretty-printed JSON.
 *
 * @param metadata - Graph metadata payload to serialize
 * @returns JSON document terminated with a trailing newline
 */
export function serializeGraphMetadata(metadata: GraphMetadata): string {
  return `${JSON.stringify(metadata, null, 2)}\n`;
}

/**
 * Write graph metadata to disk using an atomic temp-file swap.
 *
 * @param filePath - Destination graph-metadata path
 * @param metadata - Metadata payload to persist
 */
export function writeGraphMetadataFile(filePath: string, metadata: GraphMetadata): void {
  const resolvedFilePath = path.resolve(filePath);
  const parentDir = path.dirname(resolvedFilePath);
  let canonicalParentDir: string;
  try {
    canonicalParentDir = fs.realpathSync(parentDir);
  } catch {
    throw new Error(`Graph metadata parent directory is invalid or contains a broken symlink: ${parentDir}`);
  }

  const canonicalFilePath = path.join(canonicalParentDir, path.basename(resolvedFilePath));
  if (!canClassifyAsGraphMetadataPath(canonicalFilePath)) {
    throw new Error(`Refusing to write graph metadata outside a supported specs root: ${canonicalFilePath}`);
  }

  const content = serializeGraphMetadata(metadata);
  // Counter + random suffix avoids same-process temp-path collisions during overlapping writes.
  const tempPath = `${canonicalFilePath}.tmp-${process.pid}-${tempCounter++}-${crypto.randomBytes(4).toString('hex')}`;

  fs.mkdirSync(path.dirname(canonicalFilePath), { recursive: true });
  fs.writeFileSync(tempPath, content, 'utf-8');
  fs.renameSync(tempPath, canonicalFilePath);
}

/**
 * Refresh the graph-metadata file for a single spec folder.
 *
 * @param specFolderPath - Absolute path to the target spec folder
 * @param options - Refresh controls such as timestamp and status override
 * @returns Saved metadata plus the final output path and creation status
 */
export function refreshGraphMetadataForSpecFolder(
  specFolderPath: string,
  options: GraphMetadataRefreshOptions = {},
): GraphMetadataRefreshResult {
  const resolvedSpecFolderPath = path.resolve(specFolderPath);
  let canonicalSpecFolderPath: string;
  try {
    canonicalSpecFolderPath = fs.realpathSync(resolvedSpecFolderPath);
  } catch {
    throw new Error(`Spec folder path is invalid or contains a broken symlink: ${resolvedSpecFolderPath}`);
  }

  if (!canClassifyAsGraphMetadataPath(path.join(canonicalSpecFolderPath, GRAPH_METADATA_FILENAME))) {
    throw new Error(`Spec folder is not under a supported specs root: ${canonicalSpecFolderPath}`);
  }

  const filePath = path.join(canonicalSpecFolderPath, GRAPH_METADATA_FILENAME);
  const existing = loadGraphMetadata(filePath);
  const refreshed = deriveGraphMetadata(canonicalSpecFolderPath, existing, {
    ...options,
    saveLineage: options.saveLineage ?? 'graph_only',
  });
  const merged = mergeGraphMetadata(existing, refreshed);

  // Idempotent write: when a re-derive produced no content change (only last_save_at
  // would move), skip the write entirely. Without this, every save rewrites this
  // packet's last_save_at, and a broad re-index churns hundreds of files' timestamps
  // with no real delta, burying genuine changes in working-tree noise. A no-op
  // re-derive has no new state worth stamping, so returning the existing payload is
  // correct. Any real change still writes (and still bumps last_save_at).
  if (existing && graphMetadataEqualIgnoringVolatile(existing, merged)) {
    return {
      filePath,
      metadata: existing,
      created: false,
    };
  }

  writeGraphMetadataFile(filePath, merged);

  return {
    filePath,
    metadata: merged,
    created: existing === null,
  };
}

export function refreshGraphMetadata(
  specFolderPath: string,
  options: GraphMetadataRefreshOptions = {},
): GraphMetadataRefreshResult {
  return refreshGraphMetadataForSpecFolder(specFolderPath, options);
}

/**
 * Convert graph metadata into a searchable text block for indexing.
 *
 * @param metadata - Metadata payload to flatten into indexable text
 * @returns Plain-text summary containing packet relationships and derived fields
 */
export function graphMetadataToIndexableText(metadata: GraphMetadata): string {
  const lines = [
    `Packet: ${metadata.packet_id}`,
    `Spec Folder: ${metadata.spec_folder}`,
    `Status: ${metadata.derived.status}`,
    `Importance Tier: ${metadata.derived.importance_tier}`,
    `Summary: ${metadata.derived.causal_summary}`,
  ];

  if (metadata.parent_id) {
    lines.push(`Parent: ${metadata.parent_id}`);
  }
  if (metadata.migrated) {
    lines.push('Migrated: true');
    lines.push(`Migration Source: ${metadata.migration_source ?? 'legacy'}`);
  }
  if (metadata.children_ids.length > 0) {
    lines.push(`Children: ${metadata.children_ids.join(', ')}`);
  }
  if (metadata.derived.trigger_phrases.length > 0) {
    lines.push(`Trigger Phrases: ${metadata.derived.trigger_phrases.join(', ')}`);
  }
  if (metadata.derived.key_topics.length > 0) {
    lines.push(`Key Topics: ${metadata.derived.key_topics.join(', ')}`);
  }
  if (metadata.derived.key_files.length > 0) {
    lines.push(`Key Files: ${metadata.derived.key_files.join(', ')}`);
  }
  if (metadata.manual.depends_on.length > 0) {
    lines.push(`Depends On: ${metadata.manual.depends_on.map((ref) => ref.packet_id).join(', ')}`);
  }
  if (metadata.manual.supersedes.length > 0) {
    lines.push(`Supersedes: ${metadata.manual.supersedes.map((ref) => ref.packet_id).join(', ')}`);
  }
  if (metadata.manual.related_to.length > 0) {
    lines.push(`Related To: ${metadata.manual.related_to.map((ref) => ref.packet_id).join(', ')}`);
  }
  if (metadata.derived.source_docs.length > 0) {
    lines.push(`Source Docs: ${metadata.derived.source_docs.join(', ')}`);
  }

  return `${lines.join('\n')}\n`;
}

/**
 * Convert packet references into causal-link buckets used by indexing.
 *
 * @param manual - Manual relationship section from graph metadata
 * @returns Packet IDs grouped by causal-link relation
 */
export function packetReferencesToCausalLinks(manual: GraphMetadataManual): Record<string, string[]> {
  return {
    blocks: manual.depends_on.map((ref) => ref.packet_id),
    supersedes: manual.supersedes.map((ref) => ref.packet_id),
    related_to: manual.related_to.map((ref) => ref.packet_id),
  };
}

// The drift gate re-derives one folder and compares the stored synopsis fields ignoring
// volatile timestamps. It lives in its own module to avoid an import cycle and is surfaced
// here alongside the generators it reports on.
export {
  GENERATED_METADATA_DRIFT_RULE,
  checkGeneratedMetadataDrift,
  computeSourceDocHashes,
  resolveGeneratedMetadataDrift,
} from './generated-metadata-drift.js';
export type {
  DriftedSynopsisField,
  GeneratedMetadataDriftReport,
  ResolvedDriftStatus,
} from './generated-metadata-drift.js';

export const __testables = {
  readDoc,
  deriveStatus,
  normalizeDerivedStatus,
  keepKeyFile,
  evaluateChecklistCompletion,
  parseCompletionPct,
  hasOpenTaskItems,
  resolveKeyFileCandidate,
  shouldKeepEntityName,
  writeGraphMetadataFile,
};
