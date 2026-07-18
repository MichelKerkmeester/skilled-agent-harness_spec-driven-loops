---
title: "Feature Specification: Unified Router Refactor — sk-code Per-Hub Canary"
description: "Activate the compiled router contract on the sk-code parent hub as the first parent-hub canary (blast radius: evidence composition). Model sk-code's workflow-plus-evidence archetype as a surfaceBundle route — one actor primary (mutatesWorkspace true) plus N read-only evidence roles (mutatesWorkspace false) that can never COMMIT — behind a fenced activation selector, with legacy serving-authoritative until the Stage-4 per-hub canary gate passes. Route-gold stays green, advisor identity matches or is ignored, document parity holds, and a byte-exact rollback drill is proven. The shared scorer is never touched."
trigger_phrases:
  - "sk-code per-hub canary"
  - "surfaceBundle evidence composition activation"
  - "compiled router contract sk-code rollout"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

# Unified Router Refactor — sk-code Per-Hub Canary

## EXECUTIVE SUMMARY

This is the **first parent-hub activation** of the compiled router contract, applied to `sk-code`. It is the second rung of the activation order after the `mcp-code-mode` N=1 base case: `mcp-code-mode → sk-code → system-deep-loop → mcp-tooling`, an order chosen for **increasing semantic blast radius** — cardinality-one, then **evidence composition**, then shared packet/backend projections, then external effects (synthesis §9). This phase owns exactly the second link: evidence composition.

`sk-code` is the canonical **workflow-plus-evidence** archetype (synthesis §7): one acting workflow mode plus zero-or-more read-only surfaces, where the advisor routes a single hub identity and the surfaces are advisor-invisible. The repository confirms this shape — the hub bundles `zero-or-more surfaces as evidence via routerPolicy.outcomes.surfaceBundle`, workflow mode ordered first and surfaces after, with surface packets marked `routingClass: metadata` and a read-only `toolSurface` [Confirmed: `.opencode/skills/sk-code/SKILL.md:53-57`].

The authored shape is now compiled into a `surfaceBundle` route inside the closed decision algebra (synthesis §2.3): a `route` decision whose `selectionKind = surfaceBundle` carries one `actor` target (`mutatesWorkspace = true`) followed by N `evidence` targets (`mutatesWorkspace = false`). The load-bearing invariant is proven: **an evidence target can never COMMIT**, and **evidence ordering is order-of-loading, not effect order** (synthesis §7). The phase-local activation drill uses a fenced compare-and-swap, legacy stays serving-authoritative, and rollback swaps to the byte-identical prior generation. No live routing config, registry, scorer, or skill was modified.

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Implemented — Stage-4 phase-local gate GREEN; legacy serving-authoritative |
| **Created** | 2026-07-18 |
| **Branch** | `006-parent-hub-rollout/001-sk-code` |
| **Migration stage** | Stage 4 — Per-hub canary (synthesis §9) |
| **Blast radius** | Evidence composition (surfaceBundle) — reversible, gated |

## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-code` today routes through a registry-driven hub that reads `mode-registry.json` and applies `routerPolicy.outcomes.surfaceBundle` to bundle a workflow mode with read-only surfaces [Confirmed: `.opencode/skills/sk-code/SKILL.md:50-57`]. That composition logic is expressed only in the hub's authored policy and is invisible to the compiled contract family the refactor introduces. Until `sk-code` is activated behind the compiled `CompiledPolicyV1` evaluator, its evidence composition cannot be typed, replayed deterministically against route-gold, or reasoned about by a document-only agent — and the actor/evidence authority boundary (evidence must never COMMIT) is enforced only by convention, not by an unrepresentable-illegal-state contract.

### Purpose

Prove that `sk-code`'s workflow-plus-evidence archetype compiles into a `surfaceBundle` route on the shared contract with **zero hard route-gold mismatch**, that the actor-only-commits invariant is structurally enforced, and that the activation is fully reversible via a fenced CAS to the retained prior generation — so `system-deep-loop` (the next, higher-blast-radius hub) can activate on a proven foundation.

