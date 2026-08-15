---
title: "Tasks: Automated Test Harness"
description: "Dependency-ordered task ledger for automated test harness."
trigger_phrases:
  - "pi remote automated test harness"
  - "pi mobile phase 2"
  - "automated test harness"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/002-automated-test-harness"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the task ledger with the implemented harness"
    next_safe_action: "Retain machine evidence while phase 009 collects operator-only gates"
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

# Tasks: Automated Test Harness

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

The harness exists under `.pi/pi-remote/`. Unchecked rows remain an evidence-reconciliation ledger and do not mean implementation is absent.
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

- [ ] T004 Import the sanitized baseline fixtures and define fixture version metadata.
- [ ] T005 [P] Implement strict-LF parser, response/event, reducer, authorization, digest, and redaction unit/property tests.
- [ ] T006 [P] Implement temporary database migration, transaction, replay, mutation, and approval state tests.
- [ ] T007 Implement isolated real-child integration fixtures with health and teardown assertions.
- [ ] T008 Implement the WebSocket/relay/Pi kill-point controller and mutation ambiguity oracle.
- [ ] T009 Implement Origin, ticket, revocation, cross-workspace, approval race, containment, and canary suites.
- [ ] T010 Implement browser reducer and foreground PWA journeys with recorded streams.
- [ ] T011 Publish one authoritative command matrix and evidence schema for phases 003 through 009.
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
