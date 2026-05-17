import type { AdvisorRecommendation } from './subprocess.js';
export interface AdvisorBriefRenderOptions {
    readonly tokenCap?: number;
    readonly thresholdConfig?: {
        readonly confidenceThreshold?: number;
        readonly uncertaintyThreshold?: number;
        readonly confidenceOnly?: boolean;
    };
}
export interface AdvisorBriefRenderableResult {
    readonly status: 'ok' | 'stale' | 'skipped' | 'degraded' | 'fail_open';
    readonly freshness: 'live' | 'stale' | 'absent' | 'unavailable';
    readonly recommendations: readonly AdvisorRecommendation[];
    readonly metrics?: {
        readonly tokenCap?: number;
    } | null;
    readonly sharedPayload?: {
        readonly metadata?: {
            readonly skillLabel?: string | null;
        } | null;
    } | null;
}
declare function sanitizeSkillLabel(skillLabel: string | null | undefined): string | null;
/**
 * Render the model-visible advisor brief from typed advisor output only.
 *
 * The renderer is the prompt-boundary guard: it ignores free-form reasons,
 * descriptions, stdout/stderr, and prompt text, and emits nothing when the
 * repository-authored skill label looks instruction-shaped after folding.
 */
export declare function renderAdvisorBrief(result: AdvisorBriefRenderableResult, options?: AdvisorBriefRenderOptions): string | null;
export declare function renderAdvisorTimeoutFallback(): string;
export { sanitizeSkillLabel };
//# sourceMappingURL=render.d.ts.map