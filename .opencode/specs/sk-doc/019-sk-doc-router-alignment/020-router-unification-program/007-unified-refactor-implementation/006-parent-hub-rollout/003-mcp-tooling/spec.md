---
title: "Feature Specification: Parent-Hub Rollout — Activate the Compiled Contract on mcp-tooling (Phase 006/003)"
description: "Final and highest-blast-radius parent-hub activation of the unified router refactor: bind the compiled EffectivePolicy to mcp-tooling behind a fenced activation selector. mcp-tooling carries two composition edge kinds — composeAfter (ordered effect-capable transport steps) and requiresAuthorityFrom (a judgment/authority dependency that must approve before a dependent transport commits) — and the highest external-effect surface in the fleet. Transports never own design judgment; mcp-code-mode stays external infrastructure. Worked case: a design-affecting Figma route composes sk-design/<mode> then mcp-tooling/mcp-figma, the transport receiving destination-local authority only for the approved intent. Canary, gated, reversible; the shared scorer is never touched."
trigger_phrases:
  - "mcp-tooling router activation"
  - "compose after requires authority from"
  - "transport authority destination-local rollout"
importance_tier: "critical"
contextType: "implementation"
status: "implemented; execution-plane idempotency binding aligned; Stage-4 and Stage-6 GREEN; strict packet validation blocked by legacy template/runtime prerequisites; legacy remains authoritative"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Parent-Hub Rollout — Activate the Compiled Contract on mcp-tooling (Phase 006/003)

## EXECUTIVE SUMMARY

This phase activates the unified compiled router contract on `mcp-tooling` — deliberately **last** in the fleet activation order `mcp-code-mode → sk-code → system-deep-loop → mcp-tooling` because it carries the highest semantic blast radius: external effects plus cross-hub judgment [synthesis §9, §11 Q1]. Activation is not a rewrite of the tooling hub; it binds the already-compiled `EffectivePolicy` (produced by phase `001`, evaluated by phase `002`, executed through the PREPARE→VERIFY→COMMIT machinery of phase `003-execution-verify-commit`) to `mcp-tooling` behind a fenced activation-manifest selector, with legacy staying serving-authoritative until each gate passes [master plan SHARED MIGRATION-GATE MODEL; synthesis §9].

`mcp-tooling` is the one archetype the synthesis models with **composition edges** and a **judgment dependency** [synthesis §7]. It needs exactly two edge kinds in compiled data:

- **`composeAfter`** — ordered, effect-capable transport steps that must run in a fixed sequence.
- **`requiresAuthorityFrom`** — an authority dependency: a judgment destination that must approve an intent *before* a dependent transport is permitted to commit its effect.

The load-bearing correctness property is that **transports never own design judgment**, and `mcp-code-mode` stays external infrastructure — never a taste authority [synthesis §7, §6 "Transport as taste authority" eliminated; `.opencode/skills/mcp-tooling/SKILL.md:15,32-36`]. The worked case is a design-affecting Figma route: the compiled policy composes `sk-design/<mode>` (the judgment destination) then `mcp-tooling/mcp-figma` (the transport); the transport receives destination-local authority **only for the approved intent**, and only after `sk-design`'s VERIFY has run [synthesis §7, §2.1 `RouteProofV1`, §2.3 `authority: WithheldUntilVerify`].

This is planning/design only. No live routing config, registry, scorer, or skill is modified in this packet.

## 2. PROBLEM & PURPOSE

### Problem Statement

The three preceding parent-hub activations (`sk-code`, `system-deep-loop`) exercise evidence composition (`surfaceBundle`) and shared-packet/backend projections, but none of them has an **effect-ordered transport chain** or a **cross-hub judgment approval that must precede an external commit**. `mcp-tooling` is where those two properties appear together and where a routing mistake produces a real, irreversible external effect (a committed Figma mutation, a pushed change) rather than a recoverable in-repo one. Two failure modes are unique to this surface and must be made structurally unrepresentable before activation:

1. **A transport supplying judgment.** If `mcp-tooling/mcp-figma` could route a design-affecting intent without `sk-design/<mode>` having approved it, the transport would have silently acquired taste authority it must never hold [synthesis §7; §6 eliminated alternative].
2. **An out-of-order or unauthorized commit.** If a `composeAfter` step could commit before its predecessor, or a dependent transport could commit while its `requiresAuthorityFrom` edge is unsatisfied, the ordered/authority contract is violated and an external effect escapes the fence [synthesis §9 hard gates].

Because the blast radius is external and post-COMMIT recovery is destination-owned (a rollback of the activation manifest **cannot** undo an already-committed external effect), this phase cannot rely on "roll back and retry" the way earlier in-repo phases could [synthesis §9].

### Purpose

Activate the compiled contract on `mcp-tooling` such that: composition edges (`composeAfter`, `requiresAuthorityFrom`) live entirely in compiled data; authority stays destination-local and is consumed only at each destination's VERIFY→COMMIT; the fenced selector makes activation a reversible CAS on the activation manifest; and every read-only leg is proven before any mutating leg is enabled [synthesis §7, §9; master plan Stage 4 + Stage 6]. Prove the design-affecting Figma worked case end-to-end as the canonical acceptance scenario.

