---
title: "Resource Map — Memory search Clusters 4-7 remediation [system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/006-search-clusters-4-7-remediation/resource-map]"
description: "Flat inventory of files this packet touched. Implementation by cli-codex gpt-5.5 high fast on 2026-05-08."
trigger_phrases:
  - "memory clusters 4-7 resource map"
  - "026/003/006 resource map"
importance_tier: "normal"
contextType: "general"
---
# Resource Map — Memory search Clusters 4-7 remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->

## Source code

| Path | Action | Cluster | Notes |
|------|--------|---------|-------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/cocoindex/daemon-probe.ts` | Created | 6 | CocoIndex daemon liveness probe with 30s TTL cache. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-coverage.ts` | Created | 7 | Per-relation coverage tracker for the autonomous backfill job. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-causal-stats.ts` | Modified | 4 | All 6 relation types emitted; health gated on meetsTarget; remediation hint on sub-target. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | Modified | 5 | Conditional degraded hint; memory-specific session-id threaded for dedup. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modified | 6 | `cocoIndex.status` field surfaced. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modified | 5/7 | Trigger + constitutional channels participate in dedup; quality-gap fallback wiring. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts` | Modified | 4 | Causal-stats serializer integration with relation-coverage tracker. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Modified | 6 | Per-token similarity threshold (default 0.45). |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/intent-classifier.ts` | Modified | 7 | Formal 20-paraphrase corpus integration. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts` | Modified | 7 | 3-tier FTS5 → BM25 → Grep fallback on quality:"gap". |
| `.opencode/skills/system-spec-kit/mcp_server/lib/query/query-plan.ts` | Modified | 7 | Quality-gap fallback routing metadata. |

## Tests

| Path | Action | Notes |
|------|--------|-------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/intent-classifier-corpus.vitest.ts` | Created | 20-paraphrase formal stability corpus, ≥80% accuracy assertion. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/causal-stats-output.vitest.ts` | Created | Output-schema test for `memory_causal_stats` (REQ-005, REQ-006, REQ-013). |
| `.opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-threshold.vitest.ts` | Created | Per-token threshold behavior (REQ-008). |
| `.opencode/skills/system-spec-kit/mcp_server/tests/cocoindex-daemon-probe.vitest.ts` | Created | Daemon-probe under reachable/unreachable/degraded conditions. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts` | Modified | Adjacency for the new relation-coverage tracker. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/query-router.vitest.ts` | Modified | Quality-gap fallback regression coverage. |

## Documentation

| Path | Action | Notes |
|------|--------|-------|
| `.opencode/commands/memory/search.md` | Modified | Custom-answer routing documented (REQ-014); naming disambiguation (REQ-017). |

## Spec docs (this packet)

| Path | Action | Notes |
|------|--------|-------|
| `spec.md` | Created | 13 P1/P2 reqs + REQ-012 + REQ-016 with file-path change surfaces. |
| `plan.md` | Created | Cluster 4-7 remediation phases. |
| `tasks.md` | Created | Per-cluster task decomposition. |
| `checklist.md` | Created | CHK-* IDs for every REQ. |
| `implementation-summary.md` | Created | 21-minute cli-codex dispatch summary; 13/13 reqs closed. |
| `description.json` | Created | Packet metadata (status: complete, completion_pct: 100). |
| `graph-metadata.json` | Created | Graph metadata. |
| `changelog.md` | Created | Per-packet changelog (this release). |
| `resource-map.md` | Created | This file. |

## Counts

- **Source files modified**: 7
- **New library modules**: 2 (daemon-probe.ts, relation-coverage.ts)
- **New test files**: 4
- **Test files modified**: 2
- **Doc files modified**: 1 (commands/memory/search.md)
- **Spec docs (this packet)**: 9
- **Total file touches**: 25
- **Estimated LOC**: ~196 source insertions / 19 deletions, plus test files
- **Reqs closed**: 13/13 P1/P2 + REQ-012 + REQ-016 = 15 total
- **Deferred**: 0

## Verification surfaces

- Packet-focused vitest: 121/121 PASS (6 files).
- Strict spec validation: exit 0.
- TypeScript compile: clean.
- Cluster 1-3 regression suite (sibling 005 packet): PASS.
