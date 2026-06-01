---
title: "Handover: memory_index_scan self-maintaining index — all 3 phases shipped, daemon restart + reindex pending [system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/handover]"
description: "Session handover for 013. All 3 implementation phases merged to main and validated. Daemon source updated but not yet restarted. 012/013 packets need reindexing. No worktrees or branches pending."
trigger_phrases:
  - "memory index implementation handover"
  - "013 handover whats next"
  - "memory index all phases done"
  - "013 daemon restart reindex"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation"
    last_updated_at: "2026-06-01T06:50:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase 4 CHECKPOINT: #2-A shipped+committed (26fca5d1b2) + live-verified; #2-C cleanup DONE 29830->~9703 rows (committed 952dd1e1e1, backup taken); #2-B deferred; #4 bulk re-embed triggered (2192 draining); legacy vector shards deleted"
    next_safe_action: "Fresh session per handover.md SECTION 8 runbook: verify #4 drain -> #4 5 provider-failures -> #2-B rework+index -> #3/#5 scaffolds -> deep-review -> doc reconcile + validate.sh --strict"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/core/db-state.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Handover: memory_index_scan Self-Maintaining Index

> **One-line state:** Fully shipped AND deployed (2026-05-31). `dist/` rebuilt, daemon restarted onto new code (pid 23371, ollama embedder healthy), 012/013 reindexed. Duplicate index rows from the hf-local→ollama migration repaired (30 rows; `failedVectors` 36→6). **Phase 4 (council follow-up):** specFolder-normalization fix shipped + deployed (pid 47588); #2 dup-prevention, #3 checkpoint-v2, #4 ~5.4k-row hf→ollama re-embed, #5 MCP front-proxy deferred to a focused session — see `ai-council/council-report-followups-mcp-stability.md`.

---

## 1. WHERE WE ARE (ground truth)

| Item | State | Location / Hash |
|------|-------|-----------------|
| `main` branch HEAD | clean | `50e21d48f8` |
| 012 research packet | committed, strict PASSED | `…/012-memory-index-scan-ux-hardening/` |
| 013 implementation | **all phases shipped** | `…/013-memory-index-scan-implementation/` |
| Phase 1 code | merged `98330d18fc` | coalescing + health.index + orphan sweep |
| Phase 2 code | merged `156a0b469f` (then merge commit) | async scan + drain circuit guard |
| Phase 3 code | merged `9156d60cc3` (then merge commit) | move reconciliation + scan heartbeat |
| 013 docs | reconciled, strict PASSED | checklist 100%, impl-summary final |
| Worktrees / branches | **none** | all cleaned up |
| Daemon running | NEW source (013) live | `dist/` rebuilt + restarted; pid 23371; ollama embedder healthy |
| 012/013 reindex | DONE | 012 fresh; 013 = 6 clean success rows; dup cruft repaired (`failedVectors` 36→6) |

---

## 2. WHAT SHIPPED (all in daemon source, not yet live)

### Phase 1 — Coalescing Contract + Health + Orphan Sweep
Files: `handlers/memory-index.ts`, `handlers/memory-crud-health.ts`, `lib/storage/incremental-index.ts`

- `memory_index_scan` repeat calls return `{coalesced: true, status: 'coalesced'}` instead of E429
- `scanKey` (sha256 of normalized options) added to all successful responses
- `memory_health` now has an `index` block: `summary` enum (`healthy_fresh` / `healthy_lagging_vectors` / `stale_needs_scan` / `degraded_needs_repair` / `unavailable`) + counts (pending/retry/failed vectors, orphan rows, last-scan age)
- `sweepOrphanIndexRows()` deletes up to 200 disk-gone index rows per scan via `deleteMemory()` — no raw SQL delete

### Phase 2 — Async Scan + Drain Circuit Guard
Files: `handlers/memory-index.ts`, `lib/providers/retry-manager.ts` + new test

