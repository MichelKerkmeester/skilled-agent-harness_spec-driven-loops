# Deep Review Report - Search/Retrieval Fan-out Lineage gpt55r2-a-1

## Executive Summary
Verdict: **CONDITIONAL**

The review stopped at `maxIterations=1` with two active P1 findings and no P0 findings. The active issues affect retrieval correctness and read-path performance: scoped summary retrieval can drop valid in-scope results, and default sqlite lexical routing can duplicate FTS work through the BM25 lane and overweight keyword evidence.

- Active P0: 0
- Active P1: 2
- Active P2: 0
- hasAdvisories: false
- Stop reason: maxIterationsReached
- Release readiness state: in-progress

## Planning Trigger
Route to remediation planning. The defects are not release blockers by P0 criteria, but both P1 findings affect retrieval quality in paths the scope explicitly asks to audit: scope-then-limit behavior, ranking numeric correctness, and synchronous read-path work.

## Active Finding Registry
| ID | Severity | Dimension | Title | Evidence | Status |
|----|----------|-----------|-------|----------|--------|
| F001 | P1 | correctness/performance | SQLite lexical engine runs FTS twice and double-counts keyword evidence as BM25 | `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:435-453`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1401-1418`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1497-1584`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:1479-1491` | active |
| F002 | P1 | correctness | Summary embedding channel limits globally before applying scope and only exact-matches spec folders | `.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:167-192`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:139-147`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1309-1343` | active |

## Remediation Workstreams
| Workstream | Findings | Recommended sequence |
|------------|----------|----------------------|
| Scoped summary retrieval | F002 | Add scope-aware summary query input, join `memory_index` before cosine ranking or over-fetch within scope, and preserve descendant-folder semantics. |
| Lexical lane deduplication | F001 | In auto/sqlite lexical mode, either suppress the BM25 lane when FTS already ran or ensure BM25 uses an independent backend before it contributes to fusion. |
| Regression tests | F001, F002 | Add tests for parent-folder scoped summary hits and sqlite lexical auto-mode not duplicating keyword contribution. |

## Spec Seed
- Require every retrieval channel that accepts `specFolder` to apply scope before top-K limiting, including descendant folders via `specFolder` and `specFolder/%` semantics.
- Require sqlite lexical auto-mode to avoid treating FTS-backed BM25 as an independent evidence channel.

## Plan Seed
1. Update `querySummaryEmbeddings()` to accept scope options and perform scope filtering before cosine top-K selection.
2. Replace `applyFolderFilter()` exact-match semantics with the same descendant semantics used by vector/FTS scoped queries, or remove the post-filter once summary search scopes in SQL.
3. Change `collectAndFuseHybridResults()` so the BM25 lane is skipped or deduplicated when `bm25Search()` is backed by `ftsSearch()`.
4. Add focused tests for scoped parent folder summary retrieval and for default `auto` BM25 engine with `memory_fts` available.

## Traceability Status
| Protocol | Status | Gate | Notes |
|----------|--------|------|-------|
| spec_code | partial | hard | Review scope resolved to search/retrieval code; two real shipped-code defects found. |
| checklist_evidence | partial | hard | Scope folder has no checklist.md; no completion marks to validate. |
| feature_catalog_code | partial | advisory | Search/retrieval feature behavior partially audited in one iteration. |
| playbook_capability | partial | advisory | No playbook scenario execution in this capped lineage. |

## Deferred Items
- Security-specific review of governance filtering beyond the summary channel remains incomplete due to the one-iteration cap.
- Maintainability review of `stage3-rerank.ts`, `stage4-filter.ts`, handler formatting, and recovery payload wiring remains incomplete.
- No runtime tests were executed; this lineage is a code audit with direct source evidence only.

## Audit Appendix
| Iteration | Focus | New P0 | New P1 | New P2 | Verdict |
|-----------|-------|--------|--------|--------|---------|
| 1 | Search/retrieval correctness and performance | 0 | 2 | 0 | CONDITIONAL |

Replay validation:
- JSONL parsed with one iteration and one synthesis event.
- Active findings reconcile to registry counts: P0=0, P1=2, P2=0.
- Final verdict follows contract: active P1 findings and no P0 findings -> CONDITIONAL.
- Stop reason follows instruction: maxIterationsReached at 1 iteration.

Evidence density:
- F001 has four source citations.
- F002 has four source citations.

Scope notes:
- Primary reviewed files are in `.opencode/skills/system-spec-kit/mcp_server/lib/search/` and `handlers/` scope, with one shared fusion implementation read as supporting evidence for F001 impact.
