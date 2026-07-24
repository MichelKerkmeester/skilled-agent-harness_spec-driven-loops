# Iteration 2: Correctness - Per-Hub Routing and Parity Invariants

## Dispatcher
- Target: compiled coverage buildout spec folder
- Session: `fanout-luna-xhigh-1784691838667-iv78vk`
- Route proof: `target_agent=deep-review`, `resolved_route=Resolved route: mode=review target_agent=deep-review`
- Budget profile: scan

## Files Reviewed
- `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:143-260`
- `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/006-sk-design/lib/router.cjs:187-257`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs:390-459, 693-749`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/compiled-routing-parity.vitest.ts:76-113, 214-360`

## Findings - New
### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None.

## Traceability Checks
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | notApplicable | hard | `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/006-sk-design/lib/router.cjs:199-257` | Correctness pass |
| checklist_evidence | notApplicable | hard | `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/compiled-routing-parity.vitest.ts:214-360` | Correctness pass |

## Integration Evidence
- Per-hub compiler construction enumerates composition rules for every non-empty multi-target subset at `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:187-201`.
- The reference router filters near-ties by `ambiguityDelta` before bundle heuristics at `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/006-sk-design/lib/router.cjs:199-210, 243-255`.
- Parity distinguishes route projection mismatches, vacuous serving, resolver breakage, and matching non-route outcomes at `compiled-routing-parity.cjs:452-459, 693-718`.

## Edge Cases
- Tests cover vacuous manifests, resolver-missing, stale manifests, unresolved qualified ids, both-sides-gold-failure parity, and distinct drift rollups.
- The broad compiler search found multiple per-hub variants; this pass verified the reference and canonical compiler plus the shared parity comparator, not every hub line-by-line.

## Confirmed-Clean Surfaces
- A compiled-only unresolved target is classified as resolver-missing rather than silently dropped (`compiled-routing-parity.vitest.ts:296-302`).
- A compiled decision that routes to a different mode remains drift (`compiled-routing-parity.vitest.ts:272-278`).
- A stale manifest is classified as re-mint-required drift (`compiled-routing-parity.vitest.ts:322-332`).

## Ruled Out
- No evidence of a parity guard that collapses all non-route outcomes into a false pass was found; explicit regression tests cover both failure and match cases.

## Next Focus
- dimension: security
- focus area: manifest paths, runtime flag parsing, filesystem reads, and no-specs-read guardrails
- reason: correctness invariants were covered without a new issue; inspect trust boundaries before broader traceability
- rotation status: correctness stabilized for this angle
- blocked/productive carry-forward: productive parity tests; defer broad duplicate compiler reading
- required evidence: path validation, environment parsing, activation-root handling, and tests for invalid or missing state

Review verdict: PASS
