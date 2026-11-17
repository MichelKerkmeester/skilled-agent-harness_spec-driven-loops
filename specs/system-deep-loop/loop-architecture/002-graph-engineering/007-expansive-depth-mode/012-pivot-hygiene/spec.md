---
title: "Feature Specification: Divergent pivot hygiene: seat cap scope, dead minRemainingIterations guard, one council retry"
description: "The divergent pivot's council seat cap is lifetime, so a resumed or failed pivot shrinks every later pivot; its minRemainingIterations guard can never fire; and a council quorum failure fails closed with no retry. This phase caps seats at 3 per council attempt with at most one retry per pivot, as the operator decided, retires the dead guard and adds one retry for quorum failures."
trigger_phrases:
  - "pivot hygiene"
  - "maxCouncilSeatOutputs per pivot"
  - "slice l pivot hygiene"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Divergent pivot hygiene: seat cap scope, dead minRemainingIterations guard, one council retry

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | None. This slice ships in any order with the other defect slices. |
| **Successor** | None. No other slice depends on it. |
| **Source** | Parent `research/research.md` §12 item 4, §18 pivot yield, Eliminated Alternatives (`minRemainingIterations`), §20 Slice L |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The divergent pivot (`runtime/lib/deep-loop/divergent-pivot.ts`) has three hygiene gaps. `maxCouncilSeatOutputs: 9` is a lifetime cap that three pivots of three seats fill exactly, so a pivot that is resumed or fails still consumes seats and shrinks every later pivot. `minRemainingIterations: 1` is checked at :739 but can never fire, because a run with no iterations left is stopped by the `maxIterationsReached` cap at `convergence.cjs:1115` before the pivot path runs. And a council quorum failure (`council_all_seats_rejected`, `council_return_quorum_failed`, `council_parse_quorum_failed`) fails closed with no retry, so one transient dispatch problem ends the pivot.

### Purpose
The seat cap has the scope the operator chose, the dead guard no longer pretends to protect anything, and a transient council quorum failure gets exactly one retry inside the seat budget.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run from `.skilled/skills/system-deep-loop/runtime`.
```text
$ rg -n "maxCouncilSeatOutputs: 9|minRemainingIterations: 1|councilSeatOutputs \+ 3 >|remainingIterations < config" lib/deep-loop/divergent-pivot.ts
286:  maxCouncilSeatOutputs: 9,
287:  minRemainingIterations: 1,
736:  if (usage.councilSeatOutputs + 3 > config.maxCouncilSeatOutputs) {
739:  if (usage.remainingIterations < config.minRemainingIterations) {
$ rg -n "iterationCount >= " scripts/convergence.cjs
1115:  if (iterationCount >= maxIterations) {
```
The seat check adds 3 per pivot against a total of 9. The remaining-iterations check sits behind the cap at :1115, which stops the run first.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record the operator's choices on the seat-cap scope in `decision-record.md`: 3 seat outputs per council attempt, at most one retry per pivot, so at most 6 per pivot (decided 2026-11-17).
- Apply that scope in the limit check at `divergent-pivot.ts:736` and in how usage is accumulated (:1485-1486).
- Stop enforcing `minRemainingIterations` while still accepting it in configs and persisted pivot limits (:463, :1025-1032).
- Retry the council round once on a quorum failure, never on `council_agreement_failed`.

