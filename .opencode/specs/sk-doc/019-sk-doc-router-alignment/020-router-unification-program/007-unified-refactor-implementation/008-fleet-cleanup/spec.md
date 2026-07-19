---
title: "Feature Specification: Fleet Cleanup — Retire the Legacy Dual-Read Path"
description: "The terminal phase of the unified router refactor: once every hub is canaried and rolled out on the compiled typed contract, retire the legacy dual-read resolution path behind per-skill deletion gates (the N=1 mcp-code-mode included via the identical compiler path, no special case), retain the prior generation through a drift-checked bake window, and strip the compatibility alias array out of the hot card. Nothing here activates before phase 006 completes fleet-wide."
trigger_phrases:
  - "fleet cleanup dual-read retirement"
  - "per-skill deletion gate router refactor"
  - "remove compatibility aliases hot card"
importance_tier: "critical"
contextType: "implementation"
status: "implemented-contract"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Fleet Cleanup — Retire the Legacy Dual-Read Path

## EXECUTIVE SUMMARY

This is **phase 8 (`008-fleet-cleanup/`)** and the **terminal stage** of the unified router refactor — Stage 7 "Fleet cleanup" of the synthesis migration table (`../../006-unified-refactor-research/unified-refactor-synthesis.md` §9). Every prior phase kept legacy resolution serving-authoritative and ran the compiled typed contract in shadow, then behind a fenced per-hub canary, then through a destination-local rollout. This phase does the opposite move exactly once: it **removes** the legacy dual-read path so the compiled `EffectivePolicy` becomes the sole resolver, deletes each skill's legacy artifacts one at a time behind its own gate, and strips the compatibility alias array out of the hot policy card (synthesis §5.3 — the alias bytes "compile out of the hot card once dual-read retires").

Cleanup is not a big-bang teardown. It runs **per-skill deletion gates** in the same blast-radius order the fleet was activated in — `mcp-code-mode → sk-code → system-deep-loop → mcp-tooling` (§9) — with route-gold green after every deletion and the byte-identical prior generation retained through a bake window for fenced-CAS rollback (§9, Stage 7 rollback = "retain prior generation during window"). The N=1 `mcp-code-mode` is retired through the **identical compiler and deletion path** with no skill-name branch — it is the degenerate case of the same contract, never a special case (§1, §5, §5.3).

**Planning/design only.** This spec, its plan, and its tasks author the cleanup contract. No live routing config, registry, activation manifest, scorer, or skill is modified by this packet.

## 2. PROBLEM & PURPOSE

### Problem Statement
After Stage 6 (destination rollout) each hub serves from the compiled typed contract, but the legacy dual-read path is still present and still resolving legacy inputs in parallel (§9, Stage 2 "Dual-read": every legacy input resolves through a declared mode/alias; unmapped fails closed). Leaving dual-read in place indefinitely keeps two resolution surfaces alive, keeps the compatibility alias array sitting in the hot card as permanent weight (~1,000 bytes at N=1 for `mcp-code-mode` alone, §5.3), and preserves a second path that could silently diverge from the compiled policy. The refactor is not finished — and its "one contract, not one router" invariant (§1) is not actually true — until the legacy path is gone and the compiled policy is the single authority.

### Purpose
Retire the legacy dual-read resolution path fleet-wide behind reversible per-skill deletion gates, leaving the compiled typed contract as the sole resolver, the hot card free of compatibility aliases, and the final state drift-checked against a recorded fingerprint — with the prior generation retained for byte-exact rollback throughout a bake window.

## 3. SCOPE

### In Scope
- Retire the legacy dual-read resolution path once **every** hub has passed Stage 4 (per-hub canary) and Stage 6 (destination rollout) — i.e. after phase `006-parent-hub-rollout/` completes fleet-wide.
- Per-skill deletion gates: remove each skill's legacy artifacts (dual-read resolver entries, registry adapters, compatibility alias arrays) **one skill at a time**, each behind its own gate, in the activation order `mcp-code-mode → sk-code → system-deep-loop → mcp-tooling` (§9).
- Retire `mcp-code-mode` (N=1) through the **identical** compiler/deletion path — no `SingularRouter`, no `if skillId == mcp-code-mode` branch anywhere (§1, §5.2, §6 eliminated alternatives).
- Strip the compatibility alias array out of the hot card; regenerate the card from the same compiled snapshot (§5.3, §8.3).
- Retain the prior generation for a bake window; prove byte-exact fenced-CAS rollback; produce a drift-checked final state (§9, Stage 7 rollback; two-phase promotion preimage drift checks).
- Deletion-gate fixtures added to the typed route-gold family through the existing compatibility projector.

