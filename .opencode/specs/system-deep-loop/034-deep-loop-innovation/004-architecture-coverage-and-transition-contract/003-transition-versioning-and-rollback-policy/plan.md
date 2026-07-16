---
title: "Implementation Plan: Transition, Versioning & Rollback Policy"
description: "Planning workflow for freezing the event versioning, upcaster, transition authorization, per-mode authority cutover, and rollback-window contract before runtime implementation begins."
trigger_phrases:
  - "transition versioning rollback implementation plan"
  - "authority cutover policy plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned the policy freeze and downstream conformance gates"
    next_safe_action: "Run the policy review matrix and ratify the frozen contract"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Transition, Versioning & Rollback Policy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop policy contract (architecture child 003) |
| **Change class** | Planning and governance only; no runtime implementation |
| **Execution** | Author, challenge, trace, and ratify one frozen contract before program phase 006 |
| **Dependency posture** | No child dependency; normative sources are the parent program spec and phase-tree manifest |

### Overview
This phase converts the parent program's sequencing invariants and manifest migration model into an executable policy contract. The work fixes the canonical envelope and compatibility semantics, defines a complete fail-closed authorization decision, constrains authority to one mode and one writer at a time, and makes rollback duration and evidence non-negotiable. The result is consumed unchanged by the first writer in phase 006, the compatibility bridge in phase 008, the per-mode cutover in phase 014, and the intervening producers and consumers.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The parent program Sequencing Invariants 2, 3, 7, and 8 are cited and translated into testable policy statements.
- [ ] The manifest `migration_model` and phases 003, 005, and 011 outcomes are cited without changing their ownership boundaries.
- [ ] The phase remains planning-only and declares `depends_on: []`.
- [ ] The event, transition, authority, certificate, and rollback vocabulary is unambiguous.

### Definition of Done
- [ ] The envelope requires a stable type discriminator and positive per-type version, with a registered current writer version.
- [ ] The upcaster contract covers deterministic adjacent transforms, supported history, future-version refusal, missing links, and source-byte preservation.
- [ ] The authorization contract defaults to deny and defines complete allow/deny inputs, outputs, atomicity, and rejection receipts.
- [ ] The per-mode authority state machine enforces one writer, shadow-parity readiness, monotonic epochs, and certificate-backed flips.
- [ ] The rollback window remains open for at least 14 days and five successful authoritative executions, whichever completes later.
- [ ] The downstream conformance matrix covers phases 003-012 and assigns no conflicting policy ownership.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The deliverable is one policy contract with four coupled domains and one traceability layer:

1. **Event-envelope versioning and compatibility.** Persisted events carry immutable envelope identity, `event_type`, and per-type `event_version`. Writers emit the latest registered version. Readers reach the current in-memory shape only through a complete pure upcaster chain. Unknown future versions and chain gaps fail closed.
2. **Transition authorization.** The append boundary asks one gateway to decide the exact requested transition against current state, actor capability, invariant evidence, policy version, and authority epoch. Missing or stale inputs deny. An allow decision and the domain append share one atomic boundary; a denial creates only a bounded rejection receipt.
3. **Per-mode authority cutover.** Each mode owns one authority record with a monotonic epoch and the states `legacy_authoritative`, `shadowing`, `cutover_ready`, `new_authoritative_reversible`, `new_authoritative_final`, and `rollback_pending`. Compare-and-swap transitions and gateway epoch checks prevent split brain.
4. **Rollback window.** The flip opens a window lasting until both 14 days and five successful authoritative executions are satisfied. Required assets remain live; defined safety failures trigger admission freeze, spine fencing, state reconciliation, legacy restoration at a new epoch, and a rollback certificate.
5. **Conformance traceability.** A phase matrix maps requirements to the writers, readers, adapters, fixtures, certificates, and retirement evidence that phases 003-012 must deliver.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the target is a planning-only Level 2 phase and that no runtime file is in scope.
- Extract the exact source statements from the parent Sequencing Invariants and manifest migration model and outcomes.
- Freeze a glossary for event type/version, stored/effective version, transition request/decision, rejection receipt, authority epoch, parity divergence, cutover certificate, rollback anchor, rollback certificate, and window closure.

