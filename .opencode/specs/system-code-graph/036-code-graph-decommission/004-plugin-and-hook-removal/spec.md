---
title: "Feature Specification: Phase 4: plugin-and-hook-removal"
description: "Remove the two OpenCode plugins that import the skill's bridges, the Codex and Devin freshness hooks, the git post-commit invalidation, the two session reapers that match the daemon process, and the worktree copy rules."
trigger_phrases:
  - "mk-code-graph plugin removal"
  - "code graph freshness hook removal"
  - "post-commit code graph invalidation"
  - "session cleanup code graph daemon"
  - "036 plugin and hook removal"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/004-plugin-and-hook-removal"
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
      session_id: "2026-07-27-036-004-plugin-and-hook-removal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: plugin-and-hook-removal

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
| **Phase** | 4 of 15 |
| **Predecessor** | 003-runtime-deregistration |
| **Successor** | 005-spec-kit-runtime-decoupling |
| **Handoff Criteria** | No plugin, hook, or lifecycle script resolves a path inside the skill folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the code graph decommission specification.

**Scope Boundary**: Plugins, per-runtime hooks outside the config files, git hooks, and session lifecycle scripts.

**Dependencies**:
- Phase 003 removed the registrations, so nothing new spawns while these are edited.

**Deliverables**:
- Both OpenCode plugins deleted along with their tests.
- Codex and Devin freshness hook entries removed.
- Post-commit invalidation, session cleanup, orphan sweeper, and worktree copy rules cleaned.
- The orphan freshness-state directory removed.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two OpenCode plugins reach into the skill folder at load time — one through a static ESM import of a transport bridge, one through a `require` of the shared freshness core. A static import that fails does not degrade gracefully; it crashes plugin load for the whole runtime. Alongside them, the Codex and Devin hook manifests, the git post-commit hook, two daemon-reaping scripts, and the worktree session wrapper all hard-code paths into the folder.

### Purpose
Sever every load-time and lifecycle-time path into the skill, so that its later deletion cannot crash a plugin host or leave a reaper matching a process that will never exist.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Deleting the two plugins and their test files.
- Removing the Codex and Devin freshness hook registrations.
- Removing the Cursor freshness hook, which lives inside `system-spec-kit` rather than beside its three siblings.
- Refreshing the **installed** Codex hooks at `~/.codex/hooks.json` — a deployment surface outside the repository that can resurrect removed behaviour even after every tracked file is clean.
- Removing post-commit database invalidation.
- Removing the daemon match patterns from session cleanup and the orphan sweeper.
- Removing worktree copy and exclude rules for the skill's build artifacts and database.

### Out of Scope
- The Claude PostToolUse hook entry — removed in phase 003 with the other config surfaces.
- Deleting the launcher and CLI shims — phase 012.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/mk-code-graph.js` | Delete | Transport bridge plugin |
| `.opencode/plugins/mk-code-graph-freshness.js` | Delete | Freshness plugin |
| `.opencode/plugins/tests/mk-code-graph*.test.cjs` | Delete | Tests for the deleted plugins |
| `.codex/hooks.json` | Modify | Remove the freshness hook entry |
| `.devin/hooks.v1.json` | Modify | Remove the freshness hook entry |
| `.opencode/scripts/git-hooks/post-commit` | Modify | Remove database invalidation |
| `.opencode/scripts/session-cleanup.sh` | Modify | Remove the daemon match pattern |
| `.opencode/scripts/orphan-mcp-sweeper.sh` | Modify | Remove the daemon match pattern |
| `.opencode/bin/worktree-session.sh` | Modify | Remove copy, exclude, and database-dir rules |
| `.opencode/skills/.code-graph-freshness-state/` | Delete | Orphan state directory |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs` | Modify | Cursor freshness hook, housed outside the other three |
| `~/.codex/hooks.json` (installed, outside the repo) | Refresh | Re-run the installer so the deployed copy loses the hook too |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No plugin imports a path inside the skill | Plugin directory contains no reference to the folder |
| REQ-002 | Plugin host loads cleanly | Starting OpenCode produces no plugin load error |
| REQ-003 | Hook manifests no longer reference the skill | Codex and Devin manifests parse and omit the entry |
| REQ-004 | Session reapers no longer match a code-graph daemon | Cleanup scripts run without error and match nothing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Post-commit hook runs clean | A test commit produces no invalidation attempt and no error |
| REQ-006 | Worktree creation succeeds | A new worktree is created without referencing the skill's artifacts |
| REQ-007 | Deleted plugins take their tests with them | No orphaned test references a deleted module |
| REQ-008 | The installed Codex hooks match the repository | `node .opencode/bin/install-codex-hooks.mjs --check` passes after a refresh; it currently reports drift, so a clean tracked tree alone is not evidence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: OpenCode starts with no plugin load failure.
- **SC-002**: A commit, a session end, and a worktree creation each complete without touching the skill.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Static ESM import failure crashes plugin load | Runtime unusable | Delete the plugin outright rather than guarding the import |
| Risk | Session cleanup silently stops reaping other daemons | Orphan processes accumulate | Remove only the code-graph pattern; verify siblings still match |
| Dependency | Phase 003 | A live registration could respawn the daemon mid-edit | Sequence after deregistration |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the worktree wrapper need a migration note for existing worktrees that already copied the artifacts?
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
