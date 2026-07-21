---
title: "Checklist: Transition, Versioning & Rollback Policy"
description: "Blocking verifier contract for the event-versioning, fail-closed authorization, per-mode cutover, and rollback-window policy."
trigger_phrases:
  - "transition versioning rollback policy checklist"
  - "authority cutover contract verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy"
    last_updated_at: "2026-07-20T19:09:21Z"
    last_updated_by: "codex"
    recent_action: "Verified the ratified policy contract and challenge matrix"
    next_safe_action: "Phase 006 implements the first conforming typed writer"
    blockers: []
    key_files:
      - "transition-versioning-and-rollback-policy.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Transition, Versioning & Rollback Policy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the policy phase. The ratified policy SHA-256 is `329ad7ad1c4f8eaedb531887b00ed29c3413fef00e7c8532941ad07f033b634d`, bound to source candidate `401c7c0ac35bd81c2fdb75a63e30beb8da579593`. Ratification fails on ambiguity, permissive fallback, split-brain authority, shortened rollback coverage or a downstream phase that redefines the contract.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Parent Sequencing Invariants 2, 3, 7, and 8 are cited and translated into explicit policy gates [File: transition-versioning-and-rollback-policy.md:27]
- [x] CHK-002 [P0] Manifest `migration_model` and phases 003, 005, and 011 outcomes are cited with their ownership boundaries intact [File: transition-versioning-and-rollback-policy.md:27]
- [x] CHK-003 [P0] The phase is planning-only, declares no predecessor dependency, and changes no runtime implementation [File: spec.md:45]
- [x] CHK-004 [P1] The frozen glossary distinguishes stored version, effective version, policy version, authority epoch, cutover certificate, rollback anchor, and rollback certificate [File: transition-versioning-and-rollback-policy.md:38]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] The contract uses one canonical term for every version, transition, authority state, certificate, and rollback concept [File: transition-versioning-and-rollback-policy.md:38]
- [x] CHK-006 [P1] Requirement IDs map one-to-one to testable downstream obligations without contradictory or permissive wording [File: spec.md:84]
- [x] CHK-007 [P1] No later phase is allowed to weaken fail-closed behavior, bypass the gateway, batch authority across modes, or shorten the rollback minimum [File: transition-versioning-and-rollback-policy.md:298]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-008 [P0] Envelope cases reject missing discriminators, non-positive versions, unknown types, and unregistered versions before append [File: transition-versioning-and-rollback-policy.md:56]
- [x] CHK-009 [P0] Compatibility cases prove new readers upcast supported old events and old readers refuse or route unsupported new events without guessing [File: transition-versioning-and-rollback-policy.md:90]
- [x] CHK-010 [P0] Upcaster cases prove adjacent pure transforms, deterministic full chains, source-byte preservation, and fail-closed gaps or lossy conversions [File: transition-versioning-and-rollback-policy.md:105]
- [x] CHK-011 [P0] Authorization cases prove missing input, stale state, stale epoch, unknown policy, duplicate mismatch, and gateway outage deny without mutation [File: transition-versioning-and-rollback-policy.md:123]
- [x] CHK-012 [P0] Denial cases prove no domain sequence, projection, success idempotency record, or side effect changes while a bounded rejection receipt remains auditable [File: transition-versioning-and-rollback-policy.md:168]
- [x] CHK-013 [P0] Authority-state cases reject illegal edges, two authoritative writers, stale compare-and-swap epochs, and multi-mode cutover requests [File: transition-versioning-and-rollback-policy.md:176]
- [x] CHK-014 [P0] Cutover readiness requires exact candidate SHA, supported version range, classified in-flight state, mixed replay, live shadow parity, zero unresolved divergence, mode gate, and rollback rehearsal [File: transition-versioning-and-rollback-policy.md:204]
- [x] CHK-015 [P0] Window cases prove rollback remains available until both 14 calendar days and five successful authoritative executions are complete [File: transition-versioning-and-rollback-policy.md:212]
- [x] CHK-016 [P0] Low-traffic, anomaly, replay-mismatch, authorization-bypass, missing-receipt, budget-breach, and state-reconciliation cases extend or trigger rollback [File: transition-versioning-and-rollback-policy.md:219]
- [x] CHK-017 [P0] Rollback tabletop freezes admissions, fences the spine, reconciles in-flight work, restores legacy at a new epoch, preserves events, and emits a certificate [File: transition-versioning-and-rollback-policy.md:238]
- [x] CHK-018 [P0] Phase 008 proves adapters, mixed replay, parity, state classification, and drills without moving authority [File: transition-versioning-and-rollback-policy.md:266]
- [x] CHK-019 [P0] Phase 014 alone performs one-mode-at-a-time authority flips and cannot close a window early [File: transition-versioning-and-rollback-policy.md:272]
- [x] CHK-020 [P0] Phase 015 cannot retire legacy live writers until every mode closes its window with zero-use and archival-read evidence [File: transition-versioning-and-rollback-policy.md:273]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-021 [P0] The conformance matrix covers every program phase from 006 through 015 and assigns implementation, consumption, evidence, cutover, or retirement responsibility [File: transition-versioning-and-rollback-policy.md:258]
- [x] CHK-022 [P1] Any policy amendment procedure identifies affected writers, readers, adapters, fixtures, certificates, rollback anchors, and gates to reopen [File: transition-versioning-and-rollback-policy.md:298]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-023 [P0] Authorization defaults to deny on incomplete input, unknown policy, stale state, stale authority, or gateway failure [File: transition-versioning-and-rollback-policy.md:123]
- [x] CHK-024 [P0] Rejection receipts exclude sensitive payload content and cannot be replayed as authorization or domain events [File: transition-versioning-and-rollback-policy.md:168]
- [x] CHK-025 [P1] Authority epochs and request digests prevent stale-writer acceptance and decision reuse against a different transition [File: transition-versioning-and-rollback-policy.md:133]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-026 [P1] spec.md, plan.md, tasks.md, checklist.md, and the ratified policy agree on the 14-day/five-run window and the phase 006-015 ownership map [File: transition-versioning-and-rollback-policy.md:212]
- [x] CHK-027 [P1] Cross-references resolve to the parent program spec, phase-tree manifest, and leaf documents [File: tasks.md:91]
- [x] CHK-028 [P2] Existing deterministic metadata files were inspected and not hand-authored [File: graph-metadata.json:1]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-029 [P0] Only approved ratification artifacts inside this leaf were authored by this execution; no runtime or sibling path was changed [File: implementation-summary.md:115]
- [x] CHK-030 [P1] Strict validation exits 0 with Errors 0 and Warnings 0 [File: implementation-summary.md:116]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is ratified when every P0 and P1 check has evidence, the policy domains agree across all documents, phases 006-015 have traceable obligations and strict validation exits 0 with Errors 0 and Warnings 0.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the final strict-validation receipt confirms the event-version, upcaster, authorization, cutover, rollback and phase 006-015 conformance clauses are frozen. Program phase 006 may build the first writer only against this contract.
<!-- /ANCHOR:sign-off -->
