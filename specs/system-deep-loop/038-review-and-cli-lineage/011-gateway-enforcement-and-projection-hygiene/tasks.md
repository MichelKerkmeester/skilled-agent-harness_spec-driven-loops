---
title: "Tasks: Phase 11: gateway-enforcement-and-projection-hygiene"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "gateway enforcement tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: gateway-enforcement-and-projection-hygiene

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
- [x] T002 Replay Luna's failed lineage to confirm each gap, then write the failing tests
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Provenance refusal before the append (`lib/mode-append-gateway/append-mode-event.ts`, `scripts/append-mode-event.cjs`)
- [x] T004 Topic in research and review `run_initialized`, projector and YAMLs (schemas, contracts, workflow YAMLs, compiled contracts)
- [x] T005 Reducer step in the CLI brief (`scripts/fanout-run.cjs`)
- [x] T006 Idempotent append and `IDEMPOTENCY_CONFLICT` (gateway, CLI)
- [x] T007 `unattributed_state_log` failure class and gateway-backed stubs (`scripts/lib/cli-guards.cjs`, `fanout-pool.cjs`, `tests/helpers/gateway-backed-lineage.ts`)
- [x] T008 Registered `question_conflict` and `idea_promoted`, routed through the gateway (`deep-research/scripts/reduce-state.cjs`, schemas, projector)
- [x] T009 Registered idea observation and rejection stems, and the upcaster translates them (`legacy-compatibility.ts`, schemas, reducer, projector)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the related deep-loop sweep, the stem census, the bootstrap test and the typecheck
- [x] T011 Run strict validation on this folder (RESULT: PASSED)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (Luna replay refused with no ledger frame)
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-004)
- [x] CHK-002 [P0] Technical approach defined in plan.md (affected-surfaces table)
- [x] CHK-003 [P1] Dependencies identified and available (phase 010, the contract compiler)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (typecheck rc 0, drift guards)
- [x] CHK-011 [P0] No console errors or warnings (sweep rc 0)
- [x] CHK-012 [P1] Error handling implemented (named refusal codes; a reducer refusal throws instead of losing a row)
- [x] CHK-013 [P1] Code follows project patterns (stems registered with schema rules and census entries)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (AC 5/5)
- [x] CHK-021 [P0] Manual testing complete (Luna replay)
- [x] CHK-022 [P1] Edge cases tested (blank topic, reused key on another kind, camelCase rows, undocumented alias fields)
- [x] CHK-023 [P1] Error scenarios validated (projection failure after a clean append, lineage with no ledger)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Dropped rows are class-of-bug across research, review and idea events; enforcement and idempotency are algorithmic.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. The stem census lists every registered and spoken stem; the review reducer has no direct state-log append.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Projection contracts, `fanout-pool` rollups, workflow YAMLs, compiled contracts and the gateway README.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Upcaster refusals for unknown fields, missing fields and non-UTC timestamps.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Seven idea and conflict row types by upcast, validate and project.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Gateway tests run in isolated temporary run directories.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Pinned to the phase commit on `worktrees/156-session-relaunch-post-fix-remediation`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (none in the diff)
- [x] CHK-031 [P0] Input validation implemented (schema rules for every new field and stem)
- [x] CHK-032 [P1] Auth/authz working correctly (provenance runs before authorization; the attribution guard is unchanged)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate (each new check states why)
- [x] CHK-042 [P2] README updated (if applicable): the gateway module README
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
