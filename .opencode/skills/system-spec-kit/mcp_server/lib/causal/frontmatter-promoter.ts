// ───────────────────────────────────────────────────────────────
// MODULE: Frontmatter Promoter
// ───────────────────────────────────────────────────────────────
import fs from 'node:fs';
import path from 'node:path';
import type Database from 'better-sqlite3';

import { perFolderDescriptionSchema } from '../description/description-schema.js';
import { validateGraphMetadataContent } from '../graph/graph-metadata-parser.js';
import * as causalEdges from '../storage/causal-edges.js';
import { sweepCausalEdges } from './sweep.js';

type PromotedField = 'parent_id' | 'children_ids' | 'parentChain';

type RelationMapping = {
  field: PromotedField;
  relation: typeof causalEdges.RELATION_TYPES[keyof typeof causalEdges.RELATION_TYPES];
  source: 'current' | 'target';
  target: 'current' | 'target';
  sourceAnchor: string;
};

type EdgeIntent = {
  sourcePacketId: string;
  targetPacketId: string;
  targetReference: string;
  relation: typeof causalEdges.RELATION_TYPES[keyof typeof causalEdges.RELATION_TYPES];
  sourceAnchor: string;
  targetAnchor: string;
  field: PromotedField;
};

type ExtractedMetadataIntents = {
  currentPacketId: string;
  intents: EdgeIntent[];
};

type ResolvedEdgeIntent = EdgeIntent & {
  sourceId: number;
  targetId: number;
};

type PromotionInput = {
  memoryId: number;
  filePath: string;
  content?: string;
};

type PromotionWarning = {
  field: PromotedField;
  reference: string;
  message: string;
};

type PromotionResult = {
  processed: number;
  resolved: number;
  inserted: number;
  skippedManual: number;
  staleTombstoned: number;
  staleDeleted: number;
  warnings: PromotionWarning[];
};

const CREATED_BY = 'auto';
const EXTRACTION_METHOD = 'frontmatter';
const CONFIDENCE = 1.0;

const RELATION_MAPPINGS: readonly RelationMapping[] = [
  {
    field: 'parent_id',
    relation: causalEdges.RELATION_TYPES.DERIVED_FROM,
    source: 'current',
    target: 'target',
    sourceAnchor: 'metadata:parent_id',
  },
  {
    field: 'children_ids',
    relation: causalEdges.RELATION_TYPES.ENABLED,
    source: 'current',
    target: 'target',
    sourceAnchor: 'metadata:children_ids',
  },
  {
    field: 'parentChain',
    relation: causalEdges.RELATION_TYPES.DERIVED_FROM,
    source: 'current',
    target: 'target',
    sourceAnchor: 'metadata:parent_chain',
  },
] as const;

function emptyResult(): PromotionResult {
  return {
    processed: 0,
    resolved: 0,
    inserted: 0,
    skippedManual: 0,
    staleTombstoned: 0,
    staleDeleted: 0,
    warnings: [],
  };
}

function isPromotableFile(filePath: string): boolean {
  const basename = path.basename(filePath);
  return basename === 'graph-metadata.json' || basename === 'description.json';
}

