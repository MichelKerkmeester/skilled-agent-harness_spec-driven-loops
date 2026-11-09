---
title: "Tasks: Phase 14: doctor-and-ci-gate-honesty"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "doctor and ci gate honesty tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 14: doctor-and-ci-gate-honesty

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

`DS` is `.skilled/commands/doctor/scripts`. `DA` is `.skilled/commands/doctor/assets`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record baselines (`implementation-summary.md`). Verify: every suite named in `plan.md` has a before count there.
- [x] T002 Reproduce the findings (`spec.md` Measured Behavior). Verify: the probes print the defect.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Drift exit for `symlink-engine.cjs check` and its contracts (`DS/symlink-engine.cjs`, `DA/doctor-symlink-check.yaml`, presentations, playbook). Verify: symlink-engine tests pass with broken, foreign, partial-merge and project-owned cases.
- [x] T004 Seven agent trees and same-file status (`.skilled/bin/lib/mirror-sync-verify.cjs`, `check-agent-mirror-sync.cjs`). Verify: bin vitest 64/0 and `--all` exits 0.
- [x] T005 Body-parity step with repair line (`DA/doctor-runtime-mirrors.yaml`, `_routes.yaml`). Verify: runtime-mirrors contract test and `route-validate.sh` pass.
- [x] T006 CI: five sk-git suites and a report-only manifest step (`.github/workflows/`). Verify: yaml parses; each suite passes locally.
- [x] T007 P2 messages and exits (`install-git-hooks.sh`, `DS/parent-skill-check.cjs`, `DS/orphan-process-check.cjs`, two mirror checkers, `INSTALL-SKILLED.md`). Verify: their tests and the hooks harness pass.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun every baseline suite. Verify: no baseline-passing test fails; counts in `implementation-summary.md`.
- [x] T009 Cross-family review of the phase diff. Verify: verdict and adjudication in `decision-record.md`.
- [x] T010 Strict validation of this folder. Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: each new CI suite run locally; symlink check probed on pre-install and broken fixtures by the reviewer
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Findings**: `../research/research.md`, rows V49, V51, V53, V54, V56, V55, V57, V58, V62, V65 (V63 and V64 deferred)
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

A blocked task after three fix attempts marks the phase Blocked with evidence in `decision-record.md` (goal G7).
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Baselines captured before the first edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `bash -n` on changed shell, yaml parse on changed workflows, `git diff --check` clean
- [x] CHK-011 [P0] No new failure in any baseline suite
- [x] CHK-012 [P1] No spec path or finding id in any changed code comment
- [x] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Measured Behavior probes rerun by hand
- [x] CHK-022 [P1] One test per changed behaviour fails on the old code
- [x] CHK-023 [P1] Edge cases in `spec.md` exercised
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Classes: V51, V65 class-of-bug (exit disagrees with report); V53, V49 instance-only; V54 algorithmic (tree list plus self-compare); V56 cross-consumer; V55, V57, V58, V62 wording.
- [x] CHK-FIX-002 [P0] Same-class producer inventory done (see `plan.md` inventories).
- [x] CHK-FIX-003 [P0] Consumer inventory done for every changed helper, field and doc.
- [x] CHK-FIX-004 [P0] Adversarial cases tested: pre-install `.claude/` partial merge, broken link inside a merged folder, symlinked mirror to a forked file, missing required tree, `ps` unavailable, hook linked through an alias path.
- [x] CHK-FIX-005 [P1] Matrix axes listed in `implementation-summary.md`.
- [x] CHK-FIX-006 [P1] Hostile variant: the full doctor battery, where six AGENTS.md manifest tests fail before and after.
- [x] CHK-FIX-007 [P1] Evidence pinned to this phase's commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] No checker gains a write path
- [x] CHK-032 [P1] N/A: no auth surface in this phase
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Changed code comments state the rule the code applies
- [x] CHK-042 [P2] Install presentation and INSTALL-SKILLED name the new exit and the standards step
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Probe scripts and logs live in the session scratchpad, not the worktree
- [x] CHK-051 [P1] scratch/ holds only its `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-09
<!-- /ANCHOR:summary -->

---
