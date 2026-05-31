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
    last_updated_at: "2026-05-31T20:35:00Z"
    last_updated_by: "claude-sonnet-4-6"
    recent_action: "All 3 phases merged to main; checklist complete; validate.sh PASSED"
    next_safe_action: "Restart daemon, re-index 012/013 packets"
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

> **One-line state:** All 3 phases merged to main, `validate.sh --strict` PASSED, checklist 100% checked. The daemon source is updated but the running process is still on old code. Two post-implementation steps remain: restart the daemon and re-index the 012/013 spec packets.

---

## 1. WHERE WE ARE (ground truth)

| Item | State | Location / Hash |
|------|-------|-----------------|
| `main` branch HEAD | clean | `1390d8be05` |
| 012 research packet | committed, strict PASSED | `…/012-memory-index-scan-ux-hardening/` |
| 013 implementation | **all phases shipped** | `…/013-memory-index-scan-implementation/` |
| Phase 1 code | merged `98330d18fc` | coalescing + health.index + orphan sweep |
| Phase 2 code | merged `156a0b469f` (then merge commit) | async scan + drain circuit guard |
| Phase 3 code | merged `9156d60cc3` (then merge commit) | move reconciliation + scan heartbeat |
| 013 docs | reconciled, strict PASSED | checklist 100%, impl-summary final |
| Worktrees / branches | **none** | all cleaned up |
| Daemon running | old source (pre-013) | restart needed |
| 012/013 reindex | deferred | run `memory_index_scan` after daemon restart |

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

## RELATED DOCUMENTS
- **Design source**: `../012-memory-index-scan-ux-hardening/research/research.md`
- **This packet**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`
