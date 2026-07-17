---
title: "018 mcp.json server key rename"
description: "Verify .claude/mcp.json uses mk_code_index key (not system_code_graph) for the code-graph server."
trigger_phrases:
  - "018"
  - "mcp.json server key rename"
  - "system-code-graph manual testing"
importance_tier: "normal"
version: 1.2.0.1
id: mcp-json-server-key-rename
category: post_rename_infrastructure
stage: routing
expected_workflow_mode: system-code-graph
expected_leaf_resources:
  - workflow_mode: system-code-graph
    leaf_resource_id: manual_testing_playbook/post_rename_infrastructure/mcp_json_server_key_rename.md
---
# 018 mcp.json server key rename

Prompt: Check that .claude/mcp.json has the mk_code_index server key and no system_code_graph key.

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

---

## 6. EVIDENCE

Read `.claude/mcp.json` in full. Relevant observed values:

```json
{
  "mcpServers": {
    "sequential_thinking": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-sequential-thinking@2025.12.18"
      ]
    },
    "mk-spec-memory": {
      "command": "node",
      "args": [
        ".opencode/bin/mk-spec-memory-launcher.cjs"
      ]
    },
    "mk_skill_advisor": {
      "command": "node",
      "args": [
        ".opencode/bin/mk-skill-advisor-launcher.cjs"
      ]
    },
    "mk_code_index": {
      "command": "node",
      "args": [
        ".opencode/bin/mk-code-index-launcher.cjs"
      ]
    },
    "code_mode": {
      "command": "/Users/michelkerkmeester/.nvm/versions/node/v24.9.0/bin/node",
      "args": [
        ".opencode/skills/mcp-code-mode/mcp_server/dist/index.js"
      ]
    }
  }
}
```

Variant scenario check: `.opencode/mcp.json` was not present.

Command run:

```bash
node -e 'const fs=require("fs"); const data=JSON.parse(fs.readFileSync(".claude/mcp.json","utf8")); const servers=data.mcpServers||{}; console.log("mcpServers keys:", Object.keys(servers).join(", ")); console.log("mk_code_index present:", Object.prototype.hasOwnProperty.call(servers,"mk_code_index")); console.log("system_code_graph present:", Object.prototype.hasOwnProperty.call(servers,"system_code_graph")); console.log("mk_code_index.command:", servers.mk_code_index && servers.mk_code_index.command); console.log("mk_code_index.args:", JSON.stringify(servers.mk_code_index && servers.mk_code_index.args)); console.log("mk-code-index-launcher.cjs arg present:", Array.isArray(servers.mk_code_index && servers.mk_code_index.args) && servers.mk_code_index.args.some((arg)=>arg.includes("mk-code-index-launcher.cjs")));'
```

Actual output:

```text
mcpServers keys: sequential_thinking, mk-spec-memory, mk_skill_advisor, mk_code_index, code_mode
mk_code_index present: true
system_code_graph present: false
mk_code_index.command: node
mk_code_index.args: [".opencode/bin/mk-code-index-launcher.cjs"]
mk-code-index-launcher.cjs arg present: true
```

---

## 7. PASS/FAIL

PASS
