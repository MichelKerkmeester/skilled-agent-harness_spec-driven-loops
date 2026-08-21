---
title: "mcp-notion: Manual Testing Playbook"
description: "Operator-facing manual scenarios for the mcp-notion mode — MCP tool round-trips via Code Mode, a direct-API gap call, backend selection, and auth failure. Read-only and scratch-safe; never destructive on a real workspace."
trigger_phrases:
  - "notion manual testing playbook"
  - "notion mcp test scenarios"
  - "notion round-trip validation"
  - "notion backend selection test"
importance_tier: "important"
contextType: "reference"
version: 0.1.0.0
---

# mcp-notion: Manual Testing Playbook

Manual testing reference for the `mcp-notion` mode. Every scenario validates a capability from the feature catalog against its defined behavior, using the official Notion MCP through Code Mode or a direct Notion REST call.

Notion is a live cloud workspace with no headless sandbox, so **every scenario here is read-only or scratch-safe**. Writes happen only inside a disposable scratch page or scratch data source, and the only "delete" used is Notion's reversible archive-to-trash. No scenario mutates real workspace content.

---

**EXECUTION POLICY:** Every scenario MUST be executed for real against a scratch Notion workspace — not mocked, not stubbed. Run actual Code Mode calls, inspect real return values, make real REST calls. Valid statuses: **PASS**, **FAIL**, or **SKIP** (with a documented blocker). "UNAUTOMATABLE" is not a valid status.

---

## 1. OVERVIEW

### Coverage

| Category | Capabilities | Scenarios |
|----------|-------------|-----------|
| MCP tool round-trip (Code Mode) | Pages, blocks, data sources, comments, users, search | 6 |
| API-gap direct call | Page property items (non-truncated) | 1 |
| Backend selection | Local stdio vs remote OAuth routing | 1 |
| Auth and failure | Missing / invalid `NOTION_TOKEN`, rate-limit backoff | 3 |
| **TOTAL** | **24 MCP tools + 5 gap fills** | **11 scenarios** |

### Realistic Test Model

An operator reads: "create a scratch page, add a paragraph, then read it back." The mode routes this to the official Notion MCP through Code Mode. The orchestrator calls:

1. `notion.notion_get-self({})` — auth/connectivity preflight (returns the bot user).
2. `notion.notion_post-page({...})` — create the scratch page under a known parent.
3. `notion.notion_patch-block-children({...})` — append a paragraph block.
4. `notion.notion_retrieve-a-page({...})` — read the page back and confirm.
5. `notion.notion_archive-a-page({...})` — trash the scratch page (reversible cleanup).

A scenario PASSES only when both the **execution process** (correct tool called, correct arguments) and the **observable outcome** (the returned object matches, the page is visible then trashed) are verified.

---

## 2. GLOBAL PRECONDITIONS

All scenarios share these preconditions. Verify before starting.

