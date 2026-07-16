---
title: "Checklist: Deep Review resume adapter"
description: "Blocking verification checklist for the planned Deep Review resume adapter: sealed-frontier folding, continuity-ladder recovery, idempotent re-entry, and fail-closed replay behavior."
trigger_phrases:
  - "deep review resume adapter checklist"
  - "sealed frontier resume verification"
  - "deep-review idempotent replay checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/005-resume-adapter"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Specified blocking replay, crash, and idempotency checks for resume"
    next_safe_action: "Build sealed-frontier fixtures after shared contracts are frozen"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Deep Review Resume Adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the Deep Review resume adapter. The verifier pins the candidate and
base SHAs, the sealed-frontier fixture hash, the event-schema and reducer versions, the replay fingerprint, the write-set
graph revision, command exit codes, and state/event-count comparisons. Verification must fail on an unsealed or ambiguous
frontier, duplicate logical transition, missing event, unsafe unknown-effect retry, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase-012 shared review-loop contract is frozen with sealed-frontier and reducer bindings
- [ ] CHK-002 [P0] Phase-015 mode interface and write-set conflict graph are pinned for the Deep Review lineage
- [ ] CHK-003 [P1] Interruption boundary matrix covers scope, dimension pass, candidate, proof, convergence, and report states
- [ ] CHK-004 [P1] Continuity-ladder state table identifies one owning logical ID and next safe action for every fixture
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] Recovery reads the sealed ledger and versioned reducers only; mutable summaries cannot become an authority fallback
- [ ] CHK-006 [P1] Adapter consumes shared transitions and does not introduce a Deep Review-only lifecycle or conflicting event path
- [ ] CHK-007 [P1] Logical IDs, attempt IDs, manifest revisions, artifact digests, and replay fingerprints remain distinct
- [ ] CHK-008 [P2] Raw candidate, proof, disposition, and suppression events remain immutable while presentation projections stay derived
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] Replaying each sealed fixture from an empty reducer matches the canonical state and next-action fingerprint
- [ ] CHK-010 [P0] Replaying from every interruption frontier preserves committed events and branch-local successes without duplication
- [ ] CHK-011 [P0] Missing, reordered, duplicate, conflicting, truncated, and unsealed events fail closed before scheduling new work
- [ ] CHK-012 [P0] Repeated and concurrent resume requests produce one logical resume decision for the same frontier and manifest revision
- [ ] CHK-013 [P0] Changed manifest, schema, reducer, adapter, tool, or artifact fingerprints select reuse, reexecute, migrate, pin, reconcile, compensate, or reject explicitly
- [ ] CHK-014 [P0] Unknown external effects remain blocked or reconciled and are never retried as if completion were proven
- [ ] CHK-015 [P0] Report projection is idempotent for one folded frontier and creates a new immutable projection for a changed frontier
- [ ] CHK-016 [P1] Deep Review finding lineage distinguishes introduced, fixed, preexisting, updated, unchanged, and absent states across revisions
- [ ] CHK-017 [P1] P0/P1/P2 presentation is derived from impact and independent evidence fields after replay
- [ ] CHK-018 [P1] Same-lineage and independent-lineage concurrency cases agree with the phase-012 write-set conflict graph
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-019 [P0] The adapter covers the full continuity ladder from scope through dimension passes, proof obligations, convergence, and review-report
- [ ] CHK-020 [P1] Every resume decision has an auditable reason, owning logical ID, sealed frontier, and replay-fingerprint evidence
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-021 [P0] A stale or incompatible replay cannot bypass the sealed-frontier guard or schedule an unverified proof effect
- [ ] CHK-022 [P1] Clean verifier inputs, immutable baseline evidence, and receipt hashes are preserved across resume and compensation
- [ ] CHK-023 [P2] No authority-cutover, allowlist, or legacy-writer behavior changes are introduced by the adapter
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-024 [P1] The continuity-ladder mapping, decision algebra, interruption matrix, and shared-contract boundaries are reflected in packet docs
- [ ] CHK-025 [P2] Verification records retain fixture hashes, reducer versions, replay fingerprints, and state/event-count comparisons
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-026 [P1] Implementation and verification changes remain scoped to the resume adapter concern and do not modify sibling contracts
- [ ] CHK-027 [P2] Adapter changes land in dependency-closed, path-scoped commits with the legacy recovery path available for rollback
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, deterministic folding agrees across all interruption fixtures,
duplicate and unsafe re-entry cases fail closed, report projection is idempotent, and the adapter is proven to consume the
phase-012 shared loop contract and phase-012 write-set graph without authority movement.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms sealed-frontier recovery, the no-double-apply/no-loss/no-unsafe-replay contract,
and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
