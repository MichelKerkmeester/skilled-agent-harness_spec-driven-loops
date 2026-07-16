---
title: "spec-memory Graceful WAL Checkpoint on Close"
description: "close_db now checkpoints and truncates the WAL before closing context-index.sqlite, so a graceful shutdown leaves the database consistent at rest with an empty WAL and shrinks the corruption window an abrupt kill can exploit."
trigger_phrases:
  - "wal checkpoint on close"
  - "spec-memory graceful shutdown checkpoint"
  - "close_db truncate wal"
  - "context-index.sqlite corruption prevention"
  - "fts5 corruption prevention follow-up"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/008-spec-memory-graceful-wal-checkpoint-on-close` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

The `mk-spec-memory` close path (`close_db` in `vector-index-store.ts`) was closing `context-index.sqlite` without first checkpointing its write-ahead log (WAL). The `better-sqlite3` `.close()` call performs only a passive checkpoint, which can leave un-checkpointed frames behind. If the process was then killed abruptly mid-write, a run of pages could be left malformed. This was the root cause of the FTS5 corruption in incident `026/004/012`.

`close_db()` now runs `PRAGMA wal_checkpoint(TRUNCATE)` on the main database handle immediately before `.close()`. The TRUNCATE mode flushes all WAL frames back into the main file and shrinks the WAL to zero bytes, so a graceful shutdown leaves `context-index.sqlite` consistent at rest. The pragma is wrapped in a try/catch so a busy or locked checkpoint can never block or break the close sequence. Two regression tests were added: a spy test that asserts the checkpoint runs before close plus an at-rest test that the WAL is empty and rows survive a reopen.

### Added

- `PRAGMA wal_checkpoint(TRUNCATE)` call in `close_db()` before `db.close()` in `mcp_server/lib/search/vector-index-store.ts`
- Spy test asserting `wal_checkpoint(TRUNCATE)` is invoked before `db.close()` in the vector-index-store test suite
- At-rest test asserting the WAL is 0 bytes and all rows are durable after `close_db()` in the vector-index-store test suite

### Changed

- `close_db()` shutdown sequence now runs a best-effort TRUNCATE checkpoint before the final close call
- `mcp_server/tests/vector-index-store.vitest.ts` extended with two new checkpoint regression cases

### Fixed

- Graceful shutdown left WAL frames un-checkpointed, widening the window for an abrupt later kill to corrupt FTS5 shadow-table pages. The TRUNCATE checkpoint on close shrinks that window to zero for graceful exits.

### Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | PASS (no type errors) |
| `npm run build` (tsc --build + finalize-dist) | PASS: `wal_checkpoint(TRUNCATE)` confirmed present in `dist/lib/search/vector-index-store.js` |
| Spy test (checkpoint invoked before close) | PASS |
| At-rest test (WAL 0 bytes + rows durable) | PASS |
| vector-index-store suite | PASS (3/3) |
| Lifecycle regression set | PASS: 78 passed, 3 skipped (lifecycle-shutdown, checkpoint, memory-save, corruption-recovery, shutdown-hooks, vector-index-store) |
| alignment-drift (lib/search) | PASS (0 violations) |
| `validate.sh --strict` on packet | PASS (exit 0) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/lib/search/vector-index-store.ts` | Modified | `wal_checkpoint(TRUNCATE)` added before `db.close()` in `close_db()` |
| `mcp_server/tests/vector-index-store.vitest.ts` | Modified | Spy test (checkpoint-before-close) plus at-rest WAL/durability test added |

### Follow-Ups

- This fix does not prevent SIGKILL-mid-write corruption. SIGKILL bypasses `fatalShutdown` so `close_db` never runs. The change shrinks the corruption window but does not eliminate it.
- A running `mk-spec-memory` server must be restarted to pick up the fix because `dist/` is gitignored.
- Real elimination of the corruption window requires graceful-only kills at the harness level. The OpenCode/Claude harness MCP-reconnect kill behavior is external to this repo. Ensuring it sends SIGTERM with grace rather than SIGKILL would close the remaining gap.
- A separate benign build gap remains: `dist/lib/errors/core.js` lazy-imports a non-existent `dist/lib/utils/retry.js` and degrades gracefully. This is tracked separately and was not addressed here.
