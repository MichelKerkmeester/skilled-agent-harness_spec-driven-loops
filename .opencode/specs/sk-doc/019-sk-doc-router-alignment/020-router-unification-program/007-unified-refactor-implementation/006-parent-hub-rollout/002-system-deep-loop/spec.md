---
title: "Feature Specification: Unified Router Rollout — system-deep-loop (Phase 006/002)"
description: "Activate the compiled router contract on the system-deep-loop parent hub. The blast radius here is shared packet/backend projections: seven public modes fan onto five packets and two backends, so the compiler must emit four explicit projections per mode (qualified public mode -> packetRef -> backendKind -> optional runtimeLoopType) without collapsing the three modes that share the deep-improvement packet or the two modes that share the review runtime-loop key across different packets. Advisor/command aliases stay compatibility projections with hash-drift guards. Canary, gated, reversible; route-gold stays green and the shared scorer is never touched."
trigger_phrases:
  - "system-deep-loop router activation"
  - "deep-loop packet backend projections"
  - "shared deep-improvement packet no-collapse"
importance_tier: "high"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Unified Router Rollout — system-deep-loop (Phase 006/002)

## EXECUTIVE SUMMARY

This phase activates the council-synthesized compiled router contract (`../../../006-unified-refactor-research/unified-refactor-synthesis.md`) on the **`system-deep-loop`** parent hub — the third hub in the blast-radius activation order `mcp-code-mode -> sk-code -> system-deep-loop -> mcp-tooling` (synthesis §9). It runs **after** `sk-code` (006/001) passes its per-hub canary and **before** `mcp-tooling` (006/003) activates.

`system-deep-loop` is the archetype the synthesis names "public mode / packet / backend / runtime" (§7). Its distinguishing hazard is that the surface mode name is **not** a sufficient destination identity: seven public modes fan onto five packets and two backends, with a runtime-loop discriminator that is authored explicitly and "NEVER inferred from `workflowMode`" [Confirmed: `.opencode/skills/system-deep-loop/mode-registry.json:8`, `.../SKILL.md` "three-tier discriminator"]. Two independent collapse hazards are live and confirmed in the registry: (1) three improvement lanes (`agent-improvement`, `model-benchmark`, `skill-benchmark`) share `packet=deep-improvement` [`mode-registry.json:115,141,164`]; (2) `review` and `alignment` share `runtimeLoopType=review` but map to different packets (`deep-review` vs `deep-alignment`) [`mode-registry.json:57,67,177,187`].

The work is therefore **not** a router rewrite. It is: compile the four explicit projections per mode, prove the compiled `system-deep-loop` policy against the existing deterministic route-gold through a compatibility projector (the shared scorer `router-replay.cjs` is never edited), run a fenced canary with a proven byte-exact rollback, and hand a green Stage-4 gate to `mcp-tooling`. Legacy routing stays serving-authoritative until the fenced CAS activation binds the compiled tuple.

**Implementation status (2026-07-19):** Stage-4 route-gold is fully `real-green`: all 11 rows, including all 7 positive routes, pass the real read-only scorer with 0 `shadow-partial`. Seven mode selections compile to 19 typed leaf pairs validated against 584 manifest identities; the compatibility projector resolves their packet-qualified resources without legacy backfill. Document parity, fencing, mixed-generation refusal, and byte-exact rollback pass. Legacy remains serving-authoritative and the candidate remains shadow-only; strict packet validation is pending the final documentation reconciliation.

## PROBLEM & PURPOSE

### Problem Statement
Under the pre-refactor model, a destination is addressed by `workflowMode` name or packet path. For `system-deep-loop` both keys are ambiguous: `deep-improvement` is reached from three distinct public modes, and the `review` runtime-loop key is reached from two modes that run different packets. Any router that keys on packet path silently merges the three improvement lanes into one destination — erasing their distinct advisor routing (`alias-fold` vs `command-bridge`, `mode-registry.json:122,148,171`) and distinct public identity — and any router that keys on the runtime-loop label merges `review` with `alignment`. Neither is a safe universal identity (synthesis §2.2), and a wrong merge here corrupts benchmark attribution and advisor routing for the whole hub.

