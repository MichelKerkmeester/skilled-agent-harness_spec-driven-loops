# Iteration 4 — compiled routing — gpt-5.6-luna

## Focus

Determine what the compiled-route split changes, why `sk-design` falls back to legacy, and which parts are independent of the stage-1/stage-2 vocabulary defect.

### What was read

- `.opencode/bin/compiled-route.cjs:4-49` for the thin front door and legacy sentinel.
- `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:4-16,29-40,62-74,97-120` for serving-authority conditions and the five-hub default-on cohort.
- `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:4-15,21-36,92-108` for the within-hub compiled engine and `HUB_CHILD` map.
- `.opencode/bin/compiled-route-guard.cjs:31-51,74-118,125-166` for the freshness/drift gate and its hub list.
- `.opencode/bin/lib/compiled-routing/serving-closure.manifest.json:1-11,50-61` for the promoted closure inventory.
- `.opencode/bin/lib/compiled-route-layout.cjs:30-45,54-79,103-145` for coherent-layout selection and fail-closed behavior.

### What was measured

With the default runtime flag, the read-only compiled front door returned a legacy sentinel for `sk-design` and consulted compiled manifests for the other five hubs:

```text
sk-design                    {"servingAuthority":"legacy","hubId":"sk-design"}
sk-code                      action=route, workflowMode=sk-code-review, generation=2
system-deep-loop             action=defer, generation=4
mcp-tooling                  action=defer, generation=4
sk-doc                       action=defer, generation=5
cli-external-orchestration   action=defer, generation=5
```

Using hub-appropriate prompts, the five compiled-serving hubs produced deterministic route decisions for `code review`, `deep review`, `use chrome devtools`, `create a skill`, and `codex exec`; `sk-design` still returned the legacy sentinel for `plot this data`. The compiled guard’s read-only `--json --warn-only` probe returned all five compiled hubs as `reason: fresh`, `failures: 0`.

### Findings

1. Compiled routing is a post-hub decision layer. The engine explicitly says it routes within a hub, selecting modes/surfaces after the hub is chosen; the front door returns a legacy sentinel on any non-authoritative or failed compiled decision. It cannot repair a stage-1 advisor rank that selected the wrong hub or produced no hub. [SOURCE: `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:4-15,92-108`; `.opencode/bin/compiled-route.cjs:4-13,34-49`]
2. The serving-authority gate is conjunctive: the runtime flag must permit the hub, the activation manifest must say `compiled`, and the route snapshot hash/generation must match the manifest. Any failure returns `null`, so the caller stays on legacy routing. This is a useful safety and rollback seam, but it is orthogonal to vocabulary reach. [SOURCE: `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:4-16,62-74,97-120`]
3. The compiled closure currently has exactly the five hubs named in `HUB_CHILD`, the default-on cohort, the guard's `HUBS`, and the serving manifest; `sk-design` is absent from each compiled-serving list. The observed `sk-design` legacy sentinel is therefore an intentional membership/fallback outcome, not evidence that its router phrase was scored correctly. [SOURCE: `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:21-36`; `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:29-40`; `.opencode/bin/compiled-route-guard.cjs:45-51`; `.opencode/bin/lib/compiled-routing/serving-closure.manifest.json:5-11`]
4. Compiled routing adds deterministic snapshot identity, coherent-layout selection, reversible fleet/per-hub fallback, and a freshness/drift gate. The guard checks manifest freshness and authored drift for its five registered hubs; it does not probe advisor vocabulary or cross-hub ownership. [SOURCE: `.opencode/bin/compiled-route-guard.cjs:61-78,98-118,125-166`; `.opencode/bin/lib/compiled-route-layout.cjs:54-79,103-145`]
5. Bringing `sk-design` into the compiled closure would require a complete rollout child/engine and registrations in the hub-child map, default-on cohort, guard inventory, activation manifest, and closure inventory, followed by parity/freshness proof. Those costs may buy deterministic stage-2 mode routing for design, but they do not make `ROUTER.md` phrases visible to the stage-1 advisor; the vocabulary fix must still land at the projection/scorer seam. [SOURCE: `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:21-36`; `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:29-40`; `.opencode/bin/compiled-route-guard.cjs:45-51`; `.opencode/bin/lib/compiled-routing/serving-closure.manifest.json:1-11`]

### Recommendations

1. [implementable today] Keep compiled-route status and vocabulary reach as separate gates. Run the owner-local stage-1/stage-2 reach check before trusting a compiled within-hub decision; do not treat a fresh compiled manifest as proof of cross-hub ownership.
2. [implementable today] If `sk-design` needs compiled serving, add it only through a complete rollout package with canary/parity, activation, manifest, guard, and closure registrations. Record the legacy fallback as a visible status until then.
3. [needs a scorer change] Repair cross-hub phrase ownership in the advisor projection/scorer; do not use compiled-route membership or a compiled mode decision as a substitute for stage-1 hub selection.
4. [implementable today] Add a cross-reference in the compiled status report that names uncompiled hubs and their legacy authority, without changing the fallback behavior.

### What this iteration could not settle

It did not inspect the CI command that should sequence vocabulary reach before compiled freshness, nor the final safe-negative set. It also did not design or implement a `sk-design` compiled rollout; that is a separate operational decision.

## Sources Consulted

The compiled front door, runtime resolver and engine, layout selector, freshness guard, serving closure manifest, worker prompt, and previous three lineage iterations.

## Assessment

Question 4 is answered: compiled routing changes deterministic within-hub mode selection and serving authority, but not stage-1 hub discovery or cross-hub phrase ownership. `sk-design` is legacy because it is absent from the compiled serving closure. A design rollout would be additive and operationally costly; it is neither necessary nor sufficient for the scorer vocabulary repair.

## Reflection

The compiled layer is a useful proof boundary precisely because it fails closed and exposes identity/freshness. Treating it as the owner of hub selection would collapse two separate contracts and hide the original defect behind a fresh manifest. The final iteration should turn the combined evidence into a gate with explicit wrong-hub failure, no-reach telemetry, and safe negatives.

## Recommended Next Focus

Iteration 5: measurement as gate — read and exercise `ci-router-vocabulary-reach.cjs`, define build-gating assertions, baseline traps, and safe negatives without failing on short common phrases.

