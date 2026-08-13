# Iteration 20: Adversarial feasibility audit

## Focus

Challenge the strongest possible plugin proposal against the accumulated evidence.

## Findings

- A narrow Pi cache companion is technically feasible: stable-prompt diagnostics, cache-affinity compatibility checks, provider usage aggregation, and optional guarded prompt normalization all map to documented extension hooks. [SOURCE: https://pi.dev/docs/latest/extensions]
- A broad “Reasonix parity” plugin is not credible as one package. MCP, plan mode, filesystem checkpoints, session/context engine, and recovery are distinct products; several already exist in Pi core or packages. [SOURCE: https://pi.dev/docs/latest/usage]
- The existing `pi-cache-optimizer` substantially occupies the narrow scope. The highest-value next action is a source/security audit plus controlled provider benchmark, then contribute missing behavior or fork only if a concrete blocker is found. [SOURCE: https://github.com/jiangge/pi-cache-optimizer]
- No primary evidence supports the `lumo.md` claims of generic 70–90% Pi savings or universal concurrent-agent cache sharing. Reasonix’s 99.82%/$12 figures remain a plausible but project-hosted single-workload report. [SOURCE: https://github.com/esengine/DeepSeek-Reasonix]
- Feasibility verdict: conditional GO for evaluation and a narrow delta; NO-GO for the proposed all-in-one roadmap without a separately justified product scope.

## Sources Consulted

- `https://pi.dev/docs/latest/extensions`
- `https://pi.dev/docs/latest/usage`
- `https://pi.dev/packages/pi-cache-optimizer`
- `https://github.com/jiangge/pi-cache-optimizer`
- `https://github.com/esengine/DeepSeek-Reasonix`
- `https://api-docs.deepseek.com/guides/kv_cache`

## Assessment

- newInfoRatio: 0.36
- Novelty justification: Final pass integrates claim verdicts into a bounded scope and proof-first decision path.
- Confidence: High for documented feasibility; medium for achievable savings until benchmarked.

## Reflection

- Worked: Adversarial scoping exposes existing-package overlap and prevents adjacent features from inflating the cache project.
- Failed/ruled out: Early synthesis was not allowed; convergence telemetry remained above the configured threshold and never changed the max-iterations stop policy.

## Recommended Next Focus

In Phase 2, audit `pi-cache-optimizer` source and run an A/B provider benchmark before deciding whether to contribute, fork, or build.
