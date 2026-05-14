---
title: "005 substrate-stability-instrumentation (RSS log + circuit-flap flag + threshold doc)"
description: "Add observability so future substrate flap incidents are diagnosable in minutes instead of hours. RSS log on startup, RSS field in memory_health response, circuit-flap boolean derived from recent state transitions, resource-map doc listing thresholds."
trigger_phrases:
  - "substrate stability instrumentation"
  - "memory_health rss field"
  - "circuit flapping boolean"
  - "memory-mcp threshold documentation"
importance_tier: "normal"
status: "planned"
---

# 005 — Substrate-stability instrumentation

## Goal

Observability + documentation, not behavior change. Make substrate flap incidents (like today's chronic E081) faster to diagnose by surfacing key metrics in memory_health + documenting the kill-switch thresholds the council identified.

## Source anchors

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` — memory_health response shape. Add new fields here.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` (startup entry) — emit RSS log at startup.
- `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts` (circuit state) — derive `flapping` flag from recent transitions.

## Implementation

### Change 1 — RSS log on daemon startup

In the Memory MCP daemon entrypoint (context-server.ts), after the server starts listening:

```ts
const rssMB = Math.round(process.memoryUsage().rss / 1024 / 1024);
console.error(`[health] startup rss=${rssMB}MB pid=${process.pid} uptime=0s`);
```

### Change 2 — RSS + flapping in memory_health response

Extend the `memory_health` response `data` object with:

```ts
{
  process: {
    pid: process.pid,
    rss_mb: Math.round(process.memoryUsage().rss / 1024 / 1024),
    uptime_seconds: Math.round(process.uptime()),
  },
  // existing fields...
  embeddingRetry: {
    // existing fields...
    flapping: deriveFlappingFlag(circuitStateTransitions, /* windowMs */ 600_000),
    transitionsInLast10Min: countTransitionsInWindow(/* 600_000 */),
  },
}
```

`deriveFlappingFlag()` returns true if circuit-breaker state transitioned more than 2 times in the last 10 min. Implemented as a small ring buffer in retry-manager.ts.

### Change 3 — Resource-map doc

Create `005-.../resource-map.md` with:

| Metric | Source | Threshold | What it means |
|---|---|---|---|
| process.rss_mb | memory_health | 1500 MB kill-switch (council) | Daemon memory exceeded comfort zone; investigate OOM/leak |
| circuit.flapping | memory_health | > 2 transitions / 10 min | Embedding worker is unstable; reduce SPECKIT_RETRY_BATCH_SIZE |
| queue depth | memory_health | < 100 healthy, > 500 critical | Backlog accumulating; check provider health |
| failed count | memory_health | < 10 healthy, > 50 elevated | Historical failures; run repair-failed-embeddings.mjs |
| vec_rows mismatch | memory_health.consistency | < 5% mismatch healthy | FTS/vec consistency drift; check substrate health |

## Acceptance criteria

1. Startup log line `[health] startup rss=...MB pid=... uptime=0s` visible on Memory MCP daemon launch.
2. `memory_health` response includes `data.process.{pid, rss_mb, uptime_seconds}`.
3. `memory_health` response includes `data.embeddingRetry.{flapping, transitionsInLast10Min}`.
4. `resource-map.md` documents all 5 thresholds with sources + meanings.
5. Dual-patch source + dist (Wave 1 may still have broken build).
6. `implementation-summary.md` includes a sample memory_health output showing the new fields populated.

## Out of scope

- Building a dashboard or alerting system.
- Tracking provider-specific metrics (embedding latency p99, etc.).
- Changing the actual kill-switch threshold (1.5GB) — that's a doc change only.
- Behavior changes to retry / save / search paths.
