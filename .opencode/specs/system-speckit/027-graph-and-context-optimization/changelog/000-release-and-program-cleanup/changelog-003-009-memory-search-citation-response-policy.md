---
title: "Changelog: memory_search response policy and citation refusal contract"
description: "Added hard responsePolicy and citationPolicy fields to memory_search responses so weak retrieval triggers a binding claim-authority refusal contract instead of advisory metadata. Eliminates the 006/I2 hallucination path where model callers invented canonical file paths despite receiving a weak-quality signal."
trigger_phrases:
  - "memory_search citation policy"
  - "responsePolicy noCanonicalPathClaims"
  - "weak retrieval refusal contract"
  - "do_not_cite_results"
  - "RecoveryAction ask_disambiguation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/009-memory-search-citation-response-policy` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings`

### Summary

The `memory_search` tool returned weak-retrieval results inside a standard success envelope with no binding claim-authority signal. When the 006/I2 cli-opencode query received `requestQuality:"weak"` and `recovery.recommendedAction:"ask_user"` with an empty `suggestedQueries` list, the model treated the success envelope as license to cite and filled the gap with invented file paths and spec folder references.

The 007 research isolated the root cause: weak retrieval was advisory, not contractual. This packet added `responsePolicy` (with `requiredAction`, `noCanonicalPathClaims`, `citationRequiredForPaths` plus `safeResponse`) and `citationPolicy` (`cite_results` or `do_not_cite_results`) to the response envelope. Both fields are derived server-side by `deriveResponsePolicy()` and `deriveCitationPolicy()` in the formatter. The `RecoveryAction` enum was extended with three new values. A non-empty `suggestedQueries` guarantee was also added so `ask_user` actions always carry actionable broadening suggestions.

48 vitest tests pass across two test files. Dist markers confirm the new fields compiled to the live `dist` output.

### Added

- `deriveResponsePolicy(requestQuality, recovery)` function in `search-results.ts` that emits a hard refusal block when retrieval is non-authoritative
- `deriveCitationPolicy(requestQuality)` function returning `cite_results` or `do_not_cite_results` for all responses
- `citationPolicy` field on every `memory_search` response data envelope
- `responsePolicy` block (with `requiredAction`, `noCanonicalPathClaims`, `citationRequiredForPaths` plus `safeResponse`) on weak and partial and no-result responses
- `ask_disambiguation`, `refuse_without_evidence`, `broaden_or_ask` values added to the `RecoveryAction` type union in `recovery-payload.ts`
- Safe broadening suggestion synthesis for `ask_user` recovery actions so `suggestedQueries` is never empty

### Changed

- `RecoveryAction` union in `recovery-payload.ts`: from 4 values to 7 values including the three new refusal-contract actions
- `memory_search` formatter: weak-quality and no-results paths now emit `responsePolicy` in addition to the existing recovery metadata
- `ask_user` recovery construction: empty `suggestedQueries` is now repaired by synthesizing two broadening suggestions from the original query tokens

### Fixed

- Weak-retrieval responses carried no binding signal to prevent canonical-path hallucination. The new `responsePolicy.noCanonicalPathClaims:true` plus `safeResponse` string closes that gap.
- `ask_user` recovery could ship with `suggestedQueries:[]`, leaving the model with no actionable path. The synthesis guarantee ensures at least two suggestions are present.

### Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/d5-recovery-payload.vitest.ts tests/empty-result-recovery.vitest.ts` | PASS: 2 files. 48 tests passed |
| `npm run build` (tsc --build) | PASS: completed successfully |
| `grep -l responsePolicy dist/formatters/search-results.js` | PASS: matched dist file |
| `grep -l citationPolicy dist/formatters/search-results.js` | PASS: matched dist file |
| `grep -l ask_disambiguation dist/lib/search/recovery-payload.js` | PASS: matched dist file |
| `validate.sh --strict` on packet folder | PASS: 0 errors. 0 warnings |
| Live `memory_search` probe (good-quality query) | PASS: `data.citationPolicy:"cite_results"`. `requestQuality.label:"good"`. Top hit similarity 84.07. `evidenceGapWarning` still surfaces per 007/Q4 contract. |
| 006/I2 weak-quality live repro | DEFERRED: requires original 006/I2 query returning `requestQuality:"weak"`. Covered by unit tests. Recommend running during item 2.2 sweep re-run. |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts` | Added `deriveResponsePolicy` and `deriveCitationPolicy`. Both are wired into the formatter response path. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/recovery-payload.ts` | Extended `RecoveryAction` union with 3 new values. Added safe suggestion synthesis for `ask_user` with empty queries. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts` | Added enum coverage and `ask_user` suggestion guard assertions. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts` | Added `responsePolicy` and `citationPolicy` contract cases. |

### Follow-Ups

- Run the 006/I2 weak-quality live repro after the next MCP daemon restart to confirm the `do_not_cite_results` branch fires in production.
- Add caller-side enforcement in CLI runtimes to honor `noCanonicalPathClaims` and emit `safeResponse` instead of hallucinating paths.
- Consider a server-side `WARN` log line when `responsePolicy` fires, to support analytics on how often weak-quality retrieval triggers the refusal contract.
