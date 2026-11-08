---
title: "Tasks: Route implementation prompts that name a runtime surface to the code skill, not the CLI executor"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "runtime name implementation routing tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Route implementation prompts that name a runtime surface to the code skill, not the CLI executor

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Capture the probe, validate, vitest and Python regression baselines. Verify: each run's output saved. Evidence: probes pass 3; validate 158/195, 30/40, UNKNOWN 13; vitest 1 failed test, 2 failed files; Python 78/84.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T002 Mask runtime-surface mentions before alias matching (`runtime/lib/scorer/executor-delegation.ts`). Verify: the resolver returns null for the four surface prompts. Evidence: resolver test 4/4.
- [x] T003 Demote the CLI hub when it leads only on a surface mention (`runtime/lib/scorer/executor-delegation.ts`). Verify: P02 routes to `sk-code`. Evidence: `run-probes.cjs` P02 pass.
- [x] T004 Mirror the mask in the Python fallback (`runtime/scripts/skill_advisor.py`). Verify: the fixture parity test agrees. Evidence: 87/87.
- [x] T005 Add resolver tests and two `runtime-surface` fixture cases (`runtime/tests/scorer/executor-delegation.vitest.ts`, `runtime/tests/parity/fixtures/executor-delegation-cases.json`). Verify: both engines pass them. Evidence: 87/87.
- [x] T006 Re-capture the eval baseline and the census pins for the larger fixture (`scorer-eval-baseline.json`, `advisor-validate.vitest.ts`). Verify: only the delegation bucket moves. Evidence: diff shows 18 to 20 and the SHA only; 17/17.
- [x] T007 Raise the pinned Claude Stop hook count to 4 for the ask-surface guard (`runtime/tests/hooks/settings-driven-invocation-parity.vitest.ts`). Verify: the parity test passes. Evidence: pass.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T008 Rerun the probes. Verify: no CLI executor is a top-1. Evidence: pass 4, P02 to P09 off the CLI hub.
- [x] T009 Rerun `advisor_validate`, the vitest suite and the Python regression suite. Verify: no drop. Evidence: 158/195, 30/40, 13; 1374 passed with 0 failed tests; Python 78/84.
- [x] T010 Record the seven remaining misses and their causes (`implementation-summary.md`). Verify: each probe is named. Evidence: Known Limitations item 1.
- [x] T011 Add guard, adapter, stderr and detector to `sk-code`'s keywords (`.skilled/skills/sk-code/SKILL.md`). Verify: probes rise and the corpus holds. Evidence: pass 8; validate 158/195, 30/40, 13; Python 78/84; collision spot checks keep their owners.
- [x] T012 Point the observation-sink test at the renamed hooks track (`runtime/tests/policy-observation-sink.vitest.ts`). Verify: it loads. Evidence: 5/5.
- [x] T013 Give the acceptance-criteria template the token the scaffold replaces (`templates/addons/acceptance-criteria.md.tmpl`). Verify: a fresh scaffold writes a real id. Evidence: `scaffold-999-scaffold-probe`; 201/201 and 29/29.
- [x] T014 Add the temp-folder rule for tests to sk-code's test conventions (`sk-code-skilled/references/shared/code-organization/directory-and-test-conventions.md`). Verify: the section sits under Test File Conventions. Evidence: "Temp Files in Tests" subsection; validate below.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: probes and validate
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-005
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: §3 and the affected-surfaces addendum
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `npm run build` exit 0
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] Code passes the type build. Evidence: `npm run build` exit 0
- [x] CHK-011 [P0] No new test failure. Evidence: 0 failed tests after, 1 before
- [x] CHK-012 [P1] Fail-safe: a prompt with no alias resolves as before. Evidence: validate unchanged
- [x] CHK-013 [P1] Follows the resolver's mask pattern, as `maskSlashTargets` does in the explicit lane
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md` AC-001 to AC-005 Met
- [x] CHK-021 [P0] Probes rerun through the CLI. Evidence: pass 4, no CLI executor
- [x] CHK-022 [P1] Edge cases tested: hand-off beside a surface, runtime with no surface. Evidence: resolver tests
- [x] CHK-023 [P1] A literal `cli-*` id keeps the hub. Evidence: `demoteSurfaceOnlyHub` guard; fixture `direct-alias-cli-*` cases still pass
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding class: `algorithmic`, the resolver read a surface mention as a hand-off.
- [x] CHK-FIX-002 [P0] Same-class producers: the TypeScript resolver and its Python mirror, both changed. Evidence: `rg -n "NEGATIVE_GUARD" runtime` lists only those two.
- [x] CHK-FIX-003 [P0] Consumers: `applyExecutorDelegationOverride` and the Python disambiguation call the resolver; both covered by the fixture.
- [x] CHK-FIX-004 [P0] Adversarial cases: hand-off beside a surface, runtime with no surface, literal `cli-*` id. Evidence: resolver tests and fixture.
- [x] CHK-FIX-005 [P1] Matrix: two engines by three prompt shapes (surface only, surface plus hand-off, runtime only).
- [x] CHK-FIX-006 [P1] N/A: the resolver reads no environment state.
- [x] CHK-FIX-007 [P1] Evidence pinned to the commit that lands this packet.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the change adds regex constants only
- [x] CHK-031 [P0] Alias text is escaped before it enters a pattern. Evidence: `escapeRegExp` and `re.escape`
- [x] CHK-032 [P1] N/A: the scorer has no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec, plan and tasks name the same files and numbers
- [x] CHK-041 [P1] Each new constant and helper carries its reason
- [x] CHK-042 [P2] N/A: no README documents the resolver's alias rules
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files lived in the session scratchpad, outside the repository
- [x] CHK-051 [P1] scratch/ holds only its `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-08
<!-- /ANCHOR:summary -->

---



