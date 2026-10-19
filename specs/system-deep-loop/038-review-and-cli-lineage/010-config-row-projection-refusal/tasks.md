---
title: "Tasks: Phase 10: config-row-projection-refusal"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "config row projection refusal tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: config-row-projection-refusal

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

- [x] T001 Scaffold the phase folder with `create.sh --phase --parent` (this folder)
- [x] T002 Trace the refusal to the direct writes in the codex session log and reproduce it through the gateway (`implementation-summary.md`, Root Cause)
- [x] T003 Write the brief test first and prove it red on the HEAD runner (`fanout-loop-prompt-in-process.test.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Send every state record through the gateway in the in-process brief (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`)
- [x] T005 Point the `findingsCount` and timestamp lines at the record handed to the gateway (`fanout-run.cjs`)
- [x] T006 Name the gateway in both pre-dispatch notes (`deep-research-auto.yaml`, `deep-review-auto.yaml`)
- [x] T007 Rebuild the compiled research and review contracts (`.skilled/command-support/deep/assets/compiled/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the 41 related deep-loop suites (834 passed, 2 skipped, exit 0)
- [x] T009 Run `node --check`, the drift guards and the runtime mirror check (all exit 0)
- [x] T010 Run strict validation on this folder (RESULT: PASSED)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (red swap on the HEAD runner, then byte-for-byte restore)
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-003)
- [x] CHK-002 [P0] Technical approach defined in plan.md (affected-surfaces table)
- [x] CHK-003 [P1] Dependencies identified and available (the codex session log, the contract compiler)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (drift guards 4/4, `node --check` exit 0)
- [x] CHK-011 [P0] No console errors or warnings (suites exit 0; drift warnings are pre-existing and non-blocking)
- [x] CHK-012 [P1] Error handling implemented (the guard keeps refusing a hand-written row)
- [x] CHK-013 [P1] Code follows project patterns (the brief keeps its line-array form)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (AC 4/4)
- [x] CHK-021 [P0] Manual testing complete (red swap and restore; gateway reproduction)
- [x] CHK-022 [P1] Edge cases tested (review and research, cli-codex and cli-opencode)
- [x] CHK-023 [P1] Error scenarios validated (the reproduction shows the refusal on the hand-written row and success on a gateway-opened log)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. The direct-write instruction is class-of-bug across the brief and both workflow notes.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. `rg -n "state record" .skilled/skills/system-deep-loop/runtime/scripts .skilled/commands/deep/assets` shows no remaining direct-write wording.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. The brief's readers are the CLI lineages; the workflows' reader is the contract compiler, rebuilt.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Not a path or parser fix; the guard is unchanged.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Two loop types by two CLI kinds, four briefs checked.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. The brief reads no process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Pinned to the phase commit on `worktrees/154-deep-loop-config-row-projection`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (none in the diff)
- [x] CHK-031 [P0] Input validation implemented (the gateway still authorizes and fences every record)
- [x] CHK-032 [P1] Auth/authz working correctly (the attribution guard is untouched)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate (the brief states why a direct row fails)
- [x] CHK-042 [P2] README updated (if applicable): not applicable, no documented behavior changed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (run scratch lives in the session scratchpad)
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

**Verification Date**: 2026-10-19
<!-- /ANCHOR:summary -->

---
