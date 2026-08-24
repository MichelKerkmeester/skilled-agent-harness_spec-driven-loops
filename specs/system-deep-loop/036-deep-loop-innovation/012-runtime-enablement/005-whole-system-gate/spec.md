---
title: "Feature Specification: Whole-System Gate"
description: "Run the frozen-SHA whole-system gate against the enabled runtime and record a blocking verifier receipt, the first whole-system evidence that exists after authority has moved."
trigger_phrases:
  - "whole system gate"
  - "frozen sha gate"
  - "blocking verifier receipt"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate"
    last_updated_at: "2026-08-24T05:59:15Z"
    last_updated_by: "claude"
    recent_action: "Corrected the stale legacy-authority verdict; authority-state now passes on the current system"
    next_safe_action: "Re-point the stale gate to HEAD and address the reader-contract finding in the closeout"
    blockers:
      - "The gate script is pinned to a pre-deletion tree (SUITE_TREE_REF 5511e4eac2, 10 commits behind HEAD); re-pointing is a forward-fix"
      - "reader-contracts flags deep-research delta_file_malformed — a gate finding for the forward-fix closeout"
    key_files:
      - "specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate/scratch/run-gate.mjs"
    completion_pct: 70
    open_questions: []
    answered_questions:
      - "Bindings resolve from the environment; no SHA is typed by hand"
      - "All eight modes now read new_authoritative_reversible from stored records — the legacy-authority verdict is stale and corrected"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Whole-System Gate

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Blocked |
| **Created** | 2026-08-19 |
| **Owner skill** | system-deep-loop |
| **Authority posture** | No authority moves; this phase measures the enabled system |

> Phase adjacency under `012-runtime-enablement` (navigation order): predecessor `004-legacy-writer-retirement`;
> successor `006-enablement-closeout`.
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Each preceding phase verified its own surface. Nothing has yet measured the whole enabled system at one frozen commit,
against one baseline, in one run. Per-phase evidence accumulated over days does not answer whether the system as it now
stands is sound, because each phase's evidence was captured against a different tree.

### Purpose

Run the whole-system gate at a frozen candidate SHA against a frozen baseline and record a receipt that says pass or
fail for the system as a unit.

### Ordering note

With no rollback window, this gate arrives after authority has already moved. That ordering follows directly from the
ratified direct-flip policy and is recorded so it is not mistaken for an oversight. Its practical consequence is that
this gate's job is to detect, not to prevent — prevention lived in the per-phase gates, and a failure here produces a
forward fix rather than a reversal.

### Calibration

> **Severity calibration (carry verbatim, do not re-escalate).** In every confirmed case the actor is the operator or
> a stale local file, not a remote attacker. Read every P0 and P1 below as **cutover-readiness and robustness risk,
> not breach risk**.

### Non-Goals

- Fixing what the gate finds. A failure opens a forward-fix phase; it is not repaired inside the gate run.
- Any authority change.
- Documentation and status reconciliation, which is `006`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Freeze a candidate SHA and a baseline SHA, both resolved from the environment rather than typed.
- Execute the full gate: runtime suite, per-mode reader contracts, authority-state read across all seven modes, and a
  real fan-out run.
- Record a receipt that names the SHAs, the checks, and the verdict.
- Report the result as a delta against the baseline, not as a bare pass.

### Out of Scope

- Remediation of findings.
- Any change to runtime code, protocol documents, or authority records.

### Affected Surfaces

| Surface | Change |
|---------|--------|
| Evidence artifacts | New receipt and gate output |
| Runtime code | None; this phase is read-and-measure only |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: The candidate and baseline SHAs are resolved from the environment, never supplied by hand.
- **REQ-002**: Every check in the gate runs against the same frozen candidate; a check run against a different tree is
  not admissible.
- **REQ-003**: The receipt names the SHAs, every check, and the verdict, and is written whether the gate passes or fails.
- **REQ-004**: The result is reported as a delta against the baseline.
- **REQ-005**: The gate changes no runtime code, no protocol document, and no authority record.
- **REQ-006**: A failing check produces a failing verdict; there is no advisory tier that lets a failure pass.
- **REQ-007**: The gate includes a real fan-out run, not a fixture.
- **REQ-008**: The authority state of all seven modes is read and recorded as part of the gate.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A receipt exists naming both SHAs, every check, and a verdict.
- **SC-002**: Every check in the receipt is confirmed to have run against the frozen candidate.
- **SC-003**: The runtime suite result is expressed as a delta against the baseline.
- **SC-004**: A real fan-out run completed within the gate.
- **SC-005**: All seven modes' authority states are recorded in the receipt.
- **SC-006**: The working tree is unchanged by the gate run, proven by status and diff.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Consequence | Mitigation |
|------|-------------|------------|
| Checks drift across trees during a long run | The receipt describes a system that never existed at one commit | REQ-002 freezes the candidate and every check is confirmed against it |
| A failure is softened into a warning | The receipt reads as a pass and the defect ships | REQ-006 admits no advisory tier |
| The gate mutates state while measuring | Evidence and system disagree afterwards | SC-006 proves the tree is unchanged |
| A green gate on a narrow check set | False confidence at the exact moment it matters most | The check set is enumerated in the receipt so its breadth is visible rather than implied |

**Dependencies**: `004-legacy-writer-retirement` complete.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None requiring an operator. The SHAs resolve from the environment and the check set is enumerated in this spec.
<!-- /ANCHOR:questions -->
