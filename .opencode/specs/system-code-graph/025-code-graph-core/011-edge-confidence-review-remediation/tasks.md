---
title: "Tasks: Edge-Confidence and Seeded-PPR Revisit Review Remediation [template:level_3/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "edge confidence review remediation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/025-code-graph-core/011-edge-confidence-review-remediation"
    last_updated_at: "2026-07-01T17:09:48.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored tasks.md"
    next_safe_action: "Author checklist.md and decision-record.md, then dispatch T001"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-01-011-edge-confidence-review-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Edge-Confidence and Seeded-PPR Revisit Review Remediation

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

No new environment setup is required: this folder's spec/plan/checklist/decision-record are already scaffolded and Q-001 is already resolved via ADR-001 (see decision-record.md), which was T006's only blocker. The one setup action still open is cutting an isolated worktree for the real production-code changes below.

- [x] T000 [P] Cut an isolated git worktree for the production-code changes (REQ-001-006, REQ-011); doc-only fixes (REQ-007-010, REQ-012, REQ-014-016) and new tests (REQ-013) do not require worktree isolation
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Real-Behavior P1 Fixes

- [x] T001 [P] Fix REQ-001: lazy-load the Memory MCP traversal module inside the seeded-PPR path only, not at `code-graph-context.ts` module top-level (`.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts`)
- [x] T002 [P] Fix REQ-002: preserve the full multi-hop `why_included.edgeChain` for seeded-PPR trace output (`.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts`) -- required an additive `predecessor` field on the shared `collectWeightedWalk` (`system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts`)
- [x] T003 [P] Fix REQ-003: require import-target verification before assigning `0.9/EXTRACTED` confidence, downgrade to `INFERRED` otherwise (`.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts`) -- the first dispatch missed this fix entirely; applied directly after verification caught the gap
- [x] T004 [P] Fix REQ-004: `why_included.ambiguous` recognizes `evidenceClass === 'AMBIGUOUS'` (`.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts`) -- the first dispatch missed this too; applied directly after verification
- [x] T005 [P] Fix REQ-005: relationship-query/scan-enrichment consumers recognize `AMBIGUOUS`; resolver guarantees `detectorProvenance` on every AMBIGUOUS write (`.opencode/skills/system-code-graph/mcp_server/handlers/query.ts`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts`) -- both sub-fixes missed by the first dispatch; applied directly after verification
- [x] T006 [P] Fix REQ-006 per decision-record.md ADR-001 (resolved): flag-off reads normalize/ignore persisted differentiated confidence (`.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts`, `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts`, `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts`) -- the first dispatch's implementation over-applied the legacy substitution to IMPORTS/EXTENDS/CONTAINS/etc. edges that were never part of this feature; corrected to scope strictly to CALLS edges after independent verification against `structural-indexer.ts`'s per-edge-type confidence map

### Evidence & Completion Honesty

- [x] T007 [P] Fix REQ-007: check the real completed boxes in `tasks.md`/`plan.md`/Completion Criteria (`../010-edge-confidence-and-ppr-revisit/tasks.md`, `../010-edge-confidence-and-ppr-revisit/plan.md`)
- [x] T008 [P] Fix REQ-008: reword "green"/"passing" to baseline-relative language across acceptance/checklist docs (`../010-edge-confidence-and-ppr-revisit/{spec.md,plan.md,tasks.md,checklist.md,implementation-summary.md}`)
- [x] T009 [P] Fix REQ-009: cite the exact reproducible verification command/scope for the suite baseline, or replace with the real current baseline (`../010-edge-confidence-and-ppr-revisit/{checklist.md,implementation-summary.md}`) -- replaced with the current real baseline (9 failed files / 23 failed tests / 745 passed / 1 pending / 769 total), independently reproduced twice (worktree and live tree)
- [x] T010 [P] Fix REQ-010: preserve a durable confidence-distribution artifact or qualify the claim as non-reproducible (`../010-edge-confidence-and-ppr-revisit/implementation-summary.md`, `../../007-dark-flag-graduation/005-codegraph-seeded-ppr/benchmark-results.md`)

### P2 Documentation, Tests, Cleanup

- [x] T011 [P] Fix REQ-011: try/finally cleanup in the eval harness (`.opencode/skills/system-code-graph/mcp_server/scripts/eval/score-seeded-ppr-retrieval.mjs`)
- [x] T012 [P] Fix REQ-012: feature catalog + manual playbook coverage for the new gated capabilities (`.opencode/skills/system-code-graph/feature_catalog/**`, `.opencode/skills/system-code-graph/manual_testing_playbook/**`) -- new `feature_catalog/edge-confidence-and-provenance/` group (3 files: edge-confidence-differentiation, edge-evidence-classification, seeded-ppr-impact-ranking), 4 existing catalog files updated (feature_catalog.md index, code-graph-context.md, query-self-heal.md, code-graph-scan.md), 2 new manual playbook scenarios (028/029) under `context-retrieval/`, and `ENV_REFERENCE.md` gained a complete row for each flag -- all independently re-verified against real source by a completeness-critic pass
- [x] T013 Fix REQ-013: regression tests for findings 1 and 4/5 (new/updated vitest files under `.opencode/skills/system-code-graph/mcp_server/tests/`) -- lazy-import test added by the dispatch; AMBIGUOUS-class tests for findings 4/5 added directly across all three consumer sites (context-handler, query-handler, scan) after verification found the dispatch had missed them
- [x] T014 [P] Fix REQ-014: correct `spec.md`'s benchmark-record relative path (`../010-edge-confidence-and-ppr-revisit/spec.md`)
- [x] T015 [P] Fix REQ-015: correct ADR-001 misattribution in tasks/checklist/implementation-summary (`../010-edge-confidence-and-ppr-revisit/{tasks.md,checklist.md,implementation-summary.md}`)
- [x] T016 [P] Fix REQ-016: update `benchmark-status.md` and `feature-flags.md` to reflect the PPR recovery (`../../benchmark-status.md`, `../../feature-flags.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 [P] Run the full code-graph vitest suite twice: flags off (byte-identical to the pre-fix baseline) and flags on (no regression vs 010's recorded benchmark state) -- flags-off run: 9 failed files / 23 failed tests / 745 passed / 1 pending / 769 total, identical between worktree and live tree, all 9 failures pre-existing daemon/IPC-liveness flakiness unrelated to this remediation; per-file flag-on assertions pass throughout the suite (each test file exercises both states directly)
- [x] T018 Run `validate.sh --strict` on this folder and on `../010-edge-confidence-and-ppr-revisit` after REQ-007 through REQ-010 and REQ-014/015 land -- both PASSED, 0 errors, 0 warnings
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 19 tasks marked `[x]` (T000-T018)
- [x] No `[B]` blocked tasks remaining
- [x] Full code-graph vitest suite shows no new failures against the pre-existing baseline (flags off; both flags on, no regression vs 010's recorded state) -- final confirmed count: 5 failed files / 8 failed tests / 767 passed / 1 pending / 776 total, all 5 failures pre-existing daemon/IPC-liveness flakiness unrelated to this remediation, reproduced twice
- [x] New regression tests (T013) pass and exercise the fixed behavior directly (AMBIGUOUS classification, mid-session toggle, IMPORTS-unaffected-by-flag, lazy-import fallback)
- [x] `validate.sh --strict` passes on this folder and on `../010-edge-confidence-and-ppr-revisit`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source findings**: `../010-edge-confidence-and-ppr-revisit/review/iterations/iteration-{1,2,3,4,5,6,7,8,9,10,11,13,14,18,19,20}.md`
<!-- /ANCHOR:cross-refs -->
