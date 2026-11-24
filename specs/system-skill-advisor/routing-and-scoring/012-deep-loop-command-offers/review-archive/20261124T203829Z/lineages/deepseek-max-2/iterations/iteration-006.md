# Review Iteration 006 - traceability (checklist_evidence, AC-030 to AC-042)

## Dispatcher

- Mode: review, lineage `deepseek-max-2`, iteration 6 of 7, dimension traceability.
- Route: `Resolved route: mode=review target_agent=deep-review`.
- This iteration read the slice the operator focus names explicitly: `acceptance-criteria.md` AC-030 to AC-042, the sixth-round closure rows, each against its fixture rows, test titles and recomputed counts, and ADR-005 and ADR-006 as the decisions those rows cite.
- Budget: 24 tool calls, used inside it.

## Files Reviewed

- `acceptance-criteria.md` AC-030 to AC-042; `spec.md` REQ-023 to REQ-034, SC-006.
- `decision-record.md:412-600` (ADR-005, ADR-006).
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:121-152,181-191,246-330,388-424,474,571,676-690,743`.
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` (359 cases; recomputed `refusal-verb-*`, `run-refused-stuck-*`, `typed-*`, `no-edit-*`, `effort-*` rows and the `doctorWithheld` split).
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:919,1125`; `tests/scorer/doctor-handoff-command.vitest.ts`; `tests/scorer/stage-one-loop-subject.vitest.ts:26`; `tests/typed-on-stuck-serving.vitest.ts:112`; `tests/handlers/advisor-recommend-typed-command.vitest.ts`; `tests/cli-degraded-command-contract.vitest.ts:152`; `tests/command-brief-golden.vitest.ts:353`; `tests/python/test_skill_advisor.py:3054`.
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/ac034-served-head.jsonl`.
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:227,1011`; `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:462,715,942,1317,1381,1693`; `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:363-432`.
- `.skilled/changelog/skilled/v4.2.0.0.md:750-770`; `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/implementation-summary.md:123`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **AC-038's pair count and per-entry split no longer match the drift guard** -- `acceptance-criteria.md:95` -- The `Met` row's verification says "`VOCABULARY_PAIRS` compares 22 vocabulary pairs ... the last of them `RUN_ASK_REFUSAL_LEADS`", and "Twelve of the 22 lists carry a per-entry case ... The other ten are compared but carry no per-entry case". The tree holds 25 entries (`tests/deep-loop-offer-cases.vitest.ts:121-147`), the last of them `RUN_ASK_REFUSAL_VERBS`, and 13 of them carry a per-entry case, including `RUN_ASK_REFUSAL_VERBS` (`:474`). The eleventh round added `RUN_ASK_REFUSAL_CANCEL_LEADS` and `RUN_ASK_REFUSAL_VERBS` and did not revisit this cell, and `spec.md` REQ-031 deliberately names no count, so the requirement is not the thing that drifted.
   Finding class: docs-drift (instance-only, acceptance evidence)
   Scope proof: `acceptance-criteria.md` and `deep-loop-offer-cases.vitest.ts` are both lines of `review-scope-files.txt`, and both figures were recomputed from the test file in this iteration; no gate behaviour is in question.
   Affected surface hints: `acceptance-criteria.md` AC-038 verification cell; `tasks.md` T076 and T092 state the same stale count and are filed separately.
   Case: a reader adds a seventh compared list, follows this cell's "22 pairs / twelve with per-entry cases" instruction, updates neither figure, and the row keeps reading `Met` while describing a guard that is three pairs larger and one per-entry case further along than the row says.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `checklist_evidence` | pass | AC-001 to AC-042 checked (42 of 60), with AC-030 to AC-042 recomputed rather than read. |

Row by row, what this iteration bound:

- **AC-030:** twelve `refusal-verb-*` rows, seven `false` and five `true` — recomputed and exact.
- **AC-031:** 47 rows carry `doctorWithheld`, 27 `true` and 20 `false` — recomputed and exact; the fused-row and withhold-step describes exist in `tests/scorer/doctor-handoff-command.vitest.ts`.
- **AC-032:** four `typedRunsKept` rows, two keeping `/deep:review` against a non-loop command and two keeping both loops in both orders.
- **AC-033:** the deferred-route case and its control exist at `tests/command-attach-guards.vitest.ts:1125`, and `loopAskCues` skips a subject-only name (`command-attach.ts:1703-1724`).
- **AC-034:** `tests/scorer/stage-one-loop-subject.vitest.ts:26` pins the complaint and its control; `scratch/probes/ac034-served-head.jsonl` records `sk-code` 0.8753 and `sk-doc` 0.82 for the complaint and `system-deep-loop` 0.8763 with `/deep:review` for the control, exactly as the cell says.
- **AC-035:** the golden file's two tests exist (`tests/command-brief-golden.vitest.ts:353` and its partner), and `parseRecommendations` carries command, policy, owner and typed (`lib/subprocess.ts:45-51,216-220`).
- **AC-036 (ADR-005):** `tests/typed-on-stuck-serving.vitest.ts:112` serves the typed `/deep:review` over the diagnosis, its partner keeps the diagnosis on an untyped complaint, and the handler test covers the replacement; the fixture row `typed-stuck` carries `servedReviewKept`.
- **AC-037:** `LEAD_WINDOW` 400 on both sides, `ADVISOR_PROMPT_MAX_CHARS` 10_000 on both sides, `DEEP-LOOP-LONG` at `tests/python/test_skill_advisor.py:3054`, and the 359 cases keep their results.
- **AC-038:** one drift — the pair count and the per-entry split (finding 1). The row's substance (the guard fails on a one-sided list edit) holds.
- **AC-039:** `refinesSameLocation` (`reduce-state.cjs:1011`) is the reducer's rule, and the unit test named in the change set pins it.
- **AC-040:** `Unmet`, and honestly so: the row says "Not observed" and names the archived reports that failed. This lineage is the rerun the row waits on; its own gates are reported at synthesis, and recording the closure is the packet owner's step, not this review's.
- **AC-041:** the fixture `$comment` names each typed column's layer, limitations 6 to 8 and the reversed fifth-round sentence state the built behaviour, the changelog names the typed-on-stuck head and the refusal verbs, and packet 013's degraded-path row exists.
- **AC-042:** the sixth-round, eighth-round and final-tree suite figures are internally consistent with AC-028, AC-055 and AC-057.

## Integration Evidence

- ADR-005's two layers are separately pinned: `typedReviewKept` at the `attachCommand` layer and `servedReviewKept` at the served head, read by both suites.
- ADR-006's decision is implemented as `LOOP_NAMES` behind verb-led alternations, and the fixture row `bare-loop-name` pins it.
- The recorded stage-one probe (`scratch/probes/ac034-served-head.jsonl`) is a real artefact with the two heads and their confidences, not a remembered number.

## Edge Cases

- The AC-038 row's substance is verifiable and true: a one-sided list edit does fail the guard. Only its counts and its "last of them" claim drifted. Reporting it as P2 rather than P1 keeps the severity on the record, not on the guard.
- AC-040 cannot be closed by this review: the row asks that a rerun's terminal gates read evidence, scope and coverage pass, and the packet owner records the closure. This lineage's synthesis states its own gate results so that step has evidence to read.
- AC-037's wall-clock ceiling (a 96,000-character prompt under one second) is a timed claim; the constants behind it are pinned, the timing is not re-run here.

## Confirmed-Clean Surfaces

- Every fixture count in AC-030, AC-031, AC-032 and AC-046 recomputes to the stated figure.
- AC-034's probe artefact matches its cell digit for digit.
- AC-036's two serving tests and the handler test exist and are named correctly by the row.

## Ruled Out

- **A fixture count in the sixth-round rows that has moved.** Ruled out: the refusal, doctor, typed, no-edit and effort counts all recompute to the stated figures.
- **ADR-005 or ADR-006 stating a decision the code does not implement.** Ruled out by reading both the ADRs and the branches they name.
- **A served-head test that pins the gate layer only.** Ruled out: `tests/typed-on-stuck-serving.vitest.ts:112` goes through the real `advisor_recommend` head, and the fixture column is read on both sides.

## Next Focus

- Dimension: traceability (core protocols closed; overlay protocols next).
- Focus area: the four overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`), then the consolidation of the four findings and the terminal gate statement.
- Reason: `spec_code` and `checklist_evidence` are both recorded; the overlay protocols and the gate statement are what remains before synthesis.
- Rotation status: traceability closes in iteration 7 with the overlay pass.
- Blocked / productive carry-forward: productive. Recomputing counts found every finding this lineage has.
- Required evidence: the command-document and presentation contracts against the command entry points, the runtime mirror check for the two command files, and a count of the findings raised.

Review verdict: PASS
