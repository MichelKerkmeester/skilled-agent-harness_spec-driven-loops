---
title: "Tasks: Cutover Certificate & Rollback Window"
description: "Tasks for defining, verifying, appending, monitoring, and closing the per-mode cutover certificate and its reversible rollback window."
trigger_phrases:
  - "cutover certificate rollback tasks"
  - "rollback window enforcement tasks"
  - "deep-loop authority evidence tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/003-cutover-certificate-and-rollback-window"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/003-cutover-certificate-and-rollback-window"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Created certificate and rollback-window task sequence"
    next_safe_action: "Execute source trace and evidence-verification tasks in order"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Cutover Certificate & Rollback Window

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Extract the phase-004 certificate preconditions and 14-day/five-run rollback-window rule
- [ ] T002 Extract phase-007 receipt, certification, and effect-recovery fields that become certificate evidence
- [ ] T003 Extract sibling `002-per-mode-authority-flip` CAS inputs and preserve its flip ownership boundary
- [ ] T004 Confirm the manifest outcome, `depends_on: []`, Level 2 structure, and phase-015 retirement handoff
- [ ] T005 [P] Freeze certificate, window, signal, trigger, rollback, and closure vocabulary
- [ ] T006 [P] Identify the per-mode event identities, evidence digests, policy digest, authority epochs, and retained rollback assets
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Define the canonical `cutover_certificate` event and required identity, mode, SHA, epoch, policy, issuer, and timing fields
- [ ] T008 Define evidence references for shadow parity, rollback drill, migration receipts, in-flight classification, mixed replay, and mode gate
- [ ] T009 Define certificate canonicalization, certification scheme, verifier inputs, digest binding, and fail-closed rejection behavior
- [ ] T010 Define certificate append authorization and the verified handoff consumed by sibling `002-per-mode-authority-flip`
- [ ] T011 Define window initialization at successful CAS, rollback anchor retention, monitor cursor, and authoritative-run accounting
- [ ] T012 Define health, parity-drift, replay, authorization, receipt, budget, and state-reconciliation signal contracts
- [ ] T013 Define threshold, extension, operator-stop, and revert semantics for every monitored signal family
- [ ] T014 Define admission freeze, spine fencing, in-flight reconciliation, new-epoch legacy restoration, and event-preserving rollback steps
- [ ] T015 Define rollback certificate contents and phase-007 receipt composition for rollback and reconciliation outcomes
- [ ] T016 Define clean closure evidence, retained assets, and the phase-015 handoff without granting retirement authority
- [ ] T017 [P] Map each certificate and window requirement to one verifier fixture and one durable evidence output
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Verify complete certificate evidence passes for one mode and one exact candidate SHA
- [ ] T019 Verify missing, stale, tampered, contradictory, cross-mode, wrong-policy, wrong-epoch, and duplicate-facts certificates fail closed
- [ ] T020 Verify certificate issuance is an authorized canonical ledger event and not an ambient control-plane flag
- [ ] T021 Verify window closure waits for both 14 calendar days and five successful authoritative executions
- [ ] T022 Verify low traffic, unresolved parity, health regression, replay mismatch, authorization failure, receipt gap, budget breach, and reconciliation failure extend or trigger rollback
- [ ] T023 Tabletop rollback and verify admission freeze, spine fence, reconciliation, new epoch, event preservation, and rollback certificate emission
- [ ] T024 Verify stale monitor decisions, duplicate conflicting certificates, multi-mode flips, and stale writers cannot advance authority
- [ ] T025 Verify phase 008, sibling 002, this child, phase 007, and phase 015 retain their declared ownership boundaries
- [ ] T026 Run strict spec-kit validation and confirm only expected `description.json` and `graph-metadata.json` omissions remain
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All certificate, monitoring, rollback, and closure tasks complete
- [ ] All requirements in spec.md are ratified with traceable evidence fixtures or review records
- [ ] The phase-014 handoff records each mode's certificate and window outcome before phase 015 retirement work begins
- [ ] Strict validation has no error except expected missing `description.json` and `graph-metadata.json`
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Program source**: See `../../../spec.md` and `../../../manifest/phase-tree.json`
- **Rollback policy**: See `../../../../004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md`
- **Receipt contract**: See `../../../../007-shared-evidence-and-control-services/001-receipts-and-effect-recovery/spec.md`
- **Flip sibling**: See `../002-per-mode-authority-flip/spec.md`
<!-- /ANCHOR:cross-refs -->
