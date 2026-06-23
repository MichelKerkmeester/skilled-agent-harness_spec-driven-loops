---
title: "018 mcp.json server key rename"
description: "Verify .claude/mcp.json uses mk_code_index key (not system_code_graph) for the code-graph server."
trigger_phrases:
  - "018"
  - "mcp.json server key rename"
  - "system-code-graph manual testing"
importance_tier: "normal"
version: 1.2.0.1
---
# 018 mcp.json server key rename

## 1. OVERVIEW

Verify .claude/mcp.json uses mk_code_index key (not system_code_graph) for the code-graph server.

---

## 2. SCENARIO CONTRACT

- Objective: Verify .claude/mcp.json uses mk_code_index key (not system_code_graph) for the code-graph server.
- Real user request: `Check that .claude/mcp.json has the mk_code_index server key and no system_code_graph key.`
- Operator prompt: `Parse .claude/mcp.json. Show the server keys and the mk_code_index command/args, then return PASS/FAIL.`
- Expected execution process: Read .claude/mcp.json, extract mcpServers keys, verify mk_code_index present and system_code_graph absent.
- Expected signals: mcpServers contains mk_code_index key. mk_code_index command is `node` and args includes `.opencode/bin/mk-code-index-launcher.cjs`. Key system_code_graph does NOT exist.
- Desired user-visible outcome: A concise verdict confirming the mcp.json rename is complete.
- Pass/fail: PASS if mk_code_index key present, system_code_graph absent, command/args correct. FAIL if system_code_graph still present, mk_code_index missing, or command/args wrong.

---

## 3. TEST EXECUTION

### Commands

1. Read `.claude/mcp.json`.
2. Verify `mcpServers` contains `mk_code_index`.
3. Verify `system_code_graph` key does NOT exist.
4. Verify `mk_code_index.command` is `node` and args includes `mk-code-index-launcher.cjs`.

### Expected Output / Verification

mk_code_index key present, system_code_graph absent, command points to node, args points to mk-code-index-launcher.cjs.

### Cleanup

None.

### Variant Scenarios

Compare with .opencode/mcp.json if present for parity.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Post-Rename Infrastructure
- Playbook ID: 018
- Canonical root source: `manual_testing_playbook.md`