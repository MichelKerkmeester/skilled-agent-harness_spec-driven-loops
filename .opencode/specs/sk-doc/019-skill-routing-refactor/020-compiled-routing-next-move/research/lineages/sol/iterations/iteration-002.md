# Iteration 2: Authored/Runtime Closure Resolution Mechanism

## Focus
This iteration investigated Q2 only: the exact resolver, path, and module identities that make `cli-external-orchestration` and `sk-design` unresolved during authored closure tracing, and whether the same identities explain the claimed runtime success.

Selected interpretation: prove the current checkout's behavior using read-only commands and exact code paths. Deferred alternatives: historical state where runtime resolution may have succeeded before the current skill registry changes.

## Findings
1. `compiled-route-sync.cjs --check` currently fails before publishing because `build()` traces the authored resolver at `sourceRoot/014-runtime-engine/lib/resolve.cjs`, records the resolver decisions, and throws when any hub decision is missing. The reproduction returned `SYNC FAILED: authored closure failed to resolve hubs: cli-external-orchestration, sk-design, sk-doc`; the code path is `build()` lines 724-743, with `traceClosure()` called at line 735 and unresolved hubs rejected at lines 741-743. [SOURCE: .opencode/bin/compiled-route-sync.cjs:724] [SOURCE: .opencode/bin/compiled-route-sync.cjs:735] [SOURCE: .opencode/bin/compiled-route-sync.cjs:741] [SOURCE: command: `node .opencode/bin/compiled-route-sync.cjs --check`]
2. The promoted runtime does not succeed in the current checkout for the two focused hubs. `compiled-route-sync.cjs --verify` returned `MOVE-SIMULATION FAILED: promoted closure failed to resolve hubs: cli-external-orchestration, sk-design`, and a direct resolver comparison returned `null` for both hubs under both the authored resolver and promoted resolver. This contradicts the supplied runtime-success premise for the current working tree. [SOURCE: .opencode/bin/compiled-route-sync.cjs:663] [SOURCE: .opencode/bin/compiled-route-sync.cjs:668] [SOURCE: .opencode/bin/compiled-route-sync.cjs:692] [SOURCE: command: `node .opencode/bin/compiled-route-sync.cjs --verify`] [SOURCE: command: direct authored/runtime `resolveRoute` comparison]
3. The shared architectural mechanism is that the promoted compiled engine is not a sealed snapshot for these hubs: `compiled-route.cjs` loads each hub engine from the authored/promoted `009-parent-hub-rollout/...` child, but the child `build-artifacts.cjs` then walks upward to the repository root and sets `SKILL_ROOT` to the live `.opencode/skills/<hub>` tree. So both authored and promoted engines compile their current snapshot from mutable skill inputs outside the promoted runtime closure. [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:21] [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:62] [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:65] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs:48] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs:49] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/006-sk-design/harness/build-artifacts.cjs:42] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/006-sk-design/harness/build-artifacts.cjs:43]
4. `cli-external-orchestration` has two current failure mechanisms. In the authored child, `sourceInputs()` enumerates only `cli-claude-code`, `cli-codex`, and `cli-opencode`, but the live registry declares `cli-cursor`; `loadSnapshot()` maps every registry mode and calls `.toString()` on `sourceBytes[cli-external-orchestration/${mode.packet}/SKILL.md]`, so the `cli-cursor` entry is `undefined` and the thrown error is `Cannot read properties of undefined (reading 'toString')`. In the promoted child, the runtime harness has drifted the other way: it attempts to read `cli-devin/SKILL.md`, which is absent from the live skill tree, so promoted resolution throws `ENOENT`. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs:64] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs:105] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs:108] [SOURCE: .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs:77] [SOURCE: .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs:82] [SOURCE: .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs:98] [SOURCE: .opencode/skills/cli-external-orchestration/mode-registry.json:78] [SOURCE: command: snapshot loader comparison]
5. `sk-design` fails because the live registry currently declares four top-level modes, while the compiled `sk-design` registry compiler still requires exactly six and throws `AUTHORED_INPUT_INVALID` with `sk-design must declare six modes`. The child source loader explicitly reads live `.opencode/skills/sk-design/mode-registry.json`, so the concurrent registry restructure is what reaches that invariant. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/006-sk-design/harness/build-artifacts.cjs:49] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/006-sk-design/harness/build-artifacts.cjs:73] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/006-sk-design/lib/registry-compiler.cjs:296] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/006-sk-design/lib/registry-compiler.cjs:297] [SOURCE: .opencode/skills/sk-design/mode-registry.json:5] [SOURCE: .opencode/skills/sk-design/mode-registry.json:77]
6. The "byte-identical authored/runtime" premise is only partially true in this checkout. The authored and promoted `resolve.cjs`, `compiled-route.cjs`, and `sk-design` build harness hashes match; `cli-external-orchestration` build harness hashes differ; the `cli-external-orchestration` activation manifests match; the `sk-design` activation manifests do not. Therefore the exact current mechanism is not "identical runtime succeeds"; it is "both serving graphs depend on live skill inputs, and current live inputs are incompatible with each affected child." [SOURCE: command: `shasum -a 256` over authored/promoted resolver, engine, child harnesses, and focused manifests] [INFERENCE: based on Findings 2-5]

