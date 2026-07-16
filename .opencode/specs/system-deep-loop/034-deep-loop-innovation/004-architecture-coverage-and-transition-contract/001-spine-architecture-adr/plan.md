---
title: "Implementation Plan: Spine Architecture ADR"
description: "Decision rationale, rejected alternatives, consequences, and downstream ownership for the six-primitive spine."
trigger_phrases:
  - "spine architecture ADR implementation plan"
  - "cross-mode spine decision rationale"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/004-architecture-coverage-and-transition-contract/001-spine-architecture-adr"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/004-architecture-coverage-and-transition-contract/001-spine-architecture-adr"
    last_updated_at: "2026-07-15T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned the spine decision rationale, alternatives, and consequences"
    next_safe_action: "Run the ratification checklist against all six primitives"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Spine Architecture ADR

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop architecture contract |
| **Change class** | Architecture decision and downstream contract |
| **Execution** | Documentation-only ratification; no runtime writer or authority change |

### Overview
The phase converts the cross-mode research convergence into a binding architecture decision before implementation.
Run-2 synthesis section 12 supplies five recurring mode primitives; the 006 parent and phase-tree architecture field
add the transition-authorization gateway needed to protect the shared ledger. The accepted decision is therefore a
six-part spine, governed by the manifest's additive-dark migration model. The result is an architecture contract that
phases 003, 004, and 005 consume without independently choosing persistence, authority, evidence, or scoring topology.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The 006 parent `spec.md` architecture, sequencing invariants, and success criteria are treated as controlling program context
- [ ] `manifest/phase-tree.json` architecture and migration-model fields are quoted accurately in the decision rationale
- [ ] Run-2 `research/research-modes.md` section 12 is traced to its five recurring mode primitives
- [ ] The authorization gateway is identified as the parent-program addition that completes the six-part runtime spine
- [ ] The phase remains decision-only and does not absorb implementation details from phases 003-005

### Definition of Done
- [ ] The decision, primitive matrix, rejected alternatives, consequences, and consumer ownership are ratified as one coherent contract
- [ ] Every P0 and P1 ratification check in `checklist.md` is satisfied with evidence
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Decision

Adopt one shared, cross-mode runtime spine. Every canonical state change is represented as a versioned typed event in
an append-only ledger and must pass a default-deny transition-authorization gateway before persistence. Evaluation and
authority inputs are sealed and referenced by digest. Replay identity is versioned. Phase and mode boundaries emit
receipts or certificates. Scoring and convergence decisions pass through blinded/counterfactual adjudication. Each
mode defines typed schemas and artifacts over this spine; no mode may substitute its own persistence or scoring
authority. The substrate lands additive, dark, and non-authoritative until the compatibility and cutover program
authorizes otherwise.

### Primitive-to-problem contract

| Primitive | Problem solved | Ratified invariant | Primary consumer |
|-----------|----------------|--------------------|------------------|
| Typed, append-only, versioned event ledger | Per-mode state fragments cannot be audited, reduced, or replayed under one contract | Canonical history is event-derived, typed, versioned, append-only, and shared across modes | Phase 006 |
| Fail-closed transition-authorization gateway | A valid event shape alone does not prove that a state transition is permitted | Every transition is explicitly authorized before write; absent or unknown authorization denies | Phase 006 |
| Sealed/frozen reference artifacts | Mutable rubrics, authorities, canaries, or independence sets let the ruler drift after the move | Governing inputs are immutable for the decision epoch and referenced by content digest | Phase 007 |
| Versioned replay fingerprints | Unversioned hashes cannot reproduce behavior or track an entity across schema and reducer revisions | Replay identity binds relevant event, schema, reducer, artifact, and policy versions | Phase 006 |
| Receipts/certificates | Logs do not provide portable, independently checkable proof of effects or boundary decisions | Each governed phase/mode boundary emits typed proof linked to inputs, events, and replay identity | Phase 007 |
| Blinded/counterfactual adjudication | Self-scoring and provenance/order leakage can reward identity, style, or evaluator gaming instead of merit | Adjudication separates candidate from judge, masks merit-irrelevant provenance, and tests verdict stability | Phase 007 |

### Why the primitives are indivisible

The ledger without authorization records forbidden transitions faithfully. Authorization without a versioned ledger
cannot prove what rule governed a historical decision. Seals without replay fingerprints freeze inputs but not the
execution contract. Fingerprints without receipts reproduce a run without proving its external effects or boundary
verdicts. Receipts without blinded adjudication can certify a biased or self-scored decision. The six primitives form
one evidence and authority chain; weakening any link recreates the ad-hoc behavior the program is replacing.

### Alternatives considered and rejected

