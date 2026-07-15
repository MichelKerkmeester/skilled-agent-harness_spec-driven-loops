---
title: "Implementation Plan: Skill Advisor Cross-Session Reconnect Hardening"
description: "Implement code-index launcher parity for skill-advisor reconnect recovery: handle bridge respawn decisions, safely clean stale child pids, harden bootstrap lock reclaim, terminate model-server roots, and update replay classification."
trigger_phrases:
  - "skill advisor launcher plan"
  - "dead socket respawn plan"
  - "stale lease cleanup plan"
  - "bootstrap lock reclaim"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/013-advisor-and-codegraph-migrated-items/001-skill-advisor-cross-session-reconnect"
    last_updated_at: "2026-06-11T10:05:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Filled launcher remediation plan."
    next_safe_action: "Use deferrals for future follow-up."
    blockers: []
    key_files:
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-launcher-orphan-reaping.vitest.ts"
    session_dedup:
      fingerprint: "sha256:7a2d741f7c3e957f882efc4f9afcd22f03e97b7dfc6093ec5588148df0fa70b8"
      session_id: "skill-advisor-cross-session-reconnect-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use the simpler code-index launcher as the reference shape."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Skill Advisor Cross-Session Reconnect Hardening

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Language/Stack | CommonJS launcher, TypeScript/Vitest tests, Node.js MCP runtime |
| Framework | OpenCode launcher scripts and MCP server test harness |
| Storage | Skill-advisor SQLite database directory and filesystem lease files |
| Testing | Vitest, `npm run typecheck`, CLI offline smoke, strict spec validation |

### Overview

The remediation keeps the skill-advisor launcher B-shaped: a foreground launcher owns a non-detached advisor child and bridges additional clients through the shared IPC socket. The plan mirrors the code-index launcher helpers for dead-socket respawn, local pid waits, owner-lease cleanup, and atomic bootstrap-lock reclaim, then adapts them to the advisor's launcher-owned owner lease and childPid-bearing launcher lease.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Review findings mapped to concrete launcher functions and test gaps.
- [x] Reference launchers read before implementation.
- [x] Scope limited to launcher, sandboxed tests, and packet docs.

### Definition of Done

- [x] `npm run typecheck` passes in the skill-advisor MCP package.
- [x] The orphan-reaping Vitest file passes with the new R1/R2/serialization cases.
- [x] The launcher-session-proxy Vitest file passes.
- [x] CLI offline smoke reports `37/8/9`.
- [x] Strict packet validation exits 0.
- [x] Changed code comment-hygiene checks are clean.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Foreground launcher with single-writer owner lease, bootstrap-lock serialization, reconnecting session proxy, inherited stdio child, and temp-dir test isolation.

### Key Components

- `mk-skill-advisor-launcher.cjs`: owns owner lease, launcher lease, bootstrap lock, child process, model-server supervision, and respawn orchestration.
- `launcher-ipc-bridge.cjs`: deep-probes the lease holder socket and returns bridge/report/respawn decisions.
- `launcher-session-proxy.cjs`: bridges secondary client stdio to the current daemon and handles replayability rules.
- `skill-advisor-launcher-orphan-reaping.vitest.ts`: copies launcher fixtures into temp workspaces and validates recovery without host daemon interaction.

### Data Flow

