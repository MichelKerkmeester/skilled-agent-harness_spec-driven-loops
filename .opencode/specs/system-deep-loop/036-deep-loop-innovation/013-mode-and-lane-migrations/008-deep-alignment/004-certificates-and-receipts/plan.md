---
title: "Implementation Plan: Deep Alignment - Certificates & Receipts"
description: "Implementation Plan for the Deep Alignment per-run certificate, per-transition receipt, replay-fingerprint, authority-epoch, and offline-verifier contract over the shared event-ledger substrate."
trigger_phrases:
  - "deep alignment certificates implementation plan"
  - "deep-alignment receipt contract plan"
  - "offline alignment verifier plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T21:45:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined Deep Alignment attestation and verifier inputs"
    next_safe_action: "Finalize authority and receipt fields against shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions:
      - "Which phase-007 primitive seals the run certificate?"
      - "Which phase-012 fields are inherited by alignment receipts?"
    answered_questions:
      - "The certificate attests process integrity, not semantic truth"
---
# Implementation Plan: Deep Alignment - Certificates & Receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-alignment |
| **Change class** | Certificate, receipt, authority-epoch replay, and offline-verifier contract planning |
| **Execution** | Implement after phase `003-sealed-artifacts` and phase 012 contracts are frozen; ledger remains additive and non-authoritative |

### Overview
The plan turns the Deep Alignment lifecycle into two verifiable attestations over the shared ledger. The per-transition
receipt records the authorized transition, authority and subject inputs, applicability result, immutable evidence and proof
references, event-tail position, attempt and effect state, and replay inputs. The per-run certificate binds the named authority
and epoch, certificate-pinned event range, receipt-set root, lane and applicability coverage, proof and adjudication state,
deviation history, convergence and handoff, unresolved state, and final replay fingerprint. The offline verifier checks these
claims from a trusted contract bundle and content-addressed references without running a model, tool, network call, or mutable
workspace operation.

The typed-ledger sibling supplies event names and payload references. Phase `003-sealed-artifacts` supplies receipt and
certificate primitives. Phase 012 supplies the shared review-loop contract used by Deep Alignment and Deep Review. The design
keeps authority validation, applicability, observation, candidate, proof, verification, adjudication, and deviation as
separate receipt-bearing transitions and treats unknown external effects as explicit recovery state. The later resume adapter
may consume these receipts, but this plan does not define its reuse policy.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase `003-sealed-artifacts` publishes the receipt primitive, certificate primitive, seal/reference format, and offline verification hooks.
- [ ] Phase 012 publishes the shared review-loop identity, transition result, lineage, causal-link, replay, handoff, and write-set contracts used by Deep Alignment and Deep Review.
- [ ] `001-typed-ledger-schema` publishes the complete Deep Alignment event union and required authority, applicability, proof, and cross-event references.
- [ ] The current Deep Alignment lifecycle is inventoried from authority, lane, subject, observation, evidence, finding, proof, deviation, convergence, continuity, and terminal records.
- [ ] The receipt matrix names one receipt owner for each shared, mode-specific, effect, certificate, handoff, and later resume transition.
- [ ] The target remains limited to attestation schemas, authority-epoch fingerprint inputs, offline verification, and fixtures; no reducer, projection, resume, shadow, rollback, or authority work is scheduled here.

