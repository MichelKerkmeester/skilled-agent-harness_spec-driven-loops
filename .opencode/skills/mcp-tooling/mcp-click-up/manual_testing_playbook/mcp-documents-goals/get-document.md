---
title: "MCP-M016 -- Get Document via MCP"
description: "This scenario validates Get Document via MCP for `MCP-M016`. Objective: Verify `clickup_get_document` returns the document created in MCP-M015."
version: 1.0.0.5
---

# MCP-M016 -- Get Document via MCP

---

## 1. OVERVIEW

Validates that **Get Document via MCP** behaves as defined in the feature catalog.

### Why This Matters

Verify `clickup_get_document` returns the document created in MCP-M015 is required for correct agent operation. Failure here means 404 not found or name mismatch.

> **Capability status: SKIP.** A live `list_tools()` inventory (`references/mcp_tools.md`) found no top-level get-document tool on the registered server — only document creation and document-pages tools were confirmed. Do not execute this scenario against the current server; it will fail with a tool-not-found error, not the pass/fail signals below. Re-enable only after a fresh `tool_info()`/`list_tools()` capture confirms an exact callable name and schema.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_get_document` returns the document created in MCP-M015
- **Real user request:** `Get document details for DOC_ID.`
- **Prompt:** `Get the document created in MCP-M015 and confirm its name.`
- **Expected signals:** MCP returns document object with `name` matching 'Playbook Test Doc'; exit 0.
- **Desired user-visible outcome:** Agent reports: document name confirmed as 'Playbook Test Doc'.
- **Pass/fail:** SKIP — top-level get-document confirmed absent from the live server (see capability status above). If a future capture proves otherwise: PASS if response includes `name` matching the created document; FAIL if 404 not found OR name mismatch

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Code Mode: `clickup_official.clickup_official_clickup_get_document({doc_id: 'DOC_ID'})`
2. `bash: jq .name <<< "$RESULT"`  # → 'Playbook Test Doc'

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-M016 | Get Document via MCP | Verify `clickup_get_document` returns the document created in MCP-M015 | `Get the document created in MCP-M015 and confirm its name.` | NOT EXECUTABLE — see capability status above | MCP returns document object with `name` matching 'Playbook Test Doc'; exit 0. | N/A — tool confirmed absent | SKIP — top-level get-document confirmed absent from the live server; do not attempt | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual_testing_playbook.md`](../manual_testing_playbook.md) | Root directory and scenario summary |
| [`../../feature_catalog/mcp-medium-priority/get-document.md`](../../feature_catalog/mcp-medium-priority/get-document.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/cupt_commands.md`](../../references/cupt_commands.md) | cupt command reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Documents
- Playbook ID: MCP-M016
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `mcp-documents-goals/get-document.md`
