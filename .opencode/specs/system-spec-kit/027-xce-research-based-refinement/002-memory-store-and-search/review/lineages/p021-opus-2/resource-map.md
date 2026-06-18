# Resource Map (review-derived): 021-cooperative-heavy-phases (lineage p021-opus-2)

> Target packet has no `resource-map.md`; coverage gate skipped. This map is derived
> from review delta evidence (the files actually touched/reviewed in this lineage).

## Files Under Review
| Path | Role | Review outcome |
|------|------|----------------|
| `mcp_server/handlers/memory-index.ts` | Scan orchestrator: lag sampler, `timedPhase`, two tail-phase paths, `isCancelled`/`onPhase` wiring | F001 (P1, empty-files path), F002/F004 (P2) |
| `mcp_server/lib/search/trigger-embedding-backfill.ts` | Chunked + cancellable phrase-sync and embedding loop | REQ-002 PASS; F003 (P2) |
| `mcp_server/tests/trigger-embedding-backfill.vitest.ts` | 3 new cancel/yield cases | Logically correct; no findings |

## Phase-5 Augmentation (novel logic gaps)
- F001: structural path divergence — REQ-001/REQ-003 instrumentation+marker-refresh present only on `files.length > 0`; the common no-change background scan path (`memory-index.ts:788-804`) is uncovered. Source: iteration-001.

## Implementation paths absent from any map
- None beyond the three reviewed files; commit `372bb0f2cd` touched only these plus the spec docs.
