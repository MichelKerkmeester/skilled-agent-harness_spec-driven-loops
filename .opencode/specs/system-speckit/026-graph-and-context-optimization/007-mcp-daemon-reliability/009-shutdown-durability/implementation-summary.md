---
title: "Implementation Summary: shutdown durability"
description: "The context server now handles SIGHUP and SIGQUIT through clean fatal shutdown, closes vectorIndex before awaited cleanup, and the launcher now gives forwarded signals a 7000ms child-reap grace."
trigger_phrases:
  - "shutdown durability summary"
  - "SIGHUP SIGQUIT fatalShutdown summary"
  - "launcher reap grace summary"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `009-shutdown-durability` |
| **Completed** | 2026-05-29 |
| **Level** | 2 |
| **Status** | implemented (code shipped); verification 2026-05-29: node --check + build + strict-validate PASS, targeted vitest (CHK-022/023) not re-run this session |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The daemon shutdown path now covers the full signal set the launcher forwards and gives the packet 008 close-time WAL checkpoint a full chance to complete before any launcher SIGKILL. `SIGHUP` and `SIGQUIT` route to `fatalShutdown(..., 0)`; `vectorIndex.closeDb()` stays AFTER the awaited `fileWatcher` drain (a focused review found that hoisting it first lets a draining watcher reindex task reopen the DB via `getDb()` and write fresh WAL frames after the TRUNCATE, defeating the durability guarantee — so the drain runs first and closeDb captures its writes, with an invariant comment encoding this); and `shutdownLauncherForSignal` uses the existing 7000ms `RESPAWN_REAP_GRACE_MS` constant for both child-exit wait paths so the launcher grace strictly exceeds the daemon's 5000ms deadline.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Add SIGHUP/SIGQUIT handlers; keep vectorIndex close after the fileWatcher drain (+ invariant comment) so drained writes are checkpointed and the DB is not reopened post-close |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | Use 7000ms launcher reap grace for forwarded signals |
| `.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts` | Modified | Assert signal handler routing and shutdown cleanup source order |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/009-shutdown-durability/*.md` | Created | Packet documentation and checklist |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change is intentionally narrow. It does not alter the daemon deadline, the Promise.race structure, uncaught exception exit codes, SQLite pragmas, probe timeout, DB files, or recovery paths. Codex initially hoisted `vectorIndex.closeDb()` to first (so the synchronous checkpoint could not be interrupted by the deadline timer); a focused adversarial re-review found this defeated the durability goal — the subsequently-awaited `fileWatcher.close()` drains in-flight reindex tasks that reopen the DB via `getDb()` and write fresh WAL frames after the TRUNCATE. The hoist was reverted: closeDb runs AFTER the drain (capturing those writes), is still synchronous-uninterruptible once reached, and the residual "slow drain starves the checkpoint of deadline budget" risk is delegated to 010 (autocheckpoint + periodic TRUNCATE keep the at-rest WAL small regardless).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Add SIGHUP/SIGQUIT as clean exits | The launcher already forwards these signals; the daemon must recognize them |
| Keep vectorIndex close AFTER the fileWatcher drain (reverted an initial hoist) | A draining watcher task reopens the DB via getDb() and writes post-TRUNCATE WAL; closeDb must run after the drain so its writes are checkpointed and no fresh WAL is left at rest (review finding) |
| Use `RESPAWN_REAP_GRACE_MS` instead of hardcoded 5000ms | Existing launcher constant is 7000ms, strictly above the daemon 5000ms deadline |
| Keep SIGKILL unhandled | SIGKILL cannot be handled and adding a handler would be misleading |
| Keep exception exits at 1 | Crash/error semantics are unrelated to clean forwarded signals |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check ../../../../bin/mk-spec-memory-launcher.cjs` | Pending |
| `npm run build --workspace=@spec-kit/mcp-server` | Pending |
| Targeted vitest suites | Pending |
| fatalShutdown/vectorIndex source regex | Pending |
| `validate.sh --strict` | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **SIGKILL remains unhandleable.** This packet ensures clean forwarded signals use graceful shutdown before any launcher SIGKILL.
2. **The daemon deadline remains 5000ms.** This is intentional; the launcher grace now exceeds it.
3. **Packet 008 remains the close-time checkpoint source.** This packet protects the ordering and timing around that already-committed checkpoint.
<!-- /ANCHOR:limitations -->
