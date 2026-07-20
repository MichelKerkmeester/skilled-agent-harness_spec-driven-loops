---
title: "Feature Specification: Unified Router Refactor — Fuse the 8 Ideas into 1"
description: "20-iteration, 3-model, non-converge deep-research lineage (10 GPT-5.6-SOL xhigh + 5 Terra xhigh + 5 Luna max, all fast, concurrency >=3) designing ONE coherent router refactor that takes the best of all eight routing ideas (compiled policy, correction overlay, typed no-destination, no-wrong-door handoff, calibrated negotiation, minimal typed contract, proof-carrying commit, and the T-R-P decomposition) and makes them work together perfectly — optimized for BOTH parent skills with modes AND simple singular skills like mcp-code-mode, where a singular skill must be the degenerate N=1 case of the same contract. A fresh OPUS 4.8 xhigh ai-council synthesizes when all iterations finish."
trigger_phrases:
  - "unified router refactor research"
  - "fuse eight routing ideas into one"
  - "parent hub and singular skill routing contract"
importance_tier: "critical"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: templates/spec.md -->
<!-- SPECKIT_LEVEL: 2 -->

# Unified Router Refactor — Fuse the 8 Ideas into 1

## EXECUTIVE SUMMARY

Design ONE router refactor that fuses all eight ideas in packet `024` into a single coherent architecture — taking the best of each, resolving their overlaps, and proving they work together. The refactor must be **optimized for parent skills with modes AND simple singular skills like `mcp-code-mode`**: a singular (mode-less) skill must be the **degenerate N=1 case of the exact same contract**, with near-zero overhead and no special-casing. Non-converge: 20 iterations across 3 models; diverge and stress-test, do not settle early. A fresh OPUS 4.8 xhigh ai-council synthesizes the final design.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete - research synthesis delivered and strict validation reports zero errors |
| **Created** | 2026-07-18 |
| **Context** | Architecture research and planning only |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The eight source ideas overlap at their most important boundaries: outcome typing, uncertainty recovery, policy posture, compiled identity, authority, and migration. Treating them as separate routers would duplicate control planes, weaken deterministic replay, and make the singular-skill case either a special branch or an over-built approximation.

### Purpose

Produce one evidence-backed contract family that assigns each idea a distinct authority boundary, closes every named overlap, preserves the unchanged route-gold scorer, and proves that a mode-less skill is the cardinality-one case of the same design used by parent hubs.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Research Context

