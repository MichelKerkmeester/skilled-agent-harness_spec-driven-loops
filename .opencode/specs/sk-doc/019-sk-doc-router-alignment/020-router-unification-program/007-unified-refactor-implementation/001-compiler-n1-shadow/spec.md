---
title: "Feature Specification: Shadow Compiler + mcp-code-mode N=1 Compile"
description: "Phase 1 of the unified router refactor: build the pure, deterministic shadow compiler (authored sources -> CompiledPolicyV1, fail-closed on missing modes / unresolved leaves / authority contradictions), then compile ONLY mcp-code-mode as the degenerate N=1 case (candidateCount 1, empty selection/bundle/handoff collections, overlay null). Emit the three read-only projections plus legacy-gold compatibility fields and typed fixtures, run shadow parity against the legacy router with zero live authority, and prove one-generation fenced activation-manifest selection with byte-exact rollback. Smallest blast radius, fully reversible. Planning/design only."
trigger_phrases:
  - "shadow compiler n1 compile"
  - "mcp-code-mode degenerate compile"
  - "compiled policy shadow parity rollback"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/001-compiler-n1-shadow"
    last_updated_at: "2026-07-18T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Phase 1 spec-core (shadow compiler + mcp-code-mode N=1)"
    next_safe_action: "Run validate.sh --strict; generate description.json + graph-metadata.json"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

# Shadow Compiler + mcp-code-mode N=1 Compile

## EXECUTIVE SUMMARY

This is Phase 1 — the **recommended first slice** — of the unified router refactor synthesized by the Opus-4.8 council (`../../006-unified-refactor-research/unified-refactor-synthesis.md` §9). The refactor is *not a router rewrite*; it is a shadow compiler plus additive semantic gates activated one hub at a time behind a fenced selector, with legacy serving-authoritative throughout (synthesis §1).

This phase builds the **pure shadow compiler** (authored sources → `CompiledPolicyV1`, content-addressed, fail-closed) and exercises it against the single smallest input in the fleet: `mcp-code-mode`, the **degenerate N=1 case** of the same contract — one destination, empty selection/bundle/handoff collections, no overlay, `P = static` (synthesis §5.1). It emits the three read-only projections (advisor / route-gold / policy card), the legacy-gold compatibility fields, and typed fixtures; runs **shadow parity** against the legacy router with **zero live authority**; and proves a **one-generation fenced activation-manifest selection** with **byte-exact rollback** (synthesis §9 "Recommended first slice").

**Key decisions**: the N=1 empties arise from *partial evaluation over empty collections*, never a `skillId == mcp-code-mode` branch (synthesis §5.1); the base contract is complete and correct with `overlay = null` and `P = static`, and *that configuration is exactly the N=1 case* (synthesis §5.3, §12).

**Critical dependency**: the canonical `CompiledPolicyV1` schema and deterministic serialization/hashing are authored in Phase 0 (`../000-contract-schemas/`) and consumed here; this phase does not define them.

This spec is **planning/design only**. No live routing config, mode registry, hub router, benchmark scorer, or skill is modified by authoring or approving it.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-07-18 |
| **Phase** | 001-compiler-n1-shadow (Phase 1 of 010-unified-refactor-implementation) |
| **Migration stage owned** | Stage 1 Shadow compile (+ opens Stage 2 Dual-read fail-closed) |
| **Blast radius** | Low — additive shadow artifacts only, legacy stays authoritative, fully reversible |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The fleet has no single, verifiable representation of routing policy. Today routing behaviour is spread across authored mode registries, hub routers, leaf manifests, packet authority, and detector sources, and the only executable check is the deterministic route-gold replay driven by the shared scorer. The council design (synthesis §1–§2) resolves this by compiling those authored sources into one immutable, content-addressed `CompiledPolicyV1`. Before any of that touches a real hub, the compiler itself must be proven pure, deterministic, fail-closed, and reversible on the *smallest possible* input — otherwise the whole seven-stage migration (synthesis §9) rests on an unverified foundation.

### Purpose

