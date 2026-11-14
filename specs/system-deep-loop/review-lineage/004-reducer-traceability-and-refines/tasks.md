---
title: "Tasks: Correct deep-review reducer dead ends and refinement counting"
description: "Ordered failing-first test, reducer change and verification tasks for the deep-review reducer packet."
trigger_phrases:
  - "reducer traceability and refines tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Correct deep-review reducer dead ends and refinement counting

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Variables**: `R` is `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`. `T` is `.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-traceability-and-refines.test.cjs`. `P` is `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the parser, registry and boundary functions in `R`. Verify: `rg -n "deadEndsSection|function buildFindingRegistry|function buildExhaustedApproaches|function deltaRecordToFinding|function findingDetailToFinding" R` prints five matching lines.
- [ ] T002 Read every `deadEnds` reader and every structured traceability reader. Verify: `rg -n "deadEnds|traceabilityChecks" .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` lists `parseIterationFile`, `buildExhaustedApproaches` and `buildTraceabilityRollup`.
- [ ] T003 Read the iteration 8 delta shape and the false BLOCKED strategy lines. Verify: `head -1 specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/review/deltas/iter-008.jsonl | jq '.findingDetails[0] | {id, refinementOf, title}'` prints the refinement row.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the three failing-first cases to `T`, with a temporary review fixture, a minimal strategy file and the strategy assertion on `reduceReviewState(..., { write: false, createMissingAnchors: true })`. Verify: `node --test T` exits nonzero with the traceability case and the refines case failing, while the unlinked reuse case passes.
- [ ] T005 Stop mapping `Traceability Checks` to dead ends in `parseIterationFile` at `R`. Verify: `node --test T` now passes the traceability case and the explicit `Dead Ends` assertion.
- [ ] T006 Carry `refines` from `findingDetails[]` in `findingDetailToFinding` and from `type:"finding"` rows in `deltaRecordToFinding`, reading `record.refines || record.refinementOf` and normalizing it as text (`R`). Verify: `node --test T` reaches the fold case with a populated `refines` value.
- [ ] T007 Fold a finding with a resolvable `refines` target in `upsertFinding` before the content-based id-reuse split, updating `lastSeen`, title, description and one transition, then return (`R`). Verify: `node --test T` passes the fold case with `openFindingsCount` 1 and `lastSeen` 2.
- [ ] T008 Ignore transitions whose `from` equals `to` in the `persistentSameSeverity` and `severityChanged` filters (`R`). Verify: `node --test T` passes the fold case with `severityChanged` length 0.
- [ ] T009 Add one line to the iteration output contract in `P` that says to write `refines` with an existing finding id for a refinement and omit it for a new finding. Verify: `rg -n "refines" P` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run the new owning test file. Verify: `node --test T` exits 0 and its summary reports 0 failures.
- [ ] T011 Run the existing reducer fallback suite for compatibility. Verify: `node --test .skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs` exits 0.
- [ ] T012 Run strict packet validation. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-deep-loop/review-lineage/004-reducer-traceability-and-refines --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `node --test T` exits 0 and the strict validator prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

- [ ] CHK-001 [P0] `spec.md` names `R` and the evidence review. Verify: `rg -n "reduce-state.cjs:349|039-hop-dialog-goal-title" spec.md` prints both lines.
- [ ] CHK-002 [P0] `plan.md` names the fold point and the transition filter. Verify: `rg -n "upsertFinding|severityChanged" plan.md` prints both terms.
- [ ] CHK-003 [P1] Node and `node:test` are available. Verify: `node --version` exits 0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `R` parses as CommonJS. Verify: `node --check R` exits 0.
- [ ] CHK-011 [P0] The new test file parses. Verify: `node --check T` exits 0.
- [ ] CHK-012 [P1] The reducer exports stay unchanged. Verify: `node -p "typeof require('./R').reduceReviewState + ' ' + typeof require('./R').parseIterationFile"` prints `function function`.
- [ ] CHK-013 [P1] No code comment names a spec path, packet id or REQ id. Verify: `rg -n "004-reducer|REQ-00|T00" R T` prints no line.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Traceability status lines do not enter the exhausted list. Verify: the traceability case in `T` passes.
- [ ] CHK-021 [P0] An explicit `Dead Ends` entry still enters the exhausted list. Verify: the dead-end assertion in the traceability case passes.
- [ ] CHK-022 [P0] A refines row folds into one finding and updates `lastSeen`, title and transitions. Verify: the fold case in `T` passes.
- [ ] CHK-023 [P0] An id reuse without refines keeps both findings. Verify: the unlinked reuse case in `T` passes.
- [ ] CHK-024 [P1] An unknown refines target falls back to the ordinary insert path. Verify: the fallback assertion in the fold case passes.
- [ ] CHK-025 [P1] The existing summary fallback suite still passes. Verify: T011 exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Both findings name their class. The false BLOCKED entry is `cross-consumer`, the refinement count is `algorithmic`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory is complete. Verify: `rg -n "deadEnds|refinementOf" .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` prints every producer and consumer in this plan.
- [ ] CHK-FIX-003 [P0] Consumer inventory covers the strategy renderer, dashboard counts, `divergent-review-pivot.ts` and the existing reducer tests.
- [ ] CHK-FIX-004 [P0] Parser cases cover the traceability-only input, the explicit dead-end input, the resolved refines input and the unknown refines input.
- [ ] CHK-FIX-005 [P1] Matrix axes and rows are listed in `plan.md` under Affected Surfaces.
- [ ] CHK-FIX-006 [P1] No process-wide state or environment variable is read by the new test cases.
- [ ] CHK-FIX-007 [P1] Evidence pins the failing behavior to the evidence run path and current line numbers, not a moving branch range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential or secret is added. Verify: `rg -n "token|secret|password" T` prints no line.
- [ ] CHK-031 [P0] `refines` is normalized and compared by map key, never evaluated. Verify: the fold implementation contains no `eval` or `Function`.
- [ ] CHK-032 [P1] No new file path or network call is introduced. Verify: `rg -n "http|fetch\\(|writeFile" T` prints only the temporary fixture writes.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same three test cases. Verify: `rg -n "traceability|refines|id reuse" spec.md plan.md tasks.md` prints a matching line in each file.
- [ ] CHK-041 [P1] The prompt template line says when to use `refines`. Verify: `rg -n "refines" P` prints one line.
- [ ] CHK-042 [P2] The reducer changelog is not required for this packet. No entry is planned.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] The new test lives beside the existing reducer tests. Verify: `ls .skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-*.test.cjs` lists both files.
- [ ] CHK-051 [P1] No scratch file remains in the packet. Verify: `find specs/system-deep-loop/review-lineage/004-reducer-traceability-and-refines -name "*.tmp"` prints nothing.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->
