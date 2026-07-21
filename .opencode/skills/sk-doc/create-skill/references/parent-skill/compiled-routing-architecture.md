---
title: Compiled-Routing Architecture For Parent Hubs
description: What the compiled skill router serves, the shadow-child-to-cohort chain, the compiled-serving parity bar, and the exact boundary of a freshly minted --compiled-routing ready manifest.
trigger_phrases:
  - "compiled routing architecture"
  - "compiled router seven hubs"
  - "compiled-serving parity bar"
  - "compiled routing ready manifest boundary"
  - "default-on hubs cohort"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Compiled-Routing Architecture For Parent Hubs

The compiled skill router is a closed-cohort, byte-verified fast path that resolves a parent hub's `workflowMode` decision without evaluating the hub's prose smart-router at request time. It exists for exactly the parent hubs that have built and proven a compiled policy against that hub's own legacy routing — no other skill, including any hub `create-skill` scaffolds today, is reachable through it. This reference explains what the router actually serves, the chain from a hub's authored files to a live routing decision, the bar a hub must clear to serve compiled traffic, and the exact boundary of `create-skill --compiled-routing ready` — which mints onboarding evidence, not a working compiled route.

---

## 1. Overview And Scope

Two routers coexist for a parent hub:

- The **prose smart-router** — the `SMART ROUTING` section of the hub's `SKILL.md`, read and reasoned over by the acting agent at request time. Every hub has this; it is the only router `create-skill` scaffolds.
- The **compiled router** — a precompiled decision table over a hub's `hub-router.json` + `mode-registry.json`, evaluated by a small deterministic engine instead of prose reasoning. It only serves the seven proven hubs in Section 2, is flag-gated (`SPECKIT_COMPILED_ROUTING`) and cohort-gated (`DEFAULT_ON_HUBS`), additive on top of the prose router, and fails closed to it on any gap, error, or ineligible hub.

`create-skill` authors the files the compiled router eventually compiles (`hub-router.json`, `mode-registry.json`, `SKILL.md`) and can mint an onboarding manifest that records a hub's intent to join later. It does not build the compiled engine itself. Sections 5-6 draw that line precisely.

---

## 2. Which Skills The Router Serves

The compiled router serves exactly **seven parent hubs**, enumerated as `HUB_CHILD` in `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/compiled-route.cjs`:

| Hub | Shadow-child |
| --- | --- |
| `sk-code` | `006-parent-hub-rollout/001-sk-code` |
| `system-deep-loop` | `006-parent-hub-rollout/002-system-deep-loop` |
| `mcp-tooling` | `006-parent-hub-rollout/003-mcp-tooling` |
| `cli-external-orchestration` | `006-parent-hub-rollout/004-cli-external-orchestration` |
| `sk-prompt` | `006-parent-hub-rollout/005-sk-prompt` |
| `sk-design` | `006-parent-hub-rollout/006-sk-design` |
| `sk-doc` | `006-parent-hub-rollout/007-sk-doc` |

This same seven-hub set is independently pinned in `.opencode/bin/lib/compiled-routing/serving-closure.manifest.json`, the promoted runtime's own inventory of every file the compiled router is allowed to depend on.

The router only ever selects **within** an already-identified hub — which of that hub's `workflowMode`/`packetKind` entries a prompt should resolve to. It never decides which hub owns a prompt in the first place; that step stays the advisor's job.

**Why only these seven, and only hub-shaped skills:** the compiled router compiles a `hub-router.json` + `mode-registry.json` pair — the two-axis, `modes[]`-registry contract described in [parent-skills-nested-packets.md](parent-skills-nested-packets.md). A skill only carries this contract if it is a parent hub built with `create-skill-parent`. Non-hub skills (`sk-git`, `system-code-graph`, `system-skill-advisor`, `system-spec-kit`, `mcp-code-mode`) and every standalone skill `create-skill` scaffolds are single advisor identities with no internal mode dispatch — there is no per-request "which packet" decision for a compiled policy to precompute, so they are structurally out of scope, not merely unbuilt yet.

