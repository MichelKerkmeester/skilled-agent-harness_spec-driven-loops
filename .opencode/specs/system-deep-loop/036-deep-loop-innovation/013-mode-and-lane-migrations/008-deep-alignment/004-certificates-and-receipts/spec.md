---
title: "Feature Specification: Deep Alignment - Certificates & Receipts"
description: "Plan the Deep Alignment per-run certificate and per-transition receipt contract over the typed event-ledger substrate. The phase defines authority and applicability attestations, verify-first finding coverage, replay-fingerprint inputs, and independent offline verification for per-lane conformance against a named authority."
trigger_phrases:
  - "deep alignment certificates and receipts"
  - "deep-alignment run certificate"
  - "deep-alignment transition receipts"
  - "offline alignment certificate verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T21:45:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined Deep Alignment certificate and receipt boundaries"
    next_safe_action: "Pin fields against sealed artifacts and shared review-loop contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions:
      - "Which phase-006 primitive seals the Deep Alignment run certificate?"
      - "Which phase-012 receipt fields are inherited by each alignment transition?"
      - "Which authority-epoch changes require witness replay versus a fresh lane run?"
      - "Does the verifier pin a finalized frontier, a contiguous range, or both?"
    answered_questions:
      - "This phase plans attestations and offline verification, not authority cutover"
      - "Deep Alignment consumes the shared review-loop contract used by Deep Review"
      - "The certificate attests recorded conformance process, not unsupported semantic truth"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Alignment - Certificates & Receipts

> Phase adjacency under the Deep Alignment parent (grouping order, not a runtime dependency): predecessor `003-sealed-artifacts`; successor `005-resume-adapter`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/004-certificates-and-receipts |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop / deep-alignment |
| **Formal depends_on** | [] |
| **Origin** | Deep Alignment mode migration after the shared ledger, sealed-artifact, and review-loop contracts are frozen |
| **Inputs** | `036-deep-loop-innovation/spec.md`, `manifest/phase-tree.json`, the Deep Alignment typed-ledger sibling, `findings-registry*.json`, phase `003-sealed-artifacts`, and the shared review-loop contract from phase 012 |
| **Output** | A ratifiable per-run certificate, per-transition receipt, replay-fingerprint input, and independent offline-verifier plan; no authority cutover |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Deep Alignment checks each lane against a named authority and must preserve a verify-first distinction between an authority
definition, an applicability decision, a raw observation, a candidate finding, an independently verified result, and a
conformance disposition. The typed-ledger sibling defines those events, but a terminal alignment result alone does not prove
which authority capsule and epoch, rule IR, applicability facts, subject snapshot, verifier, evidence receipts, witnesses,
deviations, or shared review-loop transitions produced it. Without a run attestation and receipt closure, a later verifier
cannot distinguish changed authority from changed subject, missing evidence from non-conformance, or an unresolved effect from
a successful check.

The migration program requires an append-only typed ledger, a fail-closed transition gateway, sealed reference artifacts,
versioned replay fingerprints, and receipts/certificates before authority moves. Phase `003-sealed-artifacts` supplies the
receipt and certificate primitives consumed here. Phase 012 freezes the shared review-loop backbone used by Deep Alignment
and Deep Review; this phase specializes that contract rather than forking it. The research inputs require authority validity
before artifact conformance, typed rule obligations, first-class applicability and unresolved outcomes, digest-bound evidence,
direction-sensitive authority-epoch replay, chronological deviations, and proof-carrying findings. They also require
independent verifier identity, raw score retention, and replayable positive, negative, boundary, and stateful witnesses
(`findings-registry-modes.json:1212-1512`, `findings-registry-modes.json:3434-3539`).

