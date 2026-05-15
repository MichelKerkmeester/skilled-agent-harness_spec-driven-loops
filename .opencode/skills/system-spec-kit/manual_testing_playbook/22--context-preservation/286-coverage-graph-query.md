---
title: "286 -- Coverage graph query"
description: "Manual scenario for validating deep_loop_graph_query read paths."
---

# 286 -- Coverage graph query

## 1. OVERVIEW

This scenario validates coverage graph query read paths for `286`. It focuses on confirming that `deep_loop_graph_query` reads namespaced deep-loop coverage graph state and returns coverage-gap results or a clean empty state.

### Why This Matters

Deep research and review loops depend on namespace isolation when reading coverage state. This scenario catches cross-namespace leakage, malformed empty-state responses, and unbounded result payloads that would make loop coverage evidence unreliable.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm coverage graph read queries are structured and namespace-bound.
- Real user request: `Please validate Coverage graph query against the documented validation surface and tell me whether the expected signals are present: Tool response includes coverage-gap results or a clean empty state.`
- Prompt: `Validate coverage graph query results and clean empty-state behavior against the documented validation surface.`
- Expected execution process: Execute the documented validation request against the documented validation surface, capture the response and evidence, compare it against the expected signals, and return the pass/fail verdict.
- Expected signals: Tool response includes coverage-gap results or a clean empty state
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS when the handler returns a bounded structured response and does not cross namespaces.

---

## 3. TEST EXECUTION

### Prompt

```
Validate coverage graph query results and clean empty-state behavior against the documented validation surface.
```

### Commands

1. Call `deep_loop_graph_query` for a namespaced research or review coverage query.
2. Capture the response payload.
3. Confirm the response includes coverage-gap results or a clean empty state and stays within the requested namespace.

### Expected

The coverage query returns a bounded structured response without crossing namespaces.

### Evidence

Tool response transcript showing coverage-gap results or an explicit empty-state payload.

### Pass / Fail

- **Pass**: The handler returns bounded structured results or a clean empty state and does not cross namespaces.
- **Fail**: The handler errors, leaks another namespace, or returns an unstructured empty response.

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 286
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation/286-coverage-graph-query.md`
