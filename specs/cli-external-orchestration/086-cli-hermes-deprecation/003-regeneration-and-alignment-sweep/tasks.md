---
title: "Tasks: Phase 3: regeneration-and-alignment-sweep"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "hermes removal alignment sweep"
  - "regenerate after hermes removal"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: regeneration-and-alignment-sweep

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T001 Read the compiled-routing status for both hubs. Verify: both report stale-manifest.
- [x] T002 Read the pre-commit re-mint steps. Verify: the refresh command is named.
- [x] T003 [P] Run the contract drift check. Verify: it reports the drift.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Copy the served routing edits back to the authored closure and rebuild its artifacts. Verify: `--check` reports 55 copies matching.
- [x] T005 Re-mint both hub manifests and copy them to the authored closure. Verify: status reports compiled-serving.
- [x] T006 [P] Regenerate the three deep command contracts. Verify: drift OK commands=3.
- [x] T007 [P] Remove two dead Hermes spike links. Verify: `rg` finds no hit in either file.
- [x] T008 Regenerate the trigger index. Verify: `--check` passes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun compiled-route tests. Verify: 101/101.
- [x] T010 Rerun the doctor and deep-loop full suites. Verify: no failure that main lacks.
- [x] T011 Run the residue sweep and the alignment battery. Verify: only justified hits remain.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: spec.md section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md section 3.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: plan.md section 6.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `check-contract-drift.cjs` prints OK commands=3.
- [x] CHK-011 [P0] No console errors or warnings. Evidence: the suites in plan.md section 5 report no new failure against the baseline.
- [x] CHK-012 [P1] Error handling implemented. Evidence: removal only; no error path was added or changed for the remaining executors.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: generated surfaces were regenerated with their own generators, never hand-edited.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md, every row Met.
- [x] CHK-021 [P0] Manual testing complete. Evidence: the compiled router serves `cli-pi` for a Pi request and defers a Hermes request.
- [x] CHK-022 [P1] Edge cases tested. Evidence: spec.md edge cases, each checked by the residue sweep or a test.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: a Hermes request no longer routes; see implementation-summary.md Verification.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. Evidence: one class, `class-of-bug`: every roster that names Hermes.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: `rg -n -i hermes` over the phase area, kept hits justified in implementation-summary.md.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: tests that enumerate rosters were updated, see tasks above.
- [x] CHK-FIX-004 [P0] Adversarial table tests. Evidence: N/A, no security, path, parser or redaction fix.
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed. Evidence: plan.md affected surfaces, one roster axis.
- [x] CHK-FIX-006 [P1] Hostile env variant executed. Evidence: N/A, no new process-wide state is read.
- [x] CHK-FIX-007 [P1] Evidence pinned to a diff range. Evidence: the uncommitted diff on `worktrees/321-deprecate-cli-hermes` against its base `23b7ec0582`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: removal only; the `.env.example` change deletes Hermes keys.
- [x] CHK-031 [P0] Input validation implemented. Evidence: N/A, no input path added.
- [x] CHK-032 [P1] Auth/authz working correctly. Evidence: N/A, no auth surface touched.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: all three state Complete.
- [x] CHK-041 [P1] Code comments adequate. Evidence: comments naming Hermes were removed or rewritten, none name a spec path.
- [x] CHK-042 [P2] README updated (if applicable). Evidence: the session-relaunch README drops the dead Hermes spike link.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: dispatch briefs and logs lived in the session scratchpad outside the repo.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-07
<!-- /ANCHOR:summary -->

---
