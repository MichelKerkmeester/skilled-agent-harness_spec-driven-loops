# Deep Review Report: 018-reindex-scan-responsiveness-and-cancellation

## 1. Executive Summary
- **Verdict:** PASS
- **hasAdvisories:** true
- **Active P0:** 0 | **Active P1:** 0 | **Active P2:** 2
- **Scope:** Three implementation files (memory-index.ts, batch-processor.ts, job-store.ts) plus test mock parity
- **Iterations:** 1 | **Dimensions covered:** 1 of 4 (correctness)
- **Stop reason:** maxIterationsReached (fan-out lineage cap)
- **Session:** fanout-p018-deepseek-1-1781718236450-bbehhf, lineageMode=new, generation=1

The implementation of tail-loop event-loop yields, processBatches early-abort, and in-memory cancel flag is correct. All normative spec claims are satisfied with file:line evidence. Seven core invariants (yield placement safety, cancel check ordering, shouldAbort boundary check, flag lifecycle, heartbeat cleanup, background wiring, test mock parity) all pass. Two advisory documentation/clarity findings are recorded.

## 2. Planning Trigger
PASS verdict routes to `/create:changelog`. The two P2 advisory findings (F001, F002) are code-clarity improvements that do not block release and can be addressed in a follow-up cleanup pass. Neither finding affects correctness, security, or functional behavior.

## 3. Active Finding Registry
| ID   | Severity | Dimension        | Title                                              | File:Line                  | First Seen | Last Seen | Status |
|------|----------|------------------|----------------------------------------------------|----------------------------|------------|-----------|--------|
| F001 | P2       | maintainability  | Duplicate causal-edges import shadows static import | memory-index.ts:1291       | 1          | 1         | active |
| F002 | P2       | maintainability  | Undocumented magic number for lease heartbeat floor | memory-index.ts:496        | 1          | 1         | active |

## 4. Remediation Workstreams

### WS-1: Code Clarity Cleanup (P2, non-blocking)
- **F001**: Refactor the dynamic `await import('../lib/storage/causal-edges.js')` at memory-index.ts:1291 to use the existing static `causalEdges` import at memory-index.ts:32, or document why a second module reference is needed.
- **F002**: Add a code comment at memory-index.ts:496 explaining the 10-second floor rationale for the lease heartbeat interval.

**Execution order:** Both are independent. F001 requires refactoring; F002 is a documentation-only change.

## 5. Spec Seed
No spec changes needed. The implementation satisfies all REQ-001 through REQ-004 acceptance criteria. The follow-on for launcher lease-heartbeat re-election (documented in spec.md §6, implementation-summary.md §Known Limitations) remains the highest-priority open work.

## 6. Plan Seed
1. T001 [P2] Document lease heartbeat floor rationale at memory-index.ts:496 (ref F002)
2. T002 [P2] Consolidate duplicate causal-edges imports in memory-index.ts (ref F001)

## 7. Traceability Status
| Protocol              | Level   | Status         | Gate     | Summary |
|-----------------------|---------|----------------|----------|---------|
| spec_code             | core    | pass           | hard     | All 6 normative claims confirmed against implementation with file:line evidence |
| checklist_evidence    | core    | notApplicable  | hard     | Level 1 spec, no checklist.md |
| feature_catalog_code  | overlay | pass           | advisory | Feature catalog entries for memory_index_scan, processBatches, and job store match shipped behavior |
| skill_agent           | overlay | notApplicable  | advisory | spec-folder target |
| agent_cross_runtime   | overlay | notApplicable  | advisory | spec-folder target |
| playbook_capability   | overlay | notApplicable  | advisory | spec-folder target, no playbook present |

## 8. Deferred Items
- **Launcher lease-heartbeat re-election** (spec.md §6): Documented as known limitation and follow-on. The daemon's launcher recycles the daemon during a heavy scan, marking the running scan `failed`. This is a separate supervision subsystem outside the scope of this fix.
- **Out-of-process scan worker** (spec.md §7 Open Questions): Long-term design consideration for guaranteed daemon responsiveness regardless of per-row cost.
- **F001, F002**: See Remediation Workstreams above. Non-blocking P2 advisories.

## 9. Audit Appendix

### Iteration Table
| Run | Focus        | Status   | P0/P1/P2 New | Ratio  | Key Evidence |
|-----|-------------|----------|-------------|--------|-------------|
| 1   | correctness | complete | 0/0/2       | 0.17   | memory-index.ts:1166-1203, 1307-1340, batch-processor.ts:14-19,150, job-store.ts:75,316-341,369 |

### Verified Invariants
| # | Invariant | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Yields between transactions, never inside | PASS | memory-index.ts:1170-1174, 1308-1310 |
| 2 | Cancel checked before yield | PASS | memory-index.ts:1177-1179, 1312-1314 |
| 3 | shouldAbort at batch boundary | PASS | batch-processor.ts:150 |
| 4 | In-process flag lifecycle correct | PASS | job-store.ts:319,339-341,369,398 |
| 5 | Lease heartbeat cleanup | PASS | memory-index.ts:1472-1483 |
| 6 | Background wiring through fast checker | PASS | memory-index.ts:1506 |
| 7 | Test mock parity | PASS | handler-memory-index-scan-jobs.vitest.ts:107 |

### Coverage Matrix
| File                                  | Correctness | Security | Traceability | Maintainability |
|---------------------------------------|-------------|----------|-------------|-----------------|
| mcp_server/handlers/memory-index.ts   | covered     | -        | -           | -               |
| mcp_server/utils/batch-processor.ts   | covered     | -        | -           | -               |
| mcp_server/lib/ops/job-store.ts       | covered     | -        | -           | -               |
| tests/.../handler-memory-index-scan-jobs.vitest.ts | covered | - | -         | -               |

### Convergence Replay
- **Decision:** maxIterationsReached (hard cap: 1 of 1)
- **Composite score:** N/A (single iteration, insufficient data for 3-signal vote)
- **Rolling average:** N/A (requires 2+ evidence iterations)
- **MAD noise floor:** N/A (requires 3+ evidence iterations)
- **Dimension coverage:** 1 of 4 (incomplete)
- **Gate evaluation:** N/A (stop was due to maxIterations, not convergence vote)

### Verdict Justification
PASS: 0 active P0, 0 active P1. Two P2 advisories documented as non-blocking.
