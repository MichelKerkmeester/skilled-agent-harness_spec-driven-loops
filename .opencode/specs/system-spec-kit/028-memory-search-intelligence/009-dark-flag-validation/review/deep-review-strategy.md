# Deep Review Strategy — 009-dark-flag-validation

## Files Under Review

| File | Cluster | Lines | Review Depth |
|------|---------|-------|-------------|
| system-spec-kit/mcp_server/lib/search/deterministic-multihop.ts | 001 | 292 | Full |
| system-spec-kit/mcp_server/lib/search/lane-champion-backfill.ts | 001 | 162 | Full |
| system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts | 001 | 288 | Full |
| system-code-graph/mcp_server/lib/structural-indexer.ts | 002 | 2492 | L2100-L2492 (staleness+force-parse) |
| system-code-graph/mcp_server/lib/code-graph-db.ts | 002 | 2353 | L270-L1019 (bitemporal, tombstone, schema) |
| system-code-graph/mcp_server/lib/ensure-ready.ts | 002 | 865 | L1-L200 (readiness, drift classification) |
| system-skill-advisor/mcp_server/lib/scorer/fusion.ts | 003 | 902 | Full |
| deep-loop-runtime/scripts/fanout-merge.cjs | 004 | 701 | Full |
| system-spec-kit/mcp_server/lib/feedback/true-citation-emitter.ts | 005 | 547 | Full |

## Cross-Reference Status

| Protocol | Status | Notes |
|----------|--------|-------|
| spec_code | COMPLETE | Source audit completed for all 5 clusters |
| checklist_evidence | COMPLETE | Tests run and pass (69/69) |
| byte_identity | COMPLETE | Confirmed flag-off no-op for all clusters |
| edge_case_audit | COMPLETE | 5 uncovered scenario classes documented |

## Known Context

- Evidence sourced from 007-dark-flag-graduation benchmark artifacts
- All five clusters recommended GRADUATE (4 clusters) or REFINE (1, data-gated)
- Labels: DEEP-REVIEW, PRE-GRADUATION-VALIDATION, DARK-FLAGS

## Review Boundaries

- Read-only audit of source code, no modifications
- No re-running of 007 benchmarks
- Byte-identity verification via code-path analysis
- Edge cases: scenarios the labeled benchmarks did not test