## Ruled Out
- Pure activation-manifest byte comparison was ruled out as a sufficient explanation. `cli-external-orchestration` manifests are byte-identical, yet both authored and promoted resolver paths currently return `null`; the failing operation is snapshot compilation from live skill inputs. [SOURCE: command: focused manifest `shasum -a 256`] [SOURCE: command: snapshot loader comparison]
- Runtime success in the current checkout was ruled out by `--verify` and direct `resolveRoute` reproduction. [SOURCE: command: `node .opencode/bin/compiled-route-sync.cjs --verify`] [SOURCE: command: direct authored/runtime `resolveRoute` comparison]

## Dead Ends
- Do not spend the next iteration trying to prove current runtime success for `cli-external-orchestration` and `sk-design`; current evidence contradicts it. The smallest useful follow-up is to decide how guard enforcement should treat "known uncompilable because live inputs are mid-restructure" versus "unintended stale compiled closure."

## Edge Cases
- Ambiguous input: The prompt asks for authored failure versus successful runtime resolution, but current reproduction shows both authored and promoted runtime resolution failing for the two focused hubs. I selected current repository evidence and marked the historical runtime-success premise unverified.
- Contradictory evidence: Supplied baseline says runtime resolution succeeds; current `--verify` and direct resolver probes say it does not. Current command evidence is stronger for this checkout.
- Missing dependencies: None for current reproduction. Historical state that produced runtime success was not available inside this iteration.
- Partial success: The current mechanism is established; the historical "runtime succeeds" case remains unverified.

## Sources Consulted
- .opencode/bin/compiled-route-sync.cjs:724
- .opencode/bin/compiled-route-sync.cjs:735
- .opencode/bin/compiled-route-sync.cjs:741
- .opencode/bin/compiled-route-sync.cjs:663
- .opencode/bin/compiled-route-sync.cjs:668
- .opencode/bin/compiled-route-sync.cjs:692
- .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:21
- .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:62
- .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:65
- .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs:64
- .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs:105
- .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs:108
- .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs:77
- .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs:82
- .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs:98
- .opencode/skills/cli-external-orchestration/mode-registry.json:78
- .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/006-sk-design/harness/build-artifacts.cjs:49
- .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/006-sk-design/harness/build-artifacts.cjs:73
- .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/006-sk-design/lib/registry-compiler.cjs:296
- .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/006-sk-design/lib/registry-compiler.cjs:297
- .opencode/skills/sk-design/mode-registry.json:5
- .opencode/skills/sk-design/mode-registry.json:77
- command: `node .opencode/bin/compiled-route-sync.cjs --check`
- command: `node .opencode/bin/compiled-route-sync.cjs --verify`
- command: direct authored/runtime `resolveRoute` comparison
- command: snapshot loader comparison
- command: focused `shasum -a 256` comparisons

## Assessment
- New information ratio: 1.00
- Questions addressed: Q2 authored/runtime closure-resolution mechanism
- Questions answered: Q2 for the current checkout; historical runtime-success premise remains unverified and contradicted by current evidence

## Reflection
- What worked and why: Driving both `--check` and `--verify`, then bypassing the resolver's fail-safe `null` with direct `compiledRoute/loadHubEngine` calls exposed the thrown child snapshot errors instead of stopping at "unresolved."
- What did not work and why: Manifest-byte comparison alone did not explain the failure, because the failing reads happen after the promoted engine re-enters live `.opencode/skills` inputs.
- What I would do differently: If historical runtime success matters, preserve or locate the exact pre-restructure live skill tree and rerun the same resolver comparison against that snapshot.

## Recommended Next Focus
Q3 should place the freshness/blocking guard around this exact class of failure: compiled closure invalid because live hub inputs changed or are mid-restructure. It should distinguish intentional exceptions for known in-progress hubs from accidental drift where the promoted closure claims compiled service but the current source can no longer rebuild or resolve.
