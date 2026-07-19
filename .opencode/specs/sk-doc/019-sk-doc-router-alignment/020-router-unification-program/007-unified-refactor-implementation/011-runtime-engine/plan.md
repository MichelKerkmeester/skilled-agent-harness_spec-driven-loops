---
title: "Implementation Plan: Unified Router Refactor — Runtime Engine (P4b Literal Cutover)"
description: "How the compiled-route engine reuses the proven canary engine, how the double-gated resolver keeps the cutover inert by default, and how the fenced-CAS flip moves a hub legacy→compiled with a byte-exact rollback."
trigger_phrases:
  - "runtime engine plan"
  - "compiled-route resolver flip plan"
  - "P4b cutover plan"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Unified Router Refactor — Runtime Engine (P4b Literal Cutover)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Zero-dependency CommonJS (Node built-ins only) |
| **Routing engine** | Reuses each rollout child's `evaluateCanary` over its `loadSnapshot` — the same closed decision algebra the shadow canary validates |
| **Serving gate** | Double gate: runtime flag `SPECKIT_COMPILED_ROUTING=1` AND manifest `servingAuthority: compiled`; default off = inert |
| **Cutover mechanism** | Fenced compare-and-swap on the P4a activation manifest; byte-identical `manifest.serving-prior.json` retained for rollback |
| **Frozen inputs** | Three pinned scorer digests; the rollout children and live routing files are read-only |

### Overview

P4b adds the runtime consumer P4a left out, as three small modules. `compiled-route.cjs` is a pure engine: given `(hubId, taskText)` it loads the hub's compiled snapshot and routes it through the child's own `evaluateCanary`, returning a normalized decision and deferring on off-signal prompts. `resolve.cjs` is the safety gate: it serves the compiled decision only when the runtime flag is set and the hub's manifest reads `servingAuthority: compiled`, fails safe to null on any error, and exposes a `--hub/--prompt` CLI front-door. `flip-serving.cjs` is the operated switch: a fenced CAS that moves a hub `legacy → compiled` behind a P4a-binding check, a green canary, the frozen-scorer pin, and a live-route proof, retaining a byte-identical pre-flip manifest so `--rollback` is byte-exact. The path was proven on `sk-code` and rolled back; the seven-hub flip, the hub `SKILL.md` wiring, and post-flip real-model re-verification are the gated rollout and are not executed here.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Each hub's rollout child exposes `harness/build-artifacts.cjs` (`loadSnapshot`) and `lib/canary-router.cjs` (`evaluateCanary`).
- [x] Each hub is P4a-bound: `010-live-activation/activation/<hub>/manifest.json` carries the compiled generation as `selectedPolicy`.
- [x] The three shared scorer files are pinned to known digests.

### Definition of Done
- [x] The compiled-route engine reuses the child's canary engine (no reimplemented routing algebra) and defers on off-signal prompts.
- [x] The resolver is double-gated and fail-safe; inert with the flag off; CLI prints the compiled decision or a legacy sentinel.
- [x] The flip is a fenced CAS behind four green gates with a byte-exact rollback and a `serving-flip-record.json`.
- [x] The path is proven end-to-end on `sk-code` and rolled back to legacy; frozen scorer digests unchanged.
- [ ] Per-hub live-`SKILL.md` routing directive wired to the resolver (IN-PROGRESS; not landed here).
- [ ] Seven-hub `legacy → compiled` serving flip + post-flip real-model re-verification (gated; not executed here).

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Consume-then-serve, gated. A pure engine consumes the compiled contract by reusing the proven canary engine; a resolver decides authority through two independent gates; an operated fenced-CAS flip changes that authority per hub. Authority is data on the activation manifest, never a property of the engine itself — so shipping the engine changes nothing until a hub is both flipped and flagged on.

