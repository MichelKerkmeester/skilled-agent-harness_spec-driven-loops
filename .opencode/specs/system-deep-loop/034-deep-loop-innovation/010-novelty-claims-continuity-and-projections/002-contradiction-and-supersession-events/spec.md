---
title: "Feature Specification: Contradiction & Supersession Events"
description: "Plan first-class contradiction and supersession ledger events that preserve evidence, history, deterministic claim status, and replayable audit trails."
trigger_phrases:
  - "contradiction and supersession events"
  - "typed claim relationship events"
  - "claim status replay"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/010-novelty-claims-continuity-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/010-novelty-claims-continuity-and-projections/002-contradiction-and-supersession-events"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined typed contradiction and supersession planning over the claim ledger"
    next_safe_action: "Implement the two event schemas and deterministic claim-status reducer"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Contradiction & Supersession Events

> Phase adjacency under `010-novelty-claims-continuity-and-projections` (navigation order, not a hard runtime dependency): predecessor `001-semantic-communities`; successor `003-claim-continuity`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/034-deep-loop-innovation/010-novelty-claims-continuity-and-projections/002-contradiction-and-supersession-events |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Second child of the phase-010 novelty, claims, continuity, and projections parent |
| **Depends on** | None (`[]`); sibling contracts compose at the phase-010 parent gate |
| **Authority posture** | Additive-dark; legacy state remains authoritative until the staged phase-014 cutover |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The current research corpus reports **84 evidence-backed contradictions**, but contradiction is still a counted finding
rather than a durable relationship with typed participants, evidence, lifecycle, and replay semantics. A later finding
can refute or replace an earlier claim, yet a scalar contradiction count cannot answer which claims conflict, whether
the conflict remains active, what evidence justified it, or why a prior claim stopped being effective. Run-2 therefore
calls for a longitudinal `ClaimRecord` ledger with support/refute/qualify edges, stable identity, unresolved-
contradiction blockers, and explicit supersession links
(`.opencode/specs/system-deep-loop/034-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/research/research-modes.md`).

This phase plans two first-class relationship events over the phase-006 typed append-only ledger. A
`CONTRADICTION` event records that two identified claims cannot both hold under a stated scope and evidence set. A
`SUPERSESSION` event records that a newer, stronger claim replaces an earlier claim under an evidence-backed rationale.
Assertions and withdrawals are appended as new events; no claim, relationship, evidence locator, or earlier event is
deleted or rewritten. The resulting event stream must support deterministic claim-status derivation and exact audit
replay under the ledger fingerprint contract
(`.opencode/specs/system-deep-loop/034-deep-loop-innovation/006-transition-authorized-ledger-core/002-typed-append-only-ledger/spec.md`).

Candidate detection consumes concept-level assignments planned by sibling `../001-semantic-communities/spec.md` plus
claim evidence, provenance, support/refute/qualify edges, and exact evidence locators. Detection proposes a relation;
it does not mutate claim status. Only a validated, authorized append creates or withdraws an effective relationship.
Sibling `../003-claim-continuity/spec.md` will consume these typed relations to maintain stable claim lifecycles. The
program placement and phase outcome are fixed by
`.opencode/specs/system-deep-loop/034-deep-loop-innovation/manifest/phase-tree.json`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The canonical `CONTRADICTION` relationship-event payload, including a symmetric claim pair, incompatibility scope, semantic-community context, evidence references, provenance/independence context, detector version, and append-only assertion or withdrawal semantics.
- The canonical `SUPERSESSION` relationship-event payload, including directional predecessor/successor claim IDs, replacement scope, stronger/newer evidence rationale, evidence references, detector version, and append-only assertion or withdrawal semantics.
- Candidate-detection inputs from semantic communities and evidence edges, with a strict boundary between a proposed relation and an authorized ledger event.
- Authorization invariants: no self-relations, no missing claims/evidence, canonical contradiction pairs, no supersession cycles, and no competing active replacement without an explicit withdrawal or chain.
- A deterministic reducer that derives each claim's effective `active`, `contested`, or `superseded` status from the verified event sequence while retaining all active and historical relationship detail.
- Audit and replay requirements binding relationship events to phase-006 ledger ordering, integrity, authorization linkage, and replay fingerprints.
- Fixtures for assertion, withdrawal, duplicate append, contradictory evidence, supersession chains, invalid cycles, replay, and corruption/mismatch behavior.

