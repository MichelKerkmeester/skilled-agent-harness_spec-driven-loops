---
title: "Research synthesis: z_archive doc/test propagation audit"
description: "Consolidated inventory of every doc, test, config, and command surface affected by commit b062b12b4 (z_archive un-excluded from memory index)."
trigger_phrases:
  - "113 research"
  - "z_archive propagation audit"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/113-z-archive-memory-indexing"
    last_updated_at: "2026-05-16T13:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Synthesized 5-iter loop"
    next_safe_action: "Apply remediation TSV"
    blockers: []
    key_files:
      - "iterations/iteration-001.md"
      - "iterations/iteration-002.md"
      - "iterations/iteration-003.md"
      - "iterations/iteration-004.md"
      - "iterations/iteration-005.md"
      - "deep-research-state.jsonl"
      - "remediation-plan.tsv"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000113900"
      session_id: "113-research-synth"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Research synthesis: z_archive doc/test propagation audit

<!-- ANCHOR:provenance -->
## 0. Provenance

| Source | Evidence |
|--------|----------|
| Trigger commit | `b062b12b4` — `.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts:184-191` (removed `compileSegmentPattern('z_archive')` from `EXCLUDED_FOR_MEMORY`) |
| Decay system | `.opencode/skills/system-spec-kit/shared/scoring/folder-scoring.ts:31-44` (`ARCHIVE_MULTIPLIERS` defines `z_archive=0.1`) |
| Iter outputs | source: `iteration-001` through `iteration-005` in `research/iterations/` |
| JSONL state | `research/deep-research-state.jsonl` (7 rows: 1 workflow_start + 5 iter + 1 convergence) |
| Convergence | `iteration-005` after 4 consecutive `newInfoRatio=0.0` |
<!-- /ANCHOR:provenance -->

<!-- ANCHOR:summary -->
## 1. Summary

5-iter cli-devin SWE-1.6 deep-research loop converged after iter-5 with 4 consecutive iters of 0.0 new-info ratio. Phase 1 parallel-Explore baseline was essentially complete; the loop added 1 mechanical detail (specific assertion form in test) and confirmed 6 other surfaces had ZERO additional propagation hits beyond baseline.

| Source | New hits | Confirmed |
|--------|---------:|-----------|
| iter-1 baseline spot-check | 1 | 4 |
| iter-2 4-runtime agents | 0 | 0 |
| iter-3 constitutional rules | 0 | 0 |
| iter-4 recent 026 packets | 0 | 217 (all unrelated to memory exclusion) |
| iter-5 eval/ground-truth | 0 | 0 |

Total actionable hits: **12** across 9 files. Loop converged ~6 min wall-clock (4 iters early-exit triggered by convergence threshold).

## 2. Severity-tagged inventory

### 2.1 BREAKING (tests fail post-fix)

| File:Line | Severity | What breaks | Suggested fix |
|-----------|----------|-------------|---------------|
| `mcp_server/tests/index-scope.vitest.ts:44` | BREAKING | `expect(EXCLUDED_FOR_MEMORY.length).toBeGreaterThanOrEqual(3)` — array now has 2 entries | Change to `.toBe(2)` |
| `mcp_server/tests/index-scope.vitest.ts:48-52` | BREAKING | Test name + assertion: "rejects z_future, external, and z_archive for memory indexing" expects `shouldIndexForMemory(z_archive_path)` to be false | Rename test to "rejects z_future and external for memory indexing"; remove z_archive from rejection assertion; add positive assertion that z_archive IS indexed |
| `mcp_server/tests/index-scope.vitest.ts:74-90` | BREAKING | Test "skips z_future, external, and z_archive spec docs and graph metadata" creates z_archive fixtures, expects exclusion | Rename to "skips z_future and external spec docs"; remove z_archive fixture from skip-list; add positive case asserting z_archive fixture IS discovered |
| `mcp_server/tests/full-spec-doc-indexing.vitest.ts:281-282` | BREAKING | "Rejects spec.md in /z_archive/ directory" expects `isMemoryFile()` false | Flip to "Accepts spec.md in /z_archive/ directory (decay-penalized)"; assert `isMemoryFile()` true AND `getArchiveMultiplier()` returns 0.1 |

### 2.2 STALE-INVARIANT (claim permanent exclusion, now wrong)

