---
title: "Tasks: Mobile PWA and Reconciliation"
description: "Dependency-ordered task ledger for mobile pwa and reconciliation."
trigger_phrases:
  - "pi remote mobile pwa and reconciliation"
  - "pi mobile phase 5"
  - "mobile pwa and reconciliation"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/005-mobile-pwa-and-reconciliation"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the task ledger with the implemented PWA"
    next_safe_action: "Use phase 009 for physical-device and accessibility evidence"
    blockers:
      - "No phase-specific implementation blocker"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 90
---

# Tasks: Mobile PWA and Reconciliation

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

The PWA exists under `.pi/pi-remote/`. Unchecked rows remain evidence-reconciliation work and do not mean implementation is absent.
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

- [ ] T004 Set up the repository-approved PWA shell, manifest, routing, and authenticated bootstrap.
- [ ] T005 [P] Implement opaque session cards, navigation, connection banner, and stale-state labels.
- [ ] T006 [P] Implement orthogonal reducers and recorded-fixture playback.
- [ ] T007 Implement transcript hydration, streamed drafts, authoritative terminals, and tool cards.
- [ ] T008 Implement replay, snapshot, entry reconciliation, retention-miss, and epoch-change flows.
- [ ] T009 Implement prompt, steer, follow-up, abort, retry, queue, rejected, and indeterminate UI states.
- [ ] T010 Implement timestamped redacted offline cache and local drafts with all offline actions disabled.
- [ ] T011 Pass reducer, browser E2E, reconnect, stale-state, accessibility-foundation, and real-child foreground gates.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Run focused checks and retain exact command, output, exit, version, and environment evidence.
- [ ] T013 Run the authoritative phase gate and safe rollback or recovery exercise.
- [ ] T014 Reconcile checklist, current state, parent map, successor inputs, limitations, and scoped status.
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
