# Deep Review Strategy

## topic
Review of 021-cooperative-heavy-phases: daemon responsiveness instrumentation, trigger-embedding-backfill chunking, and per-tail-phase marker refresh.

## review-dimensions
- [x] Correctness
- [ ] Security
- [ ] Traceability
- [ ] Maintainability

## completed-dimensions
- [x] Correctness — VERDICT: PASS (P0=0, P1=0, P2=2 advisories)

## running-findings
- P0: 0 | P1: 0 | P2: 2 active
- F001 (P2): `runNearDuplicateRepairBackfill` return value discarded at `timedPhase` call site (memory-index.ts:1261)
- F002 (P2): Double `releaseScanLease` call on early-return paths (memory-index.ts:529,845,1430,1482)

## what-worked
- Iteration 001: Deep traversal of transaction/yield boundaries confirmed no `await` inside `database.transaction()`. Drift-based lag sampler pattern is sound. Traceability pass confirms REQ-001 through REQ-004 all resolve to concrete implementation lines.

## what-failed
(None yet)

## exhausted-approaches
(None yet)

## ruled-out-directions
- Iteration 001: Transaction-yield boundary violation — ruled out; both `setImmediate` yields are outside transaction closures.
- Iteration 001: Missing timer cleanup — ruled out; all exit paths pass through outer `finally` block.

## next-focus
**Security** (Priority 2): Audit the trigger-embedding-backfill for input validation, SQL injection surface, and path handling. Assess whether the `markTriggerEmbeddingStatus` function properly handles edge cases in the embedding loop.

## known-context
- Spec status: Complete (code); deploy-time lag read pending
- Completion: 100%
- The spec adds instrumentation (event-loop lag sampler + `timedPhase`) in `memory-index.ts`, chunks `trigger-embedding-backfill.ts` into per-chunk transactions with between-chunk yields, and wraps tail phases with marker refresh on entry.
- No `checklist.md` exists (Level 1 spec folder).
- No `resource-map.md` for this spec folder. Skipping coverage gate.
- Verification: typecheck, trigger-backfill unit tests (6/6 including 3 new cancel/yield cases), scan-job suite, daemon-reelection adoption harness all pass.
- Pre-existing failures noted, not introduced: `retry-manager.vitest.ts` T49, `handler-memory-index-cooldown`, `handler-memory-index-needs-rebuild`, `trigger-threshold-tuning`.

## cross-reference-status
| Protocol | Level | Status | Gate | Notes |
|----------|-------|--------|------|-------|
| spec_code | core | pass | hard | REQ-001..004 all map to concrete code lines (iteration-001.md) |
| checklist_evidence | core | n/a | hard | No checklist.md (Level 1) |
| feature_catalog_code | overlay | pending | advisory | Cross-check spec-scoped features against implementation |
| playbook_capability | overlay | pending | advisory | Validate operational playbook scenarios |

## files-under-review
| File | Dimension(s) | Status |
|------|-------------|--------|
| `mcp_server/handlers/memory-index.ts` (1587 lines) | Correctness, Security, Traceability, Maintainability | reviewed (correctness) |
| `mcp_server/lib/search/trigger-embedding-backfill.ts` (344 lines) | Correctness, Security, Traceability, Maintainability | reviewed (correctness) |
| `mcp_server/tests/trigger-embedding-backfill.vitest.ts` (216 lines) | Correctness, Traceability | reviewed (correctness) |

## review-boundaries
- Max iterations: 1
- Convergence threshold: 0.10
- Stuck threshold: 2
- Severity threshold: P2
- Execution mode: auto
- resource-map.md not present. Skipping coverage gate.
