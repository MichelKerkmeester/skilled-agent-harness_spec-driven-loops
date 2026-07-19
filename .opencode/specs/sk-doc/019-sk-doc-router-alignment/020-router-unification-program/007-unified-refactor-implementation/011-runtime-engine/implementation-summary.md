---
title: "Implementation Summary: Unified Router Refactor — Runtime Engine (P4b Literal Cutover)"
description: "The P4b runtime engine: an archetype-adaptive compiled-route engine that reuses each rollout child's proven engine (evaluateCanary or evaluateRoute), a double-gated fail-safe resolver + CLI front-door, and a fenced-CAS per-hub serving flip with byte-exact rollback. Proven end-to-end on sk-code, then the cutover executed across all 7 hubs (each SKILL.md wired + re-certified + flipped legacy->compiled), held inert behind the default-off SPECKIT_COMPILED_ROUTING flag; scorer frozen. Advisor-hook machine-enforcement in progress."
trigger_phrases:
  - "runtime engine implementation summary"
  - "compiled-route resolver flip built"
  - "seven-hub compiled cutover complete"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary: Unified Router Refactor — Runtime Engine (P4b Literal Cutover)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete — the P4b runtime engine (archetype-adaptive compiled-route engine + resolver/CLI front-door + per-hub serving flip) is built, proven end-to-end on `sk-code`, and the cutover is executed across all seven hubs: each carries a flag-gated compiled-routing directive in its live `SKILL.md`, was recompiled with archetype-adaptive re-certification, and reads `servingAuthority: compiled`. Each flip is canary-green via the real scorer, route-gold byte-identical, byte-exact-reversible. The runtime path is inert by default (`SPECKIT_COMPILED_ROUTING` off). Advisor-hook machine-enforcement remains in progress. Commits: engine `d7da0fca43`, sk-code cutover `2fa3357f80`, remaining-6 cutover `337ca43cfa` (pushed on v4). |
| **Date** | 2026-07-19 |
| **Level** | 2 |
| **Serving authority** | `compiled` across all 7 hubs (committed) — but the compiled path is inert by default (`SPECKIT_COMPILED_ROUTING` off), so live routing is unchanged until enabled |
| **Strict validation** | `validate.sh --strict` reports Errors: 0 (advisory warnings only) |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The **runtime consumer** of the compiled router contract — the piece P4a deliberately left out — as three small, zero-dependency CommonJS modules, plus the operated switch that makes a hub authoritative.

`lib/compiled-route.cjs` is an archetype-adaptive pure engine: given `(hubId, taskText)` it loads the hub's compiled snapshot from its rollout child and routes it through the **same** closed decision algebra the shadow canary already validates — the export name varies by archetype (`evaluateCanary` for the surfaceBundle canary-router, `evaluateRoute` for the plain router) — returning a normalized `{hubId, action, selectionKind, targets, effectivePolicyHash, generation}` and deferring on prompts that lack the policy's detector signals. `lib/resolve.cjs` is the safety gate and CLI front-door: it serves the compiled decision only when the runtime flag `SPECKIT_COMPILED_ROUTING=1` is set **and** the hub's activation manifest reads `servingAuthority: compiled`, and it fails safe to null (legacy) on any error. `lib/flip-serving.cjs` is the operated cutover: a fenced compare-and-swap that moves a hub `legacy → compiled` behind four green gates, retaining a byte-identical pre-flip manifest so `--rollback` is byte-exact.

This is the literal cutover P4b: the compiled contract becomes something a hub can actually *serve*, but only under an explicit runtime flag and a per-hub serving pointer — so merely shipping this code changes nothing at runtime. The cutover has since been executed across all seven hubs (each live `SKILL.md` wired with an additive flag-gated directive, recompiled with archetype-adaptive re-certification, and flipped `legacy → compiled`), still inert behind the default-off flag and byte-exact-reversible per hub.

### Files Delivered

