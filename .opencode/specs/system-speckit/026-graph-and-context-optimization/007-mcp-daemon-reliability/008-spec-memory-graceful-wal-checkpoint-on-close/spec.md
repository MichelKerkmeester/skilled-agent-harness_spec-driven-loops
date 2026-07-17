---
title: "Feature Specification: spec-memory graceful WAL checkpoint on close (FTS-corruption prevention)"
description: "Make mk-spec-memory's DB close path checkpoint the WAL before closing, so graceful shutdown leaves context-index.sqlite consistent at rest with an empty WAL. Shrinks the un-checkpointed window that an abrupt later kill can corrupt (the root cause of incident 026/004/012)."
trigger_phrases:
  - "spec-memory graceful shutdown checkpoint"
  - "wal_checkpoint on close"
  - "context-index.sqlite corruption prevention"
  - "026 007 008 wal checkpoint"
  - "close_db checkpoint truncate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/008-spec-memory-graceful-wal-checkpoint-on-close"
    last_updated_at: "2026-05-29T14:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented + verified checkpoint-on-close"
    next_safe_action: "Optional: lengthen launcher grace or add idle checkpoint"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does close already checkpoint? No — better-sqlite3 .close() only does a passive checkpoint; no shutdown path ran wal_checkpoint."
---
# Feature Specification: spec-memory Graceful WAL Checkpoint on Close

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (prevents recurrence of a data-integrity incident) |
| **Status** | Complete |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent** | `system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `mk-spec-memory` close path (`close_db` in `vector-index-store.ts`) closes `context-index.sqlite` without first checkpointing its WAL. better-sqlite3's `.close()` only performs a passive checkpoint, so un-checkpointed WAL frames can remain. If the process is then killed abruptly (e.g. SIGKILL on an MCP reconnect) mid-write — notably an FTS5 segment write — a contiguous run of pages can be left malformed. This is the documented root cause of incident `026/004/012` (the `context-index.sqlite` FTS5 corruption).

### Purpose
Make every graceful shutdown leave the DB consistent at rest with an empty WAL, shrinking the window an abrupt later kill can corrupt.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `close_db()` runs `PRAGMA wal_checkpoint(TRUNCATE)` (best-effort) before closing the main DB.
- A regression test asserting the checkpoint runs before close, plus an at-rest WAL/durability check.

### Out of Scope
- Preventing SIGKILL-mid-write corruption (SIGKILL is unhandlable; this only shrinks the window).
- Changing the launcher's existing SIGTERM→5s-grace→SIGKILL discipline (already present).
- The OpenCode/Claude harness's MCP-reconnect kill behavior (external to this repo).
- The separate benign `dist/lib/utils/retry.js` dangling lazy-import (tracked elsewhere).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/vector-index-store.ts` | Modify | `wal_checkpoint(TRUNCATE)` before close in `close_db()` |
| `mcp_server/tests/vector-index-store.vitest.ts` | Modify | Two regression tests (checkpoint-called + WAL-truncated-at-rest) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The checkpoint must never block or break close | Wrapped in try/catch (best-effort); `db.close()` always runs; lifecycle tests stay green |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Graceful close checkpoints + truncates the WAL | Test asserts `wal_checkpoint(TRUNCATE)` is invoked before close; at-rest WAL is 0 bytes and data is durable |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After a graceful `close_db()`, `context-index.sqlite` has an empty/absent WAL and all rows are durable.
- **SC-002**: No regression across the lifecycle/shutdown/checkpoint/memory-save suites.
- **SC-003**: typecheck clean; packet `validate.sh --strict` exit 0; dist rebuilt with the fix.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A checkpoint at close adds latency to shutdown | Low | TRUNCATE on a normally-small WAL is fast; best-effort + the launcher allows 5s grace |
| Risk | Does not stop SIGKILL-mid-write corruption | Med | Out of scope; this shrinks the window. Real elimination needs graceful-only kills (harness-side) |
| Dependency | `close_db` is the single shared close path (SIGTERM/SIGINT → fatalShutdown → vectorIndex.closeDb) | Low | Verified: the main DB handle is `vectorIndex.getDb()` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Checkpoint-on-close adds one `wal_checkpoint(TRUNCATE)`; negligible for a regularly-checkpointed WAL.

### Security
- **NFR-S01**: No new surface; a read/maintenance pragma on an already-open handle.

### Reliability
- **NFR-R01**: Best-effort — a checkpoint failure is swallowed so `db.close()` always runs (no shutdown hang).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Non-WAL DB: pragma is a no-op-ish; close proceeds.
- Empty WAL: TRUNCATE is cheap; no-op.

### Error Scenarios
- Checkpoint throws (locked/busy): caught; `db.close()` still runs (close()'s own passive checkpoint remains the fallback).
- Tracked shard connections: closed first (existing behavior), then the main DB is checkpointed + closed.

### State Transitions
- SIGTERM/SIGINT → `fatalShutdown` → `vectorIndex.closeDb()` → `close_db()` → checkpoint + close.
- SIGKILL: handler never runs; this fix cannot help (documented limit).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | 1 source function (~1 line) + 2 tests |
| Risk | 12/25 | Touches the shared close path of the just-corrupted DB; best-effort + tested |
| Research | 8/20 | Root-cause + close-path tracing already done in 026/004/012 |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Optional follow-ups (not in scope): lengthen the launcher's 5s grace for very large DBs; add a periodic/idle WAL checkpoint so the WAL stays small even between shutdowns.
<!-- /ANCHOR:questions -->
