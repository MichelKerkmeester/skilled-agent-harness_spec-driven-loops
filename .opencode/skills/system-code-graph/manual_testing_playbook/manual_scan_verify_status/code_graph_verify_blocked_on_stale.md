---
title: "005 code_graph_verify blocked on stale"
description: "Prove code_graph_verify refuses stale graph state before executing the gold battery."
trigger_phrases:
  - "005"
  - "code graph verify blocked on stale"
  - "system-code-graph manual testing"
importance_tier: "normal"
version: 1.2.0.3
id: code-graph-verify-blocked-on-stale
category: manual_scan_verify_status
stage: routing
expected_workflow_mode: system-code-graph
expected_leaf_resources:
  - workflow_mode: system-code-graph
    leaf_resource_id: manual_testing_playbook/manual_scan_verify_status/code_graph_verify_blocked_on_stale.md
---
# 005 code_graph_verify blocked on stale

Prompt: Confirm code_graph_verify blocks on stale graph state, then passes through to verification after an explicit rescan.

## 1. OVERVIEW

Prove code_graph_verify refuses stale graph state before executing the gold battery.

---

## 2. SCENARIO CONTRACT

- Objective: Prove code_graph_verify refuses stale graph state before executing the gold battery.
- Real user request: `Confirm code_graph_verify blocks on stale graph state, then passes through to verification after an explicit rescan.`
- Operator prompt: `Validate code_graph_verify around stale graph state. Show the blocked payload before rescan and the verification payload after explicit scan, then return PASS/FAIL.`
- Expected execution process: Run a full scan, modify a tracked source file, call `code_graph_verify`, then run an explicit full `code_graph_scan` and call verify again.
- Expected signals: First verify returns `status:"blocked"` with readiness. Second verify returns `status:"ok"` with `result.passed` and pass-rate fields.
- Desired user-visible outcome: A concise verdict explaining whether verify protects against stale input and resumes after scan.
- Pass/fail: PASS if stale verify blocks and post-scan verify returns ok with pass-rate data. FAIL if verify runs on stale state, remains blocked after rescan or omits readiness/pass-rate fields.

---

## 3. TEST EXECUTION

### Commands

1. Run full scan.
2. Modify a tracked source file.
3. Call `code_graph_verify({"rootDir":"$WORK"})`.
4. Run `code_graph_scan({"rootDir":"$WORK","incremental":false})` and call verify again.

### Expected Output / Verification

First verify returns `status:"blocked"` with readiness. Second verify returns `status:"ok"` with `result.passed` and pass-rate fields.

### Evidence

BLOCKED before command execution.

Scenario file read output showed no `Preconditions`, `Evidence`, or `Pass/Fail` section in the 67-line file:

```text
31: ## 3. TEST EXECUTION
32: 
33: ### Commands
34: 
35: 1. Run full scan.
36: 2. Modify a tracked source file.
37: 3. Call `code_graph_verify({"rootDir":"$WORK"})`.
38: 4. Run `code_graph_scan({"rootDir":"$WORK","incremental":false})` and call verify again.
39: 
40: ### Expected Output / Verification
41: 
42: First verify returns `status:"blocked"` with readiness. Second verify returns `status:"ok"` with `result.passed` and pass-rate fields.
43: 
44: ### Cleanup
45: 
46: `rm -rf "$WORK"`
47: 
48: ### Variant Scenarios
```

The requested execution constraints conflict with the scenario's required commands:

```text
BANNED OPERATIONS
- Do NOT modify, create, or delete any file OTHER than the single scenario file named below.

ALLOWED WRITE PATHS
- .opencode/skills/system-code-graph/manual_testing_playbook/manual_scan_verify_status/code_graph_verify_blocked_on_stale.md (this file only)
```

The scenario's command step `2. Modify a tracked source file.` cannot be performed without modifying a file outside the only allowed write path. The cleanup command ``rm -rf "$WORK"`` also cannot be run under the same write/delete restriction unless `$WORK` creation and deletion outside the scenario file are permitted.

### Pass/Fail

BLOCKED - Required scenario preconditions/commands are incompatible with the allowed write paths: executing the scenario requires modifying a tracked source file outside this scenario file, and the file has no Preconditions section defining a safe `$WORK` sandbox.

### Cleanup

`rm -rf "$WORK"`

### Variant Scenarios

Run with `allowInlineIndex:true` and a single stale file to test the selective repair option.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 005
- Canonical root source: `manual_testing_playbook.md`
