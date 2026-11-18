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
| **Status** | Complete |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | None. This slice ships in any order with the other defect slices. |
| **Successor** | `../010-research-frontier-mode/` and `../011-review-frontier-mode/`. Both gate the pivot branch this slice rewrites for the retry (research `deep-research.yaml:1056-1112`, review `deep-review.yaml:1158-1206`), and 011 also edits `divergent-review-pivot.ts`, so land this slice before either. |
| **Source** | Parent `research/research.md` §12 item 4, §18 pivot yield, Eliminated Alternatives (`minRemainingIterations`), §20 Slice L; plan review `../scratch/fable-5-2-plan-review.md` F012-1 to F012-3, X-1, X-4, X-7, X-9, F014-2 |
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
- Apply that scope in the limit check at `divergent-pivot.ts:736`, in how usage is accumulated (:1485-1486), and where usage is counted: `divergent-research-pivot.ts:420` and `divergent-review-pivot.ts:405` count every `pivot_seat_returned` event the run ever wrote (`readPivotEvents(artifactRoot)`), a lifetime number. Both counts are scoped to the current pivot id and attempt.
- Stop enforcing `minRemainingIterations` while still accepting it in configs and persisted pivot limits (:463, :1025-1032).
- Retry the council round once on a quorum failure, never on `council_agreement_failed`, with an attempt number (1 or 2) carried in event ids, seat output paths and the persisted pivot config.
- Regenerate both compiled contracts, add a changelog entry for the new seat-cap meaning and a manual testing playbook scenario for the retry.

