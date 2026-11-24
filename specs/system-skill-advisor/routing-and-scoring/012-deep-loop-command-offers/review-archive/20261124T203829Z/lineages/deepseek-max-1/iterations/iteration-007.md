# Review Iteration 007 — Cross-reference closing pass (`spec_code` finished, protocols settled)

## Dispatcher

- Lineage `review/lineages/deepseek-max-1`, iteration 7 of 7, session `fanout-deepseek-max-1-1795550334883-gjbarh`
- Dimension: cross-reference closing pass (all four dimensions are already covered; this iteration finishes the last requirement block and settles both core protocols).
- Operator focus: finish `spec_code` and `checklist_evidence`. This iteration is the one that has to say, with evidence, whether they are finished.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:259` (REQ-035 to REQ-051)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1` (every row group REQ-035 to REQ-051 names, read column by column)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:571` (`PATTERNS_NOT_COMPARED`), `:699` (the coverage test) and the guard describes
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:895`, `:919`, `:965`, `:991`, `:1085`, `:1179`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:330` (`LOOP_WORDING`), `:944` (`isRunRefused`), `:1147` (`namesLoopSubject`), `:1245` (`isLoopQuestion`), `:1693` (`routedLoopMode`)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2378` (`MIN_BLOCKED_ATTEMPTS`), `:2449` (`authoredHeading`)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None. The one open finding in this lineage remains DR1-P2-001 from iteration 1.

## Traceability Checks

| Protocol | Level | Status this iteration | Evidence |
| --- | --- | --- | --- |
| `spec_code` | core | **pass** | REQ-035: the 13 plural rows carry `asksForLoopRun` `true` on the eight run rows and `false` on the five past-run, symptom and question rows, and the mode-free plural serves `servedRun: "none"` as ADR-008 requires. REQ-036: five `how-*` question rows read `false` while `how-do-then-run-deep-review` and `how-can-you-run-deep-review` read `true`. REQ-037: the `effort-*` rows split into complaint rows at `false` and manner rows at `true` (`effort-manner-longer-run`, `-slower-run`, `-slower-elliptical`). REQ-038: `trackedCommandForOwner` (iteration 2). REQ-039: the corpus and its baseline are read under AC-012 and AC-042. REQ-040: the three `no-edit-*` rows carry `readOnlyRunKept` `review`, `review` and `research`. REQ-041: the five `refused-cue-*` rows all read `asksForLoopRun: true`. REQ-042: `routedLoopMode` (`command-attach.ts:1693`). REQ-043 and REQ-044: the `stuck-rerun-pronoun-*`, `past-summary-*`, `effort-manner-*` and `typed-doctor-*` rows read the way each requirement states, including `doctorWithheld: false` on the four clause-broken typed-doctor rows and `true` where the prompt refuses the doctor. REQ-045: the guard asserts the command table, `MODE_CUES`, `MODE_CUE_WORDS` and `hub-router.json` key the same modes, and compares `NAMED_LOOP_MODE` with `_NAMED_LOOP_MODE_RE`. REQ-046: `MIN_BLOCKED_ATTEMPTS` (`reduce-state.cjs:2378`) writes one ruling as reopened, `authoredHeading` (`:2449`) drops the authored heading, and `enrichCompiledRoutes` strips every command field from a withheld row. REQ-047: `run-deep-loop`, `plural-deep-loops`, `plural-deep-loops-served` and `two-mode-ask-mode` all read `servedRun: "none"`. REQ-048: `replaceAnchorSection` keeps the file's own number, and this lineage's own strategy file came out of seven reducer passes with no duplicate section number. REQ-049: the four `loop-wording-*` rows read `true` with `servedRun: "review"`, and the artifact-noun variant stays `false`. REQ-050: five negated-refusal rows read `true` and the two plain-refusal controls read `false`. REQ-051: `PATTERN_PAIRS`, `ANCHORED_PATTERN_PAIRS`, `FRAGMENT_PAIRS` and `QUANTIFIER_PAIRS` hold 12 + 8 + 16 + 4 = 40 pairs, `PATTERNS_NOT_COMPARED` holds 38 named rows with reasons, and the coverage test asserts every compiled pattern is accounted for. That closes REQ-001 to REQ-051: every requirement is traced either to the code that implements it or to the decision that records it. |
| `checklist_evidence` | core | partial | 54 `Met` rows stand on evidence this lineage re-derived: the 60 quoted line references all resolve to the line holding their quote (iteration 1), the seven counted claims other than AC-038 match the tree (iteration 1), every ticked task's cited path exists (iteration 5), and the fixture columns the sixth-round cells rely on exist and read the way the cells state (iterations 4 and 7). The protocol does not reach `pass`, for two named reasons: AC-038 states a count the tree no longer has (DR1-P2-001), and AC-040 waits on this run's synthesis. Recording it as `pass` would state that the checklist is finished when one row is demonstrably stale. |
| `skill_agent` | overlay | notApplicable | No skill contract pairing is in scope. |
| `agent_cross_runtime` | overlay | notApplicable | No agent definition is in scope. |
| `feature_catalog_code` | overlay | notApplicable | No feature catalog entry is in scope. |
| `playbook_capability` | overlay | notApplicable | No playbook is in scope. |

