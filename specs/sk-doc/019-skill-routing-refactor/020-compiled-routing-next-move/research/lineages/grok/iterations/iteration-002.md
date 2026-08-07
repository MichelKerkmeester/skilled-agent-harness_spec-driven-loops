# Iteration 2: Authored/Runtime Closure-Resolution Mechanism

## Focus
Q2 only: the exact mechanism that makes authored closure tracing fail for `cli-external-orchestration` and `sk-design` while (per baseline) runtime manifests resolve. Evidence-first; mark contradictions with the supplied verified state.

## Findings
1. **Closure failure is `resolveRoute` returning `null`, not a missing activation manifest.** `traceClosure` forces `SPECKIT_COMPILED_ROUTING=1`, requires the authored resolver, and records a hub as unresolved when every probe returns falsy. `build`/`check` then throw `authored closure failed to resolve hubs: …`. [SOURCE: .opencode/bin/compiled-route-sync.cjs:120] [SOURCE: .opencode/bin/compiled-route-sync.cjs:741] [SOURCE: .opencode/bin/compiled-route-sync.cjs:985]
2. **`resolveRoute` fails closed on two distinct conditions:** (a) any throw from `compiledRoute`/`loadHubEngine`, or (b) serve-time identity mismatch when the live snapshot's `effectivePolicyHash`/`generation` disagree with the activation manifest's `selectedPolicy`. Both return `null` (legacy). [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:103] [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:114] [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:119]
3. **Serving always re-enters live `.opencode/skills` inputs through child `loadSnapshot`.** `loadHubEngine` requires `<child>/harness/build-artifacts.cjs` and calls `loadSnapshot()`, which reads `SKILL_ROOT` under `.opencode/skills/<hub>`. Manifest byte identity is therefore insufficient for closure success. [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:55] [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:81] [SOURCE: .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs:64]
4. **`cli-external-orchestration` — exact failures differ by graph, same root cause (live inputs ≠ harness expectations):**
   - **Runtime graph:** `sourceInputs()` still opens `cli-devin/SKILL.md` → `ENOENT` (directory absent under live skills). Live `mode-registry.json` lists four modes (`cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`) with no `cli-devin`. [SOURCE: .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs:82] [SOURCE: command: loadHubEngine runtime error] [SOURCE: command: mode-registry modes list]
   - **Authored graph:** harness `sourceInputs()` omits `cli-cursor` entirely; live registry includes `cli-cursor`, so `sourceBytes[…/cli-cursor/SKILL.md]` is `undefined` and `.toString('utf8')` throws. Authored vs runtime harness files **differ** (`cmp` fails). [SOURCE: .opencode/specs/.../004-cli-external-orchestration/harness/build-artifacts.cjs:64-91] [SOURCE: same file:105-108] [SOURCE: command: cmp authored/runtime harness]
5. **`sk-design` — exact failure on both graphs:** `registry-compiler.assertRouterClosure` requires `registry.modes.length === 6`; live `.opencode/skills/sk-design/mode-registry.json` currently has **4** modes (`interface`, `motion`, `md-generator`, `design-mcp-open-design`). Same error string from authored and runtime compilers. [SOURCE: .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/006-sk-design/lib/registry-compiler.cjs:296] [SOURCE: command: loadHubEngine sk-design] [SOURCE: command: mode count]
6. **Baseline contradiction (confirmed):** current checkout does **not** show successful runtime resolution for these hubs — both authored and runtime `resolveRoute`/`loadHubEngine` fail. Also `--check` currently fails three hubs including `sk-doc` via identity bind: authored activation hash `2833c064…` ≠ live snapshot hash `3ed7c31e…` while generation stays 5. Runtime `--verify` fails only the two compile-broken hubs. Guard reports `inputs-do-not-compile` for the pair and `authored-drift` for `sk-doc`. [SOURCE: command: node compiled-route-sync.cjs --check/--verify] [SOURCE: command: direct loadHubEngine] [SOURCE: command: sk-doc authored vs runtime manifest + identity match] [SOURCE: command: compiled-route-guard.cjs --json]
7. **Freshness path maps the same compile failures:** `checkCanonicalManifestFreshness` → `causeCode: compile-error` → guard reason `inputs-do-not-compile` for both hubs. [SOURCE: command: checkCanonicalManifestFreshness JSON] [SOURCE: .opencode/bin/compiled-route-guard.cjs:85]

## Ruled Out
- Manifest-byte comparison as sufficient explanation: `cli-external-orchestration` manifests are byte-identical; both graphs still fail via live skill/harness mismatch. [SOURCE: command: cmp manifests] [SOURCE: findings 3–4]
- Claim that runtime currently resolves these hubs successfully: contradicted by live `loadHubEngine`/`resolveRoute` probes. [SOURCE: command: direct resolve/loadHubEngine]

## Dead Ends
Stopping at "unresolved" without bypassing `resolveRoute`'s catch hides the real ENOENT / six-modes / undefined.toString errors. Direct `loadHubEngine` was required.

## Edge Cases
- Partial / contradictory baseline: "byte-identical and runtime resolution succeeds" — first half true for cli manifests; second half false now. `sk-design` manifests currently differ authored↔runtime.
- `sk-doc` is an additional check failure via stale authored selectedPolicy hash, not via compile-error.

## Sources Consulted
- compiled-route-sync.cjs traceClosure/check/build
- resolve.cjs identity bind + catch
- compiled-route.cjs loadHubEngine
- 004/006 harness build-artifacts + registry-compiler
- live mode-registry.json for both hubs
- commands: --check, --verify, loadHubEngine probes, cmp, guard --json

## Assessment
- New information ratio: 1.00
- Questions answered: Q2 — mechanism is live-input snapshot compilation failure (and identity-bind for sk-doc), swallowed into null by resolveRoute, then surfaced as unresolved hubs by traceClosure. Not a manifest-byte mystery.

## Reflection
- What worked: forcing loadHubEngine to surface thrown errors.
- What failed: trusting "runtime succeeds" without re-probing.
- Next: Q3 freshness guard placement + escape hatch.

## Recommended Next Focus
Q3: where freshness should block (pre-commit / pre-push / CI / session hook) and how legitimately uncompilable hubs escape, given compile-error vs stale-manifest vs authored-drift taxonomy.
