---
title: "Feature Specification: Spine Architecture ADR"
description: "Ratify the single six-primitive cross-mode architecture spine that governs the later 006 implementation phases."
trigger_phrases:
  - "spine architecture ADR"
  - "cross-mode deep-loop spine"
  - "six-primitive runtime architecture"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/001-architecture-coverage-and-transition-contract"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/001-architecture-coverage-and-transition-contract/001-spine-architecture-adr"
    last_updated_at: "2026-07-15T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined the planned ADR scope and six-primitive ratification contract"
    next_safe_action: "Ratify the spine before phase 003 introduces any typed writer"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Spine Architecture ADR

> Phase adjacency inside the architecture contract: `depends_on: []`; sibling planning contracts are `002-recommendation-ledger-bijective-map` and `003-transition-versioning-and-rollback-policy` (independent, parallel); downstream consumers are phase 003 (ledger core), phase 004 (shared services), and phase 005 (compatibility bridge).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/001-architecture-coverage-and-transition-contract/001-spine-architecture-adr |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | First child of the phase-001 architecture, coverage, and transition-contract parent |
| **Depends on** | None (`[]`) |
| **Decision consumers** | 003-transition-authorized-ledger-core; 004-shared-evidence-and-control-services; 005-compatibility-shadow-and-rollback-bridge |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 006 parent program states that the 178 recommendations are not independent patches: they converge on one shared
runtime architecture. Run-2 research section 12 identifies five recurring mode-level primitives; the parent program
and `manifest/phase-tree.json` add the fail-closed transition-authorization gateway required to make event persistence
safe. Without a ratified decision, later phases could implement compatible-sounding but structurally different stores,
transition rules, artifact references, replay keys, boundary proofs, or scoring paths.

This phase ratifies one six-primitive spine before any typed writer exists: a typed append-only versioned event ledger;
a default-deny transition-authorization gateway; sealed reference artifacts addressed by digest; versioned replay
fingerprints; phase and mode boundary receipts/certificates; and blinded/counterfactual adjudication. The decision also
binds those primitives to the parent program's additive-dark migration model: legacy state remains authoritative until
compatibility adapters, shadow parity, rollback evidence, and later per-mode cutover gates authorize a change.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Ratify the six primitives as one indivisible cross-mode architecture decision.
- Define the problem each primitive solves and the invariant it imposes on later phases.
- Record the rejected alternatives: per-mode JSONL, mutable state, unversioned events, ungated writers, mutable reference inputs, optional receipts, self-scoring, and big-bang replacement.
- Record positive, negative, and operational consequences of the decision.
- Bind phase 003 to the ledger, replay, and authorization core; phase 004 to seals, receipts, and adjudication; and phase 005 to compatibility, shadow-parity, and rollback preservation of the spine.
- Ground the decision in the 006 parent `spec.md`, `manifest/phase-tree.json` architecture and migration-model fields, and run-2 `research/research-modes.md` section 12.

### Out of Scope
- Event-envelope field names, storage engine selection, serialization format, or schema-registry implementation details owned by phase 003.
- Cryptographic signature, access-control, receipt recovery, budget, gauge, lock, or adjudicator implementation details owned by phase 004.
- Upcaster, adapter, shadow-comparison, in-flight-state classification, and rollback mechanics owned by phase 005.
- The bijective 178-row recommendation ledger and the broader transition vocabulary owned by sibling children of the phase-001 parent.
- Runtime code, authority cutover, or legacy-writer retirement.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Ratify one shared spine rather than independent per-mode architectures | The ADR states one decision covering all six primitives and every later mode schema is constrained to specialize, not replace, it |
| REQ-002 | Define each primitive by the failure it prevents | The decision matrix maps ledger, authorization, seals, fingerprints, receipts, and adjudication to a concrete problem and invariant |
| REQ-003 | Make transition authorization fail closed | Every state transition requires an explicit authorization result; missing, unknown, malformed, or unsupported authorization defaults to denial |
| REQ-004 | Preserve deterministic replay and immutable evaluation inputs | Replay fingerprints and sealed artifact references are versioned and digest-bound; mutable or unversioned inputs cannot satisfy the contract |
| REQ-005 | Preserve independently checkable boundary evidence | Phase and mode boundaries emit typed receipts or certificates linked to the governing events, fingerprints, and sealed inputs |
| REQ-006 | Separate scoring authority from the candidate or process being scored | Adjudication supports blinded provenance, mirrored-order or equivalent counterfactual checks, and retention of raw pre-reduction evidence |
| REQ-007 | Record alternatives and consequences | Each rejected alternative has a concrete failure mode, and the accepted decision records costs, constraints, and migration consequences |
| REQ-008 | Establish downstream ownership without duplicating implementation | Phase 003, 004, and 005 responsibilities are explicit and collectively preserve the complete spine |
| REQ-009 | Remain consistent with the program migration model | The ADR prohibits big-bang authority transfer and preserves additive-dark, compatibility, shadow-parity, rollback-window, and gated-retirement sequencing |
| REQ-010 | Maintain source traceability | Each load-bearing decision cites the parent spec, phase-tree manifest, or run-2 synthesis section 12 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One unambiguous decision statement ratifies all six primitives as the shared runtime spine.
- **SC-002**: Every primitive has a named problem, invariant, downstream owner, and ratification check.
- **SC-003**: The alternatives analysis rejects ad-hoc per-mode JSONL, mutable state, unversioned events, ungated writes, mutable references, optional proof, self-scoring, and big-bang migration.
- **SC-004**: Consequences distinguish architectural benefits from implementation cost, operational constraints, and migration obligations.
- **SC-005**: Phases 003, 004, and 005 can derive their contracts without reopening the topology decision.
- **SC-006**: Strict validation reports no errors other than the intentionally deferred generated metadata files.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The phase has no execution-phase predecessor, but its evidence inputs are the approved 006 parent specification, the
phase-tree manifest, and run-2 synthesis section 12. The primary risk is ratifying labels without enforceable
invariants; the plan therefore defines default-deny behavior, digest binding, version binding, boundary evidence, and
adjudication separation explicitly. A second risk is allowing implementation detail to leak into this decision and
prematurely constrain phases 003-005; storage, cryptography, transport, and adapter mechanics remain delegated.

Downstream risk is asymmetric: phase 003 cannot safely introduce a typed writer without authorization, while phases
004 and 005 may elaborate services and migration mechanics without weakening the ratified primitives. Any later need
to change the topology requires an explicit superseding ADR and consumer impact analysis, not an implicit schema edit.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for ratification. The decision fixes the architecture topology and invariants, while phases 003-005
retain bounded design choices for event fields, persistence, seal enforcement, receipt recovery, adjudicator
implementation, upcasting, shadow comparison, and rollback mechanics. Those choices may not weaken default-deny
authorization, immutability, replay versioning, proof emission, blinded adjudication, or additive-dark migration.
<!-- /ANCHOR:questions -->
