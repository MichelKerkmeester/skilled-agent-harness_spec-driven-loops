---
title: "Changelog: Agentic Tool-Loop Recall Strategy (CG-agentic-tool-loop) [001-speckit-memory/016-iterative-agentic-recall]"
description: "Chronological changelog for the Agentic Tool-Loop Recall Strategy (CG-agentic-tool-loop) phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/016-iterative-agentic-recall` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

Nothing is built yet. When this packet runs, you will be able to opt a complex memory_context request into an agentic, reason-act-observe retrieval loop that iteratively calls the existing memory tools and refines its own query, while every existing deterministic caller stays exactly as it is today. The headline constraint shapes the whole build: the loop puts an LLM into a synchronous, deterministic, pure better-sqlite3 retrieval hot path that has no loop or cost governor anywhere, so the first thing built is the governor, not the strategy.

### Added

- No new additions recorded.

### Changed

- Nothing is built yet. When this packet runs, you will be able to opt a complex memory_context request into an agentic, reason-act-observe retrieval loop that iteratively calls the existing memory tools and refines its own query, while every existing deterministic caller stays exactly as it is today. The headline constraint shapes the whole build: the loop puts an LLM into a synchronous, deterministic, pure better-sqlite3 retrieval hot path that has no loop or cost governor anywhere, so the first thing built is the governor, not the strategy.

### Fixed

- No fixes recorded.

### Verification

- Governor bounds (step-cap, cost-ceiling, forced-final) - PENDING
- Flag-off byte-identical isolation - PENDING
- Deterministic core (hybrid-search.ts, stage2-fusion) untouched - PENDING
- Latency / cost / determinism benchmark - PENDING
- validate.sh --strict on this packet (docs) - PASS (planning docs)

### Files Changed

| File | Action | What changed |
|---|---|---|
| `mcp_server/lib/search/agentic-loop-governor.ts` | Created (planned) | Bounded controller: step-cap, cost-ceiling, deterministic stop |
| `mcp_server/handlers/memory-context.ts` | Modified (planned) | One additive case 'agentic' in executeStrategy (:1292-1311) |
| `mcp_server/lib/search/search-flags.ts` | Modified (planned) | Default-off SPECKIT_AGENTIC_RECALL flag |
| `mcp_server/__tests__/` | Created (planned) | Governor bound tests + strategy-isolation test + determinism benchmark |

### Follow-Ups

- CHK-001 Requirements documented in spec.md (REQ-001..006)
- CHK-002 Technical approach defined in plan.md (governor-first, default-off, benchmark-before-promote)
- CHK-003 Static-router seam confirmed unchanged from research (memory-context.ts:1292-1311)
- CHK-010 node --check + tsc pass; no build errors
- CHK-011 No console errors or warnings introduced
- CHK-012 Governor returns typed results (final | forced-final | aborted-partial); error handling implemented
