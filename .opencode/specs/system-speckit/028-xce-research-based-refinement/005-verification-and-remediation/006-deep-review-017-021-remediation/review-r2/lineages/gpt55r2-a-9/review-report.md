# Deep Review Report - Search/Retrieval Scope A - gpt55r2-a-9

## Executive Summary

Verdict: CONDITIONAL.

The one-iteration fan-out review found 2 active P1 findings and no P0 findings. The loop stopped because `config.maxIterations=1`, not because the requested scope reached convergence. Release readiness remains `in-progress`.

| Severity | Active Count |
| --- | ---: |
| P0 | 0 |
| P1 | 2 |
| P2 | 0 |

## Planning Trigger

Plan remediation because active P1 findings affect ranking correctness and recovery/citation policy. Neither finding is a style-only issue.

## Active Finding Registry

| ID | Severity | Category | Finding | Evidence |
| --- | --- | --- | --- | --- |
| F-A9-001 | P1 | retrieval-ranking | SQLite lexical routing double-counts FTS5 hits as both FTS and BM25 before keyword fusion. | `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:436`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1497`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1578`, `.opencode/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts:308` |
| F-A9-002 | P1 | recovery-policy | Stage 4 evidence-gap detection is not forwarded under the field name the formatter uses for recovery policy. | `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:272`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1294`, `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:1069`, `.opencode/skills/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:249` |

## Remediation Workstreams

| Workstream | Findings | Suggested Direction |
| --- | --- | --- |
| Lexical fusion correctness | F-A9-001 | Deduplicate `keywordFusionResults` by canonical ID before fusion, or suppress the BM25 alias lane when it delegates to FTS5. Preserve provenance without adding duplicate RRF score. |
| Evidence-gap response policy | F-A9-002 | Pass `evidenceGap: pipelineResult.metadata.stage4.evidenceGapDetected` into formatter `extraData`, or update formatter policy to consume `evidenceGapWarning`/row annotations consistently. Add handler-level regression coverage. |

## Spec Seed

- Retrieval fusion must not add multiple same-source RRF contributions for the same memory ID when two lexical labels are aliases of the same SQLite FTS5 result set.
- Evidence-gap detection must force the same recovery/citation policy in live `memory_search` responses as formatter unit tests expect when `evidenceGap: true` is supplied.

## Plan Seed

1. Add a failing test for SQLite FTS5 lexical aliasing where identical FTS/BM25 hits do not produce double keyword RRF contribution.
2. Deduplicate or suppress alias duplicates in `hybrid-search.ts` before `adaptiveFuse()` / `fuseResultsMulti()`.
3. Add a handler-level test where Stage 4 returns `evidenceGapDetected: true` and verify `memory_search` emits recovery plus `do_not_cite_results` policy.
4. Forward the evidence-gap boolean through handler extraData or make the formatter derive it from existing warning/row metadata.

## Traceability Status

| Protocol | Status | Notes |
| --- | --- | --- |
| spec_code | covered | Findings cite actual shipped source lines. |
| checklist_evidence | not_applicable | Review-scope folder has only `spec.md`. |
| feature_catalog_code | partial | Search/retrieval seams inspected, but full feature catalog coverage was not possible in one iteration. |
| playbook_capability | not_applicable | No playbook target in scope. |

## Deferred Items

- Security dimension was not fully reviewed before maxIterations=1.
- Concurrency/cancellation dimension was not fully reviewed before maxIterations=1.
- Performance dimension was sampled through lexical duplicate scoring but not exhaustively reviewed.
- Trigger embedding backfill and vector read-path resilience remain follow-up surfaces.

## Audit Appendix

Stop reason: `maxIterationsReached`.

Iteration count: 1.

Dimension coverage: correctness and spec-vs-code drift covered; security, performance, concurrency/cancellation, and maintainability remain uncovered.

Evidence discipline: each active finding cites source file lines opened during the review.

Memory/tool note: `memory_match_triggers` rejected the caller-provided fan-out session id as not server-managed, then succeeded when called without that id. Code review proceeded with direct `Glob`, `Grep`, and `Read` as allowed by the scope instructions.

Validation note: artifact validation was performed after synthesis by parsing JSON/JSONL and checking the iteration final verdict line.
