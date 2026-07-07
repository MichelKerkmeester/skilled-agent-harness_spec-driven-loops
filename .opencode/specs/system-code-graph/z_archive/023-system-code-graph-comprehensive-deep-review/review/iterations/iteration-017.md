# Iteration 017 — system-code-graph: Spec-kit isolation enforcement — zero imports from system-spec-kit, @spec-kit/shared boundary discipline, CI workflow

## Summary

Critical isolation violation: system-code-graph has 46 imports from system-spec-kit across production and test code, directly contradicting the "zero imports from system-spec-kit" requirement. The CI workflow only checks the reverse direction (spec-kit → system-code-graph), missing this release-blocking boundary breach. @spec-kit/shared boundary is correctly respected with zero direct imports.

## Files Reviewed

- `.github/workflows/isolation-check.yml` (lines read: 60)
- `.opencode/skills/system-code-graph/mcp_server/**/*.ts` (grep audit: 46 import matches found)

## Findings

### P0 (release-blocking)

| ID | File:line | Finding | Why P0 | Remediation |
|----|-----------|---------|--------|-------------|
| 017-001 | `.github/workflows/isolation-check.yml:19-40` | CI workflow only checks for imports FROM spec-kit TO system-code-graph, not the reverse direction (system-code-graph importing FROM spec-kit) | This is a critical gap in isolation enforcement that allowed 46 violations to go undetected; violates the stated isolation contract | Add a reverse-direction audit step that checks system-code-graph/mcp_server/ for imports from system-spec-kit, mirroring the existing spec-kit audit |
| 017-002 | `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.d.ts:5` | Imports `MCPResponse` type from system-spec-kit | Direct violation of "zero imports from system-spec-kit" requirement in production code | Move MCPResponse type to a shared location or duplicate locally; eliminate cross-skill dependency |
| 017-003 | `.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts:16` | Imports from `system-spec-kit/shared/code-graph-contracts.js` | Violates isolation even though using shared path; still a direct spec-kit dependency | Duplicate required types locally or establish a proper shared package boundary |
| 017-004 | `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:22-23` | Imports `MCPResponse` type and `parseArgs` from system-spec-kit | Production handler code with direct spec-kit dependencies | Refactor to eliminate dependencies; duplicate necessary utilities locally |
| 017-005 | `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:10` | Imports from `system-spec-kit/mcp_server/schemas/tool-input-schemas.js` | Production schema validation code with spec-kit dependency | Duplicate schema validation logic locally or establish proper boundary |
| 017-006 | `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:14` | Imports from `system-spec-kit/mcp_server/lib/context/shared-payload.js` | Production handler with spec-kit dependency | Eliminate dependency through local duplication or boundary refactoring |
| 017-007 | `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:23-24` | Imports `shouldIndexForCodeGraph` and `resolveCanonicalPath` from system-spec-kit | Core indexer logic depends on spec-kit utilities | Move required utilities into system-code-graph or eliminate dependency |
| 017-008 | `.opencode/skills/system-code-graph/mcp_server/lib/gold-query-verifier.ts:9` | Imports `createLogger` from system-spec-kit | Production verifier depends on spec-kit logger | Use local logger implementation |
| 017-009 | `.opencode/skills/system-code-graph/mcp_server/lib/runtime-detection.ts:8` | Imports `detectCodexHookPolicy` from system-spec-kit | Runtime detection depends on spec-kit policy logic | Move policy detection logic locally |
| 017-010 | `.opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts:36-37,44` | Imports from `system-spec-kit/mcp_server/lib/context/shared-payload.js` and exports its types | Core contract logic with spec-kit dependency | Duplicate types locally; eliminate cross-skill type sharing |
| 017-011 | `.opencode/skills/system-code-graph/mcp_server/lib/startup-brief.ts:9-10,17` | Imports hook-state, cocoindex-path, and shared-payload from system-spec-kit | Startup logic depends on spec-kit infrastructure | Refactor to eliminate dependencies or move logic into spec-kit |
| 017-012 | `.opencode/skills/system-code-graph/mcp_server/lib/compact-merger.ts:12` | Imports from `system-spec-kit/mcp_server/lib/context/shared-payload.js` | Merger logic depends on spec-kit types | Duplicate required types locally |
| 017-013 | `.opencode/skills/system-code-graph/mcp_server/lib/ops-hardening.ts:11,18` | Imports from `system-spec-kit/shared/code-graph-contracts.js` | Hardening logic depends on spec-kit shared types | Duplicate types locally; establish proper boundary |
| 017-014 | `.opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.d.ts:3,6` | Type definition imports and exports from system-spec-kit | Even type definitions violate isolation | Duplicate type definitions locally |
| 017-015 | `.opencode/skills/system-code-graph/mcp_server/tool-schemas.d.ts:1` | Exports from `system-spec-kit/mcp_server/schemas/tool-input-schemas.js` | Type-level dependency on spec-kit | Duplicate schema types locally |

