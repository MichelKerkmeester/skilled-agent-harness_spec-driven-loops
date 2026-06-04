# Iteration 001

Focus: correctness.

## Finding

### F001 - P1

`memory_index_scan` and `memory_ingest_start` accept governance fields in the Zod layer and run governance validation, but the applied indexing paths drop that data before records are written.

Evidence:

- `tool-input-schemas.ts:455` and `tool-input-schemas.ts:472` include the shared governance fields for scan and ingest.
- `tool-schemas.ts:522` and `tool-schemas.ts:536` omit those same fields from the public tool schemas.
- `memory-index.ts:330` validates governed ingest, but `memory-index.ts:721` calls `indexSingleFile` without scope/provenance/retention options.
- `memory-ingest.ts:146` validates governed ingest, but `memory-ingest.ts:263` stores only job id, paths and specFolder.

Impact: callers can supply governance input that validates, while indexed rows are written without the requested scope or retention metadata.

Review verdict: CONDITIONAL