## 3. SCOPE

### In Scope

- Author the `mcp-tooling` destination graph as compiled data: `destinations[]` with `role ∈ {actor, evidence, transport, judgment}`, `compositionRules[]` carrying `composeAfter` and `requiresAuthorityFrom`, and `authorityGraph[]` edges [synthesis §2.1, §2.2, §7].
- Specify the compiled `selectionKinds` for this hub as `{single, orderedBundle}` (no `surfaceBundle`; ordering here is *effect order*, distinct from `sk-code`'s order-of-loading evidence) [synthesis §5.3 table, §7].
- Specify the fenced activation-manifest selector for `mcp-tooling`: accept snapshot of candidate artifacts + prior manifest, expected-generation/hash compare, atomic swap under token lock + fencing epoch [synthesis §9].
- Define the Stage 4 per-hub canary gate and the Stage 6 destination-rollout gate for this hub, including read-only-legs-before-mutating-legs sequencing [master plan Stage 4, Stage 6; synthesis §9].
- Specify the `TypedRouteGoldV1` fixture families this activation must pass via the existing compatibility projector — specifically `role escalation + missing authority dependency`, plus the ordered-bundle and forbidden-handoff-artifact families [synthesis §8.2].
- Define the worked `sk-design/<mode> → mcp-tooling/mcp-figma` design-affecting Figma route as the canonical acceptance and canary scenario [synthesis §7].
- Define the rollback drill and the explicit statement of what rollback cannot undo (external COMMITted effects) [synthesis §9].

### Out of Scope

- Editing any live routing config, `mode-registry.json`, `hub-router.json`, the activation manifest in production, or any skill — this packet is planning/design only.
- **Any modification to the shared benchmark scorer `router-replay.cjs`** — a scorer edit required to make this route pass is a migration failure, not a licence [synthesis §8.2, §10; master plan hard constraints].
- Building the compiler, evaluator, or PREPARE/VERIFY/COMMIT machinery — owned by phases `000`–`004`; this phase consumes them.
- The optional offline learning overlay (phase `007`) — an `mcp-tooling` overlay is `opt` and comes only after a demonstrated routing gain [synthesis §5.3, §12].
- Activating any other hub; the earlier three hubs are owned by `mcp-code-mode`'s cutover, `006/001`, and `006/002`.
- Calibrated auto-route thresholds for this hub — depend on a held-out corpus (phase `005`); absent that certificate, tooling routes stay deterministic/exact-or-defer [synthesis §8.1, §11 Q2].

### Files to Change (this planning packet)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `006-parent-hub-rollout/003-mcp-tooling/spec.md` | Create | This specification |
| `006-parent-hub-rollout/003-mcp-tooling/plan.md` | Create | Build approach, contracts touched, verification |
| `006-parent-hub-rollout/003-mcp-tooling/tasks.md` | Create | Ordered, checkable task list |

## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `mcp-tooling` destinations declare a `role` and no transport carries a judgment role | Every `destinations[]` entry has `role ∈ {actor, evidence, transport, judgment}`; no `transport`-role destination appears as an approver in any `authorityGraph[]` edge [synthesis §2.2, §7] |
| REQ-002 | Composition edges live in compiled data, not code | `compositionRules[]` express `composeAfter` (ordered effect steps) and `requiresAuthorityFrom` (authority dependency); no hub-name or transport-name conditional exists anywhere in the evaluator [synthesis §7, §5.3] |
| REQ-003 | Authority is destination-local and consumed only at VERIFY→COMMIT | A dependent transport's COMMIT is unreachable unless its `requiresAuthorityFrom` approver has produced an approving `RouteProofV1` for the pinned intent; negative decisions withhold authority [synthesis §2.1, §2.3, §7] |
| REQ-004 | The design-affecting Figma worked case routes correctly | For a design-affecting intent, the compiled route is `orderedBundle[ sk-design/<mode>, mcp-tooling/mcp-figma ]`; `mcp-figma` receives authority only for the approved intent and only after `sk-design` VERIFY [synthesis §7] |
| REQ-005 | Activation is a fenced, reversible CAS with retained prior generation | Selector snapshots candidate + prior manifest, compares expected generation/hash, swaps atomically under token lock + fencing epoch; prior generation retained; rollback swaps to byte-identical prior manifest [synthesis §9] |
| REQ-006 | Read-only legs proven before any mutating leg | Stage 6 gate requires read-only transport legs to pass all fixtures before a mutating leg is enabled [master plan Stage 6; synthesis §9] |
| REQ-007 | The shared scorer is never edited; route-gold stays green | `router-replay.cjs` unchanged; typed decisions reach the existing gold via the compatibility projector; a required scorer edit is logged as a migration failure [synthesis §8.2, §10] |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Advisor identity matches or is ignored at the canary | `AdvisorProjectionV1` `effectivePolicyHash` matches the pinned generation, or advisor output degrades to annotation/zero-evidence; no advisor-driven override of a decision [synthesis §8.1] |
| REQ-009 | Document-only parity holds for the tooling card | A generated `PolicyCardV1.md` lets a document-only AI reach the same `route`/`clarify`/`defer`/`reject` and emit `PREPARED_DRAFT`, never claiming live activation freshness or committed effects [synthesis §8.3] |
| REQ-010 | No over-emission on uncertainty | Zero-signal or ambiguous tooling intent yields a typed `defer` with no default union and no fallback transport [synthesis §2.3, §10] |
| REQ-011 | Blast-radius data recorded before Stage 4 opens | The `mcp-tooling`-last ordering is confirmed against real blast-radius data, resolving the cross-lineage disagreement (Terra argued transports-before-bundles) [synthesis §11 Q1] |

## 5. SUCCESS CRITERIA

- **SC-001**: The canonical `sk-design/<mode> → mcp-tooling/mcp-figma` design-affecting route replays deterministically as an `orderedBundle` with the transport authorized only post-approval, and the reverse (transport-first, or transport-without-approval) is structurally unrepresentable [synthesis §7, §2.3].
- **SC-002**: The Stage 4 per-hub canary passes: zero hard mismatch, advisor identity matches-or-ignored, document parity holds, and the rollback drill is proven on this hub [master plan Stage 4; synthesis §9].
- **SC-003**: The Stage 6 destination-rollout fixtures pass for tooling transports — proof/expiry/read-set/authority/epoch/idempotency/receipt — with every read-only leg green before any mutating leg is enabled [master plan Stage 6; synthesis §9].
- **SC-004**: Route-gold stays byte-green throughout with `router-replay.cjs` untouched; the `role escalation + missing authority dependency` fixture family passes via the compatibility projector [synthesis §8.2, §10].
- **SC-005**: No hard gate is tripped — in particular no transport supplies judgment, no missing authority edge, no COMMIT without VERIFY, no duplicate-key second effect, and no exact route emits clarify/handoff artifacts [synthesis §9].

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases `000`–`004` (schemas, compiler, evaluator, execution, recovery) shipped | Cannot activate without the compiled contract + PREPARE/VERIFY/COMMIT | This phase consumes them; do not re-implement [master plan phase map] |
| Dependency | `006/002` (`system-deep-loop`) Stage 4 canary cleared | mcp-tooling is last; its activation is gated on the prior hub passing | Honor the activation order; do not activate ahead of turn [synthesis §9] |
| Dependency | Real blast-radius data (open question) | The `mcp-tooling`-last order is a majority call disputed by the Terra lineage | Resolve Q1 with measured blast-radius before Stage 4 opens [synthesis §11 Q1] |
| Risk | External COMMIT cannot be rolled back | Manifest rollback cannot undo a committed Figma/tool effect | Read-only legs first; destination-owned post-effect recovery; canary before any mutating leg [synthesis §9] |
| Risk | Transport acquiring judgment via a mis-modeled edge | Silent taste-authority capture | `requiresAuthorityFrom` in compiled data + hard gate blocking transport-supplied judgment [synthesis §6, §7, §9] |
| Risk | Cross-process authority representation | `sk-design → mcp-figma` approval spans process/machine boundaries | Track as open question Q8; canary must exercise the real boundary, not an in-process shortcut [synthesis §11 Q8] |

## 7. MIGRATION GATE

Per the master plan SHARED MIGRATION-GATE MODEL, this phase (`006/003`) owns two shared gates and must satisfy **both** before the fleet advances past it:

- **Stage 4 — Per-hub canary** (owned by `006/*`): zero hard mismatch; advisor identity matches or is ignored; document parity passes; the rollback drill is proven — evaluated behind the fenced selector with legacy still serving-authoritative [master plan Stage 4; synthesis §9 Stage 4].
- **Stage 6 — Destination rollout** (owned by `003`, `006/*`): proof/expiry/read-set/authority/epoch/idempotency/receipt fixtures pass, with **read-only legs proven before mutating legs** — the decisive control for this external-effect surface [master plan Stage 6; synthesis §9 Stage 6].

**Ordering:** `mcp-tooling` activates **last** in `mcp-code-mode → sk-code → system-deep-loop → mcp-tooling`; this phase must not open its Stage 4 canary until `006/002` (`system-deep-loop`) has cleared its own Stage 4 gate [synthesis §9, §11 Q1]. **Downstream:** clearing this phase's Stage 4 + Stage 6 gates is the precondition for phase `008` (fleet cleanup, Stage 7) to retire legacy dual-read for the tooling transports, and it is the entry condition for an optional `mcp-tooling` overlay in phase `007` (Stage 5). Rollback is a fenced CAS to the byte-identical prior manifest and **cannot** undo an external COMMITted effect — post-effect recovery is destination-owned [synthesis §9, §10].

## RELATED DOCUMENTS

- **Source design**: `../../../006-unified-refactor-research/unified-refactor-synthesis.md` (§2 authority planes, §7 mcp-tooling archetype, §9 migration, §8.2 benchmark)
- **Phase parent / gate model**: `../../spec.md`
- **Build approach**: `plan.md`
- **Task breakdown**: `tasks.md`