## Integration Evidence

- The fixture is the integration surface for REQ-035 to REQ-050: each requirement's prompts are rows, each row carries the column the requirement names, and both suites read the same rows (`deep-loop-offer-cases.vitest.ts` for the native gate and `test_skill_advisor.py` for the fallback), so a requirement that both copies must satisfy is checked at one place.
- `command-attach-guards.vitest.ts` carries the describes the acceptance cells name for the typography cases: "command attach on a refusal verb" (`:895`), "deferred mode cues past a refused loop phrase" (`:919`), "a plural loop name that names no mode" (`:965`), "typed command boundaries" (`:991`), "more than one typed command" (`:1085`) and "long prompts" (`:1179`).

## Edge Cases

- REQ-033 and AC-040 are a requirement and a row about this review run itself. The evidence they need is the synthesis's terminal gates, which are written after this iteration, so this iteration records them as carried rather than met. If the terminal gates read `evidence`, `scope` and `coverage` pass, the row can be closed by synthesis; if not, it stays open and says why.
- `spec_code` reaching `pass` while `checklist_evidence` stays `partial` is deliberate and not a contradiction: the first is a requirement-to-code question that every requirement now answers, and the second is a document-evidence question with one stale row in it.

## Confirmed-Clean Surfaces

- Every fixture row group REQ-035 to REQ-051 names exists, carries the column the requirement names, and holds the value the requirement states, with no row missing and no column absent.
- The pattern-coverage guard accounts for all 40 compared pairs and all 38 named exceptions, so the Python and native gates cannot drift on a pattern without a test failing.
- The reducer's numbering rule held across this lineage's own seven passes: the strategy file has no duplicate section number, which is the live proof of REQ-048 rather than a re-reading of it.

## Ruled Out

- A requirement in REQ-035 to REQ-051 with no fixture row behind it: eliminated, every row group named in the requirement block exists with the stated column values.
- A pattern the drift guard neither compares nor names: eliminated, 40 compared plus 38 named with reasons, and a coverage test that asserts the whole set.
- Section numbering drift in a strategy the reducer has repeatedly rewritten: eliminated on this lineage's own file.
- Whitespace folding that changes a reader's quoted prompt (REQ-049): eliminated for the gate result, the four variant rows withhold nothing.

## Review Focus

The operator focus is answered here. `spec_code` is finished: every one of the 51 requirements is traced to the code that implements it or the decision that records it, with `file:line` evidence and, where the claim is a served row, the fixture row and column that pins it. `checklist_evidence` is not finished, and the review says so rather than rounding up: one acceptance row is stale (AC-038) and one waits on synthesis (AC-040).

## Next Focus

- Dimension: none — the dimension queue is exhausted and all four dimensions have a full pass. Synthesis follows.
- Focus area: synthesis compiles the report, records the terminal gates, and settles the verdict from the registry.
- Reason: seven iterations are the configured cap (`stopPolicy: max-iterations`, `maxIterations: 7`).
- Rotation status: D1, D2, D3 and D4 all covered; every dimension has one full pass.
- Blocked/productive carry-forward: DR1-P2-001 is the one open finding and is a docs row, so it is a change a `/speckit:plan` follow-up can make without touching code.
- Required evidence: the terminal gates and the registry-derived verdict.

Review verdict: PASS
