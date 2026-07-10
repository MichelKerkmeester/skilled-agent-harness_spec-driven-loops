---
title: "Implementation Plan: shutdown durability"
description: "Add missing forwarded-signal handlers, keep vectorIndex close AFTER the fileWatcher drain in fatal shutdown cleanup (reverted an initial hoist that reopened the DB post-TRUNCATE), and lengthen launcher SIGKILL grace by using the existing 7000ms respawn reap constant."
trigger_phrases:
  - "shutdown durability plan"
  - "forwarded signal grace plan"
  - "vectorIndex close ordering plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/009-shutdown-durability"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented shutdown durability guards"
    next_safe_action: "Run staged verification"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Shutdown Durability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript MCP server + Node CJS launcher |
| **Framework** | `@modelcontextprotocol/sdk`, better-sqlite3 shutdown path |
| **Storage** | `context-index.sqlite` via `vectorIndex.closeDb()` |
| **Testing** | vitest source-level regression tests plus staged launcher/build checks |

### Overview
The daemon already checkpoints WAL on close through packet 008. This plan makes the shutdown path durable enough for that checkpoint to finish: register all signals the launcher forwards, make the synchronous DB close run before any awaited cleanup, and give the child 7000ms from the launcher before SIGKILL instead of the previous hardcoded 5000ms.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `sk-code` OpenCode TypeScript/Node route loaded.
- [x] Required shutdown, launcher, and test files read before edits.
- [x] Sibling packet 008 and manifest template structure reviewed.

### Definition of Done
- [ ] Launcher syntax check passes.
- [ ] MCP server TypeScript build passes.
- [ ] Targeted vitest suites pass.
- [x] Source-order assertion confirms vectorIndex close runs AFTER the fileWatcher drain.
- [ ] Packet strict validation exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Bounded graceful shutdown: drain async producers (file watcher) FIRST, then run the synchronous DB close/checkpoint so its TRUNCATE captures the drained writes and nothing reopens the DB afterward.

### Key Components
- **`fatalShutdown`** (`context-server.ts`): owns daemon cleanup order and process exit.
- **`shutdownLauncherForSignal`** (`mk-spec-memory-launcher.cjs`): forwards external signals to child processes and eventually SIGKILLs lingering children.
- **`context-server.vitest.ts`**: source-level contract tests for handlers and shutdown cleanup ordering.

### Data Flow
external signal -> launcher forwards same signal -> daemon handler calls `fatalShutdown` -> awaited `fileWatcher` drain finishes its in-flight DB writes -> `vectorIndex.closeDb()` performs the close-time WAL checkpoint capturing those writes -> launcher grace (7000ms) outlasts daemon deadline (5000ms) -> no SIGKILL before the daemon has had its full bounded cleanup window.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `fatalShutdown` cleanup IIFE | Ordered cleanup under a 5000ms race | Keep synchronous vectorIndex close AFTER the fileWatcher drain (+ invariant comment); reverted an initial hoist that reopened the DB post-TRUNCATE | Source-order vitest assertion |
| process signal handlers | SIGTERM/SIGINT only | Add SIGHUP/SIGQUIT with exit code 0 | Source regex vitest assertion |
| launcher forwarded-signal shutdown | Waits 5000ms before SIGKILL | Use `RESPAWN_REAP_GRACE_MS` for both waits | Node syntax check and launcher vitest suites |
| packet docs | New child packet | Add Level 2 docs and checklist | `validate.sh --strict` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `context-server.ts` shutdown region and `main()` connect point.
- [x] Read launcher signal shutdown region.
- [x] Read existing context-server shutdown tests and optional lifecycle/signal-vocab tests.

### Phase 2: Core Implementation
- [x] Add SIGHUP and SIGQUIT daemon handlers.
- [x] Keep vectorIndex close AFTER the async fileWatcher drain (reverted hoist per review) + invariant comment.
- [x] Replace launcher 5000ms waits with `RESPAWN_REAP_GRACE_MS`.

### Phase 3: Verification
- [x] Add vitest assertions for signal handlers and cleanup order.
- [ ] Run staged verification commands in order.
- [ ] Run strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | Launcher CJS syntax | `node --check` |
| Build | MCP server TypeScript compilation | `npm run build --workspace=@spec-kit/mcp-server` |
| Regression | context server, launcher watchdog, launcher lease, lifecycle shutdown, signal vocab | vitest |
| Contract | Packet docs and metadata-free child packet shape | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 008 close-time WAL checkpoint | Internal | Present | This packet depends on `vectorIndex.closeDb()` doing the synchronous checkpoint |
| `RESPAWN_REAP_GRACE_MS` constant | Internal | Present | Gives launcher 7000ms external grace |
| `SHUTDOWN_DEADLINE_MS` | Internal | Preserved at 5000ms | Daemon deadline remains bounded and below launcher grace |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: shutdown tests or launcher behavior regress.
- **Procedure**: restore the previous handler set, cleanup order, and launcher wait literals in the three edited files. No data migration or DB recovery is involved.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (confirm) -> Phase 2 (implement) -> Phase 3 (verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5 hour |
| Core Implementation | Low | 0.25 hour |
| Verification | Medium | 0.75 hour |
| **Total** | | **~1.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No DB files or recovery operations touched.
- [x] No SQLite pragma changes touched.
- [x] No probe timeout changes touched.

### Rollback Procedure
1. Restore the exact previous signal handler set and cleanup order.
2. Restore launcher forwarded-signal waits to their previous literals.
3. Re-run the staged verification set.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
