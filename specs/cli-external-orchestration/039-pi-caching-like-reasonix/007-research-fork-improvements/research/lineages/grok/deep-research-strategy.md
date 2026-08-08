# Deep Research Strategy — Grok Fan-out Lineage

## Boundaries

- **Topic:** Concrete, evidence-based improvement opportunities for the two packet-039 Pi forks: `pi-cache-optimizer` (DeepSeek-guard) and `deep-pi` (hardened DeepSeek-direct), across correctness, test coverage, telemetry/observability, cost-economics, and maintainability.
- **Artifact boundary:** `specs/cli-external-orchestration/039-pi-caching-like-reasonix/007-research-fork-improvements/research/lineages/grok` only.
- **Stop policy:** Run all 6 iterations. Convergence is recorded as telemetry, never used to synthesize early.
- **Evidence standard:** Prefer live fork source under `.pi/extensions/`, sibling packet specs (003/006), and reproducible test/command evidence. Build on known open limitations rather than rediscovering them.

## Key Questions

1. Where can correctness still fail at the ownership boundary or inside each fork's mutation/telemetry paths?
2. Which test-coverage gaps leave regressions uncaught for both forks?
3. What telemetry/observability improvements close the stats-file and non-interactive report gaps?
4. What cost-economics and cold-start cache-write behaviors remain uncharacterized or under-instrumented?
5. What maintainability risks (fork drift, dual ownership, shared predicates) threaten long-term coherence?

## Non-Goals

- Implementing patches in either fork during this research loop
- Re-litigating completed 003/006 scope decisions unless new evidence contradicts them
- Promising universal savings percentages without workload measurements

## Stop Conditions

- `maxIterations` (6) reached under `stopPolicy: max-iterations`
- Operator pause via `.deep-research-pause` (if created)

## Research Lenses

- Correctness: ownership predicates, silent failure counters, cost-math guards, hook coverage
- Test coverage: unit/integration/live gaps, negative controls, credential-blocked regressions
- Telemetry/observability: persistent stats, RPC/report surfacing, status-bar vs full body
- Cost-economics: cache-write cold start, pricing assumptions, uncached-token accounting
- Maintainability: vendored-fork sync, shared predicates, dual-extension coordination

## Forced-Iteration Plan

1. Correctness audit of ownership boundary and silent/unguarded paths
2. Test-coverage inventory and gap analysis
3. Telemetry/observability (stats persistence + `/deeppi` non-interactive report)
4. Cost-economics and cold-start cache-write characterization gaps
5. Maintainability / fork-drift / dual-extension coherence
6. Known-open-limitations deep dive and prioritized improvement backlog

Each cycle must add a distinct angle even if preliminary newInfoRatio is below `0.05`.

## Known Context

- Sibling 003 completed DeepSeek-guard fork for `pi-cache-optimizer` at `.pi/extensions/pi-cache-optimizer/` with narrow `isDeepPiOwned` predicate. [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer/spec.md]
- Sibling 006 completed deep-pi hardening (silent counters, model-drift warning, cost-math) at `.pi/extensions/deep-pi/`. [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/spec.md]
- Known open limitations (do not rediscover as primary findings): `/deeppi` full report not non-interactive even via `pi --mode rpc`; deep-pi has no persistent stats file; one live regression blocked by missing opencode credential; pi-cache-optimizer cold-start cache-write for newly-added models uncharacterized.
- resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

- Source pointers: `.pi/extensions/pi-cache-optimizer/index.ts`, `.pi/extensions/pi-cache-optimizer/tests/`, `.pi/extensions/deep-pi/extensions/deeppi.ts`, `.pi/extensions/deep-pi/extensions/deeppi/*.ts`, `.pi/extensions/deep-pi/tests/`
- Reuse candidates: existing vitest suites, `isDeepPiOwned` / DeepSeek eligibility predicates, telemetry modules
- Integration points: `.pi/settings.json` package pointers, Pi extension hooks, DeepSeek-direct vs non-DeepSeek routes
- Constraints: lineage write boundary; research-only (no fork mutations); max 12 tool calls per iteration

## Next Focus

Synthesis complete. Recommended implementation order: P0 allowlist parity + hook/composition tests, then P1 persistence/export/cold-start metrics. Research-only contract honored (no fork mutations).

## Synthesis Outcome

- Completed all 6 planned iterations; convergence was telemetry only.
- Mapped K1–K4 known limitations to concrete remediations.
- Produced prioritized P0/P1/P2 backlog across correctness, coverage, telemetry, cost-economics, and maintainability.
- Final outputs: `research.md`, `findings-registry.json`, `deep-research-dashboard.md`, `resource-map.md`.
