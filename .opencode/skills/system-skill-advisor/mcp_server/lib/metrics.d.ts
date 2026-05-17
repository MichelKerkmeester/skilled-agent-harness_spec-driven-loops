import type { AdvisorHookFreshness, AdvisorHookStatus, AdvisorRuntime } from './skill-advisor-brief.js';
export declare const ADVISOR_RUNTIME_VALUES: readonly ["claude", "gemini", "copilot", "codex"];
export declare const ADVISOR_HOOK_STATUS_VALUES: readonly ["ok", "skipped", "stale", "degraded", "fail_open"];
export declare const ADVISOR_HOOK_FRESHNESS_VALUES: readonly ["live", "stale", "absent", "unavailable"];
export declare const ADVISOR_ERROR_CODE_VALUES: readonly ["TIMEOUT", "SCRIPT_MISSING", "SQLITE_BUSY", "PARSE_FAIL", "SIGNAL_KILLED", "GENERATION_COUNTER_CORRUPT", "PYTHON_MISSING", "NONZERO_EXIT", "SQLITE_BUSY_EXHAUSTED", "DELETED_SKILL", "UNKNOWN"];
export type AdvisorErrorCode = (typeof ADVISOR_ERROR_CODE_VALUES)[number];
export type AdvisorMetricType = 'counter' | 'histogram' | 'gauge';
export type AdvisorOutcome = 'accepted' | 'corrected' | 'ignored';
export interface AdvisorMetricDefinition {
    readonly name: string;
    readonly type: AdvisorMetricType;
    readonly labels: readonly string[];
}
export interface AdvisorHookDiagnosticRecord {
    readonly timestamp: string;
    readonly runtime: AdvisorRuntime;
    readonly status: AdvisorHookStatus;
    readonly freshness: AdvisorHookFreshness;
    readonly durationMs: number;
    readonly cacheHit: boolean;
    readonly errorCode?: AdvisorErrorCode;
    readonly errorDetails?: string;
    readonly skillLabel?: string;
    readonly generation?: number;
}
export interface AdvisorHookHealthSection {
    readonly key: 'advisor-hook-health';
    readonly lastInvocations: readonly AdvisorHookDiagnosticRecord[];
    readonly rollingCacheHitRate: number;
    readonly rollingP95Ms: number;
    readonly rollingFailOpenRate: number;
}
export interface AdvisorHookAlertThresholds {
    readonly failOpenWarnRate: number;
    readonly failOpenPageRate: number;
    readonly cacheHitP95WarnMs: number;
    readonly cacheHitP95PageMs: number;
}
export interface AdvisorHookMetricSnapshot {
    readonly definitions: readonly AdvisorMetricDefinition[];
    readonly records: readonly AdvisorHookDiagnosticRecord[];
}
export interface AdvisorHookOutcomeRecord {
    readonly timestamp: string;
    readonly runtime: AdvisorRuntime;
    readonly outcome: AdvisorOutcome;
    readonly skillLabel: string;
    readonly correctedSkillLabel?: string;
}
export interface AdvisorHookOutcomeSummary {
    readonly records: readonly AdvisorHookOutcomeRecord[];
    readonly totals: {
        readonly accepted: number;
        readonly corrected: number;
        readonly ignored: number;
    };
}
export declare const ADVISOR_HOOK_METRIC_DEFINITIONS: readonly [{
    readonly name: "speckit_advisor_hook_duration_ms";
    readonly type: "histogram";
    readonly labels: readonly ["runtime", "status", "freshness", "cacheHit"];
}, {
    readonly name: "speckit_advisor_hook_invocations_total";
    readonly type: "counter";
    readonly labels: readonly ["runtime", "status"];
}, {
    readonly name: "speckit_advisor_hook_cache_hits_total";
    readonly type: "counter";
    readonly labels: readonly ["runtime"];
}, {
    readonly name: "speckit_advisor_hook_cache_misses_total";
    readonly type: "counter";
    readonly labels: readonly ["runtime"];
}, {
    readonly name: "speckit_advisor_hook_fail_open_total";
    readonly type: "counter";
    readonly labels: readonly ["runtime", "errorCode"];
}, {
    readonly name: "speckit_advisor_hook_freshness_state";
    readonly type: "gauge";
    readonly labels: readonly ["runtime", "state"];
}];
/** Return the stable metric definitions emitted by advisor hook diagnostics. */
export declare function getAdvisorHookMetricDefinitions(): readonly AdvisorMetricDefinition[];
/** Read alert thresholds from environment with conservative defaults. */
export declare function getAdvisorHookAlertThresholds(): AdvisorHookAlertThresholds;
/** Build a prompt-safe diagnostic record from hook execution metadata. */
export declare function createAdvisorHookDiagnosticRecord(input: {
    readonly runtime: AdvisorRuntime;
    readonly status: AdvisorHookStatus;
    readonly freshness: AdvisorHookFreshness;
    readonly durationMs: number;
    readonly cacheHit: boolean;
    readonly errorCode?: unknown;
    readonly errorDetails?: unknown;
    readonly skillLabel?: string | null;
    readonly generation?: number;
    readonly timestamp?: string;
}): AdvisorHookDiagnosticRecord;
/** Validate that a diagnostic record matches the prompt-free closed schema. */
export declare function validateAdvisorHookDiagnosticRecord(value: unknown): value is AdvisorHookDiagnosticRecord;
/** Serialize a validated diagnostic record for JSONL emission. */
export declare function serializeAdvisorHookDiagnosticRecord(record: AdvisorHookDiagnosticRecord): string;
export declare function persistAdvisorHookDiagnosticRecord(workspaceRoot: string, record: AdvisorHookDiagnosticRecord): Promise<string>;
export declare function readAdvisorHookDiagnosticRecords(workspaceRoot: string, limit?: number): AdvisorHookDiagnosticRecord[];
/** Build the rolling health section shown in advisor observability output. */
export declare function buildAdvisorHookHealthSection(records: readonly AdvisorHookDiagnosticRecord[]): AdvisorHookHealthSection;
export declare function readAdvisorHookHealthSection(workspaceRoot: string): AdvisorHookHealthSection;
export declare function advisorHookDiagnosticsPath(workspaceRoot: string): string;
export declare function createAdvisorHookOutcomeRecord(input: {
    readonly runtime: AdvisorRuntime;
    readonly outcome: AdvisorOutcome;
    readonly skillLabel: string;
    readonly correctedSkillLabel?: string | null;
    readonly timestamp?: string;
}): AdvisorHookOutcomeRecord;
export declare function validateAdvisorHookOutcomeRecord(value: unknown): value is AdvisorHookOutcomeRecord;
export declare function persistAdvisorHookOutcomeRecord(workspaceRoot: string, record: AdvisorHookOutcomeRecord): Promise<string>;
export declare function readAdvisorHookOutcomeRecords(workspaceRoot: string, limit?: number): AdvisorHookOutcomeRecord[];
export declare function summarizeAdvisorHookOutcomeRecords(workspaceRoot: string): AdvisorHookOutcomeSummary;
export declare function advisorHookOutcomesPath(workspaceRoot: string): string;
/** Small in-memory collector for advisor hook metrics and health snapshots. */
export declare class AdvisorHookMetricsCollector {
    private readonly records;
    record(record: AdvisorHookDiagnosticRecord): void;
    snapshot(): AdvisorHookMetricSnapshot;
    healthSection(): AdvisorHookHealthSection;
    reset(): void;
}
export declare const SPECKIT_GRAPH_QUERY_MODES: readonly ["outline", "blast_radius", "relationship"];
export declare const SPECKIT_GRAPH_OUTCOMES: readonly ["success", "error"];
export declare const SPECKIT_GRAPH_LANGUAGES: readonly ["javascript", "typescript", "python", "bash"];
export declare const SPECKIT_GRAPH_EDGE_TYPES: readonly ["CONTAINS", "CALLS", "IMPORTS", "EXPORTS", "EXTENDS", "IMPLEMENTS", "TESTED_BY", "DECORATES", "OVERRIDES", "TYPE_OF"];
export declare const SPECKIT_SCORER_LANES: readonly ["explicit_author", "lexical", "graph_causal", "derived_generated", "semantic_shadow"];
export declare const SPECKIT_PROMPT_CACHE_LAYERS: readonly ["exact", "near_dup"];
export declare const SPECKIT_CONFIDENCE_BUCKETS: readonly [0, 0.5, 0.7, 0.8, 0.9, 1];
export type SpeckitMetricName = 'spec_kit.graph.scan_duration_ms' | 'spec_kit.graph.parse_duration_ms' | 'spec_kit.graph.query_latency_ms' | 'spec_kit.graph.query_cache_hits_total' | 'spec_kit.graph.query_cache_misses_total' | 'spec_kit.graph.edge_detection_total' | 'spec_kit.graph.partial_persist_retries_total' | 'spec_kit.graph.blast_radius_failure_total' | 'spec_kit.scorer.lane_contribution' | 'spec_kit.scorer.fusion_live_weight_share' | 'spec_kit.scorer.primary_intent_bonus_applied_total' | 'spec_kit.scorer.confidence_brier_score' | 'spec_kit.scorer.near_dup_cache_miss_total' | 'spec_kit.freshness.state_transitions_total' | 'spec_kit.freshness.source_signature_bumps_total' | 'spec_kit.freshness.prompt_cache_hit_ratio' | 'spec_kit.advisor.recommendation_emitted_total' | 'spec_kit.advisor.recommendation_confidence_brackets';
export declare const SPECKIT_METRIC_DEFINITIONS: readonly [{
    readonly name: "spec_kit.graph.scan_duration_ms";
    readonly type: "histogram";
    readonly labels: readonly ["outcome"];
}, {
    readonly name: "spec_kit.graph.parse_duration_ms";
    readonly type: "histogram";
    readonly labels: readonly ["language", "outcome"];
}, {
    readonly name: "spec_kit.graph.query_latency_ms";
    readonly type: "histogram";
    readonly labels: readonly ["mode", "freshness_state"];
}, {
    readonly name: "spec_kit.graph.query_cache_hits_total";
    readonly type: "counter";
    readonly labels: readonly ["mode"];
}, {
    readonly name: "spec_kit.graph.query_cache_misses_total";
    readonly type: "counter";
    readonly labels: readonly ["mode"];
}, {
    readonly name: "spec_kit.graph.edge_detection_total";
    readonly type: "counter";
    readonly labels: readonly ["edge_type", "runtime"];
}, {
    readonly name: "spec_kit.graph.partial_persist_retries_total";
    readonly type: "counter";
    readonly labels: readonly [];
}, {
    readonly name: "spec_kit.graph.blast_radius_failure_total";
    readonly type: "counter";
    readonly labels: readonly ["code"];
}, {
    readonly name: "spec_kit.scorer.lane_contribution";
    readonly type: "gauge";
    readonly labels: readonly ["lane", "skill_id"];
}, {
    readonly name: "spec_kit.scorer.fusion_live_weight_share";
    readonly type: "gauge";
    readonly labels: readonly ["lane"];
}, {
    readonly name: "spec_kit.scorer.primary_intent_bonus_applied_total";
    readonly type: "counter";
    readonly labels: readonly ["skill_id"];
}, {
    readonly name: "spec_kit.scorer.confidence_brier_score";
    readonly type: "histogram";
    readonly labels: readonly [];
}, {
    readonly name: "spec_kit.scorer.near_dup_cache_miss_total";
    readonly type: "counter";
    readonly labels: readonly ["cache_layer"];
}, {
    readonly name: "spec_kit.freshness.state_transitions_total";
    readonly type: "counter";
    readonly labels: readonly ["from_state", "to_state"];
}, {
    readonly name: "spec_kit.freshness.source_signature_bumps_total";
    readonly type: "counter";
    readonly labels: readonly [];
}, {
    readonly name: "spec_kit.freshness.prompt_cache_hit_ratio";
    readonly type: "gauge";
    readonly labels: readonly [];
}, {
    readonly name: "spec_kit.advisor.recommendation_emitted_total";
    readonly type: "counter";
    readonly labels: readonly ["runtime", "freshness_state"];
}, {
    readonly name: "spec_kit.advisor.recommendation_confidence_brackets";
    readonly type: "histogram";
    readonly labels: readonly [];
}];
export interface SpeckitMetricSample {
    readonly name: SpeckitMetricName;
    readonly value: number;
    readonly labels: Readonly<Record<string, string>>;
    readonly timestamp: number;
}
/** Returns true iff SPECKIT_METRICS_ENABLED env var is set to 'true'. */
export declare function isSpeckitMetricsEnabled(): boolean;
/**
 * In-memory collector for the spec_kit.* metric namespace. Counters and
 * gauges are keyed by stable label-set; histograms retain raw samples.
 * Emission MUST be gated by isSpeckitMetricsEnabled() at the call site.
 */
