# Deep Review Iteration 006

## Dispatcher
- Run: `016-skill-advisor-tuning-deep-review-auto`
- target_agent: `deep-review`
- resolved_route: `/deep:review:auto -> .opencode/agents/deep-review.md`
- agent_definition_loaded: true
- mode: `review`
- Budget profile: `scan`
- Focus: Ranked angle 6 — Executor-delegation override correctness under composition
- Dimension: correctness

## Files Reviewed
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/_review-charter.md`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/005-executor-delegation-resolver/spec.md`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/005-executor-delegation-resolver/implementation-summary.md`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/types.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/executor-delegation.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/executor-delegation-cases.json`

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Executor-delegation tests assert only top-1, leaving synthesized recommendation metadata unpinned** -- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:336` -- The synthesized executor path is the highest-risk composition branch because it creates a recommendation when the executor was absent from the original ranked list. That object uses fixed route metadata (`confidence: 0.95`, `uncertainty: 0.2`), copies the prior `topScore`, and emits empty attribution (`laneContributions: []`, `dominantLane: null`) [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:336`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:345`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:349`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:354`]. The fixture and tests cover the routing result, branch presence, and TS/Python top-1 parity [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/executor-delegation-cases.json:41`; `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/executor-delegation.vitest.ts:181`; `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/executor-delegation.vitest.ts:190`; `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/executor-delegation.vitest.ts:201`], but they do not pin the metadata contract of injected recommendations. This is not an active P1 because top-1 routing is directly tested and the score shape conforms to `AdvisorScoredRecommendation`, but it leaves future changes free to drift the attribution/score semantics that downstream explainability and diagnostics may display.
   - Finding class: test-isolation
   - Scope proof: Read the synthesized path, post-fusion integration, type contract, and all executor-delegation tests/fixtures. Coverage pins branch/top-1 behavior but not `laneContributions`, `dominantLane`, `score`, or fixed confidence/uncertainty fields on injected executor recommendations.
   - Affected surface hints: `["executor-delegation override", "scoreAdvisorPrompt recommendations", "advisor attribution/explainability", "delegation fixture coverage"]`
   - Recommendation: Add one focused fixture/test that forces injection-if-absent and asserts the returned top recommendation's metadata (`reason` includes delegation evidence, `score` policy, `laneContributions`/`dominantLane`, confidence/uncertainty and threshold status) so future changes cannot silently alter the composed output contract.

## Traceability Checks
- Confirmed ranked charter angle 6 is the active focus [SOURCE: `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/_review-charter.md:13`].
- Confirmed the override runs after ambiguity/Class-C abstention gates [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:807`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:843`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:878`].
- Confirmed functional top-1 fixture coverage exists for 11 cases and TS/Python parity [SOURCE: `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/005-executor-delegation-resolver/implementation-summary.md:104`].

## Integration Evidence
- Exact integration surfaces reviewed: `/deep:review:auto` route proof in config/state, `applyExecutorDelegationOverride`, `scoreAdvisorPrompt`, `executor-delegation.vitest.ts`, and `executor-delegation-cases.json`.

## Edge Cases
- Post-abstention execution appears intentional in the implementation comments and is not reported as a defect without a concrete misroute.
- Hardcoded `0.95`/`0.88` values are documented as route-lift/cap constants; no requirement was found that these specific numeric constants must be metadata-derived.

## Confirmed-Clean Surfaces
- No P0/P1 findings were found in angle 6.
- Functional routing coverage exists for direct alias, model alias, orchestrator cue, negative guard, suppressed abstain, and TS/Python parity cases.
- No advisor implementation files were edited.

## Ruled Out
- Ruled out a P1 for post-abstention resurrection: the code explicitly places the override after abstention gates, and the delegation cue is a stronger route instruction than generic breadth abstention on current evidence.
- Ruled out a P1 for synthesized empty attribution because no failing consumer or incorrect route was proven.

## Next Focus
- dimension: correctness
- focus area: RRF sort comparator soundness
- reason: Ranked charter angle 7 follows angle 6.
- rotation status: angle 7 of 10
- blocked/productive carry-forward: Carry P1 findings from angles 1–3 and 5, plus P2 metadata-coverage advisory from angle 6; angle 4 remains clean.
- required evidence: `fusion.ts scoreAdvisorPrompt` sort comparator, exact-semantic rerank window, intent/conflict score adjustments, displayed score/confidence fields.
