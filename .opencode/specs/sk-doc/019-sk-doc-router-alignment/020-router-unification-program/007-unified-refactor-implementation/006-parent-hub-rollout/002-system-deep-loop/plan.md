---
title: "Implementation Plan: Unified Router Rollout — system-deep-loop (Phase 006/002)"
description: "Build approach for activating the compiled router contract on system-deep-loop: extract the authored mode-registry projections, compile four explicit projections per public mode into content-addressed destinations that never collapse shared packets or shared runtime keys, project typed decisions back into the existing route-gold observation shape without touching the shared scorer, and run a fenced canary with a proven byte-exact rollback to satisfy the Stage-4 per-hub gate."
trigger_phrases:
  - "system-deep-loop router activation plan"
  - "deep-loop projection compile approach"
  - "per-hub canary rollback drill"
importance_tier: "high"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Unified Router Rollout — system-deep-loop (Phase 006/002)

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact family** | `CompiledPolicyV1` (deep-loop slice), `AdvisorProjectionV1`, `TypedRouteGoldV1`, `PolicyCardV1.md` |
| **Authored inputs (read-only)** | `.opencode/skills/system-deep-loop/mode-registry.json`, `.../SKILL.md`, `.../shared/references/smart_routing.md`, `.../leaf-manifest.json` |
| **Never touched** | `router-replay.cjs` (shared scorer), live `mode-registry.json`, advisor scorer, any skill |
| **Activation mechanism** | Fenced CAS on the activation manifest (token lock + fencing epoch; atomic temp/fsync/rename) |
| **Gate owned** | Stage 4 — Per-hub canary (`system-deep-loop`) |

### Overview
Compile the seven authored `system-deep-loop` public modes into seven content-addressed destinations, each carrying the four explicit projections (`qualifiedPublicMode -> packetRef -> backendKind -> optional runtimeLoopType`) and the full identity tuple from synthesis §2.2. Prove the compiled slice against the existing deterministic route-gold through a compatibility projector so the shared scorer stays byte-unchanged, then activate behind a fenced selector with a demonstrated byte-exact rollback. The build is additive: legacy routing serves until the CAS swap; every step is reversible.

## 2. QUALITY GATES

### Definition of Ready
- [x] The four projection fields and the destination-identity tuple (§2.2) are pinned to the authored `mode-registry.json` rows (no invented modes/packets).
- [x] The two confirmed collapse hazards (shared `deep-improvement` packet; shared `review` runtime key) have explicit no-collapse assertions specified.
- [x] `006/001` (`sk-code`) Stage-4 canary is green (activation-order precondition, §9).

### Definition of Done
- [x] Seven destinations compiled; `count(destinations) == count(publicModes) != count(packets)`.
- [x] Deep-loop route-gold green under shadow replay; `router-replay.cjs` unmodified.
- [x] Stage-4 canary passed: zero hard mismatch, advisor identity matched-or-ignored, document parity, rollback drill proven byte-exact.
- [x] `spec.md` / `plan.md` / `tasks.md` reconciled; no completion claim without the canary evidence.

## 3. ARCHITECTURE

### Pattern
Shadow compiler + additive semantic gates behind a fenced activation selector (synthesis §9). No competing router is introduced; the compiled contract is a second, inactive generation until CAS activation.

### Key Components
- **Deep-loop projection extractor** — reads `mode-registry.json` and emits, per registered mode, the tuple `{workflowMode, packet(=packetRef), packetKind, backendKind, runtimeLoopType|null, routingClass, role}`. Reads `runtimeLoopType` verbatim; never infers it from `workflowMode` (`mode-registry.json:8`).
- **No-collapse compiler pass** — builds `CompiledPolicyV1.destinations[]` keyed by the full identity tuple (§2.2) and asserts injectivity; encodes the shared-packet and shared-runtime relationships as `crossTargetEdges` (backend/runtime projections, §5.3) that annotate — but never merge — destinations.
- **Advisor projection + drift guard** — emits `AdvisorProjectionV1` with `effectivePolicyHash` + projection hash; preserves each mode's `routingClass` (`lexical`/`alias-fold`/`command-bridge`) as a compatibility alias projection; on hash mismatch, advisor evidence degrades to annotation-only (§8.2).
- **Route-gold compatibility projector** — maps typed decisions to the existing `{workflowMode, leafResourceId}` observation shape using the `shared/references/smart_routing.md` surface; positive routes -> intents/resources, `clarify|defer|reject` -> the existing empty-intent convention (§8.2). The shared scorer is a fixed downstream consumer.
- **Fenced activation selector** — snapshots candidate artifacts + prior manifest on accept; on ship, compares expected generation/hash then swaps atomically; requests pin one generation; rollback swaps to the byte-identical prior manifest (§9).
- **Deep-loop `PolicyCardV1.md` generator (P1)** — generates the document-parity card from the same compiled snapshot for the document-only replay lane (§8.3).

### Data Flow
`mode-registry.json` (+ `SKILL.md` three-tier discriminator, `smart_routing.md`) -> projection extractor -> no-collapse compiler -> `CompiledPolicyV1` deep-loop slice (content-addressed) -> three read-only projections (advisor / typed route-gold / policy card) -> shadow replay (zero live authority) -> fenced canary -> CAS activation (or byte-exact rollback).

## 4. AFFECTED SURFACES