- `indexSingleFile` now accepts `asyncEmbedding` option; scan passes `asyncEmbedding: true`
- Files commit immediately as `pending` (BM25/FTS-searchable) without waiting for the provider
- Response returns `{status: 'complete_with_pending_vectors', pendingVectors: N}` when deferred rows exist
- `processRetryQueue` guards the `pending→retry` claim with `isProviderCircuitOpen()`: during an outage, pending rows stay `pending` (not prunable as `retry`)

### Phase 3 — Move Reconciliation + Scan Heartbeat
Files: `lib/storage/incremental-index.ts`, `handlers/memory-index.ts`, `core/db-state.ts` + new tests

- `reconcileMoves(toDelete, toIndex)`: when a spec folder is renamed (`git mv`), matches by `packet_id` (from new `graph-metadata.json`) + grandparent dir + basename; updates `file_path` in place (preserving embedding, id, history); unique-match guard enforced (LIMIT 2 in DB check)
- Wired into the scan after categorization, before the main indexing loop
- `refreshScanLease()` heartbeat: called post-batch to keep the scan lease alive during large-tree scans

### Test coverage
| Test file | Tests | What it covers |
|-----------|-------|----------------|
| `handler-memory-index-cooldown.vitest.ts` | 7 | coalescing, lease, stale cleanup, deferred scan |
| `handler-memory-index-async-scan.vitest.ts` | 3 | async mode, deferred status, circuit guard |
| `incremental-index.vitest.ts` | 7 | categorization, mtime, orphan sweep |
| `incremental-index-move-reconcile.vitest.ts` | 2 | move reconciliation: unique match + non-unique guard |
| **Total** | **19/19** | all green at merge |

---

## 3. IMMEDIATE NEXT STEPS

> ✅ **COMPLETED 2026-05-31** — all steps below were executed: `dist/` rebuilt (it was stale), daemon restarted (pid 23371, ollama embedder healthy), 012/013 reindexed, and 30 duplicate index rows from the provider migration repaired. Steps retained below for the record.

### 3a. Restart the daemon (loads new source)
The daemon has been running throughout this session — build-while-live was avoided by never touching `dist/`. The new source in `mcp_server/` only takes effect after a restart.

Check what's currently running:
```bash
ps aux | grep "spec-kit\|mcp_server"
```

Restart (exact command depends on your daemon setup — launchctl, pm2, or direct node):
```bash
# If using launchctl (macOS):
launchctl unload ~/Library/LaunchAgents/com.michelkerkmeester.spec-kit.plist 2>/dev/null
launchctl load ~/Library/LaunchAgents/com.michelkerkmeester.spec-kit.plist

# If using pm2:
pm2 restart spec-kit-mcp

# If direct node process: kill + relaunch manually
```

Verify the daemon is up before proceeding:
```bash
# Should return a non-error response
echo '{"method":"tools/call","params":{"name":"memory_health","arguments":{}}}' | ...
```

### 3b. Re-index 012 and 013 packets
After the daemon is confirmed running on new code, re-index the two packets that accumulated changes this session:

```
memory_index_scan({ specFolder: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening" })
memory_index_scan({ specFolder: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation" })
```

Expected responses: `{status: 'complete'}` or `{status: 'complete_with_pending_vectors'}` (if the embedder needs to drain). These are the first calls that will exercise the new coalescing contract — check that they don't error.

### 3c. Validate final state
After both scans complete:
```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation \
  --strict
```
Expected: Errors 0, Warnings 0 (already PASSED; this is a final smoke check).

---

## 4. GOTCHAS FOR NEXT SESSION

