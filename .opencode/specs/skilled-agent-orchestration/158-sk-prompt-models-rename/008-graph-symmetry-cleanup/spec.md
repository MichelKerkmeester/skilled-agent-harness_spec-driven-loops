---
title: "Feature Specification: Phase 8: graph-symmetry-cleanup"
description: "Fix the 5 pre-existing skill-graph symmetry validation failures (sk-design / mcp-figma / mcp-open-design / sk-code-review reciprocal edges) so skill_graph_compiler --export-json succeeds and the compiled index regenerates cleanly."
trigger_phrases:
  - "skill graph symmetry cleanup"
  - "skill_graph_compiler validation failed"
  - "sk-design reciprocal edges"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/158-sk-prompt-models-rename/008-graph-symmetry-cleanup"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/008-graph-symmetry-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: graph-symmetry-cleanup

<!-- SPECKIT_LEVEL: 1 -->

> **Pre-existing issue surfaced by the review.** These 5 validation failures predate the rename — they are NOT rename-caused. They block `skill_graph_compiler --export-json`, which forced the rename (phase 6) to use a targeted edit of the compiled index instead of a clean recompile. This phase fixes the root cause.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 (review-remediation) |
| **Predecessor** | 007-memory-reindex |
| **Successor** | 009-filename-residual-cleanup |
| **Handoff Criteria** | `skill_graph_compiler --export-json` exits 0; the compiled skill-graph regenerates from source (no targeted edit) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is a **review-remediation phase** addressing review rec **#1**.

**Scope Boundary**: Add the missing reciprocal edges in `sk-design` and `sk-code-review` `graph-metadata.json` so the symmetry validator passes. Optionally reconcile the `sk-prompt-models` `enhances` weight-band note. No other graph semantics change.

**Dependencies**:
- `skill_graph_compiler.py` (the validator) + `skill_advisor.py --force-refresh`.

**Deliverables**:
- The 5 symmetry errors resolved; the compiler exports the compiled `skill-graph.json` cleanly, replacing the phase-6 targeted edit.

**Changelog**:
- When this phase closes, add the matching file to ../changelog/.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`skill_graph_compiler --export-json` fails on 5 symmetry errors: `mcp-figma` and `mcp-open-design` declare `depends_on sk-design` and `sibling sk-design`, but `sk-design` lacks the reciprocal `prerequisite_for` + `sibling` edges; and `sk-design` declares `sibling sk-code-review` without the reciprocal. A weight-band note also flags the `sk-prompt-models` `enhances` weight (0.8) outside [0.3, 0.7]. These predate the rename and blocked a clean compiled-index regen in phase 6.

### Purpose
Add the missing reciprocal edges so the graph validates and the compiler exports cleanly, removing the need for the phase-6 targeted edit and restoring a fully generated compiled index.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `sk-design/graph-metadata.json`: add `prerequisite_for` mcp-figma + mcp-open-design; add `sibling` mcp-figma + mcp-open-design.
- `sk-code-review/graph-metadata.json`: add `sibling` sk-design.
- Decide the `sk-prompt-models` `enhances` weight: lower 0.8 → 0.7 OR confirm the band note is non-blocking.

### Out of Scope
- Any graph semantics beyond reciprocity (no new dependencies, no weight changes other than the noted one).
- The rename itself (complete).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/graph-metadata.json` | Modify | Add reciprocal prerequisite_for + sibling edges |
| `.opencode/skills/sk-code-review/graph-metadata.json` | Modify | Add reciprocal sibling sk-design |
| `.opencode/skills/sk-prompt-models/graph-metadata.json` | Modify (optional) | enhances weight 0.8 → 0.7 if the band is enforced |
| advisor compiled `skill-graph.json` | Regenerate | Clean export after validation passes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Symmetry validates | `skill_graph_compiler.py --validate-only` reports 0 symmetry errors |
| REQ-002 | Clean export | `skill_graph_compiler.py --export-json` exits 0 and regenerates the compiled index |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Advisor still routes | `skill_advisor.py --force-refresh` succeeds; a routing probe still surfaces sk-prompt-models |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `skill_graph_compiler.py --export-json` exits 0 with no validation errors.
- **SC-002**: The compiled `skill-graph.json` is fully regenerated from source (the phase-6 targeted edit is no longer needed).
<!-- /ANCHOR:success-criteria -->

### Acceptance Scenarios

- **Given** the reciprocal edges, **When** `--validate-only` runs, **Then** 0 symmetry errors.
- **Given** a clean export, **When** the advisor force-refreshes, **Then** routing still surfaces sk-prompt-models.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing other skills' graph metadata (sk-design/sk-code-review) | Touches surfaces outside the rename | Reciprocal edges only; they encode an existing relationship, not a new one |
| Risk | Weight-band change alters routing | Edge weight shift | Keep 0.8 unless the band is hard-enforced; confirm with a routing probe |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is the `enhances` weight-band [0.3, 0.7] hard-enforced (must lower 0.8) or advisory? (Confirm from the compiler; lower only if enforced.)
<!-- /ANCHOR:questions -->
