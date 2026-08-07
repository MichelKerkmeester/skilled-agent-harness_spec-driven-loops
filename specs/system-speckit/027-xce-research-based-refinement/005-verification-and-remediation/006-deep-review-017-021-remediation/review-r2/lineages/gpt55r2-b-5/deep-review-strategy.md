# Deep Review Strategy - gpt55r2-b-5

## Topic

Audit Scope - Memory Store / Index / Lifecycle (002 non-search), scope `B-rest-of-002`.

## Review Dimensions

- [x] Correctness - covered in iteration 001; no active findings.
- [x] Security - covered in iteration 001; no active findings.
- [x] Data integrity - covered in iteration 001; no active findings.
- [x] Concurrency/cancellation - covered in iteration 001; no active findings.
- [x] Performance - covered in iteration 001; no active findings.
- [x] Maintainability - covered in iteration 001; no active findings.
- [x] Spec-vs-code drift - covered in iteration 001; no active findings.

## Completed Dimensions

All configured dimensions were covered in the single allowed iteration. The review stayed inside `.opencode/skills/system-spec-kit/mcp_server/` memory store/index/lifecycle paths and excluded the search/retrieval pipeline per scope.

## Running Findings

| Severity | Active | New This Iteration |
| --- | ---: | ---: |
| P0 | 0 | 0 |
| P1 | 0 | 0 |
| P2 | 0 | 0 |

## What Worked

- Direct source reads were necessary because code graph freshness was stale.
- Grep narrowed dynamic SQL, path, cancellation, and transaction patterns before file-level reads.
- Candidate risks were treated as hypotheses until opened in source.

## What Failed

- Code graph structural evidence was unavailable due to stale freshness, so no call/import claims were made from it.

## Exhausted Approaches

- Re-checking atomic save ordering as a defect: ruled out because the caller indexes prepared in-memory content before promote.
- Re-checking soft-delete/tombstone repeated delete behavior as a defect: ruled out because tombstone behavior has targeted tests.
- Re-checking dynamic SQL interpolation as an injection finding: ruled out for opened paths where identifiers were fixed or allowlisted.

## Ruled-Out Directions

- Retention TTL-only deletion of high-tier or pinned rows: ruled out by protection checks and in-transaction expiry revalidation.
- Background scan cancellation leak: ruled out by fast cancel mirror, terminal cleanup, and run-finally lease release.
- Ingest cancellation lifecycle leak: ruled out by terminal-state guards and bounded worker shutdown handling.

## Next Focus

None. `maxIterations` reached and no active P0/P1/P2 findings remain.

## Known Context

- Scope spec: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md`.
- Artifact root was user-bound directly to the `gpt55r2-b-5` lineage directory.
- `resolveArtifactRoot` was not used.

## Cross-Reference Status

| Check | Status | Evidence |
| --- | --- | --- |
| Scope spec loaded | Pass | Scope file lines 1-17 define non-search memory store/index/lifecycle target. |
| Direct artifact root | Pass | `deep-review-config.json` records `resolveArtifactRootUsed: false`. |
| Code graph dependency | Pass with caveat | Code graph status was stale; direct reads and grep were used instead. |
| Search/retrieval exclusion | Pass | Review did not inspect search pipeline behavior as a finding surface. |

## Files Under Review

| File | Coverage |
| --- | --- |
| `handlers/memory-index.ts` | Background scan cancellation, lease cleanup, batch cancellation. |
| `handlers/memory-index-scan-jobs.ts` | Scan status/cancel handler ownership and terminal checks. |
| `handlers/memory-ingest.ts` | Ingest path validation and cancel surface. |
| `lib/ops/job-queue.ts` | Ingest job lifecycle, cancel, shutdown, progress/error accounting. |
| `lib/ops/job-store.ts` | Maintenance job transitions, cancel mirror cleanup, crash recovery. |
| `handlers/memory-retention-sweep.ts` | Handler error/success envelope and maintenance recording. |
| `lib/governance/memory-retention-sweep.ts` | Retention candidate selection, protected rows, TOCTOU guard, ledger/audit. |
| `handlers/memory-crud-list.ts` | Sort allowlist and parameterized query shape. |
| `handlers/session-learning.ts` | Legacy schema migration transaction. |
| `lib/storage/post-insert-metadata.ts` | Dynamic update column allowlist. |
| `lib/storage/write-provenance.ts` | Provenance persistence update shape. |
| `handlers/save/atomic-index-memory.ts` | Pending-file/index/promote rollback candidate path. |
| `handlers/memory-save.ts` | Atomic save caller and canonical path write flow. |
| `handlers/memory-crud-delete.ts` | Delete/tombstone lifecycle candidate path. |
| `handlers/memory-bulk-delete.ts` | Bulk delete/tombstone lifecycle candidate path. |
| `tests/causal-edge-tombstones.vitest.ts` | Tombstone behavior evidence. |

## Review Boundaries

- Maximum iterations: 1.
- Stop reason: `maxIterations`.
- Minimum severity: P2.
- Findings require file:line evidence.
- Clean PASS is valid under the scope spec.
