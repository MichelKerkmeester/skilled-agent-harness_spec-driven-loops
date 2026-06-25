// ───────────────────────────────────────────────────────────────
// MODULE: Scope Governance
// ───────────────────────────────────────────────────────────────
// Hierarchical scope filtering, governed ingest validation,
// provenance normalization, and governance audit persistence.

/* ───────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

import { canonicalFold } from '@spec-kit/shared/unicode-normalization';

import { ensureGovernanceTables } from '../search/vector-index-schema.js';
import { normalizeStringScopeId as normalizeScopeValue } from '../utils/scope-normalization.js';

import type Database from 'better-sqlite3';

export { normalizeScopeValue };

// Feature catalog: Hierarchical scope governance, governed ingest, retention, and audit

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

/**
 * Retention modes applied during governed ingest.
 */
export type RetentionPolicy = 'keep' | 'ephemeral';

/**
 * Request scope used to enforce tenancy, actor, and session boundaries.
 */
export interface ScopeContext {
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sessionId?: string;
}

/**
 * Governed-ingest fields required to persist scope and retention metadata.
 */
export interface GovernedIngestInput extends ScopeContext {
  provenanceSource?: string;
  provenanceActor?: string;
  governedAt?: string;
  retentionPolicy?: RetentionPolicy;
  deleteAfter?: string;
}

/**
 * Result of governed-ingest validation and field normalization.
 */
// Simplified normalized type — previously a complex intersection.
export interface GovernanceNormalized {
  tenantId?: string | null;
  userId?: string | null;
  agentId?: string | null;
  sessionId?: string | null;
  provenanceSource: string | null;
  provenanceActor: string | null;
  governedAt: string;
  retentionPolicy: RetentionPolicy;
  deleteAfter: string | null;
}

export interface GovernanceDecision {
  allowed: boolean;
  normalized: GovernanceNormalized;
  reason?: string;
  issues: string[];
}

/**
 * Audit payload written for allow, deny, delete, and conflict events.
 */
export interface GovernanceAuditEntry extends ScopeContext {
  action: string;
  decision: 'allow' | 'deny' | 'delete' | 'conflict';
  memoryId?: number | null;
  logicalKey?: string | null;
  reason?: string | null;
  metadata?: Record<string, unknown> | null;
}

/**
 * Filters used to review governance audit history.
 */
export interface GovernanceAuditReviewFilters extends ScopeContext {
  action?: string;
  decision?: GovernanceAuditEntry['decision'];
  limit?: number;
  allowUnscoped?: boolean;
}

/**
 * Parsed governance audit row returned for review workflows.
 */
