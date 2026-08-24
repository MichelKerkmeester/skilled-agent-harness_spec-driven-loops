---
title: "Feature Specification: Legacy Writer Retirement"
description: "Retire the direct-append write paths now that every mode writes through the gateway, while keeping the legacy files readable as projections for their existing consumers."
trigger_phrases:
  - "legacy writer retirement"
  - "direct append removal"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/004-legacy-writer-retirement"
    last_updated_at: "2026-08-24T08:00:07Z"
    last_updated_by: "claude"
    recent_action: "Retirement mechanisms in place; guard widened to enforce under finalized authority"
    next_safe_action: "None; phase complete and reconciled against the finalized runtime"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/check-direct-append.cjs"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Retiring a writer is not deleting a file; the projection keeps the file current"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Legacy Writer Retirement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/004-legacy-writer-retirement |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-19 |
| **Owner skill** | system-deep-loop |
| **Authority posture** | No authority moves; the losing writer is removed |

> Phase adjacency under `012-runtime-enablement` (navigation order): predecessor `003-fleet-enablement`;
> successor `005-whole-system-gate`.
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After the fleet is enabled, every mode's canonical writes go through the gateway, but the direct-append paths still
exist. A path that still works is a path something will eventually use — a stale agent instruction, a copied snippet,
an older script. Two writers with no ordering between them is the exact failure the gateway was built to remove, and
leaving the second one in place means the system only behaves correctly by convention.

### Purpose

Remove the direct-append write paths and add an enforcement that makes a regression loud instead of silent.

### Calibration

> **Severity calibration (carry verbatim, do not re-escalate).** In every confirmed case the actor is the operator or
> a stale local file, not a remote attacker. Read every P0 and P1 below as **cutover-readiness and robustness risk,
> not breach risk**.

### Non-Goals

- Deleting the legacy files. They remain, maintained by the projection, because their consumers are real and current.
- Removing the projection engine or the manifest.
- Changing any mode's authority.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Remove direct-append instructions from every mode's protocol documents.
- Remove or neutralise executable direct-append code paths.
- Add an enforcement that detects a direct append after retirement and fails rather than tolerating it.
- Re-confirm that every legacy file is still produced by the projection after its writer is gone.

### Out of Scope

- Deleting legacy files or their readers.
- The whole-system gate and closeout documentation.

### Affected Surfaces

| Surface | Change |
|---------|--------|
| Seven mode protocol document sets | Direct-append instructions removed |
| Direct-append code paths | Removed or neutralised |
| Enforcement | New guard that fails on a post-retirement direct append |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: No mode's protocol documents instruct a direct append after this phase.
- **REQ-002**: No executable direct-append path remains reachable.
- **REQ-003**: A direct append attempted after retirement is detected and fails loudly.
- **REQ-004**: Every legacy file named in the projection manifest is still produced after its writer is retired.
- **REQ-005**: Every legacy file's consumers still run against the projected file.
- **REQ-006**: The retirement is verified by search across the whole skill tree, not only the files this phase edited.
- **REQ-007**: No mode's authority record changes during this phase.
- **REQ-008**: The enforcement is tested by a real attempted direct append, not by inspection.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A tree-wide search finds no remaining direct-append instruction in any mode's protocol documents.
- **SC-002**: A tree-wide search finds no remaining reachable direct-append code path.
- **SC-003**: An attempted direct append fails, proven by performing one.
- **SC-004**: Every manifest-named legacy file exists and is current after a run, with its writer retired.
- **SC-005**: Every consumer of every legacy file runs successfully post-retirement.
- **SC-006**: All authority records are byte-identical to their pre-phase state.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Consequence | Mitigation |
|------|-------------|------------|
| A file loses its only producer | A consumer silently reads a stale or absent file | SC-004 checks every manifest-named file after retirement, per mode, rather than sampling |
| A direct-append path is missed | Two writers persist and the guarantee is fictional | REQ-006 searches the whole tree; REQ-003 makes a missed path fail rather than work |
| The enforcement is itself untested | A guard that has never fired is an assumption | REQ-008 requires an actual attempted direct append |
| Protocol edits change agent behaviour subtly | Agents produce differently shaped records | The gateway validates envelopes, so a shape change fails at the boundary instead of reaching disk |

**Dependencies**: `003-fleet-enablement` complete, with all seven modes on ledger authority.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None requiring an operator. Whether a specific direct-append path is removed or neutralised is an implementation
choice made per path, recorded in the summary.
<!-- /ANCHOR:questions -->
