# Iteration 001 — Spec-Kit Tooling Path Assumptions (Q1)

**Focus:** Q1 — Which spec-kit tooling scripts hardcode the `.opencode/specs` path and would break or need patching if `specs/` moved to repo root?
**Track:** tooling
**Executor:** cli-devin / glm-5-2
**Date:** 2026-08-06

## Approach
Grepped `.opencode/skills/system-spec-kit` for `.opencode/specs` (271 files match). Drilled into the four named scripts (`validate.sh`, `create.sh`, `generate-description.js`, `backfill-graph-metadata.js`) plus the MCP server hook (`spec-gate-core.mjs`) and `context-server.ts` path resolver.

## Findings

### F1.1 — `create.sh` is DUAL-ROOT aware but defaults to the old location
`scripts/spec/create.sh`:
- Line 713: `for allowed in "$REPO_ROOT/specs" "$REPO_ROOT/.opencode/specs"; do` — the parent-validation loop ALREADY accepts both `specs/` (root) and `.opencode/specs/` as legal spec roots.
- Line 726: error message reads "must be under `specs/` or `.opencode/specs/`" — dual-root messaging already present.
- Line 811: `SPECS_DIR="$REPO_ROOT/.opencode/specs"` — but the DEFAULT `SPECS_DIR` is still the old location. A bare `create.sh <name>` with no `--parent`/`--track` writes under `.opencode/specs/`.
- Line 414: `relative_spec="${folder_path#${REPO_ROOT}/.opencode/specs/}"` — relative-path derivation strips ONLY the `.opencode/specs/` prefix. A folder created under root `specs/` would not be stripped correctly here, leaving a `specs/...` relative path instead of the bare `<track>/<NNN-name>`. **This is a latent bug under relocation** unless the strip is made dual-root.
- Lines 35, 268, 314: help text and comments still describe "under `.opencode/specs/<track>/`".
**Verdict:** create.sh is *partially* relocation-ready (validation accepts both roots) but the default target and the relative-path strip are hardcoded to `.opencode/specs`. Relocation would require: flip the `SPECS_DIR` default and make the prefix-strip dual-root.
[SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:35,268,314,414,713,726,811]

### F1.2 — `validate.sh` hardcodes a canonical `.opencode/specs` parent path
`scripts/spec/validate.sh` line 214:
```
case "$canonical_parent" in
    */.opencode/specs/system-deep-loop/036-deep-loop-innovation)
```
The child-manifest fallback matches the canonical parent via a glob ending in `/.opencode/specs/system-deep-loop/036-deep-loop-innovation`. If the tree moved to root `specs/`, the canonical path would be `.../specs/system-deep-loop/036-...` and this glob would NO LONGER MATCH — the manifest fallback would silently return 0 (line 219 `*) return 0`), skipping validation for that packet. **Silent validation skip = correctness regression**, not a loud break.
[SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:214-221]

### F1.3 — `context-server.ts` hardcodes a runbook path under `.opencode/specs`
`mcp-server/context-server.ts` line 242:
```
const FTS_CORRUPTION_RUNBOOK =
  '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/012-empty-graph-first-time-auto-scan/bug-report-memory-db-corruption.md';
```
A literal `.opencode/specs/...` path used as the FTS-corruption runbook pointer. Under relocation this file would move to `specs/...` and the pointer would dangle — the runbook link shown to operators on DB corruption would 404. Low blast radius (diagnostic surface only) but a real break.
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/context-server.ts:242]

### F1.4 — `spec-gate-core.mjs` bakes `.opencode/specs` into the Gate 3 user prompt
`mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs` lines 107-110:
```
'A) Use an existing spec folder (reply with its path, e.g. .opencode/specs/<track>/<NNN-name>)',
'B) Create a new spec folder (reply with a new path, e.g. .opencode/specs/<track>/<NNN-name>)',
...
'D) Use a phase folder (reply with the child path, e.g. .opencode/specs/<parent>/<NNN-phase>)',
```
The Gate 3 question text hardcodes `.opencode/specs/...` in every example. This is operator-facing UX, not a path resolver — relocation would not break the gate logic, but every example path shown to operators would point at the old location, steering them wrong. Line 852 has a further match (not yet inspected — flagged for a later iteration or the cross-runtime track).
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:105-112]

### F1.5 — `backfill-graph-metadata.ts` is path-agnostic (takes `specFolderPath` as input)
`scripts/graph/backfill-graph-metadata.ts` uses `specFolder`/`specFolderPath` as a caller-supplied absolute path (lines 54, 278-298, 486-496, 552-639). `SPEC_FOLDER_RE` (line 44) matches folder *names* (`^\d{3}...`), not locations. The grep hits for `.opencode/specs` in this file were the `specFolder` field name and doc comments, NOT hardcoded paths. **The script itself is relocation-safe** — provided its caller (the CLI/command that enumerates "all" spec folders when no `--spec-folder` is scoped) discovers from the right root. The discovery caller is the dependency to verify, not this script.
[SOURCE: .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:44,278-298,552-561]

### F1.6 — `generate-description.js` (dist) carries no hardcoded `.opencode/specs` literal
`scripts/dist/spec-folder/generate-description.js` returned no match for `.opencode/specs` / `specsDir` / `SPEC_FOLDER` patterns. It receives the spec folder path as a parameter. Relocation-safe at this layer (the source generator under `scripts/spec-folder/` was not yet inspected — flagged).
[SOURCE: .opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js]

## What Worked
- Targeted grep + line-keyed reads on the four named scripts gave concrete file:line evidence quickly.

## What Failed / Ruled Out
- Nothing ruled out yet. The "all-scope" discovery caller for backfill-graph-metadata and the source `generate-description` were not inspected — deferred, not ruled out.

## Novelty Justification
First iteration — all findings are new. Established the critical distinction: create.sh is *partially* dual-root (validation yes, default/strip no), validate.sh has a *silent* skip risk (not a loud break), and backfill-graph-metadata is path-agnostic at the script layer (risk is in its caller). This reframes Q1 from "everything hardcodes the path" to "a small set of specific literals + one default + one strip logic need patching; the bulk of tooling is parametric."

## newInfoRatio: 1.00 (first iteration, fully new)

## Next Focus Suggestion
Q4 (memory-mcp) is the natural next high-value target: the MCP server's path resolution is the highest-blast-radius component (it backs `memory_context`/`memory_search` used by every runtime), and `context-server.ts:242` already shows a hardcoded `.opencode/specs` literal inside it. Investigate how the MCP server discovers the specs root (env var? config? cwd? hardcoded?) and whether relocation breaks indexing/retrieval.
