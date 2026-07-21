---
title: "Checklist: Logical Branch IDs, Leases & Waves"
description: "Blocking verification contract for stable branch identities, mutation-atomic fenced leases, deterministic wave admission, and ledger-driven resume."
trigger_phrases:
  - "logical branch ids leases waves checklist"
  - "durable fanout lease verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/003-logical-branch-ids-leases-waves"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/003-logical-branch-ids-leases-waves"
    last_updated_at: "2026-07-21T04:54:46Z"
    last_updated_by: "codex"
    recent_action: "Verified branch stability, stale-fence rejection, wave ordering, pool parity, and ledger resume"
    next_safe_action: "Retain additive-dark authority until a separate cutover is authorized"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/branch-leases-waves.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Logical Branch IDs, Leases & Waves

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 009's `003-logical-branch-ids-leases-waves` child. Evidence is bound to base revision `012652b479dee08455de574574c5e7a8971a8b0b`, logical-ID derivation version 1, wave-plan version 1, the shipped pool baseline, and the shared monotonic fencing-token contract. The leaf suite executes real branches, independent-process contention, stale epochs, reorder, retry, partial-wave, crash-resume, and drift fixtures.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase-005 expansion coordinates, invocation fingerprint, and stable-ID handoff are pinned before branch registration code is written [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-002 [P0] The phase-006 transition gateway and phase-007 lease service expose mutation-atomic head/fence validation in the selected backend [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-003 [P0] The predecessor result envelope and salvage contract carry an immutable logical-branch reference [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-004 [P1] The protected-write manifest covers dispatch, status, retry, orphan, salvage, result, terminal, checkpoint, and wave mutations [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-005 [P2] Candidate revision, fixture fingerprints, derivation versions, and baseline pool behavior are recorded in the verifier report [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-006 [P0] One versioned canonical encoder owns logical IDs; pool labels, array indices, timestamps, PIDs, retries, and directory discovery cannot redefine identity [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-007 [P0] One guarded mutation adapter owns branch-state writes; no legacy, dark, result, salvage, or retry path bypasses transition-and-fence validation [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-008 [P1] Wave scheduling remains above `runCappedPool`; no second pool, hidden slot reservation, or busy-wait scheduler duplicates the capped work-conserving core [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-009 [P1] Changes remain inside this phase's identity, lease-composition, wave-ordering, ledger, and resume scope; successor policy logic is not absorbed [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P0] Reorder models, branches, replicas, and unrelated manifest entries; unchanged normalized coordinates retain identical directory-safe logical IDs [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-011 [P0] Reject empty/unsafe segments, traversal forms, Unicode or case aliases defined by the encoder, duplicate coordinates, and forced digest collisions before registration [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-012 [P0] Replay identical branch registration idempotently; reject any existing-ID mismatch in coordinates, derivation version, manifest fingerprint, wave membership, or invocation linkage [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-013 [P0] Verify every dispatch receipt, attempt, retry, result envelope, salvage record, terminal event, and summary reference resolves exactly one registered branch [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-014 [P0] Verify canonical resource-key aliases cannot split one branch into parallel lease domains and distinct branch IDs can execute concurrently [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-015 [P0] Exercise lease acquire, renew, release, expiry, crash, restart, and takeover; tokens increase strictly and displaced renew/release cannot affect the successor [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-016 [P0] Pause a live worker through expiry, grant a successor, then reject every old-fence dispatch, status, retry, salvage, result, checkpoint, and terminal mutation [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-017 [P0] Prove fence validation, transition authorization, expected-head comparison, and protected mutation occur in one atomic boundary with no check-then-write gap [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-018 [P0] Compile equal wave inputs repeatedly and assert identical plan fingerprint, wave IDs, ordinals, membership, prerequisites, and branch order [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-019 [P0] Use a future-wave dispatch sentinel to prove only the ledger-authorized current wave reaches `runCappedPool` [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-020 [P0] Compare concurrency saturation, retries, lag-ceiling abort/requeue, post-exit orphan handling, ordered settlements, and summaries with the pinned pool baseline [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-021 [P0] Crash after registration, admission, acquisition, renewal, dispatch, result, terminal, close, and advance boundaries; repeated resume yields the same fold [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-022 [P0] Resume never re-dispatches a terminal branch, preserves a valid live lease, and reclaims an expired branch only with a higher fencing token [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-023 [P0] Budget-aware fan-in and partial-failure stubs can authorize advance/stop only through typed ledger decisions and cannot reorder or rewrite admitted waves [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-024 [P0] Manifest drift, wave-plan drift, unknown versions, ambiguous lease state, unsupported atomicity domain, and ledger-head conflict all fail before dispatch [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-025 [P1] The ledger fold reconstructs every registered branch, immutable wave membership, current lease epoch, accepted terminal result, and current/next wave without directory or PID inference [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-026 [P1] The implementation cites and conforms to phase 005 manifest expansion, phase 007 locks/fencing, `fanout-pool.cjs`, and `manifest/phase-tree.json` [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-027 [P0] Directory-safe IDs and canonical resource keys reject traversal, alias, and cross-run confusion before filesystem or lease lookup [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-028 [P1] Lease metadata and ledger records exclude secrets and raw environment values while retaining auditable run, branch, wave, owner, attempt, and fence correlation [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-029 [P1] Event schemas document branch derivation version, manifest and wave-plan fingerprints, lease lifecycle, stale rejection, and resume-fold semantics [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-030 [P2] Operator documentation distinguishes pool concurrency, wave admission, retry attempts, lease takeover, and successor fan-in policy [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-031 [P1] Identity, lease adapters, wave planning, and replay folding have single owners with no duplicated derivation or transition logic across runtime scripts [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
- [x] CHK-032 [P1] Legacy compatibility remains additive-dark and removable without deleting canonical branch, wave, lease, or result history [EVIDENCE: implementation-summary.md; branch-leases-waves.vitest.ts]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

All P0 and P1 checks have machine-detectable evidence. The leaf suite passes 13/13 tests, including cross-process acquire, stale-token rejection at every protected branch mutation, deterministic reorder/wave planning, full-cap current-wave admission, shipped retry classification, non-canonical result rejection, partial-wave restart, boundary-by-boundary restart, crash-before-terminal resume, and drift rejection. The pinned substrate and pool baseline passes 75/75 tests, and the runtime TypeScript project exits 0.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off against base revision `012652b479dee08455de574574c5e7a8971a8b0b` after the leaf and pinned baseline suites, strict TypeScript, comment hygiene, additive-dark scope audit, and strict spec validation exit 0.
<!-- /ANCHOR:sign-off -->
