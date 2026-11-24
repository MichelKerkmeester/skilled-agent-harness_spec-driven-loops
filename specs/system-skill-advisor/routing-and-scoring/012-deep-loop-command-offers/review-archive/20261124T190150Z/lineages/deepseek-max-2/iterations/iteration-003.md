# Review Iteration 003

## Dispatcher

- Lineage `deepseek-max-2`, iteration 3 of 7, mode `review`, `AUTONOMOUS`.
- Dimension: **traceability** (`checklist_evidence`). Operator focus carried directly: AC-030 to AC-042 are the rows this iteration opens first, and the sixth-round requirements behind them are re-read where a cell fails.
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (`spec-folder`).

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:49` to `:140` - every AC row, its verification cell and its status.
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:226` to `:330` - the Protocol, Pre-Implementation, Code Quality, Testing, Security, Documentation, File Organization sections, the open T084 box and the Verification Summary.
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:120` to `:353` - the typed, plural, question, effort, refusal-cue and no-edit blocks, read with their line numbers.
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2854` to `:3000` - the parity test and the two `cases=` reports.
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-handoff-command.vitest.ts:200` to `:260` - the doctor handoff group.
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/stage-one-loop-subject.vitest.ts:18` to `:30` - the two stage-one cases AC-034 cites.
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5181`, `:5482`, `:5560` to `:5570` and `:5820` - the window constant, the ask-lead construction and `_is_loop_workflow_request`.
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1475` to `:1490` and `:1667` to `:1689` - `commandOnlyMentioned`'s fold block and the mode-cue loop.
- `.skilled/changelog/skilled/v4.2.0.0.md:759` - the suite row.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Five acceptance cells quote the Python fixture count as 285 while the tree holds 347 cases** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:66` -- AC-009 says `python3 tests/python/test_skill_advisor.py` prints `cases=285`; AC-028 says the same at `:85`; AC-030 repeats it at `:87`; AC-037 says "The 285 fixture cases keep their results in both suites" at `:94`; AC-042 says "`cases=203` on the sixth-round fixture and `cases=285` on the final one" at `:99`. The shared fixture holds 347 cases, the parity test reports `ok(name, f"cases={len(cases)}")`, so the number it prints is 347, and the changelog's suite row names "347 shared cases". The lower count belongs to an earlier fixture; the three-final-count sentence in AC-042 is the one that reads as current.
Case: the closure reviewer takes AC-028's `cases=285` as the final Python figure, compares it with the changelog's 347, and cannot tell whether the fixture, the test or the cell is the stale one.
Finding class: stale-measurement
Scope proof: every cell is inside the declared acceptance table; the fixture count, the printing line and the changelog row were each read.
Affected surface hints: `acceptance-criteria.md` AC-009, AC-028, AC-030, AC-037, AC-042; `deep-loop-offer-cases.json`; `test_skill_advisor.py` parity report.

2. **AC-029 and AC-028 quote suite counts the cited changelog row does not carry** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:86` -- AC-029 says the changelog "suite row quotes 184 files, 3,188 passed, 4 skipped and none failed" and cites `.skilled/changelog/skilled/v4.2.0.0.md:759`; that line reads "186 files, 3,415 passed, 4 skipped, none failed; Python scorer 136 passed, none failed on 347 shared cases". AC-028 states `npx vitest run` reports "184 files, 3,188 passed, 4 skipped, 0 failed" for the final tree, while AC-048 records "186 files, 3,415 passed" for the same tree and the changelog records the same 186/3,415. Two different final figures now sit in the acceptance table.
Case: a reader checking REQ-022's "quotes the final suite count" clause opens the cited line and finds a different count from the one the cell quotes, so the row's evidence contradicts the row's text.
Finding class: stale-measurement
Scope proof: both cells and the cited changelog line are inside the declared target; the line was printed in full.
Affected surface hints: `acceptance-criteria.md` AC-028, AC-029, AC-048; `v4.2.0.0.md` suite row.

