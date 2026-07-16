---
title: "Tasks: 028 Playbook Findings Remediation [template:level_2/tasks.md]"
description: "The task list for the playbook findings remediation. Eight clusters A through H fixed and verified per cluster across seven fix commits, plus a follow-up test commit and a phase re-parenting commit, all landed on the 028 review-branch mainline (authored in worktree wt/0008-findings-remediation). A whole-suite run across all clusters together, before the 028 branch merges to main, remains open."
trigger_phrases:
  - "playbook findings remediation tasks"
  - "028 remediation task list"
  - "remediation cluster task list"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/001-release-cleanup/012-playbook-findings-remediation"
    last_updated_at: "2026-07-04T17:31:28.233Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Marked all eight cluster tasks plus the follow-up tests and re-parenting done"
    next_safe_action: "Run the whole suite across all clusters together before the 028 review branch merges to main"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-25-tasks-012-playbook-findings-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 028 Playbook Findings Remediation

<!-- SPECKIT_LEVEL: 2 -->
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

**Task Format**: `T### [P?] Description (artifact)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Triage the findings registry into eight clusters A through H by failure mode (`findings-registry.md`)
- [x] T002 Separate the six isolation and harness artifacts from the real product findings
- [x] T003 Repair the isolated worktree node_modules workspace resolution so the integration suites run
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Cluster A schema drift: guard the source_kind select on narrow schemas, align the adaptive insert to query_hash, add the merge-contract and schema-contract tests (commit `adbcc65e83`)
- [x] T011 Cluster B wiring: wire scoring observability, LLM backfill registration, llm-reformulation, query-surrogates and the contextual-tree header into the runtime (commit `e5b4735c4b`)
- [x] T012 Cluster C retrievalLevel: honor local, global and auto end to end, add the strict input schema field, key the cache by level (commit `f0e063eed4`)
- [x] T013 Cluster D ordering: folder rank primary sort plus guaranteed top-k channel representation (commit `cbf4f4d111`)
- [x] T014 [P] Cluster E advisor persistence: routing, sanitizer, scorer, rollback, bench and force-native, the F1 through F6 fixes (commit `917ad633a3`)
- [x] T015 [P] Cluster F DB lifecycle: db-path standardization plus a new end-to-end test over the pre-existing cross-process rebind, embedding-retry e2e (commit `f27945593e`)
- [x] T016 [P] Clusters G and H code-graph and quality: write-local refresh, duplicate helper, stale tests, entity dedup, 7-layer metadata (commit `3291c05389`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run the per-cluster vitest blast-radius sweep, typecheck, comment hygiene and alignment drift for each cluster
- [x] T021 Mutation-check the risky fixes: schema, security, rollback, ordering and DB lifecycle, confirm the distinguishing test goes red when reverted
- [x] T022 Add the follow-up tests for B4 surrogate index-time, B5 contextual-tree header and the C strict-schema assertion (commit `374ca93caa`)
- [x] T023 Re-parent the post-phase-6 phases under their relevant parents (commit `64d064d868`)
- [ ] T024 Run the whole suite across all clusters together before the 028 review branch merges to main (NOT RUN, held open as the next safe action)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

| Gate | State |
|------|-------|
| Eight clusters fixed and committed | Done |
| Per-cluster vitest, typecheck, hygiene, drift | Done |
| Risky fixes mutation-checked True-RED | Done |
| Follow-up tests landed | Done |
| Whole-suite run across all clusters together before the 028 branch merges to main | Not met, open as next safe action |
| Strict validation | Target exit 0 |
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` for the remediation objective and scope
- `plan.md` for the cluster-by-cluster approach and the per-cluster verification gate
- `findings-registry.md` for each cluster's findings, fix, files and verification evidence
- `implementation-summary.md` for the full results, the excluded artifacts and the commit list
- `checklist.md` for the QA evidence
<!-- /ANCHOR:cross-refs -->
