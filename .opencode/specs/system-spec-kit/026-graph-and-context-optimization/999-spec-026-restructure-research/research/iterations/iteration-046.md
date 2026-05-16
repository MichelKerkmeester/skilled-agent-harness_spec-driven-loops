# Iter 046 — Track 11: strategic naming convention for scale

## SWE-1.6 convention recap
- Rule (from iter 034): Use noun-first names that surface the core domain/subsystem/component; allow verb-first only when the action is the packet's primary identity; avoid problem-statement names.
- Examples (from iter 033): old → new
  - `014-local-llama-cpp` → `014-local-embeddings-setup-a`
  - `015-global-security-sweep-and-supply-chain-audit` → `015-tanstack-security-audit`
  - `006-graph-impact-and-affordance-uplift` → `006-external-project-adoption`
  - `002-resource-map-template` → `002-resource-map-and-deep-loop-fix`

## Pressure-test results

### Scenario A: 026 doubles in size
- Convention holds? with-caveats
- Failure modes:
  - Pure noun-first becomes too broad once many phases share anchors like `code-graph`, `memory`, `skill-advisor`, `cocoindex`, or `hook`.
  - Search results become crowded if names stop at the subsystem and do not include the discriminating facet.
  - Generic action suffixes like `fix`, `cleanup`, `improvements`, `setup`, and `hardening` age poorly when 44 phases accumulate.
  - `and`-joined names scale badly because they hide whether the packet is one coherent concern or a bundled scope.
- Adjustment needed: refinement

### Scenario B: cross-parent absorption
- Convention holds? with-caveats
- Failure modes:
  - 027 already contains many facet-qualified names: `code-graph-hld-lld`, `code-graph-trace`, `code-graph-impact-analysis`, `code-graph-adoption-eval`, `memory-semantic-triggers`, `cocoindex-complete-fork`.
  - If 027 merges into 026, broad names like `007-code-graph` remain fine as parents, but new children need stronger second/third tokens to avoid search ambiguity.
  - 028's `mcp-startup-stdio-fix` shows a legitimate incident/fix pattern: surface-first, then failure mode, then action.
- Adjustment needed: refinement

### Scenario C: phase split
- Convention holds? with-caveats
- Failure modes:
  - Parent names must name the durable umbrella, not the first implementation tactic. `local-llama-cpp` failed this test; `local-embeddings-*` survives better.
  - Verb-first parent names collapse after a split because children diverge by subsystem or facet.
  - Noun-first survives splits only when the noun is broad enough for all children and specific enough to remain searchable.
- Adjustment needed: refinement

### Scenario D: cross-parent consistency
- Convention holds? yes
- Failure modes:
  - Full consistency across 026/027/028 is not necessary; the packets have different jobs.
  - What should be consistent is the grammar: stable domain first, discriminating facet second, action/type last.
  - 027 is already closer to the refined grammar than raw 026: `code-graph-trace` and `feedback-reducers` are more scalable than abstract names like `graph-impact-and-affordance-uplift`.
- Adjustment needed: refinement

## Adjusted convention (if needed)
- Refined rule: Use `domain-or-surface` first, add a discriminating `facet` second, and put stable work type/action last only when needed; parent names use durable umbrella domains, children use facet-qualified names, and problem details stay in `spec.md`.
- What changed from SWE-1.6's recommendation: Noun-first remains the base rule, but now requires a facet token for crowded domains and discourages vague action suffixes unless anchored to a concrete surface/failure.
- Why: At 30-50 phases, discoverability depends less on noun-first alone and more on controlled noun-first families: `code-graph-trace`, `code-graph-impact-analysis`, `memory-semantic-triggers`, `mcp-startup-stdio-fix`.

## Top-N renames re-evaluation
- For the top-N renames in iter 033, do they all still hold under the adjusted convention?
  - Mostly, but `014-local-embeddings-setup-a` should be revised. `setup-a` is internally meaningful but weak for long-term search.
- Renames to revise:
  - `014-local-llama-cpp` → revise from `014-local-embeddings-setup-a` to `014-local-embeddings-migration` or `014-local-embeddings-provider-migration`.
  - `015-global-security-sweep-and-supply-chain-audit` → `015-tanstack-security-audit` still holds.
  - `006-graph-impact-and-affordance-uplift` → `006-external-project-adoption` still holds.
  - `002-resource-map-template` → `002-resource-map-deep-loop-fix` is slightly better than `002-resource-map-and-deep-loop-fix`; same meaning, cleaner grammar.

## JSONL delta row
{"iter_id":"046","timestamp_utc":"2026-05-16T03:53:15Z","executor":"cli-codex","model":"gpt-5.5","reasoning_effort":"medium","track":11,"status":"complete","scenarios_tested":4,"adjustments_proposed":1,"primary_evidence_files":["iter-031/032/033/034"]}