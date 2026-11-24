# Iteration 005 - Correctness (second pass: deferred route and stage-one rule)

## Dispatcher
- Lineage opus-medium-3, inline executor. steer.md: not present. Final iteration (5 of 5, stopPolicy max-iterations).

## Dimension
correctness, cross-cutting second pass. Review focus applied: how the deferred and clarify path of the offer gate (`deferredLoopCommand`, `MODE_CUES`, `NAMED_LOOP_MODE`) resolves a mode, and how the stage-one loop rule in `explicit.ts` that feeds the gate reads loop wording.

## Files Reviewed
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:378-389, 894-924`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:10, 442-466`

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **The review mode cue misses the -ing form of the defect-check verbs that its comment says it covers** -- .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:384 -- The comment over `MODE_CUES` says "The -ing form carries the cue too, as in 'a deep loop reviewing the session store'" (`command-attach.ts:385`). `review(?:ing)?` and `audit(?:ing)?` take it. `DEFECT_CHECK`, which the review cue includes, matches only `check|inspect|scan|examine`. Probe on a deferred route: `run a deep loop checking the parser for bugs` returns no command (`asks=true`, `attach=undefined`), while `run a deep loop: look into the flaky tests` resolves to `/deep:research`. The failure withholds the offer rather than giving a wrong one.
   Finding class: vocabulary gap against the documented rule.
   Scope proof: in declared scope.
   Affected surface hints: DEFECT_CHECK verbs (checking, inspecting, scanning, examining); the Python mirror of the mode cue, if it has one; a deep-loop-offer-cases.json row.
   Case: the reader asks "run a deep loop checking the parser for bugs" and gets no deep command.
2. **The stage-one loop rule reads raw loop wording, without the gate's subject and refusal exceptions, and penalizes sk-code on it** -- .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:449 -- `passesAsked` is `MULTI_PASS || LOOP_COUNT || ITERATIVE_ASK` tested directly. The gate's `hasLoopAsk` skips a phrase that is refused or that names the subject (`command-attach.ts:616-624`), and this rule does not. When `review` is also present it adds 0.85 to the hub and -0.6 to sk-code (`explicit.ts:457-465`). REQ-019's subject prompt "several passes of the linter failed, review the config" matches `MULTI_PASS` and `review`. [INFERENCE: it gets the boost and the sk-code penalty, so the top row can become the hub with no command where a single-pass config review was asked for. The full scorer was not run in this lineage.]
   Finding class: lane and gate disagree on what counts as a loop ask.
   Scope proof: explicit.ts is in declared scope.
   Affected surface hints: explicit.ts passesAsked; the 69-probe set has no subject-prompt top-skill check.
   Case: "several passes of the linter failed, review the config" may top system-deep-loop with no command instead of sk-code.
   Downgrade trigger: drop this finding if a scorer run shows sk-code still tops that prompt.

## Traceability Checks
- spec_code (pass): the spec's edge case ("a prompt that names both research and review cues does not resolve a deferred route") holds. `iteratively investigate the cache, then review it` and `run 5 iterations reviewing the research paper` both withhold. `run 5 research iterations on review tooling` resolves through `NAMED_LOOP_MODE` to `/deep:research`, as `command-attach.ts:921-924` documents.

## Edge Cases
- Case folding: `Run 8 more Review Iterations` and `DEEP REVIEW the parser` resolve the same as their lower-case forms.
- A deferred loop ask with no mode cue (`run 4 iterations on the auth module`) withholds by design.

## Confirmed-Clean Surfaces
- `deferredLoopCommand` applies `asksForLoopRun`, `isNoEditRequest` and `commandOnlyMentioned` (`command-attach.ts:906, 918`), the same guards as the routed path.

## Ruled Out
- Case sensitivity in mode-cue resolution: probes in mixed case resolve the same as lower case.

## Next Focus
- Max iterations reached. Synthesis next.

Review verdict: CONDITIONAL
