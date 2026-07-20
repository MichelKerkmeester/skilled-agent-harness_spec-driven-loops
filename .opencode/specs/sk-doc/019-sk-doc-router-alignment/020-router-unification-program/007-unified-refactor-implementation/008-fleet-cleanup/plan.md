---
title: "Implementation Plan: Fleet Cleanup — Retire the Legacy Dual-Read Path"
description: "Build approach for the terminal cleanup phase: a preflight fleet-readiness gate, a skillId-parameterized per-skill deletion driver run in activation order (mcp-code-mode → sk-code → system-deep-loop → mcp-tooling), hot-card alias stripping via snapshot regeneration, retained prior generations with byte-exact fenced-CAS rollback, and a drift-checked final state — all with route-gold green and the scorer untouched."
trigger_phrases:
  - "fleet cleanup build plan"
  - "per-skill deletion driver plan"
  - "dual-read retirement approach"
importance_tier: "critical"
contextType: "implementation"
status: "blocked-shadow"
---
# Implementation Plan: Fleet Cleanup — Retire the Legacy Dual-Read Path

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact class** | Compiled-policy activation manifest + hot policy card (`PolicyCardV1.md`) + legacy dual-read resolver/adapters + typed route-gold fixtures |
| **Change class** | Deletion-only (retire legacy path); no new runtime plane |
| **Ordering** | Activation order `mcp-code-mode → sk-code → system-deep-loop → mcp-tooling` (synthesis §9) |
| **Safety model** | Fenced CAS on the activation manifest, retained prior generation, byte-exact rollback, drift check (§9) |
| **Scorer** | `router-replay.cjs` — read-only, NEVER edited (§9, §10) |

### Overview
Retire the legacy dual-read resolution path fleet-wide, one skill at a time, behind per-skill deletion gates, only after phase 006 has canaried and rolled out every hub. Each deletion is a fenced CAS that retains the byte-identical prior generation for a bake window; the compatibility alias array is stripped from the hot card by regenerating the card from the compiled snapshot; the terminal state is verified against a recorded fingerprint (drift check). The N=1 `mcp-code-mode` runs the **identical** deletion path — the driver branches on empty collections, never on the skill name (synthesis §5.2). This document plans the work; it modifies nothing live (planning/design only).
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 006 (Stages 4 + 6) green for all four hubs; activation manifest shows every hub on the compiled generation.
  - **Evidence**: all four committed selectors are `servingAuthority:"legacy"`, `shadowOnly:true`, generation `0`, hash `5485c5a4...`; `system-deep-loop` also reports `shadow-partial` route-gold.
- [ ] A recorded post-rollout fingerprint exists to drift-check the terminal state against.
  - **Evidence**: `compiled/final-manifest.json` is a hypothetical artifact only; no post-rollout committed selector exists while readiness is blocked.
- [ ] Retained-prior-generation storage and bake-window policy are defined.
  - **Evidence**: the implementation exists, but no real cleanup token or deletion is authorized in the committed shadow state.

### Definition of Done
- [ ] Legacy dual-read resolver deleted; compiled policy is the sole resolver (SC-001).
  - **Evidence**: blocked; every committed activation manifest remains legacy-authoritative and no real deletion ran.
- [ ] Every per-skill deletion left route-gold byte-identical; drift check green (SC-003/SC-005).
  - **Evidence**: blocked before deletion; the current `system-deep-loop` candidate gate is `shadow-partial` with seven resource mismatches.
- [ ] Hot card carries no alias array; regenerated from snapshot (SC-004).
  - **Evidence**: the checked-in card is a hypothetical terminal artifact, not evidence of current fleet authority.
- [x] `git diff` shows zero changes to `router-replay.cjs` (REQ-007).
  - **Evidence**: no git command was run by instruction; independent before/after SHA-256 verification proves the scorer family unchanged at the three protected digests.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Gated, reversible teardown — a mirror of the fenced-CAS activation used to roll the fleet forward (synthesis §9), run in reverse against the legacy read path rather than the compiled write path.

### Key Components
- **Fleet-readiness preflight gate**: reads the `ActivationManifestV1` selector; blocks all deletion unless every hub is on the compiled generation with zero open Stage-4 canary mismatch (REQ-001).
- **Per-skill deletion driver**: parameterized by `skillId` only; removes that skill's dual-read resolver entries, registry adapters, and compatibility alias array; walks empty collections for N=1 with no skill-name branch (§5.1–5.2).
- **Hot-card regenerator**: re-emits `PolicyCardV1.md` from the same compiled snapshot so the alias bytes drop out structurally, not by hand-editing (§5.3, §8.3).
- **Drift checker**: preimage compare of the post-cleanup compiled policy against the recorded fingerprint; part of the fenced-CAS accept/ship discipline (two-phase promotion preimage drift checks).
- **Route-gold compatibility projector**: the existing adapter that maps typed decisions into the `observedIntents`/`observedResources` shape; the ONLY place fixtures may change — the scorer stays frozen (§8.2, §9).

### Data Flow
`readiness preflight → (per skill, in activation order) delete legacy artifacts → fenced CAS to a generation without that skill's dual-read → route-gold replay via projector → drift check → retain prior generation for bake window → next skill`. After the last skill: `strip aliases from hot card via snapshot regeneration → final drift check → hold prior generation until the bake window and quiet signal authorize discard`.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Legacy dual-read resolver | Resolves legacy inputs in parallel with compiled policy (Stage 2) | Delete (per skill) | Route-gold green after each deletion; unmapped legacy input fails closed |
| Compatibility alias array (hot card) | Maps legacy vocabulary into the card | Remove; regenerate card from snapshot | Card has no alias array; document-parity + route-gold green (§5.3, §8.3) |
| `ActivationManifestV1` selector | Pins one generation per request | Fenced CAS to a legacy-free generation | Hash equality on rollback drill; requests pin one generation (§9) |
| Registry adapters / dual-read entries | Feed legacy inputs to the resolver | Delete (per skill, skillId-parameterized) | `rg` finds no `SingularRouter` / `mcp-code-mode` conditional (REQ-002) |
| `router-replay.cjs` (shared scorer) | Deterministic route-gold scorer | **Not a consumer — unchanged** | `git diff` shows zero lines changed (REQ-007) |

