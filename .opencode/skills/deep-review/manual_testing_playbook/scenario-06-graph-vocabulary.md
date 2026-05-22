# Scenario 6 — Graph Vocabulary

## Purpose
Exercise Phase 007 review graph vocabulary persistence for ledger-led node kinds.

## Prerequisites
- `review-depth-graph.vitest.ts` exists under `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/`.
- Graph upsert test data can include `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, and `TEST`.
- The graph test path can verify persisted review-loop nodes.

## Steps
1. Run or prepare the graph fixture path anchored by `review-depth-graph.vitest.ts`.
2. Upsert a `BUG_CLASS` node.
3. Upsert an `INVARIANT` node.
4. Upsert a `PRODUCER` node.
5. Upsert a `CONSUMER` node.
6. Upsert a `TEST` node.
7. Inspect persisted review-loop graph data and verify all five node kinds remain present.

## Expected Outcome
The review-loop graph accepts and persists `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, and `TEST` node kinds without discarding them before storage.

## Failure Modes
- A node kind is rejected: confirm the test is running against the review-loop allow-list.
- A node kind disappears after upsert: inspect persistence rather than only the upsert response.
- The fixture still expects rejection: confirm Phase 007 graph vocabulary changes are present.