### Out of Scope
- Semantic clustering, community identity, or concept-level novelty scoring owned by `001-semantic-communities`.
- Stable claim identity creation and the broader claim lifecycle owned by `003-claim-continuity`.
- Next-focus selection and convergence/termination decisions; these events provide inputs but do not decide where to search or when to stop.
- Transactional projection storage and gauge updates owned by `005-transactional-projections-and-gauges`.
- Redefining the phase-006 versioned envelope, append-only writer, authorization gateway, or replay-fingerprint format.
- Deleting or mutating a claim, evidence record, or prior relationship event; correction is append-only.
- Treating semantic similarity, source count, timestamps, or detector confidence alone as sufficient evidence for contradiction or supersession.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `CONTRADICTION` is a typed, symmetric, evidence-backed ledger event | The payload names two distinct claim IDs in canonical pair order, the incompatible proposition/scope, semantic-community context, exact evidence references, provenance/independence context, detector version, and `assert` or `withdraw` action |
| REQ-002 | `SUPERSESSION` is a typed, directional, evidence-backed ledger event | The payload names distinct predecessor and successor claim IDs, the replacement scope, stronger/newer evidence rationale, exact evidence references, detector version, and `assert` or `withdraw` action |
| REQ-003 | Relationship changes preserve history | A withdrawal names the prior relationship event it counteracts; reducers stop treating that assertion as active without deleting or rewriting either event, claim, or evidence record |
| REQ-004 | Detection consumes semantic communities plus evidence without becoming authority | Candidate generation records community assignments, evidence edges, exact locators, provenance independence, and detector identity; no candidate affects status until authorization and durable append succeed |
| REQ-005 | Invalid relationships fail closed before append | Self-contradiction, self-supersession, missing claim/evidence references, non-canonical pairs, supersession cycles, ambiguous withdrawals, or a competing active replacement are rejected without sequence allocation |
| REQ-006 | Effective claim status is a deterministic ledger fold | The same verified sequence and reducer version yields byte-identical `active`, `contested`, or `superseded` status plus the same active/historical relation sets |
| REQ-007 | Status precedence is explicit and lossless | An active incoming supersession yields `superseded`; otherwise any active contradiction yields `contested`; otherwise the claim is `active`; supersession never erases contradiction history or evidence |
| REQ-008 | Replay and audit bind every conclusion to immutable inputs | An audit can trace effective status to event IDs, claim IDs, evidence locators, authorization references, ledger sequences, relation actions, detector/reducer versions, and the covering replay fingerprint |
| REQ-009 | Duplicate and conflicting appends follow ledger idempotency | Exact replay of an event ID returns its original receipt; different canonical content under the same ID fails closed; retries cannot double-count a relation |
| REQ-010 | Downstream consumers receive typed projections, not loose counts | Claim continuity and later projection/gauge phases consume active relation IDs, counterpart claim IDs, derived status, and evidence state; a contradiction count is derived from canonical active pairs only |

### Canonical event shapes

Both shapes ride the phase-006 versioned envelope and inherit its `event_id`, schema/type versions, run/ledger identity,
authorization linkage, canonical bytes, sequence, and append receipt. Ledger sequence is ordering authority; timestamps are
audit metadata only.

