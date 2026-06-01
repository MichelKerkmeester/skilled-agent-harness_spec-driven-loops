---
title: "Substrate Stability Instrumentation: RSS Visibility and Circuit Flap Telemetry"
description: "Memory MCP health now exposes process RSS and circuit flapping telemetry. Daemon startup logs RSS at connect time. Operational thresholds are documented in resource-map.md."
trigger_phrases:
  - "substrate stability instrumentation"
  - "memory health rss process fields"
  - "circuit flap telemetry"
  - "memory_health process pid rss"
  - "circuit breaker flapping boolean"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/005-stability-instrumentation`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups`

### Summary

Substrate flap incidents were hard to diagnose because the Memory MCP daemon exposed no process RSS, no startup memory baseline or record of recent circuit-breaker state changes. The only visible signal during a degraded incident was a bare `memory_health` response with no process context.

Three lightweight telemetry additions shipped together: a startup RSS log line emitted immediately after the MCP transport connects, a `data.process` block added to every successful `memory_health` response plus a `flapping` boolean with `transitionsInLast10Min` counter added to `data.embeddingRetry`. A `resource-map.md` documents all five operational thresholds. No retry logic, save behavior, search behavior or queue semantics were changed.

### Added

- Startup log line emitted after `server.connect` in `context-server.ts` reporting `pid`, `rss_mb` and `uptime_seconds`.
- `getCircuitFlapState()` helper in `retry-manager.ts` tracking open and cooldown-close transitions in a 10-minute in-memory window.
- `data.process.{pid, rss_mb, uptime_seconds}` block in `memory_health` successful responses via `memory-crud-health.ts`.
- `data.embeddingRetry.flapping` and `data.embeddingRetry.transitionsInLast10Min` fields in `memory_health` embedding-retry block.
- `resource-map.md` documenting five substrate stability thresholds: 1500 MB RSS kill-switch, more than two transitions per 10 minutes as flapping, queue depths of 100 and 500, failed count thresholds of 10 and 50 plus vec/total ratio below 5 percent mismatch.

### Changed

- `memory-crud-health.ts` health response shape: `data.process` and `data.embeddingRetry.flapping` fields added to all successful response paths including alias and confirmation variants.
- Dist JavaScript mirrors updated to match source TypeScript: `context-server.js`, `retry-manager.js`, `memory-crud-health.js`.

### Fixed

- Substrate flap incidents had no first-line RSS diagnostic. Startup log and `memory_health` process fields close the gap.
- Circuit instability was invisible to operators. The `flapping` boolean and transition count give triage signal without changing circuit behavior.

### Verification

| Check | Result |
|-------|--------|
| Source/dist startup log grep for `[health] startup pid=` | PASS: appears in both `context-server.ts` and `context-server.js` |
| Source/dist process field grep for `processHealth` | PASS: appears in both `memory-crud-health.ts` and `memory-crud-health.js` |
| Source/dist flap field grep for `getCircuitFlapState` | PASS: appears in both retry manager source and dist |
| TypeScript typecheck via `npm run typecheck` | PASS: exit 0 in `.opencode/skills/system-spec-kit/mcp_server` |
| Packet validation via `validate.sh --strict` | PASS: exit 0 for this packet |
| Direct dist handler invocation returning new fields | PASS: local Node call returned `process` and flap fields |
| Live MCP daemon verification | DEFERRED: daemon respawn not available from Codex sandbox |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Emit startup RSS log after `server.connect` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts` | Modified | Track circuit open and cooldown-close transitions. Expose `getCircuitFlapState()` |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modified | Add `data.process` block and `flapping` fields to health responses |
| `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js` | Modified | Mirror startup RSS log |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js` | Modified | Mirror circuit flap telemetry |
| `.opencode/skills/system-spec-kit/mcp_server/dist/handlers/memory-crud-health.js` | Modified | Mirror health response fields |
| `resource-map.md` (NEW) | Created | Document five substrate stability thresholds |

### Follow-Ups

- After the Memory MCP daemon respawns, call `memory_health` through MCP and verify `data.process.pid`, `data.process.rss_mb`, `data.embeddingRetry.flapping` and the `[health] startup` stderr line are all present.
- Flap history is per-process memory. A daemon restart clears `transitionsInLast10Min`, which is appropriate for local stability diagnosis but not for long-term trend analysis. Persistent flap logging could be added in a follow-up observability packet.
- The 1500 MB RSS threshold is documented in `resource-map.md` but not enforced. An automatic termination or alert path was out of scope for this packet.
