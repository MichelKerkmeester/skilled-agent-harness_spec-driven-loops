---
title: "Feature Specification: Review Drift Remediation"
description: "Reconcile the 036 phase-parent's documentation and metadata drift that the 053 runtime code review's traceability check surfaced: incomplete children_ids, a stale PHASE DOCUMENTATION MAP, legacy 065 child-alias residue, and a status contradiction in 029."
trigger_phrases:
  - "review drift remediation"
  - "036 parent metadata drift"
  - "phase documentation map refresh"
  - "legacy 065 child alias cleanup"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/008-review-and-rollback-followup"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/008-review-and-rollback-followup/054-review-drift-remediation"
    last_updated_at: "2026-08-13T14:27:57.000Z"
    last_updated_by: "markdown-agent"
    recent_action: "Documented the completed parent reconciliation, verified against the working-tree diff"
    next_safe_action: "None; packet complete, no follow-up required"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "../graph-metadata.json"
      - "../spec.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Was this reconciliation committed? Not yet; as of this documentation pass the parent-level changes are uncommitted working-tree edits, not yet landed to a commit."
---
# Feature Specification: Review Drift Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-13 |
| **Branch** | `system-deep-loop/0144-036-p0-remediation` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `053-runtime-code-review` deep-review's traceability protocols found parent-level documentation/metadata drift in `036-deep-loop-innovation`: `graph-metadata.json.children_ids` stopped at `050-trustworthy-state-records` (missing six on-disk children, 051-056); the `spec.md` PHASE DOCUMENTATION MAP still described a "17-phase program (001-017)" and had per-phase statuses that no longer matched the children's own `graph-metadata.json.derived.status`; ten planned-phase children (`004`, `006`-`014`) still carried legacy `system-deep-loop/065-deep-loop-innovation/...` child-alias duplicates in their own `children_ids`; and `029-improvement-promotion-authority` had a status contradiction between `spec.md` and `implementation-summary.md`.

### Purpose

Reconcile the parent's `graph-metadata.json`, `spec.md` PHASE DOCUMENTATION MAP, `handover.md`, and `manifest/phase-tree.json` against the current on-disk child census; drop the stale `065` child-alias duplicates from the ten affected planned-phase children; and reconcile the `029` status contradiction, so the parent's own `validate.sh --strict` reports Errors: 0 with the child manifest reachable and `GRAPH_METADATA_CHILD_DRIFT` passing.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Completing `036-deep-loop-innovation/graph-metadata.json.children_ids` to all 44 on-disk children.
- Refreshing the parent `spec.md` PHASE DOCUMENTATION MAP rows and statuses from each child's `derived.status`, and adding the map-maintenance note explaining the projection is derived, not independently authoritative.
- Dropping the legacy `system-deep-loop/065-deep-loop-innovation/...` child-alias duplicates from the ten planned-phase children (`004`, `006`, `007`, `008`, `009`, `010`, `011`, `012`, `013`, `014`) that still carried them.
- Reconciling the `029-improvement-promotion-authority` status contradiction between `spec.md` and `implementation-summary.md`.
- Refreshing `manifest/phase-tree.json` framing (17-phase to 44-live-child) and `handover.md` superseded-narrative hygiene (marking the stale 2026-08-08 metadata-staleness warning and the 024 pre-014 verdict as historically superseded rather than current truth).

### Out of Scope

- Committing these changes to git (docs-only packet, no git operations from this documentation pass).
- Fixing any runtime code finding from `053-runtime-code-review` (that packet's findings are candidates for separate remediation).
- Re-authoring any phase child's own spec.md/plan.md/tasks.md content beyond dropping the legacy `065` alias entries in `graph-metadata.json`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `spec.md` | Modify | This documentation pass, completing the packet stub |
| `plan.md` | Create | Documents the reconciliation's technical approach and phases |
| `tasks.md` | Create | Documents the reconciliation's task breakdown with evidence |
| `implementation-summary.md` | Create | Documents the reconciliation outcome and verification |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Parent `children_ids` includes every on-disk phase child | `graph-metadata.json.children_ids` has 44 entries, matching the 44 `[0-9]{3}-*` folders under the parent |
| REQ-002 | Parent's own strict validation reports Errors: 0 with the child manifest reachable and no `GRAPH_METADATA_CHILD_DRIFT` issue | `validate.sh <parent> --strict` shows `Child manifest accepted: 40 entries` and a passing `GRAPH_METADATA_CHILD_DRIFT` check |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Legacy `065` child-alias duplicates removed from the ten affected planned-phase children | None of `004`, `006`-`014`'s `graph-metadata.json.children_ids` contain a `system-deep-loop/065-deep-loop-innovation/...` entry |
| REQ-004 | `029` status contradiction reconciled | `029/spec.md` and `029/implementation-summary.md` report the same completion status |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh specs/system-deep-loop/036-deep-loop-innovation --strict` reports `Errors: 0` for the parent's own check, `Child manifest accepted: 40 entries`, and a passing `GRAPH_METADATA_CHILD_DRIFT` control.
- **SC-002**: This packet (054) itself passes `validate.sh <packet> --strict` with Errors: 0.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Parent-level changes are uncommitted | The reconciliation is durable working-tree state but not yet part of git history | Explicitly flagged in `implementation-summary.md` known limitations |
| Risk | Parent's overall strict `RESULT` is FAILED for unrelated reasons | `FRONTMATTER_MEMORY_BLOCK` and `PHASE_LINKS` warnings on the parent are outside this packet's scope (they predate this reconciliation and are not children-census or status-drift issues) | Documented precisely in verification evidence rather than overclaiming an overall PASSED result |
| Dependency | `053-runtime-code-review` findings | The parent drift was surfaced by that review's traceability check | Already available under `053-runtime-code-review/review/` |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(none)

<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
