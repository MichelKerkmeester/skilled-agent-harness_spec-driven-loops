/** A single change hunk: contiguous added/removed/context lines. */
export interface DiffHunk {
    /** Pre-image line where the hunk begins (1-based). */
    readonly oldStart: number;
    /** Number of pre-image lines covered by the hunk (0 for pure-add). */
    readonly oldLines: number;
    /** Post-image line where the hunk begins (1-based). */
    readonly newStart: number;
    /** Number of post-image lines covered by the hunk (0 for pure-delete). */
    readonly newLines: number;
}
/** All hunks for one file, after stripping `a/`/`b/` prefixes. */
export interface DiffFile {
    /** Pre-image path (`/dev/null` for additions). */
    readonly oldPath: string;
    /** Post-image path (`/dev/null` for deletions). */
    readonly newPath: string;
    readonly hunks: DiffHunk[];
}
/** `parse_error` is surfaced via DiffParseResult's discriminant. */
export type DiffParseResult = {
    readonly status: 'ok';
    readonly files: DiffFile[];
} | {
    readonly status: 'parse_error';
    readonly reason: string;
};
/**
 * Parse a unified-diff document. Recognized headers:
 *   - `diff --git a/<path> b/<path>` (optional, ignored beyond serving as a section break)
 *   - `--- a/<path>` / `--- /dev/null`
 *   - `+++ b/<path>` / `+++ /dev/null`
 *   - `@@ -oldStart,oldLines +newStart,newLines @@`
 *
 * The body lines (` `, `+`, `-`) inside hunks are not retained —
 * `detect_changes` only needs hunk *ranges*, and discarding line
 * bodies keeps memory bounded for large diffs.
 *
 * Edge cases:
 *   - Empty input → `{ status: 'ok', files: [] }` (no diff = no changes).
 *   - Hunk before any file header → `parse_error`.
 *   - Malformed `@@` header → `parse_error`.
 *   - Files with no hunks (pure rename / mode-only changes) → kept
 *     in `files` with `hunks: []` so callers can still attribute
 *     touched files; they simply produce zero affected symbols.
 */
export declare function parseUnifiedDiff(diff: string): DiffParseResult;
/**
 * Compute whether two 1-based half-open line ranges overlap.
 * `aStart`..`aStart+aLines-1` overlaps `bStart`..`bStart+bLines-1`.
 *
 * Pure-add hunks (oldLines=0) and pure-delete hunks (newLines=0)
 * are handled by the caller — both sides are checked against the
 * same node range so an addition between two nodes can still be
 * attributed to whichever node covers `oldStart`.
 */
export declare function rangesOverlap(aStart: number, aLines: number, bStart: number, bLines: number): boolean;
//# sourceMappingURL=diff-parser.d.ts.map