---
title: "Tasks: Locks & Fencing"
description: "Tasks for the phase-004 shared locks-and-fencing service: inventory protected resources, implement durable fenced leases and guarded writes, adapt shipped writers, and verify stale-writer rejection."
trigger_phrases:
  - "locks and fencing tasks"
  - "deep-loop fencing token tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing"
    last_updated_at: "2026-07-15T14:01:58Z"
    last_updated_by: "codex"
    recent_action: "Mapped implementation and verification tasks for fenced shared-state writes"
    next_safe_action: "Build the resource registry and monotonic fencing-token allocator"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Locks & Fencing

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

- [ ] T001 Pin phase-000 BASE and inventory every protected writer/recovery path in the shipped runtime and phase-003 ledger
- [ ] T002 Freeze canonical resource-key rules, atomicity domains, lock ordering, timeout/renewal defaults, and unsupported topology behavior
- [ ] T003 Pin the phase-003 append/head/receipt interfaces and the opaque continuity identity consumed from `007-continuity-identities`
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement lease/fence types, typed errors, canonical resource encoding, and durable per-resource token allocation
- [ ] T005 Implement atomic acquire, renew, release, expiry, takeover, owner validation, and never-reuse persistence
- [ ] T006 Implement ledger append enforcement that atomically validates current fence plus expected head before durable append
- [ ] T007 Implement projection and per-lineage/checkpoint enforcement that atomically validates fence plus state version/identity
- [ ] T008 Implement the shared legacy/dark shadow adapter with one write epoch, legacy authority, and observable dark failure
- [ ] T009 Adapt `loop-lock.ts`, `cli-guards.cjs`, council round-state append, JSONL merge, fan-out status/checkpoint/merge, and pause/resume paths
- [ ] T010 Enforce one-resource preference, canonical multi-resource order, bounded waits, renewal loss, and no force-unlock policy
- [ ] T011 Emit redacted typed acquisition, renewal, expiry, takeover, rejection, timeout, and release records
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Verify: Canonical resource coverage — every ledger, projection, fan-out, recovery, checkpoint, and lineage writer maps exactly once
- [ ] T013 Verify: Token monotonicity — contention, release, expiry, crash, restart, restore, and rollback never reuse or decrease a token
- [ ] T014 Verify: Stale-holder rejection — an old live process resumed after takeover cannot mutate ledger, projection, lineage, status, merge, checkpoint, or pause/resume state
- [ ] T015 Verify: Shadow split-brain prevention — legacy and dark emissions share one epoch, raw bypasses fail, and legacy authority is unchanged
- [ ] T016 Verify: Fan-out isolation — distinct lineages overlap while duplicate same-lineage workers and resumed processes admit only the current token
- [ ] T017 Verify: Deadlock/timeout/recovery — inversion, contention, malformed state, ambiguous head, clock skew, PID reuse, and unsupported topology fail closed and terminate boundedly
- [ ] T018 Verify: Regression — shipped lock, repair, council, fan-out, lifecycle, and phase-003 ledger suites pass with the cross-surface fault matrix
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
