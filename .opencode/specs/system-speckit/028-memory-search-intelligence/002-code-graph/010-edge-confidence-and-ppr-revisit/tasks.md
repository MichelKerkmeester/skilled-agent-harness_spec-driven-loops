---
title: "Tasks: Edge-Confidence Differentiation and Seeded-PPR Revisit"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "edge confidence ppr revisit tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit"
    last_updated_at: "2026-07-01T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Enumerated implementation tasks"
    next_safe_action: "Dispatch T003"
    blockers: []
    key_files: ["tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-01-010-edge-confidence-ppr-revisit"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Edge-Confidence Differentiation and Seeded-PPR Revisit

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Carry pass-1 doc fixes into the isolated worktree (shared with Stream B)
- [x] T002 Scaffold this spec folder
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Genuine sequential dependency chain -- each task blocks the next.

- [x] T003 Implement CALLS edge confidence differentiation in `structural-indexer.ts` (same-file candidate cardinality) and `cross-file-edge-resolver.ts` (write resolution-quality signal to metadata), gated behind new default-off flag `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION`. Registered in `system-spec-kit/mcp_server/ENV_REFERENCE.md`.
- [x] T004 Ran existing code-graph test suite with the new flag OFF: same pre-existing baseline (6 failed test files / 9 failed tests, all unrelated to CALLS/PPR), zero new regressions. Confirmed via real `tsc --noEmit` + `vitest run`, including a stash/pop sanity check against a clean pre-change baseline.
- [x] T005 Recovered deleted seeded-PPR module via `git show 277c35344c^:<path>` for `code-graph-context.ts`, the eval script, and both vitest files; re-wired behind `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING`, consuming the new differentiated weights via the existing `contextEdgeReliability` blend. Caught and fixed one deviation: the recovery initially replaced the original cross-subsystem dynamic import of the Memory MCP's `collectWeightedWalk` with a local reimplementation (violating this packet's own ADR-001, which forbids a second walker) - fixed by building the missing `dist/` output and restoring the real shared-substrate import.
- [x] T006 Re-ran `seeded-ppr-impact-benchmark.mjs` unmodified with both flags ON, after a fresh full-repo reindex confirmed real differentiated confidence values in the database (0.3/0.35/0.75/0.9 instead of a uniform 0.8). Compared against the flat walk in the same run.
- [x] T007 Verdict: **CUT stands.** With a real confidence gradient, PPR no longer ties the flat walk - it loses on every metric (precision@3 -0.10, recall -0.01 to -0.05, nDCG -0.03 to -0.06). Full numbers in `../007-dark-flag-graduation/005-codegraph-seeded-ppr/benchmark-results.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Sync implementation to live tree as uncommitted diffs
- [x] T009 Finalized PPR doc entries in `../005-seeded-ppr-ranking/`, `../../007-dark-flag-graduation/005-codegraph-seeded-ppr/benchmark-results.md`, and `../../009-drift-audit-deep-history-correction/` with the real CUT-confirmed verdict, replacing the "in progress" forward-pointers
- [ ] T010 Update this folder's checklist.md, implementation-summary.md, decision-record.md
- [ ] T011 Run `validate.sh 002-code-graph/010-edge-confidence-and-ppr-revisit --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 11 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Live-tree diff and benchmark verdict reviewed by operator
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
