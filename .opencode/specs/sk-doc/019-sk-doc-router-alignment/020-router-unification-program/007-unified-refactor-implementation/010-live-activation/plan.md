---
title: "Implementation Plan: Unified Router Refactor — Live Activation"
description: "How the fenced-CAS activation driver binds each hub's compiled generation, proves byte-exact rollback, and gates the runtime cutover."
trigger_phrases:
  - "live activation plan"
  - "fenced-CAS driver plan"
  - "P4a P4b staging"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Unified Router Refactor — Live Activation

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
| **Activation mechanism** | Fenced compare-and-swap on a per-hub activation manifest; monotonic `fencingEpoch` |
| **Serving authority (P4a)** | Legacy remains authoritative; the compiled generation is *bound*, not *served* |
| **Frozen inputs** | Three pinned scorer digests; the completed rollout children are read-only seeds |

### Overview

A single shared driver, `lib/activate-hub.cjs`, performs the design-faithful activation for every hub: it seeds a phase-local activation manifest byte-for-byte from the hub's shadow rollout child, then binds the hub's compiled generation as `selectedPolicy` via a fenced CAS that advances the fence epoch while `servingAuthority` stays `legacy`. Every activation is gated on a frozen-scorer pin and a green canary, and proves a byte-exact rollback. Stage P4b — the runtime resolver plus the `servingAuthority` flip — is scoped but gated and not executed here.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Each hub's shadow rollout child is present with prior/candidate manifests and a green `validate-canary.cjs`.
- [x] The three shared scorer files are pinned to known digests.
- [x] The activation order is fixed: `sk-code → mcp-tooling → system-deep-loop → cli-external-orchestration → sk-prompt → sk-design → sk-doc`.

### Definition of Done
- [x] All seven hubs bind their compiled generation as `selectedPolicy`, fence epoch `0 → 1`, `servingAuthority: legacy`, `shadowOnly: true`.
- [x] Every hub proves a byte-exact rollback (`restoredHash` = accepted `priorManifestHash`).
- [x] Frozen-scorer pin and canary green gate enforced as hard preconditions.
- [x] Completed rollout children remain byte-unchanged; activation state confined to `activation/`.
- [ ] P4a T9 real-model routing verification recorded per hub (deferred/in-progress).
- [ ] P4b runtime resolver + serving-authority flip (gated, not executed here).

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Bind-then-serve, split into two stages. Activation is a fenced compare-and-swap that moves `selectedPolicy` from the legacy generation to the compiled generation on a phase-local manifest; it never edits a serving policy. Serving authority stays legacy until a separate, gated P4b resolver is built.

### Key Components
- **`lib/activate-hub.cjs`**: the shared, zero-dependency fenced-CAS driver — one code path, run once per hub.
- **`activation/<hub>/manifest.json`**: the serving manifest carrying `selectedPolicy`, `servingAuthority`, and `fencingEpoch`.
- **`activation/<hub>/{manifest.prior.json, manifest.candidate.json, fence-state.json}`**: seeded prior/candidate manifests and fence state.
- **`activation/<hub>/activation-record.json`**: per-hub audit trail (eligibility, CAS transition, rollback proof, real-model slot).

### Data Flow

Shadow rollout child (`manifest.prior.json` / `manifest.candidate.json`) → byte-for-byte seed into `activation/<hub>/` → frozen-scorer pin + canary green gate → fenced CAS binds `candidatePolicy` as `selectedPolicy`, advances the fence epoch (`servingAuthority` stays `legacy`) → temp-dir rollback proof restores the byte-identical prior manifest → `activation-record.json` emitted.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase introduces a new activation layer over shared, content-addressed policy state, so the surface inventory is required before the driver runs.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Shadow rollout child manifests (`manifest.prior/candidate.json`) | Proven compiled generation + retained prior | Read-only seed source | Seeded prior hash equals accepted `priorManifestHash`; child bytes unchanged |
| `harness/validate-canary.cjs` (per child) | Canary green gate | Executed as an activation precondition | Non-zero exit aborts; records report `canaryGreen=true` |
| Three shared scorer files | Frozen route-gold scorer | Re-hashed, never edited | Pinned digests unchanged; drift aborts before any write |
| `activation/<hub>/manifest.json` | New per-hub serving manifest | Fenced CAS writes `selectedPolicy`, advances fence | `servingAuthority: legacy`, `shadowOnly: true`, fence epoch 1 |
| Live `SKILL.md` / `hub-router.json` / `mode-registry.json` | Authoritative serving routing | **Unchanged — not a consumer** | Activation confined to `010-live-activation/activation/` |

