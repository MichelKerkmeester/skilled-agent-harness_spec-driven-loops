---
title: "Implementation Plan: Deep Review - Certificates & Receipts"
description: "Implementation Plan for the Deep Review per-run certificate, per-transition receipt, replay-fingerprint, and offline-verifier contract over the shared event-ledger substrate."
trigger_phrases:
  - "deep review certificates implementation plan"
  - "deep-review receipt contract plan"
  - "offline review verifier plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the Deep Review attestation boundary and verifier inputs"
    next_safe_action: "Finalize receipt and certificate fields against phases 003 and 009"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions:
      - "Which exact phase-006 certificate primitive signs or seals the run certificate?"
      - "Which phase-012 transition result fields are inherited by each receipt?"
    answered_questions:
      - "The certificate attests recorded process integrity, not semantic truth"
---
# Implementation Plan: Deep Review - Certificates & Receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-review |
| **Change class** | Certificate, receipt, replay-fingerprint, and offline-verifier contract planning |
| **Execution** | Implement after phase `003-sealed-artifacts` and phase 012 contracts are frozen; ledger remains additive and non-authoritative |

### Overview
The plan turns the Deep Review lifecycle into two verifiable attestations over the shared ledger. The per-transition receipt records the authorized transition, immutable inputs and outputs, event-tail position, attempt and effect state, and replay inputs. The per-run certificate binds the certificate-pinned event range, receipt-set root, scope and dimension coverage, convergence and report handoff, unresolved state, and the final replay fingerprint. The offline verifier checks these claims from a trusted contract bundle and content-addressed references without running a model, tool, network call, reducer, or mutable workspace operation.

The typed-ledger sibling supplies event names and payload references. Phase `003-sealed-artifacts` supplies receipt and certificate primitives. Phase 012 supplies the shared review-loop contract used by Deep Review and deep-alignment. The design keeps candidate production, evidence, adjudication, and P0/P1/P2 activation as separate receipt-bearing transitions and treats unknown external effects as explicit recovery state. The later resume adapter may consume these receipts, but this plan does not define its reuse policy.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase `003-sealed-artifacts` publishes the receipt primitive, certificate primitive, seal/reference format, and offline verification hooks.
- [ ] Phase 012 publishes the shared review-loop identity, transition result, lineage, causal-link, replay, report-reference, and write-set contracts used by Deep Review and deep-alignment.
- [ ] `001-typed-ledger-schema` publishes the complete Deep Review event union and required cross-event references.
- [ ] The current Deep Review lifecycle is inventoried from its config, state JSONL, iteration, finding, evidence, convergence, adjudication, synthesis, report, and continuity records.
- [ ] The receipt matrix names one receipt owner for each transition and separates shared primitives, mode extensions, and later resume or gate consumers.
- [ ] The target remains limited to attestation schemas, fingerprint inputs, offline verification, and fixtures; no reducer, report, resume, rollback, or authority work is scheduled here.

### Definition of Done
- [ ] The run certificate and transition receipt fields are ratified against phases `003-sealed-artifacts` and 009.
- [ ] Replay fingerprints cover immutable identity, behavior, artifact, policy, evaluator, and report input classes with typed mismatch outcomes.
- [ ] Offline verification fixtures prove receipt closure, certificate coverage, append integrity, candidate/adjudication separation, unresolved-state retention, and fail-closed tamper handling.
- [ ] A handoff packet gives the later resume adapter and mode gate stable certificate and receipt references without prescribing their decision algorithms.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Define `TransitionReceipt<Payload>` as a versioned specialization of the shared receipt primitive. Reuse shared event identity, causation, correlation, aggregate sequence, authorization result, `prevEventHash`, append position, and replay metadata; add only Deep Review scope references and review-specific evidence fields.
- Define `DeepReviewRunCertificate` as a certificate primitive subject containing run lineage, target and base/head digests, scope and dimension coverage, finalized event range, receipt-set root, replay fingerprint, terminal or incomplete outcome, report revision, unresolved/deferred/blocked IDs, and verifier result.
- Keep certificate claims distinct from semantic judgment. A certificate proves that the declared run record is complete and internally consistent under named contracts; adjudication receipts retain the evidence and reasoning needed to assess a finding.
- Build one receipt coverage matrix for lifecycle transitions: run and scope, pass and evidence, adjudication and lineage, convergence and recovery, synthesis and publication. Every retry, late arrival, supersession, and unknown effect appends a new receipt.
- Define a canonical fingerprint registry with separate input classes for logical identity, shared and mode contracts, schema and codecs, target and scope, ordered protocol, executor and tool capabilities, analyzers and evaluators, event and artifact digests, reducer/report contracts, convergence policy, and included receipt set.
- Make the verifier offline and fail closed. It loads a trusted registry bundle, checks certificate primitive validity, folds only the certificate-pinned event range, recomputes receipt and run fingerprints, validates references, and returns `valid`, `invalid`, `incomplete`, or `blocked` with the first failed invariant.
- Keep Deep Review and deep-alignment on the same shared review-loop transitions. Mode extensions carry only Deep Review certificate and evidence fields; they do not duplicate shared scope, dimension, lineage, convergence, or report semantics.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm phase `003-sealed-artifacts`, phase 012, and `001-typed-ledger-schema` artifacts are present, frozen, and compatible with the migration sequence.
- Inventory every Deep Review typed event and classify whether its receipt is shared, mode-specific, or supplied by the generic effect/recovery primitive.
- Build the attestation matrix for scope resolution, ordered dimensions, candidate/evidence handling, claim adjudication, convergence and blocked stops, synthesis, report publication, continuity handoff, and terminal completion.
- Freeze the verifier trust boundary: contract registry, certificate primitive registry, sealed-artifact resolver, ledger reader, and allowed content-addressed inputs. Exclude network, model, tool, and mutable workspace access.

