---
title: "016 MCP tool manifest post-rename"
description: "Verify the mk-code-index launcher exposes exactly 8 tools with correct names after the system_code_graph rename."
trigger_phrases:
  - "016"
  - "mcp tool manifest post rename"
  - "system-code-graph manual testing"
importance_tier: "normal"
---
# 016 MCP tool manifest post-rename

## 1. OVERVIEW

Verify the mk-code-index launcher exposes exactly 8 tools with correct names after the system_code_graph rename.

---

## 2. SCENARIO CONTRACT

- Objective: Verify the mk-code-index launcher exposes exactly 8 tools with correct names after the system_code_graph rename.
- Real user request: `Confirm that the mk-code-index MCP server advertises the expected 8 tools with correct tool IDs after renaming from system_code_graph.`
- Operator prompt: `Send initialize + tools/list JSON-RPC to the mk-code-index launcher. Show the tool count and name list, then return PASS/FAIL.`
- Expected execution process: Start the launcher via stdio, send initialize + initialized notification + tools/list, capture the response.
- Expected signals: Exactly 8 tools: code_graph_scan, code_graph_query, code_graph_classify_query_intent, code_graph_status, code_graph_context, code_graph_verify, code_graph_apply, detect_changes, code_graph_status, code_graph_scan, code_graph_verify. No legacy system_code_graph tool names.
- Desired user-visible outcome: A concise verdict confirming the tool manifest matches the post-rename spec.
- Pass/fail: PASS if 8 tools with matching names and no legacy names. FAIL if tool count differs, names contain system_code_graph, or the launcher fails to start.

---

## 3. TEST EXECUTION

### Commands

1. Send `{"jsonrpc":"2.0","id":1,"method":"initialize",...}` to launcher stdio.
2. Send `{"jsonrpc":"2.0","method":"notifications/initialized"}`.
3. Send `{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}`.
4. Capture tool count and name list.

### Expected Output / Verification

Exactly 8 tools: code_graph_scan, code_graph_query, code_graph_classify_query_intent, code_graph_status, code_graph_context, code_graph_verify, code_graph_apply, detect_changes, code_graph_status, code_graph_scan, code_graph_verify. No system_code_graph names.

### Cleanup

None.

### Variant Scenarios

Verify no tool description references legacy server name.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: MCP Tool Surface
- Playbook ID: 016
- Canonical root source: `manual_testing_playbook.md`
