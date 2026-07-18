---
title: "Implementation Plan: Shadow Compiler + mcp-code-mode N=1 Compile"
description: "Build approach for Phase 1 of the unified router refactor: a pure fail-closed compiler (authored sources -> CompiledPolicyV1) exercised on the degenerate N=1 case (mcp-code-mode), the three read-only projections + legacy-gold compatibility projector + typed fixtures, a zero-authority shadow parity lane, and a fenced one-generation activation with byte-exact rollback. The shared scorer is never touched."
trigger_phrases:
  - "shadow compiler build approach"
  - "mcp-code-mode n1 compile plan"
  - "fenced activation byte-exact rollback plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/024-oob-idea-deep-dives/010-unified-refactor-implementation/001-compiler-n1-shadow"
    last_updated_at: "2026-07-18T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Phase 1 build plan (compiler + N=1 + projections + activation)"
    next_safe_action: "Sequence the build once Phase 0 schemas are frozen"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

# Implementation Plan: Shadow Compiler + mcp-code-mode N=1 Compile

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js / TypeScript (matches the existing `router-replay.cjs` + route-gold tooling surface) |
| **Framework** | None — a pure library function plus fixtures; no runtime service in this phase |
| **Storage** | Content-addressed files in an isolated shadow tree; no database, no live state writes |
| **Testing** | Vitest (route-gold gate already runs under Vitest); deterministic offline replay |

### Overview

Build the compiler as a **total, side-effect-free function** that reads authored sources and returns either a byte-stable `CompiledPolicyV1` or a typed `CompileError`. Exercise it on `mcp-code-mode` — the degenerate N=1 case whose empty collections fall out of partial evaluation, not a name branch (synthesis §5.1). Project the compiled snapshot three ways, add a compatibility projector so the existing scorer sees the familiar intent/resource shape (scorer untouched, synthesis §8.2), run a zero-authority shadow parity lane against the legacy router (synthesis §9 Stage 1/3), and prove a fenced one-generation activation with byte-exact rollback (synthesis §9). Legacy stays serving-authoritative the entire time.

> **Boundary reminder**: this document is the build approach for a *planning/design* phase. It defines the sequence, contracts, and verification; it does not authorize edits to live routing config, the mode registry, the hub router, the scorer, or any skill.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Phase 0 (`../000-contract-schemas/`) schema + deterministic serialization frozen and importable; else fail closed (spec REQ-002).
- [ ] `mcp-code-mode` authored sources confirmed against synthesis §5 line references (SKILL.md, leaf-manifest.json, mcp-route-guard.cjs).
- [ ] Legacy route-gold baseline captured and green *before* any shadow artifact exists (Stage 0 handshake with Phase 0).

### Definition of Done

- [ ] All P0 requirements (REQ-001..008) met with evidence.
- [ ] `git diff --exit-code` on `router-replay.cjs` is empty (scorer untouched).
- [ ] Route-gold gate green with compatibility-projected fields; existing gold unchanged.
- [ ] Determinism, fail-closed, degeneracy-grep, parity, and rollback drills all pass.
- [ ] Migration Stage-1 gate (spec §6) satisfied so Phase 2 may activate.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Pure compiler + immutable content-addressed artifact + read-only projections + fenced activation pointer. No online mutation; "activation" flips *which* immutable generation a request pins (synthesis §2, §9).

### Key Components

- **`compile()`** — total function `authoredSources → CompiledPolicyV1 | CompileError`; builds `destinations[]`, `detectors[]`, `selectors[]`, `compositionRules[]`, `authorityGraph[]`, `(T,R,P)` posture, and the three hashes (synthesis §2.1). Fail-closed guards for missing modes / unresolved leaves / authority contradictions.
- **N=1 partial evaluator** — the same compile path walking `mcp-code-mode`'s single-destination inputs; empty selection/bundle/handoff collections and `overlay=null`/`P=static` emerge for free (synthesis §5.1). No `skillId` branch exists.
- **Projection generators** — `AdvisorProjectionV1`, `TypedRouteGoldV1`, `PolicyCardV1.md`, each derived from one snapshot and stamped with `effectivePolicyHash` + a projection hash (synthesis §8).
- **Compatibility projector** — maps typed decisions into the legacy `observedIntents`/`observedResources` contract so the shared scorer stays byte-for-byte unmodified (synthesis §8.2).
- **Shadow parity harness** — replays fixtures through the typed lane + compatibility projection, compares against legacy route-gold, classifies mismatches, never auto-updates gold, holds zero authority (synthesis §9).
- **Fenced activation selector** — accept (snapshot candidate + retained prior manifest) → ship (compare expected generation/hash, then atomic temp/fsync/rename under token lock + fencing epoch) → one generation pinned per request; rollback swaps to the byte-identical prior manifest (synthesis §9).

### Data Flow

