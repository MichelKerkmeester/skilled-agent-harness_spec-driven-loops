---
title: "Durability Stress Tests"
description: "Load/soak/concurrency stress gate for the 013 memory-index-scan durability surfaces: checkpoint-v2 round-trips, enrichment-marker backfill, index_scan lease coalescing, and daemon RSS-recycle transparency."
trigger_phrases:
  - "durability stress"
  - "checkpoint contention stress"
  - "index scan coalescing stress"
  - "daemon recycle transparency stress"
---

# Durability Stress Tests

## 1. OVERVIEW

`stress-test/durability/` load-tests the durability surfaces shipped by the 013 memory-index-scan roadmap (checkpoint-v2 file snapshots, schema-v30 enrichment markers, the single-writer index_scan lease, and the launcher front-proxy recycle path) plus the daemon re-election lifecycle. Where `tests/*` proves these behaviors correct on a single happy path, this domain proves they stay correct under contention, flood, recycle, and owner disposal. Most cases run against throwaway temp/in-memory databases and the proxy's pure-logic helpers. The daemon re-election cases go further and spawn real launchers and a real daemon, but inside a throwaway fake-root with an isolated socket directory and database, so no case ever touches the production DB at `~/.mk-spec-memory` or the live daemon socket.

## 2. SCOPE

| File | Coverage |
|---|---|
| `checkpoint-v2-contention-stress.vitest.ts` | Many interleaved checkpoint-v2 create+restore round-trips against one throwaway DB via the injectable reopen hook: memory stays lossless, create-time pruning keeps the on-disk snapshot directories bounded at `MAX_CHECKPOINTS` (a v2 restore may MERGE catalog rows back in, so the catalog row count is not what stays capped), no orphaned snapshot/`.tmp-` dirs survive, and the `E_RESTORE_IN_PROGRESS` barrier is observable during the swap window so mutating handlers back off. |
| `enrichment-marker-backfill-stress.vitest.ts` | A 300-row save flood that leaves `pending` schema-v30 enrichment markers, drained to `complete` through repeated bounded backfill passes (`repairIncompleteMarkers`): markers converge, the partial-index-eligible set drains to empty, and the per-pass work stays bounded — no runaway storm, no leak. |
| `index-scan-coalescing-stress.vitest.ts` | A 64-wide concurrent `acquireIndexScanLease` burst: exactly one writer is admitted (single-writer), the rest back off with a structured `lease_active`/`cooldown` reason rather than a raw E429 storm, the cooldown coalesces immediate re-acquisitions, and an expired lease is reclaimable so a crashed scan never wedges the slot. |
| `daemon-recycle-transparency-stress.vitest.ts` | A 200-request in-flight flood through the front-proxy pending-request tracker across a simulated backend RSS-recycle: idempotent reads replay transparently, unsafe mutations are refused with the retryable `-32001` recycle signal (still LIVE), the pending set drains with no leak, and `-32002` stays the terminal protocol-mismatch code. |
| `daemon-reelection-release-integration.vitest.ts` | Drives the real exported release-vs-kill decision functions and OS reparent semantics with a detached sleeper stand-in: flag-on releases the daemon so it survives owner disposal, flag-off kills it. No lease, DB, or socket is touched. |
| `daemon-reelection-adoption-live.vitest.ts` | Runs two real launchers against an isolated fake-root: a live secondary keeps MCP transport through owner disposal (flag on), the daemon dies with its owner (flag off), and a fresh session started after disposal reaps the released daemon before respawn so a single writer holds the database. |
| `embedder-degrade-recall-flood-stress.vitest.ts` | C9 graceful degradation under a 96-wide concurrent recall flood: query embeddings return `null`, every hybrid recall degrades to bounded lexical results with `embedder_unavailable` metadata, vector/graph work is skipped, and the flood completes without throws, leaks or wedges. |
| `ipc-client-cap-fanout-stress.vitest.ts` | Exercises high-fanout IPC client admission so capability limits stay bounded and retryable under concurrent client pressure. |
| `metadata-edge-promoter-stress.vitest.ts` | Stress-tests metadata edge promotion so repeated saves converge without duplicate or missing promoted edges. |
| `release-cleanup-new-surfaces-stress.vitest.ts` | Covers release-cleanup behavior for newly documented surfaces so stale moved or removed rows do not survive cleanup. |
| `shard-repair-persistence-stress.vitest.ts` | Validates shard repair persistence across repeated repair passes so repaired state remains durable after reopen. |

## 3. RUN RECIPE

Run the durability gate from `.opencode/skills/system-spec-kit/mcp-server`:

```bash
npm run stress:durability
```

Run a single case:

```bash
npx vitest run --config vitest.stress.config.ts \
  stress-test/durability/checkpoint-v2-contention-stress.vitest.ts
```

## 4. ISOLATION BOUNDARY

Every case is hermetic. The checkpoint and enrichment cases use per-test `mkdtemp`/`:memory:` SQLite databases torn down in `afterEach`. The index_scan case injects a throwaway in-memory handle into `db-state` via `init()`; the lease primitives create their own `config` table. The recycle case is pure logic against the proxy module's exported `__testing` helpers, so no socket is opened and no backend daemon is spawned. The two daemon re-election cases DO spawn real launchers and a real daemon, but only inside a throwaway fake-root: the launcher and daemon dist are real-copied so their lease and DB resolve to the temp root, the IPC socket lives in a short isolated directory, and every process they start is tracked by pid and force-reaped in teardown. None of these cases touch the production database at `~/.mk-spec-memory` or the live `daemon-ipc` socket, so running this domain against a live operator session is safe.
