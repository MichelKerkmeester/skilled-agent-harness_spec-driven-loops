---
title: "Tasks: Phase 12: legacy-row-migration"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "legacy row migration tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 12: legacy-row-migration

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

- [x] T001 Read phase 011's summary, spec and plan, and census every producer of the seven pinned row kinds (workflow YAMLs, both reducers, the divergent pivot)
- [x] T002 Write the failing tests and see each fail for its own reason (`tests/unit/deep-research-ledger-schema.vitest.ts`, `deep-research-reduce-state.vitest.ts`, `deep-research-bookkeeping-emission.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Register eleven stems with data types, census entries, schema rules and scopes (`lib/deep-research-ledger-schema/deep-research-ledger-types.ts`, `deep-research-ledger-schema.ts`)
- [x] T004 Translate the rows instead of pinning them, keep every row's own UTC timestamp, refuse a mistyped field by name (`lib/deep-research-ledger-schema/legacy-compatibility.ts`)
- [x] T005 Projection arms in the documented key order and ledger reducer no-op arms (`lib/legacy-projections/deep-research-contract.ts`, `lib/deep-research-reducers/deep-research-reducer.ts`)
- [x] T006 Route the pause, recovery, guard and override rows through the gateway, move the migration row after session classification, add the gateway path to the halt (research workflow YAMLs, compiled research contract)
- [x] T007 snake_case removal and reset names and the operator path (`deep-research/references/state/state-jsonl.md`, `deep-research/references/protocol/loop-protocol.md`)
- [x] T011 Append the migration row through the gateway at the top of the iteration loop in both research workflows, drop `log_only_bookkeeping`, rebuild the compiled research contract (research workflow YAMLs, `deep-research-bookkeeping-emission.vitest.ts`)
- [x] T012 Refuse a mistyped config count, topic or executor by name and convert a lossless digit-string count with a warning (`lib/deep-research-ledger-schema/legacy-compatibility.ts`, `deep-research-ledger-schema.vitest.ts`)
- [x] T013 Check the review workflows for the same migration step: it appended before classification into a moved log the gateway refuses with exit 2
- [x] T014 Make the review rehome step move only, adopt a moved legacy state log after classification, append `deep_review.migration` right after the loop's lock refresh in both review workflows, rebuild the compiled review contract (review workflow YAMLs, `deep-review-run-open.vitest.ts`, `deep-review/references/protocol/loop-protocol.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the typecheck, the related deep-loop sweep, the stem census and the bootstrap test
- [x] T009 Swap HEAD's sources in, confirm the new tests fail, restore and `cmp`
- [x] T010 Run strict validation on this folder (RESULT: PASSED)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (lifecycle rows through the real gateway CLI survive the next append)
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-005)
- [x] CHK-002 [P0] Technical approach defined in plan.md (affected-surfaces table)
- [x] CHK-003 [P1] Dependencies identified and available (phase 011, the contract compiler)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (typecheck rc 0, contract drift clean)
- [x] CHK-011 [P0] No console errors or warnings (sweep rc 0)
- [x] CHK-012 [P1] Error handling implemented (named refusals for a mistyped field and an unusable timestamp, a warning where the append time stands)
- [x] CHK-013 [P1] Code follows project patterns (phase 011's shape table, schema rules and census entries)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (AC 8/8)
- [x] CHK-021 [P0] Manual testing complete (lifecycle rows through the real gateway CLI)
- [x] CHK-022 [P1] Edge cases tested (both stuck recovery shapes, null and offset timestamps, an absent timestamp)
- [x] CHK-023 [P1] Error scenarios validated (string run, negative count, wrong stop reason, unknown field, eleven mistyped config counts, a mistyped topic and executor)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Pinned rows and the append time are class-of-bug across every row kind; the halt path and doc names are instance-only.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. The workflows print or append the lifecycle rows, the reducer keeps trend advisories in its registry, and the pivot writes its council state log; the census lists all eleven stems.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Projection contract, ledger reducer switches, both dashboard status readers, compiled research contract, census count test.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Mistyped, unknown-field, missing-field and timestamp refusals in one table.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Twelve row fixtures across eleven stems by upcast, validate and project, plus four upcast arms by kept, absent and offset timestamp.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Gateway tests run in isolated temporary run directories.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Pinned to the working tree on `worktrees/158-open-items-live-hop-and-legacy-rows` against HEAD `79ab266d65`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (none in the diff)
- [x] CHK-031 [P0] Input validation implemented (a schema rule for every new field, checked by name in the upcaster)
- [x] CHK-032 [P1] Auth/authz working correctly (provenance and authorization in the gateway are unchanged)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate (each new rule and arm states why)
- [x] CHK-042 [P2] README updated (if applicable): the two research reference docs
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

**Verification Date**: 2026-10-20
<!-- /ANCHOR:summary -->

---