### Key Components
- **`lib/compiled-route.cjs`**: pure runtime engine. Maps each hub to its rollout child, loads `{ snapshot } = loadSnapshot()` and `evaluateCanary`, routes `taskText`, and normalizes the result to `{hubId, action, selectionKind, targets, effectivePolicyHash, generation}`. Caches per-hub engines; side-effect-free.
- **`lib/resolve.cjs`**: serving resolver + CLI. `resolveRoute(hubId, taskText)` returns the compiled decision only when `flagEnabled()` and `servingAuthority(hubId) === 'compiled'`; else null. Reads `010-live-activation/activation/<hub>/manifest.json`. Fails safe (try/catch → null). CLI: `--hub <id> --prompt <text>`.
- **`lib/flip-serving.cjs`**: per-hub serving flip. Fenced CAS on the activation manifest (`legacy → compiled`, `shadowOnly true → false`); gates on P4a-binding, `validate-canary.cjs`, pinned scorer digests, and `assertEngineRoutes` (≥1 designed scenario). Retains `manifest.serving-prior.json`; `--rollback`; emits `serving-flip-record.json`.

### Data Flow

Prompt → `resolveRoute(hubId, taskText)` → gate 1 flag (`SPECKIT_COMPILED_ROUTING=1`) and gate 2 manifest (`servingAuthority: compiled`) → on pass, `compiledRoute` loads the hub's rollout-child engine and routes via `evaluateCanary` → normalized decision returned; on any miss or error, null → caller keeps the legacy prose smart-router. The flip path is operated out-of-band: `flip-serving.cjs` proves the four gates, retains the pre-flip manifest, swaps `servingAuthority` and advances the fence, and records `serving-flip-record.json`.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase introduces the first runtime consumer of the compiled contract and an operated serving switch, so the surface inventory is required before the flip runs.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Rollout child engines (`harness/build-artifacts.cjs`, `lib/canary-router.cjs`) | Proven compiled snapshot + canary algebra | Reused read-only by the engine | The engine defines no routing algebra; children stay byte-unchanged |
| P4a activation manifest (`010-live-activation/activation/<hub>/manifest.json`) | Bound `selectedPolicy`, `servingAuthority: legacy` | Read by the resolver; CAS target of the flip | Flip asserts compiled `selectedPolicy`; retains byte-identical serving-prior |
| Three shared scorer files | Frozen route-gold scorer | Re-hashed by the flip, never edited | Pinned digests unchanged; drift aborts before any write |
| Runtime flag `SPECKIT_COMPILED_ROUTING` | Off by default | Read by the resolver | Flag off ⇒ resolver returns null everywhere (inert) |
| Live `SKILL.md` / `hub-router.json` / `mode-registry.json` | Authoritative serving routing | **Unchanged — not wired in this phase** | No hub's `SKILL.md` calls the resolver yet (gated rollout) |

Required inventories before the flip:
- Binding: confirm each target hub's manifest `selectedPolicy` is the compiled generation (P4a-bound).
- Frozen inputs: re-hash the three scorer files and compare to the pinned digests before the CAS.
- Inertness: with the flag off, confirm the resolver returns null / a legacy sentinel for a compiled-serving hub.

<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Author `lib/compiled-route.cjs` — map hubs to rollout children, load `loadSnapshot`/`evaluateCanary`, normalize the decision, cache per-hub engines.
- [x] Confirm the engine defers on off-signal prompts and routes within a hub on signal-bearing prompts.
- [x] Author `lib/resolve.cjs` — double gate (flag + manifest), fail-safe null, `--hub/--prompt` CLI front-door.

### Phase 2: Core Implementation
- [x] Author `lib/flip-serving.cjs` — fenced CAS `legacy → compiled`, gates on P4a-binding, `validate-canary.cjs`, pinned scorer digests, and `assertEngineRoutes`.
- [x] Retain a byte-identical `manifest.serving-prior.json` before the swap; advance the monotonic fence epoch; emit `serving-flip-record.json`.
- [x] Implement `--rollback` (restore the byte-identical serving-prior, advance the fence) and the `ALREADY-COMPILED` idempotent no-op.

