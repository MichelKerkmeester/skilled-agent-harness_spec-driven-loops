---
title: "Tasks: Doctor sk-code setup"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "doctor sk-code setup tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Doctor sk-code setup

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

- [x] T001 Create the worktree from origin/main once 001 is on it; confirm the route recipe at `.skilled/commands/doctor/_routes.yaml:35-36` and the read-only rule in `route-validate.sh`
- [x] T002 Record baselines: `route-validate.sh`, `run-all.sh`, the runtime mirror sync `--check` and `command-catalog-mirror-check.cjs`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Route row and command doc with router and presentation (`.skilled/commands/doctor/_routes.yaml`, `sk-code.md`, `assets/doctor-sk-code-setup.yaml`, `assets/doctor-sk-code-presentation.txt`)
- [x] T004 [P] Read-only check script and its test (`.skilled/commands/doctor/scripts/sk-code-setup-check.cjs`, `scripts/tests/`)
- [x] T005 [P] Index rows and the three reference lines (`.skilled/commands/README.txt`, `README.md`, `.skilled/skills/sk-code/README.md`, `.skilled/skills/sk-code/SKILL.md`)
- [x] T006 Regenerate the runtime command mirrors
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run S-1 to S-3 in throwaway copies and record them
- [x] T008 Run `/deep:review :auto` for 5 iterations; fix and record each confirmed finding as an RV row
- [x] T009 Fill the ledger, run `check-goal.cjs` and strict `validate.sh`, delete the copies
- [x] T010 Add the manual playbook scenario DOC-382 for `/doctor:sk-code setup` in the sk-code playbook and list it in the doctor scenario index
- [x] T011 Make the probe leg name `SPECKIT_COMPILED_ROUTING` when that switch, not a stale manifest, serves the legacy stub, with one test that fails on the old script
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
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Changed scripts pass `node --check`
- [x] CHK-011 [P0] No new console errors or warnings in the live gates
- [x] CHK-012 [P1] Error handling names the failure and the fix
- [x] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Every ledger row (S-1 to S-3) recorded with a backticked proof
- [x] CHK-022 [P1] Edge cases in `spec.md` checked
- [x] CHK-023 [P1] Copy runs stayed outside the worktree, under the session scratchpad
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Not applicable: no fix touched security, a path, a parser or redaction
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. The suite sets `SK_CODE_SETUP_ROOT` per run; the live battery and S-1 to S-3 ran with it unset
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Paths and commands a script now reports are repository-relative and printed, never executed
- [x] CHK-032 [P1] Auth/authz working correctly: not applicable, no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments keep the durable why and no packet labels
- [x] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
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
