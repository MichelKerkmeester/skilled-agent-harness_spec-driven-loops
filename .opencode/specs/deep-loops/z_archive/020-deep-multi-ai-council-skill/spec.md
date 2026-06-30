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
    recent_action: "Phase 005 added for fixups and value scenarios"
    next_safe_action: "Complete 005-deep-ai-council-fixups-and-graph-value-scenarios implementation"
    blockers: []
    key_files:
      - .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/001-deep-ai-council-skill-creation/
      - .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/002-deep-ai-council-reference-expansion/
      - .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/
      - .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/004-deep-ai-council-playbook-graph-coverage/
      - .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/005-deep-ai-council-fixups-and-graph-value-scenarios/
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-phase-parent-scaffold"
      parent_session_id: null
    completion_pct: 100
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
| `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-runtime-parity.vitest.ts` and `scripts/tests/multi-ai-council-persist-artifacts.vitest.ts` | Modify | 005 | Fix Claude translated frontmatter parity assumption + stale HELPER_PATH; restore green vitest baseline |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/09--council-graph-value-comparison/` | Create | 005 | Add 6 value-comparison scenarios DAC-027..DAC-032 proving graph beats no-graph baseline in real-world situations |
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
| 4 | `004-deep-ai-council-playbook-graph-coverage/` | Add 8 functional graph integration scenarios (DAC-019..DAC-026) to the manual testing playbook so Phase 003's shipped MCP surface has operator-driven coverage | Complete |
| 5 | `005-deep-ai-council-fixups-and-graph-value-scenarios/` | Fix 2 pre-existing vitest failures (Claude translated frontmatter parity + persist-artifacts stale HELPER_PATH); add 6 value-comparison scenarios (DAC-027..DAC-032) proving graph beats no-graph baseline | Complete |
| 6 | `006-council-graph-value-scenario-automation/` | Promote DAC-027..DAC-032 from operator A/B contracts into CI-protected fixture-driven vitest with measured baseline vs graph metrics + operator fixture-seeder CLI | Complete |
| 7 | `007-council-infrastructure-hardening/` | Close 6 residual gaps from 101/001..006: test gate (npm script + runner), 32-entry feature catalog, reverse-anchor meta-test, DAC-025 replay helper, Codex TOML name/desc parity, fixture normalization provenance | Complete |
| 8 | `008-council-surface-polish/` | Surface 101/007 artifacts through SKILL.md, publish 101/001..007 series changelog, add smoke vitest covering replay helper + bash runner | Complete |
### Phase Transition Rules

- Phase 001 MUST validate the skill package, runtime mirrors, advisor routing, and moved persistence tests before Phase 002 or 003 work depends on the skill boundary.
- Phase 002 MUST keep reference expansion separate from graph storage and MCP implementation.
- Phase 003 MUST treat graph support as a separate design and storage problem, not as hidden scope inside the initial skill extraction or reference expansion.
- Phase 004 depends on Phase 003 completion; it adds operator playbook coverage matching the shipped `council_graph_*` MCP tool family.
- Phase 005 depends on Phase 004 completion (which surfaced the 2 pre-existing vitest failures); it repairs the failures and adds value-comparison scenarios contrasting with-graph vs no-graph workflows.
- Phase 006 depends on Phase 005 completion; it automates the 6 value scenarios as fixture-driven vitest with measured baseline vs graph metrics.
- Phase 007 depends on Phase 006 completion; it closes 6 residual infrastructure gaps surfaced across 101/001..006 (test gate, feature catalog, anchor integrity, replay helper, Codex parity, fixture provenance).
- Phase 008 depends on Phase 007 completion; it surfaces the new artifacts via SKILL.md, publishes the 101 series changelog, and adds smoke coverage for the three new helper scripts.
- Use `/speckit:resume skilled-agent-orchestration/101-deep-multi-ai-council-skill/001-deep-ai-council-skill-creation` to resume initial skill extraction.
- Use `/speckit:resume skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support` to resume graph-support planning.
- Use `/speckit:resume skilled-agent-orchestration/101-deep-multi-ai-council-skill/004-deep-ai-council-playbook-graph-coverage` to resume playbook coverage work.
- Use `/speckit:resume skilled-agent-orchestration/101-deep-multi-ai-council-skill/005-deep-ai-council-fixups-and-graph-value-scenarios` to resume fix-ups and value-scenarios work.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| `001-deep-ai-council-skill-creation` | `002-deep-ai-council-reference-expansion` | Dedicated skill and renamed runtime agents validate; advisor routes council prompts to `deep-ai-council`; no required old-name consumer remains unresolved | Spec validation, advisor regression tests, skill graph validation, script tests |
| `002-deep-ai-council-reference-expansion` | `003-deep-ai-council-graph-support` | Council references and artifact contracts are stable enough to derive graph nodes and convergence signals | Spec validation, reference validation, playbook checks |
| `003-deep-ai-council-graph-support` | `004-deep-ai-council-playbook-graph-coverage` | `council_graph_*` MCP tools, schemas, and tests are shipped and stable | Spec validation, council-graph.vitest.ts passes, references/graph_support.md present |
| `004-deep-ai-council-playbook-graph-coverage` | `005-deep-ai-council-fixups-and-graph-value-scenarios` | 8 functional graph scenarios shipped; 2 pre-existing vitest failures surfaced and ready for repair | Spec validation, playbook scenario count 26, both target vitest files identified |
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
- **Phase 005**: `005-deep-ai-council-fixups-and-graph-value-scenarios/spec.md`
- **Phase 006**: `006-council-graph-value-scenario-automation/spec.md`
- **Phase 007**: `007-council-infrastructure-hardening/spec.md`
- **Phase 008**: `008-council-surface-polish/spec.md`
- **Graph Metadata**: `graph-metadata.json`
