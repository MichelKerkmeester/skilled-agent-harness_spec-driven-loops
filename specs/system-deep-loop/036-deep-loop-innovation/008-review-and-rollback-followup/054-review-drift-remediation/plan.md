---
title: "Implementation Plan: Review Drift Remediation"
description: "Technical plan for reconciling the 036 parent's documentation and metadata drift. All 3 phases complete, verified against the current working-tree diff."
trigger_phrases:
  - "review drift remediation plan"
  - "graph-metadata children_ids reconciliation"
  - "phase documentation map maintenance"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/008-review-and-rollback-followup/054-review-drift-remediation"
    last_updated_at: "2026-08-13T08:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Documented the 3-phase reconciliation plan against the verified diff"
    next_safe_action: "None; packet complete, no follow-up required"
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Review Drift Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + JSON spec-kit metadata |
| **Runtime surface** | `specs/system-deep-loop/036-deep-loop-innovation` parent packet and its phase children |
| **Storage** | `graph-metadata.json`, `spec.md`, `handover.md`, `manifest/phase-tree.json` |
| **Testing** | `validate.sh --strict` (auto-recursive for phase parents) |

### Overview

The 053 review's traceability check surfaced parent-level drift that predates any code fix: an incomplete `children_ids` list, a stale phase-count narrative in `spec.md`, legacy `065`-prefixed child-alias duplicates in ten planned-phase children, and a status contradiction in `029`. This packet reconciles all four, keeping the change docs-and-metadata-only.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Drift confirmed against current `git diff` of the affected files, not assumed from the review report alone
- [x] All ten affected planned-phase children identified (`004`, `006`-`014`) by `git status` showing their `graph-metadata.json` as modified
- [x] `029` status contradiction confirmed resolved (both `spec.md` and `implementation-summary.md` now read "Complete")

### Definition of Done

- [x] `children_ids` in the parent `graph-metadata.json` lists all 44 on-disk children
- [x] Parent `spec.md` PHASE DOCUMENTATION MAP rows and statuses match each child's `derived.status`, with a map-maintenance note added
- [x] Legacy `065` child-alias duplicates dropped from all ten affected children's `graph-metadata.json`
- [x] `handover.md` and `manifest/phase-tree.json` framing updated to the live 44-child reality, with superseded narrative marked rather than deleted

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Metadata-and-documentation reconciliation against a live census — the parent's `graph-metadata.json.children_ids` and `spec.md` PHASE DOCUMENTATION MAP are treated as a maintained projection of each child's own `graph-metadata.json.derived.status`, not an independent source of truth.

### Key Components

- **`036-deep-loop-innovation/graph-metadata.json`** — parent-level child manifest; `children_ids` extended from 38 to 44 entries (added `051`-`056`).
- **`036-deep-loop-innovation/spec.md` PHASE DOCUMENTATION MAP** — refreshed per-row statuses copied from each child's `derived.status`; added rows for `033`, `035`, `051`-`056`; added a "Map maintenance" note.
- **Ten planned-phase children's `graph-metadata.json`** (`004`, `006`-`014`) — each had 1-3 legacy `system-deep-loop/065-deep-loop-innovation/...` duplicate entries removed from `children_ids`, leaving only the correct `036-deep-loop-innovation/...` entries.
- **`029-improvement-promotion-authority`** — `spec.md` and `implementation-summary.md` now both read "Complete (13/13 findings landed...)".
- **`handover.md` / `manifest/phase-tree.json`** — framing updated from "17-phase program" to "44 qualifying direct children"; stale 2026-08-08 metadata-staleness warning marked as a superseded historical narrative rather than deleted.

### Data Flow

1. Enumerate on-disk `[0-9]{3}-*` folders under the parent (44 total, verified via `ls`).
2. Compare against `graph-metadata.json.children_ids` (was 38, missing `051`-`056`) and extend to match.
3. For the PHASE DOCUMENTATION MAP, read each child's own `graph-metadata.json.derived.status` and copy it into the corresponding map row.
4. For the ten affected planned-phase children, remove any `children_ids` entry prefixed `system-deep-loop/065-deep-loop-innovation/` that duplicates a `036-deep-loop-innovation/` entry.
5. Reconcile `029`'s two status fields to agree.
6. Update `handover.md` and `manifest/phase-tree.json` narrative framing to describe the live 44-child state, keeping historically-superseded narrative marked in place for audit trail.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Children census reconciliation

- [x] Extend `graph-metadata.json.children_ids` from 38 to 44 entries, adding `051`-`056` — verified via `git diff` showing exactly this 6-entry addition
- [x] Confirm `GRAPH_METADATA_CHILD_DRIFT` passes on the parent after the extension

### Phase 2: Phase map and legacy alias cleanup

- [x] Refresh `spec.md` PHASE DOCUMENTATION MAP rows/statuses from each child's `derived.status`, add rows for `033`, `035`, `051`-`056`, add the map-maintenance note
- [x] Drop legacy `065` child-alias duplicates from `004`, `006`, `007`, `008`, `009`, `010`, `011`, `012`, `013`, `014` — verified via per-file `git diff` on `004`'s `graph-metadata.json` showing 3 removed `065`-prefixed lines

### Phase 3: Status reconciliation and narrative hygiene

- [x] Reconcile `029/spec.md` and `029/implementation-summary.md` to the same "Complete" status
- [x] Update `handover.md` and `manifest/phase-tree.json` framing to the live 44-child state; mark the stale 2026-08-08 metadata-staleness warning and the 024 pre-014 verdict as superseded narrative

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Strict packet validation | Parent `036-deep-loop-innovation` (auto-recursive) | `validate.sh <parent> --strict` |
| Diff verification | Every claimed edit | `git diff` / `git status` against the current working tree |
| Strict packet validation | This packet (054) itself | `validate.sh <packet> --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `053-runtime-code-review` traceability findings | Internal | Available under `review/` | Drift would not have been surfaced |
| Working-tree edits to parent metadata/docs | Internal | Present, uncommitted | REQ-001/REQ-002 could not be verified |
| `validate.sh --strict` | Internal | Available and run | Reconciliation could not be confirmed |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A later child census finds the parent `children_ids` list has drifted out of sync again, or a `065`-alias duplicate reappears.
- **Procedure**:
  1. Re-run the same census-and-reconcile approach: enumerate on-disk children, diff against `children_ids`, extend as needed.
  2. Re-check every planned-phase child's `graph-metadata.json` for reintroduced legacy-prefix duplicates before extending its own `children_ids`.

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
