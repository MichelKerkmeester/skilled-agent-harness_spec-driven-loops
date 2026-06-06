---
title: "MCP-M016 -- Get Document via MCP"
description: "This scenario validates Get Document via MCP for `MCP-M016`. Objective: Verify `clickup_get_document` returns the document created in MCP-M015."
---

# MCP-M016 -- Get Document via MCP

---

## 1. OVERVIEW

Validates that **Get Document via MCP** behaves as defined in the feature catalog.

### Why This Matters

Verify `clickup_get_document` returns the document created in MCP-M015 is required for correct agent operation. Failure here means 404 not found or name mismatch.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_get_document` returns the document created in MCP-M015
- **Real user request:** `Get document details for DOC_ID.`
- **Prompt:** `Get the document created in MCP-M015 and confirm its name.`
- **Expected signals:** MCP returns document object with `name` matching 'Playbook Test Doc'; exit 0.
- **Desired user-visible outcome:** Agent reports: document name confirmed as 'Playbook Test Doc'.
- **Pass/fail:** PASS if response includes `name` matching the created document; FAIL if 404 not found OR name mismatch

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Code Mode: `clickup.clickup_get_document({doc_id: 'DOC_ID'})`
2. `bash: jq .name <<< "$RESULT"`  # → 'Playbook Test Doc'

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| MCP-M016 | Get Document via MCP | Verify `clickup_get_document` returns the document crea | `Get the document created in MCP-M015 and confirm its na` | MCP returns document object with `name` matching 'Playbook Test Doc'; exit 0. | PASS if response includes `name` matching the created document; FAIL if 404 not found OR name mismatch | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/12--mcp-medium-priority/get-document.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Documents
- Playbook ID: MCP-M016
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--mcp-documents-goals/get-document.md`
