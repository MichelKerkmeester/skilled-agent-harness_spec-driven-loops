---
title: "Implementation Plan: Devin feature catalog"
description: "Plan for authoring cli-devin's feature-catalog package, with the hooks category as the highest-scrutiny section for dormancy-status accuracy."
trigger_phrases: ["devin feature catalog plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/010-devin-feature-catalog"
    last_updated_at: "2026-07-24T17:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored Level 3 plan: dependency graph, LUNA dispatch mechanism, milestones"
    next_safe_action: "Wait for dependency phases (003/005/009), then run Phase 1 of tasks.md"
    blockers: ["Depends on 003/005/009 for real content; 004/008 already provide the hooks category's source material"]
    key_files: ["spec.md", "tasks.md", "decision-record.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Devin feature catalog

<!-- ANCHOR:summary -->
## 1. SUMMARY
Author `cli-devin/feature-catalog/` (7 categories, `create-feature-catalog`'s exact package contract) once dependency phases land, with `hooks` as the highest-scrutiny category: 8 per-feature files, each citing a dated dormancy status from the 3-value enum in `spec.md` REQ-004, never overstating coverage. Actual content authoring dispatches to `gpt-5.6-luna` (`xhigh`, `fast`) via `cli-codex`, per operator direction; this phase's own deliverable in this pass is the spec-kit documents only.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- Every `hooks` per-feature file's dormancy status traces to a dated live-verification citation, never an undated assumption.
- No category describes a not-yet-shipped capability as current behavior.
- `create-feature-catalog`'s shared validators pass clean on the root and every per-feature leaf.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Root catalog (`feature-catalog.md`) is inventory-and-navigation only; each of the 7 categories gets its own kebab-case folder with one per-feature file per root entry. The `hooks` category is structurally identical to the other 6 in package shape, but carries an extra mandatory field (dormancy status) not required elsewhere -- enforced by REQ-004/REQ-005/REQ-006 as content requirements, not a schema change to `create-feature-catalog` itself (this phase does not modify the shared skill).
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
None -- this is new-package creation under a not-yet-existing `cli-devin/` skill directory, not a fix to existing behavior.
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Dependency confirmation
Confirm which of phases 003/005/009 have landed by implementation time; for each still-Planned, prepare the explicit "Planned capability" stub language rather than fabricating shipped-behavior prose.

### Phase 2: Category and taxonomy lock
Stabilize the 7 category names and the 8 hook-event feature slugs before drafting any prose, per `create-feature-catalog`'s own "stabilize names before polishing" authoring order.

### Phase 3: Dispatch content authoring to LUNA
Compose the `cli-codex` dispatch prompt (model `gpt-5.6-luna`, effort `xhigh`, tier `fast`), including the spec folder (pre-approved), the 3-value dormancy enum, and direct citations to phases 001/004/005/008/009's actual docs -- never asking LUNA to invent hook behavior.

### Phase 4: Validation and closeout
Run `create-feature-catalog`'s shared validators; manually spot-check root-to-feature-file parity, dormancy-status accuracy against each source phase's current `Status` field, and cross-links to phase 006's playbook.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
`create-feature-catalog`'s own validators (`validate_document.py`, `extract_structure.py`, `check_no_hyphenated_catalog_content.py`) plus a manual accuracy pass cross-referencing each `hooks` entry's dormancy status against the cited source phase's actual current state -- not just structural validity.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
Phases 003 (skill packet must exist to host `feature-catalog/`), 005 (model registry, for `model-dispatch`), 009 (MCP host, for `mcp-host-integration`). Phases 004/008 already provide the `hooks` category's complete source material regardless of their own implementation status.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Delete `cli-devin/feature-catalog/`. No other surface is touched; the package is purely additive documentation.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
Phase 1 (dependency confirmation) → Phase 2 (taxonomy lock) → Phase 3 (LUNA dispatch authoring) → Phase 4 (validation).
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
Medium -- taxonomy/requirements work is contained, but content authoring across 7 categories and ~15-20 per-feature files (dispatched, not manual) plus accuracy spot-checking is substantial.
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
No feature flag needed -- additive documentation package, no runtime behavior change, no data migration.
<!-- /ANCHOR:enhanced-rollback -->

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH
`003/005/009 (capabilities exist)` + `004/008 (hooks source material, regardless of their own build status)` → Phase 1 (confirm what's real) → Phase 2 (taxonomy) → Phase 3 (LUNA authoring) → Phase 4 (validate).
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH
1. **Phase 1 dependency confirmation** -- CRITICAL, determines which categories get real content vs. stubs
2. **Phase 3 LUNA dispatch authoring** -- CRITICAL, the actual deliverable
3. **Phase 4 validation** -- CRITICAL, the honesty gate

**Parallel Opportunities**: once taxonomy is locked (Phase 2), the 7 categories' content can be dispatched to LUNA in parallel batches, since per-feature files don't depend on each other.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES
| Milestone | Description | Success Criteria |
|---|---|---|
| M1 | Taxonomy locked | 7 category names + 8 hook-event slugs stable |
| M2 | Content dispatched | LUNA authoring complete for all categories with real or stub content |
| M3 | Validated | Shared validators pass; manual dormancy-accuracy spot-check clean |
<!-- /ANCHOR:milestones -->

## L3: ARCHITECTURE DECISION RECORD
1 ADR governs this phase: the dormancy-status enum and its enforcement mechanism (ADR-001). See `decision-record.md`.

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirmed which of phases 003/005/009 have landed
- [ ] Confirmed phase 004/008's current dormancy status hasn't changed (re-run the probe methodology if the installed `devin` version differs from 3000.2.17)
- [ ] Confirmed the LUNA dispatch prompt cites exact source documents, never asking for invented behavior

### Execution Rules
| Rule | Requirement |
|---|---|
| TASK-SEQ | Lock taxonomy (Phase 2) before any LUNA dispatch (Phase 3) |
| TASK-SCOPE | Touch only `cli-devin/feature-catalog/**` -- never edit `manual-testing-playbook/` (phase 006's scope) or any hook adapter source file |

### Status Reporting Format
Report each completed task as `T### done: <one-line evidence>`; report blocked tasks as `T### blocked: <reason>`.

### Blocked Task Protocol
If a dependency phase (003/005/009) is still Planned at implementation time, do not fabricate its category's content -- author the explicit stub per REQ-008, mark the task `[B]` referencing the real blocker, and proceed with the categories that do have real content.
<!-- /ANCHOR:ai-execution -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`, `decision-record.md`
