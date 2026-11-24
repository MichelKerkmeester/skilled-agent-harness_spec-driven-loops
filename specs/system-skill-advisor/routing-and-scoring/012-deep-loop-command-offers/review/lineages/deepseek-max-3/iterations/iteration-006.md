# Review Iteration 6

## Dispatcher

- Resolved route: mode=review target_agent=deep-review
- Run: `fanout-deepseek-max-3-1795552859377-13gxwk`, lineage `deepseek-max-3`, generation 1
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder)
- Dimension: traceability
- Steer file: absent at dispatch time
- Operator review focus addressed: the last requirement and acceptance batch. It checks `REQ-040` to `REQ-053` against the two gate copies and the newest fix round, and `AC-044` to `AC-061` against the fixture columns, the reducer rules and the closure rows that cite the twelfth round.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:260-300`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:101-119`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:187-222`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:703-900`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:269-365`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:193-200, 1000-1145, 1690-1765`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1056-1095`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:384-430`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:500-540, 671-710`
- `.skilled/system-deep-loop/runtime/scripts/reduce-state.cjs:200-240, 1011-1040, 2378-2480`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-strategy-numbering.vitest.ts:1-90`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/next-focus-iteration-verdict.vitest.ts:1-60`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new in this iteration. Iteration 1's active P1 keeps the verdict at CONDITIONAL.

### P2 Findings

None new in this iteration. The four open P2s from iterations 1 to 4 remain active.

## Traceability Checks

- `spec_code` (partial, `REQ-040` to `REQ-053`):
  - `REQ-040`: the three no-edit prompts return `True` from the fallback gate and the fixture carries `readOnlyRunKept` values `review`, `review` and `research`; `NO_EDIT_REQUEST` does not withhold a read-only loop (`command-attach.ts:920`, `:1621`). Evidence: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1621`.
  - `REQ-041`: all four refuse-one-mode prompts return `True`, and `loopAskCues` blanks only the refused phrase before the mode cue is read (`command-attach.ts:1713-1735`). Evidence: `command-attach.ts:1713`.
  - `REQ-042`: `routedLoopMode` reads the ask's mode on the routed single-target branch and the fallback's `_asked_loop_mode` returns `review` for the routed prompt. Evidence: `command-attach.ts:1694`.
  - `REQ-043`: the two pronoun reruns return `True`, `run it again to reproduce the crash` returns `False`, and both past-summary prompts return `False`; `hasUnrefusedPronounRerun` requires a named run. Evidence: `command-attach.ts:635`.
  - `REQ-044`: the three manner prompts return `True`, the longer-than complaint returns `False`, and the fallback gate keeps `/doctor:deep-loop` on all three typed-doctor prompts. Evidence: `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5743`.
  - `REQ-045`: the mode vocabulary is asserted on the four surfaces (`deep-loop-offer-cases.vitest.ts:760-777`), `NAMED_LOOP_MODE` is compared with `_NAMED_LOOP_MODE_RE` (`:504`), and the fixture carries the refusal-gap, past-run, stuck-symptom and question cases. Evidence: `tests/deep-loop-offer-cases.vitest.ts:504`.
  - `REQ-046`: one ruling renders as `RULED OUT` with a reopen condition (`MIN_BLOCKED_ATTEMPTS`, `reduce-state.cjs:2378-2417`), `replaceAnchorSection` absorbs an authored heading (`:2453`), and `enrichCompiledRoutes` adds every command it keeps to `alreadyOffered` (`advisor-recommend.ts:389-427`). Evidence: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2378`.
  - `REQ-047`: the fallback gate keeps no run row for `run a deep loop on the cache layer`, `run two deep loops on the cache layer` or `run 5 iterations of research and review on the parser`; the four `servedRun: none` fixture rows agree. Evidence: `tests/fixtures/deep-loop-offer-cases.json:330`.
  - `REQ-048`: `replaceAnchorSection` keeps the number the file already gives a section; the numbering test exists and the golden next-focus fixture records `## 12. NEXT FOCUS`. Evidence: `reduce-state.cjs:2421-2447`.
  - `REQ-049`: the four whitespace prompts (double space, tab, line break, non-breaking space) return `True`; `lowerFolded` collapses every run of whitespace in both copies. Evidence: `command-attach.ts:884`.
  - `REQ-050`: both negated refusals return `True`; `RUN_ASK_REFUSAL_CANCEL_LEADS` and its Python tuple hold the cancelling leads. Evidence: `command-attach.ts:716`.
  - `REQ-051`: the pattern guard compares or excuses every compiled gate pattern (43 today); iteration 3 records the one accounting gap in the coverage test (finding 3). Evidence: `tests/deep-loop-offer-cases.vitest.ts:571`.
  - `REQ-052`: `stripReviewVerdict` ends the projected section at the `Review verdict:` line (`reduce-state.cjs:227`) and the unit test exists. Evidence: `reduce-state.cjs:227`.
  - `REQ-053`: `DEEP_LOOP_DOCTOR_COMMAND` is declared once, in `command-attach.ts:197`; `fusion.ts` imports it and builds `DOCTOR_NAMING_LED` from it. Observed: `rg "const DEEP_LOOP_DOCTOR_COMMAND" .skilled/skills/system-skill-advisor/runtime/lib` prints one line. Evidence: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:197`.
  - `REQ-033` (pending closure): this rerun's `spec_code` and `checklist_evidence` results are recorded in this iteration as partial and are raised to pass in iteration 7, when the full range is traced.
- `checklist_evidence` (partial, `AC-044` to `AC-061`):
  - `AC-044`: the fixture holds 21 `plural-*` rows; the eight run rows read `true`, the five past/symptom/question rows read `false`, and the eight `-served` rows carry their modes. Observed in the fixture.
  - `AC-045`: `how-do-run-deep-review` and `how-can-research-loop-stop` read `false`, `how-do-then-run-deep-review` reads `true`.
  - `AC-046`: 24 `effort-*` rows, 17 `false` and 7 `true`, matching the cell.
  - `AC-047`: the three named test titles exist in `cli-degraded-command-contract.vitest.ts`; `trackedCommandForOwner` is read at `skill-advisor-cli.ts:1571`.
  - `AC-048` to `AC-052`: the `no-edit-*`, `refused-cue-*`, `stuck-rerun-*`/`past-summary-*`/`effort-manner-*`/`typed-doctor-*` rows read their columns as the cells state; the fixture totals match.
  - `AC-051`: the eight plural `-served` rows carry `review`, `review`, `review`, `research`, `research`, `none`, `research`, `review`, matching the cell.
  - `AC-053` to `AC-055`: the drift-guard tables, the reducer rules and the `servedRun: none` rows are present; `AC-054`'s `MIN_BLOCKED_ATTEMPTS`, `authoredHeading` and `alreadyOffered` sites all exist at the cited files.
  - `AC-056` and `AC-060`: the numbering and next-focus unit tests exist, and the code paths they pin are the ones the cells name.
  - `AC-057` to `AC-059`: the whitespace rows read `true`, the negated-refusal rows read their columns, and the pattern guard holds 40 compared pairs and 38 excused names (iteration 3's finding 3 covers the accounting edge).
  - `AC-061`: one `DEEP_LOOP_DOCTOR_COMMAND` declaration, imported by `fusion.ts`.
  - `T112` to `T114`: `T112` is reproduced by commit `257bda24512` and the single declaration; `T113`'s closure rows (REQ-025 without the removed caller, ADR-007 scoped to the hub alias lists, the timeline through generation 8) all read as recorded; `T114`'s focus rewrite is the `review/fanout-review-focus.txt` text this run carries, which names all four dimensions, full repo-relative finding paths, the current REQ/AC/ADR ranges and the no-`terminal_gates` instruction.

Both protocols remain `partial`; iteration 7 raises them to `pass` with the full-range evidence and records the final stop state.

## Integration Evidence

- `PYTHONDONTWRITEBYTECODE=1 python3` evaluated the fallback gate for every `REQ-040`, `REQ-041`, `REQ-043`, `REQ-044`, `REQ-047` and `REQ-049` prompt, including the mode-free and whitespace variants.
- The shared fixture was read as data for the `plural-*`, `effort-*`, `no-edit-*`, `refused-cue-*`, `negated-refusal-*`, `typed-doctor-*`, `stuck-rerun-*` and `loop-wording-*` groups.
- The twelfth-round commit `257bda24512` was read as the evidence for `REQ-053` and `T112`; `T113`'s rows were checked in `tasks.md` and `decision-record.md`.

## Edge Cases

- `REQ-033` remains the one requirement whose status is this run's to settle; it is not a file claim, so it is recorded as pending until iteration 7.
- `T114`'s verification ("the focus asks for all four dimensions...") is satisfied by the focus file this run was dispatched with; the file is not a code artifact and is read as configuration input.
- The twelfth-round suite counts are recorded observations; the suite was not rerun because a build would write outside the lineage.

## Confirmed-Clean Surfaces

- Every `REQ-040` to `REQ-053` prompt named in the requirement text returns its stated result from the fallback gate, except the interaction finding 1 records for `REQ-036`.
- The fixture groups behind `AC-044` to `AC-052` match the cells' counts and columns exactly.
- `REQ-053`'s single-declaration claim holds in the tree as built by `257bda24512`.
- `T112` to `T114` are pinned by the commit, the single declaration, the scoped ADRs and the focus file this run carries.

## Ruled Out

- A second `DEEP_LOOP_DOCTOR_COMMAND` declaration: the `rg` prints one line.
- A missing `REQ-053` import in the scorer: `fusion.ts` imports the constant and builds its naming pattern from it.
- A stale `T113` scope: REQ-025 no longer names the removed caller, ADR-007 is scoped to the hub alias lists, and the timeline carries generation 8.
- A fixture/total drift in `AC-044` to `AC-052`: every count matches.

## Next Focus

- Dimension: traceability
- Focus area: close `spec_code` and `checklist_evidence` with the full-range evidence, restate the active findings and their paths, and prepare the synthesis state
- Reason: iteration 7 is the last configured iteration and the one that must leave both core protocols at `pass` with a non-empty evidence list, so the terminal coverage gate can read them
- Rotation status: traceability in progress; both protocols raised to pass in iteration 7
- Blocked/productive carry-forward: the whole evidence set from iterations 4 to 6 is productive; no new discovery is needed
- Required evidence: a file:line evidence list per core protocol covering the full REQ and AC ranges

Review verdict: CONDITIONAL
