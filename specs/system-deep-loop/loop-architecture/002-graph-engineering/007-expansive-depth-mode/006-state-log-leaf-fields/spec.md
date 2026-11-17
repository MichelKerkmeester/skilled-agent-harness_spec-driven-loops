---
title: "Feature Specification: Restore the research leaf fields the state-log projection drops (D7, D9)"
description: "The research state-log projection keeps ten core keys and drops the leaf's route-proof, telemetry, findingsCount and keyQuestions fields, so the findings_not_enumerated gate and the focusAlignment guard never run on research. This phase restores what those checks need by widening the ledger upcast, the option the operator chose."
trigger_phrases:
  - "state log leaf fields"
  - "research upcast keyQuestions findingsCount"
  - "slice f d7 d9"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Restore the research leaf fields the state-log projection drops (D7, D9)

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned. Operator decision recorded in `decision-record.md` (option 1, 2026-11-17) |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | None. This slice ships in any order with the other defect slices. |
| **Successor** | `../010-research-frontier-mode/spec.md` (the research frontier needs this slice first) |
| **Source** | Parent `research/research.md` §4 item 7, §12 item 6, §13 rows D7 and D9, §15, §20 Slice F |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The research gateway upcast at `legacy-compatibility.ts:643-660` builds `iteration_completed` data from `status`, `newInfoRatio`, `ruledOut`, `focus` and `answeredQuestions` only, so every other leaf field is dropped before the state log is projected. Two checks starve as a result: the research `findings_not_enumerated` gate in `verify-iteration.cjs:533-535` reads `findingsCount` from the projected row, gets `NaN` and never runs, and the `focusAlignment` guard in `convergence.cjs:871-885` needs both `answeredQuestions` and `keyQuestions` on a record, so it always reports `notEvaluated`.

### Purpose
With the ledger upcast widened to carry the leaf fields, the research findings gate and the `focusAlignment` guard both run on real data, and every changed default behavior is stated in the changelog.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run from the parent packet's `research/` folder against generation 2, iteration 1.
```text
$ jq -c 'select(.type=="iteration") | keys' deltas/iter-001.jsonl
["agent_definition_loaded","answeredQuestions","edgeCase","findingsCount","focus","focusTrack","iteration","keyQuestions","lineageId","mode","newInfoRatio","noveltyJustification","resolved_route","ruledOut","run","runId","sessionId","sourcesQueried","status","target_agent","toolsUsed","type"]
$ jq -c 'select(.type=="iteration" and .iteration==1) | keys' deep-research-state.jsonl
["answeredQuestions","focus","iteration","mode","newInfoRatio","ruledOut","run","status","timestamp","type"]
$ jq -c 'select(.type=="iteration") | {findingsCount, keyQuestions}' deltas/iter-001.jsonl
{"findingsCount":8,"keyQuestions":["Q1: Adversarially verify the generation-1 design (§8, §10 of the archived research.md) and defects D1-D9 against the current code. Which claims hold, which are wrong or overstated, and what are the corrected statements with file:line evidence?"]}
```
The delta row carries 22 keys, including `findingsCount` and `keyQuestions`. The projected state-log row carries 10, and neither of those two is among them.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record the operator's choice between option 1 (widen the upcast, schema, type and projection) and option 2 (keep the ledger narrow, read leaf fields from the delta) in `decision-record.md`.
- Make the research `findings_not_enumerated` gate read a real `findingsCount`.
- Make the `focusAlignment` guard receive records that carry both `answeredQuestions` and `keyQuestions`.
- Carry the route-proof and telemetry fields through the projection as well.
- State in the changelog that both checks now run on every research run.

### Out of Scope
- Frontier fields on state-log rows. They travel through delta and inbox rows, per the parent's Eliminated Alternatives.
- The review loop. Its state path does not use this upcast.
- Editing the parent `research/research.md` Eliminated Alternatives row. That belongs to the parent owner; this phase records the needed wording in its decision record.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` | Modify | Copy `findingsCount`, `keyQuestions` and the route-proof and telemetry fields into `iteration_completed` data at :643-660 |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts` | Modify | Add the new optional fields to the `deep_research.iteration_completed` rule at :657-660 |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts` | Modify | Extend the `IterationCompletedData` union at :185-200 |
| `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts` | Modify | Write the new keys into the projected `iteration` row at :312-325 |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts` | Modify | Add the findings-gate-runs case |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The operator's option choice is recorded before any code changes. | `decision-record.md` ADR-001 shows `Accepted`, names option 1, and its Operator Decisions table holds one row. |
| REQ-002 | The research `findings_not_enumerated` gate runs on fields that arrive through the real channel. | A new `verify-iteration.vitest.ts` case: the leaf record claims `findingsCount: 3` and nothing enumerates the findings. The state row is produced by the gateway upcast and projection, not hand-written. The case returns `ok: false` with reason `findings_not_enumerated`, and it fails on the unchanged tree. |
| REQ-003 | The `focusAlignment` guard is evaluated on research data from the real channel. | A new convergence case: an iteration answers a question absent from its `keyQuestions`, with `keyQuestions` reaching the guard only through the projected state-log row. It yields `guards.focusAlignment` status `failed`, not `notEvaluated`, and it fails on the unchanged tree. |
| REQ-004 | Default research runs that already satisfy both checks keep their verdicts. | A research fixture whose delta enumerates its findings and whose answered questions are a subset of its key questions passes `verify-iteration` and reports `focusAlignment` `passed`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | A projected research `iteration` row carries `findingsCount` and `keyQuestions`, and a legacy row without them still upcasts. | `deep-research-projections-contract.vitest.ts` asserts both keys on a new row; `append-mode-event-legacy-seam.vitest.ts` passes unchanged on legacy fixtures. |
| REQ-007 | Existing suites stay green. | `append-mode-event-cli`, `append-mode-event-legacy-seam`, `check-projection-coverage`, `deep-research-projections-contract`, `verify-iteration` and `convergence-script` all pass. |
| REQ-008 | The default-behavior change is announced. | The system-deep-loop changelog entry for this change states that the research findings gate and the `focusAlignment` guard now run on every research run. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npm test -- tests/unit/verify-iteration.vitest.ts` from `.skilled/skills/system-deep-loop/runtime` passes, including the new findings-gate-runs case.
- **SC-002**: The convergence suite passes with a case where `focusAlignment` reports `failed` on research data.
- **SC-003**: Every suite named in REQ-007 passes after the change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Operator decision on parent §12 item 6 | No code task can start until ADR-001 is Accepted | T001 is the only open task until then; both branches are planned so work starts the same day |
| Risk | Default-path change: widening the upcast switches the findings gate and the `focusAlignment` guard on for every research run. A leaf that over-claims findings now fails verification and triggers `redispatch_once`; a leaf that answers outside its key questions now blocks a stop. | Med | Changelog entry (REQ-008), the REQ-004 regression fixture, and a dry replay of this packet's own generation-2 deltas through both checks before merge |
| Risk | Option 1 is a ledger schema change. `IterationCompletedData` is a permutation union with no optional properties, so four new fields multiply its variants. | Med | Keep the new fields in one optional sub-object, or regenerate the union by script; `check-projection-coverage` guards the projection |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Answered 2026-11-17: the operator chose option 1, widen the upcast. See `decision-record.md` ADR-001.
- Under option 1, are the route-proof and telemetry fields worth carrying, given `verify-iteration.cjs:502` already treats the delta as their source? The ADR records this as part of the option 1 scope.
<!-- /ANCHOR:questions -->

---
