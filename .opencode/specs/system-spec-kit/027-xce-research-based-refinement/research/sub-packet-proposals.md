---
title: "XCE Research — Sub-Packet Proposals"
packet: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement"
totalProposals: 5
created: "2026-05-08T18:00:00Z"
---

# Sub-Packet Proposals

Five candidate sub-packets covering the 4 ADOPT and 6 ADAPT verdicts from the adoption matrix. Proposals are ordered by implementation priority: structural capability first (packets 028-030), UX/steering next (031), measurement last (032).

---

## Proposal 1: `028-code-graph-hld-lld` — Deterministic HLD/LLD Narrative Generation

**Scope summary**: Implement the template-only HLD/LLD schema proposed in RQ1 (F-005). A new `mcp_server/code_graph/lib/code-graph-hld-lld.ts` generates deterministic narrative from existing graph data: `file_role` (from SymbolKind counts), `layer` (from import/export ratios), `summary` (template: "This file defines {count} {kind} symbol(s)..."), `LLD` (per-symbol: signature, docstring, direct_dependencies, complexity_hints). Exposed as a new `code_graph_hld_lld` MCP tool and integrated into the `queryMode: 'omni'` combiner (RQ4 F-024).

**Level estimate**: L2 (~250 LOC total)
**Files**: 1 new (`lib/code-graph-hld-lld.ts` ~200 LOC), 1 new handler (`handlers/hld-lld.ts` ~50 LOC), 1 tool reg edit (`tools/code-graph-tools.ts` +2 LOC), 1 edit (`lib/code-graph-context.ts` +15 LOC for omni integration)

**Dependencies**:
- Requires: existing `code-graph-db.ts` (SQLite query APIs — already shipped)
- Requires: existing `indexer-types.ts` (SymbolKind, EdgeType, DEFAULT_EDGE_WEIGHTS — already shipped)
- Feeds into: `029-code-graph-trace` (architectural role labels), `030-code-graph-impact-analysis` (layer-based criticality weighting)

**Risk register**:
| Risk | Severity | Mitigation |
|------|----------|------------|
| Template output is too generic for complex monorepos | Low | Template is a baseline. LLM enrichment (Alternative C) is additive, not a replacement. |
| Schema changes in code_nodes break HLD derivation | Low | All input fields (kind, signature, docstring, fq_name) are already stable in production schema. Unit tests lock them. |
| Heuristic layer classification (import/export ratios) misclassifies edge cases | Low | Classification is advice, not critical path. Refine heuristics with test data. |

**Out of scope**:
- LLM-generated HLD/LLD narrative (deferred to Phase 2 — Alternative B)
- Changes to structural-indexer.ts or tree-sitter-parser.ts (generation only, no parsing changes)

---

## Proposal 2: `029-code-graph-trace` — Symbol-to-Architecture Trace Tool

**Scope summary**: Implement the trace pipeline proposed in RQ2 (F-012). A new `mcp_server/code_graph/lib/code-graph-trace.ts` walks symbol → class → module → architectural role using existing CONTAINS edges (queryEdgesTo at code-graph-db.ts:972-987), resolveSubjectFilePath (code-graph-db.ts:989-1015), and the HLD/LLD classification from packet 028. Exposed as a new `code_graph_trace` MCP tool. Includes optional recursive memoization cache (~50 LOC SQLite `trace_cache` table) and optional code_packages table (~50 LOC) for formalized module hierarchy.

**Level estimate**: L2 (~310 LOC total)
**Files**: 1 new (`lib/code-graph-trace.ts` ~150 LOC), 1 new handler (`handlers/trace.ts` ~60 LOC), 1 tool reg edit (`tools/code-graph-tools.ts` +3 LOC), 1 edit (`lib/code-graph-db.ts` +50 LOC memoization, +50 LOC code_packages table)

**Dependencies**:
- Requires: `028-code-graph-hld-lld` (architectural role classification for trace terminal node)
- Requires: existing `code-graph-db.ts` queryEdgesTo, resolveSubjectFilePath (already shipped)
- Feeds into: `030-code-graph-impact-analysis` (trace chains for downstream dependency narrative)

**Risk register**:
| Risk | Severity | Mitigation |
|------|----------|------------|
| CONTAINS edge chain is incomplete for some languages | Medium | fq_name prefix splitting (dot-delimited) serves as fallback when CONTAINS edges end early. |
| Deeply nested traces (10+ levels) hit budget | Low | Cap trace depth at maxDepth parameter (default 5). Truncate with `[...]` marker. |
| code_packages table DDL migration breaks existing indices | Low | New table is additive — zero impact on existing code_files/code_nodes/code_edges. Rollback-safe. |

