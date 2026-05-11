---
title: "Feature Specification: 101/001 Deep AI Council Skill Creation"
description: "Create the initial dedicated deep-ai-council skill package and renamed runtime agent, moving council workflow ownership out of system-spec-kit without graph support."
trigger_phrases:
  - "101/001"
  - "deep-ai-council skill creation"
  - "multi-ai-council rename"
  - "council skill extraction"
  - "ai council skill"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/101-deep-multi-ai-council-skill/001-deep-ai-council-skill-creation"
    last_updated_at: "2026-05-10T08:10:34Z"
    last_updated_by: "openai-gpt-5.5-opencode"
    recent_action: "Implemented deep-ai-council skill extraction and source-level advisor routing fix"
    next_safe_action: "Index Phase 001 continuity"
    blockers: []
    key_files:
      - .opencode/skills/deep-ai-council/
      - .opencode/agents/deep-ai-council.md
      - .claude/agents/deep-ai-council.md
      - .codex/agents/deep-ai-council.toml
      - .gemini/agents/deep-ai-council.md
      - .opencode/skills/system-spec-kit/mcp_server/skill_advisor/
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-001-skill-creation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Graph support is deferred to 101/002."
      - "No active runtime mirror files remain under the old multi-ai-council name."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 101/001 Deep AI Council Skill Creation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 3 |
| **Predecessor** | Current planning session |
| **Successor** | `002-deep-ai-council-reference-expansion` |
| **Handoff Criteria** | Dedicated skill package, renamed runtime mirrors, advisor routing, and council artifact scripts validate before reference expansion starts |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Deep AI Council skill extraction specification.

**Scope Boundary**: Create the dedicated skill and runtime routing surface only. Do not create graph storage, graph MCP tools, or graph schema changes in this phase.

**Dependencies**:
- Existing `multi-ai-council` runtime agent definitions across OpenCode, Claude, Codex, and Gemini.
- Existing council references and persistence scripts currently under `system-spec-kit`.
- Skill advisor metadata, regression data, generated graph, and validation flow.

**Deliverables**:
- Dedicated `deep-ai-council` skill package.
- Renamed runtime agent mirrors.
- Moved/adapted council references and artifact scripts.
- Advisor and skill graph updates that route council requests to the new skill.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` if a packet-local changelog is required.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Council planning is a specialized multi-agent workflow, but its references, persistence scripts, and routing language currently live under `system-spec-kit`. This blurs responsibility between core spec-folder governance and council deliberation behavior, and it makes future council-specific evolution harder to test and reason about.

### Purpose
Create a dedicated `deep-ai-council` skill and renamed runtime agent that own council deliberation, artifacts, persistence, and routing while keeping `system-spec-kit` focused on spec governance.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `.opencode/skills/deep-ai-council/SKILL.md`.
- Create `.opencode/skills/deep-ai-council/description.json`.
- Create `.opencode/skills/deep-ai-council/graph-metadata.json`.
- Create focused `references/`, `assets/`, and manual testing playbook content for the new skill.
- Move or adapt current council references from `system-spec-kit/references/multi-ai-council/`.
- Move or adapt council persistence, audit, rollback, and completion-advice scripts from `system-spec-kit/scripts/multi-ai-council/`.
- Rename `multi-ai-council` runtime agents to `deep-ai-council` across OpenCode, Claude, Codex, and Gemini mirrors.
- Update skill advisor metadata, aliases, regression cases, generated skill graph, and validation expectations.

### Out of Scope
- Dedicated council graph database or graph MCP tools. Phase 002 owns that work.
- Backward-compatible alias shims unless an actual old-name consumer is discovered.
- Changes to unrelated `system-spec-kit` spec-folder, memory, or deep-loop behavior.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-ai-council/SKILL.md` | Create | New skill entry point and routing contract |
| `.opencode/skills/deep-ai-council/description.json` | Create | Skill discovery metadata |
| `.opencode/skills/deep-ai-council/graph-metadata.json` | Create | Skill graph metadata for advisor graph indexing |
| `.opencode/skills/deep-ai-council/references/` | Create | Council workflow references moved from system-spec-kit |
| `.opencode/skills/deep-ai-council/assets/` | Create | Testing playbook and justified support assets |
| `.opencode/skills/deep-ai-council/scripts/` | Create | Council artifact persistence scripts if still required |
| `.opencode/agents/multi-ai-council.md` | Rename/Delete | Replace with `deep-ai-council.md` |
| `.claude/agents/multi-ai-council.md` | Rename/Delete | Replace with `deep-ai-council.md` |
| `.codex/agents/multi-ai-council.toml` | Rename/Delete | Replace with `deep-ai-council.toml` |
| `.gemini/agents/multi-ai-council.md` | Rename/Delete | Replace with `deep-ai-council.md` |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/` | Modify/Test | Advisor routes council prompts to `deep-ai-council` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Dedicated skill package exists | `.opencode/skills/deep-ai-council/` contains `SKILL.md`, `description.json`, `graph-metadata.json`, `references/`, and testing-playbook assets |
| REQ-002 | Runtime agent is renamed cleanly | OpenCode, Claude, Codex, and Gemini agent mirrors use `deep-ai-council` naming and no longer advertise `multi-ai-council` as the primary agent |
| REQ-003 | Council workflow ownership moves out of system-spec-kit | Council references and scripts live under `deep-ai-council`; `system-spec-kit` only keeps necessary integration references |
| REQ-004 | Skill advisor routes council prompts to the new skill | Advisor recommendation and regression tests return `deep-ai-council` for council deliberation prompts |
| REQ-005 | Existing council artifact behavior is preserved | Persistence/audit/rollback/completion-advice tests pass after path updates |
| REQ-006 | No graph scope lands in Phase 001 | No new council graph database, graph schema, or graph MCP query tooling is created in this phase |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Skill docs follow sk-doc structure | `SKILL.md` stays concise and deep content lives in references/assets |
| REQ-008 | Tests target behavior rather than wording | Tests assert routing, structure, artifact shape, append-only state, and `council_complete` behavior |
| REQ-009 | Old-name compatibility is evidence-based | A shim or alias is added only if an active concrete consumer requires it |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A prompt asking for AI council deliberation routes to `deep-ai-council`, not `system-spec-kit`.
- **SC-002**: All runtime agent mirrors expose the same renamed `deep-ai-council` concept.
- **SC-003**: Council references and artifact scripts are owned by the new skill package.
- **SC-004**: Validation passes for the new skill metadata, skill graph, advisor regression coverage, and moved artifact scripts.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A hidden caller depends on `multi-ai-council` | Rename could break invocation | Search all runtime configs, commands, tests, docs, and agent dispatch examples before deleting old names |
| Risk | Advisor family/category constraints reject new metadata | Skill graph validation fails | Use an existing compatible family/category first, or extend compiler constraints with tests |
| Risk | Script path moves break artifact persistence | Council outputs stop saving correctly | Move scripts with targeted tests for artifact shape, audit trail, rollback, and completion advice |
| Dependency | Existing council references under `system-spec-kit` | Required source material | Read and move/adapt them into `deep-ai-council/references/` |
| Dependency | sk-doc skill creation standards | Required structure | Use skill templates and manual testing playbook template |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- No active runtime mirror files require the old `multi-ai-council` name. Historical persisted state keeps `protocol: "multi-ai-council"` as additive-only data compatibility, not as an active runtime alias.
<!-- /ANCHOR:questions -->
