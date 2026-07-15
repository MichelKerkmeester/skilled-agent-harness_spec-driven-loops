---
title: "Checklist: Logical Branch IDs, Leases & Waves"
description: "Blocking verification contract for stable branch identities, mutation-atomic fenced leases, deterministic wave admission, and ledger-driven resume."
trigger_phrases:
  - "logical branch ids leases waves checklist"
  - "durable fanout lease verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/006-fanout-fanin-durable-orchestration/003-logical-branch-ids-leases-waves"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/006-fanout-fanin-durable-orchestration/003-logical-branch-ids-leases-waves"
    last_updated_at: "2026-07-15T14:44:21Z"
    last_updated_by: "codex"
    recent_action: "Defined P0 checks for branch stability, stale-fence rejection, and wave replay"
    next_safe_action: "Run crash, takeover, reorder, and resume fixtures before accepting the phase"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Logical Branch IDs, Leases & Waves

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 003. Every item remains pending during planning. The implementation verifier must bind its report to the candidate revision, phase-002 manifest fixture fingerprint, phase-004 fencing contract version, and wave-plan derivation version; record commands, exit codes, event counts, and accepted/rejected fence epochs; and fail on zero executed branches, silent manifest drift, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase-002 expansion coordinates, invocation fingerprint, and stable-ID handoff are pinned before branch registration code is written
- [ ] CHK-002 [P0] The phase-003 transition gateway and phase-004 lease service expose mutation-atomic head/fence validation in the selected backend
- [ ] CHK-003 [P0] The predecessor result envelope and salvage contract carry an immutable logical-branch reference
- [ ] CHK-004 [P1] The protected-write manifest covers dispatch, status, retry, orphan, salvage, result, terminal, checkpoint, and wave mutations
- [ ] CHK-005 [P2] Candidate revision, fixture fingerprints, derivation versions, and baseline pool behavior are recorded in the verifier report
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-006 [P0] One versioned canonical encoder owns logical IDs; pool labels, array indices, timestamps, PIDs, retries, and directory discovery cannot redefine identity
- [ ] CHK-007 [P0] One guarded mutation adapter owns branch-state writes; no legacy, dark, result, salvage, or retry path bypasses transition-and-fence validation
- [ ] CHK-008 [P1] Wave scheduling remains above `runCappedPool`; no second pool, hidden slot reservation, or busy-wait scheduler duplicates the capped work-conserving core
- [ ] CHK-009 [P1] Changes remain inside this phase's identity, lease-composition, wave-ordering, ledger, and resume scope; successor policy logic is not absorbed
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] Reorder models, branches, replicas, and unrelated manifest entries; unchanged normalized coordinates retain identical directory-safe logical IDs
- [ ] CHK-011 [P0] Reject empty/unsafe segments, traversal forms, Unicode or case aliases defined by the encoder, duplicate coordinates, and forced digest collisions before registration
- [ ] CHK-012 [P0] Replay identical branch registration idempotently; reject any existing-ID mismatch in coordinates, derivation version, manifest fingerprint, wave membership, or invocation linkage
- [ ] CHK-013 [P0] Verify every dispatch receipt, attempt, retry, result envelope, salvage record, terminal event, and summary reference resolves exactly one registered branch
- [ ] CHK-014 [P0] Verify canonical resource-key aliases cannot split one branch into parallel lease domains and distinct branch IDs can execute concurrently
- [ ] CHK-015 [P0] Exercise lease acquire, renew, release, expiry, crash, restart, and takeover; tokens increase strictly and displaced renew/release cannot affect the successor
- [ ] CHK-016 [P0] Pause a live worker through expiry, grant a successor, then reject every old-fence dispatch, status, retry, salvage, result, checkpoint, and terminal mutation
- [ ] CHK-017 [P0] Prove fence validation, transition authorization, expected-head comparison, and protected mutation occur in one atomic boundary with no check-then-write gap
- [ ] CHK-018 [P0] Compile equal wave inputs repeatedly and assert identical plan fingerprint, wave IDs, ordinals, membership, prerequisites, and branch order
- [ ] CHK-019 [P0] Use a future-wave dispatch sentinel to prove only the ledger-authorized current wave reaches `runCappedPool`
- [ ] CHK-020 [P0] Compare concurrency saturation, retries, lag-ceiling abort/requeue, post-exit orphan handling, ordered settlements, and summaries with the pinned pool baseline
- [ ] CHK-021 [P0] Crash after registration, admission, acquisition, renewal, dispatch, result, terminal, close, and advance boundaries; repeated resume yields the same fold
- [ ] CHK-022 [P0] Resume never re-dispatches a terminal branch, preserves a valid live lease, and reclaims an expired branch only with a higher fencing token
- [ ] CHK-023 [P0] Budget-aware fan-in and partial-failure stubs can authorize advance/stop only through typed ledger decisions and cannot reorder or rewrite admitted waves
- [ ] CHK-024 [P0] Manifest drift, wave-plan drift, unknown versions, ambiguous lease state, unsupported atomicity domain, and ledger-head conflict all fail before dispatch
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-025 [P1] The ledger fold reconstructs every registered branch, immutable wave membership, current lease epoch, accepted terminal result, and current/next wave without directory or PID inference
- [ ] CHK-026 [P1] The implementation cites and conforms to phase 002 manifest expansion, phase 004 locks/fencing, `fanout-pool.cjs`, and `manifest/phase-tree.json`
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-027 [P0] Directory-safe IDs and canonical resource keys reject traversal, alias, and cross-run confusion before filesystem or lease lookup
- [ ] CHK-028 [P1] Lease metadata and ledger records exclude secrets and raw environment values while retaining auditable run, branch, wave, owner, attempt, and fence correlation
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-029 [P1] Event schemas document branch derivation version, manifest and wave-plan fingerprints, lease lifecycle, stale rejection, and resume-fold semantics
- [ ] CHK-030 [P2] Operator documentation distinguishes pool concurrency, wave admission, retry attempts, lease takeover, and successor fan-in policy
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-031 [P1] Identity, lease adapters, wave planning, and replay folding have single owners with no duplicated derivation or transition logic across runtime scripts
- [ ] CHK-032 [P1] Legacy compatibility remains additive-dark and removable without deleting canonical branch, wave, lease, or result history
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check has machine-detectable evidence, P1 checks are satisfied or explicitly approved for deferral, branch and wave fingerprints are pinned, old-fence mutations are rejected at the protected store, the existing pool retains baseline behavior, and crash/replay fixtures reconstruct one deterministic orchestration fold.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms stable branch identity, mutation-atomic fencing, ordered wave admission, and resume determinism against the candidate revision, with strict spec validation and the relevant runtime build/test gates green.
<!-- /ANCHOR:sign-off -->
