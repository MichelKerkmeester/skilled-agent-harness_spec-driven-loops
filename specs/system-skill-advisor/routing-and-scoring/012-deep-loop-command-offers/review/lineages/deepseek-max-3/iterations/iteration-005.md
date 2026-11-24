# Iteration 5 - Traceability

## Dispatcher

Dimension: traceability. Operator focus: `checklist_evidence` -- every ticked task in `tasks.md` and every `Met` row in `acceptance-criteria.md` against evidence that exists in the tree, with the thirteenth round first. This iteration completes the protocol and records it as `fail`: three acceptance rows state final-tree counts the tree no longer has. It also confirms the thirteenth round's T115 to T122 on the tree.

## Files Reviewed

- `tasks.md` T115 to T122, the Verification Summary, CHK-001 to CHK-051, and the Completion Criteria
- `acceptance-criteria.md` AC-001 to AC-067, their statuses and their `Evidence:` tails
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` (368 cases; row ids and counts)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:717` (`holds every name it compares or excuses`)
- `.skilled/skills/system-skill-advisor/runtime/tests/brief-command-owner-check.vitest.ts`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` (the reducer cases T120 names)
- `implementation-summary.md:201` to `:204` (the thirteenth-round rows) and `:255` to the limitations
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/citations/evidence-tails.py` (read-only run)

## Findings

### P0 Findings

(none)

### P1 Findings

(none)

### P2 Findings