**Out of scope**:
- Downward recursive impact tracing (that's RQ3/030 territory)
- Cross-repository trace (single-repo scope only)

---

## Proposal 3: `030-code-graph-impact-analysis` — Risk-Scored Impact Analysis

**Scope summary**: Implement the deterministic risk-scored impact analysis proposed in RQ3 (F-019). A new `mcp_server/code_graph/lib/code-graph-impact-analysis.ts` wraps the existing `detect_changes` handler and enriches its output with 5 deterministic risk signals: fan-in (queryEdgesTo), fan-out (queryEdgesFrom), hub centrality (queryFileDegrees at code-graph-db.ts:1039-1083), test-coverage gap (TESTED_BY edge check), edge confidence (DEFAULT_EDGE_WEIGHTS + metadata JSON). Synthesizes per-file risk scores: `normalize(fanIn) * 0.35 + normalize(hubDegree) * 0.25 + untestedFlag * 0.25 + normalized(transitiveDepth) * 0.15`. Exposed as a new `code_graph_impact_analysis` MCP tool with optional `enrichWithLLM: true` flag for semantic risk narrative.

**Level estimate**: L2 (~350 LOC total)
**Files**: 1 new (`lib/code-graph-impact-analysis.ts` ~200 LOC), 1 new handler (`handlers/impact-analysis.ts` ~80 LOC), 1 tool reg edit (`tools/code-graph-tools.ts` +3 LOC), 1 edit (`handlers/detect-changes.ts` +50 LOC for risk signal passthrough), optional 1 new (`lib/code-graph-llm-risk-enrich.ts` ~80 LOC LLM adapter)

**Dependencies**:
- Requires: existing `handlers/detect-changes.ts` (affectedSymbols[] output)
- Requires: existing `code-graph-db.ts` query APIs (queryEdgesFrom/To, queryFileDegrees, queryFileImportDependents)
- Optional: `028-code-graph-hld-lld` (for layer-based criticality weighting in LLM enrichment mode)
- Optional: `029-code-graph-trace` (for trace-based downstream narrative)

**Risk register**:
| Risk | Severity | Mitigation |
|------|----------|------------|
| Risk score formula is unvalidated — weights are design intuition, not empirical | Medium | Document as "heuristic baseline." Weights are tunable constants. Sub-packet 032 eval harness validates against labeled tasks. |
| Transitive import BFS may be expensive on large graphs | Medium | Cap BFS depth at 3 hops (default). Use `queryFileImportDependents` with LIMIT. |
| LLM enrichment adds latency + cost | Low | LLM is opt-in via `enrichWithLLM: true` flag. Deterministic baseline always available. |

**Out of scope**:
- Real-time edge-drift tracking (requires code_edge_snapshots table — future enhancement)
- Change-intent classification beyond simple heuristics (LLM path is opt-in enrichment)

---

## Proposal 4: `031-skill-advisor-first-action-mandate` — Strengthened Advisor Brief Rendering

**Scope summary**: Implement the render-layer change proposed in RQ6 (F-036). Strengthen the `skill_advisor/lib/render.ts` brief from suggestion ("use ${label}") to mandate ("MUST invoke ${label} FIRST (${score}/${uncertainty}) — ${action_hint}"). Add `FIRST_ACTION_HINT` constant map covering all 16 skills with per-skill action directives. Modify two `capText` calls at lines 149-152 (ambiguous case) and 155-158 (normal case). No scorer changes — directive strength change only in render layer.

**Level estimate**: L1 (~30 LOC total)
**Files**: 1 edit (`skill_advisor/lib/render.ts` +30 LOC)

**Dependencies**:
- Requires: existing `render.ts` (renderAdvisorBrief, capText, token caps — already shipped)
- Requires: existing `skill-advisor-brief.ts` (integration confirms render.ts is sole prompt-boundary gate)
- Feeds into: `032-eval-harness` (measurement of briefing change impact on token reduction)

**Risk register**:
| Risk | Severity | Mitigation |
|------|----------|------------|
| "MUST invoke" is too strong for low-confidence scenarios | Low | Advisor only fires when confidence ≥ 0.8 (render.ts:124-133). At that threshold, "MUST" is justified. |
| First-action hint for CLI skills is confusing ("MUST invoke cli-claude-code FIRST") | Low | Confidence ≥ 0.8 ensures external CLI skills only surface when the prompt genuinely matches their domain. |
| Brief grows from ~60-80 chars to ~90-180 chars, hitting DEFAULT_TOKEN_CAP | Low | Both old and new formats fit within the 80-token default cap (320 chars). capText() truncation safety net remains. |

**Out of scope**:
- Scorer surgery (scorer/ dir changes) — out of scope per spec.md:129
- Dynamic per-intent first-action selection — current design uses static per-skill hints (dynamic intent→skill routing is the scorer's job)

---

## Proposal 5: `032-code-graph-adoption-eval` — Lightweight Evaluation Harness

**Scope summary**: Build the eval harness proposed in RQ7 (F-041) with RQ8 token measurement (F-046). A CLI dispatcher spawns OpenCode subprocesses to execute 12-20 refactoring tasks on our own codebase in baseline (current brief) and after (MUST invoke brief) modes. Measures 3 primary metrics (file-reads-avoided, context-accuracy via computeHitRate, answer-completeness) + 2 diagnostics (token waste ratio, first-action adherence). Includes RQ8 measurement instrumentation (~80 LOC to query session-analytics-db.ts for total_tokens post-session-stop).

**Level estimate**: L2 (~500 LOC total)
**Files**: 1 new CLI entry (`scripts/dist/eval/code-graph-adoption-eval.js` ~200 LOC), 1 new metric library (`mcp_server/lib/eval/token-measurement.ts` ~25 LOC), 1 new task set (`tasks/labeled-tasks.jsonl` ~20 lines JSONL), 1 new report generator (~50 LOC), 1 new test harness (~100 LOC), 1 stress config entry (+10 LOC)

**Dependencies**:
- Requires: `031-skill-advisor-first-action-mandate` (the treatment condition's independent variable)
- Requires: `028/029/030` packets (the tools being evaluated)
- Requires: existing `session-analytics-db.ts` (total_tokens queries)
- Requires: existing `eval-metrics.ts` (12 reusable metric functions)
- Requires: stable `cli-opencode` skill for subprocess programmatic invocation

**Risk register**:
| Risk | Severity | Mitigation |
|------|----------|------------|
| Subprocess OpenCode dispatch unreliable at 12-20 task scale | High | Add retry logic (2 retries per task), 10-min timeout per task, incremental result saving (JSONL per task, not batch). |
| Labeled task set quality insufficient for valid measurement | Medium | Tasks are versioned in the packet. Manual review of first 5 task results before scaling to 20. Iterate on task quality. |
| 5-15% token reduction is below statistical significance at N=10 | Medium | Power analysis: run N=20 tasks minimum per condition. If p > 0.05, report as "inconclusive — effect too small to measure at this scale." |
| OpenCode subprocess MCP config switching is fragile | Medium | Use environment variable to toggle advisor mode (avoid file writes). Document MCP config injection in harness README. |

**Out of scope**:
- SWE-bench Verified evaluation (Docker, Python PRs, swe-bench-eval pipeline)
- Cross-model comparison (same model, baseline vs after)
- Full agent-session analytics dashboard (post-hoc query only, no real-time dashboard)

---

## Implementation Dependency Graph

```
Phase 1 — Structural Capabilities (parallelizable):
  [028-code-graph-hld-lld] ◄── no deps
  [029-code-graph-trace]  ◄── depends on 028 (architectural role labels)
  [030-code-graph-impact-analysis] ◄── optional dep on 028 (layer criticality)

Phase 2 — UX/Steering (sequential after Phase 1):
  [031-skill-advisor-first-action-mandate] ◄── no hard deps, but tested with Phase 1 tools

Phase 3 — Measurement (sequential after Phase 2):
  [032-code-graph-adoption-eval] ◄── depends on 031 (treatment condition)
                                    requires 028/029/030 (tools being measured)
```

**Total estimated LOC**: ~1,440 across 5 sub-packets (Phase 1: ~910 LOC, Phase 2: ~30 LOC, Phase 3: ~500 LOC)

**Recommended execution order**: Phase 1 packets (028, 029, 030) can be implemented in parallel if staffed. Phase 2 (031) is a 30-minute single-file change. Phase 3 (032) requires Phase 2 complete before baseline/after measurement.