function normalizePacketId(value: string): string {
  return value
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/^\.opencode\/specs\//, '')
    .replace(/^specs\//, '')
    .replace(/\/graph-metadata\.json$/, '')
    .replace(/\/description\.json$/, '')
    .replace(/\/$/, '');
}

function uniqueNonEmpty(values: readonly string[]): string[] {
  return Array.from(new Set(values.map(normalizePacketId).filter(Boolean)));
}

function mappingFor(field: PromotedField): RelationMapping {
  const mapping = RELATION_MAPPINGS.find((candidate) => candidate.field === field);
  if (!mapping) {
    throw new Error(`Missing relation mapping for ${field}`);
  }
  return mapping;
}

function createIntent(currentPacketId: string, field: PromotedField, targetReference: string): EdgeIntent {
  const mapping = mappingFor(field);
  const targetPacketId = normalizePacketId(targetReference);
  return {
    sourcePacketId: mapping.source === 'current' ? currentPacketId : targetPacketId,
    targetPacketId: mapping.target === 'current' ? currentPacketId : targetPacketId,
    targetReference,
    relation: mapping.relation,
    sourceAnchor: mapping.sourceAnchor,
    targetAnchor: `packet:${targetPacketId}`,
    field,
  };
}

function extractGraphMetadataIntents(content: string): ExtractedMetadataIntents {
  const validation = validateGraphMetadataContent(content);
  if (!validation.ok) {
    throw new Error(`Invalid graph metadata: ${validation.errors.join('; ')}`);
  }

  const metadata = validation.metadata;
  const currentPacketId = normalizePacketId(metadata.packet_id || metadata.spec_folder);
  const intents: EdgeIntent[] = [];

  if (metadata.parent_id) {
    intents.push(createIntent(currentPacketId, 'parent_id', metadata.parent_id));
  }
  for (const childId of uniqueNonEmpty(metadata.children_ids)) {
    intents.push(createIntent(currentPacketId, 'children_ids', childId));
  }

  return { currentPacketId, intents };
}

function extractDescriptionIntents(content: string): ExtractedMetadataIntents {
  const parsed = JSON.parse(content) as unknown;
  const validation = perFolderDescriptionSchema.safeParse(parsed);
  if (!validation.success) {
    throw new Error(`Invalid description metadata: ${validation.error.issues.map((issue) => issue.message).join('; ')}`);
  }

  const metadata = validation.data;
  const currentPacketId = normalizePacketId(metadata.specFolder);
  const intents = uniqueNonEmpty(metadata.parentChain ?? [])
    .map((ancestorId) => createIntent(currentPacketId, 'parentChain', ancestorId));
  return { currentPacketId, intents };
}

function extractMetadataIntents(filePath: string, content: string): ExtractedMetadataIntents | null {
  const basename = path.basename(filePath);
  if (basename === 'graph-metadata.json') {
    return extractGraphMetadataIntents(content);
  }
  if (basename === 'description.json') {
    return extractDescriptionIntents(content);
  }
  return null;
}

function extractIntents(filePath: string, content: string): EdgeIntent[] {
  return extractMetadataIntents(filePath, content)?.intents ?? [];
}

function fieldsForFile(filePath: string): PromotedField[] {
  const basename = path.basename(filePath);
  if (basename === 'graph-metadata.json') {
    return ['parent_id', 'children_ids'];
  }
  if (basename === 'description.json') {
    return ['parentChain'];
  }
  return [];
}

function resolvePacketMemoryIds(database: Database.Database, packetIds: readonly string[]): Map<string, number> {
  const normalizedIds = uniqueNonEmpty(packetIds);
  if (normalizedIds.length === 0) {
    return new Map();
  }

  const placeholders = normalizedIds.map(() => '?').join(', ');
  const rows = database.prepare(`
    SELECT id, spec_folder, document_type
    FROM memory_index
    WHERE spec_folder IN (${placeholders})
      AND COALESCE(parent_id, 0) = 0
      AND COALESCE(importance_tier, 'normal') != 'deprecated'
    ORDER BY CASE document_type
      WHEN 'graph_metadata' THEN 0
      WHEN 'description_metadata' THEN 1
      WHEN 'spec' THEN 2
      ELSE 3
    END ASC, id DESC
  `).all(...normalizedIds) as Array<{ id: number; spec_folder: string; document_type: string | null }>;

  const resolved = new Map<string, number>();
  for (const row of rows) {
    const packetId = normalizePacketId(row.spec_folder);
    if (!resolved.has(packetId)) {
      resolved.set(packetId, row.id);
    }
  }
  return resolved;
}

function resolveIntents(database: Database.Database, sourceMemoryId: number, intents: readonly EdgeIntent[]): {
  resolved: ResolvedEdgeIntent[];
  warnings: PromotionWarning[];
} {
  const packetIds = intents.flatMap((intent) => [intent.sourcePacketId, intent.targetPacketId]);
  const memoryIds = resolvePacketMemoryIds(database, packetIds);
  const resolved: ResolvedEdgeIntent[] = [];
  const warnings: PromotionWarning[] = [];

  for (const intent of intents) {
    const sourceId = memoryIds.get(intent.sourcePacketId) ?? sourceMemoryId;
    const targetId = memoryIds.get(intent.targetPacketId);

    if (typeof sourceId !== 'number') {
      warnings.push({ field: intent.field, reference: intent.sourcePacketId, message: 'Source packet could not be resolved' });
      continue;
    }
    if (typeof targetId !== 'number') {
      warnings.push({ field: intent.field, reference: intent.targetReference, message: 'Target packet could not be resolved' });
      continue;
    }
    if (sourceId === targetId) {
      warnings.push({ field: intent.field, reference: intent.targetReference, message: 'Self-loop skipped' });
      continue;
    }

    resolved.push({ ...intent, sourceId, targetId });
  }

  return { resolved, warnings };
}

function edgeKey(edge: Pick<ResolvedEdgeIntent, 'sourceId' | 'targetId' | 'relation' | 'sourceAnchor' | 'targetAnchor'>): string {
  return [edge.sourceId, edge.targetId, edge.relation, edge.sourceAnchor, edge.targetAnchor].join('\u0000');
}

function hasManualConflict(database: Database.Database, edge: ResolvedEdgeIntent): boolean {
  const row = database.prepare(`
    SELECT id, created_by
    FROM causal_edges
    WHERE source_id = ? AND target_id = ? AND relation = ?
      AND COALESCE(created_by, 'manual') NOT LIKE 'auto%'
    LIMIT 1
  `).get(String(edge.sourceId), String(edge.targetId), edge.relation) as { id: number; created_by: string | null } | undefined;
  return Boolean(row);
}

function tableColumns(database: Database.Database, tableName: string): Set<string> {
  return new Set((database.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>)
    .map((column) => column.name));
}

function cleanupStaleGeneratedEdges(database: Database.Database, sourceMemoryId: number, desired: readonly ResolvedEdgeIntent[], fields: readonly PromotedField[]): Pick<PromotionResult, 'staleTombstoned' | 'staleDeleted'> {
  const columns = tableColumns(database, 'causal_edges');
  if (!columns.has('extraction_method')) {
    return { staleTombstoned: 0, staleDeleted: 0 };
  }

  const sourceAnchors = Array.from(new Set(fields.map((field) => mappingFor(field).sourceAnchor)));
  if (sourceAnchors.length === 0) {
    return { staleTombstoned: 0, staleDeleted: 0 };
  }

  const placeholders = sourceAnchors.map(() => '?').join(', ');
  const rows = database.prepare(`
    SELECT id, source_id, target_id, relation, source_anchor, target_anchor
    FROM causal_edges
    WHERE source_id = ?
      AND created_by = ?
      AND extraction_method = ?
      AND source_anchor IN (${placeholders})
  `).all(String(sourceMemoryId), CREATED_BY, EXTRACTION_METHOD, ...sourceAnchors) as Array<{
    id: number;
    source_id: string;
    target_id: string;
    relation: string;
    source_anchor: string | null;
    target_anchor: string | null;
  }>;

  const desiredKeys = new Set(desired.map(edgeKey));
  const staleIds = rows
    .filter((row) => !desiredKeys.has([
      Number(row.source_id),
      Number(row.target_id),
      row.relation,
      row.source_anchor ?? '',
      row.target_anchor ?? '',
    ].join('\u0000')))
    .map((row) => row.id);

  if (staleIds.length === 0) {
    return { staleTombstoned: 0, staleDeleted: 0 };
  }

  const sweep = sweepCausalEdges(database, {
    edgeIds: staleIds,
    reason: 'metadata relationship removed',
    command: 'frontmatter_promoter.cleanupStaleGeneratedEdges',
    restoreContext: { sourceMemoryId, fields },
    invalidateCaches: false,
  });

  return { staleTombstoned: sweep.tombstoned, staleDeleted: sweep.deleted };
}

function promoteMetadataEdges(database: Database.Database, input: PromotionInput): PromotionResult {
  if (!Number.isSafeInteger(input.memoryId) || input.memoryId <= 0 || !isPromotableFile(input.filePath)) {
    return emptyResult();
  }

  const content = input.content ?? fs.readFileSync(input.filePath, 'utf-8');
  const extracted = extractMetadataIntents(input.filePath, content);
  const result = emptyResult();
  if (!extracted) {
    return result;
  }

  const { currentPacketId, intents } = extracted;
  result.processed = intents.length;

  causalEdges.init(database);

  const canonicalSourceId = resolvePacketMemoryIds(database, [currentPacketId]).get(normalizePacketId(currentPacketId)) ?? input.memoryId;

  const { resolved, warnings } = resolveIntents(database, canonicalSourceId, intents);
  result.warnings.push(...warnings);
  result.resolved = resolved.length;

  const fields = fieldsForFile(input.filePath);
  const cleanup = cleanupStaleGeneratedEdges(database, canonicalSourceId, resolved, fields);
  result.staleTombstoned += cleanup.staleTombstoned;
  result.staleDeleted += cleanup.staleDeleted;

  const seen = new Set<string>();
  for (const edge of resolved) {
    const key = edgeKey(edge);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);

    if (hasManualConflict(database, edge)) {
      result.skippedManual++;
      continue;
    }

    const edgeId = causalEdges.insertEdge(
      String(edge.sourceId),
      String(edge.targetId),
      edge.relation,
      1.0,
      `Metadata relationship: ${edge.field}`,
      false,
      CREATED_BY,
      {
        sourceAnchor: edge.sourceAnchor,
        targetAnchor: edge.targetAnchor,
      },
      {
        confidence: CONFIDENCE,
        extractionMethod: EXTRACTION_METHOD,
      },
    );
    if (edgeId !== null) {
      result.inserted++;
    }
  }

  return result;
}

export {
  CONFIDENCE as FRONTMATTER_PROMOTER_CONFIDENCE,
  EXTRACTION_METHOD as FRONTMATTER_PROMOTER_EXTRACTION_METHOD,
  RELATION_MAPPINGS as FRONTMATTER_RELATION_MAPPINGS,
  extractIntents as extractFrontmatterEdgeIntents,
  promoteMetadataEdges,
};

export type {
  EdgeIntent as FrontmatterEdgeIntent,
  PromotionInput as FrontmatterPromotionInput,
  PromotionResult as FrontmatterPromotionResult,
};
