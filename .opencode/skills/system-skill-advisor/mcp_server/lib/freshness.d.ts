import { type AdvisorGenerationRecoveryPath } from './generation.js';
import type { AdvisorEnvelopeMetadata } from './shared/shared-payload.js';
import { type AdvisorErrorClass } from './error-diagnostics.js';
export type AdvisorFreshnessState = AdvisorEnvelopeMetadata['freshness'];
export type AdvisorFallbackMode = 'sqlite' | 'json' | 'none';
/** Per-skill stat fingerprint used to suppress deleted or renamed skills. */
export interface AdvisorSkillFingerprint {
    readonly skillMdMtime: number;
    readonly skillMdSize: number;
    readonly skillMdHash: string;
    readonly graphMetaMtime: number | null;
    readonly graphMetaHash: string | null;
}
/** Machine-readable probe diagnostic for non-live advisor freshness states. */
export interface AdvisorFreshnessDiagnostics {
    readonly reason?: string;
    readonly missingSources?: string[];
    readonly recoveryPath?: AdvisorGenerationRecoveryPath;
    readonly errorClass?: AdvisorErrorClass;
    readonly errorMessage?: string;
}
/** Freshness snapshot consumed by downstream advisor brief producers. */
export interface AdvisorFreshnessResult {
    readonly state: AdvisorFreshnessState;
    readonly generation: number;
    readonly sourceSignature: string;
    readonly skillFingerprints: Map<string, AdvisorSkillFingerprint>;
    readonly fallbackMode: AdvisorFallbackMode;
    readonly probedAt: string;
    readonly diagnostics: AdvisorFreshnessDiagnostics | null;
}
export declare function computeAdvisorSourceSignature(workspaceRoot: string): string;
export declare function getAdvisorFreshness(workspaceRoot: string): AdvisorFreshnessResult;
//# sourceMappingURL=freshness.d.ts.map