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
| **Predecessor** | None by contract. Build after `../001-completed-run-extension/`, which edits the same four ledger files. The `../013-no-redispatch-landed-iteration/` open question was decided on 2026-11-17 (see Risks). |
| **Successor** | `../010-research-frontier-mode/spec.md` (the research frontier needs this slice first) |
| **Source** | Parent `research/research.md` §4 item 7, §12 item 6, §13 rows D7 and D9, §15, §20 Slice F |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The research gateway upcast at `legacy-compatibility.ts:643-660` builds `iteration_completed` data from `status`, `newInfoRatio`, `ruledOut`, `focus` and `answeredQuestions` only, so every other leaf field is dropped before the state log is projected. Two checks starve as a result: the research `findings_not_enumerated` gate in `verify-iteration.cjs:533-535` reads `findingsCount` from the projected row, gets `NaN` and never runs, and the `focusAlignment` guard in `convergence.cjs:871-885` needs both `answeredQuestions` and `keyQuestions` on a record, so it always reports `notEvaluated`.

### Purpose
With the ledger upcast widened to carry the leaf fields, the research findings gate and the `focusAlignment` guard both run on real data, a run can recover from one off-focus iteration, and every changed default behavior is stated in the changelog.
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
- The operator's choice is recorded in `decision-record.md`: option 1, widen the upcast, schema, type and projection (ADR-001, OD-001 and Q001, 2026-11-17).
- Make the research `findings_not_enumerated` gate read a real `findingsCount`.
- Make the `focusAlignment` guard receive records that carry both `answeredQuestions` and `keyQuestions`, scoped so a run can recover, and compared so a leaf's question-id prefix does not fail it.
- Carry the exact field list in REQ-005 through the projection, including the route-proof fields, and update the `verify-iteration.cjs` text that says the projection carries none.
- Add `findingsCount` and `keyQuestions` to the prompt pack's iteration record shape, so the pack and the agent definition ask for the same record, and regenerate the research compiled contract.
- Prove each newly fed consumer with a case, and state every changed default behavior in the changelog.
- Write the manual testing playbook scenario for this phase's user-visible behavior through `/create:manual-testing-playbook`. Phase `../014-docs-playbooks-alignment/` only verifies and aligns it.

### Out of Scope
- Frontier fields on state-log rows. They travel through delta and inbox rows, per the parent's Eliminated Alternatives.
- The review loop. Its state path does not use this upcast.
- The stable-identity fields `runId`, `sessionId` and `lineageId`. The gateway reads them to place the record and refuses a record without them (`stable-identity-missing`); the projected row does not gain them.
- Which `verify-iteration` reasons may trigger `redispatch_once`. `../013-no-redispatch-landed-iteration/` decides it (ADR-001, 2026-11-17); this phase records the interaction (see Risks).
- Editing the parent `research/research.md` Eliminated Alternatives row. That belongs to the parent owner; this phase records the needed wording in its decision record.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` | Modify | Copy the REQ-005 fields into `iteration_completed` data at :643-660 |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts` | Modify | Add the new optional fields to the `deep_research.iteration_completed` rule at :657-660 |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts` | Modify | Extend the `IterationCompletedData` union at :185-200, keeping the new fields in one optional sub-object or a script-generated union |
| `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts` | Modify | Write the REQ-005 keys into the projected `iteration` row at :312-325 |
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Modify | `focusAlignment` (:871-885) evaluates only the latest record that carries both lists, and compares normalized text with a leading question-id prefix such as `Q1: ` removed |
| `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` | Modify | Comment only at :498-501 and the warning text at :567, which both say the projection carries no leaf dispatch fields. The route-proof logic and the delta fallback stay |
| `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` | Modify | Iteration record shape at :66 gains `findingsCount` and `keyQuestions`, with `keyQuestions` described as the exact strategy question text, no id prefix (file shared with 005 and 010) |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` | Regenerate | `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/research --write`, for the template digest |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts` | Modify | Findings-gate-runs, REQ-004 regression and route-proof survival cases |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/convergence-script.vitest.ts` | Modify | `focusAlignment` failed, recovery and prefixed-shape cases |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts` | Modify | Cases for the reducer consumers that start receiving the fields |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/append-mode-event-legacy-seam.vitest.ts`, `deep-research-ledger-schema.vitest.ts`, `deep-research-projections-contract.vitest.ts` | Modify | Upcast survival, stem-rule and projected-row cases |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts` | Modify | The rendered record shape names `findingsCount` and `keyQuestions` |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/` (category `iteration-execution-and-state-discipline/`) | Modify | One scenario, written by `/create:manual-testing-playbook system-deep-loop update --path .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook` |

