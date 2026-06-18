// ───────────────────────────────────────────────────────────────
// MODULE: advisor_status Handler
// ───────────────────────────────────────────────────────────────

import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import Database from 'better-sqlite3';

import { computeAdvisorSourceSignature } from '../lib/freshness.js';
import { readSkillGraphGeneration } from '../lib/freshness/generation.js';
import { checkSqliteIntegrity } from '../lib/freshness/sqlite-integrity.js';
import { isGenuineCorruptionReason, resolveSkillGraphDbDir, DB_FILENAME } from '../lib/skill-graph/skill-graph-db.js';
import { createTrustState } from '../lib/freshness/trust-state.js';
import { getAdapter } from '../lib/embedders/registry.js';
import { getSemanticShadowRuntimeHealth } from '../lib/scorer/lanes/semantic-shadow.js';
import { DEFAULT_SCORER_WEIGHTS } from '../lib/scorer/weights-config.js';
import { errorMessage } from '../lib/utils/error-format.js';
import { redactDiagnosticText } from './skill-graph/response-envelope.js';
import {
  AdvisorStatusInputSchema,
  AdvisorStatusOutputSchema,
} from '../schemas/advisor-tool-schemas.js';

import type {
  AdvisorFreshness,
  AdvisorStatusInput,
  AdvisorStatusOutput,
} from '../schemas/advisor-tool-schemas.js';

type HandlerResponse = { content: Array<{ type: string; text: string }> };

const SKILL_ROOT = join('.opencode', 'skills');
const DEFAULT_MAX_METADATA_FILES = 5_000;
type SemanticLaneHealth = NonNullable<AdvisorStatusOutput['semanticLaneHealth']>;

function isFreshness(value: string): value is AdvisorFreshness {
  return value === 'live' || value === 'stale' || value === 'absent' || value === 'unavailable';
}

function parseDaemonPid(): number | undefined {
  const raw = process.env.SPECKIT_SKILL_GRAPH_DAEMON_PID;
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined;
}

