---
title: "Feature Specification: Phase 3: deprecation-mechanics [template:level-1/spec.md]"
description: "Retire the constitutional memory layer: default includeConstitutional to false (the real lever), stop the MCP prime SQL and the indexer's constitutional scan, freeze /memory:learn, and flag-off the confirmed-empty learned-triggers — updating the ~6 memory tests that assume the old defaults. No replacement surface; steering already lives inlined in the root docs."
trigger_phrases:
  - "deprecation mechanics"
  - "constitutional deprecation"
  - "includeConstitutional false"
  - "learned-triggers off"
  - "retire memory:learn"
  - "spec core"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/004-decisions-and-notes-system/003-deprecation-mechanics"
    last_updated_at: "2026-08-26T07:20:00Z"
    last_updated_by: "design-author"
    recent_action: "Authored deprecation-mechanics design from 001-analysis research (R1/R3/R5/R7/R9)"
    next_safe_action: "Default includeConstitutional to false across the search handlers"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/handlers/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/scoring/importance-tiers.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/search/pipeline/stage1-candidate-gen.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/search/learned-feedback.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design-037-003-deprecation-mechanics"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Confirm live indexed-constitutional row behavior after default flips (21 rows currently)"
    answered_questions:
      - "Deprecation lever is includeConstitutional (alwaysSurface has no prod callers); learned-triggers verified 0 rows"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: deprecation-mechanics

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-08-26 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 6 |
| **Predecessor** | 002-active-decisions-design |
| **Successor** | 004-rehome-rules-content |
| **Handoff Criteria** | Constitutional search/prime/index paths are off by default; /memory:learn frozen; learned-triggers flagged off; the ~6 memory tests updated; ADR-shaped memory_search no longer returns constitutional files. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** — the actual retirement of the constitutional memory *layer*. No every-turn steering is lost because the rules are already inlined in the root instruction docs; there is no replacement surface to wait on. Grounded in 001-analysis research recommendations R1, R3, R5, R7, R9.

**Scope Boundary**: The search/prime/index plumbing, the tier config, `/memory:learn`, and learned-triggers. NOT the rule-file content (phase 004) or the advisor render.ts capsules (phase 005).

**Dependencies**:
- Phase 2 recorded the decision: no replacement surface; rules stay as plain docs.
- `includeConstitutional` is the real lever (default currently true); `shouldAlwaysSurface` has no production callers.
- Learned-triggers verified 0 rows.

**Deliverables**:
- Constitutional off by default across search/context/quick_search; prime SQL and indexer scan stopped.
- `/memory:learn` frozen or retargeted; tier config + rows removed; learned-triggers flagged off.
- The ~6 dependent memory tests updated.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The constitutional DB tier is decorative but not inert: `includeConstitutional` defaults true, so ADR-shaped `memory_search` calls still pull constitutional files, and the indexer keeps scanning `constitutional/`. The learned-triggers column is confirmed 0 rows yet still wired. Meanwhile the rules it surfaces are already inlined in the root docs. The system needs to be turned off deliberately, behind its tests, once a live replacement exists.

### Purpose
Make the constitutional tier inert and retire its plumbing, so search stops returning it and the indexer stops maintaining it — without losing any steering, because the rules are already inlined in the root instruction docs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Default `includeConstitutional` to false on search / context / quick_search.
- Stop the MCP session-prime constitutional SQL and the indexer's `constitutional/` scan.
- Freeze or retarget `/memory:learn` and its presentation asset.
- Remove `IMPORTANCE_TIERS.constitutional` + rewrite/delete the 21 DB rows; flag-off learned-triggers (`SPECKIT_LEARN_FROM_SELECTION`).
- Update the ~6 memory tests that assume the old defaults.

### Out of Scope
- Rehoming rule-file content + fixing root-doc links (phase 004).
- Advisor render.ts capsules (phase 005) — kept as-is here.
- Deleting the `constitutional/` folder (phase 004, after citations move).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| mcp-server/handlers/memory-search.ts | Modify | includeConstitutional default false |
| mcp-server/lib/search/pipeline/stage1-candidate-gen.ts | Modify | Stop constitutional injection branch |
| mcp-server/lib/scoring/importance-tiers.ts | Modify | Remove constitutional tier config |
| mcp-server/lib/search/learned-feedback.ts | Modify | Flag-off learned-triggers |
| .opencode/commands/memory/learn.md | Modify | Freeze/retarget the authoring command |
| mcp-server/tests/*constitutional*.vitest.ts (+~5 more) | Modify | Update to the new defaults |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Constitutional off by default | **Given** a default `memory_search`/context/quick_search, no constitutional files are returned |
| REQ-002 | Prime SQL and indexer scan stopped | **Given** a session start and an index scan, neither touches `constitutional/` |
| REQ-003 | learned-triggers flagged off | **Given** the confirmed 0 rows, the selection-learning path is disabled with no search behavior change |
| REQ-004 | Dependent memory tests pass under new defaults | **Given** the ~6 constitutional/learned tests, all pass after being updated to the new defaults |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Negative control proves the deprecation | **Given** an ADR-shaped query, it returns packet ADRs but NOT constitutional files once the default is false |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Constitutional tier is inert by default (search/prime/index); learned-triggers off.
- **SC-002**: `/memory:learn` frozen or retargeted; tier config + rows removed.
- **SC-003**: All dependent memory tests green; negative control confirms constitutional no longer surfaces.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Assuming the tier carried the steering | Low — it did not; rules are inlined in the root docs | Confirm root-doc inlining before retiring the tier |
| Risk | Missing a dependent test | Medium — CI breaks | Enumerate the ~6 memory tests up front; run the full mcp-server suite |
| Dependency | Root-doc inlined rules | Low — steering stays | Rules already inlined in CLAUDE.md/AGENTS.md/BARTER.md; no new surface needed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- After the default flips, what happens to the 21 indexed constitutional rows — rewrite tier, or delete? (Decide with phase 004's folder-delete.)
<!-- /ANCHOR:questions -->

---
