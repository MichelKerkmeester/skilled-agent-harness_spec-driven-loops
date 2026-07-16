---
title: "Feature Specification: Deep Review - Certificates & Receipts"
description: "Plan the Deep Review per-run certificate and per-transition receipt contract over the typed event-ledger substrate. The phase defines attestation boundaries, replay-fingerprint inputs, receipt coverage, and independent offline verification for scope, per-dimension review passes, P0/P1/P2 finding adjudication, convergence, synthesis, and review-report publication."
trigger_phrases:
  - "deep review certificates and receipts"
  - "deep-review run certificate"
  - "deep-review transition receipts"
  - "offline review certificate verification"
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
      - "Does the offline verifier consume a finalized frontier or a certificate-pinned event range?"
    answered_questions:
      - "This phase plans attestations and verification, not authority cutover"
      - "Deep Review consumes the shared review-loop contract used by deep-alignment"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Review - Certificates & Receipts
> Phase adjacency under the 002-deep-review parent (grouping order, not a runtime dependency): predecessor `003-sealed-artifacts`; successor `005-resume-adapter`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/004-certificates-and-receipts |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop / deep-review |
| **Origin** | Deep Review mode migration after the shared ledger, sealed-artifact, and review-loop contracts are frozen |
| **Inputs** | `065-deep-loop-innovation/spec.md`, `manifest/phase-tree.json`, the Deep Review typed-ledger sibling, `findings-registry*.json`, phase `003-sealed-artifacts`, and the shared review-loop contract from phase 012 |
| **Output** | A ratifiable per-run certificate, per-transition receipt, replay-fingerprint input, and independent offline-verifier plan; no authority cutover |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The Deep Review loop currently records scope, per-dimension passes, candidate findings, evidence, adjudication, convergence, blocked stops, synthesis, and `review-report.md` through a mixture of JSONL state, iteration artifacts, reducer-owned views, and handoff files. Those records preserve useful history, but the loop has no single per-run attestation proving which immutable inputs, transitions, evidence references, and policy versions produced a report. It also lacks a uniform receipt for each state-changing transition, leaving retries, late evidence, blocked stops, and effect ambiguity difficult to verify without rerunning the live mode.

The migration program requires an append-only typed ledger, a fail-closed transition gateway, sealed reference artifacts, versioned replay fingerprints, and receipts/certificates before authority moves. Phase `003-sealed-artifacts` supplies the receipt and certificate primitives consumed here. Phase 012 freezes the shared review-loop backbone used by Deep Review and deep-alignment; this phase must specialize that contract rather than fork it. The mode findings research reinforces the boundary: review passes emit candidates before independent validation activates P0/P1/P2 findings; impact and evidential confidence remain orthogonal; cross-pass identity uses versioned semantic anchors; and deterministic failures remain first-class receipts (`findings-registry-modes.json:2619-2876`).

This phase plans two related attestations. A **CERTIFICATE** is one per completed or explicitly incomplete Deep Review run and attests the declared run outcome, immutable scope, finalized event range, receipt set, replay fingerprint, and report handoff. A **RECEIPT** is one per authorized transition and attests the transition decision, input and output references, authorization result, effect status, and append-chain position. Neither attestation claims that a semantic finding is true merely because a model or aggregate accepted it; each preserves the evidence and adjudication boundary needed for an independent verifier.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A versioned Deep Review `run_certificate` contract that binds run identity, target and base/head digests, scope and dimension coverage, finalized ledger range, receipt-set root, replay fingerprint, terminal or incomplete outcome, report revision, unresolved findings, and verifier result.
- A versioned `transition_receipt` contract for every authorized Deep Review transition from run initialization through scope resolution, dimension passes, candidate/evidence handling, adjudication, convergence, blocked stops, synthesis, report publication, and terminal completion.
- A receipt coverage matrix that separates event identity, authorization, effect completion, evidence observation, adjudication, and materialized report handoff; retries and late results receive new immutable receipts rather than in-place updates.
- A canonical replay-fingerprint input registry covering the shared envelope, mode contract, target state, ordered review scope, dimension and protocol plan, executor and tool capabilities, analyzer and evaluator versions, event payload digests, reducer or projection contract revisions, convergence policy, report inputs, and certificate policy.
- An independent offline verifier contract that reads only certificate-pinned ledger events and content-addressed references, recomputes hashes and fingerprints, checks receipt closure and transition legality, and returns explicit valid, invalid, incomplete, or blocked outcomes.
- Fixtures for normal review, candidate-to-adjudication promotion, rejected or unresolved findings, late evidence, retry and unknown-effect states, blocked convergence, incomplete max-iteration termination, report publication, and replay under unchanged inputs.

