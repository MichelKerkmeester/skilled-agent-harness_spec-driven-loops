---
title: "Tasks: Phase 6: repair-speckit-workflow-gates"
description: "Task Format: T### [P?] Action (one file path). Verify: command and expected output."
trigger_phrases:
  - "repair speckit workflow gates tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: repair-speckit-workflow-gates

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| [ ] | Pending |
| [x] | Completed |
| [P] | Parallelizable |
| [B] | Blocked |

**Task Format**: T### [P?] Action (one file path). Verify: command and expected output.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the current score row, prerequisite check and completion outcomes; change nothing (`.skilled/commands/speckit/assets/speckit-implement.yaml`). Verify: `git show HEAD:.skilled/commands/speckit/assets/speckit-implement.yaml | rg -c -F -e 'id: plan_clarity, points: 25 }' -e 'checks: { prerequisites: verified, blockers: none, environment: ready }' -e 'validation_error: "STOP and fix", system_error:'` prints 3 before the build; the same query against the built worktree returns no matches.
  - Evidence: Closeout rerun on main: the committed HEAD query printed 3 (exit 0); the same query against the built worktree returned no output (exit 1), confirming the searched strings were replaced.
- [x] T002 Confirm the current phase gate line; change nothing (`.skilled/commands/speckit/assets/speckit-complete.yaml`). Verify: `git show HEAD:.skilled/commands/speckit/assets/speckit-complete.yaml | rg -c -F '2. plan.md exists → If not, return to Step 6'` prints 1 before the build; the same query against the built worktree returns no matches.
  - Evidence: Closeout rerun on main: the committed HEAD query printed 1 (exit 0); the same query against the built worktree returned no output (exit 1), confirming the searched line was replaced.
- [x] T003 Confirm the current clarification wording; change nothing (`.skilled/commands/speckit/assets/speckit-plan.yaml`). Verify: `git show HEAD:.skilled/commands/speckit/assets/speckit-plan.yaml | rg -c -F 'Extract [NEEDS CLARIFICATION] markers (max 3)'` prints 1 before the build; the same query against the built worktree returns no matches.
  - Evidence: Closeout rerun on main: the committed HEAD query printed 1 (exit 0); the same query against the built worktree returned no output (exit 1), confirming the searched wording was replaced.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Each edit task names one edit file. The edit file holds the exact OLD text and the exact NEW text. Replace OLD with NEW and change nothing else. When OLD is not found exactly once, stop, mark the task `[B]` and write `Open question:` with the task id in `goal.md`.

- [x] T004 Apply `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/scratch/edit-T004.txt`: replace its OLD line with its NEW line to define `plan_clarity` beside its score (`.skilled/commands/speckit/assets/speckit-implement.yaml`). Verify: `node -e 'const fs=require("node:fs"),yaml=require("./.skilled/skills/system-spec-kit/node_modules/js-yaml");const d=yaml.load(fs.readFileSync(".skilled/commands/speckit/assets/speckit-implement.yaml","utf8"));const c=d.quality_gates.pre_implementation.checks.find(x=>x.id==="plan_clarity");console.log(c.points,d.quality_gates.pre_implementation.threshold,c.criteria)'` prints `25 70 Pass only when plan.md states a concrete technical approach and affected files; fail if a material design choice remains.`
  - Evidence: Closeout rerun printed `25 70 Pass only when plan.md states a concrete technical approach and affected files; fail if a material design choice remains.` (exit 0).
- [x] T005 Apply `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/scratch/edit-T005.txt`: replace its OLD lines with its NEW lines to add the design-choice check and its stop to step 5 (`.skilled/commands/speckit/assets/speckit-implement.yaml`). Verify: `node -e 'const fs=require("node:fs"),yaml=require("./.skilled/skills/system-spec-kit/node_modules/js-yaml");const d=yaml.load(fs.readFileSync(".skilled/commands/speckit/assets/speckit-implement.yaml","utf8"));const s=d.workflow.step_5_implementation_check;console.log(s.checks.plan_design_choices,String(s.on_fail).startsWith("STOP before coding"))'` prints `none true`.
  - Evidence: Closeout rerun printed `none true` (exit 0).
- [x] T006 Apply `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/scratch/edit-T006.txt`: replace its OLD line with its NEW line to add the failing-test stop to the completion outcomes (`.skilled/commands/speckit/assets/speckit-implement.yaml`). Verify: `node -e 'const fs=require("node:fs"),yaml=require("./.skilled/skills/system-spec-kit/node_modules/js-yaml");const d=yaml.load(fs.readFileSync(".skilled/commands/speckit/assets/speckit-implement.yaml","utf8"));console.log(d.workflow.step_7_completion.pre_completion_validation.outcomes.test_failure)'` prints `STOP and fix the failing tests, then rerun them before completion continues`.
  - Evidence: Closeout rerun printed `STOP and fix the failing tests, then rerun them before completion continues` (exit 0).