This phase authors planning artifacts only; the surfaces below are the read-only authored inputs and the downstream consumers whose contracts the plan must preserve.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mode-registry.json` | Authored source of the seven modes + three-tier discriminator | **not a consumer / read-only** — never edited | `rg -n '"packet"\|"backendKind"\|"runtimeLoopType"\|"routingClass"' mode-registry.json`; 7 mode blocks, 5 packets |
| `SKILL.md` (three-tier discriminator, routing rule) | Documents `workflowMode`/`runtimeLoopType`/`backendKind` + `UNKNOWN_FALLBACK` | read-only | grep "three-tier discriminator", "UNKNOWN_FALLBACK" |
| `shared/references/smart_routing.md` | Benchmark/replay surface mapping mode intent -> `{workflowMode, leafResourceId}` pairs | read-only; the compatibility projector targets this shape | grep the canonical pair emission; confirm scorer input unchanged |
| `router-replay.cjs` (shared scorer) | Deterministic route-gold scorer | **unchanged** — a required edit is a migration failure (§10) | byte-diff = 0 before/after |
| Advisor projection (`system-skill-advisor`) | Layer-0 evidence carrier | contract preserved; identity match-or-ignore | projection-hash drift guard fixture |
| `/deep:*` command bridges | Command-alias routes (`command-bridge` routingClass) | preserved as compatibility projections | dual-read: every command resolves or fails closed |

Required inventories:
- Registered modes vs packets: `rg -n '"packet"' mode-registry.json` (expect 5 distinct values across 7 blocks; `deep-improvement` ×3).
- Runtime-key sharing: `rg -n '"runtimeLoopType"' mode-registry.json` (expect `review` under both `review` and `alignment`; `null` under the three improvement lanes).
- Alias classes: `rg -n '"routingClass"' mode-registry.json` (expect `lexical`/`alias-fold`/`command-bridge`).

## 5. IMPLEMENTATION PHASES

### Phase A: Extract + compile projections (REQ-001..004, 006)
- [x] Enumerate the seven registered modes and extract the four projections + identity tuple per mode from `mode-registry.json`.
- [x] Compile `CompiledPolicyV1.destinations[]` keyed by `(skillId, workflowMode, packetId, packetKind, backendKind)` + `runtimeLoopType` + `role`; assert injectivity over all seven.
- [x] Add no-collapse assertions: `deep-improvement` fan-out (3 distinct) and `review` runtime-key across `deep-review`/`deep-alignment` (2 distinct).
- [x] Fix `selectionKinds={single}`; assert no bundle can be emitted for a deep-loop request.

### Phase B: Projections + parity (REQ-005, 009, 010)
- [x] Emit `AdvisorProjectionV1` with `effectivePolicyHash` + projection hash; preserve `routingClass` aliases; wire the annotation-only degradation on hash mismatch.
- [x] Build the compatibility projector against the `smart_routing.md` `{workflowMode, leafResourceId}` shape; author `TypedRouteGoldV1` fixtures.
- [x] Run shadow parity (zero live authority): deep-loop route-gold stays green; `router-replay.cjs` byte-unchanged.
- [x] (P1) Generate the deep-loop `PolicyCardV1.md`; run the document-only replay lane.

### Phase C: Fenced canary + rollback (REQ-007, 008; Stage-4 gate)
- [x] Dual-read (Stage 2): confirm every `workflowMode`, `/deep:*` command, and advisor alias resolves; unmapped fails closed.
- [x] Verify no over-emission: zero-signal request -> `defer(no-match)` (the `UNKNOWN_FALLBACK` checklist as the `clarify` payload); no default union.
- [x] Run the fenced canary: zero hard mismatch vs legacy; advisor identity matched-or-ignored; document parity passes.
- [x] Execute the rollback drill: CAS swap to the byte-identical prior manifest; assert a mixed-generation request hard-blocks.
- [x] Record the Stage-4 evidence and confirm the gate is open for `006/003` (`mcp-tooling`).

### Implementation Evidence

| Gate | Status | Evidence |
|------|--------|----------|
| Compile | Pass | `7` registry modes compile to `7` distinct public modes and injective destinations across `5` packets; duplicate/missing public modes fail specifically; canonical recompile is byte-identical. |
| No-collapse | Pass | End-to-end authored-registry mutations fail with `SHARED_PACKET_COLLAPSE` and `RUNTIME_KEY_COLLAPSE`. |
| Route-gold | GREEN | `11/11` delivered typed rows pass real read-only `evaluateRouteGold`; `7/7` positives come from live hub output; a persisted coherent tamper fails. |
| Document parity | Pass | `15/15` full-request machine/document decisions match, including constraint-only `reject(forbidden)`; planted divergence fails closed. |
| Activation | Pass | Nine aggregate hard blocks driven; CAS rollback restores byte-identical prior bytes at fence epoch `2`. |
| Strict packet validation | Not run | The execution brief explicitly forbids `validate.sh`; this boundary remains recorded in `tasks.md` and the summary. |

## 6. VERIFICATION

- **Compile correctness**: `count(destinations)==7`, `count(packets)==5`; injectivity assertion green; no-collapse assertions green (both hazards).
- **Scorer untouched**: byte-diff of `router-replay.cjs` == 0; deep-loop route-gold green under the compatibility projector.
- **Authority locality**: fixtures prove every non-`route` decision withholds authority; advisor output is evidence-only.
- **Reversibility**: rollback drill produces the byte-identical prior manifest; mixed-generation request hard-blocks; prior generation retained through the bake window.
- **Doc reconciliation**: run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` before any completion claim; reconcile `spec.md`/`plan.md`/`tasks.md`.

## RELATED DOCUMENTS
- **Specification**: See `spec.md`
- **Task Breakdown**: See `tasks.md`
- **Source design**: `../../../006-unified-refactor-research/unified-refactor-synthesis.md`
- **Master plan**: `../../spec.md`
