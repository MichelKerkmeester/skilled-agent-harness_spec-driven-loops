---
title: "Feature Specification: sk-vision 004 OpenCode adapter"
description: "Phase parent for the OpenCode plugin load path: real-file re-export of dist/plugin.js, then README and opencode.json proof."
trigger_phrases:
  - "sk-vision opencode adapter"
  - "sk-vision plugin"
  - "sk-vision.js"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/004-opencode-adapter"
    last_updated_at: "2026-08-16T07:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Rewrote 004-opencode-adapter as lean phase parent over nested children."
    next_safe_action: "Wait for 003-runtime-fork to close, then implement 001-plugin-reexport."
    blockers: []
    key_files:
      - "spec.md"
      - "001-plugin-reexport/spec.md"
      - "002-readme-and-proof/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-004-opencode-adapter-parent-20260816"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: sk-vision 004 OpenCode adapter

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase parent |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `sk-vision/001-sk-vision-fork-of-opencode-senses` |
| **Predecessor** | 003-runtime-fork |
| **Successor** | 005-pi-adapter |
| **Handoff Criteria** | Nested children Complete. Regular file `.opencode/plugins/sk-vision.js` exists. README row present. No plugin array added to opencode.json. Next implementer target is 005-pi-adapter/001-extension-factory. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
OpenCode discovers plugins as real files under `.opencode/plugins/`. The skill factory is not on that path yet.

### Purpose
Add a thin real-file adapter that default-exports `vision-runtime/dist/plugin.js`.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Nested child `001-plugin-reexport/`: regular file re-export; not a symlink
- Nested child `002-readme-and-proof/`: README row; `rg plugin opencode.json`

### Out of Scope
- Pi symlink
- Editing `opencode.json` to add a plugin array
- Copying dump `context/opencode.json`
- Inventing `sk_vision_query`

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in each child's spec.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/plugins/sk-vision.js` | Create | 001-plugin-reexport | Thin re-export |
| `.opencode/plugins/README.md` | Modify | 002-readme-and-proof | Inventory row |
| `opencode.json` | Unchanged | 002-readme-and-proof | No plugin array |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-plugin-reexport/ | Regular-file re-export | Planned |
| 2 | 002-readme-and-proof/ | README row and opencode.json proof | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- Do not implement from this parent spec. Open the next Planned child's `spec.md` copy pack.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-plugin-reexport | 002-readme-and-proof | test -f and test ! -L | Plugin file proofs |
| 002-readme-and-proof | 005-pi-adapter | README row; no plugin array | rg proofs |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