function hasRunningDaemon(pid: number | undefined): boolean {
  if (!pid) {
    return false;
  }
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function fileMtimeMs(path: string): number {
  if (!existsSync(path)) return 0;
  const stat = statSync(path);
  return stat.mtimeMs;
}

function resolveSkillGraphDbPath(workspaceRoot: string): string {
  // Resolve through the writer's own resolver so the integrity probe always
  // targets the exact file the daemon writes. An env override wins for both;
  // otherwise the workspace root stands in for the writer's cwd, which match
  // in the normal single-root deployment.
  return join(resolveSkillGraphDbDir(workspaceRoot), DB_FILENAME);
}

// Per-(dbPath, generation, mtime) integrity verdict cache. A full quick_check
// scans the artifact, which is too costly to run on the recommend hot path;
// caching it lets recommend opt into corruption detection while paying the
// scan at most once per generation. The only events that can change on-disk
// integrity — a generation bump or an mtime change — invalidate the entry.
const integrityVerdictCache = new Map<string, { ok: true } | { ok: false; reason: string }>();

function checkSqliteIntegrityCached(
  dbPath: string,
  generation: number,
  mtimeMs: number,
): { ok: true } | { ok: false; reason: string } {
  const key = `${dbPath}::${generation}::${mtimeMs}`;
  const cached = integrityVerdictCache.get(key);
  if (cached) {
    return cached;
  }
  const result = checkSqliteIntegrity(dbPath);
  // Only the newest (path, generation, mtime) verdict is ever consulted, so a
  // single-entry cache is sufficient and self-bounding.
  integrityVerdictCache.clear();
  integrityVerdictCache.set(key, result);
  return result;
}

function tableExists(database: Database.Database, tableName: string): boolean {
  const row = database.prepare(`
    SELECT 1 AS present
    FROM sqlite_master
    WHERE type = 'table' AND name = ?
    LIMIT 1
  `).get(tableName) as { present: number } | undefined;
  return Boolean(row);
}

function metadataValue(database: Database.Database, key: string): string | null {
  if (!tableExists(database, 'vec_metadata')) return null;
  const row = database.prepare('SELECT value FROM vec_metadata WHERE key = ?').get(key) as { value: string } | undefined;
  return row?.value ?? null;
}

function countRows(database: Database.Database, sql: string): number {
  const row = database.prepare(sql).get() as { c: number } | undefined;
  return row?.c ?? 0;
}

function maxUpdatedAt(database: Database.Database, tableName: string): string | null {
  const row = database.prepare(`SELECT MAX(updated_at) AS updatedAt FROM ${tableName}`).get() as { updatedAt: string | null } | undefined;
  return row?.updatedAt ?? null;
}

function baseSemanticLaneHealth(disabledReason: string | null): SemanticLaneHealth {
  return {
    activeEmbedder: null,
    vectorCoverage: { embedded: 0, total: 0, ratio: 0 },
    dimMismatch: false,
    lastRefresh: null,
    disabledReason,
    laneEnabled: false,
    checkedAt: new Date().toISOString(),
  };
}

function readSemanticLaneHealth(dbPath: string): SemanticLaneHealth {
  const runtime = getSemanticShadowRuntimeHealth();
  if (!existsSync(dbPath)) {
    return baseSemanticLaneHealth(runtime.disabledReason ?? 'database_absent');
  }

  let database: Database.Database | null = null;
  try {
    database = new Database(dbPath, { readonly: true, fileMustExist: true });
    const total = tableExists(database, 'skill_nodes')
      ? countRows(database, 'SELECT COUNT(*) AS c FROM skill_nodes')
      : 0;
    const activeName = metadataValue(database, 'active_embedder_name');
    const activeDimRaw = metadataValue(database, 'active_embedder_dim');
    const activeDim = activeDimRaw ? Number.parseInt(activeDimRaw, 10) : 0;
    const hasActive = Boolean(activeName) && Number.isInteger(activeDim) && activeDim > 0;
    const adapter = activeName ? getAdapter(activeName) : undefined;
    const activeEmbedder = activeName
      ? { name: activeName, dim: Number.isInteger(activeDim) && activeDim > 0 ? activeDim : 0, adapterDim: adapter?.dim ?? null }
      : null;
    const tableName = hasActive ? `vec_${activeDim}` : null;
    const hasVecTable = tableName ? tableExists(database, tableName) : false;
    const embedded = hasVecTable
      ? countRows(database, `SELECT COUNT(*) AS c FROM ${tableName} WHERE embedding IS NOT NULL`)
      : (tableExists(database, 'skill_nodes') ? countRows(database, 'SELECT COUNT(*) AS c FROM skill_nodes WHERE embedding IS NOT NULL') : 0);
    const lastRefresh = hasVecTable && tableName ? maxUpdatedAt(database, tableName) : null;
    const dimMismatch = Boolean(activeEmbedder && activeEmbedder.adapterDim !== null && activeEmbedder.dim !== activeEmbedder.adapterDim);
    const disabledReason = dimMismatch
      ? 'dim_mismatch'
      : (!hasActive
          ? 'active_embedder_unset'
          : (!adapter
              ? 'adapter_unavailable'
              : (!hasVecTable
                  ? 'vector_table_missing'
                  : (total > 0 && embedded === 0 ? 'no_skill_vectors' : runtime.disabledReason))));
    return {
      activeEmbedder,
      vectorCoverage: {
        embedded,
        total,
        ratio: total > 0 ? Math.round((embedded / total) * 1_000_000) / 1_000_000 : 0,
      },
      dimMismatch,
      lastRefresh,
      disabledReason,
      laneEnabled: Boolean(hasActive && adapter && !dimMismatch && hasVecTable && embedded > 0 && !disabledReason),
      checkedAt: new Date().toISOString(),
    };
  } catch {
    return baseSemanticLaneHealth(runtime.disabledReason ?? 'health_unavailable');
  } finally {
    database?.close();
  }
}

function scanSkillMetadataFiles(
  skillRoot: string,
  maxFiles = DEFAULT_MAX_METADATA_FILES,
): { count: number; maxMtimeMs: number; truncated: boolean } {
  if (!existsSync(skillRoot)) return { count: 0, maxMtimeMs: 0, truncated: false };
  const pending = [skillRoot];
  let count = 0;
  let newest = 0;
  let truncated = false;
  while (pending.length > 0) {
    const current = pending.pop();
    if (!current) continue;
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const entryPath = join(current, entry.name);
      if (entry.isDirectory()) {
        pending.push(entryPath);
      } else if (entry.isFile() && entry.name === 'graph-metadata.json') {
        count += 1;
        newest = Math.max(newest, statSync(entryPath).mtimeMs);
        if (count >= maxFiles) {
          truncated = true;
          return { count, maxMtimeMs: newest, truncated };
        }
      }
    }
  }
  return { count, maxMtimeMs: newest, truncated };
}

/** Read advisor freshness state.
 *
 * Diagnostic-only: this function reports stale, absent, or unavailable advisor
 * state and does not rebuild it. Use `advisor_rebuild` to repair stale state.
 */
