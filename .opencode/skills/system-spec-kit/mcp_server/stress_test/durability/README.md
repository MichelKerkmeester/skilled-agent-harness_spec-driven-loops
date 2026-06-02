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

`stress_test/durability/` load-tests the durability surfaces shipped by the 013 memory-index-scan roadmap (checkpoint-v2 file snapshots, schema-v30 enrichment markers, the single-writer index_scan lease, and the launcher front-proxy recycle path). Where `tests/*` proves these behaviors correct on a single happy path, this domain proves they stay correct under contention, flood, and recycle. Every case runs against throwaway temp/in-memory databases and the proxy's pure-logic helpers — never the production DB at `~/.mk-spec-memory` and never the live daemon socket.

## 2. SCOPE

| File | Coverage |
|---|---|
| `checkpoint-v2-contention-stress.vitest.ts` | Many interleaved checkpoint-v2 create+restore round-trips against one throwaway DB via the injectable reopen hook: memory stays lossless, the catalog stays bounded at `MAX_CHECKPOINTS`, no orphaned snapshot/`.tmp-` dirs survive, and the `E_RESTORE_IN_PROGRESS` barrier is observable during the swap window so mutating handlers back off. |
| `enrichment-marker-backfill-stress.vitest.ts` | A 300-row save flood that leaves `pending` schema-v30 enrichment markers, drained to `complete` through repeated bounded backfill passes (`repairIncompleteMarkers`): markers converge, the partial-index-eligible set drains to empty, and the per-pass work stays bounded — no runaway storm, no leak. |
| `index-scan-coalescing-stress.vitest.ts` | A 64-wide concurrent `acquireIndexScanLease` burst: exactly one writer is admitted (single-writer), the rest back off with a structured `lease_active`/`cooldown` reason rather than a raw E429 storm, the cooldown coalesces immediate re-acquisitions, and an expired lease is reclaimable so a crashed scan never wedges the slot. |
| `daemon-recycle-transparency-stress.vitest.ts` | A 200-request in-flight flood through the front-proxy pending-request tracker across a simulated backend RSS-recycle: idempotent reads replay transparently, unsafe mutations are refused with the retryable `-32001` recycle signal (still LIVE), the pending set drains with no leak, and `-32002` stays the terminal protocol-mismatch code. |

## 3. RUN RECIPE

Run the durability gate from `.opencode/skills/system-spec-kit/mcp_server`:

```bash
npm run stress:durability
```

Run a single case:

```bash
npx vitest run --config vitest.stress.config.ts \
  stress_test/durability/checkpoint-v2-contention-stress.vitest.ts
```

## 4. ISOLATION BOUNDARY

Every case is hermetic. The checkpoint and enrichment cases use per-test `mkdtemp`/`:memory:` SQLite databases torn down in `afterEach`. The index_scan case injects a throwaway in-memory handle into `db-state` via `init()`; the lease primitives create their own `config` table. The recycle case is pure logic against the proxy module's exported `__testing` helpers — no socket is opened and no backend daemon is spawned. None of these cases touch the production database at `~/.mk-spec-memory` or the live `daemon-ipc` socket; running this domain against a live operator session is safe.
