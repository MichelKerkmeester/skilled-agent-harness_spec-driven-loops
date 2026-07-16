---
title: "Implementation Summary: Bounded background-enrichment scheduler"
description: "The enrichment scheduler now reserves its concurrency slot at schedule time and re-arms queued work via setImmediate, so a save or startup-scan burst no longer schedules unbounded work that starves the daemon event loop."
trigger_phrases:
  - "background enrichment cap summary"
  - "enrichment scheduler fix summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/006-operator-tooling/010-background-enrichment-concurrency-cap"
    last_updated_at: "2026-06-14T20:50:00Z"
    last_updated_by: "main-agent"
    recent_action: "Applied cap fix + scan yield; tsc 0 errors, 14/14 regression green, dist rebuilt"
    next_safe_action: "Run the 10-iteration deep-review"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "010-background-enrichment-concurrency-cap"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-background-enrichment-concurrency-cap |
| **Completed** | 2026-06-14 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The spec-memory daemon's background-enrichment scheduler had a concurrency cap that did not actually cap anything under load. It bumped the in-flight counter inside the deferred callback, so a burst — most acutely a startup scan calling it once per indexed row — read a stale zero on every call, all passed the `< 4` gate, and piled up unbounded `setImmediate` callbacks that then self-drained as a synchronous microtask chain. The event loop never returned to the poll phase, the IPC `accept()` starved, and the daemon spun at ~100% CPU. This was the trigger behind the incident the 009 supervisor fix recovers from; this packet removes the trigger.

### Bounded scheduler

The scheduler now reserves the slot at schedule time. A small `start(task)` helper increments the counter and then `setImmediate`s the task; the initial schedule and every queue drain go through it, so the counter reflects reserved work the moment it is scheduled and a burst correctly queues past the cap. The run's `finally` decrements once and re-arms the next queued task via `start` — through `setImmediate`, not a synchronous call — so control returns to the poll phase between runs. Enrichment behavior and the pending-marker backfill safety net are unchanged.

### Startup-scan yield

The boot indexing loop now awaits a `setImmediate` every 50 files. `indexSingleFile` is mostly synchronous better-sqlite3 work, so without an explicit macrotask yield a large scan drains as one uninterrupted run; the periodic yield hands control back so the daemon serves IPC during the scan.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modified | Reserve the enrichment slot at schedule time; re-arm the queue via `setImmediate` |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Periodic `setImmediate` yield in the startup-scan loop |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The defect was confirmed by direct source read (the counter increment was inside the callback at the cap-gated function), corroborated by the gpt-5.5 council's diagnosis and the live DB (2,947 incomplete enrichments across 11,507 indexed paths) plus the sampled native stack (`uv__run_check -> RunMicrotasks -> V8 RefillLab`). A clean `tsc --noEmit` baseline (0 errors) was captured before editing so the delta is attributable. After the change, typecheck stayed at 0 errors, the enrichment + async-scan regression suite ran 14/14 green, and `npm run build` regenerated dist with both changes confirmed present. The deep correctness check is a 10-iteration deep-review (review worker on opus-4.8 via the claude2 account), run after this summary.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reserve the slot at schedule time, not in the callback | The whole bug is that the deferred increment lets a burst read a stale count; reserving at schedule time is the direct, minimal fix |
| Re-arm the queue via `setImmediate`, not a sync `next()` | A synchronous drain never yields to the poll phase; `setImmediate` returns control between runs |
| Keep `MAX_BACKGROUND_ENRICHMENTS = 4` | The bound was never the problem — the accounting was |
| Add a scan-loop yield too | Even with a fixed cap, a tight synchronous scan over thousands of rows should periodically yield so IPC is served during boot |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit` baseline (pre-edit) | PASS — 0 errors |
| `tsc --noEmit` after edit | PASS — 0 errors (clean delta) |
| Enrichment + async-scan regression (3 files) | PASS — 14/14 |
| `npm run build` (tsc --build + finalize-dist) | PASS — exit 0; cap fix + scan yield confirmed in dist |
| Comment hygiene (no spec-path/packet-id in code comments) | PASS — durable WHY only |
| Deep-review (10-iter, opus-4.8 + gpt-5.5 xhigh) | CONDITIONAL — the cap fix is correct (REQ-001..005 hold); F-006 hung-run REFUTED (providers timeout-bound the embed); F-008+F-012 shutdown-fence P1 confirmed → follow-up packet; 4 P2 deferred. See `review/review-report.md` |
| Post-review remediation | F2 over-claiming comment tightened (comment-only; dist unaffected) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No isolated unit test for the cap.** `scheduleBackgroundEnrichment` is module-internal, so the bounded-concurrency invariant is verified by reasoning + the regression suite + the deep-review rather than a dedicated test. If the review calls for it, the scheduler can be extracted into a testable helper.
2. **The scan yield interval (50) is a fixed heuristic.** It is not tuned per workload; 50 balances responsiveness against `setImmediate` overhead for typical scans.
3. **Fix takes effect on next daemon launch.** dist is rebuilt, but the currently-running daemon keeps the old code until it is relaunched (the 009 fix handles recovering the wedged instance).
4. **Queue retention duration (deep-review F-003, P2).** The fix bounds concurrency, not queue size, so a large scan retains `parsed` payloads for the throttled drain (~tens-to-~100MB transient). Not a peak regression (pre-fix peak was higher). Deferred: store only `memoryId` and re-derive `parsed` at run time, or bound the queue. See `review/review-report.md` §4 W-1.
5. **Idle-monitor blind to enrichment (deep-review F-005, P2, conditional).** A short idle timeout could shut the daemon mid-drain; late rows recover via backfill. Deferred (cross-cutting). See `review/review-report.md` §4 W-2.
6. **Deep-review surfaced 2 confirmed P1 shutdown-durability gaps (F-008, F-012) — handled in a follow-up packet.** The enrichment scheduler and the startup scan are not fenced in `fatalShutdown` before `closeDb()`, so a deferred run/scan can reopen the DB and re-dirty the WAL after the close checkpoint. These are pre-existing (the scheduler/scan were always unfenced); this fix only changes their timing. Harm is operational (a possibly-needless boot rebuild; bounded by `wal_autocheckpoint=256` + the boot integrity gate; no data loss — backfill recovers). The F-006 hung-run P1 was REFUTED (every embed provider already bounds the request with an abort-on-timeout). Full registry: `review/review-report.md`. Verdict: CONDITIONAL — the 010 cap fix itself is correct and stays; the fences are a separate lifecycle concern.
<!-- /ANCHOR:limitations -->
