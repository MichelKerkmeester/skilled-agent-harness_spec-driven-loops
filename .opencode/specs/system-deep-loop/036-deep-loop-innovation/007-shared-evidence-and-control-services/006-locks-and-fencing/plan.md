---
title: "Implementation Plan: Locks & Fencing"
description: "Implementation plan for the phase-007 shared concurrency-safety service: canonical resource locks, leased ownership, monotonic fencing tokens, guarded writes, and bounded recovery under legacy/dark coexistence."
trigger_phrases:
  - "locks and fencing implementation plan"
  - "deep-loop fenced writer plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing"
    last_updated_at: "2026-07-15T14:01:58Z"
    last_updated_by: "codex"
    recent_action: "Sequenced fenced-writer implementation and split-brain verification"
    next_safe_action: "Implement durable token allocation before wiring protected writers"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Locks & Fencing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime + phase-006 ledger integration |
| **Change class** | Concurrency safety, durability, and recovery control |
| **Execution** | Additive-dark in an isolated worktree pinned to the phase-003 BASE |

### Overview
Build one fenced-lease contract for every shared mutable deep-loop resource. Start with a reviewed manifest of current writer and recovery paths, normalize each to a canonical resource key, then implement durable monotonic token allocation and mutation-side enforcement before adapting any writer. The ledger append path validates token plus expected head; projections validate token plus version; per-lineage state, fan-out status/merge, and wait/pause/resume paths validate token plus continuity identity. Compatibility adapters preserve the shipped loop-lock and nonce protections while legacy and dark emissions share one guarded epoch and legacy remains authoritative.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Every protected writer/recovery surface has one canonical resource key and declared atomicity domain
- [ ] The phase-006 append/head/receipt interfaces needed for fence enforcement are pinned
- [ ] Lease metadata, token allocation, typed errors, timeout values, and lock-order rules are specified
- [ ] Legacy and dark write entry points that must share one epoch are identified
- [ ] Fault-injection points cover acquire, renew, pre-commit, commit, fsync, release, expiry, and stale resume
- [ ] Unsupported multi-host/storage topologies are explicit and fail closed

### Definition of Done
- [ ] Tokens are strictly monotonic and never reused for each canonical resource
- [ ] Every protected mutation validates the current token atomically with its write
- [ ] Stale live, expired, resumed, and duplicate fan-out writers are rejected at commit
- [ ] Legacy/dark coexistence has one guarded mutation epoch without moving authority
- [ ] Deadlock, timeout, crash, corruption, PID-reuse, and clock-skew gates pass deterministically
- [ ] No inventoried protected writer remains reachable through an unfenced public path
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Resource registry**: a canonical encoder maps ledger ID, projection ID, run/lineage identity, status stream, checkpoint, and merge target to one stable resource key. Equivalent path spellings and traversal aliases fail rather than creating a second lock namespace.
- **Lease coordinator**: acquire atomically advances a durable per-resource counter and returns `{resourceKey, fenceToken, leaseId, owner, expiresAt}`. Renew and release require the full owner tuple; token counters survive release, expiry, crash, restart, and rollback.
- **Commit guards**: protected stores compare the supplied token with the durable current fence inside the same atomic boundary as append/CAS/replace. Ledger writes also compare the expected head; projection writes compare version; lineage/checkpoint writes compare continuity identity and state version.
- **Shadow adapter**: the authoritative legacy mutation and dark observation use one resource token and correlation ID. The adapter records dark failure without changing the legacy result, but a competing legacy-only or dark-only epoch is rejected.
- **Fan-out/resume guard**: different lineages use different resource keys. The same lineage, status ledger, salvage merge, or wait checkpoint serializes; takeover increments the token before dispatch, and stale workers cannot append status, merge, clear, or resume.
- **Compatibility layer**: preserve `loop-lock.ts` heartbeat/acquisition nonce and `cli-guards.cjs` nonce-safe release while routing their protected mutations through the coordinator. Replace bare council locks, unlocked status append, and checkpoint replacement only after equivalent fenced fixtures pass.
- **Deadlock policy**: prefer one lease per mutation. When a transaction spans resources, acquire by the frozen resource-kind/key order, reject inversion or re-entrant upgrade, release in reverse, and cap waiting/renewal. Timeout never authorizes a write and never resets a token.
- **Observability**: typed acquisition, renewal, expiry, takeover, rejection, timeout, and release events carry resource-key digest, token, lease/correlation identity, owner, reason, and latency; raw paths and sensitive payloads are excluded.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the implementation worktree to phase-003 BASE and freeze the protected write-surface manifest from `loop-lock.ts`, `cli-guards.cjs`, `round-state-jsonl.cjs`, `jsonl-repair.ts`, `fanout-pool.cjs`, `fanout-run.cjs`, lifecycle pause/recovery events, phase-006 ledger append, projections, and per-lineage state.
- Ratify canonical resource keys, atomicity domains, lock order, timeout/renewal defaults, fault-injection points, and the exact phase-006 interfaces the service consumes.