### Phase 2: Implementation
- Define receipt aliases and required fields for transition identity, source and destination references, authorization, event-tail integrity, attempt/effect state, raw observations, evidence references, adjudication references, and output digests.
- Define the run certificate subject and attested claims, including receipt-set root, finalized event range, scope/dimension coverage, convergence result, report handoff, unresolved state, replay fingerprint, and verifier result.
- Define the canonical fingerprint input manifest and typed compatibility decisions. Preserve the source fingerprint, implementation fingerprints, contract revisions, and first mismatch class in the verifier result.
- Define receipt-chain, certificate-coverage, candidate-admission, unknown-effect, late-evidence, and report-completeness invariants without moving their policy ownership into this phase.
- Define the offline verifier pipeline and fixture format for normal completion, incomplete termination, blocked stop, contested findings, retries, late evidence, tampering, unknown versions, and missing sealed references.

### Phase 3: Verification
- Compare the receipt and certificate types against phase `003-sealed-artifacts`, phase 012, and the typed event union; reject duplicate shared fields and unowned transitions.
- Verify every in-scope transition has one or more immutable receipts, every receipt points to valid causal and authorization references, and every certificate claim resolves to a pinned event or sealed artifact digest.
- Recompute fingerprints from copied inputs and exercise exact, compatible, migrate, pin-old-runtime, and blocked decisions under changed policy, target, tool, evaluator, schema, and report inputs.
- Run the verifier with no model, network, external tool, or mutable workspace access and assert that tampering, missing inputs, unknown versions, mutable references, and contradictory chains fail closed.
- Produce a handoff matrix for `005-resume-adapter`, the later mode gate, and shared deep-alignment consumers listing stable receipt references, certificate claims, and unresolved ownership questions.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Validate certificate identity, lineage, target digests, contract revisions, certificate policy, and one-run scope |
| REQ-002 | Verify terminal, incomplete, blocked, unresolved, and report-complete certificate claims against a pinned event range |
| REQ-003 | Run the receipt matrix across every typed lifecycle transition and fail on a required transition without a receipt |
| REQ-004 | Mutate authorization, causation, event-tail, input/output digest, attempt, provider, and effect fields; require invalid or blocked results |
| REQ-005 | Recompute the canonical fingerprint from stable and behavior input classes and report the first mismatch under each drift fixture |
| REQ-006 | Replay unchanged and changed installations; require typed compatibility decisions and no silent reuse after contract or policy drift |
| REQ-007 | Exercise candidate, evidence, adjudication, and P0/P1/P2 fixtures; reject severity activation without a valid adjudication receipt |
| REQ-008 | Append late, retried, superseding, and unknown-effect receipts; verify raw history and unresolved state remain visible |
| REQ-009 | Run the verifier on a copied ledger and sealed references with network, model, tool, and mutable workspace access unavailable |
| REQ-010 | Compare Deep Review and deep-alignment shared transitions and reject mode-local copies of shared review-loop fields |
| REQ-011 | Scan the phase package for reducer, report, resume, rollback, authority, and mode-gate ownership and require a planning-only result |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This phase consumes phase `003-sealed-artifacts` certificate and receipt primitives, phase 012 shared review-loop and replay contracts, and `001-typed-ledger-schema` event names and references. It also consumes the current Deep Review state and report definitions plus the candidate-first, orthogonal-severity, stable-fingerprint, executable-evidence, and deterministic-receipt recommendations in `findings-registry-modes.json:2619-2876` and `findings-registry.json:2600-2747`.

The later `005-resume-adapter` consumes receipt and certificate references for reuse, re-execute, reconcile, compensate, or block decisions. Reducers and projections consume receipt digests as immutable inputs. Deep-alignment consumes shared review-loop fields and must not receive a Deep Review-only fork. Authority cutover, rollback, and the independent mode gate consume the certificate as evidence after this phase.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase is planning-only until its implementation is separately authorized. If implementation begins, land receipt types, certificate subjects, fingerprint registry, verifier, and fixtures behind the dark ledger path in dependency-closed commits. Reverting those commits restores the prior Deep Review JSONL and report path without deleting historical state or changing authority. Unsupported historical records remain readable through the legacy path or return explicit blocked compatibility outcomes. Any phase `003-sealed-artifacts` or phase 012 contract change invalidates the candidate attestation contract and requires regeneration from the shared definitions before implementation continues.
<!-- /ANCHOR:rollback -->
