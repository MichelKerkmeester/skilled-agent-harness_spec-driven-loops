---
title: "Tasks — 027/003 code-graph impact analysis"
description: "Per-file tasks for the impact analysis phase."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 027/003 code-graph impact analysis

<!-- SPECKIT_LEVEL: 2 -->

## P0
| # | Task | File | Done |
|---|------|------|------|
| T1 | `computeRiskSignals(filePath, db)` returning 5 signals | `mcp_server/code_graph/lib/code-graph-impact-analysis.ts` (new, ~80 LOC) | [ ] |
| T2 | `applyRiskFormula(signals, weights)` with tunable RISK_WEIGHTS | same | [ ] |
| T3 | BFS transitive depth, capped at 3 | same | [ ] |
| T4 | `analyzeImpact(changedFiles, db, opts)` orchestrator | same (~50 LOC) | [ ] |
| T5 | Handler with zod schema + readiness gate | `mcp_server/code_graph/handlers/impact-analysis.ts` (new, ~80 LOC) | [ ] |
| T6 | Register `code_graph_impact_analysis` MCP tool | `mcp_server/code_graph/tools/code-graph-tools.ts` (edit, +3 LOC) | [ ] |
| T7 | `detect_changes` opt-in risk passthrough | `mcp_server/code_graph/handlers/detect-changes.ts` (edit, +50 LOC) | [ ] |

## P0 — pt-02 amendments (NEW)

| # | Task | File | Done |
|---|------|------|------|
| **T-003A** | File-node aggregation helper (`getNodesForFile`) + tests for multi-symbol files (REQ-010) | `code-graph-impact-analysis.ts` + tests | [ ] |
| **T-003B** | Deterministic normalizers (`normalizeFanIn`, `normalizeHubDegree`, `normalizeTransitiveDepth`) + snapshot tests (REQ-009) | same + tests | [ ] |
| **T-003C** | TESTED_BY fixture: `src/foo.ts`, `src/foo.test.ts`, AND unsupported `__tests__/foo.test.ts` or integration layout — assert direction is incoming on production symbol (REQ-011, REQ-012) | tests | [ ] |
| **T-003D** | BFS depth/cycle fixture proving 3-hop cap with explicit visited set (REQ-013) | tests | [ ] |
| **T-003E** | Replace boolean `enrichWithLLM` flag with enrichment options schema `{enabled, provider, model?, timeoutMs?, maxCallsPerSession?, maxInputBytes?, cacheKey?}` + skipped-provider output test (REQ-014) | handler + types + tests | [ ] |
| **T-003F** | Redaction/budget/timeout contract tests if CLI enrichment remains in scope (REQ-014) | tests | [ ] |
| **REMOVED** | ~~Call cli-opencode by default when `enrichWithLLM` is true~~ — DEFAULT IS NOW `provider: "none"` (per amended REQ-007) | n/a | n/a |

## P1
| # | Task | File | Done |
|---|------|------|------|
| T8 | LLM enrichment adapter (default `provider: "none"`, CLI provider opt-in via REQ-014 options shape) | `mcp_server/code_graph/lib/code-graph-llm-risk-enrich.ts` (new, ~80 LOC) | [ ] |
| T9 | Wire enrichment options shape in handler (NOT boolean flag) | `handlers/impact-analysis.ts` | [ ] |
| **T-003G** | Layer fallback: emit `{source: "unavailable", value: null}` if Phase 001 layer data missing (REQ-015) | `handlers/impact-analysis.ts` | [ ] |

## P0 — Tests + Verification
| # | Task | File | Done |
|---|------|------|------|
| T10 | Unit tests per signal | `mcp_server/tests/code-graph-impact-analysis.vitest.ts` (new) | [ ] |
| T11 | Unit test formula application | same | [ ] |
| T12 | Integration test full analyze run | same | [ ] |
| T13 | `--coverage` ≥80% | terminal | [ ] |
| T14 | `npm run check` green | terminal | [ ] |
| T15 | `implementation-summary.md` with file:line evidence | new | [ ] |