---

## 3. The Chain: Shadow-Child To A Live Decision

A compiled-serving hub's routing decision passes through four layers on disk, in this order:

1. **Shadow-child engine** — `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/00N-<hub>/`, holding that hub's own `lib/registry-compiler.cjs` (compiles the hub's `hub-router.json` + `mode-registry.json` + `SKILL.md` into a policy snapshot), `lib/router.cjs` or `lib/canary-router.cjs` (evaluates a prompt against that snapshot), and `fixtures/canary-cases.v1.json` (the hub's own scenario set). Each hub's compiler is hand-built and hand-sized to that hub's real vocabulary — line counts range from 329 (`sk-prompt`) to 643 (`system-deep-loop`); there is no one-size-fits-all compiler.
2. **Activation manifest** — `.../010-live-activation/activation/<hub>/manifest.json`: `{schemaVersion, selectedPolicy: {effectivePolicyHash, generation}, servingAuthority, shadowOnly}`. `servingAuthority` is the per-hub switch between `"legacy"` and `"compiled"`.
3. **Resolver** — `.../011-runtime-engine/lib/resolve.cjs`. Serves the compiled decision for a hub only when **both** hold: the runtime flag `SPECKIT_COMPILED_ROUTING` permits it (forced to `1`, or unset/default with the hub listed in `DEFAULT_ON_HUBS`), **and** that hub's manifest reads `servingAuthority: "compiled"`. Any other case, or any error resolving the route, returns `null` and the caller falls back to the prose router. `SPECKIT_COMPILED_ROUTING=0` is the explicit fleet-wide kill-switch.
4. **Front door** — `.opencode/bin/compiled-route.cjs --hub <hub> --prompt "<task>"`. This is the literal command a compiled-serving hub's `SKILL.md` directive invokes; it delegates to the resolver and prints either the compiled decision or a `{"servingAuthority":"legacy"}` sentinel, never throwing into the routing path.

**Freshness** ties layers 1 and 2 together: a manifest's `selectedPolicy.effectivePolicyHash` must equal the shadow-child's own current snapshot hash (what `loadHubEngine(hub).snapshot.policy.effectivePolicyHash` computes right now, not a generic recompile). Any change to a hub's shadow-child compiler invalidates that hash, so the manifest must be re-minted afterward — preserving `servingAuthority` and `shadowOnly` — or the hub reads as stale and drops to legacy.

---

## 4. The Compiled-Serving Parity Bar

A hub earns the **`compiled-serving`** verdict when its compiled decision matches the legacy (prose-router replay) decision on **every** scenario in its benchmark set — zero drift, zero unsafe over-detection, zero silent defers on a scenario legacy actually routes. This is measured by the Lane C harness, `system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs`, which re-hashes the three frozen scorer files as a precondition and never re-implements their judgment — it only translates the compiled decision into the frozen evaluator's own vocabulary and asks it to score.

Only a `compiled-serving` hub may be added to `DEFAULT_ON_HUBS` — the per-hub cohort the resolver consults when the flag is unset. As of this reference, all seven hubs in Section 2 carry that verdict and are in the cohort (verify directly in `011-runtime-engine/lib/resolve.cjs`); `sk-design`'s shadow-child (562-line compiler) is the deepest reference build, at 38/0 (see the recipe docs in Section 7).

**A naming collision worth knowing:** `compiled-route-status.cjs` (a live per-hub probe, distinct from the Lane C harness) emits its own `causeCode: 'compiled-serving'` meaning "this hub is being served compiled right now, under the current flag and manifest." That is a request-time gate check, not a coverage judgment — a hub can hold the Lane C parity verdict `compiled-serving` while the live probe reports something else entirely, for example if the flag is forced off. Section 6 depends on keeping these two apart.

---

## 5. The Path To Compiled-Serving

For a hub to go from "just scaffolded" to genuinely compiled-serving, in order:

1. **Build the shadow-child compiler to route == legacy.** Grow `registry-compiler.cjs`'s detectors and `router.cjs`/`canary-router.cjs`'s selection logic against the hub's real `hub-router.json` vocabulary and its full playbook/route-gold scenario set, until compiled output matches legacy on all of them. Model this on `006-parent-hub-rollout/006-sk-design` — the proven, fullest-coverage reference implementation.
2. **Pass Lane C parity** with the `compiled-serving` sub-verdict (Section 4) — zero drift.
3. **Re-mint the activation manifest** to the shadow-child's fresh hash, flipping `servingAuthority` to `"compiled"` (still reversible: flipping it back, or the fleet kill-switch, restores legacy byte-for-byte).
4. **Join `DEFAULT_ON_HUBS`** in `011-runtime-engine/lib/resolve.cjs` so the hub serves compiled by default once the flag is unset, not only when forced on.

**This whole path is outside `create-skill`'s authority.** `HUB_CHILD` and `DEFAULT_ON_HUBS` are hardcoded, frozen tables owned by the runtime-engine phase, not derived from any manifest or scaffold output. A hub absent from `HUB_CHILD` always falls back to legacy, by construction, no matter what its manifest says — `create-skill` cannot add an eighth hub to this cohort, and does not attempt to.

---

## 6. The Boundary: `ready` Mints A Manifest, It Does Not Serve

`scripts/init_skill.py --kind parent --compiled-routing ready` does exactly this, and nothing more:

1. Writes the hub's final `SKILL.md`, `hub-router.json`, and `mode-registry.json`.
2. Calls `.opencode/bin/compiled-route-manifest.cjs mint` — which compiles those three files through the shared **canonical** compiler (reused from `006-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs` as a generic reference algorithm, not because the new hub has anything to do with `sk-code`) and, if that compiles cleanly, writes a manifest with `generation: 1`, `servingAuthority: "legacy"`, `shadowOnly: true`.
3. Calls `freshness` against the same inputs and reports `compiled-ready (fresh manifest verified)` only if both steps are valid and hash-fresh. Any failure at either step prints an error, retains the legacy fallback, and never hand-authors a manifest or digest.

What this proves: the hub's own router files are internally self-consistent and compile to a stable hash. What it does **not** do:

| | `--compiled-routing ready` | Genuinely `compiled-serving` |
| --- | --- | --- |
| Engine | No shadow-child directory exists yet | Hand-built under `006-parent-hub-rollout/00N-<hub>/`, registered in `HUB_CHILD` |
| Manifest | `servingAuthority: "legacy"`, `shadowOnly: true` | `servingAuthority: "compiled"`, re-minted to the shadow-child hash |
| Coverage proof | None — no scenarios were evaluated | Lane C parity, zero drift (Section 4) |
| Runtime effect | None; the front door always returns the legacy sentinel for this hub | Live, once the hub also joins `DEFAULT_ON_HUBS` (or the flag is forced on) |
| Owned by | `create-skill` | The hub's own coverage build-out, then the runtime-engine cohort change (Section 5) |

A freshly minted `ready` manifest is inert onboarding evidence — safe, reversible, and inspectable, but it changes nothing at runtime by itself. Treat `compiled-ready (fresh manifest verified)` as "this hub's files are onboarding-clean," never as "this hub now routes compiled traffic." Standalone skills never touch any of this: the manifest concept, the flag, and the front door are all parent-hub-only.

---

## 7. Related Resources

- [parent-skills-nested-packets.md](parent-skills-nested-packets.md) - the `modes[]`/`packetKind` contract the compiled router compiles.
- [parent-hub-router-schema.md](parent-hub-router-schema.md) - the `hub-router.json` schema the shadow-child compiler consumes.
- [goal-coverage-buildout.md](../../../../../specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/goal-coverage-buildout.md) - the program goal and per-hub coverage recipe (worked example, spec history).
- [handover.md](../../../../../specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/013-compiled-coverage-buildout/handover.md) - the verified final state for all seven hubs and the exact recipe that fixed under-routing (spec history).