No agent definition changes: `.skilled/agents/deep-research.md:246` already names both fields, so no runtime mirror sync is needed.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The operator's option choice is recorded before any code changes. | `decision-record.md` ADR-001 shows `Accepted` and names option 1, and its Operator Decisions table records that one choice in two rows: OD-001 and the captured question Q001. |
| REQ-002 | The research `findings_not_enumerated` gate runs on fields that arrive through the real channel. | A new `verify-iteration.vitest.ts` case: the leaf record claims `findingsCount: 3` and nothing enumerates the findings. The state row is produced by the gateway upcast and projection, not hand-written. The case returns `ok: false` with reason `findings_not_enumerated`, and it fails on the unchanged tree. |
| REQ-003 | The `focusAlignment` guard is evaluated on research data from the real channel. | A new convergence case: the latest iteration answers a question absent from its `keyQuestions`, with `keyQuestions` reaching the guard only through the projected state-log row. It yields `guards.focusAlignment` status `failed`, not `notEvaluated`, and it fails on the unchanged tree. |
| REQ-004 | Default research runs that already satisfy both checks keep their verdicts, including the shape generation 2 wrote. | A research fixture whose delta enumerates its findings and whose answered questions are among its key questions passes `verify-iteration` and reports `focusAlignment` `passed`. A second fixture writes `keyQuestions` with a `Q1: ` prefix, as generation 2 did, and `answeredQuestions` as the bare strategy text; it also reports `passed`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | A projected research `iteration` row carries this exact field list, and a legacy row without them still upcasts. The list is the set difference of the two Measured Behavior key lists, less the identity fields: route proof `target_agent`, `agent_definition_loaded`, `resolved_route` (`mode` is already projected as the constant `research`); gate and guard inputs `findingsCount`, `keyQuestions`; telemetry `noveltyJustification`, `focusTrack`, `edgeCase`, `toolsUsed`, `sourcesQueried`. | `deep-research-projections-contract.vitest.ts` asserts all ten keys on a new row; `append-mode-event-legacy-seam.vitest.ts` passes unchanged on legacy fixtures. |
| REQ-006 | Existing suites stay green. | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/append-mode-event-cli.vitest.ts tests/unit/append-mode-event-legacy-seam.vitest.ts tests/unit/check-projection-coverage.vitest.ts tests/unit/deep-research-projections-contract.vitest.ts tests/unit/deep-research-ledger-schema.vitest.ts tests/unit/verify-iteration.vitest.ts tests/unit/deep-research-reduce-state.vitest.ts tests/unit/prompt-pack.vitest.ts tests/unit/check-contract-drift.vitest.ts tests/integration/convergence-script.vitest.ts` exits 0. |
| REQ-007 | The default-behavior change is announced. | The system-deep-loop changelog entry for this change states that the research findings gate and the `focusAlignment` guard now run on every research run, and names the reducer consumers in REQ-010. |
| REQ-008 | Route proof survives the projection. | A `verify-iteration.vitest.ts` case on a gateway-projected state row passes route proof from the state record itself: the result carries no "route proof came from deltas" warning, and `verify-iteration.cjs` no longer says the projection carries no leaf dispatch fields. |
| REQ-009 | A run recovers from one off-focus iteration. | A convergence case where iteration 1 answers outside its key questions and iteration 2 is aligned reports `focusAlignment` `passed` after iteration 2, so `qualityGuardFailed` (`convergence.cjs:1167-1169`) does not hold the run at CONTINUE for the rest of the run. |
| REQ-010 | Each reducer consumer that starts receiving a field has a case. | `deep-research-reduce-state` cases cover: a record with one `keyQuestions` entry resolving that question (`deep-research/scripts/reduce-state.cjs:2492-2496`); `sourcesQueried` reaching the source list (:1737-1742, :1986); and the dashboard `focusTrack` and `findingsCount` columns (:2948-2950) showing the row's values. |
| REQ-011 | The prompt pack asks for the same record as the agent definition. | `rg -n '"findingsCount"' .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` and `rg -n '"keyQuestions"'` on the same file each print the record-shape line, and `check-contract-drift` passes after the research contract is regenerated. |
| REQ-012 | The newly live checks have a playbook scenario. | `/create:manual-testing-playbook system-deep-loop update --path .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook` has written one scenario, and `rg -l "focusAlignment" .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook` lists it. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/verify-iteration.vitest.ts` passes, including the findings-gate-runs and route-proof survival cases.
- **SC-002**: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/convergence-script.vitest.ts` passes with a case where `focusAlignment` reports `failed` on research data and a case where the run recovers.
- **SC-003**: Every suite named in REQ-006 passes after the change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Operator decision on parent §12 item 6 | Resolved: ADR-001 Accepted on 2026-11-17, option 1 | None needed |
| Risk | Default-path change: widening the upcast switches the findings gate (`verify-iteration.cjs:533-550`) and the `focusAlignment` guard (`convergence.cjs:871-885`) on for every research run. A leaf that over-claims findings now fails verification; a leaf that answers outside its key questions now holds the run at CONTINUE (`convergence.cjs:1167-1169`). | Med | Changelog entry (REQ-007), the REQ-004 regression fixtures, and a dry replay of this packet's own generation-2 deltas through both checks before merge |
| Risk | `focusAlignment` is computed over all records today, so one violating record holds every later stop at CONTINUE with no way to recover. | Med | Scope the guard to the latest record that carries both lists (REQ-009) |
| Risk | Generation 2 wrote `keyQuestions` with a `Q1: ` prefix, and the guard compares raw strings with `.includes`, so a correct iteration fails. | Med | Fix the producer: the pack record shape asks for the exact strategy text (REQ-011). Normalize in the guard: compare normalized text with a leading question-id prefix removed (REQ-004 second fixture) |
| Risk | Reducer consumers start receiving fields they never saw on research: a record with a single `keyQuestions` entry resolves that question (`deep-research/scripts/reduce-state.cjs:2492-2496`), which changes when `all_questions_answered` fires; `sourcesQueried` feeds the source list (:1737-1742, :1986); the dashboard `focusTrack` and `findingsCount` columns (:2948-2950) stop showing `-` and `0`. A prefixed `keyQuestions` entry does not resolve, which matches today's behavior. | Med | One case each (REQ-010); the changelog names them (REQ-007) |
| Risk | Interaction with `../013-no-redispatch-landed-iteration/`: `findings_not_enumerated` is returned after the delta check (`verify-iteration.cjs:533-550`), so the iteration has landed, and `redispatch_once` (`.skilled/commands/deep/assets/deep-research.yaml:1539`) fires on it. Without 013, once this phase makes the gate live, the wasted dispatch comes back for a new reason. The YAML reason list at :1514 does not name `findings_not_enumerated` today. | Med | Resolved 2026-11-17: 013 ADR-001 skips the redispatch for `findings_not_enumerated`, `executor_missing` and `ledger_backing_missing`, so the phases can build in either order |
| Risk | Option 1 is a ledger schema change. `IterationCompletedData` is a permutation union with no optional properties, so new fields multiply its variants. | Med | Keep the new fields in one optional sub-object, or regenerate the union by script; `check-projection-coverage` guards the projection |
| Risk | The template and the research compiled contract are shared with `../005-prompt-pack-contract-alignment/` and `../010-research-frontier-mode/`, the four ledger files with `../001-completed-run-extension/`, and `convergence.cjs` with `../003-review-min-iterations-floor/`, `../010-research-frontier-mode/` and `../011-review-frontier-mode/` (same file, different function: this phase edits `focusAlignment` at :871-885, they edit the stop-decision floor region at :1159-1169). | Merge conflicts | Build after 001 on the ledger files. Regenerate the contract after each merge; never hand-resolve its digest lines |
| Dependency | `../010-research-frontier-mode/` waits on this phase | Frontier stop would read starved checks | Land this phase before 010 starts |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Answered 2026-11-17: the operator chose option 1, widen the upcast. See `decision-record.md` ADR-001.
- Answered in planning: the route-proof and telemetry fields are carried (REQ-005), because option 1's point is one source of truth for the iteration record. `verify-iteration.cjs` keeps its delta fallback for legacy rows.
- Open, owned by `../013-no-redispatch-landed-iteration/`: which landed-iteration reasons, `findings_not_enumerated` among them, may trigger `redispatch_once`.
<!-- /ANCHOR:questions -->

---
