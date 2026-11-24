# Iteration 004 - Maintainability

## Dispatcher
- Lineage opus-medium-2, iteration 4 of 5, dimension maintainability. steer.md: not present.
- Review focus coverage: the duplicated deep-loop offer gate (command-attach.ts and the skill_advisor.py copy) was differential-tested beyond the shared fixture, the parity tests were read for what layer each one pins, and the gate's comments were checked for ephemeral labels. The typed-command hint path from packet 013 was checked for test coverage at the layer that applies it.

## Files Reviewed
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (gate exports `asksForLoopRun`, `isStuckRunComplaint`, `isWritingAboutTopic`, `commandOnlyMentioned`, `typedCommandIn`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4463-4870`, `:2386-2400`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:2`, `:121`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:40-57`
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2857-2876`
- `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-typed-command.vitest.ts:49-82` (context, outside the scope file)

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **The typed-command parity column is pinned at different layers in the two suites, and no test covers a deep-loop typed command at the layer that serves it** -- .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:57 -- The fixture defines `typedReviewKept` as "attachCommand on a single review route in TypeScript, and the run row in the Python gate" (deep-loop-offer-cases.json:2). The Python gate already folds the typed command into its row decision (skill_advisor.py:4832-4858), while TypeScript applies the typed command one step later in `attachTypedCommand` (advisor-recommend.ts:428-448). The handler test for that step covers `/speckit:resume` and `/create:goal` only (advisor-recommend-typed-command.vitest.ts:49-82) and has no deep-loop, stuck-run or refusal case. The suites therefore compare a Python decision with a TypeScript intermediate, which is how R1-P1-001 passes both suites; any later change to `typedCommandForTop` can move the served output away from Python with both suites green.
   Finding class: maintainability
   Scope proof: deep-loop-offer-cases.vitest.ts and the fixture are in the review scope; the handler test is cited as context only.
   Affected surface hints: deep-loop-offer-cases.vitest.ts, advisor-recommend-typed-command.vitest.ts, typedCommandForTop
   Case: change typedCommandForTop so a typed /deep:review is returned for a stuck-run prompt; both suites stay green.

## Traceability Checks
- spec_code (pass, REQ-021 predicate parity): a differential run of 663 prompts (the 120 fixture prompts plus 15 adjacent prompts, each in six variants: as-is, upper case, curly apostrophe, "please " prefix, trailing "?", doubled spaces) through `asksForLoopRun`, `isStuckRunComplaint`, `isWritingAboutTopic`, `commandOnlyMentioned('/deep:review')` and the `/deep:*` part of `typedCommandIn` against the Python counterparts showed 0 drift.

## Integration Evidence
- Python run-row ids `command-spec-kit-deep-research` and `command-spec-kit-deep-review` (skill_advisor.py:2386-2400, :4630-4633) are the only deep run ids the fallback emits; `command-deep-*` appears only as `inventory_id`, so the Python gate's row map is complete.

## Edge Cases
- Doubled spaces break the literal `deep review` phrase in both copies alike (no ask), which errs toward no offer; recorded, not a finding.

## Confirmed-Clean Surfaces
- Comment hygiene: no REQ, ADR, AC, packet or spec-path labels in the gate code or the in-scope tests.
- TS/Python predicate parity beyond the fixture (0 drift over 663 prompts).

## Ruled Out
- Hidden drift between the two regex copies on case, apostrophe, punctuation or spacing variants.

## Next Focus
- Dimension: correctness (cross-reference pass, all four dimensions covered)
- Focus area: the deferred-route mode-cue path (`deferredLoopCommand`, `NAMED_LOOP_MODE`, `MODE_CUES`) and the stage-one scorer rule in explicit.ts, which iterations 1-4 did not exercise.
- Reason: broaden angles under max-iterations stop policy.
- Rotation status: 4 of 4 dimensions done; iteration 5 is a cross-reference pass.
- Required evidence: executed deferred-route outputs on mixed-cue prompts.

Review verdict: CONDITIONAL
