# Structural-Contract Rewrite Coverage Diff

**Pre-rewrite**: `0dba8febf^` (`ff91ddfe4`) - code-graph location - 534 LOC - 16 tests
**Post-rewrite**: `0dba8febf` - spec-kit location - 290 LOC - 16 tests - 16/16 PASS
**Reviewer**: cli-codex gpt-5.5 high fast

## Summary

- 1 test preserved with the same title and equivalent semantics.
- 6 tests renamed with equivalent semantics.
- 1 test replaced with an equivalent boundary-mocked variant.
- 8 tests removed as cross-skill code-graph internals.
- 0 tests removed for vocabulary drift.
- 0 tests removed as duplicates.
- 0 tests removed as genuine structural-contract coverage loss.
- 8 tests added for provenance, marker timestamp fallback, highlight ordering, and status vocabulary.

## Coverage Matrix

| Test Case # | Pre-Rewrite Title | Post-Rewrite Title | Status | Assertions Pre | Assertions Post | Rationale |
|---|---|---|---|---|---|---|
| 1 | returns ready status with highlights when graph is fresh | returns ready status with highlights when graph freshness is fresh | RENAMED | `status=ready`; summary includes `42 files`, `1200 nodes`, `(fresh)`; highlights exist, length <= 5, include `function: 500`; recommended action includes `code_graph_query`; `sourceSurface=auto-prime`; provenance producer `session_snapshot`; trust state `live`. | `status=ready`; summary includes `42 files`, `1200 nodes`, `800 edges`, `(fresh)`; highlights include `function: 500`; recommended action includes `code_graph_query`; `sourceSurface=auto-prime`; provenance producer `session_snapshot`; trust state `live`. | Same ready-contract semantics. Post-rewrite adds edge-count summary coverage and relies on mocked boundary marker reads instead of importing code-graph DB/ensure-ready internals. |
| 2 | returns stale status when graph scan is old | returns stale status when graph freshness is stale | REPLACED | Mocked `getStats()` with an old `lastScanTimestamp` and `getGraphFreshness()='stale'`; asserted `status=stale`, stale summary, bounded inline refresh guidance, `sourceSurface=session_bootstrap`, and stale trust state. | Mocked boundary freshness directly as `stale`; asserted `status=stale`, `(stale)` summary, bounded inline refresh guidance, `sourceSurface=session_bootstrap`, and stale trust state. | Equivalent stale-contract scenario after the boundary rewrite. The old shape coupled this spec-kit unit to code-graph freshness internals; the new shape validates the same emitted contract through the boundary seam. |
| 3 | returns stale highlights and freshness marker for populated stale graphs | returns stale highlights for populated stale graphs | RENAMED | `status=stale`; summary includes `(stale)`; highlights defined, non-empty, and contain `function: 9`. | `status=stale`; summary includes `(stale)`; highlights exactly equal `['function: 9', 'class: 4', 'interface: 2']`. | Same populated-stale highlight scenario. Post-rewrite tightens the assertion from partial containment to exact ordered output. |
| 4 | returns missing status when graph is empty | maps empty graph freshness to missing status | RENAMED | Empty graph stats and freshness `empty`; asserted `status=missing`, no structural context summary, no highlights, bootstrap guidance, `sourceSurface=session_resume`, and absent trust state. | Boundary freshness `empty` with no stats; asserted `status=missing`, no structural context summary, no highlights, bootstrap guidance, `sourceSurface=session_resume`, and absent trust state. | Same missing-contract behavior, with boundary marker mocking replacing cross-skill DB and freshness mocks. |
| 5 | avoids self-referential guidance when session_bootstrap is already the current surface | uses scan guidance instead of self-referential bootstrap guidance during session_bootstrap | RENAMED | Empty graph during `session_bootstrap`; asserted `status=missing`, recommended action contains `code_graph_scan`, and recommended action does not contain `Call session_bootstrap first`. | Same assertions: `status=missing`, `code_graph_scan` guidance, and no self-referential bootstrap guidance. | Same guard against recursive guidance. |
| 6 | returns missing status when graph DB throws | maps error graph freshness to missing status | RENAMED | DB/freshness mocks throw; asserted `status=missing` and `sourceSurface=session_health`. | Boundary freshness `error` with no stats; asserted `status=missing`, no structural context summary, `sourceSurface=session_health`, and absent trust state. | Same error-to-missing behavior. Post-rewrite adds summary and trust-state assertions while avoiding a DB throw path inside the spec-kit unit. |
| 7 | preserves sourceSurface parameter for each surface | preserves sourceSurface in the contract and provenance for every supported surface | RENAMED | For `auto-prime`, `session_bootstrap`, `session_resume`, and `session_health`, asserted `contract.sourceSurface` equals the input surface. | For the same surfaces, asserted `contract.sourceSurface` and `contract.provenance.sourceSurface` both equal the input surface. | Same source-surface preservation with stronger provenance coverage. |
| 8 | keeps the structural contract within the documented hard ceiling | keeps the structural contract within the documented hard ceiling | PRESERVED | With 12 long node-kind names, estimated JSON token budget for summary/highlights/recommended action is <= 500. | Same token-budget assertion, plus `contract.highlights.length <= 5`. | Same hard-ceiling coverage. Post-rewrite adds the explicit highlight-count cap that the old test only implied through the budget check. |
| 9 | returns all post-exclude files when skipFreshFiles=false | N/A | REMOVED | Code-graph `indexFiles()` with `skipFreshFiles=false` indexed `one.ts`, `two.ts`, and `three.ts` despite stale checks returning false. | N/A | Cross-skill scenario. This exercises `system-code-graph/mcp_server/lib/structural-indexer.ts`, not the spec-kit structural bootstrap contract. Boundary architecture supersedes this concern inside the spec-kit unit. Related code-graph scan/indexer coverage exists, but no exact one-for-one duplicate was found. |
| 10 | skips fresh files when skipFreshFiles=true | N/A | REMOVED | Code-graph `indexFiles()` with `skipFreshFiles=true` indexed only `stale.ts` when the DB stale check marked the other files fresh. | N/A | Cross-skill scenario. This is structural-indexer stale-file filtering, not spec-kit contract construction. Related scan-handler assertions still verify `skipFreshFiles:true` is passed for incremental scans in `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts:340` and `:980`. |
| 11 | preserves stale-only behavior when option omitted | N/A | REMOVED | Code-graph `indexFiles()` default options indexed only `stale.ts`, proving the omitted option behaves like stale-only filtering. | N/A | Cross-skill scenario. This default-option behavior belongs in code-graph indexer coverage if still required; the spec-kit boundary unit cannot import the indexer directly without reintroducing the dependency arc. |
| 12 | drops nodes whose symbol_id collides with previously-processed file | N/A | REMOVED | Mocked `generateSymbolId()` collision; asserted the first file keeps the shared node, the second file drops it, and only one shared node remains. | N/A | Cross-skill scenario. This tests code-graph structural-indexer deduplication. Related DB-layer duplicate protection is covered in `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-db.vitest.ts:57`, but this exact indexer-layer pruning path is not a spec-kit responsibility. |
| 13 | preserves all nodes when no cross-file collision exists | N/A | REMOVED | Indexed two files without collisions; asserted both files retain nodes and every emitted `symbolId` is unique. | N/A | Cross-skill scenario. This is code-graph indexer correctness and is outside the spec-kit structural-contract unit after the boundary mock. |
| 14 | logs dropped count | N/A | REMOVED | With a forced symbol collision, asserted `console.error` receives `[structural-indexer] dropped 1 cross-file duplicate symbol nodes`. | N/A | Cross-skill scenario. This checks code-graph indexer diagnostics, not spec-kit session snapshot behavior. |
| 15 | passes skipFreshFiles=false for caller-requested full scans | N/A | REMOVED | Imported `handleCodeGraphScan()`; asserted `indexFiles()` receives `{ skipFreshFiles: false }`, payload status is `ok`, files scanned/indexed are `3`, `fullScanRequested=true`, and `effectiveIncremental=false`. | N/A | Cross-skill scenario. It requires the code-graph scan handler and was the dependency arc the rewrite removed. Related full-scan handling exists in `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts`, but the exact `skipFreshFiles:false` assertion should live there if still required. |
| 16 | is idempotent for repeated caller-requested full scans with the same indexer results | N/A | REMOVED | Imported `handleCodeGraphScan()` twice with `incremental:false`; asserted the indexer runs twice and both payloads keep identical scanned/indexed counts, `fullScanRequested=true`, and `effectiveIncremental=false`. | N/A | Cross-skill scenario. This is code-graph scan-handler idempotence, not structural bootstrap contract behavior. |
| 17 | N/A | records session snapshot provenance source refs | NEW | N/A | Provenance matches producer `session_snapshot`, `sourceSurface=session_health`, `trustState=live`, `lastUpdated=2026-04-23T00:00:00.000Z`, `sourceRefs=['code-graph-db','session-snapshot']`; generated timestamp parses. | Added provenance detail coverage that was absent from the pre-rewrite file. |
| 18 | N/A | populates lastUpdated from marker stats for ready contracts | NEW | N/A | With fresh marker stats timestamp `2026-05-01T12:00:00.000Z`, asserted `status=ready` and provenance `lastUpdated` equals that timestamp. | Added marker timestamp propagation for ready contracts. |
| 19 | N/A | populates lastUpdated from marker stats for stale contracts | NEW | N/A | With stale marker stats timestamp `2026-04-01T12:00:00.000Z`, asserted `status=stale` and provenance `lastUpdated` equals that timestamp. | Added marker timestamp propagation for stale contracts. |
| 20 | N/A | uses null lastUpdated when reachable marker stats have no timestamp | NEW | N/A | Fresh marker stats with `lastScanTimestamp=null`; asserted `status=ready` and provenance `lastUpdated=null`. | Added null timestamp semantics. |
| 21 | N/A | falls back gracefully when reachable marker stats are absent | NEW | N/A | Fresh boundary state with no stats; asserted `status=ready`, generic ready summary, no highlights, and provenance `lastUpdated=null`. | Added absent-stats fallback coverage for the mocked boundary. |
| 22 | N/A | falls back gracefully when reachable marker stats throw | NEW | N/A | Boundary freshness `stale` while stats read throws; asserted `status=stale`, outdated-context summary, no highlights, and provenance `lastUpdated=null`. | Added unreadable-stats fallback coverage. |
| 23 | N/A | limits highlights to the top five node kinds in descending count order | NEW | N/A | With seven node kinds, asserted highlights exactly equal the top five counts in descending order. | Added deterministic ordering and truncation coverage. The old file only checked length/containment. |
| 24 | N/A | uses the current structural status vocabulary only | NEW | N/A | Collected statuses for fresh, stale, empty, and error boundary states; asserted sorted statuses equal `['missing','ready','stale']` and include `missing`. | Added canonical vocabulary coverage. This guards the current `missing` vocabulary and prevents drift back to stale/unavailable-style status terms. |

