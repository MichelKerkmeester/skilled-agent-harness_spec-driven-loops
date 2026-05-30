---
title: "Feature Specification: references + assets lane reorg"
description: "references/ and assets/ are function-organized so the two co-equal lanes are not visible on disk. Split both trees into agent-improvement, model-benchmark, and shared subdirs and update every SKILL path literal."
trigger_phrases:
  - "references-assets-lane-reorg"
  - "deep-agent-improvement lane reorg"
  - "references assets lane split"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/010-references-assets-lane-reorg"
    last_updated_at: "2026-05-29T08:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffold 010 phase docs for references and assets lane reorg"
    next_safe_action: "Move references and assets into lane subdirs and rewrite SKILL literals"
    blockers: []
    key_files:
      - ".opencode/skills/deep-agent-improvement/references"
      - ".opencode/skills/deep-agent-improvement/assets"
      - ".opencode/skills/deep-agent-improvement/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-references-assets-lane-reorg"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: references + assets lane reorg

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 19 |
| **Predecessor** | 009-skill-md-two-lane |
| **Successor** | 011-agent-lane-note |
| **Handoff Criteria** | references and assets physically split into the three lane subdirs, every SKILL path literal repointed, skill loads clean |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the deep-agent-improvement model-benchmark mode decomposition.

**Scope Boundary**: Only the `references/` and `assets/` trees of the deep-agent-improvement skill plus the path literals inside SKILL.md and the skill graph-metadata. Scripts stay where they are (phase 013 owns the script reorg).

**Dependencies**:
- 009-skill-md-two-lane shipped the two co-equal lane structure in prose, so the disk layout can now mirror it.

**Deliverables**:
- references/ regrouped into agent-improvement, model-benchmark, shared subdirs
- assets/ regrouped into the same three lane subdirs
- SKILL.md path literals repointed to the new lane paths
- graph-metadata refreshed for the moved files
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill now has two co-equal lanes (agent-improvement and model-benchmark) in its prose, but `references/` and `assets/` are still function-organized (integration, promotion-gates, scoring, workflow). A reader cannot tell which lane a doc serves by looking at the tree, and the lane boundary lives only in SKILL.md narrative.

### Purpose
Make the two-lane split visible on disk by physically grouping references and assets into agent-improvement, model-benchmark, and shared subdirs, with every SKILL path literal repointed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move the 14 references docs into `references/{agent-improvement,model-benchmark,shared}/`
- Move the assets into `assets/{agent-improvement,model-benchmark,shared}/`
- Rewrite every references/ and assets/ path literal in SKILL.md
- Refresh the skill graph-metadata for the moved file paths

### Out of Scope
- The `scripts/` tree - phase 013 owns the physical script reorg
- Editing doc bodies - this phase only moves files and repoints literals, no content rewrites

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-agent-improvement/references/**` | Move | 14 docs into three lane subdirs |
| `.opencode/skills/deep-agent-improvement/assets/**` | Move | runtime + benchmark assets into three lane subdirs |
| `.opencode/skills/deep-agent-improvement/SKILL.md` | Modify | repoint all references/ and assets/ path literals |
| `.opencode/skills/deep-agent-improvement/graph-metadata.json` | Modify | refresh moved file paths if listed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | references/ split into three lane subdirs | `references/agent-improvement/`, `references/model-benchmark/`, `references/shared/` each hold their mapped docs with no doc left in a function dir |
| REQ-002 | assets/ split into three lane subdirs | `assets/agent-improvement/`, `assets/model-benchmark/`, `assets/shared/` hold their mapped assets and benchmark assets land in model-benchmark |
| REQ-003 | SKILL.md path literals repointed | `rg "references/(integration|promotion-gates|scoring|workflow)/" SKILL.md` returns nothing and `rg "assets/(benchmark-|improvement_|target_)" SKILL.md` returns nothing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | skill graph-metadata refreshed | moved file paths in `graph-metadata.json` match the new lane paths |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every references and assets file lives under a lane subdir and the skill loads with no broken path literal.
- **SC-002**: Grep for the old function-dir and flat-asset literals in SKILL.md returns nothing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Missed path literal in SKILL.md | Med | grep sweep both old patterns after the edit, expect zero hits |
| Risk | Lane misclassification of a doc | Low | follow the recorded mapping, shared holds only loop and promotion docs both lanes use |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does any asset belong in shared, or do all current assets split cleanly into agent-improvement and model-benchmark?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
