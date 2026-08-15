---
title: "Tasks: Approval, Containment, and Remote Mutation"
description: "Dependency-ordered task ledger for approval, containment, and remote mutation."
trigger_phrases:
  - "pi remote approval and remote mutation"
  - "pi mobile phase 6"
  - "approval and remote mutation"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/006-approval-and-remote-mutation"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the task ledger with the implemented authority loop"
    next_safe_action: "Verify live extension ordering and real macOS containment"
    blockers:
      - "Live Pi extension and protected containment remain operator-unverified"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 85
---

# Tasks: Approval, Containment, and Remote Mutation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after its dependency |
| `[B]` | Blocked with an explicit reason |

**Task Format**: `T### [P?] Description (owned path or evidence surface)`

The authority loop exists under `.pi/pi-remote/`. Unchecked rows include operator-only live boundaries and are not complete.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm active instructions, repository surface, workspace choice, owned paths, consumers, and authoritative gate.
- [ ] T002 Re-run predecessor and version-drift checks; capture the exact negative control.
- [ ] T003 Freeze rollback, capability-disable, evidence, and secret-handling paths.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Pin and integrity-check the Pi extension load and handler-order contract.
- [ ] T005 [P] Implement canonical action serialization and shared digest fixtures.
- [ ] T006 [P] Implement the protected-tool extension with fail-closed final-boundary checks.
- [ ] T007 Implement approval leases, expiry, CAS decisions, revocation, epoch invalidation, and metadata audit.
- [ ] T008 Apply workspace, filesystem, process, credential, UID, and network containment.
- [ ] T009 Apply one redaction/classification policy before all live, durable, cached, audit, and push boundaries.
- [ ] T010 Implement the independent mutation kill switch and default-deny command policy.
- [ ] T011 Enable command families one by one only after all matrix gates pass.
- [ ] T012 Run TOCTOU, race, restart, revocation, escape, leakage, and mutation-crash suites.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Run focused checks and retain exact command, output, exit, version, and environment evidence.
- [ ] T014 Run the authoritative phase gate and safe rollback or recovery exercise.
- [ ] T015 Reconcile checklist, current state, parent map, successor inputs, limitations, and scoped status.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements and non-deferred P1 requirements have objective evidence.
- [ ] No blocked task, failing gate, secret, temporary output, or unrelated edit remains.
- [ ] Dependent capabilities remain disabled whenever their required gate is absent or failing.
- [ ] Parent and child statuses plus the successor handoff describe the same final state.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent map**: [../spec.md](../spec.md)
- **Specification**: [spec.md](spec.md)
- **Plan**: [plan.md](plan.md)
- **Verification**: [checklist.md](checklist.md)
- **Decision**: [decision-record.md](decision-record.md)
- **Current state**: [implementation-summary.md](implementation-summary.md)
<!-- /ANCHOR:cross-refs -->
