# Iteration 4: Maintainability — Shared-Harness Durability and Compatibility

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Agent definition loaded: `.opencode/agents/deep-review.md`
- Budget profile: verify
- Focus: generic semantics, hard-gate durability, compatibility, and deterministic repeatability

## Files Reviewed

- `run-skill-benchmark.cjs`, `router-replay.cjs`, `load-playbook-scenarios.cjs`, and `score-skill-benchmark.cjs`.
- `tests/route-gold-gate.vitest.ts` flag, parser, fallback-parity, legacy, and end-to-end cases.
- Iteration-1 and iteration-4 benchmark reports.
- Current active advisory SRR-P2-001 for release-readiness classification.

## Findings — New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None new. SRR-P2-001 remains active as the traceability advisory recorded in iteration 3.

## Traceability Checks

No additional traceability protocol was due. The maintainability rotation revalidated the shared consumer and gate mechanisms underlying the already-passing protocols.

## Integration Evidence

- All four touched harness scripts pass `node --check`.
- A fresh benchmark run written only under `logs/iteration-004-benchmark/` returns PASS 98 with route gold auto-enabled, 13 rows, 13 matches, 0 violations, and 0 parse failures — identical key metrics to iteration 1.
- `resolveRouteGold` derives auto-on from `hub-router.json`, validates explicit values, and keeps flat skills opt-in.
- `run()` returns exit 3 for structure, registry, or route-gold blocking verdicts; the regression suite includes both injected route mismatch and malformed-gold end-to-end controls.
- `assembleResources` centralizes fallback-only behavior while preserving legacy default-resource union for undeclared routers; parameterized tests cover six packets, the hub, and a legacy synthetic router.
- Manifest-bearing skills are protected against mid-run topology drift with before/after SHA-256 checks and exit 4.

## Edge Cases

- The explicit `--route-gold off` diagnostic remains supported and observable in the report; it does not weaken auto-on behavior for normal hub runs.
- Full Vitest execution would create temporary files outside the user-bound lineage root, so this detached review inspected its committed adversarial cases and exercised the live positive and in-memory negative paths without violating the write boundary.
- Repeat-run determinism is measured on verdict, aggregate, scenario count, and route-gold counters; generated report timestamps are intentionally excluded.

## Confirmed-Clean Surfaces

- Shared consumer semantics are data-driven rather than hardcoded for mcp-tooling.
- Legacy routers without a semantics declaration retain their prior default union.
- Hub gate activation, report state, blocking verdict, and process exit agree.
- Parser failures are counted violations instead of silently inapplicable rows.
- Current corpus remains stable across two independent lineage benchmark runs.

## Ruled Out

- A remediation-specific branch in the shared replay consumer.
- A report-only route-gold failure that exits successfully.
- Breaking legacy eager-default behavior for undeclared routers.
- Nondeterministic current hub scoring across repeated runs.

## Next Focus

- Phase: synthesis
- Focus area: authoritative registry, planning trigger, coverage status, and terminal verdict
- Reason: all four required dimensions are complete and `maxIterations=4` is reached
- Rotation status: 4/4 dimensions complete

Review verdict: PASS
