# Iteration 5: Cohort and Runtime Maintainability

## Dispatcher
- Target: compiled routing serving and advisor integration surfaces
- Session: `fanout-luna-xhigh-1784691838667-iv78vk`
- Route proof: `target_agent=deep-review`, `resolved_route=Resolved route: mode=review target_agent=deep-review`
- Budget profile: verify

## Files Reviewed
- `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:29-42`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/011-runtime-engine/lib/resolve.cjs`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/compiled-routing-flag.ts:11-40`
- `.opencode/bin/compiled-route-sync.cjs:1-25,103-137,300-399`
- `.opencode/bin/compiled-routing-foundation.vitest.ts:50-99,165-181`

## Findings - New
### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
#### F004: Default-on cohort is maintained in multiple independently edited sources
- The seven-hub cohort is repeated in the promoted resolver, the authored resolver twin, and the advisor's TypeScript flag module rather than generated from one canonical source.
- `compiled-routing-foundation.vitest.ts:70-74` detects divergence after it occurs, and `compiled-route-sync.cjs` verifies the promoted serving closure, but neither mechanism prevents a source edit from leaving the advisor cohort or authored twin stale.
- Recommendation: derive all copies from one canonical cohort or add a generation/check gate that fails before packaging when any copy differs.
- Finding class: maintainability / synchronization risk.

## Traceability Checks
| Protocol | Status | Evidence |
|----------|--------|----------|
| resolver_lockstep | partial | Authored and promoted resolver copies are verified, but advisor cohort is separately authored |
| cohort_consistency | pass | Foundation test compares advisor and runtime sets exactly |
| serving_boundary | pass | Sync verification asserts no promoted serving reads under `.opencode/specs` |

## Integration Evidence
- The resolver and advisor currently list the same seven hubs.
- The foundation suite covers flag truth-table agreement, cohort equality, default-on serving, and kill-switch behavior.
- `compiled-route-sync.cjs` is a reliable promoted-closure check, but it does not generate or update the advisor TypeScript cohort.

## Confirmed-Clean Surfaces
- No current cohort divergence was found.
- The duplicated resolver copies are byte-identical in the reviewed state.
- Existing tests make accidental drift observable in CI.

## Ruled Out
- No new serving-path security or correctness defect was found in this maintainability pass.

## Next Focus
- dimension: correctness
- focus area: concurrency, refresh atomicity, and manifest state transitions
- reason: maintainability pass found only a P2 synchronization risk; F001 remains the principal implementation risk
- rotation status: maintainability covered
- blocked/productive carry-forward: retain F001, F002, F003, and F004; inspect refresh race behavior and test coverage directly
- required evidence: refresh implementation, manifest tests, activation state writes, and concurrent invocation behavior

Review verdict: CONDITIONAL