Ship a pure shadow compiler that turns authored sources into a byte-stable `CompiledPolicyV1`, compile `mcp-code-mode` as the degenerate N=1 case with no special-casing, project it three ways, prove shadow parity with the legacy router at zero live authority, and demonstrate one-generation fenced activation plus byte-exact rollback — establishing the reversible foundation every later phase depends on.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **The pure compiler.** A total, side-effect-free function `compile(authoredSources) → CompiledPolicyV1 | CompileError` that builds `destinations[]`, `detectors[]`, `selectors[]`, `compositionRules[]`, `authorityGraph[]`, and the `(T,R,P)` posture, plus `basePolicyHash`, `overlayHash?`, `effectivePolicyHash` (synthesis §2.1).
- **Fail-closed compilation.** Missing referenced modes, leaves that do not resolve to a destination, and authority-graph contradictions each raise a typed `CompileError` and emit **no** partial policy artifact (synthesis §9 hard gates; §5.2 fail-closed on unmapped leaves).
- **Compile ONLY `mcp-code-mode`.** The N=1 case: `candidateCount = 1`, `selectionKinds = {single}`, `crossTargetEdges = []`, `bundleRules = []`, `handoffEdges = []`, `overlay = null`, `P = static` — the empties reached by partial evaluation over empty inputs, not a name branch (synthesis §5.1, §5.3).
- **Retained N=1 admission + leaf routing.** Positive *and* negative admission; zero leaf signal ⇒ `defer(no-match)` (never default-to-self); ambiguous leaf evidence ⇒ one `clarify`; the seven leaves, six selector classes, near-tie path, and zero-signal fallback all preserved; `mcp-route-guard.cjs` stays advisory (synthesis §5.2).
- **The three read-only projections**, generated from one compiled snapshot: `AdvisorProjectionV1`, `TypedRouteGoldV1` fixtures, `PolicyCardV1.md` (synthesis §2.1, §8.1, §8.3).
- **Legacy-gold compatibility.** A compatibility projector that maps typed decisions back into the existing `observedIntents`/`observedResources` shape, plus typed fixtures (synthesis §8.2).
- **Shadow parity harness** — read-only, zero live authority, legacy serving-authoritative (synthesis §9 Stage 1/3).
- **Fenced activation + rollback drill** for the single `mcp-code-mode` generation: one-generation selection via `ActivationManifestV1`, byte-exact rollback to the prior manifest (synthesis §9).

### Out of Scope

- The canonical schema definitions and deterministic serialization/hashing themselves — owned by Phase 0 (`../000-contract-schemas/`); consumed here, not authored here.
- The pure decision evaluator emitting the four-action algebra at runtime — Phase 2 (`../002-decision-evaluator/`). This phase emits typed fixtures, not the live evaluator.
- Destination-local PREPARE → VERIFY → COMMIT, receipts, idempotency — Phase 3 (`../003-execution-verify-commit/`).
- The clarify→handoff recovery ladder and the shared uncertainty budget — Phase 4 (`../004-recovery-ladder/`). `handoffEdges = []` here.
- Calibrated auto-route and its held-out corpus — Phase 5 (`../005-calibration/`). No calibration threshold exists at N=1 (synthesis §5.1).
- Any hub other than `mcp-code-mode` (`sk-code`, `system-deep-loop`, `mcp-tooling`) — Phase 6 (`../006-parent-hub-rollout/`).
- The correction overlay / learning plane — Phase 7 (`../007-learning-overlay/`). `overlay = null` here; nothing to learn at N=1 (synthesis §5.1, §12).
- Legacy dual-read retirement and per-skill deletion gates — Phase 8 (`../008-fleet-cleanup/`).
- **Any mutation of live routing config, mode registry, hub router, the shared scorer, or any skill.** This phase is planning/design; when built, all live surfaces stay read-only sources.

### Files to Change

All emitted artifacts are **new, additive, and isolated** in a shadow tree; no live routing surface is modified. Proposed paths are flagged; the final shadow-tree root is resolved with Phase 0 (synthesis §11 Q4/Q5 leave serialization + ledger location open).

