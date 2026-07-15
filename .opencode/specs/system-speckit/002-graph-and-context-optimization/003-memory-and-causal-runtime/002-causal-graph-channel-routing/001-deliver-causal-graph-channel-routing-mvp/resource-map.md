---
title: "Resource Map: 012 Causal Graph Channel Routing Utilization"
description: "Path catalog for packet 012: 7 mcp_server artifacts (4 source + 3 test), 12 packet docs, 3 system-spec-kit knowledge surface entries."
trigger_phrases:
  - "012 resource map"
  - "012 path catalog"
  - "012 files touched"
  - "graph channel routing paths"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing"
    last_updated_at: "2026-05-08T14:30:00Z"
    last_updated_by: "implementer"
    recent_action: "Author resource-map.md after packet closure"
    next_safe_action: "Author feature-catalog and playbook entries per plan; re-validate packet"
    completion_pct: 100
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 22
- **By category**: Skills=10, Specs=12
- **Missing on disk**: 0
- **Scope**: All files created, updated, or analyzed during packet 009-causal-graph-channel-routing — covers mcp_server source/tests, packet docs, the packet changelog, and the new system-spec-kit knowledge-surface entries authored as part of this packet's closure.
- **Generated**: 2026-05-08T14:30:00+00:00

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts` | Updated | OK | Added `shouldPreserveGraph`, `isGraphChannelPreservationEnabled`, override branch in `routeQuery`, telemetry recording |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts` | Created | OK | Cached high-degree title/trigger lookup with 60s TTL |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/routing-telemetry.ts` | Created | OK | 200-decision rolling ring; surfaces `graphChannelInvocationRate` |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Updated | OK | Adds `data.routing` block to memory_health response |
| `.opencode/skills/system-spec-kit/mcp_server/tests/query-router.vitest.ts` | Updated | OK | Added 15 tests across 012-T1..T4 (unit, integration, telemetry, latency) |
| `.opencode/skills/system-spec-kit/mcp_server/tests/entity-density.vitest.ts` | Created | OK | 12 tests across 012-ED-1..ED-3 (lookup, cold-start, cache) |
| `.opencode/skills/system-spec-kit/mcp_server/tests/routing-telemetry-stress.vitest.ts` | Created | OK | 11 stress tests across 012-S1..S4 (ring overflow, latency, cache invalidation, flag-off path) |
| `.opencode/skills/system-spec-kit/feature_catalog/query-intelligence/12-graph-channel-preservation.md` | Created | OK | New feature-catalog entry documenting the override + entity-density gate + flag |
| `.opencode/skills/system-spec-kit/feature_catalog/discovery/03-health-diagnostics-memoryhealth.md` | Updated | OK | Append `data.routing` block reality + add routing-telemetry.ts to source files |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/pipeline-architecture/272-routing-telemetry-and-graph-channel-invocation.md` | Created | OK | Manual-test scenario validating graphChannelInvocationRate surfaces |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/spec.md` | Created | OK | Level 2 specification |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/plan.md` | Created | OK | Implementation plan |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/tasks.md` | Created | OK | Task list (Phase 1-3, all closed) |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/checklist.md` | Created | OK | Verification checklist (all CHK-001..CHK-053 marked complete) |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/implementation-summary.md` | Created | OK | Completion narrative + verification table |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/description.json` | Updated | OK | Refreshed post-implementation (level=2, keywords, description) |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/graph-metadata.json` | Updated | OK | Status=implemented; trigger_phrases + key_files + parent_id populated |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/scratch/baseline.md` | Created | OK | Synthetic pre-change baseline rationale |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/scratch/post-change.md` | Created | OK | Test-derived rate evidence + live-smoke procedure |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/001-deliver-causal-graph-channel-routing-mvp/scratch/live-smoke-results.md` | Created | OK | Live MCP smoke evidence for graph-channel routing and degree parity |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/001-deliver-causal-graph-channel-routing-mvp/scratch/stress-test-results.md` | Created | OK | Stress coverage evidence for routing telemetry, cache invalidation, latency, and flag-off path |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/001-deliver-causal-graph-channel-routing-mvp/changelog.md` | Created | OK | Packet changelog |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

- All paths are relative to repo root.
- Categories with zero entries are omitted; remaining numbers preserved (Skills=10, Specs=12) per resource-map template author rule.
- This is a single-packet (non-phase-parent) resource map; no aggregate-vs-per-child decision applies.
- Size: ~70 lines content — well under the ~250-line budget.
<!-- /ANCHOR:author-instructions -->