### Out of Scope
- The shared envelope, transition vocabulary, append API, authorization semantics, or generic effect-recovery implementation owned by phases 003 and 009.
- Sealed-artifact storage or signing primitives owned by phase `003-sealed-artifacts`; this phase consumes their typed references and verification hooks.
- Deep Review event vocabulary owned by `001-typed-ledger-schema`, findings reducers and projections owned by the reducer sibling, and the report renderer or dashboard implementation.
- Resume planning, reuse and re-execution decisions owned by `005-resume-adapter`; this phase only specifies receipt references required for a later resume decision.
- Authority cutover, legacy-writer retirement, rollback switching, and the independent mode gate. The certificate is evidence consumed by those later concerns, not their implementation.
- New review behavior beyond the `scope -> per-dimension passes -> P0/P1/P2 findings -> convergence -> review-report` loop and the cited research recommendations.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A run certificate identifies exactly one Deep Review run and declares its attestation boundary | The certificate binds `runId`, session and generation lineage, target/base/head digests, mode and shared contract revisions, certificate version, and certificate policy fingerprint |
| REQ-002 | The run certificate attests the completeness and declared outcome of the recorded run without asserting unsupported semantic truth | It records the finalized event range, receipt-set root, scope and dimension coverage, terminal or incomplete status, report revision, unresolved/deferred/blocked IDs, and verifier outcome; raw findings remain available |
| REQ-003 | Every state-changing Deep Review transition has an immutable receipt | The receipt matrix covers initialization, scope, dimension pass, candidate, evidence, adjudication, lineage, convergence, blocked stop, synthesis, report, and completion transitions; no required transition is receipt-less |
| REQ-004 | Receipts preserve authorization, causality, integrity, and effect ambiguity | Each receipt binds transition ID, source state and event tail, transition token, authorization reference, input/output digests, append position, `prevEventHash`, attempt identity, effect receipt references, and explicit unknown or blocked status where needed |
| REQ-005 | Replay compatibility is decided from a canonical, versioned fingerprint | Fingerprint inputs include logical operation, shared and mode contract revisions, schema and codec hashes, target and scope digests, ordered dimensions and protocol plan, executor/model/tool/analyzer/evaluator fingerprints, event and artifact digests, reducer/projection contract revision, convergence policy, and report inputs |
| REQ-006 | Certificate and receipt fingerprints distinguish immutable history from the current installation | Offline replay uses certificate-pinned versions and input digests; a changed implementation, policy, target, tool surface, or artifact yields exact, compatible, migrate, pin-old-runtime, or blocked rather than silent reuse |
| REQ-007 | Candidate production cannot masquerade as adjudicated severity | Candidate receipts preserve raw observations and independent evidence classes; P0/P1/P2 activation requires a separate typed adjudication receipt with impact, confidence, reachability, exploitability, evidence strength, and evidence scope kept distinct |
| REQ-008 | Late evidence, retries, supersession, and unresolved states remain auditable | A later receipt references the prior receipt and records the new observation or disposition; no certificate or receipt rewrites raw evidence, erases a failed transition, or turns unknown external effects into success |
| REQ-009 | An independent verifier can validate a run without live model, tool, network, or mutable workspace access | The verifier accepts a certificate, ledger range, sealed-artifact references, and trusted contract registry; it recomputes digests, receipt closure, event order, fingerprints, authorization references, and report inputs with fail-closed outcomes |
| REQ-010 | Deep Review and deep-alignment continue to share one review-loop backbone | The contract comparison identifies inherited shared fields and mode-specific extensions; no Deep Review-only copy of shared scope, dimension, convergence, lineage, or report transitions is introduced |
| REQ-011 | The phase remains planning-only and ownership-complete | The packet defines schemas, input matrices, verifier behavior, and fixtures only; no reducer, report generator, resume adapter, cutover, rollback switch, or mode gate is implemented here |
<!-- /ANCHOR:requirements -->

