---
title: "GAP-001 -- File Uploads"
description: "This scenario validates the direct-API file-upload flow (create -> send -> attach) against a scratch Notion page."
stage: routing
version: 0.1.0.0
---

# GAP-001 -- File Uploads

## 1. OVERVIEW

This scenario validates the direct Notion REST file-upload flow that the official MCP does not expose: create an upload, send its bytes, then attach the finished `file_upload` id to a scratch page as an image block.

### Why This Matters

File uploads are a hard gap -- no MCP tool exists for any of the 5 endpoints. Without this scenario, the create-then-send-then-attach sequence, and the version pin it depends on, is undemonstrated.

---

## 2. SCENARIO CONTRACT

- Feature ID: `GAP-001`
- Feature Name: File Uploads
- Scenario Objective: Create a file upload via direct REST, send its bytes, then attach the finished upload to a scratch page and confirm it is visible.
- Exact Prompt: `"Upload a small image to Notion via the file-uploads REST endpoints and attach it to a scratch page."`
- Exact Command Sequence: `1. POST https://api.notion.com/v1/file_uploads (Bearer $notion_NOTION_TOKEN, Notion-Version: 2026-03-11) -> 2. POST https://api.notion.com/v1/file_uploads/<file_upload_id>/send (multipart/form-data) -> 3. tool_info("notion.notion_append-block-children") -> 4. notion["notion_append-block-children"]({ block_id: "<scratch_page_id>", children: [{ type: "image", image: { type: "file_upload", file_upload: { id: "<file_upload_id>" } } }] }) -> 5. notion["notion_retrieve-block-children"]({ block_id: "<scratch_page_id>" })`
- Expected Signals: Step 1 returns `{ id, status: "pending" }`; Step 2 returns `status: "uploaded"`; Step 3 resolves the append-block-children schema; Step 4 returns the new block id; Step 5 lists an image block referencing the `file_upload` id.
- Evidence: create/send response bodies (never the token), the appended block id, the children-listing content.
- Pass/Fail Criteria: PASS if the upload reaches `status: "uploaded"` and the image block appears in the children listing; SKIP if outbound HTTPS is unavailable in the Code Mode sandbox and the `curl` fallback is also blocked, or no scratch page is available; FAIL if any confirmed call errors or the image block never appears.
- Failure Triage: 1. Confirm `Notion-Version: 2026-03-11` is set on every file-upload call. 2. Confirm `notion_NOTION_TOKEN` resolves and the scratch page is shared with the integration. 3. Re-run `tool_info("notion.notion_append-block-children")` and compare the returned schema against the image-block payload before retrying.

---

## 3. TEST EXECUTION

### Prerequisites

`notion_NOTION_TOKEN` is set in the environment, a scratch page is shared with the integration, and either outbound HTTPS is permitted for a Code Mode `fetch()` call or a `curl`-capable Bash shell is available as the fallback.

### Prompt

`"Upload a small image to Notion via the file-uploads REST endpoints and attach it to a scratch page."`

### Commands

1. `POST https://api.notion.com/v1/file_uploads` (Bearer `$notion_NOTION_TOKEN`, `Notion-Version: 2026-03-11`, body `{"mode":"single_part","filename":"playbook-test.png","content_type":"image/png"}`) -- capture the returned `id`.
2. `POST https://api.notion.com/v1/file_uploads/<file_upload_id>/send` (`multipart/form-data`, field `file`) -- confirm `status` becomes `"uploaded"`.
3. `tool_info("notion.notion_append-block-children")`.
4. `notion["notion_append-block-children"]({ block_id: "<scratch_page_id>", children: [{ type: "image", image: { type: "file_upload", file_upload: { id: "<file_upload_id>" } } }] })`.
5. `notion["notion_retrieve-block-children"]({ block_id: "<scratch_page_id>" })`.

### Expected

The create call returns a pending upload id; the send call flips it to `uploaded`; the append call returns a new block; the children listing shows an image block whose `file_upload.id` matches.

### Evidence

Capture both REST response bodies (redacting nothing but the token itself, which is never printed), the appended block id, and the children-listing content.

### Pass / Fail

- **Pass:** the upload reaches `status: "uploaded"` and the attached image block is visible in the children listing.
- **Skip:** outbound HTTPS is unavailable in the sandbox and no `curl` fallback exists, or no scratch page is available.
- **Fail:** any confirmed call errors, or the image block never appears after a successful upload.

### Failure Triage

1. Confirm `Notion-Version: 2026-03-11` is set on every file-upload request.
2. Confirm `notion_NOTION_TOKEN` resolves and the scratch page is shared with the integration.
3. Re-run `tool_info("notion.notion_append-block-children")` and compare the returned schema against the image-block payload before retrying.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| GAP-001 | File Uploads | Verify create -> send -> attach against a scratch page | `"Upload a small image to Notion via the file-uploads REST endpoints and attach it to a scratch page."` | 1. `POST /v1/file_uploads` -> 2. `POST /v1/file_uploads/<id>/send` -> 3. `tool_info("notion.notion_append-block-children")` -> 4. `notion["notion_append-block-children"]({...})` -> 5. `notion["notion_retrieve-block-children"]({...})` | Upload reaches `uploaded`; image block appended and listed | Create/send response bodies, block id, children listing | PASS if uploaded and visible in listing; SKIP if HTTPS/curl unavailable or no scratch page; FAIL if any call errors or block missing | Check version header, check token/sharing, re-run tool_info and compare schema |

Cleanup: archive the scratch page (the uploaded image block is trashed with it).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and wave order |
| [`../../feature-catalog/api-gap-fills/file-uploads.md`](../../feature-catalog/api-gap-fills/file-uploads.md) | Catalog entry for this gap fill |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/api-gap-tools.md`](../../references/api-gap-tools.md) | Endpoint table, version pin, and curl/Code Mode examples |
| [`../../examples/README.md`](../../examples/README.md) | Shared Code Mode `call_tool_chain` pattern for the attach step |

---

## 5. SOURCE METADATA

- Group: API-gap fills
- Playbook ID: `GAP-001`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `api-gap-fills/file-uploads.md`
