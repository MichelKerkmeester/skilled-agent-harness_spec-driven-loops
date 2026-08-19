---
title: "Feature Specification: Fleet Enablement"
description: "Apply the proven pilot pattern to the six remaining deep-loop modes as an automated serial loop, so enabling the fleet is one command rather than six hand-driven cutovers."
trigger_phrases:
  - "fleet enablement"
  - "remaining mode cutover"
  - "serial authority loop"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/003-fleet-enablement"
    last_updated_at: "2026-08-19T19:30:00Z"
    last_updated_by: "claude"
    recent_action: "Built the driver, CLI and both suites; 12 guards proven by negative control"
    next_safe_action: "Operator decision on the missing flip transitions"
    blockers:
      - "No mode can reach cutover_ready, so no mode can be enabled"
      - "deep-improvement-common has no working name on the append CLI"
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/fleet-enablement/enablement-driver.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/enable-modes.cjs"
    completion_pct: 65
    open_questions: []
    answered_questions:
      - "Serial execution is enforced in code by MULTI_MODE_REQUEST_REJECTED"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Fleet Enablement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/003-fleet-enablement |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Blocked |
| **Created** | 2026-08-19 |
| **Owner skill** | system-deep-loop |
| **Modes** | `review`, `ai-council`, `agent-improvement`, `model-benchmark`, `skill-benchmark`, `alignment` |
| **Authority posture** | Authority moves for six modes, forward only, one at a time |

> Phase adjacency under `012-runtime-enablement` (navigation order): predecessor `002-deep-research-enablement`;
> successor `004-legacy-writer-retirement`.
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The mode registry names seven canonical modes. The pilot enables one. The other six — `review`, `ai-council`,
`agent-improvement`, `model-benchmark`, `skill-benchmark`, and `alignment` — still write through prose protocol and
still resolve to legacy authority.

Enabling them one at a time by hand would be six repetitions of a procedure that has already been proven once. That is
exactly the kind of work that should not require a person, and exactly the kind of repetition where a hand-driven step
gets skipped on mode four and nobody notices until mode six behaves differently.

### Purpose

Turn the pilot's procedure into a driver that enables the remaining modes serially, with per-mode gates, and stops on
the first failure rather than continuing.

### Calibration

> **Severity calibration (carry verbatim, do not re-escalate).** In every confirmed case the actor is the operator or
> a stale local file, not a remote attacker. Read every P0 and P1 below as **cutover-readiness and robustness risk,
> not breach risk**.

### Non-Goals

- Parallel flips. `requestCutover` rejects a multi-mode request with `MULTI_MODE_REQUEST_REJECTED`, so serial is not a
  preference to be revisited — it is the contract.
- Re-flipping `research`, which the pilot already moved.
- Legacy-writer deletion, the whole-system gate, and closeout docs.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A driver that takes the mode list in a fixed order and, per mode, migrates the write protocol, captures parity,
  gates on it, flips, and verifies.
- Per-mode reader contracts derived from the projection manifest rather than assumed from the pilot's six consumers,
  because each mode has its own readers.
- A stop-on-first-failure policy with the failing mode and the failing check both named.
- A resumable run, so a stop at mode four does not force modes one through three to be redone.

### Out of Scope

- Any change to the gateway or projection engine. If the fleet needs one, that is a defect in `001` and returns there.
- The `research` mode.

### Affected Surfaces

| Surface | Change |
|---------|--------|
| Six mode protocol document sets | Canonical instruction becomes the gateway |
| Six mode composition seams | Persistence boundary resolves through the gateway |
| Six mode authority records | Move from legacy to ledger, once each |
| `runtime/scripts/` | New enablement driver |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: The driver enables modes in a fixed, recorded order; the order is data, not scattered through code.
- **REQ-002**: Each mode passes its own parity gate before its own flip; one mode's green never satisfies another's gate.
- **REQ-003**: Each mode's reader contract is derived from the projection manifest entries for that mode.
- **REQ-004**: The driver stops on the first failure and names both the mode and the failing check.
- **REQ-005**: A stopped run is resumable without re-flipping modes that already succeeded.
- **REQ-006**: The driver requests exactly one mode per call; a multi-mode request is never constructed.
- **REQ-007**: No operator input is required between modes.
- **REQ-008**: After a full run, all seven canonical modes resolve to ledger authority.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A dry run over all six modes reports what it would do per mode without changing any authority record.
- **SC-002**: An injected failure on one mode stops the driver, and the modes after it are provably untouched.
- **SC-003**: Resuming after that stop enables the remaining modes without re-flipping the earlier ones.
- **SC-004**: Every mode's reader contract passes against its own projected files.
- **SC-005**: After a full run, an independent read of all seven authority records shows ledger authority.
- **SC-006**: The run required no operator input after it started.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Consequence | Mitigation |
|------|-------------|------------|
| The pilot's pattern does not generalise | A mode fails midway with authority already moved for earlier modes | Dry run first, stop-on-first-failure, and a resumable driver so a stop is a pause rather than a mess |
| Per-mode readers differ from the pilot's | A mode's legacy consumers break silently | REQ-003 derives each contract from that mode's manifest entries rather than reusing the pilot's list |
| Partial-fleet state is confusing | Some modes on ledger, some on legacy, no one knows which | SC-005 reads all seven records independently and reports the actual state |
| A mode has no manifest entry | Its legacy files stop being maintained without anyone noticing | Treat a missing entry as a failure, not as "nothing to project" |

**Dependencies**: `002-deep-research-enablement` complete, including its fan-out proof.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None requiring an operator. The mode order is a recorded implementation choice; the serial constraint is fixed by
`MULTI_MODE_REQUEST_REJECTED`; the rollback policy is settled.
<!-- /ANCHOR:questions -->
