---
title: "Implementation Plan: Unified Router Refactor — sk-code Per-Hub Canary"
description: "Build approach for activating the compiled router contract on sk-code as the first parent-hub canary: compile the workflow-plus-evidence archetype into a surfaceBundle route (one actor + N read-only evidence roles that never COMMIT), wire it behind the fenced activation selector with legacy serving-authoritative, add typed route-gold fixtures via the compatibility projector (scorer untouched), prove advisor-identity degradation and document parity, and demonstrate a byte-exact rollback drill."
trigger_phrases:
  - "sk-code canary build approach"
  - "surfaceBundle compile and activation plan"
  - "fenced selector rollback drill sk-code"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Unified Router Refactor — sk-code Per-Hub Canary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Contract family** | `CompiledPolicyV1`, `RouteDecisionV1` (surfaceBundle), `AdvisorProjectionV1`, `TypedRouteGoldV1`, `PolicyCardV1.md` (synthesis §2.1) |
| **Activation mechanism** | Fenced activation-manifest selector; token-locked, fencing-epoch CAS (synthesis §9) |
| **Benchmark** | Deterministic offline route-gold via `router-replay.cjs` — read-only, never edited (synthesis §8.2, §10) |
| **Serving authority (canary)** | Legacy `sk-code` hub remains authoritative until the Stage-4 gate passes |
| **Overlay / calibration** | `overlay = null`, `P = static` at activation (synthesis §5.3 sk-code row) |

### Overview

`sk-code`'s authored routing is compiled into the shared contract and its bundle outcome is modeled as a `surfaceBundle` route (one `actor` + N `evidence`). The **first parent-hub canary** is phase-locally proven behind the fenced selector — the second link in the blast-radius order after `mcp-code-mode` (synthesis §9). The work is additive: a compiled snapshot, typed fixtures, real-scorer replay, and rollback drill, with legacy serving-authoritative and the scorer untouched.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Contract schemas (`000`), shadow compiler + fenced selector (`001`), and evaluator + projector (`002`) are landed and frozen.
- [x] The frozen legacy route-gold baseline for `sk-code` is recorded (Stage 0).
- [x] `sk-code`'s authored routing surface is inventoried: workflow modes, surface packets, `routerPolicy.outcomes.surfaceBundle`, and the legacy alias set [Confirmed: `.opencode/skills/sk-code/SKILL.md:50-57`].

**Evidence**: All upstream harnesses exit 0; the final canary pins the real scorer digests and compiles four destinations plus 29 aliases from the live authored inputs.

### Definition of Done
- [x] `sk-code` runs behind the typed evaluator in canary with zero hard route-gold mismatch; scorer digests unchanged.
- [x] Actor-only-commits proven structurally; every non-`route` decision withholds authority.
- [x] Advisor `live`/`stale`/`absent` parity and document parity both pass.
- [x] Multi-candidate signal routes pass through the selective controller and require a live certificate bound to the pinned policy and risk slice.
- [x] Byte-exact rollback drill demonstrated end to end.
- [x] spec.md / plan.md / tasks.md reconciled; no conflicting completion claims.
- [ ] Strict Level-2 packet validation passes without out-of-scope package rebuilds or structural rewrites.

**Evidence**: `validate-canary.cjs` reports `status: GREEN`, `certificateGate: pass`, `routeGold: GREEN`, document/advisor/rollback pass, and `servingAuthority: legacy`. Strict validation remains blocked by missing generated package runtime files, missing local `tsx`, and legacy packet structure that predates this scoped fix.

---

## 3. ARCHITECTURE

### Pattern

Shadow compile + additive semantic gate behind a fenced selector (synthesis §9). No router rewrite: the compiled `sk-code` policy is a projection of the authored registry, activated by a fenced CAS while legacy serves.

### Key components (and the contracts they touch)

