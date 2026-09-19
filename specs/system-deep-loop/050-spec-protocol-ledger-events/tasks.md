---
title: "Tasks: Give the deep-research ledger its own spec-protocol events"
description: "Ordered tasks for adding the spec-protocol research event stems."
trigger_phrases:
  - "spec protocol ledger events tasks"
  - "packet 050 tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Give the deep-research ledger its own spec-protocol events

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

- [x] T001 Get the operator's go-ahead for a durable format change (2026-09-19: build it with DeepSeek V4.1 Flash on cli-pi)
- [x] T002 Replay the committed research ledger fixtures and record their fingerprints (23 ledgers, 175 events, through the runtime at `d71a52c736`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the seven stems, wire types, payload and scope types, and producers (`deep-research-ledger-types.ts`); producers declared `reserved`, since only the upcast reaches them
- [x] T004 Add their field rules and scopes, and the `prose-array` rule (`deep-research-ledger-schema.ts`)
- [x] T005 Upcast the seven legacy rows instead of pinning them (`legacy-compatibility.ts`)
- [x] T006 Add no-op reducer cases and the legacy projection (`deep-research-reducer.ts`, `legacy-projections/deep-research-contract.ts`)
- [x] T007 Name the stems in the spec-check protocol reference (§6)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Test field rules and the round trip per row, including every folder state and conflict kind
- [x] T009 Run `append-mode-event.cjs` on each row, including the one that failed in phase 15 of packet 041
- [x] T010 Replay the fixtures again and compare fingerprints (heads, events, stems and fold outcomes identical)
- [x] T011 Run the whole deep-loop suite
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available: the run-now precedent and the operator's go-ahead
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks: `npm run typecheck` exit 0; the runtime has no lint script
- [x] CHK-011 [P0] No console errors or warnings: the whole deep-loop suite passes
- [x] CHK-012 [P1] A malformed spec-protocol row is refused with a named reason: `spec-mutation-fields-missing`, tested in the CLI suite
- [x] CHK-013 [P1] Code follows the run-now stem precedent: the same five tables, with producers `reserved` instead of `spoken`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] The phase 15 failing command succeeds: the old runtime refuses the `spec_mutation` row as `legacy-record-has-no-lossless-mode-event`, the new one appends it
- [x] CHK-022 [P1] Unknown folder states and conflict kinds are refused: both fields are enum rules, tested with an unknown value each
- [x] CHK-023 [P1] Each new test fails before the change: the upcast test fails on the pre-build runtime, the enum test on the pre-closure schema, and the old CLI refuses the rows the CLI tests append
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each finding has a class: the refused rows are a missing contract across two workflows; the shape-only folder state was a spec-to-code gap in one table
- [x] CHK-FIX-002 [P0] Every workflow site that emits a spec-protocol row is inventoried: 15 `append_to_jsonl` sites, 7 in the auto workflow and 8 in confirm
- [x] CHK-FIX-003 [P0] Every consumer of the research stem list is inventoried: reducer, projection, checkers
- [x] CHK-FIX-004 [P0] Field-rule cases cover every enumerated value and a malformed row
- [x] CHK-FIX-005 [P1] Matrix: seven rows by accept, project and replay
- [x] CHK-FIX-006 [P1] Committed fixtures replay unchanged
- [x] CHK-FIX-007 [P1] Evidence pinned to a commit range: `d71a52c736..beb1a0bcc6` for the build, then the closure commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Payload fields keep the schema's prose and token limits
- [x] CHK-032 [P1] No gate bypass variable used: the build children ran with the cli-pi child envelope, the documented dispatch path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] No ephemeral ids in code comments: the added comment lines carry no packet, phase or requirement id
- [x] CHK-042 [P2] Spec-check protocol reference names the stems
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in the session scratchpad only
- [x] CHK-051 [P1] scratch/ holds nothing but its placeholder
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-19
<!-- /ANCHOR:summary -->

---



