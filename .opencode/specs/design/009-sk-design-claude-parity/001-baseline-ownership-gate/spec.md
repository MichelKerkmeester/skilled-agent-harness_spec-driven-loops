---
title: "Feature Specification: Phase 001 — Baseline Ownership Gate"
description: "Level 2 specification for freezing baseline evidence and resolving ownership before sk-design refactor work begins."
trigger_phrases:
  - "baseline"
  - "ownership"
  - "sk-design"
  - "gate"
  - "phase 001"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/design/009-sk-design-claude-parity/001-baseline-ownership-gate/"
    last_updated_at: "2026-07-05"
    last_updated_by: "markdown-leaf-agent"
    recent_action: "Created planned Level 2 baseline ownership gate docs."
    next_safe_action: "Collect read-only sk-design status and benchmark baseline before implementation."
---
# Feature Specification: Phase 001 — Baseline Ownership Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned / not started |
| **Created** | 2026-07-05 |
| **Phase Folder** | `.opencode/specs/design/009-sk-design-claude-parity/001-baseline-ownership-gate/` |
| **Parent Packet** | `.opencode/specs/design/009-sk-design-claude-parity/` |
| **Writable Scope** | Phase 001 documentation only until ownership is resolved |

<!-- /ANCHOR:metadata -->
---

## Phase Navigation

| Link | Target |
|------|--------|
| **Parent Spec** | ../spec.md |
| **Predecessor Phase** | None |
| **Successor Phase** | ../002-parent-hub-compatibility-shell/spec.md |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-design parity refactor must not begin while existing or uncommitted `sk-design` changes have unclear ownership. Without a frozen baseline, later refactor phases could mix authored changes with pre-existing work, invalidate benchmark comparisons, or leave no reliable rollback point.

### Purpose
Create a hard ownership gate that records the current baseline, inventories touched files, assigns responsibility for pending changes, names rollback procedure, and defines acceptance thresholds before any implementation or refactor writes are allowed.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Capture a baseline snapshot of current `sk-design` behavior and relevant benchmark state.
- Inventory touched and pending `sk-design` files before implementation work.
- Decide whether pending changes are owned by this phase, a prior phase, a user-authored change, or a later release gate.
- Define release authority and threshold authority for benchmark acceptance.
- Name rollback path and stop conditions for later phases.
- Record parent-packet invariants that later phases must preserve.

### Out of Scope
- Editing `.opencode/skills/sk-design/**`.
- Editing parent root files, sibling phases, `external/**`, or `research/**`.
- Refactor implementation, prompt rewrites, MCP changes, benchmark remediation, or agent dispatch.
- Git mutations including commit, stash, branch, merge, rebase, or reset.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create/update | Phase 001 scope, requirements, success criteria, and constraints |
| `plan.md` | Create/update | Gate execution plan, evidence flow, rollback, and dependencies |
| `tasks.md` | Create/update | Pending work queue for baseline and ownership decisions |
| `checklist.md` | Create/update | P0/P1 gate checklist with required evidence |
| `implementation-summary.md` | Create/update | Planned/not-started state and non-completion record |

### Evidence to Collect During Phase Execution

| Evidence | Source | Required Before Implementation? |
|----------|--------|----------------------------------|
| Current touched-file inventory | `git status --short` plus scoped file review | Yes |
| Current `sk-design` diff inventory | Scoped diff/read-only inspection of `.opencode/skills/sk-design/**` | Yes |
| Benchmark baseline | Existing benchmark command outputs or curated prior result files | Yes |
| Ownership decision | Written decision in this phase's docs | Yes |
| Rollback path | Concrete command/file reversal plan approved before implementation | Yes |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No implementation writes before ownership is resolved | Checklist records the gate as closed before any `.opencode/skills/sk-design/**` edit occurs |
| REQ-002 | Baseline snapshot captured | Commands, artifacts, timestamps, and baseline verdict are recorded in phase docs |
| REQ-003 | Touched-file inventory captured | Every existing or uncommitted `sk-design` path is listed with owner, status, and disposition |
| REQ-004 | Ownership decision recorded | Pending changes are assigned to preserve, revert, absorb, or defer with rationale |
| REQ-005 | Rollback plan named | Later phases have a concrete rollback path and stop trigger before writes begin |
| REQ-006 | Parent invariants documented | Later phases know which parity, design, and doc boundaries cannot drift |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Benchmark acceptance thresholds defined | Later phases can compare against explicit pass/fail thresholds |
| REQ-008 | Release and threshold authority identified | Decision owner is documented for accepting baseline deltas |
| REQ-009 | Evidence collection commands listed | Required commands are recorded for repeatable collection without git mutation |
| REQ-010 | Handoff criteria documented | Phase can stop with a clear next-phase go/no-go statement |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No code or skill implementation file changes occur before the baseline ownership gate is closed.
- **SC-002**: Baseline snapshot and benchmark evidence are recorded with enough detail for later replay.
- **SC-003**: Touched files have explicit owner, disposition, and rollback impact.
- **SC-004**: Later phases receive acceptance thresholds and stop conditions before implementation begins.
- **SC-005**: Phase documents state planned/not-started status until evidence proves the gate is closed.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Pre-existing changes are accidentally absorbed | Refactor authorship becomes unclear | Require owner/disposition row per touched file |
| Risk | Baseline command differs from later benchmark command | Threshold comparison becomes invalid | Record exact command, environment, and artifact path |
| Risk | Rollback path depends on uncommitted work | Reversal can destroy unrelated changes | Name non-destructive rollback first; ask before destructive action |
| Dependency | User or maintainer authority | Ownership decisions may be blocked | Record unresolved authority as a P0 blocker |
| Dependency | Parent parity intent | Later phases may optimize the wrong target | Preserve parent invariants in the gate docs |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Traceability
- **NFR-T01**: Each baseline artifact must have a source command or file path.
- **NFR-T02**: Each ownership decision must name the responsible authority or mark it blocked.

### Safety
- **NFR-S01**: No git mutation is allowed during baseline evidence collection.
- **NFR-S02**: Destructive rollback requires a named undo path and explicit confirmation.

### Repeatability
- **NFR-R01**: Benchmark evidence must be replayable by later phases.
- **NFR-R02**: Acceptance thresholds must be expressed as pass/fail criteria, not narrative preference.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **No touched `sk-design` files**: Record an empty inventory with command evidence and close the ownership branch.
- **Touched files outside `sk-design`**: Record them as out-of-scope blockers rather than absorbing them into this phase.
- **Generated benchmark outputs**: Store only approved evidence paths; do not mutate source or benchmark fixtures during capture.

### Error Scenarios
- **Git status unavailable**: Mark baseline capture blocked and do not proceed to implementation.
- **Benchmark command unavailable**: Record the missing command as a P1 blocker unless user approves a documented deferral.
- **Ownership authority unavailable**: Keep the phase planned/not-started and do not unlock later implementation.

### Concurrent Operations
- **User changes files during gate execution**: Re-run inventory before closure and update the owner/disposition table.
- **Sibling phase writes occur**: Treat sibling evidence as external context; do not edit sibling phase docs from this phase.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Who has final authority to accept benchmark threshold deltas? **Resolution required before implementation.**
- Which pending `sk-design` changes, if any, are user-authored and must be preserved? **Resolution required before implementation.**
- Which exact benchmark command is canonical for the parity baseline? **Resolution required before implementation.**

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:related-docs -->