- **`sk-code` destination graph** — compiled from `mode-registry.json`: each `workflow` mode → an `actor` destination (`mutatesWorkspace = true`); each `surface` packet → an `evidence` destination (`mutatesWorkspace = false`), tagged `routingClass: metadata` to stay advisor-invisible. Destination identity is `(skillId, workflowMode, packetId, packetKind, backendKind)` plus role (synthesis §2.2). Grounded in `SKILL.md:52-57` (the `workflowMode` / `packetKind` / `backendKind` discriminators).
- **surfaceBundle route shape** — `route { selectionKind: surfaceBundle, targets: NonEmpty<Target> }` where `targets[0]` is the actor and `targets[1..]` are evidence, ordered by **order-of-loading** (workflow first, surfaces after), not effect order (synthesis §2.3, §7). `selectionKind` is a field inside `route`, never a top-level action.
- **Actor/evidence authority fence** — the compiled `mutatesWorkspace` flag plus the destination-local PREPARE→VERIFY→COMMIT lifecycle: only an `actor` target can reach COMMIT; an `evidence` target's authority is structurally withheld and VERIFY refuses any evidence-COMMIT (synthesis §7, §9 hard-gate list).
- **Compatibility projector (reused from `002`)** — maps typed `sk-code` decisions back into the existing `observedIntents`/`observedResources` shape: positive surfaceBundle routes → intents/resources; `clarify|defer|reject` → the existing empty-intent convention; typed leaf pairs → current manifest-aware resource observations. The scorer is never touched (synthesis §8.2).
- **`AdvisorProjectionV1` for sk-code** — hub id, aliases, eligible modes with `qualifiedId`/`publicMode`/`routingClass`, admission labels, `effectivePolicyHash`, projection hash; omits paths, tools, mutation scope, fences, commit authority. Advisor output is one evidence record with `live`/`stale`/`absent` trust state (synthesis §8.1).
- **`PolicyCardV1.md` for sk-code** — generated from the same compiled snapshot; carries identity/hashes, admission/precedence, qualified roles, bundle grammar, negative reasons, authority edges, lifecycle checklist, explicit limitations. Feeds a document-only replay lane (synthesis §8.3).
- **Fenced activation manifest entry for sk-code** — acceptance snapshots the candidate artifacts + prior manifest; ship compares expected generation/hash then swaps atomically under a token lock + fencing epoch checked immediately before rename (synthesis §9; confirmed repo safety properties: atomic temp/fsync/rename, accept/ship with preimage drift checks + rollback).

### Data flow

Authored `sk-code` registry → pure compiler → `CompiledPolicyV1` (sk-code slice) + `AdvisorProjectionV1` + `PolicyCardV1.md` → fenced selector pins one generation per request → evidence adapters build `RouteRequestV1` (advisor as one trust-tagged evidence record) → pure evaluator emits `RouteDecisionV1` (`surfaceBundle` for bundle intents) → compatibility projector → route-gold replay (scorer read-only). Rollback = CAS back to the retained prior generation.

---

## FIX ADDENDUM: AFFECTED SURFACES

