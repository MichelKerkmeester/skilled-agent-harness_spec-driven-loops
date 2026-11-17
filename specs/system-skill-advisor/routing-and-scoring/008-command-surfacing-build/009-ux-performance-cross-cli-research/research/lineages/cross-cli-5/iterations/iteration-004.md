# Iteration 4: What the missing OpenCode reader actually costs, and the rank order

## Focus

Question (e). The lane now has a mechanism for each gap. This iteration prices the gaps, because the ranking has to rest on what a fix would move rather than on what it would clarify. It found that the delivery column does more than report: it decides whether an offer can be counted as reached at all.

## Actions Taken

1. Read the offer-reached rule in the tally.
2. Compared `offerReached` off and on across the five runtimes.
3. Recomputed each runtime's start-rate interval from the arm's own counts.
4. Compared `cappedStartRows` across runtimes to price the cap's measurement cost.

## Findings

1. A delivery `unknown` is counted as an offer that reached the model. The tally excludes an offer only when delivery is exactly `false`; every other value, including `unknown`, increments `offerReached`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2351-2353]

2. That rule erases OpenCode's off-arm counterfactual while the four reader runtimes keep theirs. `offerReached` off to on reads claude 0 of 5 to 5 of 5, pi 0 of 5 to 5 of 5, devin 0 of 5 to 5 of 5, dsh 0 of 5 to 5 of 5, and opencode 5 of 5 to 5 of 5. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json] So the cost of the missing OpenCode reader is not a blank on the on arm: it is that five off-arm offers are credited as reached when the brief could not have arrived through a plugin that was switched off, which is the exact comparison the arm exists to make.

3. No per-runtime start-rate delta is separable at these arm sizes. Recomputing the Wilson interval the scorer itself uses [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2194-2205] over each runtime's printed counts gives claude 0.04 to 0.38 against 0.07 to 0.45, opencode 0.03 to 0.51 against 0.11 to 0.60, pi 0.08 to 0.48 against 0.20 to 0.64, devin 0.05 to 0.48 against 0.25 to 0.75 and dsh 0.20 to 0.64 against 0.42 to 0.85. [INFERENCE: computed from the startRate counts in summary-arm.json] Every pair overlaps, so no runtime's start gain can be attributed to the brief from this arm, and a rank ordered by claimed start gain would be unfounded.

4. The turn cap costs measurement space unevenly, and mostly on OpenCode. `cappedStartRows` reads 8 of 15 off and 5 of 15 on for opencode, 4 and 3 for devin, 1 and 0 for pi, and 0 in both arms for claude and dsh. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json] OpenCode's printed start rate therefore rests on 7 and 10 judgeable rows, which is why its interval is the widest of the five.

5. Ranked by measurement restored per unit of floor risk, the cross-CLI gaps order: (1) the OpenCode receipt plus the reader branch, which restores the off-arm counterfactual on 5 offered rows and answers 80 delivery rows with no scoring input touched; (2) the Codex arm unlock, which adds a whole runtime but is blocked on the operator's `/hooks` approval rather than on code; (3) the ask-representation widening, which would affect 1 of 280 runs and changes a measure rather than a product, so it also rewrites prior arms' numbers; (4) the devin and dsh `offerUnknown` rows, one each, which cannot move a rate over 28. [INFERENCE: from the counts in findings 1 to 4 and the file inventory in iteration 2]

## Ruled Out

- Ranking by claimed start gain. No pair of per-runtime intervals separates, so the gain column cannot carry a rank.
- Treating the OpenCode receipt as a delivery-only improvement. It also changes which offers count as reached, because the tally reads the same field.

## Dead Ends

- Trying to recover a per-runtime brief effect from the `byPolicy` blocks. Five ask rows and ten start rows per runtime per arm leave nothing separable once the capped rows are removed.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: the arm summary's `offerReached` and the arm-evidence `limit:` line describe the same OpenCode weakness in different words; both are recorded and neither overrides the other.
- Missing dependencies: no fresh arm can be run from here (research only, no arena), so every gain figure is a projection from existing rows and is marked as such.
- Partial success: the ranking is complete for the cross-CLI lane; its first item's gain is stated as measurement restored, not as commands started, because the latter is not measurable at this size.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2351-2353`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2194-2205`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/arm-evidence.txt`

## Assessment

- New information ratio: 0.65
- Questions addressed: (e)
- Questions answered: (e)

## Reflection

- What worked and why: reading the offer-reached rule turned a reporting gap into a counterfactual gap. Before it, OpenCode's unknown looked like one blank column; after it, the unknown is shown to inflate the off arm's offer count to the on arm's level, which is a defect in the comparison rather than in a single cell.
- What did not work and why: the first draft of the rank used each runtime's start-rate delta as its gain column. Recomputing the intervals showed all five pairs overlap, so the rank had to be rebuilt on measurement restored instead, which is what the evidence supports.
- What I would do differently: compute the intervals before writing any per-runtime comparison. A printed rate with no interval invites a rank that the arm cannot support.

## Recommended Next Focus

Verify the top-ranked item at file level: confirm the exact insertion point in the OpenCode plugin, whether the plugin already records anything a receipt could reuse, and whether a prompt-free receipt would survive the plugin's own emit path. The confirming check has to name what prints differently in the next arm.
