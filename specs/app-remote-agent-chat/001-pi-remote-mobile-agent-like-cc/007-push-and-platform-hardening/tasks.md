---
title: "Tasks: Push and Platform Hardening"
description: "Dependency-ordered task ledger for push and platform hardening."
trigger_phrases:
  - "pi remote push and platform hardening"
  - "pi mobile phase 7"
  - "push and platform hardening"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/007-push-and-platform-hardening"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the task ledger with the implemented push path"
    next_safe_action: "Verify Web Push on a physical supported iOS device"
    blockers:
      - "Physical iOS Web Push remains operator-unverified"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 85
---

# Tasks: Push and Platform Hardening

<!-- SPECKIT_LEVEL: 3 -->
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

The push path exists under `.pi/pi-remote/`. Unchecked rows include physical-device evidence and are not complete.
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

- [ ] T004 Confirm push prerequisites and supported OS/browser/install rows.
- [ ] T005 [P] Implement encrypted subscription storage, rotation, preferences, and endpoint cleanup.
- [ ] T006 [P] Implement committed-transition classification, generic payloads, deduplication, and foreground suppression.
- [ ] T007 Implement service-worker receipt, generic notification UI, and authenticated fetch-on-open.
- [ ] T008 Implement unsubscribe, logout, revocation, reinstall, and permission-change behavior.
- [ ] T009 Exercise payload inspection, stale hint, expired approval, offline, kill/restart, Focus, and invalid-endpoint cases.
- [ ] T010 Record platform limitations and hand them to documentation and release phases.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run focused checks and retain exact command, output, exit, version, and environment evidence.
- [ ] T012 Run the authoritative phase gate and safe rollback or recovery exercise.
- [ ] T013 Reconcile checklist, current state, parent map, successor inputs, limitations, and scoped status.
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