This phase plans two related attestations. A **CERTIFICATE** is one per completed or explicitly incomplete Deep Alignment run
and attests the declared authority, scope, lane coverage, finalized event range, receipt set, replay fingerprint, proof and
adjudication coverage, deviation state, and terminal handoff. A **RECEIPT** is one per authorized transition and attests the
transition decision, authority and subject inputs, applicability result, observations or proof references, effect status, and
append-chain position. Neither attestation asserts semantic conformance merely because a detector, scorer, or aggregate accepted
it; the evidence and independent verification boundary remains explicit.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A versioned Deep Alignment `run_certificate` contract binding run identity, named authority and epoch, authority validity, target and subject scope, lane and rule coverage, finalized ledger range, receipt-set root, replay fingerprint, terminal or incomplete outcome, deviation state, and verifier result.
- A versioned `transition_receipt` contract for every authorized shared review-loop and Deep Alignment transition from authority binding and validation through lane planning, subject snapshot, applicability, observations, evidence, candidate findings, independent verification, proof, adjudication, deviation, witness replay, coverage, convergence, blocked stops, continuity, and terminal handoff.
- A receipt coverage matrix separating transition identity, authorization, event integrity, authority and subject references, applicability, observation/evidence, proof, adjudication, deviation, and materialized handoff; retries and late results receive new immutable receipts rather than in-place updates.
- A canonical replay-fingerprint input registry covering the shared envelope, phase-012 review-loop and mode contracts, authority capsule and epoch, compiler and rule-IR digests, profile and applicability policy, ordered lanes and rules, subject snapshots, verifier and analyzer versions, event payload digests, proof witnesses, deviation assertions, reducer or projection contract revisions, and certificate policy.
- Direction-sensitive authority-epoch replay that compares old-authority witnesses against a new authority capsule, identifies deleted, weakened, narrowed, broadened, or newly introduced obligations, and preserves exact, compatible, migrate, degraded, or blocked outcomes.
- An independent offline verifier that reads only certificate-pinned ledger events and content-addressed references, recomputes hashes and fingerprints, checks authority validity and receipt closure, verifies applicability and proof-carrying findings, and returns explicit valid, invalid, incomplete, or blocked outcomes.
- Fixtures for valid and invalid authority material, applicable and not-applicable rules, unresolved scope, raw observations, candidate-to-verification promotion, proof witnesses, known deviations, epoch changes, late evidence, retry and unknown-effect states, blocked convergence, incomplete terminal runs, and unchanged offline replay.

