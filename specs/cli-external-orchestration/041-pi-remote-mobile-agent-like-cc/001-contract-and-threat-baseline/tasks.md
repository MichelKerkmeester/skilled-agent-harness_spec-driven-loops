---
title: "Tasks: Contract and Threat Baseline"
description: "Dependency-ordered task ledger for contract and threat baseline."
trigger_phrases:
  - "pi remote contract and threat baseline"
  - "pi mobile phase 1"
  - "contract and threat baseline"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/001-contract-and-threat-baseline"
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

# Tasks: Contract and Threat Baseline

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

- [ ] T004 Confirm repository surface, package manager, workspace choice, host OS, deployment user, and target devices.
- [ ] T005 [P] Capture Pi version, help, RPC docs/types, LF framing, settlement, session layout, and extension loading.
- [ ] T006 [P] Capture Tailscale Serve HTTPS/WSS identity, header, loopback, and Funnel behavior.
- [ ] T007 Define command/event/envelope schemas, stream epochs, mutation states, authorization matrix, redaction classes, and retention bounds.
- [ ] T008 Author the threat model and map each risk to a phase-002 negative control.
- [ ] T009 Review the frozen baseline with relay, PWA, security, testing, documentation, and release consumers.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run focused checks and retain exact command, output, exit, version, and environment evidence.
- [ ] T011 Run the authoritative phase gate and safe rollback or recovery exercise.
- [ ] T012 Reconcile checklist, current state, parent map, successor inputs, limitations, and scoped status.
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
