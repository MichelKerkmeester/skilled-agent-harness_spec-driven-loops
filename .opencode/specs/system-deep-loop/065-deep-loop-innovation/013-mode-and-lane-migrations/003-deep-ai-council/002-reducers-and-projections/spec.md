---
title: "Feature Specification: Deep AI Council - Reducers & Projections (013 phase 002)"
description: "Plan the pure deterministic reducers and live projections for the Deep AI Council migration: replay the typed deliberation ledger into iteration/convergence state, an immutable artifact index, and per-mode status while preserving independent-seat evidence, minority lineage, and protocol-specific outcomes."
trigger_phrases:
  - "Deep AI Council reducers and projections"
  - "deep-ai-council typed event ledger fold"
  - "deep-ai-council projection migration"
  - "deterministic council state replay"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/002-reducers-and-projections"
    last_updated_at: "2026-07-15T22:15:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined pure council folds for deliberation state and projections"
    next_safe_action: "Map predecessor ledger events to council projection ownership"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep AI Council - Reducers & Projections

> Phase adjacency under the 003-deep-ai-council parent (grouping order, not a hard runtime dependency): predecessor `001-typed-ledger-schema`; successor `003-sealed-artifacts`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/002-reducers-and-projections |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (Deep AI Council mode migration) |
| **Origin** | Phase 002 of the 013 per-mode migration program; reducers and projections concern |
| **Depends on** | `[]` in `manifest/phase-tree.json`; sibling references are navigation only |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The Deep AI Council currently spans private seat proposals, critique rounds, convergence decisions, and council-facing
artifacts without one replayable state model. A two-of-three result, a rising agreement score, or a terminal transcript
does not show whether the seats were genuinely independent, whether a minority claim was answered, which evidence caused a
stance change, or whether a protocol-specific decision remained unresolved. If those facts remain in mutable round state,
replay can depend on completion order, hidden judge context, repeated scans, or presentation labels.

This phase plans the deterministic reducers that consume the typed event log defined by `001-typed-ledger-schema` and
produce the live Deep AI Council projections: iteration and convergence state, an immutable artifact index, and per-mode
status. The fold is pure and side-effect free. An identical ordered event sequence, schema version, reducer version, and
fold options must yield the same semantic projection and projection fingerprint on every replay. Raw seat observations,
belief revisions, pairwise judgments, independence evidence, and minority lineage remain durable source state; the
projection derives current views without turning agreement into proof.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A typed event-to-state mapping for Deep AI Council events emitted by the predecessor ledger schema; this phase consumes that schema and does not redefine it.
- A pure reducer contract with explicit initial state, event application rules, schema-version handling, duplicate and sequence-gap behavior, canonical ordering, and a deterministic projection fingerprint.
- The iteration/convergence projection: council-worthiness admission, target freeze, seat and round identity, isolated deliberation, critique exposure, protocol routing, belief and stance lineage, effective independence, unresolved dissent, convergence eligibility, terminal outcome, and replay position.
- Independent-seat and stance projections: immutable claim and evidence references, model-family and reasoning-method groups, raw error observations, calibrated or uncalibrated reliability, effective seat count, influence concentration, flip-to-evidence versus flip-to-majority, and minority-sentinel outcomes.
- The artifact index projection: immutable references to private beliefs, candidate proposals, pairwise ballots, bias probes, adjudication outputs, minority reports, council reports, receipts, and gate inputs, keyed by stable logical identity and content digest.
- The per-mode status projection: Deep AI Council lifecycle, active contract versions, last applied sequence, projection health, council-worthiness decision, blocking obligations, shadow-parity state, mode-gate state, and terminal status.
- A derived plural presentation projection that routes factual posterior, blinded pairwise plan posterior, evidence-focused debate escalation, or preserved plural/value disagreement without discarding raw ballots, vetoes, unresolved values, or minority evidence.
- Differential replay fixtures and a shadow-parity plan that compare the new projections with legacy Deep AI Council state without changing authority.
- Reuse of shared fan-out/fan-in, adjudication, budget, convergence, and mode contracts; no local fork of shared ledger or orchestration semantics.

