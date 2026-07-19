---
title: "Feature Specification: Learning Overlay — Offline CorrectionOverlayV1 (Phase 7)"
description: "The OPTIONAL/OFFLINE/LAST phase of the unified router refactor: the CorrectionOverlayV1 learning plane. Sanitized handoff+correction records compile OFFLINE into a candidate overlay that learns only the vocabulary→destination assignment (never weights — weights are a uniform inert 4), pass deterministic route-gold replay plus safety/parity gates plus an independent human promotion, then activate by a fenced pointer CAS that flips WHICH frozen overlay is serving. The serving policy is never edited online; the base contract stays complete and correct with overlay=null / P=static; and the whole phase is gated on a demonstrated routing gain from real correction-telemetry volume — it may run P=static forever."
trigger_phrases:
  - "learning overlay phase"
  - "correction overlay offline promotion"
  - "vocabulary to destination overlay CAS"
importance_tier: "critical"
contextType: "implementation"
status: "implemented-dormant"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Learning Overlay — Offline CorrectionOverlayV1 (Phase 7)

## EXECUTIVE SUMMARY

This phase builds the **learning plane** of the unified router refactor: `CorrectionOverlayV1`, an offline-promoted adjustment to the compiled policy's vocabulary→destination assignment (synthesis §2 LEARNING PLANE; §2.1; Idea 2). It is deliberately the **OPTIONAL / OFFLINE / LAST** phase. The base contract is already complete and correct with `overlay = null` and `P = static` — that configuration *is* the load-bearing N=1 case (synthesis §5.3, §12) — so nothing here may become load-bearing for the base contract.

The mechanism is a one-directional, gated pipeline: **sanitized handoff/correction records → candidate overlay (learns the vocab→destination table, not weights) → deterministic replay + safety/parity gates + independent human promotion → activation pointer CAS** (synthesis §2). Learning never edits a serving policy; it flips *which* frozen, separately-hashed overlay is active behind the fenced activation manifest (synthesis §2.1, §4 seam D). The effective identity is `hash(base, overlay|null, schema, generation)`, pinned once per request (synthesis §4 seam D), so a mutable online overlay — which would break deterministic replay and request-pinned identity — is an eliminated alternative (synthesis §6).

Crucially, the phase is **gated on a demonstrated routing gain from real correction-telemetry volume**. At `N=1` there is nothing to learn (one destination, inert weights, no handoff signal), and most parent hubs may run `P = static` forever (synthesis §12). This spec therefore specifies a subsystem that may be built, may sit dormant, and may never be promoted — and that is a correct outcome, not a failure. This document is **planning/design only**: it defines the contract and gates, and does not modify any live routing config, registry, scorer, or skill.

## PROBLEM & PURPOSE

### Problem Statement
The refactor's route decisions are compiled from authored sources and are static per generation. Real routing corrections — a user re-routing after a `defer`, an accepted `handoff`, a repeated near-tie resolved the same way — carry signal about how a hub's *vocabulary* maps to *destinations*, but there is no safe channel to fold that signal back in. The naive answer (a mutable online overlay) is unsafe: it breaks deterministic offline route-gold replay and the request-pinned effective identity that the entire route-gold safety net depends on (synthesis §6, §4 seam D). Idea 2's value is real, but it rests on the least-validated idea in the set (single-model GLM inference, no live execution) and contributes zero to the load-bearing degenerate case (synthesis §12, §13).

### Purpose
Provide a **safe, reversible, offline-only** learning channel: a candidate `CorrectionOverlayV1` that learns *only* the vocabulary→destination assignment, is proven byte-stable and route-gold-green before it can serve, requires independent human promotion, and is activated (and rolled back) by a fenced pointer CAS — never by editing a live policy.

## SCOPE

