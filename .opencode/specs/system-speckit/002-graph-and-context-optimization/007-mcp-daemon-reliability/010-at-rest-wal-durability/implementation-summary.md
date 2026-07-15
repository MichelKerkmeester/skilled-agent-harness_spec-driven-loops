---
title: "Implementation Summary: at-rest WAL durability"
description: "The vector index now bounds main and active shard WAL growth with 256-page autocheckpoints, checkpoints both schemas before shard detach and every five minutes, and keeps production synchronous=NORMAL pending a separate FULL/fullfsync decision."
trigger_phrases:
  - "at-rest WAL durability summary"
  - "active_vec wal checkpoint summary"
  - "checkpointAllWal summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/010-at-rest-wal-durability"
    last_updated_at: "2026-05-29T15:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "WAL maintenance shipped (NORMAL + autocheckpoint 256 + periodic/close TRUNCATE); review clean"
    next_safe_action: "Daemon 011: boot integrity-check + retention durability + probe timeout"
    blockers: []
    key_files:
      - "spec.md"
      - "checklist.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should NORMAL flip to FULL now? No. FULL alone was not slower in this copy benchmark, but FULL plus fullfsync increased p99 by 19.576ms, so the production flip remains a follow-up."
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
| **Spec Folder** | `010-at-rest-wal-durability` |
| **Completed** | 2026-05-29 |
| **Level** | 2 |
| **Status** | Implemented (tsc + 385 tests green; benchmark on a DB copy; focused review 0 defects; strict-validate 0/0) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The vector index now bounds WAL exposure for both the main context index and the attached active vector shard while keeping production `synchronous=NORMAL`. Main DB initialization sets `wal_autocheckpoint = 256`, the shard schema sets `active_vec.wal_autocheckpoint = 256`, and both runtime maintenance and graceful close now try to TRUNCATE the shard WAL before the main WAL.

### Dual-Schema WAL Maintenance

`close_db()` now runs `active_vec.wal_checkpoint(TRUNCATE)`, then preserves the existing bare `wal_checkpoint(TRUNCATE)` call, then detaches `active_vec`, closes the DB, and clears the module connection. A new `checkpointAllWal()` helper performs the same shard/main best-effort checkpoints without closing the connection, and `context-server.ts` schedules it every five minutes after `server.connect(transport)` through `registerInterval(..., { unref: true })`. Existing `clearAllTimers()` shutdown cleanup owns interval cancellation.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | Modified | Add main and shard autocheckpoint pragmas, dual-schema close checkpointing, and `checkpointAllWal()` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index.ts` | Modified | Re-export `checkpointAllWal()` beside store helpers |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Register five-minute unref'd WAL checkpoint interval after transport connect |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-index-store.vitest.ts` | Modified | Assert shard checkpoint runs before detach and helper checkpoints both schemas |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/010-at-rest-wal-durability/scratch/wal-durability-benchmark.mjs` | Created | Run copy-only SQLite durability benchmark |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/010-at-rest-wal-durability/*.md` | Created | Level 2 packet documentation |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The code change is deliberately narrow. It does not touch signal handlers, shutdown deadlines, fatal shutdown ordering, probe logic, retention sweeps, `auto_vacuum`, DB recovery, live DB deletion, production `FULL`, or production `fullfsync`. The benchmark script copies `database/context-index.sqlite` and sidecar WAL/SHM files into packet scratch, opens only that copy, writes 200 memory-save-shaped transactions per mode, records timings, and deletes the large scratch copy before exit.

### Benchmark Results

| Measurement | Result |
|-------------|--------|
| Source WAL before copy checkpoint | 9,677,912 bytes, approximately 2349 pages |
| Forced TRUNCATE of copied current WAL | 4.813ms |
| NORMAL, 200 transaction p50/p99 | 0.822ms / 11.140ms |
| FULL, 200 transaction p50/p99 | 0.862ms / 10.246ms |
| FULL + `fullfsync=ON`, 200 transaction p50/p99 | 7.012ms / 30.716ms |
| FULL p99 delta vs NORMAL | -0.894ms |
| FULL + fullfsync p99 delta vs NORMAL | +19.576ms |
| Forced TRUNCATE after NORMAL with autocheckpoint 256 | 0.100ms, WAL file was 2,472,032 bytes before TRUNCATE |
| Forced TRUNCATE after FULL with autocheckpoint 256 | 1.606ms, WAL file was 2,846,952 bytes before TRUNCATE |
| Forced TRUNCATE after FULL + fullfsync with autocheckpoint 256 | 11.035ms, WAL file was 2,723,352 bytes before TRUNCATE |

The benchmark supports keeping this packet at `synchronous=NORMAL`: FULL alone did not hurt p99 in this copy run, but APFS `fullfsync=ON` increased p99 by 19.576ms and raised p50 to 7.012ms. Follow-up: evaluate a production flip to `synchronous=FULL` plus `fullfsync=ON` on main and shard only if a broader daemon benchmark shows the fullfsync tail cost is tolerable under real save volume.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep production `synchronous=NORMAL` | The user explicitly scoped this packet to NORMAL; the copy benchmark also showed fullfsync tail cost that needs separate gating |
| Set `wal_autocheckpoint = 256` on main and `active_vec` | The index is large and not write-hot, so bounding recoverable frames matters more than leaving SQLite's larger default window |
| Checkpoint shard before main and before detach | Once detached, schema-qualified shard checkpointing is no longer available |
| Preserve the bare main checkpoint string | Existing vitest pins `db.pragma('wal_checkpoint(TRUNCATE)')` |
| Use `registerInterval` after transport connect | It reuses the existing timer registry and existing `clearAllTimers()` shutdown cleanup |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build --workspace=@spec-kit/mcp-server` from `.opencode/skills/system-spec-kit` | PASS: `tsc --build && node scripts/finalize-dist.mjs` exited 0 |
| `./node_modules/.bin/vitest run tests/vector-index-store.vitest.ts tests/lifecycle-shutdown.vitest.ts tests/context-server.vitest.ts tests/memory-runtime-retention.vitest.ts` from `mcp_server` | PASS: 4 files, 389 tests |
| `node .../scratch/wal-durability-benchmark.mjs` from repo root | PASS: copy-only benchmark completed and wrote `scratch/wal-durability-benchmark-results.json` |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <010-folder> --strict` | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Production remains `synchronous=NORMAL`.** This is intentional for this packet; FULL plus fullfsync is a benchmark-gated follow-up.
2. **SQLite autocheckpoint does not necessarily shrink WAL file bytes immediately.** It bounds recoverable frames; periodic and close-time TRUNCATE shrink the file.
3. **Shard checkpointing is best-effort.** If `active_vec` is unavailable, the main checkpoint still runs.
<!-- /ANCHOR:limitations -->
