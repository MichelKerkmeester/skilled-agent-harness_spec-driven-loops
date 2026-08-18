---
title: "Implementation Plan: sk-vision MCP server process-lifecycle guards"
description: "Add an exported, injectable installMcpLifecycleGuards helper wiring every self-termination path and a reparent-to-init watchdog, then call it from runSkVisionMcpServer."
trigger_phrases:
  - "sk-vision mcp process lifecycle guards plan"
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
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/021-mcp-server-process-lifecycle/plan.md"
      - ".opencode/skills/sk-vision/vision-runtime/src/mcp/server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-021-mcp-server-process-lifecycle"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-vision MCP server process-lifecycle guards

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Bun runtime), MCP SDK stdio server |
| **Framework** | `@modelcontextprotocol/sdk` server + `RuntimeClient` python bridge |
| **Storage** | `vision-runtime/src/mcp/server.ts` (source), gitignored `dist/mcp-server.js` (built artifact) |
| **Testing** | `bun test` (`bun:test`), `tsc --noEmit`, `bun run build` |

### Overview
Introduce one exported helper, `installMcpLifecycleGuards`, that binds a single idempotent `shutdown` to every teardown path a stdio child can observe, plus a reparent-to-init watchdog for the SIGKILL case that emits no signal. Replace the bare `onclose` in `runSkVisionMcpServer` with a call to the helper. `exit` and `getParentPid` are injectable so the guards are unit-testable.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Leak root-caused. Evidence: old `runSkVisionMcpServer` sets only `onclose`, never exits; SIGKILL delivers no signal so the child reparents to init and lingers.
- [x] Host topology confirmed. Evidence: only Cursor/Devin launch the MCP stdio child; OpenCode/Pi are in-process and cannot orphan.

### Definition of Done
- [x] All five teardown paths + reparent watchdog wired, shutdown idempotent. Evidence: `server.ts` review + tests.
- [x] Typecheck + test suite green; artifact rebuilt with guards. Evidence: `tsc` exit 0, 4/4 tests, 8 guard-symbol hits in `dist`.
- [ ] Committed on v4. Evidence: pending the operator's go-ahead.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fan-in teardown: many termination signals converge on one guarded `shutdown()` closure. A `closing` boolean makes the closure idempotent, so overlapping events collapse to a single client-close and a single exit.

### Key Components
- **`installMcpLifecycleGuards(opts)`** — binds `shutdown` to `server.server.onclose`, stdin `end`/`close`, `SIGTERM`/`SIGINT`/`SIGHUP`, and an `unref()`'d `setInterval` that exits when `getParentPid() === 1`. Returns `{ dispose }` to clear the interval.
- **`shutdown(code)`** — `if (closing) return; closing = true;` then `client.close().finally(() => exit(code))`, so the python child is reaped before exit.
- **`runSkVisionMcpServer()`** — constructs client + server, calls the helper, then connects the stdio transport.

### Data Flow
host death → (transport close | stdin EOF | signal | ppid becomes 1) → `shutdown()` → `RuntimeClient.close()` reaps python → `exit(0)`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Guard helper (done)
- [x] Add exported `installMcpLifecycleGuards` with injectable `exit`/`getParentPid`/`watchIntervalMs`; wire all paths; `unref()` the watchdog. Evidence: `server.ts` review.
- [x] Replace the bare `onclose` in `runSkVisionMcpServer` with the helper call. Evidence: `server.ts` review.

### Phase 2: Tests (done)
- [x] Add three `bun:test` cases (stdin-end shutdown, idempotency, reparent watchdog) that inject `exit` and never call the real `process.exit`; keep the existing transport test. Evidence: 4/4 pass.

### Phase 3: Build + verify (done)
- [x] `tsc --noEmit`, `bun test`, `bun run build`; confirm guards present in the rebuilt artifact. Evidence: exit codes + 8 guard-symbol hits.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | shutdown fires on stdin end; is idempotent; reparent watchdog exits | `bun test` with injected `exit`/`getParentPid` |
| Regression | 13-tool stdio transport unchanged | pre-existing `bun test` transport case |
| Type | whole runtime typechecks | `tsc --noEmit` |
| Build | artifact rebuilds and carries the guards | `bun run build` + `grep` on `dist/mcp-server.js` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `process.ppid` reparent semantics | Runtime | Available | No universal SIGKILL-orphan detector |
| `timer.unref()` | Runtime | Available | Watchdog would pin the event loop open |
| Bun build toolchain | Local | Available | `dist/mcp-server.js` could not be regenerated |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the guard terminates the server prematurely, or a host regresses.
- **Procedure**: restore `runSkVisionMcpServer` to the single `server.server.onclose = () => { void client.close(); }` line, delete the helper and its three tests, and `bun run build`. Single-file, git-tracked reversion; `dist` is a rebuild.
<!-- /ANCHOR:rollback -->
