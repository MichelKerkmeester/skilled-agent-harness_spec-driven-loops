---
title: "007 detect_changes no inline index"
description: "Verify detect_changes is read-only and blocks stale readiness instead of performing inline indexing."
trigger_phrases:
  - "007"
  - "detect changes no inline index"
  - "system-code-graph manual testing"
importance_tier: "normal"
version: 1.2.0.3
id: detect-changes-no-inline-index
category: detect_changes
stage: routing
expected_workflow_mode: system-code-graph
expected_leaf_resources:
  - workflow_mode: system-code-graph
    leaf_resource_id: manual-testing-playbook/detect-changes/detect-changes-no-inline-index.md
---
# 007 detect_changes no inline index

Prompt: Validate that detect_changes refuses stale graph state and asks for code_graph_scan instead of repairing inline.

## 1. OVERVIEW

Verify detect_changes is read-only and blocks stale readiness instead of performing inline indexing.

---

## 2. SCENARIO CONTRACT

- Objective: Verify detect_changes is read-only and blocks stale readiness instead of performing inline indexing.
- Real user request: `Validate that detect_changes refuses stale graph state and asks for code_graph_scan instead of repairing inline.`
- Operator prompt: `Validate detect_changes against stale graph state in a disposable workspace. Show that it blocks with scan guidance instead of inline indexing, then return PASS/FAIL with diff and JSON evidence.`
- Expected execution process: Run a full scan, modify one tracked file, capture `git diff` and call `detect_changes` with the diff and disposable root.
- Expected signals: The stale call returns `status:"blocked"` and says to run `code_graph_scan`. It must not silently repair via inline indexing.
- Desired user-visible outcome: A concise verdict explaining whether detect_changes preserved read-only behavior.
- Pass/fail: PASS if stale readiness blocks with scan guidance and no inline indexing occurs. FAIL if detect_changes repairs inline, omits the required action or fails to return a structured blocked payload.

---

## 3. TEST EXECUTION

### Commands

1. Run full scan.
2. Modify one tracked file.
3. Capture `git diff`.
4. Call `detect_changes({"diff":"<diff>","rootDir":"$WORK"})`.

### Expected Output / Verification

The stale call returns `status:"blocked"` and says to run `code_graph_scan`. It must not silently repair via inline indexing.

### Cleanup

`rm -rf "$WORK"`

### Variant Scenarios

After an explicit scan, rerun detect_changes and verify `affectedSymbols` or `affectedFiles` is populated.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual-testing-playbook.md` | Root playbook index |
| `../../feature-catalog/feature-catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 007
- Canonical root source: `manual-testing-playbook.md`

---

## 6. EVIDENCE

Command run from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`:

```bash
node .opencode/bin/code-index.cjs code_graph_scan --format json --timeout-ms 120000
```

Observed output:

```text
(no output)

<shell_metadata>
shell tool terminated command after exceeding timeout 120000 ms. If this command is expected to take longer and is not waiting for interactive input, retry with a larger timeout value in milliseconds.
</shell_metadata>
```

Command run from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`:

```bash
node .opencode/bin/code-index.cjs code_graph_scan --format json --timeout-ms 300000
```

Observed output:

```json
{
  "status": "error",
  "error": "backend unavailable: connect ENOENT /tmp/mk-code-index/daemon-ipc.sock",
  "exitCode": 75
}
```

MCP bridge status check:

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

The scenario did not proceed to modifying a tracked file, capturing `git diff`, or calling `detect_changes` because the required initial full scan could not complete.

## 7. PASS/FAIL

BLOCKED: The required full scan precondition is unavailable because the code-index backend socket `/tmp/mk-code-index/daemon-ipc.sock` is absent and the MCP bridge reports `runtime_ready=false`.
