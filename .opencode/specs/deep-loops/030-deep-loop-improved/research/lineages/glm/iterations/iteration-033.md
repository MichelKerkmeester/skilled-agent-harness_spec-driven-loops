# Iteration 033 — NEW: Native Lineage Lock — No Auto-Reclaim (Empirical + Design)

**Focus:** Combine iteration 006 (live state) and 014 (code gap) into a concrete reclaim design.
**Angle:** Why abandoned-lineage locks persist forever + the fix.

## Findings

**Empirical state (iter 006):** the native review lock has been stale >24h (started 2026-06-30T08:01, TTL 5min, today 2026-07-01). `started_at_iso == last_heartbeat_iso` (never heartbeated — process crashed after iteration 1). `packet_id` references non-existent `156-agent-loops-improved`. `phase: "running"` forever.

**Code gap (iter 014):** loop-lock.cjs HAS `isStaleLoopLock` + a `status` command reporting `stale:true`, but reclaim ONLY happens on explicit acquire-contention. Since glm/codex review lineages use their OWN lineage-named lock paths, they never contend with `native/`'s lock, so it's never reclaimed.

**Design for the fix:**
1. Add `loop-lock.cjs sweep --lock-dir <dir> --stale-only [--reclaim]` that scans a directory for all `.*.lock` files, checks each with `isStaleLoopLock`, and (with `--reclaim`) removes/rearchives stale ones.
2. Call sweep at review/research INIT: before acquiring a new lock, sweep the lineage-root lock dir for stale locks from ANY lineage (not just the current one).
3. Add PID-liveness check: a lock whose `owner_pid` is not a live process is reclaimable regardless of TTL (the native lock's PID 76778 is certainly dead after 24h).
4. Archive (not delete) reclaimed lineage dirs so their partial state (1 prompt, strategy) is preserved for forensics.

**Blast radius if unfixed:** every abandoned CLI lineage (crash, kill, OOM) leaves a permanent lock + a `phase: "running"` state that confuses any status/dashboard tool scanning the lineages directory. Over time this accumulates. 009/005-packet-identity-cleanup (Tier 1) includes "stale native lock removal" as a manual step, but the AUTOMATED sweep is missing.

## Evidence
[SOURCE: iter 006 — lock fields; iter 014 — code gap]
[SOURCE: 009/spec.md:119 — 005 includes manual lock removal but no automated sweep]

## newInfoRatio: 0.8 (concrete sweep design with PID-liveness + archive-not-delete)
