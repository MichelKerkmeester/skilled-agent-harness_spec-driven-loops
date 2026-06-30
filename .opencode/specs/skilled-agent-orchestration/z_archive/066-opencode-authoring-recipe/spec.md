---
title: "Feature Specification: Remediation per 077 research: 4-phase OpenCode authoring recipe, /speckit:complete authoring-time load, CocoIndex canonical-priority, validator/MCP-tool drift cleanup"
description: "Phase parent for Remediation per 077 research: 4-phase OpenCode authoring recipe, /speckit:complete authoring-time load, CocoIndex canonical-priority, validator/MCP-tool drift cleanup"
trigger_phrases:
  - "078-opencode-authoring-recipe"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/066-opencode-authoring-recipe"
    last_updated_at: "2026-05-05T17:10:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase parent + 4 children scaffolded"
    next_safe_action: "Implement Phase 1 (sk-code-authoring)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
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

# Feature Specification: Remediation per 077 research: 4-phase OpenCode authoring recipe, /speckit:complete authoring-time load, CocoIndex canonical-priority, validator/MCP-tool drift cleanup

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/078-opencode-authoring-recipe |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Validator + template + generator changes ship so parent validates under tolerant policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 077 deep-research audit surfaced 22 P1 + 20 P2 findings across system-spec-kit, mcp-coco-index, and sk-code OpenCode side. The findings cluster into 4 dependent stages: sk-code OpenCode authoring assets are missing (Phase 1 = foundation), `/speckit:complete` loads sk-code at review-time not authoring-time (Phase 2 = integration), CocoIndex canonical-priority semantics are missing (Phase 3 = indexing), and system-spec-kit validator + MCP tool registry drift remains (Phase 4 = cleanup). Bundling them loses the dependency signal; splitting them into 4 child phases preserves the sequence.

### Purpose
Ship a 4-phase remediation that closes 22 P1 + 20 P2 findings from 077, with each phase shippable independently. Phase 1 is the foundation; Phases 2-4 build on it sequentially. Optional Phase 5 covers P2 polish if appetite remains after Phases 1-4 ship.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and child phase manifest for Remediation per 077 research: 4-phase OpenCode authoring recipe, /speckit:complete authoring-time load, CocoIndex canonical-priority, validator/MCP-tool drift cleanup
- Per-phase implementation details in child folders

### Out of Scope
- Detailed per-phase implementation plans at the parent level

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| [Per-child files] | Modify/Create | Child phases | Detailed file scope lives in each child phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-sk-code-authoring/ | sk-code OpenCode authoring recipe foundation: 5 new authoring checklists (skill, agent, command, mcp-server, spec-folder), spec_folder_write recipe asset, machine-readable STACK_FOLDERS contract restored, SKILL.md OpenCode resource map updated, F-001-005 stale link fixed | Pending |
| 2 | 002-spec-kit-load/ | `/speckit:complete` authoring-time sk-code load: modify auto/confirm YAMLs to load sk-code BEFORE code writes (not just review); detect `.opencode/` implementation targets and pre-load authoring recipe; document cross-skill load contract | Pending |
| 3 | 003-coco-priority/ | CocoIndex canonical-priority + portability: add CANONICAL_RESOURCE_PATHS setting that outranks regular search; smoke test asserting `.opencode/skills/sk-code/assets/opencode/` is ingested on a fresh clone; explicit opt-in for canonical paths under `**/.*` defaults | Pending |
| 4 | 004-validator-cleanup/ | system-spec-kit validator + MCP drift cleanup: graph-metadata JSON-schema validator + description.json shape check in `validate.sh --strict`; ROLLOUT_FLAGS audit; MCP tool registry sync with SKILL.md docs; refresh telemetry doc to match runtime fields | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-sk-code-authoring | 002-spec-kit-load | [Criteria TBD] | [Verification TBD] |
| 002-spec-kit-load | 003-coco-priority | [Criteria TBD] | [Verification TBD] |
| 003-coco-priority | 004-validator-cleanup | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which child phase should execute first?
- What handoff criteria must each child satisfy?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