### Definition of Done
- [ ] The run certificate and transition receipt fields are ratified against phase `003-sealed-artifacts` and phase 012.
- [ ] Replay fingerprints cover immutable identity, authority, applicability, proof, artifact, policy, verifier, and handoff input classes with typed mismatch outcomes.
- [ ] Offline verification fixtures prove authority validity, receipt closure, certificate coverage, append integrity, applicability ordering, proof/adjudication separation, deviation retention, unresolved-state retention, and fail-closed tamper handling.
- [ ] A handoff packet gives the later resume adapter and mode gate stable certificate and receipt references without prescribing their decision algorithms.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Define `TransitionReceipt<Payload>` as a versioned specialization of the shared receipt primitive. Reuse shared event identity, causation, correlation, aggregate sequence, authorization result, `prevEventHash`, append position, and replay metadata; add only Deep Alignment authority, lane, applicability, evidence, proof, and deviation fields.
- Define `DeepAlignmentRunCertificate` as a certificate primitive subject containing run lineage, named authority and epoch, authority validation, target and subject scope, lane and applicability coverage, finalized event range, receipt-set root, replay fingerprint, proof/adjudication coverage, deviation state, terminal or incomplete outcome, and verifier result.
- Keep certificate claims distinct from semantic judgment. A certificate proves that the declared alignment record is complete and internally consistent under named contracts; raw observations, proof witnesses, verification results, and adjudication receipts retain the evidence needed to assess conformance.
- Build one receipt coverage matrix for authority and scope, applicability and observation, candidate and proof, verification and adjudication, deviations and witness replay, convergence and recovery, and continuity or terminal handoff. Every retry, late arrival, supersession, and unknown effect appends a new receipt.
- Define a canonical fingerprint registry with separate input classes for logical identity, shared and mode contracts, authority capsule and epoch, compiler and rule IR, profile and applicability, ordered lanes and rules, subject snapshots, executor and tool capabilities, analyzers and verifiers, event and artifact digests, witnesses, deviations, reducer or handoff contracts, and included receipt set.
- Make the verifier offline and fail closed. It loads a trusted registry bundle, checks certificate primitive validity, authority validity, sealed references, receipt closure, direction-sensitive epoch replay, and fingerprints, and returns `valid`, `invalid`, `incomplete`, or `blocked` with the first failed invariant.
- Keep Deep Alignment and Deep Review on the same phase-012 review-loop transitions. Mode extensions carry only Deep Alignment authority, applicability, proof, and conformance fields; they do not duplicate shared run, scope, pass, lineage, convergence, continuity, or terminal semantics.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm phase `003-sealed-artifacts`, phase 012, and `001-typed-ledger-schema` artifacts are present, frozen, and compatible with the migration sequence.
- Inventory every Deep Alignment typed event and classify whether its receipt is shared, mode-specific, authority/effect-owned, or supplied by the generic certificate primitive.
- Build the attestation matrix for authority binding, validity, lane and subject setup, applicability, observations, candidate/proof handling, verification, adjudication, deviations, witness replay, convergence, blocked stops, continuity, and terminal completion.
- Freeze the verifier trust boundary: contract registry, certificate primitive registry, sealed-artifact resolver, ledger reader, authority bundle, and allowed content-addressed inputs. Exclude network, model, tool, and mutable workspace access.

### Phase 2: Implementation
- Define receipt aliases and required fields for transition identity, source and destination references, authorization, authority epoch, subject snapshot, applicability, event-tail integrity, attempt/effect state, evidence, proof, adjudication, deviation, and output digests.
- Define the run certificate subject and attested claims, including authority validity, receipt-set root, finalized event range, lane and applicability coverage, proof and adjudication state, deviation history, convergence result, handoff, unresolved state, replay fingerprint, and verifier result.
- Define the canonical fingerprint input manifest and typed compatibility decisions. Preserve the source fingerprint, authority epoch, compiler and verifier fingerprints, contract revisions, witness references, and first mismatch class in the verifier result.
- Define receipt-chain, certificate-coverage, applicability-ordering, candidate-admission, proof-carrying-finding, deviation-invalidation, unknown-effect, late-evidence, and handoff-completeness invariants without moving their policy ownership into this phase.
- Define the offline verifier pipeline and fixture format for valid and invalid authority material, applicable and not-applicable rules, unresolved scope, normal completion, incomplete termination, blocked stop, contested findings, deviations, epoch change, retries, late evidence, tampering, unknown versions, and missing sealed references.

