---
title: "MCP-M015 -- Create Document — CRITICAL PATH"
description: "This scenario validates Create Document — CRITICAL PATH for `MCP-M015`. Objective: Verify `clickup_create_document` creates a document and returns a doc_id."
version: 1.0.0.6
---

# MCP-M015 -- Create Document — CRITICAL PATH

---

## 1. OVERVIEW

Validates that **Create Document — CRITICAL PATH** behaves as defined in the feature catalog.

### Why This Matters

Verify `clickup_create_document` creates a document and returns a doc_id is required for correct agent operation. Failure here means `doc_id` missing from response or document not visible in clickup.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_create_document` creates a document and returns a doc_id
- **Real user request:** `Create a test document in ClickUp.`
- **Prompt:** `Create a document named 'Playbook Test Doc' in list LIST_ID with markdown content.`
- **Expected signals:** MCP call returns JSON with `doc_id`; document visible in ClickUp UI.
- **Desired user-visible outcome:** Agent reports: document 'Playbook Test Doc' created with ID DOC_ID.
- **Pass/fail:** PASS if response includes `doc_id` AND document visible in ClickUp; FAIL if `doc_id` missing from response OR document not visible in ClickUp

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: MCP configured with valid CLICKUP_API_KEY and CLICKUP_TEAM_ID.
1. Code Mode: `clickup.clickup_create_document({name: 'Playbook Test Doc', parent: {type: 4, id: 'LIST_ID'}, content: '# Test\n\nContent.', content_format: 'markdown'})`
2. Verify response includes `doc_id`
3. Open ClickUp UI and confirm document exists

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| MCP-M015 | Create Document — CRITICAL PATH | Verify `clickup_create_document` creates a document and | `Create a document named 'Playbook Test Doc' in list LIS` | MCP call returns JSON with `doc_id`; document visible in ClickUp UI. | PASS if response includes `doc_id` AND document visible in Clic; FAIL if `doc_id` missing from response OR document not visible  | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/mcp-medium-priority/create-document.md` | Feature catalog source |

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
- Feature file path: `mcp-advanced/create-document.md`
