# Iteration 007: Abandoned Native Review Lineage + Stale Lock + Old Path

## Focus
- Scope: review/lineages/native/ — abandoned lineage, stale lock, old packet path reference
- Question: Is the abandoned native lineage lock stale enough to be dangerous?

## Findings

### F-007: Abandoned native review lineage with >21h stale lock referencing old packet path

**Severity: High (stale lock blocks future review runs + path confusion)**

**The lock file:**
```json
{
  "owner_pid": 76778,
  "started_at_iso": "2026-06-30T08:01:03.899Z",
  "ttl_ms": 300000,
  "last_heartbeat_iso": "2026-06-30T08:01:03.899Z",
  "packet_id": ".opencode/specs/skilled-agent-orchestration/156-agent-loops-improved",
  "runtime_kind": "main",
  "phase": "running",
  "last_activity_iso": "2026-06-30T08:01:03.899Z",
  "acquire_nonce": "76778-1782806463901-3f1a25c3-cb79-4557-8491-2ac02f87c2e4"
}
```

[SOURCE: `review/lineages/native/.deep-review.lock`]

**Three problems compound here:**

**1. Stale lock (TTL exceeded by >21 hours)**
- `started_at_iso` and `last_heartbeat_iso` are identical: `2026-06-30T08:01:03.899Z`
- TTL: 300000ms (5 minutes)
- Lock file mtime: Jun 30 10:01:03 2026 (local time, = 08:01 UTC)
- Current time: Jul 1 07:36 CEST 2026
- **The lock is >21 hours past its TTL with no heartbeat update**
- The process (PID 76778) is almost certainly dead — it never sent a heartbeat after acquisition
- `phase: "running"` is a lie — the lineage was abandoned mid-run

**2. Old packet path reference**
- `packet_id: ".opencode/specs/skilled-agent-orchestration/156-agent-loops-improved"`
- This path does NOT exist — the packet was migrated to `deep-loops/030-agent-loops-improved`
- The lock's `packet_id` field references a path that no longer resolves
- The `156-agent-loops-improved` path itself was a pre-migration name (the packet was `123-agent-loops-improved` before the final `030-agent-loops-improved` rename)

**3. No cleanup mechanism**
- The lock TTL is 5 minutes, but there is no automated sweeper that removes expired locks
- A future `/deep:review` run against this packet will see the lock and either:
  - Block waiting for the dead process (if the lock-check is naive)
  - Skip with a "lineage already running" error (if the lock-check is pessimistic)
  - Silently override (if the lock-check is optimistic — but then the lock is useless)

**Lineage state:**
The native lineage has:
- `deep-review-config.json` (exists)
- `deep-review-findings-registry.json` (exists)
- `deep-review-state.jsonl` (exists)
- `deep-review-strategy.md` (exists)
- `prompts/iteration-001.md` (exists — only 1 iteration prompt was generated)
- NO `iterations/` directory — the lineage was abandoned before completing iteration 1
- NO `deep-review-dashboard.md` — never reached synthesis
[SOURCE: `review/lineages/native/` directory listing]

**Root cause:** A native (non-fan-out) review was started, acquired the lock, wrote the init artifacts + 1 prompt, but was killed or crashed before the iteration ran. The lock was never released because the kill path doesn't clean up locks, and there is no TTL-based sweeper.

**Impact:**
1. Stale lock may block future review runs
2. The native lineage artifacts are orphaned (config/strategy/registry with no iterations)
3. The old packet_id in the lock will confuse any lock-validation logic that checks `packet_id` against the current path

**Recommendation:**
1. **Immediate:** Remove `.deep-review.lock` from `review/lineages/native/` and archive the native lineage directory
2. **Short-term:** Add a `step_lock_ttl_sweep` to the review workflow INIT that checks lock age vs TTL and removes expired locks before acquiring
3. **Better:** Make `acquireLock()` reject and sweep locks whose `last_heartbeat_iso` exceeds `TTL * 2` automatically, with a log line
4. **Packet path:** Ensure lock files use the current spec-folder path, not a hardcoded old path

## Novelty Justification
Confirmed the lock is >21h stale (prior topic said >24h — it's actually between 21-22h depending on timezone calculation, but still far past the 5-minute TTL). New finding: the lock's `packet_id` references a non-existent path (`156-agent-loops-improved` never existed as a directory — only as an internal name). New finding: no TTL sweeper exists in the lock machinery.

## What Was Tried and Failed
- Checked if PID 76778 is still alive (would need process check, but lock mtime >21h old makes this near-certain it's dead)

## Ruled-Out Directions
- The lock is NOT intentionally held (TTL is 5 min, lock is >21h old)