## 3. SCOPE

### In Scope

- Compile `sk-code`'s authored routing (`mode-registry.json` + `routerPolicy.outcomes.surfaceBundle`) into a `CompiledPolicyV1` destination graph: workflow modes as `actor` destinations (`mutatesWorkspace = true`), surface packets as `evidence` destinations (`mutatesWorkspace = false`), plus the evidence edges between them (synthesis §2.1, §5.3 sk-code row).
- Model the bundle outcome as a single `route { selectionKind: surfaceBundle, targets: [actor, ...evidence] }` decision, with evidence ordered by **order-of-loading** and the actor first (synthesis §2.3, §7).
- Wire the `sk-code` slice through the shared **fenced activation selector**: legacy remains serving-authoritative; the typed evaluator runs behind the fence; a single generation is pinned per request (synthesis §9).
- Satisfy the **Stage-4 per-hub canary gate** for `sk-code`: zero hard mismatch, advisor identity matches-or-ignored, document parity, and a proven rollback drill (synthesis §9 stage table; master plan Shared Migration-Gate Model, Stage 4).
- Add `sk-code`-specific `TypedRouteGoldV1` fixtures via the existing compatibility projector — surfaceBundle routes, actor-cannot-commit assertions, advisor stale/absent parity, ambiguous-leaf clarify, and zero-signal defer (synthesis §8.2).
- Author the generated `PolicyCardV1.md` slice for `sk-code` and prove document-only routing parity (synthesis §8.3).
- Design and prove a **byte-exact rollback drill**: CAS to the retained prior/legacy generation, drift-checked (synthesis §9, §10).

### Out of Scope

- Any live edit to routing config, `mode-registry.json`, the advisor scorer, or the `sk-code` skill. [why] The phase-local candidate and fenced drill prove the gate without converting live files; authority moves in gates (synthesis §9).
- Editing the shared benchmark scorer `router-replay.cjs`. [why] Hard constraint; a scorer edit required to pass is a migration failure, not a licence (synthesis §8.2, §10).
- Building the correction overlay (`CorrectionOverlayV1`) or calibrated auto-route for `sk-code`. [why] Overlay is offline/optional/last (phase 007); at activation `sk-code` runs `overlay = null`, `P = static` (synthesis §5.3 sk-code row, §12).
- Activating `system-deep-loop` or `mcp-tooling`. [why] Those are the next phases (`006/002`, `006/003`) and only activate after this canary's gate is green (synthesis §9 activation order).
- Cross-destination handoff service and the recovery ladder's handoff rung construction. [why] Owned by phase `004`; `sk-code` bundles evidence, it does not hand off across hubs here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `006-parent-hub-rollout/001-sk-code/spec.md` | Create | This specification |
| `006-parent-hub-rollout/001-sk-code/plan.md` | Create | Build approach for the sk-code canary |
| `006-parent-hub-rollout/001-sk-code/tasks.md` | Create | Ordered, checkable task list |
| `006-parent-hub-rollout/001-sk-code/lib/*.cjs` | Create | Compiler, router, authority, policy-card, and activation logic |
| `006-parent-hub-rollout/001-sk-code/fixtures/`, `harness/` | Create | Real-hub fixtures, artifact builder, and Stage-4 validator |
| `006-parent-hub-rollout/001-sk-code/compiled/`, `activation/` | Create | Generated snapshot, accepted candidate, retained prior, and fence state |
| `006-parent-hub-rollout/001-sk-code/checklist.md`, `implementation-summary.md` | Create | Level-2 verification evidence and completion record |

