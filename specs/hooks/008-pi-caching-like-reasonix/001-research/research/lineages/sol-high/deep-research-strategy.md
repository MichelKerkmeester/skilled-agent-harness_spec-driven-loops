# Deep Research Strategy — SOL High Lineage

## 2. TOPIC

Verify the `lumo.md` Reasonix-versus-Pi prompt-caching claims and scope the feasibility of a Reasonix-style Pi caching plugin.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

None. All six research questions were answered at evidence level; implementation validation is carried forward separately.
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- No implementation, prototype, package installation, or live provider billing experiment.
- No GO/NO-GO product decision; this lineage supplies evidence and constraints.
- No writes outside this SOL lineage artifact directory.

## 5. STOP CONDITIONS

- Run exactly 20 iterations because `stopPolicy=max-iterations`.
- Treat convergence before iteration 20 as telemetry only; broaden the review angle.
- Stop on unrecoverable state corruption or the iteration cap.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- Reasonix metrics: project-published and plausible, not independently reproducible.
- Reasonix scope: historically DeepSeek-only; current project supports configurable compatible providers.
- Pi caching: provider-adapter behavior and telemetry, not a local universal KV cache.
- Optimizer: real community package that already covers most narrow scope.
- Feature gaps: mixed core omissions, package coverage, and unrelated adjacent products.
- Feasible scope: audit/benchmark first; contribute a bounded delta if evidence supports it.
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Primary provider docs separated cache ownership from client-side prefix discipline.
- Version-pinned Reasonix sources resolved historical/current contradictions.
- Pi core/package classification prevented false “missing” verdicts.
- Provider-by-provider comparison exposed unsafe universal mutations.
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Search-result repetition could not independently validate the Reasonix workload.
- Branding such as “Context Engine v2” was too undefined for a binary comparison.
- No public raw billing trace or replay harness made the headline metrics independently reproducible.
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

- Secondary-source metric confirmation — BLOCKED; all located repetitions trace back to the project claim.
- All-in-one plugin scoping — PRODUCTIVE only as negative knowledge; split into independent products.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Provider-neutral wire mutation.
- Local ownership of upstream KV caches.
- Greenfield duplication before auditing `pi-cache-optimizer`.
- Global cross-agent cache key defaults.
- Savings promises from headline hit rates.
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: claim provenance, provider semantics, Pi platform surface, feature-gap classification
- Remaining frontier: source audit, live provider benchmark, final-wire tests
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

- Does the current optimizer preserve byte identity after provider serialization?
- Which cache hints survive target proxies?
- Does its test/security posture justify adoption?
- What measured delta over Pi core justifies maintenance?
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Phase 2: audit the existing optimizer and run the controlled A/B proof plan before choosing adopt, contribute, fork, or greenfield.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- Local claim source: `.opencode/specs/hooks/008-pi-caching-like-reasonix/lumo.md`.
- Research contract: `.opencode/specs/hooks/008-pi-caching-like-reasonix/001-research/spec.md`.
- Primary source families: Reasonix repository/docs, DeepSeek API docs, Pi docs/package catalog/source, and provider caching docs.
- `resource-map.md` was absent in the spec folder at initialization; the lineage will emit a source map from its deltas.

## 13. RESEARCH BOUNDARIES

- Max iterations: 20
- Convergence threshold: 0.05
- Stop policy: max-iterations
- Executor: cli-codex / gpt-5.6-sol / high
- Session: `fanout-sol-high-1786012490410-1dceqj`
- Started: 2026-08-06T10:37:19.552Z