| File / Artifact | Change Type | Description |
|-----------------|-------------|-------------|
| `<shadow-root>/compiler/` | Create (Proposed) | The pure `compile()` function + fail-closed guards; isolated from all live routing code |
| `<shadow-root>/compiled/mcp-code-mode/policy.json` | Create (Proposed) | Emitted `CompiledPolicyV1` for the N=1 case (content-addressed) |
| `<shadow-root>/compiled/mcp-code-mode/advisor-projection.json` | Create (Proposed) | `AdvisorProjectionV1` — omits paths/tools/fences/authority (synthesis §8.1) |
| `<shadow-root>/compiled/mcp-code-mode/route-gold.typed.json` | Create (Proposed) | `TypedRouteGoldV1` fixtures + compatibility-projected legacy fields (synthesis §8.2) |
| `<shadow-root>/compiled/mcp-code-mode/policy-card.md` | Create (Proposed) | `PolicyCardV1.md` generated from the same snapshot (synthesis §8.3) |
| `<shadow-root>/activation/manifest.json` + retained prior generation | Create (Proposed) | `ActivationManifestV1` + byte-exact prior-generation retention for rollback (synthesis §9) |
| `<shadow-root>/parity/` | Create (Proposed) | Read-only shadow parity harness (zero live authority) |
| `.../mcp-code-mode/SKILL.md`, `.../mcp-code-mode/leaf-manifest.json` | Read-only source | Authored inputs to the compiler; never modified |
| `.../mcp-code-mode/runtime/lib/mcp-route-guard.cjs` | Read-only source | Confirmed advisory (`allow`/`warn`, fails open); MUST NOT become destination VERIFY (synthesis §5.2) |
| `.../system-skill-advisor/.../router-replay.cjs` (shared scorer) | Unchanged — MUST NOT touch | Hard constraint; a required scorer edit is a migration failure (synthesis §8.2, §10) |
| existing route-gold fixtures | Append-only | New typed fixtures added; existing gold never rewritten or auto-updated (synthesis §8.2) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Pure, deterministic, content-addressed compiler: authored sources → `CompiledPolicyV1` (synthesis §2.1) | `compile()` is a total function with no side effects beyond reading declared sources; identical inputs produce a byte-identical policy body and identical `effectivePolicyHash` across ≥3 runs and across two machines/processes |
| REQ-002 | Fail-closed on missing modes / unresolved leaves / authority contradictions (synthesis §9 hard gates, §5.2) | Each of the three fault classes yields a typed `CompileError` naming the offending element; **no** policy artifact (not even partial) is written on failure; a negative fixture exists per class |
| REQ-003 | Compile `mcp-code-mode` as the degenerate N=1 case (synthesis §5.1, §5.3) | Emitted policy has `candidateCount=1`, `selectionKinds={single}`, `crossTargetEdges=[]`, `bundleRules=[]`, `handoffEdges=[]`, `overlay=null`, `P=static`; a source grep proves there is **no** `skillId == "mcp-code-mode"` (or equivalent name) conditional anywhere in the compiler/evaluator path |
| REQ-004 | Retain full N=1 admission + leaf routing — not a stub (synthesis §5.2) | Zero leaf signal ⇒ `defer(no-match)` (never default-to-self route); ambiguous leaf evidence ⇒ exactly one `clarify`; the 7 leaves, 6 selector classes, near-tie path, and zero-signal fallback all present in the compiled graph; `mcp-route-guard.cjs` stays advisory and is never wired as VERIFY |
| REQ-005 | Emit the three projections from one compiled snapshot (synthesis §2.1, §8.1, §8.3) | `AdvisorProjectionV1` (no paths/tools/fences/handoff-leases/commit-authority), `TypedRouteGoldV1`, and `PolicyCardV1.md` are all generated from the same snapshot; each carries the `effectivePolicyHash` plus its own projection hash; the card is *generated from the snapshot*, not merely hash-matched to a hand-written view (synthesis §8.3) |
| REQ-006 | Legacy-gold compatibility fields + typed fixtures without editing the scorer (synthesis §8.2, §10) | The compatibility projector maps positive routes → `observedIntents`/`observedResources`, and `clarify\|defer\|reject` → the existing empty-intent convention; `git diff` on `router-replay.cjs` is empty; the existing route-gold gate stays green with the projected fields |
| REQ-007 | Shadow parity with zero live authority (synthesis §9 Stage 1/3, §10) | The shadow lane runs against the legacy router while legacy stays serving-authoritative; the compiled policy emits **no** COMMIT/effect; mismatches are classified and the gold is **never** auto-updated; a scorer edit needed to pass is treated as a migration failure and blocks |
| REQ-008 | One-generation fenced activation + byte-exact rollback (synthesis §9) | Activation is a fenced CAS on `ActivationManifestV1` (token lock + fencing epoch checked immediately before an atomic temp/fsync/rename); a request pins exactly one generation; the rollback drill swaps to the retained prior manifest and the restored bytes are hash-equal to the pre-activation manifest |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Confirm the N=1 residual cost is shared safety machinery, not singleton overhead (synthesis §5.3) | Leaf scoring, manifest membership, hashing, and the activation fence are documented as correctness/reversibility cost; no per-singleton special path is introduced to "optimize them away" |
| REQ-010 | Standalone document-only routing from `PolicyCardV1.md` at N=1 (synthesis §8.3) | Using the card alone (no advisor, no scorer), an AI can route single / clarify once / defer / reject and emit `PREPARED_DRAFT`; the honest terminal `DOCUMENT_ONLY_UNATTESTED` is reachable and the card never claims live activation freshness or committed effects |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Determinism** — recompiling `mcp-code-mode` from unchanged authored sources yields a byte-identical `CompiledPolicyV1` body and identical `effectivePolicyHash` across ≥3 runs (synthesis §2.1, §10).
- **SC-002**: **Degeneracy by construction** — the compiled N=1 policy shows all empty collections and `overlay=null`/`P=static`, and a grep confirms zero name-based special-casing in the compiler/evaluator path (synthesis §5.1).
- **SC-003**: **Fail-closed proven** — one negative fixture each for missing mode, unresolved leaf, and authority contradiction produces a typed `CompileError` and writes no artifact (synthesis §9, §5.2).
- **SC-004**: **Scorer untouched, gold green** — `router-replay.cjs` diff is empty and the existing route-gold gate passes with the compatibility-projected fields (synthesis §8.2, §10).
- **SC-005**: **Zero live authority** — the shadow parity run completes with legacy serving-authoritative and no COMMIT/effect emitted by the compiled policy (synthesis §9, §10).
- **SC-006**: **Byte-exact rollback** — the activation/rollback drill restores a manifest whose bytes are hash-equal to the pre-activation manifest, with one generation pinned per request (synthesis §9).
- **SC-007**: **One-snapshot projections** — the three projections are generated from a single snapshot and all carry the same `effectivePolicyHash` (synthesis §2.1, §8).
<!-- /ANCHOR:success-criteria -->

