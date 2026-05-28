> Extracted from `027/research/027-xce-research-pt-01/sub-packet-proposals.md` on 2026-05-28 (code-graph + cocoindex sections).
> Memory-topic sections and raw run-logs remain in 027.

## Proposal 1: `028-code-graph-hld-lld` — Deterministic HLD/LLD Narrative Generation

**Scope summary**: Implement the template-only HLD/LLD schema proposed in RQ1 (F-005). A new `mcp_server/code_graph/lib/code-graph-hld-lld.ts` generates deterministic narrative from existing graph data: `file_role` (from SymbolKind counts), `layer` (from import/export ratios), `summary` (template: "This file defines {count} {kind} symbol(s)..."), `LLD` (per-symbol: signature, docstring, direct_dependencies, complexity_hints). Exposed as a new `code_graph_hld_lld` MCP tool and integrated into the `queryMode: 'omni'` combiner (RQ4 F-024).

**Level estimate**: L2 (~320-370 LOC after pt-02 deterministic-output amendments)
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

**Scope summary**: Implement the trace pipeline proposed in RQ2 (F-012), amended by pt-02. A new `mcp_server/code_graph/lib/code-graph-trace.ts` resolves the file rung from `CodeNode.filePath`, derives module ownership from an explicit file-path policy, uses available CONTAINS/fqName data only for class/method display, and reuses the HLD/LLD classification from packet 028. Exposed as a new `code_graph_trace` MCP tool. Optional memoization cache and `code_packages` remain P1 follow-ups after filePath correctness fixtures pass.

**Level estimate**: L2 (~390-460 LOC after sparse-containment and nested-class fixtures)
**Files**: 1 new (`lib/code-graph-trace.ts` ~150 LOC), 1 new handler (`handlers/trace.ts` ~60 LOC), 1 tool reg edit (`tools/code-graph-tools.ts` +3 LOC), 1 edit (`lib/code-graph-db.ts` +50 LOC memoization, +50 LOC code_packages table)

**Dependencies**:
- Requires: `028-code-graph-hld-lld` (architectural role classification for trace terminal node)
- Requires: existing `code-graph-db.ts` queryEdgesTo, resolveSubjectFilePath (already shipped)
- Feeds into: `030-code-graph-impact-analysis` (trace chains for downstream dependency narrative)

**Risk register**:
| Risk | Severity | Mitigation |
|------|----------|------------|
| CONTAINS edge chain is incomplete for common symbol shapes | High | Use `CodeNode.filePath` as the file source and keep CONTAINS for class/method display only. |
| Deeply nested traces (10+ levels) hit budget | Low | Cap trace depth at maxDepth parameter (default 5). Truncate with `[...]` marker. |
| code_packages table encodes the wrong ownership source | Medium | Keep it P1 and populate only from file paths, package markers, path aliases, import metadata, or explicit config. |

**Out of scope**:
- Downward recursive impact tracing (that's RQ3/030 territory)
- Cross-repository trace (single-repo scope only)

---


## Proposal 3: `030-code-graph-impact-analysis` — Risk-Scored Impact Analysis

**Scope summary**: Implement the deterministic risk-scored impact analysis proposed in RQ3 (F-019), amended by pt-02. A new `mcp_server/code_graph/lib/code-graph-impact-analysis.ts` wraps the existing `detect_changes` handler and enriches its output with deterministic file-level risk signals aggregated from symbol-level edges: fan-in, fan-out, hub centrality, coverage evidence, transitive depth, and edge confidence. Synthesizes per-file risk scores with documented normalizers and heuristic weights until Phase 005 calibration. Exposed as a new `code_graph_impact_analysis` MCP tool. Optional narrative enrichment is disabled by default and requires explicit provider configuration.

**Level estimate**: L2 (~430-570 LOC after pt-02 aggregation, coverage, and enrichment-contract amendments)
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
| Transitive import BFS may be expensive on large graphs | Medium | Cap BFS depth at 3 hops in the new loop with an explicit visited set. |
| Narrative enrichment adds latency, cost, and provider auth risks | Medium | Default provider is none; explicit options carry timeout, call-count, byte-budget, and cache controls. |

**Out of scope**:
- Real-time edge-drift tracking (requires code_edge_snapshots table — future enhancement)
- Change-intent classification beyond simple heuristics (LLM path is opt-in enrichment)

---


## Proposal 5: `032-code-graph-adoption-eval` — Lightweight Evaluation Harness

**Scope summary**: Build the eval harness proposed in RQ7 (F-041) with RQ8 token measurement (F-046), amended by pt-02. A CLI dispatcher spawns OpenCode subprocesses to execute 12-20 refactoring tasks on our own codebase in baseline and after modes. Measures 3 primary metrics + 2 diagnostics + session token usage. Adds provider auth preflight, hardened subprocess lifecycle, discriminated JSONL rows, stale-process retry handling, incomplete-pair reporting, and mocked 12 x 2 dispatcher stress before live runs.

**Level estimate**: L3 (~680-800 LOC after subprocess/auth/result-schema hardening)
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
| Subprocess OpenCode dispatch unreliable at 12-20 task scale | High | Add provider preflight, dev-null stdin, 600s timeout, SIGTERM/SIGKILL escalation, close-event wait, retries, incremental JSONL, and mocked 12 x 2 stress. |
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
Phase 1 — UX/Steering:
  [031-skill-advisor-first-action-mandate] ◄── no hard deps

Phase 2 — Core data contracts:
  [028-code-graph-hld-lld] ◄── no deps

Phase 3 — Graph tools:
  [029-code-graph-trace] ◄── depends on 028 (architectural role labels)
  [030-code-graph-impact-analysis] ◄── deterministic MVP can proceed in parallel;
                                      optional layer/narrative paths depend on 028/032 contracts

Phase 4 — Measurement:
  [032-code-graph-adoption-eval] ◄── depends on 031 treatment condition
                                    requires 028/029/030 tools for meaningful measurement
```

**Total estimated LOC**: ~1,900-2,320 across 5 sub-packets after pt-02 amendments.

**Recommended execution order**: Run 031 first, then 028, then 029 and deterministic 030 in parallel, then 032 last.