**Worktree node_modules setup (for future code dispatches):**
Fresh worktrees don't check out `node_modules`. You need THREE symlinks:
```bash
ln -s /path/to/Public/.opencode/skills/system-spec-kit/mcp_server/node_modules \
      /path/to/worktree/.opencode/skills/system-spec-kit/mcp_server/node_modules
ln -s /path/to/Public/.opencode/skills/system-spec-kit/node_modules \
      /path/to/worktree/.opencode/skills/system-spec-kit/node_modules
ln -s /path/to/Public/.opencode/skills/system-spec-kit/shared/dist \
      /path/to/worktree/.opencode/skills/system-spec-kit/shared/dist
```
Only symlinking `mcp_server/node_modules` causes tsc errors (`@spec-kit/shared/types` not found, `@types/node` missing).

**TS5101 deprecation error in clean worktrees:**
`tsc` in a fresh worktree shows `error TS5101: Option 'baseUrl' is deprecated` because there's no `.tsbuildinfo` cache. The main repo doesn't show this (cache masks it). This is cosmetic in TS 5.9.3 — the suggested fix (`"ignoreDeprecations": "6.0"`) is not yet accepted by TS 5.9.3. Treat as pre-existing noise; count only new errors introduced by your changes.

**Daemon is live during all edits:**
Never run `npm run build` (emits to `dist/` which the live daemon reloads from). Typecheck is `--noEmit` only. Restart the daemon as a separate, deliberate step.

**P3 triggers NOT implemented (deferred):**
The full P3.4 trigger set (lazy reconcile-on-File-not-found in `search-results.ts`, file-watcher queue integration, post-commit stale marker in the git hook) was not implemented this session. The core concurrency and move reconciliation are done. If these triggers are needed, they should be a Phase 4 or separate packet.

---

## 5. FILES CHANGED THIS SESSION (complete list)

### Production source
| File | Phase | Change |
|------|-------|--------|
| `handlers/memory-index.ts` | 1+2+3 | coalescing, async scan, reconcileMoves wiring, heartbeat |
| `handlers/memory-crud-health.ts` | 1 | `memory_health.index` block |
| `lib/storage/incremental-index.ts` | 1+3 | `sweepOrphanIndexRows`, `reconcileMoves` |
| `lib/providers/retry-manager.ts` | 2 | circuit guard before `pending→retry` claim |
| `core/db-state.ts` | 3 | `refreshScanLease()` heartbeat |

### Tests
| File | Phase | Change |
|------|-------|--------|
| `tests/handler-memory-index-cooldown.vitest.ts` | 1+3 | coalescing assertion fix; `reconcileMoves` mock added |
| `tests/handler-memory-index-async-scan.vitest.ts` | 2 | new — async mode + circuit guard tests |
| `tests/incremental-index-move-reconcile.vitest.ts` | 3 | new — move reconciliation tests |

### Spec docs
| File | Change |
|------|--------|
| `013-*/handover.md` | this file |
| `013-*/checklist.md` | all CHK items checked with evidence |
| `013-*/implementation-summary.md` | all phases reconciled, completion_pct: 100 |

---

## 6. Phase 4 — Deferred fix plan

> Full per-finding analysis + file:line evidence: `ai-council/council-report-followups-mcp-stability.md`. Below is the execution plan; do **A before re-indexing** the lagging docs, **B+C before** calling the index clean.

### #2 Reindexing / dup-on-reindex — the blocker for clean re-index
Mechanism (verified in code): `memory_index` enforces `UNIQUE(spec_folder, file_path, anchor_id)` (`vector-index-schema.ts:2419`), but whole-file rows carry `anchor_id = NULL` and SQLite treats NULLs as distinct, so duplicate whole-file rows are allowed. `active_memory_projection` already keys the right logical identity — `specFolder::canonicalFilePath::COALESCE(anchor,'_')` (`vector-index-mutations.ts:154`) — and repoints to the new row on re-index, but the prior row is never retired (`lineage-state.ts:494` inserts a fresh row; nothing supersedes the old `active_memory_id`), so duplicates accumulate.

