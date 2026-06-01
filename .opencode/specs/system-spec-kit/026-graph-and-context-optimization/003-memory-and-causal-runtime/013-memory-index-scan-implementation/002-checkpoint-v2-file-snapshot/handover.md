---
title: "Handover: checkpoint-v2 + 013 Phase-4 roadmap (D shipped/review-clean, E designed, F done, G pending) [system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/002-checkpoint-v2-file-snapshot/handover]"
description: "Compaction handover for the 013 Phase-4 roadmap. D (checkpoint-v2) code Phases 1-7 are on main + multi-lens review SAFE TO DEPLOY but NOT live-verified. E (MCP front-proxy) designed + packet 003 scaffolded. F (memory bugs) committed. G cleanups + live-verify + E-impl pending."
trigger_phrases:
  - "checkpoint v2 handover"
  - "013 roadmap resume"
  - "checkpoint v2 live verify next"
  - "mcp front-proxy implementation next"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/002-checkpoint-v2-file-snapshot"
    last_updated_at: "2026-06-01T21:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Checkpoint-v2 Phases 1-7 committed b9820541e9; multi-lens review SAFE TO DEPLOY"
    next_safe_action: "Live-verify checkpoint-v2 (rebuild + restart + full-DB create/restore proof)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---

# Handover: checkpoint-v2 + 013 Phase-4 roadmap

> **One-line:** checkpoint-v2 CODE (Phases 1-7) is fully on `main` and a multi-lens review returned **SAFE TO DEPLOY (P0/P1 none)** — but it is **NOT live-verified** (daemon still runs the old `dist/`). E (MCP front-proxy) is designed + packet scaffolded. F (memory bugs) is committed. G cleanups, the live-verify, and E implementation remain.

## Operator goal (verbatim)
"get long-term best solution for all roadmap items, work we planned to 100% completion and verification" — using **cli-opencode gpt-5.5-fast --variant high** + **agent workflows**, prioritizing effectiveness + quality. The roadmap = the 013 Phase-4 follow-ups: **D** checkpoint-v2, **E** MCP front-proxy, **F** memory-system bugs, **G** cleanups.

## Branch + session commits (`main`, atop parallel-session commits 81bbb44e7c / ffba279f3e)
- `ddbab5e5a6` docs(013) reconcile prior Phase-4 (A-G) work
- `500d1ca74c` docs scaffold checkpoint-v2 packet (was 001)
- `966a75c3be` Phase 1 — schema v29 + includeEmbeddings (CODE)
- `f86a80ca65` Phase 2 — v2 CREATE via VACUUM INTO (CODE)
- `40f647e4ae` Phase 3 — v2 RESTORE file-swap + reopen coordinator (CODE)
- `db88702658` refactor(013) → phase parent (001-self-maintaining-index, 002-checkpoint-v2-file-snapshot)
- `36f444a8e7` fix(memory) F — 3 bugs (CODE)
- `2a6e679f2e` docs(013/003) E packet scaffold
- `b9820541e9` feat(checkpoint-v2) journal crash-safety Phase 4-7 (CODE) ← **latest; current main HEAD**

