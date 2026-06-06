---
title: "OP-003 Unavailable Daemon"
description: "H5 operator playbook for corrupted SQLite and rebuild-from-source recovery."
trigger_phrases:
  - "op-003"
  - "unavailable daemon"
  - "unavailable"
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
- Feature file path: 04--operator-h5/unavailable-daemon.md
