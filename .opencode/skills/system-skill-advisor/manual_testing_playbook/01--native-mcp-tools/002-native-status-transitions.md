---
title: "NC-002 Native advisor_status Transitions"
description: "Manual validation of advisor_status freshness transitions and status fields."
trigger_phrases:
  - "nc-002"
  - "native advisor_status transitions"
  - "native advisor_status"
  - "native"
---

# NC-002 Native advisor_status Transitions

<!-- sk-doc-template: manual_testing_playbook -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

Validate that `advisor_status` reports live, stale and absent states with the Phase 027 `skillCount` and `lastScanAt` fields.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-scenario-contract -->
## 2. SCENARIO CONTRACT

- Repo root is the working directory.
- Use a disposable copy for stale or absent transition simulation.
- Native package build exists in `mcp_server/dist`.

---

<!-- /ANCHOR:2-scenario-contract -->

<!-- ANCHOR:3-test-execution -->
## 3. TEST EXECUTION

1. Live check:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

2. Stale check in a disposable copy: touch a copied `.opencode/skills/*/graph-metadata.json` after the copied SQLite artifact timestamp, then call `advisor_status` with that copy as `workspaceRoot`.
3. Absent check in a disposable copy: move the copied `skill-graph.sqlite` out of the way, ensure no usable generation metadata is present, then call `advisor_status`.

### Expected Signals

- Live response includes `freshness`, `generation`, `trustState`, `lastGenerationBump`, `lastScanAt`, `skillCount` and `laneWeights`.
- `skillCount` is a nonzero integer that matches discovered `graph-metadata.json` files.
- `lastScanAt` is an ISO timestamp or `null` when no scan has occurred.
- Stale response reports `freshness: "stale"` or a stale trust-state reason such as `SOURCE_NEWER_THAN_SKILL_GRAPH`.
- Absent response reports `freshness: "absent"` when graph sources exist but the artifact/generation state is missing.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Missing `skillCount` | Field absent from JSON | Rebuild MCP server and verify `advisor-status.ts` is current. |
| Missing `lastScanAt` | Field absent from JSON | Rebuild and rerun. Block release if still absent. |
| Transition cannot be simulated | Write sandbox prevents temp copy setup | Mark `SKIP` with sandbox evidence, not `PASS`. |

---

<!-- /ANCHOR:3-test-execution -->

<!-- ANCHOR:4-source-files -->
## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-status.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/freshness/`

---

<!-- /ANCHOR:4-source-files -->

<!-- ANCHOR:5-source-metadata -->
## 5. SOURCE METADATA

- Group: Native MCP Tools
- Playbook ID: NC-002
- Canonical root source: manual_testing_playbook.md
- Feature file path: 01--native-mcp-tools/002-native-status-transitions.md

<!-- /ANCHOR:5-source-metadata -->
