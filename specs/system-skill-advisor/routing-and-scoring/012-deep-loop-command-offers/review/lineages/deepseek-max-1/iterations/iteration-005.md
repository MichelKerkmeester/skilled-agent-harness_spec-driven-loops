# Iteration 5 - traceability (spec_code, part 2 and the doc overlays)

## Dispatcher

- Lineage: `deepseek-max-1`, generation 10, run `fanout-deepseek-max-1-1795556727682-axtzf8`
- Dimension: traceability
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`
- Operator focus addressed: this pass carries `spec_code` from REQ-023 through REQ-052, checking each word rule against both gate copies and the shared fixture, and runs the `feature_catalog_code` and `playbook_capability` overlays against the files the packet updated.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:244` (REQ-023 to REQ-052)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:90` (AC-030 to AC-059 rows)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:770` (`RUN_ASK_REFUSAL_*`, `RUN_REFUSED`, `LOOP_QUESTION`, `askNamesMode`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1180` (`namesLoopSubject`, `hasLoopAsk`, `loopAskCues`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1450` (`COMMAND_ASKED_BY_PRONOUN`, `COMMAND_DECLINED_BY_PRONOUN`, `COMMAND_AS_DOCUMENT`, `RUN_COMMAND_WITHDRAWN`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1694` (`attachCommand`, `deferredLoopCommand`, `routedLoopMode`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:452` (`passesAsked`, `researchLoop`, `reviewLoop`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1075` (`withholdDeepLoopDoctorWithoutRun`)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:363` (`enrichCompiledRoutes` duplicate guard)
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1518` (`degradedRecommendations`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5120` (`_fold_quotes`, `_LEAD_WINDOW`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5398` (`_has_loop_ask`, `_loop_ask_cues`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5834` (`_apply_deep_loop_offer_gate`)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:288` (the T115 to T117 rows and the refusal/question/typed/plural rows)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:960` (the refused-cue and mode-cue cases)
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/stage-one-loop-subject.vitest.ts` (the four stage-one cases)
- `.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts` and `tests/subprocess-typed-fields.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-head-length.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:490` (the guard tables)
- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33` (the offer and contract sections)
- `.skilled/skills/system-skill-advisor/runtime/lib/README.md:146` (the command-attach paragraph)
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/command-offer-fit-gates.md:23` (NC-012)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (the near-miss and holdout rows)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` (the corpus counts)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. Carried forward: `L1-P1-001` (a refused run ask after a loop question is read as an ask) is still active.

### P2 Findings

None new. The earlier P2s (`L1-P2-001`, `L2-P2-001`, `L3-P2-001`, `L3-P2-002`, `L4-P2-001`) remain active.

## Traceability Checks

- `spec_code` — partial (REQ-023 to REQ-052 mapped; REQ-053 to REQ-059 remain for the next pass). The map:
  - REQ-023: `RUN_ASK_REFUSAL_LEADS`, `RUN_ASK_REFUSAL_VERBS` and `RUN_ASK_REFUSAL_CANCELLED_SOURCE` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:773` and the Python copy at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5217`; the fixture rows `refusal-verb-*` and `negated-refusal-*` pin both sides.
  - REQ-024: `RUN_REFUSED` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:978`, its Python twin `_RUN_REFUSED_RE` at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5746`, and the fused withhold at `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1075`; fixture `stuck-refusal-*` and `doctorWithheld` rows.
  - REQ-025: `typedCommandForTop` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:322`; `typedCommandIn` is exported and read only by the boundary tests at `.skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts:176`, as the requirement states.
  - REQ-026: `loopAskCues` and `askedLoopMode` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1745`; fixture `deferred-loop-subject-config` and `deferred-defect-check-ing`, plus the guards cases at `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:972`.
  - REQ-027: `passesAsked` at `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:452` and `_is_loop_workflow_request` at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5926`; AC-034's `ac034-served-head.jsonl` records the two outcomes.
  - REQ-028: `degradedRecommendations` at `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1518` reads `typed.policy` from the tracked table; `command-brief-golden.vitest.ts` and `subprocess-typed-fields.vitest.ts` pin the plain `(ask)`.
  - REQ-029: `attachTypedCommand` at `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:363`; fixture `typed-stuck` reads `typedReviewKept: false` and `servedReviewKept: true`, and `tests/typed-on-stuck-serving.vitest.ts` pins the served head.
  - REQ-030: `ADVISOR_PROMPT_MAX_CHARS = 10_000` at `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257`; `_advisor_prompt_head` at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888` counts UTF-16 units; `LEAD_WINDOW = 400` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:799` and `_LEAD_WINDOW` at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5210`; `tests/command-head-length.vitest.ts` carries the long-prompt cases.
  - REQ-031: `VOCABULARY_PAIRS` at `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:100`, `PATTERN_PAIRS` at line 504, `FRAGMENT_PAIRS` at 536, `QUANTIFIER_PAIRS` at 560 and `PATTERNS_NOT_COMPARED` at 574; `SMALL_EDIT_WORDING` is outside the guard as the requirement says.
  - REQ-032: `refinesSameLocation` at `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1014`; the unit test `reduce-state-refinement-other-file.vitest.ts` pins the other-file entry.
  - REQ-033: this run is the traceability rerun; AC-040 remains `Unmet`, which is the correct state while this lineage runs.
  - REQ-034: the fixture header at `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:2`, limitations 6 and 7 at `implementation-summary.md:291` and `:292`, the changelog lines at `.skilled/changelog/skilled/v4.2.0.0.md:213` and `:483`, and packet 013's degraded-path evidence at `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/implementation-summary.md:123`.
  - REQ-035 and REQ-036: the plural-noun and how-to rows at `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:288` to `:372`; `isLoopQuestion` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1295` and `_is_loop_question` at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5338`.
  - REQ-037 and REQ-044: `LOOP_EFFORT_LEADS`, `LOOP_EFFORT_WORDS`, `LOOP_EFFORT_COMPLEMENT_AFTER` and the effort-manner rows in the fixture; `COMMAND_CLAUSE_END` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1482` and `requestedAfterComma` at line 1548.
  - REQ-038: `trackedCommandForOwner` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:313`; the CLI use at `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1558`; `tests/cli-degraded-command-contract.vitest.ts`.
  - REQ-039: `capture-command-routing-baseline.mjs` and `command-routing-baseline.json`; the summary's "over the 35 rows ... both 0" line at `implementation-summary.md:158`.
  - REQ-040: `NO_EDIT_REQUEST` and `READ_ONLY_LOOP_MODES` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:900` and the read-only branch in `deferredLoopCommand`; fixture `readOnlyRunKept` rows.
  - REQ-041 and REQ-042: `loopAskCues` blanking at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1745` and the routed-mode guard at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1770`; guards cases at `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:972`.
  - REQ-043: `hasUnrefusedPronounRerun`, `LOOP_RUN_BY_PRONOUN` and `PAST_RUN_OUTPUT`; fixture `pronoun-rerun-*` and `past-run-*` rows.
  - REQ-045: `MODE_CUES`, `MODE_CUE_WORDS`, `NAMED_LOOP_MODE` and the hub `routerSignals`; the drift-guard case "keys the same modes on the command table, the cue words and the hub router".
  - REQ-046: `refinesSameLocation` above and `enrichCompiledRoutes` at `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:421` (the withheld row strips command, policy, owner and typed); the handler test `advisor-recommend-duplicate-command.vitest.ts`.
  - REQ-047: the Python gate's `asked_mode` branch at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5838` and the deferred `askedLoopMode` path; fixture `run-deep-loop`, `plural-deep-loops`, `plural-deep-loops-served` and `two-mode-ask-mode` read `servedRun: "none"`.
  - REQ-048: `replaceAnchorSection` at `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2458`; `deep-review-strategy-numbering.vitest.ts`.
  - REQ-049: `lowerFolded` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:917` and `_fold_quotes` at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5124`; fixture `loop-wording-*` rows.
  - REQ-050: `RUN_ASK_REFUSAL_CANCEL_LEADS` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:788` and the Python cancel list; fixture `negated-refusal-*` rows.
  - REQ-051: the guard tables above and the compiled-name accounting at `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:686`.
  - REQ-052: `stripReviewVerdict` at `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:227`; `next-focus-iteration-verdict.vitest.ts`.
  - The active P1 is again the one uncapped rule in this slice: a refusal after a question. Every named case in REQ-023 to REQ-052 holds against the tree; the protocol is `partial` because REQ-015's general rule is not complete.
- `checklist_evidence` — partial. AC-030 to AC-059 were read row by row, and each names a fixture row, test title or file that exists; `evidence-tails.py` still reports `problems=0`. The task rows for this range are not yet checked against the tree, so the protocol stays `partial`.
- `feature_catalog_code` — pass. `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33` describes the deep-loop gate, the deferred mode, the no-edit exception and the command contract; each clause matches the code read this iteration. The one imprecision is the sentence "the CLI and the hook brief both call it", which is true of `trackedCommandForOwner` but does not say the brief keeps the child's policy and owner; that is covered by `L2-P2-001` and is not a catalog-vs-code contradiction.
- `playbook_capability` — pass. `.skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/command-offer-fit-gates.md:23` states the no-edit exception and the read-only loop behavior, and its NC-012 expected signals match the gate cases at `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:972` and the command-row policy at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:76`.

## Integration Evidence

- Feature catalog surface: `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md` is the catalog leaf that describes `advisor_recommend`; it was read against `handlers/advisor-recommend.ts` and `lib/command-attach.ts`.
- Playbook surface: `.skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/command-offer-fit-gates.md` is the NC-012 scenario; its prompts and expected signals were compared with the guards test and the tracked table.
- Fixture surface: `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` is the one file both suites read; every row named above is from it.
- Probe surface: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` and `command-routing-baseline.json` are the corpus records for REQ-039.

## Edge Cases

- `results-after.json` and `ac034-served-head.jsonl` are recorded snapshots, not live runs; the traceability claim is that the snapshot matches the tree's contract, not that the advisor was re-executed here.
- The corpus baseline's `capturedAt` is the pre-change capture; the 35-row subset counts are the recapture's comparison, as `implementation-summary.md:158` records. That is a two-file record rather than one stale field.
- `feature_catalog_code` and `playbook_capability` are the only overlays that apply to this packet's changed files; `skill_agent` and `agent_cross_runtime` have no agent or mirror change in the declared change set and are left for the next pass to record as `notApplicable`.

## Confirmed-Clean Surfaces

- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` -- the refusal rows (`refusal-verb-*`), the plural rows, the how-to rows, the typed rows and the no-edit rows all read the columns their requirements state.
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:972` -- the refused-cue and mode-cue cases pin the served mode for REQ-041 and REQ-042.
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/stage-one-loop-subject.vitest.ts` -- the four cases pin the subject and refusal readings of the stage-one loop rule.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` -- the near-miss and holdout rows named by REQ-012 and REQ-013 are present with their expected values.
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:686` -- the pattern accounting and reverse direction are both present.

## Ruled Out

- "The plural loop rows lost the hub lane": ruled out. `explicit.ts` reads `loops?` in the research and review rules and the fixture's plural rows pass in both suites.
- "The mode-free ask still keeps a run row in Python": ruled out. The `asked_mode` branch drops both run rows when the ask names no mode, and the `servedRun: "none"` rows are read by both suites.
- "The no-edit rule still withholds a read-only loop": ruled out. `READ_ONLY_LOOP_MODES` keeps review and research and only the doctor is withheld.
- "The refused loop phrase still supplies the mode cue": ruled out. `loopAskCues` blanks the refused phrase before `askedLoopMode` reads it, and the guards case at line 972 pins the served review.
- "The corpus counts regressed": ruled out. The 35-row subset counts are 0 for both, and the one attached offer is a new near-miss row recorded on its own.

## Next Focus

- Dimension: traceability
- Focus area: `spec_code` part 3, REQ-053 to REQ-059 and the decision record (ADR-001 to ADR-009), then the remaining overlays `skill_agent` and `agent_cross_runtime` as `notApplicable` where no agent or mirror changed.
- Reason: the word-rule slice holds; the last seven requirements are the reducer, doctor-name and hook surfaces where the earlier findings live.
- Rotation status: traceability pass 2 of 4 complete.
- Blocked/productive carry-forward: productive -- the fixture and the two gate copies gave a line for every requirement.
- Required evidence: one file:line per REQ-053 to REQ-059 and one ADR row for each decision-backed requirement.
- Recovery note: none.

Review verdict: CONDITIONAL
