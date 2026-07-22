---
title: "Tasks: Compiled-Routing Deep-Review Remediation"
description: "Task breakdown for the four remediation workstreams; test-first per fix, verify invariants after each."
importance_tier: "critical"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/016-review-remediation"
    last_updated_at: "2026-07-22T06:39:39Z"
    last_updated_by: "claude"
    recent_action: "All tasks shipped and verified; conformed tasks to the Level-2 template."
    next_safe_action: "Operator sign-off; merge to v4 remains operator-gated."
    blockers: []
    key_files: []
---

# Tasks: Compiled-Routing Deep-Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [x] T001 Verify every finding against the actual code (finding equals hypothesis) via three Explore agents plus direct reads (e.g. `cutover-playbook-executor.cjs:209`); correct the one mis-framed F002 flip-gate claim to the cutover gate.
- [x] T002 Baseline the release invariants (frozen SHAs, parity 49/49, seven-hub serving) before any edits.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### WS-1 routing parity
- [x] T003 F005: add the `preview-not-review` canary to both fixtures; word-boundary-match `WORD_BOUNDARY_KEYWORDS` in both `007-sk-doc/lib/router.cjs` copies.
- [x] T004 F002: fall back only on `defer`; compare clarify/reject against legacy; add cutover cases.

### WS-2 manifest + closure
- [x] T005 F001: re-read serving after the compile, publish via temp-file plus atomic rename (`compiled-route-manifest.cjs`); add a concurrent-refresh regression (`bin/tests/compiled-route-manifest.test.cjs`).
- [x] T006 [P] F007: reconcile the authored engine to the bin twins for the four diverged hubs; `compiled-route-sync.cjs --check` resolves all seven; manifest suite 17/17.

### WS-3 cohort + telemetry
- [x] T007 DOC-3: strengthen the cohort drift-guard across all four copies (`compiled-routing-foundation.vitest.ts`).
- [x] T008 F006: fix `classifyFlagState` telemetry and its locking test; no runtime flag-semantics change.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### WS-4 doc reconciliation
- [x] T009 DOC-2: mark the SD-015 limitation and follow-up resolved in `013/implementation-summary.md`, citing the tests.
- [x] T010 DOC-1: reconcile the 013 lifecycle metadata (status frontmatter, checklist rows, blockers) in `013/{plan,tasks,decision-record,checklist}.md`; record deferrals; surface operator sign-off.

### Invariant gate
- [x] T011 Full battery: frozen SHAs unchanged, parity 49/49 plus new cases, manifest 17/17, `--check` seven-resolve, `--verify` clean, bin vitests green, seven-hub serving plus kill-switch.
- [x] T012 `validate.sh --strict` on this packet.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every regression test passing
- [x] Parity and invariant battery green
- [x] `checklist.md` verified with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