> All implementation files are phase-local. Live runtime files remain read-only; the accepted candidate is shadow-only and legacy remains serving-authoritative.

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Compile `sk-code` into a `CompiledPolicyV1` whose destinations carry `role ∈ {actor, evidence}` and a per-destination `mutatesWorkspace` flag, derived from `packetKind` (`workflow`→actor, `surface`→evidence) (synthesis §2.1, §7). | Compiled destination graph lists every `sk-code` mode with correct `role` and `mutatesWorkspace`; `workflow` modes → `actor`/true, `surface` packets → `evidence`/false; byte-identical recompile from identical authored input. |
| REQ-002 | Express the bundle outcome as `route { selectionKind: surfaceBundle }` with the actor target first and evidence targets ordered by order-of-loading (synthesis §2.3, §7). | For `"review my webflow animation for jank"` the typed decision is `route(surfaceBundle, [code-review(actor), code-webflow(evidence)])`; the ordering matches the authored `surfaceBundle` order (workflow first, surfaces after) [Confirmed: `SKILL.md:57`]. |
| REQ-003 | Structurally enforce **evidence-never-COMMITs**: an `evidence` target cannot reach COMMIT and cannot carry mutation authority (synthesis §7, §9 hard-gate list). | A fixture placing an evidence target into a COMMIT path hard-blocks activation; VERIFY refuses; no fixture can produce a committed effect from a `mutatesWorkspace = false` target. |
| REQ-004 | Preserve deterministic offline route-gold replay via the compatibility projector; the shared scorer is never touched (synthesis §8.2, §10). | `sk-code` typed fixtures project into the existing `observedIntents`/`observedResources` shape; route-gold gate stays green with `router-replay.cjs` unmodified (git diff shows zero scorer change). |
| REQ-005 | Activate behind the fenced selector with legacy serving-authoritative and one generation pinned per request; provide a byte-exact, drift-checked rollback (synthesis §9, §10). | Activation is a token-locked, fencing-epoch CAS; a request never observes mixed generations; rollback drill restores the byte-identical prior manifest and is proven in a fixture. |
| REQ-006 | Advisor is evidence-only for `sk-code`: `live`+identity-match may rank; `stale` annotates; `absent`/`unavailable` contributes zero and local policy continues on last-known-good (synthesis §8.1). | Advisor-stale and advisor-absent fixtures both route deterministically; a projection-hash mismatch downgrades the advisor to annotation; recommendation strength never rewrites a decision. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | No over-emission: zero-leaf-signal yields a typed `defer(no-match)` with no default union, and ambiguous leaf evidence yields exactly one `clarify` (≤3 options + `none_of_these`), never an invented mode (synthesis §2.3, §10; `SKILL.md:64-69` fallback checklist). | Zero-signal fixture → `defer(no-match)` carrying no targets/authority; ambiguous fixture → one `clarify` sourced from the `UNKNOWN_FALLBACK_CHECKLIST`; neither unions the registry. |
| REQ-008 | Document parity: a generated `PolicyCardV1.md` for `sk-code` lets a document-only agent reproduce the same typed decisions, clarify once, defer, reject, and emit `PREPARED_DRAFT` — without claiming live freshness or committed effects (synthesis §8.3). | Document-only replay lane matches the machine policy on the `sk-code` fixture set and never silently falls back to the machine policy; the card is generated from the same compiled snapshot (not a hand-hashed view). |
| REQ-009 | Dual-read (Stage 2) for `sk-code`: every legacy `sk-code` routing input resolves through a declared mode/alias; unmapped inputs fail closed (synthesis §9 stage 2; master plan gate model, Stage 2 owned by `001, 006`). | Every entry in the legacy `sk-code` alias set resolves to a compiled destination; an unmapped alias fails closed (never silently self-routes); the alias array is a compatibility projection with a hash-drift guard. |

## 5. SUCCESS CRITERIA

