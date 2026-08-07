# Deep Review Report: Packed In-Memory BM25 Engine with Field Weights

## Executive Summary
Verdict: CONDITIONAL.

The review covered six iterations across correctness, security, traceability, and maintainability. No P0 blockers were found. Two active P1 findings remain, so the packet should not be treated as cleanly shipped until remediation lands. One P2 advisory tracks missing regression coverage.

| Field | Value |
|-------|-------|
| Stop reason | `maxIterationsReached` |
| Iterations | 6 |
| Active P0 | 0 |
| Active P1 | 2 |
| Active P2 | 1 |
| hasAdvisories | true |
| Release readiness | in-progress |

## Planning Trigger
Route to remediation planning. F001 affects the memory-bound startup warmup claim, and F002 affects the fallback relevance-equivalence claim. Both are required before a PASS verdict.

## Active Finding Registry
| ID | Severity | Dimension | Finding | Evidence | Status |
|----|----------|-----------|---------|----------|--------|
| F001 | P1 | correctness | Async rebuild never compacts the final warmup batch. | [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:510-519] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:604-617] | active |
| F002 | P1 | traceability | Fallback scoped BM25 limits before applying DB-side filters. | [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:427-483] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:179-200] | active |
| F003 | P2 | maintainability | Packed warmup tests do not cover rebuild finalization semantics. | [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:640-685] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/bm25-packed-inmemory.vitest.ts:111-128] | active |

## Remediation Workstreams
| Workstream | Findings | Suggested Fix |
|------------|----------|---------------|
| Startup warmup finalization | F001, F003 | Call `finalizePackedPostings()` when the final non-empty warmup batch drains, then add a regression test that exercises `rebuildFromDatabase()` instead of direct manual finalization. |
| Scoped fallback parity | F002 | Apply spec-folder/deprecated filtering before the effective fallback limit, or over-fetch until enough post-filter candidates remain and add a regression test with high-scoring out-of-scope rows. |

## Spec Seed
- Add an acceptance note that the RAM/warmup budget must be measured on the production startup path (`rebuildFromDatabase()`), not only on direct fixture construction.
- Add a fallback parity criterion for scoped searches: packed fallback must preserve the same pre-limit filtering semantics as FTS5 for `specFolder` and deprecated-tier exclusion.

## Plan Seed
1. Patch `BM25Index.rebuildFromDatabase()` so the final non-empty batch finalizes packed postings before clearing `warmupHandle`.
2. Add a test that runs fake timers through `rebuildFromDatabase()` and verifies a post-warmup search does not depend on mutable construction arrays.
3. Patch `bm25Search()` fallback to avoid top-N truncation before metadata filtering.
4. Add a scoped fallback regression where global top results are out of scope but in-scope rows exist below them.
5. Re-run `npx vitest run tests/bm25-packed-inmemory.vitest.ts tests/bm25-index.vitest.ts tests/hybrid-search.vitest.ts` and strict spec validation.

## Traceability Status
| Protocol | Gate | Status | Notes |
|----------|------|--------|-------|
| spec_code | hard | partial | F001 and F002 contradict parts of the shipped memory-bound and fallback-equivalence claims. |
| checklist_evidence | hard | pass | Level 1 task evidence exists; no `checklist.md` required. |
| feature_catalog_code | advisory | partial | Implementation summary compaction claim is incomplete for startup rebuild. |
| playbook_capability | advisory | pass | Engine selection remains explicit and logged. |

## Deferred Items
- F003 is advisory but should be fixed with F001 to prevent regression.
- The 3x RSS projection remains a separate scale risk outside the current corpus gate.

## Audit Appendix
| Iteration | Focus | Verdict | New Findings |
|-----------|-------|---------|--------------|
| 001 | correctness | CONDITIONAL | F001 |
| 002 | security | PASS | none |
| 003 | traceability | CONDITIONAL | F002 |
| 004 | maintainability | PASS | F003 |
| 005 | traceability stabilization | PASS | none |
| 006 | cross-dimension stabilization | PASS | none |

Convergence replay: all four dimensions were covered, no P0 findings remain, and the last two iterations found no new issues. STOP was reached by max iteration cap, not by clean convergence, because two P1 findings remain active.

Evidence density: every active finding carries file and line evidence. Claim adjudication packets were recorded for both P1 findings in their iteration files and JSONL state.
