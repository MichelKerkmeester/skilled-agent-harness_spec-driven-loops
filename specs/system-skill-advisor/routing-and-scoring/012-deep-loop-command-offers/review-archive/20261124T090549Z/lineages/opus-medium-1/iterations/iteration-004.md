# Iteration 004 — Maintainability

## Dispatcher
- Executor: cli-claude-code (claude-opus-5-5, medium), inline lineage opus-medium-1
- Sources read: steer.md (absent), strategy, registry, iterations 001-003

## Dimension
maintainability: what it costs to change the deep-loop offer gate, which exists twice, once in `command-attach.ts` and once hand-mirrored in `skill_advisor.py`, and how well the drift guards catch a one-sided edit.

## Files Reviewed
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:277-673`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4488-4856`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:68-77`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` (118 cases)
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2860-2906`

## How this iteration addressed the review focus
I ran a differential test: 61 prompts outside the fixture went through the TS gate (`asksForLoopRun`, `isStuckRunComplaint`, `isWritingAboutTopic`, `commandOnlyMentioned`) and the Python copy (`probes/diff.mjs`, `probes/diff.py`). They covered want leads, continue verbs, rounds of a named review, hyphen counts, back-pointing counts, refusals, questions, the writing-about reading and a stuck run. Drift was 0 of 61. Then I checked which regex vocabulary the shared guards can see.

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **The drift guard checks only the three exported phrase lists, so a one-sided edit to the inline regex vocabulary passes both suites** -- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:72` -- The guard requires a fixture run case for each entry in `LOOP_WORDING`, `LOOP_NAMES` and `LOOP_WANT_LEADS`. The rest of the vocabulary is inline regex in both copies, with no such check: `COUNT_WORDS` (`command-attach.ts:335`, mirrored at `skill_advisor.py:4490`), `LOOP_RUN_SYMPTOM`, `LOOP_ARTIFACT_AFTER`, `PAST_RUN_READ_VERB` and `ITERATIVE_VERB`. The fixture holds no case that uses "thirty", "forty", "fifty" or "dozen" (a grep of the fixture for those words prints nothing). So deleting `fifty` from one copy, or adding `sixty` to it, leaves both suites green while the two gates disagree on "run fifty iterations".
   Finding class: incomplete parity guard for hand-mirrored logic
   Scope proof: deep-loop-offer-cases.vitest.ts:72 iterates only the three lists; the fixture grep for thirty|forty|fifty|dozen is empty; skill_advisor.py:4490 spells the count words inline
   Affected surface hints: deep-loop-offer-cases.vitest.ts; deep-loop-offer-cases.json; command-attach.ts COUNT_WORDS / LOOP_RUN_SYMPTOM / LOOP_ARTIFACT_AFTER; skill_advisor.py mirrors
   Case: an edit that adds "sixty" to COUNT_WORDS in command-attach.ts only passes vitest and the Python suite, and "run sixty iterations" then gets the offer from the native advisor and no run row from the fallback.

## Traceability Checks
- spec_code (pass, maintainability slice): REQ-021's "predicate drift 0" holds on a fresh 61-prompt sample (0 drift).
- agent_cross_runtime (notApplicable): no agent files are in scope.
- skill_agent (notApplicable): no skill-to-agent contract is in scope.

## Integration Evidence
- The Python suite reads the same fixture (`test_skill_advisor.py:2860-2870`), so any fixture case pins both gates.

## Edge Cases
- Semantics I noticed but did not report as defects: "do many passes" (no review or research word) reads as a loop ask, and "Skip the deep review on this branch" still asks for the run. The second is a known miss (`implementation-summary.md:239`).

## Confirmed-Clean Surfaces
- Gate parity on 61 out-of-fixture prompts: 0 drift.
- The comments carry the durable WHY and no ephemeral ids, so comment hygiene is clean in the reviewed ranges.

## Ruled Out
- Dead code in the gate: every exported predicate has a caller in attachCommand, deferredLoopCommand or the advisor scorer.

## Next Focus
- Dimension: correctness (second pass, cross-dimension)
- Focus area: deferredLoopCommand mode resolution (NAMED_LOOP_MODE vs MODE_CUES), the routed path's mode choice against the prompt's named mode, and the stage-one rule in explicit.ts
- Reason: all four dimensions covered; the last iteration broadens rather than synthesizing early (stopPolicy=max-iterations)
- Required evidence: probe outputs

Review verdict: PASS