1. A secondary launcher detects an owner lease or daemon lease.
2. The bridge helper deep-probes the recorded socket path.
3. Responsive socket: the secondary client bridges through the session proxy.
4. Dead or hung socket: the launcher acquires the bootstrap lock, reaps the recorded advisor child pid, writes a fresh owner lease, starts the owner heartbeat, and launches a replacement advisor child.
5. Stale launcher lease: the recorded child pid is bridged if responsive, otherwise cleanup is deferred until the bootstrap lock is held.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Launcher bridge decision handling | Converts lease-holder probe result into bridge/report/respawn behavior | Handle `{ action: "respawn" }` and launch replacement under serialization | Dead-socket respawn Vitest case asserts stdout initialize response |
| Owner and launcher lease files | Preserve single-writer ownership and recorded child pid | Add pid-specific owner lease clear and stale child cleanup | Stale wedged child and two-reclaimer Vitest cases |
| Bootstrap lock | Serializes build, lease write, stale cleanup, and replacement spawn | Use 300 second stale threshold and atomic rename claim | Two-reclaimer Vitest case and strict validation |
| Model-server supervision | Owns optional Hugging Face model-server child/root | Signal root before descendant reap and pid clear | Typecheck and launcher code review |
| Replay classifier | Decides which in-flight requests can replay after reconnect | Move `advisor_validate` unsafe, keep `advisor_recommend` replayable | Session proxy Vitest plus launcher classifier export |
| Packet docs | Preserve continuity and decisions | Replace scaffolds with shipped-state docs | Strict packet validation |

Invariant: no replacement advisor child may launch until the bootstrap lock is held and the recorded stale or wedged child pid has been handled.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Launcher Respawn Parity

- [x] Add local `waitForPidExit`, `reapOwnerBeforeRespawn`, `clearOwnerLeaseFileIfOwner`, and `respawnAfterDeadSocket` helpers.
- [x] Wire `bridgeOrReportLeaseHeld` to inspect `decision.action === "respawn"`.
- [x] Adapt respawn target selection to prefer `readLeaseFile().childPid` and fall back to the daemon lease owner pid.
- [x] Start the owner lease heartbeat after exclusive owner lease acquisition and before `launchServer()`.

### Phase 2: Stale Lease and Lock Safety

- [x] Read stale launcher lease `childPid` and `socketPath`.
- [x] Bridge responsive stale child pids and defer unresponsive child cleanup until the bootstrap lock is held.
- [x] Log daemon-side lease check failures at operational log level.
- [x] Replace stale bootstrap lock `rmSync` with atomic rename claim and 300 second stale threshold.

### Phase 3: Model Server and Replay Hardening

- [x] Signal the model-server root before descendant reap and pid clear on launcher exit.
- [x] Use the same root termination order for model-server RSS breach cleanup.
- [x] Move `advisor_validate` to unsafe replay classification while keeping `advisor_recommend` replayable.

### Phase 4: Tests and Docs

- [x] Add sandboxed dead-socket respawn coverage with end-to-end stdout response.
- [x] Add sandboxed stale wedged child cleanup coverage.
- [x] Strengthen stale owner-lease reclaim coverage with concurrent launchers.
- [x] Replace scaffolded packet docs with current shipped-state content.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Typecheck | Skill-advisor MCP package | `npm run typecheck` |
| Launcher integration | Dead socket, stale lease, child reaping, bootstrap serialization | `npm test -- --run tests/skill-advisor-launcher-orphan-reaping.vitest.ts` from the skill-advisor MCP package |
| Proxy regression | Reconnecting session proxy replay and protocol handling | `vitest run tests/launcher-session-proxy.vitest.ts` from the spec-kit MCP package |
| CLI surface | Daemon CLI tool counts | `node .opencode/bin/cli-offline-smoke.cjs` |
| Spec validation | Packet docs and metadata | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` |
| Comment hygiene | Changed code comments | Comment-hygiene grep/check script on changed code |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Code-index launcher reference | Internal | Green | Supplies the parity shape for respawn and lock helpers. |
| Spec-memory launcher reference | Internal | Green | Supplies model-server root cleanup order and confirms what is intentionally deferred. |
| Launcher bridge helper | Internal | Green | Supplies the deep-probe respawn decision. |
| Vitest sandbox fixtures | Internal | Green | Prevent host daemon/socket/db interaction during tests. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Trigger: typecheck, targeted launcher tests, session proxy tests, CLI smoke, strict validation, or comment hygiene fails after remediation.
- Procedure: keep the spec docs intact, inspect the failing output, and revert only the specific launcher/test change that caused the failure. Do not touch host daemons, live sockets, or unrelated worktree changes.
<!-- /ANCHOR:rollback -->