3. **AC-031 counts 26 `doctorWithheld` fixture rows; the fixture carries 47** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:88` -- AC-031 says "26 fixture rows carry `doctorWithheld`" and cites `deep-loop-offer-cases.json:138`. A mechanical count of the fixture's `doctorWithheld` field returns 47 rows across 347 cases, and the row that line 138 holds is one of the two refusing prompts the requirement names, so the cell's anchor holds while its count does not.
Case: a reviewer estimating how much of the doctor behaviour the shared fixture pins reads 26 and under-counts by nearly half, and a future fixture edit that drops a `doctorWithheld` row would still leave the cell's number satisfied.
Finding class: stale-measurement
Scope proof: the cell and the fixture are inside the declared target; the count was produced from the fixture itself.
Affected surface hints: `acceptance-criteria.md` AC-031; `deep-loop-offer-cases.json` doctor columns.

4. **AC-032 says four multi-typed rows pin both loops in both orders; two of the four pin one loop against a non-loop command** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:89` -- AC-032 says "Four multi-typed rows pin both loops, in both orders". The four rows that carry `typedRunsKept` are `typed-two-commands-changelog` (`["/deep:review"]`, paired with `/create:changelog`), `typed-two-commands-doctor` (`["/deep:review"]`, paired with `/doctor:deep-loop`), `typed-both-loops-research-first` and `typed-both-loops-review-first` (both `["/deep:research","/deep:review"]`). Only the last two pin both loop modes; the first two pin one loop mode against a command that is not a loop.
Case: a reviewer reads the cell as four independent checks that one typed loop command never hides the other and accepts REQ-025's coverage on that strength, when half of the four check a different pairing.
Finding class: overstated-evidence
Scope proof: the cell and the four fixture rows are inside the declared target; each row's `typedRunsKept` value was read.
Affected surface hints: `acceptance-criteria.md` AC-032; `deep-loop-offer-cases.json` typed rows; `multi-typed-command-gates.vitest.ts`.

5. **AC-033's mode-cue anchor lands inside `commandOnlyMentioned`, not on the loop that skips a subject-read mode name** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:90` -- AC-033 says "The mode-cue loop skips a `NAMED_LOOP_MODE` match that `namesLoopSubject` reads as the subject (`command-attach.ts:1483`)". Line 1483 is `.replace(/[^\S\n]+/g, ' ')` inside `commandOnlyMentioned`'s fold chain. The loop the cell describes is in `loopAskCues` at `:1679` to `:1688`, where `namesLoopSubject` is consulted before a mode is added to `named`.
Case: a reviewer checking REQ-026's mode-cue skip opens `:1483`, sees a whitespace fold, and has to re-derive the whole path before the claim can be confirmed.
Finding class: evidence-anchor-drift
Scope proof: the cell and both line ranges are inside the declared target; both were printed.
Affected surface hints: `acceptance-criteria.md` AC-033; `command-attach.ts` `loopAskCues`; `command-attach-guards.vitest.ts` deferred-cue group.

6. **AC-034's Python anchor is a blank line; the stage-one copy it names is 250 lines further down** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:91` -- AC-034 says "The Python copy gates the same wording (`skill_advisor.py:5566`)". Line 5566 is empty; `_is_loop_workflow_request` is defined at `:5820` and called at `:5856`. The two test anchors the same cell cites (`stage-one-loop-subject.vitest.ts:20` and `:26`) do hold the keep and drop cases.
Case: a reviewer verifying the Python half of REQ-027 lands on a blank line and cannot tell whether the copy exists, was removed, or moved.
Finding class: evidence-anchor-drift
Scope proof: the cell, the blank line and the definition are inside the declared target; both lines were printed.
Affected surface hints: `acceptance-criteria.md` AC-034; `skill_advisor.py` `_is_loop_workflow_request`; `stage-one-loop-subject.vitest.ts`.