### In Scope
- Consuming the `CorrectionOverlayV1` schema + canonical serialization defined in phase `000-contract-schemas`, and the `hash(base, overlay|null, schema, generation)` effective-identity contract from phase `001-compiler-n1-shadow`.
- An **offline** correction/handoff record ingestion + sanitizer (privacy filter + retention policy, per synthesis open-q 7) that normalizes receipts from `003-execution-verify-commit` and handoff records from `004-recovery-ladder` into training records.
- An **offline** candidate-overlay compiler that derives *only* vocabulary→destination adjustments, freezes them, and content-addresses the result.
- A deterministic replay harness that reuses phase `002`'s pure evaluator + the **compatibility projector** to run the existing route-gold against `base` vs `base+candidate`, classifying every delta — the shared scorer is never touched.
- Safety/parity gate definitions + an **independent human promotion** protocol (approver distinct from the proposer; approval recorded).
- Fenced-CAS activation on the activation manifest, a retained prior generation, and a byte-exact rollback drill.
- Overlay replay/rollback fixtures added to the typed route-gold family (synthesis §8.2).

### Out of Scope
- Modifying any live routing config, registry, scorer, or skill — this phase is planning/design only.
- Any **online / live** overlay mutation — eliminated alternative (synthesis §6); the serving policy is never edited online.
- Learning *weights* or any field beyond vocabulary→destination — weights are a uniform inert `4`; whether other fields are learnable per hub is synthesis open-q 3 and needs live validation first.
- Calibrated auto-route certificates — owned by phase `005-calibration`.
- Editing the shared benchmark scorer `router-replay.cjs` — a scorer edit to make an overlay pass is a migration failure (synthesis §8.2, §10).
- **Building or promoting the overlay before a demonstrated routing gain from real correction-telemetry volume exists** (synthesis §12) — the phase may remain unbuilt or dormant indefinitely.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `007-learning-overlay/spec.md` | Create | This specification (planning/design only) |
| `007-learning-overlay/plan.md` | Create | Build approach for the offline overlay plane |
| `007-learning-overlay/tasks.md` | Create | Ordered, checkable task list |

## REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `CorrectionOverlayV1` is a separately-hashed **immutable** artifact; the effective identity is `hash(base, overlay\|null, schema, generation)`, pinned once per request (synthesis §2.1, §4 seam D). | A compiled candidate emits `overlayHash` distinct from `basePolicyHash`; the base bytes are unchanged; the request-pinned `pinnedActivationGeneration` resolves to exactly one effective tuple. |
| REQ-002 | The overlay learns **only** the vocabulary→destination assignment — never weights (weights are a uniform inert `4`) (synthesis §3 Idea 2; open-q 3; §12). | The overlay schema exposes only vocab→destination adjustment fields; a test rejects any candidate that carries a weight or non-vocabulary field. |
| REQ-003 | The serving policy is **never edited online**; promotion flips *which* frozen overlay is active via a fenced pointer CAS; the prior generation is retained (synthesis §2, §4 seam D, §9 stage 5). | No code path mutates an active policy in place; activation is a CAS on the activation manifest; the prior (base-only or prior-overlay) generation remains byte-recoverable. |
| REQ-004 | A candidate overlay passes **deterministic offline route-gold replay** via the compatibility projector; `router-replay.cjs` is never touched (synthesis §8.2, §10). | Route-gold runs green against `base+candidate`; `git diff` on `router-replay.cjs` is empty; any required scorer edit is logged as a migration failure, not applied. |
| REQ-005 | Promotion requires **safety/parity gates + independent human approval**; aggregate score may inform but never overrides a hard gate (synthesis §9 stage 5; §9 hard-gate list). | An overlay activates only with a recorded approval from an approver distinct from the proposer; a hard-gate violation (hash mismatch, mixed generations, authority leak) blocks activation regardless of score. |
| REQ-006 | The activated tuple is **byte-stable** and reversible: replay + rollback fixtures prove byte-identical restoration of the prior generation (synthesis §9 stage 5; §8.2 overlay replay/rollback fixture). | A rollback drill CAS-swaps to the prior manifest and reproduces byte-identical policy bytes; the overlay replay/rollback fixture passes. |
| REQ-007 | Authority stays **destination-local**: a promoted overlay is evidence/recommendation, never a capability; it reweights vocab→destination assignment but never grants a destination authority or bypasses VERIFY (synthesis §2.2, §10). | A test proves an overlay cannot cause a non-`route` decision to carry a target, cannot let an evidence target COMMIT, and cannot short-circuit destination VERIFY. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | The training corpus is **sanitized** — a privacy filter + retention policy govern the shadow-evaluation traffic sample (synthesis open-q 7). | No raw or unfiltered record reaches the overlay compiler; retention/partition policy is declared and enforced by the ingestion stage. |
| REQ-009 | The base contract remains **complete and correct with `overlay = null` / `P = static`**; the overlay must not become load-bearing for the base (synthesis §5.3, §12). | Removing the overlay entirely changes no base-route behavior; an `overlay = null` equivalence test passes; the base route-gold is unaffected by the overlay subsystem's presence. |
| REQ-010 | The phase is **gated on a demonstrated routing gain from real correction-telemetry volume** and may run `P = static` forever (synthesis §12). | A documented meta-gate blocks any promotion until a measured routing gain over a real telemetry corpus is recorded; absent that evidence, the subsystem stays dormant and unpromoted. |

