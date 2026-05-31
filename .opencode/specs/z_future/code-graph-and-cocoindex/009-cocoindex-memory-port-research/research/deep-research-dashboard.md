---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: cocoindex-main → spec_kit_memory MCP port (causal graph, memory database, automatic indexing, embedding pipeline) + MCP tool-namespace shortening from mcp__mk_spec_memory__* to mk_*
- Started: 2026-05-13T07:30:00Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: 027-013-cocoindex-port-2026-05-13
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | ground-truth-baseline | - | 0.86 | 0 | insight |
| undefined | k1-1-memoization-dag-transfer-assessment | - | 0.76 | 0 | insight |
| undefined | k1-2-causal-edge-lifecycle-port | - | 0.62 | 0 | insight |
| undefined | k1-3-statediff-reconciliation-port | - | 0.74 | 0 | insight |
| undefined | k1-4-chunked-embeddings-stable-identity | - | 0.68 | 0 | insight |
| undefined | k1-5-auto-causal-edge-derivation | - | 0.72 | 0 | insight |
| undefined | k1-6-nonport-confirm-and-k2-1-prefix-construction | - | 0.78 | 0 | insight |
| undefined | k2-2-regex-constraints-and-k2-3-prefix-redundancy | - | 0.62 | 0 | insight |
| undefined | k2-5-final-recommendation-and-synthesis-prep | - | 0.22 | 0 | synthesis |
| undefined | final-synthesis-research-md-emission | - | 0.09 | 0 | insight |

- iterationsCompleted: 10
- keyFindings: 17
- openQuestions: 0
- resolvedQuestions: 11

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 11/11
- [x] **K1.1**: Does cocoindex-main's memoization + dependency-DAG pattern (from `python/cocoindex/_internal/memo_fingerprint.py` + `rust/core/src/state/db_schema.rs` + `rust/core/src/state/stable_path.rs`) transfer cleanly to TypeScript+SQLite, or does it require a Rust-equivalent runtime / heed-style KV store?
- [x] **K1.2**: Can the `ChildExistence` + `ChildComponentTombstone` lifecycle model from `rust/core/src/state/stable_path.rs` be ported into the flat `causal_edges` table at `lib/search/vector-index-schema.ts` to give causal edges automatic lifecycle/cleanup?
- [x] **K1.3**: Can `python/cocoindex/connectorkits/statediff.py`'s `(desired, prior) → {insert, upsert, replace, delete}` model replace our ad-hoc post-mutation hooks (alias conflict detection, divergence reconciliation)?
- [x] **K1.4**: Should spec-doc embeddings be chunked (by frontmatter / H2 sections) with per-chunk fingerprint so editing one section of a long spec doesn't re-embed the whole thing? (Reference: `examples/code_embedding/`.)
- [x] **K1.5**: Can causal edges be auto-derived from spec-doc relationships (supersedes, caused-by, cited-by) using cocoindex's `conversation_to_knowledge` multi-phase extraction pattern (LLM extract → embed-dedup → canonical → graph)? How do we validate LLM-extracted edges to avoid graph pollution?
- [x] **K1.6**: Confirm query intelligence is a non-port axis — cocoindex is ingest-focused with retrieval delegated to backends. Document the negative finding.
- [x] **K2.1**: Where does the `mcp__` prefix originate (Claude Code runtime alone, or cross-runtime MCP convention)? How is the server-name segment registered across OpenCode, Codex, Gemini, Claude Code?
- [x] **K2.2**: Does `mk_*` survive the tightest known regex constraint (alphanumeric + underscore + hyphen only) plus known provider rejections (DeepSeek/Moonshot `:`, opencode-skills `@`)?
- [x] **K2.3**: After `spec_kit_memory → mk_memory`, full tool names remain redundant (`mcp__mk_memory__memory_context`). Should tools also drop `memory_*`? Or shorten server to bare `mk`?
- [x] **K2.4**: What is the total callsite count for `mcp__mk_spec_memory__*` across CLAUDE.md + all SKILL.md files + hook scripts + docs + `tool-schemas.ts`? Migration cost ceiling.
- [x] **K2.5**: What's the final naming recommendation, given chars-saved × migration-churn × runtime-risk trade-off?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.62 -> 0.22 -> 0.09
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.09
- coverageBySources: {}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