### P1 (high priority)

| ID | File:line | Finding | Why P1 | Remediation |
|----|-----------|---------|--------|-------------|
| 017-016 | `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/w10-degraded-readiness-integration.vitest.ts:13-15` | Stress test imports query-plan, graph-readiness-mapper, and search-decision-envelope from system-spec-kit | Test code should not depend on spec-kit for integration testing; undermines isolation testing | Mock or duplicate test fixtures locally; eliminate cross-skill test dependencies |
| 017-017 | `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/deep-loop-graph-convergence-stress.vitest.ts:16,20` | Stress test imports coverage-graph-db and convergence handler from system-spec-kit | Test dependency on spec-kit coverage graph implementation | Mock or stub required interfaces; eliminate direct imports |
| 017-018 | `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/deep-loop-crud-stress.vitest.ts:11-14` | Stress test imports coverage-graph-db and multiple coverage-graph handlers from system-spec-kit | Multiple test dependencies on spec-kit handlers | Refactor tests to use mocked interfaces |
| 017-019 | `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/walker-dos-caps.vitest.ts:12` | Stress test imports memory-index-discovery from system-spec-kit | Test depends on spec-kit memory discovery logic | Mock the discovery interface locally |
| 017-020 | `.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts:59-60` | Unit test imports hook-state and cocoindex-path from system-spec-kit | Unit tests should not depend on external skill implementations | Mock required dependencies; eliminate cross-skill imports |
| 017-021 | `.opencode/skills/system-code-graph/mcp_server/tests/graph-payload-validator.vitest.ts:2,6` | Test imports opencode-transport and shared-payload from system-spec-kit | Test depends on spec-kit transport layer | Mock the transport interface locally |
| 017-022 | `.opencode/skills/system-code-graph/mcp_server/tests/p0-a-cross-runtime-tempdir-poisoning.vitest.ts:8-14,18` | P0 test imports multiple spec-kit modules: hook-state, session-prime, session-stop, session-resume, shared-payload, unicode-normalization | Critical P0 test depends on spec-kit infrastructure, undermining test independence | Refactor test to use mocked interfaces; eliminate direct spec-kit dependencies |
| 017-023 | `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:12` | Test imports `shouldIndexForCodeGraph` from system-spec-kit | Test depends on spec-kit utility function | Duplicate or mock the utility locally |
| 017-024 | `.opencode/skills/system-code-graph/mcp_server/tests/crash-recovery.vitest.ts:27,34` | Test imports session-manager and transaction-manager from system-spec-kit | Recovery test depends on spec-kit session infrastructure | Mock session management interfaces locally |

### P2 (nice-to-have)

| ID | File:line | Finding | Why P2 | Remediation |
|----|-----------|---------|--------|-------------|
| — | — | None | — | — |

## Convergence Signal

newInfoRatio 1.0 — First audit of isolation enforcement reveals 46 previously undetected cross-skill import violations and a critical CI workflow gap.
