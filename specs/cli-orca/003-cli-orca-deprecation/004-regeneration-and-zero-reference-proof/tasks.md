---
title: "Tasks: Phase 4: regeneration-and-zero-reference-proof"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "cli orca removal regeneration"
  - "cli orca zero reference proof"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: regeneration-and-zero-reference-proof

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

- [x] T001 Read the compiled-routing status for mcp-tooling and cli-external-orchestration (`.skilled/bin/compiled-route-status.cjs`). Verify: mcp-tooling reports stale-manifest and cli-external-orchestration compiled-serving.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Recompile the advisor graph (`skill-graph.json`). Verify: it reports 14 skills and holds no orca string.
- [x] T003 Regenerate the trigger index (`trigger-index.json`). Verify: `--check` exits 0 and no indexed path is under the skill.
- [x] T004 Drop the cli-orca rows from the README fixtures (`durable-directory-manifest.json, baseline-readme-verdicts.json`). Verify: parity passes and the manifest check reports only the three sk-code directories.
- [x] T005 Rebuild the advisor dist (`system-skill-advisor/runtime`). Verify: the six dist-stale failures pass.
- [x] T006 Remove the resolved ledger entry rr-hub6-207 (`local-native-approved-divergences.json`). Verify: the ratchet reports 9 passed.
- [x] T007 Re-mint the mcp-tooling manifest and copy it to the authored path (`activation/mcp-tooling/manifest.json`). Verify: status reports compiled-serving.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun every baseline suite (`scratch/after-exits.txt`). Verify: no failure that the baseline lacks.
- [x] T009 Run the residue sweep (`repository outside specs/`). Verify: every hit is on the phase 1 keep list.
- [x] T010 Replay an Orca prompt through the advisor (`.skilled/bin/skill-advisor.cjs`). Verify: recommendations is empty.
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

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: every edited JSON file parses, and the touched suites run.
- [x] CHK-011 [P0] No console errors or warnings. Evidence: the touched suites report no failure the baseline lacks, see implementation-summary.md.
- [x] CHK-012 [P1] Error handling implemented. Evidence: removal only; no error path was added or changed.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: derived artifacts were rebuilt with their own tools.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md, every row Met.
- [x] CHK-021 [P0] Manual testing complete. Evidence: the residue sweep in implementation-summary.md.
- [x] CHK-022 [P1] Edge cases tested. Evidence: spec.md edge cases, each checked by a command or a test.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: an Orca prompt gets no recommendation, see phase 4.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. Evidence: one class, `class-of-bug`: every roster that names cli-orca.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: the phase 1 manifest.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: the baseline suites, rerun after the change.
- [x] CHK-FIX-004 [P0] Adversarial table tests. Evidence: N/A, no security, path, parser or redaction fix.
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed. Evidence: plan.md affected surfaces, one roster axis.
- [x] CHK-FIX-006 [P1] Hostile env variant executed. Evidence: N/A, no new process-wide state is read.
- [x] CHK-FIX-007 [P1] Evidence pinned to a diff range. Evidence: the uncommitted diff on `worktrees/534-deprecate-cli-orca` against its base `692a4b8c81c`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: removal only.
- [x] CHK-031 [P0] Input validation implemented. Evidence: N/A, no input path added.
- [x] CHK-032 [P1] Auth/authz working correctly. Evidence: N/A, no auth surface touched.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: all three state Complete.
- [x] CHK-041 [P1] Code comments adequate. Evidence: no comment names a spec path or packet number.
- [x] CHK-042 [P2] README updated (if applicable). Evidence: the root README counts 14 skills, see phase 3.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: dispatch briefs and logs lived in the session scratchpad outside the repo.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: `scratch/` holds only evidence files this phase cites.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-24
<!-- /ANCHOR:summary -->

---
