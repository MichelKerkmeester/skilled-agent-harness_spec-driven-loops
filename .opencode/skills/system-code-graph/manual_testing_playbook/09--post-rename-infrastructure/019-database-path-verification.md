---
title: "019 database path verification"
description: "Verify the code-graph SQLite database lives at the correct path with no legacy paths present."
trigger_phrases:
  - "019"
  - "database path verification"
  - "system-code-graph manual testing"
importance_tier: "normal"
---
# 019 database path verification

## 1. OVERVIEW

Verify the code-graph SQLite database lives at the correct active path (`.opencode/.spec-kit/code-graph/database/code-graph.sqlite`) and no legacy database paths are active.

---

## 2. SCENARIO CONTRACT

- Objective: Verify the code-graph SQLite database lives at the canonical path and no legacy paths exist.
- Real user request: `Confirm the code-graph.sqlite is at the documented path and no legacy database files remain active.`
- Operator prompt: `Check the canonical database path. Show file size and absence of legacy paths, then return PASS/FAIL.`
- Expected execution process: Check `.opencode/.spec-kit/code-graph/database/code-graph.sqlite` exists and is non-empty. Verify code_graph_status reports consistent dbFileSize.
- Expected signals: Database file exists at canonical path, is non-zero size, status reports matching dbFileSize, no legacy path references.
- Desired user-visible outcome: A concise verdict confirming the database path is correct.
- Pass/fail: PASS if database at canonical path exists, is non-zero, and status confirms. FAIL if database missing, empty, or legacy paths are active.

---

## 3. TEST EXECUTION

### Commands

1. `ls -la .opencode/.spec-kit/code-graph/database/code-graph.sqlite`.
2. Call `code_graph_status({})` and verify `dbFileSize` matches approximately.
3. Verify no legacy `.opencode/skills/system_code_graph/`, `.opencode/system-code-graph/database/`, or `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` paths are active.

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
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Post-Rename Infrastructure
- Playbook ID: 019
- Canonical root source: `manual_testing_playbook.md`
