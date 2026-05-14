import { type ClassifiedExcludeRule } from './exclude-rule-classifier.js';
import { type RecoveryProcedureResult } from './recovery-procedures.js';
import { type VerifyResult } from './gold-query-verifier.js';
import { type GoldBatteryRunResult } from './gold-battery-runner.js';
import { type ApplyResultStatus } from './apply-metadata.js';
import { type ScanArgs } from '../handlers/scan.js';
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
    message: string;
}
export declare function classifyApplyState(input: ApplyStateInput): ApplyClassification;
export declare function applyCodeGraph(args?: CodeGraphApplyArgs, options?: ApplyOrchestratorOptions): Promise<ApplyRunResult>;
export declare function buildReadinessForApplyState(input: ApplyStateInput): import("./readiness-contract.js").CodeGraphReadinessBlock;
//# sourceMappingURL=apply-orchestrator.d.ts.map