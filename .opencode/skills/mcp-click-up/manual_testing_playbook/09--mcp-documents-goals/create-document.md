---
title: "MCP-M015 -- Create Document via MCP — CRITICAL PATH"
description: "This scenario validates Create Document via MCP — CRITICAL PATH for `MCP-M015`. Objective: Verify `clickup_create_document` creates a document and returns a doc_id."
---

# MCP-M015 -- Create Document via MCP — CRITICAL PATH

---

## 1. OVERVIEW

Validates that **Create Document via MCP — CRITICAL PATH** behaves as defined in the feature catalog.

### Why This Matters

Verify `clickup_create_document` creates a document and returns a doc_id is required for correct agent operation. Failure here means `id` missing from response or document not visible.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_create_document` creates a document and returns a doc_id
- **Real user request:** `Create a ClickUp document via MCP.`
- **Prompt:** `Create document 'Playbook Test Doc' in list LIST_ID with markdown content.`
- **Expected signals:** MCP returns JSON with `id` (doc_id); document visible in ClickUp; exit 0.
- **Desired user-visible outcome:** Agent reports: document 'Playbook Test Doc' created with doc_id DOC_ID.
- **Pass/fail:** PASS if response includes `id` (doc_id) AND document visible in ClickUp; FAIL if `id` missing from response OR document not visible

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Code Mode: `clickup.clickup_create_document({name: 'Playbook Test Doc', parent: {type: 4, id: 'LIST_ID'}, content: '# Test\n\nCreated by playbook MCP-M015.', content_format: 'markdown'})`
2. `bash: jq .id <<< "$RESULT"`  # → doc_id
3. Confirm document visible in ClickUp

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| MCP-M015 | Create Document via MCP — CRITICAL PATH | Verify `clickup_create_document` creates a document and | `Create document 'Playbook Test Doc' in list LIST_ID wit` | MCP returns JSON with `id` (doc_id); document visible in ClickUp; exit 0. | PASS if response includes `id` (doc_id) AND document visible in; FAIL if `id` missing from response OR document not visible | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/12--mcp-medium-priority/073-create-document.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Documents
- Playbook ID: MCP-M015
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--mcp-documents-goals/create-document.md`