- **SC-001**: `sk-code` runs behind the fenced typed evaluator in canary with **zero hard route-gold mismatch** against the frozen baseline, `router-replay.cjs` unmodified.
- **SC-002**: The actor/evidence authority boundary is proven unrepresentable-when-illegal: no evidence target can COMMIT, and every non-`route` decision withholds authority (synthesis §2.3, §9).
- **SC-003**: The rollback drill restores the byte-identical prior generation and is demonstrated end to end (accept → ship → rollback), with drift checks passing (synthesis §9).
- **SC-004**: Advisor identity matches or is ignored across `live`/`stale`/`absent` fixtures, and document parity passes for the `sk-code` policy card — the two remaining Stage-4 sub-gates.
- **SC-005**: The phase leaves `system-deep-loop` (`006/002`) unblocked: the compiled `sk-code` slice, its typed fixtures, and its rollback proof are recorded and reproducible.

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shared contract schemas + serialization (phase `000`) | Cannot compile `sk-code` without the canonical `CompiledPolicyV1`/`RouteDecisionV1` shapes | Green: frozen canonical shapes and hashing were reused |
| Dependency | Shadow compiler + N=1 base + fenced selector (phase `001`) | No activation mechanism without the proven selector and rollback primitive | Reuse the `mcp-code-mode`-proven fenced CAS; do not re-invent activation |
| Dependency | Pure evaluator + typed fixtures via projector (phase `002`) | No typed replay without the evaluator and compatibility projector | `sk-code` fixtures extend the `002` projector; scorer stays untouched |
| Risk | A scorer edit appears necessary to pass a `sk-code` fixture | Would violate the hard constraint and invalidate baseline comparability | Treat any required scorer edit as a **migration failure**; fix the projector or the compiled data, never the scorer (synthesis §8.2, §10) |
| Risk | Advisor projection drifts from the compiled generation mid-canary | Mixed-generation routing; advisor smuggles authority | Projection-hash drift-guard downgrades advisor to annotation; requests pin one generation (synthesis §8.1, §9) |
| Risk | Evidence surface silently acquires effect authority | Breaks destination-local authority; an evidence read commits | Structural hard-gate: `mutatesWorkspace = false` targets cannot reach COMMIT; VERIFY refuses (synthesis §7, §9) |

## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: Identical authored `sk-code` input compiles to byte-identical policy bodies; replay never calls a live advisor (synthesis §10).
- **NFR-D02**: One generation is pinned per request; no request observes mixed generations (synthesis §9).

### Authority
- **NFR-A01**: Authority stays destination-local; a proof or advisor recommendation is evidence, never a capability (synthesis §10).
- **NFR-A02**: Every non-`route` decision (`clarify`/`defer`/`reject`) is structurally target-free and authority-free (synthesis §2.3).

### Reversibility
- **NFR-R01**: Activation is a fenced CAS with a retained prior generation; rollback is byte-exact and drift-checked (synthesis §9).
- **NFR-R02**: Rollback cannot undo an external COMMITted effect; for this evidence-composition phase the canary is pre-effect, so rollback is clean (synthesis §9).

## L2: EDGE CASES

### Bundle boundaries
- Single workflow mode, zero surfaces: `route(single, [actor])` — surfaceBundle degenerates, no evidence targets.
- Workflow mode + multiple surfaces: `route(surfaceBundle, [actor, evidence…])` in order-of-loading; actor first.
- Surface requested with no workflow mode: not a standalone route — surfaces are advisor-invisible metadata and cannot be the sole target (synthesis §7; `SKILL.md:57`).

### Negative and ambiguous
- Zero leaf signal: `defer(no-match)` with no default union (synthesis §10).
- Ambiguous mode selection: exactly one `clarify` from the fallback checklist, never an invented mode (`SKILL.md:64-69`).
- Forbidden request: `reject` with authority withheld (synthesis §2.3).

### Degradation
- Advisor absent/unavailable: deterministic routing on last-known-good compiled policy (synthesis §8.1).
- Advisor stale (projection-hash mismatch): advisor downgraded to annotation only.

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One hub, evidence composition; extends shared compiler/evaluator/selector, no new plane |
| Risk | 18/25 | First parent-hub canary; actor/evidence authority boundary; route-gold parity must hold exactly |
| Research | 8/20 | Design fully specified by synthesis §7/§9; residual work is fixture + rollback-drill construction |
| **Total** | **40/70** | **Level 2** |

## 7. MIGRATION GATE

This phase must satisfy the shared migration model's **Stage 4 — Per-hub canary** for `sk-code` before the next phase (`006/002`, `system-deep-loop`) activates (synthesis §9 stage table; master plan Shared Migration-Gate Model, Stage 4 "owned by `006/*`").

