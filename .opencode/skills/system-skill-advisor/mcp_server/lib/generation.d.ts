import { type AdvisorErrorClass } from './error-diagnostics.js';
export type AdvisorGenerationStatus = 'ok' | 'recovered' | 'unavailable';
export type AdvisorGenerationRecoveryPath = 'regenerate' | 'unrecoverable';
/** Persistent workspace generation counter status for advisor freshness probes. */
export interface AdvisorGenerationSnapshot {
    readonly generation: number;
    readonly sourceSignature: string | null;
    readonly status: AdvisorGenerationStatus;
    readonly reason: string | null;
    readonly recoveryPath: AdvisorGenerationRecoveryPath | null;
    readonly errorClass?: AdvisorErrorClass;
    readonly errorMessage?: string;
}
/** Resolve the persistent generation-counter path for a workspace. */
export declare function getAdvisorGenerationPath(workspaceRoot: string): string;
/** Read or recover the advisor generation counter for freshness checks. */
export declare function readAdvisorGeneration(workspaceRoot: string): AdvisorGenerationSnapshot;
/** Increment the advisor generation counter after source-affecting writes. */
export declare function incrementAdvisorGeneration(workspaceRoot: string): AdvisorGenerationSnapshot;
/** Clear process-local generation observations for tests. */
export declare function clearAdvisorGenerationMemory(): void;
//# sourceMappingURL=generation.d.ts.map