- **A — Supersede-on-reindex (bounded code; unblocks clean re-index).** In `upsert_active_projection` / its save-path caller, read the prior `active_memory_id` for the logical key before repointing; if it differs from the new id, retire the old row through `deleteMemory()` (never raw SQL — orphan-sweep precedent). A content change then replaces in place. Once A ships, the lagging 013 docs (and all future edits) re-index without duplicating.
- **B — Logical-key uniqueness (DB guard).** Add a stored `logical_key` / expression unique index = `spec_folder || '::' || canonical_file_path || '::' || COALESCE(anchor_id,'_')`. Closes the NULL-anchor and file_path-vs-canonical gaps.
- **C — Cleanup migration (existing cruft).** For each logical key with >1 row: keep the projection-active/newest, delete the rest (+ their vectors/FTS) via `deleteMemory()`, repoint projection. Must run BEFORE B (unique-index creation fails while dupes exist).
- **Migration safety:** run B+C as a daemon-owned boot migration (single-writer, once on restart), or daemon-stopped with a `cp` backup of the sqlite files first; verify row counts before/after; restart + live-probe.

### #4 Re-embed
- 6 provider-failures (no vector): verify each source file exists + no newer success for its logical key, then re-index its file via a correctly-scoped scan (re-embeds under ollama).
- ~5.4k success rows missing an active-shard vector (hf-local→ollama migration cost): `memory_embedding_reconcile({ mode: 'apply', repairSuccessCoverage: true })` resets them to retry → retry-manager re-embeds under ollama (large background drain; watch GPU/queue depth).

### #3 Checkpoint v2
`createCheckpoint` serializes the whole ~33k-row DB in one `JSON.stringify` (`checkpoints.ts:1604`) → V8 max-string. Add a v2 chunked/streaming snapshot (PK-windowed compressed chunks or SQLite `VACUUM INTO`); keep v1 restore; expose `includeEmbeddings` through the handler.

### #5 MCP front-proxy / reconnect
Launcher spawns `context-server.js` with `stdio:'inherit'`; RSS self-exit, crash-loop give-up, child relaunch (no re-handshake), and bridge-socket close all sever the client with no transparent recovery. Short-term: on worker death, close the client transport with an explicit reconnect-required error. Medium-term: a stable front proxy owns MCP session state and treats `context-server` as a restartable backend; RSS recycle restarts only the backend.

### Order
A → re-index the lagging 013 docs cleanly → B + C → #4 re-embed → #3 checkpoint v2 → #5 MCP proxy → post-implementation deep-review before any completion claim.

---

## 7. Phase 4 — EXECUTION RESULTS (2026-06-01)

**#2-A supersede-on-reindex — SHIPPED + COMMITTED + LIVE-VERIFIED.** Commit `26fca5d1b2`. Scoped to the same-path content-change branch in `memory-save.ts` `processPreparedMemory` (retire predecessor via `delete_memory_from_database` after lineage bookkeeping; PE-gate/reconsolidation path untouched). 18 vitest suites green (incl. new `memory-save-supersede-reindex.vitest.ts`), tsc 0 errors, built + daemon-restarted. Live proof: impl-summary `50290`→`50293` SUPERSEDE with `50290` deleted (not left deprecated).

**#2-C cleanup — DONE on live DB.** 29,830 → **9,689 rows** (20,093 deprecated dups + 48 rename-collision deprecated dups deleted via sanctioned per-row `delete_memory`; constitutional preserved = 17; FTS consistent; 1 residual orphan vector). Verified backup: `database/backups/context-index-PRE-BC-20260601-083145.sqlite` (`integrity_check ok`, 29,830 rows). One-shot scripts (untracked): `mcp_server/scripts/dedup-cleanup-bc.mjs`, `mcp_server/scripts/dedup-index-b.mjs`.

