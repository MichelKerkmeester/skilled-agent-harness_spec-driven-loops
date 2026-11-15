# Turn-start composer latency

Measured 2026-11-14 on `vibe 3.1.2`'s host, Node.js 26.13.0, against the warm
skill advisor daemon.

Method: 20 fresh `node .skilled/hooks/session-lifecycle/vibe/turn-start.mjs`
processes, one per call, each with its own session id so every call renders the
full brief (the worst case, not the reduced repeat). The payload carried a real
`transcript_path` and the advisor ran against this checkout. A temporary
`SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` kept both receipts out of the shared
store. Each call was timed from spawn to exit; every call exited 0 and printed a
brief that starts with `Advisor:`.

| Statistic | Wall time |
|---|---|
| median | 377.7 ms |
| p95 | 737.6 ms |
| max | 870.7 ms |

limit: pass (1500 ms at the 95th percentile)

All 20 samples, in call order, in milliseconds:

```text
478.8 265.5 280.7 371.0 397.6 737.6 412.0 396.3 407.0 365.2
468.2 377.7 870.7 295.7 274.4 287.5 270.1 534.7 265.8 266.3
```

The two slow samples are the advisor's own first-call warm-up and one scheduler
outlier; the typical call sits well under a third of the limit.
