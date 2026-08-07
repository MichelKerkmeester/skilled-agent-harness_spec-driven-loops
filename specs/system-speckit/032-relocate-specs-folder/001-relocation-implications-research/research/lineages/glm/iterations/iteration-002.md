# Iteration 002 — Spec Kit Memory MCP Server Path Resolution (Q4)

**Focus:** Q4 — How does the Spec Kit Memory MCP server resolve the specs path, and would relocation break its path resolution or require config changes?
**Track:** memory-mcp
**Executor:** cli-devin / glm-5-2
**Date:** 2026-08-06

## Approach
Read `mcp-server/core/config.ts` (path constants + DB path resolution), grepped `context-server.ts` for scan-root / `.opencode` literals, and inspected `shared/gate-3-classifier.ts` + `shared/review-research-paths.cjs` for the spec-root vocabulary. Verified the indexer scan loop and the moved-folder description regenerator.

## Findings

### F2.1 — MCP server path resolution is cwd-relative + env-var-overridable, NOT hardcoded to `.opencode/specs`
`mcp-server/core/config.ts`:
- Line 156: `DEFAULT_BASE_PATH = process.env.MEMORY_BASE_PATH || process.cwd()` — base path is the process cwd (or an env override), not a hardcoded `.opencode/specs` literal.
- Lines 158-164: `ALLOWED_BASE_PATHS = [~/.claude, DEFAULT_BASE_PATH, cwd]` — boundary prefixes are cwd-based.
- Lines 63-101: DB paths resolve from `SPEC_KIT_DB_DIR` / `SPECKIT_DB_DIR` / `MEMORY_DB_PATH` env vars, else `DB_PATH` from `@spec-kit/shared/paths`, all resolved relative to cwd. Boundary check is against `[cwd, homedir, tmpdir]`.
**Verdict:** The MCP server's path *resolution* layer is relocation-transparent: as long as the server is launched from the repo root, cwd-relative resolution finds the new `specs/` location. No env-var reconfiguration is required for path resolution itself.
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/core/config.ts:63-101,156-164]

### F2.2 — CRITICAL CORRECTION: the startup indexer ALREADY scans BOTH `specs/` and `.opencode/specs/`
`mcp-server/context-server.ts` `getPendingRecoveryLocations` (lines 1303-1321):
```
for (const root of getStartupWorkspaceRoots(basePath)) {
    scanLocations.push(path.join(root, 'specs'));          // L1306 — root specs/
    scanLocations.push(path.join(root, '.opencode', 'specs')); // L1307 — .opencode/specs/
    ...
}
```
The indexer pushes **both** `<root>/specs` and `<root>/.opencode/specs` as scan locations. My iteration-1 grep read of line 1307 in isolation was misleading — line 1306 immediately precedes it and adds the root `specs/` location. **The MCP server's pending-recovery / startup scan is ALREADY dual-root and relocation-ready.** A relocated `specs/` tree at the repo root would be discovered and indexed without code change.
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/context-server.ts:1303-1321]

### F2.3 — The Gate 3 spec-root classifier is dual-root aware
`shared/gate-3-classifier.ts`:
- Line 126: `interface SpecRoot { label: '.opencode/specs' | 'specs'; absolutePath: string; }`
- Line 136: `const SPEC_ROOTS: readonly SpecRoot['label'][] = ['.opencode/specs', 'specs'];`
- Lines 381-382: path membership check for `.opencode/specs` (the `specs` label is handled via the SPEC_ROOTS array iteration).
`shared/review-research-paths.cjs` lines 258, 361: documents both `.opencode/specs` and `specs` as "approved specs roots" and refuses paths outside both.
**Verdict:** The classification/boundary layer that decides whether a path is a spec folder ALREADY treats `specs/` (root) as a first-class spec root alongside `.opencode/specs/`. Relocation does not require teaching the classifier about the new root — it already knows.
[SOURCE: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:125-136,381-382; shared/review-research-paths.cjs:258,361]

### F2.4 — One narrow hardcoded `.opencode/specs` literal remains in moved-folder description regeneration
`mcp-server/context-server.ts` line 1979 (inside `refreshMovedSpecFolder`):
```
const description = generatePerFolderDescription(folderPath, path.join(DEFAULT_BASE_PATH, '.opencode', 'specs'));
```
When a spec folder is detected as moved, this regenerates its per-folder description using `path.join(DEFAULT_BASE_PATH, '.opencode', 'specs')` as the specs base. If the folder now lives under root `specs/`, the second argument points at the old `.opencode/specs` base, so any relative-path computation inside `generatePerFolderDescription` would be computed against the wrong root. **Medium severity, narrow blast radius** — only the moved-folder refresh path is affected; normal indexing (F2.2) is dual-root. Fix: derive the specs base from the folder's actual parent root rather than hardcoding `.opencode/specs`.
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/context-server.ts:1978-1984]

### F2.5 — The only other MCP-server hardcoded literal is the FTS-corruption runbook (carried from F1.3)
`context-server.ts:242` hardcodes `.opencode/specs/system-spec-kit/026-.../bug-report-memory-db-corruption.md` as the FTS corruption runbook pointer. Low severity (diagnostic surface only). Confirmed no other `.opencode/specs` literals in the MCP server's path-resolution code paths beyond F2.4 and this one.
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/context-server.ts:242]

## What Worked
- Reading the full scan loop (lines 1303-1321) instead of trusting the isolated grep hit on line 1307 — caught the dual-root scan that a single-line read would have missed. **This is the "verify, don't assume" lesson: a grep hit without surrounding context inverted the conclusion.**
- Cross-checking the classifier (`shared/gate-3-classifier.ts`) confirmed the dual-root convention is systemic, not a one-off in the indexer.

## What Failed / Ruled Out
- Ruled out: "the MCP server hardcodes `.opencode/specs` as its scan root and would break under relocation." FALSE — it scans both roots (F2.2). The initial grep-only impression was wrong.

## Novelty Justification
Major reframing: the MCP server — expected to be the highest-blast-radius break point — is LARGELY relocation-ready by design (dual-root scanning + dual-root classification + cwd-relative resolution). Only two narrow hardcoded literals remain (F2.4 medium, F2.5 low). This inverts the prior expectation and substantially lowers the memory-MCP risk. Builds on iter 1's tooling foundation but introduces a new structural fact (systemic dual-root awareness), so partially-new with a simplicity bonus.

## newInfoRatio: 0.70 (partially-new + reframing; +0.10 simplicity bonus for the clean dual-root pattern, capped)

## Next Focus Suggestion
Q3 (git/.gitignore) — the existing root `specs` symlink, the `!specs` and `!.opencode/` negation rules, and `~/.gitignore_global`'s `/specs` and `/.opencode/` ignores for downstream symlinked repos. This is the track most likely to reveal *external* (downstream-repo) breakage, which the in-repo dual-root tooling would not catch. Read root `.gitignore`, `~/.gitignore_global`, and inspect the root `specs` symlink target.
