---
title: "Implementation Plan: Cutover Certificate & Rollback Window"
description: "Planning workflow for assembling and verifying the evidence certificate that authorizes each per-mode authority flip, then enforcing the monitored reversible window through clean closure or fail-safe rollback."
trigger_phrases:
  - "cutover certificate implementation plan"
  - "rollback window monitoring plan"
  - "deep-loop certificate verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/003-cutover-certificate-and-rollback-window"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/003-cutover-certificate-and-rollback-window"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Planned certificate assembly and reversible-window enforcement"
    next_safe_action: "Review certificate fields, signal thresholds, and rollback closure gates"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Cutover Certificate & Rollback Window

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop staged state migration and authority cutover, child 003 |
| **Change class** | Planning and control-contract design; certificate and window enforcement follow the phase-014 implementation boundary |
| **Execution** | Assemble, verify, append, monitor, revert, and close one mode's cutover evidence without redefining the authority flip |
| **Dependency posture** | Independent sibling planning contract (`depends_on: []`); consumes phase-004 policy, phase-007 receipts, phase-008 safety evidence, and sibling 002 flip control |

### Overview
This phase turns the phase-004 cutover and rollback policy into one executable evidence contract. A certificate binds the exact mode candidate, policy approval, shadow-parity proof, rollback-drill result, migration receipts, classified state, and mode gate; the certificate is appended as a ledger event before sibling `002-per-mode-authority-flip` can change authority. A window controller then monitors the new authoritative path until both the 14-day and five-successful-run conditions are satisfied, extending or reverting on safety signals rather than closing on time alone.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The phase-014 parent handoff, phase-tree outcome, and `depends_on: []` sibling posture are cited.
- [ ] The phase-004 14-day/five-authoritative-run rule and authority-state vocabulary are copied without weakening them.
- [ ] The phase-007 receipt and certification fields are available as durable evidence inputs.
- [ ] Sibling `002-per-mode-authority-flip` exposes a single-mode CAS boundary that accepts a verified certificate reference.
- [ ] Phase-008 parity, rollback-drill, and in-flight-state evidence has stable identity and digest semantics.

### Definition of Done
- [ ] The certificate schema binds every required proof, receipt, policy, mode, SHA, epoch, signer, and transition fact.
- [ ] Verification rejects incomplete, stale, contradictory, tampered, or cross-mode evidence before the flip.
- [ ] Certificate issuance uses the canonical envelope and transition-authorization gateway and is recorded as a ledger event.
- [ ] The window records its rollback anchor, retained assets, start time, authoritative-run count, signal state, and closure evidence.
- [ ] Health and parity-drift monitoring covers the defined revert classes and has deterministic escalation behavior.
- [ ] Clean closure and mid-window rollback both preserve events and produce durable evidence for phase 015.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The deliverable is one certificate-and-window control path with five coupled components:

1. **Evidence collector.** Resolve the exact mode gate, candidate SHA, phase-008 shadow-parity proof, rollback-drill result, classified in-flight corpus, mixed-version replay result, phase-007 migration/boundary receipts, and approving policy into immutable references and digests.
2. **Certificate verifier.** Validate evidence completeness, content identity, policy version, registered certification scheme, signer/provider, current authority epoch, single-writer state, and absence of unresolved blockers. Verification is deny-by-default and produces a bounded rejection record when it fails.
3. **Certificate ledger event.** Build the canonical `cutover_certificate` event from the verified facts, authorize it at the transition gateway, and append it before the sibling flip CAS. The event includes the rollback anchor and the exact evidence set used for the decision.
4. **Rollback-window controller.** Open a per-mode window at the successful CAS, retain the legacy adapter/state and rollback anchor, count successful authoritative executions, and evaluate the later-of 14 calendar days and five successful executions rule.
5. **Signal and revert controller.** Consume health, parity drift, replay, authorization, receipt, budget, and state-reconciliation signals. A ratified trigger freezes admissions, fences the spine, invokes the declared reconciliation path, restores legacy at a new epoch, and appends a rollback certificate; a clean window appends closure evidence for phase 015.

The certificate and window records are mode-scoped, epoch-bound, and append-only. They do not make sibling 002's flip operation implicit, and they do not permit phase 015 to infer retirement eligibility from a closed clock without zero-use and archival-read evidence.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Extract phase-004 certificate and rollback clauses, phase-007 receipt fields, sibling 002 CAS inputs, and the phase-tree outcome.
- [ ] Freeze the certificate glossary: candidate SHA, evidence digest, policy digest, authority epoch, rollback anchor, authoritative execution, parity drift, revert trigger, closure evidence, and rollback certificate.
- [ ] Define the certificate and window event identities, per-mode storage boundaries, certification provider, and signal ownership without adding a second policy owner.

