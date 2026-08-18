---
title: "Feature Specification: sk-vision MCP server process-lifecycle guards"
description: "Stop the sk-vision MCP stdio server from leaking orphaned node processes when its Cursor/Devin host dies, by wiring idempotent multi-path self-termination guards including a reparent-to-init watchdog."
trigger_phrases:
  - "sk-vision mcp server zombie processes"
  - "sk-vision mcp process lifecycle guards"
  - "sk-vision mcp orphan watchdog"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/021-mcp-server-process-lifecycle"
    last_updated_at: "2026-08-18T17:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Hardened the sk-vision MCP stdio server with idempotent multi-path shutdown guards; tests green."
    next_safe_action: "Commit the source fix on v4 once the operator approves."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/021-mcp-server-process-lifecycle/spec.md"
      - ".opencode/skills/sk-vision/vision-runtime/src/mcp/server.ts"
      - ".opencode/skills/sk-vision/vision-runtime/src/mcp/server.test.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-021-mcp-server-process-lifecycle"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-vision MCP server process-lifecycle guards

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-08-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `specs/sk-vision/001-sk-vision-fork-of-opencode-senses` |
| **Predecessor** | `020-cursor-mcp-decoupling` |
| **Handoff Criteria** | The MCP stdio server self-terminates on every teardown path (transport close, stdin EOF, SIGTERM/SIGINT/SIGHUP, and reparent-to-init), so no orphaned `node dist/mcp-server.js` survives its host; the guard is unit-tested and the shutdown is idempotent. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

sk-vision reaches its four hosts two ways. OpenCode and Pi load it as an **in-process plugin**, so it shares the host's lifetime and cannot outlive it. Cursor and Devin have no in-process plugin API, so both launch one shared **MCP stdio server** — `vision-runtime/src/mcp/server.ts`, built to `dist/mcp-server.js` and started as `node dist/mcp-server.js`. That server child is the only sk-vision surface that can be orphaned, and it was.

**Deliverables**: an exported, unit-tested guard that terminates the server on every teardown path plus a reparent-to-init watchdog, wired into `runSkVisionMcpServer`, with the built artifact rebuilt so the fix is live.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The MCP server installed no lifecycle hardening. `runSkVisionMcpServer()` set only `server.server.onclose = () => { void client.close(); }` — which never calls `process.exit`, and there was no stdin-EOF, signal, or reparent guard. When a host is killed abruptly (a SIGKILL delivers **no** signal to the child and closes no stream cleanly), the node process is reparented to init (its `ppid` becomes 1) and lingers forever at 0% CPU. Each dispatch that ends this way leaks one orphan, and the RuntimeClient's python child leaks with it.

### Purpose
Make the server terminate itself on every teardown path a stdio child can observe, and add a reparent-to-init watchdog for the SIGKILL case that emits no signal, so no sk-vision MCP process outlives its host.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add an exported `installMcpLifecycleGuards` helper to `vision-runtime/src/mcp/server.ts` binding one idempotent shutdown to `onclose`, stdin `end`/`close`, `SIGTERM`/`SIGINT`/`SIGHUP`, and a reparent-to-init watchdog.
- Replace the bare `onclose` in `runSkVisionMcpServer` with the helper call.
- Add unit tests for the guard and rebuild the gitignored `dist/mcp-server.js`.

### Out of Scope
- The OpenCode/Pi in-process adapters (share the host lifetime; do not orphan).
- The python runtime, providers, tool definitions, and their schemas.
- Any host MCP config (`hooks/cursor/mcp.json`, `hooks/devin/mcp_config.json`) — the launch command is unchanged.
- Committing or pushing — the working tree carries unrelated in-flight work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-vision/vision-runtime/src/mcp/server.ts` | Update | Add the guard helper; wire it into `runSkVisionMcpServer` |
| `.opencode/skills/sk-vision/vision-runtime/src/mcp/server.test.ts` | Update | Add three guard unit tests; keep the transport test |
| `.opencode/skills/sk-vision/vision-runtime/dist/mcp-server.js` | Rebuild | Gitignored build artifact regenerated by `bun run build` |

### Verification evidence
- `tsc --noEmit` exit 0; `bun test src/mcp/server.test.ts` 4 pass / 0 fail; `bun run build` exit 0.
- 8 guard-symbol hits (`installMcpLifecycleGuards`/`orphanWatch`/`process.ppid`/`SIGHUP`) in the rebuilt `dist/mcp-server.js`.
- Git footprint is exactly the two source files; `dist` is gitignored.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Terminate on graceful teardown | Server exits on transport `onclose`, stdin `end`/`close`, and `SIGTERM`/`SIGINT`/`SIGHUP` |
| REQ-002 | Detect the SIGKILL orphan | A watchdog terminates the server when `process.ppid === 1` (reparented to init) |
| REQ-003 | Single, idempotent shutdown | Every path runs one shutdown; the RuntimeClient is closed once (reaping the python child) and the process exits once |
| REQ-004 | Unit-testable without exiting the runner | `exit` and the parent-pid probe are injectable |
| REQ-005 | Watchdog must not pin the loop | The reparent timer is `unref()`'d so an idle-but-parented server can still exit through the other paths |
| REQ-006 | No collateral change | No new dependency, no config change, and the 13 tools and their schemas are unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] `installMcpLifecycleGuards` is exported and wires all five teardown paths plus the reparent watchdog. Evidence: `server.ts` review; 8 guard-symbol hits in the built `dist/mcp-server.js`.
- [x] Shutdown is idempotent across concurrent teardown events. Evidence: the "is idempotent across multiple shutdown events" test asserts `close` and `exit` each run exactly once.
- [x] The reparent watchdog fires and terminates when `ppid === 1`. Evidence: the "exits when reparented to init" test drives `getParentPid: () => 1` and observes one `close` + one `exit(0)`.
- [x] The existing 13-tool stdio-transport behavior is unchanged. Evidence: the pre-existing "lists 13 tools ... loaded: false" test still passes.
- [x] Typecheck and the full server suite pass and the artifact rebuilds. Evidence: `tsc --noEmit` exit 0; `bun test` 4 pass / 0 fail; `bun run build` exit 0.
- [ ] Changes committed on v4. Evidence: pending the operator's go-ahead.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A too-eager guard terminates a still-wanted server | Dropped Cursor/Devin session | Shutdown only fires on genuine teardown signals; the watchdog only triggers on reparent-to-init, which never happens while the real host lives |
| Risk | Reparent detection latency | An orphan lingers up to one poll interval (default 5s) | Bounded and small; the graceful paths cover every non-SIGKILL case immediately |
| Dependency | `process.ppid` reparent semantics + `timer.unref()` | No universal SIGKILL detector / a pinned loop without them | Both are stable Node/Bun runtime features |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: How is a SIGKILLed host detected when no signal or EOF reaches the child? **A**: By watching for reparent-to-init (`process.ppid === 1`), the only universal orphan signal.
- **Q**: Implementer for the fix? **A**: DeepSeek V4 Flash (xhigh) via cli-opencode with the cline-pass provider, reviewed and ported into the main checkout.

### Open Questions
- None.
<!-- /ANCHOR:questions -->