**Stage 4 gate (all four sub-conditions, for `sk-code`):**
1. **Zero hard mismatch** — typed replay via the compatibility projector matches route-gold exactly; `router-replay.cjs` unmodified.
2. **Advisor identity matches or is ignored** — `live`+identity-match may rank; `stale`/`absent` degrade gracefully to last-known-good (synthesis §8.1).
3. **Document parity passes** — the generated `sk-code` `PolicyCardV1.md` reproduces the typed decisions via a document-only replay lane (synthesis §8.3).
4. **Rollback drill proven** — byte-exact CAS to the retained prior generation, drift-checked (synthesis §9).

**Upstream sub-gates that must be green for `sk-code` before the canary flips:** Stage 2 (dual-read: every legacy `sk-code` input resolves, unmapped fails closed) and Stage 3 (shadow evaluate: full typed replay deterministic, compatibility projection matches route-gold, gold never auto-updates) — both listed as jointly owned by `006` in the master plan gate model.

**Hard blocks (aggregate score can never override — synthesis §9):** an evidence target that commits; a negative decision carrying a target/tool/authority; a hash mismatch against the pinned tuple; a request observing mixed generations; an exact route emitting clarification/handoff artifacts; a COMMIT lacking VERIFY; a scorer edit required to pass. Any one of these blocks activation regardless of route-gold aggregate.

**Reversibility:** activation is a fenced CAS on the activation manifest with the prior generation retained for the bake window; rollback swaps to the byte-identical prior manifest. Because this phase is evidence composition (pre-effect), rollback is clean; the post-effect caveat (rollback cannot undo an external COMMIT) applies to later destination-rollout phases, not this canary (synthesis §9, §10).

### Implementation Evidence

| Requirement / Criterion | Status | Evidence |
|-------------------------|--------|----------|
| REQ-001, NFR-D01 | Pass | Four roles derive from authored `packetKind`; byte-identical canonical recompile and source-byte mismatch rejection pass. |
| REQ-002 | Pass | Reference request returns actor-first `surfaceBundle [code-review, code-webflow]`. |
| REQ-003, SC-002 | Pass | Evidence VERIFY rejects, evidence COMMIT fails `ROLE_CANNOT_COMMIT`, and legal actor commit requires PREPARE→VERIFY→COMMIT. |
| REQ-004, SC-001 | GREEN | Five typed real-hub rows pass the real read-only scorer; corruption fails; three protected scorer digests remain pinned. |
| REQ-005, SC-003 | Pass | Fenced ship and rollback advance epochs 0→1→2; prior/restored manifest hashes are byte-identical; mixed generations fail closed. |
| REQ-006, SC-004 | Pass | Live identity-match may rank; stale, absent, unavailable, and projection drift cannot rewrite the decision. |
| REQ-007 | Pass | Zero signal and surface-only defer; ambiguous input emits one checklist-derived clarify. |
| REQ-008, SC-004 | Pass | Five document-only decisions match; planted divergence is rejected with no machine fallback. |
| REQ-009 | Pass | All 29 authored aliases resolve and an unknown alias fails closed. |
| SC-005 | Pass | Compiled snapshot, fixtures, validator, rollback proof, checklist, and summary are reproducible inputs for the next hub phase. |

## RELATED DOCUMENTS

- **Build approach**: See `plan.md`
- **Task breakdown**: See `tasks.md`
- **Source design**: `../../../006-unified-refactor-research/unified-refactor-synthesis.md` (§7 sk-code archetype; §9 stages 4/6; §2.3 closed algebra; §8.1–§8.3 three-dimension read; §10 constraint compliance)
- **Master plan**: `../../spec.md` (Phase Documentation Map; Shared Migration-Gate Model)
- **Prior phase (base case)**: `../../001-compiler-n1-shadow/` — the `mcp-code-mode` N=1 activation this canary builds on
- **Next phase**: `../002-system-deep-loop/` — activates only after this canary's Stage-4 gate is green
