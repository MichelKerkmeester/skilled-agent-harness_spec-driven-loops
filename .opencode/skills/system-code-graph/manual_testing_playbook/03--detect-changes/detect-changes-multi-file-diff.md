---
title: "024 — detect_changes with multi-file unified diff"
description: "Verify detect_changes handles diffs spanning multiple files with multiple hunks each, correctly mapping line ranges to affected symbols across files."
trigger_phrases:
  - "024 detect changes multi file"
  - "detect_changes diff cross file"
importance_tier: "important"
contextType: "verification"
---

# Scenario 024 — `detect_changes` with multi-file diff

> **Coverage gap closed (F018):** existing playbook scenario 014 covers single-file `detect_changes`. This scenario verifies the tool correctly handles a diff with multiple files, each having multiple hunks, mapping to symbols across the index.

## Preconditions

- Code graph index `fresh` (verify via `code_graph_status` → `freshness:"fresh"`).
- At least 2 indexed source files with parseable symbols.

## Steps

1. **Construct a multi-file unified diff.** Use any recent `git diff HEAD~1 HEAD` against the repo, or hand-craft one with this shape:

   ```diff
   diff --git a/.opencode/skills/system-spec-kit/shared/embeddings.ts b/.opencode/skills/system-spec-kit/shared/embeddings.ts
   index abc..def 100644
   --- a/.opencode/skills/system-spec-kit/shared/embeddings.ts
   +++ b/.opencode/skills/system-spec-kit/shared/embeddings.ts
   @@ -100,7 +100,7 @@ export class EmbeddingPipeline {
      // ... ~5 lines of context ...
   diff --git a/.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts b/.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts
   index 111..222 100644
   --- a/.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts
   +++ b/.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts
   @@ -50,3 +50,3 @@ export class HfLocalProvider {
      // ... ~3 lines of context ...
   ```

2. **Invoke detect_changes:**
   ```jsonc
   mcp__mk_code_index__detect_changes({
     diff: "<the multi-file diff above>"
   })
   ```

3. **Verify response shape:**
   - `status` !== `"blocked"`
   - `affectedFiles` length === 2
   - `affectedFiles[0].path` includes `shared/embeddings.ts`
   - `affectedFiles[1].path` includes `shared/embeddings/providers/hf-local.ts`
   - `affectedSymbols` length ≥ 2 (one symbol per file, possibly more if multiple symbols overlap the changed lines)
   - Each symbol has `path`, `name`, `kind`, `startLine`, `endLine`

4. **Path canonicalization:** the input diff uses `a/<path>` and `b/<path>` git conventions; verify the response normalizes these to clean paths (no `a/` or `b/` prefix).

5. **Outside-workspace path:** add a fake diff entry referencing `/tmp/somewhere/file.ts` to the diff input; verify that entry is either omitted from `affectedFiles` OR explicitly flagged as out-of-workspace (the tool's path canonicalization uses `realpathSync` and validates the result stays inside `rootDir`).

6. **Empty diff case:**
   ```jsonc
   mcp__mk_code_index__detect_changes({
     diff: ""
   })
   ```
   Expected: an explicit validation error, not a silent empty result.

7. **Stale graph case:** if you can mark the graph stale (e.g., `code_graph_apply({operation:"rescan", dryRun:true})` while a file is dirty in the worktree), re-invoke detect_changes. Expected: `status:"blocked"`, `requiredAction:"code_graph_scan"`, NO `affectedSymbols` returned (hard refuse per readiness invariant).

## Pass criteria

| # | Check | Pass |
|---|-------|------|
| 1 | Multi-file diff returns 2 entries in affectedFiles | ☐ |
| 2 | Symbol mapping is non-empty for each file | ☐ |
| 3 | Path canonicalization strips git `a/` `b/` prefixes | ☐ |
| 4 | Out-of-workspace paths handled (omitted or flagged) | ☐ |
| 5 | Empty diff raises validation error (not silent empty) | ☐ |
| 6 | Stale graph returns blocked | ☐ |

## Notes

Tests `mcp_server/handlers/detect-changes.ts` → diff parser → line-range overlap query against `code_nodes`. Critical invariant: the tool refuses with `blocked` when readiness is anything other than `fresh` to prevent false-safe empty results — see architecture.md §6 Invariant 2.