### Purpose
Activate the compiled contract on `system-deep-loop` such that every qualified public mode compiles to exactly one destination identity — never one-per-packet — with route-gold green, advisor identity matched-or-ignored, document parity proven, and a demonstrated byte-exact rollback, so the Stage-4 per-hub canary gate opens for `mcp-tooling`.

## SCOPE

### In Scope
- Compile **four explicit projections per public mode**: `qualifiedPublicMode -> packetRef -> backendKind -> optional runtimeLoopType`, sourced from the authored `mode-registry.json`, into `CompiledPolicyV1.destinations[]` for `skillId=system-deep-loop` (synthesis §7).
- Enforce **no-collapse** on the two confirmed hazards: shared `deep-improvement` packet (3 modes) and shared `review` runtime-loop key across different packets (`review`/`alignment`).
- Set the **destination identity** to `(skillId, workflowMode, packetId, packetKind, backendKind)` + the runtime discriminator (`runtimeLoopType`) + `role` (synthesis §2.2), and prove it injective across all seven modes.
- Keep **advisor and `/deep:*` command aliases as compatibility projections** carrying `effectivePolicyHash` + a projection hash-drift guard (synthesis §7, §8.2).
- Build the **deep-loop route-gold compatibility projection** (typed decisions -> the existing `{workflowMode, leafResourceId}` observation shape via `shared/references/smart_routing.md`), add typed fixtures, and run shadow parity with zero live authority (synthesis §8.2).
- Run the **fenced per-hub canary + rollback drill** for `system-deep-loop` and satisfy the Stage-4 gate (see MIGRATION GATE).

### Out of Scope
- Editing any live routing config, `mode-registry.json`, the advisor scorer, or any skill — this phase is planning/design only.
- Editing the shared benchmark scorer `router-replay.cjs` — hard constraint; a required scorer edit is a migration failure, not a licence (synthesis §10).
- The `mcp-code-mode` (001) singular case, `sk-code` (006/001) evidence-bundle rollout, and `mcp-tooling` (006/003) transport/judgment rollout — separate phases.
- The learning overlay (007) and calibrated auto-route corpus (005) — deep-loop ships with `overlay=null` and `basis: signal` (synthesis §5.3); calibration and overlay are additive later corners.
- Re-deriving the eight ideas or the synthesis; this phase consumes the approved design.

## REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Compile four explicit projections per registered public mode (`qualifiedPublicMode -> packetRef -> backendKind -> optional runtimeLoopType`) into the compiled `system-deep-loop` policy (§7). | `CompiledPolicyV1.destinations[]` for `skillId=system-deep-loop` contains **one destination per public mode (7)**, not one per packet (5); each carries all four projection fields; missing/`null` `runtimeLoopType` is read from the registry, never inferred (`mode-registry.json:8`). |
| REQ-002 | Preserve shared-packet fan-out: `agent-improvement`, `model-benchmark`, `skill-benchmark` remain three distinct destinations that share `packetId=deep-improvement`, `packetKind`, and `backendKind=improvement-host`, discriminated by `workflowMode` (§7, §5.3). | A compile that maps any two `deep-improvement` modes to a single destination **hard-fails** the no-collapse assertion; the three lanes retain their distinct `routingClass` (`alias-fold`/`command-bridge`). |
| REQ-003 | Preserve runtime-key disambiguation: modes sharing a `runtimeLoopType` but mapping to different packets stay distinct (§2.2). | `review` (`deep-review`) and `alignment` (`deep-alignment`) compile to two destinations with identical `runtimeLoopType=review` but different `packetId`; a collapse-by-runtime-key hard-fails. |
| REQ-004 | Destination identity = `(skillId, workflowMode, packetId, packetKind, backendKind)` + `runtimeLoopType` discriminator + `role` (§2.2). | The identity function is **injective** across all seven modes; no two modes share a full identity tuple; the assertion is a fixture in the typed gold. |
| REQ-005 | Advisor/command aliases stay compatibility projections with a hash-drift guard (§7, §8.2). | `AdvisorProjectionV1` for the hub carries `effectivePolicyHash` + projection hash; each mode's `routingClass` is preserved as an alias projection; a projection-hash mismatch degrades advisor output to **annotation-only** (never rewrites a route), extending the existing projection drift-guard. |
| REQ-006 | `selectionKind` is always `single` for deep-loop; no bundles (§5.3, §2.3). | Compiled `selectionKinds={single}`; any `orderedBundle`/`surfaceBundle` emission on a deep-loop request hard-fails activation. |
| REQ-007 | No over-emission on ambiguity: low-confidence / no-dominant-mode classify yields typed `defer`/one `clarify` (the existing `UNKNOWN_FALLBACK` disambiguation checklist), never a union of all modes (§10). | Zero-signal deep-loop request produces `defer(no-match)` with empty `targets`; route-gold shows **no default union**; the disambiguation checklist is the `clarify` payload. |
| REQ-008 | Fenced, reversible activation: CAS swap on the activation manifest (token lock + fencing epoch checked immediately before rename; atomic temp/fsync/rename), prior generation retained, requests pin one generation (§9). | A rollback drill swaps to the **byte-identical** prior manifest; a request observing mixed generations **hard-blocks**; the prior generation is retained through the bake window. |
| REQ-009 | Route-gold parity preserved WITHOUT touching the scorer: a compatibility projector maps typed deep-loop decisions into the existing `{workflowMode, leafResourceId}` observation shape via `shared/references/smart_routing.md` (§8.2, §10). | `router-replay.cjs` byte-unchanged; deep-loop route-gold stays green under shadow replay; positive routes -> intents/resources, `clarify\|defer\|reject` -> the existing empty-intent convention; a scorer edit to pass = migration failure. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Generate a deep-loop `PolicyCardV1.md` document-parity projection from the same compiled snapshot (§8.3). | The card enumerates the seven qualified modes with their packet/backend/runtime discriminators, negative reasons, and the honest terminal (`DOCUMENT_ONLY_UNATTESTED`/`PREPARED_DRAFT`); a document-only replay lane matches the machine policy on the deep-loop fixture set (a matching `humanViewHash` alone is insufficient). |

