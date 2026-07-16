---
title: "Implementation Summary: spec-memory graceful WAL checkpoint on close"
description: "close_db now checkpoints + truncates the WAL before closing context-index.sqlite, so graceful shutdown leaves the DB consistent at rest and shrinks the window an abrupt kill can corrupt. Verified with a spy test, an at-rest test, the lifecycle suite, and a dist rebuild."
trigger_phrases:
  - "spec-memory checkpoint on close summary"
  - "wal checkpoint shutdown implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/008-spec-memory-graceful-wal-checkpoint-on-close"
    last_updated_at: "2026-05-29T14:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Checkpoint-on-close shipped + verified"
    next_safe_action: "Restart mk-spec-memory to load the rebuilt dist"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 100
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
| **Spec Folder** | `008-spec-memory-graceful-wal-checkpoint-on-close` |
| **Completed** | 2026-05-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`mk-spec-memory` now flushes and truncates its write-ahead log when it closes the database, so a graceful shutdown leaves `context-index.sqlite` consistent at rest with an empty WAL. This is the prevention follow-up to incident `026/004/012` (the FTS5 corruption): a smaller un-checkpointed WAL means a smaller window for an abrupt later kill to leave a half-written page run.

### The change
`close_db()` (the single shared close path, reached by `fatalShutdown` on SIGTERM/SIGINT via `vectorIndex.closeDb()`) now runs `PRAGMA wal_checkpoint(TRUNCATE)` on the main handle immediately before `db.close()`. better-sqlite3's `.close()` only does a *passive* checkpoint and can leave frames behind; the explicit TRUNCATE forces the WAL into the main file and shrinks it to zero. The pragma is wrapped in try/catch so a busy/locked checkpoint can never block or break close — `db.close()` always runs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/search/vector-index-store.ts` | Modified | `wal_checkpoint(TRUNCATE)` before `db.close()` in `close_db()` |
| `mcp_server/tests/vector-index-store.vitest.ts` | Modified | Spy test (checkpoint-before-close) + at-rest WAL/durability test |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built directly off the 026/004/012 root-cause analysis (the corruption was in the FTS5 shadow table; the close path never checkpointed). The fix is one best-effort pragma in the shared close path. Verified with a `vi.spyOn(db,'pragma')` test that the checkpoint is invoked before close, an at-rest test that the WAL is 0 bytes and rows are durable on reopen, and the lifecycle/shutdown/checkpoint/memory-save/corruption-recovery suites (78 passed) to confirm no regression. The gitignored dist was rebuilt via `npm run build` and the compiled `vector-index-store.js` confirmed to contain the checkpoint.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Checkpoint in `close_db`, not a new shutdown hook | It's the single shared close path; the main DB handle is `vectorIndex.getDb()`, so fixing here covers SIGTERM/SIGINT shutdown |
| `wal_checkpoint(TRUNCATE)` (not PASSIVE/FULL) | TRUNCATE flushes frames AND zeroes the WAL file, leaving the smallest possible at-rest footprint |
| Best-effort (try/catch) | A locked/busy checkpoint must never hang or fail shutdown; `.close()`'s passive checkpoint remains the fallback |
| Did not change the launcher or harness kill path | The launcher already does SIGTERM→5s grace→SIGKILL; the harness reconnect-kill is external. This fix is the in-repo lever that helps |
| Scoped out SIGKILL-mid-write prevention | SIGKILL is unhandlable; this shrinks the window rather than eliminating it (documented limit) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | PASS (no type errors) |
| `npm run build` (tsc --build + finalize-dist) | PASS — `wal_checkpoint(TRUNCATE)` present in `dist/lib/search/vector-index-store.js` |
| Spy test (checkpoint invoked before close) | PASS |
| At-rest test (WAL 0 bytes + rows durable) | PASS |
| vector-index-store suite | PASS (3/3) |
| Lifecycle regression set | PASS — 78 passed, 3 skipped (lifecycle-shutdown, checkpoint, memory-save, corruption-recovery, shutdown-hooks, vector-index-store) |
| alignment-drift (lib/search) | PASS (0 violations) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Does not prevent SIGKILL-mid-write corruption.** SIGKILL bypasses `fatalShutdown`, so `close_db` never runs. This fix shrinks the corruption window (smaller WAL at rest); it does not eliminate it.
2. **`dist/` is gitignored.** A running `mk-spec-memory` server must be restarted to pick up the fix.
3. **Real elimination needs graceful-only kills.** The OpenCode/Claude harness's MCP-reconnect kill behavior is external to this repo; ensuring it sends SIGTERM-with-grace (not SIGKILL) would close the remaining gap.
4. **Separate benign build gap remains:** `dist/lib/errors/core.js` lazy-imports a non-existent `dist/lib/utils/retry.js` (degrades gracefully) — tracked separately, not addressed here.
<!-- /ANCHOR:limitations -->
