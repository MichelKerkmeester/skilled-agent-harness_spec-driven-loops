---
title: "Feature Specification: Deep AI Council Skill Extraction"
description: "Phase parent for extracting multi-ai-council into a dedicated deep-ai-council skill, then planning later council graph support. Child phases own execution detail."
trigger_phrases:
  - "deep-ai-council"
  - "multi-ai-council extraction"
  - "council skill"
  - "council graph support"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/101-deep-multi-ai-council-skill"
    last_updated_at: "2026-05-10T06:45:00Z"
    last_updated_by: "openai-gpt-5.5-opencode"
    recent_action: "Scaffolded phase parent"
    next_safe_action: "Resume 001-deep-ai-council-skill-creation for implementation planning"
    blockers: []
    key_files:
      - .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/001-deep-ai-council-skill-creation/
      - .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/002-deep-ai-council-graph-support/
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-phase-parent-scaffold"
      parent_session_id: null
    completion_pct: 10
    open_questions:
      - "Do any external callers still depend on the literal multi-ai-council name?"
    answered_questions:
      - "Initial skill extraction and future graph support are separate phase children."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X->Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md - these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Deep AI Council Skill Extraction

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-10 |
| **Branch** | `main` |
| **Parent Spec** | N/A - phase parent root |
| **Parent Packet** | `skilled-agent-orchestration/101-deep-multi-ai-council-skill` |
| **Predecessor** | Planning discussion from current session |
| **Successor** | None |
| **Handoff Criteria** | Phase 001 validates the dedicated skill boundary before Phase 002 designs graph support |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The council workflow currently belongs to `system-spec-kit`, but it is a specialized multi-agent planning workflow with its own agent persona, artifacts, persistence scripts, and future graph needs. Keeping that ownership inside `system-spec-kit` makes the core spec workflow responsible for council behavior that should evolve independently.

### Purpose
Split the work into two independently executable phases: first create and route a dedicated `deep-ai-council` skill and renamed runtime agent, then plan graph support as a later phase after the skill boundary is stable.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Track the `deep-ai-council` extraction as a two-phase packet.
- Keep the phase parent lean with only phase navigation and aggregate purpose.
- Preserve separate child ownership for initial skill extraction and later graph support.

### Out of Scope
- Detailed implementation plans at the parent level.
- Graph schema implementation during the initial skill extraction phase.
- Backward-compatibility shims unless Phase 001 finds a concrete active consumer of the old name.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in each child plan.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/deep-ai-council/` | Create | 001 | Dedicated council skill package |
| `.opencode/agents/deep-ai-council.md` and runtime mirrors | Rename/Create | 001 | Runtime agent rename from `multi-ai-council` |
| `.opencode/skills/system-spec-kit/references/multi-ai-council/` | Move/Delete | 001 | Remove council workflow ownership from system-spec-kit |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/` | Modify/Test | 001 | Route council prompts to `deep-ai-council` |
| Council graph storage and MCP/query surfaces | Plan/Create | 002 | Future council-specific graph support |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-deep-ai-council-skill-creation/` | Create the dedicated skill, rename runtime agents, move council assets/scripts, and update advisor routing | Draft |
| 2 | `002-deep-ai-council-graph-support/` | Plan and later implement council-specific graph support after the skill boundary ships | Draft |

### Phase Transition Rules

- Phase 001 MUST validate the skill package, runtime mirrors, advisor routing, and moved persistence tests before Phase 002 implementation begins.
- Phase 002 MUST treat graph support as a separate design and storage problem, not as hidden scope inside the initial skill extraction.
- Use `/spec_kit:resume skilled-agent-orchestration/101-deep-multi-ai-council-skill/001-deep-ai-council-skill-creation` to resume initial skill extraction.
- Use `/spec_kit:resume skilled-agent-orchestration/101-deep-multi-ai-council-skill/002-deep-ai-council-graph-support` to resume graph-support planning.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| `001-deep-ai-council-skill-creation` | `002-deep-ai-council-graph-support` | Dedicated skill and renamed runtime agents validate; advisor routes council prompts to `deep-ai-council`; no required old-name consumer remains unresolved | Spec validation, advisor regression tests, skill graph validation, script tests |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Do any external callers still depend on the literal `multi-ai-council` name?
- Should Phase 002 ship as a design-only packet first, or include the first council graph implementation once Phase 001 lands?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase 001**: `001-deep-ai-council-skill-creation/spec.md`
- **Phase 002**: `002-deep-ai-council-graph-support/spec.md`
- **Graph Metadata**: `graph-metadata.json`
