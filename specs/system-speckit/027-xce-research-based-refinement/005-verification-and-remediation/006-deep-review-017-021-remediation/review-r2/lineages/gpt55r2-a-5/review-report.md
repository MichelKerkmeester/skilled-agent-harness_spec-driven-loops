# Deep Review Report - gpt55r2-a-5

## Executive Summary
- Verdict: CONDITIONAL
- Active findings: P0=0, P1=3, P2=0
- hasAdvisories: false
- Stop reason: maxIterationsReached
- Release readiness state: in-progress
- Scope: Search & Retrieval subsystem review scope under `.opencode/skills/system-spec-kit/mcp_server/`.

The lineage found three active P1 issues. Two affect folder-discovery retrieval ranking and caching; one makes advertised global/local graph retrieval unreachable through the strict public schema.

## Planning Trigger
Route to remediation planning before treating the search/retrieval surface as clean. The active P1 findings can cause incorrect retrieval ordering, stale cache reuse across different ranking contexts, and rejected tool calls for documented `retrievalLevel` usage.

## Active Finding Registry
| ID | Severity | Category | Title | Evidence | Status |
|----|----------|----------|-------|----------|--------|
| F001 | P1 | correctness | `folderBoost` responses collide in the `memory_search` cache | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1070-1101`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1443-1445` | active |
| F002 | P1 | correctness | `folderBoost` clamps raw `0..100` similarity to `1.0` and can demote boosted vector hits | `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:446-448`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:651-678` | active |
| F003 | P1 | traceability | Advertised `retrievalLevel` is rejected by strict public schemas | `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:919-925`, `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:186-220` | active |

## Remediation Workstreams
1. Ranking/cache contract: include `folderBoost` in the cache key or bypass cache for boost-mutated calls, and add regression tests proving boosted and unboosted calls do not share cached payloads.
2. Score normalization: rewrite `applyFolderBoostRanking` to use canonical effective score semantics or normalize `similarity > 1 ? similarity / 100 : similarity` before applying the boost, then sort on the same score field returned to callers.
3. Public schema parity: either add `retrievalLevel` to Zod schema, allow-list, JSON schema, and cache key, or remove the public instructions and hook guidance that tell clients to pass it.

## Spec Seed
- Add an acceptance criterion that every ranking-affecting search argument must be represented in cache keys or explicitly marked non-cacheable.
- Add an acceptance criterion that all public instructions must be parity-checked against strict schemas and `ALLOWED_PARAMETERS`.
- Add an acceptance criterion that score boosts declare and test their score scale.

## Plan Seed
- T1: Add a regression around `memory_context` folder discovery where the same query is called with and without `folderBoost`; assert separate cache keys or cache bypass and correct `appliedBoosts` metadata.
- T2: Add a unit test for `applyFolderBoostRanking` with vector-style similarities `80`, `70`, and a boost factor; assert matching folder rows are not clamped below unboosted rows.
- T3: Add `retrievalLevel` schema parity tests if the feature should be public, including tool schema, Zod schema, allowed list, and cache-key coverage.

## Traceability Status
| Protocol | Status | Gate | Notes |
|----------|--------|------|-------|
| spec_code | partial | hard | Scope resolved to shipped search/retrieval code; F003 records public contract drift. |
| checklist_evidence | blocked | hard | Review-scope target contains only `spec.md`; no checklist evidence exists in the scope folder. |
| feature_catalog_code | partial | advisory | Public server/hook feature guidance does not match strict schema capability. |
| playbook_capability | partial | advisory | Guidance to call `memory_search({ retrievalLevel: "global" })` is not executable through the public schema. |

## Deferred Items
- Complete a dedicated security pass over governed fallback/community retrieval. This lineage sampled fallback scope filtering but did not cover every security-sensitive path within `maxIterations=1`.
- Add cache-key parity checks for any future public exposure of `retrievalLevel`; the current finding focuses on schema rejection.

## Audit Appendix
| Iteration | Focus | P0 | P1 | P2 | Verdict |
|-----------|-------|----|----|----|---------|
| 1 | search ranking/cache/schema seams | 0 | 3 | 0 | CONDITIONAL |

### Replay Validation
- JSONL parsed successfully at write time.
- Iteration file ends with canonical final line: `Review verdict: CONDITIONAL`.
- Claim adjudication packets present for all P1 findings.
- Full convergence was not reached because `maxIterations=1`; terminal event uses `stopReason=maxIterationsReached`.

### Evidence Density
- F001 evidence refs: 6
- F002 evidence refs: 5
- F003 evidence refs: 9

### Verdict Logic
No P0 findings are active. Three active P1 findings remain, so final verdict is `CONDITIONAL`.