7. **Three cells in the sixth-round range pin fixture rows eight to thirteen lines away from where they now sit** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:101` -- AC-044 cites `deep-loop-offer-cases.json:253` for the eight plural run rows from `plural-deep-reviews-use-verb` to `plural-review-loops` (now `:262` to `:269`) and `:261` for the five false rows (the first is `plural-deep-reviews-stuck` at `:270`); AC-045 cites `:266` for `how-do-run-deep-review` (now `:279`) and `:271` for `how-do-then-run-deep-review` (now `:284`); AC-046 cites `:273` for the effort rows beginning "the deep review loop is too slow" (now `:286`) and `:286` for the controls from `effort-control-fast-run` (now `:299`). Every one of the six anchors resolves to a real line that holds a different, plausible-looking fixture row, which is why the validator's path-and-range check cannot see the drift.
Case: a reviewer confirming REQ-035's plural rows opens `:253`, finds the `past-explain` row, and must search the fixture by hand before the requirement can be checked.
Finding class: evidence-anchor-drift
Scope proof: the three cells and every cited and actual line are inside the declared target; each was printed.
Affected surface hints: `acceptance-criteria.md` AC-044, AC-045, AC-046; `deep-loop-offer-cases.json` plural, question and effort blocks.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `checklist_evidence` | partial | AC-001 to AC-054 were opened. Seven cells fail their own evidence (findings 1 to 7); AC-036 to AC-038 failed in iteration 1; the rest hold, and the Verification Summary agrees with its boxes. `tasks.md` carries 101 task boxes with 100 ticked and 26 CHK boxes split 12 P0 / 13 P1 / 1 P2, with CHK-020 open, which is what the summary's 11/12 reads. |
| `spec_code` | partial | No new requirement mapping this iteration. REQ-001 to REQ-031 are mapped (iteration 1 and 2); REQ-032 to REQ-046 are mapped in iteration 6. |

Observed measurements behind the `checklist_evidence` row (read-only, run from probes under the lineage):

- The Verification Summary at `tasks.md:322` to `:324` (`12 | 11/12`, `13 | 13/13`, `1 | 1/1`) matches the boxes: 26 CHK items in total, CHK-020 (`tasks.md:266`) open, every other box checked, and no `[B]` box. T084 (`tasks.md:166`) is the one open task, and the packet says so at `:206`, so the summary and the boxes agree — AC-041's claim holds.
- The closure statement's `Closeable: No` agrees with AC-040's `Unmet`; no row claims closure.
- AC-030 to AC-042 were read cell by cell in that order. Where a cell cites a test, the cited line was printed and its `it(...)` or `it.each(...)` header compared with the described case; where a cell cites the fixture, the row id at that line was compared with the id the cell names.

## Integration Evidence

None recorded. The changelog and `tasks.md` were read as closure records rather than as integration surfaces, and each citation is named above with the line that was read.

## Edge Cases

- **Contradiction recorded, not adjudicated (which count is final).** Finding 1 and finding 2 both turn on which round's numbers are the final ones. The tree's own final artifacts (the 347-case fixture, the changelog's 186/3,415 and the parity test's `len(cases)`) agree with each other, so this iteration treats those as the truth and the 285/184/3,188 figures as stale. If the operator intends the seventh-round figures to be the final record, the fix moves to the cells that carry the newer numbers instead.
- **Loose anchor kept, not reported.** AC-009 pins the depth-word group as `command-attach-guards.vitest.ts:532` to `:541`, and that range opens on the `it('offers the review command when it is the command typed')` line before reaching the depth-word `it.each` at `:536` to `:545`. The range does contain the evidence it describes, so it is recorded as loose rather than as a finding.
- **Loose anchor kept, not reported.** AC-033's `DEFECT_CHECK` anchor `:492` is the comment that states the `-ing` reading rather than the pattern at `:528`. The comment supports the claim, so no finding is raised.
- **Not reproducible here.** The vitest counts (`841`, `3,188`, `3,415` tests) cannot be rerun in this lineage. Findings 1 and 2 therefore rest on the counts the tree and the changelog state, not on a fresh run.

## Confirmed-Clean Surfaces

- `acceptance-criteria.md` AC-001 to AC-008, AC-012 to AC-027, AC-035, AC-039, AC-041, AC-043, AC-047 to AC-054: every cited line resolves and supports the claim it is cited for.
- `tasks.md` Verification Summary against its own boxes: 12 P0 / 13 P1 / 1 P2 with exactly one open P0 box, which is the `11/12` the table prints.
- `tasks.md` task boxes: 101 tasks, 100 ticked, one open (T084) and the open task disclosed at `:206` with its reason.
- The closure statement and AC-040 agree that the packet is not closeable.

## Ruled Out

- **A closure statement that claims more than its rows allow.** `Closeable: No` matches AC-040's `Unmet`; no other row is `Unmet`.
- **A Verification Summary that disagrees with the boxes behind it.** Counted mechanically; it agrees.
- **AC-036 to AC-038 being the only drifted cells.** AC-033, AC-034, AC-044, AC-045 and AC-046 carry the same defect class, so the earlier finding is not an isolated slip.

## Next Focus

- Dimension: `security`, with the operator focus carried as the sixth-round requirement slice that touches degraded rendering and supplied strings (REQ-028, REQ-038).
- Focus area: the trust boundaries the packet actually moves - a compiled route's JSON read as unvalidated input, a child process's stdout read as text, a supplied command string read from a degraded row, and the prompt head cut at a fixed length - plus the `commandOnlyMentioned` fold chain that rewrites arbitrary prompt text.
- Reason: `security` is a configured dimension with no iteration yet, and three of the surfaces above take outside input directly.
- Rotation status: `correctness` complete for the gate layer; `traceability` has two of its three planned passes done.
- Blocked/productive carry-forward: productive - printing a cited line and comparing it with the claim; blocked - no suite can be run, so security evidence is read from code paths and their guards.
- Required evidence: for each boundary, the exact line where input enters and the line where it is narrowed, or the absence of the guard.
- Recovery note: if a boundary turns out to be unreachable, say so and record it under Ruled Out rather than downgrading it silently.

Review verdict: PASS
