import { type AdvisorEnvelopeFreshness, type AdvisorEnvelopeStatus, type SharedPayloadEnvelope } from './shared/shared-payload.js';
import { type AdvisorFreshnessResult } from './freshness.js';
import { type AdvisorThresholds } from './prompt-cache.js';
import { type AdvisorRecommendation, type AdvisorSubprocessErrorCode } from './subprocess.js';
import { type AdvisorErrorClass } from './error-diagnostics.js';
import { ADVISOR_RUNTIME_VALUES, isAdvisorRuntime, type AdvisorRuntime } from './advisor-runtime-values.js';
export { ADVISOR_RUNTIME_VALUES, isAdvisorRuntime, type AdvisorRuntime, };
export type AdvisorHookStatus = AdvisorEnvelopeStatus;
export type AdvisorHookFreshness = AdvisorEnvelopeFreshness;
export interface SkillAdvisorBriefOptions {
    readonly workspaceRoot: string;
    readonly runtime: AdvisorRuntime;
    readonly maxTokens?: number;
    readonly thresholdConfig?: AdvisorThresholds;
    readonly subprocessTimeoutMs?: number;
}
export interface AdvisorHookDiagnostics {
    readonly reason?: string;
    readonly errorCode?: AdvisorSubprocessErrorCode | 'UNCAUGHT_EXCEPTION' | 'ADVISOR_FRESHNESS_UNAVAILABLE';
    readonly errorClass?: AdvisorErrorClass;
    readonly errorMessage?: string;
    readonly policyReason?: string;
    readonly metalinguisticMention?: readonly string[];
    readonly skillNameSuppressions?: readonly string[];
    readonly staleReason?: string;
}
export interface AdvisorHookMetrics {
    readonly durationMs: number;
    readonly cacheHit: boolean;
    readonly subprocessInvoked: boolean;
    readonly retriesAttempted: number;
    readonly recommendationCount: number;
    readonly tokenCap: number;
}
export interface AdvisorHookResult {
    readonly status: AdvisorHookStatus;
    readonly freshness: AdvisorHookFreshness;
    readonly brief: string | null;
    readonly recommendations: AdvisorRecommendation[];
    readonly diagnostics: AdvisorHookDiagnostics | null;
    readonly metrics: AdvisorHookMetrics;
    readonly generatedAt: string;
    readonly sharedPayload: SharedPayloadEnvelope | null;
}
export declare const DEFAULT_ADVISOR_CONFIDENCE_THRESHOLD = 0.8;
export declare const DEFAULT_ADVISOR_UNCERTAINTY_THRESHOLD = 0.35;
export interface ResolvedAdvisorThresholdConfig {
    readonly confidenceThreshold: number;
    readonly uncertaintyThreshold: number;
    readonly confidenceOnly: boolean;
    readonly showRejections: boolean;
    readonly includeAttribution: boolean;
    readonly includeAbstainReasons: boolean;
}
export declare function resolveAdvisorThresholdConfig(thresholdConfig: AdvisorThresholds | undefined): ResolvedAdvisorThresholdConfig;
export declare function passingRecommendations(recommendations: readonly AdvisorRecommendation[], thresholdConfig: AdvisorThresholds | undefined): AdvisorRecommendation[];
export declare function buildAdvisorHookResultFromRecommendations(args: {
    readonly startedAt?: number;
    readonly freshnessResult: AdvisorFreshnessResult;
    readonly recommendations: readonly AdvisorRecommendation[];
    readonly thresholdConfig?: AdvisorThresholds;
    readonly maxTokens?: number;
    readonly diagnostics?: AdvisorHookDiagnostics | null;
    readonly metrics?: Partial<AdvisorHookMetrics>;
}): AdvisorHookResult;
/** Clear memoized advisor briefs for deterministic tests and session reset hooks. */
export declare function clearAdvisorBriefCacheForTests(): void;
/** Build the typed skill-advisor result consumed by all runtime hook renderers. */
export declare function buildSkillAdvisorBrief(prompt: string, options: SkillAdvisorBriefOptions): Promise<AdvisorHookResult>;
//# sourceMappingURL=skill-advisor-brief.d.ts.map