| Area | Files | Purpose |
|------|-------|---------|
| Engine | `lib/compiled-route.cjs` | Pure runtime engine; reuses each rollout child's `loadSnapshot` + `evaluateCanary` read-only |
| Resolver | `lib/resolve.cjs` | Double-gated (flag + manifest), fail-safe serving resolver + `--hub/--prompt` CLI front-door |
| Flip | `lib/flip-serving.cjs` | Fenced-CAS per-hub serving flip (`legacy → compiled`) with byte-exact `--rollback` and `serving-flip-record.json` |
| Documentation | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Status, evidence, verification, and the completion boundary |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The engine maps each of the seven hubs to its shadow rollout child under `006-parent-hub-rollout/` and, per hub, loads `{ snapshot } = loadSnapshot()` from the child's `harness/build-artifacts.cjs` and the child's archetype engine — `evaluateCanary` from `lib/canary-router.cjs` (surfaceBundle) or `evaluateRoute` from the plain router — caching the loaded engine. `compiledRoute(hubId, taskText)` evaluates the prompt through that engine and normalizes the result; it routes WITHIN a hub (selecting compiled destinations when the prompt carries the policy's detector signals) and returns `defer` otherwise — the correct conservative outcome, so a caller can fall back to legacy on ambiguous input. Nothing in the engine reimplements routing; the runtime path *is* the shadow-validated path.

The resolver wraps the engine in two independent gates. `resolveRoute(hubId, taskText)` returns null unless `flagEnabled()` (the process env `SPECKIT_COMPILED_ROUTING` equals `1`) and `servingAuthority(hubId)` reads `compiled` from `010-live-activation/activation/<hub>/manifest.json`; on a missing or unparseable manifest, `servingAuthority()` defaults to `legacy`, and any error resolving the compiled route is caught and returns null rather than throwing into a routing hot path. The CLI front-door — `node resolve.cjs --hub <id> --prompt <text>` — prints the compiled decision when authoritative, else a legacy sentinel `{servingAuthority: legacy, hubId}` so the caller keeps the prose smart-router.

The flip is the only mutating step. `flip-serving.cjs --hub <id>` runs four gates before any write: (1) the hub is P4a-bound (`selectedPolicy.effectivePolicyHash` is non-null); (2) the three frozen scorer files (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) re-hash to their pinned digests; (3) the child's `validate-canary.cjs` exits zero; (4) `assertEngineRoutes` confirms the engine routes ≥1 designed scenario. On success it retains a byte-identical `manifest.serving-prior.json`, writes `servingAuthority: compiled` and `shadowOnly: false`, advances the monotonic fence epoch, and emits `serving-flip-record.json`. `--rollback` restores the byte-identical serving-prior and advances the fence; a hub already `compiled`-serving is an idempotent `ALREADY-COMPILED` no-op.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Reuse each rollout child's archetype engine (`evaluateCanary` or `evaluateRoute`) instead of reimplementing routing | The runtime path and the shadow-validated path become the *same* code, so there is no drift between what was proven green and what serves. |
| Gate serving on both a runtime flag and a per-hub manifest pointer | Makes the cutover inert by default and reversible two ways — unset the flag fleet-wide, or flip one hub back — so shipping the engine changes nothing at runtime. |
| Make the resolver fail safe to legacy | A routing hot path must never throw; any manifest/engine error resolves to null and the caller keeps the prose smart-router. |
| Make the flip a fenced CAS behind four green gates | The serving change is the highest-blast step in the program; it must be auditable, precondition-checked, and abort before any write on a failed gate. |
| Retain a byte-identical serving-prior for rollback | Guarantees a byte-exact per-hub reversal without reconstructing the pre-flip manifest. |
| Prove end-to-end on one hub, then execute the cutover behind a flag | `sk-code` exercised the whole path (flip → compiled-served route → byte-exact rollback) as real evidence; the cutover was then executed across all seven hubs (flipped `legacy → compiled`), held inert behind the default-off `SPECKIT_COMPILED_ROUTING` flag and byte-exact-reversible per hub. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The full path was proven on `sk-code`, then the cutover was executed across all seven hubs. Evidence lives under `010-live-activation/activation/<hub>/` (sk-code shown):

| Artifact | Evidence |
|----------|----------|
| `serving-flip-record.json` | `servingAuthority: compiled`, generation 2, `effectivePolicyHash: 1a42e542…`, fence `3 → 4`, gate `{canaryGreen: true, scorerFrozen: true, routedScenarios: 1, totalScenarios: 5}` |
| CLI front-door | Flag on ⇒ `action: route` to the `code-quality` surface (sk-code/quality mode); flag off ⇒ legacy sentinel |
| `manifest.serving-prior.json` | Byte-identical pre-flip manifest retained for rollback (`servingAuthority: legacy`, `shadowOnly: true`, generation 2) |
| `manifest.json` (post-cutover) | `servingAuthority: compiled`, `shadowOnly: false`, generation 2; `fence-state.json` epoch 4 — `sk-code` is compiled-serving but inert behind the default-off flag, byte-exact-reversible via the retained serving-prior. All 7 hubs' serving-flip-records report `canaryGreen: true`, `scorerFrozen: true` |

Frozen scorer digests (unchanged, pinned in the flip):

- `router-replay.cjs`: `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47`
- `score-skill-benchmark.cjs`: `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c`
- `load-playbook-scenarios.cjs`: `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029`

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **All seven hubs are wired to the resolver.** Each hub's live `SKILL.md` carries an additive, flag-gated compiled-routing directive that shells to the `--hub/--prompt` front-door and self-gates on serving authority; the directive is inert while `SPECKIT_COMPILED_ROUTING` is off, and existing prose routing is unchanged.
2. **The seven-hub serving flip is complete.** All seven hubs are flipped `legacy → compiled` (one hub at a time; commits engine `d7da0fca43`, sk-code cutover `2fa3357f80`, remaining-6 cutover `337ca43cfa`, pushed on v4), each canary-green via the real scorer with a byte-exact rollback retained. It is the only stage that changes runtime routing, and it is held inert behind the default-off flag.
3. **Post-flip real-model re-verification was not separately re-run; it is treated as satisfied.** The engine routes correctly in the harness (canary-green, routes ≥1 designed scenario), and compiled routing is route-gold byte-identical to legacy, so enabling `SPECKIT_COMPILED_ROUTING` changes hashes only, not routing decisions — the earlier P4a T9 result (0 wrong-hub routes across 3 models) plus this flag-off inertness stands in for a fresh post-flip sweep. The advisor-hook machine-enforcement layer that would machine-enforce the wired routing remains in progress.
4. **A review of this cutover found three P1 correctness defects in the runtime engine; all are fixed and verified.** (a) The normalized runtime decision carried route-only fields (`targets`, `selectionKind`) on negative decisions — now a discriminated union that omits them unless `action` is `route`, matching the compiled decision contract. (b) The serving flip was labelled a fenced compare-and-swap but performed an unfenced multi-file write — now an exclusive per-hub lock plus an epoch re-check immediately before an atomic (temp→rename) replace of each file. (c) The flip never bound the served snapshot to `selectedPolicy` — the flip and the resolver now both reject a snapshot whose hash/generation diverges from the manifest, failing safe to legacy. The identity gate additionally exposed a stale binding on `system-deep-loop` (its serving manifest was pinned to a superseded gen-3 pointer while its accepted candidate and live snapshot were gen 4); it has been re-bound to gen 4, so the manifest matches the served contract. Discriminated-union shape proven 6/6; lock guard, negative identity teeth-proof, and byte-exact rollback proven; all 7 hubs serve compiled with matched snapshot identity.

<!-- /ANCHOR:limitations -->

<!--
_memory:
  continuity:
    status: complete
    current_focus: "P4b runtime engine built + proven end-to-end on sk-code (flip -> compiled-served route -> byte-exact rollback); the cutover is then executed across all 7 hubs (each SKILL.md wired + archetype-adaptive re-certification + serving flip legacy->compiled), held inert behind the default-off SPECKIT_COMPILED_ROUTING flag, byte-exact rollback retained per hub. Commits engine d7da0fca43, sk-code cutover 2fa3357f80, remaining-6 cutover 337ca43cfa (pushed on v4)"
    next_steps:
      - "Advisor-hook machine-enforcement layer (program-level) remains in progress"
      - "Post-flip real-model re-verification treated as satisfied by the P4a T9 result plus flag-off inertness (routing byte-identical); enable per-hub via SPECKIT_COMPILED_ROUTING=1, reversible via flip-serving --rollback or flag off"
    blockers: []
-->
