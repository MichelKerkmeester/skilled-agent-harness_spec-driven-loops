# Iteration 1: B-rest-of-002 Memory Store / Index / Lifecycle Review

## Focus
Reviewed memory write safety, index scan lifecycle, cancellation cleanup, retention behavior, and path handling under `.opencode/skills/system-spec-kit/mcp_server/` for scope B-rest-of-002.

## Findings
No confirmed P0/P1/P2 findings.

## Evidence Reviewed
- Scope: `review-r2/scopes/B-rest-of-002/spec.md:3-20` defines the non-search memory store/index/lifecycle audit target and accepts a clean PASS.
- Async ingest path: `handlers/memory-ingest.ts:198-215` canonicalizes and root-checks queued paths; `handlers/memory-save.ts:3187-3197` re-validates/canonicalizes direct save paths before indexing.
- Retention sweep: `lib/governance/memory-retention-sweep.ts:143-170` uses the purgeable tombstone predicate only when soft-delete tombstones are enabled and `deleted_at` exists.
- Retention docs/tests: `ENV_REFERENCE.md:93` marks soft-delete tombstones default OFF; `tests/memory-retention-sweep.vitest.ts:115-169` covers default active-row reaping and flag-on purgeable tombstone selection.
- Scan lease/cancellation: `handlers/memory-index.ts:480-484` and `handlers/memory-index.ts:1483-1494` release the scan lease through `completeIndexScanLease`; `core/db-state.ts:554-570` writes `last_index_scan` and clears `scan_started_at`.
- Scan cancellation tests: `tests/handler-memory-index-scan-jobs.vitest.ts:419-444` asserts cancellation releases the lease and prevents file indexing.
- Scan lease design: `changelog/v3.0.1.3.md:26-28` documents the atomic scan lease/cooldown as intentional anti-overlap behavior.

## Ruled Out
- Async ingest path-handling TOCTOU: rejected because the indexing boundary revalidates the path and canonical memory-file scope.
- Soft-delete retention live-row exclusion: rejected because flag-on behavior intentionally targets purgeable tombstones, while default behavior reaps active expired rows.
- Scan cancellation lease cooldown: rejected because cancellation releasing the lease via completion is directly covered by tests and aligns with documented scan coalescing behavior.
- Atomic index-before-rename ordering: not reported; existing tests cover the expected behavior and no shipped-behavior contradiction was confirmed.

## Dead Ends
- Code graph structural query path was unavailable: `code_graph_full_scan_required: git HEAD changed: 8b9ff540 -> 2b64f293; 442 stale files exceed selective threshold (50); inline full scan skipped for read path`.
- No `code_graph_scan` was run because it would mutate global index state outside the lineage artifact directory.

## Recommended Next Focus
None for this lineage. `maxIterations` is 1 and no active finding remains.
