---
title: "Tasks: Phase 2: docs-and-registries"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "remove hermes from docs"
  - "delete hermes runtime folder"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: docs-and-registries

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

- [x] T001 Run the hub gate before edits. Verify: OK with 8 modes.
- [x] T002 Run the mirror and link checks before edits. Verify: each passes.
- [x] T003 [P] Read the hub routing reference surface list. Verify: every surface listed in plan.md.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Delete `.hermes/`, `cli-hermes`, `.dsh/skills/cli-hermes` and the Hermes sync scripts. Verify: `ls` reports no such directory.
- [x] T005 Remove the mode from every hub surface and regenerate derived files. Verify: hub gate OK with 7 modes.
- [x] T006 [P] Remove Hermes from root docs and AGENTS.md, regenerate the manifest. Verify: agents-md-check STATUS=OK.
- [x] T007 [P] Remove Hermes from agent mirrors via the sync tools. Verify: agent-mirror-sync OK.
- [x] T008 [P] Remove Hermes from commands, playbooks and workflows. Verify: residue sweep over those paths.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun the hub gate. Verify: OK, 7 modes.
- [x] T010 Rerun mirror and link checks. Verify: 241 mirrors in sync, 0 broken links.
- [x] T011 Replay a Pi and a Hermes request through the advisor. Verify: Pi routes, Hermes returns none.
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

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: the leaf-manifest and router-intent-signal generators report `RESULT: PASSED`.
- [x] CHK-011 [P0] No console errors or warnings. Evidence: the suites in plan.md section 5 report no new failure against the baseline.
- [x] CHK-012 [P1] Error handling implemented. Evidence: removal only; no error path was added or changed for the remaining executors.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: generated surfaces were regenerated with their own generators, never hand-edited.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md, every row Met.
- [x] CHK-021 [P0] Manual testing complete. Evidence: "delegate this to hermes" returns no advisor recommendation.
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
- [x] CHK-042 [P2] README updated (if applicable). Evidence: the root README and the hub README drop Hermes and state the new counts.
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
