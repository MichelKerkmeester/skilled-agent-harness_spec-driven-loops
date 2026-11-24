# Iteration 5 - traceability

## Dispatcher

- Lineage: `deepseek-max-1`, generation 9, run `fanout-deepseek-max-1-1795552859377-13gxwk`
- Dimension: traceability
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`
- Operator focus addressed: `checklist_evidence` — every ticked task, every checklist row and every `Met` acceptance row checked against evidence that exists in the tree, including the twelfth fix round T112 to T114, as the focus asks.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:18` (61 AC rows, status column)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:219` (T112 to T114)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:268` (`CHK-001`)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:289` (`CHK-020`)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:341` (Verification Summary)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:180` (eighth-round row cited by AC-028)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:191` (tenth-round suite row)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:195` (eleventh-round suite row)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:198` (twelfth-round rows)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/citations/evidence-tails.py:1`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/fanout-review-focus.txt:1`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:197`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:220`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **`CHK-001` still counts 52 requirement rows, and the tree has 53** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:268` -- The checklist row says `rg -c '^\| REQ-' spec.md` prints 52 and records "Observed 2026-11-24: prints 52". On this tree the same command prints 53, because REQ-053 was added in the twelfth round and the count was not carried forward. The row is ticked, so the checklist reports a requirement count the packet no longer matches, and the checklist is the surface a release reader trusts for "requirements documented". Impact is a stale count in a closure record; no code or requirement behaviour changes.
   - Finding class: docs-drift
   - Scope proof: `tasks.md` and `spec.md` are both on `review-scope-files.txt`; the count was taken with the exact command the row names, and the REQ ids were listed end to end to confirm the 53 rows are contiguous REQ-001 to REQ-053.
   - Affected surface hints: `CHK-001`, the Verification Summary's P0 total, REQ-053's introduction row, and any reader who uses the checklist as a requirement inventory.
   - Case: a reader runs `rg -c '^\| REQ-' spec.md`, gets 53, and cannot tell whether a requirement was added without a checklist update or the checklist was never re-pointed after the addition.
   - Claim adjudication:
     - `type`: `stale_count_in_checklist`
     - `claim`: `CHK-001`'s stated and observed count of 52 is one short of the 53 requirement rows the packet carries, so the ticked row's evidence does not match the tree.
     - `evidenceRefs`: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:268`, `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:277`
     - `counterevidenceSought`: re-ran the row's own command, checked whether a header or separator row could make 52 correct (the pattern matches only `| REQ-` rows), listed every REQ id to confirm REQ-053 exists once, and checked whether a later task carried the count elsewhere (T092's closure pass names the suite counts, not the REQ count).
     - `alternativeExplanation`: the count may have been correct when written and left as the round-11 value, because the twelfth round added REQ-053 in `spec.md` and only touched the twelfth-round tasks.
     - `finalSeverity`: P2
     - `confidence`: 0.95
     - `downgradeTrigger`: if the packet intends `CHK-001` to record the count at the time of the tick rather than the count today, the row needs a date qualifier; it would then be a wording note, not a defect.