## SUCCESS CRITERIA

- **SC-001**: All seven registered `system-deep-loop` public modes compile to **seven distinct destination identities** — asserted as `count(destinations) == count(publicModes)`, explicitly `!= count(packets)`; zero collapses.
- **SC-002**: Shadow replay of the deep-loop route-gold is deterministic and byte-stable; the compatibility projection matches the existing gold with **zero hard mismatch**; `router-replay.cjs` is unmodified.
- **SC-003**: The Stage-4 per-hub canary on `system-deep-loop` shows zero hard mismatch vs legacy, advisor identity matches or is ignored, document-parity passes, and the rollback drill is proven byte-exact.
- **SC-004**: Ambiguous / zero-signal deep-loop requests emit typed `defer`/`clarify` with **no default union** (no over-emission).
- **SC-005**: Activation is reversible — the prior generation is retained and a CAS swap + rollback drill is demonstrated **before** `mcp-tooling` (006/003) is allowed to activate.

## MIGRATION GATE

Per the master plan's shared migration-gate model (`../../spec.md`, "SHARED MIGRATION-GATE MODEL"), this phase is principally the **Stage 4 — Per-hub canary** gate for `system-deep-loop` (owned by `006/*`):

> **Gate to advance:** zero hard mismatch; advisor identity matches or is ignored; document parity passes; rollback drill proven.

This phase **must satisfy the Stage-4 canary gate for `system-deep-loop` before phase `006/003` (`mcp-tooling`) may activate**, and it may only begin after `006/001` (`sk-code`) has passed its own Stage-4 gate — honoring the activation order `mcp-code-mode -> sk-code -> system-deep-loop -> mcp-tooling` (synthesis §9). While inside this phase it also re-exercises, scoped to deep-loop's projections:

- **Stage 2 — Dual-read** (co-owned `001, 006`): every legacy deep-loop input (each `workflowMode`, `/deep:*` command, and advisor alias) resolves through a declared mode/alias; an unmapped input **fails closed**.
- **Stage 3 — Shadow evaluate** (co-owned `002, 006`): full typed replay is deterministic; the compatibility projection matches route-gold; the gold **never auto-updates**.
- **Stage 6 — Destination rollout** (co-owned `003, 006/*`): read-only legs before any mutating leg; proof/expiry/epoch/idempotency/receipt discipline is destination-local.

