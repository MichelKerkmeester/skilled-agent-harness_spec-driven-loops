---
title: "Implementation Plan: Blinded Adjudication Service"
description: "Implementation plan for the shared bias-controlled adjudication primitive across deep-loop scoring and convergence decisions."
trigger_phrases:
  - "blinded adjudication implementation plan"
  - "counterfactual adjudication service plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/003-blinded-adjudication-service"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/003-blinded-adjudication-service"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned the blinded registrar, adjudicator, reducer, and mode adapters"
    next_safe_action: "Implement typed requests and identity-leakage fixtures on the ledger envelope"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Blinded Adjudication Service

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop shared runtime + five mode adapters |
| **Change class** | New typed evidence/control service, additive-dark |
| **Execution** | Implement behind the phase-006 event envelope; legacy decisions remain authoritative |

### Overview
Implement a shared adjudication pipeline with four separated roles: registration owns identity-bearing inputs; the
blinding registrar creates content-linked opaque presentations; judges emit raw pairwise or rubric judgments without
identity access; and a versioned reducer evaluates mirrored-order and counterfactual stability. Append every stage to
the authorized ledger and expose typed adapter results to deep-review, deep-ai-council, deep-improvement,
model-benchmark, and skill-benchmark. Detailed field and storage choices are finalized against the landed phase-006
envelope, while the phase-004 ADR's scoring separation and raw-evidence retention remain fixed.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The phase-006 event envelope, transition authorization, and replay-fingerprint contracts are available for typed event integration
- [ ] The request, blinded-presentation, raw-score, counterfactual, reduction, verdict, invalidation, and deblinding event schemas are reviewed
- [ ] Identity-bearing fields and permitted presentation transformations are enumerated with fail-closed defaults
- [ ] A/B and B/A policy, tie/cycle handling, probe matrix, and stable/unstable/inconclusive semantics are frozen
- [ ] Judge eligibility forbids self-scoring and defines effective-independence evidence without assuming configured seats are independent
- [ ] Each consuming mode has an adapter mapping and may not directly re-reduce raw service scores

### Definition of Done
- [ ] Blinded mirrored-order adjudication and configured counterfactual probes pass identity-leakage, replay, correlation, tie, cycle, and failure fixtures
- [ ] Every service verdict retains addressable raw evidence and no legacy scoring or convergence authority changes
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Request gateway**: validates `AdjudicationRequest`, candidate/reference digests, judge and counterfactual policy versions, quorum/tie rules, and replay fingerprint before authorizing an event.
- **Identity vault boundary**: stores the candidate-to-opaque-label map separately; routine judge, reducer, and mode-adapter capabilities cannot read it.
- **Blinding registrar**: emits per-assignment opaque labels, randomized order, masked provenance/confidence/authority cues, and a transformation manifest constrained to content-preserving rules.
- **Assignment planner**: creates mirrored A/B and B/A comparisons plus policy-declared counterfactual probes; assignment IDs are stable for replay while presentation labels are scoped to prevent cross-assignment inference.
- **Judge gateway**: enforces producer/judge separation, captures raw preference or rubric scores, rationale/evidence locators, uncertainty, tie/abstention/invalid states, and immutable judge-policy identity.
- **Counterfactual evaluator**: links baseline and intervention judgments, classifies flip/no-flip/indeterminate, and refuses stability when a required probe is absent or invalid.
- **Versioned reducer**: folds ordered ledger events into pairwise graph, ties, cycles, vetoes, minority evidence, effective-independence evidence, and stable/unstable/inconclusive verdict without deleting component scores.
- **Audit/deblinding gateway**: permits separately authorized post-verdict identity resolution and records purpose, actor, scope, and result as events.
- **Mode adapters**: translate typed mode decisions into requests and translate service verdicts into mode-owned transition inputs; adapters cannot weaken blinding or recompute winners.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the phase-004 ADR and manifest invariants, bind to the landed phase-006 envelope/fingerprint contracts, and inventory every identity-bearing or position-bearing field.
- Freeze event vocabulary, counterfactual policy, mode adapter boundary, and the dark/non-authoritative migration flag.

