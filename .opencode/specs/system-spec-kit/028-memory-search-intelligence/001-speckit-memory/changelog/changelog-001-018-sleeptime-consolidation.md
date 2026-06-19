---
title: "Changelog: Async Sleep-Time Consolidation (LT-bg-sleeptime-agent + LT-llm-transcript-chunking, governed) [001-speckit-memory/018-sleeptime-consolidation]"
description: "Chronological changelog for the Async Sleep-Time Consolidation (LT-bg-sleeptime-agent + LT-llm-transcript-chunking, governed) phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/018-sleeptime-consolidation` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

Nothing is built yet. When this packet runs, the Memory MCP will gain a background, cadence-gated reorganization pass: after a foreground turn, a sleep-time agent reorganizes recent transcripts into archival memory through a bounded tool-chain, while the synchronous on-save reconsolidation every existing caller depends on stays exactly as it is today. The headline constraint shapes the whole build — this pass mutates archival memory off-turn, the highest-tail-risk move in the Memory subsystem — so it is built default-off, shadow/dry-run by default, and the very first thing built is the governor, not the agent.

### Added

- No new additions recorded.

### Changed

- Nothing is built yet. When this packet runs, the Memory MCP will gain a background, cadence-gated reorganization pass: after a foreground turn, a sleep-time agent reorganizes recent transcripts into archival memory through a bounded tool-chain, while the synchronous on-save reconsolidation every existing caller depends on stays exactly as it is today. The headline constraint shapes the whole build — this pass mutates archival memory off-turn, the highest-tail-risk move in the Memory subsystem — so it is built default-off, shadow/dry-run by default, and the very first thing built is the governor, not the agent.

### Fixed

- No fixes recorded.

### Verification

- Governor bounds (step-cap, cost-ceiling, forced-terminal) - PENDING
- Flag-off off-turn isolation (sync byte-identical; zero off-turn archival mutation) - PENDING
- Idempotency against 010's clock host + cursor (replay re-derives) - PENDING
- Shadow telemetry (would-archive ranges, cadence) - PENDING
- validate.sh --strict on this packet (docs) - PASS (planning docs)

### Files Changed

| File | Action | What changed |
|---|---|---|
| `mcp_server/lib/cognitive/sleeptime-governor.ts` | Created (planned) | Bounded tool-rule DAG: step-cap, cost-ceiling, terminal stop |
| `mcp_server/lib/cognitive/sleeptime-agent.ts` | Created (planned) | Off-turn reorganization agent; shadow/dry-run default |
| `mcp_server/handlers/save/reconsolidation-bridge.ts` | Modified (planned) | Additive off-turn dispatch point, distinct from the sync path |
| `mcp_server/handlers/chunking-orchestrator.ts` | Modified (planned) | Additive LLM-selected-range archival path |
| `mcp_server/lib/search/search-flags.ts` | Modified (planned) | Default-off SPECKIT_SLEEPTIME_CONSOLIDATION + shadow sub-flag |
| `mcp_server/__tests__/` | Created (planned) | Governor bounds + off-turn isolation + cursor-idempotency + shadow harness |

### Follow-Ups

- CHK-001 Requirements documented in spec.md (REQ-001..008)
- CHK-002 Technical approach defined in plan.md (governor-first, default-off, shadow-gated, prove-first)
- CHK-003 Synchronous-only seam confirmed from research (reconsolidation-bridge.ts on-save; no background agent; 028/007 iter-20)
- CHK-004 Sibling 010 dependency confirmed (C-G1 clock host + C4-C cursor + LT-turn-cadence-trigger gate land in 010)
- CHK-010 node --check + tsc pass; no build errors
- CHK-011 No console errors or warnings introduced
