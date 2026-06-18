// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Apply Orchestrator
// ───────────────────────────────────────────────────────────────

import { appendFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { DATABASE_DIR } from '../core/config.js';
import * as graphDb from './code-graph-db.js';
import { buildReadinessBlock, type CodeGraphReadinessBlock } from './readiness-contract.js';
import {
  classifyExcludeRules,
  resolveExcludeRuleConfidence,
  type ClassifiedExcludeRule,
} from './exclude-rule-classifier.js';
import {
  rollbackBadApply,
  snapshotKnownGoodTriplet,
  recoverSqliteCorruption,
  previewRollbackTarget,
  pruneApplyArtifacts,
  type RecoveryProcedureResult,
} from './recovery-procedures.js';
import {
  DEFAULT_GOLD_BATTERY_PATH,
  type VerifyResult,
} from './gold-query-verifier.js';
import {
  runGoldBattery,
  type GoldBatteryRunResult,
} from './gold-battery-runner.js';
import { persistApplyMetadata, type ApplyResultStatus } from './apply-metadata.js';
import { handleCodeGraphScan, type ScanArgs } from '../handlers/scan.js';
import { handleCodeGraphStatus } from '../handlers/status.js';
import { CODE_GRAPH_DEFAULTS } from './config-defaults.js';

export type ApplyStalenessState = 'fresh' | 'soft-stale' | 'hard-stale';
export type ApplyOperation = 'rescan' | 'prune-excludes' | 'repair-nodes' | 'recover-sqlite-corruption' | 'rollback-bad-apply';
export type { GoldBatteryRunResult } from './gold-battery-runner.js';

export interface ApplyStateInput {
  freshness?: string;
  canonicalReadiness?: string;
  trustState?: string;
  action?: string;
  totalNodes?: number;
  totalFiles?: number;
  staleFiles?: string[];
  staleFileCount?: number;
  gitHeadDrift?: boolean;
  schemaVersion?: number;
  expectedSchemaVersion?: number;
  lastPersistedAt?: string | null;
  verification?: Pick<VerifyResult, 'passed' | 'overall_pass_rate' | 'edge_focus_pass_rate' | 'pass_policy'> | null;
}

export interface ApplyClassification {
  state: ApplyStalenessState;
  reasons: string[];
  canSelfHeal: boolean;
  scanIncremental: boolean | null;
}

export interface CodeGraphApplyArgs {
  rootDir?: string;
  operation?: ApplyOperation;
  confirm?: boolean;
  dryRun?: boolean;
  crashRootCauseAddressed?: boolean;
  quarantineOlderThanDays?: number;
  lowTierOptIn?: boolean;
  excludePatterns?: string[];
  batteryPath?: string;
  includeDetails?: boolean;
}

export interface ApplyOrchestratorOptions {
  dbDir?: string;
  auditDir?: string;
  now?: () => Date;
  status?: () => Promise<ApplyStateInput>;
  scan?: (args: ScanArgs) => Promise<unknown>;
  battery?: () => Promise<GoldBatteryRunResult>;
  excludeRuleConfidencePath?: string;
}

export interface ApplyRunResult {
  status: ApplyResultStatus;
  operation: ApplyOperation;
  classification: ApplyClassification;
  auditLogPath: string;
  preflight: GoldBatteryRunResult;
  postflight?: GoldBatteryRunResult;
  recovery?: RecoveryProcedureResult;
  excludeRules?: ClassifiedExcludeRule[];
  repairNodes?: {
    eligible: string[];
    skippedReason?: string;
  };
  /** Concrete next step when the run refused to proceed. */
  requiredAction?: string;
  /** Restore target a rollback would use (reported by rollback dry-runs). */
  rollbackTarget?: string | null;
  message: string;
}

/** Operations that move or replace the live database triplet on disk. */
const DESTRUCTIVE_OPERATIONS: ReadonlySet<ApplyOperation> = new Set([
  'recover-sqlite-corruption',
  'rollback-bad-apply',
]);

const DEFAULT_QUARANTINE_AGE_DAYS = CODE_GRAPH_DEFAULTS.quarantineAgeDays;

function parseMcpJson(response: { content: Array<{ text: string }> }): unknown {
  const text = response.content[0]?.text;
  if (!text) {
    throw new Error('MCP response was empty');
  }
  return JSON.parse(text) as unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

async function defaultStatus(): Promise<ApplyStateInput> {
  const parsed = parseMcpJson(await handleCodeGraphStatus());
  if (!isRecord(parsed)) {
    throw new Error('code_graph_status returned a non-object payload');
  }
  const data = isRecord(parsed.data) ? parsed.data : {};
  const readiness = isRecord(data.readiness) ? data.readiness : {};
  const lastGoldVerification = isRecord(data.lastGoldVerification) ? data.lastGoldVerification : null;
  return {
    freshness: typeof data.freshness === 'string' ? data.freshness : undefined,
    canonicalReadiness: typeof data.canonicalReadiness === 'string' ? data.canonicalReadiness : undefined,
    trustState: typeof data.trustState === 'string' ? data.trustState : undefined,
    action: typeof readiness.action === 'string' ? readiness.action : undefined,
    totalNodes: typeof data.totalNodes === 'number' ? data.totalNodes : undefined,
    totalFiles: typeof data.totalFiles === 'number' ? data.totalFiles : undefined,
    lastPersistedAt: typeof data.lastPersistedAt === 'string' ? data.lastPersistedAt : null,
    verification: lastGoldVerification as ApplyStateInput['verification'],
  };
}

function runDefaultScan(args: ScanArgs): Promise<unknown> {
  return handleCodeGraphScan(args);
}

function auditDir(options: ApplyOrchestratorOptions): string {
  const dir = resolve(options.auditDir ?? join(options.dbDir ?? DATABASE_DIR, 'apply-audit'));
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  return dir;
}

function auditLogPath(options: ApplyOrchestratorOptions): string {
  const ts = (options.now ?? (() => new Date()))().toISOString().replace(/[:.]/g, '-');
  return join(auditDir(options), `apply-${ts}.jsonl`);
}

function appendAudit(path: string, event: string, payload: Record<string, unknown>, now: () => Date): void {
  appendFileSync(path, JSON.stringify({
    timestamp: now().toISOString(),
    event,
    ...payload,
  }) + '\n', { mode: 0o600 });
}

export function classifyApplyState(input: ApplyStateInput): ApplyClassification {
  const reasons: string[] = [];
  const staleFileCount = input.staleFileCount ?? input.staleFiles?.length ?? 0;
  const schemaMismatch = input.expectedSchemaVersion !== undefined
    && input.schemaVersion !== undefined
    && input.schemaVersion !== input.expectedSchemaVersion;
  const batteryFailed = input.verification
    ? input.verification.passed === false
    || input.verification.overall_pass_rate < input.verification.pass_policy.overall_pass_rate
    || input.verification.edge_focus_pass_rate < input.verification.pass_policy.edge_focus_pass_rate
    : false;

  if (input.freshness === 'empty' || input.freshness === 'error') {
    reasons.push(`freshness=${input.freshness}`);
  }
  if (input.trustState === 'absent' || input.trustState === 'unavailable') {
    reasons.push(`trustState=${input.trustState}`);
  }
  if (input.gitHeadDrift === true) {
    reasons.push('git HEAD drift detected');
  }
  if (staleFileCount > 50) {
    reasons.push(`${staleFileCount} stale files exceed soft-stale boundary`);
  }
  if (schemaMismatch) {
    reasons.push(`schema mismatch ${input.schemaVersion} != ${input.expectedSchemaVersion}`);
  }
  if (input.lastPersistedAt === null) {
    reasons.push('missing lastPersistedAt');
  }
  if (batteryFailed) {
    reasons.push('gold battery failed pass floors');
  }

  if (reasons.length > 0) {
    return {
      state: 'hard-stale',
      reasons,
      canSelfHeal: false,
      scanIncremental: false,
    };
  }

  if (input.freshness === 'fresh' && input.canonicalReadiness === 'ready' && input.trustState === 'live') {
    return {
      state: 'fresh',
      reasons: ['graph is fresh and trusted'],
      canSelfHeal: false,
      scanIncremental: null,
    };
  }

  if (
    input.freshness === 'stale'
    && staleFileCount <= 50
    && (input.action === undefined || input.action === 'selective_reindex' || input.action === 'none')
  ) {
    return {
      state: 'soft-stale',
      reasons: staleFileCount > 0 ? [`${staleFileCount} stale file(s)`] : ['soft stale readiness action'],
      canSelfHeal: true,
      scanIncremental: true,
    };
  }

  return {
    state: 'hard-stale',
    reasons: [`unclassified stale state: freshness=${input.freshness ?? 'unknown'}`],
    canSelfHeal: false,
    scanIncremental: false,
  };
}

function chooseOperation(requested: ApplyOperation | undefined, classification: ApplyClassification): ApplyOperation {
  if (requested) {
    return requested;
  }
  return classification.state === 'fresh' ? 'rescan' : 'rescan';
}

function summarizeBattery(result: GoldBatteryRunResult): Record<string, unknown> {
  return {
    passed: result.passed,
    queryCount: result.queryCount,
    overallPassRate: result.overall_pass_rate,
    edgeFocusPassRate: result.edge_focus_pass_rate,
    passPolicy: result.effectivePassPolicy,
    missingSymbols: result.missingSymbols,
  };
}

// Read-only classification of a prune-excludes request. Sharing this between
// the pre-snapshot gate and the dispatch path keeps the confirm/opt-in
// decision identical on both sides, so the gate can refuse a tier before any
// snapshot is taken rather than letting dispatch throw into the rollback path.
type PruneClassification = {
  artifact: ReturnType<typeof resolveExcludeRuleConfidence>;
  classified: ClassifiedExcludeRule[];
  mediumBlocked: boolean;
  lowBlocked: boolean;
};

function classifyPruneRequest(args: CodeGraphApplyArgs, options: ApplyOrchestratorOptions): PruneClassification {
  const patterns = args.excludePatterns ?? [];
  const artifact = resolveExcludeRuleConfidence(options.excludeRuleConfidencePath);
  if (!artifact) {
    return {
      artifact: null,
      classified: patterns.map((pattern) => ({ pattern, tier: 'unknown' as const })),
      mediumBlocked: false,
      lowBlocked: false,
    };
  }
  const classified = classifyExcludeRules(artifact, patterns);
  return {
    artifact,
    classified,
    mediumBlocked: classified.some((entry) => entry.tier === 'medium') && args.confirm !== true,
    lowBlocked: classified.some((entry) => entry.tier === 'low') && args.lowTierOptIn !== true,
  };
}

// Returns the quarantined parser_skip_list files old enough to be triage
// candidates. repair-nodes only REPORTS these; the skip-list is intentionally
// not self-healing, so nothing here re-parses, clears, or otherwise repairs
// them. The SELECT runs against the already-open apply-pipeline database (the
// pre-flight battery and classification open it well before dispatch).
function computeRepairEligible(args: CodeGraphApplyArgs): string[] {
  const thresholdMs = (args.quarantineOlderThanDays ?? DEFAULT_QUARANTINE_AGE_DAYS) * 24 * 60 * 60 * 1000;
  const cutoff = Date.now() - thresholdMs;
  const rows = graphDb.getDb().prepare(`
    SELECT file_path, last_seen_at
    FROM parser_skip_list
    ORDER BY last_seen_at ASC, file_path ASC
    LIMIT 50
  `).all() as Array<{ file_path: string; last_seen_at: string }>;
  return rows
    .filter((row) => {
      const seenAt = Date.parse(row.last_seen_at);
      return Number.isFinite(seenAt) && seenAt <= cutoff;
    })
    .map((row) => row.file_path);
}

async function dispatchOperation(
  operation: ApplyOperation,
  args: CodeGraphApplyArgs,
  classification: ApplyClassification,
  options: ApplyOrchestratorOptions,
  currentRunKnownGoodDir?: string,
): Promise<{
  recovery?: RecoveryProcedureResult;
  excludeRules?: ClassifiedExcludeRule[];
  repairNodes?: ApplyRunResult['repairNodes'];
  requiredAction?: string;
}> {
  const scan = options.scan ?? runDefaultScan;
  const dbDir = options.dbDir ?? DATABASE_DIR;

  switch (operation) {
    case 'rescan':
      await scan({
        rootDir: args.rootDir,
        incremental: classification.scanIncremental ?? false,
      });
      return {};
    case 'recover-sqlite-corruption':
      return {
        recovery: await recoverSqliteCorruption({
          dbDir,
          auditDir: options.auditDir,
          now: options.now,
          scan: (scanArgs) => scan({ rootDir: args.rootDir, incremental: scanArgs.incremental }),
        }),
      };
    case 'rollback-bad-apply':
      return {
        recovery: await rollbackBadApply({
          dbDir,
          auditDir: options.auditDir,
          now: options.now,
          scan: (scanArgs) => scan({ rootDir: args.rootDir, incremental: scanArgs.incremental }),
          excludeKnownGoodDirs: currentRunKnownGoodDir ? [currentRunKnownGoodDir] : [],
        }),
      };
    case 'prune-excludes': {
      const patterns = args.excludePatterns ?? [];
      // Fall back to the shipped default confidence artifact when the caller
      // supplies no explicit path, so real MCP requests are actually
      // classified instead of every pattern collapsing to 'unknown' (which
      // would silently apply nothing and never gate). A missing/unreadable
      // default degrades to the conservative unknown-everything no-op.
      const { artifact, classified, mediumBlocked, lowBlocked } = classifyPruneRequest(args, options);
      if (!artifact) {
        // With no artifact every pattern is 'unknown' and nothing is applied.
        // Surface that as a requiredAction when the caller actually passed
        // patterns, so a missing/stripped default artifact is not reported as
        // a silent success with the exclusions quietly skipped.
        return {
          excludeRules: classified,
          ...(patterns.length > 0
            ? { requiredAction: 'No exclude-rule confidence artifact resolved, so all patterns are unclassified and no exclusions were applied. Restore the shipped default artifact or pass an explicit excludeRuleConfidencePath.' }
            : {}),
        };
      }
      // Defensive backstop: the pre-snapshot gate already refuses these tiers
      // without confirmation, so reaching here blocked means the gate was
      // bypassed (or state shifted mid-run). Throwing rolls back, which is
      // acceptable only for that genuine race, not the common confirm-omission.
      if (mediumBlocked) {
        throw new Error('medium-tier exclude patterns require confirm=true');
      }
      if (lowBlocked) {
        throw new Error('low-tier exclude patterns require lowTierOptIn=true');
      }
      const excludeGlobs = classified
        .filter((entry) => entry.tier === 'high' || entry.tier === 'medium' || entry.tier === 'low')
        .map((entry) => entry.pattern);
      if (excludeGlobs.length > 0) {
        await scan({
          rootDir: args.rootDir,
          incremental: false,
          excludeGlobs,
        });
      }
      return { excludeRules: classified };
    }
    case 'repair-nodes': {
      if (args.crashRootCauseAddressed !== true) {
        return {
          repairNodes: {
            eligible: [],
            skippedReason: 'crashRootCauseAddressed is not true',
          },
        };
      }
      // Triage only: report the stale parser_skip_list candidates so an
      // operator can manually re-include them after fixing the root cause. We
      // deliberately do NOT re-parse here — the skip-list is intentionally not
      // self-healing (an incremental scan re-skips quarantined files), so a
      // scan would be a misleading no-op for these entries.
      const eligible = computeRepairEligible(args);
      return { repairNodes: { eligible } };
    }
    default:
      throw new Error(`Unsupported apply operation: ${operation satisfies never}`);
  }
}

function recordApplyMetadata(result: {
  status: ApplyResultStatus;
  battery?: GoldBatteryRunResult;
  now: () => Date;
}): void {
  persistApplyMetadata({
    status: result.status,
    batteryPassRate: result.battery?.overall_pass_rate ?? null,
    now: result.now,
  });
}

export async function applyCodeGraph(
  args: CodeGraphApplyArgs = {},
  options: ApplyOrchestratorOptions = {},
): Promise<ApplyRunResult> {
  const now = options.now ?? (() => new Date());
  const logPath = auditLogPath(options);
  const runBattery = options.battery ?? (() => runGoldBattery({
    batteryPath: args.batteryPath ?? DEFAULT_GOLD_BATTERY_PATH,
    includeDetails: args.includeDetails,
  }));

  const preflight = await runBattery();
  appendAudit(logPath, 'preflight_battery', summarizeBattery(preflight), now);
  if (!preflight.passed) {
    const classification = classifyApplyState({ verification: preflight });
    recordApplyMetadata({ status: 'aborted', battery: preflight, now });
    appendAudit(logPath, 'abort', { reason: 'preflight battery failed' }, now);
    return {
      status: 'aborted',
      operation: args.operation ?? 'rescan',
      classification,
      auditLogPath: logPath,
      preflight,
      message: 'Pre-flight gold battery failed; apply aborted before mutation.',
    };
  }

  const statusInput = await (options.status ?? defaultStatus)();
  const classification = classifyApplyState({
    ...statusInput,
    verification: statusInput.verification ?? preflight,
  });
  const operation = chooseOperation(args.operation, classification);
  appendAudit(logPath, 'classification', {
    state: classification.state,
    reasons: classification.reasons,
    operation,
  }, now);

  if (classification.state === 'fresh' && args.operation === undefined) {
    const postflight = await runBattery();
    appendAudit(logPath, 'postflight_battery', summarizeBattery(postflight), now);
    recordApplyMetadata({ status: args.dryRun ? 'dry-run' : 'noop', battery: postflight, now });
    return {
      status: args.dryRun ? 'dry-run' : 'noop',
      operation,
      classification,
      auditLogPath: logPath,
      preflight,
      postflight,
      message: 'Graph is already fresh; no apply operation was needed.',
    };
  }

  if (classification.state === 'hard-stale' && args.confirm !== true) {
    recordApplyMetadata({ status: 'aborted', battery: preflight, now });
    appendAudit(logPath, 'abort', {
      reason: 'hard-stale requires confirm=true',
      hardStaleReasons: classification.reasons,
    }, now);
    return {
      status: 'aborted',
      operation,
      classification,
      auditLogPath: logPath,
      preflight,
      message: 'Hard-stale recovery requires confirm=true before mutation.',
    };
  }

  if (args.dryRun === true) {
    const postflight = await runBattery();
    appendAudit(logPath, 'postflight_battery', summarizeBattery(postflight), now);
    recordApplyMetadata({ status: 'dry-run', battery: postflight, now });
    // A rollback preview must use the SAME target selection as the live
    // path, or the preview names a different directory than the run restores.
    const rollbackTarget = operation === 'rollback-bad-apply'
      ? previewRollbackTarget({ dbDir: options.dbDir, auditDir: options.auditDir })
      : undefined;
    return {
      status: 'dry-run',
      operation,
      classification,
      auditLogPath: logPath,
      preflight,
      postflight,
      ...(rollbackTarget !== undefined ? { rollbackTarget } : {}),
      message: operation === 'rollback-bad-apply'
        ? (rollbackTarget
          ? `Dry run completed; rollback would restore ${rollbackTarget}.`
          : 'Dry run completed; NO known-good snapshot exists to restore — a live rollback would quarantine the current database without restoring anything.')
        : 'Dry run completed; operation dispatch was skipped.',
    };
  }

  // Destructive operations move or replace the live database triplet; they
  // require explicit confirmation REGARDLESS of staleness classification.
  // This gate must sit before the known-good snapshot so a refused run
  // leaves no artifact in the snapshot chain.
  if (DESTRUCTIVE_OPERATIONS.has(operation) && args.confirm !== true) {
    recordApplyMetadata({ status: 'aborted', battery: preflight, now });
    appendAudit(logPath, 'abort', { reason: `${operation} requires confirm=true` }, now);
    return {
      status: 'aborted',
      operation,
      classification,
      auditLogPath: logPath,
      preflight,
      requiredAction: `re-run with confirm=true to execute ${operation}`,
      message: `${operation} moves or replaces the live database and requires confirm=true before mutation.`,
    };
  }

  // Refuse repair-nodes up front instead of dispatching into a skip that
  // postflight would then report as a committed apply — a misleading no-op.
  if (operation === 'repair-nodes' && args.crashRootCauseAddressed !== true) {
    recordApplyMetadata({ status: 'aborted', battery: preflight, now });
    appendAudit(logPath, 'abort', { reason: 'repair-nodes requires crashRootCauseAddressed=true' }, now);
    return {
      status: 'aborted',
      operation,
      classification,
      auditLogPath: logPath,
      preflight,
      requiredAction: 'fix the parser crash root cause, then re-run with crashRootCauseAddressed=true',
      message: 'repair-nodes refused: crashRootCauseAddressed is not true.',
    };
  }

  // Refuse a confirm/opt-in-gated prune BEFORE the snapshot. The tier checks
  // are read-only, so evaluating them here lets an unconfirmed medium/low-tier
  // request abort cleanly. Previously the same refusal threw from inside
  // dispatch — after the snapshot — landing in the rollback catch, which
  // quarantined the live triplet and reindexed (more destructive than the
  // confirmed run) and reported 'rolled-back' for a mere missing flag.
  if (operation === 'prune-excludes') {
    const prunePlan = classifyPruneRequest(args, options);
    if (prunePlan.mediumBlocked || prunePlan.lowBlocked) {
      const requiredAction = prunePlan.mediumBlocked
        ? 're-run with confirm=true to apply medium-tier exclude patterns'
        : 're-run with lowTierOptIn=true to apply low-tier exclude patterns';
      recordApplyMetadata({ status: 'aborted', battery: preflight, now });
      appendAudit(logPath, 'abort', { reason: requiredAction }, now);
      return {
        status: 'aborted',
        operation,
        classification,
        auditLogPath: logPath,
        preflight,
        excludeRules: prunePlan.classified,
        requiredAction,
        message: 'Exclude-pattern tier requires explicit opt-in before mutation.',
      };
    }
  }

  const knownGoodDir = snapshotKnownGoodTriplet({
    dbDir: options.dbDir,
    auditDir: options.auditDir,
    now,
  });
  appendAudit(logPath, 'known_good_snapshot', { knownGoodDir }, now);

  let dispatchResult: Awaited<ReturnType<typeof dispatchOperation>>;
  try {
    dispatchResult = await dispatchOperation(operation, args, classification, options, knownGoodDir);
    appendAudit(logPath, 'operation_dispatched', { operation, dispatchResult }, now);
  } catch (error) {
    // Failure-path rollback deliberately does NOT exclude the snapshot taken
    // at the start of this run: that snapshot holds the pre-dispatch state,
    // which is exactly what a failed mutation must restore. Only the
    // operator-invoked rollback operation excludes its own snapshot (which
    // would otherwise capture the suspect state being rolled back).
    const recovery = await rollbackBadApply({
      dbDir: options.dbDir,
      auditDir: options.auditDir,
      now,
      scan: (scanArgs) => (options.scan ?? runDefaultScan)({ rootDir: args.rootDir, incremental: scanArgs.incremental }),
    });
    appendAudit(logPath, 'rollback', {
      reason: error instanceof Error ? error.message : String(error),
      recovery,
    }, now);
    // The recovery can itself fail (no known-good snapshot to restore, or the
    // restore left no usable triplet). Reporting 'rolled-back' regardless would
    // claim the live database was recovered when it is actually quarantined and
    // unrestored. Inspect the recovery result and tell the operator the truth.
    const rollbackSucceeded = recovery.status === 'ok' && recovery.restored !== false;
    if (!rollbackSucceeded) {
      recordApplyMetadata({ status: 'rollback-failed', battery: preflight, now });
      return {
        status: 'rollback-failed',
        operation,
        classification,
        auditLogPath: logPath,
        preflight,
        recovery,
        requiredAction: 'rollback did not restore a clean database triplet; restore from a known-good snapshot manually and investigate the quarantined triplet before re-running',
        message: 'Apply operation failed and rollback did NOT restore a clean triplet; the live database is quarantined.',
      };
    }
    recordApplyMetadata({ status: 'rolled-back', battery: preflight, now });
    return {
      status: 'rolled-back',
      operation,
      classification,
      auditLogPath: logPath,
      preflight,
      recovery,
      message: 'Apply operation failed; rollback executed.',
    };
  }

  const postflight = await runBattery();
  appendAudit(logPath, 'postflight_battery', summarizeBattery(postflight), now);

  if (!postflight.passed) {
    const recovery = await rollbackBadApply({
      dbDir: options.dbDir,
      auditDir: options.auditDir,
      now,
      scan: (scanArgs) => (options.scan ?? runDefaultScan)({ rootDir: args.rootDir, incremental: scanArgs.incremental }),
    });
    appendAudit(logPath, 'rollback', {
      reason: 'postflight battery failed',
      recovery,
    }, now);
    const rollbackSucceeded = recovery.status === 'ok' && recovery.restored !== false;
    if (!rollbackSucceeded) {
      recordApplyMetadata({ status: 'rollback-failed', battery: postflight, now });
      return {
        status: 'rollback-failed',
        operation,
        classification,
        auditLogPath: logPath,
        preflight,
        postflight,
        recovery,
        ...dispatchResult,
        requiredAction: 'rollback did not restore a clean database triplet; restore from a known-good snapshot manually and investigate the quarantined triplet before re-running',
        message: 'Post-flight gold battery failed and rollback did NOT restore a clean triplet; the live database is quarantined.',
      };
    }
    recordApplyMetadata({ status: 'rolled-back', battery: postflight, now });
    return {
      status: 'rolled-back',
      operation,
      classification,
      auditLogPath: logPath,
      preflight,
      postflight,
      recovery,
      ...dispatchResult,
      message: 'Post-flight gold battery failed; rollback executed.',
    };
  }

  recordApplyMetadata({ status: 'committed', battery: postflight, now });
  appendAudit(logPath, 'commit', { operation }, now);

  // Retention runs only after a verified commit — never on refusal or
  // rollback paths, where a pruned directory could be the restore target.
  // The current run's snapshot is explicitly protected.
  try {
    const retention = pruneApplyArtifacts({
      dbDir: options.dbDir,
      auditDir: options.auditDir,
      now,
      protectDirs: [knownGoodDir],
    });
    if (retention.prunedDirs.length > 0 || retention.errors.length > 0) {
      appendAudit(logPath, 'artifact_retention', {
        pruned: retention.prunedDirs.length,
        kept: retention.keptKnownGoodDirs.length,
        errors: retention.errors,
      }, now);
    }
  } catch (retentionError) {
    appendAudit(logPath, 'artifact_retention', {
      errors: [retentionError instanceof Error ? retentionError.message : String(retentionError)],
    }, now);
  }

  return {
    status: 'committed',
    operation,
    classification,
    auditLogPath: logPath,
    preflight,
    postflight,
    ...dispatchResult,
    message: 'Apply operation committed after post-flight gold battery passed.',
  };
}

export function buildReadinessForApplyState(input: ApplyStateInput): CodeGraphReadinessBlock {
  return buildReadinessBlock({
    freshness: input.freshness === 'fresh' || input.freshness === 'stale' || input.freshness === 'empty' || input.freshness === 'error'
      ? input.freshness
      : 'error',
    action: input.action === 'none' || input.action === 'selective_reindex' || input.action === 'full_scan'
      ? input.action
      : 'none',
    inlineIndexPerformed: false,
    reason: input.freshness ? `apply state freshness=${input.freshness}` : 'apply state unavailable',
  });
}
