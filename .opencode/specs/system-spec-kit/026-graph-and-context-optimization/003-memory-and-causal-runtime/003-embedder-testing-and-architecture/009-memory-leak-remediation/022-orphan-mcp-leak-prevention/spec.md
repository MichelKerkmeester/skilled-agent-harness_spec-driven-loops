---
title: "Feature Specification: Orphan MCP Leak Prevention"
description: "Prevent Codex.app and Claude Code MCP helper accumulation with a dry-run-first sweeper, a repo-local Claude Stop cleanup chain, and MCP server idle self-exit."
trigger_phrases:
  - "orphan mcp leak prevention"
  - "orphan mcp sweeper"
  - "claude session cleanup"
  - "launcher idle self kill"
  - "mcp helper process leak"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention"
    last_updated_at: "2026-05-24T06:58:36Z"
    last_updated_by: "codex"
    recent_action: "implemented dry-run MCP leak prevention packet"
    next_safe_action: "operator reviews dry-run output before LaunchAgent activation"
    blockers: []
    key_files:
      - ".opencode/scripts/orphan-mcp-sweeper.sh"
      - ".opencode/scripts/claude-session-cleanup.sh"
      - ".claude/settings.local.json"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/ipc/socket-server.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts"
    session_dedup:
      fingerprint: "sha256:0220220220220220220220220220220220220220220220220220220220220220"
      session_id: "2026-05-24-orphan-mcp-leak-prevention"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Scope includes Layers 1, 2, and 3."
      - "Claude cleanup is repo-local in .claude/settings.local.json."
      - "Launchd rollout stops at dry-run verification."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Orphan MCP Leak Prevention

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Codex.app and Claude Code can leave MCP helper stacks alive after respawns or session stops, producing linear RAM growth on this workstation. This packet adds a dry-run-first process sweeper, chains a repo-local Claude Stop cleanup command into the existing hook, and teaches the three MCP servers to exit after configurable idle time.

**Key Decisions**: dry-run-first launchd rollout, repo-local Claude hook wiring, MCP-server-owned idle timeout.

**Critical Dependencies**: macOS process tools (`ps`, `pgrep`, `lsof`, `kill`, `find`), existing Claude nested hook schema, and the current MCP IPC bridge.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Implemented, Dry-Run Review |
| **Created** | 2026-05-24 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual cleanup on 2026-05-24 found repeated orphan MCP stacks under Codex.app and stale Claude Code launcher children. The leak is large enough to consume gigabytes during normal long-running workstation use, and the current mitigation is an unsafe manual process sweep.

### Purpose
Provide automated, reviewable leak prevention that preserves active developer work while preventing stale MCP helper accumulation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A versioned, dry-run-capable orphan MCP sweeper script.
- A versioned LaunchAgent plist template that is not installed or loaded in this pass.
- A repo-local Claude Stop cleanup script chained into the existing single Stop hook.
- Idle self-exit in Spec Kit Memory, Skill Advisor, and Code Graph MCP server processes.
- Targeted tests for sweeper safety, hook shape, IPC activity, and idle timeout behavior.