### Out of Scope
- Defining or changing the typed event envelope, transition authorization, event namespace, or schema owned by `001-typed-ledger-schema` and the shared substrate.
- Creating, sealing, signing, or verifying council artifacts owned by `003-sealed-artifacts`; this phase indexes artifact references and their observed availability only.
- Implementing seat producers, evidence acquisition, critique execution, judge calibration, pairwise adjudication, protocol routing services, or report writers; this phase defines how their typed events reduce.
- Authority cutover, legacy-writer retirement, in-flight state migration, rollback switching, or final mode promotion.
- The six sibling concerns and the mode gate; they integrate through shared contracts and the write-set plan rather than expanding this reducer scope.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The Deep AI Council reducer is a pure fold over the predecessor's typed event sequence | The reducer has no clock, randomness, filesystem, network, model, logging side effect, or mutable singleton input; the same ordered events yield the same projection and fingerprint |
| REQ-002 | Iteration and convergence state preserves deliberation structure and evidence obligations | Target freeze, council-worthiness, seat/round coverage, protocol transitions, claim lineage, unresolved dissent, hard vetoes, counterfactual requirements, and terminal decisions are reconstructed without treating raw agreement as convergence |
| REQ-003 | Independence and stance state is replayable and evidence-conditioned | Raw seat metadata and error observations remain available; effective seats, residual correlation, influence, stance flips, minority survival, and calibration support are derived deterministically and unsupported calibration stays explicit |
| REQ-004 | The artifact index preserves immutable council evidence references | Each indexed artifact records stable logical identity, artifact kind, producer event, target or round identity, content digest, availability, and supersession lineage without mutating original evidence |
| REQ-005 | Per-mode status is derived from typed transitions and projection health | Deep AI Council status, contract versions, replay position, council admission, blocking reason, shadow-parity state, mode-gate state, and terminal status are deterministic and reject impossible transitions |
| REQ-006 | Council outcomes are plural and protocol-specific presentation state | Factual, comparative-plan, debate, and value-disagreement outcomes retain votes, ties, vetoes, minority evidence, unresolved values, reopen conditions, and control-arm results; no one scalar or two-of-three rule is the source of truth |
| REQ-007 | Replay incompatibility fails closed | Unknown event versions, missing sequence links, invalid fingerprints, impossible transitions, duplicate terminal decisions, missing artifact references, and projection-version mismatches produce an explicit blocked/error result with no partial-success claim |
| REQ-008 | The migration can prove parity before authority changes | Shadow replay compares projection fields, independence measures, stance lineage, terminal decisions, artifact references, and status transitions against frozen legacy fixtures while the ledger remains additive, dark, and non-authoritative |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The phase plan defines a pure Deep AI Council fold whose identical typed event sequence produces an identical semantic projection and fingerprint.
- **SC-002**: Iteration/convergence, independence and stance, artifact index, per-mode status, and plural outcome projections have explicit ownership, inputs, invariants, and failure behavior.
- **SC-003**: Council-worthiness, effective independence, evidence-conditioned stance transitions, minority retention, and protocol-specific adjudication outputs remain inspectable rather than collapsing into nominal seat count or agreement.
- **SC-004**: Replay fixtures cover normal completion, isolated-only state, critique rounds, unresolved dissent, duplicate events, late evidence, invalid transitions, schema mismatch, projection drift, and counterfactual instability; invalid cases fail closed.
- **SC-005**: Shadow parity is measurable against the legacy Deep AI Council path while typed projections remain non-authoritative and the successor can consume artifact references without receiving seal authority.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The phase inherits the 065 program risks: live in-flight state, additive-dark migration, replay compatibility, shared
write-set ownership, and staged authority cutover. Phase-specific risks are that event order leaks into council state,
correlated seats are mistaken for independent evidence, majority pressure erases minority lineage, confidence is exposed
before calibration support exists, pairwise or counterfactual results are treated as sealed artifacts, or a scalar
agreement signal silently becomes the convergence authority.

The reducer consumes the typed ledger contract from `001-typed-ledger-schema`, shared fan-out/fan-in and mode contracts
from the 013 parent and phase 012, shared adjudication, budget, convergence, and health events, the 013 write-set
conflict graph, and legacy Deep AI Council replay fixtures. `003-sealed-artifacts` supplies the later sealing boundary but
is an adjacency reference, not a runtime dependency of this planning contract. No authority cutover is permitted from
this phase.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which exact predecessor event fields are the canonical stable identity for a seat, claim, stance, round, and protocol decision when prompts, aliases, or evidence partitions change?
- Does the shared fan-in contract advance the finalized council frontier, or does a mode event authorize exposure of a partial round to the next reducer stage?
- Which calibration states and effective-seat thresholds are shared contracts, and which are mode configuration that must remain visible as unsupported rather than guessed?
- Which legacy council fields are protected behavior contracts for shadow parity, and which two-of-three, agreement, or transcript fields are known defects that the typed projection must intentionally replace?

These questions are planning inputs for the shared contracts and implementation phases; none authorizes a local event fork,
live adjudication threshold, artifact seal, or authority cutover in this Planned phase.
<!-- /ANCHOR:questions -->
