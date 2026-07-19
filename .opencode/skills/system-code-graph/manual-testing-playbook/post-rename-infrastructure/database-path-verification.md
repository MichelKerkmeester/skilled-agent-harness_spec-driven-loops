---
title: "019 database path verification"
description: "Verify the code-graph SQLite database lives at the correct path with no legacy paths present."
trigger_phrases:
  - "019"
  - "database path verification"
  - "system-code-graph manual testing"
importance_tier: "normal"
version: 1.2.0.3
id: database-path-verification
category: post_rename_infrastructure
stage: routing
expected_workflow_mode: system-code-graph
expected_leaf_resources:
  - workflow_mode: system-code-graph
    leaf_resource_id: manual-testing-playbook/post-rename-infrastructure/database-path-verification.md
---
# 019 database path verification

Prompt: Confirm the code-graph.sqlite is at the documented path and no legacy database files remain active.

## 1. OVERVIEW

Verify the code-graph SQLite database lives at the correct active path (`.opencode/skills/system-code-graph/mcp-server/database/code-graph.sqlite`) and no legacy database paths are active.

---

## 2. SCENARIO CONTRACT

- Objective: Verify the code-graph SQLite database lives at the canonical path and no legacy paths exist.
- Real user request: `Confirm the code-graph.sqlite is at the documented path and no legacy database files remain active.`
- Operator prompt: `Check the canonical database path. Show file size and absence of legacy paths, then return PASS/FAIL.`
- Expected execution process: Check `.opencode/skills/system-code-graph/mcp-server/database/code-graph.sqlite` exists and is non-empty. Verify code_graph_status reports consistent dbFileSize.
- Expected signals: Database file exists at canonical path, is non-zero size, status reports matching dbFileSize, no legacy path references.
- Desired user-visible outcome: A concise verdict confirming the database path is correct.
- Pass/fail: PASS if database at canonical path exists, is non-zero, and status confirms. FAIL if database missing, empty, or legacy paths are active.

---

## 3. TEST EXECUTION

### Commands

1. `ls -la .opencode/skills/system-code-graph/mcp-server/database/code-graph.sqlite`.
2. Call `code_graph_status({})` and verify `dbFileSize` matches approximately.
3. Verify no legacy `.opencode/skills/system_code_graph/`, `.opencode/system-code-graph/database/`, or `.opencode/skills/system-code-graph/mcp-server/database/code-graph.sqlite` paths are active.

### Expected Output / Verification

Database file at canonical path exists, is >0 bytes, status dbFileSize approximately matches.

### Cleanup

None.

### Variant Scenarios

Check write accessibility by verifying lastPersistedAt is recent.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual-testing-playbook.md` | Root playbook index |
| `../../feature-catalog/feature-catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Post-Rename Infrastructure
- Playbook ID: 019
- Canonical root source: `manual-testing-playbook.md`

---

## 6. EVIDENCE

### Command 1

`ls -la .opencode/skills/system-code-graph/mcp-server/database/code-graph.sqlite`

```text
-rw-r--r--@ 1 michelkerkmeester  staff  103501824 Jun 29 14:46 .opencode/skills/system-code-graph/mcp-server/database/code-graph.sqlite
```

### Command 2

`code_graph_status({})`

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
bridge_path=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp-server/plugin-bridges/mk-code-graph-bridge.mjs
last_runtime_error=Bridge skipped: SOCKET_ABSENT (exit=75); plugin injection will no-op
cache_entries=0
cache=empty
```

Warm CLI fallback attempted for code-graph status:

`node .opencode/bin/code-index.cjs code-graph-status --format json --timeout-ms 3000 --warm-only`

```json
{
  "status": "error",
  "error": "backend unavailable: connect ENOENT /tmp/mk-code-index/daemon-ipc.sock",
  "exitCode": 75
}
```

### Command 3

`Glob: .opencode/skills/system_code_graph/**`

```text
No files found
```

`Glob: .opencode/system-code-graph/database/**`

```text
No files found
```

`Glob: .opencode/skills/system-code-graph/mcp-server/database/code-graph.sqlite`

```text
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp-server/database/code-graph.sqlite
```

---

## 7. PASS/FAIL

BLOCKED: The canonical database file exists and is non-empty, and the checked legacy paths were absent, but `code_graph_status({})` did not report `dbFileSize` because the code-graph runtime socket was absent (`SOCKET_ABSENT`, fallback `exitCode: 75`).