### Out of Scope
- Loading the LaunchAgent into `~/Library/LaunchAgents`.
- Editing `~/.claude/settings.local.json` or any home-level Claude config.
- Filing the Codex.app upstream issue.
- Staging, committing, or branching.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/scripts/orphan-mcp-sweeper.sh` | Create | Dry-run-first stale MCP process and `/tmp` artifact sweeper. |
| `.opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist` | Create | Versioned LaunchAgent template for later operator install. |
| `.opencode/scripts/claude-session-cleanup.sh` | Create | Claude Stop cleanup for this session's MCP descendants. |
| `.claude/settings.local.json` | Modify | Chain cleanup script inside the existing single Stop hook. |
| `.opencode/skills/*/mcp_server/lib/ipc/socket-server.ts` | Modify | Add IPC activity callback support. |
| `.opencode/skills/*/mcp_server/*server*.ts` | Modify | Add idle timeout tracking and graceful self-exit. |
| MCP server tests | Modify/Create | Cover idle timeout, active client suppression, and socket cleanup. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Sweeper supports dry-run and logs kill candidates without mutation. | `--dry-run --verbose` lists stale candidates and preserve reasons without removing files or killing PIDs. |
| REQ-002 | Sweeper preserves active work and operator exclusions. | `devin --print`, `/tmp/devin-*`, `/tmp/codex-browser-use`, non-MCP TCP listeners, Ollama, live Claude descendants, and freshest young MCP instances are preserved. |
| REQ-003 | Claude cleanup stays in the existing repo-local Stop hook shape. | `.claude/settings.local.json` keeps one `Stop[0].hooks[0]` command with `async: true`, timeout >= 10, and no parallel hook fan-out. |
| REQ-004 | MCP servers exit after configurable inactivity. | `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` defaults to 30, accepts fractional test values, and `0` disables timeout. |
| REQ-005 | Idle exit is graceful. | IPC sockets close, server shutdown paths run, and launcher lease cleanup remains delegated to existing child exit handlers. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | LaunchAgent rollout remains review-only. | Template is versioned, but no `launchctl load` or home plist write occurs. |
| REQ-007 | Tests cover activity and no-activity paths. | Vitest covers no-client exit, active IPC staying alive past timeout, disable flag, and socket cleanup. |
| REQ-008 | Spec packet and parent metadata remain consistent. | Child `022` appears in parent spec and graph metadata; strict validation passes. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Dry-run sweeper identifies stale MCP stacks while preserving live dev servers and operator exclusions.
- **SC-002**: Claude Stop cleanup is chained without breaking the existing session-stop hook contract.
- **SC-003**: Idle MCP servers terminate cleanly when inactive and stay alive when a secondary IPC client remains active.
- **SC-004**: Targeted shell, JSON, TypeScript, vitest, alignment, and spec validation checks pass or failures are reported with exact causes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | False-positive process kill | High | Dry-run first, preserve live TCP listeners, preserve current session descendants, and keep newest young process per class. |
| Risk | Claude hook schema regression | High | Modify the existing nested command only and run settings parity vitest. |
| Risk | Idle timeout interrupts active MCP use | Medium | Track primary and IPC activity; allow `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0`. |
| Dependency | macOS tool availability | Medium | Use only `ps`, `pgrep`, `lsof`, `kill`, `find`, and Bash. |
<!-- /ANCHOR:risks -->

---
<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Sweeper should finish dry-run in under 10 seconds on the observed workstation process table.

### Security
- **NFR-S01**: Cleanup scripts must not eval process command lines or delete paths outside the explicit `/tmp` patterns.

### Reliability
- **NFR-R01**: Idle shutdown must be idempotent and safe when signal handlers also fire.

---

## 8. EDGE CASES

### Data Boundaries
- No matching processes: log summary and exit 0.
- Malformed age env vars: fall back to defaults.
- Missing `/tmp` matches: no-op.

### Error Scenarios
- Kill failure: log PID and exit 1 after attempting remaining candidates.
- Stubborn process after SIGTERM: send SIGKILL after 5 seconds.
- IPC socket close race: ignore already-closed sockets and still clear bridge stats.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Shell scripts, config, three MCP services, tests, spec docs. |
| Risk | 22/25 | Process termination and local runtime hook changes. |
| Research | 12/20 | Existing handoff and prior memory-leak arc reduce discovery. |
| Multi-Agent | 0/15 | Single implementer. |
| Coordination | 10/15 | Must preserve user dirty worktree and dry-run rollout. |
| **Total** | **64/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Sweeper kills a live dev server. | H | M | Preserve non-MCP TCP listeners and verify dry-run candidates. |
| R-002 | Stop hook blocks session exit. | M | L | Keep timeout bounded and command tolerant. |
| R-003 | Idle timeout exits a useful daemon too soon. | M | M | Default to 30 minutes and allow disable via env. |
| R-004 | Existing dirty files conflict with implementation. | M | M | Edit only scoped files and avoid resets. |

---

## 11. USER STORIES

### US-001: Safe Stale Process Sweep (Priority: P0)

**As an** operator, **I want** a dry-run-first process sweeper, **so that** I can review stale MCP cleanup before enabling automation.

**Acceptance Criteria**:
1. Given stale MCP helper processes, When the script runs with `--dry-run --verbose`, Then it logs candidate PIDs and preserve reasons without killing anything.

---

### US-002: Claude Session Teardown (Priority: P0)

**As an** operator using Claude Code, **I want** the repo Stop hook to clean this session's MCP descendants, **so that** finished sessions stop leaving launcher stacks behind.

**Acceptance Criteria**:
1. Given the existing single Stop hook, When cleanup is added, Then the hook remains a single nested command and runs both session-stop and cleanup.

---

### US-003: Idle MCP Self-Exit (Priority: P0)

**As an** MCP runtime maintainer, **I want** idle servers to self-exit after inactivity, **so that** launchers do not depend solely on external sweeping.

**Acceptance Criteria**:
1. Given a test timeout and no activity, When the idle timer elapses, Then the server closes IPC state and exits.
2. Given an active IPC client, When the timeout window passes, Then the server remains alive.

---

## 12. OPEN QUESTIONS

- None. The user selected Layers 1, 2, and 3, repo-local Claude config, and dry-run-first rollout.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
