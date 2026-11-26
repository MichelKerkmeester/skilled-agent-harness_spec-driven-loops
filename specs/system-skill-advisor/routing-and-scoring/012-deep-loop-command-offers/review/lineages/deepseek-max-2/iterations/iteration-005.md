# Review Iteration 005

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Executor: `cli-pi` model `deepseek-v4.1-flash-1017`, run inline by lineage `deepseek-max-2` (generation 1, lineage mode `new`).
- Iteration 5 of 7, stop policy `max-iterations`.
- Dimension: **traceability**, core protocol `checklist_evidence`. Operator focus applied: every ticked task and every `Met` row against evidence that exists in the tree, the thirteenth round included; no `gateClass`, findings only on review-scope files, no `terminal_gates` row.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md` (T001 to T122, CHK-001 to CHK-051, Verification Summary)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md` (AC-001 to AC-067)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:190-294`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json` (69 rows)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/decisions.md`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/fanout-review-focus.txt`
- `.skilled/changelog/skilled/v4.2.0.0.md:759`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` (368 rows, counted by id family)
- `.skilled/commands/deep/research.md:3`, `.skilled/commands/deep/review.md:3` (argument hints)
- `.skilled/skills/system-deep-loop/hub-router.json:34`, `.skilled/skills/system-deep-loop/deep-research/SKILL.md`, `.skilled/skills/system-deep-loop/deep-review/SKILL.md`, `.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md`
- `.skilled/commands/deep/assets/compiled/` (three files), `.skilled/commands/deep/assets/deep-research.yaml:663`

## Findings - New

### P0 Findings

None.

### P1 Findings

None this iteration.

### P2 Findings

1. **The v4.2.0.0 changelog's verification row quotes the eleventh round's suite and fixture counts, while the packet's final tree reads the thirteenth round's larger ones, so the "final suite count" REQ-022 requires is no longer final** -- `.skilled/changelog/skilled/v4.2.0.0.md:759` -- The row reads "186 files, 3,518 passed, 4 skipped, none failed; Python scorer 136 passed, none failed on 359 shared cases". The packet's own record of the tree this review reads gives `npx vitest run` 187 files and 3,557 passed with `PY` `pass=138` on `cases=368` (`specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:202`, and AC-028 at `acceptance-criteria.md:85`). REQ-022 requires the changelog to "quote the final suite count", and AC-029 reads `Met` on the strength of that row, so both the row and the criterion now describe an earlier round as if it were the last. The fixture count in the same row (`359 shared cases`) is the same stale value this review already reported in four acceptance rows, which makes the drift a class rather than a one-off.
   Finding class: `evidence-cell-stale`
   Scope proof: `.skilled/changelog/skilled/v4.2.0.0.md` is a review-scope file, and the counts it states are checkable against the fixture and the packet's own verification rows, both in scope.
   Affected surface hints: the changelog's verification table; AC-029's `Met` cell that cites it; REQ-022's second clause; the same `359` value in `acceptance-criteria.md` AC-009, AC-030, AC-037 and AC-042 (carried as R1-P2-001).
   Case: a reader comparing a fresh `npx vitest run` (187 files, 3,557 passed) with the changelog's row reads a 39-test regression that never happened, and REQ-022's "final suite count" cannot be both statements.

## Traceability Checks

| Protocol | Level | Status | Evidence | Summary |
|---|---|---|---|---|
| `checklist_evidence` | core | partial | `[SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:66]`, `[SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:759]` | 121 of 122 tasks are ticked and every one I could re-check names evidence that exists: CHK-001's REQ count is 59 and the last REQ id is 59, CHK-002's `## 4` heading is present once, CHK-021's probe file holds 69 rows, CHK-022's N6 and N10 carry no command, CHK-040's three counts are 4/1/2, T001's decision count is 11, and every thirteenth-round fixture row (T115 to T117) exists by id. Two count classes are stale, this iteration's finding and the carried R1-P2-001. |
| `spec_code` | core | pass | `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:313]` | Unchanged from iterations 2 to 4: every REQ-named symbol exists at its cited line, and both gate copies implement the newest rules as claimed. |

