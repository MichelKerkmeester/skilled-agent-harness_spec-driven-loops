# Iteration 3: Cross-CLI usefulness and the one change worth building

## Focus

KQ3. Which residual limits still make the advisor less useful across the CLIs, and which change is worth building next with its files, measured gain and proof check. The candidates came from iterations 1 and 2: the OpenCode delivery gap, the Claude start-row gap, the OpenCode request-flags parity question, the turn cap and the Codex approval. Each was measured before it was ranked; anything that could not be measured is labelled a hypothesis.

## Actions Taken

- Wrote `scratch/cli-parity.mjs` and ran it over the 44 typed corpus rows, asking the live CLI three ways: the hook's options (`includeCompiledRoute` and `compiledRouteTopOnly` true, 0.8/0.35), the OpenCode plugin's options (neither flag), and the plugin's options plus `surfaceHint: "opencode"`. Compared top skill, command, policy and ambiguity per row.
- Re-aggregated the final arm's `offered`, `cappedOfferRows`, `startedOfOffered` and `byPolicy` fields into a judgeable-offer conversion per runtime.
- Read the final arm's start-policy rows to see which commands carry that policy.
- Read `.opencode/plugins/system-skill-advisor.js` (`advisorCliRequest` and `observeEmittedAdvisorBlock`) and `command-offer.mjs` (`briefDelivered`) for the files a delivery marker would touch.

Measured output, parity command:

```
{"rows":44,"differsNoHint":0,"differsHint":0,"commandDiffNoHint":[],"commandDiffHint":[],"policyDiffNoHint":[],"policyDiffHint":[],"skillDiffNoHint":[],"skillDiffHint":[],"hookCommandRows":44,"pluginCommandRows":44,"hintedCommandRows":44}
```

## Findings

1. Cross-CLI usefulness, measured as commands started over offers that were not capped: Claude 5 of 14 (35.7 percent), Devin 10 of 11 (90.9), DSH 11 of 13 (84.6), Pi 7 of 14 (50.0), OpenCode 3 of 8 (37.5). The spread is 55 points between Devin and Claude; it is not a delivery gap, because all four of the non-OpenCode runtimes carried a proven brief. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements/scratch/summary-final-after.json]

2. Every start-policy offer in the final arm is a `/create:*` command: `cmd-create-agent-plain-tune-02`, `cmd-create-benchmark-plain-tune-01`, `cmd-create-command-plain-tune-01`, `cmd-create-diff-plain-tune-01`, `cmd-create-feature-catalog-plain-tune-01`, `cmd-create-goal-plain-tune-01` and `cmd-create-manual-testing-playbook-plain-tune-01`. Claude started 2 of its 8 start rows while Devin started 7 of 8 and DSH 6 of 8, so the Claude `create` collapse already waiting on the operator as segment-three rank 7 now has a measured start-side cost, not only a visibility count. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-final.jsonl] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:124]

3. OpenCode's brief content has parity with the hook over the whole measured typed corpus, not only the nine probes: 0 of 44 rows differ in top skill, command, policy or ambiguity, with or without the plugin's `surfaceHint`. The plugin request omits `includeCompiledRoute` and `compiledRouteTopOnly`, and that omission changes nothing on this corpus, because the CLI attaches the command anyway. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/residual-limits-4/scratch/cli-parity.json] [SOURCE: .opencode/plugins/system-skill-advisor.js:866]

4. The one measured build left is an OpenCode delivery marker. The plugin already computes the emitted block in `observeEmittedAdvisorBlock`; writing a bounded, prompt-free receipt (session id, block hash, runtime, epoch) beside the health records and teaching `briefDelivered` an `opencode` branch would move 24 of 24 OpenCode rows from `deliveryUnknown` to a boolean, raising cross-CLI delivery coverage from 4 of 6 runtimes to 5 of 6. The gain is measurement completeness, not model-visible bytes. [SOURCE: .opencode/plugins/system-skill-advisor.js:975] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:220] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-final.jsonl]

5. Codex remains the only reader-facing absence on the six-runtime surface: 0 of 24 rows received a brief because the hooks are unapproved, and no code change in this lane can change that. It is the single largest user-visible gap and it stays on the operator. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:135] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl]

