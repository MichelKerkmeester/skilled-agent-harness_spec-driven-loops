# Iteration 1: Activation-Manifest Ownership

## Focus
This iteration investigated Q1 only: the long-term ownership model for activation manifests. I interpreted the question as a contract decision between three models: authored-only source ownership, runtime-authoritative serving ownership, and a third model that keeps source reproducibility and runtime deploy isolation without allowing silent drift. The operator-supplied verified state was treated as baseline unless contradicted by repository evidence.

## Findings
1. The best long-term model is a derived dual-location contract: the source-controlled authored activation manifests are the reproducibility authority, while the runtime activation manifests are a promoted serving mirror that must be byte-equivalent except for explicit, recorded, temporary exceptions. The current system already has both locations: `compiled-route-sync.cjs` binds `IMPL_ROOT` to the authored spec implementation root, `RUNTIME_ROOT` to `.opencode/bin/lib/compiled-routing`, and `CURRENT_LAYOUT.activation` to `013-live-activation`; the build then records `generatedFrom`, `runtimeRoot`, and copied files in the serving closure manifest. [SOURCE: .opencode/bin/compiled-route-sync.cjs:39] [SOURCE: .opencode/bin/compiled-route-sync.cjs:43] [SOURCE: .opencode/bin/compiled-route-sync.cjs:48] [SOURCE: .opencode/bin/compiled-route-sync.cjs:790]
2. Authored-only ownership preserves git reproducibility but cannot be the whole serving contract, because the runtime resolver only reads its promoted activation root and falls back to legacy when the runtime manifest is absent, stale, or not flipped to `compiled`. `resolveRoute` reads `ACTIVATION_ROOT`, requires `servingAuthority === 'compiled'`, and rejects a compiled route when the selected policy hash or generation does not match the runtime snapshot. [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:24] [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:84] [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:103] [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:113]
3. Runtime-authoritative ownership matches the hot serving path but breaks reproducible rebuilds. The writer library resolves the canonical writable manifest path through the runtime layout, and mint/refresh write to that path; there is no corresponding write-back to the authored activation root in the current code. A rebuild traces and copies from the authored source root, so runtime-only changes can be overwritten by the next promotion. [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:391] [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:579] [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:658] [SOURCE: .opencode/bin/compiled-route-sync.cjs:724] [SOURCE: .opencode/bin/compiled-route-sync.cjs:767]
4. The guard already encodes the failure taxonomy needed for the third model. It distinguishes stale runtime manifests, which mean a hub is currently serving legacy, from authored drift, which means serving may be fine but a rebuild would reinstate the authored copy. That directly supports a policy of blocking unrecorded source/runtime divergence while still allowing explicitly marked in-progress uncompilable hubs. [SOURCE: .opencode/bin/compiled-route-guard.cjs:13] [SOURCE: .opencode/bin/compiled-route-guard.cjs:15] [SOURCE: .opencode/bin/compiled-route-guard.cjs:17] [SOURCE: .opencode/bin/compiled-route-guard.cjs:111] [SOURCE: .opencode/bin/compiled-route-guard.cjs:119]
5. Current evidence shows the model is already violated: all seven authored activation manifest files exist, but a byte comparison found `sk-design` and `sk-doc` diverging between authored and runtime copies while five hubs remained identical. The guard currently reports `sk-doc` as `authored-drift`, and reports `cli-external-orchestration` and `sk-design` as `inputs-do-not-compile`. [SOURCE: command: find .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program -path '*/013-live-activation/activation/*/manifest.json' -print] [SOURCE: command: cmp authored/runtime manifests for seven hubs] [SOURCE: command: node .opencode/bin/compiled-route-guard.cjs --json]
6. The derived dual-location model should treat runtime as a disposable deployment cache only after source has been updated or an explicit exception has been recorded. That conclusion follows from the resolver's fail-safe legacy fallback, the writer path's runtime-only writes, the build path's authored-source promotion, and the guard's authored-drift wording. [INFERENCE: based on .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:103, .opencode/bin/lib/compiled-route-manifest.cjs:391, .opencode/bin/compiled-route-sync.cjs:724, and .opencode/bin/compiled-route-guard.cjs:17]

## Ruled Out
- Pure runtime-authoritative ownership: ruled out for long-term use because it makes rebuilds non-reproducible unless a separate source sync is added. [SOURCE: .opencode/bin/compiled-route-guard.cjs:17]
- Pure authored-only ownership with no runtime mirror: ruled out because the serving resolver reads the promoted activation root, not the authored spec tree. [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:24]
- Continuing the current advisory-only drift report: ruled out for Q1 because it detects the failure but still permits source/runtime divergence to persist. [SOURCE: .opencode/bin/compiled-route-guard.cjs:21]

## Dead Ends
No dead-end research paths need reducer promotion. The productive path was direct repository evidence around the writer, sync tool, resolver, and guard.

## Edge Cases
- Ambiguous input: "Authored-only" could mean either source is the only durable owner while runtime is regenerated, or runtime manifests are removed entirely. I analyzed the stricter no-runtime-authority interpretation and recommend the derived mirror model instead.
- Contradictory evidence: The supplied baseline says authored and runtime manifests are byte-identical for the closure-resolution failure pair, while current byte comparison shows `sk-design` differs and `sk-doc` differs. I did not use that contradiction to answer Q2; for Q1 it only strengthens the need for drift blocking.
- Missing dependencies: No required Q1 source was missing.
- Partial success: The guard command exits non-zero because it found failures, but its JSON output was usable evidence for this iteration.

## Sources Consulted
- .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/deep-research-config.json
- .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/deep-research-state.jsonl
- .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/deep-research-strategy.md
- .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/findings-registry.json
- .opencode/bin/compiled-route-sync.cjs:39
- .opencode/bin/compiled-route-sync.cjs:724
- .opencode/bin/compiled-route-sync.cjs:790
- .opencode/bin/compiled-route-guard.cjs:13
- .opencode/bin/lib/compiled-route-manifest.cjs:391
- .opencode/bin/lib/compiled-route-manifest.cjs:579
- .opencode/bin/lib/compiled-route-manifest.cjs:658
- .opencode/bin/lib/compiled-route-layout.cjs:103
- .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:24
- .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:103
- .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:25
- command: `find .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program -path '*/013-live-activation/activation/*/manifest.json' -print`
- command: `cmp` and `shasum -a 256` over seven authored/runtime manifest pairs
- command: `node .opencode/bin/compiled-route-guard.cjs --json`

## Assessment
- New information ratio: 1.00
- Questions addressed: Q1 activation-manifest ownership
- Questions answered: Q1. Use a derived dual-location model: authored source controls reproducibility, runtime is the promoted serving mirror, and unrecorded divergence is a blocking defect.

## Reflection
- What worked and why: Reading the writer, sync tool, resolver, and guard together exposed the ownership split at the exact points where manifests are written, copied, served, and checked.
- What did not work and why: A broad manifest grep was too noisy because unrelated design and template manifests dominate the repository; narrowing to compiled-routing code and activation paths produced usable evidence.
- What I would do differently: For Q2, start from the exact `traceClosure` resolution path and compare authored versus runtime module identities instead of relying on manifest byte state.

## Recommended Next Focus
Q2 should identify the exact authored closure-resolution failure mechanism. Start with `traceClosure`, the authored resolver under the implementation root, the promoted resolver under runtime, and the child engine/snapshot paths for `cli-external-orchestration` and `sk-design`. Treat the current authored/runtime manifest byte differences as context only unless they directly explain the closure resolution discrepancy.
