---
title: "Checklist: Locks & Fencing"
description: "Blocking verification contract for monotonic fencing, stale-writer rejection, guarded legacy/dark coexistence, fan-out and resume safety, and bounded deadlock/timeout behavior."
trigger_phrases:
  - "locks and fencing checklist"
  - "deep-loop stale writer verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/004-shared-evidence-and-control-services/006-locks-and-fencing"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/004-shared-evidence-and-control-services/006-locks-and-fencing"
    last_updated_at: "2026-07-15T14:01:58Z"
    last_updated_by: "codex"
    recent_action: "Defined P0 fencing, stale-writer, timeout, and recovery checks"
    next_safe_action: "Run the concurrency matrix against every protected mutation surface"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Locks & Fencing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for locks and fencing. Every item is executed against a candidate SHA pinned to phase-000 BASE; the report records the protected-resource manifest hash, atomicity domain, coordinator state generation, commands, exit codes, barrier/fault point, winning and rejected tokens, committed heads/versions, and unexpected tracked mutation. Zero discovered writers, zero exercised stale-writer barriers, an unbounded wait, or a protected backend without atomic fence-plus-mutation support fails the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The phase-003 ledger append/head/receipt boundary and phase-004 additive-dark authority posture are pinned to exact packet revisions
- [ ] CHK-002 [P0] A reviewed manifest maps every shipped ledger, projection, council, fan-out, repair, pause/resume, checkpoint, and lineage writer to one canonical resource key
- [ ] CHK-003 [P1] The atomicity domain, resource hierarchy/order, lease TTL/renewal cadence, acquisition timeout, retry policy, token width, and overflow behavior are recorded
- [ ] CHK-004 [P1] Unsupported multi-host or storage semantics are enumerated and configured to fail closed
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] Fence validation occurs inside the same atomic commit boundary as every protected mutation; no check-then-write helper is public
- [ ] CHK-006 [P0] Release and renewal require resource key, token, lease ID/nonce, and owner; stale teardown cannot remove or extend a successor
- [ ] CHK-007 [P1] Canonical resource encoding rejects aliases, traversal, empty identity components, and mixed normalization that could split one resource into two lock namespaces
- [ ] CHK-008 [P1] Existing loop-lock heartbeat/nonce and CLI nonce-safe ownership behavior remain until equivalent fenced coverage proves adapter replacement
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] Concurrent acquisition for one resource yields exactly one holder and unique strictly increasing tokens across all later grants
- [ ] CHK-010 [P0] Release, expiry, crash, coordinator restart, restored state, and rollback never decrement or reuse a resource token
- [ ] CHK-011 [P0] A live old holder paused immediately before commit resumes after takeover and receives typed stale-fence rejection without changing ledger head, projection version, or lineage state
- [ ] CHK-012 [P0] Ledger append atomically validates current fence plus expected head; competing current-head writers produce one commit and one typed conflict/stale result
- [ ] CHK-013 [P0] Projection and checkpoint/pause-resume updates atomically validate current fence plus version/continuity identity; stale replace and clear operations are rejected
- [ ] CHK-014 [P0] Legacy-only, dark-only, and combined shadow fixtures use one guarded epoch; no raw writer bypass succeeds and a dark failure does not change the authoritative legacy result
- [ ] CHK-015 [P0] Distinct fan-out lineages run concurrently while duplicate same-lineage workers, same status stream, salvage merge, or wait-checkpoint resume admit only the current token
- [ ] CHK-016 [P0] A stale resumed process cannot dispatch, append status, merge salvage, clear the wait checkpoint, or emit resumed/restarted state after a successor token exists
- [ ] CHK-017 [P0] Inverted, nested, and re-entrant acquisition fails before blocking; ordinary contention terminates at the bounded timeout with no force-unlock or token reset
- [ ] CHK-018 [P0] Malformed/partial coordinator state, ambiguous ledger head, unsupported atomicity domain, and token overflow fail closed without ledger truncation or protected mutation
- [ ] CHK-019 [P0] PID reuse, dead/live PID probes, clock skew, heartbeat delay, and lease expiry affect takeover liveness only; they never authorize an old token
- [ ] CHK-020 [P0] Fault injection at acquire, renew, pre-commit, append/CAS, fsync, expiry, takeover, and release leaves one valid current epoch and deterministic recovery evidence
- [ ] CHK-021 [P1] Acquisition, renewal, expiry, takeover, rejection, timeout, and release events carry resource digest, token, lease/correlation identity, owner, reason, and latency with required redaction
- [ ] CHK-022 [P1] Shipped loop-lock, CLI writer-lock, council round-state, JSONL repair, fan-out, lifecycle, and phase-003 ledger suites pass alongside the new concurrency matrix
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-023 [P0] The reviewed writer manifest has no unguarded protected entry point, duplicate resource namespace, or lock API whose caller coverage is unknown
- [ ] CHK-024 [P1] Every adapter is mapped to its direct fenced replacement and removal gate; compatibility code has no open-ended fallback to unfenced writes
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-025 [P1] Lease IDs/nonces are unguessable ownership credentials, fencing tokens are treated as monotonic epochs rather than secrets, and telemetry excludes raw protected paths or payloads
- [ ] CHK-026 [P1] Untrusted resource keys and owner metadata cannot escape the coordinator root, select another tenant/packet/lineage, or forge a current lease
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-027 [P2] Runtime lock/recovery documentation names protected resources, atomicity domain, timeout policy, typed errors, and operator recovery without recommending manual force-unlock
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-028 [P1] Coordinator, guards, adapters, and tests land in dependency-closed path-scoped commits; rollback preserves or advances the fencing registry
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, the reviewed resource manifest covers every protected writer, tokens remain strictly monotonic through all lifecycle and recovery fixtures, stale live/resumed writers are rejected at each mutation boundary, legacy/dark and fan-out races admit one valid epoch, and all shipped regression suites plus the cross-surface fault matrix are green on the pinned candidate SHA.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier binds the resource-manifest hash and coordinator generation to the candidate SHA, confirms atomic fence-plus-mutation evidence for every protected backend, and `git diff-index --quiet HEAD --` reports no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
