---
title: "OP-003 Unavailable Daemon"
description: "H5 operator playbook for corrupted SQLite and rebuild-from-source recovery."
trigger_phrases:
  - "op-003"
  - "unavailable daemon"
  - "unavailable"
version: 0.8.0.13
---

# OP-003 Unavailable Daemon

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate the recovery path when the native advisor graph state is unavailable because SQLite is corrupt or unreadable.

---

## 2. SCENARIO CONTRACT

- Run corruption simulation only in a disposable copy.
- The operator has a backup of the original database in that copy.
- Rebuild-from-source tools are available.

---

## 3. TEST EXECUTION

1. In a disposable copy, replace the copied `skill-graph.sqlite` with invalid bytes.
2. Detect:

```text
advisor_status({"workspaceRoot":"/tmp/path-to-copy"})
```

3. Confirm `freshness: "unavailable"` or trust reason indicating database failure.
4. Trigger rebuild:

```text
skill_graph_scan({}) from a trusted operator/daemon context
advisor_status({"workspaceRoot":"/tmp/path-to-copy"})
```

5. If MCP scan is unavailable, restart the MCP server after deleting only the corrupt copied database.
6. Negative auth check: call `skill_graph_scan({})` from an untrusted public MCP context and confirm the response is `status: "error"`, `code: "UNTRUSTED_CALLER"`, with no graph mutation.

### Expected Signals

- Unavailable state is prompt-safe and does not crash the runtime.
- Native `advisor_recommend` either fails open or returns an explicit unavailable/absent trust state.
- Rebuild-from-source recreates a usable graph and restores `live` or `stale` freshness.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Runtime crashes on corrupt DB | MCP server exits or throws raw SQLite stack to user | Block release. Recovery must fail open. |
| Rebuild uses stale JSON only | Status remains absent/unavailable after scan | Inspect rebuild-from-source path and file permissions. |
| Live DB corrupted | Real repo status remains unavailable | Restore from backup or rebuild immediately before other tests. |
| Untrusted scan mutates graph | `skill_graph_scan({})` succeeds without trusted context | Block release. Trusted-caller gate must reject before indexing. |

---

## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/mcp_server/lib/freshness/rebuild-from-source.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lifecycle.ts`

---

## 5. SOURCE METADATA

- Group: Operator H5
- Playbook ID: OP-003
- Canonical root source: manual_testing_playbook.md
- Feature file path: operator-h5/unavailable-daemon.md

---

## 6. EVIDENCE

- Scenario file read in full: `Read` returned `(End of file - total 80 lines)`.
- The file contains no explicit `Preconditions` heading, no explicit `Commands` heading, no existing `Evidence` heading, and no existing `Pass/Fail` heading in lines 1-80.
- Required execution steps observed in the file:

````text
33: 1. In a disposable copy, replace the copied `skill-graph.sqlite` with invalid bytes.
34: 2. Detect:
35: 
36: ```text
37: advisor_status({"workspaceRoot":"/tmp/path-to-copy"})
38: ```
39: 
40: 3. Confirm `freshness: "unavailable"` or trust reason indicating database failure.
41: 4. Trigger rebuild:
42: 
43: ```text
44: skill_graph_scan({}) from a trusted operator/daemon context
45: advisor_status({"workspaceRoot":"/tmp/path-to-copy"})
46: ```
47: 
48: 5. If MCP scan is unavailable, restart the MCP server after deleting only the corrupt copied database.
49: 6. Negative auth check: call `skill_graph_scan({})` from an untrusted public MCP context and confirm the response is `status: "error"`, `code: "UNTRUSTED_CALLER"`, with no graph mutation.
````

- Execution was blocked before creating a disposable copy or replacing `skill-graph.sqlite` because the operator instruction for this run says:

```text
Do NOT modify, create, or delete any file OTHER than the single scenario file named below.
```

- The scenario's own execution step 1 requires creating and corrupting a copied `skill-graph.sqlite`, and step 5 may require deleting the corrupt copied database; those writes are outside the only allowed write path:

```text
.opencode/skills/system-skill-advisor/manual_testing_playbook/operator_h5/unavailable_daemon.md (this file only)
```

## 7. PASS/FAIL

BLOCKED - The scenario requires creating and corrupting a disposable SQLite database copy, but this run permits writes only to this scenario file.
