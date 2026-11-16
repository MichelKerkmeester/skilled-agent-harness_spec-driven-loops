# Review Iteration 002

## Dispatcher

- Lineage: `scorer-6`, area `scorer`, artifact dir `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-6`.
- Review focus (pass six): the scorer area's holdout hygiene and the docs that describe the start rule, per `review-brief-6.txt`.
- Dimension: security and traceability, run as one explicit cross-reference pass because the lineage has three iterations for four dimensions.
- Sources read: the scoped scorer, the scoped vitest file, the scoped README, the packet's phase 035 and 036 acceptance criteria, and their `scratch/` evidence files. `steer.md` does not exist in this lineage directory.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1696-1717` (single-session mode), `:1723-1772` (label reader), `:2036-2056` (holdout refusal and unscored reasons), `:2590-2665` (every printed line).
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:1560-1585` (shell-step start cases).
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:112-135`.
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/036-start-rate-fixed-rule/acceptance-criteria.md`, `scratch/restate.txt`, `scratch/restate-sets.txt`, `scratch/after.txt`.
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/035-suite-metrics-and-start-shape/scratch/shape-check.txt`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The README and the shell-step test still say a bare document read is a start** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:135` -- the scorer row keeps the sentence "A start and a loop the run took are read from the same reads a load is, so a `cat` of the command's document counts", while the same row later states the new rule that a read with no write in the checkout is a lookup. The vitest comment above the shell-step table says the same thing ("a reader that opens the document is the same start a read tool records") even though every case in that table now also writes `src/parse.mjs`, so the `cat` case starts because of the write, not the read.
   Finding class: traceability.
   Scope proof: both files are pass-six scoped scorer files, and the disagreement is between the README's own two sentences in the same row.
   Affected surface hints: `startRate`, `startShapes.readOnly`, `readDocument`, `startShape`, README scorer row, shell-step test comment.
   Case: `cat .skilled/commands/create/readme.md` on a `/create:readme` row with no write — `startState` returns `{started: false, shape: 'readOnly'}` (probe, and the case at `command-transcript-score.vitest.ts:1504`), so the README sentence and the test comment both describe a start that no longer happens.
   Fix completeness: delete the `cat` clause from both sentences and leave the search, in-place `sed` and heredoc exclusions, which are still true.

## Traceability Checks

- `spec_code`: pass (carried). Phase 036 REQ-004 maps to `startState` and its cases; REQ-001's arithmetic holds by construction at `score-command-transcripts.mjs:1494-1518`.
- `checklist_evidence`: pass. `036-start-rate-fixed-rule/scratch/restate.txt` holds the 22 start lines reading `numerator moved by readOnly, denominator equal` plus the 10 decline lines reading `equal`; `restate-sets.txt` holds the 11 pre/final data lines plus two `other fields equal` rows; `after.txt` records `2326 passed` and the mutation check that the new summary lookup case fails when the shape tally moves back under `started`. The counts are the data lines the criteria name, so the evidence matches AC-001, AC-003 and AC-004.
- Security/holdout: `loadRowLabels` keeps a holdout row as `{holdout: true}` only (`:1767`), `scoreRun` returns `holdout_row` before it reads a session (`:2050`), every printed line carries a row id, a reason code or a count (`:2593-2658`), and `scoreSession` prints a runtime, a session id and a record count (`:1714`). No prompt text reaches stdout.

## Integration Evidence

- `SKILL_ADVISOR_FRESH_PROMPTS_PATH` is read only by the scorer (`:1732`) and set only by the scoped vitest file; no arm or scoring command sets it, so the holdout classification cannot be redirected by a tune or report path.
- The packet's 036 checklist evidence is read as files, not re-scored: the brief forbids `--summary`, so no session store or corpus row was opened.

## Edge Cases

- The AC-001 line count reads 22 while `restate.txt` holds 32 lines; the extra 10 are the decline lines, which the same file carries and AC-003 names. The 22 and the 11 are the data lines the criteria count, so this is a counting convention, not missing evidence.
- `loadRowLabels` silently skips a missing fresh file, so fresh rows become `unknown_row` rather than a refusal. That path is unchanged by this branch and sits outside the diff's behaviour, so it is recorded here and not raised.

## Confirmed-Clean Surfaces

- Holdout rows never reach a score, an output line or a reason; the refusal carries the reason code `holdout_row` only.
- `--runtime --locator` loads a session and prints record counts; it never joins a row label and cannot print a prompt.
- The README's new paragraph at line 115, its `startRate`/`startShapes` sentences in the row at line 135, and `byPolicy`/`startedOfOffered` all agree with `startState` and `addScored`.

## Ruled Out

- A `SKILL_ADVISOR_FRESH_PROMPTS_PATH` redirect of a holdout row as a security hole: only the scoped test sets it, and a holdout row still needs a plain row with the same id in that file to be scored; recorded as ruled out rather than as a finding.
- The scorer writing anything to disk: it has no filesystem write call; all of its writes are stdout.
- A holdout row id in `unscoredRuns` as a leak: ids are committed in the corpus, and the reason carries no prompt.

## Next Focus

- Dimension: maintainability.
- Focus area: the new `startShape` helper's contract against its callers and the `scoreRun` JSDoc, and the shape key list against `newTally`.
- Reason: correctness, security and traceability are read; the remaining risk is documentation debt created by the same change.
- Rotation status: open.
- Required evidence: a read of every declaration the change touched and of the return-type block it did not.

Review verdict: PASS