6. Three candidates are hypotheses with no measurement and are not recommended: a more directive head to lift Claude's start rate (no arm may run), a higher OpenCode turn cap (a harness setting, not advisor code), and a tie-break line on ambiguous prompts (9 probe heads, no command expected on 1 of 9, so the expected gain is at most 1 row). [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements/scratch/render-entries-after.json]

## Recommendation Table

| Disposition | Change | Files | Measured gain | Check that proves it |
|---|---|---|---|---|
| Build | OpenCode delivery receipt | `.opencode/plugins/system-skill-advisor.js` (after `observeEmittedAdvisorBlock`), `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs` (`briefDelivered`), `.opencode/plugins/tests/system-skill-advisor.test.cjs`, `.skilled/skills/system-skill-advisor/runtime/tests/command-offer.vitest.ts` | 24 of 24 OpenCode rows move from `deliveryUnknown` to true; delivery coverage 4 of 6 runtimes to 5 of 6 | Re-score the 24 committed OpenCode lines: `deliveryUnknown` 24 to 0; plugin and command-offer tests pass; floors stay 24 of 44, 0 of 35 and `[160,50,21,5]` |
| Wait on operator | Codex hook approval | arena/home Codex config, not this repo | 0 of 24 to measurable | One approved Codex smoke row and one re-scored line |
| Decline | Pass `includeCompiledRoute` and `compiledRouteTopOnly` from the plugin | `.opencode/plugins/system-skill-advisor.js` | 0 of 44 rows change | The parity probe already measured 0 of 44 |
| Decline | Remove the head's status, scores and `pass` | `runtime/lib/render.ts` | At most 30 of 306 bytes (9.8 percent) and loses freshness | Segment three's head-cut test fails |
| Hypothesis | A more directive head for Claude start rows | `runtime/lib/render.ts` | UNKNOWN, needs a live arm | One arm on the seven `/create:*` rows |
| Hypothesis | A tie-break line for ambiguous prompts | `runtime/lib/render.ts` | At most 1 of 9 probe rows | One live head |

## Ruled Out

- A plugin request-flag change: 0 of 44 typed rows differ, so the flags buy nothing on the measured corpus.
- Re-ranking the OpenCode turn cap as an advisor fix: it is the arena's cap and lands in the runner, not in the brief.
- Re-opening rank 6 (in-process degraded scorer) or rank 10 (intent signals): separate segment-four lanes own them.

## Dead Ends

- Comparing rendered heads from the plugin itself: the plugin's renderer is the same shared renderer, so the CLI answer is the only place a difference could enter, and the probe found none.
- Using the final arm's `startedOfOffered` without removing capped rows: it mixes a model choice with a harness stop, so the judgeable denominator was rebuilt.

## Edge Cases

- Ambiguous input: none. The lane names cross-CLI usefulness.
- Contradictory evidence: the goal log records that OpenCode quotes the brief in 10 runs, while the scorer marks all 24 rows delivery-unknown. Both are true: the model quoting the head is evidence a reader saw it, while the session store has no injectable record; the marker recommendation closes that gap rather than picking one.
- Missing dependencies: Codex has no run line in the scored five-runtime file, so its 0 of 24 is cited from the goal log and the six-runtime raw file.
- Partial success: none.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/residual-limits-4/scratch/cli-parity.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-final.jsonl`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements/scratch/summary-final-after.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements/scratch/render-entries-after.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md`
- `.opencode/plugins/system-skill-advisor.js`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs`

## Assessment

- New information ratio: 0.83
- Questions addressed: KQ3
- Questions answered: KQ3

## Reflection

- What worked and why: asking the CLI three ways isolated the plugin's missing flags from every other difference and turned a plausible parity worry into a measured zero.
- What did not work and why: the final arm cannot say which of Claude's two started create rows ran, because the run log stores the offer, not the start, so the start-side claim is bounded to a count.
- What I would do differently: capture the per-row `started` flag in the same file as `offeredPolicy` next time, so the create-specific start rate is read without the summary's aggregate.

## Recommended Next Focus

A fourth iteration should verify the one build's check without writing code: re-score the committed OpenCode lines with a stub marker to prove the `deliveryUnknown` 24 to 0 movement is reachable, and confirm the floors are untouched by the measurement-only change.
