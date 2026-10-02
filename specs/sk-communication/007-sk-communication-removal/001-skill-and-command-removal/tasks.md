---
title: "Tasks: Phase 1: skill-and-command-removal"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "skill removal tasks"
  - "rewrite command removal tasks"
  - "runtime mirror checks"
  - "phase 1 verification checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: skill-and-command-removal

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

- [x] T001 Confirm the phase boundary and history exclusions from `spec.md` before reviewing the removal diff. [EVIDENCE: spec.md scope and history exclusions reviewed]
- [x] T002 Inventory the canonical skill, package changelog, Hermes mirror, two rewrite commands, runtime prompt copies and OpenCode plugin/test against baseline `ecf2897455`. [EVIDENCE: 333 tracked deletions counted; removal-path command exited 0]
- [x] T003 [P] Confirm the prompt/skill sync scripts and advisor runtime test command resolve from the repository root. [EVIDENCE: four mirror checks and focused advisor test exited 0]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Remove `.skilled/skills/sk-communication/`, `.skilled/changelog/sk-communication/` and `.hermes/skills/sk-communication/`. [EVIDENCE: removal-path command exited 0]
- [x] T005 Remove `.skilled/commands/rewrite/`, its runtime command and prompt mirrors, and both rewrite command entry points from supported runtimes. [EVIDENCE: removal-path command exited 0]
- [x] T006 Remove `.opencode/plugins/sk-communication-projection.js` and `.opencode/plugins/tests/sk-communication-projection.test.cjs`. [EVIDENCE: plugin and test absence confirmed by removal-path command, exit 0]
- [x] T007 [P] Remove active sk-doc references, including human-voice and create-skill guidance, playbook allowlist references, goal-criteria labels and code-folder fixtures. [EVIDENCE: scoped reference review; only the retained historical prompt-set pointer remains]
- [x] T008 [P] Remove active infrastructure references from advisor routing, sk-git provisioning, CI, plugin/command/skill READMEs, root README counts and the retrieval semantic-probe fixture; retain the general route-exclusion mechanism. [EVIDENCE: active-reference sweep reviewed after excluding generated retrieval snapshots]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the Codex, Hermes and Pi prompt sync checks plus the Hermes skill sync check; record each exit status. [EVIDENCE: Codex, Hermes and Pi each reported 32 prompts in sync; Hermes reported 71 copies; all exit 0]
- [x] T010 Run the focused advisor route-exclusions Vitest test and confirm the empty-list case leaves other skills routable. [EVIDENCE: route-exclusions Vitest: 1 file passed, 10 tests passed, exit 0]
- [x] T011 After phase 2, run the non-historical live-reference grep excluding generated retrieval snapshots; allow and verify the existing historical prompt-set pointer. [EVIDENCE: sole match prompt-set.json:84; target exists, exit 0.]
- [x] T012 [P] Review `git -c core.fsmonitor=false diff --name-status ecf2897455 --` against the authorized paths and confirm no historical spec or changelog path changed beyond this packet's authorized docs and the skill-specific package changelog deletion. [EVIDENCE: diff/status review found no historical spec or changelog edits outside authorized paths]
- [x] T013 Regenerate and check the trigger index after final packet/frontmatter edits. [EVIDENCE: `generate-trigger-index.mjs --quiet` and `--check --quiet` both exited 0; no indexed path remains under `.skilled/skills/sk-communication`.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All phase implementation and verification tasks have evidence, including T013's passing packet-level trigger-index generation and check.
- [x] No `[B]` blocked tasks remain.
- [x] AC-001 through AC-003 are `Met` with observed command output and exit status.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Acceptance Criteria**: See `acceptance-criteria.md`.
- **Parent coordination**: See `../spec.md`.
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

- [x] CHK-001 [P0] Requirements are documented in `spec.md`, REQ-001 through REQ-006. [EVIDENCE: spec.md REQ-001 through REQ-006]
- [x] CHK-002 [P0] Technical approach and command checks are defined in `plan.md`. [EVIDENCE: plan.md removal sequence and verification commands]
- [x] CHK-003 [P1] The baseline commit, mirror generators and advisor test package are available to the verification owner. [EVIDENCE: four mirror scripts and advisor test ran from the repository root]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `git diff --check ecf2897455 --` reports no whitespace errors in the scoped change. [EVIDENCE: git diff --check ecf2897455 -- produced no stdout, exit 0]
- [x] CHK-011 [P0] Active install, provisioning, README and routing paths no longer require the deleted files. [EVIDENCE: active-reference sweep found only the existing historical prompt-set target]
- [x] CHK-012 [P1] The route-exclusion loader and filtering logic remain unchanged apart from the empty skill-specific list input. [EVIDENCE: route-exclusions test passed 10/10; diff retains the generic loader]
- [x] CHK-013 [P1] Canonical prompt and skill files remain the generator inputs for their supported mirrors. [EVIDENCE: all four canonical mirror checks passed]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every phase acceptance criterion has a task row that will record its evidence. [EVIDENCE: AC-001 through AC-003 trace to T004-T010]
- [x] CHK-021 [P0] All four mirror sync checks pass from the final state. [EVIDENCE: all four mirror checks passed with observed outputs]
- [x] CHK-022 [P1] The advisor route-exclusions Vitest test passes, including the empty-list behavior. [EVIDENCE: focused advisor route-exclusions suite passed 10/10]
- [x] CHK-023 [P1] The final non-historical live-reference search has no stdout and exit status 1. [EVIDENCE: scoped live-reference grep found only prompt-set.json:84; its target exists]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Every changed path maps to the phase scope in `spec.md`; review `git diff --name-status ecf2897455 --` against that table. [EVIDENCE: baseline diff/status reviewed against the phase scope]
- [x] CHK-FIX-002 [P0] The active consumer inventory covers skill, commands, prompts, plugin, routing, CI and installation references. [EVIDENCE: inventory covered skill, commands, prompts, plugin, routing, CI and installation]
- [x] CHK-FIX-003 [P0] The full removal set is accounted for, including the 317-file skill directory and the other tracked deletions. [EVIDENCE: baseline diff counted 333 tracked deletions; path-absence command exited 0]
- [x] CHK-FIX-004 [P1] The advisor route-exclusion contract still handles an empty list and a configured list, as exercised by T010. [EVIDENCE: route-exclusions focused suite passed 10/10]
- [x] CHK-FIX-005 [P1] The runtime matrix names Claude, Cursor, Codex, Pi, Hermes and OpenCode and has a removal or sync check for each surface. [EVIDENCE: phase plan/runtime inventory covers Claude, Cursor, Codex, Pi, Hermes and OpenCode]
- [x] CHK-FIX-006 [P1] The advisor Vitest test restores environment changes during cleanup. [EVIDENCE: route-exclusions test passed; test cleanup was inspected]
- [x] CHK-FIX-007 [P1] Evidence uses the explicit baseline `ecf2897455` and the scoped working diff rather than a moving branch-relative range. [EVIDENCE: explicit baseline ecf2897455 used for diff and whitespace evidence]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential or user-message content is introduced in changed files. [EVIDENCE: scoped diff review found no credential or user-message content]
- [x] CHK-031 [P0] The removal changes no input-validation or protected-span behavior in retained runtime code. [EVIDENCE: no retained input-validation or protected-span behavior was edited]
- [x] CHK-032 [P1] The advisor route filter remains limited to routing eligibility and does not broaden access or tool permissions. [EVIDENCE: route filter behavior is covered by the focused passing suite]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` describe the same removal boundary and verification gates. [EVIDENCE: spec, plan, tasks and acceptance criteria share the removal boundary]
- [x] CHK-041 [P1] No code comments are added as part of this deletion phase. [EVIDENCE: no code comments were added for this phase]
- [x] CHK-042 [P2] Historical specs outside this authorized packet and historical changelogs remain untouched; the only changelog deletion is the skill-specific package directory listed in phase 1 scope. [EVIDENCE: history paths are untouched apart from the scoped package changelog deletion]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No task-created temporary files are left in the packet or runtime folders. [EVIDENCE: no task-created scratch or temporary packet files]
- [x] CHK-051 [P1] No scratch files are added for evidence outside the packet's authorized documentation scope. [EVIDENCE: no scratch evidence added outside the authorized packet]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-02. Every checklist item has evidence, and the packet-level trigger-index generation and freshness check passed.
<!-- /ANCHOR:summary -->

---
