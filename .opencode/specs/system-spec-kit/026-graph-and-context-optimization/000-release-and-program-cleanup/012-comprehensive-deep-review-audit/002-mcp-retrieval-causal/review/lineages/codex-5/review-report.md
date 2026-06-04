# Deep Review Report - MCP Retrieval + Causal Review Slice

## Executive Summary

Verdict: FAIL.

The review covered all configured dimensions across seven iterations and stopped at `maxIterationsReached`. The active registry has 2 P0, 1 P1, and 1 P2 findings. Release readiness is `release-blocking`; `hasAdvisories=true` because one P2 advisory remains alongside blockers.

## Planning Trigger

Route this slice to remediation planning. The first fixes should close F002 and F003 because they are scope/authorization failures. F001 is the next required correctness fix, and F004 can be handled as schema cleanup after the blockers.

## Active Finding Registry

| ID | Severity | Dimension | Finding | Evidence | Status |
|----|----------|-----------|---------|----------|--------|
| F002 | P0 | security | Community fallback bypasses governed retrieval scope | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1000` | active |
| F003 | P0 | security | Causal graph tools operate on bare IDs without scope authorization | `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:76` | active |
| F001 | P1 | correctness | Causal edge writers can create wrong-target or orphan edges | `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:757` | active |
| F004 | P2 | traceability | `memory_causal_stats` public schema hides runtime backfill capability | `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:454` | active |

## Remediation Workstreams

1. Scoped retrieval fallback: make community search scope-aware or post-filter fallback member rows by `specFolder`, `tenantId`, `userId`, and `agentId` before response formatting. Add a regression where scoped primary results are weak and community members include out-of-scope rows.
2. Causal graph authorization: add governed scope inputs to causal graph tools and enforce ownership predicates for drift reads, stats inventory, link creation, and unlink deletion.
3. Causal edge integrity: validate link endpoints against `memory_index`; make automatic reference resolution scoped to the source memory's folder/tenant and deterministic when titles duplicate.
4. Causal stats contract drift: align public and runtime schemas, or split write-capable backfill into an explicit mutation tool.

## Spec Seed

- Add acceptance criteria requiring community fallback to preserve governed retrieval scope.
- Add acceptance criteria requiring causal graph read/write tools to enforce the same scope model as `memory_search`, `memory_context`, and `memory_match_triggers`.
- Add acceptance criteria requiring causal edge endpoints to resolve to existing intended records before insertion.

## Plan Seed

- Patch `memory-search.ts` and `community-search.ts` so fallback member IDs are filtered against the caller scope before append.
- Patch `causal-graph.ts` schemas and handlers to accept and enforce scope for all causal graph tools.
- Patch `causal-links-processor.ts` reference resolution to constrain title/path/fuzzy matching to the source memory's scope.
- Add regression tests for scoped community fallback, causal graph IDOR prevention, orphan-edge rejection, and causal stats schema parity.

## Traceability Status

| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| spec_code | fail | hard | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/spec.md:36` |
| checklist_evidence | pass | hard | No `checklist.md`; no checked items to verify. |
| feature_catalog_code | partial | advisory | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:95` |
| playbook_capability | partial | advisory | `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:454` |

`resource-map.md` was absent at init, so the conditional Resource Map Coverage Gate section is omitted.

## Deferred Items

- F004 can wait until after P0/P1 remediation unless the stats/backfill contract becomes externally callable.
- Re-run closed-gate replay after fixes, especially for scoped fallback and causal graph authorization.

## Audit Appendix

| Iteration | Focus | New Ratio | New Findings | Verdict |
|-----------|-------|-----------|--------------|---------|
| 1 | correctness | 0.45 | F001 | CONDITIONAL |
| 2 | security | 0.67 | F002 | FAIL |
| 3 | security | 0.50 | F003 | FAIL |
| 4 | traceability | 0.04 | F004 | PASS |
| 5 | maintainability | 0.00 | none | FAIL |
| 6 | stabilization | 0.00 | none | FAIL |
| 7 | final replay | 0.00 | none | FAIL |

Claim adjudication passed for all active P0/P1 findings. Legal stop was blocked at runs 5 and 6 by `p0ResolutionGate`; max-iteration synthesis produced the terminal FAIL verdict.