1. Working directory is the project root (`pwd` shows the repo root).
2. Node and npx present: `node -v` prints v18 or newer; `npx --version` succeeds.
3. The `notion` manual is registered in `.utcp_config.json` (`grep -c '"name": "notion"' .utcp_config.json` returns 1).
4. `notion_NOTION_TOKEN` is set in the environment (or resolvable by the Code Mode runtime). Never print the token value.
5. A **scratch** Notion workspace or a scratch parent page is available, shared with the integration, and holds nothing real.
6. The integration (the token's bot user) has been granted access to that scratch parent — Notion tokens see only explicitly shared content.
7. Internet access to `api.notion.com`.
8. **Cleanup discipline:** every scratch page or block created in a scenario is archived (trashed) at the end of that scenario. Trash is reversible; no hard delete exists.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

Each scenario MUST capture:

1. The Code Mode `call_tool_chain` code (or the direct REST request) that was run.
2. The tool/endpoint return value (redact any secret; never paste the token).
3. The observable outcome — the object created, read, or archived, described or shown in the Notion UI.
4. Failure triage notes if the scenario fails (status code, error body, which precondition was unmet).
5. Cleanup confirmation — the scratch page or block was archived at the end.

---

## 4. DETERMINISTIC COMMAND NOTATION

| Type | Notation | Example |
|------|----------|---------|
| MCP tool (Code Mode) | `notion.notion_<tool>({...})` | `notion.notion_retrieve-a-page({ page_id: "X" })` |
| Direct REST | `GET/POST <endpoint>` | `GET /v1/pages/{id}/properties/{prop}` |
| Bash | `bash: <command>` | `bash: grep -c '"name": "notion"' .utcp_config.json` |
| Sequential | `->` separator | `get-self -> post-page -> retrieve-a-page -> archive-a-page` |
| Expected output | `# -> expected` | `node -v  # -> v18 or newer` |

> **Tool names are illustrative.** The `notion_<tool>` identifiers shown here follow the local stdio server's kebab pattern. Confirm the live names with `list_tools()` / `tool_info()` before running — do not trust this file's names blindly.

---

## 5. MCP TOOL ROUND-TRIP SCENARIOS

### NOTION-01 | Bot User Preflight (CRITICAL PATH)

Verify `notion_get-self` returns the integration's bot user — the connectivity and auth smoke test.

Prompt: `"Confirm the Notion integration is connected and report the bot user."`
Expected: return object includes a `bot` type and the integration name; no error. This is the gate for every other scenario.

Cleanup: none (read-only).

---

### NOTION-02 | Page Create → Read → Archive Round-Trip

Verify a page lifecycle: `post-page -> retrieve-a-page -> archive-a-page`, all against the scratch parent.

Prompt: `"Create a scratch page titled 'MCP Test Page' under the scratch parent, read it back, then trash it."`
Expected: create returns a `page_id`; retrieve returns the same page with the title; archive marks it trashed; a follow-up retrieve shows `archived: true`.

Cleanup: the page is archived by the scenario itself (this is the cleanup).

---

### NOTION-03 | Block Append → Read Round-Trip

Verify block content: `patch-block-children -> retrieve-block-children` on the scratch page from NOTION-02 (recreate a scratch page if needed).

Prompt: `"Append a paragraph block to the scratch page, then list its children and confirm the paragraph is present."`
Expected: append returns the new block(s); listing children shows the paragraph text; exit clean.

Cleanup: archive the scratch page.

---

### NOTION-04 | Data-Source Query (READ-ONLY)

Verify `post-data-source-query` returns rows from a scratch data source without mutating anything.

Prompt: `"Query the scratch data source and return the first page of rows with no filter."`
Expected: return object is a paginated list of pages (rows); `[]` for an empty data source is valid, not a failure.

Cleanup: none (read-only).

---

### NOTION-05 | Comment Create → List Round-Trip

Verify comments: `create-a-comment -> retrieve-a-comment` on the scratch page.

Prompt: `"Add a comment 'MCP test comment' to the scratch page, then list its comments and confirm it appears."`
Expected: create returns a comment object; listing returns the comment with matching text.

Cleanup: archive the scratch page (comments go with it).

---

### NOTION-06 | Search Is Title-Only (STRUCTURAL LIMIT)

Verify `post-search` matches on title and does **not** perform full-text content search.

Prompt: `"Search for the scratch page by its title, then search for a unique phrase that only appears in its body."`
Expected: the title search returns the page; the body-phrase search does not return it — confirming the documented title-only structural limit.

Cleanup: none (read-only).

---

## 6. API-GAP DIRECT-CALL SCENARIOS

### GAP-01 | Non-Truncated Page Property Items

Verify the direct-API fill for property truncation: `retrieve-a-page` truncates a relation/rollup/people property past ~25 items, and the direct page-property-item endpoint returns the full paginated list.

Prompt: `"Read a page whose relation property has more than 25 items via the MCP, then fetch the full list via the direct property-item endpoint."`
Expected: the MCP page read shows a truncated/`has_more` property; the direct `GET /v1/pages/{id}/properties/{prop}` call paginates the complete set. Confirms the gap and its fill.

Cleanup: none (read-only). Use an existing scratch page pre-seeded with a many-item relation, or SKIP with a documented blocker if none exists.

---

## 7. BACKEND SELECTION SCENARIOS

### BACKEND-01 | Headless Routes to Local Stdio

Verify the smart router selects the **local stdio** backend for headless Code Mode execution, not the remote OAuth server.

Prompt: `"In a headless run with NOTION_TOKEN set and no browser, confirm which backend the mode selects."`
Expected: the mode selects local stdio (`@notionhq/notion-mcp-server`), because the remote OAuth server cannot run headless. Evidence: the `notion` manual in `.utcp_config.json` points at the local `npx` server, and calls resolve through it. An interactive session with OAuth available would instead prefer remote — state that as the contrasting branch, do not execute it headlessly.

Cleanup: none (read-only inspection).

---

## 8. AUTH AND FAILURE SCENARIOS

### FAIL-01 | Missing Token

Verify a clear failure when `NOTION_TOKEN` / `notion_NOTION_TOKEN` is unset.

Prompt: `"Call get-self with no Notion token configured."`
Expected: the call fails with an auth error (missing credentials); the error message names the token, not a generic crash; exit non-zero. Recovery: set `notion_NOTION_TOKEN` and re-run NOTION-01.

Cleanup: restore the token before continuing.

---

### FAIL-02 | Invalid Token

Verify an invalid token produces a `401 unauthorized` rather than a silent empty result.

Prompt: `"Call get-self with a deliberately wrong Notion token."`
Expected: `401` / unauthorized error surfaced with a meaningful message; exit non-zero. An empty success is a FAIL.

Cleanup: restore the valid token.

---

### FAIL-03 | Rate-Limit Backoff

Verify the mode honors Notion's **3 requests/second** limit and backs off on `429` using `Retry-After`.

Prompt: `"Issue a burst of read calls above 3/second and confirm the mode backs off instead of hammering."`
Expected: on `429`, the mode waits per the `Retry-After` header with backoff and jitter, then succeeds — it does not retry immediately in a tight loop. Keep the burst small and read-only.

Cleanup: none (read-only).

---

## 9. FEATURE CATALOG CROSS-REFERENCE

| ID | Scenario | Capability | Catalog Section |
|----|----------|-----------|-----------------|
| NOTION-01 | Bot user preflight | Users | §7 Users |
| NOTION-02 | Page round-trip | Pages | §3 Pages |
| NOTION-03 | Block round-trip | Blocks | §4 Blocks |
| NOTION-04 | Data-source query | Databases and data sources | §5 Databases and data sources |
| NOTION-05 | Comment round-trip | Comments | §6 Comments |
| NOTION-06 | Title-only search | Search | §8 Search |
| GAP-01 | Property items (non-truncated) | API-gap fill | §9 API-gap fills |
| BACKEND-01 | Headless backend selection | Backend routing | §2 Backend selection |
| FAIL-01 | Missing token | Auth | §2 Backend selection |
| FAIL-02 | Invalid token | Auth | §2 Backend selection |
| FAIL-03 | Rate-limit backoff | Operational doctrine | §10 Knowledge-layer references |