Rollback is a fenced CAS swap to the byte-identical prior manifest; it **cannot** undo an external COMMITted effect — post-effect recovery is destination-owned (synthesis §9). A negative decision carrying a target/authority, an evidence target committing, a hash mismatch against the pinned tuple, a mixed-generation request, `single`-only violated by a bundle, or a collapse of two same-packet/same-runtime-key modes each **hard-blocks** activation (synthesis §9).

## NON-NEGOTIABLE CONSTRAINTS (every phase)

These apply to this phase and all sibling rollout phases (synthesis §10; master plan "Hard constraints"):

1. **Deterministic offline route-gold replay preserved.** Identical inputs compile to byte-identical policy bodies; replay never calls a live advisor.
2. **NEVER touch the shared benchmark scorer (`router-replay.cjs`).** Parity is achieved only through the compatibility projector; a required scorer edit is a migration failure.
3. **Authority stays destination-local.** A proof or an advisor recommendation is **evidence, never a capability**; only destination VERIFY -> COMMIT consumes authority; every non-`route` decision structurally withholds authority.
4. **Reversible + gated.** Fenced CAS activation with a retained prior generation; requests pin one generation; a proven rollback drill precedes hand-off.
5. **No over-emission.** Zero-signal yields a typed `defer` with no fallback/default union; the full mode registry is never unioned into scored routes.

### Implementation Evidence

| Requirement / Criterion | Status | Evidence |
|-------------------------|--------|----------|
| REQ-001, REQ-004, SC-001 | Pass | `7` authored modes compile to `7` distinct public modes and injective identity tuples across `5` packets; duplicate/missing public modes fail specifically; byte-identical recompile and source mismatch rejection pass. |
| REQ-002 | Pass | Three `deep-improvement` destinations preserve distinct modes and routing classes; an authored-registry mutation fails full compile as `SHARED_PACKET_COLLAPSE`. |
| REQ-003 | Pass | `review` and `alignment` preserve separate packets at runtime key `review`; an authored-registry packet merge fails full compile as `RUNTIME_KEY_COLLAPSE`. |
| REQ-005 | Pass | Advisor projection preserves all routing classes; stale/absent/unavailable/hash-drift evidence cannot rewrite a route. |
| REQ-006 | Pass | All seven positive cases are `single`; a planted bundle fails `BUNDLE_EMISSION_FORBIDDEN`. |
| REQ-007, SC-004 | Pass | Zero signal defers with empty targets and observations; ambiguity emits one checklist-derived clarify. |
| REQ-008, SC-003, SC-005 | Pass | Fenced ship/rollback advances epoch `0→1→2`; prior/restored bytes match, mixed generations fail closed, and the Stage-4 canary is eligible while authority intentionally remains legacy/shadow-only. |
| REQ-009, SC-002 | Pass | Real read-only `evaluateRouteGold` scores all 11 projector observations `real-green` with 0 `shadow-partial`. Seven selections compile to 19 manifest-validated leaf pairs; `single-research` proves byte-identical compiled resources, projector resources, and scored resources. `legacyBackfillUsed` is false, a coherently corrupted persisted resource fails `resource-mismatch`, and scorer digests remain pinned. |
| REQ-010 | Pass | Generated card enumerates seven projections; `15/15` full-request document decisions match, constraint-only reject is covered, and a planted divergence fails. |
| Packet strict validation | Pending | Run after the final status/evidence reconciliation; no completion claim is made before it passes. |

## RELATED DOCUMENTS

- **Source design**: `../../../006-unified-refactor-research/unified-refactor-synthesis.md` (§2.2 destination identity, §5.3 complexity dial, §7 deep-loop archetype, §8.2 benchmark read, §9 migration, §10 constraints)
- **Master plan (phase parent)**: `../../spec.md` (phase map + shared migration-gate model)
- **Sibling phases**: `../001-sk-code/` (predecessor canary), `../003-mcp-tooling/` (successor canary)
- **Authored source consumed (read-only)**: `.opencode/skills/system-deep-loop/mode-registry.json`, `.opencode/skills/system-deep-loop/SKILL.md`, `.opencode/skills/system-deep-loop/shared/references/smart_routing.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
