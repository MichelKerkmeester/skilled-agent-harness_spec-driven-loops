# Iteration 001 - Memory Store / Index / Lifecycle Audit

## Scope

Reviewed `B-rest-of-002`: system-spec-kit MCP memory store, index, and lifecycle code outside the search/retrieval pipeline and outside the 017-021 fixes.

## Evidence Checked

- Scope boundaries: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md:1-17`.
- Background index scan cancellation and cleanup: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:480-531`, `1030-1056`, `1483-1552`.
- Scan status/cancel handler terminal checks: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-scan-jobs.ts:74-143`.
- Ingest path normalization and allowed-root checks: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:171-215`.
- Ingest job cancellation and worker lifecycle: `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:409-450`, `619-663`, `700-775`.
- Maintenance job cancel mirror and terminal cleanup: `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts:262-378`.
- Retention sweep handler envelope: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts:16-116`.
- Retention candidate selection, protection, revalidation, audit/ledger path: `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:137-173`, `176-242`, `499-627`.
- Dynamic list SQL sort allowlist: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:110-135`.
- Legacy session-learning migration transaction: `.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts:217-244`.
- Post-insert metadata column allowlist: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:57-148`.
- Provenance persistence update shape: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/write-provenance.ts:123-170`.

## Findings

No confirmed P0, P1, or P2 findings.

## Candidate Risks Ruled Out

- Atomic save ordering was not recorded as a defect because the reviewed path indexes prepared in-memory content and promotes afterward with rollback handling.
- Repeated soft-delete/tombstone behavior was not recorded as a defect because targeted tombstone tests exist and the opened delete paths did not contradict them.
- Dynamic SQL interpolation was not recorded as a defect because opened update/list paths use fixed identifiers, parameterized values, or allowlisted columns/sort keys.
- Retention TTL deletion was not recorded as a defect because high-tier and pinned rows are protected and each candidate is revalidated inside the transaction before deletion.
- Background scan and ingest cancellation were not recorded as defects because terminal-state guards, fast cancel mirrors, and cleanup paths are present.

## Coverage Caveat

The code graph was stale, so structural call/import evidence was not used. This iteration relied on direct source reads and grep over the declared scope.

Review verdict: PASS
