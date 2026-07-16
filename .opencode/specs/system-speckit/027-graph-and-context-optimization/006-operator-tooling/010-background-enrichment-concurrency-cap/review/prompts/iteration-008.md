Adversarial deep-review worker, iteration 8 of 10 (gpt-5.5 xhigh). Review the committed fix (commit 25587fa412), read-only:
- .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts (scheduleBackgroundEnrichment)
- .opencode/skills/system-spec-kit/mcp_server/context-server.ts (startupScan + shutdown/close paths)

CONVERGED PRIOR (iters 1-6, DO NOT re-derive): slot invariant proven; atomic gate; no re-entrancy; dist mirrors source. Known P2s: queue retention; stale-handle (comment fixed); idle-monitor blind to enrichment; possible hung-run slot-exhaustion.

YOUR LENS — SHUTDOWN / WAL-CHECKPOINT / LIFECYCLE (deeper than iter 2's idle note):
1. Graceful shutdown does a WAL checkpoint + db.close() (the 007-mcp-daemon-reliability track has packets on this). If background enrichment runs (DB WRITES via recordEnrichmentResult) are in-flight or queued during close, what happens? Can an enrichment write race the checkpoint/close → write-after-close throw, a dirtied WAL, or a checkpoint that misses in-flight writes? Trace the close path vs the enrichment write.
2. The graceful-exit-watchdog / SIGTERM handler: does it drain or abandon the enrichment queue? Is abandonment safe (backfill recovers) AND does it avoid writing after the DB is closed?
3. Daemon RECYCLE-IN-PLACE (RSS breach → recycleDaemonInPlace): same question — in-flight/queued enrichment vs the recycle.
4. Does anything need to AWAIT queue drain before close, or is fire-and-forget + backfill the correct contract? Is the current behavior consistent with the daemon's documented durability guarantees?

OUTPUT: findings list. Each: SEVERITY (P0/P1/P2), file:line, concrete failure, minimal fix, confidence, NEW or confirms-prior. If sound, say so with evidence. Skeptical; no preamble.