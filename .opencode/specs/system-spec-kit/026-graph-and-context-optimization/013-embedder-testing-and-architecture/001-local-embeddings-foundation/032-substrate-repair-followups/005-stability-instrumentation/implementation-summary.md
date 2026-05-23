---
title: "Implementation Summary: 005 substrate-stability-instrumentation"
description: "Memory MCP health now exposes process RSS and circuit flapping telemetry, with startup RSS logging and threshold documentation for future substrate incidents."
trigger_phrases:
  - "substrate stability instrumentation summary"
  - "memory health rss fields outcome"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/005-stability-instrumentation"
    last_updated_at: "2026-05-14T11:25:36Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed instrumentation and docs"
    next_safe_action: "After daemon respawn, call memory_health and compare fields to sample"
    blockers:
      - "Live daemon respawn unavailable from sandbox"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/005-stability-instrumentation/resource-map.md"
    session_dedup:
      fingerprint: "sha256:8888888888888888888888888888888888888888888888888888888888888888"
      session_id: "cli-codex-005-stability-instrumentation"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Source and dist both need patching for this packet."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/005-stability-instrumentation` |
| **Completed** | 2026-05-14 |
| **Level** | 2 |
| **Runtime Verification** | Deferred until Memory MCP daemon respawn |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Future substrate flaps now have the missing first-line diagnostics: daemon RSS at startup, live RSS in `memory_health`, and a boolean that says whether the embedding provider circuit has been flapping recently. The patch does not change retry thresholds, retry scheduling, embedding generation, search, or save behavior.

### Process RSS Visibility

`context-server.ts` logs a startup line immediately after the MCP transport connects:

```text
[health] startup pid=<pid> rss=<rssMb>MB uptime=0s
```

`memory-crud-health.ts` now includes `data.process.pid`, `data.process.rss_mb`, and `data.process.uptime_seconds` in successful health responses.

### Circuit Flap Telemetry

`retry-manager.ts` tracks circuit open/close transition timestamps in a 10-minute in-memory window. `getCircuitFlapState()` returns `flapping: true` when more than two transitions happened in that window, plus `transitionsInLast10Min`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Emit startup RSS log after `server.connect` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts` | Modified | Track circuit transitions and expose flap state |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modified | Add process fields and flap fields to health data |
| `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js` | Modified | Mirror startup RSS log |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js` | Modified | Mirror circuit flap telemetry |
| `.opencode/skills/system-spec-kit/mcp_server/dist/handlers/memory-crud-health.js` | Modified | Mirror health response fields |
| `resource-map.md` | Created | Document the five requested diagnostic thresholds |
| `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Created | Level 2 packet documentation |
| `spec.md`, `graph-metadata.json` | Modified | Mark packet complete |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation stays on the observability side of the boundary. It reads process RSS through Node, stores transition timestamps in module memory, and merges those values into existing health response objects.

### Sample `memory_health` Output

Constructed from the patched response shape:

```json
{
  "tool": "memory_health",
  "data": {
    "status": "healthy",
    "databaseConnected": true,
    "memoryCount": 3420,
    "process": {
      "pid": 12345,
      "rss_mb": 487,
      "uptime_seconds": 31
    },
    "embeddingRetry": {
      "pending": 0,
      "failed": 0,
      "retryAttempts": 12,
      "circuitBreakerOpen": false,
      "lastRun": "2026-05-14T11:25:36.000Z",
      "queueDepth": 0,
      "flapping": false,
      "transitionsInLast10Min": 0
    }
  }
}
```

### Deferred Live Verification Path

The dist handler was invoked directly from Node and returned the new fields:

```json
{
  "process": {
    "pid": 32144,
    "rss_mb": 85,
    "uptime_seconds": 0
  },
  "embeddingRetry": {
    "pending": 0,
    "failed": 0,
    "retryAttempts": 0,
    "circuitBreakerOpen": false,
    "lastRun": null,
    "queueDepth": 0,
    "flapping": false,
    "transitionsInLast10Min": 0
  }
}
```

After the Memory MCP daemon respawns, call `memory_health` through MCP and verify:

```text
data.process.pid is a number
data.process.rss_mb is a number
data.process.uptime_seconds is a number
data.embeddingRetry.flapping is a boolean
data.embeddingRetry.transitionsInLast10Min is a number
stderr includes: [health] startup pid=<pid> rss=<n>MB uptime=0s
```

I could not perform the daemon restart and MCP tool call from this sandbox, so this remains a runtime follow-up rather than a claimed live pass.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use module-local transition timestamps | Flap state only needs current-daemon diagnostics; persistence would change the behavior surface. |
| Count only open and cooldown-close transitions | Provider failures while already open should not inflate flap count. |
| Include `process` in all successful health response shapes | Divergent alias and confirmation responses are still `memory_health` responses and benefit from the same diagnostics. |
| Keep the 1.5 GB kill-switch as documentation only | The packet asked for visibility, not enforcement. |
| Patch dist directly | The packet specified dist mirror edits because build output may be unreliable in this wave. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Source/dist startup log grep | PASS: `[health] startup pid=` appears in both context server files |
| Source/dist process field grep | PASS: `processHealth` and `process: processHealth` appear in both health handlers |
| Source/dist flap field grep | PASS: `getCircuitFlapState`, `flapping`, and `transitionsInLast10Min` appear in both retry managers and health handlers |
| TypeScript typecheck | PASS: `npm run typecheck` in `.opencode/skills/system-spec-kit/mcp_server` |
| Packet validation | PASS: `validate.sh --strict` for this packet |
| Direct dist handler verification | PASS: local Node invocation returned `process` and flap fields |
| Live MCP daemon verification | DEFERRED: daemon respawn and MCP `memory_health` call not available from sandbox |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live MCP response not captured here.** The patch is typechecked and mirrored, but the actual daemon process needs to respawn before `memory_health` can show the new fields.
2. **Flap history is per-process memory.** A daemon restart clears `transitionsInLast10Min`, which is correct for local stability diagnosis but not long-term observability.
3. **RSS kill-switch is documented, not enforced.** `1500 MB` is visible in `resource-map.md`; no automatic termination was added.
<!-- /ANCHOR:limitations -->
