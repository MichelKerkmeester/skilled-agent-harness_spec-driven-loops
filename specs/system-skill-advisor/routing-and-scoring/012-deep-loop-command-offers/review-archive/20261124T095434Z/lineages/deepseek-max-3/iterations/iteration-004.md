# Review Iteration 004 — traceability (`checklist_evidence`)

- Iteration: 4 of 5
- Dimension: traceability
- Operator review focus: finish `checklist_evidence` — every ticked task in `tasks.md` and every `Met` row in `acceptance-criteria.md` against evidence that really exists in the tree, including the sixth fix round.
- How this iteration addressed the focus: it counted the acceptance and checklist rows, resolved every waiver cell to an ADR, followed the `Evidence:` pointer of each `Met` row to the line it names, and checked the six-round task boxes against their observation lines.

## Dispatcher

Executed inline as `@deep-review` for lineage `deepseek-max-3`. No nested dispatch.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:56-128` (AC-001 to AC-042, status values, closure statement)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:36-298` (T001 to T085, CHK boxes, Verification Summary)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:138-171`, `:219-248`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md` (ADR-001 to ADR-006)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/fresh-review-hook.txt`, `corpus-before.json`, `results-final-958fa81-worktree.json`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:536`, `:808`, `:963`, `:998`
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/stage-one-loop-subject.vitest.ts:20`, `:26`
- `.skilled/skills/system-skill-advisor/runtime/tests/subprocess-typed-fields.vitest.ts:88`
- `.skilled/skills/system-skill-advisor/runtime/tests/cli-degraded-command-contract.vitest.ts:81`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-brief-golden.vitest.ts:353`, `:364`
- `.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:107`, `:148`
- `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-typed-command.vitest.ts:91`
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-handoff-command.vitest.ts:196`, `:239`
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2902`, `:2943`, `:3019`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:62`, `:170`, `:206`, `:214`, `:221`, `:227`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl:94`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5349`, `:5424`, `:6165`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. `R1-P1-001` remains active; the verdict stays CONDITIONAL.

### P2 Findings

4. **Thirteen `Met` rows cite an `implementation-summary.md` line that holds a different observation** — `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:58` — each acceptance row ends with an `Evidence:` pointer, and the packet's own status table says a `Met` row's verification "names evidence that was actually observed" `[SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:104]`. Thirteen rows point one to nine lines off the observation they name: AC-001 to AC-005, AC-013, AC-016 and AC-021 cite `implementation-summary.md:155` for the probe rows, which sit at `:153` `[SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:153]`; AC-012 (corpus) cites `:157` for the row at `:155`; AC-017 (alias replay) cites `:158` for the row at `:156`; AC-010 and AC-011 cite `:156` for the suite and mirror rows, which are at `:154`, `:157` and `:159`; AC-028 cites `:163` for the 2,696-passed row at `:159` `[SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:58]`. The observations themselves exist and were checked this iteration, so no row changes status; the pointer that proves it does not resolve.
   Finding class: evidence-pointer-drift
   Scope proof: the thirteen rows, their cited line and the observation line are all packet docs inside the reviewed scope; resolving any one of them shows the mismatch.
   Affected surface hints: `acceptance-criteria.md` verification cells; any closure audit that follows an `Evidence:` pointer; the next packet that copies this table as its model.
   Case: an operator auditing closure follows AC-004's `Evidence: implementation-summary.md:155` and lands on the corpus row, not the keep-group probe row it names, then has to search the file by hand.
   ```json
   {"type":"claim_adjudication","claim":"thirteen Met rows cite an implementation-summary.md line that does not hold the observation they name","evidenceRefs":["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:58","specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:99","specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:153","specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:159"],"counterevidenceSought":"checked whether the cited line could hold the observation under a different reading (row label, adjacent round) and whether the file was reflowed after the rows were written","alternativeExplanation":"the citations were correct when written and later rows were inserted above, which is drift rather than a false claim","finalSeverity":"P2","confidence":"high","downgradeTrigger":"none; it closes only when the pointers are repointed or replaced by a row label"}
   ```

## Traceability Checks

| Protocol | Level | Status | Evidence | Note |
|----------|-------|--------|----------|------|
| `checklist_evidence` | core | partial | `acceptance-criteria.md:105`; `tasks.md:291` to `:293`; `implementation-summary.md:153` to `:159` | 42 acceptance rows counted: 38 `Met`, 2 `Waived` (AC-008/ADR-003, AC-017/ADR-002), 1 `Superseded` (AC-019/ADR-001), 1 `Unmet` (AC-040). 85 task boxes: 84 ticked, T084 open. 26 checklist boxes: 25 ticked, CHK-020 open for AC-040. One P2 records thirteen broken evidence pointers. |
| `spec_code` | core | partial | `spec.md:223`; `hub-router.json:34` | Unchanged from iteration 3: REQ-011's third alias is absent with only a scratch-log decision. |

Acceptance rows resolved this iteration:

| Evidence family | Rows | Result |
|-----------------|------|--------|
| Probe groups | AC-001 to AC-005, AC-013, AC-016, AC-021 | `results-after.json` holds the stated top row and command for each named id; R7, N9 and H3b carry no command; V5 tops `sk-code` |
| Corpus | AC-012, AC-020 | `false_offer` 0 of 57; three `-04` deep holdouts at `command-prompts.jsonl:94` |
| Docs | AC-006, AC-007, AC-014, AC-015, AC-018, AC-029, AC-041 | the cited `rg` targets exist and the searches behave as stated |
| Tests | AC-009, AC-030 to AC-039 | each cited test file and line exists and the row it names is there; AC-035 and AC-036 line citations verified line by line |
| Recorded runs | AC-010, AC-011, AC-028, AC-042 | recorded observations with their numbers; not re-executed in this lineage |
| Waivers | AC-008 (ADR-003), AC-017 (ADR-002), AC-019 (ADR-001) | all three ADRs exist and state the waiver |
| Honest gap | AC-040 | recorded `Unmet`; this run is the rerun it names |

## Integration Evidence

- Shared fixture read by both suites: 203 cases and eleven vocabulary pairs `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:62]`.
- Python gate reader of the same fixture columns: `doctorWithheld` and `typedRunsKept` are asserted there `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2902]`.
- Serving-layer assertion for the typed-on-stuck head: `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:107]`.
- Prompt-hook evidence file: 34 lines, including the typed-stuck served head at `:28` `[SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/fresh-review-hook.txt:28]`.

## Edge Cases

- **Line-number drift in a mutable file.** The thirteen pointers were likely correct when written; the file gained rows above them. Recorded as drift with the fix being a label-based citation, not a re-derived line.
- **Recorded runs.** AC-010, AC-011, AC-028 and AC-042 rest on suite, mirror and corpus runs that this lineage cannot re-execute; each was checked for a recorded observation with a matching number, and the probe and corpus files were compared directly.
- **AC-037's Python cite.** `test_skill_advisor.py:3017` is blank; the long-prompt test starts at `:3019`. Treated as part of the same pointer-drift class and not counted separately.
- **`dist` rebuild.** Not verifiable because `dist/` is gitignored and absent from the checkout.

## Confirmed-Clean Surfaces

- The acceptance table is internally consistent: 42 unique ids, one status per row, and each `Waived`/`Superseded` cell names an ADR that exists `[SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33]`.
- The closure statement agrees with the table: `Closeable: No`, and AC-040 is the one unmet row `[SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:125]`.
- The Verification Summary matches the boxes it counts: 12 P0 with 11 verified (CHK-020 open), 13 P1, 1 P2 `[SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:291]`.
- Every sixth-round task box T066 to T083 names an observation that resolves to the tree line it cites, including the fixture counts and the guard file.
- Fourteen `Met` rows cite a test file and line that exist and hold the named case.

## Ruled Out

- **A missing or miscounted checklist box.** Ruled out: 26 boxes, 25 ticked, and the one open box is CHK-020 for AC-040.
- **An unbacked waiver.** Ruled out: ADR-001, ADR-002 and ADR-003 each exist and state their row.
- **A false `Met` on the sixth-round rows.** Ruled out: AC-030 to AC-039 and AC-041 rest on fixture columns, test files and code lines that exist; only the pointer precision fails.
- **An unrecorded open task.** Ruled out: T084 is the only open box and the Completion Criteria name it.

## Next Focus

- Dimension: maintainability
- Focus area: the sixth-round code shape — duplicated regex sources between the two gate copies, comment accuracy, the `refinesSameLocation` boundary, and whether the closure docs' known-limitation list is maintainable. Then final cross-reference status and the synthesis inputs.
- Reason: two dimensions and both core traceability protocols are complete; maintainability and the release-facing summary remain.
- Rotation status: correctness, security, traceability done; maintainability remains.
- Blocked/productive carry-forward: none blocked. Productive: counting rows and resolving pointers instead of trusting a table.
- Required evidence: `file:line` for each maintainability claim; a named diagnosis for the duplicated vocabulary; the final protocol table.

Review verdict: CONDITIONAL
