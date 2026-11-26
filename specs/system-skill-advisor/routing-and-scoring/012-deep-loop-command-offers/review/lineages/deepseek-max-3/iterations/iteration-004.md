# Iteration 4 - Traceability

## Dispatcher

Dimension: traceability. Operator focus: the full `spec_code` sweep -- every REQ-001 to REQ-059 against the code that implements it or the decision that records it. This iteration completes the REQ sweep, records `spec_code` as `fail` because two REQs are contradicted (REQ-016 by R1-P1-001, REQ-047 by R4-P2-001), and leaves REQ-022 and REQ-034 to iteration 6 because their evidence is in the closure records iteration 5 reads.

## Files Reviewed

- `spec.md` REQ-001 to REQ-059 (row by row)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:348`, `:1030`, `:1213`, `:1673`, `:1690`, `:1727`, `:1747`, `:1793`, `:1805`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5020`, `:5280`, `:5338`, `:5446`, `:5783`, `:5848`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:444`, `:454`, `:463`, `:493`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:27`, `:1061`, `:1079`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:313`, `:322`
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1490`, `:1558`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:189`, `:580`
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1014`, `:2381`, `:2392`, `:2451`, `:2656`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (near-miss and holdout rows)
- `.skilled/commands/deep/assets/deep-research.yaml:663`, `.skilled/commands/deep/assets/deep-review.yaml:2530`, both presentation files, both command documents
- `.skilled/skills/system-deep-loop/hub-router.json:34`, `.skilled/skills/system-deep-loop/ROUTER.md:63`, `.skilled/skills/system-deep-loop/SKILL.md:20`, `.skilled/skills/system-deep-loop/graph-metadata.json`

## Findings

### P0 Findings

(none)

### P1 Findings

(none)

### P2 Findings

1. **REQ-047's "both copies serve no run row for an ask that names no single mode" does not hold on a routed single-target route** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1747` -- `routedLoopMode` keeps the routed mode when the ask names that mode, otherwise serves the mode the ask names, otherwise falls back to `routedMode` (`:1753`, `return askedLoopMode(cues, commands) ?? routedMode`). So an ask that names no mode at all still carries the routed mode's command on a routed single-target route. The Python gate reads the same ask and drops every run row unless the ask names that exact mode (`skill_advisor.py:5848`, `if not typed_here and command.rsplit(":", 1)[-1] != asked_mode: continue`), so the two copies disagree on the same prompt. Verified by direct call: `"run a deep loop on the cache layer"`, `"run two deep loops on the cache layer"` and `"run 5 iterations of research and review on the parser"` each return `/deep:review` or `/deep:research` from `attachCommand` on a routed single route, and each keeps no run row from `_apply_deep_loop_offer_gate`. The shared fixture's `servedRun` column pins only the deferred route (`tests/deep-loop-offer-cases.vitest.ts:328`, `{ action: 'defer' }`), and the fixture comment says the column is "the native deferred route", so no test exercises this branch for the `"none"` rows.
   Finding class: class-of-bug (one served rule, two implementations).
   Scope proof: the gate and the fixture are in `review-scope-files.txt`; the probe calls and the fixture test line are cited.
   Affected surface hints: `command-attach.ts` `routedLoopMode`/`servedMode`; `skill_advisor.py` `_apply_deep_loop_offer_gate` mode-equality line; the fixture's `servedRun` rows and the `served run` test; REQ-042's routed-mode rule and REQ-047's "both copies" clause.
   Case: on a routed single-target route, "run a deep loop on the cache layer" carries `/deep:review` (or `/deep:research`, whichever the router picked) instead of no command.

## Traceability Checks

- `spec_code` (core): **fail**. All 59 REQs were mapped. 57 hold; REQ-016 is contradicted by R1-P1-001 and REQ-047 by R4-P2-001; REQ-022 and REQ-034 are marked `checked in iteration 6` because their evidence is the changelog and the closure records. Evidence: `command-attach.ts:1213` (`asksForLoopRun`), `:1727` (`deferredLoopCommand`), `:1747` (`routedLoopMode`), `explicit.ts:454` (`passesAsked`), `fusion.ts:1061` (`DOCTOR_NAMING_LED`), `command-attach.ts:313` (`trackedCommandForOwner`), `reduce-state.cjs:1014` (`refinesSameLocation`), `:2392` (`splitRuledOutEntry`), `command-prompts.jsonl` rows for REQ-012, `deep-research.yaml:663` and the four command asset files for REQ-009, the presentation files for REQ-005 and REQ-010, `hub-router.json:34` and `ROUTER.md:63` for REQ-011.
- `checklist_evidence` (core): not run this iteration; iteration 5 owns it.

### REQ map (condensed)

