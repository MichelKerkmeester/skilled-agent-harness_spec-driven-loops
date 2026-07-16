# Iteration 001 - Correctness and Spec-Code Drift

## State Summary

- Iteration: 1 of 1.
- Focus dimension: correctness, with spec-vs-code drift cross-checks.
- Scope: search/retrieval subsystem under `.opencode/skills/system-spec-kit/mcp_server/` plus shared RRF fusion code reached by that subsystem.
- Stop condition after this pass: `maxIterationsReached`.

## Review Actions

| Action | Evidence |
| --- | --- |
| Loaded deep-review workflow contract and state/output references. | `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md`, quick reference, loop protocol, state references. |
| Read the scope target. | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md:1` |
| Traced lexical retrieval from FTS/BM25 collection through keyword fusion to RRF score accumulation. | Hybrid search and shared RRF fusion sources. |
| Traced evidence-gap production from Stage 4 through handler metadata into formatter recovery policy. | Stage 4, memory search handler, formatter, and formatter test. |

## Findings

### F-A9-001 - P1 - SQLite lexical routing double-counts FTS5 hits as both FTS and BM25

The default SQLite lexical route makes `bm25Search()` return `ftsSearch()` rows under `source: 'bm25'` when `shouldUseSqliteLexicalEngine(db)` is true [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:436]. In enhanced hybrid collection, the FTS and BM25 arrays are concatenated into `keywordResults` without canonical-ID deduplication [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1497], then that duplicate-containing array is pushed as the single `keyword` fusion list [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1578]. The shared RRF fuser sums every occurrence inside a list into the existing candidate score [SOURCE: .opencode/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts:308].

Impact: when SQLite FTS5 is available, lexical hits can receive roughly double keyword RRF contribution relative to the configured `keywordWeight`, biasing hybrid results toward lexical matches and undermining the adaptive fusion weights. This is not just duplicated provenance; the duplicate entries add score before ranking.

Suggested remediation: deduplicate `keywordFusionResults` by canonical ID before passing it to adaptive/RRF fusion, preserving combined `sources` metadata, or avoid adding a BM25 list when the BM25 implementation is a direct FTS5 alias.

### F-A9-002 - P1 - Evidence-gap detection is not forwarded to recovery policy under the formatter contract

Stage 4 sets `evidenceGapDetected` and annotates rows with `evidenceGap` when TRM detects a gap [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:272]. The handler forwards only `evidenceGapWarning` into `extraData` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1294], but the formatter builds the recovery context from `safeExtraData?.evidenceGap` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:1069]. Existing formatter coverage also uses `evidenceGap: true` to trigger partial recovery [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:249].

Impact: a live `memory_search` response can contain an evidence-gap warning while the recovery/response policy treats the result set as ordinary high-quality output if confidence is otherwise high. That can leave `citationPolicy` as `cite_results` instead of forcing broaden-or-ask behavior for incomplete evidence.

Suggested remediation: pass `evidenceGap: pipelineResult.metadata.stage4.evidenceGapDetected` to `formatSearchResults()` via `extraData`, or update the formatter to derive the boolean from `evidenceGapWarning`/row annotations consistently.

## Negative Findings

- Confidence calibration PAV pooling was sampled and no monotonicity issue was recorded.
- `includeArchived` was not recorded as a finding because handler tests explicitly assert it is API-only compatibility after cleanup.

## Severity Summary

| Severity | Count |
| --- | ---: |
| P0 | 0 |
| P1 | 2 |
| P2 | 0 |

## Convergence Check

- New findings ratio: 1.00.
- Legal stop: max iteration cap reached, not convergence.
- Dimension coverage remains incomplete.

Review verdict: CONDITIONAL
