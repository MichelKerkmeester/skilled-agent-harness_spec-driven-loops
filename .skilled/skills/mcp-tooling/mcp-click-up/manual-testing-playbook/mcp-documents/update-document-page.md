---
title: "MCP-M018 -- Append to a Document Page"
description: "This scenario validates Append to a Document Page for `MCP-M018`. Objective: Verify `clickup_update_document_page` appends without overwriting the page."
version: 1.0.0.0
---

# MCP-M018 -- Append to a Document Page

---

## 1. OVERVIEW

Validates that **Append to a Document Page** behaves as the feature catalog describes. Tool names and parameters come from the hosted server's schema, captured on 2026-10-08.

### Why This Matters

Verify `clickup_update_document_page` appends without overwriting the page. A failure here means an agent following this skill gets a wrong answer or a tool-not-found error.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_update_document_page` appends without overwriting the page
- **Real user request:** `Add a line to the end of the test page via MCP.`
- **Prompt:** `Append 'Appended line' to page PAGE_ID of document DOC_ID.`
- **Expected signals:** The page keeps its earlier content and ends with 'Appended line'.
- **Desired user-visible outcome:** Agent reports the line appended and the page otherwise unchanged.
- **Pass/fail:** PASS if the earlier content survives and the new line is at the end; FAIL if the earlier content is gone

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: MCP configured. Use a throwaway test list and task.
1. Code Mode: `clickup_official.clickup_official_clickup_get_document_pages({document_id: 'DOC_ID', page_ids: ['PAGE_ID'], content_format: 'text/md'})` and keep the content
2. Code Mode: `clickup_official.clickup_official_clickup_update_document_page({document_id: 'DOC_ID', page_id: 'PAGE_ID', content: 'Appended line', content_edit_mode: 'append', content_format: 'text/md'})`
3. Read the page again and compare

Each Code Mode step runs inside an async function passed to `mcp__code_mode__call_tool_chain`, with the result printed through `console.log`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-M018 | Append to a Document Page | Verify `clickup_update_document_page` appends without overwriting the page | `Append 'Appended line' to page PAGE_ID of document DOC_ID.` | 1. Code Mode: `clickup_official.clickup_official_clickup_get_document_pages({document_id: 'DOC_ID', page_ids: ['PAGE_ID'], content_format: 'text/md'})` and keep the content 2. Code Mode: `clickup_official.clickup_official_clickup_update_document_page({document_id: 'DOC_ID', page_id: 'PAGE_ID', content: 'Appended line', content_edit_mode: 'append', content_format: 'text/md'})` 3. Read the page again and compare | The page keeps its earlier content and ends with 'Appended line'. | Code Mode logs plus the terminal output of any cupt step | PASS if the earlier content survives and the new line is at the end; FAIL if the earlier content is gone | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual-testing-playbook.md`](../../manual-testing-playbook/manual-testing-playbook.md) | Root directory and scenario summary |
| [`../../feature-catalog/mcp-low-priority/update-doc-page.md`](../../feature-catalog/mcp-low-priority/update-doc-page.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | MCP tool reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Documents
- Playbook ID: MCP-M018
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-documents/update-document-page.md`