### Out of Scope
- The shared envelope, transition vocabulary, append API, authorization semantics, generic effect recovery, and phase-012 review-loop lifecycle. This phase consumes those contracts.
- Sealed-artifact storage, authority-capsule compilation, signing, and seal primitives owned by phase `003-sealed-artifacts`; this phase consumes their typed references and verification hooks.
- Deep Alignment event vocabulary owned by `001-typed-ledger-schema`, applicability and finding reducers or projections owned by the reducer sibling, and dashboards, reports, or materialized gauges.
- Resume planning, reuse and re-execution decisions owned by `005-resume-adapter`; this phase specifies receipt and certificate references required for later recovery only.
- Shadow parity, rollback switching, the independent mode gate, authority cutover, legacy-writer retirement, and any change to the legacy authority path.
- New authorities, conformance policy, remediation behavior, or verifier algorithms beyond the Deep Alignment lifecycle and the cited research recommendations.
- The other six sibling concerns and their mode-gate integration. The 010 migrations are the later per-mode fan-out after phase 012 freezes shared contracts and emits the write-set conflict graph.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A run certificate identifies exactly one Deep Alignment run and declares its attestation boundary | The certificate binds `runId`, session and generation lineage, named authority, authority epoch, target and subject digests, mode and shared contract revisions, certificate version, and certificate policy fingerprint |
| REQ-002 | The certificate attests authority validity, scope, lane coverage, and declared conformance outcome without asserting unsupported semantic truth | It records authority validation, applicability coverage, finalized event range, receipt-set root, proof and adjudication coverage, terminal or incomplete status, deviation IDs, unresolved/blocked IDs, and verifier outcome; raw observations remain available |
| REQ-003 | Every state-changing shared or Deep Alignment transition has an immutable receipt | The receipt matrix covers authority binding, authority validation, lane and subject setup, applicability, observation/evidence, candidate, verification, proof, adjudication, deviation, witness replay, coverage, convergence, blocked stop, continuity, and terminal transitions |
| REQ-004 | Receipts preserve authorization, causality, integrity, authority identity, subject identity, and effect ambiguity | Each receipt binds transition ID, source state and event tail, transition token, authorization reference, authority and subject digests, input/output digests, append position, `prevEventHash`, attempt identity, effect receipt references, and explicit unknown or blocked status where needed |
| REQ-005 | Replay compatibility is decided from a canonical, versioned fingerprint | Fingerprint inputs include logical operation, shared review-loop and mode-contract revisions, schema and codec hashes, authority capsule/epoch/compiler/rule-IR/profile digests, ordered lanes and rules, subject snapshot, verifier/analyzer/tool fingerprints, event and artifact digests, witness and deviation references, reducer/projection contract revision, and certificate inputs |
| REQ-006 | Certificate and receipt fingerprints distinguish immutable history from the current installation and authority epoch | Offline replay uses pinned versions and digests; changed authority, verifier, target, policy, tool surface, artifact, or witness yields exact, compatible, migrate, degraded, pin-old-runtime, or blocked rather than silent reuse |
| REQ-007 | Applicability and candidate production cannot masquerade as conformance | Applicability receipts preserve `applicable`, `not_applicable`, `unresolved`, and `blocked`; candidate receipts preserve raw observations; a separate verification, proof, and adjudication chain is required before a blocking conformance disposition |
| REQ-008 | Deviations, late evidence, retries, supersession, and unresolved states remain auditable | A later receipt references the prior receipt and records the new observation or disposition; no certificate or receipt rewrites raw evidence, erases an authority failure, or turns unknown external effects into success |
| REQ-009 | An independent verifier can validate a run without live model, tool, network, or mutable workspace access | The verifier accepts a certificate, ledger range, sealed-artifact references, and trusted contract registry; it recomputes digests, authority validity, receipt closure, event order, fingerprints, proof links, and report or handoff inputs with fail-closed outcomes |
| REQ-010 | Deep Alignment and Deep Review continue to share one review-loop backbone | The contract comparison identifies inherited shared fields and mode-specific extensions; no Deep Alignment-only copy of shared run, scope, pass, convergence, continuity, or terminal transitions is introduced |
| REQ-011 | The phase remains planning-only and ownership-complete | The packet defines schemas, input matrices, verifier behavior, and fixtures only; no reducer, projection, sealed-artifact implementation, resume adapter, shadow harness, rollback switch, authority cutover, or mode gate is implemented here |
<!-- /ANCHOR:requirements -->

The attestation boundary is deliberately narrow. A certificate attests **recorded conformance-process integrity and declared
result completeness** under named authority and verifier contracts. It does not certify that every observation is correct, that
an authority is normatively sufficient beyond its sealed validity checks, or that a conformance decision is justified without
its applicability, evidence, proof, and adjudication records. A `not_applicable`, `unresolved`, `inconclusive`, `untested`,
`blocked`, or `authority_invalid` state is evidence, not a coerced pass or fail.

The per-transition receipt plan uses these required evidence groups:

| Receipt group | Transitions covered | Attestation payload |
|---------------|---------------------|---------------------|
| Authority and scope | authority binding, authority validation, epoch compatibility, run and scope resolution, lane plan | authority capsule and epoch digests, compiler/profile/rule-IR identities, validity result, target and subject scope, ordered lanes, selected and omitted rules, contract fingerprints |
| Applicability and observation | subject snapshot, applicability, lane start/completion, raw observation, evidence receipt, reconciliation | lane/rule identity, target facts digest, applicability outcome, raw observation digest, evidence locator, analyzer/tool fingerprint, freshness, causal and relevance result |
| Candidate, proof, and verification | candidate emission, verifier result, witness generation, witness replay, proof admission | candidate/finding identity, predecessor receipt, witness digest and type, evidence-set digest, verifier identity, independent evidence class, impact/confidence, compatibility result |
| Adjudication and deviation | conformance assessment, known deviation, deviation invalidation, supersession | evidence and proof references, discrete disposition, issuer, scope, authority epoch, verifier digest, rationale reference, expiry/invalidation conditions, prior finding link |
| Convergence and recovery | convergence evaluation, blocked stop, pause, recovery, terminal decision | raw signals, coverage gates, unresolved rules, blockers, stop reason, recovery strategy, finalized frontier, policy fingerprint, effect status |
| Continuity and handoff | continuity, report or handoff projection, run completion | event range, included and excluded receipt digests, coverage and finding input digest, handoff revision/digest, unresolved/deferred/blocked IDs, certificate linkage |

