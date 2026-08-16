---
title: "Feature Specification: sk-vision 005 Pi adapter"
description: "Phase parent for the Pi extension: function default-export factory, then relative symlink and dry factory."
trigger_phrases:
  - "sk-vision pi adapter"
  - "sk-vision registerTool"
  - "sk-vision pi extension"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/005-pi-adapter"
    last_updated_at: "2026-08-16T07:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Rewrote 005-pi-adapter as lean phase parent over nested children."
    next_safe_action: "Wait for 004-opencode-adapter to close, then implement 001-extension-factory."
    blockers: []
    key_files:
      - "spec.md"
      - "001-extension-factory/spec.md"
      - "002-symlink-and-dry-factory/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-005-pi-adapter-parent-20260816"
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

# Feature Specification: sk-vision 005 Pi adapter

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase parent |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `sk-vision/001-sk-vision-fork-of-opencode-senses` |
| **Predecessor** | 004-opencode-adapter |
| **Successor** | None |
| **Handoff Criteria** | Nested children Complete. Owner factory is a function. Relative symlink matches the locked target. pi --offline --approve starts without fail-closed. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Pi loads extensions from `.pi/extensions/` via relative symlinks to owner trees. There is no sk-vision factory yet.

### Purpose
Author `.opencode/skills/sk-vision/pi/sk-vision.ts` and link it the same way `git-preflight-advisory.ts` is linked.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Nested child `001-extension-factory/`: function default export; 13 `pi.registerTool`; `client.close()`
- Nested child `002-symlink-and-dry-factory/`: relative symlink; README; `pi --offline --approve`

### Out of Scope
- Absolute symlink or copied TS under `.pi/extensions/`
- Object, class, or promise default export
- MCP or bash JSON-RPC as the primary path
- Inventing `sk_vision_query`

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in each child's spec.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-vision/pi/sk-vision.ts` | Create | 001-extension-factory | Owner factory |
| `.pi/extensions/sk-vision.ts` | Create | 002-symlink-and-dry-factory | Relative symlink |
| `.pi/extensions/README.md` | Modify | 002-symlink-and-dry-factory | Inventory rows |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-extension-factory/ | Function default-export factory | Planned |
| 2 | 002-symlink-and-dry-factory/ | Relative symlink and dry factory | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- Do not implement from this parent spec. Open the next Planned child's `spec.md` copy pack.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-extension-factory | 002-symlink-and-dry-factory | Owner file; function export; 13 tools | rg export default function |
| 002-symlink-and-dry-factory | Parent remaining work | Relative symlink; pi dry-load | readlink; `pi --offline --approve` |
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