## D — checkpoint-v2 (packet 002): CODE COMPLETE + REVIEW-CLEAN, **NOT LIVE-VERIFIED**
All code (Phases 1-7) is on main. Multi-lens review **FINAL VERDICT: SAFE TO DEPLOY, P0/P1 none.**
- **Design:** full-DB checkpoints use SQLite `VACUUM INTO` (main + `active_vec` shard) → `database/checkpoints/<name>/{snapshot-main.sqlite, snapshot-vec.sqlite?, manifest.json}`; row `snapshot_format='v2'`. v1 JSON path UNCHANGED for scoped checkpoints. Restore = close → file-swap → reopen (`reopenActiveDatabase`), guarded by a **two-phase journal** (`swap-pending`→`swap-done`: recovery rolls back only while pending, KEEPS the restored snapshot once done — fixes the silent-data-loss bug), shard-aware recovery (`shouldRestoreVec` + `liveShardPreexisted`), and fsync durability. Schema **v29** added `checkpoints.snapshot_format`/`snapshot_path`. `includeEmbeddings` exposed on `checkpoint_create`.
- **Verified:** tsc 0; vitest 144 pass / 1 skip across 8 checkpoint+reindex suites (8 new crash-recovery tests). Both crash-recovery + data-integrity review lenses confirmed P0/P1 none.
- **4 P2 FAST-FOLLOWS (non-blocking, documented):** (P2-1) stale-`.bak` fsync ordering in `swapFn` (`checkpoints.ts` ~2390 — add `fsyncDirectoryIfPossible(dirname(liveMainPath))` after the stale-`.bak` rmSync, before `writeRestoreJournal`); (P2-2) post-`swap-done` in-process-revert determinism (`checkpoints.ts` ~2421-2473 — on a post-swap-done init/rebuild failure, either demote the journal to `swap-pending` before the in-process revert OR treat `swap-done` as committed and let boot recovery finalize, so in-process and crash outcomes agree); (P2-3) `.needs-rebuild` sentinel for post-`swap-done` derived staleness (a crash during the post-swap rebuilds keeps the restored base but leaves FTS/communities stale until the next scan — degraded, not data loss); (P2-4) `.unclean-shutdown` git hygiene (`git rm --cached` it + gitignore `mcp_server/database/.unclean-shutdown` + `-wal`/`-shm`).
- **NEXT (D) — LIVE VERIFY (the remaining proof):** rebuild `dist/` + restart the daemon onto the new code (Phases 1-7 + F), then on the live ~1 GB DB: `checkpoint_create` (full-DB) MUST succeed with NO `Invalid string length`; `checkpoint_list` shows the v2 row; a `checkpoint_restore` round-trip into a scratch/verified copy + `memory_health` consistency (`rowsTotal == ftsRowsTotal == vecRowsTotal`, `mismatchedIds: []`). Then reconcile 002 docs (spec status / checklist evidence / implementation-summary) + `validate.sh --strict` on 002.

## E — MCP front-proxy (packet 003): DESIGNED + SCAFFOLDED, **IMPL PENDING**
- Packet `013/003-mcp-front-proxy` committed (`2a6e679f2e`), `validate --strict` PASS. Full design at **`/tmp/E-front-proxy-design.md`** (also encoded in 003's docs).
- **Recommended design (judge-panel, code-verified): "Launcher-as-Reconnecting-Frame-Proxy with In-Place Daemon Recycle."** Core fix: DELETE the launcher's `process.exit(0)` in `recycleViaGracefulSelfExit` (`.opencode/bin/mk-spec-memory-launcher.cjs` ~697/710) → rename to `recycleDaemonInPlace`; the existing supervisor (~817-839) respawns the daemon CHILD in place, so the launcher (+ the client's stdio) survives the recycle. Then make the launcher a frame-aware reconnecting proxy that owns the client MCP transport: frame-parse BOTH directions (raw piping ships a truncated JSON-RPC frame on mid-response death), handshake replay (`initialize` + `notifications/initialized`, captured by method), idle-monitor fix (else it idle-kills during the reconnect gap), idempotency classifier (do NOT blind-replay `memory_bulk_delete`/`memory_update`/`checkpoint_restore`/`embedder_set`). **Standalone-proxy was REJECTED** (orphans the launcher). 
- **IMPL gated on D** (both touch `context-server.ts`). Phased per `003/plan.md`. Large effort. Live-verify = an RSS-recycle mid-request must NOT sever the client.

## F — memory-system bugs: DONE (`36f444a8e7`)
F1 `embedding-reconcile.ts` `computeSuccessCoverage` dropped the buggy empty-`vec_768` NOT-EXISTS clause (now `vec_memories_rowids` presence, matching `memory_health`). F2 `shared/embeddings/factory.ts` emptiness check → `vec_memories_rowids`. F3 `schema-downgrade.ts` dropped legacy `UNIQUE(spec_folder,file_path,anchor_id)`. tsc 0 + tests green.

