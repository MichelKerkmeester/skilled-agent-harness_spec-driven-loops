# Deep Review Resource Map

## Scope

Lineage: `gpt55-p018-1`

Target: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/018-reindex-scan-responsiveness-and-cancellation`

## Evidence Files

| File | Role | Iteration |
|---|---|---:|
| `.opencode/skills/system-spec-kit/mcp_server/utils/batch-processor.ts` | Primary finding evidence for abort/delay ordering | 001 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts` | Cancel mirror lifecycle sample | 001 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Background scan wiring and tail-loop yield sample | 001 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/job-store-cancel-lifecycle.vitest.ts` | Abort/cancel test coverage sample | 001 |
| Target `implementation-summary.md` | Delivered behavior claim checked against code | 001 |

## Phase-5 Augmentation

Novel logic gap found: `processBatches` lacks a pre-delay abort check, so cancellation can still incur one pacing delay. See `iterations/iteration-001.md` and `DR018-P1-001`.
