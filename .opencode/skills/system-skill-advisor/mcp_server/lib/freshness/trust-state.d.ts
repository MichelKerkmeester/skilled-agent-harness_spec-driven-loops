import { SKILL_GRAPH_TRUST_STATE_VALUES, isSkillGraphTrustState, type SkillGraphTrustState } from './trust-state-values.js';
export type GraphFreshness = 'fresh' | 'stale' | 'empty' | 'error';
export type StructuralReadiness = 'ready' | 'stale' | 'missing';
export { SKILL_GRAPH_TRUST_STATE_VALUES, isSkillGraphTrustState, type SkillGraphTrustState, };
export type StartupGraphState = 'ready' | 'stale' | 'empty' | 'missing' | 'error';
/**
 * Canonical alias used by callers that previously imported a custom
 * `TrustState` type. Use `SkillGraphTrustState` for new code.
 *
 * @deprecated Use `SkillGraphTrustState` directly. Kept for one release
 *   so in-flight branches keep compiling against the canonical vocabulary.
 */
export type TrustState = SkillGraphTrustState;
export interface TrustStateSnapshot {
    readonly state: SkillGraphTrustState;
    readonly reason: string | null;
    readonly generation: number;
    readonly checkedAt: string;
    readonly lastLiveAt: string | null;
}
export interface TrustStateInput {
    readonly hasSources: boolean;
    readonly hasArtifact: boolean;
    readonly sourceChanged: boolean;
    readonly daemonAvailable: boolean;
    readonly generation: number;
    readonly reason?: string | null;
    readonly now?: Date;
    readonly lastLiveAt?: string | null;
}
export declare function createTrustState(input: TrustStateInput): TrustStateSnapshot;
export declare function failOpenTrustState(reason: string, generation?: number): TrustStateSnapshot;
export declare function isReaderUsable(state: SkillGraphTrustState): boolean;
//# sourceMappingURL=trust-state.d.ts.map