| Alternative | Rejection rationale |
|-------------|---------------------|
| Independent per-mode JSONL formats | Repeats schema, replay, reducer, and migration logic; prevents shared invariants and cross-mode evidence lineage |
| Mutable shared state as the source of truth | Overwrites causal history, makes recovery order-dependent, and prevents exact audit or deterministic reduction |
| Unversioned event envelopes or hashes | Makes schema/reducer changes indistinguishable and turns historical replay into best-effort interpretation |
| Typed ledger with direct writers | Confuses structural validity with transition authority; a well-formed forbidden transition would still persist |
| Live or mutable reference artifacts | Allows evaluator, authority, canary, or independence inputs to drift after observing candidates or outcomes |
| Logs with optional receipts | Leaves side effects and boundary decisions without portable proof, idempotency evidence, or independent verification |
| Mode-owned or candidate-visible self-scoring | Couples mutation to measurement and preserves provider, ordering, verbosity, and evaluator-gaming bias |
| Big-bang replacement of legacy state | Violates the manifest migration model and risks inconsistent in-flight packets across shared backends |

### Consequences

**Positive consequences**
- One implementation of event history, authorization, replay identity, sealing, proof emission, and adjudication serves every mode.
- Every mode gains auditable, resumable, falsifiable longitudinal evidence while retaining its own typed schema and certificate.
- Cross-mode gates can reason over common events, digests, fingerprints, and receipts instead of mode-specific log conventions.
- Compatibility and cutover decisions become evidence-bearing transitions rather than deployment folklore.

**Costs and constraints**
- Phase 006 must co-land the first typed writer with authorization; neither component may ship alone.
- Schema, reducer, artifact, policy, and fingerprint versions become durable compatibility surfaces requiring upcasters and mixed-version tests.
- Phase 007 must preserve judge separation and raw evidence, increasing service boundaries and storage compared with direct scoring.
- Receipts and seals add lifecycle, retention, and recovery obligations; they cannot be treated as optional observability.
- Mode teams lose freedom to create independent canonical stores or scoring authorities, but retain freedom over typed domain schemas and projections.

**Migration consequences**
- The new spine begins additive, dark, and non-authoritative.
- Phase 008 must preserve legacy reads while comparing spine projections under shadow parity and rehearsing rollback.
- Later authority cutover remains per mode and certificate-gated; this ADR does not authorize any cutover.
- Legacy writers remain until zero-use telemetry and retirement gates pass; historical readers remain as required.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the three controlling sources: the 006 parent `spec.md`, `manifest/phase-tree.json`, and run-2 `research/research-modes.md` section 12.
- Reconcile the five research primitives with the transition-authorization gateway added by the parent architecture.
- Confirm `depends_on: []` and keep runtime implementation outside this phase.

### Phase 2: Implementation
- Ratify the single decision statement and the indivisibility argument.
- Record each primitive's problem, invariant, and downstream owner.
- Record alternatives with concrete rejection reasons rather than preference claims.
- Record positive consequences, costs, compatibility obligations, and migration constraints.
- Bind phase 006, 004, and 005 to their consumer responsibilities without preselecting their implementation details.

### Phase 3: Verification
- Trace every decision claim to at least one controlling source.
- Verify all six primitives appear in the decision, requirements, task set, and ratification checklist.
- Verify default-deny behavior and additive-dark sequencing cannot be read as optional.
- Verify no alternative recreates per-mode authority, mutable truth, unversioned replay, or self-scoring.
- Run strict spec-kit validation and accept only the expected missing generated-metadata errors.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Compare the decision statement with the parent `spec.md` spine definition and manifest `architecture` field |
| REQ-002 | Check the primitive matrix has six unique rows, each with a problem, invariant, and owner |
| REQ-003 | Inspect every transition path statement for explicit pre-write authorization and default denial |
| REQ-004 | Verify seals use digests and fingerprints bind versions needed for deterministic replay |
| REQ-005 | Verify receipt/certificate language covers phase and mode boundaries and links to governing evidence |
| REQ-006 | Verify adjudication requires separation, blinding, counterfactual stability, and raw evidence retention |
| REQ-007 | Check every named alternative has a concrete rejected failure mode and a corresponding consequence |
| REQ-008 | Cross-check phase 006, 004, and 005 ownership against `manifest/phase-tree.json` outcomes |
| REQ-009 | Compare migration consequences with the manifest `migration_model` field and parent sequencing invariants |
| REQ-010 | Run a citation-path review for all three controlling source files and section 12 |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This phase has no predecessor (`depends_on: []`). Its authoritative evidence inputs are
`.opencode/specs/system-deep-loop/034-deep-loop-innovation/spec.md`,
`.opencode/specs/system-deep-loop/034-deep-loop-innovation/manifest/phase-tree.json`,
and `.opencode/specs/system-deep-loop/034-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/research/research-modes.md`
section 12. Downstream dependencies flow outward: phase 006 consumes ledger/authorization/replay, phase 007 consumes
seals/receipts/adjudication, and phase 008 must preserve the complete decision through compatibility and rollback.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Before phases 003-005 consume the decision, rollback is a documentation revert followed by re-ratification. After a
consumer begins implementation, the ADR is immutable history: changing the topology requires a superseding decision,
an explicit impact analysis for all three consumer phases, and a migration amendment. No implementation may silently
weaken the decision through a local schema, writer, adapter, or scoring shortcut.
<!-- /ANCHOR:rollback -->