export function readAdvisorStatus(input: AdvisorStatusInput): AdvisorStatusOutput {
  const args = AdvisorStatusInputSchema.parse(input);
  const workspaceRoot = resolve(args.workspaceRoot);
  const dbPath = resolveSkillGraphDbPath(workspaceRoot);
  const skillRoot = join(workspaceRoot, SKILL_ROOT);
  const errors: string[] = [];

  try {
    const generation = readSkillGraphGeneration(workspaceRoot);
    const hasSources = existsSync(skillRoot);
    const hasArtifact = existsSync(dbPath);
    // Existence alone lets a corrupt-on-disk artifact report 'live' from the
    // generation counters, which makes advisor_rebuild skip the repair it
    // exists to perform. A read-only quick_check turns genuine corruption
    // into a stale signal so rebuild runs. Transient lock/IO failures are
    // excluded so contention never forces a spurious rebuild.
    const integrity = (hasArtifact && args.checkArtifactIntegrity === true)
      ? checkSqliteIntegrityCached(dbPath, generation.generation, fileMtimeMs(dbPath))
      : null;
    const artifactCorrupt = Boolean(
      integrity && !integrity.ok
        && integrity.reason !== 'SQLITE_ABSENT'
        && isGenuineCorruptionReason(integrity.reason),
    );
    if (artifactCorrupt && integrity && !integrity.ok) {
      errors.push(`advisor_status skill graph integrity check failed (${integrity.reason}); run advisor_rebuild`);
    }
    const sourceScan = scanSkillMetadataFiles(skillRoot, args.maxMetadataFiles ?? DEFAULT_MAX_METADATA_FILES);
    if (sourceScan.truncated) {
      errors.push(`advisor_status metadata scan capped at ${sourceScan.count} files`);
    }
    const sourceChanged = generation.state === 'stale'
      || (
        generation.sourceSignature
          ? computeAdvisorSourceSignature(workspaceRoot) !== generation.sourceSignature
          : hasArtifact && hasSources && sourceScan.maxMtimeMs > fileMtimeMs(dbPath)
      );
    const daemonPid = parseDaemonPid();
    const daemonAvailable = daemonPid === undefined ? true : hasRunningDaemon(daemonPid);
    // Only flag a daemon-evidence divergence when a PID file exists but the
    // process is gone. Missing PID file = daemon never started, not a
    // divergence between freshness artifacts and live process evidence.
    if (daemonPid !== undefined && !daemonAvailable && generation.state !== 'unavailable') {
      errors.push('advisor_status found freshness artifacts, but no live daemon PID/process evidence');
    }
    const state = isFreshness(generation.state) ? generation.state : 'unavailable';
    // Data is stale when sources are physically newer than the
    // artifact, regardless of stored sourceSignature semantics. This is the
    // stronger physical-evidence signal vs. signature mismatch which can
    // arise from benign workspace differences.
    const sourcesNewerThanArtifact = hasArtifact && hasSources
      && sourceScan.maxMtimeMs > fileMtimeMs(dbPath);
    const trustState = createTrustState({
      hasSources,
      hasArtifact,
      sourceChanged,
      daemonAvailable,
      generation: generation.generation,
      reason: generation.reason,
      lastLiveAt: state === 'live' ? generation.updatedAt : null,
    });
    // `freshness` describes data/artifact state (live/stale/absent/
    // unavailable from the generation file), while `trustState.state` is the
    // daemon-gated caller-trust axis. Keep them decoupled so callers reading
    // `freshness` see artifact health independent of daemon availability.
    // When physical evidence shows sources are newer than the DB, downgrade
    // a 'live' generation to 'stale' regardless of signature noise.
    const freshnessOutput: AdvisorFreshness = state === 'live'
      && (sourceChanged || artifactCorrupt || (!generation.sourceSignature && sourcesNewerThanArtifact))
      ? 'stale'
      : state;
    const output: AdvisorStatusOutput = {
      freshness: freshnessOutput,
      generation: generation.generation,
      trustState,
      lastGenerationBump: generation.updatedAt === new Date(0).toISOString() ? null : generation.updatedAt,
      lastScanAt: generation.updatedAt === new Date(0).toISOString() ? null : generation.updatedAt,
      skillCount: sourceScan.count,
      laneWeights: DEFAULT_SCORER_WEIGHTS,
      ...((args.includeSemanticHealth || args.debug) ? { semanticLaneHealth: readSemanticLaneHealth(dbPath) } : {}),
      ...(daemonPid ? { daemonPid } : {}),
      ...(errors.length > 0 ? { errors } : {}),
    };
    return AdvisorStatusOutputSchema.parse(output);
  } catch (error: unknown) {
    const message = redactDiagnosticText(errorMessage(error));
    const sourceScan = scanSkillMetadataFiles(skillRoot, args.maxMetadataFiles ?? DEFAULT_MAX_METADATA_FILES);
    const trustState = createTrustState({
      hasSources: existsSync(skillRoot),
      hasArtifact: existsSync(dbPath),
      sourceChanged: false,
      daemonAvailable: false,
      generation: 0,
      reason: 'ADVISOR_STATUS_UNAVAILABLE',
    });
    const output: AdvisorStatusOutput = {
      freshness: 'unavailable',
      generation: 0,
      trustState,
      lastGenerationBump: null,
      lastScanAt: null,
      skillCount: sourceScan.count,
      laneWeights: DEFAULT_SCORER_WEIGHTS,
      ...((args.includeSemanticHealth || args.debug) ? { semanticLaneHealth: readSemanticLaneHealth(dbPath) } : {}),
      errors: [message],
    };
    return AdvisorStatusOutputSchema.parse(output);
  }
}

/** Handle the advisor_status MCP tool request. */
export async function handleAdvisorStatus(args: unknown): Promise<HandlerResponse> {
  // The diagnostic surface opts into the artifact integrity probe by default
  // so operators see on-disk corruption; explicit input can still override it.
  const parsed = AdvisorStatusInputSchema.parse(args);
  const data = readAdvisorStatus({ ...parsed, checkArtifactIntegrity: parsed.checkArtifactIntegrity ?? true });
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data }, null, 2),
    }],
  };
}

/** Backward-compatible snake_case MCP handler alias. */
export const handle_advisor_status = handleAdvisorStatus;
