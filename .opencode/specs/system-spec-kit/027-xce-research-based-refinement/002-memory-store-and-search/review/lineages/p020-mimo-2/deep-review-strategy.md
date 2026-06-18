# Deep Review Strategy

## Files Under Review

| File | Role |
|------|------|
| `mcp_server/lib/storage/maintenance-marker.ts` | New shared reference-counted marker module |
| `mcp_server/handlers/memory-index.ts` | Scan IIFE refactored onto shared module |
| `mcp_server/lib/providers/retry-manager.ts` | Background-embedding queue wired into shared module |
| `mcp_server/tests/maintenance-marker.vitest.ts` | Unit test for reference-counted lifecycle |

## Cross-Reference Status

### Core
- Spec ↔ Code: aligned (beginMaintenance/end lifecycle matches spec requirements)
- Plan ↔ Implementation: aligned (three-file change matches plan phases)
- Tasks ↔ Completion: aligned (T002-T005 implemented)

### Overlay
- Resource Map Coverage: N/A (no resource-map.md present)

## Known Context

- 019 introduced the maintenance marker scoped to the scan job only
- This phase widens WHO writes the marker via reference counting
- The launcher-side adopt guard is unchanged
- The scan defers embeddings (asyncEmbedding), so the embedding queue runs post-scan
- Reference counting lets scan and embedding queue overlap under one marker
- The 180s TTL bounds any leaked reference

## Review Dimensions

| Dimension | Status | Iteration |
|-----------|--------|-----------|
| Correctness | pending | - |
| Security | pending | - |
| Traceability | pending | - |
| Maintainability | pending | - |

## Next Focus

Correctness (dimension 1 of 4)

## Review Boundaries

- Read-only audit of the four files listed above
- No code changes during review
- Findings cite [SOURCE: file:line] evidence