1. **Three acceptance rows state final-tree suite counts the tree no longer has** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:66` -- AC-009 says "Observed 2026-11-24 on the final tree ... the two files report 2 files and 841 tests passed" and its Verification cell says the Python suite prints `cases=359`; AC-030 (`:87`) says the same two files report 841 tests and `PY` prints `cases=359` "on the final tree"; AC-037 (`:94`) says "The 359 fixture cases of the final tree keep their results in both suites". The fixture on this tree holds 368 cases (`deep-loop-offer-cases.json`, 368 `cases`), and the row that owns the final counts, AC-028 (`:85`), reads "187 files, 3,557 passed, 4 skipped, 0 failed ... `pass=138, fail=0` with `cases=368`", which the implementation summary's thirteenth-round rows repeat (`implementation-summary.md:202`). The three earlier rows therefore cite a suite and fixture size from the eleventh round while calling it the final tree, which is the drift class T092 and T121 were meant to close.
   Finding class: instance-only (three evidence cells, one stale count pair).
   Scope proof: the acceptance file is in `review-scope-files.txt`; the counts are checked against the fixture file and AC-028 in the same document.
   Affected surface hints: `acceptance-criteria.md` AC-009, AC-030 and AC-037; `tasks.md` T121 (whose claim that the closure docs were brought to the tree this row qualifies).
   Case: a reader takes AC-009's 841-test and `cases=359` figures as the final-tree evidence and reruns the two files or the Python suite, then finds different numbers with no row explaining the difference.

## Traceability Checks

- `checklist_evidence` (core): **fail**. Every one of the 122 tasks was read by round and every one of the 67 AC rows by status. 121 tasks are ticked and T084 is open (`tasks.md:166`), which matches AC-040's `Unmet`; 62 rows are `Met`, 3 `Waived` (AC-008/ADR-003, AC-017/ADR-002, AC-020/ADR-009), 1 `Superseded` (AC-019/ADR-001) and 1 `Unmet` (AC-040). The evidence tails resolve (`scratch/citations/evidence-tails.py` prints `problems=0`), CHK-001's count equals the last REQ id (59), and the Verification Summary (12 P0 with 11/12 verified, 13 P1, 1 P2, `tasks.md:353`) matches the boxes. The protocol fails on R5-P2-001: three `Met` rows rest on final-tree counts the tree contradicts.
- `spec_code` (core): `fail`, carried from iteration 4 (REQ-016 by R1-P1-001, REQ-047 by R4-P2-001).
- `feature_catalog_code` (overlay): `partial`. The catalog's `attachCommand()` paragraph was read against the code in iteration 3 and carries R3-P2-001; the rest of the paragraph matches. Raised to `pass` in iteration 6 when the hub-side statements are read.

### Thirteenth round (T115 to T122) on the tree

| Task | Claim | Check |
|------|-------|-------|
| T115 | A digit count reads only in the question's clause | `questionClause` (`command-attach.ts:1285`) and `_loop_question_clause` (`skill_advisor.py:5328`) exist; the three fixture rows (`how-do-run-count-in-later-clause`, `how-can-stop-loop-count-in-later-clause`, `how-do-run-count-in-question-clause`) read true/false as stated; both copies agree |
| T116 | A whole-word "then" opens a clause | `explicitRunOutranks` (`command-attach.ts:847`) and `_explicit_run_outranks` (`skill_advisor.py:5283`) read `\bthen\b`; the three fixture rows read true/false as stated |
| T117 | Five zero-width characters fold as whitespace | `lowerFolded` (`command-attach.ts:917`) and `_fold_quotes` (`skill_advisor.py`) list the five; `loop-wording-zero-width`, `loop-wording-byte-order-mark` and `question-zero-width-control` pass in both copies |
| T118 | The accounting reads every compiled name | `deep-loop-offer-cases.vitest.ts:717` (`holds every name it compares or excuses`) and the forward test at `:696`; every `re.compile` name in the gate slice is accounted for |
| T119 | The hook brief vets a subprocess command | `ownedCommandRecommendation` (`skill-advisor-brief.ts:189`) mapped at `:580`; `brief-command-owner-check.vitest.ts` pins both cases and the alias group |
| T120 | Clean surfaces are not ruled out, reasons are projected | `ruledOutSection` reads only "Ruled Out" (`reduce-state.cjs:377`); `splitRuledOutEntry` (`:2392`) splits "direction -- reason"; `deep-review-state-reducer.vitest.ts` holds the cases |
| T121 | Generation 9's closure findings are closed | the tails check prints `problems=0`; AC-011, AC-028, CHK-001, REQ-011 and the four no-edit statements hold; the stale counts in R5-P2-001 qualify the claim |
| T122 | The focus leaves `gateClass` to the reducer and files only on listed files | `fanout-review-focus.txt` says both; the lineage scope carries 77 files including the thirteenth-round files; the reducer assigns `hard` to `spec_code`/`checklist_evidence` and `advisory` to the overlays (`reduce-state.cjs:1592`) |

## Integration Evidence

- The acceptance table is the closure gate for the packet: `implementation-summary.md` and `tasks.md` both point to it as the document that decides closure (`spec.md:322`).
- The evidence-tail checker lives at `scratch/citations/evidence-tails.py` and was run read-only; it checks the `Evidence: path:N (anchor)` tail of every row, not the counts inside the Verification cell, which is why the stale counts survive it.

## Edge Cases

- AC-040 and T084 are open by design (this review is the rerun they ask for); they are not counted as evidence drift.
- CHK-020 is unchecked for the same reason; the Verification Summary counts it as the one unverified P0 item, which matches.
- The suite and probe runs quoted by AC-009/AC-030/AC-037 cannot be re-executed inside the lineage write bounds (each writes a results file outside it), so the finding rests on the fixture size and on AC-028's own numbers, which are mutually consistent.
- The two waived rows that cite ADRs (AC-008/ADR-003, AC-017/ADR-002) and the superseded AC-019/ADR-001 all name ADRs that exist in `decision-record.md`.

## Confirmed-Clean Surfaces

- T001's decision count is 11 (`rg -c '^\| D[0-9]'` on `scratch/decisions.md`), as the task states.
- The AC status distribution is exactly 62 `Met`, 3 `Waived`, 1 `Superseded`, 1 `Unmet`; every waiver and supersession names an ADR that exists.
- The Verification Summary's 12/13/1 splits match the CHK boxes, and CHK-020 is the only open one.
- AC-031's 47 `doctorWithheld` rows (27 true, 20 false), AC-044's 21 `plural-*` rows, AC-046's 24 `effort-*` rows with 17 false, and AC-030's twelve `refusal-verb-*` rows all match the fixture.
- Every `path:line` evidence tail in the acceptance table resolves to the line that holds the named anchor (`problems=0`).

## Ruled Out

- "The Verification Summary miscounts the CHK boxes" -- ruled out: 12 P0, 13 P1 and 1 P2 boxes match the summary, and CHK-020 is the only unchecked one.
- "A waiver names a missing ADR" -- ruled out: ADR-001, ADR-002, ADR-003 and ADR-009 all exist, and each waived or superseded row names the one it relies on.
- "The thirteenth-round tasks are ticked without code" -- ruled out: each of T115 to T120 names a symbol or test that exists on the tree, and the fixture rows they name are present.

## Next Focus

Dimension: traceability
Focus area: REQ-022 and REQ-034 against the closure records -- the changelog's suite count and the implementation summary's limitation and count statements -- plus the overlay protocols.
Reason: REQ-022 and REQ-034 were held back from iteration 4 because their evidence is the closure documents; the changelog row is the last unread count.
Required evidence: a `spec_code` re-check for the two rows, one result each for the two overlay protocols that apply, and `path:line` for the changelog count.

Review verdict: CONDITIONAL
