---
title: "002/001: Touchpoint Research: CocoIndex and Rerank-Sidecar Deprecation Discovery"
description: "12-iteration deep-research run that mapped every live touchpoint of mcp-coco-index, system-rerank-sidecar plus the code-graph to CocoIndex coupling into a classified resource map plus a dependency-ordered 7-phase deprecation DAG."
trigger_phrases:
  - "cocoindex deprecation touchpoint research"
  - "rerank sidecar consumers map"
  - "code-graph cocoindex decouple research"
  - "deprecation resource map research"
  - "ccc bridge touchpoints"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index/001-touchpoint-research` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index`

### Summary

Deprecating `mcp-coco-index` and `system-rerank-sidecar` touches a large, dispersed surface spanning skills, commands, agents, hooks, four runtime configs plus READMEs, with two high-risk couplings: the rerank sidecar into `mk-spec-memory` and the `system-code-graph` into CocoIndex via the `ccc` bridge. Acting without an exhaustive, classified touchpoint map risked breaking memory reranking, semantic-search routing or the structural code graph.

A 12-iteration deep-research run resolved all seven research questions. Iterations 1-10 ran via `cli-devin`/`swe-1.6` for breadth and classified inventory. Iterations 11-12 ran via `cli-opencode`/`deepseek-v4` for adversarial cross-model validation. The deepseek closers caught three critical gaps the swe-1.6 passes missed: a `doctor _routes.yaml` zombie window, 27 YAML assets hardcoding the coco MCP tool (including four runtime-breaking loop executors), plus a false claim of no port-8765 probes.

The run produced a classified resource map at the 014 parent root (`resource-map.md`) covering roughly 270 live touchpoints with mutation classes (DELETE, EDIT-decouple, EDIT-remove-ref, LEAVE-historical), plus a dependency-ordered 7-phase deprecation DAG (002-008). Two key decisions were recorded. D1 accepts the loss of opt-in cross-encoder reranking in memory (default path unaffected, positional fallback). D2 adopts a HYBRID search policy (Grep plus code-graph structural) as the post-coco semantic-search replacement.

### Added

None. Research-only phase.

### Changed

None. Research-only phase.

### Fixed

None. Research-only phase.

### Verification

| Check | Result |
|-------|--------|
| 12/12 iterations completed | PASS. Append-only state log (`research/deep-research-state.jsonl`) shows all 12 entries with no gaps. |
| Final verdict | COMPLETE+CORRECT. Verdict recorded in `research/iterations/iteration-012.md`. |
| All 7 RQs met with cited evidence | PASS. Acceptance check at iter-010, confirmed at iter-012. |
| Classified resource map at 014 root | PASS. `resource-map.md` covers all live touchpoints with mutation classes. |
| Dependency-ordered deprecation DAG | PASS. 7-phase DAG (002-008) scaffolded with decouple-before-delete ordering. |
| Strict packet validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` |

### Files Changed

| File | Action |
|------|--------|
| `research/research.md` (NEW) | Created. Narrative synthesis of all 12 iterations including convergence report and phase DAG. |
| `research/resource-map.md` (NEW) | Created. Per-file classified touchpoint map, promoted to parent `002-deprecate-coco-index/resource-map.md`. |
| `research/deep-research-state.jsonl` (NEW) | Created. Append-only state log recording all 12 iteration entries. |
| `research/deep-research-strategy.md` (NEW) | Created. Research charter with 7 research questions and scope constraints. |
| `research/findings-registry.json` (NEW) | Created. Deduplicated findings registry from all 12 iterations. |
| `research/iterations/iteration-001.md` to `iteration-012.md` (NEW) | Created. Per-iteration finding artifacts (12 files total). |

### Follow-Ups

- Confirm D1 (accept memory cross-encoder loss) and D2 (HYBRID semantic-search policy) with the operator before executing any deprecation phase.
- Scaffold and execute deprecation phases 002-008 in dependency order, each gated by its verify command and a pre-phase git commit as a rollback point.
