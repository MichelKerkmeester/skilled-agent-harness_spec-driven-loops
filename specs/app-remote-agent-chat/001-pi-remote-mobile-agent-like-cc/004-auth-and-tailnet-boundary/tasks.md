---
title: "Tasks: Authentication and Tailnet Boundary"
description: "Dependency-ordered task ledger for authentication and tailnet boundary."
trigger_phrases:
  - "pi remote auth and tailnet boundary"
  - "pi mobile phase 4"
  - "auth and tailnet boundary"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/004-auth-and-tailnet-boundary"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the task ledger with the implemented auth boundary"
    next_safe_action: "Run the real Tailscale Serve ingress matrix"
    blockers:
      - "Real Tailscale Serve ingress remains operator-unverified"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 85
---

# Tasks: Authentication and Tailnet Boundary

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

The auth boundary exists under `.pi/pi-remote/`. Unchecked rows remain evidence or operator-verification work and do not mean implementation is absent.
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

- [ ] T004 Confirm the target-host Serve identity and header contract with negative controls.
- [ ] T005 [P] Implement loopback binding, HTTP bootstrap, secure cookie/session lifecycle, and logout.
- [ ] T006 [P] Implement one-use short-lived WebSocket tickets and exact-Origin handshake validation.
- [ ] T007 Implement default-deny principal/workspace/session/command authorization and revocation.
- [ ] T008 Implement size, rate, malformed-message, and connection limits.
- [ ] T009 Configure Tailscale Serve with Funnel absent and direct-backend rejection.
- [ ] T010 Expose only read-only catalog, snapshot, replay, state, and health operations.
- [ ] T011 Pass ingress spoofing, ticket replay, Origin, revocation, and bypass suites.
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