export interface GovernanceAuditReviewRow extends ScopeContext {
  id: number;
  action: string;
  decision: GovernanceAuditEntry['decision'];
  memoryId: number | null;
  logicalKey: string | null;
  reason: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

/**
 * Aggregate view of governance audit activity for a filtered review.
 */
export interface GovernanceAuditReviewSummary {
  totalMatching: number;
  returnedRows: number;
  byAction: Record<string, number>;
  byDecision: Partial<Record<GovernanceAuditEntry['decision'], number>>;
  latestCreatedAt: string | null;
}

/**
 * Combined governance audit review rows and summary.
 */
export interface GovernanceAuditReviewResult {
  rows: GovernanceAuditReviewRow[];
  summary: GovernanceAuditReviewSummary;
}

export type GovernanceAuditAction =
  typeof GOVERNANCE_AUDIT_ACTIONS[keyof typeof GOVERNANCE_AUDIT_ACTIONS];

export interface TierDowngradeAuditParams extends ScopeContext {
  action?: GovernanceAuditAction;
  memoryId?: number | null;
  logicalKey?: string | null;
  requestedTier?: string | null;
  previousTier?: string | null;
  nextTier: string;
  source: string;
  reason?: string | null;
  filePath?: string | null;
  canonicalFilePath?: string | null;
  metadata?: Record<string, unknown> | null;
}

/**
 * Options used when benchmarking scope-filter behavior.
 */
export interface ScopeFilterBenchmarkOptions {
  iterations?: number;
}

/**
 * Benchmark result for a scope filter predicate.
 */
export interface ScopeFilterBenchmarkResult {
  iterations: number;
  totalRows: number;
  matchedRows: number;
  filteredRows: number;
  elapsedMs: number;
  averageMsPerIteration: number;
}

/* ───────────────────────────────────────────────────────────────
   3. CONSTANTS
──────────────────────────────────────────────────────────────── */

/**
 * Default TTL for ephemeral memories when the caller doesn't supply an explicit deleteAfter.
 * 24h is conservative: short enough to clean up active test fixtures, long
 * enough to survive a typical autonomous workflow.
 */
export const DEFAULT_EPHEMERAL_TTL_MS = 24 * 60 * 60 * 1000;

export const GOVERNANCE_AUDIT_ACTIONS = {
  TIER_DOWNGRADE_NON_CONSTITUTIONAL_PATH: 'tier_downgrade_non_constitutional_path',
  TIER_DOWNGRADE_NON_CONSTITUTIONAL_PATH_CLEANUP: 'tier_downgrade_non_constitutional_path_cleanup',
  CHECKPOINT_RESTORE_EXCLUDED_PATH_REJECTED: 'checkpoint_restore_excluded_path_rejected',
} as const;

const DENIAL_AUDIT_RAW_TEXT_KEYS = new Set([
  'input',
  'inputprompt',
  'prompt',
  'query',
  'querytext',
  'rawinput',
  'rawprompt',
  'rawquery',
  'searchtext',
  'userprompt',
]);
const DENIAL_AUDIT_REDACTION = '[redacted-query-text]';
const DENIAL_AUDIT_INSTRUCTION_PATTERN =
  /\b(ignore\s+(previous|all)\s+instructions|system\s*:|developer\s*:|assistant\s*:|instruction\s*:|execute\s*:)/i;

/* ───────────────────────────────────────────────────────────────
   4. HELPERS
──────────────────────────────────────────────────────────────── */

function normalizeId(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeMetadataKey(key: string): string {
  return key.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

function isRawTextMetadataKey(key: string | undefined): boolean {
  return typeof key === 'string' && DENIAL_AUDIT_RAW_TEXT_KEYS.has(normalizeMetadataKey(key));
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isInstructionShapedText(value: string): boolean {
  return DENIAL_AUDIT_INSTRUCTION_PATTERN.test(canonicalFold(value));
}

function sanitizeDenyAuditValue(value: unknown, key?: string): unknown {
  if (isRawTextMetadataKey(key)) {
    return DENIAL_AUDIT_REDACTION;
  }

  if (typeof value === 'string' && isInstructionShapedText(value)) {
    return DENIAL_AUDIT_REDACTION;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeDenyAuditValue(item));
  }

  if (isPlainRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([entryKey, entryValue]) => [
        entryKey,
        sanitizeDenyAuditValue(entryValue, entryKey),
      ]),
    );
  }

  return value;
}

function sanitizeGovernanceAuditMetadata(entry: GovernanceAuditEntry): Record<string, unknown> | null {
  if (!entry.metadata) {
    return null;
  }
  if (entry.decision !== 'deny') {
    return entry.metadata;
  }
  return sanitizeDenyAuditValue(entry.metadata) as Record<string, unknown>;
}

function sanitizeGovernanceAuditReason(entry: GovernanceAuditEntry): string | null {
  if (!entry.reason) {
    return null;
  }
  if (entry.decision === 'deny' && isInstructionShapedText(entry.reason)) {
    return 'redacted_query_text';
  }
  return entry.reason;
}

/* ───────────────────────────────────────────────────────────────
   5. CORE LOGIC
──────────────────────────────────────────────────────────────── */

export function buildGovernanceLogicalKey(
  specFolder: string | null | undefined,
  resolvedPath: string | null | undefined,
  anchorId: string | null | undefined,
): string | null {
  if (!specFolder || !resolvedPath) {
    return null;
  }

  const normalizedAnchor = anchorId && anchorId.trim().length > 0 ? anchorId : '_';
  return `${specFolder}::${resolvedPath}::${normalizedAnchor}`;
}

function normalizeIsoTimestamp(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.trim().length === 0) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

/**
 * Trim and normalize optional scope identifiers before enforcement.
 *
 * @param input - Scope values supplied by the caller.
 * @returns Scope with blank identifiers removed.
 */
export function normalizeScopeContext(input: ScopeContext): ScopeContext {
  return {
    tenantId: normalizeId(input.tenantId),
    userId: normalizeId(input.userId),
    agentId: normalizeId(input.agentId),
    sessionId: normalizeId(input.sessionId),
  };
}

/**
 * Determine whether an ingest request must pass governed-ingest validation.
 * All ingest mutation surfaces should call `validateGovernedIngest` with their
 * available metadata before writes or job enqueue. When any scope,
 * provenance, governed timestamp, or retention field is present,
 * `provenanceActor` is mandatory so audit rows can identify the caller.
 *
 * @param input - Candidate ingest metadata.
 * @returns `true` when governance or scope metadata requires enforcement.
 */
export function requiresGovernedIngest(input: GovernedIngestInput): boolean {
  const scope = normalizeScopeContext(input);
  return Object.values(scope).some((value) => typeof value === 'string')
    || typeof input.provenanceSource === 'string'
    || typeof input.provenanceActor === 'string'
    || typeof input.governedAt === 'string'
    || (input.retentionPolicy !== 'ephemeral' && typeof input.deleteAfter === 'string');
}

/**
 * Validate governed-ingest metadata and return normalized persistence fields.
 *
 * @param input - Candidate ingest metadata.
 * @returns Validation result with normalized scope, provenance, and retention data.
 */
export function validateGovernedIngest(input: GovernedIngestInput): GovernanceDecision {
  const scope = normalizeScopeContext(input);
  const issues: string[] = [];
  const governedAt = normalizeIsoTimestamp(input.governedAt) ?? new Date().toISOString();
  const deleteAfter = normalizeIsoTimestamp(input.deleteAfter) ?? null;
  // A caller that supplies a non-empty deleteAfter has asked for a retention
  // deadline; distinguish that from "no deadline requested" so a value that
  // fails ISO normalization can be rejected rather than silently coerced.
  const deleteAfterProvided = typeof input.deleteAfter === 'string' && input.deleteAfter.trim().length > 0;
  const retentionPolicy: RetentionPolicy = input.retentionPolicy === 'ephemeral'
    ? input.retentionPolicy
    : 'keep';
  const provenanceSource = normalizeId(input.provenanceSource) ?? '';
  const provenanceActor = normalizeId(input.provenanceActor) ?? '';

  if (!requiresGovernedIngest(input)) {
    const computedDeleteAfter = deleteAfter ?? (
      retentionPolicy === 'ephemeral'
        ? new Date(Date.now() + DEFAULT_EPHEMERAL_TTL_MS).toISOString()
        : null
    );
    // Return null instead of empty string for optional scope fields
    // when governance is not required, to avoid persisting false-y placeholders.
    return {
      allowed: true,
      normalized: {
        tenantId: scope.tenantId || null,
        userId: scope.userId || null,
        agentId: scope.agentId || null,
        sessionId: scope.sessionId || null,
        provenanceSource: provenanceSource || null,
        provenanceActor: provenanceActor || null,
        governedAt,
        retentionPolicy,
        deleteAfter: computedDeleteAfter,
      },
      issues,
    };
  }

  if (!scope.tenantId) issues.push('tenantId is required for governed ingest');
  if (!scope.sessionId) issues.push('sessionId is required for governed ingest');
  if (!scope.userId && !scope.agentId) issues.push('userId or agentId is required for governed ingest');
  if (!provenanceSource) issues.push('provenanceSource is required for governed ingest');
  if (!provenanceActor) issues.push('provenanceActor is required for governed ingest');
  // Fail closed on a malformed deleteAfter: a supplied-but-unparseable timestamp
  // would otherwise coerce to null and drop the requested deadline, persisting a
  // row with no expiry and no error. Reject instead of swallowing the request.
  if (deleteAfterProvided && deleteAfter === null) {
    issues.push('deleteAfter must be a valid ISO-8601 timestamp');
  }
  if (deleteAfter && new Date(deleteAfter).getTime() <= new Date(governedAt).getTime()) {
    issues.push('deleteAfter must be later than governedAt');
  }
  // Require valid future deleteAfter for ephemeral retention policy
  // The memory retention sweep enforces this field via memory_index.delete_after;
  // keep ephemeral rows paired with a concrete timestamp for auditability.
  if (retentionPolicy === 'ephemeral' && !deleteAfter) {
    issues.push('deleteAfter is required for ephemeral retention policy');
  }

  return {
    allowed: issues.length === 0,
    reason: issues[0],
    issues,
    normalized: {
      tenantId: scope.tenantId ?? '',
      userId: scope.userId,
      agentId: scope.agentId,
      sessionId: scope.sessionId ?? '',
      provenanceSource,
      provenanceActor,
      governedAt,
      retentionPolicy,
      deleteAfter,
    },
  };
}

/**
 * Map a governance decision into memory-index column values.
 *
 * @param decision - Normalized governance decision from ingest validation.
 * @returns Column/value pairs used after memory insertion.
 */
export function buildGovernancePostInsertFields(decision: GovernanceDecision): Record<string, unknown> {
  return {
    tenant_id: decision.normalized.tenantId || null,
    user_id: decision.normalized.userId ?? null,
    agent_id: decision.normalized.agentId ?? null,
    session_id: decision.normalized.sessionId || null,
    provenance_source: decision.normalized.provenanceSource || null,
    provenance_actor: decision.normalized.provenanceActor || null,
    governed_at: decision.normalized.governedAt,
    retention_policy: decision.normalized.retentionPolicy,
    // Consumed by memory_retention_sweep and the scheduled retention interval.
    delete_after: decision.normalized.deleteAfter,
    governance_metadata: JSON.stringify({
      tenantId: decision.normalized.tenantId || null,
      userId: decision.normalized.userId ?? null,
      agentId: decision.normalized.agentId ?? null,
      sessionId: decision.normalized.sessionId || null,
      provenanceSource: decision.normalized.provenanceSource || null,
      provenanceActor: decision.normalized.provenanceActor || null,
      governedAt: decision.normalized.governedAt,
      retentionPolicy: decision.normalized.retentionPolicy,
      deleteAfter: decision.normalized.deleteAfter,
    }),
  };
}

/**
 * Ensure governance audit tables exist before writes.
 *
 * @param database - Database connection that stores governance state.
 */
export function ensureGovernanceRuntime(database: Database.Database): void {
  ensureGovernanceTables(database);
}

/**
 * Persist a governance audit entry for enforcement decisions and lifecycle events.
 *
 * @param database - Database connection that stores governance state.
 * @param entry - Audit payload to persist.
 */
export function recordGovernanceAudit(database: Database.Database, entry: GovernanceAuditEntry): void {
  ensureGovernanceRuntime(database);
  const scope = normalizeScopeContext(entry);
  const metadata = sanitizeGovernanceAuditMetadata(entry);
  database.prepare(`
    INSERT INTO governance_audit (
      action, decision, memory_id, logical_key, tenant_id, user_id, agent_id, session_id,
      reason, metadata
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    entry.action,
    entry.decision,
    entry.memoryId ?? null,
    entry.logicalKey ?? null,
    scope.tenantId ?? null,
    scope.userId ?? null,
    scope.agentId ?? null,
    scope.sessionId ?? null,
    sanitizeGovernanceAuditReason(entry),
    metadata ? JSON.stringify(metadata) : null,
  );
}


export function recordTierDowngradeAudit(
  database: Database.Database,
  params: TierDowngradeAuditParams,
): void {
  const metadata: Record<string, unknown> = {
    source: params.source,
    appliedTier: params.nextTier,
  };

  if (params.requestedTier !== undefined) {
    metadata.requestedTier = params.requestedTier;
  }
  if (params.previousTier !== undefined) {
    metadata.previousTier = params.previousTier;
  }
  if (params.filePath !== undefined) {
    metadata.filePath = params.filePath;
  }
  if (params.canonicalFilePath !== undefined) {
    metadata.canonicalFilePath = params.canonicalFilePath;
  }
  if (params.metadata) {
    Object.assign(metadata, params.metadata);
  }

  recordGovernanceAudit(database, {
    action: params.action ?? GOVERNANCE_AUDIT_ACTIONS.TIER_DOWNGRADE_NON_CONSTITUTIONAL_PATH,
    decision: 'conflict',
    tenantId: params.tenantId,
    userId: params.userId,
    agentId: params.agentId,
    sessionId: params.sessionId,
    memoryId: params.memoryId ?? null,
    logicalKey: params.logicalKey ?? null,
    reason: params.reason ?? 'non_constitutional_path',
    metadata,
  });
}

function matchesExactScope(rowValue: unknown, requestedValue?: string): boolean {
  if (!requestedValue) return true;
  return typeof rowValue === 'string' && rowValue === requestedValue;
}

/**
 * Determine whether a scope includes at least one concrete constraint.
 *
 * @param scope - Scope to inspect for tenant, actor, or session bounds.
 * @returns `true` when the scope constrains access to at least one boundary.
 */
export function hasScopeConstraints(scope: ScopeContext): boolean {
  return Boolean(
    scope.tenantId
    || scope.userId
    || scope.agentId
    || scope.sessionId,
  );
}

function parseAuditMetadata(value: unknown): Record<string, unknown> | null {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return null;
    }
    return null;
  }

  return null;
}

function buildGovernanceAuditWhereClause(filters: GovernanceAuditReviewFilters): { whereSql: string; params: unknown[] } {
  const normalized = normalizeScopeContext(filters);
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (filters.action) {
    clauses.push('action = ?');
    params.push(filters.action);
  }
  if (filters.decision) {
    clauses.push('decision = ?');
    params.push(filters.decision);
  }
  if (normalized.tenantId) {
    clauses.push('tenant_id = ?');
    params.push(normalized.tenantId);
  }
  if (normalized.userId) {
    clauses.push('user_id = ?');
    params.push(normalized.userId);
  }
  if (normalized.agentId) {
    clauses.push('agent_id = ?');
    params.push(normalized.agentId);
  }
  if (normalized.sessionId) {
    clauses.push('session_id = ?');
    params.push(normalized.sessionId);
  }
  return {
    whereSql: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '',
    params,
  };
}

function hasGovernanceAuditFilters(filters: GovernanceAuditReviewFilters): boolean {
  const normalized = normalizeScopeContext(filters);
  return Boolean(
    filters.action
    || filters.decision
    || normalized.tenantId
    || normalized.userId
    || normalized.agentId
    || normalized.sessionId
  );
}

/**
 * Build a reusable row predicate for scope filtering without re-normalizing each row scan.
 *
 * @param scope - Requested scope used for filtering.
 * @returns Predicate that returns `true` when a row remains visible.
 */
export function createScopeFilterPredicate<T extends Record<string, unknown>>(
  scope: ScopeContext,
): (row: T) => boolean {
  const normalized = normalizeScopeContext(scope);
  if (!hasScopeConstraints(normalized)) {
    return () => false;
  }

  return (row: T) => {
    return matchesExactScope(row.tenant_id, normalized.tenantId)
      && matchesExactScope(row.user_id, normalized.userId)
      && matchesExactScope(row.agent_id, normalized.agentId)
      && matchesExactScope(row.session_id, normalized.sessionId);
  };
}

/**
 * Review governance audit rows and aggregate counts for a filtered governance window.
 *
 * @param database - Database connection that stores governance state.
 * @param filters - Optional audit filters and row limit.
 * @returns Review rows plus aggregate counts for the matching audit window.
 */
export function reviewGovernanceAudit(
  database: Database.Database,
  filters: GovernanceAuditReviewFilters = {},
): GovernanceAuditReviewResult {
  ensureGovernanceRuntime(database);
  const allowUnscoped = filters.allowUnscoped === true;
  // Security: audit enumeration requires explicit scope filters or admin override
  if (!allowUnscoped && !hasGovernanceAuditFilters(filters)) {
    console.warn('[scope-governance] Unscoped governance audit enumeration blocked; explicit filters or allowUnscoped=true required.');
    return {
      rows: [],
      summary: {
        totalMatching: 0,
        returnedRows: 0,
        byAction: {},
        byDecision: {},
        latestCreatedAt: null,
      },
    };
  }
  const { whereSql, params } = buildGovernanceAuditWhereClause(filters);
  const limit = Number.isInteger(filters.limit) && (filters.limit ?? 0) > 0
    ? Math.trunc(filters.limit as number)
    : 50;

  const rows = database.prepare(`
    SELECT
      id,
      action,
      decision,
      memory_id,
      logical_key,
      tenant_id,
      user_id,
      agent_id,
      session_id,
      reason,
      metadata,
      created_at
    FROM governance_audit
    ${whereSql}
    ORDER BY id DESC
    LIMIT ?
  `).all(...params, limit) as Array<{
    id: number;
    action: string;
    decision: GovernanceAuditEntry['decision'];
    memory_id: number | null;
    logical_key: string | null;
    tenant_id: string | null;
    user_id: string | null;
    agent_id: string | null;
    session_id: string | null;
    reason: string | null;
    metadata: string | null;
    created_at: string;
  }>;

  const summaryRow = database.prepare(`
    SELECT
      COUNT(*) AS total_matching,
      MAX(created_at) AS latest_created_at
    FROM governance_audit
    ${whereSql}
  `).get(...params) as {
    total_matching: number;
    latest_created_at: string | null;
  };
  const aggregateRows = database.prepare(`
    SELECT
      'action' AS aggregate_kind,
      action AS aggregate_key,
      COUNT(*) AS aggregate_count
    FROM governance_audit
    ${whereSql}
    GROUP BY action
    UNION ALL
    SELECT
      'decision' AS aggregate_kind,
      decision AS aggregate_key,
      COUNT(*) AS aggregate_count
    FROM governance_audit
    ${whereSql}
    GROUP BY decision
  `).all(...params, ...params) as Array<{
    aggregate_kind: 'action' | 'decision';
    aggregate_key: string;
    aggregate_count: number;
  }>;

  const totalMatching = summaryRow.total_matching;
  const byActionRows = aggregateRows.filter((row) => row.aggregate_kind === 'action');
  const byDecisionRows = aggregateRows.filter((row) => row.aggregate_kind === 'decision');

  return {
    rows: rows.map((row) => ({
      id: row.id,
      action: row.action,
      decision: row.decision,
      memoryId: row.memory_id,
      logicalKey: row.logical_key,
      tenantId: row.tenant_id ?? undefined,
      userId: row.user_id ?? undefined,
      agentId: row.agent_id ?? undefined,
      sessionId: row.session_id ?? undefined,
      reason: row.reason,
      metadata: parseAuditMetadata(row.metadata),
      createdAt: row.created_at,
    })),
    summary: {
      totalMatching,
      returnedRows: rows.length,
      byAction: Object.fromEntries(byActionRows.map((row) => [row.aggregate_key, row.aggregate_count])),
      byDecision: Object.fromEntries(byDecisionRows.map((row) => [row.aggregate_key as GovernanceAuditEntry['decision'], row.aggregate_count])),
      latestCreatedAt: summaryRow.latest_created_at,
    },
  };
}

/**
 * Benchmark scope filtering with a reusable predicate for rollout and safety checks.
 *
 * @param rows - Candidate rows that include governance scope columns.
 * @param scope - Requested scope used for filtering.
 * @param options - Optional iteration count.
 * @returns Timing and match counts for the benchmark run.
 */
export function benchmarkScopeFilter<T extends Record<string, unknown>>(
  rows: T[],
  scope: ScopeContext,
  options: ScopeFilterBenchmarkOptions = {},
): ScopeFilterBenchmarkResult {
  const iterations = Number.isInteger(options.iterations) && (options.iterations ?? 0) > 0
    ? Math.trunc(options.iterations as number)
    : 1;
  const predicate = createScopeFilterPredicate(scope);
  let matchedRows = 0;
  const startedAt = process.hrtime.bigint();

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    matchedRows = 0;
    for (const row of rows) {
      if (predicate(row)) {
        matchedRows += 1;
      }
    }
  }

  const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
  return {
    iterations,
    totalRows: rows.length,
    matchedRows,
    filteredRows: rows.length - matchedRows,
    elapsedMs,
    averageMsPerIteration: elapsedMs / iterations,
  };
}

/**
 * Filter result rows to the tenant, actor, and session scope in force.
 *
 * @param rows - Candidate rows that include governance scope columns.
 * @param scope - Requested scope used for filtering.
 * @returns Rows that remain visible after governance filtering.
 */
export function filterRowsByScope<T extends Record<string, unknown>>(rows: T[], scope: ScopeContext): T[] {
  return rows.filter(createScopeFilterPredicate(scope));
}
