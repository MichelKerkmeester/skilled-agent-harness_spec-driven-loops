---
title: "OBS-012 -- Obsidian Tables file-layer round-trip"
description: "This scenario validates the Tables file-layer tie-in by creating and editing a .table.md payload, then verifying that Obsidian renders the changed table."
stage: routing
version: 0.1.0.0
---

# OBS-012 -- Obsidian Tables file-layer round-trip

## 1. OVERVIEW

This scenario validates the tables integration at the data-file layer. It copies the canonical .table.md asset into a throwaway vault, edits a row by stable IDs, reparses the JSON payload, and opens the note so the Tables plugin can render it.

### Why This Matters

The mode operates plugin data, not plugin UI. A valid Markdown wrapper and Agentable JSON payload are the file-layer contract; opening or reloading the note is still required to verify the user-visible table render.

---

## 2. SCENARIO CONTRACT

- Feature ID: OBS-012
- Feature Name: Obsidian Tables file-layer round-trip
- Scenario Objective: Create or edit a .table.md at the file layer, validate its stable-ID payload, and verify that Obsidian renders the changed table.
- Exact Prompt: Create or update a scratch Obsidian Tables .table.md at the file layer, then verify the edited table renders in Obsidian.
- Exact Command Sequence: 1. TEST_TABLE="$TEST_VAULT/Playbook/OBS-012.table.md"; cp .opencode/skills/mcp-tooling/mcp-obsidian/assets/plugins/obsidian-tables/example.table.md "$TEST_TABLE" 2. Patch row_atlas.cells.col_task while preserving the Markdown wrapper, then parse the json-table fence 3. Open or reload "$TEST_TABLE" with the locally help-confirmed official obsidian CLI and capture the rendered table
- Expected Signals: The copied file retains json-table-plugin: true and one json-table fence, the edited row_atlas cell uses col_task, the payload reparses, and Obsidian displays the table with the changed row rather than raw JSON or an error.
- Evidence: Vault/table path, before-and-after file diff, payload parse output, exact CLI help or action transcript, and a screenshot or visible app-state record of the rendered table.
- Pass/Fail Criteria: PASS if the wrapper and payload remain valid, the targeted row changes by stable ID, and the opened table renders the changed value; FAIL if the file is malformed, the cell key is header-based or missing, or the app shows raw JSON/an error after reload.
- Failure Triage: 1. Check the frontmatter marker and fence count. 2. Parse the payload and compare columns, rows, and views IDs. 3. Compare the edit with the Tables data model/workflow and reopen the note after repairing only the throwaway table.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Use an operator-owned test vault with the Tables plugin installed and enabled. Keep the original asset and the edited file diff so the file-layer mutation can be rolled back without touching production notes.

### Prompt

Create or update a scratch Obsidian Tables .table.md at the file layer, then verify the edited table renders in Obsidian.

### Commands

1. TEST_TABLE="$TEST_VAULT/Playbook/OBS-012.table.md"; mkdir -p "$(dirname "$TEST_TABLE")"; cp .opencode/skills/mcp-tooling/mcp-obsidian/assets/plugins/obsidian-tables/example.table.md "$TEST_TABLE"
2. Read the complete file, locate the single json-table fence, and update rows[] by id == "row_atlas", setting cells["col_task"] to "Round-trip verified". Serialize only the fenced JSON payload and parse the written file again. A compact implementation is:

   ~~~sh
   TABLE="$TEST_TABLE" python3 - <<'PY'
   import json
   import os
   import re
   from pathlib import Path

   path = Path(os.environ["TABLE"])
   text = path.read_text()
   fence = chr(96) * 3
   match = re.search(fence + r"json-table\n(.*?)\n" + fence, text, re.S)
   if match is None:
       raise SystemExit("json-table fence missing")
   payload = json.loads(match.group(1))
   row = next(row for row in payload["rows"] if row["id"] == "row_atlas")
   row["cells"]["col_task"] = "Round-trip verified"
   encoded = json.dumps(payload, indent=2)
   path.write_text(text[:match.start(1)] + encoded + text[match.end(1):])
   json.loads(re.search(fence + r"json-table\n(.*?)\n" + fence, path.read_text(), re.S).group(1))
   PY
   ~~~

3. obsidian --help to confirm the local app-action syntax, then open or reload "$TEST_TABLE" and capture the visible Tables render. If the exact action remains unconfirmed, record that prerequisite as SKIP rather than claiming a render pass.

### Expected

The file keeps the exact boolean marker and one fenced payload, the row_atlas row contains the updated col_task value, and Obsidian renders the table with its columns, views, and changed row visible.

### Evidence

Capture the original asset hash or diff, final table path, JSON parse result, CLI help/action output, and visible app state after opening or reloading the note.

### Pass / Fail

- Pass: the file-layer edit is structurally valid and the rendered table shows Round-trip verified.
- Fail: the wrapper or JSON is invalid, stable IDs are broken, the edit is not persisted, or the app displays raw JSON/error content after reload.

### Failure Triage

1. Count the json-table fences and verify json-table-plugin: true.
2. Confirm the row and column IDs, view references, and formula cache still resolve.
3. Compare the file with the Tables troubleshooting reference, restore the asset, and repeat against the throwaway vault.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| OBS-012 | Obsidian Tables file-layer round-trip | Create/edit a .table.md and verify its render | Create or update a scratch Obsidian Tables .table.md at the file layer, then verify the edited table renders in Obsidian. | 1. Copy the Tables asset. 2. Patch row_atlas.cells.col_task and reparse. 3. Open/reload the file with the locally confirmed app action. | Marker and fence valid; stable-ID edit persists; rendered table shows changed row | File diff, parse output, CLI/app evidence | PASS if valid file and visible changed render; FAIL on malformed payload or raw/error view | Check wrapper, IDs, references, then restore and repeat |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [../manual-testing-playbook.md](../manual-testing-playbook.md) | Root policy and plugin tie-in index |
| [../../references/plugins/obsidian-tables/obsidian-tables.md](../../references/plugins/obsidian-tables/obsidian-tables.md) | Plugin identity and deep-reference index |
| [../../references/plugins/obsidian-tables/data-model.md](../../references/plugins/obsidian-tables/data-model.md) | .table.md envelope, stable IDs, cells, views, and formula contract |
| [../../references/plugins/obsidian-tables/workflows.md](../../references/plugins/obsidian-tables/workflows.md) | File-layer create/edit/readback/reload workflow |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [../../assets/plugins/obsidian-tables/example.table.md](../../assets/plugins/obsidian-tables/example.table.md) | Canonical test fixture |
| [../../references/plugins/obsidian-tables/troubleshooting.md](../../references/plugins/obsidian-tables/troubleshooting.md) | Failure diagnosis and recovery |
| [../../references/plugins/plugin-operation-logic.md](../../references/plugins/plugin-operation-logic.md) | File-layer versus UI boundary |

---

## 5. SOURCE METADATA

- Group: Plugin tie-ins
- Playbook ID: OBS-012
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugin-tie-ins/obsidian-tables-roundtrip.md
