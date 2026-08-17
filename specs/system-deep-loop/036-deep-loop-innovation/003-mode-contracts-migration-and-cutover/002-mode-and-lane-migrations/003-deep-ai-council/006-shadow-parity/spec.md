---
title: "Feature Specification: Deep AI Council — Shadow Parity"
description: "Implemented the dark shadow-parity harness for the Deep AI Council migration. The harness runs the typed event-ledger path beside the legacy council emitter against the same frozen execution, compares canonical behavior projections event-for-event, and blocks authority cutover on any unexplained mismatch."
trigger_phrases:
  - "deep ai council shadow parity"
  - "council ledger shadow harness"
  - "deep-ai-council event parity"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/003-deep-ai-council/006-shadow-parity"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "opencode"
    recent_action: "Implemented the additive dark council parity harness"
    next_safe_action: "Consume parity evidence in the successor mode gate"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep AI Council — Shadow Parity

> Phase adjacency under the 003 Deep AI Council workstream (grouping order, not a runtime dependency): predecessor `005-resume-adapter`; successor `007-rollback-and-mode-gate`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/006-shadow-parity |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (owns the Deep AI Council workflow, typed runtime migration, and shadow evidence) |
| **Origin** | Phase 013 Deep AI Council migration, `006-shadow-parity` child: prove ledger projection parity before any authority cutover |
| **Consumes / depends on** | LANDED additive-dark predecessors `001-typed-ledger-schema`, `002-reducers-and-projections`, and `003-sealed-artifacts`; their outputs remain non-authoritative |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The current Deep AI Council path is a planning-only multi-seat workflow: seats deliberate, return findings, critique one another, synthesize convergence, persist packet-local `ai-council/**` artifacts, and append an `ai-council-state.jsonl` history. That history has explicit `round_start`, `seat_returned`, `deliberation_synthesized`, `round_end`, `council_complete`, `artifact_written`, `rollback`, and `artifact_superseded` semantics. The typed event-ledger migration must reproduce those observable decisions without replacing a live legacy writer while packets are in flight.

This phase plans a shadow harness that executes the legacy emitter and the new ledger path beside one another from the same frozen council input, seat results, runtime configuration, and target version. The harness maps both histories into one canonical behavior projection, compares the projection event-for-event, compares the derived artifacts and convergence outcome, and records every mismatch as a blocking parity result. Ledger-only authorization, receipt, and audit events are checked separately as required control-plane evidence; they must not hide a missing or changed council behavior event.

The mode-specific research makes the comparison substantive rather than a line-count check. CouncilBrief assignments, private evidence boundaries, typed belief and challenge messages, effective-independence observations, blinded adjudication, minority retention, and comparative control arms are behavior-bearing fields when present in the frozen fixture. A green shadow result therefore proves that the migration preserves the existing council contract while exposing the richer evidence needed by the new ledger. This phase consumes the phase-014 shadow framework named in the phase brief and remains planning-only.

The schema, reducer/projection, and sealed-artifact predecessor leaves are LANDED and additive-dark. They provide typed inputs to this still-Planned harness without moving authority from the legacy council emitter.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A paired shadow-run contract for normal council completion, multi-round deliberation, seat timeout or error, unresolved contradiction, max-round non-convergence, partial artifact persistence, rollback, and resume at each persisted boundary.
- A frozen-input boundary containing the candidate SHA, BASE SHA, council configuration, target version, seat manifests, recorded seat outputs, tool receipts, and fixture digest so both paths observe identical work.
- A canonical parity projection that maps legacy council events and typed ledger events by logical round, seat, claim, decision, artifact, and lifecycle identity rather than raw `eventId`; independently emitted streams still pair by that logical identity. It compares ordered event kind, identity, required payload, terminal status, and projection fingerprint.
- An explicit normalization profile for non-semantic metadata such as wall-clock timestamps or byte counts. The profile is versioned and digest-bound; fields outside it are compared, not ignored.
- Separate checks for ledger authorization, receipt references, control-plane audit events, duplicate side effects, and legacy-authority preservation. Shadow writes are non-authoritative and must not dispatch seats or persist a second external effect.
- A mismatch taxonomy, parity report, and cutover-blocking receipt that identifies the first divergent event, both source locations, the normalized field diff, the affected projection, and the required remediation owner.
- A fixture and replay matrix derived from the phase-014 shadow framework and the existing Deep AI Council state, output, failure, rollback, and artifact contracts.

