# Review Iteration 001 — deepseek-max-2

**Dimension:** traceability (D3)
**Protocol:** `spec_code`
**Focus:** every REQ in `spec.md` against the code or decision that implements it, with the operator focus carried in full: the sixth fix round (REQ-023 to REQ-034) is read against the gate, the shared fixture and the closure rows.

## Dispatcher

- Run: `fanout-deepseek-max-2-1795514074741-gl47kr`, generation 1, lineage mode `new`, fan-out lineage label `deepseek-max-2`.
- Execution: `cli-pi` model `deepseek-v4.1-flash-1017`, reasoning effort `max`, sandbox full access. This process is the iteration executor; no nested dispatch ran.
- Artifact directory: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2`.
- Config read: `maxIterations=5`, `convergenceThreshold=0.1`, `stopPolicy=max-iterations`, four canonical dimensions, `reviewScopeFiles` = 46 paths.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:326-560,675-700,840-900,936-1120,1300-1423`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4480-4630,4905-4960,5306-5400,5459`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1-3`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:65-95,186-296`
- `.skilled/commands/deep/assets/deep-review-presentation.txt:13-60,237-280,582-583`
- `.skilled/commands/deep/assets/deep-research-presentation.txt:13-58,223-246`
- `.skilled/commands/deep/review.md:81`
- `.skilled/commands/deep/research.md:86`
- `.skilled/changelog/skilled/v4.2.0.0.md:470-500,759`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:208-246`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:86-99`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:126-175`
- Context-only (outside the review scope file list, read to test a claim, never cited as finding scope): `.skilled/skills/system-deep-loop/hub-router.json:34`, `.skilled/skills/system-deep-loop/ROUTER.md:63`, `.skilled/skills/system-deep-loop/SKILL.md:20`, `.skilled/skills/system-deep-loop/deep-review/SKILL.md:4,57`, `.skilled/skills/system-deep-loop/deep-research/SKILL.md`, `.skilled/commands/deep/assets/deep-review.yaml:736,2534`, `.skilled/commands/deep/assets/deep-research.yaml:663,2268`, `.skilled/repo-rules/communication-handoff.md:149-172`.
- Steering channel: `steer.md` is absent from the lineage directory at iteration 1.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Closure evidence states a fixture size the fixture no longer has** -- `acceptance-criteria.md:87` -- AC-030, AC-037 and AC-042 record the shared fixture as holding 203 cases ("`PY` prints `cases=203`", "the 203 fixture cases keep their results in both suites"), and `tasks.md:140,151,174` repeat it. The file holds 248 cases.
   Case: an operator re-runs the verification command each cell names (`python3 tests/python/test_skill_advisor.py`, which prints `cases={len(cases)}` from the shared fixture at `skill_advisor.py:2912`/`:2964`, or `rg -c '"id"' tests/fixtures/deep-loop-offer-cases.json`) and gets `cases=248`, so the stated observation in three `Met` rows and three ticked tasks cannot be reproduced. The seventh round added the per-entry fixture cases T087 describes, which grew the file, and no evidence cell was repointed.
   Finding class: `evidence-drift` (record accuracy, no behaviour change).
   Scope proof: `acceptance-criteria.md` and `tasks.md` are both entries in `reviewScopeFiles`; `deep-loop-offer-cases.json:1-3` and `deep-loop-offer-cases.vitest.ts:186-296` are too, and the count is read directly from the tracked file, not inferred from prose.
   Affected surface hints: `acceptance-criteria.md` AC-030/AC-037/AC-042 evidence cells; `tasks.md` T068/T075/T087; `implementation-summary.md:165-166`.

2. **A `Met` row and its task quote a changelog number that is gone** -- `acceptance-criteria.md:86` -- AC-029 records that the changelog "quotes 2,696 passed", and `tasks.md:128` (T063) repeats the same observation. The string `2,696` no longer appears anywhere in `.skilled/changelog/skilled/v4.2.0.0.md`; the suite table quotes `184 files, 3,126 passed, 4 skipped, none failed` at `:759`.
   Case: a reader verifying AC-029 searches the changelog for the number the row says it holds and finds nothing, so the row's `Met` rests on an observation the tree contradicts. The seventh round corrected the changelog suite count (recorded in `implementation-summary.md:173`) and the row was not repointed to the corrected line.
   Finding class: `evidence-drift` (record accuracy, no behaviour change).
   Scope proof: the row is in `acceptance-criteria.md` (in scope); the contradicting text is `.skilled/changelog/skilled/v4.2.0.0.md:759`, also in scope; the claim that 2,696 is absent was produced by `rg -n "2,696|2696"` over that file, which printed no match.
   Affected surface hints: `acceptance-criteria.md:86`, `tasks.md:128`, `.skilled/changelog/skilled/v4.2.0.0.md:759`.