### Out of Scope
- Editing the shared benchmark scorer `router-replay.cjs` — **never**, under any circumstance (§9, §10; a required scorer edit is a cleanup failure, not a license). — hard constraint.
- Activating, canarying, or rolling out any hub — that is owned by phases 003 and 006; this phase only removes legacy once those are green. — sequencing constraint.
- Building or promoting the learning overlay (phase 007) — cleanup never touches the offline overlay pointer. — plane separation.
- Undoing external COMMITted effects — rollback restores routing bytes only; post-effect recovery is destination-owned (§9). — authority boundary.
- Any live mutation by this packet — planning/design only. — packet discipline.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `008-fleet-cleanup/spec.md` | Create | This Level-2 spec-core (the cleanup contract). |
| `008-fleet-cleanup/plan.md` | Create | Build approach, touched contracts, verification. |
| `008-fleet-cleanup/tasks.md` | Create | Ordered, checkable execution list. |

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Legacy dual-read retired only after every hub is canaried + rolled out. Legacy stays serving-authoritative until then (§9, Stages 4/6). | A preflight gate reads the activation manifest and refuses any dual-read removal while any of the four hubs is still legacy-authoritative or has an open Stage-4 canary mismatch; deletion begins only when all four are on the compiled generation. |
| REQ-002 | Per-skill deletion gate, one skill at a time, N=1 via the identical compiler path (§1, §5.2, §9). | The deletion driver is parameterized by `skillId` only; `rg -n 'SingularRouter\|skillId == .mcp-code-mode.\|if.*mcp-code-mode'` over the cleanup surface returns zero matches; route-gold replays green after each per-skill deletion, in order `mcp-code-mode → sk-code → system-deep-loop → mcp-tooling`. |
| REQ-003 | Retain the prior generation through a bake window; deletion is a fenced CAS with byte-exact rollback (§9, Stage 7 rollback; atomic temp/fsync/rename). | A rollback drill restores the byte-identical prior manifest/generation within the window (hash equality proven); the drill confirms rollback CANNOT undo an external COMMITted effect and that post-effect recovery is destination-owned. |
| REQ-004 | Remove compatibility aliases from the hot card; regenerate from the compiled snapshot (§5.3, §8.3). | Post-cleanup hot card / `PolicyCardV1.md` contains no legacy alias array; the ~1,000B (N=1) / larger (parent-hub) alias bytes are gone; the card is generated from the same compiled snapshot, not hand-edited (document-only replay lane still parity-checks). |
| REQ-005 | Drift-checked final state; no unmapped legacy input survives; route-gold replay byte-identical (§9, §10). | A preimage drift check compares the post-cleanup compiled policy against the recorded fingerprint and passes; unmapped legacy inputs fail closed (no silent fallback); typed route-gold + compatibility-projector fixtures are byte-identical to baseline. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | No over-emission after alias removal — removing aliases must not open a fallback/default-union path (§9, §10). | Zero-signal fixtures still return typed `defer(no-match)` with no default union; the "singular omission + zero rank-call assertion" fixture (§8.2) still holds after `mcp-code-mode` alias removal. |
| REQ-007 | Scorer untouched across the entire cleanup (§9, §10). | `git diff` over the cleanup shows zero changes to `router-replay.cjs`; deletion-gate fixtures reach the scorer only through the existing compatibility projector. |

## 5. SUCCESS CRITERIA

- **SC-001**: All four hubs (`mcp-code-mode`, `sk-code`, `system-deep-loop`, `mcp-tooling`) resolve exclusively through the compiled typed contract; the legacy dual-read resolver is deleted; no hub remains legacy-authoritative.
- **SC-002**: `mcp-code-mode` (N=1) is retired through the identical compiler/deletion path — no `SingularRouter` and no skill-name conditional exists anywhere in the cleanup surface.
- **SC-003**: The prior generation is retained through the bake window and byte-exact fenced-CAS rollback is proven; the final compiled state passes its drift check.
- **SC-004**: The hot card carries no compatibility alias array, is regenerated from the compiled snapshot, and passes document-parity and route-gold replay.
- **SC-005**: `router-replay.cjs` is unchanged; deterministic offline route-gold replay is preserved byte-identically end to end.

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase `006-parent-hub-rollout/` (Stages 4 + 6) must be green for all four hubs | Deleting legacy while a hub is still legacy-authoritative would strand traffic | REQ-001 preflight gate refuses removal until the activation manifest shows all four hubs on the compiled generation with zero open canary mismatches |
| Dependency | Phase `003-execution-verify-commit/` (Stage 6 destination rollout) | Cleanup must not precede destination-local PREPARE/VERIFY/COMMIT being live | Sequenced after 003/006; cleanup only removes the legacy read path, never a destination effect |
| Risk | A per-skill deletion changes route-gold output | Silent routing regression | Route-gold replay after every deletion; drift check on the compiled fingerprint; retained prior generation for immediate byte-exact rollback |
| Risk | Alias removal opens a fallback/default-union path | Over-emission (violates hard constraint) | REQ-006 zero-signal + singular-omission fixtures assert typed `defer`, no union |
| Risk | Pressure to edit the scorer so the cleaned route passes | Loss of baseline comparability | REQ-007: scorer edit is a cleanup FAILURE; only the compatibility projector may change fixtures |

