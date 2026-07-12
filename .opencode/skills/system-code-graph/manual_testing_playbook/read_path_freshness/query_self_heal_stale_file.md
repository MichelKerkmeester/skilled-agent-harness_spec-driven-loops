---
title: "002 query self-heal stale file"
description: "Validate the code_graph_query handler self-heal path and full-scan refusal behavior."
trigger_phrases:
  - "002"
  - "query self heal stale file"
  - "system-code-graph manual testing"
importance_tier: "normal"
version: 1.2.0.3
---
# 002 query self-heal stale file

## 1. OVERVIEW

Validate the code_graph_query handler self-heal path and full-scan refusal behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Validate the code_graph_query handler self-heal path and full-scan refusal behavior.
- Real user request: `Check that code_graph_query self-heals a single stale file but refuses broad stale state until an explicit scan runs.`
- Operator prompt: `Validate code_graph_query against single-file and broad stale states in a disposable workspace. Show the self-heal and blocked-scan paths, then return PASS/FAIL with JSON excerpts.`
- Expected execution process: Run a full scan in a disposable copy, modify one tracked file and call `code_graph_query` for outline, then modify more than 50 tracked files and call `code_graph_query` again.
- Expected signals: Single-file stale state is repaired or answered with readiness metadata. Broad stale state returns a blocked payload with `requiredAction:"code_graph_scan"` or equivalent fallback decision.
- Desired user-visible outcome: A concise verdict distinguishing the allowed self-heal path from the blocked broad-stale path.
- Pass/fail: PASS if single-file stale state self-heals and broad stale state blocks with scan guidance. FAIL if broad state is silently repaired, single-file readiness metadata is missing or the handler crashes.

---

## 3. TEST EXECUTION

### Commands

1. Run a full scan in a disposable copy.
2. Modify one tracked file and call `code_graph_query` for outline.
3. Modify more than 50 tracked files and call `code_graph_query` again.

### Expected Output / Verification

Single-file stale state is repaired or answered with readiness metadata. Broad stale state returns a blocked payload with `requiredAction:"code_graph_scan"` or equivalent fallback decision.

### Evidence

Scenario commands were not executed because the scenario's Commands section requires writes outside the allowed path:

```text
35: 1. Run a full scan in a disposable copy.
36: 2. Modify one tracked file and call `code_graph_query` for outline.
37: 3. Modify more than 50 tracked files and call `code_graph_query` again.
```

The user instruction for this execution explicitly constrained writes to the single scenario file:

```text
BANNED OPERATIONS
- Do NOT modify, create, or delete any file OTHER than the single scenario file named below.
- Do NOT touch any other manual testing playbook scenario file.

ALLOWED WRITE PATHS
- .opencode/skills/system-code-graph/manual_testing_playbook/read-path-freshness/query-self-heal-stale-file.md (this file only)
```

Because a disposable copy, tracked-file edits, and cleanup would create, modify, and delete files outside `.opencode/skills/system-code-graph/manual_testing_playbook/read-path-freshness/query-self-heal-stale-file.md`, the preconditions for safe execution under the supplied constraints were not met.

### Pass/Fail

BLOCKED - Scenario execution requires creating/modifying/deleting files outside the only allowed write path.

### Cleanup

`rm -rf "$WORK"`

### Variant Scenarios

Run the same broad stale fixture through `code_graph_context` to compare blocked envelope parity.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 002
- Canonical root source: `manual_testing_playbook.md`
