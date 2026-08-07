# Iteration 006 — Re-verify: Abandoned Native Review Lineage + Stale Lock (Round-1 F-007)

**Focus:** native review lineage lock staleness and packet-id reference.
**Angle:** Read the live lock file; check for TTL sweeper reclaim.

## Findings

**`review/lineages/native/.deep-review.lock` is STILL PRESENT and UNCHANGED:**
```json
{
  "owner_pid": 76778,
  "started_at_iso": "2026-06-30T08:01:03.899Z",
  "ttl_ms": 300000,
  "last_heartbeat_iso": "2026-06-30T08:01:03.899Z",
  "packet_id": ".opencode/specs/skilled-agent-orchestration/156-agent-loops-improved",
  "phase": "running",
  "last_activity_iso": "2026-06-30T08:01:03.899Z"
}
```

Three live problems confirmed:
1. **`started_at_iso == last_heartbeat_iso`** — the lock was acquired at 08:01 and never re-heartbeated (the process crashed after iteration 1). TTL is 5 min (300000ms); it is now >24h stale.
2. **`packet_id` references a non-existent path** (`156-agent-loops-improved` never existed as a directory — it was only an internal pre-migration number).
3. **`phase: "running"`** — the lineage is stuck in a running state forever.

**Empirical proof no TTL sweeper reclaims dead locks:** the lock has been stale for >24h and was never auto-reclaimed. `loop-lock.cjs` HAS staleness CHECKING (`isStaleLoopLock`, line 188 `status` command reports `stale:true`) but reclaim only happens on explicit acquire-contention, not proactively. Since no second lineage contended for this lock, it persists indefinitely.

The native lineage itself has only 1 prompt and no completed iterations (`iterations/` dir empty per the tree).

## Evidence
[SOURCE: review/lineages/native/.deep-review.lock — all fields]
[SOURCE: loop-lock.cjs:134,158,183-188 — status reports stale but no proactive sweeper]

## newInfoRatio: 0.65 (confirmed unchanged + empirical proof of no auto-sweep via >24h persistence)
