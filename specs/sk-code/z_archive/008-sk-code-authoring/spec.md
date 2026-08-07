---
title: "Feature Specification: 078/001 sk-code OpenCode Authoring Recipe (foundation)"
description: "Add 5 new authoring checklists (skill, agent, command, mcp-server, spec-folder) + spec_folder_write recipe asset to sk-code/assets/opencode/. Restore machine-readable STACK_FOLDERS contract in SKILL.md. Fix F-001-005 stale relative link in references/opencode/shared/universal_patterns.md."
trigger_phrases: ["078/001", "sk-code-authoring", "OpenCode authoring recipe", "skill_authoring checklist", "spec_folder_write recipe"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/008-sk-code-authoring"
    last_updated_at: "2026-05-05T17:15:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 1 scaffolded"
    next_safe_action: "Dispatch cli-codex to implement"
    blockers: []
    key_files:
      - .opencode/skills/sk-code/assets/opencode/checklists/
      - .opencode/skills/sk-code/SKILL.md
      - .opencode/skills/sk-code/references/opencode/shared/universal_patterns.md
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "078-001-final"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 078/001 sk-code OpenCode Authoring Recipe (foundation)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent** | `../spec.md` (078-opencode-authoring-recipe) |
| **Predecessor** | 077 research-report |
| **Successor** | 078/002 spec-kit-load (depends on this phase shipping) |
| **Handoff Criteria** | 5 authoring checklists + 1 recipe asset shipped; STACK_FOLDERS contract restored; SKILL.md OpenCode resource map updated; F-001-005 stale link fixed; validate.sh --strict exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-code's SKILL.md declares OPENCODE scope covering skills, agents, commands, MCP servers, hooks, scripts, tests, and config (lines 20-23), but the on-disk `assets/opencode/checklists/` directory contains only language-level checklists (config, javascript, python, shell, typescript, universal). There are no first-class authoring checklists for skills/agents/commands/mcp-servers (F-001-004, F-006-002, F-007-001), no spec-folder write recipe (F-007-002, F-008-004), no machine-readable STACK_FOLDERS contract (F-008-001 — regressed to inline strings), and `references/opencode/shared/universal_patterns.md:551-554` has a stale relative link to `../../assets/checklists/` (real path: `../../assets/opencode/checklists/`) (F-001-005). This phase is the foundation everything else in 078 builds on.

### Purpose
Add 5 authoring checklists + 1 recipe asset + 1 SKILL.md surface refresh + 1 stale-link fix so that sk-code's OpenCode side ships first-class authoring assets matching the declared scope. Subsequent phases (2-4) depend on Phase 1 shipping first because `/speckit:complete` Phase 2 integration loads these assets, CocoIndex Phase 3 canonical-priority needs concrete canonical resources to prefer, and Phase 4 validator drift cleanup checks shape against the new authoring artifacts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `.opencode/skills/sk-code/assets/opencode/checklists/skill_authoring.md`
- Create `.opencode/skills/sk-code/assets/opencode/checklists/agent_authoring.md`
- Create `.opencode/skills/sk-code/assets/opencode/checklists/command_authoring.md`
- Create `.opencode/skills/sk-code/assets/opencode/checklists/mcp_server_authoring.md`
- Create `.opencode/skills/sk-code/assets/opencode/checklists/spec_folder_authoring.md`
- Create `.opencode/skills/sk-code/assets/opencode/recipes/spec_folder_write.md` (new dir + file)
- Update `.opencode/skills/sk-code/SKILL.md`: restore machine-readable STACK_FOLDERS contract; update OpenCode resource map to point to 5 new authoring checklists + 1 recipe
- Fix `references/opencode/shared/universal_patterns.md:551-554` stale relative link
- Update `.opencode/skills/sk-code/description.json` keywords if needed
- Bump SKILL.md frontmatter version 3.1.0.0 → 3.2.0.0

### Out of Scope
- Phases 2-4 work (separate child phases)
- Webflow stack changes (preserved unchanged)
- motion_dev directory (immutable post-069)
- Runtime mirror to .claude/.codex/.gemini (sk-code's references/assets aren't mirrored — only commands and agents are)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `assets/opencode/checklists/skill_authoring.md` | Create | Authoring checklist for new skills |
| `assets/opencode/checklists/agent_authoring.md` | Create | Authoring checklist for new agents |
| `assets/opencode/checklists/command_authoring.md` | Create | Authoring checklist for new commands (incl. /create:* commands) |
| `assets/opencode/checklists/mcp_server_authoring.md` | Create | Authoring checklist for new MCP servers |
| `assets/opencode/checklists/spec_folder_authoring.md` | Create | Authoring checklist for spec folder writes |
| `assets/opencode/recipes/spec_folder_write.md` | Create (incl. parent dir) | Recipe for spec-folder write workflow |
| `.opencode/skills/sk-code/SKILL.md` | Modify | Add STACK_FOLDERS contract; update OpenCode resource map; bump version |
| `.opencode/skills/sk-code/description.json` | Modify | Add new keyword tokens; bump version |
| `references/opencode/shared/universal_patterns.md` | Modify | Fix stale relative link line 551-554 |
| `.opencode/skills/sk-code/changelog/v3.2.0.0.md` | Create | Changelog entry per template |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | 077 Finding |
|----|-------------|---------------------|-------------|
| REQ-001 | 5 authoring checklists exist with canonical structure (Purpose, When, Pre-checks, Steps, Post-checks, Related) | Files present; each has all 6 sections | F-006-002, F-007-001 |
| REQ-002 | spec_folder_write recipe exists | `assets/opencode/recipes/spec_folder_write.md` present | F-007-002, F-008-004 |
| REQ-003 | STACK_FOLDERS contract restored as a machine-readable Python-style dict in SKILL.md | grep `STACK_FOLDERS\s*=\s*{` returns ≥1 hit in SKILL.md | F-008-001 |
| REQ-004 | SKILL.md OpenCode resource map points to 5 new authoring checklists + spec_folder_write recipe | grep finds `skill_authoring.md\|agent_authoring.md\|command_authoring.md\|mcp_server_authoring.md\|spec_folder_authoring.md\|spec_folder_write.md` in SKILL.md | F-008-002 |
| REQ-005 | F-001-005 stale link fixed | grep `assets/opencode/checklists/universal_checklist.md` in `references/opencode/shared/universal_patterns.md` returns ≥1 hit | F-001-005 |
| REQ-006 | SKILL.md frontmatter version bumped 3.1.0.0 → 3.2.0.0 | grep `version: 3.2.0.0` SKILL.md | — |
| REQ-007 | description.json version bumped 3.1.0.0 → 3.2.0.0 | grep `"version": "3.2.0.0"` description.json | — |
| REQ-008 | Changelog v3.2.0.0.md created using compact format | File present at `.opencode/skills/sk-code/changelog/v3.2.0.0.md`; header matches template | — |
| REQ-009 | validate.sh --strict on 078/001 exits 0 | Validator returns 0/0 | — |
| REQ-010 | One commit on main + pushed | `git push origin main` exit 0 | — |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | Each authoring checklist references at least one prior canonical example by file path | grep `.opencode/` paths in each checklist returns ≥1 hit each |
| REQ-012 | spec_folder_write recipe references system-spec-kit `validate.sh --strict` and the canonical 4-doc Level-1 contract | grep returns hits for both terms |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An AI agent or human author starting a new skill/agent/command/mcp-server/spec-folder write under `.opencode/` can find a single canonical authoring checklist + recipe by reading sk-code's OpenCode resource map.
- **SC-002**: F-008-001 STACK_FOLDERS regression closed — the contract is machine-readable + canonical (single source of truth).

### Given/When/Then Verification Scenarios

**Given** sk-code is loaded by `/speckit:complete` (after Phase 2 ships), **When** the implementation target is under `.opencode/skills/`, **Then** the relevant authoring checklist is one of the loaded resources.

**Given** a maintainer reads SKILL.md OpenCode resource map, **When** they look for "how do I author a new skill", **Then** they see `skill_authoring.md` listed and pointed-to.

**Given** a fresh-clone CocoIndex query for "skill authoring checklist", **When** it ranks results, **Then** the new `skill_authoring.md` appears in the top results (verified after Phase 3 canonical-priority ships).

**Given** validate.sh --strict on 078/001, **When** running, **Then** 0 errors and 0 warnings.

**Given** all changes committed, **When** running `git push origin main`, **Then** push succeeds.

**Given** F-001-005 fix applied, **When** following the link from `universal_patterns.md` line 551-554, **Then** it resolves to a real file at `../../assets/opencode/checklists/universal_checklist.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | New checklists may duplicate content already in sk-doc/references/specific/ | Low | Each checklist references sk-doc as the source-of-truth for doc structure; checklists focus on the OpenCode AUTHORING workflow + verification, not doc content rules |
| Risk | STACK_FOLDERS dict may break sk-code router runtime if format changes | Med | Restore the dict but keep the inline string fallback for compatibility; verify smart router still loads via existing test scenarios |
| Risk | Adding 6 new files inflates skill load on every prompt | Low | All new files are CONDITIONAL or ON_DEMAND in the resource map (loaded only on intent match) |
| Dependency | sk-code SKILL.md current state (post-069 v3.1.0.0) | Green | Just shipped; baseline is clean |
| Dependency | sk-doc changelog template for the v3.2.0.0.md authoring | Green | At `.opencode/skills/sk-doc/assets/documentation/changelog_template.md` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Scope is concrete; finding IDs from 077 map directly to REQs.
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