Required inventories before activation:
- Seed integrity: confirm the seeded prior hash equals the accepted `priorManifestHash` for every hub.
- Boundary: `rg -n "activation/" lib/activate-hub.cjs` — confirm every write path is under `activation/`, none under a child.
- Frozen inputs: re-hash the three scorer files and compare to the pinned digests before the first CAS.

<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Author the shared `lib/activate-hub.cjs` driver (frozen-scorer pin, canary green gate, byte-for-byte seed).
- [x] Frozen-scorer gate: re-hash `router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`; abort on any drift.
- [x] Canary gate: execute each child's `harness/validate-canary.cjs`; abort on non-zero exit.
- [x] Seed: byte-for-byte copy the child's prior + candidate manifests into `activation/<hub>/`; verify the seeded prior hash equals the accepted `priorManifestHash`.

### Phase 2: Core Implementation
- [x] Fenced CAS ship: assert the serving `selectedPolicy` equals the expected prior generation at the expected fence epoch (compare), then write candidate bytes into `manifest.json` and advance the fence epoch (swap).
- [x] Keep `servingAuthority: legacy` and `shadowOnly: true` across the swap — bind, do not serve.
- [x] Run all seven hubs in activation order (`sk-code → mcp-tooling → system-deep-loop → cli-external-orchestration → sk-prompt → sk-design → sk-doc`).

### Phase 3: Verification
- [x] Rollback proof: in a scope-validated temp dir, restore the prior manifest and assert the restored hash is byte-exact against `priorManifestHash`; the committed activated state is never disturbed.
- [x] Emit `activation/<hub>/activation-record.json` for each hub.
- [ ] Real-model routing verification per hub (deferred/in-progress; record `real-model/<hub>/verdict.json`).

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Precondition | Frozen-scorer pin; canary green gate | Driver re-hash + child `validate-canary.cjs` |
| Reversibility | Byte-exact rollback per hub | Temp-dir rollback drill (`restoredHash` = `priorManifestHash`) |
| Idempotency | Re-run of an already-bound hub | No-op ship that still proves rollback |
| Boundary | Child immutability; write-path confinement | Confirm no write under a child path; activation state under `activation/` |
| Manual (deferred) | Real-model routing per hub | LUNA / SOL / MiniMax on playbook prompts → `real-model/<hub>/verdict.json` |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Shadow rollout children (per hub) | Internal | Green | No seed source or canary gate without green children |
| Frozen benchmark scorer (three pinned digests) | Internal | Green | Drift would invalidate the canary baseline; driver aborts |
| Fenced-CAS manifest primitive | Internal | Green | No auditable, reversible binding without the fence + preimage check |
| Real models (LUNA / SOL / MiniMax) | External | Deferred | T9 verification pending; does not block the P4a binding |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any activation-time abort (scorer drift, non-green canary, seed-hash mismatch, or fence-epoch mismatch), or a decision to unbind a hub during the bake window.
- **Procedure**: Restore the retained prior manifest via the fenced CAS and confirm `restoredHash` equals the accepted `priorManifestHash`; because P4a is pre-effect (legacy still serves), no runtime routing change needs undoing. Retain the prior manifest for the full bake window before any cleanup.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup / gate + seed) ──► Phase 2 (Core / fenced CAS ship) ──► Phase 3 (Verify / rollback + record)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Green children, pinned scorer | Core |
| Core | Setup | Verify |
| Verify | Core | Real-model verification (T9), P4b gate |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (driver + gates + seed) | Med | Authored once; reused per hub |
| Core (fenced CAS ship × 7) | Low | Deterministic per hub |
| Verification (rollback proof + records) | Low | Automated per hub |
| Real-model verification (T9) | High | Deferred; bounded breadth |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-activation checklist
- [x] Prior manifest retained and hash-pinned before the CAS.
- [x] Frozen-scorer digests re-verified.
- [x] Canary green for the target hub.

### Rollback procedure
1. Restore the retained prior manifest via the fenced CAS.
2. Assert `restoredHash` equals the accepted `priorManifestHash` (byte-exact).
3. Confirm `selectedPolicy` reverts to the prior generation and `servingAuthority` remains `legacy`.

### Data reversal
- **Has runtime effect?** No — P4a is pre-effect; legacy keeps serving.
- **Reversal procedure**: Byte-exact manifest restore; no external COMMITted effect exists to undo (the post-effect caveat applies to P4b only).

<!-- /ANCHOR:enhanced-rollback -->