The attestation boundary is deliberately narrow. A certificate attests **recorded process integrity and declared result completeness** under named contracts. It does not certify that every finding is correct, that a P0/P1/P2 decision is justified without its adjudication evidence, or that an external side effect happened exactly once. The receipt chain must retain those distinctions for later policy and mode-gate consumers.

The per-transition receipt plan uses these required evidence groups:

| Receipt group | Transitions covered | Attestation payload |
|---------------|---------------------|---------------------|
| Run and scope | initialization, resume handoff reference, scope resolution, protocol plan, dimension ordering | run lineage, target and scope digests, selected and omitted targets, ordered dimensions, policy and contract fingerprints |
| Pass and evidence | pass start/completion, candidate emission, evidence observation/reconciliation, search or runtime witness | dimension/pass identity, input range, raw observation digest, evidence locator, tool/analyzer fingerprint, independent evidence class, stability/causal/relevance result |
| Adjudication and lineage | claim adjudication, finding state and cross-pass lineage | candidate/finding identity, predecessor receipt, evidence-set digest, orthogonal impact/confidence fields, state transition, counterevidence, validator fingerprint |
| Convergence and recovery | convergence evaluation, blocked stop, pause, recovery, terminal decision | raw signals, gate results, required coverage, blockers, stop reason, recovery strategy, finalized frontier, policy fingerprint, effect status |
| Synthesis and publication | synthesis, report commit, continuity handoff, run completion | event range, included and excluded receipt digests, finding input digest, report revision/digest, unresolved/deferred IDs, continuity reference, certificate linkage |

The fingerprint input registry must distinguish stable identity inputs from versioned behavior inputs. Stable inputs include logical run, transition, target, dimension, candidate, finding, evidence, and report identifiers plus content-addressed digests. Behavior inputs include envelope and payload schema versions, shared review-loop and mode-contract revisions, authorization and certificate policy revisions, ordered scope and dimensions, protocol plan, executor/model/tool/analyzer/evaluator fingerprints, reducer and report codec versions, convergence policy, and the exact included receipt set. A verifier must report the first mismatching input class rather than returning a generic replay failure.

The offline verifier follows this order: load the trusted contract and certificate primitive registry; validate certificate schema and signature/seal reference; load the certificate-pinned event range; verify event hashes, causal links, transition authorization references, receipt sequence, and effect states; recompute the run and transition fingerprints; verify scope, pass, evidence, adjudication, convergence, synthesis, and report coverage; confirm unresolved and blocked states are represented; then return a typed result with evidence references. Missing inputs, unknown versions, unresolvable sealed artifacts, mutable references, and contradictory receipt chains fail closed as `blocked` or `invalid`, never as a passing certificate.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One versioned Deep Review run certificate binds the run identity, immutable scope, finalized event range, receipt-set root, replay fingerprint, declared outcome, report handoff, and unresolved or blocked state.
- **SC-002**: Every in-scope authorized transition has an immutable receipt with causal, authorization, integrity, attempt, effect, and output references.
- **SC-003**: Replay fingerprints include all declared input and behavior classes, distinguish exact from compatible or blocked reuse, and identify the first mismatch offline.
- **SC-004**: Candidate, evidence, adjudication, P0/P1/P2 severity, convergence, and report publication remain separate attestable stages with raw observations preserved.
- **SC-005**: An independent verifier can validate a copied ledger and referenced artifacts without model execution, network access, or mutable source access; tampering and unknown versions fail closed.
- **SC-006**: The certificate and receipt contract consumes phase `003-sealed-artifacts` primitives and phase 012 shared review-loop contracts without duplicating shared mode behavior or preempting `005-resume-adapter`.
- **SC-007**: The planning packet is complete enough for implementation and later mode-gate work while containing no authority-cutover, rollback, reducer, report-rendering, or resume implementation.

