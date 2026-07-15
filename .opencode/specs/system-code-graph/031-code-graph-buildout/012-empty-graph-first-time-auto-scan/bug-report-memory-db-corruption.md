---
title: "Bug Report: spec-memory index DB corruption (context-index.sqlite FTS5 shadow table)"
description: "memory_save failed with SQLITE_CORRUPT during the 012 save. Root cause: a contiguous run of FTS5 shadow-table pages in context-index.sqlite was corrupted by an interrupted FTS5 segment write under an abrupt mk-spec-memory kill, with WAL recovery defeated by a desynced -shm. Source rows intact; recovered via .recover + FTS rebuild + swap."
trigger_phrases:
  - "context-index.sqlite corruption"
  - "memory save SQLITE_CORRUPT"
  - "fts5 shadow table malformed"
  - "spec-memory db recovery"
  - "database disk image is malformed"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/012-empty-graph-first-time-auto-scan"
    last_updated_at: "2026-05-29T11:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Filed memory-DB corruption bug report"
    next_safe_action: "Decide on graceful-shutdown prevention for mk-spec-memory"
    blockers: []
    key_files:
      - "bug-report-memory-db-corruption.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Bug Report: spec-memory Index DB Corruption (`context-index.sqlite` FTS5)

> Filed in this packet because the corruption surfaced during the 012 memory save.
> The **affected component is system-spec-kit / `mk-spec-memory`**, not code-graph.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Severity** | P1 (memory_save blocked; no source-data loss) |
| **Status** | RESOLVED (recovered + verified) |
| **Discovered** | 2026-05-29, during `/memory:save` for the 012 packet |
| **Affected component** | `system-spec-kit` / `mk-spec-memory` MCP server |
| **Affected file** | `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` (1.0 GB, WAL mode) |
| **Damaged structure** | FTS5 full-text shadow table `memory_fts_data` (search index) |

---

## 2. SYMPTOM

`generate-context.js` (memory save) aborted indexing with:

```
SqliteError: database disk image is malformed  (code: SQLITE_CORRUPT)
  at applyPostInsertMetadata (post-insert-metadata.js:85)
  at createMemoryRecord (create-record.js:286)
[vector-index] interference score refresh failed ... database disk image is malformed
Step 11.5: 0 indexed/updated, 0 unchanged, 7 failed (7 files scanned)
```

`PRAGMA integrity_check` on the DB returned `database disk image is malformed`.

---

## 3. ROOT CAUSE

A **contiguous run of FTS5 shadow-table b-tree pages was left half-written by an interrupted FTS5 segment write**, in a WAL-mode DB, and WAL auto-recovery did not repair it because the `-wal`/`-shm` coordination state was desynced across an abrupt process kill.

### Evidence

1. **Damage is confined to the FTS5 search index, not source data.** `integrity_check` reports:
   ```
   Tree 25 page 262777: btreeInitPage() returns error code 11
   Tree 25 page 262776: btreeInitPage() returns error code 11
   Tree 25 page 262775: btreeInitPage() returns error code 11
   ```
   `Tree 25` (rootpage 25) = `memory_fts_data` — the FTS5 shadow/segment table. The main `memory_index` table read fine (30,670 rows).
2. **Contiguous run of pages** (262775–262777), not a single torn page → an interrupted *batch* write (FTS5 segment merge writes contiguous batches). Random disk failure is unlikely: every other large DB (1 GB+ vector stores, embedder index, graph-metadata) passed `integrity_check`.
3. **Damage is in freshly-written tail pages.** The clean May-28 backup was 261,147 pages; the corrupt DB is 263,560 pages (`schema_version` unchanged at 187). The bad pages (262,775+) sit in the **+2,413 pages written after the clean backup** — i.e. in this session's writes, with no schema migration involved.
4. **WAL mode + desynced `-shm`.** All three DB copies are WAL. A stale/out-of-sync `-shm` was present at recovery time and had to be removed — indicating the WAL/SHM state was lost across a kill+reopen, which is why a normally-recoverable crash-mid-checkpoint became permanent.

### Trigger

Abrupt termination of the `mk-spec-memory` process during an FTS5 write. This session had many such events:
- Repeated `/mcp` **disconnect → reconnect** cycles (each kills/respawns the server).
- The repo's pattern of **SIGKILL'ing orphan MCP/daemon processes** (see memory `daemon-index-staging-hazard` + the cli-opencode single-dispatch kill discipline).

**Aggravating factor:** the DB is 1 GB, so FTS5 segment merges write large contiguous batches → a wider window for a kill to land mid-merge.

---

## 4. BLAST RADIUS

- **Search index only.** The corruption was in the FTS5 shadow table (a *derived* index), so no source memory rows were lost — all 30,670 `memory_index` rows were intact and recovered.
- **Impact while broken:** every `memory_save` failed at the post-insert/vector-interference step; semantic + FTS retrieval over the index was unreliable.

---

## 5. RESOLUTION (applied 2026-05-29)

1. `sqlite3 context-index.sqlite ".recover"` into a fresh file → salvaged all **30,670 rows** (more than the May-28 backup's 28,562, so the newest saves were preserved).
2. Rebuilt the FTS5 index from the intact content: `INSERT INTO memory_fts(memory_fts) VALUES('rebuild')` → `integrity_check: ok`.
3. Swapped the recovered DB in as live; archived the corrupt DB as `context-index.sqlite.corrupt-20260529-pre-recover.bak` and kept the `…premove-20260528…bak` (both retained).
4. Removed the stale `-wal`/`-shm` so SQLite recreates them cleanly.

### Verification

- Live `context-index.sqlite`: `integrity_check: ok`, 30,670 rows.
- Re-ran the failing memory save → **`Step 11.5: 7 indexed/updated, 0 failed`** (no `SQLITE_CORRUPT`); DB grew 30,670 → 30,677 (the 012 docs indexed).

---

## 6. PREVENTION / RECOMMENDATIONS

1. **Graceful shutdown for `mk-spec-memory`.** Before any SIGKILL on reconnect/orphan-sweep, give the server a chance to `PRAGMA wal_checkpoint(TRUNCATE)` + close connections. Hard-killing mid-FTS-write is the trigger.
2. **Checkpoint-on-exit.** Run `wal_checkpoint(TRUNCATE)` on clean shutdown so the WAL is empty and the main DB is consistent at rest.
3. **Single-writer discipline.** Ensure only one `mk-spec-memory` process writes `context-index.sqlite` at a time (a desynced `-shm` from concurrent open under churn is a plausible aggravator).
4. **DB size / retention.** 1 GB is large for a memory index; a periodic `/memory:manage retention-sweep` would shrink FTS segment-merge batches and the corruption window.
5. **Recovery runbook.** Adopt the `.recover` + FTS-`rebuild` + swap procedure above as the canonical recovery for this DB; it preserves source rows.

---

## 7. RELATED / HONEST LIMITS

- The exact kill that landed mid-merge cannot be named (no process/I/O history retained); the page-level evidence identifies the *mechanism*, and the session's kill pattern is the *trigger*.
- Separate benign build gap noticed during diagnosis: compiled `system-spec-kit/mcp_server/dist/lib/errors/core.js` lazy-imports `dist/lib/utils/retry.js`, which does not exist (no source either). It degrades gracefully ("using legacy transient patterns") and is unrelated to the corruption — worth a separate cleanup.