## Removed-Test Categorization

### Cross-skill scenarios

Eight removed tests were code-graph internal scenarios:

- Pre #9 through #11 covered `indexFiles()` stale-file filtering options.
- Pre #12 through #14 covered `indexFiles()` cross-file symbol collision pruning and logging.
- Pre #15 through #16 covered `handleCodeGraphScan()` full-scan option forwarding and idempotence.

Those tests required direct imports from `system-code-graph` internals (`structural-indexer`, `indexer-types`, `code-graph-db`, and `handlers/scan`). The post-rewrite file intentionally mocks `system-spec-kit/mcp_server/lib/code-graph-boundary.ts` instead. That preserves the spec-kit structural-contract intent while removing the dependency arc that caused the isolation finding.

Related coverage found outside this file:

- Incremental scan option forwarding still appears in `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts:340` and `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts:980`.
- DB-layer duplicate symbol handling appears in `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-db.vitest.ts:57` and `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-db.vitest.ts:77`.
- Full-scan behavior is broadly exercised in `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts`, including explicit full-scan cases, but this review did not find an exact replacement for the old `skipFreshFiles:false` full-scan assertion.

Because those are code-graph responsibilities, they are not counted as genuine structural-contract coverage loss. If exact full-scan/indexer tail behavior needs one-for-one regression coverage, the follow-up belongs in the code-graph test suite, not in this spec-kit boundary unit.

