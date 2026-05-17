---
title: "276 -- Deep-loop graph upsert status query"
description: "Validates deep_loop_graph_upsert, deep_loop_graph_status, and deep_loop_graph_query on deterministic validation state."
audited_post_017: true
---

# 276 -- Deep-loop graph upsert status query

## 1. OVERVIEW

Deep-loop graph operations need the same basic write/read coverage as the council graph surface.

---

## 2. SCENARIO CONTRACT

- Objective: Validate deep-loop graph happy path.
- Real user request: `Create a deep-loop validation node, query it, and report graph status.`
- RCAF Prompt: `Use deep_loop_graph_upsert/status/query with a packet-local validation key and verify the node is queryable.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Upsert acknowledges the validation node. - Status reports non-negative node/edge counts. - Query returns the validation node or equivalent cited graph record.
- Desired user-visible outcome: A concise PASS/PARTIAL/FAIL verdict with cited evidence.
- Pass/fail: PASS if all expected signals are present; PARTIAL if the happy path works but an edge signal is missing; FAIL if the tool errors unexpectedly or omits required evidence.

---

## 3. TEST EXECUTION

### Prompt

```
Use deep_loop_graph_upsert/status/query with a packet-local validation key and verify the node is queryable.
```

### Commands

1. `deep_loop_graph_upsert({ nodeId: "playbook-017-deep-loop-smoke", kind: "iteration", attributes: { packet: "017" } })`
2. `deep_loop_graph_status({})`
3. `deep_loop_graph_query({ query: "playbook-017-deep-loop-smoke" })`

### Expected Output / Verification

- Upsert acknowledges the validation node.
- Status reports non-negative node/edge counts.
- Query returns the validation node or equivalent cited graph record.

### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

---

## 4. SOURCE FILES
- `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/`

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 276
- Tools: `deep_loop_graph_upsert`, `deep_loop_graph_status`, `deep_loop_graph_query`