### Phase 2: Implementation
- Implement lease/fence types, canonical resource encoding, durable atomic token advancement, owner-safe renew/release, and typed contention/timeout/stale-fence errors.
- Implement mutation guards for ledger append plus expected head, projection CAS plus version, and lineage/checkpoint/pause-resume state plus continuity identity.
- Add the shadow-period legacy/dark adapter and route every inventoried protected writer through it or a direct fenced guard without changing legacy authority.
- Adapt fan-out status, wait checkpoints, salvage/repair merges, council round state, graph writer paths, and loop-lock consumers; retain their stronger current ownership checks until fenced parity is proven.
- Emit bounded, redacted lock lifecycle telemetry and explicit unsupported-topology errors.

### Phase 3: Verification
- Prove one winner and strictly increasing tokens under concurrent acquisition, expiry, release, crash, coordinator restart, and restored-state scenarios.
- Pause an old holder at every pre-commit fault point, grant a successor, then resume the old process and prove all old-token ledger/projection/lineage writes are rejected.
- Exercise legacy-only, dark-only, combined shadow, duplicate fan-out, same-kind replicas, checkpoint resume, salvage merge, council append, and projection races.
- Verify canonical lock order, bounded timeout, renewal loss, malformed coordinator state, token overflow, PID reuse, clock skew, and unsupported atomicity domains fail closed without deadlock or committed corruption.
- Re-run shipped lock, JSONL repair, fan-out, council, lifecycle, and phase-006 ledger tests plus the new cross-surface concurrency matrix.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Generate the write-surface/resource-key manifest from shipped call sites; alias/path variants map once or fail |
| REQ-002 | Concurrent, expiry, release, crash, restart, and restore fixtures assert strictly increasing per-resource tokens |
| REQ-003 | Wrong lease ID/nonce, owner, resource, or token cannot renew/release; a stale release leaves the successor intact |
| REQ-004 | Barrier-controlled stale-holder tests resume after takeover and require typed stale-fence rejection at commit |
| REQ-005 | Fault injection between validation and mutation proves no check-then-write window for ledger, projection, or lineage state |
| REQ-006 | Legacy/dark shadow matrix proves one epoch, legacy authority, observable dark failure, and no bypass path |
| REQ-007 | Multi-lineage concurrency proceeds; same-lineage worker/resume/checkpoint/merge races admit only the current token |
| REQ-008 | Inverted/nested acquisition rejects immediately; contention reaches bounded typed timeout without force unlock |
| REQ-009 | Malformed state, ambiguous head, stale restore, unsupported topology, and crash recovery fail closed without token reuse or ledger rewrite |
| REQ-010 | Existing loop-lock, CLI writer-lock, council, JSONL repair, fan-out, lifecycle, and ledger suites remain green with fenced adapters |
| REQ-011 | Event-schema tests cover every lock lifecycle result and verify redaction plus correlation/resource-token fields |
| REQ-012 | Clock-skew and PID-reuse fixtures alter takeover liveness only; old-token writes remain rejected |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This planning leaf has `depends_on: []`; `005-stream-fold-gauges` and `007-continuity-identities` are adjacency references only. Implementation consumes the phase-006 typed ledger's canonical resource identity, expected-head, append receipt, and immutable-recovery contracts, while the phase-007 parent supplies the additive-dark authority posture. Phase 008 later consumes these locks in compatibility/shadow adapters, phase 009 consumes them for durable fan-out/fan-in, and phase 014 alone may use their evidence to authorize authority cutover. Source boundaries are the program `spec.md`, `manifest/phase-tree.json`, the phase-006 ledger spec, and shipped runtime lock/recovery modules.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The implementation lands additively behind the dark-path and compatibility boundaries, so path-scoped `git revert` restores the prior call graph and leaves legacy authority unchanged. Rollback must not delete or decrement the durable fencing registry: resource epochs are retained or advanced/tombstoned, because reusing a pre-rollback token could re-authorize a stale process. If fenced integration fails, disable new acquisitions and dark writes, drain current holders, preserve coordinator evidence, verify the legacy path still matches BASE, and revert adapters only after no protected writer can resume with an old token. No rollback path may truncate the phase-006 ledger or force-remove a successor lease.
<!-- /ANCHOR:rollback -->
