# Review Iteration 002 — deepseek-max-1

**Dimension:** traceability (D3)
**Protocol:** `checklist_evidence`
**Focus:** every ticked task in `tasks.md` and every `Met` row in `acceptance-criteria.md` against evidence that exists in the tree, with the operator focus carried in full: the sixth, seventh and eighth fix rounds (REQ-023 to REQ-039, AC-030 to AC-047, ADR-005, ADR-006) are checked row by row.

## Dispatcher

- Run: `fanout-deepseek-max-1-1795518961022-7ms9ak`, generation 1, lineage mode `new`, label `deepseek-max-1`.
- Execution: this process; no nested dispatch ran.
- Config: `maxIterations=7`, `stopPolicy=max-iterations`, four canonical dimensions.
- Steering channel: `steer.md` is absent at iteration 2.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:44-133`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:36-316`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:150-180,225-262`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33,128,223,317,412,508,603,720-741`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1-6,120-170,250-290`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:530-542,855-870,996-1000`
- `.skilled/skills/system-skill-advisor/runtime/tests/cli-degraded-command-contract.vitest.ts:150-154`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-brief-golden.vitest.ts:351-355`
- `.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:105-110,146-150`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:450-458`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:641`
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:995`
- `.skilled/commands/deep/assets/deep-research-presentation.txt:28-32,223-248`, `deep-review-presentation.txt:237-278`
- `.skilled/changelog/skilled/v4.2.0.0.md:480-486,755-761`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **AC-015's evidence line proves the question-tool convention, not the three placements it claims** -- `acceptance-criteria.md:72` -- The row says step 6 names the question tool and Q2/Q-Exec carry `(Recommended)`, then cites `deep-research-presentation.txt:30` as the evidence. Line 30 is the offer section's "Ask once, through the question tool that … §5 names for your runtime" sentence. Step 6 is at `:223`, Q2 at `:236` and Q-Exec at `:246`, and the review presentation file holds the same three at `:237`, `:267` and `:277`.
   Case: a reader checking AC-015 opens the cited line and finds the offer section, not the setup form the row describes, so the row's `Met` cannot be confirmed from the evidence cell alone even though the underlying text exists two hundred lines later.
   Finding class: `evidence-pointer` (record precision, no behaviour change).
   Scope proof: `acceptance-criteria.md` and both presentation files are `reviewScopeFiles` entries; the three placements were read at the lines named above.
   Affected surface hints: `acceptance-criteria.md:72` (AC-015 verification cell), `deep-research-presentation.txt:30,223,236,246`, `deep-review-presentation.txt:237,267,277`.

2. **AC-041 and T082 cite a blank line and a neighbouring line for two closure claims** -- `acceptance-criteria.md:98` -- AC-041 says the sixth-round paragraph is at `implementation-summary.md:232` and that `:230` says the stuck drop was reversed; T082 repeats both. `:232` is blank, the sixth-round paragraph starts at `:233`, and the reversed-sentence is at `:231`. The three limitation citations in the same row (`:258`, `:259`, `:260`) do resolve.
   Case: an operator following AC-041's citation for the sixth-round record lands on an empty line, and the row's own "each state the built behaviour" claim is then checked against the wrong paragraph.
   Finding class: `evidence-pointer` (record precision, no behaviour change).
   Scope proof: `acceptance-criteria.md` and `tasks.md` are review-scope entries; `implementation-summary.md` is in scope and the four lines were read directly.
   Affected surface hints: `acceptance-criteria.md:98` (AC-041), `tasks.md:164` (T082), `implementation-summary.md:231,232,233`.

3. **AC-019's Then clause and its own observation disagree on the near-miss count** -- `acceptance-criteria.md:76` -- The Then clause states the search "prints 15, up from 9", while the Observed sentence in the same row states 31 near-miss rows, which is what the corpus holds today (`rg -c '"row_type":"near-miss"'` = 31). The row is `Superseded` with ADR-001, so it blocks nothing, but a superseded row that contradicts itself is still the closure record a reader checks first.
   Case: an operator verifying ADR-001's supersession reads the row and cannot tell whether the counted outcome is 15 or 31, so the decision record it points to is the only thing that settles it.
   Finding class: `record-inconsistency` (documentation only; no closure impact because the row is superseded).
   Scope proof: `acceptance-criteria.md:76` is in scope; the count was produced by `rg -c` over `command-prompts.jsonl`, also in scope.
   Affected surface hints: `acceptance-criteria.md:76`, `decision-record.md:33` (ADR-001), `command-prompts.jsonl` near-miss rows.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `checklist_evidence` | pass | Every `Met`, `Waived` and `Superseded` row was read; every `path:line` citation in `acceptance-criteria.md` and `tasks.md` resolved to an existing file and an in-range line (0 unresolved, 0 out-of-range across both files); the three P2 findings are pointer precision, not missing evidence. The one `Unmet` row (AC-040) is matched by the open T084, the open "All tasks marked [x]" box, the open CHK-020 and the closure statement `Closeable: No`. |
