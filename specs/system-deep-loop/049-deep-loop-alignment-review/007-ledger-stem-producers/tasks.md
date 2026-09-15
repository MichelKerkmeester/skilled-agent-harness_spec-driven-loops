---
title: "Tasks: Phase 6: ledger-stem-producers"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: ledger-stem-producers

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
## Phase 1: Discovery and measurement

- [x] T001 Count both stem arrays: 32 `deep_review.*` plus 29 `deep_research.*`, 61 registered stems (`runtime/lib/deep-*-ledger-schema/*-ledger-types.ts`)
- [x] T002 Measure the producer surface: nine files scanned, five stems spoken, ten emitter occurrences; the five runtime `.cjs` scripts hold zero dotted literals
- [x] T003 Measure the reader surface: no vocabulary section and no mention of the typed adjudication spelling across the eight state reference documents
- [x] T004 Trace the flat adjudication spelling through the legacy reducer and both projection contracts to establish it is overloaded, not an alias (`runtime/scripts/reduce-state.cjs`, `runtime/lib/legacy-projections/deep-review-projections-contract.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Registration and census

- [x] T005 Add `DeepReviewStemProducerStatus` and `DEEP_REVIEW_STEM_PRODUCERS` beside the review stem array, one entry per stem (`runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts`)
- [x] T006 Add `DeepResearchStemProducerStatus` and `DEEP_RESEARCH_STEM_PRODUCERS` beside the research stem array (`runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts`)
- [x] T007 Re-export both censuses from their barrels (`runtime/lib/deep-review-ledger-schema/index.ts`, `runtime/lib/deep-research-ledger-schema/index.ts`)
- [x] T008 Declare the flat gate-summary adjudication canonical in its own right rather than a shortened typed record (`runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Enforcement

- [x] T009 Write the conformance checker: exit 0 clean, 1 script error, 2 violation, JSON on stdout, `--repo-root` (`runtime/scripts/check-ledger-stem-producers.cjs`)
- [x] T010 Write the vitest wrapper with mkdtemp fixture trees per rule plus the real-tree run (`runtime/tests/unit/check-ledger-stem-producers.vitest.ts`)
- [x] T011 Run the checker on the committed tree: registered 61, spoken 5, reserved 56, violations 0, exit 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: The two decisions made falsifiable

- [x] T012 Cross-post both adjudication payloads under the other's stem and assert both are rejected (`runtime/tests/unit/deep-review-ledger-schema.vitest.ts`)
- [x] T013 Fold a flat adjudication event and assert it stays out of the typed adjudication array (`runtime/tests/unit/deep-review-projections-contract.vitest.ts`)
- [x] T014 Add the `ATTRIBUTION_COLLAPSE` code and the no-loss replace guard with its refusal case (`runtime/lib/legacy-projections/legacy-projection-errors.ts`, `runtime/lib/legacy-projections/shadow-projection-store.ts`, `runtime/tests/unit/legacy-projections.test.ts`)
- [x] T015 Seed a projection-consistent config row in the synthesis fixture so the guard is not tripped by a synthetic row (`runtime/tests/unit/fanout-merge.vitest.ts`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Reporting and prose

- [x] T016 Report the frames root that backed the run, keeping the parent-of-lineage root as a warning (`runtime/scripts/verify-iteration.cjs`, `runtime/tests/unit/verify-iteration.vitest.ts`)
- [x] T017 Cover the verify-authority CLI: stored, default and malformed records plus argument handling (`runtime/tests/unit/verify-authority-cli.vitest.ts`)
- [x] T018 State the vocabulary, the authority-dependent write target and the projection ceiling in all eight state reference documents
- [x] T019 Regenerate the two compiled command contracts (`check-contract-drift.cjs` reports `OK commands=3`)
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Verification

- [x] T020 Comment-hygiene sweep over the fifteen changed code files: clean
- [x] T021 Run the eight suites covering the change set: 8 files, 90 tests passed; the nine-suite re-run from the final state passes 9 files, 146 tests
- [x] T022 Run `npm run typecheck`: one pre-existing, unrelated error only (`lib/deep-loop/executor-config.ts`)
- [x] T023 Run the full deep-loop suite: 153 of 154 files passed, 2676 of 2685 tests passed; one external red recorded below
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] The deep-loop suite exits zero — blocked by `tests/stress/cli-adapter/fanout.vitest.ts` "fails before fan-out execution when the executor transport is unavailable", which fails deterministically in isolation for a reason outside this change set: the fixture sets `PATH=/usr/bin:/bin` for `includeTransport:false`, and the executor probe added to `fanout-run.cjs` by commit `2a84717ed3` (the cli-hermes track's `015-wire-executor-builders`) now refuses before the adapter runs, while the assertion still expects the adapter's own exit code. This packet is not the owner of either side.
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
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Lint/format: no lint or formatter is configured in this repository; the standing gates are the comment-hygiene script and `tsc`, both run clean
- [x] CHK-011 [P0] No console errors or warnings: no unintended output from the touched suites
- [x] CHK-012 [P1] Error handling implemented: checker exit codes 1 and 2, `ATTRIBUTION_COLLAPSE` refusal, arguments validated
- [x] CHK-013 [P1] Code follows project patterns: CommonJS script with `parseArgs`-style flags, vitest wrappers that spawn the real script, census beside its array
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met: AC-008 (the suite exits zero) is Unmet for the external reason recorded in the completion criteria
- [x] CHK-021 [P0] Manual testing complete: the checker, the drift check and the packet validator were each run by hand
- [x] CHK-022 [P1] Edge cases tested: escaped YAML scalar, missing producer surface, reserved stem emitted, undeclared stem, unregistered emitter, unparseable census
- [x] CHK-023 [P1] Error scenarios validated: exit 1 on bad arguments, exit 2 on violations, refusal leaves published bytes untouched
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `class-of-bug` (an unenforced registry) plus `matrix/evidence` (the census)
- [x] CHK-FIX-002 [P0] Same-class producer inventory: nine producer files, five `.cjs` scripts holding zero dotted literals
- [x] CHK-FIX-003 [P0] Consumer inventory: both schema barrels, the conformance checker, the projection contracts, the eight reference documents, the compiled contracts
- [x] CHK-FIX-004 [P0] Adversarial table tests: the checker's fixture matrix covers delimiter-adjacent prose, escaped quotes, joined input and missing files; the guard covers torn output and the no-op path
- [x] CHK-FIX-005 [P1] Matrix axes: mode x declaration x emitter state, listed in `plan.md`
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant: `DEEP_LOOP_LEDGER_BACKING_GATE=0` and pre-authority states are covered by the frames-root tests
- [x] CHK-FIX-007 [P1] Evidence pinned to the landing commit `1735176985`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented: the checker validates its arguments and treats unparseable input as a script error
- [x] CHK-032 [P1] Auth/authz not applicable: no authenticated surface was touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate: every added comment states the durable why, with no ephemeral identifiers
- [x] CHK-042 [P2] README not applicable: the vocabulary is documented where readers meet it, in the two modes' state references
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: the fixture trees live under the system temp directory and are removed after each run
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

The unverified P0 item is CHK-020, which cannot pass while AC-008 is Unmet. Everything
else on this checklist was run and observed; nothing here is inferred.

**Verification Date**: 2026-09-15
<!-- /ANCHOR:summary -->

---