### Out of Scope
- Implementing or changing the typed ledger envelope, event schemas, reducers, projections, sealed artifacts, certificates, receipts, resume adapter, or rollback switch; those are sibling concerns in `001-typed-ledger-schema` through `005-resume-adapter` and the shared contracts.
- Changing the council's seat prompts, deliberation policy, convergence thresholds, output schema, or artifact layout. This phase observes those contracts and proves their migration parity.
- Flipping authority from the legacy emitter to the ledger, migrating live in-flight state, removing legacy writers, or defining the final mode gate. Authority belongs to the staged cutover and `007-rollback-and-mode-gate` workstream.
- Re-running the research or treating nominal seat count as independence evidence. The mode research inputs are consumed as contract fields and test cases, not extended here.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both paths consume one frozen execution | The report binds `base_sha`, `candidate_sha`, input digest, target version, seat-output digests, configuration digest, and normalization-profile digest; neither path dispatches additional work. |
| REQ-002 | Behavior events remain event-for-event equivalent | The canonical projections have equal ordered cardinality, event kinds, logical round/seat/claim IDs, required payload fields, terminal lifecycle, and first-to-last event ordering. No unexplained legacy-only or ledger-only behavior event exists. |
| REQ-003 | Derived council projections remain equivalent | Convergence or non-convergence, majority and minority outcomes, hard violations, unresolved values, counterfactual results, findings, artifact references, and projection fingerprints match for every fixture that exercises them. |
| REQ-004 | Failure, resume, and rollback semantics remain equivalent | Timeout, error, contradiction, insufficient quorum, max-round escape, incomplete state, rollback, and resume fixtures produce the same canonical decision and preserved forensic history; no failed run becomes `convergence: true`. |
| REQ-005 | Ledger control-plane additions are safe | Every ledger behavior event has an authorized transition and required receipt references; unauthorized transitions, missing receipts, duplicate effects, or shadow-path external writes fail the run. |
| REQ-006 | Normalization cannot conceal semantic drift | Only fields named by the versioned normalization profile are excluded from equality; profile changes alter its digest and invalidate prior parity receipts. |
| REQ-007 | Parity is a hard pre-cutover gate | The acceptance report records zero unexplained diffs, zero unauthorized events, zero duplicate side effects, deterministic replay fingerprints, and a green fixture matrix before any authority decision is eligible. |
<!-- /ANCHOR:requirements -->

### Shadow-parity acceptance contract

The canonical comparison treats the legacy event vocabulary and typed ledger vocabulary as two encodings of one behavior history. Adapter or audit events that exist only on the ledger side are retained in the report and checked for authorization, but cannot satisfy or replace a missing behavior tuple. The pass bar is zero unexplained semantic differences. A tolerated diff is accountable only when it has a typed disposition, owner, reason, and proof that it cannot change trusted state or downstream authority; any unaccountable tolerance blocks parity.

The closed volatility allowlist is `occurred_at`, `recorded_at`, and `correlation_id`. Each allowlisted field is still checked for presence, type, and non-interference with semantic identity. Event order, logical identity, required content, lifecycle status, projection output, artifact meaning, failure classification, and resume or rollback authority remain protected.

Every named cross-artifact reference must resolve to an artifact of the declared kind and, where the artifact bears them, match epoch, lifecycle, freshness, and real state; visibility and role-redaction rules plus authority liveness are checked at the same boundary. Existence- or shape-only acceptance is a defect. Fault-injection fixtures must traverse the real council execution, authorization, ledger, reducer, projection, receipt, and mode-gate evidence pipeline and assert the exact typed failure class; stub-only or zero-event tests cannot satisfy acceptance. The manifest-bound parity receipt is evidence, not a standalone forgery-proof authority object. The authenticated mode gate is the trust anchor and must re-verify the receipt binding rather than self-trust a computed parity status.

