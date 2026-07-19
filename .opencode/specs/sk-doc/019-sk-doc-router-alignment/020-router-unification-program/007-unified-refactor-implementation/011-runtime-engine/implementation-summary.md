---
title: "Implementation Summary: Unified Router Refactor — Runtime Engine (P4b Literal Cutover)"
description: "The P4b runtime engine: a pure compiled-route engine that reuses each rollout child's proven canary engine, a double-gated fail-safe resolver + CLI front-door, and a fenced-CAS per-hub serving flip with byte-exact rollback. Proven end-to-end on sk-code and rolled back; no hub compiled-serving; scorer frozen. Hub SKILL.md wiring and the seven-hub flip gated."
trigger_phrases:
  - "runtime engine implementation summary"
  - "compiled-route resolver flip built"
  - "sk-code cutover proven rolled back"
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
| **Status** | Implemented — the P4b runtime engine (compiled-route engine + resolver/CLI front-door + per-hub serving flip) is built and proven end-to-end on `sk-code` (flip → compiled-served route → byte-exact rollback). `sk-code` rolled back to legacy; no hub compiled-serving. Hub `SKILL.md` wiring, the seven-hub flip, and post-flip real-model re-verification are IN-PROGRESS/gated. |
| **Date** | 2026-07-19 |
| **Level** | 2 |
| **Serving authority** | Legacy fleet-wide; the compiled path is inert by default (`SPECKIT_COMPILED_ROUTING` off) |
| **Strict validation** | `validate.sh --strict` reports Errors: 0 (advisory warnings only) |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The **runtime consumer** of the compiled router contract — the piece P4a deliberately left out — as three small, zero-dependency CommonJS modules, plus the operated switch that makes a hub authoritative.

`lib/compiled-route.cjs` is a pure engine: given `(hubId, taskText)` it loads the hub's compiled snapshot from its rollout child and routes it through the **same** `evaluateCanary` closed decision algebra the shadow canary already validates, returning a normalized `{hubId, action, selectionKind, targets, effectivePolicyHash, generation}` and deferring on prompts that lack the policy's detector signals. `lib/resolve.cjs` is the safety gate and CLI front-door: it serves the compiled decision only when the runtime flag `SPECKIT_COMPILED_ROUTING=1` is set **and** the hub's activation manifest reads `servingAuthority: compiled`, and it fails safe to null (legacy) on any error. `lib/flip-serving.cjs` is the operated cutover: a fenced compare-and-swap that moves a hub `legacy → compiled` behind four green gates, retaining a byte-identical pre-flip manifest so `--rollback` is byte-exact.

This is the literal cutover P4b: the compiled contract becomes something a hub can actually *serve*, but only under an explicit runtime flag and a per-hub serving pointer — so merely shipping this code changes nothing at runtime.

### Files Delivered

| Area | Files | Purpose |
|------|-------|---------|
| Engine | `lib/compiled-route.cjs` | Pure runtime engine; reuses each rollout child's `loadSnapshot` + `evaluateCanary` read-only |
| Resolver | `lib/resolve.cjs` | Double-gated (flag + manifest), fail-safe serving resolver + `--hub/--prompt` CLI front-door |
| Flip | `lib/flip-serving.cjs` | Fenced-CAS per-hub serving flip (`legacy → compiled`) with byte-exact `--rollback` and `serving-flip-record.json` |
| Documentation | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Status, evidence, verification, and the IN-PROGRESS/gated boundary |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The engine maps each of the seven hubs to its shadow rollout child under `006-parent-hub-rollout/` and, per hub, loads `{ snapshot } = loadSnapshot()` from the child's `harness/build-artifacts.cjs` and `evaluateCanary` from its `lib/canary-router.cjs`, caching the loaded engine. `compiledRoute(hubId, taskText)` evaluates the prompt through that engine and normalizes the result; it routes WITHIN a hub (selecting compiled destinations when the prompt carries the policy's detector signals) and returns `defer` otherwise — the correct conservative outcome, so a caller can fall back to legacy on ambiguous input. Nothing in the engine reimplements routing; the runtime path *is* the shadow-validated path.

The resolver wraps the engine in two independent gates. `resolveRoute(hubId, taskText)` returns null unless `flagEnabled()` (the process env `SPECKIT_COMPILED_ROUTING` equals `1`) and `servingAuthority(hubId)` reads `compiled` from `010-live-activation/activation/<hub>/manifest.json`; on a missing or unparseable manifest, `servingAuthority()` defaults to `legacy`, and any error resolving the compiled route is caught and returns null rather than throwing into a routing hot path. The CLI front-door — `node resolve.cjs --hub <id> --prompt <text>` — prints the compiled decision when authoritative, else a legacy sentinel `{servingAuthority: legacy, hubId}` so the caller keeps the prose smart-router.

