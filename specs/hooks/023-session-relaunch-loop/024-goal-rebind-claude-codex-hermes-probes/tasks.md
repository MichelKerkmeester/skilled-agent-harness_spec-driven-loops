---
title: "Tasks: Phase 24: goal-rebind-claude-codex-hermes-probes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal rebind probes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 24: goal-rebind-claude-codex-hermes-probes

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

- [ ] T001 Ask the operator whether a bypass flag may be used, and run every probe without one first (the operator answer goes in scratch/)
- [ ] T002 Create a throwaway directory outside the repository and record the Claude, Codex and Hermes versions
- [ ] T003 Baseline: record that `git status` shows no change outside this folder before the first probe
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Probe A: start Claude with a `/goal` start prompt, record whether it ran as a command, then run the plain-text control (scratch/probe-a-claude-start-prompt.md)
- [ ] T005 Probe B: add a throwaway SessionStart hook that tries to run `/goal`, record the result, then run a hook that returns nothing (scratch/probe-b-claude-start-hook.md)
- [ ] T006 Probe C: ask Codex to create a goal through the start prompt and through hook context, record the limit it shows, then run a prompt that asks for nothing (scratch/probe-c-codex-goal.md)
- [ ] T007 Probe D: export `HERMES_SPEC_FOLDER`, start two sessions with different ids and read the goal in the second, then repeat without the export (scratch/probe-d-hermes-spec-folder.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Write one verdict per probe in `implementation-summary.md`, saying what each run cannot show
- [ ] T009 Name the phase 27 path and the probe that selected it
- [ ] T010 Confirm no goal, hook or process is left behind and `git status` shows only this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Claude, Codex and Hermes start on this machine, or the missing one is recorded as SKIP
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No code changed, so `git status` lists only files in this folder
- [ ] CHK-011 [P0] No console errors or warnings in the suite output
- [ ] CHK-012 [P1] Error handling implemented, and a failed step never blocks a session start
- [ ] CHK-013 [P1] Each record names the runtime version and the exact command
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met (see acceptance-criteria.md)
- [ ] CHK-021 [P0] Every probe has its run and its control saved under scratch/
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests.
- [ ] CHK-FIX-004 [P0] No path, parser or redaction change is in this phase, so no adversarial table applies.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Each probe ran with the loop environment variables unset, so a looped session did not leak into it.
- [ ] CHK-FIX-007 [P1] Each record names the runtime version it ran on, which pins the evidence.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential printed, logged or written, and `coder/.env` never opened
- [ ] CHK-031 [P0] The hook probe reads no input beyond the throwaway text
- [ ] CHK-032 [P1] Auth and authz not applicable: the state files are local and keep their `0o700` directory mode
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks synchronized
- [ ] CHK-041 [P1] Code comments carry the reason, with no artifact ids
- [ ] CHK-042 [P2] The implementation summary is the only doc that changes
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files kept in the session scratchpad or scratch/
- [ ] CHK-051 [P1] scratch/ holds only evidence this packet cites
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-24
<!-- /ANCHOR:summary -->

---
