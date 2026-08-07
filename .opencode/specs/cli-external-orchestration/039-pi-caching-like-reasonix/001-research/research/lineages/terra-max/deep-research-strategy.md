# Deep Research Strategy — Terra Max Fan-out Lineage

## Boundaries

- **Topic:** Verify the lumo.md Reasonix vs Pi prompt-caching claims and scope feasibility of a Reasonix-style Pi caching plugin.
- **Artifact boundary:** `.opencode/specs/cli-external-orchestration/039-pi-caching-like-reasonix/001-research/research/lineages/terra-max` only.
- **Stop policy:** Run all 20 iterations. Convergence is recorded as telemetry, never used to synthesize early.
- **Evidence standard:** Prefer provider documentation, Pi documentation/package registry, and Reasonix's own repository. Label vendor/self-reported outcomes separately from independently reproducible facts.

## Key Questions

1. Which concrete Reasonix claims in `lumo.md` are confirmed, overstated, or unsupported?
2. What caching controls are native to Pi, provider-specific compatibility behavior, or installable extension behavior?
3. Does `pi-cache-optimizer` exist and what does it actually implement or explicitly not implement?
4. Which stated Pi gaps are truly absent, partially present through sessions/extensions, or only absent as core primitives?
5. What is the smallest credible scope for a Reasonix-style Pi caching plugin, and what must be measured before promising savings?

## Research Lenses

- Provider cache semantics: exact-prefix conditions, observability, and proxy/session-affinity failure modes.
- Product boundaries: core Pi, extension API, package behavior, and Reasonix's self-described architecture.
- Claim ledger: source class, confidence, and whether the source is independent.
- Feasibility: a narrow cache-discipline extension versus broad context, MCP, plan, and workspace-checkpoint features.

## Forced-Iteration Plan

Iterations 1–5 establish claim inventory and primary sources; 6–10 test Pi cache surface and package claims; 11–15 classify non-cache feature gaps; 16–20 examine implementation scope, negative evidence, and the final recommendation. Each cycle must add a distinct angle even if the preliminary convergence score is below `0.05`.

## Initial Known Context

`lumo.md` reports a 99.8% Reasonix hit rate and a ~$61→~$12 workload cost reduction, calls Reasonix DeepSeek-only, calls Pi caching built-in, describes an official `pi-cache-optimizer`, and asserts concurrent sharing plus 70–90% savings. Those are hypotheses to verify, not accepted facts. [SOURCE: .opencode/specs/cli-external-orchestration/039-pi-caching-like-reasonix/lumo.md:1-20]

## Next Focus

Synthesis complete. The evidence supports a narrow provider-aware cache-discipline and observability companion; broader Reasonix-parity features are separate workstreams.

## Synthesis Outcome

- Completed all 20 planned iterations; convergence was telemetry only.
- Confirmed provider cache prerequisites, Pi extension feasibility, package existence, and the distinction between Pi core and extension behavior.
- Preserved uncertainty for all externally unverified savings, cache-hit, concurrent-sharing, provider-ownership, and workspace-rewind claims.
- Final output: research.md, findings-registry.json, deep-research-dashboard.md, and resource-map.md.
