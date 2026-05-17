import type { AdvisorThresholds } from './prompt-cache.js';
export interface AdvisorRecommendation {
    readonly skill: string;
    readonly kind?: string;
    readonly confidence: number;
    readonly uncertainty: number;
    readonly passes_threshold?: boolean;
    readonly reason?: string;
}
export type AdvisorSubprocessErrorCode = 'PYTHON_MISSING' | 'SCRIPT_MISSING' | 'SIGNAL_KILLED' | 'TIMEOUT' | 'JSON_PARSE_FAILED' | 'INVALID_JSON_SHAPE' | 'NON_ZERO_EXIT' | 'SQLITE_BUSY_EXHAUSTED' | 'SPAWN_ERROR';
export interface AdvisorSubprocessResult {
    readonly ok: boolean;
    readonly recommendations: AdvisorRecommendation[];
    readonly errorCode: AdvisorSubprocessErrorCode | null;
    readonly exitCode: number | null;
    readonly signal: NodeJS.Signals | null;
    readonly stderr: string | null;
    readonly durationMs: number;
    readonly retriesAttempted: number;
}
export interface AdvisorSubprocessOptions {
    readonly workspaceRoot: string;
    readonly timeoutMs?: number;
    readonly thresholdConfig?: AdvisorThresholds;
    readonly pythonBin?: string;
    readonly scriptPath?: string;
    readonly retryJitterMs?: () => number;
}
/** Run the Python skill advisor with prompt input carried over stdin. */
export declare function runAdvisorSubprocess(prompt: string, options: AdvisorSubprocessOptions): Promise<AdvisorSubprocessResult>;
//# sourceMappingURL=subprocess.d.ts.map