### Phase 2: Implementation
- [ ] Define evidence collection and content-addressed references for the mode gate, shadow parity, rollback drill, migration receipts, state classification, replay result, and approving policy.
- [ ] Define certificate canonicalization, signature/certification metadata, verifier inputs, rejection behavior, and exact binding to candidate SHA and authority epoch.
- [ ] Define authorized append of the certificate ledger event and the handoff contract consumed by sibling 002.
- [ ] Define window initialization at successful CAS, retained rollback assets, authoritative-run accounting, health/parity signal ingestion, and durable monitor checkpoints.
- [ ] Define severity, extension, and revert rules for health regressions, parity drift, replay mismatch, authorization or receipt failure, budget breach, and state-reconciliation failure.
- [ ] Define non-destructive rollback sequencing and rollback-certificate contents, including new-epoch legacy restoration and event preservation.
- [ ] Define clean closure evidence and phase-015 handoff conditions without granting retirement authority to this child.

### Phase 3: Verification
- [ ] Challenge certificate verification with missing, stale, tampered, cross-mode, wrong-SHA, wrong-policy, wrong-epoch, and duplicate-facts cases.
- [ ] Challenge monitoring with low traffic, delayed receipts, parity drift, health regression, replay mismatch, authorization bypass, budget breach, and reconciliation failure cases.
- [ ] Verify the 14-day/five-run later-of rule, extension semantics, retained rollback assets, and no early closure.
- [ ] Tabletop a mid-window rollback and verify admission freeze, spine fencing, reconciliation, new-epoch legacy restoration, event preservation, and rollback certificate emission.
- [ ] Verify phase ownership: sibling 002 flips, this child certifies and monitors, phase 008 supplies readiness evidence, phase 015 retires only after its gates.
- [ ] Run strict spec-kit validation and preserve only the expected missing deterministic metadata findings.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 / REQ-004 | Certificate-schema review and ledger append fixture prove one mode, one transition, canonical envelope, authorized append, and immutable event identity |
| REQ-002 / REQ-003 | Evidence matrix mutates each digest, SHA, epoch, policy, signer, and referenced result; every mismatch rejects before CAS |
| REQ-005 / REQ-006 | Clock/run-count matrix covers zero, one, four, and five successful authoritative executions across 0, 14, and more than 14 calendar days; closure waits for both minima |
| REQ-007 | Signal fixture matrix covers health, parity, replay, authorization, receipt, budget, and reconciliation axes independently and in combination |
| REQ-008 | Rollback tabletop and crash cut points prove freeze, fence, reconciliation, new epoch, event preservation, and rollback certificate evidence |
| REQ-009 | Clean-window fixture verifies durable closure evidence and phase-015 handoff without allowing retirement from this child |
| REQ-010 | Concurrency fixture rejects multi-mode requests, stale monitor decisions, duplicate conflicting certificates, and stale writer epochs |
| REQ-011 | Cross-reference review maps phase 008, sibling 002, this child, phase 007, and phase 015 ownership with no duplicated authority |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This planning child has no predecessor dependency in the approved sibling contract. It consumes `.opencode/specs/system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md` for the certificate precondition and later-of rollback-window rule, `.opencode/specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/001-receipts-and-effect-recovery/spec.md` for durable receipt and certification semantics, and `.opencode/specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json` for the phase outcome. It coordinates with the parent `.opencode/specs/system-deep-loop/036-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/spec.md` and sibling `002-per-mode-authority-flip`. Phase 008 supplies shadow-parity, rollback-drill, and state-classification evidence; phase 015 consumes clean closure plus its own zero-use and archival-read evidence.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Before a runtime certificate or window record exists, rollback is a path-scoped revert of this phase's four authored files followed by revalidation of the phase-014 parent and sibling 002 handoff. Once a certificate or window is live, rollback must use the policy-defined runtime path rather than erase control evidence: freeze admissions, fence the spine writer, reconcile unresolved state with phase-007 effect/receipt semantics, restore legacy authority at a new epoch, preserve certificate and event history, and append a rollback certificate. A policy change after downstream consumption requires an amendment that identifies affected certificates, adapters, monitors, fixtures, rollback anchors, and retirement gates, then reruns the cutover and rollback verification.
<!-- /ANCHOR:rollback -->
