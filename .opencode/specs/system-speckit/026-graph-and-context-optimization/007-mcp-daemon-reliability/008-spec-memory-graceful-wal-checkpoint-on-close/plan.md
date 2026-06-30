---
title: "Implementation Plan: spec-memory graceful WAL checkpoint on close"
description: "Add wal_checkpoint(TRUNCATE) before close in close_db so graceful shutdown leaves context-index.sqlite consistent at rest, shrinking the corruption window from abrupt kills."
trigger_phrases:
  - "spec-memory checkpoint on close plan"
  - "wal checkpoint shutdown plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/008-spec-memory-graceful-wal-checkpoint-on-close"
    last_updated_at: "2026-05-29T14:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented + verified checkpoint-on-close"
    next_safe_action: "Restart mk-spec-memory to load rebuilt dist"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: spec-memory Graceful WAL Checkpoint on Close

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node), `mk-spec-memory` MCP server |
| **Framework** | better-sqlite3 (WAL mode) + sqlite-vec + FTS5 |
| **Storage** | `context-index.sqlite` (memory_index + memory_fts) |
| **Testing** | vitest |

### Overview
Add a best-effort `PRAGMA wal_checkpoint(TRUNCATE)` immediately before `db.close()` in `close_db()`. This is the single shared close path reached by `fatalShutdown` (SIGTERM/SIGINT) via `vectorIndex.closeDb()`, since the main DB handle is `vectorIndex.getDb()`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause + close-path traced (026/004/012)
- [x] Confirmed no shutdown path checkpoints the main DB
- [x] Confirmed the main handle is `vectorIndex.getDb()`

### Definition of Done
- [x] Checkpoint added (best-effort) before close
- [x] Regression tests (checkpoint-called + WAL-truncated-at-rest)
- [x] typecheck clean; lifecycle suite green; dist rebuilt
- [x] `validate.sh --strict` exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single shared DB close path. `fatalShutdown` → `vectorIndex.closeDb()` → `close_db()`.

### Key Components
- **`close_db()`** (`lib/search/vector-index-store.ts`): closes tracked shard conns + the main `db`; now checkpoints the main `db` first.

### Data Flow
shutdown signal → fatalShutdown cleanup steps → closeDb → `wal_checkpoint(TRUNCATE)` → `db.close()` (WAL emptied; `-wal`/`-shm` removed on last-connection close).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `close_db()` | shared DB close | add `wal_checkpoint(TRUNCATE)` before `db.close()` | spy test asserts pragma called before close |
| `fatalShutdown` (context-server.ts) | calls `vectorIndex.closeDb()` | unchanged (already routes here) | lifecycle-shutdown suite green |
| launcher SIGTERM→grace→SIGKILL | gives 5s grace | unchanged | n/a (already present) |
| shard connections | closed before main DB | unchanged | vector-index-store suite green |

Inventory:
- Close-path callers: `rg -n 'closeDb|close_db' mcp_server/lib mcp_server/context-server.ts`.
- Checkpoint sites: `rg -n 'wal_checkpoint' mcp_server --glob '!dist/**'`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm close path + main-DB handle identity
- [x] Confirm no existing checkpoint-on-shutdown

### Phase 2: Core Implementation
- [x] Add best-effort `wal_checkpoint(TRUNCATE)` before `db.close()`

### Phase 3: Verification
- [x] Regression tests; npm typecheck; lifecycle suite; dist rebuild
- [x] `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `vi.spyOn(db,'pragma')` asserts `wal_checkpoint(TRUNCATE)` before close | vitest |
| Integration | write → close_db → WAL is 0 bytes + rows durable on reopen | vitest |
| Regression | lifecycle/shutdown/checkpoint/memory-save/corruption-recovery suites | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `vectorIndex.getDb()` is the main handle | Internal | Green | Confirms closeDb closes context-index.sqlite |
| WAL mode on context-index.sqlite | Internal | Green | TRUNCATE only meaningful in WAL mode (it is) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: checkpoint-on-close causes shutdown latency/hangs.
- **Procedure**: revert the one-line change in `close_db`; it is best-effort and isolated. No data migration.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (confirm) ──► Phase 2 (implement) ──► Phase 3 (verify)
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
| Setup | Low | 0.5 hour (done in 026/004/012 diagnosis) |
| Core Implementation | Low | 0.25 hour |
| Verification | Low | 0.75 hour |
| **Total** | | **~1.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Lifecycle suite green before merge
- [x] Checkpoint + at-rest tests added
- [x] Change isolated to one function

### Rollback Procedure
1. `git revert` the close_db commit.
2. Rebuild dist (`npm run build`).
3. Re-run the lifecycle suite.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
