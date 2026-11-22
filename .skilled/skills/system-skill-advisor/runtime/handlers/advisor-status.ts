// ───────────────────────────────────────────────────────────────
// MODULE: advisor_status Handler
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import Database from 'better-sqlite3';

import { computeAdvisorSourceSignature } from '../lib/freshness.js';
import { readSkillGraphGeneration } from '../lib/freshness/generation.js';
import { checkSqliteIntegrity } from '../lib/freshness/sqlite-integrity.js';
import { createPrivateSkillLinkCheck } from '../lib/private-skill-target.js';
import {
  computeSkillMetadataContentHash,
  isGenuineCorruptionReason,
  resolveSkillGraphDbDir,
  DB_FILENAME,
} from '../lib/skill-graph/skill-graph-db.js';
import { createTrustState } from '../lib/freshness/trust-state.js';
import { DEFAULT_SCORER_WEIGHTS } from '../lib/scorer/weights-config.js';
import { readAdvisorHookHealthSection } from '../lib/metrics.js';
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

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS AND CONSTANTS
// ───────────────────────────────────────────────────────────────────

type HandlerResponse = { content: Array<{ type: string; text: string }> };
type IndexStaleness = NonNullable<AdvisorStatusOutput['indexStaleness']>;

const SKILL_ROOT = join('.skilled', 'skills');
const DEFAULT_MAX_METADATA_FILES = 5_000;

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

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

function readIndexStaleness(dbPath: string, workspaceRoot: string): IndexStaleness {
  const unavailable = (reason: string): IndexStaleness => ({
    state: 'unavailable',
    reason,
    trackedSkills: 0,
    freshSourceFiles: 0,
    changedSourceFiles: 0,
    missingSourceFiles: 0,
    staleSkillIds: [],
  });
  if (!existsSync(dbPath)) return unavailable('database_absent');

  let database: Database.Database | null = null;
  let result = unavailable('index_read_failed');
  try {
    database = new Database(dbPath, { readonly: true, fileMustExist: true });
    if (!tableExists(database, 'skill_nodes')) {
      result = unavailable('index_rows_absent');
    } else {
      const columns = database.pragma('table_info(skill_nodes)') as Array<{ name: string }>;
      const hasSourceColumns = columns.some((column) => column.name === 'source_path')
        && columns.some((column) => column.name === 'content_hash');
      if (!hasSourceColumns) {
        result = unavailable('index_rows_absent');
      } else {
        const rows = database.prepare(`
          SELECT id, source_path, content_hash
          FROM skill_nodes
          ORDER BY id
        `).all() as Array<{
          id: string;
          source_path: string | null;
          content_hash: string | null;
        }>;
        if (rows.length === 0) {
          result = unavailable('index_rows_absent');
        } else {
          let freshSourceFiles = 0;
          let changedSourceFiles = 0;
          let missingSourceFiles = 0;
          const staleSkillIds: string[] = [];

          for (const row of rows) {
            if (!row.source_path || row.source_path.trim().length === 0) {
              missingSourceFiles++;
              staleSkillIds.push(row.id);
              continue;
            }

            let content: string;
            try {
              content = readFileSync(resolve(workspaceRoot, row.source_path), 'utf8');
            } catch (error: unknown) {
              if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
                missingSourceFiles++;
                staleSkillIds.push(row.id);
                continue;
              }
              throw error;
            }

            if (row.content_hash === null
              || computeSkillMetadataContentHash(content) !== row.content_hash) {
              changedSourceFiles++;
              staleSkillIds.push(row.id);
              continue;
            }

            freshSourceFiles++;
          }

          const stale = changedSourceFiles + missingSourceFiles > 0;
          result = {
            state: stale ? 'stale' : 'fresh',
            reason: stale ? 'source_hash_mismatch' : null,
            trackedSkills: rows.length,
            freshSourceFiles,
            changedSourceFiles,
            missingSourceFiles,
            staleSkillIds: staleSkillIds.slice(0, 25),
          };
        }
      }
    }
  } catch {
    result = unavailable('index_read_failed');
  } finally {
    try {
      database?.close();
    } catch {
      result = unavailable('index_read_failed');
    }
  }

  return result;
}

function scanSkillMetadataFiles(
  skillRoot: string,
  maxFiles = DEFAULT_MAX_METADATA_FILES,
): { count: number; maxMtimeMs: number; truncated: boolean } {
  if (!existsSync(skillRoot)) return { count: 0, maxMtimeMs: 0, truncated: false };
  const isTrustedLink = createPrivateSkillLinkCheck(skillRoot);
  const skillRoots = readdirSync(skillRoot, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith('.') && (entry.isDirectory()
      || (entry.name.startsWith('local-')
        && entry.isSymbolicLink()
        && isTrustedLink(join(skillRoot, entry.name)))))
    .sort((left, right) => left.name.localeCompare(right.name));
  let count = 0;
  let newest = 0;
  let truncated = false;
  for (const entry of skillRoots) {
    const metadataPath = join(skillRoot, entry.name, 'graph-metadata.json');
    if (!existsSync(metadataPath)) continue;
    const metadataStat = statSync(metadataPath);
    if (!metadataStat.isFile()) continue;
    if (count >= maxFiles) {
      truncated = true;
      break;
    }
    count++;
    newest = Math.max(newest, metadataStat.mtimeMs);
  }
  return { count, maxMtimeMs: newest, truncated };
}

// ───────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

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
    const indexStaleness = readIndexStaleness(dbPath, workspaceRoot);
    if (indexStaleness.state === 'stale') {
      const staleSkillCount = indexStaleness.changedSourceFiles + indexStaleness.missingSourceFiles;
      errors.push(
        `advisor_status index content hashes differ from disk for ${staleSkillCount} skill${staleSkillCount === 1 ? '' : 's'}; run advisor_rebuild`,
      );
    }
    const sourceChanged = generation.state === 'stale'
      || indexStaleness.state === 'stale'
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
    const hookHealthSection = readAdvisorHookHealthSection(workspaceRoot);
    const output: AdvisorStatusOutput = {
      freshness: freshnessOutput,
      generation: generation.generation,
      trustState,
      lastGenerationBump: generation.updatedAt === new Date(0).toISOString() ? null : generation.updatedAt,
      lastScanAt: generation.updatedAt === new Date(0).toISOString() ? null : generation.updatedAt,
      skillCount: sourceScan.count,
      indexStaleness,
      laneWeights: DEFAULT_SCORER_WEIGHTS,
      // The p95 counts cache-hit invocations only, because a miss pays the
      // child-process cost that the alert thresholds are not set against.
      // A timestamp exists exactly when a record does, which is the condition
      // that decides whether the hook has reported anything yet.
      ...(hookHealthSection.lastRecordAt !== null
        ? {
            hookHealth: {
              invocations: hookHealthSection.lastInvocations.length,
              rollingP95Ms: hookHealthSection.rollingP95Ms,
              rollingFailOpenRate: hookHealthSection.rollingFailOpenRate,
              rollingCacheHitRate: hookHealthSection.rollingCacheHitRate,
              rollingDegradedRate: hookHealthSection.rollingDegradedRate,
              lastRecordAt: hookHealthSection.lastRecordAt,
            },
          }
        : {}),
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
      errors: [message],
    };
    return AdvisorStatusOutputSchema.parse(output);
  }
}

// ───────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ───────────────────────────────────────────────────────────────────

/** Handle the advisor_status command request. */
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