---

## 6. MIGRATION GATE

This phase owns **Stage 1 — Shadow compile** of the shared seven-stage migration-gate model in the master plan (`../spec.md` "SHARED MIGRATION-GATE MODEL"; synthesis §9 migration table), and it *opens* **Stage 2 — Dual-read** by establishing fail-closed input resolution.

- **Serving authority during this phase**: **legacy** (unchanged). The compiled tuple has zero live authority.
- **Gate that MUST pass before Phase 2 (`../002-decision-evaluator/`) activates**:
  1. Canonical bytes regenerate deterministically (SC-001).
  2. Typed fixtures parse (`TypedRouteGoldV1`).
  3. Route-gold stays green via the compatibility projector, scorer untouched (SC-004).
  4. Every legacy `mcp-code-mode` input resolves through a declared mode/alias, and any unmapped input **fails closed** (opens Stage 2; synthesis §9 Stage 2 gate).
- **Rollback for this phase**: discard the inactive generation (Stage 1) / disable the dual-read adapter (Stage 2) — both reversible, no external effect to undo (synthesis §9 rollback column).

Per the master plan, Stage 2 (Dual-read) is co-owned with Phase 6 (`../006-parent-hub-rollout/`); this phase satisfies it only for `mcp-code-mode`.

---

## 7. HARD CONSTRAINTS (apply to every phase)

These are non-negotiable for this phase and every later phase (synthesis §10 constraint-compliance; master plan "Hard constraints"):

- **Deterministic offline route-gold replay preserved** — identical inputs compile to byte-identical policy bodies; replay never calls a live advisor (synthesis §10).
- **NEVER touch the shared benchmark scorer** (`router-replay.cjs`) — a required scorer edit is a migration failure, not a licence to edit it (synthesis §8.2, §10).
- **Authority stays destination-local** — a proof or recommendation is evidence, never a capability; only destination VERIFY→COMMIT consumes authority; negatives withhold authority; the advisor is evidence-only (synthesis §2.3, §8.1, §10).
- **Reversible + gated** — each activation is a fenced CAS on the activation manifest; requests pin one generation; rollback swaps to the byte-identical prior manifest and CANNOT undo an external COMMITted effect (post-effect recovery is destination-owned) (synthesis §9).
- **No over-emission** — zero-signal ⇒ typed `defer` with no fallback/default union; the full registry is never unioned into scored routes (synthesis §2.3 `basis`, §10).