2. **`AC-028` cites the eighth-round row for the eleventh round's suite counts** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:85` -- The row states "on the final tree, after the tenth round: `npx vitest run` 186 files, 3,518 passed" and closes with `Evidence: implementation-summary.md:180 (Eighth round: advisor suite)`. Line 180 records 184 files and 3,188 passed; 186 files and 3,518 passed is the eleventh round's row at line 195, and the tenth round's row at line 191 records 186 files and 3,418 passed. So the row's round label, count and evidence pointer disagree, and a release reader who opens the cited line finds different numbers from the ones the row states. The requirement itself (REQ-021) is behaviourally met; only the closure record drifts.
   - Finding class: docs-drift
   - Scope proof: `acceptance-criteria.md` and `implementation-summary.md` are both on `review-scope-files.txt`, and all three implementation rows were read at this revision.
   - Affected surface hints: `AC-028`, the eighth, tenth and eleventh-round suite rows, `AC-042`'s final-tree count, `CHK-021`'s probe row.
   - Case: a reader checking `AC-028` opens `implementation-summary.md:180`, reads 184 files and 3,188 passed, and cannot reconcile that with the 186 and 3,518 the row states; the cell that holds those numbers is at line 195.
   - Claim adjudication:
     - `type`: `evidence_pointer_drift`
     - `claim`: `AC-028`'s count belongs to the eleventh round and its cited evidence cell is the eighth round's, so the row's citation does not support the number it states.
     - `evidenceRefs`: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:85`, `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:180`, `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:195`
     - `counterevidenceSought`: searched every implementation row for the pair 186/3,518 (only the eleventh-round and twelfth-round rows hold it), checked whether the tenth round could have reached 3,518 (its own row says 3,418), and confirmed the anchor label on line 180 exists but belongs to the eighth round.
     - `alternativeExplanation`: the row was written in the tenth round against a projected final-tree count and re-pointed during the eleventh, leaving the evidence tail at the older cell.
     - `finalSeverity`: P2
     - `confidence`: 0.93
     - `downgradeTrigger`: if a later round's own row records 186/3,518 under the tenth-round label, the label is merely loose and the pointer note stands alone.

## Traceability Checks

- `spec_code` — partial. The requirement map from iteration 3 stands for REQ-001 to REQ-034; this pass added REQ-053's single-declaration check and left REQ-035 to REQ-052 unmapped, so the protocol stays partial for one more pass.
- `checklist_evidence` — pass. Every status class was read at row level: 56 `Met`, 3 `Waived` (`AC-008` with ADR-003, `AC-017` with ADR-002, `AC-020` with ADR-009), 1 `Superseded` (`AC-019` with ADR-001) and 1 `Unmet` (`AC-040`, the open rerun). Every one of the 61 rows' `` `path:line` `` citations resolves to an existing file and to a line that carries the phrase its parenthetical names, and `scratch/citations/evidence-tails.py` prints `problems=0` on this tree. The task checklist is consistent with the status column: 113 of 114 tasks are ticked with the one open task, `T084`, being the rerun `AC-040` records as unmet, and `CHK-020` stays open for that row alone. The Verification Summary's totals describe the priority-tagged checklist rows and match them: 12 P0 rows with 11 ticked, 13 P1 rows with 13 ticked, 1 P2 row with 1 ticked, counting the legend rows out. The two P2s above are recorded as findings rather than protocol failures, because the checklist was checked and its evidence exists; what drifts is two counts.
- Result raised to `pass` on evidence: `scratch/citations/evidence-tails.py:58` writes only under `--fix`, so the run recorded here was read-only, and its `problems=0` line is the packet's own tail check.

## Integration Evidence

- Validation surface: `validate.sh --strict` is named by T113 and by several checklist rows. This review does not run it, because the dispatch forbids running repository validators from inside a lineage; the row-level evidence above is the substitute, and the gap is named rather than hidden.
- Script surface: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/citations/evidence-tails.py:1` is the packet's own acceptance-tail checker; it was read before it was run, and the read confirms the only write path is behind `--fix`.
- Focus surface: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/fanout-review-focus.txt:1` names all four dimensions, the full repo-relative finding path form, the REQ/AC/ADR ranges and the instruction not to write a `terminal_gates` row, which is what T114 says it must.

## Edge Cases

- `AC-040` reading `Unmet` is not treated as checklist drift: `T084` is the one unticked task and `CHK-020` is the one open P0 row, so the three records agree on the same open item.
- `AC-019` reading `Superseded` is not a missing verification: ADR-001 replaces its count check with the five-row check the row states, and the corpus carries 31 near-miss rows, which is the current count the row says supersedes 15.
- `AC-020`'s blind-writer clause cannot be checked from the tree, and ADR-009 says so; the row is `Waived`, not `Met`, which keeps the unverifiable clause visible.
- A `Waived` row is counted as a closed checklist row here, because the waiver is recorded in an ADR; if the project read waivers as open items, the totals would move and the summary would need a second column.

## Confirmed-Clean Surfaces

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:219` — T112, T113 and T114 are ticked with the observation each claims, and their code claims hold: one `DEEP_LOOP_DOCTOR_COMMAND` declaration, `evidence-tails.py` at `problems=0`, and a focus file that carries the four dimensions and the current ranges.
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:97` — `AC-040` is `Unmet` with the generations it read and the round that decides it, which is the honest state while the rerun is this run.
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:341` — the Verification Summary totals match the priority-tagged rows once the three legend rows are excluded, so the summary is not drifting with the checklist.

## Ruled Out

- Verification Summary totals as a third drift: ruled out. Counting the priority-tagged rows by prefix gives 12 P0, 13 P1 and 1 P2 before the legend rows are excluded, and the summary states exactly those totals with 11 of 12 P0 ticked, which is `CHK-020`'s open state.
- `T084` as missing evidence: ruled out. It is the only unticked task and its stated reason matches `AC-040`'s `Unmet` status.
- Continuity `_memory.next_safe_action` saying "Fix the nine generation 8 P2s, then run generation 9": ruled out as drift. The field is a save-time pointer written at 20:38, before the twelfth round landed; it describes the next action at the moment of that save, and the twelfth-round rows at `implementation-summary.md:198` record the round that followed.

## Next Focus

- Dimension: traceability
- Focus area: `spec_code` for REQ-035 to REQ-052, the slice that covers plural loop names, effort wording, the route guard, the reducer projections and the doctor constant.
- Reason: the checklist protocol is finished and the requirement map is two thirds done; the remaining slice is what keeps `spec_code` at partial.
- Rotation status: all four dimensions covered; spec_code unfinished.
- Blocked/productive carry-forward: productive — the fixture's row ids and the gate's exported lists resolve each clause in one read.
- Required evidence: one file:line or ADR section per remaining REQ, plus the fixture row that pins it.
- No recovery note: this pass was not a recovery iteration.

Review verdict: PASS
