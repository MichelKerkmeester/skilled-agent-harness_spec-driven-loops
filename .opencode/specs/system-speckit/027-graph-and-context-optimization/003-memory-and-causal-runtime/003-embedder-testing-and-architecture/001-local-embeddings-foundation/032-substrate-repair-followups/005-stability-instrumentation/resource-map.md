---
title: "Resource Map: 005 substrate-stability-instrumentation"
description: "Threshold map for substrate stability diagnostics exposed through Memory MCP health instrumentation."
trigger_phrases:
  - "substrate threshold map"
  - "memory health resource thresholds"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/005-stability-instrumentation"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Documented substrate stability thresholds"
    next_safe_action: "Use these thresholds when triaging memory_health degradation"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/005-stability-instrumentation/resource-map.md"
    session_dedup:
      fingerprint: "sha256:0050050050050050050050050050050050050050050050050050050050050050"
      session_id: "cli-codex-005-stability-instrumentation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "1500 MB kill-switch is documentation-only."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Scope**: Diagnostic metrics and thresholds for packet 005 substrate stability instrumentation.
- **Generated**: 2026-05-14T11:25:36Z
- **Runtime surfaces**: `memory_health`, retry-manager circuit telemetry, daemon startup stderr.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:thresholds -->
## Thresholds

| Metric | Source | Threshold | What it means |
|---|---|---|---|
| process.rss_mb | memory_health.data.process.rss_mb | 1500 MB kill-switch | Daemon memory exceeded comfort zone; investigate OOM/leak |
| circuit.flapping | memory_health.data.embeddingRetry.flapping | > 2 transitions / 10 min | Worker unstable; reduce SPECKIT_RETRY_BATCH_SIZE |
| queue depth | memory_health.data.embeddingRetry.queueDepth | < 100 healthy, > 500 critical | Backlog accumulating |
| failed count | memory_health.data.embeddingRetry.failed | < 10 healthy, > 50 elevated | Run repair-failed-embeddings.mjs |
| vec/total ratio | data.consistency.vecRowsTotal / rowsTotal | < 5% mismatch healthy | FTS/vec consistency drift |
<!-- /ANCHOR:thresholds -->

---

<!-- ANCHOR:paths -->
## Paths

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Updated | OK | Startup RSS log |
| `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts` | Updated | OK | Circuit transition telemetry |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Updated | OK | Process and flap health fields |
| `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js` | Updated | OK | Dist startup RSS mirror |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js` | Updated | OK | Dist circuit telemetry mirror |
| `.opencode/skills/system-spec-kit/mcp_server/dist/handlers/memory-crud-health.js` | Updated | OK | Dist health response mirror |
<!-- /ANCHOR:paths -->