| REQs | Result | Evidence |
|------|--------|----------|
| 001-004 | hold as recorded; not re-executed | `command-attach.ts:1213`; `scratch/probes/results-after.json` rows AC-001 to AC-005 quote |
| 005 | holds | `deep-research-presentation.txt` and `deep-review-presentation.txt` "Offer From an Advisor Brief"; `research.md`/`review.md` step 0 |
| 006 | holds as recorded | fixture 368 cases, guards file, both suites; `dist` freshness recorded |
| 007 | holds | `rg -c 'ASK with SINGLE prompt'` on compiled contracts prints nothing; mirror and reference scripts are outside the review scope |
| 008 | holds | `explicit.ts:454` (`passesAsked`) |
| 009 | holds | `deep-research.yaml:663`, `deep-review.yaml:2530`, both Next Steps tables, both `next_steps` lists |
| 010 | holds | both presentation files step 6 and the two recommended options |
| 011 | holds | `hub-router.json:34`, `ROUTER.md:63`, `deep-research/SKILL.md`, `deep-review/SKILL.md`, `quick-reference.md`, `SKILL.md:20` |
| 012 | holds | corpus rows for N7, N9, V7, H6, A3 are `near-miss`; D1 is a plain doctor row |
| 013 | waived by ADR-009 | decision-record ADR-009; three `-04` holdout rows |
| 014 | holds | N9 reads as a past-run read in both copies |
| 015, 017-021 | hold | fixture rows; 0 divergences across 368 fixture prompts and 72 hand-built ones |
| 016 | **contradicted** | R1-P1-001 |
| 022 | checked in iteration 6 | changelog row 759 |
| 023-031 | hold | fixture rows, guard cases, `command-attach.ts:313`, `:1061` of `fusion.ts` |
| 032 | holds | `reduce-state.cjs:1014` |
| 033 | open by design | AC-040 is this run; recorded, not judged here |
| 034 | checked in iteration 6 | closure docs |
| 035-046 | hold | fixture rows, `explicit.ts`, `advisor-recommend.ts:363`, `reduce-state.cjs:2381`, `:2451` |
| 047 | **partly contradicted** | R4-P2-001 |
| 048-052 | hold | `reduce-state.cjs:2451`, `:227`; fixture rows |
| 053 | holds | `fusion.ts:27`, `:1064` reads `DEEP_LOOP_DOCTOR_COMMAND` |
| 054-059 | hold | fixture rows, `command-attach.ts:1285`, `:917`, `deep-loop-offer-cases.vitest.ts:717`, `skill-advisor-brief.ts:580`, `reduce-state.cjs:2392` |

## Integration Evidence

- REQ-042's routed rule is read by the served head through `enrichCompiledRoutes` (`handlers/advisor-recommend.ts:363`) and by no other caller; the Python fallback has no route layer, which is why the two copies implement the mode rule at different layers.
- REQ-012's corpus rows are the `near-miss` rows in `scripts/routing-accuracy/command-prompts.jsonl`, read by the capture script outside the review scope.
- REQ-009's YAML rows are the `next_steps` lists at `deep-research.yaml:2265` and `deep-review.yaml:2530`.

## Edge Cases

- REQ-033 (AC-040) is the review run itself, so it cannot be judged from inside this lineage; it is recorded as `open by design` and left to the orchestrator.
- REQ-007's mirror and reference checks are scripts outside `review-scope-files.txt`; their recorded output is the only evidence available inside the write bounds.
- REQ-013's blind-writer clause is waived by ADR-009 because the lane reports were never kept; the replacement check (three fresh holdout rows) is what was read.
- The routed-branch gap (R4-P2-001) is reachable only when the compiled router returns a single-target route for an ask whose mode the cue vocabulary does not name; the three fixture prompts route deferred in the observed run.

## Confirmed-Clean Surfaces

- The drift guard's four surfaces agree: `MODE_COMMANDS`, `MODE_CUES`, `MODE_CUE_WORDS` and `hub-router.json` key the same two modes (`deep-loop-offer-cases.vitest.ts:772`).
- The doctor name has one declaration and the scorer builds its naming pattern from it (`command-attach.ts:202`, `fusion.ts:1064`).
- Both child paths read one owner check (`command-attach.ts:313`), and the CLI and hook brief call it.
- The reducer's three thirteenth-round behaviors hold: `refinesSameLocation` keeps another file's refinement separate, `splitRuledOutEntry` projects a reason, and `stripReviewVerdict` ends Next Focus before the verdict.

## Ruled Out

- "The REQ sweep finds more code contradictions" -- not supported: 57 of 59 REQs map to a present implementation or a recorded decision, and the two contradictions are the two findings above.
- "REQ-012's near-miss rows are missing" -- ruled out: the five prompts are `near-miss` rows and D1 is a plain doctor row in `command-prompts.jsonl`.
- "REQ-050's negated refusal is regressed" -- ruled out: both copies serve the run on "do not skip the deep review, run it properly" and withhold it on "skip the deep review".

## Next Focus

Dimension: traceability
Focus area: `checklist_evidence` -- every ticked task in `tasks.md` and every `Met` row in `acceptance-criteria.md` against evidence that exists in the tree, with the thirteenth round (T115 to T122) first, plus the `Unmet` AC-040 and the open T084.
Reason: the second core protocol is still unfinished, and the closure counts are where the last four rounds found drift.
Required evidence: one `traceabilityChecks.results[]` entry for `checklist_evidence`, a per-round check of the ticked tasks, and `path:line` for every count that is contested.

Review verdict: CONDITIONAL
