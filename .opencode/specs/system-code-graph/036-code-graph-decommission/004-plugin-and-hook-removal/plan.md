---
title: "Implementation Plan: Phase 4: plugin-and-hook-removal"
description: "Deleted the two OpenCode plugins and their tests, removed the Codex/Cursor/Devin freshness hooks, stripped post-commit invalidation and daemon-match patterns from lifecycle scripts, removed the orphan freshness-state directory, and repointed the session-cleanup test at a surviving launcher."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/004-plugin-and-hook-removal"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-004-plugin-and-hook-removal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: plugin-and-hook-removal

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (plugins) + shell (lifecycle scripts) |
| **Framework** | OpenCode plugins, Codex/Devin hook manifests, git/session hooks |
| **Storage** | None (freshness-state dir removed) |
| **Testing** | vitest (session-cleanup suite), shell dry-runs |

### Overview
Deleted the two OpenCode plugins (transport bridge + freshness) with their tests, removed the freshness hook entries from the Codex and Devin manifests plus the Cursor chained hook housed inside `system-spec-kit`, stripped post-commit database invalidation, removed the daemon match patterns from the session reapers and orphan sweeper, cleaned worktree copy/exclude rules, and deleted the orphan `.code-graph-freshness-state` directory. The session-cleanup test was repointed at a surviving launcher (13/13 green).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Load-time and lifecycle-time path severance: delete plugins outright (static ESM import failure cannot degrade gracefully), structurally remove hook entries, and strip daemon-match patterns from reaper scripts.

### Key Components
- **Plugins**: `mk-code-graph.js` (transport bridge) + `mk-code-graph-freshness.js` + tests
- **Hook manifests**: `.codex/hooks.json`, `.devin/hooks.v1.json`, Cursor `post-tool-use.mjs` inside spec-kit
- **Lifecycle scripts**: `post-commit`, `session-cleanup.sh`, `orphan-mcp-sweeper.sh`, `worktree-session.sh`

### Data Flow
No load-time or lifecycle-time path resolves into the skill folder, so plugin hosts load cleanly and reapers no longer match a daemon that will never exist.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a `fix_bug` finding; this is a decommission path-severance sweep. The behavioral surface is removal of code-graph lifecycle wiring.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| OpenCode plugins | Imported skill bridges at load time | Deleted (plugins + tests) | plugin dir clean; host loads |
| Hook manifests | Registered freshness hooks | Removed structurally | manifests parse, omit entry |
| Reaper scripts | Matched the code-graph daemon | Pattern removed | session-cleanup test 13/13 |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Enumerated plugins, hook manifests, and lifecycle scripts touching the skill folder
- [x] Identified the Cursor hook housed inside `system-spec-kit` (outside the other three)

### Phase 2: Core Implementation
- [x] Deleted `mk-code-graph.js` + `mk-code-graph-freshness.js` + their tests
- [x] Removed freshness hook from `.codex/hooks.json` and `.devin/hooks.v1.json`
- [x] Stripped the Cursor chained hook inside `system-spec-kit`
- [x] Removed post-commit database invalidation
- [x] Removed daemon match patterns from `session-cleanup.sh` and `orphan-mcp-sweeper.sh`
- [x] Cleaned worktree copy/exclude rules in `worktree-session.sh`
- [x] Deleted the `.code-graph-freshness-state` directory

### Phase 3: Verification
- [x] Session-cleanup test repointed at a surviving launcher, 13/13 green
- [x] Hook manifests parse and omit the entry; reapers match nothing
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | session-cleanup suite repointed to surviving launcher | vitest (13/13) |
| Manual | hook manifest parse, reaper dry-run, post-commit commit | shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 (deregistration) | Internal | Green | Nothing respawns the daemon while hooks are edited |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A plugin or hook must be restored (not expected; decommission is the end state).
- **Procedure**: Restore the deleted plugin/hook files from git history and re-add the daemon-match patterns to the reaper scripts.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
