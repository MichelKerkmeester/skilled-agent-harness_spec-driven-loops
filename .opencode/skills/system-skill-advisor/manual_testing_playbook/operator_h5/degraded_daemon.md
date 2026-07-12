---
title: "OP-001 Degraded Daemon"
description: "H5 operator playbook for detecting and recovering a degraded native advisor daemon state."
trigger_phrases:
  - "op-001"
  - "degraded daemon"
  - "degraded"
version: 0.8.0.12
---

# OP-001 Degraded Daemon

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate the operator path for a degraded advisor daemon, usually caused by stale graph generation or a newer source file.

---

## 2. SCENARIO CONTRACT

- Use a disposable copy when simulating stale source timestamps.
- MCP status tool is available.
- Operator has access to MCP server logs or stderr.

---

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

## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/freshness/`

---

## 5. SOURCE METADATA

- Group: Operator H5
- Playbook ID: OP-001
- Canonical root source: manual_testing_playbook.md
- Feature file path: operator-h5/degraded-daemon.md

---

## 6. EVIDENCE

Command run: `advisor_status({"workspaceRoot":"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"})`

```json
{
  "status": "ok",
  "data": {
    "freshness": "unavailable",
    "generation": 9476,
    "trustState": {
      "state": "stale",
      "reason": "SIGTERM",
      "generation": 9476,
      "checkedAt": "2026-07-03T02:07:13.954Z",
      "lastLiveAt": null
    },
    "lastGenerationBump": "2026-07-02T05:27:14.803Z",
    "lastScanAt": "2026-07-02T05:27:14.803Z",
    "skillCount": 26,
    "laneWeights": {
      "explicit_author": 0.42,
      "lexical": 0.28,
      "graph_causal": 0.13,
      "derived_generated": 0.12,
      "semantic_shadow": 0.05
    }
  }
}
```

Command run: `glob("**/*log*", ".opencode/skills/system-skill-advisor")`

```text
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md
```

Command run: `glob("mcp_server/**/*.log", ".opencode/skills/system-skill-advisor")`

```text
No files found
```

Command run: `glob("mcp_server/**/*stderr*", ".opencode/skills/system-skill-advisor")`

```text
No files found
```

Command run: `glob("mcp_server/**/*err*", ".opencode/skills/system-skill-advisor")`

```text
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/tests/__fixtures__/errors.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-cli-help-aliases-errors.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/error-diagnostics.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/utils/error-format.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/lane-registry-env-override.vitest.ts
```

Command run: `skill_graph_scan({})`

```json
{
  "status": "error",
  "error": "Skill graph scan failed: .opencode/skills/z_archive/cli-codex-retired/graph-metadata.json: skill_id \"cli-codex\" does not match folder name \"cli-codex-retired\""
}
```

Command run: `advisor_status({"workspaceRoot":"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"})`

```json
{
  "status": "ok",
  "data": {
    "freshness": "unavailable",
    "generation": 9476,
    "trustState": {
      "state": "stale",
      "reason": "SIGTERM",
      "generation": 9476,
      "checkedAt": "2026-07-03T02:07:29.139Z",
      "lastLiveAt": null
    },
    "lastGenerationBump": "2026-07-02T05:27:14.803Z",
    "lastScanAt": "2026-07-02T05:27:14.803Z",
    "skillCount": 26,
    "laneWeights": {
      "explicit_author": 0.42,
      "lexical": 0.28,
      "graph_causal": 0.13,
      "derived_generated": 0.12,
      "semantic_shadow": 0.05
    }
  }
}
```

---

## 7. PASS/FAIL

BLOCKED

Reason: The degraded state was visible (`freshness: "unavailable"`, `trustState.reason: "SIGTERM"`), but the scenario precondition requiring access to MCP server logs or stderr was not satisfied by any discoverable current system-skill-advisor log/stderr file, and remediation was blocked by `.opencode/skills/z_archive/cli-codex-retired/graph-metadata.json` containing `skill_id "cli-codex"` while the folder name is `cli-codex-retired`.
