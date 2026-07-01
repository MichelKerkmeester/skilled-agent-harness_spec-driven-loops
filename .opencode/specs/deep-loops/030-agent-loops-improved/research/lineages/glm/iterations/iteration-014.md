# Iteration 014 — NEW: loop-lock.cjs Has Staleness CHECK But No Proactive SWEEPER

**Focus:** Does loop-lock.cjs auto-reclaim stale locks, or only report them?
**Angle:** Trace TTL/sweep/reclaim logic; reconcile with the >24h-stale native lock.

## Findings

`loop-lock.cjs` (10KB) has:
- TTL parsing (line 158: default 300000ms / 5min)
- `isStaleLoopLock(holder)` staleness check (line 188)
- A `status` command that reports `{ exists, held, stale, alive, holder }` (line 183-188)

**BUT: there is no proactive sweeper.** The grep for `sweep|reclaim|expire` returns only TTL/status logic. Reclaim of a stale lock happens ONLY when a NEW acquire explicitly contends for the same lock path and the stale check lets it take over. There is no background timer, no init-time sweep, no "reclaim all stale locks older than N" command.

**Empirical proof:** The native review lock (`review/lineages/native/.deep-review.lock`) has been stale for **>24h** (started 2026-06-30T08:01, TTL 5min, today is 2026-07-01). It was never reclaimed because no second review lineage acquired a lock for the same path — the glm and codex review lineages use their OWN lineage-named lock paths (`review/lineages/glm/`, `review/lineages/codex/`), so they never contend with the `native/` lock.

**Design gap:** stale locks in ABANDONED lineages (whose path is never revisited) persist forever. This is exactly how the native lineage lock became a permanent artifact. Recommendation: add a `loop-lock.cjs sweep --lock-dir <dir> --stale-only --reclaim` command and call it at review/research INIT.

## Evidence
[SOURCE: loop-lock.cjs:134,158,183-188 — TTL + staleness check + status, no sweep]
[SOURCE: review/lineages/native/.deep-review.lock — >24h stale, never reclaimed]

## newInfoRatio: 0.85 (new: precise design gap — staleness is detectable but never proactively acted upon for abandoned paths)