- [x] T007 Apply `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/scratch/edit-T007.txt`: replace its OLD line with its NEW line so the phase gate requires a technical approach (`.skilled/commands/speckit/assets/speckit-complete.yaml`). Verify: `rg -c -F '2. plan.md exists and states a technical approach, meaning the approach and the files it changes → If not, return to Step 6' .skilled/commands/speckit/assets/speckit-complete.yaml` prints 1.
  - Evidence: Closeout rerun printed `1` (exit 0).
- [x] T008 Apply `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/scratch/edit-T008.txt`: replace its OLD text with its NEW text so the clarification activity repeats in passes of three (`.skilled/commands/speckit/assets/speckit-plan.yaml`). Verify: `rg -c -F 'Extract up to 3 [NEEDS CLARIFICATION] markers per pass; complete the clarification activities and repeat until none remain' .skilled/commands/speckit/assets/speckit-plan.yaml` prints 1, and `rg -c -F '(max 3)' .skilled/commands/speckit/assets/speckit-plan.yaml` prints nothing and exits 1.
  - Evidence: Closeout rerun of the new-wording search printed `1` (exit 0); the obsolete `(max 3)` search returned no output (exit 1).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Parse all three changed workflow assets; change nothing (`.skilled/commands/speckit/assets/speckit-implement.yaml`). Verify: `node -e 'const fs=require("node:fs"),yaml=require("./.skilled/skills/system-spec-kit/node_modules/js-yaml"),paths=[".skilled/commands/speckit/assets/speckit-implement.yaml",".skilled/commands/speckit/assets/speckit-complete.yaml",".skilled/commands/speckit/assets/speckit-plan.yaml"];paths.forEach(p=>yaml.load(fs.readFileSync(p,"utf8")));console.log("YAML parse passed: 3 workflow assets")'` prints `YAML parse passed: 3 workflow assets`.
  - Evidence: Closeout rerun printed `YAML parse passed: 3 workflow assets` (exit 0).
- [x] T010 Validate this packet's documents; change nothing (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates --strict --quiet` prints `RESULT: PASSED`.
  - Evidence: The closeout run printed `RESULT: PASSED (errors=0 warnings=0)` (exit 0). Draft auto-repair rewrote this packet's graph-metadata.json and the validator then validated again.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Setup checks T001–T003 are verified against the pre-build baseline. Evidence: baseline queries printed 3, 1 and 1 (all exit 0); their post-build worktree reruns returned no output (all exit 1) because the implementation replaced the searched strings.
- [x] No [B] blocked tasks remaining Evidence: blocked-task search returned no output and exit 1.
- [x] All five workflow requirements and the YAML parse check pass Evidence: T004–T009 passed with the outputs recorded above.
- [x] All 10 task rows include a `Verify:` clause. Evidence: the paired task-format count commands both print `10`.
- [x] No template token remains in the packet. Evidence: the token-count command prints `0` (exit 0).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
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

