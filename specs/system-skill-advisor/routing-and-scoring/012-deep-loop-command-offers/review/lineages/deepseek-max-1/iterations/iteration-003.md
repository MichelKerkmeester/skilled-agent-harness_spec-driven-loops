# Review Iteration 003

## Dispatcher

- Mode: review; target agent `deep-review`; lineage `deepseek-max-1`; generation 7; session `fanout-deepseek-max-1-1795546920757-7pyjry`.
- Iteration 3 of 7 (stopPolicy `max-iterations`).
- Dimension: `traceability`. Protocol completed this iteration: `checklist_evidence`; `spec_code` is closed here on the strength of parts 1 and 2.
- Operator review focus, addressed here: every ticked task in `tasks.md` and every `Met` row in `acceptance-criteria.md` was worked against evidence that exists in the tree, by resolving each name-based citation (fixture row id, test title, advisor file path, summary row label, count) rather than trusting the row. The sixth fix round's rows were counted against the fixture one by one, which is where the one new finding came from.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:1` to `:338` (104 ticked tasks, 1 open, 26 CHK boxes), `acceptance-criteria.md:1` to `:142` (56 rows).
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1` (347 cases, all `id`s and the `plural-*` set read case by case).
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:80` (`VOCABULARY_PAIRS`, 22 pairs enumerated in order), `:61` (`typedReviewKept`), `:220`.
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:803` (the `%s command on a refused run` title), `:895` (`command attach on a refusal verb`), `:546`.
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2875` (`servedReviewKept` read), `:3054` (`DEEP-LOOP-LONG`).
- `.skilled/skills/system-skill-advisor/runtime/tests/subprocess-typed-fields.vitest.ts:88`, `command-brief-golden.vitest.ts:353`, `typed-on-stuck-serving.vitest.ts:31`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json:1` (metrics), `command-prompts.jsonl` (near-miss and holdout rows).
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888`, `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:688` and the other 33 in-scope code files (comment-hygiene sweep).
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:144`, `:248`, `:242`; `decision-record.md:33` to `:702`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. `R1-P1-001` remains active.

### P2 Findings

4. **AC-044 and T088 still count thirteen plural loop-name rows where the fixture holds twenty-one** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:101` -- The row reads `Met` and states "the eight that ask for the run read `asksForLoopRun: true` and the five that report a past run, name a symptom or ask a question read `false`", over "the thirteen plural loop-name rows". The fixture now carries 21 `plural-*` cases: the same eight run rows, the same five false rows, and eight `-served` duplicates added when the row-level `servedRun` column was introduced (`plural-deep-reviews-use-verb-served`, `plural-deep-loops-served` and six beside them). Sixteen rows read `true`, not eight, and the row count is 21, not 13. `tasks.md` T088 repeats the same figures. The row's substantive claim - every plural loop name that asks for the run is an ask, and none of the five reporting rows is - still holds on all 21 rows, so the drift is in the numbers the cell states, not in the behaviour. It is the stale-count class the tenth round set out to remove, in the one row whose count the round added to.
   Finding class: `instance-only` (one acceptance row and the task that mirrors it).
   Scope proof: both files are packet documents inside the review target; the fixture was read as data to count the rows.
   Affected surface hints: `acceptance-criteria.md:101` (AC-044), `tasks.md` T088, `spec.md:259` (REQ-035, whose own text names thirteen prompts and stays correct as a requirement).
   Case: a reader checking AC-044's arithmetic against the fixture counts 21 rows and 16 `true`, then has to decide whether the extra eight rows violate the requirement or the cell is stale. Nothing in the row says which, and the same figures sit in T088, so both the acceptance record and the task record disagree with the tree in the same way.

## Traceability Checks

| Protocol | Status | Coverage this iteration | Evidence |
|---|---|---|---|
| `spec_code` | `pass` | All 48 REQ rows mapped across iterations 1 and 2, with the run-level limitation recorded below | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1537`, `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:230` |
| `checklist_evidence` | `pass` | 104 ticked tasks, 52 `Met` rows, 26 CHK boxes resolved against the tree; 27 fixture row ids, 35 advisor file paths and 14 test titles all exist; the counts are re-derived and one row's count is stale (R3-P2-001) | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:101`, `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1` |

Checklist evidence, worked per category:

- Fixture row ids: 27 distinct `row `id`` citations in `acceptance-criteria.md` and `tasks.md`, all 27 present in the fixture. No dangling id.
- Advisor file paths: 35 `tests/…`, `runtime/…`, `lib/…`, `handlers/…` and `scripts/…` citations, all 35 resolving under the advisor runtime. No dangling path.
- Test titles: 14 `it`/`describe` titles cited by name, all present; the one apparent miss was the checker's own whitespace normalisation.
- Counts quoted by the closure docs, re-derived from the files: fixture cases 347 (T068, AC-029), REQ rows 48 (CHK-001), CHK boxes 26 split 12 P0 / 13 P1 / 1 P2 with 11 of 12 P0 verified (Verification Summary), `VOCABULARY_PAIRS` 22 with `RUN_ASK_REFUSAL_LEADS` last (AC-038), `typedRunsKept` 4 (AC-032), `doctorWithheld` 47 split 27/20 (AC-031), `effort-*` 24 split 17 false / 7 true (AC-046), `refusal-verb-*` 12 split 7 false / 5 true (AC-030), `servedRun: "none"` 4 (AC-051, AC-055), `plural-*` 21 split 16 true / 5 false (AC-044 states 13 and 8 - finding 4).
- Acceptance statuses: 52 `Met`, 1 `Unmet` (AC-040), 2 `Waived` (AC-008/ADR-003, AC-017/ADR-002), 1 `Superseded` (AC-019/ADR-001). Every waiver names an ADR that exists at `decision-record.md:128` to `:223`.
- Task states: 104 ticked, 1 open (T084, the rerun itself), no `[B]` row. The `Completion Criteria` block's unchecked first box and CHK-020's unchecked box are both the same open item, so the box count and the narrative agree.
- Comment hygiene: 35 in-scope code files swept for `REQ-`, `AC-`, `ADR-`, `CHK-`, `T0nn`, a spec path or an iteration label inside a comment; zero hits, which corroborates CHK-011 and the repository's comment rule independently of the recorded `git diff` check.

## Integration Evidence

- Advisor runtime test layer: `tests/deep-loop-offer-cases.vitest.ts`, `tests/command-attach-guards.vitest.ts`, `tests/python/test_skill_advisor.py`, `tests/typed-on-stuck-serving.vitest.ts`, `tests/subprocess-typed-fields.vitest.ts`, `tests/command-brief-golden.vitest.ts`, `tests/cli-degraded-command-contract.vitest.ts`.
- Advisor fixture: `tests/fixtures/deep-loop-offer-cases.json`, read as data for every count the acceptance rows state.
- Routing corpus: `scripts/routing-accuracy/command-prompts.jsonl` (near-miss and holdout rows) and `command-routing-baseline.json` (metrics `false_offer` 0 of 57).
- Packet 013: `013-deep-loop-offer-in-hint/implementation-summary.md:123` is the degraded-path record its REQ-006 asks for, and its cited `subprocess-typed-fields.vitest.ts:88` is the test that carries it.
- Decision records: ADR-001 to ADR-008 all exist, and each waiver or supersession in `acceptance-criteria.md` names one of them.

## Edge Cases

- Missing dependency: the run-level clauses (a suite count, a probe compare, a corpus recapture) cannot be re-executed from this lineage, so `spec_code` is closed on the alignment the protocol asks for and the run-level limitation is recorded rather than converted into evidence.
- Ambiguity: several `tasks.md` observations quote counts that were true in the round they describe and are superseded later ("the fixture holds 54 cases" in T044, 63 in T050, 203 in T068). Those read as round history and are not treated as current claims; only the rows a reader would take as current - AC-044 and T088 - are findings.
- Partial success: `checklist_evidence` covers all 104 tasks and all 52 `Met` rows by category, not line by line; the categories are the citation shapes the tenth round introduced, and each was resolved by name against the tree.

## Confirmed-Clean Surfaces

- Every waiver and supersession in `acceptance-criteria.md` names an ADR that exists, and the three unchallenged statuses (AC-008, AC-017, AC-019) match their decision records.
- The six closure counts a reader would check first - 48 requirements, 347 fixture cases, 26 CHK boxes, 22 vocabulary pairs, 4 typed-run rows, 47 doctor rows - all match the tree.
- No in-scope code comment carries an ephemeral artifact label.

## Ruled Out

- "A task cites a fixture row that no longer exists": ruled out. All 27 row ids resolve.
- "A task cites an advisor test file that no longer exists": ruled out. All 35 file citations resolve.
- "The `Waived` rows are unbacked": ruled out. ADR-002 and ADR-003 exist and describe the waivers.
- "Historical intermediate counts in `tasks.md` are stale claims": ruled out for the round-scoped observations, which name the round they belong to; carried into the finding only where the row reads as current.

## Next Focus

- Dimension: `correctness`.
- Focus area: the gate's own logic - `asksForLoopRun`, `loopAskCues`, the typed-command branches and the stuck-run branch - for behaviour the requirement text does not cover and the fixture does not pin.
- Reason: traceability has closed both core protocols; the three remaining dimensions follow, and correctness is where the largest code surface sits.
- Rotation status: `correctness` opens; `security` and `maintainability` follow in iterations 5 and 6.
- Blocked/productive carry-forward: productive - reading the predicate and then probing `dist` catches more than either alone; carry both.
- Required evidence: a correctness finding with file:line and a probe result, or a named counterexample search that came back clean.
- Recovery note: none.

Review verdict: CONDITIONAL