The flip is the only mutating step. `flip-serving.cjs --hub <id>` runs four gates before any write: (1) the hub is P4a-bound (`selectedPolicy.effectivePolicyHash` is non-null); (2) the three frozen scorer files (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) re-hash to their pinned digests; (3) the child's `validate-canary.cjs` exits zero; (4) `assertEngineRoutes` confirms the engine routes ≥1 designed scenario. On success it retains a byte-identical `manifest.serving-prior.json`, writes `servingAuthority: compiled` and `shadowOnly: false`, advances the monotonic fence epoch, and emits `serving-flip-record.json`. `--rollback` restores the byte-identical serving-prior and advances the fence; a hub already `compiled`-serving is an idempotent `ALREADY-COMPILED` no-op.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Reuse each rollout child's `evaluateCanary` instead of reimplementing routing | The runtime path and the shadow-validated path become the *same* code, so there is no drift between what was proven green and what serves. |
| Gate serving on both a runtime flag and a per-hub manifest pointer | Makes the cutover inert by default and reversible two ways — unset the flag fleet-wide, or flip one hub back — so shipping the engine changes nothing at runtime. |
| Make the resolver fail safe to legacy | A routing hot path must never throw; any manifest/engine error resolves to null and the caller keeps the prose smart-router. |
| Make the flip a fenced CAS behind four green gates | The serving change is the highest-blast step in the program; it must be auditable, precondition-checked, and abort before any write on a failed gate. |
| Retain a byte-identical serving-prior for rollback | Guarantees a byte-exact per-hub reversal without reconstructing the pre-flip manifest. |
| Prove end-to-end on one hub, then roll back | `sk-code` exercised the whole path (flip → compiled-served route → byte-exact rollback) as real evidence, while leaving the fleet on legacy — no hub is left compiled-serving. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The full path was proven on `sk-code` and then rolled back. Evidence lives under `010-live-activation/activation/sk-code/`:

| Artifact | Evidence |
|----------|----------|
| `serving-flip-record.json` | `servingAuthority: compiled`, generation 2, `effectivePolicyHash: 1dbf295d…`, fence `3 → 4`, gate `{canaryGreen: true, scorerFrozen: true, routedScenarios: 1, totalScenarios: 5}` |
| CLI front-door | Flag on ⇒ `action: route` to the `code-quality` surface (sk-code/quality mode); flag off ⇒ legacy sentinel |
| `manifest.serving-prior.json` | Byte-identical pre-flip manifest (`servingAuthority: legacy`, `shadowOnly: true`, generation 2) |
| `manifest.json` (post-rollback) | Byte-identical to serving-prior (`servingAuthority: legacy`, `shadowOnly: true`); `fence-state.json` epoch 5 — the `--rollback` was byte-exact and `sk-code` is on legacy |

Frozen scorer digests (unchanged, pinned in the flip):

- `router-replay.cjs`: `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47`
- `score-skill-benchmark.cjs`: `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c`
- `load-playbook-scenarios.cjs`: `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029`

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No hub is wired to the resolver yet.** The `--hub/--prompt` CLI front-door exists and is proven, but the per-hub live-`SKILL.md` routing directive that would call it is the IN-PROGRESS rollout and is not landed in this phase.
2. **The seven-hub serving flip is gated and not executed.** Only `sk-code` was flipped as a proof, and it was rolled back to legacy. Flipping all seven hubs `legacy → compiled` — the only stage that changes runtime routing — requires an explicit go, one hub at a time, with post-flip re-verification and proven rollback.
3. **Post-flip real-model re-verification is pending.** The engine routes correctly in the harness (canary-green, routes ≥1 designed scenario), but real-model routing after each hub is wired and flipped has not been run; the fleet stays on legacy until it is.

<!-- /ANCHOR:limitations -->

<!--
_memory:
  continuity:
    status: in-progress
    current_focus: "P4b runtime engine built + proven end-to-end on sk-code (flip -> compiled-served route -> byte-exact rollback), then rolled back to legacy; no hub compiled-serving; runtime path inert by default (SPECKIT_COMPILED_ROUTING off)"
    next_steps:
      - "Wire each hub's live SKILL.md routing directive to call resolve.cjs (compiled decision or legacy sentinel)"
      - "Gated: flip all seven hubs legacy->compiled one hub at a time with post-flip real-model re-verification and proven byte-exact rollback"
    blockers: []
-->
