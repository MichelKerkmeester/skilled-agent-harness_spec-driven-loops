---
title: "Checklist: Transition, Versioning & Rollback Policy"
description: "Blocking verifier contract for the event-versioning, fail-closed authorization, per-mode cutover, and rollback-window policy."
trigger_phrases:
  - "transition versioning rollback policy checklist"
  - "authority cutover contract verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined the blocking policy verification contract"
    next_safe_action: "Collect ratification evidence for every P0 policy check"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Transition, Versioning & Rollback Policy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the policy phase. Items remain unchecked while status is Planned. Ratification evidence must bind the reviewed document hashes or candidate commit, quote the tested clause or requirement ID, record the reviewer or tool result, and fail on ambiguity, permissive fallback, split-brain authority, shortened rollback coverage, or a downstream phase that redefines the contract.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Parent Sequencing Invariants 2, 3, 7, and 8 are cited and translated into explicit policy gates
- [ ] CHK-002 [P0] Manifest `migration_model` and phases 003, 005, and 011 outcomes are cited with their ownership boundaries intact
- [ ] CHK-003 [P0] The phase is planning-only, declares no predecessor dependency, and changes no runtime implementation
- [ ] CHK-004 [P1] The frozen glossary distinguishes stored version, effective version, policy version, authority epoch, cutover certificate, rollback anchor, and rollback certificate
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] The contract uses one canonical term for every version, transition, authority state, certificate, and rollback concept
- [ ] CHK-006 [P1] Requirement IDs map one-to-one to testable downstream obligations without contradictory or permissive wording
- [ ] CHK-007 [P1] No later phase is allowed to weaken fail-closed behavior, bypass the gateway, batch authority across modes, or shorten the rollback minimum
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-008 [P0] Envelope cases reject missing discriminators, non-positive versions, unknown types, and unregistered versions before append
- [ ] CHK-009 [P0] Compatibility cases prove new readers upcast supported old events and old readers refuse or route unsupported new events without guessing
- [ ] CHK-010 [P0] Upcaster cases prove adjacent pure transforms, deterministic full chains, source-byte preservation, and fail-closed gaps or lossy conversions
- [ ] CHK-011 [P0] Authorization cases prove missing input, stale state, stale epoch, unknown policy, duplicate mismatch, and gateway outage deny without mutation
- [ ] CHK-012 [P0] Denial cases prove no domain sequence, projection, success idempotency record, or side effect changes while a bounded rejection receipt remains auditable
- [ ] CHK-013 [P0] Authority-state cases reject illegal edges, two authoritative writers, stale compare-and-swap epochs, and multi-mode cutover requests
- [ ] CHK-014 [P0] Cutover readiness requires exact candidate SHA, supported version range, classified in-flight state, mixed replay, live shadow parity, zero unresolved divergence, mode gate, and rollback rehearsal
- [ ] CHK-015 [P0] Window cases prove rollback remains available until both 14 calendar days and five successful authoritative executions are complete
- [ ] CHK-016 [P0] Low-traffic, anomaly, replay-mismatch, authorization-bypass, missing-receipt, budget-breach, and state-reconciliation cases extend or trigger rollback
- [ ] CHK-017 [P0] Rollback tabletop freezes admissions, fences the spine, reconciles in-flight work, restores legacy at a new epoch, preserves events, and emits a certificate
- [ ] CHK-018 [P0] Phase 005 proves adapters, mixed replay, parity, state classification, and drills without moving authority
- [ ] CHK-019 [P0] Phase 011 alone performs one-mode-at-a-time authority flips and cannot close a window early
- [ ] CHK-020 [P0] Phase 012 cannot retire legacy live writers until every mode closes its window with zero-use and archival-read evidence
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-021 [P0] The conformance matrix covers every program phase from 003 through 012 and assigns implementation, consumption, evidence, or retirement responsibility
- [ ] CHK-022 [P1] Any policy amendment procedure identifies affected writers, readers, adapters, fixtures, certificates, rollback anchors, and gates to reopen
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-023 [P0] Authorization defaults to deny on incomplete input, unknown policy, stale state, stale authority, or gateway failure
- [ ] CHK-024 [P0] Rejection receipts exclude sensitive payload content and cannot be replayed as authorization or domain events
- [ ] CHK-025 [P1] Authority epochs and request digests prevent stale-writer acceptance and decision reuse against a different transition
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-026 [P1] spec.md, plan.md, tasks.md, and checklist.md agree on the 14-day/five-run window and the phase 003-012 ownership map
- [ ] CHK-027 [P1] Cross-references resolve to the parent program spec, phase-tree manifest, and sibling packet documents
- [ ] CHK-028 [P2] Deterministic metadata generation is deferred exactly as instructed and no metadata file is hand-authored
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-029 [P0] Only the four approved Level 2 Markdown files exist as authored changes in this target folder
- [ ] CHK-030 [P1] Strict validation reports no issue other than expected missing `description.json` and `graph-metadata.json`
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase may be ratified only when every P0 check has evidence, every P1 check is complete or explicitly approved for deferral, the four policy domains agree across all documents, phases 003-012 have traceable obligations, and strict validation has no finding beyond the two intentionally deferred deterministic metadata files.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the architecture-parent verifier confirms the event-version, upcaster, authorization, cutover, and rollback clauses are frozen and records that program phase 003 may build the first writer only against this contract.
<!-- /ANCHOR:sign-off -->