| Event | Required relationship payload |
|-------|-------------------------------|
| `deep-loop.claim.contradiction-recorded` (`CONTRADICTION`) | `relationship_id`; canonical `left_claim_id` and `right_claim_id`; `incompatibility_scope`; `semantic_community_ids`; exact `evidence_refs`; provenance/independence references; `detector_version`; `evidence_snapshot_ref`; `relation_action: assert\|withdraw`; `retracts_event_id` when withdrawing |
| `deep-loop.claim.supersession-recorded` (`SUPERSESSION`) | `relationship_id`; `predecessor_claim_id`; `successor_claim_id`; `replacement_scope`; `strength_rationale`; exact `evidence_refs`; provenance/independence references; `detector_version`; `evidence_snapshot_ref`; `relation_action: assert\|withdraw`; `retracts_event_id` when withdrawing |

A contradiction pair is canonicalized independently of observation order, so A↔B cannot be double-counted as B↔A.
Supersession remains directional: A→B means B replaces A, never the reverse. `assert` creates an active relation after
authorization; `withdraw` counteracts exactly one earlier active assertion while preserving both records. Evidence
changes require a new event with a new evidence snapshot, not mutation of the old payload.

### Effective-status fold

The reducer consumes only the phase-006 reader's verified sequence. It first folds assertion/withdrawal actions into
the active relation set, rejecting an ambiguous or impossible withdrawal. It then resolves acyclic supersession chains
to their terminal successor. A claim with an active incoming supersession is `superseded`; otherwise a claim incident
to any active contradiction is `contested`; otherwise it is `active`. A superseded claim may still expose active or
historical contradictions for audit, but those edges do not restore it to `contested`. Unknown event versions,
unresolved claim references, cycles, or fingerprint mismatch produce no trusted status projection.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The two registered event shapes encode symmetric contradiction and directional supersession without relying on prose parsing or scalar counts.
- **SC-002**: Every effective relationship is backed by exact evidence references, provenance context, a detector/evidence snapshot, authorization linkage, and an immutable append receipt.
- **SC-003**: Assertion, withdrawal, supersession chains, and mixed contradiction/supersession histories replay to byte-identical claim statuses and relation projections.
- **SC-004**: Invalid self-relations, missing references, cycles, ambiguous withdrawals, competing replacements, duplicate conflicts, corruption, and unknown versions fail closed.
- **SC-005**: Audit output reconstructs what changed, which evidence justified it, which event changed effective status, and why earlier history remains visible.
- **SC-006**: Sibling claim continuity and projection phases can consume typed relation/state output without reinterpreting loose contradiction counts.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The planning leaf declares `depends_on: []`, matching the phase tree's independent child-contract model. Its
implementation nevertheless composes with the planned semantic-community output, the phase-006 envelope/ledger/
authorization/fingerprint contracts, shared evidence receipts, and the successor claim-continuity reducer at the
phase-010 parent gate. The sibling `001-semantic-communities/spec.md` is a prospective contract; this phase consumes
only its documented community identities and does not assume an implementation shape beyond the parent phase outcome.

The highest semantic risk is turning a detector guess into claim authority. Similar claims may qualify one another
rather than contradict, and newer evidence is not automatically stronger. Candidate generation therefore records
inputs and versions, while authorization requires exact evidence and an explicit incompatibility or replacement
rationale. The highest state risk is history loss: overwriting a claim status would destroy the longitudinal moat
identified by run-2. Status remains a rebuildable projection over immutable events, and withdrawal is itself an event.

Cycle and multiplicity handling are also load-bearing. Supersession cycles make effective status undefined, while two
active successors create ambiguous replacement authority. Both fail before append. Replay cannot repair or silently
choose among invalid records; it reports the earliest invalid relation and yields no trusted projection. These rules
preserve the additive-dark migration posture and the later convergence phase's need for stable, auditable inputs.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Execution may choose concrete module names and serialization details after the phase-006
registry and sibling claim/community contracts are materialized. It must retain exactly two relationship event types,
append-only assertion/withdrawal semantics, canonical symmetric contradiction pairs, directional acyclic supersession,
evidence-backed authorization, deterministic status precedence, and fail-closed replay. Any alternative that mutates
prior records, treats timestamps as strength, or allows detector output to become authority is outside this contract.
<!-- /ANCHOR:questions -->