Required inventories:
- Legacy-path references: `rg -n 'dual.?read\|legacy.?(alias\|resolver\|adapter)\|compatibility.?alias' <router-surface>`.
- Special-case guard: `rg -n 'SingularRouter\|skillId == .mcp-code-mode.\|if.*mcp-code-mode' <cleanup-surface>` MUST be empty.
- Scorer immutability: `git diff --stat -- '**/router-replay.cjs'` MUST be empty.
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Readiness Preflight
- [ ] Read the activation manifest; confirm all four hubs on the compiled generation with zero open canary mismatch.
  - **Evidence**: the exact committed bytes were read and disprove readiness: all four selectors are legacy/shadow-only; cleanup returns `PREFLIGHT_BLOCKED`.
- [ ] Record the post-rollout fingerprint to drift-check the terminal state against.
  - **Evidence**: no real post-rollout fingerprint exists; the frozen generation-8 file remains hypothetical.
- [ ] Confirm retained-generation storage + bake-window policy are in place.
  - **Evidence**: implementation is present, but the real preflight blocks before retained-generation creation.

### Phase 2: Per-Skill Deletion (activation order)
- [ ] `mcp-code-mode` (N=1): delete legacy artifacts via the skillId-parameterized driver; fenced CAS; route-gold replay; drift check; retain prior generation.
  - **Evidence**: blocked before deletion by the committed legacy/shadow-only selector.
- [ ] `sk-code`: same path.
  - **Evidence**: blocked before deletion by the committed legacy/shadow-only selector.
- [ ] `system-deep-loop`: same path.
  - **Evidence**: blocked by both the committed legacy/shadow-only selector and current `shadow-partial` route-gold.
- [ ] `mcp-tooling`: same path.
  - **Evidence**: blocked before deletion by the committed legacy/shadow-only selector.

### Phase 3: Hot-Card & Final State
- [ ] Strip the compatibility alias array from the hot card by regenerating `PolicyCardV1.md` from the compiled snapshot.
  - **Evidence**: blocked; no real terminal selector or live cleanup is authorized.
- [ ] Run the final drift check + document-parity + full route-gold family.
  - **Evidence**: blocked; the current candidate evidence includes seven `system-deep-loop` resource mismatches.
- [ ] Prove byte-exact fenced-CAS rollback of the retained prior generation; document the post-effect (external COMMIT) limit.
  - **Evidence**: stale CAS is rejected in the harness, but no real deletion/rollback drill is authorized.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Replay | Typed route-gold + compatibility-projector fixtures after every deletion | Existing route-gold gate (scorer read-only) |
| Drift | Preimage compare of compiled policy vs recorded fingerprint | Fenced-CAS accept/ship drift check |
| Rollback drill | Byte-exact restore of retained prior generation within the window | CAS swap + hash equality |
| Negative | Zero-signal `defer(no-match)`, singular-omission + zero rank-call, unmapped-fails-closed | Route-gold fixtures (§8.2) |
| Immutability | `router-replay.cjs` unchanged | `git diff` |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `006-parent-hub-rollout/*` (Stages 4 + 6) | Internal | Must be green fleet-wide | Preflight gate blocks all deletion (REQ-001) |
| `003-execution-verify-commit/` (Stage 6) | Internal | Must be live | Destination legs must precede legacy-read removal |
| Retained-generation storage + bake-window policy | Internal | Required | No safe rollback path without it |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any per-skill deletion changes route-gold output, fails the drift check, or opens a fallback path; or a regression surfaces during the bake window.
- **Procedure**: fenced CAS to the retained byte-identical prior generation (hash equality proven); requests pin one generation, so in-flight requests are unaffected. Rollback restores routing bytes only — it CANNOT undo an external COMMITted effect; post-effect recovery is destination-owned (synthesis §9).
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Readiness) ──► Phase 2 (Per-Skill Deletion, ordered) ──► Phase 3 (Hot-Card & Final State)
        ▲                         │ each skill gated on route-gold + drift + retained generation
        └──── blocked until 006 green fleet-wide ────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Readiness | 006 (Stages 4+6), 003 (Stage 6) | Per-Skill Deletion |
| Per-Skill Deletion | Readiness | Hot-Card & Final State |
| Hot-Card & Final State | all four skills deleted | None (terminal) |
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deletion Checklist
- [ ] Prior generation retained and byte-hashed for the skill about to be cleaned.
  - **Evidence**: no skill is eligible for cleanup while the committed selectors remain legacy/shadow-only.
- [ ] Route-gold + drift-check baselines captured for delta comparison.
  - **Evidence**: the current candidate gate is not fleet-green; `system-deep-loop` is `shadow-partial`.

### Rollback Procedure
1. Fenced CAS to the retained prior generation for the affected skill.
2. Verify hash equality against the pre-deletion generation.
3. Re-run route-gold to confirm the restored state matches baseline.
4. Record the post-effect limit: any external COMMIT already emitted is destination-owned recovery.
<!-- /ANCHOR:enhanced-rollback -->
