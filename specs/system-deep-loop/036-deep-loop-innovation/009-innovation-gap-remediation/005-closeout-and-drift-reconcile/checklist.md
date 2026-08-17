---
title: "Checklist: Closeout and Drift Reconcile"
description: "Blocking verification checklist for three-field status reconciliation, 178-row measured composition, stale claim and path closure, final matrix rerun, and evidence-aligned epic completion."
trigger_phrases:
  - "closeout drift checklist"
  - "epic evidence reconciliation"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/005-closeout-and-drift-reconcile"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/005-closeout-and-drift-reconcile"
    last_updated_at: "2026-08-17T04:33:13Z"
    last_updated_by: "opencode"
    recent_action: "Defined the planned closeout and drift-reconciliation verification contract"
    next_safe_action: "Wait for fleet cutover, then execute the measured reconciliation"
    blockers:
      - "Predecessor 004-fleet-authority-cutover must complete"
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Closeout and Drift Reconcile

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for final closeout and drift reconciliation. Every item remains
pending until predecessor evidence is complete, every mode parent reports independent library, shadow, and authority
status, all 178 immutable recommendation IDs join once to measured composition, stale claims and paths close, and the
entire production-boundary matrix reruns on one frozen candidate. A collapsed status, inferred composition, ledger
mutation, unresolved drift, stale evidence, contradictory completion prose, or failed strict validation blocks closeout.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Predecessor `004-fleet-authority-cutover` is complete and supplies final fleet authority, rollback, production-boundary, telemetry, and retirement evidence before reconciliation begins (REQ-008)
- [ ] CHK-002 [P0] Phase 1 supplies the exact mode-parent inventory, traceability artifact, closed `composition_status` vocabulary, and evidence-key schema before status or ledger updates (REQ-001, REQ-003)
- [ ] CHK-003 [P0] One final candidate and evidence set is frozen for the complete production-boundary matrix and all affected documentation claims (REQ-006, SC-004)
- [ ] CHK-004 [P1] Candidate stale claims and pre-consolidation paths are inventoried with their current code, evidence, and filesystem replacement checks before edits (REQ-005, SC-003)
- [ ] CHK-005 [P1] Baseline digests preserve all 178 stable IDs, source provenance, and historical dispositions before composition reconciliation (REQ-003, SC-002)
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-006 [P0] Every inventoried mode-parent document contains `library/status`, `shadow/status`, and `authority/status`, and each field cites its own current evidence (REQ-001, SC-001)
- [ ] CHK-007 [P0] Library status never implies shadow wiring, shadow status never implies authority, and durable per-mode authority facts are the only source for authority status (REQ-002)
- [ ] CHK-008 [P0] All 178 immutable IDs join exactly once to phase-1 traceability and gain one accepted `composition_status` without changing source provenance or historical disposition (REQ-003, SC-002)
- [ ] CHK-009 [P0] The schema, deterministic review projection, and validator reject missing IDs, duplicate joins, unknown values, unsupported evidence, immutable-field mutation, and nondeterministic output (REQ-004)
- [ ] CHK-010 [P1] Contradictory or unavailable evidence produces an explicit non-green value instead of an inferred pass or collapsed completion label (REQ-002)
- [ ] CHK-011 [P1] No local status alias or vocabulary extension is introduced without an explicit versioned amendment to the phase-1 contract
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-012 [P0] Inventory closure proves every mode-parent document carries all three independent fields with current evidence (REQ-001, SC-001)
- [ ] CHK-013 [P0] A library-present but shadow- or authority-incomplete fixture reports the three facts separately and cannot pass through an aggregate completion label (REQ-002, SC-001)
- [ ] CHK-014 [P0] The reconciled ledger retains exactly 178 stable IDs and historical dispositions while every row receives exactly one evidence-backed `composition_status` (REQ-003, SC-002)
- [ ] CHK-015 [P0] Negative join fixtures reject missing IDs, duplicate joins, unknown status, unsupported evidence, source or disposition mutation, and nondeterministic output (REQ-004)
- [ ] CHK-016 [P0] Stale-claim verification checks each candidate against current code and final evidence before replacement or explicit retention with rationale (REQ-005)
- [ ] CHK-017 [P0] Every replaced pre-consolidation path resolves in the final tree and the inventory closes with zero unresolved in-scope stale claims or broken paths (REQ-005, SC-003)
- [ ] CHK-018 [P0] Every declared production-boundary matrix row executes against the same frozen candidate and evidence identities with commands and results recorded (REQ-006, SC-004)
- [ ] CHK-019 [P0] The final matrix has zero omitted, skipped, waived, stale, or cross-candidate blocking rows and reruns after relevant drift (REQ-006, SC-004)
- [ ] CHK-020 [P0] Epic goal, phase map, mode-parent fields, ledger composition, completion records, tasks, checklists, summaries, descriptions, and graph metadata contain no contradictory stage or completion claim (REQ-007, SC-005)
- [ ] CHK-021 [P0] Any missing mode cutover, failed matrix row, unresolved drift, or stale evidence blocks closeout and reopens the owning phase (REQ-008)
- [ ] CHK-022 [P0] Recursive strict validation and scoped drift scans pass after deterministic metadata regeneration (SC-006)
- [ ] CHK-023 [P0] The final diff contains only approved closeout artifacts and no source, runtime, authority, or retained-evidence mutation outside scope (SC-006)
- [ ] CHK-024 [P1] Repeating ledger projection and validation over identical inputs produces byte-identical outputs (REQ-004)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-025 [P0] Mode-parent, 178-row ledger, stale-claim, stale-path, matrix, and completion-document inventories all close with zero unexplained omissions (REQ-001, REQ-003, REQ-005, REQ-007)
- [ ] CHK-026 [P0] Every failed predecessor fact is routed to its owning phase and remains non-green until current evidence passes; closeout prose never masks the failure (REQ-008)
- [ ] CHK-027 [P1] Any relevant code, authority, evidence, or document drift invalidates affected matrix and reconciliation results and triggers a same-candidate rerun (REQ-006)
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-028 [P0] Reconciliation preserves recommendation IDs, source text, source locators, provenance, historical dispositions, and retained evidence bytes (REQ-003, SC-002)
- [ ] CHK-029 [P0] This reporting phase performs no library implementation, shadow wiring, authority cutover, rollback, legacy retirement, runtime move, or canonical authority mutation
- [ ] CHK-030 [P1] Evidence precedence is enforced: frozen-candidate production results and durable authority facts outrank summaries, generated metadata, file presence, and unchecked completion prose
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-031 [P0] Epic completion prose matches verified code, three-field mode status, measured ledger composition, durable authority, and final matrix evidence (REQ-007, SC-005)
- [ ] CHK-032 [P1] Every corrected historical claim cites its current replacement fact, while retained claims state an explicit current rationale (REQ-005, SC-003)
- [ ] CHK-033 [P1] Packet completion records, tasks, checklists, implementation summaries, descriptions, and graph metadata agree after deterministic regeneration (REQ-007, SC-005)
- [ ] CHK-034 [P2] Final reporting distinguishes historical disposition from measured current composition and does not equate adoption with implementation (REQ-003)
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-035 [P0] Composition reconciliation remains a deterministic join or projection over the immutable ledger rather than an uncontrolled rewrite of historical source fields (REQ-003, REQ-004)
- [ ] CHK-036 [P1] Updated canonical paths exist in the final tree, and no pre-consolidation alias is replaced with another unresolved path (REQ-005)
- [ ] CHK-037 [P1] Final matrix, reconciliation, validation, and drift evidence is candidate-bound, reproducible, and retained at declared closeout locations (REQ-006, SC-006)
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when all mode parents expose evidence-independent library, shadow, and authority fields, every one
of 178 stable ledger IDs receives exactly one measured composition status without historical mutation, stale claims and
paths close, the full production-boundary matrix is green on one candidate, all completion surfaces agree with code and
durable authority, metadata is regenerated deterministically, and strict validation and drift scans pass.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier records predecessor and phase-1 inputs, mode-parent and ledger closure, stale-claim and path
resolution, one-candidate matrix results, owner reopenings, cross-document agreement, metadata regeneration, recursive
strict validation, scoped drift scans, and an approved final diff. Until then the phase remains Planned and every
checklist item stays unchecked.
<!-- /ANCHOR:sign-off -->