---

## 8. L2: VERIFICATION & EDGE CASES

### Verification approach (evidence, not assertion)

- **Determinism**: recompile ≥3×, hash-compare bodies and `effectivePolicyHash` (SC-001).
- **Degeneracy**: assert the empty collections on the emitted policy; `rg -n "mcp-code-mode"` across the compiler/evaluator path returns zero *branching* uses (SC-002).
- **Fail-closed**: run the three negative fixtures; assert typed error + no artifact written (SC-003).
- **Scorer/gold**: `git diff --exit-code` on the scorer; run the existing route-gold gate green (SC-004).
- **Parity**: run the shadow lane; assert no COMMIT/effect and legacy authority intact (SC-005).
- **Activation/rollback**: run the fenced-CAS drill; hash-compare restored manifest to pre-activation bytes (SC-006).

### Edge cases (from the degeneracy proof, synthesis §5.2)

- **Zero leaf signal** ⇒ `defer(no-match)` — the single target does **not** become an unconditional route.
- **Ambiguous leaf evidence** ⇒ exactly one `clarify` (≤3 options + `none_of_these`), never an invented second mode.
- **Forbidden request** ⇒ `reject` with authority withheld — must not be swallowed by default-to-self.
- **Three admission scopes stay separate** (synthesis §5.2): (1) fleet admission to Code Mode, (2) knowledge-leaf loading inside `mcp-code-mode`, (3) external manual/tool selection during Code Mode execution — never conflated into one "admission".
- **Concurrent activation**: fencing epoch checked immediately before rename; a stale token loses the CAS and does not swap.
- **Missing schema (Phase 0 not ready)**: compiler refuses to emit rather than inventing a serialization — fail-closed (REQ-002 spirit).

---

<!-- ANCHOR:risks -->
## 9. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 0 canonical schemas + deterministic serialization (`../000-contract-schemas/`) | Compiler cannot emit a byte-stable policy without them | Gate Phase 1 start on Phase 0's Stage-0 baseline + schema freeze; fail closed if absent |
| Dependency | Confirmed `mcp-code-mode` authored sources (`SKILL.md`, `leaf-manifest.json`, `mcp-route-guard.cjs`) | Wrong inputs invalidate the N=1 proof | Read-only ingestion; verify against synthesis §5 confirmed line refs before compiling |
| Risk | Accidental name-based special-casing creeping into the compiler | Would fork common semantics and violate the degeneracy proof (synthesis §5.1, §6) | Grep gate in SC-002; code review for any `skillId`/name conditional |
| Risk | A scorer edit "needed" to make gold pass | Loses baseline comparability — a hard-constraint violation (synthesis §8.2, §10) | Treat as migration failure; block; fix the projector, never the scorer |
| Risk | Over-emission via a fallback/default union at zero signal | Breaks the no-over-emission constraint (synthesis §10) | `defer(no-match)` with no union; forbidden-artifact assertion in fixtures |
| Risk | Rollback assumed to undo effects | Rollback cannot reverse an external COMMIT (synthesis §9) | This phase emits zero effects; document post-effect recovery as destination-owned for later phases |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Canonical JSON serialization + domain-separation strings for byte-stable policy/proof hashes — inherited from synthesis §11 Q4; resolved with Phase 0 before this compiler can guarantee SC-001.
- Final location of the isolated `<shadow-root>/` tree and the activation-manifest retention window (how many prior generations to keep) — a shadow-only operational decision for this phase.
- Whether the advisor projection can consume the compiled card directly or needs a generated byte-identical view (synthesis §11 Q6) — affects REQ-005/REQ-010 but not the N=1 correctness proof.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Build approach**: `plan.md`
- **Task breakdown**: `tasks.md`
- **Verification checklist**: `checklist.md`
- **Master plan (phase map + shared gate model)**: `../spec.md`
- **Source design (single source of truth)**: `../../006-unified-refactor-research/unified-refactor-synthesis.md` (esp. §1, §2.1, §5, §8, §9, §10)
