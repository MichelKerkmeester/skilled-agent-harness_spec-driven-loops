---
title: "DRV-063 -- Ledger-led graph vocabulary upserts (BUG_CLASS / INVARIANT / PRODUCER / CONSUMER / TEST)"
description: "Verify the review-loop coverage-graph allow-list accepts and persists BUG_CLASS, INVARIANT, PRODUCER, CONSUMER, and TEST node kinds without dropping them."
---

# DRV-063 -- Ledger-led graph vocabulary upserts

This document captures the realistic user-testing contract, execution flow, and metadata for `DRV-063`.

## 1. OVERVIEW

Exercise the extended review-loop graph vocabulary. Before Phase G, the review coverage-graph allow-list rejected `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, and `TEST` node kinds — agents emitting them saw the events silently dropped. Phase G extended `coverage-graph-db.ts` and the YAML event filter so these node kinds persist alongside the original `DIMENSION | FILE | FINDING | EVIDENCE | REMEDIATION` set.

### Why This Matters

Without graph-side persistence, the ledger has nowhere to project its richer semantics (bug class taxonomy, invariant tests, producer/consumer paths). Graphless reviews can still proceed via the text/JSON ledger, but graph-backed reviews now have a structured surface for the candidate evidence the v2 contract demands.

## 2. SCENARIO CONTRACT

- Objective: Confirm the review-loop coverage-graph accepts and persists upserts for all five new node kinds: `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, `TEST`.
- Layer partition: graph database allow-list (`coverage-graph-db.ts`) + upsert handler (`upsert.ts`) + YAML event filter.
- Real user request: `Upsert a BUG_CLASS, INVARIANT, PRODUCER, CONSUMER, and TEST node into the review coverage-graph and confirm all five persist.`
- Expected signals: each upsert returns success; subsequent graph query (or graph state inspection) shows all five node kinds present in the review-loop namespace; YAML event filter does not drop them.
- Pass/fail: PASS if all five upserts succeed AND all five nodes are observable after persistence; FAIL if any kind is rejected with `unsupported_kind` OR disappears after upsert.

## 3. TEST EXECUTION

### Prerequisites

- `review-depth-graph.vitest.ts` exists under `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/`.
- Graph upsert test fixtures can include `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, and `TEST` events with valid review-loop relations.
- The graph test path can verify persisted review-loop nodes.

### Steps

1. Run or prepare the graph fixture path anchored by `review-depth-graph.vitest.ts`.
2. Upsert a `BUG_CLASS` node and verify success.
3. Upsert an `INVARIANT` node and verify success.
4. Upsert a `PRODUCER` node and verify success.
5. Upsert a `CONSUMER` node and verify success.
6. Upsert a `TEST` node and verify success.
7. Inspect persisted review-loop graph data and verify all five node kinds remain present.

### Expected Outcome

The review-loop graph accepts and persists `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, and `TEST` node kinds without rejection. Existing relations (`IN_DIMENSION`, `IN_FILE`, `EVIDENCE_FOR`) cover the new node mappings without requiring new relation kinds.

### Failure Modes

- A node kind is rejected with `unsupported_kind`: confirm the test runs against `loopType: 'review'` and that `coverage-graph-db.ts` `VALID_KINDS['review']` includes all five new entries.
- A node kind disappears after upsert: inspect persistence (graph DB query) rather than only the upsert response.
- The YAML event filter drops the event upstream: inspect `deep_start-review-loop_auto.yaml` event-filter normalization block.

## 4. SOURCE REFERENCES

- Allow-list: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` (`VALID_KINDS['review']` constant).
- Upsert handler: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` (dynamic kind validation via `VALID_KINDS[loopType]`).
- YAML event filter: `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` (event-normalization block).
- Confirm mirror: `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml`.
- Fixture: `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-graph.vitest.ts`.
- Phase spec: `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/spec.md`.

## 5. SOURCE_METADATA

- Group: Review-depth v2 rollout
- Playbook ID: DRV-063
- Layer partition: coverage-graph allow-list
- Expected verdict mode: GREEN
- Sourcing methodology: 131-deep-skill-evolution arc completion (8 phase children shipped 2026-05-22)
- Preflight: documented in 116 parent spec.md phase-map
- Wall-time estimate: ~5 min