### Vocabulary drift

No removed tests were categorized as vocabulary drift. The post-rewrite file adds explicit current-vocabulary coverage in post #16.

### Duplicates

No removed tests were categorized as exact duplicates. Related coverage exists, but the review did not find one-for-one duplicate replacements for all removed code-graph internals.

### Genuine coverage loss

No removed tests were categorized as genuine structural-contract coverage loss. The structural-contract cases from the old file are preserved, renamed, replaced through boundary mocks, or strengthened by new provenance/fallback/highlight/vocabulary tests.

## Risk Assessment

- Cross-skill scenarios: 8 - coverage delegated to the code-graph suite if relevant; for the spec-kit unit, the boundary architecture supersedes the old integration concern.
- Vocabulary drift: 0 - no removed test was wrong solely due to the `missing`/`stale` vocabulary change; post #16 adds direct vocabulary protection.
- Duplicates: 0 - related code-graph coverage exists, but no exact duplicate classification was used.
- Genuine coverage loss: 0 - no lost structural-contract intent found.

Residual risk: the removed code-graph tail included exact assertions for `indexFiles(..., { skipFreshFiles: false })` during explicit full scans and repeated full-scan idempotence. Those are real code-graph behaviors, but they should be covered under `system-code-graph/mcp_server/tests/` if the code-graph owner wants exact regression protection.

## Verdict

**REWRITE PRESERVES INTENT - NO ACTION**

The rewrite preserves the structural-contract intent and strengthens boundary-owned coverage. The removed scenarios were cross-skill integration/indexer checks that should not live in a pure spec-kit unit.