3. **Two closure rows state different suite totals for the same tree** -- `acceptance-criteria.md:99` -- AC-042 says "Observed 2026-11-24 on the final staged tree: ... `npx vitest run` 184 files, 3029 passed", and `tasks.md:163` (T081) repeats 3029. The same packet's seventh-round record says 3,126 for the same suite (`tasks.md:174`, `implementation-summary.md:172`) and the changelog table at `:759` quotes 3,126.
   Case: a release reader takes the "final staged tree" figure from AC-042 and finds a different total in the packet's own seventh-round rows and changelog, with no round label on AC-042's number saying which tree it measured. Both numbers are labelled as the end state, so the row cannot be used to prove the current tree's suite is green.
   Finding class: `evidence-drift` (record accuracy, no behaviour change).
   Scope proof: `acceptance-criteria.md:99`, `tasks.md:163,174` and `.skilled/changelog/skilled/v4.2.0.0.md:759` are all in `reviewScopeFiles`; the disagreement is read from those cells, and this iteration did not run the suite (out of this dispatch's write scope), so which total the current tree would print is recorded as unknown rather than guessed.
   Affected surface hints: `acceptance-criteria.md:99`, `tasks.md:163`, `tasks.md:174`, `implementation-summary.md:164,172`, `.skilled/changelog/skilled/v4.2.0.0.md:759`.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | pass | Every REQ-001 to REQ-034 names a producer that exists in the tree; the gate, the presentation assets, the command documents, the reducer and the drift guard are each at the line the REQ names. The three findings above are record-accuracy drift in the evidence cells, not a missing implementation. |
| `checklist_evidence` | not run this iteration | Scheduled for iteration 2: the ticked tasks and every `Met` row are read against the tree, including AC-030 to AC-042 and ADR-005/ADR-006. |

What this iteration actually ran, so the claim is not a reading of prose:

1. The 41 prompts REQ-015 to REQ-019, REQ-023 to REQ-024, REQ-026 to REQ-027 and ADR-006 name, plus the REQ-002 controls, through the built native gate (`dist/runtime/lib/command-attach.js`) and through `skill_advisor.asks_for_loop_run` / `is_stuck_run_complaint`: every prompt gives its stated result in both copies and the two copies agree on all 41 (`asksForLoopRun` and `stuckRun` identical). REQ-015, REQ-016, REQ-017, REQ-018, REQ-019, REQ-023, REQ-024 all hold; the bare loop name ADR-006 rules out reads `false` and "run a deep loop" reads `true`.
2. `attachCommand` on a single review route: "run /deep:review on the parser, then /create:changelog" and "/deep:review the parser and then /doctor:deep-loop" both return `/deep:review` (REQ-025); "skip the deep review and just answer" returns `undefined` while the three REQ-023 keep controls return `/deep:review`; "the deep research run is stuck. please don't run anything" returns `undefined` (REQ-024); the typed-stuck prompt returns `/doctor:deep-loop` at this layer and the served head is the typed command (REQ-029, ADR-005).
3. `attachCommand` on a deferred route: "run a deep loop to review the research loop config" and "run a deep loop checking the parser for bugs" both return `/deep:review` (REQ-026), and "review the research loop config" returns `undefined`.
4. The per-entry coverage the drift guard claims (REQ-031, AC-038) was replicated over the tracked fixture: every entry of `LOOP_WORDING`, `LOOP_NAMES`, `LOOP_WANT_LEADS`, `COUNT_WORDS`, `ITERATIVE_VERBS`, `LOOP_RUN_SYMPTOMS`, `LOOP_ARTIFACT_NOUNS` and `PAST_RUN_READ_VERBS` has a covering case — 0 missing. The twelve vocabulary pairs were compared against the Python tuples with the guard's own reader — 0 mismatches.
5. REQ-005, REQ-007 (compiled-contract claim read as a file assertion), REQ-009, REQ-010, REQ-011, REQ-012, REQ-014 and REQ-032 were checked at the asset, YAML, corpus and reducer lines they name: the offer section with options A/B/C and `--spec-folder=<the Gate 3 answer>` is at `deep-review-presentation.txt:13-58` and `deep-research-presentation.txt:13-58`; step 0 points at it at `review.md:81` and `research.md:86`; the `--extend=N` and `/doctor:deep-loop --scope=` rows are at `deep-review-presentation.txt:582-583`; step 6 names the question surface at both presentation files' line 223/237 with Q2 and Q-Exec marked recommended; the completed-packet message names `--extend=N` and `--restart` at `deep-research.yaml:663`; the two research aliases are at `hub-router.json:34` and `ROUTER.md:63` with no `autonomous research`; the corpus holds 31 `near-miss` rows; `refinesSameLocation` is at `reduce-state.cjs:995`.

Not run, and said so rather than implied: the vitest suites, the Python suite, `validate.sh`, the probe script, the mirror checks and the corpus capture. Each writes outside this lineage's write surface (build output, caches, `review/` state), so their results are taken from the packet's records and from the two direct gate runs above.

## Integration Evidence

- `@deep-review` LEAF contract: this dispatch ran inline, single process, no Task/sub-agent call.
- Append gateway: the iteration record is handed to `append-mode-event.cjs --mode review --run-directory` (state write only through the ledger).
- Reducer: `reduce-state.cjs --artifact-dir` owns the registry, dashboard and strategy anchors for this lineage.
- Source of truth for the gate comparisons: `dist/runtime/lib/command-attach.js` (built from `lib/command-attach.ts`) and `scripts/skill_advisor.py`; a finding against either is measured, not inferred.

## Edge Cases

- **Two suite totals for one tree (P2-003).** Which number the current tree prints cannot be settled without running `npx vitest run`, which would write caches outside the lineage. The finding therefore rests on the contradiction between cells, not on a chosen side; `downgradeTrigger`-style note: if a fresh run reports 3,029 on this tree, only AC-042's "final staged tree" label stays wrong.
- **The fixture is 248 cases while three rows say 203.** The rows' own verification commands are what disagree with the tree, so no reading of the fixture was needed beyond counting it; the count is a property of the committed file.
- **`implementation-summary.md:166` says the drift guard compares "eleven vocabulary pairs".** The guard now compares twelve (`deep-loop-offer-cases.vitest.ts:65-77`), which T087 and AC-038 both record. Recorded here rather than as a fourth finding: it is the same stale-snapshot class as P2-001 and a fix to that finding's lines covers it.
- **Scope discipline.** `.skilled/skills/system-deep-loop/hub-router.json`, `ROUTER.md`, both deep `SKILL.md` files and both deep YAML workflows are outside `reviewScopeFiles`; they were read to test REQ-009 and REQ-011 claims and are cited as context only, never as a finding's file.

## Confirmed-Clean Surfaces

- `command-attach.ts` gate: explicit loop wording, counts, iterations, passes, want leads, typed command, continue/ resume/ extend, refusal leads, subject nouns, past-run reads, writing-about, questions and the bounded 400-character lead window are all implemented as REQ-001 to REQ-031 describe.
- `skill_advisor.py` gate: the same predicates agree with the native copy on all 41 REQ prompts; `typed` is emitted on a kept typed run row (`:5384`); `_RUN_REFUSED_RE` (`:5306`) and `_RUN_ASK_NEGATED_RE` (`:4905`) carry the sixth-round vocabulary.
- `deep-loop-offer-cases.vitest.ts`: twelve vocabulary pairs, two numeric pairs, five per-entry case groups; the guard reads the Python source rather than importing it, so a renamed tuple fails instead of comparing empty.
- Both offer sections: one question, three options, A recommended, B `:confirm`, C no loop, native executor unless named, fan-out only on two or more executors or models or independent takes.
- `reduce-state.cjs:995` `refinesSameLocation`: a refinement at another file or dimension keeps its own entry; a same-file refinement still folds.

## Ruled Out

- **REQ-001 "plain loop asks gain the command row" as a finding**: the gate returns `/deep:review` on a plain ask in both copies and the deferred-route cue adds the mode; no drift found.
- **A TS/Python parity drift in `asksForLoopRun`**: 41 REQ prompts compared, 0 disagreements; the words level is also pinned by the twelve-pair guard.
- **A depth-word leak into the gate**: "do a thorough code review" and "find out everything you can" both read `asksForLoopRun: false`, as REQ-002 requires.
- **A typed-command loss on a second typed command**: both REQ-025 prompts keep `/deep:review` at the gate layer and the served head.
- **A bare-loop-name ask (ADR-006)**: "deep loop: audit the payments flow" reads `false`; "run a deep loop" and "I want a review loop" read `true`.

## Next Focus

- **Dimension:** traceability (D3)
- **Protocol:** `checklist_evidence`
- **Focus area:** the ticked tasks (`tasks.md:20-175`), every `Met`/`Waived`/`Superseded` row in `acceptance-criteria.md:80-102`, the Verification Summary at `tasks.md:298-300`, and ADR-005 / ADR-006 as the decisions REQ-020, REQ-029 and ADR-006 rest on.
- **Reason:** the operator focus names both core protocols; `spec_code` finished this iteration and `checklist_evidence` has not run.
- **Rotation status:** first pass on this dimension, no pivot.
- **Blocked/productive carry-forward:** productive — the evidence-cell drift found here predicts more of the same class in the AC rows; blocked — the suite totals cannot be re-measured inside this write surface.
- **Required evidence:** for each ticked task and each met row, the file:line the cell names, read directly; a cell whose cited line does not hold the claim is a finding.
- **Recovery note:** not applicable.

Review verdict: PASS
