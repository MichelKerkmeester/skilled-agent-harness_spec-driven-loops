---
title: "Learning Feedback Reducers 003: Deferred Session-Trace Causal Reducer"
description: "Added a default-off session-trace causal reducer that infers prior-source edges from same-session feedback traces and inserts them as weak auto-session edges via the existing causal edge writer. Dry-run shadow replay is available without mutating edges."
trigger_phrases:
  - "002/004 causal reducer changelog"
  - "session-trace causal reducer"
  - "SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/004-learning-feedback-reducers/003-causal-reducer` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/004-learning-feedback-reducers`

### Summary

This leaf added `session-trace-causal-reducer.ts`, a deferred-only causal reducer that selects up to five prior sources from same-session feedback traces (preferring same-query matches) and inserts them as weak `auto-session` edges through the existing `insertEdge` function. The reducer runs only when `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE` is enabled. A dry-run mode returns candidates and skip reasons without writing any edges. MCP and CLI wiring are explicitly out of scope for this phase.

### Added

- `mcp_server/lib/feedback/session-trace-causal-reducer.ts` with deterministic prior-source selection and dry-run shadow replay.
- `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE` env flag (default off) gating all reducer execution paths.
- `mcp_server/tests/session-trace-causal-reducer.vitest.ts` with 10 tests covering flag-off no-op, idempotency, manual-edge protection, cap enforcement, same-query preference, and dry-run return shape.
- ENV_REFERENCE.md row for the new flag (ENV count incremented from 171 to 172).

### Changed

- None. The existing causal edge writer and relation vocabulary were used without modification.

### Fixed

- None.

### Verification

- `npm run build`: exited 0.
- `npx vitest run tests/session-trace-causal-reducer.vitest.ts`: 1 file, 10 tests passed.
- `npx vitest run tests/session-trace-causal-reducer.vitest.ts tests/causal-edges-write-safety.vitest.ts tests/feedback-ledger.vitest.ts tests/batch-learning.vitest.ts`: 4 files, 128 tests passed.
- Comment hygiene check on new reducer and test files: passed.
- SCHEMA_VERSION confirmed at 34 (no schema change).
- `validate.sh --strict` on the child spec folder: exited 0.

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/session-trace-causal-reducer.ts` | New file: deferred session-trace causal reducer with dry-run mode. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/session-trace-causal-reducer.vitest.ts` | New file: 10-test suite covering all reducer invariants. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Added `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE` flag row. |

### Follow-Ups

- Live MCP and CLI wiring for the reducer is deferred to a later phase.
- The reducer is available as an exported TypeScript maintenance function until explicit wiring is scoped.
