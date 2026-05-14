// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Apply Orchestrator
// ───────────────────────────────────────────────────────────────
import { appendFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { DATABASE_DIR } from '../core/config.js';
import * as graphDb from './code-graph-db.js';
import { buildReadinessBlock } from './readiness-contract.js';
import { classifyExcludeRules, loadExcludeRuleConfidence, } from './exclude-rule-classifier.js';
import { rollbackBadApply, snapshotKnownGoodTriplet, recoverPartialScanFailure, recoverSqliteCorruption, } from './recovery-procedures.js';
import { DEFAULT_GOLD_BATTERY_PATH, } from './gold-query-verifier.js';
import { runGoldBattery, } from './gold-battery-runner.js';
import { persistApplyMetadata } from './apply-metadata.js';
import { handleCodeGraphScan } from '../handlers/scan.js';
import { handleCodeGraphStatus } from '../handlers/status.js';
const DEFAULT_QUARANTINE_AGE_DAYS = 14;
function parseMcpJson(response) {
    const text = response.content[0]?.text;
    if (!text) {
        throw new Error('MCP response was empty');
    }
    return JSON.parse(text);
}
function isRecord(value) {
    return typeof value === 'object' && value !== null;
}
async function defaultStatus() {
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
        verification: lastGoldVerification,
    };
}
function runDefaultScan(args) {
    return handleCodeGraphScan(args);
}
function auditDir(options) {
    const dir = resolve(options.auditDir ?? join(options.dbDir ?? DATABASE_DIR, 'apply-audit'));
    mkdirSync(dir, { recursive: true, mode: 0o700 });
    return dir;
}
function auditLogPath(options) {
    const ts = (options.now ?? (() => new Date()))().toISOString().replace(/[:.]/g, '-');
    return join(auditDir(options), `apply-${ts}.jsonl`);
}
function appendAudit(path, event, payload, now) {
    appendFileSync(path, JSON.stringify({
        timestamp: now().toISOString(),
        event,
        ...payload,
    }) + '\n', { mode: 0o600 });
}
export function classifyApplyState(input) {
    const reasons = [];
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
    if (input.freshness === 'stale'
        && staleFileCount <= 50
        && (input.action === undefined || input.action === 'selective_reindex' || input.action === 'none')) {
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
function chooseOperation(requested, classification) {
    if (requested) {
        return requested;
    }
    return classification.state === 'fresh' ? 'rescan' : 'rescan';
}
function summarizeBattery(result) {
    return {
        passed: result.passed,
        queryCount: result.queryCount,
        overallPassRate: result.overall_pass_rate,
        edgeFocusPassRate: result.edge_focus_pass_rate,
        passPolicy: result.effectivePassPolicy,
        missingSymbols: result.missingSymbols,
    };
}
async function dispatchOperation(operation, args, classification, options) {
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
                }),
            };
        case 'prune-excludes': {
            const artifactPath = options.excludeRuleConfidencePath;
            const patterns = args.excludePatterns ?? [];
            if (!artifactPath) {
                return { excludeRules: patterns.map((pattern) => ({ pattern, tier: 'unknown' })) };
            }
            const classified = classifyExcludeRules(loadExcludeRuleConfidence(artifactPath), patterns);
            const mediumBlocked = classified.some((entry) => entry.tier === 'medium') && args.confirm !== true;
            const lowBlocked = classified.some((entry) => entry.tier === 'low') && args.lowTierOptIn !== true;
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
            const thresholdMs = (args.quarantineOlderThanDays ?? DEFAULT_QUARANTINE_AGE_DAYS) * 24 * 60 * 60 * 1000;
            const cutoff = Date.now() - thresholdMs;
            const rows = graphDb.getDb().prepare(`
        SELECT file_path, last_seen_at
        FROM parser_skip_list
        ORDER BY last_seen_at ASC, file_path ASC
        LIMIT 50
      `).all();
            const eligible = rows
                .filter((row) => {
                const seenAt = Date.parse(row.last_seen_at);
                return Number.isFinite(seenAt) && seenAt <= cutoff;
            })
                .map((row) => row.file_path);
            if (eligible.length > 0) {
                await scan({ rootDir: args.rootDir, incremental: true });
            }
            return { repairNodes: { eligible } };
        }
        default:
            throw new Error(`Unsupported apply operation: ${operation}`);
    }
}
function recordApplyMetadata(result) {
    persistApplyMetadata({
        status: result.status,
        batteryPassRate: result.battery?.overall_pass_rate ?? null,
        now: result.now,
    });
}
export async function applyCodeGraph(args = {}, options = {}) {
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
        return {
            status: 'dry-run',
            operation,
            classification,
            auditLogPath: logPath,
            preflight,
            postflight,
            message: 'Dry run completed; operation dispatch was skipped.',
        };
    }
    const knownGoodDir = snapshotKnownGoodTriplet({
        dbDir: options.dbDir,
        auditDir: options.auditDir,
        now,
    });
    appendAudit(logPath, 'known_good_snapshot', { knownGoodDir }, now);
    let dispatchResult;
    try {
        dispatchResult = await dispatchOperation(operation, args, classification, options);
        appendAudit(logPath, 'operation_dispatched', { operation, dispatchResult }, now);
    }
    catch (error) {
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
export function buildReadinessForApplyState(input) {
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
//# sourceMappingURL=apply-orchestrator.js.map