### Phase 2: Implementation
- Implement typed request validation and default-deny transition authorization for every service event.
- Implement the separated identity vault and blinding registrar with scoped opaque labels, randomized presentation, metadata masking, and transformation manifests.
- Implement mirrored pair planning, explicit tie/abstention/invalid outcomes, self-scoring rejection, and raw judgment persistence.
- Implement identity/order/confidence/expertise/majority counterfactual linking and stable/unstable/inconclusive classification.
- Implement the replayable reducer with pairwise graph, cycle and minority retention, residual-correlation/effective-independence evidence, and Dawid-Skene competence-weighting guardrails.
- Implement audit-controlled deblinding and the five typed mode adapters without moving legacy authority.

### Phase 3: Verification
- Prove identity fields, stable label patterns, metadata, context, and presentation order do not leak to judges or affect weights and tie-breaks.
- Prove A/B and B/A parity, configured counterfactual stability, and fail-closed behavior for flips, missing probes, cycles, invalid assignments, and insufficient evidence.
- Prove raw events replay to the same verdict, reducer upgrades preserve prior raw evidence, and duplicate/reordered events are rejected or deterministically handled by the envelope contract.
- Prove cloned/correlated judges do not inflate effective vote count and competence weights are never reported as correlation correction.
- Prove all mode adapters preserve service status and evidence links, while the legacy path remains authoritative.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Schema fixtures reject missing/unknown decision, digest, policy, quorum, tie, probe, or fingerprint fields before event append |
| REQ-002 | Canary provenance fields and capability tests prove judges cannot access identity maps or identity-bearing metadata |
| REQ-003 | Golden semantic-equivalence fixtures compare source candidates to every allowed blinded presentation transformation |
| REQ-004 | Each pair runs A/B and B/A; asymmetric results produce unstable/inconclusive status rather than a winner |
| REQ-005 | Probe fixtures independently permute identity, order, confidence, expertise, majority cue, and policy-specific attributes |
| REQ-006 | Missing probes, flips, invalid results, insufficient quorum/independence, ties, and cycles exercise fail-closed outcomes |
| REQ-007 | Ledger queries traverse every verdict to immutable component scores, rationales/evidence locators, uncertainty, abstentions, and probes |
| REQ-008 | Exact event/fingerprint replay reproduces the verdict; reducer-version tests preserve old raw events and expose changed reductions |
| REQ-009 | Cloned-seat and shared-provider fixtures keep effective independence below seat count; competence weighting leaves residual-correlation warnings intact |
| REQ-010 | Producer-as-judge and identity-derived weighting/tie-break attempts are rejected before a raw score is accepted |
| REQ-011 | Contract tests cover deep-review, deep-ai-council, deep-improvement, model-benchmark, and skill-benchmark adapters |
| REQ-012 | Shadow tests compare service output to legacy output while asserting legacy remains the only authority |
| REQ-013 | Pre-verdict and unauthorized deblinding fail; authorized post-verdict deblinding emits a complete audit event |
| REQ-014 | Source-reference checks cover `research-modes.md`, the phase-004 ADR, and `manifest/phase-tree.json` |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase declares no hard sibling dependency (`depends_on: []`). Its architecture is constrained by
`.opencode/specs/system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/001-spine-architecture-adr/spec.md`
and `.opencode/specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json`.
Its research basis is `.opencode/specs/system-deep-loop/036-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/research/research-modes.md`.
Implementation integrates with the phase-006 authorized event envelope and later with the sealed-reference service, but
the sibling adjacency does not create a planning-time runtime dependency.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The service lands additive-dark. Rollback disables new request admission and mode-adapter consumption, leaves all
already appended raw-score, probe, verdict, invalidation, and deblinding events readable, and returns consumers to the
unchanged legacy decision path. No rollback deletes or rewrites evidence. A reducer defect is corrected by appending an
invalidation and a new versioned reduction linked to the same raw events; identity mappings remain sealed under their
original access policy. Later authority-cutover rollback remains owned by phase 014.
<!-- /ANCHOR:rollback -->
