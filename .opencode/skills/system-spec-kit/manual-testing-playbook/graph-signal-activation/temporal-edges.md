---
title: "196 -- Temporal edge validity"
description: "Validates that valid_at/invalid_at columns on causal_edges, plus invalidateEdge() and getValidEdges(), keep stale relationships out of graph traversal."
audited_post_018: true
version: 3.6.0.5
id: graph-signal-activation-temporal-edges
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 196 -- Temporal edge validity

## 1. OVERVIEW

This scenario validates the temporal-edge filter on the causal_edges table. It exercises the `valid_at` and `invalid_at` columns, the `invalidateEdge()` mutator, and the `getValidEdges()` filter so an outdated relationship is excluded from graph walks even when the underlying row is still present.

---

## 2. SCENARIO CONTRACT

- Objective: Verify temporal edges respect valid_at/invalid_at bounds and that invalidated edges are excluded from graph traversal.
- Real user request: `Please validate temporal edge validity on causal_edges and prove invalidateEdge keeps a stale relationship out of getValidEdges results and out of graph walks.`
- Prompt: `Validate temporal edge validity and confirm invalidated edges drop out of graph traversal while valid edges still surface.`
- Expected execution process: Run the documented command sequence, capture transcript and evidence, compare observed output to expected signals, return pass/fail verdict.
- Expected signals: `valid_at` and `invalid_at` columns are present on `causal_edges`; `getValidEdges()` returns only rows with `invalid_at IS NULL`; calling `invalidateEdge()` flips an edge out of the valid set; subsequent graph traversal does not include the invalidated edge in its bonus or ranking calculations.
- Desired user-visible outcome: A concise pass/fail verdict with cited evidence.
- Pass/fail: PASS when temporal columns gate traversal as documented and invalidation removes the edge from downstream signals. FAIL when invalidated edges still surface in traversal output or when the kill-switch flag is ignored.

---

## 3. TEST EXECUTION

### Prompt

```
Validate temporal edge validity and confirm invalidated edges drop out of graph traversal while valid edges still surface.
```

### Commands

1. Create or pick two stable record IDs `<A>` and `<B>` already present in `memory_index`.
2. `memory_causal_link({ sourceId: "<A>", targetId: "<B>", relation: "supports", strength: 0.6 })` to create a valid edge.
3. Inspect the row in `causal_edges`: confirm `valid_at` is populated and `invalid_at` is `NULL`.
4. `memory_search({ query: "<query that traverses A or B>", enableCausalBoost: true, includeTrace: true })` and capture the trace envelope.
5. Invoke `invalidateEdge(<edgeId>)` (via the lib helper or via a direct `causal_edges` update if exposed through a tool).
6. Inspect the row again: confirm `invalid_at` is now populated.
7. Re-run the same `memory_search` from step 4 and capture the trace envelope.
8. Compare the two traces: the invalidated edge should not appear in the graph contribution path, and the bounded bonus for any results connected only through that edge should drop.

### Expected

`valid_at` and `invalid_at` columns are present on `causal_edges`; `getValidEdges()` returns only rows with `invalid_at IS NULL`; calling `invalidateEdge()` flips an edge out of the valid set; subsequent graph traversal does not include the invalidated edge in its bonus or ranking calculations.

### Evidence

- Row dumps from `causal_edges` before and after invalidation
- Two `memory_search` trace envelopes (pre and post invalidation)
- Targeted Vitest run: `cd .opencode/skills/system-spec-kit/mcp-server && npm exec -- vitest run tests/temporal-edges.vitest.ts`

### Pass / Fail

- **Pass**: temporal columns gate traversal as documented, `invalid_at` is set after invalidation, post-invalidation trace does not include the invalidated edge, targeted Vitest exits 0.
- **Fail**: invalidated edges still appear in graph traversal, columns missing, or Vitest fails.

### Failure Triage

Inspect `mcp-server/lib/graph/temporal-edges.ts` for the `invalidateEdge` and `getValidEdges` implementations. Confirm `SPECKIT_TEMPORAL_EDGES` is not disabled in the runtime env. Check `mcp-server/lib/search/causal-boost.ts` for the call site that should filter by `getValidEdges`.

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [graph-signal-activation/temporal-edges.md](../../feature-catalog/graph-signal-activation/temporal-edges.md)
- Source: `.opencode/skills/system-spec-kit/mcp-server/lib/graph/temporal-edges.ts`
- Regression tests: `.opencode/skills/system-spec-kit/mcp-server/tests/temporal-edges.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Graph signal activation
- Playbook ID: 196
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `graph-signal-activation/temporal-edges.md`