### Phase 3: Verification
- [x] Prove end-to-end on `sk-code`: flip → `servingAuthority: compiled` (green gates) → front-door returns `action: route` (flag on) and a legacy sentinel (flag off) → byte-exact `--rollback` to legacy.
- [x] Confirm the frozen scorer digests are unchanged after the proof and that `sk-code` is left on legacy.
- [ ] Wire each hub's `SKILL.md` routing directive to the resolver, flip all seven hubs, and re-verify with real models (IN-PROGRESS/gated; not executed here).

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Reuse-integrity | Engine routes via the child's `evaluateCanary` (no forked algebra) | Route a signal-bearing prompt; compare against the child's canary decision |
| Gating | Flag off / manifest legacy ⇒ inert; both on ⇒ served | `resolve.cjs --hub … --prompt …` with `SPECKIT_COMPILED_ROUTING` on and off |
| Reversibility | Byte-exact rollback per hub | `flip-serving.cjs --hub … --rollback` (`restoredHash` = pre-flip serving-prior) |
| Flip preconditions | P4a-binding, canary green, scorer frozen, engine routes ≥1 scenario | The four gates in `flip-serving.cjs`; a failing gate aborts before any write |
| Manual (gated) | Post-flip real-model routing per hub | LUNA / SOL / MiniMax on playbook prompts after each hub is wired and flipped |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Rollout child engines (per hub) | Internal | Green | No snapshot or routing algebra to reuse |
| P4a activation manifests (per hub) | Internal | Green (bound) | No serving pointer for the resolver or the flip's CAS |
| Frozen benchmark scorer (three pinned digests) | Internal | Green | A drifted scorer would invalidate the canary baseline; the flip aborts |
| Runtime flag `SPECKIT_COMPILED_ROUTING` | Internal | Off (default) | The compiled path is inert until explicitly enabled per rollout |
| Real models (LUNA / SOL / MiniMax) | External | Gated | Post-flip re-verification pending; does not block the engine/resolver/flip build |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A bad or premature flip, a post-flip regression, or a decision to pull a hub back during the bake window.
- **Procedure**: Two independent reversals. Fleet-wide — unset `SPECKIT_COMPILED_ROUTING`, and the resolver returns null everywhere (legacy serves) with no manifest change. Per hub — `flip-serving.cjs --hub <id> --rollback` restores the byte-identical `manifest.serving-prior.json` and advances the fence; confirm `servingAuthority` reverts to `legacy` and `shadowOnly` to `true`. Retain the serving-prior for the full bake window before any cleanup.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Engine + resolver) ──► Phase 2 (Fenced-CAS flip + rollback) ──► Phase 3 (End-to-end proof on sk-code)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (engine + resolver) | Rollout children, P4a manifests | Core |
| Core (flip + rollback) | Setup, pinned scorer | Verify |
| Verify (sk-code proof) | Core | Gated rollout (hub wiring, 7-hub flip, real-model re-verify) |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (engine + resolver) | Med | Reuse the child engine; thin double-gated resolver |
| Core (fenced-CAS flip + rollback) | Med | Gates + byte-exact retain/restore + record |
| Verification (sk-code end-to-end) | Low | One-hub flip → route → rollback |
| Rollout (hub wiring, 7-hub flip, real-model re-verify) | High | Gated; one hub at a time |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-flip checklist
- [x] Hub is P4a-bound (compiled `selectedPolicy`) and the fence epoch is known.
- [x] Frozen-scorer digests re-verified; canary green for the target hub.
- [x] Byte-identical `manifest.serving-prior.json` retained before the swap.

### Rollback procedure
1. Fleet-wide: unset `SPECKIT_COMPILED_ROUTING` (resolver returns null everywhere; no manifest change).
2. Per hub: `flip-serving.cjs --hub <id> --rollback` restores the byte-identical serving-prior and advances the fence.
3. Confirm `servingAuthority` reverts to `legacy`, `shadowOnly` to `true`, and `restoredHash` equals the pre-flip serving-prior hash.

### Data reversal
- **Has runtime effect?** Yes — while a hub is flipped AND the flag is on, the compiled contract serves that hub. The effect is bounded by the default-off flag and undone by either reversal above.
- **Reversal procedure**: Unset the flag (immediate, fleet-wide) or byte-exact per-hub `--rollback`; the post-effect caveat is contained because the flag gates whether any flip takes effect at all.

<!-- /ANCHOR:enhanced-rollback -->
