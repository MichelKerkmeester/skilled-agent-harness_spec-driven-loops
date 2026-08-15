---
title: "Tasks: Release Verification and Rollout"
description: "Dependency-ordered task ledger for release verification and rollout."
trigger_phrases:
  - "pi remote release verification and rollout"
  - "pi mobile phase 9"
  - "release verification and rollout"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/009-release-verification-and-rollout"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the task ledger with passing machine and pending operator evidence"
    next_safe_action: "Collect operator evidence and require each intended rollout stage explicitly"
    blockers:
      - "All rollout stages remain NOT-READY pending operator evidence"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 85
---

# Tasks: Release Verification and Rollout

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

Release machinery is implemented. Unchecked rows include operator-only evidence and stage promotion; they remain incomplete.
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

- [ ] T004 Freeze final versions, host configuration, supported devices, commands, and evidence locations.
- [ ] T005 [P] Run the complete repository and product automated gate from a clean final state.
- [ ] T006 [P] Run target-host ingress, auth, authorization, revocation, approval, containment, redaction, and direct-backend probes.
- [ ] T007 Run every WebSocket, relay, Pi, storage, and approval kill point.
- [ ] T008 Run real iOS/Android install, streaming, reconnect, stale state, push, logout, kill/reinstall, and revocation journeys.
- [ ] T009 Run WCAG automation plus keyboard, VoiceOver, TalkBack, zoom/reflow, reduced motion, focus, and live-region checks.
- [ ] T010 Measure latency, render cadence, queue/replay/storage bounds, restart recovery, and resource usage.
- [ ] T011 Execute the authoritative rollback order: disable mutation, remove ingress, revoke sessions/subscriptions and drain approvals/in-flight authority, stop the relay and unload the extension, restore or down-migrate the compatible database, preserve native and relay sessions plus indeterminate outcomes, then run the local Pi/read-only smoke test.
- [ ] T012 Reconcile docs, phase statuses, checklists, limitations, evidence, final diff/status, and reviewer sign-offs.
- [ ] T013 Enable read-only, mutation, and push stages only after their respective gates pass.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Run focused checks and retain exact command, output, exit, version, and environment evidence.
- [ ] T015 Run the authoritative phase gate and safe rollback or recovery exercise.
- [ ] T016 Reconcile checklist, current state, parent map, successor inputs, limitations, and scoped status.
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