All under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/010-memory-indexer-invariants/`:

| File:Line | Snippet | Suggested fix |
|-----------|---------|---------------|
| `plan.md:81` | "shouldIndexForMemory() rejects z_future, external, **z_archive**, .git, node_modules" | Remove `z_archive` from rejection list; add note: "z_archive is indexed; decay 0.1× via ARCHIVE_MULTIPLIERS" |
| `checklist.md:73` | "Shared helper enforces memory exclusions for z_future, external, and **z_archive**" | Remove z_archive; reword to "memory exclusions enforce z_future and external. z_archive is indexed and decay-penalized." |
| `implementation-summary.md:152` | "Duplicated exclusion arrays caused **z_archive drift**" | Update to clarify the post-113 design: z_archive is indexed; duplicated exclusion logic across mcp_server + cli was the original bug, now resolved via single-source-of-truth in `shouldIndexForMemory()`. |
| `decision-record.md:125` | "Drift caused z_archive to be excluded in some places" | Add post-script: "Packet 113 (b062b12b4) confirmed z_archive should be indexed; decay multiplier handles deprioritization." |
| `decision-record.md:347` | "Changing EXCLUDED_FOR_MEMORY automatically changes spec-doc classification" | Still correct; no change needed. (informational meta-rule, not a z_archive claim) |
| `review/005-memory-indexer-invariants-pt-01/iterations/iteration-001.md:27` | "index-scope.ts:25 excludes z_future, external, and z_archive" | Add post-script: "Per packet 113 (b062b12b4), z_archive was removed from the exclusion list." (preserve historical accuracy of the iter-001 finding at the time it was written) |

### 2.3 STALE-DESCRIPTIVE (doc drift, non-blocking)

| File:Line | Snippet | Suggested fix |
|-----------|---------|---------------|
| `.opencode/commands/doctor/assets/doctor_update.yaml:314-316` | FIX-13 comment: "z_archive/z_future paths...are intentionally outside graph-traversal" | Update to distinguish: z_future stays outside graph traversal; z_archive is in memory index but gets decay penalty in scoring |
| `.opencode/commands/doctor/assets/doctor_update.yaml:349` | `-not -path '*/z_archive/*'` filter for legacy memory detection | Remove the z_archive exclusion from the find filter |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:220` | Error recovery message: "Verify the path is not under z_future/, z_archive/, or external/" | Remove z_archive from the path list |

### 2.4 Already correct (no fix needed)

- `.opencode/commands/memory/manage.md` (already treats z_archive as indexable)
- `.opencode/skills/system-spec-kit/mcp_server/lib/utils/README.md` (already lists only z_future + external)
- `.opencode/skills/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts` (inherits via `shouldIndexForMemory()`)
- `.opencode/skills/system-spec-kit/shared/scoring/folder-scoring.ts:ARCHIVE_MULTIPLIERS` (decay 0.1 intact)
- `.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts:184-191` (post-fix comment block explains design)
- 4-runtime agent definitions (no z_archive references found)
- Constitutional rules (no z_archive references found)
- Eval ground-truth (no z_archive expectations found)

## 3. Documentation gap (new authoring)

The relationship between `EXCLUDED_FOR_MEMORY` and `ARCHIVE_MULTIPLIERS` is documented only in code comments. Author a brief SSOT section in `mcp_server/lib/utils/README.md` titled "Index scope vs scoring decay" describing:

- Scope exclusion (`EXCLUDED_FOR_MEMORY`) is binary: included or absent.
- Scoring decay (`ARCHIVE_MULTIPLIERS`) is multiplicative on indexed-but-deprioritized content.
- z_archive is in the second category; z_future + external/ are in the first.

## 4. Recommended apply sequence

1. **BREAKING tests first** (2 commits — 1 per file). Unblocks CI.
2. **STALE-INVARIANT docs** (5 commits, one per file in 010-memory-indexer-invariants/). Add post-scripts rather than rewriting history.
3. **STALE-DESCRIPTIVE** (2 commits: doctor_update.yaml + memory-save.ts).
4. **Documentation gap** (1 commit: append SSOT section to `mcp_server/lib/utils/README.md`).
5. **Verify**: vitest exit 0 on the 2 test files; z_archive row count ≥ 2618 in `memory_index`; strict-validate packet 113 exit 0.

Estimated commits: 10. Estimated wall-clock: 30-45 min.

## 5. Provenance

- Phase 1 baseline: 3 parallel Explore agents (Claude Sonnet/Opus) — 14 hits surfaced
- Phase R: cli-devin SWE-1.6, 5 iters (converged at iter-5), JSONL state at `research/deep-research-state.jsonl`
- Phase R outputs: `research/iterations/iteration-{001..005}.md`
- Phase R prompts: `/tmp/113-research/iter-*.md`
- Dispatcher: `/tmp/113-research/dispatch.sh`
- Convergence reason: 4 consecutive iters with newInfoRatio=0.0 after iter-1's 0.067
<!-- /ANCHOR:summary -->