```text
authored sources (mcp-code-mode SKILL.md + leaf-manifest.json + route-guard[advisory])
   -> compile()  --(fail-closed on missing mode / unresolved leaf / authority contradiction)-->
CompiledPolicyV1 (candidateCount=1, empty collections, overlay=null, P=static)  [content-addressed]
   -> { AdvisorProjectionV1, TypedRouteGoldV1 + compatibility fields, PolicyCardV1.md }
   -> shadow parity vs legacy route-gold  (ZERO live authority; scorer untouched)
   -> fenced ActivationManifestV1 (one generation pinned)  <-> byte-exact rollback
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches shared-policy and benchmark-adjacent boundaries, so the producer/consumer inventory is mandatory.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `router-replay.cjs` (shared scorer) | Deterministic route-gold replay authority | **Unchanged — MUST NOT touch** | `git diff --exit-code` empty; a needed edit = migration failure (synthesis §8.2, §10) |
| existing route-gold fixtures | Frozen benchmark expectations | Append typed fixtures only; never rewrite/auto-update | Existing gold byte-unchanged; new fixtures additive (synthesis §8.2) |
| `mcp-code-mode/SKILL.md`, `leaf-manifest.json` | Authored routing sources | Read-only inputs to `compile()` | Confirm against synthesis §5 line refs; no writes |
| `mcp-route-guard.cjs` | Advisory guard (`allow`/`warn`, fails open) | Unchanged; MUST NOT become VERIFY | Confirm advisory (synthesis §5.2 line refs); no wiring into destination VERIFY |
| live mode registries / hub routers | Serving-authoritative routing | Unchanged; read-only during shadow | Legacy stays serving-authoritative (synthesis §9) |
| Phase 0 schema module | Canonical serialization/hashing | Consumed (imported), not modified | Import boundary only; fail closed if absent |

Required inventories before implementation:
- Same-class producers of routing decisions: confirm the legacy router is the only serving authority during shadow.
- Consumers of the compiled artifact: only the three projections + the parity harness read it; nothing commits.
- Invariant to hold: *a proof/recommendation is never a capability* — authority stays destination-local (synthesis §2.3, §10).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm Phase 0 schema + deterministic serialization is importable; capture the Stage-0 legacy route-gold baseline green.
- [ ] Ingest `mcp-code-mode` authored sources read-only; verify against synthesis §5 confirmed line references.
- [ ] Stand up the isolated `<shadow-root>/` tree (no live path); wire the append-only fixture location.

### Phase 2: Core Implementation
- [ ] Implement `compile()` as a total, side-effect-free function producing `CompiledPolicyV1` with the three hashes; add the three fail-closed guards (synthesis §2.1; spec REQ-002).
- [ ] Compile `mcp-code-mode`; confirm N=1 empties emerge by partial evaluation (no name branch); preserve the 7 leaves / 6 selector classes / near-tie / zero-signal fallback (synthesis §5.1–§5.2).
- [ ] Generate the three projections from one snapshot; build the compatibility projector + typed fixtures (synthesis §8).
- [ ] Implement the shadow parity harness and the fenced activation + byte-exact rollback drill (synthesis §9).

### Phase 3: Verification
- [ ] Determinism (≥3× recompile hash-equal), degeneracy grep, three fail-closed negatives, scorer-diff-empty + gold-green, parity zero-authority, activation/rollback drill — all pass; Stage-1 gate satisfied (spec §5, §6).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Every success criterion is proven by a concrete check, not an assertion (synthesis §13 confidence discipline — structural claims verified, performance intentionally unclaimed):

| Test Type | Scope | Tools / Evidence |
|-----------|-------|------------------|
| Unit (determinism) | Recompile ≥3×; compare `effectivePolicyHash` + body bytes (SC-001) | Vitest + hash compare |
| Unit (degeneracy) | Assert emitted empty collections; `rg -n "mcp-code-mode"` shows no branching use (SC-002) | Vitest + ripgrep |
| Unit (fail-closed) | Three negative fixtures → typed `CompileError`, zero artifacts written (SC-003) | Vitest negative cases |
| Integration (scorer/gold) | `git diff --exit-code router-replay.cjs`; existing route-gold gate green (SC-004) | Existing route-gold gate |
| Integration (parity) | Shadow run: no COMMIT/effect; legacy authoritative (SC-005) | Shadow parity harness |
| Integration (rollback) | Fenced-CAS drill; restored manifest hash == pre-activation hash (SC-006) | Activation drill |
| Doc-only (standalone) | Route/clarify/defer/reject + `PREPARED_DRAFT` from `PolicyCardV1.md` alone (REQ-010) | Document-only replay lane |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 0 canonical schemas + deterministic serialization (`../000-contract-schemas/`) | Internal | Yellow (in progress) | Compiler cannot emit byte-stable policy; Phase 1 fails closed and halts |
| `mcp-code-mode` authored sources (SKILL.md, leaf-manifest.json, mcp-route-guard.cjs) | Internal | Green (confirmed, synthesis §5) | Wrong inputs invalidate the N=1 degeneracy proof |
| Existing route-gold gate + fixtures | Internal | Green | No baseline to compare shadow parity against |
| Shared scorer `router-replay.cjs` | Internal (read-only) | Green — MUST NOT touch | A required edit is a migration failure, not a dependency to change (synthesis §8.2, §10) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any Stage-1 gate check fails (non-deterministic bytes, fixtures do not parse, route-gold red, a scorer edit would be needed), or the activation/rollback drill does not restore byte-exact prior bytes.
- **Procedure**: discard the inactive generation (Stage 1 rollback) and/or disable the dual-read adapter (Stage 2 rollback); the isolated `<shadow-root>/` artifacts are additive and can be deleted wholesale. Legacy stays serving-authoritative throughout, so there is **no external effect to undo** — this phase emits zero COMMITs by construction (synthesis §9 rollback column, §10).
- **Irreversibility boundary**: rollback here is always byte-exact and total; the "cannot undo an external COMMIT" limitation (synthesis §9) applies only to later destination-rollout phases, not to this shadow phase.
<!-- /ANCHOR:rollback -->

---

## Cross-References

- **Specification**: `spec.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Master plan**: `../spec.md`
- **Source design**: `../../009-unified-refactor-research/unified-refactor-synthesis.md` (§2.1, §5, §8, §9, §10)