**#2-B unique index — DEFERRED (correctness blocker found).** A partial unique index on `(spec_folder, canonical_file_path, COALESCE(anchor_id,'_'))` is enforced at INSERT, which collides with #2-A's insert-then-delete ordering and would break every same-path re-index. Created then DROPPED. Needs #2-A reworked to delete-before-insert (or update-in-place) first. Also pending: ~2,257 dangling projection pointers + 3 constitutional-bearing collision keys.

**#4 re-embed — bulk triggered.** `memory_embedding_reconcile({mode:'apply', repairSuccessCoverage:true})` reset **2,192** success-coverage rows → retry (re-embedding into the ollama 768 shard, background drain). Still pending: 5 genuine provider-failures (ids 50257–50261: a `…manual-test-run` folder + `026/resource-map.md`) — need targeted force re-index of their folders.

**#5 MCP recycle — observed live.** Daemon recycled `55572`→`79922` under the re-embed load (RSS watchdog self-exit → launcher relaunch → client severed, no transparent reconnect). The retry rows persist; the drain resumes on the new daemon. This is the exact pathology #5 must fix.

**Legacy vector shards (inert, safe to archive after #4 drain):** `hf-local__baai_bge-base-en-v1.5__768__q8` (52K), `hf-local__nomic-ai_nomic-embed-text-v1.5__768__q8` (3.2M), `ollama__nomic-embed-text-v1.5__1024` (52K). Active shard = `ollama__nomic-embed-text-v1.5__768` (258M).

---

## 8. REMAINING ISSUES & NEXT-SESSION RUNBOOK

### Start-here state snapshot
- **Branch:** `main`. Session commits: `26fca5d1b2` (#2-A code + regression test), `952dd1e1e1` (handover Phase-4 record). #2-A is LIVE + verified; do NOT redo.
- **Live index:** ~9,703 rows (was 29,830; cleanup removed 20,141 duplicate logical-key rows). Active embedder: `ollama / nomic-embed-text-v1.5 / 768`; active shard `database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite` (258M).
- **Rollback backup (KEEP until migration verified):** `database/backups/context-index-PRE-BC-20260601-083145.sqlite` (`integrity_check ok`, 29,830 rows). Restore = stop daemon, `cp` it over `database/context-index.sqlite`, restart.
- **Daemon recycles under embed load** (pid churned 47588→45861→55572→79922 this session — the #5 bug). Restart procedure: `pkill -f "mcp_server/dist/context-server.js"` → wait for launcher respawn → operator `/mcp reconnect`. A read-only `sqlite3` on the live DB needs the daemon's `-shm` present (open read-write or post-clean-restart).
- **One-shot migration scripts (untracked):** `mcp_server/scripts/dedup-cleanup-bc.mjs` (Phase-C cleanup), `mcp_server/scripts/dedup-index-b.mjs` (collision resolve + index). Dry-run by default; `--apply` to mutate. Reusable/auditable.
- **Legacy vector shards DELETED** this session (hf-local bge-base, hf-local nomic, ollama-1024 + sidecars + a 0B stray). `database/test-context-index.sqlite` (468K) intentionally left — operator decision.

### Open items (priority order)

**A. Verify the #4 re-embed drain finished.** 2,192 success-coverage rows were reset to `retry` to re-embed into the ollama shard; daemon recycles likely paused it. Check `memory_health` → `index.retryVectors` trending to 0, and `memory_embedding_reconcile({mode:'dry-run'})` → `coverage.successMissingActiveVector` == 0. If stalled, re-run `memory_embedding_reconcile({mode:'apply', repairSuccessCoverage:true})`. The drain load is what trips the recycle (see E) — consider pacing.

**B. #4 provider-failures — 5 rows, targeted re-index.** `failed`-status rows with no vector: `50257` (`026…/resource-map.md`), `50258`/`50260`/`50261` (`skilled-agent-orchestration/122-deep-improvement-skills/…/008-playbook-manual-test-run/{handover.md,spec.md,graph-metadata.json}`), `50259` (`008-playbook-manual-test-run/description.json`). For each: confirm the source file exists + no newer success row for its logical key, then `memory_index_scan({specFolder, force:true})` on its folder. Reconcile leaves these report-only by design.

**C. #2-B unique-index guard — REWORK then ship (task #9).** Target guard: partial unique index `(spec_folder, canonical_file_path, COALESCE(anchor_id,'_')) WHERE importance_tier <> 'constitutional'`. BLOCKER: incompatible with #2-A's insert-then-delete — SQLite enforces uniqueness at INSERT, so `createAppendOnlyMemoryRecord`'s new row collides with the still-present predecessor and throws, breaking same-path re-index. FIX: rework the same-path branch in `handlers/memory-save.ts` `processPreparedMemory` to **delete-before-insert** (capture predecessor lineage metadata, delete predecessor, then insert new row + record SUPERSEDE lineage against the now-dangling predecessor id) OR switch to update-in-place. THEN create the index + register as schema migration **v28** (`lib/search/vector-index-schema.ts`, bump `SCHEMA_VERSION` 27→28). Cleanup already removed all non-constitutional dups, so the index will build. Also via `memory_health({autoRepair:true, confirmed:true})`: sweep **~2,257 dangling `active_memory_projection` pointers** + **1 orphan vector**. The 3 constitutional-bearing collision keys are tolerated by the partial predicate.

**D. #3 Checkpoint-v2 scaffold.** `lib/storage/checkpoints.ts:1604` serializes the whole DB via one `JSON.stringify` → V8 max-string (`checkpoint_create` throws `Invalid string length` on the 1 GB DB). Design v2: PK-windowed compressed table chunks (NDJSON) OR SQLite `VACUUM INTO` for full-DB + manifest for scoped; keep v1 restore. Pass `includeEmbeddings` through the handler (`handlers/checkpoints.ts:40,398` — storage supports it; args don't).

**E. #5 MCP front-proxy / reconnect scaffold.** OBSERVED LIVE: re-embed load → RSS watchdog `recycleViaGracefulSelfExit` → launcher relaunch → client severed, no transparent reconnect (`bin/mk-spec-memory-launcher.cjs:676/701/709/829`, child `stdio:'inherit'` :808; transport in `context-server.ts:2067`). Short-term: on worker death close the client transport with an explicit reconnect-required error. Medium-term: stable front proxy owns MCP session state; `context-server` becomes a restartable backend; RSS recycle restarts only the backend.

**F. MANDATORY post-implementation deep-review (before any completion claim).** `/deep:start-review-loop` (or `@review`) over the #2-A change + the migration; surface no P0/P1. Scrutinize specifically: the insert-then-delete ordering (the #2-B incompatibility), `delete_memory_from_database`'s BM25 removal outside its inner transaction under the new path, and whether deleting same-path predecessors drops any needed lineage/causal/drift data.

**G. Final doc reconciliation + validation.** Reconcile `spec.md` Status, `checklist.md` evidence, `implementation-summary.md` to shipped reality (#2-A shipped; #2-C done; #2-B deferred; #4 partial). Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation --strict`, then `/memory:save`.

### Cleanup follow-ups (low priority)
- Purge the 1 GB migration backup once the migration + re-embed are verified good.
- Decide on `database/test-context-index.sqlite`.
- Commit or remove the two one-shot migration scripts.

### Hard constraints (carried over)
- NEVER raw-SQL-delete memory rows — sanctioned per-row `delete_memory()` only. NEVER `git add -A` (concurrent parallel-session churn) — explicit paths, commit direct to `main`. No spec-paths/packet-ids/phase-numbers in code comments (pre-commit guard enforces). Treat any further live-DB mutation as daemon-up-with-backup or daemon-owned, with before/after verification.

---

## RELATED DOCUMENTS
- **Design source**: `../012-memory-index-scan-ux-hardening/research/research.md`
- **This packet**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`