## SUCCESS CRITERIA

- **SC-001**: A candidate overlay compiles **offline** from sanitized correction records into a byte-stable `EffectivePolicy` tuple whose identity is `hash(base, overlay, schema, generation)` with the base bytes unchanged (REQ-001, REQ-006).
- **SC-002**: Deterministic offline route-gold replay stays **green** with the candidate overlay via the compatibility projector, and `router-replay.cjs` is provably unmodified (REQ-004).
- **SC-003**: Overlay activation is a **fenced CAS** on the activation manifest, and a rollback drill restores the **byte-identical** prior (base-only or prior-overlay) generation (REQ-003, REQ-006).
- **SC-004**: **No online mutation path exists** — a test proves the serving policy is immutable during a request and that a promoted overlay only changes which frozen artifact is active (REQ-003).
- **SC-005**: The base contract is unaffected by the overlay: with `overlay = null` / `P = static` all base behavior is identical, proving the overlay is **not load-bearing** (REQ-009).
- **SC-006**: Promotion requires an **independent human approval record** and passes all safety/parity hard gates; no aggregate score alone activates an overlay (REQ-005).
- **SC-007**: The phase's **meta-gate** is documented and enforced: no overlay is promoted absent a demonstrated routing gain from real correction-telemetry volume (REQ-010).

## MIGRATION GATE

This phase owns **Stage 5 — Offline overlay** in the master plan's shared migration-gate model (`../spec.md` → "SHARED MIGRATION-GATE MODEL", row "5 Offline overlay … Owned by phase(s): 007"; synthesis §9 stage 5). Its advancement gate is exactly:

> **offline replay + safety/parity + independent approval + byte-stable tuple.**

Concretely, a promoted overlay (an `EffectivePolicy` with `overlay ≠ null`) may become serving-authoritative **only after**: (1) the candidate passes deterministic offline route-gold replay through the compatibility projector with the scorer untouched; (2) safety and parity gates pass with zero hard-gate violation; (3) an independent human approver (distinct from the proposer) records approval; and (4) the resulting tuple is byte-stable and its prior generation is retained for a byte-exact rollback CAS (synthesis §9 stage 5, rollback = "CAS to base-only/prior overlay").

Because this phase is **OPTIONAL / OFFLINE / LAST**, "before the next activates" has two readings, both enforced here:
- **Meta-gate (before this phase runs at all):** promotion is blocked until a demonstrated routing gain from real correction-telemetry volume exists (synthesis §12). Until then the plane may be built but stays dormant, or is never built — `P = static` forever is a valid terminal state.
- **Downstream (before phase `008-fleet-cleanup` retires legacy dual-read):** any overlay in service must already sit behind the fenced CAS with a proven rollback, so that fleet cleanup (Stage 7) never inherits an un-reversible learned generation.

**Non-negotiable constraints (apply to every phase of the refactor):** deterministic offline route-gold replay is preserved; the shared benchmark scorer `router-replay.cjs` is **never** touched; authority stays destination-local (a proof/recommendation is never a capability); every activation is reversible and gated (fenced CAS activation with a retained prior generation); and there is no over-emission. This phase adds one further self-imposed constraint from synthesis §12: **the overlay must never become load-bearing for the base contract.**

## RELATED DOCUMENTS

- **Build approach**: `plan.md`
- **Task breakdown**: `tasks.md`
- **Phase parent**: `../spec.md` (phase map + shared migration-gate model)
- **Source design**: `../../006-unified-refactor-research/unified-refactor-synthesis.md` (§2 learning plane, §4 seam D, §9 stage 5, §12, open-q 3/7)