| `spec_code` | carried from iteration 1 | The two P1 findings stand; this iteration did not re-run that protocol. |

What this iteration actually ran, rather than read:

1. **Citation resolution over both closure documents.** Every backticked `path:line` in `acceptance-criteria.md` and `tasks.md` was parsed and resolved against the repo root, the packet folder, the advisor runtime and its `lib`/`scripts`/`tests` subdirectories, and the deep-loop runtime. 0 unresolved and 0 out-of-range. The pass includes the sixth/seventh/eighth-round rows (AC-030 to AC-047) and their tasks (T068 to T092).
2. **Checkbox arithmetic against the Verification Summary.** 123 checkbox lines: 120 checked, 3 open. By priority: P0 11 checked of 12, P1 13 of 13, P2 1 of 1, plus 95 unlabelled checked and 2 unlabelled open. The summary's `12 / 11`, `13 / 13` and `1 / 1` match those boxes, so AC-041's "what the boxes behind it hold" is true.
3. **The open work is coherent.** T084 (rerun), the "All tasks marked [x]" file-organization check, and CHK-020 [P0] are open for the same reason — AC-040 is `Unmet` because this rerun is the follow-up, not part of the build. No ticked task and no `Met` row depends on a run this review did.
4. **Spot-checked anchors that carry a specific claim.** `typed-stuck` at fixture `:123` carries `servedReviewKept: true`; `refusal-verb-skip` at `:129` reads `false`; the depth-word `it.each` list sits at guards `:532-541`; the long-prompt describe starts at `:998`; the degraded row keeps a tracked supplied command at `cli-degraded-command-contract.vitest.ts:152`; the golden test prints a typed deep command plainly at `:353`; `LEAD_WINDOW = 400` at `command-attach.ts:641`; `refinesSameLocation` at `reduce-state.cjs:995`; `passesAsked` at `explicit.ts:454`; the doctor withhold at `fusion.ts:1074`; all seven ADRs named by a `Waived`/`Superseded` cell exist.

## Integration Evidence

- Closure records: `acceptance-criteria.md` and `tasks.md`, read in full.
- Decision record: ADR-001 to ADR-007, each waiver's target verified to exist.
- Implementation record: `implementation-summary.md` rows and limitations, with the cited lines read.
- Changelog row that AC-029 quotes: `.skilled/changelog/skilled/v4.2.0.0.md:759` carries `184 files, 3,188 passed, 4 skipped, none failed`.

## Edge Cases

- **The suites were not run.** AC-009, AC-010, AC-028, AC-042 and T081/T087/T088/T092 claim suite results; this iteration verified that the cited files and lines exist and that the numbers agree across rows, not that the suites still pass on this tree. That limit is stated rather than converted into a pass.
- **`validate.sh --strict` claims (T085, T086, implementation-summary) were not re-run.** The command is outside this lineage's write surface; the claims are read as recorded results.
- **AC-019 is superseded.** Its internal disagreement is recorded at P2 and changes no closure state.

## Confirmed-Clean Surfaces

- AC-040 / T084 / CHK-020 / closure statement: the packet says `Unmet` and `Closeable: No` in four places, and the open boxes match.
- AC-030, AC-031, AC-036, AC-037, AC-038, AC-039, AC-044, AC-045, AC-046, AC-047: each cited fixture, guard, serving-test or reducer line holds the case the row names.
- AC-029: the changelog line quotes the same suite totals as AC-028 and AC-042's final-tree number.
- Verification Summary: counts agree with the boxes.

## Ruled Out

- **AC-031's "26 fixture rows carry `doctorWithheld`" is wrong.** Ruled out: the fixture has 26 key occurrences (16 true, 10 false); the 27th textual match is the `$comment` header.
- **Fixture size drift.** Ruled out: the fixture holds 285 cases and every row that cites `cases=285` matches.
- **A waiver names a missing ADR.** Ruled out: ADR-001, ADR-002 and ADR-003 all exist at `decision-record.md:33,128,223`.
- **The Verification Summary overcounts verified P0s.** Ruled out: 11 of 12 P0 boxes are checked, matching `11/12`.

## Next Focus

- **Dimension:** correctness
- **Focus area:** the served gate's behavior on the refusal, subject and stuck-run paths, especially where the Python and TypeScript copies could diverge (typed commands, refusal leads, bounded windows).
- **Reason:** traceability's two core protocols are now covered; the next dimension is where implementation-level defects show.
- **Rotation status:** traceability complete; correctness starts.
- **Required evidence:** code paths at `file:line`, plus served-head measurements for any behavior claim.

## Assessment

Dimensions addressed: traceability

The checklist half of traceability holds: every citation resolves, the summary matches its boxes, and the open work is coherent with the one `Unmet` row. The three P2s are precision defects in the closure record, the kind the seventh and eighth rounds set out to remove. No new P0/P1 this iteration; the two P1s from iteration 1 remain active.

Review verdict: CONDITIONAL
