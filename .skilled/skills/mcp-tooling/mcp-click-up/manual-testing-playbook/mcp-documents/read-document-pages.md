---
title: "MCP-M016 -- Read Document Pages"
description: "This scenario validates Read Document Pages for `MCP-M016`. Objective: Verify `clickup_list_document_pages` and `clickup_get_document_pages` read the document from MCP-M015."
version: 1.1.0.0
---

# MCP-M016 -- Read Document Pages

---

## 1. OVERVIEW

Validates that **Read Document Pages** behaves as the feature catalog describes. Tool names and parameters come from the hosted server's schema, captured on 2026-10-08.

### Why This Matters

Verify `clickup_list_document_pages` and `clickup_get_document_pages` read the document from MCP-M015. A failure here means an agent following this skill gets a wrong answer or a tool-not-found error.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_list_document_pages` and `clickup_get_document_pages` read the document from MCP-M015
- **Real user request:** `Read the test document via MCP.`
- **Prompt:** `List the pages of document DOC_ID and read the first one as markdown.`
- **Expected signals:** The page list contains PAGE_ID; the read returns its content with no `error` field.
- **Desired user-visible outcome:** Agent shows the page tree and the first page's content.
- **Pass/fail:** PASS if both calls succeed; FAIL if either returns an `error` field

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: MCP configured. Use a throwaway test list and task.
1. Code Mode: `clickup_official.clickup_official_clickup_list_document_pages({document_id: 'DOC_ID'})` and take a page ID
2. Code Mode: `clickup_official.clickup_official_clickup_get_document_pages({document_id: 'DOC_ID', page_ids: ['PAGE_ID'], content_format: 'text/md'})`

Each Code Mode step runs inside an async function passed to `mcp__code_mode__call_tool_chain`, with the result printed through `console.log`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-M016 | Read Document Pages | Verify `clickup_list_document_pages` and `clickup_get_document_pages` read the document from MCP-M015 | `List the pages of document DOC_ID and read the first one as markdown.` | 1. Code Mode: `clickup_official.clickup_official_clickup_list_document_pages({document_id: 'DOC_ID'})` and take a page ID 2. Code Mode: `clickup_official.clickup_official_clickup_get_document_pages({document_id: 'DOC_ID', page_ids: ['PAGE_ID'], content_format: 'text/md'})` | The page list contains PAGE_ID; the read returns its content with no `error` field. | Code Mode logs plus the terminal output of any cupt step | PASS if both calls succeed; FAIL if either returns an `error` field | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual-testing-playbook.md`](../../manual-testing-playbook/manual-testing-playbook.md) | Root directory and scenario summary |
| [`../../feature-catalog/mcp-low-priority/list-document-pages.md`](../../feature-catalog/mcp-low-priority/list-document-pages.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | MCP tool reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Documents
- Playbook ID: MCP-M016
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-documents/read-document-pages.md`