export declare class SpeckitMetricsCollector {
    private readonly counters;
    private readonly gauges;
    private readonly histograms;
    private readonly brier;
    private promptCacheHits;
    private promptCacheMisses;
    incrementCounter(name: SpeckitMetricName, labels?: Record<string, string>, by?: number): void;
    setGauge(name: SpeckitMetricName, value: number, labels?: Record<string, string>): void;
    recordHistogram(name: SpeckitMetricName, value: number, labels?: Record<string, string>): void;
    /** Record a single Brier-score observation; mean is exposed via snapshot. */
    recordBrierScore(observation: number, labels?: Record<string, string>): void;
    /** Bump prompt-cache hit/miss tallies feeding metric #14. */
    recordPromptCacheOutcome(outcome: 'hit' | 'miss'): void;
    /** Place a recommendation confidence in the closest fixed bucket boundary. */
    recordConfidenceBracket(confidence: number): void;
    /** Returns the live unique-series count (cardinality meta-gauge). */
    uniqueSeriesCount(): number;
    snapshot(): {
        readonly definitions: readonly AdvisorMetricDefinition[];
        readonly counters: ReadonlyMap<string, number>;
        readonly gauges: ReadonlyMap<string, number>;
        readonly histograms: ReadonlyMap<string, readonly number[]>;
        readonly brierMean: ReadonlyMap<string, number>;
        readonly metricsUniqueSeriesCount: number;
    };
    reset(): void;
}
/** Process-wide collector. Callers MUST gate emission with isSpeckitMetricsEnabled(). */
export declare const speckitMetrics: SpeckitMetricsCollector;
/** Returns the static metric definitions for the spec_kit.* namespace. */
export declare function getSpeckitMetricDefinitions(): readonly AdvisorMetricDefinition[];
//# sourceMappingURL=metrics.d.ts.map