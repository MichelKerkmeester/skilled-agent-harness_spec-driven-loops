# Deep Review Report

## Executive Summary
Verdict: CONDITIONAL.

Active findings: P0=0, P1=2, P2=1. `hasAdvisories=true` because one P2 remains active.

Scope reviewed: the 015 storage adapter ports spec folder, implementation-summary completion evidence, VectorStore/LexicalSearch/GraphTraversal/Maintenance/ContentionPolicy port surfaces, fakes, and targeted contract tests. The loop stopped at `maxIterationsReached` after 6 iterations with all four dimensions covered.

Targeted verification run during this lineage: `npx vitest run tests/storage-ports-contract.vitest.ts tests/memo-storage.vitest.ts tests/causal-traversal-bfs-equivalence.vitest.ts --testTimeout 60000` passed with 3 files and 34 tests.

## Planning Trigger
Route this result to remediation planning before release-readiness is upgraded. The code is not blocked by a confirmed P0, but two P1 contract-boundary issues mean the new VectorStore port is not yet safely substitutable with its fake.

## Active Finding Registry
| ID | Severity | Dimension | Title | Evidence | Status |
|----|----------|-----------|-------|----------|--------|
| F001 | P1 | correctness | BetterSqliteVectorStore ignores caller-supplied vector IDs | `.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts:175-187`; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts:215-233`; `.opencode/skills/system-spec-kit/mcp_server/tests/fakes/storage-ports.ts:184-197` | active |
| F002 | P1 | traceability | VectorStore.clear removes memory rows, not only vector records | `.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts:95-96`; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts:264-271` | active |
| F003 | P2 | maintainability | Contract tests do not exercise caller-ID parity or non-vector clear boundaries | `.opencode/skills/system-spec-kit/mcp_server/tests/storage-ports-contract.vitest.ts:301-304`; `.opencode/skills/system-spec-kit/mcp_server/tests/storage-ports-contract.vitest.ts:310-325` | active |

## Remediation Workstreams
| Workstream | Findings | Suggested Order |
|------------|----------|-----------------|
| Define VectorStore identity semantics | F001 | First. Decide whether `VectorRecord.id` is caller-owned or memory-index-owned, then align production adapter, fake, and docs. |
| Narrow or document clear scope | F002 | Second. Either make `clear()` remove only vector records or rename/document the adapter as a full memory-index wipe surface. |
| Strengthen contract tests | F003 | Third. Add caller-ID `upsert/get/delete` parity and clear-boundary tests that fail against the current implementation. |

## Spec Seed
- Clarify whether `VectorStore` is a pure vector-record port or a legacy memory-index store facade.
- If caller-supplied IDs are required, add acceptance criteria that `upsert(record)`, `get(record.id)`, and `delete(record.id)` behave identically for fake and better-sqlite implementations.
- If `clear()` intentionally wipes `memory_index`, state that explicitly as destructive behavior and exclude it from generic VectorStore semantics.

## Plan Seed
- Add failing contract tests for `await port.get("caller-id")` after `upsert({ id: "caller-id", ... })` and for `delete("caller-id")`.
- Add a clear-boundary test that seeds a non-vector `memory_index` row and verifies whether it must survive `VectorStore.clear()`.
- Implement the chosen semantic fix with no behavior drift outside the VectorStore surface.
- Re-run `tests/storage-ports-contract.vitest.ts`, vector/search targeted suites, and the existing eval/golden gate.

## Traceability Status
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `spec.md:74-77`; `vector-store.ts:175-233`; `vector-store.ts:264-271` | Ports exist, but VectorStore substitutability is incomplete. |
| checklist_evidence | partial | hard | `tasks.md:69-71`; `implementation-summary.md:146-173`; `storage-ports-contract.vitest.ts:301-325` | Completion evidence exists, but current contract tests miss two important assertions. |
| feature_catalog_code | pass | advisory | `memo.ts:215-222`; `causal-boost.ts:166-170`; `memo-storage.vitest.ts:69-86` | GraphTraversal routing and fake substitution are supported. |
| playbook_capability | partial | advisory | `storage-ports-contract.vitest.ts:301-325` | Test playbook should include caller-ID parity and clear-boundary cases. |

## Deferred Items
- F003 is advisory but should be fixed with F001/F002 because it is the test gap that allowed both P1s to pass.
- Hybrid lexical coupling remains a justified exception per implementation-summary and was not reopened in this lineage.
- Code graph was stale, so structural graph convergence was not used.

## Audit Appendix
| Iteration | Focus | New Ratio | New Findings | Verdict |
|-----------|-------|-----------|--------------|---------|
| 001 | correctness | 1.00 | F001 | CONDITIONAL |
| 002 | security | 0.00 | none | PASS |
| 003 | traceability | 1.00 | F002, F003 | CONDITIONAL |
| 004 | maintainability | 0.00 | none | PASS |
| 005 | stabilization-replay | 0.00 | none | PASS |
| 006 | final-saturation | 0.00 | none | PASS |

Convergence replay: all dimensions covered, last three ratios were 0.00, and claim adjudication passed for F001/F002. STOP was finalized by `maxIterationsReached` because active P1 findings remain, yielding CONDITIONAL.

Evidence gate: passed for active findings. Scope gate: passed for read-only review. Coverage gate: covered all dimensions and required traceability protocols, with partial traceability status caused by F001/F002/F003.
