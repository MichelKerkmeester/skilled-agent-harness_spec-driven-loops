---
title: "274 -- Council graph upsert status query"
description: "Validates council_graph_upsert, council_graph_status, and council_graph_query on a deterministic packet-local node."
audited_post_017: true
---

# 274 -- Council graph upsert status query

## 1. OVERVIEW

Council graph tools had weak playbook coverage; this scenario exercises the basic write/read loop with a disposable key.

---

## 2. SCENARIO CONTRACT

- Objective: Validate council graph happy path without touching production memories.
- Real user request: `Create a council graph validation node, query it, and report graph status.`
- RCAF Prompt: `Use council_graph_upsert/status/query with a packet-local validation key and verify the node is queryable.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Upsert acknowledges the validation node. - Status reports non-negative node/edge counts. - Query returns the validation node or an equivalent cited graph record.
- Desired user-visible outcome: A concise PASS/PARTIAL/FAIL verdict with cited evidence.
- Pass/fail: PASS if all expected signals are present; PARTIAL if the happy path works but an edge signal is missing; FAIL if the tool errors unexpectedly or omits required evidence.

---

## 3. TEST EXECUTION

### Prompt

```
Use council_graph_upsert/status/query with a packet-local validation key and verify the node is queryable.
```

### Commands

1. `council_graph_upsert({ nodeId: "playbook-017-council-smoke", kind: "validation", attributes: { packet: "017" } })`
2. `council_graph_status({})`
3. `council_graph_query({ query: "playbook-017-council-smoke" })`

### Expected Output / Verification

- Upsert acknowledges the validation node.
- Status reports non-negative node/edge counts.
- Query returns the validation node or an equivalent cited graph record.

### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

---

## 4. SOURCE FILES
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/`

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 274
- Tools: `council_graph_upsert`, `council_graph_status`, `council_graph_query`
