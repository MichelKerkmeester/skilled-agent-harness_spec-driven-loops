---
title: "Tasks: Scaffold surface placement"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "scaffold surface placement tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Scaffold surface placement

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create the worktree and copy this spec folder state from origin/main; confirm line anchors 462, 542 (confirm twin) and 423, 495 (auto twin) (evidence: Worktree `worktrees/125-surface-placement` from origin/main 4b9bf840b0; anchors matched at 462, 542 (confirm) and 423, 495 (auto))
- [x] T002 Build the throwaway full-tree copy under the session scratchpad by the plan's recipe and record the control: doctor, guard and sync `--check` exit 0 (evidence: Copy under the session scratchpad; control printed doctor exit 0, guard exit 0, sync `--check` exit 0)
- [x] T003 In the copy, add `sk-code-acme` with its `tieBreak` entry appended last, re-mint, and record the tie prompt's route `[sk-code-opencode, sk-code-acme]` as the before state (evidence: Before state recorded as P8-4's contrast: with `sk-code-acme` appended after `sk-code-webflow` and refreshed, the tie prompt routed `[sk-code-opencode, sk-code-acme]`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the insertion rule into the step_4 `hub-router.json` activity of both twins, on identical lines (`.skilled/commands/create/assets/`) (evidence: `17bb342b1c`; goal criterion 1 prints ok)
- [x] T005 Write the same phrase into the tie-break paragraph and the tie-break row (`parent-hub-router-schema.md`, `parent-skills-nested-packets.md`) (evidence: `17bb342b1c`; both references pass `validate_document.py`)
- [x] T006 Add the canary line and the commit-with-hooks line to step_6_completion of both twins (evidence: `17bb342b1c`; goal criterion 2 prints 2)
- [x] T007 Release the sk-create-skill packet once: `SKILL.md` version and one changelog entry (evidence: sk-create-skill 1.5.4.0, `changelog/v1.5.4.0.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 In a fresh copy, run the update workflow for `sk-code-acme`; record P8-2 to P8-5 (evidence: Ledger P8-2 to P8-5 in `implementation-summary.md`)
- [x] T009 Follow both report lines in the copy; record P8-6 (evidence: Ledger P8-6)
- [x] T010 Run criteria 1, 2 and 4 of `goal.md` in the worktree; record P8-1 (evidence: Criteria 1, 2 and 4 printed ok, 2 and ok; ledger P8-1)
- [x] T011 Run `/deep:review :auto` for 5 iterations; fix and record each confirmed finding as an RV row (evidence: Five iterations under `review/`, verdict PASS; RV-1 fixed in `d500377abc`, RV-2 rejected with reason)
- [x] T012 Fill the ledger, run `check-goal.cjs` and strict `validate.sh`, delete the copies (evidence: Ledger filled, `check-goal.cjs` and strict `validate.sh` passed, copies deleted)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every criterion in `goal.md` rerun and passing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
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
- [x] CHK-003 [P1] Dependencies identified and available (evidence: cli-pi DeepSeek reachable; Devin quota exhausted, fallback per C2)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Changed scripts and YAML pass their lint or parse checks (evidence: Both twins parse with `yaml.safe_load`)
- [x] CHK-011 [P0] No new console errors or warnings in the live gates (evidence: Doctors, drift wrapper, guard and sync `--check` exit 0)
- [x] CHK-012 [P1] Error handling names the failure and the fix (evidence: The step_6 lines name the failing leg (5k-canary) and the command that fixes it)
- [x] CHK-013 [P1] Code follows project patterns (evidence: Rule placed in the existing step_4 activity string and table row; no new structure)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (evidence: All six rows in `acceptance-criteria.md` Met)
- [x] CHK-021 [P0] Every ledger row (P8-1 to P8-6) recorded with a backticked proof (evidence: Six P8 rows, each with a backticked command)
- [x] CHK-022 [P1] Edge cases in `spec.md` checked (evidence: No-surface hub and update rerun are covered by the rule text; several surfaces fixed by RV-1)
- [x] CHK-023 [P1] Copy runs stayed outside the worktree (evidence: Copies lived under the session scratchpad with a `pwd` check after each `cd`)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. (evidence: RV-1 class-of-bug (one rule at four sites, fixed at all four); RV-2 matrix/evidence (test coverage))
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. (evidence: `grep -rn 'tieBreak' .skilled/commands/create/assets/` lists the two step_4 writers and two step_5 validation lines, which place nothing)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. (evidence: Consumers are the agent following the twins and readers of the two references; all four sites carry the same phrase)
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. (evidence: Not applicable: no security, path, parser or redaction fix)
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. (evidence: Matrix: 2 twins x (step_4 rule, step_6 lines) plus 2 references, 6 sites, all checked by goal criteria 1 and 2)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. (evidence: Not applicable: no change reads process-wide state)
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. (evidence: Evidence pinned to `17bb342b1c` and `d500377abc`)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (evidence: No secrets in any changed file)
- [x] CHK-031 [P0] Paths a script now reports are repository-relative and printed, never executed (evidence: The report lines print repository-relative paths for the user to run)
- [x] CHK-032 [P1] Auth/authz working correctly: not applicable, no auth surface (evidence: Not applicable, no auth surface)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (evidence: spec, plan, tasks, acceptance criteria and goal agree on Complete)
- [x] CHK-041 [P1] Code comments keep the durable why and no packet labels (evidence: No comments added; the YAML strings carry no packet labels)
- [x] CHK-042 [P2] README updated (if applicable) (evidence: No README in scope)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (evidence: Copy experiments under the session scratchpad; phase `scratch/` holds only `.gitkeep`)
- [x] CHK-051 [P1] scratch/ cleaned before completion (evidence: Session copies deleted; phase `scratch/` holds only `.gitkeep`)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-13
<!-- /ANCHOR:summary -->
