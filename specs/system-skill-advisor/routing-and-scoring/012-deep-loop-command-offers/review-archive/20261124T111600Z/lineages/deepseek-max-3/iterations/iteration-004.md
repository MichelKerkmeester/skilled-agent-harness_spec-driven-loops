# Review Iteration 004

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Session: `fanout-deepseek-max-3-1795514074741-gl47kr`, generation 4, lineageMode `new`
- Iteration 4 of 5. Dimension: traceability, second pass (`checklist_evidence`). Operator review focus bound: the same protocol pair.
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder). Scope: the 46 paths in `review-scope-files.txt`.
- No `steer.md` exists in this lineage at iteration 4, so this iteration carries no lead ruling.

## Dimension

Traceability, second pass: `checklist_evidence` over the 87 task rows and 43 acceptance rows. A ticked box is checked against the tree by rerunning the row's own stated command where the tree can answer it, and a `Met` row is checked against the line its evidence cell cites.

The operator focus was addressed by finishing the second core protocol, so both `spec_code` and `checklist_evidence` now carry a final status with file:line evidence.

## Files Reviewed

- `tasks.md:34-179` (T001 to T087), `tasks.md:202-300` (CHK rows and the Verification Summary)
- `acceptance-criteria.md:49-127` (AC-001 to AC-043 and the closure statement)
- `scratch/probes/fresh-review-hook.txt:1-30` (AC-022 to AC-026, AC-029, AC-036 evidence)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl:94` and the whole row set (AC-020)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:125` (AC-032), `:2` (header), whole file counted for `refusal-verb-` and `doctorWithheld`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:963`, `tests/scorer/stage-one-loop-subject.vitest.ts:20`, `:26`, `tests/command-brief-golden.vitest.ts:353`, `:364`, `tests/typed-on-stuck-serving.vitest.ts:107`
- Fifteen ticked rows rerun with their own `rg` command: T006, T008, T013, T014, T015, T016, T017, T018, T020, T021, T023, T027, T028, T045, T065

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None. The one stale acceptance cell this pass would have raised is already active as `R3-P2-001`, and the two documentation defects the task rows carry are active as `R3-P2-002` and `R3-P2-003`; repeating them here would inflate the count without adding evidence.

## Traceability Checks

- **`spec_code` (core, hard): pass.** Unchanged from iteration 3, no row re-opened by this pass. Evidence: `spec.md:213`, `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1291`.
- **`checklist_evidence` (core, hard): pass.** All 87 task rows and all 43 acceptance rows were checked. Every ticked row's stated command that the tree can answer was rerun and agreed with the row; every `Met` row's cited line was read and holds the observation, apart from the `AC-029` cell already active as `R3-P2-001`. Evidence: `tasks.md:244`, `acceptance-criteria.md:86`, `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl:94`.

Row counts and what the boxes hold:

| Set | Boxes | Open | Agrees with the Verification Summary |
|---|---|---|---|
| P0 items | 12 | 1 (`CHK-020`) | yes — `11/12` |
| P1 items | 13 | 0 | yes — `13/13` |
| P2 items | 1 | 0 | yes — `1/1` |
| Task rows | 87 | 1 (`T084`) | yes — the open rows are the ones the summary counts out |

Rerun results, fifteen rows whose own command the tree can answer:

| Row | Command result | Row's claim |
|---|---|---|
| T006 | no `'several models'` in `explicit.ts` | prints nothing |
| T008 | 31 `near-miss` rows | count moved from 15 to 31 through D10 |
| T013 / T014 | step 0 present at `research.md:86` / `review.md:81` | one line each |
| T015 / T016 | `ASK with SINGLE prompt` absent from both presentation files | prints nothing |
| T017 / T018 | `--extend=N` present in both YAML files | present |
| T020 | `/doctor:deep-loop --scope=review` at `deep-review-presentation.txt:583` | present |
| T021 | hub `SKILL.md` names `/doctor:deep-loop` at `:20` | present |
| T023 | one `multi-round research` line in `ROUTER.md` | present |
| T027 | `--max-iterations 15` absent from the research quick reference | prints nothing |
| T028 | `ASK with SINGLE prompt` absent from the compiled contract | prints nothing |
| T045 | no `says "iterations", "iterative"` row in the deep assets | prints nothing |
| T065 | `ADR-005` present in `spec.md` and `acceptance-criteria.md` | present in both |

Acceptance cells checked by content, beyond the citation sweep:

- `AC-020` (`acceptance-criteria.md:77`): the three deep-family `-01` holdout rows are gone and `command-prompts.jsonl:94` is `cmd-deep-research-plain-holdout-04`. The row itself discloses that the blind-writer clause rests on the implementation summary rather than on a kept lane report, which is honest and is why it is not raised again.
- `AC-022` / `AC-023` (`:79`, `:80`): `fresh-review-hook.txt:1-9` shows the six refusals with no `/deep:*` command, the control with `/deep:review`, and both loop questions with no command.
- `AC-030` (`:87`): eleven `refusal-verb-` rows in the fixture, which matches the cell.
- `AC-031` (`:88`): twenty-six fixture rows carry `doctorWithheld`; the twenty-seventh occurrence is the header's own description of the field, so the cell's count is right.
- `AC-032` (`:89`): `fixtures/deep-loop-offer-cases.json:125` is `typed-two-commands-changelog` with `typedRunsKept: ["/deep:review"]`.
- `AC-033` (`:90`): `command-attach-guards.vitest.ts:963` is the deferred-route table that asserts `/deep:review`.
- `AC-034` (`:91`): `stage-one-loop-subject.vitest.ts:20` keeps the loop lane and `:26` drops it.
- `AC-035` (`:92`): `command-brief-golden.vitest.ts:353` prints a typed deep command plainly and `:364` keeps the offer on a degraded row that is not marked typed.
- `AC-036` (`:93`): `typed-on-stuck-serving.vitest.ts:107` serves `/deep:review` with policy `ask` and `typed: true`.
- `AC-043` (`:100`): `autonomous research` appears in neither hub file, and both aliases appear in both.

Non-`Met` rows, each checked for a backing record:

- `AC-008` `Waived` -> ADR-003 exists (`decision-record.md:223`) and states the measured offer rate.
- `AC-017` `Waived` -> ADR-002 exists (`:128`) and records the out-of-domain replay that keeps the alias.
- `AC-019` `Superseded` -> ADR-001 exists (`:33`) and names the five near-miss rows plus D1's replacement row.
- `AC-040` `Unmet` -> correct while this review runs; its cell says the rerun is a follow-up, not part of the build.

## Integration Evidence

- `tasks.md:299-300` (the Verification Summary rows) were recomputed against the boxes they count; the three categories agree.
- `acceptance-criteria.md:123-127` (closure statement) still describes `Met`, `Waived` and `Superseded` as the closeable set, which matches the four non-`Met` rows as they stand.

## Edge Cases

- **Two rows are open by design, not by failure.** `T084` and `CHK-020` are the rerun and its acceptance check; both name why they are open, and both flip only when this run's report lands. A checklist pass that marked them ticked would be the defect.
- **`AC-019` is superseded, so its count clause is not checked.** The corpus holds 31 near-miss rows, not the 15 the row originally named; ADR-001 records the reversal and the replacement check, so the count is not a defect.
- **`AC-020` rests on a record rather than a kept artifact.** Its cell says the lane reports are not kept; the row-id evidence it does carry resolves, so the gap is disclosed rather than hidden.
- **A count that looks off by one is the header.** `doctorWithheld` appears 27 times in the fixture for 26 rows, the extra occurrence being the header's description of the field.

## Confirmed-Clean Surfaces

- Every ticked row whose command the tree can answer agrees with its own stated result.
- Every `Met` row's evidence cell resolves to a line that holds the observation, with the single exception already active as `R3-P2-001`.
- All four non-`Met` rows name a record that exists, or state honestly why they cannot be met yet.
- The Verification Summary's three counts match the boxes behind them.

## Ruled Out

- **A ticked task whose stated verification no longer holds:** ruled out over fifteen reruns and the whole-row sweep.
- **A `Waived` or `Superseded` row with no backing ADR:** ruled out; ADR-001, ADR-002 and ADR-003 all exist and say what the cells claim.
- **A `Met` row resting on a citation that does not resolve:** ruled out; all 116 `path:line` citations in the packet resolve once the documents' declared `$ADV` base is applied.
- **A Verification Summary that overstates the verified count:** ruled out; `11/12`, `13/13` and `1/1` are what the boxes hold.
- **A checklist row silently ticked while the work is outstanding:** ruled out; `T084` and `CHK-020` are open and each names its reason.

## Next Focus

- Dimension: maintainability
- Focus area: the gate's two copies as a maintenance surface — comment hygiene, the drift guard as the anti-divergence mechanism, the closure docs' readability, and whether the packet's own documents now tell a consistent story after four rounds.
- Reason: it is the last uncovered canonical dimension, and the two open rows plus the P2 set are the maintenance questions worth stating.
- Rotation status: 3 of 4 dimensions covered; both core protocols recorded at pass.
- Blocked/productive carry-forward: productive category "resolve the citation against its declared base, then read the line" closed both protocols; the maintainability pass should reuse it rather than invent a new approach.
- Required evidence: file:line for each claim, and a statement of what a follow-on maintainer would get wrong.

## Verdict

No new finding and no active P0 or P1, so the iteration passes. Both core protocols are now `pass`, and the terminal coverage gate has what it needs once maintainability is covered.

Review verdict: PASS
