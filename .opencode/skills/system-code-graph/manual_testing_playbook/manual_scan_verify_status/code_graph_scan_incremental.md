---
title: "003 code_graph_scan incremental"
description: "Confirm incremental scan skips fresh files and prunes deleted tracked files."
trigger_phrases:
  - "003"
  - "code graph scan incremental"
  - "system-code-graph manual testing"
importance_tier: "normal"
version: 1.2.0.3
id: code-graph-scan-incremental
category: manual_scan_verify_status
stage: routing
expected_workflow_mode: system-code-graph
expected_leaf_resources:
  - workflow_mode: system-code-graph
    leaf_resource_id: manual_testing_playbook/manual_scan_verify_status/code_graph_scan_incremental.md
---
# 003 code_graph_scan incremental

Prompt: Validate that incremental code_graph_scan skips unchanged files and removes deleted tracked files from graph results.

## 1. OVERVIEW

Confirm incremental scan skips fresh files and prunes deleted tracked files.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm incremental scan skips fresh files and prunes deleted tracked files.
- Real user request: `Validate that incremental code_graph_scan skips unchanged files and removes deleted tracked files from graph results.`
- Operator prompt: `Run incremental code_graph_scan checks in a disposable workspace. Show fresh-file skipping and deleted-file pruning, then return PASS/FAIL with scan payload and query evidence.`
- Expected execution process: Run a full scan, delete one indexed fixture file, run `code_graph_scan` with `incremental:true` and inspect `filesSkipped`, `filesIndexed` and readiness fields.
- Expected signals: Incremental scan returns `status:"ok"`, reports skipped or fresh files and no deleted file remains in graph query or status evidence.
- Desired user-visible outcome: A concise verdict explaining whether incremental scanning preserved fresh work and pruned deleted entries.
- Pass/fail: PASS if skipped/fresh counts and deleted-file pruning are visible. FAIL if the deleted file remains, fresh files are reindexed unnecessarily without explanation or readiness is missing.

---

## 3. TEST EXECUTION

### Commands

1. Run `code_graph_scan({"rootDir":"$WORK","incremental":false})`.
2. Delete one indexed fixture file.
3. Run `code_graph_scan({"rootDir":"$WORK","incremental":true})`.
4. Inspect returned `filesSkipped`, `filesIndexed` and readiness.

### Expected Output / Verification

Incremental scan returns `status:"ok"`, reports skipped/fresh files and no deleted file remains in graph query/status evidence.

### Evidence

`mk_code_graph_status` output:

```text
plugin_id=mk-code-graph
cache_ttl_ms=5000
spec_folder=auto
resume_mode=minimal
messages_transform_enabled=true
messages_transform_mode=schema_aligned
runtime_ready=false
node_binary=node
bridge_timeout_ms=15000
bridge_path=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs
last_runtime_error=Bridge skipped: SOCKET_ABSENT (exit=75); plugin injection will no-op
cache_entries=0
cache=empty
```

`node .opencode/bin/code-index.cjs code-graph-scan --help` output:

```text
code-index code_graph_scan

Description:
  [L7:Maintenance] Scan workspace files and build structural code graph index (functions, classes, imports, calls). Supports incremental re-indexing via content hash. Token Budget: 1000.

Aliases:
  code_graph_scan, code-graph-scan, codeGraphScan

Input schema:
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "rootDir": {
      "type": "string",
      "description": "Root directory to scan (default: workspace root)"
    },
    "includeGlobs": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Glob patterns for files to include"
    },
    "excludeGlobs": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Additional glob patterns to exclude"
    },
    "incremental": {
      "type": "boolean",
      "default": true,
      "description": "Skip unchanged files (default: true)"
    },
    "includeSkills": {
      "oneOf": [
        {
          "type": "boolean"
        },
        {
          "type": "array",
          "items": {
            "type": "string",
            "pattern": "^sk-[a-z0-9-]+$"
          }
        }
      ],
      "default": false,
      "description": "Include all .opencode/skills files with true, or only named sk-* skills with an array; default false keeps end-user code scope"
    },
    "includeAgents": {
      "type": "boolean",
      "default": false,
      "description": "Include .opencode/agent files in this scan; default false keeps end-user code scope"
    },
    "includeCommands": {
      "type": "boolean",
      "default": false,
      "description": "Include .opencode/command files in this scan; default false keeps end-user code scope"
    },
    "includeSpecs": {
      "type": "boolean",
      "default": false,
      "description": "Include .opencode/specs files in this scan; default false keeps end-user code scope"
    },
    "includePlugins": {
      "type": "boolean",
      "default": false,
      "description": "Include .opencode/plugins files in this scan; default false keeps end-user code scope"
    },
    "verify": {
      "type": "boolean",
      "default": false,
      "description": "Run the gold-query verification battery after an explicit full scan (default: false)"
    },
    "persistBaseline": {
      "type": "boolean",
      "default": false,
      "description": "Persist the current edge-distribution baseline after a full scan even when one already exists"
    },
    "forceZeroNodeReset": {
      "type": "boolean",
      "default": false,
      "description": "Allow an explicit destructive reset when a full scan produces zero indexed nodes over a populated graph"
    },
    "forceScopeChange": {
      "type": "boolean",
      "default": false,
      "description": "Allow replacing a populated code graph with a full scan from a different scope fingerprint"
    }
  },
  "required": []
}
```

`node .opencode/bin/code-index.cjs code_graph_scan --json '{"rootDir":"$WORK","incremental":false}' --format json --timeout-ms 3000` output:

```json
{
  "status": "error",
  "error": "backend unavailable: connect ENOENT /tmp/mk-code-index/daemon-ipc.sock",
  "exitCode": 75
}
```

Command 2 (`Delete one indexed fixture file`) was not executed because `$WORK` is not defined by the scenario and this run is constrained by the explicit allowed write path to modify/delete no file other than this scenario file.
Commands 3-4 were not executed because command 1 did not produce an indexed disposable workspace to mutate or inspect.

### Pass/Fail

BLOCKED: The required code graph backend was unavailable (`connect ENOENT /tmp/mk-code-index/daemon-ipc.sock`), and the scenario does not define `$WORK` while the run's allowed write paths prohibit deleting any fixture file outside this scenario file.

### Cleanup

`rm -rf "$WORK"`

### Variant Scenarios

Run with no changes and verify most files are skipped.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 003
- Canonical root source: `manual_testing_playbook.md`
