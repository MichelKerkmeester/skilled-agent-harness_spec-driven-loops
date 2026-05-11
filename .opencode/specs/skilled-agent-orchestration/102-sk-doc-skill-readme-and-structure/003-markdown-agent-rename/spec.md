---
title: "Feature Specification: markdown agent rename"
description: "Rename create documentation agent identity to markdown agent across runtime mirrors and references."
trigger_phrases:
  - "markdown agent rename"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/102-sk-doc-skill-readme-and-structure"
    last_updated_at: "2026-05-10T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Implemented markdown agent rename across runtime mirrors and create-command references"
    next_safe_action: "Run final verification and save continuity"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "102-sk-doc-skill-readme-and-structure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: markdown agent rename

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-10 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-sk-doc-skill-readme-asset |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The documentation authoring agent is currently named create, but the desired long-term identity is markdown. That rename has broad reference impact across runtime agent mirrors, orchestration docs, commands, skills, and root documentation.

### Purpose
Rename the agent identity from create to markdown without changing create command names or breaking documentation workflows.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename runtime agent files from create.md to markdown.md where present.
- Update frontmatter name fields and headings in renamed agent files.
- Update agent identity references while preserving create command names.

### Out of Scope
- Renaming create command invocations is excluded.
- Phase 1 reference relocation and Phase 2 asset creation are excluded.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/agents/create.md | Move | Rename to markdown.md. |
| .claude/agents/create.md | Move | Rename mirror to markdown.md if present. |
| .gemini/agents/create.md | Move | Rename mirror to markdown.md if present. |
| .codex/agents/create.toml | Move | Rename Codex mirror to markdown.toml if present. |
| AGENTS.md | Modify | Update agent identity references. |
| .opencode/agents/orchestrate.md | Modify | Route documentation execution to markdown agent. |
| .opencode/agents/code.md | Modify | Update component-authoring conflict guidance. |
| .claude/agents/orchestrate.md | Modify | Update Claude mirror routing references. |
| .claude/agents/code.md | Modify | Update Claude mirror conflict guidance. |
| .gemini/agents/orchestrate.md | Modify | Update Gemini mirror routing references. |
| .gemini/agents/code.md | Modify | Update Gemini mirror conflict guidance. |
| .codex/agents/orchestrate.toml | Modify | Update Codex mirror routing references. |
| .codex/agents/code.toml | Modify | Update Codex mirror conflict guidance. |
| .opencode/commands/create/** | Modify | Update Phase 0 agent identity while preserving `/create:*` commands. |
| .opencode/skills/sk-doc/assets/agent_template.md | Modify | Update production agent example inventory. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rename agent files in runtime directories. | markdown.md exists where source create.md existed. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Update agent identity references. | Agent references use markdown identity except preserved create commands. |
| REQ-003 | Preserve command-family names. | create command names remain unchanged. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase deliverables are implemented and verified.
- **SC-002**: Handoff criteria are ready for the next phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-renaming command references | Command docs become inaccurate | Classify each match before editing. |
| Risk | Runtime mirror drift | One CLI runtime may keep stale create.md | Verify all runtime dirs. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Reference searches complete within normal repo-search time.
- **NFR-P02**: Documentation changes avoid duplicate source-of-truth files.

### Security
- **NFR-S01**: No secrets or credentials are introduced.
- **NFR-S02**: Agent policy changes preserve explicit write-scope boundaries.

### Reliability
- **NFR-R01**: All referenced paths resolve after implementation.
- **NFR-R02**: Runtime mirror updates remain consistent where mirrors exist.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Missing optional runtime mirror: document as not applicable.
- Existing command-family references: preserve when they refer to create commands.
- Historical notes: leave only if explicitly marked historical.

### Error Scenarios
- Validation failure: stop and fix within this phase.
- Search ambiguity: classify matches before editing.
- Partial completion: do not start the next phase until handoff criteria pass.

### State Transitions
- Draft to active: implementation begins.
- Active to complete: validation evidence recorded.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Multi-file documentation and runtime-surface changes. |
| Risk | 16/25 | Path/reference drift is the main risk. |
| Research | 14/20 | Requires exact searches and pattern review. |
| **Total** | **48/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None blocking planning.
<!-- /ANCHOR:questions -->
