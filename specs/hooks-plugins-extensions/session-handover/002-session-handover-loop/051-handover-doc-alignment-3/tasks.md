---
title: "Tasks: Hand-over doc alignment, third pass"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "handover doc alignment 3 tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Hand-over doc alignment, third pass

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`R` is the run folder `~/.local/state/local-doc-alignment/Skilled/20261116T130806Z`. `A` is `.skilled/commands/assets/local-skilled-alignment` in the primary checkout.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the 25 kept findings and the overturned one (`R/findings.json`, `R/overturned.json`). Verify: the aggregator line reads `findings=25 P0=0 P1=7 P2=18 ... overturned=1`.
- [x] T002 Check the riskier literal claims against the code: Cursor's command file, the manual-claim goal export, the lock expiry, the start claim under `ENABLED=0`, and the Pi and OpenCode compaction claims. Verify: `ls .cursor/commands` lists `speckit-handoff.md`, and `skilled-loop` exports `SESSION_HANDOVER_GOAL_PACKET` for a first-launch claim seed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Dry-run the literal fixes from the worktree root (`A/apply-fixes.cjs --dry-run`). Verify: it prints `would_apply=18 skipped=0`.
- [x] T004 Apply the literal fixes (`A/apply-fixes.cjs`). Verify: it prints `applied=18 skipped=0`.
- [x] T005 Replace the semicolon one literal fix brought into `README.md`. Verify: `hvr_scan.py README.md` reports 0 hard blockers.
- [x] T006 Write the 7 judgment fixes (`README.md`, `.skilled/hooks/README.md`, `troubleshooting.md`, `.skilled/hooks/shared/README.md`, `ENV-REFERENCE.md`). Verify: `rg -n "SKILLED_LOOP_LAUNCHED_AT" .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` prints one row.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Validate and voice-scan every changed doc against its committed copy. Verify: no file's hard blocker or issue count rises.
- [x] T008 Rerun the topic's checks on the fixed tree (`doc-alignment.cjs checks`). Verify: `pass=2 fail=0 cannot_run=0`.
- [x] T009 Strict validation of this folder (`validate.sh`). Verify: it prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: each riskier claim read against the code
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available: the alignment assets resolve the repository from the working directory, so they edit the worktree
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed doc passes `validate_document.py`
- [x] CHK-011 [P0] No changed doc gains a voice hard blocker
- [x] CHK-012 [P1] Error handling: N/A, docs only
- [x] CHK-013 [P1] Docs follow project patterns: each fix states what the code does, in the doc's own voice
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete: the riskier claims were read against the code
- [x] CHK-022 [P1] Edge cases tested: the overturned finding was left unchanged and its code read
- [x] CHK-023 [P1] Error scenarios validated: the dry run reported no skipped fix
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: all 25 are `instance-only` doc statements.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: the linked-folder lists were searched repo-wide, and both found were fixed.
- [x] CHK-FIX-003 [P0] Consumer inventory: N/A, no helper, schema or response changed.
- [x] CHK-FIX-004 [P0] Adversarial table tests: N/A, no path, parser or redaction code changed.
- [x] CHK-FIX-005 [P1] Matrix axes: N/A, docs only.
- [x] CHK-FIX-006 [P1] Hostile env variant: N/A, no code reads process-wide state here.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the alignment run folder and this packet's commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation: N/A, docs only
- [x] CHK-032 [P1] Auth/authz: N/A, docs only
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate: N/A, no code changed
- [x] CHK-042 [P2] README updated: the root, hooks, shared and bin READMEs carry their fixes
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: the recheck and the voice baselines live in the session scratchpad, outside the repository
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-16
<!-- /ANCHOR:summary -->

---