The minimum parity matrix includes: a three-seat successful council with `council_complete`; a multi-round critique and convergence run; a timeout and an error seat; two high-confidence contradictory recommendations; max-round `non-converged`; a failed persistence step followed by rollback; resume after `round_start`, after all `seat_returned` rows, after synthesis, and after `round_end`; and a run exercising blinded adjudication, minority retention, independence evidence, or a comparative control arm. The matrix must use recorded outputs for deterministic event comparison and must include a completion-order permutation where the shared shadow framework supports it.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A paired harness runs legacy and ledger paths from one frozen input boundary while legacy remains authoritative and no second external side effect occurs.
- **SC-002**: Every matrix fixture produces equal canonical behavior projections event-for-event after only the pinned normalization profile is applied.
- **SC-003**: Terminal council outcomes, failure states, resume decisions, rollback history, artifact references, and projection fingerprints are identical across both paths.
- **SC-004**: Ledger-only authorization, receipt, and audit events are complete, authorized, and causally attached without masking behavior-event drift.
- **SC-005**: Replaying each fixture and the supported completion-order permutations produces the same parity fingerprint and the same first-divergence result.
- **SC-006**: A parity receipt is sufficient for the later mode gate to prove zero unexplained diffs; any missing fixture, unexplained diff, unauthorized transition, duplicate effect, or unstable fingerprint blocks cutover.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **False parity from over-normalization** - A broad ignore list can hide changed convergence, evidence, or artifact semantics. Mitigation: keep a small versioned normalization profile, compare all required fields, hash the profile, and fail on an unknown field.
- **Nondeterministic seat output** - Live model sampling can create unrelated content drift. Mitigation: freeze recorded seat outputs and tool receipts for the event-for-event gate; treat live shadow samples as supplemental evidence, never as a fuzzy pass.
- **Duplicate execution or effects** - A shadow adapter could dispatch seats twice or write through a side-effect boundary. Mitigation: share one execution input, use read-only taps for legacy output, require effect IDs and receipts, and assert zero shadow-owned external effects.
- **Vocabulary mismatch** - Typed ledger events may have finer granularity than legacy rows. Mitigation: compare a documented canonical behavior tuple and separately audit ledger control-plane events; do not compare raw line names alone or collapse multiple behavior events into one.
- **Projection order drift** - Concurrent seat completion can reorder raw rows while the council contract depends on logical IDs. Mitigation: compare both append order and deterministic logical order, require the shared framework's completion-order fixtures, and record the first divergent sequence.
- **In-flight state inconsistency** - Resume or rollback can read one path's state and another path's projection. Mitigation: run paired checkpoints through the `005-resume-adapter` contract and block parity when either path lacks a complete recovery classification.
- **Dependencies**: phase-014 shadow framework from the phase brief; phase 012 shared mode contracts and write-set conflict graph; the sibling Deep AI Council concerns `001-typed-ledger-schema` through `005-resume-adapter`; the shared compatibility/shadow bridge; and the existing `deep-ai-council` state, output, failure, rollback, and artifact contracts. The phase-tree entry intentionally declares `depends_on: []`; these are planning inputs and execution sequencing constraints, not a new hard child edge.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which phase-014 normalization profile is authoritative for timestamps, transport metadata, generated IDs, and byte counts, and which fields must remain exact?
- What is the canonical event mapping from `round_start`, `seat_returned`, `deliberation_synthesized`, `round_end`, `council_complete`, rollback, and artifact audit rows to the typed ledger event namespace?
- Which ledger-only authorization, receipt, gauge, and audit events are required for a green control-plane result without entering the behavior projection?
- Which recorded council fixtures are the minimum protected contract, and which known legacy defects must remain visible as mismatches rather than being blessed as parity?
- What evidence threshold in the later mode gate permits moving from deterministic fixture parity to sampled live shadow traffic, and what exact rollback signal ends that window?
<!-- /ANCHOR:questions -->
