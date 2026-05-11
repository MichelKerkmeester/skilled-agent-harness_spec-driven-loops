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
    last_updated_at: "2026-05-11T07:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Added phase 004 (playbook graph coverage) to phase map and graph metadata"
    next_safe_action: "Complete 004-deep-ai-council-playbook-graph-coverage implementation"
    blockers: []
    key_files:
      - .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/001-deep-ai-council-skill-creation/
      - .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/002-deep-ai-council-reference-expansion/
      - .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/
      - .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/004-deep-ai-council-playbook-graph-coverage/
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-phase-parent-scaffold"
      parent_session_id: null
    completion_pct: 85
    open_questions:
      - "Do any external callers still depend on the literal multi-ai-council name?"
    answered_questions:
      - "Initial skill extraction and future graph support are separate phase children."
      - "Phase 002 reference expansion is complete and graph support is Phase 003."
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
| **Status** | In Progress |
| **Created** | 2026-05-10 |
| **Branch** | `main` |
| **Parent Spec** | N/A - phase parent root |
| **Parent Packet** | `skilled-agent-orchestration/101-deep-multi-ai-council-skill` |
| **Predecessor** | Planning discussion from current session |
| **Successor** | None |
| **Handoff Criteria** | Phase 001 and 002 validate before Phase 003 implements graph support |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The council workflow currently belongs to `system-spec-kit`, but it is a specialized multi-agent planning workflow with its own agent persona, artifacts, persistence scripts, and future graph needs. Keeping that ownership inside `system-spec-kit` makes the core spec workflow responsible for council behavior that should evolve independently.

### Purpose
Split the work into three independently executable phases: create and route a dedicated `deep-ai-council` skill and renamed runtime agent, expand the skill references, then implement graph support after the skill boundary is stable.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Track the `deep-ai-council` extraction as a three-phase packet.
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
| `.opencode/skills/deep-ai-council/references/` | Modify | 002 | Expand council references, playbook, and runtime parity guidance |
| Council graph storage and MCP/query surfaces | Plan/Create | 003 | Dedicated council-specific graph support |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/08--council-graph-integration/` | Create | 004 | Add 8 functional graph integration scenarios DAC-019..DAC-026 covering Phase 003's shipped MCP surface |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-deep-ai-council-skill-creation/` | Create the dedicated skill, rename runtime agents, move council assets/scripts, and update advisor routing | Complete |
| 2 | `002-deep-ai-council-reference-expansion/` | Expand council references, playbook scenarios, and routing metadata | Complete |
| 3 | `003-deep-ai-council-graph-support/` | Implement council-specific graph support after the skill boundary ships | Complete |
| 4 | `004-deep-ai-council-playbook-graph-coverage/` | Add 8 functional graph integration scenarios (DAC-019..DAC-026) to the manual testing playbook so Phase 003's shipped MCP surface has operator-driven coverage | In Progress |
### Phase Transition Rules

- Phase 001 MUST validate the skill package, runtime mirrors, advisor routing, and moved persistence tests before Phase 002 or 003 work depends on the skill boundary.
- Phase 002 MUST keep reference expansion separate from graph storage and MCP implementation.
- Phase 003 MUST treat graph support as a separate design and storage problem, not as hidden scope inside the initial skill extraction or reference expansion.
- Phase 004 depends on Phase 003 completion; it adds operator playbook coverage matching the shipped `council_graph_*` MCP tool family.
- Use `/spec_kit:resume skilled-agent-orchestration/101-deep-multi-ai-council-skill/001-deep-ai-council-skill-creation` to resume initial skill extraction.
- Use `/spec_kit:resume skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support` to resume graph-support planning.
- Use `/spec_kit:resume skilled-agent-orchestration/101-deep-multi-ai-council-skill/004-deep-ai-council-playbook-graph-coverage` to resume playbook coverage work.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| `001-deep-ai-council-skill-creation` | `002-deep-ai-council-reference-expansion` | Dedicated skill and renamed runtime agents validate; advisor routes council prompts to `deep-ai-council`; no required old-name consumer remains unresolved | Spec validation, advisor regression tests, skill graph validation, script tests |
| `002-deep-ai-council-reference-expansion` | `003-deep-ai-council-graph-support` | Council references and artifact contracts are stable enough to derive graph nodes and convergence signals | Spec validation, reference validation, playbook checks |
| `003-deep-ai-council-graph-support` | `004-deep-ai-council-playbook-graph-coverage` | `council_graph_*` MCP tools, schemas, and tests are shipped and stable | Spec validation, council-graph.vitest.ts passes, references/graph_support.md present |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Do any external callers still depend on the literal `multi-ai-council` name?
- None for phase routing. Phase 003 now owns graph implementation.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase 001**: `001-deep-ai-council-skill-creation/spec.md`
- **Phase 002**: `002-deep-ai-council-reference-expansion/spec.md`
- **Phase 003**: `003-deep-ai-council-graph-support/spec.md`
- **Phase 004**: `004-deep-ai-council-playbook-graph-coverage/spec.md`
- **Graph Metadata**: `graph-metadata.json`
