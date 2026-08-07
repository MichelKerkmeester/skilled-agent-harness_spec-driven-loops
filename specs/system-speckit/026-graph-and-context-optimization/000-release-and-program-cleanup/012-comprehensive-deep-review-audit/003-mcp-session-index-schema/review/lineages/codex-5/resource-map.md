# Review Resource Map

## Scope
This lineage did not start with a source `resource-map.md`; this map records the evidence graph produced by the review loop.

## Primary Finding
| ID | Severity | Surface | Status |
|----|----------|---------|--------|
| F001 | P1 | governed ingest metadata propagation | active |

## Evidence Graph
| Node | Role | Evidence |
|------|------|----------|
| Public tool definitions | Advertised MCP call contract | `tool-schemas.ts:519-522`, `tool-schemas.ts:531-550` |
| Strict input schemas | Accepted and validated call contract | `tool-input-schemas.ts:455-462`, `tool-input-schemas.ts:472-476`, `tool-input-schemas.ts:596-598` |
| Scan handler | Validates governance, then loses metadata at shared index boundary | `memory-index.ts:254-269`, `memory-index.ts:278-292`, `memory-index.ts:330-333`, `memory-index.ts:721-725` |
| Async ingest handler | Validates governance, then creates metadata-free job | `memory-ingest.ts:38-49`, `memory-ingest.ts:146-149`, `memory-ingest.ts:263-267` |
| Ingest queue | Persists no governance payload and calls worker with path only | `job-queue.ts:253-282`, `job-queue.ts:624-627` |
| Entrypoint queue binding | Binds worker to path-only indexing | `context-server.ts:2074-2077` |
| Storage/retention | Confirms discarded metadata has downstream semantics | `vector-index-schema.ts:1721-1730`, `vector-index-schema.ts:1788-1791`, `memory-retention-sweep.ts:36` |

## Repair Workstream
1. Align `tool-schemas.ts` with the strict Zod schema for governed ingest fields, or remove those fields from strict schemas if the tools are not meant to support them.
2. Introduce a typed normalized governance payload returned by `validateGovernedIngest()`.
3. Extend `indexSingleFile()` and the underlying `indexMemoryFile()` options to carry that payload.
4. Persist the payload on async ingest jobs and hydrate it in the queue worker.
5. Add tests for scan and async ingest proving tenant/session/provenance/retention fields reach `memory_index`.

## Non-Findings
- Dispatcher registration exists for target lifecycle and memory tools.
- Path traversal checks and allowed-root checks protect async ingest path inputs.
- Embedder list/set/status handlers did not produce a P2+ issue in this lineage.
