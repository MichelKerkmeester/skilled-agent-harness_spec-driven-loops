---
title: "OP-001 Degraded Daemon"
description: "H5 operator playbook for detecting and recovering a degraded native advisor daemon state."
trigger_phrases:
  - "op-001"
  - "degraded daemon"
  - "degraded"
---

# OP-001 Degraded Daemon

<!-- sk-doc-template: manual_testing_playbook -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

Validate the operator path for a degraded advisor daemon, usually caused by stale graph generation or a newer source file.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-scenario-contract -->
## 2. SCENARIO CONTRACT

- Use a disposable copy when simulating stale source timestamps.
- MCP status tool is available.
- Operator has access to MCP server logs or stderr.

---

<!-- /ANCHOR:2-scenario-contract -->

<!-- ANCHOR:3-test-execution -->
## 3. TEST EXECUTION

1. Detect:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

2. Confirm stale/degraded signals: `freshness: "stale"` or trust reason such as `SOURCE_NEWER_THAN_SKILL_GRAPH`.
3. Inspect logs for watcher or generation messages.
4. Remediate:

```text
skill_graph_scan({})
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

### Expected Signals

- Degraded/stale state is visible without prompt text.
- Logs identify graph generation or source freshness, not raw prompts.
- After scan, `freshness` returns to `live` or the remaining reason is explicit.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Status hides stale state | Sources newer than DB but freshness remains live | Block release. Freshness probe is incorrect. |
| Logs contain prompt text | Search logs for test prompt | Block release. |
| Scan cannot repair | Freshness remains stale | Inspect file permissions and daemon lease. |

---

<!-- /ANCHOR:3-test-execution -->

<!-- ANCHOR:4-source-files -->
## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/freshness/`

---

<!-- /ANCHOR:4-source-files -->

<!-- ANCHOR:5-source-metadata -->
## 5. SOURCE METADATA

- Group: Operator H5
- Playbook ID: OP-001
- Canonical root source: manual_testing_playbook.md
- Feature file path: 04--operator-h5/001-degraded-daemon.md

<!-- /ANCHOR:5-source-metadata -->
