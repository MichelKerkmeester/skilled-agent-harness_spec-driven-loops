---
title: "MCP Runtime Improvement Deep Research: 10-Iteration Root Cause Investigation"
description: "10-iteration deep-research loop that investigated eight MCP runtime defect clusters from packets 005 and 006. Produced a canonical synthesis covering phantom fix behavior, CocoIndex mirror duplicates, weak retrieval guardrails, memory_context truncation telemetry, code graph recovery routing, causal edge skew plus intent classifier stability."
trigger_phrases:
  - "mcp runtime improvement research"
  - "RESEARCH-007 synthesis"
  - "memory context truncation root cause"
  - "cocoindex mirror duplicate research"
  - "weak retrieval guardrail investigation"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/002-mcp-runtime-improvement-research` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings`

### Summary

Two prior packets, 005 (memory search runtime bugs catalog) and 006 (cross-AI search intelligence stress-test), surfaced a coherent set of MCP runtime defects across the memory layer, CocoIndex, code graph, causal graph plus intent classifier. Source patches for several P0 defects were claimed as landed, yet live MCP probes continued to show pre-fix behavior, implying phantom fix conditions where compiled output was correct but the running daemon had not been restarted.

A 10-iteration autonomous deep-research loop ran via the `/deep:start-research-loop:auto` skill workflow, dispatching `cli-codex` with gpt-5.5 at reasoning effort high and service tier fast for each iteration. The loop investigated eight defect clusters (Q1-Q8) spanning MCP build verification, CocoIndex alias deduplication, source-role reranking, weak retrieval policy, `memory_context` truncation telemetry, code graph readiness routing, causal edge growth skew plus intent classifier stability.

The canonical synthesis in `research/research.md` (RESEARCH-007) confirmed that the recurring pattern is not one broken function. Multiple MCP contracts surface internal signals that are advisory rather than binding for autonomous callers. The research defined implementable contracts and field-level remediation for all eight clusters, with Q8 noted as lower-evidence due to a later iteration overwrite.

### Added

- None. Research-only phase.

### Changed

- None. Research-only phase.

### Fixed

- None. Research-only phase.

### Verification

- 10 iteration files (`iteration-001.md` through `iteration-010.md`) in `research/001-mcp-runtime-improvement-research-pass/iterations/`.
- `deep-research-state.jsonl` tracking convergence and duplicate-reducer entries across all 10 iterations.
- `deep-research-strategy.md` and `deep-research-config.json` recording executor and iteration-cap configuration.
- `findings-registry.json` containing the initial eight-question registry.
- 10 delta JSONL files in `research/001-mcp-runtime-improvement-research-pass/deltas/` providing machine-readable findings per iteration.
- `research/research.md` canonical synthesis (RESEARCH-007) covering Q1-Q7 at high confidence and Q8 at medium-low confidence with evidence caveats noted.
- Completion recorded at 100 percent in synthesis frontmatter.

### Files Changed

| File | What changed |
|------|--------------|
| `research/research.md` (NEW) | Canonical RESEARCH-007 synthesis. Eight clusters, recommended Phase C packet ordering, handler-level change specs, API contract shapes plus security/citation guardrail guidance. |
| `research/001-mcp-runtime-improvement-research-pass/iterations/iteration-001.md` through `iteration-010.md` (NEW) | Per-iteration investigation narratives for Q1-Q8 plus synthesis passes. |
| `research/001-mcp-runtime-improvement-research-pass/deltas/` (NEW) | Machine-readable per-iteration delta JSONL records. |
| `research/001-mcp-runtime-improvement-research-pass/deep-research-state.jsonl` (NEW) | Externalized state log across all 10 iterations. |
| `research/001-mcp-runtime-improvement-research-pass/findings-registry.json` (NEW) | Initial findings registry for Q1-Q8. |
| `research/001-mcp-runtime-improvement-research-pass/deep-research-strategy.md` (NEW) | Iteration strategy document. |
| `research/001-mcp-runtime-improvement-research-pass/deep-research-config.json` (NEW) | Executor and config settings for the loop. |

### Follow-Ups

- Reconstruct or rerun Q8 (intent classifier consistency) before implementing packet 012. The detailed iteration narrative for Q8 was overwritten by a Q4 pass. Only state-log evidence remains.
- Verify CocoIndex source file locations before implementing packet 009. Iterations cited `cocoindex_code/*.py`, but those files were not confirmed as repo-local tracked sources during synthesis.
- Implement Phase C remediation in the order specified by the synthesis: memory response contracts first (packet 008), CocoIndex dedup and reranking second (packet 009), code graph fallback decision third (packet 010), causal graph relation diagnostics fourth (packet 011) plus intent classifier stability fifth (packet 012).
- Run live MCP tool probes after each Phase C implementation to close the phantom-fix gap identified in Q1. Source diff, targeted tests, `npm run build`, daemon restart plus live probe are all required before a fix can be claimed.
