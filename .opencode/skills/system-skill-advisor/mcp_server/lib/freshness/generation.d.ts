import { type GenerationMetadata } from '../../schemas/generation-metadata.js';
import { type CacheInvalidationEvent } from './cache-invalidation.js';
import type { SkillGraphTrustState } from './trust-state.js';
export interface PublishGenerationOptions {
    readonly workspaceRoot: string;
    readonly changedPaths?: readonly string[];
    readonly reason: string;
    readonly state?: SkillGraphTrustState;
    readonly sourceSignature?: string | null;
}
export interface PublishGenerationResult {
    readonly metadata: GenerationMetadata;
    readonly invalidation: CacheInvalidationEvent;
}
export declare function getSkillGraphGenerationPath(workspaceRoot: string): string;
declare function acquireGenerationLock(filePath: string): () => void;
export declare function readSkillGraphGeneration(workspaceRoot: string): GenerationMetadata;
export declare function publishSkillGraphGeneration(options: PublishGenerationOptions): PublishGenerationResult;
export declare function publishAfterCommit<T>(commit: () => T | Promise<T>, options: PublishGenerationOptions): Promise<{
    result: T;
    publication: PublishGenerationResult;
}>;
export declare const __testables: {
    acquireGenerationLock: typeof acquireGenerationLock;
    GENERATION_LOCK_STALE_MS: number;
};
export {};
//# sourceMappingURL=generation.d.ts.map