**Given** a completed Deep Review run, **when** the certificate is verified from its pinned event range, **then** the verifier can reconstruct the declared scope, receipt closure, replay fingerprint, convergence result, report revision, and unresolved IDs without rerunning the mode.

**Given** a transition receipt with a changed target, tool capability, evaluator, policy, or schema input, **when** the replay fingerprint is recomputed, **then** the verifier returns a typed compatibility decision rather than silently reusing the old transition.

**Given** a candidate with high impact but weak or non-independent evidence, **when** the candidate and adjudication receipts are verified, **then** the record remains a candidate or downgraded finding and cannot appear as an unexplained P0/P1/P2 activation.

**Given** an effect started without a durable provider result, **when** the receipt chain is verified, **then** the state is represented as unknown or recovery-required and the certificate cannot claim successful completion for that effect.

**Given** an event, receipt, artifact reference, or certificate field is tampered with, **when** the offline verifier checks the chain, **then** it returns invalid or blocked with the first failed invariant and does not emit a valid certificate result.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Certificate overclaim** - a process certificate may be mistaken for semantic truth. Mitigation: attest recorded inputs, transitions, evidence, and declared outcomes; require separate adjudication receipts and preserve raw observations.
- **Receipt incompleteness** - a missing receipt at a retry, late-result, blocked-stop, or report boundary can make a run look cleaner than its history. Mitigation: derive the transition matrix from the typed event union and fail the verifier on required receipt gaps.
- **Fingerprint drift** - omitting an evaluator, tool, policy, codec, or ordered-scope input can permit unsafe replay reuse. Mitigation: version the input registry, record each input class, and report the first mismatch.
- **Mutable-reference leakage** - a digest may point to a mutable path or a source body may be embedded in a receipt. Mitigation: require content-addressed or sealed references, immutable locators, and explicit reference verification.
- **Unknown external effect** - a lost response can be interpreted as failure or success. Mitigation: retain `unknown` as a first-class receipt state and delegate reuse, reconcile, compensate, or block decisions to the later replay adapter.
- **Shared-backbone divergence** - Deep Review may invent a local certificate path that deep-alignment cannot consume. Mitigation: compare inherited phase-012 fields and event transitions before accepting mode extensions.
- **Verifier trust confusion** - the verifier may trust certificate-supplied policy or authorization claims. Mitigation: resolve contract, primitive, and authorization registries from a trusted offline bundle and treat payload claims as untrusted evidence.
- **Scope expansion** - certificate work may absorb reducers, resume, rollback, or authority concerns. Mitigation: keep the ownership table and adjacency line as blocking review boundaries.
- **Dependencies**: phase `003-sealed-artifacts` receipt/certificate primitives; phase 012 shared review-loop and replay contracts; `001-typed-ledger-schema`; later reducer/projection, `005-resume-adapter`, shadow-parity, rollback, authority-cutover, and mode-gate concerns; the Deep Review mode state references; and the mode/shared research registries.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which exact phase-006 primitive represents a run certificate seal, and does the verifier receive a signature, Merkle root, transparency reference, or another typed proof?
- Which phase-012 transition result, authorization, event-tail, and effect fields are inherited directly by Deep Review receipts?
- Is the certificate pinned to a finalized ledger frontier, a contiguous event range, or both when late receipts exist after report publication?
- Which receipt states and compatibility outcomes are canonical for a report that is complete in scope but contains unresolved or blocked findings?
- Which artifact-reference checks can run entirely offline, and which missing artifact cases must be `blocked` rather than `invalid`?
- Does the verifier recompute reducer and report input digests only, or does phase 012 expose a deterministic projection contract that can also be replayed offline?

These questions are contract-ratification inputs for implementation. They do not authorize a new shared primitive, a Deep Review-only review-loop fork, a resume policy, or an authority decision in this phase.
<!-- /ANCHOR:questions -->
