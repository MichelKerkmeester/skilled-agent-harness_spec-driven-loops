---
title: "Tasks: Phase 3: docs-registries-and-skill-removal"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "cli orca removal docs"
  - "delete cli-orca skill folder"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: docs-registries-and-skill-removal

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

- [x] T001 Read each doc mention in context (`README.md, README.txt, graph metadata, mcp-tooling docs`). Verify: every manifest section 3 row is located.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Dispatch the README, index and graph edits to DeepSeek Flash high (`README.md, README.txt, three graph-metadata.json`). Verify: all three JSON files parse and `rg` prints nothing.
- [x] T003 Fix the two written counts the brief missed (`README.md`). Verify: line 279 reads `Fourteen skills` and `six skills`.
- [x] T004 Dispatch the five mcp-tooling doc edits to DeepSeek Flash high (`.skilled/skills/mcp-tooling`). Verify: `rg -n -i orca` outside changelog prints nothing.
- [x] T005 Delete the skill and its links through git (`.skilled/skills/cli-orca and three links`). Verify: 62 deletions and no dangling symlink.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Confirm the folder held no untracked file before deletion (`.skilled/skills/cli-orca`). Verify: `git status --ignored` printed nothing and 59 files equal 59 tracked.
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
