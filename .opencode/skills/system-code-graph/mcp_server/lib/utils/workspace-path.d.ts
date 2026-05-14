export interface CanonicalizedWorkspace {
    readonly canonicalWorkspace: string;
    readonly canonicalRootDir: string;
}
/**
 * Canonicalize the workspace root and a candidate `rootDir` via `realpathSync`.
 *
 * Returns `null` when either path is invalid or contains a broken symlink.
 * Callers are expected to surface a typed error response on `null`.
 */
export declare function canonicalizeWorkspacePaths(rootDir: string, workspaceRoot?: string): CanonicalizedWorkspace | null;
/**
 * Returns `true` iff `candidatePath` is the canonical workspace itself or a
 * descendant of it. Compares strings only — both inputs MUST already be
 * canonicalized via `realpathSync` (or equivalent) before being passed in.
 *
 * Centralized to keep the workspace-boundary invariant identical across
 * `handlers/scan.ts`, `handlers/verify.ts`, and `handlers/detect-changes.ts`.
 */
export declare function isWithinWorkspace(canonicalWorkspace: string, candidatePath: string): boolean;
/**
 * Throw-form of {@link isWithinWorkspace}. Used by callers (e.g. `verify.ts`)
 * that consume the discriminated-union failure shape via try/catch wrapping.
 */
export declare function assertWithinWorkspace(canonicalWorkspace: string, candidatePath: string, label: string): void;
//# sourceMappingURL=workspace-path.d.ts.map