## L2: NON-FUNCTIONAL REQUIREMENTS

### Reversibility
- **NFR-R01**: Every per-skill deletion is a fenced CAS on the activation manifest with a retained byte-identical prior generation; rollback swaps to the prior manifest and is proven by hash equality (§9).
- **NFR-R02**: Rollback restores routing bytes only and cannot undo an external COMMITted effect; post-effect recovery is destination-owned (§9). This limit is documented, not worked around.

### Determinism & Safety
- **NFR-D01**: Identical inputs compile to byte-identical policy bodies before and after cleanup; route-gold replay never calls a live advisor (§10).
- **NFR-S01**: Unmapped legacy inputs fail closed after dual-read retirement — no silent fallback (§9, Stage 2 invariant carried to its terminal state).

## L2: EDGE CASES

- **Partial fleet readiness**: three hubs rolled out, one still legacy-authoritative → preflight gate blocks all deletion; no partial dual-read teardown (REQ-001).
- **N=1 emptiness**: `mcp-code-mode` has empty ranking/bundle/handoff collections; deletion walks empty collections, it does not branch on the skill name (§5.1, §5.2).
- **Bake-window rollback**: a regression surfaces mid-window → CAS to the retained prior generation; the external COMMIT already emitted is not reversed by routing rollback (§9).
- **Alias still referenced**: a legacy consumer still speaks an alias after removal → resolves as unmapped → fails closed (not a silent default).

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Deletion-only across 4 hubs + hot card; no new runtime planes. |
| Risk | 18/25 | Removes the legacy safety net; terminal, fleet-wide; mitigated by retained generation + drift check. |
| Research | 6/20 | Design fully specified by synthesis §9/§5.3/§10; no open architecture. |
| **Total** | **38/70** | **Level 2** |

## MIGRATION GATE

**Gate satisfied by this phase:** Stage 7 — *Fleet cleanup* of the master plan's SHARED MIGRATION-GATE MODEL (`../spec.md`, and synthesis §9). The gate to advance Stage 7 is **per-skill deletion gates** (incl. N=1 via the identical compiler path); the reverse gate is **retain prior generation during the window**.

**Upstream gate this phase depends on:** Stage 6 — *Destination rollout* (owned by phases `003-execution-verify-commit/` and `006-parent-hub-rollout/*`) and Stage 4 — *Per-hub canary* (owned by `006-*`) must be green for **every** hub before any deletion here begins. Concretely: **nothing in this phase activates before phase 006 completes fleet-wide** (all four hubs canaried + rolled out on the compiled generation).

**Downstream:** none. `008-fleet-cleanup/` is the terminal phase; no later phase activates on its completion. Its own gate is therefore inward-facing — per-skill deletion cannot proceed to the next skill until the current skill's route-gold + drift check are green and its prior generation is retained.

**Hard constraints (inherited, every phase):** deterministic offline route-gold replay preserved; **never** touch the shared scorer `router-replay.cjs`; authority stays destination-local (a proof/recommendation is never a capability); reversible + gated (fenced CAS activation, retained prior generation); no over-emission.

## 10. OPEN QUESTIONS

- Bake-window duration and the telemetry/quiet-period signal that authorizes permanently discarding a retained prior generation (empirical; synthesis §11 defers concrete windows).
- Whether any legacy alias must survive as an external-consumer compatibility shim beyond the hot card (must be named explicitly; default is full removal, fail-closed on unmapped).

## RELATED DOCUMENTS
- **Source design**: `../../006-unified-refactor-research/unified-refactor-synthesis.md` (§5.3, §9 Stage 7, §10)
- **Phase parent / shared gate model**: `../spec.md`
- **Upstream dependency**: `../006-parent-hub-rollout/` (Stages 4 + 6), `../003-execution-verify-commit/` (Stage 6)
- **Plan**: `plan.md` · **Tasks**: `tasks.md`