## Integration Evidence

- T111's claim that every tracked change-set path in `spec.md` section 3 is a line of the review scope holds: 26 of the 28 backticked paths are scope lines, and the two that are not (`runtime/dist/`, `assets/compiled/`) are the two directories the table marks `Regenerate`, whose files are either in scope (`compiled/README.markdown`, the two contract files) or gitignored by `T111` itself.
- T122's claim about generation 10's focus holds: `review/fanout-review-focus.txt` carries the four-dimension clause, the repo-relative path rule, the "no gateClass" line and the "no `terminal_gates` row" line.
- T046's argument-hint claim holds on both command documents: `research.md:3` and `review.md:3` list `--stop-policy`, `--lineage-mode`, `--extend=N [--extend-minutes=M]` and `--count` nested under `--executor`, and `review.md` adds `--review-focus`.
- T022's and AC-043's alias claim holds: `hub-router.json:34` and `ROUTER.md:63` carry `iterative research` and `multi-round research` and no `autonomous research`.
- AC-030's, AC-031's, AC-032's, AC-044's and AC-046's counts all reproduce against the fixture: `refusal-verb-*` 12, `doctorWithheld` 47 (27 true, 20 false), `typedRunsKept` 4, `plural-*` 21 with the eight-run and five-report split exactly as stated, and `effort-*` 24 with 17 false.

## Edge Cases

- **`T084` is unticked and `CHK-020` is unticked.** Both name AC-040, which this run exists to satisfy, so the two open boxes are consistent with the packet's own statement rather than a defect.
- **`T121`'s blind-writer clause.** The task says the new fixture rows were written from the requirement text before either copy ran. No kept record can confirm the order the author worked in, so that clause is recorded as not verifiable here rather than as a pass.
- **Historical round counts inside `tasks.md`.** T088, T090, T092 and T101 state suite and fixture counts that differ from each other; each names the round it belongs to, and the tenth round restated REQ-031 without list counts, so they are round-scoped history and not drift.
- **`scratch/probes/results-after.json`.** The file is a JSON array of 69 rows, not JSONL, so CHK-021's "holds 69 rows" is read from the array length rather than a line count.

## Confirmed-Clean Surfaces

- Every `Evidence: path:N (anchor)` tail in `acceptance-criteria.md` and `tasks.md` still resolves, and no row carries a bare `path:line` citation outside its tail.
- The two deep command documents and the two presentation files carry the offer section, the three options, the recommended markers and the `--extend=N` rows that REQ-005, REQ-009, REQ-010 and REQ-014 claim.
- The compiled contracts hold no `ASK with SINGLE prompt`, and the spaced flag form is gone from the quick reference.
- The three deep skill documents no longer carry the depth triggers REQ-011 removed, and the hub `SKILL.md` names `/doctor:deep-loop`.

## Ruled Out

- **A missing ticked task behind the newest round** -- ruled out: T115 to T122 each name a tree artefact that exists, including the three new fixture-row families and the two new unit cases.
- **A scope gap behind T111** -- ruled out: the two unmatched section-3 paths are directory entries for regenerated output.
- **A stale `Met` row outside the count class** -- ruled out for the rows I re-checked by their own artefacts; the remaining rows rest on run records this review cannot re-execute, which is recorded as scope, not as a pass.

## Next Focus

- Dimension: traceability
- Focus area: `checklist_evidence` closure: re-read the `Met` rows that rest on run records (`AC-009`, `AC-010`, `AC-011`, `AC-028`, `AC-042`) against the round rows they cite, and confirm whether any further count or command output is stale
- Reason: the operator focus asks for the protocol to finish, and the remaining risk is a second count class in the rows I could not re-execute
- Rotation status: traceability continued (iteration 5 of the traceability budget)
- Blocked/productive carry-forward: `checklist_evidence` stays `partial` on the two stale count classes
- Required evidence: the citing row, the artefact it points at, and the value the artefact holds today

Review verdict: CONDITIONAL