### Out of Scope
- `maxPivots` and its default of 3.
- Council seat mandates and candidate seeding. Pivot yield is bound by council agreement, which a retry does not change.
- Making `minRemainingIterations` reachable by redefining it. That would change pivot behavior near the cap, which no finding asks for.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts` | Modify | Seat-cap scope per ADR-001 (:286, :736, :1485-1486); drop the :739 check while keeping the field readable; let finalize report a quorum failure as retryable once and let prepare open a second seat round for the same pivot |
| `.skilled/skills/system-deep-loop/runtime/scripts/divergent-pivot.cjs` | Modify | Carry the retry signal through the `prepare` and `finalize` subcommands, the workflow-facing seam |
| `.skilled/commands/deep/assets/deep-research.yaml` | Modify | In the pivot failure branch after `step_finalize_divergent_pivot` (:1112-1207), go back to `step_prepare_divergent_pivot` once when finalize marks the failure retryable |
| `.skilled/commands/deep/assets/deep-review.yaml` | Modify | The same one-time re-entry after its `step_finalize_divergent_pivot` (:1206) |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/divergent-pivot.vitest.ts` | Modify | Cases for the seat scope, the retry and the persisted-limits read |
| `.skilled/skills/system-deep-loop/runtime/tests/council/multi-seat-dispatch.vitest.ts` | Modify | A case that a retried round dispatches three fresh seats |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The operator's seat-cap choice is recorded before the cap changes. | `decision-record.md` ADR-001 shows `Accepted` and names per-pivot or lifetime, with one Operator Decisions row. |
| REQ-002 | A council quorum failure is retried once, and the retry attempt gets its own 3 seat outputs. | A `divergent-pivot.vitest.ts` case: first attempt returns 2 of 3 seats, the retry attempt returns 3 valid seats; the pivot completes and records 6 seat outputs. A second consecutive quorum failure fails closed with the original reason, and no third attempt is opened. |
| REQ-003 | `council_agreement_failed` is not retried. | A case where three valid seats disagree fails closed after one round with `council_agreement_failed` and records 3 seat outputs. |
| REQ-004 | Persisted pivot limits that carry `minRemainingIterations` still load. | A case reading a persisted config with `minRemainingIterations: 1` parses without error, and no pivot is refused with `insufficient_remaining_iterations`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The seat cap follows ADR-001: 3 seat outputs per council attempt, at most one retry per pivot. | A case where pivot 1 used 6 seats (with retry) still allows pivot 2, and no pivot records more than 6 seat outputs. |
| REQ-006 | Default runs are unaffected. | `divergent-pivot.vitest.ts`, `divergent-pivot-cli.vitest.ts` and `multi-seat-dispatch.vitest.ts` pass; the divergent path runs only under `--convergence-mode divergent`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npm test -- tests/integration/divergent-pivot.vitest.ts tests/council/multi-seat-dispatch.vitest.ts tests/unit/divergent-pivot-cli.vitest.ts` from `.skilled/skills/system-deep-loop/runtime` passes, including the new cases.
- **SC-002**: `rg -n "insufficient_remaining_iterations" lib/deep-loop/divergent-pivot.ts` shows the reason kept only in the reason set for reading older events, with no live check producing it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The seat round is driven by the workflow, not by code: the YAML runs prepare, three seat dispatches, record-seat and finalize. A retry built only in `divergent-pivot.ts` would never run. | Med | The retry is a one-time YAML re-entry into prepare, signalled by finalize; both YAMLs change together |
| Dependency | Operator decision on parent §12 item 4 | The seat-cap and retry tasks wait for ADR-001; the dead-guard task does not | T001 first; T008 can proceed in parallel |
| Risk | Default-path risk is LOW: the pivot runs only in `divergent` convergence mode, which is opt-in (`.skilled/commands/deep/research.md:103`). | Low | REQ-006 suites |
| Risk | Each retry costs three more seat outputs, so a run's worst-case seat cost rises from 9 to 18. | Low | The retry fires only on a quorum failure and at most once per pivot (ADR-001) |
| Risk | Removing the field outright would break reads of persisted pivot limits, which list it as required (:1025). | Med | Keep the field accepted on read; only the check is dropped (REQ-004) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Answered 2026-11-17: `maxCouncilSeatOutputs` is 3 per council attempt, and the one retry per pivot gets its own 3, so one pivot uses at most 6. See `decision-record.md` ADR-001.
- Narrowing note: parent §20 Slice L says one retry for `council_*` refusals. This phase retries only the three quorum failures, because `council_agreement_failed` is a substantive verdict a re-run would only repeat at three more seats. The operator can widen it in ADR-001.
<!-- /ANCHOR:questions -->

---