A blocked P0 task blocks progression. Record a blocked task's reason and unblocking condition beside that task; P1 deferrals require user approval, and P2 deferrals require a reason.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Five requirements and their verification commands are present in spec.md. Evidence: `rg -c -F '| REQ-' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/spec.md` prints 5. Closeout run: output 5 (exit 0).
- [x] CHK-002 [P0] plan.md retains the Setup, Implementation, and Verification phases in order. Evidence: `rg -n '^(Setup reads|Implementation edits|Verification parses) ' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/plan.md` prints three ordered lines. Closeout run: plan.md printed the three ordered phase lines at 82–84 (exit 0).
- [x] CHK-003 [P1] No new package dependency is planned. Evidence: `rg -n -F 'No new dependency is needed.' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/plan.md` prints one match. Closeout run: plan.md:100 printed No new dependency is needed. (exit 0).
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The three YAML edits have no whitespace errors. Verify: `git diff --check -- .skilled/commands/speckit/assets/speckit-implement.yaml .skilled/commands/speckit/assets/speckit-complete.yaml .skilled/commands/speckit/assets/speckit-plan.yaml` exits 0. Evidence: closeout run returned no output (exit 0).
- [x] CHK-011 [P1] Only the three named workflow assets change under the command asset directory. Verify: `git status --short -- .skilled/commands/speckit/assets` lists only those assets. Evidence: closeout run listed only speckit-complete.yaml, speckit-implement.yaml, and speckit-plan.yaml (exit 0).
- [x] CHK-012 [P1] Preserve every unrelated quality_gates, circuit_breaker, and default_level setting while allowing only the plan_clarity row REQ-001 adds inside quality_gates. Verify: inspect `git diff -- .skilled/commands/speckit/assets/speckit-implement.yaml .skilled/commands/speckit/assets/speckit-complete.yaml .skilled/commands/speckit/assets/speckit-plan.yaml`. Evidence: the scoped diff shows the five planned workflow edits; within quality_gates only the plan_clarity criterion row changes, and the circuit_breaker and default_level entries remain present and unchanged (exit 0).
- [x] CHK-013 [P1] The three command router files remain unchanged. Verify: `git diff -- .skilled/commands/speckit/plan.md .skilled/commands/speckit/implement.md .skilled/commands/speckit/complete.md` is empty. Evidence: closeout run returned no output (exit 0).
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] REQ-001 defines plan_clarity and preserves 25 points and threshold 70. Verify: T004's command in Phase 2 prints the criterion, score row, and gate threshold. Evidence: closeout rerun printed `25 70 Pass only when plan.md states a concrete technical approach and affected files; fail if a material design choice remains.` (exit 0).
- [x] CHK-021 [P0] REQ-002 stops before coding when a material design choice remains. Verify: T005's command in Phase 2 shows the check and on_fail stop. Evidence: closeout rerun printed `none true` (exit 0).
- [x] CHK-022 [P0] REQ-003 stops completion on failed test validation and directs repair. Verify: T006's command in Phase 2 shows test_failure mapped to STOP and fixing failed tests. Evidence: closeout rerun printed `STOP and fix the failing tests, then rerun them before completion continues` (exit 0).
- [x] CHK-023 [P0] REQ-004 returns to planning when plan.md lacks a technical approach. Verify: T007's command in Phase 2 shows the phase-gate check and return. Evidence: closeout rerun printed `1` (exit 0).
- [x] CHK-024 [P1] REQ-005 repeats clarification passes of up to three markers until none remain. Verify: T008's command in Phase 2 prints the revised activity. Evidence: closeout rerun of the new wording printed `1` (exit 0); the obsolete phrase search returned no output (exit 1).
- [x] CHK-025 [P0] All three workflow YAML assets parse successfully. Verify: T009 prints `YAML parse passed: 3 workflow assets`. Evidence: closeout rerun printed `YAML parse passed: 3 workflow assets` (exit 0).
- [x] CHK-026 [P0] The strict packet validator passes after the last document edit. Verify: T010 prints `RESULT: PASSED`. Evidence: the closeout validator run printed `RESULT: PASSED (errors=0 warnings=0)` (exit 0), after draft auto-repair rewrote graph-metadata.json and validation ran again.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each reported gate finding maps to one requirement row. Evidence: the requirement-row search in CHK-001 prints 5. Closeout run: requirement search printed 5 (exit 0).
- [x] CHK-FIX-002 [P0] The workflow-asset search after implementation identifies all producers of the changed gate instructions. Verify: `rg -n -e 'plan_clarity' -e 'step_5_implementation_check' -e 'test_failure' -e 'Extract up to 3' .skilled/commands/speckit/assets`. Evidence: closeout output listed speckit-implement.yaml at lines 9, 390, 556, and 680, and speckit-plan.yaml at line 656 (exit 0).
- [x] CHK-FIX-003 [P0] The command-router consumer inventory maps all three workflow assets. Evidence: `rg -n -F 'Workflow (all execution modes)' .skilled/commands/speckit/{plan,implement,complete}.md` printed `implement.md:24`, `complete.md:24`, and `plan.md:24`, each mapped to its owned YAML asset (exit 0).
- [x] CHK-FIX-004 [P0] N/A: the change does not alter security, path, redaction, or parser behavior; YAML syntax is checked separately by T009.
- [x] CHK-FIX-005 [P1] Verification axes and the non-Cartesian coverage choice are documented. Evidence: spec.md names empty, maximum, and failure cases; T004–T008 exercise separate workflow gates, so no combined row count is claimed.
- [x] CHK-FIX-006 [P1] N/A: the workflow assets do not read process-wide environment or global state.
- [x] CHK-FIX-007 [P1] Record implementation evidence against the exact changed files and verification commands. Verify: attach the observed T004–T009 outputs to the implementation record; no fix SHA exists before implementation. Evidence: implementation-summary.md records the observed T004–T009 outputs against the changed assets.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] N/A: the scoped prompt-text changes introduce no credential values or credential source.
- [x] CHK-031 [P0] N/A: no input-validation or security boundary implementation is changed.
- [x] CHK-032 [P1] N/A: no authentication or authorization surface is changed.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The specification, plan, task evidence, and five acceptance rows agree. Evidence: manual cross-check found REQ-001–REQ-005 aligned with plan.md and ticked T004–T008; each AC-001–AC-005 row cites its matching task output. The closeout strict packet validation printed `RESULT: PASSED (errors=0 warnings=0)` (exit 0).
- [x] CHK-041 [P1] N/A: this packet changes workflow YAML values and planning prose, not code comments.
- [x] CHK-042 [P2] N/A: no user-facing README change is in scope.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Packet artifacts remain in the named spec folder, with temporary evidence confined to scratch/. Verify: the folder inventory is checked after cleanup. Evidence: closeout inventory listed the packet documents and metadata, plus only edit-T004 through edit-T008 and `.gitkeep` under scratch/ (exit 0).
- [x] CHK-051 [P1] No generated temporary files remain in scratch/. Verify: `find specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/scratch -type f ! -name 'edit-T*.txt' -print` lists only .gitkeep. Evidence: closeout run printed only the target scratch/.gitkeep path (exit 0).
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-12
<!-- /ANCHOR:summary -->

---



