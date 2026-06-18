// ───────────────────────────────────────────────────────────────
// MODULE: Write Provenance
// ───────────────────────────────────────────────────────────────
import { normalizeScopeValue } from '../governance/scope-governance.js';
import { scrubSecrets } from '../parsing/secret-scrubber.js';

export type SourceKind = 'human' | 'agent' | 'system' | 'import' | 'feedback';

export interface WriteProvenanceContext {
  provenanceSource?: unknown;
  provenanceActor?: unknown;
  provenance_source?: unknown;
  provenance_actor?: unknown;
  tool?: unknown;
  filePath?: unknown;
  scope?: {
    tenantId?: string | null;
    userId?: string | null;
    agentId?: string | null;
    sessionId?: string | null;
  };
}

type WriteProvenanceStatement = {
  all(...params: unknown[]): unknown[];
  run(...params: unknown[]): unknown;
};

/** Minimal database surface needed for post-write provenance updates. */
export interface WriteProvenanceDatabase {
  prepare(sql: string): WriteProvenanceStatement;
}

const SOURCE_KINDS = new Set<SourceKind>(['human', 'agent', 'system', 'import', 'feedback']);

export function normalizeSourceKind(value: unknown): SourceKind | null {
  if (typeof value !== 'string') {
    return null;
  }
  const normalized = value.trim().toLowerCase();
  return SOURCE_KINDS.has(normalized as SourceKind) ? normalized as SourceKind : null;
}

export function isManualSourceKind(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false;
  }
  const normalized = value.trim().toLowerCase();
  return normalized === 'manual' || normalizeSourceKind(normalized) === 'human';
}

function normalizeOptionalString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function sourceKindFromLabel(value: unknown): SourceKind | null {
  const normalized = normalizeOptionalString(value)?.toLowerCase();
  if (!normalized) {
    return null;
  }
  if (/\b(human|manual|user|operator|author)\b/.test(normalized)) {
    return 'human';
  }
  if (normalized.includes('feedback') || normalized.includes('validate') || normalized.includes('validation')) {
    return 'feedback';
  }
  if (normalized.includes('import') || normalized.includes('ingest') || normalized.includes('scan') || normalized.includes('index')) {
    return 'import';
  }
  if (/\b(agent|assistant|claude|codex|opencode|automation|bot)\b/.test(normalized)) {
    return 'agent';
  }
  if (/\b(system|runtime|daemon|scheduler|hook|reconsolidation)\b/.test(normalized)) {
    return 'system';
  }
  return null;
}

export function deriveSourceKindFromContext(context: WriteProvenanceContext = {}): SourceKind {
  const fromSource = sourceKindFromLabel(context.provenanceSource ?? context.provenance_source);
  if (fromSource) {
    return fromSource;
  }
  const fromActor = sourceKindFromLabel(context.provenanceActor ?? context.provenance_actor);
  if (fromActor) {
    return fromActor;
  }
  const fromTool = sourceKindFromLabel(context.tool);
  if (fromTool) {
    return fromTool;
  }
  const scope = context.scope ?? {};
  const hasUser = normalizeScopeValue(scope.userId) !== null;
  const hasAgent = normalizeScopeValue(scope.agentId) !== null;
  if (hasAgent && !hasUser) {
    return 'agent';
  }
  // No filePath heuristic: a human save whose path merely contains a word
  // like "index" or "scan" must not be classified as an automated import,
  // because that strips the manual-overwrite protection from the row. Real
  // scan/ingest writes are classified by their tool label or explicit tags.
  return 'human';
}

function getTableColumns(database: WriteProvenanceDatabase, tableName: string): Set<string> {
  try {
    return new Set(
      (database.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>)
        .map((column) => column.name),
    );
  } catch {
    return new Set();
  }
}

function scrubOptional(value: string | null | undefined): string | null | undefined {
  return value == null ? value : scrubSecrets(value);
}

export function buildPostInsertProvenanceFields(context: WriteProvenanceContext): {
  provenance_source?: string;
  provenance_actor?: string;
} {
  // Provenance labels are caller-supplied free text that lands in a persisted
  // column, so they pass through the same fail-closed scrubber as content.
  const provenanceSource = scrubOptional(normalizeOptionalString(context.provenanceSource ?? context.provenance_source));
  const provenanceActor = scrubOptional(normalizeOptionalString(context.provenanceActor ?? context.provenance_actor));
  return {
    ...(provenanceSource ? { provenance_source: provenanceSource } : {}),
    ...(provenanceActor ? { provenance_actor: provenanceActor } : {}),
  };
}

export function persistSourceKind(
  database: WriteProvenanceDatabase | null | undefined,
  memoryId: number,
  sourceKind: SourceKind,
): void {
  if (!database || !getTableColumns(database, 'memory_index').has('source_kind')) {
    return;
  }
  database.prepare('UPDATE memory_index SET source_kind = ? WHERE id = ?').run(sourceKind, memoryId);
}

export function persistProvenanceMetadata(
  database: WriteProvenanceDatabase | null | undefined,
  memoryId: number,
  context: WriteProvenanceContext,
): void {
  if (!database) {
    return;
  }
  const fields = buildPostInsertProvenanceFields(context);
  const columns = getTableColumns(database, 'memory_index');
  const setClauses: string[] = [];
  const values: string[] = [];
  for (const [column, value] of Object.entries(fields)) {
    if (!columns.has(column)) {
      continue;
    }
    setClauses.push(`${column} = ?`);
    values.push(value);
  }
  if (setClauses.length === 0) {
    return;
  }
  database.prepare(`UPDATE memory_index SET ${setClauses.join(', ')} WHERE id = ?`).run(...values, memoryId);
}

export function applyWriteProvenance(
  database: WriteProvenanceDatabase | null | undefined,
  memoryId: number,
  context: WriteProvenanceContext = {},
): SourceKind {
  const sourceKind = deriveSourceKindFromContext(context);
  persistSourceKind(database, memoryId, sourceKind);
  persistProvenanceMetadata(database, memoryId, context);
  return sourceKind;
}
