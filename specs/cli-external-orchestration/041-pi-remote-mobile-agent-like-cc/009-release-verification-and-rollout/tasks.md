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
    packet_pointer: "cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/009-release-verification-and-rollout"
    last_updated_at: "2026-08-10T18:43:21Z"
    last_updated_by: "codex"
    recent_action: "Authored the approved phase planning packet"
    next_safe_action: "Run this phase's definition-of-ready checks before implementation"
    blockers:
      - "Product implementation for this phase has not started"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    completion_pct: 0
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

No production task is complete. This packet records approved scope only.
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
- [ ] T011 Execute backup, restore, mutation disablement, ingress removal, relay stop, extension unload, and local Pi rollback drill.
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
