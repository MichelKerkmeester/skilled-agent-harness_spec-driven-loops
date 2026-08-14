---
title: "Checklist: Deep Review - Certificates & Receipts"
description: "Checklist for the planned Deep Review run certificate, transition receipt, replay-fingerprint, and independent offline-verifier contract."
trigger_phrases:
  - "deep review certificates and receipts checklist"
  - "deep-review certificate verification checklist"
  - "offline receipt verifier checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/002-deep-review/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/002-deep-review/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Implemented receipts, certificates, and offline closure verification"
    next_safe_action: "Successor 005 can consume verified checkpoint evidence"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-review-certificates/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-certificates.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Implemented scope excludes authority cutover and resume policy"
---
# Checklist: Deep Review - Certificates & Receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the planned Deep Review certificates and receipts phase. The
verifier pins the candidate SHA, phase `003-sealed-artifacts` and phase 012 contract revisions, typed-ledger revision,
certificate and receipt schema revisions, fingerprint manifest hash, sealed-reference bundle, commands, and exit codes.
It fails on missing transition receipts, a certificate that overclaims semantic truth, a fingerprint omission, an
unauthorized or contradictory chain, mutable evidence replacement, an unadjudicated P0/P1/P2 activation, an offline
verifier dependency on live services, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase `003-sealed-artifacts` publishes the receipt and certificate primitives, seal/reference format, and verification hooks [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-002 [P0] Phase 012 publishes the shared review-loop, transition, lineage, replay, report-reference, and write-set contracts [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-003 [P0] `001-typed-ledger-schema` publishes the complete Deep Review event union and required cross-event references [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-004 [P1] The current Deep Review lifecycle and receipt-bearing boundaries are inventoried from the mode state, evidence, adjudication, convergence, synthesis, report, and continuity records [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-005 [P1] The receipt ownership matrix names one owner for every shared, mode, effect, certificate, report, and later resume transition [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-006 [P2] The candidate report records the phase revisions, certificate/receipt revisions, fingerprint manifest hash, and trusted offline bundle hash
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-007 [P0] The transition receipt reuses shared identity, causation, lineage, authorization, integrity, and replay fields without mode-local duplicates [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-008 [P0] The run certificate binds one run, target/base/head digests, scope and dimension coverage, finalized event range, receipt-set root, replay fingerprint, outcome, and report handoff [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-009 [P0] Every receipt type records transition identity, source and output references, authorization, append position, `prevEventHash`, attempt state, and explicit effect status [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-010 [P1] Certificate claims attest recorded process integrity and declared result completeness without replacing semantic evidence or claiming unsupported finding truth [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-011 [P1] Stable identity and behavior input classes are explicit in the replay-fingerprint manifest; target, scope, dimensions, protocol, executor, tool, analyzer, evaluator, policy, artifact, reducer, and report drift are distinguishable [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-012 [P1] Deep Review and deep-alignment share one review-loop contract; no local duplicate scope, dimension, convergence, lineage, or report transition family is introduced [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-013 [P0] A complete fixture covers `scope -> per-dimension passes -> candidate/evidence -> adjudication -> convergence -> synthesis -> review-report -> completion` with receipt closure [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-014 [P0] Run and scope receipts preserve target, base/head, selected and omitted targets, ordered dimensions, protocol plan, contract revisions, and scope evidence digests [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-015 [P0] Pass and evidence receipts preserve raw analyzer/test/runtime observations, evidence locators, tool fingerprints, independent evidence classes, stability, causal proximity, relevance, and raw scores [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-016 [P0] Candidate and adjudication fixtures preserve orthogonal impact, confidence, reachability, exploitability, evidence strength, evidence scope, counterevidence, and validator identity [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-017 [P0] P0/P1/P2 activation is rejected without a valid typed adjudication receipt; high impact with weak evidence remains a distinct state [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-018 [P0] Finding lineage fixtures preserve introduced, updated, unchanged, fixed, preexisting, absent, and disproved states with append-only supersession [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-019 [P0] Convergence, blocked-stop, pause, recovery, and terminal fixtures preserve raw signals, required coverage, gate results, blockers, stop reason, recovery strategy, and finalized frontier [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-020 [P0] Synthesis and report fixtures preserve included and excluded receipt digests, event range, finding input digest, report revision/digest, unresolved and deferred IDs, and certificate linkage [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-021 [P0] Replay fixtures produce stable fingerprints for unchanged inputs and typed exact, compatible, migrate, pin-old-runtime, or blocked outcomes after target, policy, schema, tool, evaluator, artifact, reducer, or report drift [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-022 [P0] Tampering with an event, receipt, certificate, artifact reference, authorization result, or fingerprint input returns invalid or blocked and identifies the first failed invariant [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-023 [P0] Unknown event or receipt versions, missing sealed references, mutable references, and contradictory receipt chains fail closed without a guessed decoder or passing certificate [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-024 [P0] The offline verifier completes with model, network, external tool, and mutable workspace access unavailable [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-025 [P1] Unknown external effects remain unknown or recovery-required and cannot become successful completion through retry or certificate generation [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-037 [P0] The certificate contract declares every deferred `(artifact kind, plain-digest field) -> expected artifact kind(s)` mapping from the sealed-leaf decision, checks array elements independently, recomputes the ordered dependency closure across certificates, receipts, replay fingerprints, and event-ledger evidence, and distinguishes missing input from typed `unverifiable` bundle absence [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-038 [P0] Real-store anti-vacuous fixtures reject fabricated, wrong-kind, mutated, stale, reordered, visibility-denied, or authority-dead named references and prove `locator.selector` resolves to real target context without becoming severity or authority input [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-026 [P0] The receipt matrix covers every Deep Review transition in the typed event union and every certificate claim resolves to a pinned event, receipt, or sealed-artifact digest [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-027 [P1] The fingerprint manifest and offline-verifier handoff give `005-resume-adapter`, later mode-gate work, and deep-alignment stable references without prescribing their decision algorithms [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-028 [P0] Source, code, analyzer output, runtime witnesses, prompts, tool results, and report references are untrusted inputs; no instruction-bearing body is executed through a receipt or certificate [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-029 [P1] Source, prompt, executor, analyzer, evaluator, artifact, and certificate digests do not expose credentials or persist secret-bearing content [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-030 [P0] Authorization, certificate primitive, contract, and replay registries are resolved from the trusted verifier bundle rather than accepted from an untrusted event payload [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-031 [P1] The verifier does not make network calls, invoke a model or tool, read mutable workspace state, or treat an unresolved external effect as success [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-032 [P1] `spec.md`, `plan.md`, `tasks.md`, and this checklist agree on the certificate/receipt ownership boundary and implemented status [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-033 [P2] The phase adjacency line names predecessor `003-sealed-artifacts` and successor `005-resume-adapter` verbatim
- [x] CHK-034 [P1] The packet documents the distinction between recorded process integrity, semantic finding truth, and later authority decisions [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-035 [P1] The five authored documents remain in this target folder; `description.json` and `graph-metadata.json` are generated by deterministic tooling [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] CHK-036 [P1] Certificate, receipt, fingerprint, verifier, and fixture implementation changes are dependency-closed and path-scoped [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 certificate, receipt, fingerprint, append-integrity, candidate-admission,
adjudication, offline-verifier, and scope check passes; the shared contract revisions and trusted bundle are pinned;
the receipt matrix is complete; unresolved and unknown-effect states remain visible; and the handoff to the resume,
mode-gate, and deep-alignment consumers is explicit without moving their ownership into this phase.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the run certificate boundary, transition receipt coverage, replay-fingerprint
inputs, shared review-loop alignment, fail-closed offline verification, candidate adjudication boundary, and
`git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