### Phase 3: Verification
- Compare the receipt and certificate types against phase `003-sealed-artifacts`, phase 012, and the typed event union; reject duplicate shared fields and unowned transitions.
- Verify every in-scope transition has one or more immutable receipts, every receipt points to valid causal, authorization, authority, subject, and event-tail references, and every certificate claim resolves to a pinned event or sealed-artifact digest.
- Recompute fingerprints from copied inputs and exercise exact, compatible, migrate, degraded, pin-old-runtime, and blocked decisions under changed authority, epoch, subject, profile, verifier, tool, witness, deviation, schema, and handoff inputs.
- Run the verifier with no model, network, external tool, or mutable workspace access and assert that authority invalidity, tampering, missing inputs, unknown versions, mutable references, and contradictory receipt chains fail closed.
- Produce a handoff matrix for `005-resume-adapter`, the later mode gate, and shared Deep Review consumers listing stable receipt references, certificate claims, unresolved authority ownership, and no hidden cutover behavior.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Validate certificate identity, lineage, named authority, epoch, target and subject digests, contract revisions, certificate policy, and one-run scope |
| REQ-002 | Verify authority-valid, authority-invalid, terminal, incomplete, blocked, unresolved, deviation-bearing, and handoff-complete claims against a pinned event range |
| REQ-003 | Run the receipt matrix across every shared and alignment-specific lifecycle transition and fail on a required transition without a receipt |
| REQ-004 | Mutate authorization, authority, subject, causation, event-tail, input/output digest, attempt, provider, and effect fields; require invalid or blocked results |
| REQ-005 | Recompute the canonical fingerprint from stable and behavior input classes and report the first mismatch under authority, epoch, subject, applicability, verifier, witness, policy, and handoff drift fixtures |
| REQ-006 | Replay unchanged and changed authority installations; require typed compatibility decisions and no silent reuse after contract, epoch, profile, verifier, or policy drift |
| REQ-007 | Exercise applicable, not-applicable, unresolved, candidate, proof, verification, adjudication, and conformance fixtures; reject blocking conformance without valid applicability and proof evidence |
| REQ-008 | Append late, retried, superseding, deviation, invalidation, and unknown-effect receipts; verify raw history and unresolved state remain visible |
| REQ-009 | Run the verifier on a copied ledger, authority bundle, and sealed references with network, model, tool, and mutable workspace access unavailable |
| REQ-010 | Compare Deep Alignment and Deep Review shared transitions and reject mode-local copies of shared review-loop fields |
| REQ-011 | Scan the phase package for reducer, projection, resume, shadow, rollback, authority, and mode-gate ownership and require a planning-only result |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This phase consumes phase `003-sealed-artifacts` certificate and receipt primitives, phase 012 shared review-loop and replay
contracts, and `001-typed-ledger-schema` authority, applicability, proof, deviation, and handoff references. It also consumes
the current Deep Alignment state definitions plus the authority-validity, typed-rule, applicability, witness, proof-carrying
finding, chronological-deviation, and authority-epoch recommendations in `findings-registry-modes.json:1212-1512` and
`findings-registry-modes.json:3434-3539`.

The later `005-resume-adapter` consumes receipt and certificate references for reuse, re-execute, reconcile, compensate, or
block decisions. Reducers and projections consume receipt and certificate digests as immutable inputs. Deep Review consumes
the inherited phase-012 fields and must not receive a Deep Alignment-only review-loop fork. Shadow parity, rollback, and the
independent mode gate consume the certificate as evidence after this phase; authority remains outside this planning contract.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase is planning-only until its implementation is separately authorized. If implementation begins, land receipt types,
certificate subjects, authority-epoch fingerprint registry, offline verifier, and fixtures behind the dark ledger path in
dependency-closed commits. Reverting those commits restores the prior Deep Alignment JSONL and report path without deleting
historical state or changing authority. Unsupported historical records remain readable through the legacy path or return
explicit blocked compatibility outcomes. Any phase `003-sealed-artifacts` or phase 012 contract change invalidates the
candidate attestation contract and requires regeneration from shared definitions before implementation continues.
<!-- /ANCHOR:rollback -->