### Phase 2: Implementation
- Write the mandatory envelope field and registration rules, including stable type naming and independent per-type version sequences.
- Write the backward-read and forward-safety matrix, supported-version policy, upcaster purity rules, and mixed-version replay failure semantics.
- Write the deny-by-default gateway request, decision, atomicity, stale-state, idempotency, outage, and rejection-receipt rules.
- Write the per-mode authority state machine, allowed edges, compare-and-swap epoch rules, single-writer invariant, readiness evidence, and cutover certificate schema.
- Write the 14-day/five-run rollback window, extension conditions, trigger classes, retained assets, execution runbook, rollback certificate, and closure evidence.
- Map phases 003-012 to the exact clauses they implement, consume, test, certify, or use as retirement gates.

### Phase 3: Verification
- Challenge the contract with supported-old, unknown-future, missing-upcaster, lossy-upcaster, stale-epoch, gateway-outage, duplicate-request, split-brain, unresolved-parity, low-traffic, and mid-window rollback cases.
- Verify every failure path denies mutation and yields bounded audit evidence without becoming domain history.
- Verify phase 008 cannot cut authority, phase 014 cannot bypass parity or shorten the window, and phase 015 cannot retire a writer inside an open window.
- Run strict spec-kit validation and preserve only the expected missing deterministic-metadata findings.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Envelope table review covers all mandatory fields and rejects missing, unknown, or unregistered type/version pairs |
| REQ-002 | Compatibility matrix distinguishes backward read compatibility from forward-safe refusal and compatible-reader routing |
| REQ-003 | Upcaster fixtures cover each adjacent link, full chains, source preservation, determinism, gaps, and lossy transforms |
| REQ-004 | Failure matrix proves missing input, stale state, unknown rule, and gateway outage all deny without mutation |
| REQ-005 | Decision-schema review verifies every required field and binds the decision to the exact request and policy version |
| REQ-006 | Denial scenario proves no domain sequence or projection changes while a bounded rejection receipt remains auditable |
| REQ-007 | Authority-state model rejects illegal edges, stale epochs, two-writer states, and cross-mode batch flips |
| REQ-008 | Cutover-certificate review requires exact SHA, version range, classified state, mixed replay, live parity, mode gate, and rollback rehearsal |
| REQ-009 | Window-clock cases prove closure waits for both 14 elapsed days and five successful authoritative executions |
| REQ-010 | Rollback tabletop preserves events, fences the spine, restores legacy at a new epoch, reconciles state, and emits a certificate |
| REQ-011 | Traceability review maps phases 003-012 and blocks retirement while any rollback or archival-read gate is incomplete |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This planning child has no predecessor dependency. It consumes two normative sources: `.opencode/specs/system-deep-loop/034-deep-loop-innovation/spec.md` for sequencing invariants and `.opencode/specs/system-deep-loop/034-deep-loop-innovation/manifest/phase-tree.json` for the migration model and phase outcomes. The immediate architecture parent joins this policy with the spine ADR and 178-row recommendation ledger before program phase 006 begins. Downstream phases 003-012 depend on the frozen clauses, but they do not redefine them.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase changes policy documents only. Before a runtime writer lands, rollback is a path-scoped revert of this phase's four authored files followed by re-ratification of the architecture-parent gate. After any downstream writer consumes the contract, the policy is no longer silently reversible: an amendment must identify the changed clause, explain its compatibility effect, enumerate every affected phase and artifact, reopen completed consumer gates where evidence is stale, and rerun mixed-version, authorization, cutover, and rollback reviews. Historical policy text and event data are never rewritten to make a new rule appear retroactive.
<!-- /ANCHOR:rollback -->

