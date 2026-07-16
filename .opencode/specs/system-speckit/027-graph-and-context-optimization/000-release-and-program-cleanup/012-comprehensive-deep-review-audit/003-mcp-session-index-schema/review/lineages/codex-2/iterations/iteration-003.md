# Iteration 003

Focus: traceability.

## Schema-To-Handler Parity

The schema layer documents that `TOOL_DEFINITIONS` is the public tool-count source and `TOOL_SCHEMAS` is the validation registry. That distinction is valid, but it exposes a parity failure for scan/ingest governance.

Evidence:

- `schemas/README.md:22` says `TOOL_DEFINITIONS.length` is the public source of truth.
- `tool-input-schemas.ts:596` and `tool-input-schemas.ts:598` list governance fields as allowed parameters for scan and ingest.
- `tool-schemas.ts:522` and `tool-schemas.ts:536` omit those fields from caller-facing schemas.

This is not a harmless hidden compatibility layer because the handlers call governance validation, then discard the normalized governance decision downstream.

Review verdict: CONDITIONAL
