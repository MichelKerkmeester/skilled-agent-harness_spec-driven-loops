---
title: "Feature Specification: Phase 11: doctrine-and-docs"
description: "Rewrite the project doctrine that mandates structural code search: the Mandatory Tools table, Code Search Decision Tree, MCP server roster, and daemon fallback ladder in AGENTS.md, plus the READMEs and install guides that document the subsystem."
trigger_phrases:
  - "AGENTS.md code graph removal"
  - "mandatory tools code graph"
  - "code search decision tree rewrite"
  - "install guide code graph deletion"
  - "036 doctrine and docs"
importance_tier: "critical"
contextType: "documentation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/011-doctrine-and-docs"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Executed the phase and verified it"
    next_safe_action: "Closeout verification in phase 015"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-011-doctrine-and-docs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11: doctrine-and-docs

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 15 |
| **Predecessor** | 010-agent-definitions |
| **Successor** | 012-ci-and-binaries |
| **Handoff Criteria** | No instruction file mandates, and no README documents, a subsystem that is being removed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the code graph decommission specification.

**Scope Boundary**: Root instruction files, READMEs, and install guides.

**Dependencies**:
- Phase 002 supplies the replacement routing that the rewritten decision tree must name.

**Deliverables**:
- The Mandatory Tools table, Code Search Decision Tree, MCP roster, and daemon fallback ladder rewritten.
- The Claude runtime search-routing directive rewritten.
- The root README's coverage of the subsystem removed.
- The dedicated setup guide deleted and its index entry removed.
- Binary and library READMEs updated.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Project doctrine does not merely mention the code graph; it mandates it. The Mandatory Tools table lists it as required, the Code Search Decision Tree routes concept discovery to it by default, the MCP routing section states a registered-server count that will be wrong, and the daemon fallback ladder offers a CLI front door that will not exist. One further trap: `CLAUDE.md` and `AGENTS.md` are the same file through a symlink, so an edit applied twice would be applied to itself, and an audit counting both would double-count.

### Purpose
Leave doctrine that tells the truth about the tools available — with the search decision tree routing somewhere real, the server count correct, and no setup guide for a subsystem that has been removed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The Mandatory Tools table, Code Search Decision Tree, MCP routing roster, daemon fallback table, and Quick Reference rows.
- The Claude runtime search-routing directive.
- The root README's subsystem coverage.
- The install-guides index and the dedicated setup guide.
- Binary and library READMEs describing the launcher and CLI.

### Out of Scope
- Agent definitions — phase 010.
- Skill-local documentation — phase 008.
- Archived spec packets, changelogs, and benchmark reports.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` | Modify | Same file as `CLAUDE.md` via symlink; edit once |
| `.claude/CLAUDE.md` | Modify | Rewrite the search-routing directive |
| `README.md` | Modify | Remove subsystem coverage |
| `.opencode/install-guides/SET-UP - Code Graph.md` | Delete | Entire guide is about the removed subsystem |
| `.opencode/install-guides/README.md` | Modify | Remove the index entry |
| `.opencode/bin/README.md` | Modify | Remove launcher and CLI documentation |
| `.opencode/bin/lib/README.md` | Modify | Remove bridge documentation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No doctrine mandates a removed tool | The Mandatory Tools table lists only surviving tools |
| REQ-002 | The search decision tree routes somewhere real | Concept and structural discovery route to the phase 002 replacement |
| REQ-003 | The registered-server count is correct | The stated count matches the registrations that remain |
| REQ-004 | The symlinked instruction file is edited once | `CLAUDE.md` and `AGENTS.md` remain the same inode with one set of edits |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The daemon fallback ladder lists only live daemons | No row offers a CLI for a removed daemon |
| REQ-006 | Quick Reference rows stay accurate | No workflow row names a removed tool |
| REQ-007 | Deleted guides leave no dangling index entry | The install-guides index resolves fully |
| REQ-008 | Doctrine does not describe the removal itself | Instruction files state the current state, not the migration narrative |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader following the Code Search Decision Tree reaches a tool that exists.
- **SC-002**: No instruction file, README, or guide references the removed subsystem.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Symlink treated as two files | Duplicate or self-conflicting edits | REQ-004 makes the single-edit rule explicit |
| Risk | Doctrine left mandating a missing tool | Every future session follows a dead route | REQ-001 and REQ-002 are P0 |
| Risk | Rewrite turns doctrine into a changelog | Instruction files accumulate migration prose | REQ-008 keeps them in the present tense |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the Code Search Decision Tree gain an explicit note that structural search is unavailable, or simply omit the row?
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
