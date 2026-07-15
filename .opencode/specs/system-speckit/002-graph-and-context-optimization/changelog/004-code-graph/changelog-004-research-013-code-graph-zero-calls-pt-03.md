---
title: "Code Graph Phase 004/Research/013-Pt-03: Zero-Calls Root-Cause Investigation"
description: "3-iteration targeted root-cause investigation. A reported zero-edge result for handleMemoryContext was traced to resolveSubject() picking a re-export wrapper over the real implementation due to deterministic sort-by-path bias. The real function has 28 outgoing CALLS edges."
trigger_phrases:
  - "004 research 013 pt 03"
  - "zero calls investigation"
  - "handleMemoryContext zero calls"
  - "resolveSubject ambiguity"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-22

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph` (Research-only)
> Parent packet: `002-graph-and-context-optimization/004-code-graph`

### Summary

A user reported zero outgoing CALLS edges for `handleMemoryContext` in the code graph. A primary handler should call many downstream functions. If the graph really showed zero calls, something was broken in either the parser or the indexer.

A targeted 3-iteration deep-research investigation found that the zero result was a query bias issue, not an indexer defect. The root cause:

1. `resolveSubject()` in `code_graph_query` resolves a symbol name to a graph node by sorting candidates on `(file_path, start_line, symbol_id)` and taking the first match.
2. TypeScript index modules (`handlers/index.ts`) often re-export symbols via a terse wrapper pattern. These wrappers are classified as the same symbol kind as the real implementation.
3. Because `index.ts` sorts before `handlers/memory-context.ts` alphabetically, the re-export wrapper was always picked over the real implementation. The wrapper has zero outgoing CALLS edges.
4. The real `handleMemoryContext` in `handlers/memory-context.ts` has 28 outgoing CALLS edges in the live graph.

Four findings were produced: F-001 (P0) the zero-edge result, F-002 (P1) the ambiguity contract in `code_graph_query` being under-specified, F-003 (P1) the existing regression tests preserving the wrong behavior by expecting the first candidate deterministically, and F-004 (P2) the systemic nature across all `handle*` symbols due to index-module wrapper patterns.

### Added

- None. Research-only phase.

### Changed

- None. Research-only phase.

### Fixed

- None. Research-only phase.

### Verification

- 3 iteration files (iteration-001.md through iteration-003.md) in the research directory.
- `findings-registry.json` with 4 entries (1 P0, 2 P1, 1 P2).
- `deep-research-state.jsonl` externalized state across all 3 iterations.
- `research.md` (181 lines) synthesis document.
- Live graph verification confirmed the real `handleMemoryContext` has 28 CALLS edges.

### Files Changed

| File | What changed |
|------|--------------|
| `research/003-ambiguous-symbol-resolution-research/research.md` (NEW) | Synthesis document |
| `research/003-ambiguous-symbol-resolution-research/iterations/iteration-01.md` through `iteration-03.md` (NEW) | Per-iteration pass narratives |
| `research/003-ambiguous-symbol-resolution-research/deltas/` (NEW) | Per-iteration delta records |
| `research/003-ambiguous-symbol-resolution-research/findings-registry.json` (NEW) | Structured findings registry |
| `research/003-ambiguous-symbol-resolution-research/deep-research-*.json|md` (NEW) | Config, state, dashboard, strategy |

### Follow-Ups

- **F-002 resolveSubject ambiguity.** The ambiguity contract in `code_graph_query` is under-specified for relationship operations. A follow-up should define resolution precedence rules.
- **F-003 regression test correctness.** Existing tests expect the wrong behavior (first candidate deterministically). Tests should be updated to expect the implementation symbol, not the wrapper.
- **F-004 systemic wrapper pattern.** All `handle*` symbols in index modules share the same wrapper ambiguity. A bulk audit should identify and rank affected symbols.
