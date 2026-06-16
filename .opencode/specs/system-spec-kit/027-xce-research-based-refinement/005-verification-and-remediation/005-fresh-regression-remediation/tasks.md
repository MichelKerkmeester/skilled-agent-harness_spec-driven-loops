---
title: "Tasks: Fresh+Regression Deep-Review Remediation"
description: "Task breakdown for remediating the 027 fresh+regression deep-review findings: 5 confirmed code defects (test-gated), parent-metadata reconciliation, and confirm-then-fix of the asserted doc-truth P1s."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "Scaffolded remediation task list from verified deep-review findings"
    next_safe_action: "Run T001 baseline, then T003-T007 code fixes"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Fresh+Regression Deep-Review Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture full test baseline (mk-spec-memory + launchers vitest) and record counts.
- [ ] T002 Re-open each confirmed finding's cited file:line to reconfirm before editing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P] R1 — `spec-folder-mutex.ts:37`: pid-liveness gate + mtime heartbeat (mirror `generate-context.ts`); regression test for live-owner reap.
- [ ] T004 [P] R2 — `history.ts:103`: wrap legacy rebuild in a transaction; crash-safety test.
- [ ] T005 [P] R3 — `vector-index-mutations.ts:101`: bump causal-edges generation on delete sweep; stale-cache test.
- [ ] T006 [P] R4 — `mk-code-index-launcher.cjs:839` (+ audit `mk-spec-memory-launcher.cjs:1270`): reclaim threshold ≤ deadline; respawn-timing test.
- [ ] T007 [P] R5 — `pe-gating.ts:351`: preserve manual `source_kind` carry on append-version/supersede; provenance test.
- [ ] T008 R6 — add omitted children to 000/003/004 `description.json` + 000 `spec.md`; refresh stale pointers; correct feature-catalog tool count (37→live).
- [ ] T009 R7 — confirm-then-fix the ~19 asserted doc-truth P1s + re-verify `validate.sh:1062`; mark refuted items with reason.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Re-run the full gate; report baseline→after delta (no regressions).
- [ ] T011 `validate.sh --strict --recursive` clean for the 027 tree.
- [ ] T012 Update `deep-review-findings-registry.json` finding statuses (fixed/refuted).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 5 code defects fixed + test-gated; metadata reconciled + validate clean; every asserted P1 resolved; delta reported. No fixes applied in this planning packet.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Findings: `../../review/fresh-regression-75/review-report.md`
- Registry: `../../review/fresh-regression-75/deep-review-findings-registry.json`
- Round-2 verdicts: `../../review/fresh-regression-75/round2/code-verdicts.json`
<!-- /ANCHOR:cross-refs -->