Source (do NOT re-derive the individual ideas): the eight sibling presentations + their dives in `../001..008/`, and `../GLM-cross-lineage-notes.md`. The likely spine (validate/revise, don't assume): compiled content-addressed policy (1) expressed as a typed contract (6) with a PREPARE/VERIFY/COMMIT lifecycle (7); the "no clear route" branch is a typed outcome (3) that can escalate to bounded handoff (4) or a calibrated one-turn clarification (5); a replayable learning overlay (2) improves it offline; the whole policy is parameterized by the (T,R,P) knob-space (8) so each skill picks its corner.

### Idea-Specific Agenda

1. **The fused architecture.** One end-to-end design: which layer owns what, the data flow, the one typed contract, and where each of the 8 ideas lives inside it.
2. **Resolve the overlaps + conflicts.** 3 vs 6 (both type outcomes) → one outcome algebra; 4 vs 5 (both handle uncertainty) → one ordered ladder; 8's (T,R,P) vs 6's decision contract → knobs vs shape; 2's overlay vs 1's compiled base → base+overlay identity. Name every seam and how it closes.
3. **Singular-skill degeneracy (the load-bearing test).** Prove `mcp-code-mode` (no modes) instantiates the SAME contract as its degenerate case: tiny compiled policy, decision collapses to route/defer, no bundles, (T,R,P) trivial, single-leg commit, no learning needed. Show the complexity dial from singular → multi-mode parent hub with zero special-casing.
4. **The migration.** A phased, gated, reversible path (one hub at a time, route-gold green each step); what ships first; what stays a compiler-adapter shim.
5. **Falsify.** Stress the fused design against real hubs (sk-code bundles, system-deep-loop same-packet modes, mcp-tooling transports) AND singular skills; name what breaks.

### Mandatory Cross-Cutting Evaluation

1. **System skill advisor integration** — what Layer-0 (`system-skill-advisor`) must carry/consume; what degrades if it is absent or stale.
2. **Benchmark integration** — deterministic route-gold replay preserved; new fixtures/contracts; never edits the shared scorer (`router-replay.cjs`).
3. **Standalone effectiveness on documents alone** — can an AI route off the `SKILL.md` + compiled-policy card + typed contract ALONE, no advisor and no scorer, for both a parent hub and `mcp-code-mode`.

### Hard Constraints

- Deterministic offline route-gold replay preserved. Never touch the shared benchmark scorer.
- Authority stays destination-local; a recommendation/proof is never a capability.
- Reversible + gated; no over-emission (never union the full registry into scored routes).
- Graceful degradation to singular skills is a requirement, not a nice-to-have.

### In Scope

- A 20-iteration, multi-lineage research program on the fused architecture, overlap resolution, singular-skill degeneracy, migration, and falsification.
- A council synthesis that reconciles the lineages into one end-to-end design.
- Advisor, benchmark, and standalone-document integration analysis.

### Out of Scope

- Implementing the proposed router contract.
- Editing live routing configuration or the shared benchmark scorer.
- Re-deriving the eight individual source ideas.

### Deliverable

Per-iteration narrative in `research/`; the fresh OPUS 4.8 xhigh ai-council synthesizes the unified design when all 20 iterations finish.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fuse all eight source ideas into one contract family with explicit ownership boundaries. | The synthesis maps every idea to one plane and explains how the planes interact. |
| REQ-002 | Resolve the four named overlaps without parallel outcome, recovery, posture, or identity systems. | The synthesis records one mechanism for each of the 3-vs-6, 4-vs-5, 8-vs-6, and 2-vs-1 seams. |
| REQ-003 | Prove singular-skill degeneracy without a skill-name branch or a separate router. | The N=1 analysis identifies what constant-folds away and what safety behavior remains. |
| REQ-004 | Preserve deterministic route-gold replay without modifying the shared scorer. | Benchmark integration uses a compatibility projection and explicitly keeps `router-replay.cjs` unchanged. |
| REQ-005 | Keep execution authority destination-local. | Only a verified positive route may carry targets; recommendations, proofs, ranks, and negative outcomes remain non-authoritative. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Define a gated, reversible migration rather than a big-bang rewrite. | The synthesis supplies staged activation, canary gates, request-pinned generations, and byte-exact pointer rollback. |
| REQ-007 | Explain advisor, benchmark, and document-only behavior, including degraded operation. | Each integration receives a bounded contract and explicitly states what it cannot claim. |
| REQ-008 | Falsify the design against representative parent-hub archetypes and the singular case. | The design is checked against `sk-code`, `system-deep-loop`, `mcp-tooling`, and `mcp-code-mode`, with residual risks retained. |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One closed decision algebra represents positive routing, clarification, deferral, and rejection without target-bearing negative outcomes.
- **SC-002**: Every source idea has one stated owner and every named overlap closes into one mechanism.
- **SC-003**: The singular `mcp-code-mode` case uses the same schema and evaluator semantics while multi-target collections reduce to empty.
- **SC-004**: Migration preserves the shared scorer, supports per-hub canaries, and has an explicit reversal path.
- **SC-005**: Advisor absence or staleness degrades to local policy rather than conferring authority.
- **SC-006**: The final synthesis distinguishes confirmed, derived, and proposed claims and retains unresolved empirical questions.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Eight source presentations, four lineage syntheses, and cross-lineage notes | Missing or inconsistent source evidence could weaken the fusion | Treat the source set as frozen evidence and label claims by evidence strength. |
| Dependency | Existing route-gold scorer and destination-local skill contracts | The proposed compatibility and authority boundaries must fit existing behavior | Use read-only projections and leave capability checks at the destination. |
| Risk | Contract surface grows beyond what N=1 needs | Singular skills could pay for unused parent-hub machinery | Make cardinality-one the base case and require empty collections to constant-fold. |
| Risk | Advisor rank or proof is mistaken for capability | Stale or weak evidence could cause unauthorized execution | Withhold authority until destination verification and keep negative outcomes target-free. |
| Risk | Offline learning becomes an online mutable control plane | Replay identity and deterministic behavior would break | Keep overlays immutable, separately hashed, offline-promoted, and optional. |
| Risk | Architectural confidence is mistaken for measured runtime evidence | Unmeasured performance or calibration claims could guide an unsafe cutover | Keep performance, thresholds, and production benefit explicitly unclaimed. |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism

- Identical authored inputs must compile to byte-identical policy identities and replay without live advisor calls.

### Authority

- Routing evidence must never grant execution capability; destination verification remains the authority boundary.

### Graceful Degradation

- Advisor-unavailable and singular-skill operation must remain valid states of the same contract family.

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **Zero signal**: return a typed defer outcome without unioning registry destinations into the result.
- **Stale advisor evidence**: retain it as annotation only and continue from the local policy.
- **One destination**: omit ranking, bundles, and handoff while preserving negative admission and destination verification.
- **Mixed policy generations**: reject the request rather than combine evidence or proofs across identities.
- **Document-only execution**: stop at an unattested prepared draft and never claim live activation or committed effects.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Recorded Basis |
|-----------|----------------|
| Scope | Eight source ideas, four routing archetypes, and three external integration dimensions |
| Risk | Architecture and migration planning only; no live routing or scorer mutation in this packet |
| Research | Twenty-iteration, multi-lineage research followed by a three-seat synthesis council |
| Declared level | Level 2, as recorded by the packet marker |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

1. Which per-hub migration order best reflects measured blast radius before live canaries begin?
2. What evidence tiers and thresholds can support calibrated auto-routing for each hub and risk slice?
3. Which overlay fields, if any, should be learnable beyond vocabulary-to-destination assignment?
4. What canonical JSON serialization and domain-separation strings will define byte-stable identities?
5. Where should idempotency receipts live, and which destinations can provide side-effect-free prepare semantics?
6. Can the advisor consume compiled projections directly, or does it require a separate generated view?
7. What privacy filter, retention policy, and traffic sample may govern offline correction data?
8. How should cross-hub judgment approvals cross process or machine boundaries?

<!-- /ANCHOR:questions -->