## G — cleanups: PENDING (after D live-verify)
- Purge the 1 GB rebuild backup `database/backups/context-index-PRE-REBUILD-20260601-161614/` once checkpoint-v2 is live-verified good.
- Reconcile the memory-index **"degraded" consistency** from the 013 restructure re-index (old-path orphan rows; ~28 `mismatchedIds` — alignment, NOT data loss; counts equal). Sweep old-path orphans / clean reconcile alongside the live-verify health check.
- (Separate, larger — scope with operator) ~105 pre-existing repo-wide metadata validation failures (importance_tier CHECK + malformed graph-metadata.json).

## Worktrees (work committed; PRUNABLE)
- `…/cp-v2-worktree` (db88702658 + Phase 4-7) — D committed to main; `git worktree remove --force` it.
- `…/cp-v2-worktree-f` (F) — committed; prunable.
- All background dispatches/workflows complete (last: `w95h3dpg3` final D review).

## Carried constraints (VERBATIM — still in effect)
- **NEVER `git add -A`** — main advanced via concurrent parallel-session commits this session (deep-improvement, sk-code). Commit with EXPLICIT paths, direct to `main`.
- **NEVER raw-SQL-delete** memory rows — sanctioned `memory_delete()` / MCP only.
- **No** spec-paths / packet-ids / phase-numbers / ADR-REQ-CHK-task-ids in CODE comments (pre-commit gate + hook enforce; durable WHY only).
- **Code is NOT live until `dist/` rebuild + daemon restart** — the daemon runs the old `dist/`, so all Phase 1-7 + F code is committed but not yet executing.
- The embedder factory `vec_768` false-positive is FIXED in source (F2) but NOT deployed; prefer daemon-routed `memory_index_scan`/`memory_save` over `generate-context.js` until the daemon is rebuilt.
- Daemon RSS-recycles under load (the item-E bug; pid churned 52363→304→… this session); `/mcp reconnect` if servers drop.

## Verification protocol (proven this session)
Per code phase: implement in `cp-v2-worktree` (RM-8 + the 3 node_modules symlinks: `mcp_server/node_modules`, `system-spec-kit/node_modules`, `system-spec-kit/shared/dist`) via gpt-5.5-fast/high, OR orchestrator-direct for repeatedly-flaky areas → independent review (cli-codex `gpt-5.5` `-c model_reasoning_effort=xhigh -c service_tier=fast --sandbox read-only`, OR a multi-lens review **workflow**) → `npm run typecheck` 0 + targeted `vitest` in the worktree → parallel-safety (`git diff <base>..HEAD` + `status` clean for the files) → `cp` worktree→main → tsc in main → commit explicit paths. **The multi-lens review workflow caught a silent-data-loss bug that 3 single-codex passes missed — use it for crash-safety-critical changes.** cli-opencode dispatch: `opencode run --model openai/gpt-5.5-fast --variant high --agent general --format json --dir <worktree> --dangerously-skip-permissions "$(cat prompt)" </dev/null` (xhigh is NOT valid on opencode's gpt-5.5; that's the codex/copilot route).

## EXACT NEXT ACTION (post-compaction)
1. (optional housekeeping) prune `cp-v2-worktree` + `cp-v2-worktree-f` (work committed).
2. **D live-verify**: rebuild `dist/` + restart the daemon; `checkpoint_create` on the live DB (expect no `Invalid string length`); `checkpoint_restore` round-trip; `memory_health` consistent. Then reconcile 002 docs + `validate.sh --strict` on 002.
3. **G**: reconcile the degraded memory-index consistency; purge the 1 GB backup.
4. **E implementation**: gpt-5.5 phased from `003/plan.md` + multi-lens review + RSS-recycle live-verify.
5. (optional) fix the 4 D P2 fast-follows.
6. Final `/memory:save`.
