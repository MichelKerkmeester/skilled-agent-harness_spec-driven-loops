# Deep Review Report: Packed In-Memory BM25 Field Weights

## Executive Summary
Verdict: CONDITIONAL

The reviewed implementation ships the packed in-memory BM25 path, BM25F field weighting, explicit engine routing, and fixture-backed tests. The release-readiness verdict is CONDITIONAL because one active P1 remains: the budget gate claimed by REQ-001 is proven with a synthetic repeated-filler fixture, not with the full current corpus named by the requirement.

| Metric | Value |
|--------|-------|
| Stop reason | maxIterationsReached |
| Iterations | 6 |
| Active P0 | 0 |
| Active P1 | 1 |
| Active P2 | 2 |
| hasAdvisories | true |
| Release readiness state | in-progress |

## Planning Trigger
Route to remediation planning for F001. The minimal fix is either to add/replay a budget measurement against an actual current-corpus export or to narrow REQ-001 and the completion evidence to say synthetic byte-size fixture validation.

## Active Finding Registry
| ID | Severity | Dimension | Title | Evidence | Status |
|----|----------|-----------|-------|----------|--------|
| F001 | P1 | correctness | Warmup/RSS gate uses synthetic repeated filler instead of the full current corpus | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/spec.md:102`; `.opencode/skills/system-spec-kit/mcp_server/tests/bm25-packed-inmemory.vitest.ts:117`; `.opencode/skills/system-spec-kit/mcp_server/lib/eval/fixtures/bm25-packed-fixture.ts:102` | active |
| F002 | P2 | traceability | Plan dependency rows still say Pending after shipped verification | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/plan.md:139`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/spec.md:49`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/implementation-summary.md:101` | active |
| F003 | P2 | maintainability | Shipped spec keeps an unresolved open question after implementation answers the contingency path | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/spec.md:137`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/implementation-summary.md:91`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/implementation-summary.md:116` | active |

## Remediation Workstreams
| Workstream | Findings | Action |
|------------|----------|--------|
| Budget proof | F001 | Add a current-corpus replayable budget fixture or measurement artifact, then update implementation-summary evidence. |
| Packet cleanup | F002, F003 | Reconcile plan dependency statuses and close the stale open question. |

## Spec Seed
- Clarify REQ-001 evidence source: actual current corpus export vs synthetic byte-size fixture.
- If synthetic validation is intentional, change acceptance criteria from "full current corpus" to "corpus-sized fixture with documented representativeness limits".
- Move the minisearch contingency question from open question to answered decision/limitation.

## Plan Seed
1. Create or locate a replayable current-corpus budget measurement source for the packed in-memory engine.
2. Re-run `npx vitest run tests/bm25-packed-inmemory.vitest.ts` after any test adjustment.
3. Update `implementation-summary.md` with the new measurement or revised scope.
4. Update `plan.md` dependency statuses from Pending to Delivered/Verified where appropriate.
5. Update `spec.md` open question to answered decision or known limitation.

## Traceability Status
| Protocol | Status | Gate | Summary |
|----------|--------|------|---------|
| spec_code | partial | hard | F001 leaves REQ-001 partially proven. |
| checklist_evidence | N/A | hard | Level 1 packet has no checklist.md. |
| feature_catalog_code | partial | advisory | Implementation exports and tests exist, budget proof source remains weak. |
| playbook_capability | partial | advisory | Verification commands are recorded, but live-current-corpus replay is not recorded. |

## Deferred Items
- F002 and F003 are advisory documentation cleanup items.
- No resource-map coverage gate was emitted because the target packet has no `resource-map.md` at init.
- No security-sensitive finding was identified.

## Audit Appendix
| Iteration | Focus | New Ratio | New Findings | Verdict Line |
|-----------|-------|-----------|--------------|--------------|
| 1 | correctness | 1.00 | F001 P1 | CONDITIONAL |
| 2 | security | 0.00 | none | PASS |
| 3 | traceability | 1.00 | F002 P2 | PASS |
| 4 | maintainability | 1.00 | F003 P2 | PASS |
| 5 | traceability-stabilization | 0.00 | none | PASS |
| 6 | final-stabilization | 0.00 | none | PASS |

Replay validation: JSONL contains one config record, six iteration records, one claim adjudication event for F001, and one synthesis_complete event. Every iteration file ends with a canonical `Review verdict:` line. The final verdict maps to CONDITIONAL because activeP0=0 and activeP1=1.
