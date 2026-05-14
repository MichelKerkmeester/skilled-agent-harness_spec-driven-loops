import { type CodeGraphReadinessBlock } from '../lib/readiness-contract.js';
export interface DetectChangesArgs {
    /** Unified-diff text (e.g. `git diff` output). */
    readonly diff: string;
    /** Workspace root; defaults to `process.cwd()`. */
    readonly rootDir?: string;
}
export type DetectChangesStatus = 'ok' | 'blocked' | 'parse_error' | 'error';
export interface AffectedSymbol {
    readonly symbolId: string;
    readonly fqName: string;
    readonly name: string;
    readonly kind: string;
    readonly filePath: string;
    readonly startLine: number;
    readonly endLine: number;
}
export interface DetectChangesResult {
    readonly status: DetectChangesStatus;
    readonly affectedSymbols: AffectedSymbol[];
    /** Populated when `status === 'blocked'` or `status === 'error'`. */
    readonly blockedReason?: string;
    readonly timestamp: string;
    /** Per-file roll-up so callers can see which paths were touched. */
    readonly affectedFiles: string[];
    /** Readiness envelope mirrored from other code-graph handlers. */
    readonly readiness: CodeGraphReadinessBlock;
}
interface MCPResponse {
    content: Array<{
        type: 'text';
        text: string;
    }>;
}
/** Handle the `detect_changes` MCP tool call. */
export declare function handleDetectChanges(args: DetectChangesArgs): Promise<MCPResponse>;
export {};
//# sourceMappingURL=detect-changes.d.ts.map