The fingerprint input registry must distinguish stable identity inputs from versioned behavior inputs. Stable inputs include
logical run, transition, authority, epoch, lane, rule, subject, observation, candidate, finding, witness, deviation, receipt,
and handoff identifiers plus content-addressed digests. Behavior inputs include envelope and payload schema versions, the phase
009 review-loop and mode-contract revisions, authorization and certificate policy revisions, authority compiler and rule-IR
versions, profile and applicability policy, ordered lane and rule plans, verifier/analyzer/tool capabilities, witness
generator and minimizer versions, deviation policy, reducer and handoff codec versions, and the exact included receipt set.
A verifier must report the first mismatching input class rather than returning a generic replay failure.

The offline verifier follows this order: load the trusted contract and phase-006 certificate primitive registry; validate the
certificate schema, seal, and immutable reference bundle; load the certificate-pinned event range; verify event hashes, causal
links, transition authorization, receipt sequence, authority validity, and effect states; recompute the run and transition
fingerprints; resolve applicability and coverage; verify observation, candidate, proof, verification, adjudication, deviation,
convergence, and handoff coverage; replay old-authority witnesses against the new epoch when required; confirm unresolved and
blocked states are represented; then return a typed result with evidence references. Missing inputs, unknown versions,
unresolvable sealed artifacts, mutable references, invalid authority, and contradictory receipt chains fail closed as `blocked`
or `invalid`, never as a passing certificate.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One versioned Deep Alignment run certificate binds the run identity, named authority and epoch, immutable scope, lane and applicability coverage, finalized event range, receipt-set root, replay fingerprint, declared outcome, deviation state, and unresolved or blocked state.
- **SC-002**: Every in-scope authorized shared or Deep Alignment transition has an immutable receipt with causal, authorization, authority, subject, integrity, attempt, effect, and output references.
- **SC-003**: Replay fingerprints include all declared identity and behavior classes, distinguish exact, compatible, migrate, degraded, and blocked reuse, and identify the first mismatch offline.
- **SC-004**: Authority validation, applicability, observation, candidate, proof, verification, adjudication, deviation, conformance, convergence, and handoff remain separate attestable stages with raw observations preserved.
- **SC-005**: An independent verifier can validate a copied ledger and referenced artifacts without model execution, network access, or mutable source access; tampering, invalid authority, unknown versions, and unresolved references fail closed.
- **SC-006**: The certificate and receipt contract consumes phase `003-sealed-artifacts` primitives and phase 012 shared review-loop contracts without duplicating shared mode behavior or preempting `005-resume-adapter`.
- **SC-007**: Direction-sensitive authority replay detects weakened or deleted obligations, while known deviations remain chronological, scoped, visible, and reactivatable.
- **SC-008**: The planning packet is complete enough for implementation and later mode-gate work while containing no authority-cutover, rollback, reducer, projection, shadow, or resume implementation.

**Given** a completed Deep Alignment run, **when** the certificate is verified from its pinned event range, **then** the
verifier can reconstruct the named authority, validity result, lane and applicability coverage, receipt closure, proof and
adjudication state, replay fingerprint, convergence result, handoff revision, and unresolved IDs without rerunning the mode.

**Given** a transition receipt with a changed authority epoch, rule IR, subject snapshot, verifier, tool capability, or policy,
**when** the replay fingerprint is recomputed, **then** the verifier returns a typed compatibility decision rather than silently
reusing the old transition.

**Given** a detector candidate with an applicable rule but weak, absent, or non-independent evidence, **when** the candidate,
proof, and adjudication receipts are verified, **then** the record remains a candidate, unresolved, inconclusive, or downgraded
finding and cannot appear as unexplained non-conformance.

