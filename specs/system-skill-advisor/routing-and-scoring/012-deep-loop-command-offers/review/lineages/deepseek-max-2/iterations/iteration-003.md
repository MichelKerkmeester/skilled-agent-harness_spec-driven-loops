# Review Iteration 003

## Dispatcher

- Mode: review, target agent `deep-review`, single review iteration, lineage `deepseek-max-2`.
- Dimension: traceability, protocol `checklist_evidence`.
- Operator focus: every ticked task in `tasks.md` against evidence that really exists in the tree.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:36` (Phase 1 to Phase 3 tasks)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:112` (T051)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:164` (T082)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:184` (T092)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:206` (T104)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:254` (CHK-001)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:331` (Verification Summary)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:58` (56 acceptance rows, statuses counted)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1` (row counts by prefix)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:546` (depth-word cases)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/` (directory listing)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/behaviour/` (directory listing)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/decisions.md:1` (D-row count)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **T092's no-stale-count claim fails on two counts in its own file** -- tasks.md:184 -- T092 verifies that "no closure doc states a suite, fixture or pair count the tree no longer has". Two ticked tasks beside it do. T082 says "CHK-001's count reads 46 today" while CHK-001 reads 48 and `rg -c '^\| REQ-' spec.md` prints 48. T051 says "The table now holds 54 rows: 50 `Met`" while `acceptance-criteria.md` holds 56 rows with 52 `Met`, two `Waived`, one `Superseded` and one `Unmet`. Both are the exact drift class the tenth round was opened to remove, and both sit under a task that certifies the class is gone.
   - Finding class: instance-only closure drift
   - Scope proof: both counts are in `tasks.md` inside the declared target; the counts they state were recounted from `spec.md` and `acceptance-criteria.md`
   - Affected surface hints: AC-041's closure-docs row, which T082 and T092 back; any later count sweep over `tasks.md`
   - Case: a reader who trusts T092 closes AC-041 knowing no count is stale, then finds T082's "46" against CHK-001's 48 and T051's "54 rows" against the 56 the file holds.
2. **The tail-check script T104 names is not in the tree** -- tasks.md:206 -- T104's Verify line is "the tail check reports no problem" and its Observed line says "the tail check reports `problems=0`". No script in the packet or the repository reads the `Evidence: path:N (anchor)` tails: `scratch/` holds `probe.mjs`, `compare.mjs` and `mktable.py`, and no other file under `.skilled/` implements the check. The observation cannot be reproduced from the tree it certifies, and a re-implementation run for this iteration reports one problem (AC-040's archived report, R2-P2-001). The convention T104 established still holds on 55 of 56 rows; what is missing is the tool the task says checks it.
   - Finding class: instance-only missing artifact
   - Scope proof: the claim and the absent script both belong to this packet; `find` over `scratch/` and a repository-wide search for a tail reader return no match
   - Affected surface hints: AC-041 (closure docs) and the tenth-round evidence convention; a later round that wants to re-run the check has nothing to run
   - Case: a closure pass tries to reproduce T104's `problems=0` by running the script the task names; no such script exists, so the check has to be rewritten from the task text each time, and the rewrite finds a tail the original run did not.

## Traceability Checks

- `checklist_evidence` (core, pass with advisories this pass). All 104 ticked tasks were parsed; 130 backticked artifact tokens were resolved against the tree and every one exists (probe result files, behaviour recordings, the doctor test, `validate_document.py`, the compiled contracts). The count claims behind the checklist were recounted:
  - `rg -c '^\| D[0-9]' scratch/decisions.md` prints 11, as T001 records.
  - `rg -c '^\| REQ-' spec.md` prints 48, as CHK-001 records.
  - `acceptance-criteria.md` holds 56 rows: 52 `Met`, 2 `Waived` (AC-008, AC-017), 1 `Superseded` (AC-019), 1 `Unmet` (AC-040). CHK-020 stays open for AC-040, and the Verification Summary's 12 P0 items with 11 verified, 13 P1 and 1 P2 match the boxes they count.
  - The fixture counts the sixth to tenth rounds recorded hold: twelve `refusal-verb-*` rows with seven false and five true, 47 `doctorWithheld` rows (27 true, 20 false), four `typedRunsKept` rows, 24 `effort-*` rows with seventeen false, and the thirteen named `plural-*` rows with eight true and five false.
  - CHK-011 holds: no `REQ-` or `ADR-` id appears in a comment of `command-attach.ts`, `skill_advisor.py`, `explicit.ts` or `fusion.ts`.
- `spec_code` was recorded in iteration 2 and is not re-run here; the two findings above are checklist evidence, not new requirement mismatches.

## Integration Evidence

The task evidence chain runs through `scratch/probes/`, `scratch/behaviour/`, the advisor runtime tests and the closure documents; each named path was opened or listed. The count claims were recomputed with the commands the tasks name.

## Edge Cases

- The `| AC-ID |` header line matches a naive `^\| AC-` count, so the row count is taken over rows that start with an id, not over every matching line.
- `plural-*` covers 21 rows now; the thirteen AC-044 names are the seven named-mode and mode-free ask rows plus the five negative rows, and the eight `-served` rows are a later addition, so the row's "thirteen" is accurate for the rows it enumerates.
- `no-edit-*` covers four rows; only three carry `readOnlyRunKept`, which is what AC-048 counts.

## Confirmed-Clean Surfaces

- 130 of 130 cited artifact paths exist.
- 104 of 104 ticked tasks name at least one artifact that exists.
- CHK-020 and the Verification Summary agree with the row statuses.
- CHK-011, CHK-021, CHK-022 and CHK-031 hold against the tree and the recorded probe run.

## Ruled Out

- "A ticked task names a file that does not exist": ruled out; every resolvable path token exists once bare filenames are resolved under their directories.
- "The Verification Summary overstates what is verified": ruled out; the open CHK-020 box is the one P0 not verified, which is what 11/12 records.
- "A code comment carries an ephemeral requirement or decision label": ruled out for the four gate files.

## Next Focus

- Dimension: traceability, still on `checklist_evidence`.
- Focus area: the acceptance rows themselves — every `Met` row's evidence claim read against the artifact it names, including the sixth-round rows AC-030 to AC-042 and ADR-005/ADR-006.
- Reason: the task-level audit found two record drifts; the acceptance table is the other half of the focus.
- Required evidence: each row's cited artifact opened, not inferred from a neighbouring row.

Review verdict: PASS