### Out of Scope
- `maxPivots` and its default of 3.
- Council seat mandates and candidate seeding. Pivot yield is bound by council agreement, which a retry does not change.
- Making `minRemainingIterations` reachable by redefining it. That would change pivot behavior near the cap, which no finding asks for.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts` | Modify | Seat-cap scope per ADR-001 (:286, :736, :1485-1486); drop the :739 check while keeping the field readable; let finalize report a quorum failure as retryable once and let prepare open a second attempt for the same pivot. The attempt needs an identity everywhere the code fixes one today: seat event ids (`seatEventId`, :600-601), the `pivot_failed` and `pivot_deliberation_completed` ids (:1295, :1423, :1441), `eventByName` (:596-598, returns the first match), seat output paths (`buildPivotCouncilPaths`, :807-830, fixed `seat-001.md` to `seat-003.md`) and the persisted config check `invariants.rounds === 1` (:1130-1165). Seat ids stay `seat-001` to `seat-003`, because `REQUIRED_SEAT_IDS` (:283) is enforced by index (:500-501) |
| `.skilled/skills/system-deep-loop/runtime/scripts/divergent-pivot.cjs` | Modify | Carry the retry signal and the attempt number through the `prepare` and `finalize` subcommands, the workflow-facing seam |
| `.skilled/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts` | Modify | Scope the seat count at :420 to the current pivot id and attempt. `../010-research-frontier-mode/` may also edit this file |
| `.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts` | Modify | Scope the seat count at :405 to the current pivot id and attempt. `../011-review-frontier-mode/` also edits this file |
| `.skilled/commands/deep/assets/deep-research.yaml` | Modify | In the pivot failure branch after `step_finalize_divergent_pivot` (:1112-1207), go back to `step_prepare_divergent_pivot` once when finalize marks the failure retryable |
| `.skilled/commands/deep/assets/deep-review.yaml` | Modify | The same one-time re-entry after its `step_finalize_divergent_pivot` (:1206) |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown`, `deep-review.contract.markdown` | Regenerate | Both YAMLs are digest sources: `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/research --write` and `--command deep/review --write` |
| `.skilled/skills/system-deep-loop/changelog/` | Create | A changelog entry stating the new meaning of `maxCouncilSeatOutputs` (3 per council attempt) and the one retry |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/` | Modify | A retry scenario through `/create:manual-testing-playbook system-deep-loop update` |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/divergent-pivot.vitest.ts` | Modify | Cases for the seat scope, the retry (attempt-2 event ids and seat paths do not collide with attempt 1), the persisted-limits read and the scoped seat count |
| `.skilled/skills/system-deep-loop/runtime/tests/council/multi-seat-dispatch.vitest.ts` | Baseline only | Unchanged. It tests `dispatchCouncilSeats` with any seat ids; the workflow, not that module, drives the pivot's seats, so a retry case there would not touch the changed code |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The operator's seat-cap choice is recorded before the cap changes. | `decision-record.md` ADR-001 shows `Accepted` and names 3 seat outputs per council attempt with at most one retry per pivot; OD-001 and OD-002 carry the decision. |
| REQ-002 | A council quorum failure is retried once, and the retry attempt gets its own 3 seat outputs. | A `divergent-pivot.vitest.ts` case: first attempt returns 2 of 3 seats, the retry attempt returns 3 valid seats; the pivot completes and records 6 seat outputs. A second consecutive quorum failure fails closed with the original reason, and no third attempt is opened. |
| REQ-003 | `council_agreement_failed` is not retried. | A case where three valid seats disagree fails closed after one round with `council_agreement_failed` and records 3 seat outputs. |
| REQ-004 | Persisted pivot limits that carry `minRemainingIterations` still load. | A case reading a persisted config with `minRemainingIterations: 1` parses without error, and no pivot is refused with `insufficient_remaining_iterations`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The seat cap follows ADR-001: 3 seat outputs per council attempt, at most one retry per pivot. | A case where pivot 1 used 6 seats (with retry) still allows pivot 2, no pivot records more than 6 seat outputs, and resuming an open attempt that holds 2 seat returns is not refused by the cap. |
| REQ-006 | Default runs are unaffected. | `divergent-pivot.vitest.ts`, `divergent-pivot-cli.vitest.ts` and `multi-seat-dispatch.vitest.ts` pass; the divergent path runs only under `--convergence-mode divergent`. |
| REQ-007 | The retry attempt has its own identity. | A `divergent-pivot.vitest.ts` case: after a retried pivot, the state log holds attempt-1 and attempt-2 seat events with distinct event ids, both attempts' seat files exist, the persisted config parses, and a pivot written before this change (attempt 1 ids, `invariants.rounds: 1`) still loads. A first-attempt quorum failure writes no terminal `pivot_failed`. |
| REQ-008 | The seat count is scoped. | A case with two pivots in one artifact root: the usage that `divergent-research-pivot.ts` and `divergent-review-pivot.ts` pass for pivot 2 counts 0 seat outputs, not pivot 1's. |
| REQ-009 | Generated and documented surfaces stay in step. | `check-contract-drift.vitest.ts` and `compile-command-contracts.vitest.ts` pass after both contracts are regenerated; a changelog entry and a council playbook retry scenario exist. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/divergent-pivot.vitest.ts tests/council/multi-seat-dispatch.vitest.ts tests/unit/divergent-pivot-cli.vitest.ts` passes, including the new cases.
- **SC-002**: `rg -n "insufficient_remaining_iterations" lib/deep-loop/divergent-pivot.ts` shows the reason kept only in the reason set for reading older events, with no live check producing it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The seat round is driven by the workflow, not by code: the YAML runs prepare, three seat dispatches, record-seat and finalize. A retry built only in `divergent-pivot.ts` would never run. | Med | The retry is a one-time YAML re-entry into prepare, signalled by finalize; both YAMLs change together |
| Dependency | Operator decision on parent §12 item 4 | None now: ADR-001 is Accepted (OD-001, OD-002), so no task waits on it | T001 is done |
| Dependency | `../010-research-frontier-mode/` and `../011-review-frontier-mode/` change the same pivot branches and pivot scripts | Same-function conflicts in both YAMLs and both pivot scripts | Land this slice first; regenerate both compiled contracts after each merge |
| Risk | Default-path risk is LOW: the pivot runs only in `divergent` convergence mode, which is opt-in (`.skilled/commands/deep/research.md:103`). | Low | REQ-006 suites |
| Risk | Each retry costs three more seat outputs, so a run's worst-case seat cost rises from 9 to 18. | Low | The retry fires only on a quorum failure and at most once per pivot (ADR-001) |
| Risk | Removing the field outright would break reads of persisted pivot limits, which list it as required (:1025). | Med | Keep the field accepted on read; only the check is dropped (REQ-004) |
| Risk | `prepare` reruns the preflight cap check on a resume (`divergent-pivot.ts:1244`, :1284), so a per-attempt count would refuse a resumed attempt that already holds seat returns | High if missed | Run the seat-cap check only when an attempt is opened; a REQ-005 case resumes an attempt with 2 seat returns |
| Risk | Attempt 2 reuses the fixed ids and paths: `${pivotId}:pivot_seat_returned:${seatId}`, `seats/seat-00N.md`, `${pivotId}:pivot_failed`, and `eventByName` returns the first match, so attempt 2 would read attempt 1's events | High if missed | Carry the attempt number in every id and path; keep attempt-1 ids unchanged so older pivots load (REQ-007) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Answered 2026-11-17: `maxCouncilSeatOutputs` is 3 per council attempt, and the one retry per pivot gets its own 3, so one pivot uses at most 6. See `decision-record.md` ADR-001.
- Narrowing note: parent §20 Slice L says one retry for `council_*` refusals. This phase retries only the three quorum failures, because `council_agreement_failed` is a substantive verdict a re-run would only repeat at three more seats. The operator can widen it in ADR-001.
<!-- /ANCHOR:questions -->

---
