# Iteration 1: Activation-Manifest Ownership

## Focus
Q1 only: long-term ownership model for activation manifests among authored-only, runtime-authoritative, and a better third model. Operator verified state treated as baseline unless contradicted.

## Findings
1. Recommend a **derived dual-location contract**: authored activation manifests under the implementation root are the reproducibility authority; runtime activation manifests under `.opencode/bin/lib/compiled-routing` are a promoted serving mirror that must stay byte-equivalent except for recorded temporary exceptions. Sync already binds `IMPL_ROOT` to the authored program tree, `RUNTIME_ROOT` to the promoted path, copies closure files into staging, and records `generatedFrom` / `runtimeRoot` in `serving-closure.manifest.json`. [SOURCE: .opencode/bin/compiled-route-sync.cjs:39] [SOURCE: .opencode/bin/compiled-route-sync.cjs:48] [SOURCE: .opencode/bin/compiled-route-sync.cjs:724] [SOURCE: .opencode/bin/compiled-route-sync.cjs:790]
2. **Authored-only (no runtime mirror)** cannot be the serving contract. The promoted resolver reads `ACTIVATION_ROOT` relative to its own package (`…/compiled-routing/013-live-activation/activation`), requires `servingAuthority === 'compiled'`, and returns `null` (legacy) otherwise. Removing the runtime mirror would force every hub to legacy. [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:24] [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:94] [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:106]
3. **Runtime-authoritative** matches the hot path but breaks reproducible rebuilds. `compiled-route-manifest.cjs` sets `RUNTIME_ROOT` to `__dirname/compiled-routing` and resolves the only writable path via `activationRoot()` → that runtime layout; `mintCanonicalManifest` / `refreshCanonicalManifest` write there with no authored write-back. A subsequent `build()` traces and copies from `IMPL_ROOT`, so runtime-only mint/refresh is overwritten or contradicted by the next promotion. [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:16] [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:55] [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:391] [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:579] [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:658]
4. The guard already encodes the dual-location failure taxonomy: `stale-manifest` (serving legacy now), `authored-drift` (serving may be fine; rebuild would reinstate authored), `inputs-do-not-compile` (cannot remint). That is the right vocabulary for blocking unrecorded divergence while allowing explicit in-progress exceptions. [SOURCE: .opencode/bin/compiled-route-guard.cjs:13] [SOURCE: .opencode/bin/compiled-route-guard.cjs:15] [SOURCE: .opencode/bin/compiled-route-guard.cjs:17] [SOURCE: .opencode/bin/compiled-route-guard.cjs:82]
5. Current checkout already violates dual-location hygiene: byte `cmp` shows `sk-design` and `sk-doc` differ authored↔runtime while five hubs are identical; guard reports `sk-doc=authored-drift`, `cli-external-orchestration` and `sk-design` as `inputs-do-not-compile`, four hubs `fresh`. [SOURCE: command: cmp seven authored/runtime manifest pairs] [SOURCE: command: node .opencode/bin/compiled-route-guard.cjs --json]
6. Long-term rule: treat runtime as a disposable deployment cache only after source is updated or an explicit exception is recorded; unrecorded drift is a defect. [INFERENCE: composition of findings 1–5]

## Ruled Out
- Pure runtime-authoritative ownership: rebuilds non-reproducible without separate source sync. [SOURCE: .opencode/bin/compiled-route-guard.cjs:17]
- Pure authored-only with no runtime mirror: resolver never reads the authored activation tree. [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:24]
- Leaving dual-location advisory-only forever: detects failure but permits silent divergence. [SOURCE: .opencode/bin/compiled-route-guard.cjs:21]

## Dead Ends
Broad repo grep for "manifest.json" is too noisy (design/template manifests). Narrowing to compiled-routing + `013-live-activation` worked.

## Edge Cases
- Contradictory evidence vs baseline: prompt says authored/runtime manifests are byte-identical for the closure-failure pair; confirmed identical for `cli-external-orchestration`, but `sk-design` currently DIFFERS. Q1 uses this as drift evidence; Q2 will not assume identity for `sk-design`.
- Partial success: guard exits non-zero; JSON still usable.

## Sources Consulted
- .opencode/bin/compiled-route-sync.cjs:39-50,724-802
- .opencode/bin/compiled-route-guard.cjs:1-129
- .opencode/bin/lib/compiled-route-manifest.cjs:16,55,391,579,658
- .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:24-106
- command: find authored + runtime activation manifests
- command: cmp seven hub pairs
- command: node .opencode/bin/compiled-route-guard.cjs --json

## Assessment
- New information ratio: 1.00
- Questions answered: Q1 → derived dual-location (authored = reproducibility authority; runtime = promoted serving mirror; unrecorded drift blocks)

## Reflection
- What worked: reading writer + sync + resolver + guard as one ownership story.
- What failed: broad manifest grep.
- Next: Q2 — exact `traceClosure` / snapshot failure for `cli-external-orchestration` and `sk-design`.

## Recommended Next Focus
Q2: identify the exact authored closure-resolution failure mechanism versus successful runtime resolution. Start from `traceClosure`, authored vs promoted resolver, and child snapshot compilation for the two failing hubs.
