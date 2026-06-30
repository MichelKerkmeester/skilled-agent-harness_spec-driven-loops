# Deep Review Strategy

## Topic

Audit Scope - Memory Store / Index / Lifecycle (002 non-search).

## Review Dimensions

| Dimension | Status | Notes |
|---|---|---|
| correctness | complete | One P1 transaction-boundary finding recorded. |
| security | complete | No SQL injection or path traversal finding confirmed in reviewed slices. |
| traceability | complete | Scope claims mapped to reviewed write/index/lifecycle files; no checklist exists. |
| maintainability | complete | Primary maintainability risk is the misleading atomic-save ordering contract around F001. |

## Completed Dimensions

| Iteration | Dimensions | Verdict |
|---|---|---|
| 001 | correctness, security, traceability, maintainability | CONDITIONAL |

## Running Findings

| Severity | Active | New This Iteration |
|---|---:|---:|
| P0 | 0 | 0 |
| P1 | 1 | 1 |
| P2 | 0 | 0 |

## What Worked

- Iteration 001: Cross-checked the atomic save helper against its memory-save caller and the concrete DB transaction path before recording F001.
- Iteration 001: Re-read index-scan lease/cancel paths and did not carry an inference-only finding for idempotent lease release.

## What Failed

- Code graph was not needed for this one-pass lineage; exact file discovery plus direct reads gave enough evidence.

## Exhausted Approaches

- Duplicate lease-release concern in `memory-index.ts` was ruled out because `releaseScanLease` is guarded by `scanLeaseReleased`.

## Ruled Out Directions

- `job-store.ts` cancel mirror leak: terminal transitions delete the in-process cancel id in both `setJobState` and `completeJob`.
- `memory-index.ts` stale cleanup after scan failure: cleanup is intentionally deferred when replacement indexing has failures.

## Next Focus

Stopped by `maxIterationsReached`. If continued, replay F001 with a fault-injection test around `promotePendingFile` failure and inspect chunked indexing rollback parity.

## Known Context

- Review target scope is `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md`.
- `resource-map.md` not present. Skipping coverage gate.

## Cross-Reference Status

| Protocol | Gate | Status | Evidence |
|---|---|---|---|
| spec_code | hard | partial | Scope asks for write safety and transaction boundaries at `spec.md:6-14`; F001 covers a confirmed gap. |
| checklist_evidence | hard | pass | Not applicable because scope packet has no `checklist.md`. |
| feature_catalog_code | advisory | partial | Memory indexing and atomic-save feature comments were inspected in relevant files. |
| playbook_capability | advisory | skipped | No playbook exists in this narrow scope packet. |

## Files Under Review

| File | Coverage | Notes |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | sampled | Scan lease, cancellation, stale cleanup, post-processing. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-scan-jobs.ts` | sampled | Status/cancel surface. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts` | sampled | Job lifecycle transitions, cancel mirror, crash recovery. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts` | sampled | Pending-file recovery and atomic write limitations. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts` | sampled | Mtime, stale path, orphan sweep, move reconciliation. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts` | reviewed | F001 source. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | reviewed | F001 caller and DB transaction path. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts` | sampled | Receipt replay/storage conflict behavior. |

## Review Boundaries

- Max iterations: 1.
- Target files read-only.
- Findings require file:line evidence.
- No implementation or remediation performed.

## Non-Goals

- Search/retrieval pipeline review.
- Fix implementation.
- Files outside the declared MCP memory store/index/lifecycle surface.

## Stop Conditions

- Stop after iteration 001 because `config.maxIterations` is 1.
