---
title: "Checklist: Deep Alignment - Certificates & Receipts"
description: "Blocking verification checklist for the planned Deep Alignment run certificate, transition receipt, authority-epoch replay-fingerprint, and independent offline-verifier contract."
trigger_phrases:
  - "deep alignment certificates and receipts checklist"
  - "deep-alignment authority certificate verification"
  - "offline receipt verifier checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T21:45:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined blocking checks for alignment certificate integrity"
    next_safe_action: "Run the authority and transition matrix against pinned fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions:
      - "Which authority epoch changes require witness replay?"
      - "Which receipt states are canonical for unresolved alignment findings?"
    answered_questions:
      - "Planned scope excludes authority cutover and resume policy"
---
# Checklist: Deep Alignment - Certificates & Receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the planned Deep Alignment certificates and receipts phase. The
verifier pins the candidate SHA, phase `003-sealed-artifacts` and phase 012 contract revisions, typed-ledger revision,
certificate and receipt schema revisions, authority and epoch bundle digests, fingerprint manifest hash, sealed-reference
bundle, commands, and exit codes. It fails on invalid authority, missing transition receipts, a certificate that overclaims
semantic truth, a fingerprint omission, an unauthorized or contradictory chain, mutable evidence replacement, an
unadjudicated conformance activation, an offline verifier dependency on live services, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase `003-sealed-artifacts` publishes the receipt and certificate primitives, seal/reference format, and verification hooks
- [ ] CHK-002 [P0] Phase 012 publishes the shared review-loop, transition, lineage, replay, handoff, and write-set contracts
- [ ] CHK-003 [P0] `001-typed-ledger-schema` publishes the complete Deep Alignment event union and required authority, applicability, proof, and cross-event references
- [ ] CHK-004 [P1] The current Deep Alignment lifecycle and receipt-bearing boundaries are inventoried from authority, lane, subject, observation, evidence, proof, adjudication, deviation, convergence, continuity, and terminal records
- [ ] CHK-005 [P1] The receipt ownership matrix names one owner for every shared, mode, authority, effect, certificate, handoff, and later resume transition
- [ ] CHK-006 [P2] The candidate report records the phase revisions, certificate/receipt revisions, authority bundle digest, fingerprint manifest hash, and trusted offline bundle hash
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-007 [P0] The transition receipt reuses shared identity, causation, lineage, authorization, integrity, and replay fields without mode-local duplicates
- [ ] CHK-008 [P0] The run certificate binds one run, named authority and epoch, target and subject digests, lane and applicability coverage, finalized event range, receipt-set root, replay fingerprint, outcome, deviation state, and handoff
- [ ] CHK-009 [P0] Every receipt type records transition identity, source and output references, authorization, authority and subject references, append position, `prevEventHash`, attempt state, and explicit effect status
- [ ] CHK-010 [P1] Certificate claims attest recorded conformance-process integrity and declared result completeness without replacing semantic evidence or claiming unsupported finding truth
- [ ] CHK-011 [P1] Stable identity and behavior input classes are explicit in the replay-fingerprint manifest; authority, epoch, rule IR, profile, applicability, lane, subject, verifier, witness, deviation, artifact, reducer, and handoff drift are distinguishable
- [ ] CHK-012 [P1] Deep Alignment and Deep Review share one phase-012 review-loop contract; no local duplicate run, scope, pass, convergence, lineage, continuity, or terminal transition family is introduced
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-013 [P0] A complete fixture covers `authority -> validity -> scope/lane -> applicability -> observation/evidence -> candidate -> verification/proof -> adjudication -> convergence -> handoff -> completion` with receipt closure
- [ ] CHK-014 [P0] Authority and scope receipts preserve named authority, epoch, compiler/rule-IR/profile digests, target and subject scope, selected and omitted rules, ordered lanes, and contract fingerprints
- [ ] CHK-015 [P0] Applicability and observation receipts preserve target facts, `applicable`/`not_applicable`/`unresolved`/`blocked` outcome, raw analyzer observations, evidence locators, tool fingerprints, freshness, causal relevance, and raw scores
- [ ] CHK-016 [P0] Candidate, proof, verification, and adjudication fixtures preserve authority epoch, subject digest, applicability decision, evidence classes, witness references, independent verifier identity, orthogonal impact/confidence, counterevidence, and discrete conformance disposition
- [ ] CHK-017 [P0] A blocking conformance disposition is rejected without valid applicability, evidence, proof, verification, and adjudication receipts; high impact with weak evidence remains a distinct state
- [ ] CHK-018 [P0] Authority-epoch fixtures preserve old-authority witnesses and report deleted, weakened, narrowed, broadened, and newly introduced obligations without rewriting historical observations
- [ ] CHK-019 [P0] Deviation and invalidation fixtures preserve the original failure, issuer, authority epoch, subject, scope, verifier, rationale, expiry, and reactivation conditions
- [ ] CHK-020 [P0] Convergence, blocked-stop, pause, recovery, and terminal fixtures preserve raw signals, required coverage, unresolved rules, gate results, blockers, stop reason, recovery strategy, and finalized frontier
- [ ] CHK-021 [P0] Handoff and certificate fixtures preserve included and excluded receipt digests, event range, lane and finding coverage, handoff revision/digest, unresolved and blocked IDs, and certificate linkage
- [ ] CHK-022 [P0] Replay fixtures produce stable fingerprints for unchanged inputs and typed exact, compatible, migrate, degraded, pin-old-runtime, or blocked outcomes after authority, epoch, subject, profile, verifier, witness, deviation, schema, artifact, reducer, or handoff drift
- [ ] CHK-023 [P0] Tampering with an event, receipt, certificate, authority reference, subject reference, proof witness, deviation, authorization result, or fingerprint input returns invalid or blocked and identifies the first failed invariant
- [ ] CHK-024 [P0] Unknown event or receipt versions, invalid or expired authority, missing sealed references, mutable references, unresolved applicability, and contradictory receipt chains fail closed without a guessed decoder or passing certificate
- [ ] CHK-025 [P0] The offline verifier completes with model, network, external tool, and mutable workspace access unavailable
- [ ] CHK-026 [P1] Unknown external effects and incomplete proof remain unknown or recovery-required and cannot become successful conformance through retry or certificate generation
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-027 [P0] The receipt matrix covers every Deep Alignment transition in the typed event union and every certificate claim resolves to a pinned event, receipt, or sealed-artifact digest
- [ ] CHK-028 [P1] The fingerprint manifest and offline-verifier handoff give `005-resume-adapter`, later mode-gate work, and Deep Review stable references without prescribing their decision algorithms
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-029 [P0] Authority prose, source, subject bodies, analyzer output, runtime witnesses, prompts, tool results, and handoff references are untrusted inputs; no instruction-bearing body is executed through a receipt or certificate
- [ ] CHK-030 [P0] Source, authority, compiler, rule IR, profile, subject, verifier, witness, deviation, artifact, and certificate digests do not expose credentials or persist secret-bearing content
- [ ] CHK-031 [P0] Authorization, certificate primitive, authority, contract, and replay registries are resolved from the trusted verifier bundle rather than accepted from an untrusted event payload
- [ ] CHK-032 [P1] The verifier does not make network calls, invoke a model or tool, read mutable workspace state, or treat an unresolved external effect or authority input as success
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-033 [P1] `spec.md`, `plan.md`, `tasks.md`, and this checklist agree on the certificate/receipt ownership boundary and planned status
- [ ] CHK-034 [P2] The phase adjacency line names predecessor `003-sealed-artifacts` and successor `005-resume-adapter` verbatim
- [ ] CHK-035 [P1] The packet documents the distinction between authority validity, recorded process integrity, semantic conformance truth, and later authority decisions
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-036 [P1] Only the four authored documents are created in this target folder; `description.json` and `graph-metadata.json` are generated by deterministic tooling
- [ ] CHK-037 [P1] Certificate, receipt, fingerprint, verifier, authority-replay, and fixture implementation changes land in dependency-closed, path-scoped commits after this planning phase
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the candidate report pins the authority, shared contract, and fixture
digests, the receipt matrix is complete, valid certificates and receipt chains replay offline, authority-epoch drift and
invalidity fail closed, applicability and proof states remain visible, deviations retain original failures, and the handoff to
the resume, mode-gate, and Deep Review consumers is explicit without moving their ownership into this phase.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 authority-validity, run-certificate, transition-receipt, replay-fingerprint,
shared review-loop, proof-carrying finding, deviation, fail-closed offline-verification, and scope contracts, and
`git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
