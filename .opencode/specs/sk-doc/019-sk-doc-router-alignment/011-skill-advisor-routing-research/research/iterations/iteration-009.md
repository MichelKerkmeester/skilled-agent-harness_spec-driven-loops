# Iteration 9: Result ambiguity versus executor attribution

## Focus

Explain why a result can remain `ambiguous: true` while its leading executor recommendation has no `ambiguousWith` attribution, and bound the repair without modifying the advisor.

## Actions Taken

1. Re-read the append-only state, reducer-owned strategy, iteration 8 calibration evidence, and the deep-research iteration contract.
2. Traced the shared ambiguity cluster predicate and the point where `ambiguousWith` is attached.
3. Traced fusion finalization through thresholding, ambiguity attribution, abstention gates, the executor-delegation override, and the final result projection.
4. Cross-checked executor-delegation fixtures and scorer tests to distinguish a general ambiguity defect from an executor-only ordering defect.

## Findings

### 1. The two outputs are computed from different snapshots

`applyAmbiguity(ranked)` attaches `ambiguousWith` before executor delegation runs. The executor override then mutates the ranked list, after which `isAmbiguousTopTwo(ranked)` recomputes only the result-level boolean. Therefore the boolean describes the post-override list while each recommendation's attribution can still describe the pre-override list. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:759-770] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:839-868]

The shared ambiguity module is internally consistent when both APIs receive the same list: `isAmbiguousTopTwo` and `applyAmbiguity` call the same `ambiguousCluster` function. The defect is the intervening mutation, not the dual score/confidence margin itself. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts:22-57]

### 2. Executor injection creates the clearest mismatch

When the resolved executor was not a fusion candidate, `synthesizeExecutorRecommendation` creates it without `ambiguousWith`, gives it the prior maximum score, and prepends it. The previous top can remain a passing candidate with that same score. The final dual-margin predicate therefore sees a score tie and returns `ambiguous: true`, but no post-override `applyAmbiguity` call ever annotates the synthetic leader. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:411-432] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:464-498] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts:25-41]

This is especially likely in the orchestrator-cue fixtures, where the harder phrasing may not surface the executor in the original candidate set and the override explicitly supports injection-if-absent. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/executor-delegation-cases.json:42-50] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:488-495]

### 3. Reordering an existing executor can leave two kinds of stale state

If the executor already exists, the override can raise its confidence, lower its uncertainty, change `passes_threshold`, and move it to index zero while preserving whatever `ambiguousWith` it had before. For the code-hub runner-up, the override caps confidence but does not recompute `passes_threshold`; it also leaves score unchanged. Because `ambiguousCluster` filters on `passes_threshold` and accepts either a score or confidence gap within the margin, a candidate can remain eligible for the final ambiguity calculation under stale threshold state. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:467-485] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts:25-34]

The code comment says the cap prevents the code hub from outranking or tying the executor, but the ambiguity contract is score-or-confidence and the cap touches confidence only. That comment and the executable ambiguity semantics are not currently equivalent. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:480-484] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts:28-34]

### 4. One finalization boundary should own all derived fields

The repair should establish this invariant: after every ranking mutation, recompute threshold eligibility, clear and rebuild `ambiguousWith`, and derive `result.ambiguous` from that same final cluster. Two implementation shapes are viable:

- Move the executor override before final threshold and ambiguity finalization. This is structurally cleaner because confidence, uncertainty, ordering, and injection settle before derived fields are computed.
- Keep the override late, then run one explicit finalizer that recalculates `passes_threshold`, removes stale `ambiguousWith`, reapplies ambiguity, and returns both the annotated list and boolean from one cluster result.

The first option better matches the comments that executor delegation is an authoritative disambiguation. Whichever shape is chosen, the implementation must decide whether a resolved executor intentionally suppresses underlying fusion ambiguity or merely becomes the leading member of a newly attributed cluster. Current comments favor suppression, while current result semantics preserve the warning. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:839-849] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:435-439]

### 5. The missing regression is an output-coherence assertion

Existing ambiguity tests validate the cluster helper, and executor tests validate routing decisions and top-1 outcomes. The combined boundary needs cases for both executor injection and existing-candidate reordering, asserting:

- `result.ambiguous === ((result.recommendations[0]?.ambiguousWith?.length ?? 0) > 0)` when the top is visible;
- every recommendation's `passes_threshold` matches its final confidence and uncertainty;
- no recommendation retains an `ambiguousWith` skill outside the final passing cluster;
- authoritative executor resolution has an explicit expected ambiguity policy.

[SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts:72-99] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/scorer/executor-delegation.vitest.ts:121-170]

## Questions Answered

- The mismatch occurs because local attribution is computed before the executor override, while result ambiguity is recomputed after it.
- Both injection and reordering can trigger it; injection is deterministic when the synthetic executor ties the prior maximum score.
- The most robust repair is one post-mutation finalization boundary for threshold eligibility and both ambiguity surfaces.

## Questions Remaining

- Should an authoritative executor alias suppress fusion ambiguity, or should it expose the displaced fusion candidate in a final `ambiguousWith` cluster? Current comments imply suppression, but this needs an explicit contract.
- How many frozen executor-delegation cases take the injection path versus the existing-candidate path?
- The shadow `0.80` task-intent floor experiment and probability-calibration bins remain separate follow-up work.

## Next Focus

Use iteration 10 to quantify injection versus reordering across the frozen executor-delegation cases, select the explicit executor-ambiguity contract, and fold the result into the final prioritized advisor improvement plan.

## Ruled-Out Directions

- Changing the `0.05` margins: both ambiguity outputs agree when evaluated on the same list.
- Treating the symptom as floating-point drift: the mismatch follows a deterministic post-attribution mutation.
- Fixing only the serializer or handler: the inconsistent fields already coexist in the scorer result before handler projection.

## Assessment

- `newInfoRatio`: 0.66
- Novelty justification: this iteration isolated the post-attribution mutation, identified stale threshold eligibility as a second derived-state defect, and produced a testable finalization invariant.
- Confidence: high for the ordering cause from direct source evidence; medium for the preferred suppression semantics until the executor contract is explicitly chosen.