This phase touches shared policy and route composition, so the surface inventory is required before any implementation lands.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mode-registry.json` (sk-code) | Authored source of truth for modes | Read-only input to the compiler | Compiled graph round-trips every declared mode; byte-identical recompile |
| `routerPolicy.outcomes.surfaceBundle` | Authored bundle composition rule | Compiled into surfaceBundle route shape | `[code-review, code-webflow]` example reproduces (synthesis §7; `SKILL.md:57`) |
| surface packets (`code-webflow`, `code-opencode`) | Read-only evidence, `routingClass: metadata` | Compiled as `evidence`/`mutatesWorkspace=false` | Advisor-invisible; cannot be a sole target; cannot COMMIT |
| `router-replay.cjs` (shared scorer) | Deterministic route-gold scorer | **Unchanged — not a consumer** | `git diff` empty; a required edit is a migration failure |
| `AdvisorProjectionV1` consumer | Layer-0 advisor evidence | Add sk-code projection + drift guard | Stale/absent fixtures degrade gracefully |
| route-gold fixtures / gate | Baseline parity harness | Add sk-code typed fixtures via projector | Gate green; gold never auto-updates |

Required inventories before implementation:
- Legacy `sk-code` alias set (dual-read Stage 2): `rg -n 'alias|legacy|route' <sk-code registry + hub>` — every alias must resolve or fail closed.
- Consumers of the changed decision shape: confirm nothing downstream reads a flat six-value outcome enum; `selectionKind` stays inside `route`.
- Authority invariant: evidence targets (`mutatesWorkspace=false`) have no COMMIT path; adversarial fixture proves VERIFY refusal.

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Compile and shape
- [x] Inventory `sk-code` authored routing (modes, surfaces, surfaceBundle rule, aliases).
- [x] Compile the `sk-code` destination graph with `role` + `mutatesWorkspace` derived from `packetKind`.
- [x] Model the bundle outcome as `route(surfaceBundle, [actor, ...evidence])`, order-of-loading.
- [x] Generate `AdvisorProjectionV1` and `PolicyCardV1.md` for sk-code from the same snapshot.

**Evidence**: Generated snapshot contains four destinations and canonical policy/advisor/card artifacts; identical authored bytes reproduce the fixed hashes.

### Phase 2: Fixtures and parity (scorer untouched)
- [x] Add `TypedRouteGoldV1` fixtures: surfaceBundle route; single-mode degenerate; evidence-cannot-commit hard-block; advisor stale/absent parity; ambiguous-leaf clarify; zero-signal defer; forbidden reject; dual-read unmapped-fails-closed.
- [x] Project typed decisions through the compatibility projector; run route-gold; confirm zero hard mismatch and unchanged scorer digests.
- [x] Run the document-only replay lane against the sk-code policy card; confirm parity.

**Evidence**: Five decision rows pass real `evaluateRouteGold`; a validated identity-matched certificate emits the reference bundle, four invalid certificate states abstain, the direct-evaluator bypass emits the forbidden signal bundle, and corrupted route-gold/document observations both fail.

### Phase 3: Fenced activation + rollback drill
- [x] Add the sk-code entry to the fenced activation manifest (candidate generation), legacy serving-authoritative.
- [x] Prove one-generation pinning per request; assert no mixed-generation observation.
- [x] Execute the rollback drill: accept → ship (canary) → rollback CAS to the byte-identical prior generation; confirm drift checks pass.
- [x] Reconcile the Stage-4 gate checklist; record evidence for `006/002` handoff.

**Evidence**: Actual phase-local CAS reaches generation 2, rejects mixed pins, and restores the retained generation at fencing epoch 2 with byte-exact prior/restored hashes.

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Deterministic replay | sk-code typed fixtures via compatibility projector | route-gold gate (`router-replay.cjs`, read-only) |
| Authority invariant | evidence-cannot-COMMIT; negatives withhold authority | typed hard-block fixtures + VERIFY refusal assertion |
| Degradation | advisor live/stale/absent; projection-hash drift | advisor-evidence fixtures |
| Document parity | doc-only routing off the policy card | document-only replay lane (no machine fallback) |
| Reversibility | accept/ship/rollback CAS; byte-exact prior generation | rollback-drill fixture + drift check |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Contract schemas + serialization (`000`) | Internal | Green | Frozen canonical shapes and hashing reused |
| Shadow compiler + N=1 base + fenced selector (`001`) | Internal | Green | Fenced selector and compiled shape reused |
| Pure evaluator + compatibility projector (`002`) | Internal | Green | Typed evaluator and scorer-safe projector reused |
| Frozen legacy route-gold baseline (Stage 0) | Internal | Green | Three scorer digests pinned and rechecked |
| `sk-code` registry stability during canary | Internal | Green | Raw authored bytes hash-bound before compilation; drift fails closed |

---

## 7. ROLLBACK PLAN

- **Trigger**: Any Stage-4 hard block — an evidence target reaching COMMIT, a hash mismatch against the pinned tuple, a mixed-generation observation, a surfaceBundle route emitting clarify/handoff artifacts, a required scorer edit, or a route-gold hard mismatch.
- **Procedure**: Fenced CAS on the activation manifest back to the retained prior/legacy generation; verify the restored bytes match the retained preimage (drift check); confirm legacy resumes serving-authoritative. Because this canary is evidence composition (pre-effect), rollback is clean — no external COMMITted effect exists to undo (synthesis §9, §10). Retain the prior generation for the full bake window before any cleanup (deferred to phase `008`).
