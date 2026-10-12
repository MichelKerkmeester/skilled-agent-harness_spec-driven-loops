---
title: "File Uploads"
description: "Direct Notion REST recipe (GAP-001) for uploading a file and attaching it to a page, block, cover/icon, or files property -- a capability the official Notion MCP does not expose."
trigger_phrases:
  - "notion file upload"
  - "GAP-001"
  - "upload a file to notion"
version: 0.1.0.0
---

# File Uploads (direct API -- GAP-001)

## 1. OVERVIEW

The official Notion MCP has no file-upload tool. The REST API exposes 5 endpoints that cover the full lifecycle: create an upload, send its bytes, complete a multi-part transfer, retrieve one upload's status, and list uploads. Uploading is a create-then-send flow; the resulting `file_upload` id is then attached to a block, a page cover/icon, or a `files` property through the normal MCP write tools.

Invocation is a direct HTTPS call, either `fetch()` inside `call_tool_chain({ code: "..." })` (when outbound HTTPS is permitted in the Code Mode sandbox) or a `curl` shell call through Bash as the fallback. Confirm the exact request/response shape against `references/api-gap-tools.md` §3 before hardcoding a call -- the create, send, and complete endpoints are confirmed on their dedicated reference pages, retrieve and list are confirmed only via the API index.

---

## 2. HOW IT WORKS

Prerequisites: `notion_NOTION_TOKEN` set in the environment, the target page/block explicitly shared with the integration, and (for the Code Mode path) outbound HTTPS permitted in the sandbox -- otherwise fall back to `curl` via Bash. No MCP manual registration is required for the upload calls themselves, but attaching the finished upload does go through the registered `notion` manual.

| Endpoint | Method | Purpose |
|---|---|---|
| `/v1/file_uploads` | POST | Create an upload (`single_part`, `multi_part`, or `external_url` mode) |
| `/v1/file_uploads/{file_upload_id}/send` | POST | Send file bytes (`multipart/form-data`; add `part_number` for multi-part) |
| `/v1/file_uploads/{file_upload_id}/complete` | POST | Finalize a `multi_part` upload after all parts are sent |
| `/v1/file_uploads/{file_upload_id}` | GET | Retrieve one upload's status |
| `/v1/file_uploads` | GET | List uploads |

Every request carries `Authorization: Bearer $notion_NOTION_TOKEN` and `Notion-Version: 2026-03-11` (required for this surface). Key inputs: `mode`, `filename`, `content_type` on create; the file bytes plus `part_number` (1-1000) on send for multi-part transfers.

Files over 20 MiB require `multi_part` mode -- send each part with its `part_number`, then call `/complete`. Size caps are roughly 5 MiB on the free plan and 5 GiB on paid plans. The finished upload attaches by referencing its id in a file object (`{"type":"file_upload","file_upload":{"id":"<file_upload_id>"}}`) inside a block-append, page create/update, or a `files` page-property value -- those attach writes go through the normal MCP tools (`append-block-children`, `create-a-page`, `update-page-properties`), not another direct call.

A `Notion-Version` mismatch surfaces as a 400 validation error; an unshared parent returns 404/403. See `../../references/troubleshooting.md` §4 and §6.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes the 5 API-gap capabilities to direct REST calls instead of an MCP tool. |
| [`../../references/api-gap-tools.md`](../../references/api-gap-tools.md) | Shared | Confirms all 5 endpoints, the required `2026-03-11` version pin, and runnable curl/Code Mode examples. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/api-gap-fills/file-uploads.md`](../../manual-testing-playbook/api-gap-fills/file-uploads.md) | Manual playbook | Exercises create -> send -> attach against a scratch page. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Illustrates the shared Code Mode `call_tool_chain` pattern the attach step reuses. |

---

## 4. SOURCE METADATA

- Group: API-gap fills
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `api-gap-fills/file-uploads.md`

Related references:
- [`views.md`](views.md) -- another direct-API gap fill with no MCP tool.
- [`page-property-items.md`](page-property-items.md) -- direct-API gap fill for non-truncated property reads.
