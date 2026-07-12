---
title: "004 code_graph_scan full"
description: "Confirm explicit full scan reparses post-exclude candidates and can persist edge distribution baseline."
trigger_phrases:
  - "004"
  - "code graph scan full"
  - "system-code-graph manual testing"
importance_tier: "normal"
version: 1.2.0.3
---
# 004 code_graph_scan full

## 1. OVERVIEW

Confirm explicit full scan reparses post-exclude candidates and can persist edge distribution baseline.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm explicit full scan reparses post-exclude candidates and can persist edge distribution baseline.
- Real user request: `Run a full code_graph_scan and confirm it reparses candidates, records graph counts and persists the edge baseline when requested.`
- Operator prompt: `Run a full code_graph_scan with baseline persistence in a disposable workspace. Show full-scan mode, graph counts, readiness and detector provenance, then return PASS/FAIL.`
- Expected execution process: Call `code_graph_scan({"rootDir":"$WORK","incremental":false,"persistBaseline":true})` in a disposable copy and inspect the returned payload.
- Expected signals: Payload shows `fullScanRequested:true`, `effectiveIncremental:false`, nonzero graph counts, readiness with `inlineIndexPerformed:true` and detector provenance summary.
- Desired user-visible outcome: A concise verdict explaining whether explicit full scan and baseline persistence behaved as documented.
- Pass/fail: PASS if all full-scan and baseline evidence appears. FAIL if the scan runs incrementally, returns empty graph counts, omits readiness or lacks detector provenance.

---

## 3. TEST EXECUTION

### Commands

Call `code_graph_scan({"rootDir":"$WORK","incremental":false,"persistBaseline":true})` in a disposable copy.

### Expected Output / Verification

Payload shows `fullScanRequested:true`, `effectiveIncremental:false`, nonzero graph counts, readiness with `inlineIndexPerformed:true` and detector provenance summary.

### Evidence

BLOCKED before `code_graph_scan` execution.

Scenario file read output showed no `Preconditions`, `Evidence`, or `Pass/Fail` section in the 64-line file:

```text
31: ## 3. TEST EXECUTION
32: 
33: ### Commands
34: 
35: Call `code_graph_scan({"rootDir":"$WORK","incremental":false,"persistBaseline":true})` in a disposable copy.
36: 
37: ### Expected Output / Verification
38: 
39: Payload shows `fullScanRequested:true`, `effectiveIncremental:false`, nonzero graph counts, readiness with `inlineIndexPerformed:true` and detector provenance summary.
40: 
41: ### Cleanup
42: 
43: `rm -rf "$WORK"`
44: 
45: ### Variant Scenarios
```

The live plugin status showed the MCP bridge was not usable:

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

The code-graph database policy confirms `persistBaseline:true` scan execution would persist graph state unless an isolated in-workspace DB override is created:

````text
46: The code graph database lives SKILL-LOCAL, owned by and co-located with its skill:
47: 
48: ```text
49: .opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite
50: ```
75: The override path `SPECKIT_CODE_GRAPH_DB_DIR` is allowed for tests and disposable CI runs only. The launcher enforces a standalone-storage guard: the override must resolve inside the workspace root. External absolute paths are rejected at startup. See `INSTALL_GUIDE.md` §7 (Database and Maintainer Mode) for the canonical configuration.
````

The requested execution constraints conflict with the scenario's required commands:

```text
BANNED OPERATIONS
- Do NOT modify, create, or delete any file OTHER than the single scenario file named below.

ALLOWED WRITE PATHS
- .opencode/skills/system-code-graph/manual_testing_playbook/manual_scan_verify_status/code_graph_scan_full.md (this file only)
```

The scenario's command requires a disposable copy and `persistBaseline:true`, which cannot be performed without creating and mutating scan/database artifacts outside the only allowed write path. The cleanup command ``rm -rf "$WORK"`` also cannot be run under the same write/delete restriction unless `$WORK` creation and deletion outside the scenario file are permitted.

### Pass/Fail

BLOCKED - Required scenario commands are incompatible with the allowed write paths: executing the full scan with baseline persistence requires creating/mutating disposable workspace or code-graph database artifacts outside this scenario file, and the file has no Preconditions section defining a pre-existing safe `$WORK` sandbox.

### Cleanup

`rm -rf "$WORK"`

### Variant Scenarios

Add an excludeGlobs override and verify excluded paths disappear after the full scan.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 004
- Canonical root source: `manual_testing_playbook.md`
