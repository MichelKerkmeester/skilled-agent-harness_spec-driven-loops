# Iteration 004 - Maintainability

## Focus

Session lifecycle handlers, embedder handlers, and dispatch maintainability after the security/correctness findings.

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/session-health.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-list.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tools/lifecycle-tools.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tools/memory-tools.ts`

## Findings

No new P0/P1/P2 finding in this pass.

## Evidence Notes

- `session_resume` rejects explicit session id mismatches when caller context provides a session id, so the earlier suspicion of resume cross-session confusion is not active in this lineage.
- Cached resume summary acceptance checks producer metadata, transcript fingerprint, freshness, and scope before reuse.
- `session_learning` validates finite 0-100 learning scores and disambiguates multiple records by `sessionId`.
- `embedder_list`, `embedder_set`, and `embedder_status` have narrow input surfaces; `embedder_set` trims and validates provider names before switching.
- `lifecycle-tools.ts` and `memory-tools.ts` route the reviewed session/index/ingest/embedder tools through runtime argument validation.

## Maintainability Notes

The main maintainability cost is concentrated in `memory_index_scan`: one handler now owns discovery, stale deletion, orphan sweeping, indexing, mtime updates, causal linking, repair, and invalidation. That concentration is related to P1-002, but not a separate finding without a concrete behavioral break beyond the scoped cleanup issue already recorded.

## Iteration Metrics

- New findings: P0=0, P1=0, P2=0
- newFindingsRatio: 0.00
- Status: complete

Review verdict: FAIL