**Given** an authority epoch changes, **when** old-authority witnesses are replayed against the new capsule, **then** deleted,
weakened, narrowed, broadened, and newly introduced obligations are reported with affected rule references and no silent pass.

**Given** an event, receipt, artifact reference, authority claim, or certificate field is tampered with, **when** the offline
verifier checks the chain, **then** it returns invalid or blocked with the first failed invariant and does not emit a valid result.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Certificate overclaim** - a process certificate may be mistaken for semantic conformance truth. Mitigation: attest authority validity, recorded inputs, transitions, evidence, proof, and declared outcomes; require separate verification and adjudication receipts.
- **Authority invalidity leakage** - parseable authority material may be expired, rolled back, mixed across epochs, incompletely tested, or signed by an untrusted source. Mitigation: validate authority before conformance and fail closed on every required invalid result.
- **Receipt incompleteness** - a missing receipt at applicability, evidence, proof, deviation, blocked-stop, or handoff boundaries can make a run look cleaner than its history. Mitigation: derive the matrix from the typed event union and fail on required receipt gaps.
- **Fingerprint drift** - omitting a compiler, rule IR, profile, applicability policy, verifier, witness, deviation, tool, or ordered-lane input can permit unsafe replay reuse. Mitigation: version the input registry, record each class, and report the first mismatch.
- **Mutable-reference leakage** - a digest may point to a mutable path or a source body may be embedded in a receipt. Mitigation: require sealed or content-addressed references, immutable locators, and explicit reference verification.
- **Applicability collapse** - missing target facts or broken discovery can appear as complete conformance. Mitigation: preserve applicable, not-applicable, unresolved, untested, and blocked states separately from observed artifacts.
- **Candidate/verdict conflation** - detector output can be mistaken for verified non-conformance. Mitigation: require independent verifier identity, proof witnesses, evidence receipts, and a typed adjudication event before a blocking disposition.
- **Deviation erasure** - an exception may hide the original failure and prevent reactivation after drift. Mitigation: append chronological deviations bound to authority, verifier, subject, scope, issuer, and expiry.
- **Shared-backbone divergence** - Deep Alignment may invent a local certificate path that Deep Review cannot consume. Mitigation: compare inherited phase-012 fields and event transitions before accepting mode extensions.
- **Scope expansion** - certificate work may absorb reducers, resume, shadow, rollback, or authority concerns. Mitigation: keep the ownership table, adjacency line, and planning-only requirement as blocking boundaries.
- **Dependencies**: phase `003-sealed-artifacts` receipt/certificate primitives; phase 012 shared review-loop and replay contracts; `001-typed-ledger-schema`; the Deep Alignment reducer/projection sibling; later `005-resume-adapter`, shadow-parity, rollback, and mode-gate concerns; the Deep Review shared-backbone contract; and the two effectiveness/fan-out findings registries.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which exact phase-006 primitive represents a run certificate seal, and does the verifier receive a signature, Merkle root, transparency reference, or another typed proof?
- Which phase-012 transition result, authorization, event-tail, effect, lineage, and report fields are inherited directly by Deep Alignment receipts?
- Is the certificate pinned to a finalized ledger frontier, a contiguous event range, or both when late evidence and deviation receipts arrive after terminal assessment?
- Which authority-epoch compatibility outcomes are exact, compatible, migrate, degraded, pin-old-runtime, or blocked for each witness and proof type?
- Which applicability and coverage gaps make a run `incomplete` versus `blocked`, and which must prevent certificate issuance entirely?
- Which verifier refusal codes are shared across Deep Review and Deep Alignment, and which authority or proof failures remain mode-specific extensions?
- Can the offline verifier recompute proof-witness minimization and handoff projections from the trusted bundle, or must those results be pinned as sealed references?

These questions are contract-ratification inputs for implementation. They do not authorize a new shared primitive, a
Deep Alignment-only review-loop fork, a resume policy, a shadow decision, a rollback switch, or an authority decision in this
phase.
<!-- /ANCHOR:questions -->
