---
title: "Implementation Plan: Phase 13: skill-deletion-and-daemon-reap"
description: "The irreversible step: reaped the running daemon process and its /tmp IPC socket in this session, and confirmed the skill directory is absent from both the working tree and the git index after a concurrent session removed it. No pre-deletion backup of ignored SQLite/WAL/lease state was possible because the tree was already gone."
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
    packet_pointer: "system-code-graph/036-code-graph-decommission/013-skill-deletion-and-daemon-reap"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-013-skill-deletion-and-daemon-reap"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 13: skill-deletion-and-daemon-reap

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
| **Language/Stack** | Shell (process reap), git (tree removal) |
| **Framework** | None |
| **Storage** | SQLite/WAL/lease state (ignored, unrecoverable) |
| **Testing** | Process check, socket check, `git ls-files` |

### Overview
Reaped the running daemon process and its `/tmp/mk-code-index` IPC socket in this session, and confirmed the skill directory is absent from both the working tree and the git index. The directory was already removed by a concurrent session before this phase ran, so the pre-deletion backup of ignored SQLite/WAL/lease state was impossible and is recorded as a limitation.
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
Process teardown (daemon reap, socket release) plus tree-absence confirmation.

### Key Components
- **Daemon process**: reaped in this session; no `mk-code-index` process survives
- **IPC socket**: `/tmp/mk-code-index` socket removed; no stale socket directory remains
- **Skill directory**: absent from disk and git index (removed by concurrent session)
- **Ignored state**: SQLite, WAL, and lease files were never tracked and are unrecoverable

### Data Flow
Process first, then socket, then tree-absence confirmation. The directory was already gone before this phase ran, so the reap was the remaining work.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable as a fix_bug finding. This phase is a process teardown and tree removal, not a bug fix.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Daemon process | Running mk-code-index process | Reaped | Process check finds nothing |
| IPC socket | `/tmp/mk-code-index` bound socket | Removed | No socket at the path |
| Skill directory | Subsystem on disk and in git index | Absent (concurrent session) | `git ls-files` shows nothing under the old path |
| Ignored state | SQLite/WAL/lease files | Unrecoverable (never tracked, tree gone) | Recorded as limitation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirmed phases 003-012 complete and verified before this phase
- [x] Confirmed the repository was quiet (no concurrent session mid-write)

### Phase 2: Core Implementation
- [x] Reaped the running daemon process (no `mk-code-index` process survives)
- [x] Removed the `/tmp/mk-code-index` IPC socket and its temporary directory
- [x] Confirmed the skill directory is absent from the working tree (concurrent session removed it)
- [x] Confirmed the skill directory is absent from the git index (`git ls-files` clean)

### Phase 3: Verification
- [x] No `mk-code-index` process running (process check empty)
- [x] No `/tmp/mk-code-index` socket (socket check empty)
- [x] 0 tracked files under the old skill path (`git ls-files`)
- [x] No `mk_code_index` in `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.pi/mcp.json`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Process check | `pgrep` / process listing |
| Manual | Socket check | filesystem check at `/tmp/mk-code-index` |
| Manual | Tree absence | `git ls-files` under old skill path |
| Manual | Config sweep | `rg --hidden --no-ignore mk_code_index` across configs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 003-012 | Internal | Green | A surviving consumer would break on deletion |
| Quiet repository | Internal | Green | A concurrent session writing during deletion could corrupt the removal |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The subsystem must be restored (not expected; the decommission is the intended end state).
- **Procedure**: Restore the skill directory from git history per the phase 002 rollback procedure (ADR-005). Ignored state (SQLite, WAL, lease files) was never tracked and cannot be restored; the daemon would rebuild its database on first run.
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
