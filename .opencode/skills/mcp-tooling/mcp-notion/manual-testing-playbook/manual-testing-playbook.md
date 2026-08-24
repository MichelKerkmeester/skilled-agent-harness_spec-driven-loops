---
title: "mcp-notion: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, and execution expectations for the mcp-notion skill: MCP tool round-trips via Code Mode, a direct-API gap call, backend selection, and auth/rate-limit failure -- read-only and scratch-safe, never destructive on a real workspace."
version: 0.1.0.1
---

# mcp-notion: Manual Testing Playbook

This document combines the full manual-validation contract for the `mcp-notion` skill into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide: it explains how realistic user-driven tests should be run, how evidence should be captured, how results should be graded, and where each scenario's execution contract lives. mcp-notion ships as a **split package** (33 scenarios across 8 categories): every scenario's user request, orchestrator prompt, exact command sequence, source anchors, and validation criteria live in its own per-feature file under `manual-testing-playbook/{category}/`, and this root document is the directory, review surface, and orchestration guide that points to each one.

---

This playbook package is a **split package** for `mcp-notion`: 33 scenarios across 8 categories, each with its own per-feature file under a category folder. The root document remains the directory, review surface, and orchestration guide -- Section 7 below is the by-category scenario directory that links to every per-feature file, which in turn owns the full 9-column execution contract.

Canonical package artifacts:
- `manual-testing-playbook.md` (this file)
- `pages/`
- `blocks/`
- `data-sources/`
- `comments/`
- `users/`
- `search/`
- `api-gap-fills/`
- `backend-and-failure/`

### Result persistence

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL`, or `SKIP` outcome and reason are persisted through `run-manual-playbook-scenario.cjs` into `<skill>/benchmark/reports/<dated-run-label>/`; generated report Markdown is renderer-owned and never hand-authored.

---

**EXECUTION POLICY:** Every scenario MUST be executed for real against a scratch Notion workspace -- not mocked, not stubbed. Run actual Code Mode calls, inspect real return values, make real REST calls. Valid statuses: **PASS**, **FAIL**, or **SKIP** (with a documented blocker). "UNAUTOMATABLE" is not a valid status.

Notion is a live cloud workspace with no headless sandbox, so **every scenario here is read-only or scratch-safe**. Writes happen only inside a disposable scratch page or scratch data source, and the only "delete" used is Notion's reversible archive-to-trash. No scenario mutates real workspace content.

---

## 1. OVERVIEW

This playbook provides a derived census of deterministic scenarios across categories validating the `mcp-notion` skill surface. Each scenario keeps its original ID; its full execution contract lives in its own per-feature file, indexed by category in Section 7.

Coverage note (2026-08-21): 33 operator scenarios across 8 categories cover 24 MCP tools plus 5 API-gap fills -- MCP tool round-trips (pages, blocks, data sources, comments, users, search) over Code Mode, five direct-API gap-fill scenarios, one backend-selection scenario confirming headless routing to local stdio, and three auth/rate-limit failure scenarios.

| Category | Capabilities | Scenarios |
|----------|-------------|-----------|
| Pages | Create, retrieve, update properties, archive, move, retrieve/update Markdown | 7 |
| Blocks | Retrieve, retrieve children, append, update, delete | 5 |
| Data sources | Retrieve database, retrieve/update/create data source, query, list templates | 6 |
| Comments | Create, list | 2 |
| Users | List, retrieve, retrieve bot user | 3 |
| Search | Search | 1 |
| API-gap fills | File uploads, views, page property items, async-task polling, daily notes | 5 |
| Backend and failure | Backend selection, missing token, invalid token, rate-limit backoff | 4 |
| **TOTAL** | **24 MCP tools + 5 gap fills (+ backend selection + 3 auth/failure)** | **33 scenarios** |

### Realistic Test Model

An operator reads: "create a scratch page, add a paragraph, then read it back." The mode routes this to the official Notion MCP through Code Mode. The orchestrator calls:

1. `notion["notion_retrieve-bot-user"]({})` -- auth/connectivity preflight (returns the bot user).
2. `notion["notion_create-a-page"]({...})` -- create the scratch page under a known parent.
3. `notion["notion_append-block-children"]({...})` -- append a paragraph block.
4. `notion["notion_retrieve-a-page"]({...})` -- read the page back and confirm.
5. `notion["notion_archive-a-page"]({...})` -- trash the scratch page (reversible cleanup).

A scenario PASSES only when both the **execution process** (correct tool called, correct arguments) and the **observable outcome** (the returned object matches, the page is visible then trashed) are verified.

### What Each Feature File Explains

Each per-feature scenario file under `manual-testing-playbook/{category}/` explains, in its own `## 2. SCENARIO CONTRACT` and `## 3. TEST EXECUTION` sections:

- The realistic user request that triggers the behavior
- The orchestrator brief or agent-facing prompt that drives the test
- The expected execution process, including delegation or external CLI use when relevant
- The desired user-visible outcome
- The implementation or knowledge-layer anchors that justify the scenario

---

## 2. GLOBAL PRECONDITIONS

All scenarios share these preconditions. Verify before starting.

1. Working directory is the project root (`pwd` shows the repo root).
2. Node and npx present: `node -v` prints v18 or newer; `npx --version` succeeds.
3. The `notion` manual is registered in `.utcp_config.json` (`grep -c '"name": "notion"' .utcp_config.json` returns 1).
4. `notion_NOTION_TOKEN` is set in the environment (or resolvable by the Code Mode runtime). Never print the token value.
5. A **scratch** Notion workspace or a scratch parent page is available, shared with the integration, and holds nothing real.
6. The integration (the token's bot user) has been granted access to that scratch parent -- Notion tokens see only explicitly shared content.
7. Internet access to `api.notion.com`.
8. **Cleanup discipline:** every scratch page or block created in a scenario is archived (trashed) at the end of that scenario. Trash is reversible; no hard delete exists.
9. mcp-notion has no destructive scenarios. The nearest equivalent is FAIL-001 and FAIL-002, which deliberately break auth: both MUST restore `notion_NOTION_TOKEN` to a valid value immediately after execution and before any other scenario runs.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

Each scenario MUST capture:

1. The Code Mode `call_tool_chain` code (or the direct REST request) that was run.
2. The tool/endpoint return value (redact any secret; never paste the token).
3. The observable outcome -- the object created, read, or archived, described or shown in the Notion UI.
4. Failure triage notes if the scenario fails (status code, error body, which precondition was unmet).
5. Cleanup confirmation -- the scratch page or block was archived at the end.

---

## 4. DETERMINISTIC COMMAND NOTATION

| Type | Notation | Example |
|------|----------|---------|
| MCP tool (Code Mode) | `notion["notion_<tool>"]({...})` | `notion["notion_retrieve-a-page"]({ page_id: "X" })` |
| Direct REST | `GET/POST <endpoint>` | `GET /v1/pages/{id}/properties/{prop}` |
| Bash | `bash: <command>` | `bash: grep -c '"name": "notion"' .utcp_config.json` |
| Sequential | `->` separator | `retrieve-bot-user -> create-a-page -> retrieve-a-page -> archive-a-page` |
| Expected output | `# -> expected` | `node -v  # -> v18 or newer` |

> **Tool names are illustrative.** The `notion_<tool>` identifiers shown here follow the local stdio server's kebab pattern. Notion tool names are hyphenated, so bracket access (`notion["notion_<tool>"]`) is the hyphen-safe form -- dot access (`notion.notion_<tool>`) is invalid JavaScript for a hyphenated name. Confirm the live callable form with `list_tools()` / `tool_info()` before running -- do not trust this file's names blindly.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual-testing-playbook.md` plus each scenario's per-feature file under `manual-testing-playbook/{category}/` -- the per-feature files own the full execution contract; this root is the directory and review surface.
2. Scenario execution evidence (Section 3 Global Evidence Requirements).
3. The feature-to-scenario coverage map (Section 1 Coverage table).
4. Triage notes for all non-pass outcomes.

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present.
4. Evidence is complete and readable.
5. Outcome rationale is explicit.

Scenario verdict:
- `PASS`: all acceptance checks true
- `FAIL`: expected behavior missing, contradictory output, or a critical check failed
- `SKIP`: a specific sandbox or runtime blocker prevents execution (the blocker must be named -- e.g. GAP-003 with no pre-seeded many-item relation)

### Feature Verdict Rules

- `PASS`: all mapped scenarios for the feature are `PASS`
- `FAIL`: any mapped scenario is `FAIL`
- `SKIP`: every mapped scenario is blocked by a named sandbox or runtime blocker

Hard rule:
- Any critical-path scenario `FAIL` forces the feature verdict to `FAIL`. USR-003 (retrieve-bot-user) is the critical-path gate -- its `FAIL` blocks every downstream scenario from running at all.

### Release Readiness Rule

Release is releasable only when:

1. No feature verdict is `FAIL`.
2. USR-003 (the critical-path gate) is `PASS`.
3. Coverage is 100% of the 33 scenarios defined in Section 1 (`COVERED_SCENARIOS == 33`).
4. No unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic in this root section. Scenario-specific acceptance caveats (for example GAP-003's pre-seeded-data dependency, or BACKEND-001's interactive-OAuth contrasting branch) stay inline with each scenario's own per-feature file under `manual-testing-playbook/{category}/` -- this root section keeps only the global verdict logic.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the manual testing package. It is not a runtime support matrix by itself.

### Operational Rules

1. Probe runtime capacity at start (run USR-003 first -- it is the connectivity gate every other scenario depends on).
2. Reserve one coordinator.
3. Saturate remaining worker slots.
4. Pre-assign explicit scenario IDs to each wave before execution.
5. Run token-perturbing scenarios (FAIL-001, FAIL-002) in a dedicated last wave and restore `notion_NOTION_TOKEN` to a valid value immediately after each. mcp-notion has no destructive scenarios; this is the nearest equivalent isolation requirement.
6. After each wave, save context and evidence, then begin the next wave.
7. Record utilization table and evidence paths in the final report.

### What Each Per-Feature File Contains

Each per-feature scenario file under `manual-testing-playbook/{category}/` contains:

- Real user request
- Prompt field following the natural-human voice contract (the actor is a human user, not an orchestrator delegating to another tool, for every scenario in this playbook)
- Expected delegation or alternate-CLI routing
- Desired user-visible outcome
- Feature-specific acceptance caveats or isolation constraints

### Suggested Waves

| Wave | Scenarios | Parallelizable | Constraint |
|------|-----------|-----------------|-----------|
| Wave 1 -- Connectivity Gate | USR-003 | No | Must PASS before any other wave starts |
| Wave 2 -- Read-Only | PAGE-002, PAGE-006, BLK-001, BLK-002, DS-001, DS-002, DS-003, DS-006, CMT-002, USR-001, USR-002, SRCH-001, GAP-003, GAP-004, BACKEND-001 | Yes (no writes) | Requires Wave 1 PASS |
| Wave 3 -- Scratch Write Round-Trips | PAGE-001, PAGE-003, PAGE-004, PAGE-005, PAGE-007, BLK-003, BLK-004, BLK-005, DS-004, DS-005, CMT-001, GAP-001, GAP-002, GAP-005 | Sequential within a shared scratch fixture; parallel across independent scratch pages/data sources | Requires Wave 1 PASS; reuse the scratch fixture a scenario file names, rather than creating a new one |
| Wave 4 -- Auth and Rate-Limit Failure | FAIL-001, FAIL-002, FAIL-003 | Sequential, last | Restore `notion_NOTION_TOKEN` after each of FAIL-001 and FAIL-002 before proceeding |

---

## 7. SCENARIO DIRECTORY (BY CATEGORY)

Every scenario's full 9-column execution contract (Feature ID, Feature Name, Scenario Objective, Exact Prompt, Exact Command Sequence, Expected Signals, Evidence, Pass/Fail Criteria, Failure Triage) lives in its own per-feature file. `Contract` below links straight to it; this root section is the directory only.

### Pages

| ID | Scenario | Objective | Contract |
|---|---|---|---|
| PAGE-001 | Create a page | Create a scratch page under a shared parent page, confirm it was created, then archive it. | [`pages/create-a-page.md`](pages/create-a-page.md) |
| PAGE-002 | Retrieve a page | Read a known scratch page's properties and metadata by ID. | [`pages/retrieve-a-page.md`](pages/retrieve-a-page.md) |
| PAGE-003 | Update page properties | Create a scratch page, patch its title property, confirm the patch, then archive. | [`pages/update-page-properties.md`](pages/update-page-properties.md) |
| PAGE-004 | Archive a page | Create a scratch page, archive it, and confirm the trashed state with a follow-up read. | [`pages/archive-a-page.md`](pages/archive-a-page.md) |
| PAGE-005 | Move a page | Create a scratch page, move it to a second scratch parent, confirm the new parent, then archive. | [`pages/move-page.md`](pages/move-page.md) |
| PAGE-006 | Retrieve page as Markdown | Read a known scratch page's block content as Markdown. | [`pages/retrieve-page-markdown.md`](pages/retrieve-page-markdown.md) |
| PAGE-007 | Update page via Markdown | Create a scratch page, write Markdown content to it, read it back to confirm, then archive. | [`pages/update-page-markdown.md`](pages/update-page-markdown.md) |

### Blocks

| ID | Scenario | Objective | Contract |
|---|---|---|---|
| BLK-001 | Retrieve a block | Create a scratch page, append one paragraph block to get a real `block_id`, retrieve that block by ID, then archive the scratch page as cleanup. | [`blocks/retrieve-a-block.md`](blocks/retrieve-a-block.md) |
| BLK-002 | Retrieve block children | Create a scratch page, append one paragraph block, list the page's children and confirm the appended block is present, then archive the scratch page as cleanup. | [`blocks/retrieve-block-children.md`](blocks/retrieve-block-children.md) |
| BLK-003 | Append block children | Create a scratch page, append one paragraph block to it, confirm the response contains a real block ID and matching content, then archive the scratch page as cleanup. | [`blocks/append-block-children.md`](blocks/append-block-children.md) |
| BLK-004 | Update a block | Create a scratch page, append one paragraph block to get a real `block_id`, update that block's text, confirm the new content is present, then archive the scratch page as cleanup. | [`blocks/update-a-block.md`](blocks/update-a-block.md) |
| BLK-005 | Delete a block | Create a scratch page, append one paragraph block to get a real `block_id`, trash that block, confirm the response reports `archived: true`, restore it, then archive the scratch page as cleanup. | [`blocks/delete-a-block.md`](blocks/delete-a-block.md) |

### Data Sources

| ID | Scenario | Objective | Contract |
|---|---|---|---|
| DS-001 | Retrieve a database | Read a scratch database container's metadata and confirm its data-source ID list resolves. | [`data-sources/retrieve-a-database.md`](data-sources/retrieve-a-database.md) |
| DS-002 | Retrieve a data source | Read a scratch data source's property schema and confirm it resolves. | [`data-sources/retrieve-a-data-source.md`](data-sources/retrieve-a-data-source.md) |
| DS-003 | Query a data source | Query a scratch data source for rows and confirm a paginated result resolves, empty or not. | [`data-sources/query-data-source.md`](data-sources/query-data-source.md) |
| DS-004 | Update a data source | Create a scratch data source, then rename it and add a `Status` property, and confirm the schema edit is reflected. | [`data-sources/update-a-data-source.md`](data-sources/update-a-data-source.md) |
| DS-005 | Create a data source | Create a new scratch data source with a minimal `Name` schema under a scratch parent page. | [`data-sources/create-a-data-source.md`](data-sources/create-a-data-source.md) |
| DS-006 | List data source templates | List a scratch data source's page templates and confirm the result resolves, empty or not. | [`data-sources/list-data-source-templates.md`](data-sources/list-data-source-templates.md) |

### Comments

| ID | Scenario | Objective | Contract |
|---|---|---|---|
| CMT-001 | Create a comment | Create a scratch page, add a comment to it via `create-a-comment`, confirm it appears via `list-comments`, then archive the scratch page as cleanup. | [`comments/create-a-comment.md`](comments/create-a-comment.md) |
| CMT-002 | List comments | List the unresolved comments on a known shared page via `list-comments` and confirm the response shape, whether or not any comments exist. | [`comments/list-comments.md`](comments/list-comments.md) |

### Users

| ID | Scenario | Objective | Contract |
|---|---|---|---|
| USR-001 | List all users | List the workspace's users via `list-all-users` and confirm at least one row (the integration's own bot user) is present. | [`users/list-all-users.md`](users/list-all-users.md) |
| USR-002 | Retrieve a user | Source a `user_id` from `list-all-users`, then confirm `retrieve-a-user` returns a matching user object for that ID. | [`users/retrieve-a-user.md`](users/retrieve-a-user.md) |
| USR-003 | Retrieve your bot user (CRITICAL PATH) | Confirm `retrieve-bot-user` resolves with the integration's own bot identity, no input required. | [`users/retrieve-bot-user.md`](users/retrieve-bot-user.md) |

### Search

| ID | Scenario | Objective | Contract |
|---|---|---|---|
| SRCH-001 | Search | Confirm `search` finds a fixture page by a title-matching query, and confirm the same tool returns no result for a query matching only that page's body text. | [`search/search.md`](search/search.md) |

### API-Gap Fills

| ID | Scenario | Objective | Contract |
|---|---|---|---|
| GAP-001 | File uploads | Create a file upload via direct REST, send its bytes, then attach the finished upload to a scratch page and confirm it is visible. | [`api-gap-fills/file-uploads.md`](api-gap-fills/file-uploads.md) |
| GAP-002 | Views | Create a table view on a scratch data source, confirm it appears in the list, run its query, then delete it. | [`api-gap-fills/views.md`](api-gap-fills/views.md) |
| GAP-003 | Page property items | Read a page's relation property via the MCP, confirm it is truncated (or note the item count), then fetch the same property via the direct endpoint and confirm it returns the full paginated set. | [`api-gap-fills/page-property-items.md`](api-gap-fills/page-property-items.md) |
| GAP-004 | Async-task polling | Poll a known async task id via direct REST until its status reports completion, honoring the rate-limit budget between polls. | [`api-gap-fills/async-task-polling.md`](api-gap-fills/async-task-polling.md) |
| GAP-005 | Daily notes | Query for today's daily note, create it if absent, then re-query to confirm exactly one page exists for the date. | [`api-gap-fills/daily-notes.md`](api-gap-fills/daily-notes.md) |

### Backend and Failure

| ID | Scenario | Objective | Contract |
|---|---|---|---|
| BACKEND-001 | Headless backend selection | Confirm the `notion` manual is registered against the local stdio transport and that a call resolves with no OAuth step. | [`backend-and-failure/backend-selection.md`](backend-and-failure/backend-selection.md) |
| FAIL-001 | Missing token | Confirm `retrieve-bot-user` fails with a named-credential error when `notion_NOTION_TOKEN` is unset, then restore the token and confirm recovery. | [`backend-and-failure/missing-token.md`](backend-and-failure/missing-token.md) |
| FAIL-002 | Invalid token | Confirm `retrieve-bot-user` surfaces `401` unauthorized for a wrong token, then restore the valid token and confirm recovery. | [`backend-and-failure/invalid-token.md`](backend-and-failure/invalid-token.md) |
| FAIL-003 | Rate-limit backoff | Issue a small read-only burst above ~3 req/s, observe a `429`, and confirm the retry honors `Retry-After` plus jitter before eventually succeeding. | [`backend-and-failure/rate-limit-backoff.md`](backend-and-failure/rate-limit-backoff.md) |

---

## 8. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| _None_ | mcp-notion has no automated test suite. `scripts/doctor.sh` performs read-only Node/npx/manual/token diagnostics; `scripts/install.sh` prints registration state. Neither asserts a pass/fail scenario outcome. | All 33 scenarios remain manual-only |

No automated regression tests exist for this mode yet. `scripts/doctor.sh` and `scripts/install.sh` are non-mutating diagnostics, not tests -- they confirm the preconditions in Section 2 but provide no scenario-level assertion overlap.

---

## 9. FEATURE CATALOG CROSS-REFERENCE INDEX

This 1:1 table is the proof that every scenario has both a catalog entry and a per-feature scenario file. The four `backend-and-failure` scenarios have no per-feature catalog file, so their catalog entry links the catalog root instead.

| ID | Scenario | Category | Catalog entry | Scenario file |
|---|---|---|---|---|
| PAGE-001 | Create a page | Pages | [`pages/create-a-page.md`](../feature-catalog/pages/create-a-page.md) | [`pages/create-a-page.md`](pages/create-a-page.md) |
| PAGE-002 | Retrieve a page | Pages | [`pages/retrieve-a-page.md`](../feature-catalog/pages/retrieve-a-page.md) | [`pages/retrieve-a-page.md`](pages/retrieve-a-page.md) |
| PAGE-003 | Update page properties | Pages | [`pages/update-page-properties.md`](../feature-catalog/pages/update-page-properties.md) | [`pages/update-page-properties.md`](pages/update-page-properties.md) |
| PAGE-004 | Archive a page | Pages | [`pages/archive-a-page.md`](../feature-catalog/pages/archive-a-page.md) | [`pages/archive-a-page.md`](pages/archive-a-page.md) |
| PAGE-005 | Move a page | Pages | [`pages/move-page.md`](../feature-catalog/pages/move-page.md) | [`pages/move-page.md`](pages/move-page.md) |
| PAGE-006 | Retrieve page as Markdown | Pages | [`pages/retrieve-page-markdown.md`](../feature-catalog/pages/retrieve-page-markdown.md) | [`pages/retrieve-page-markdown.md`](pages/retrieve-page-markdown.md) |
| PAGE-007 | Update page via Markdown | Pages | [`pages/update-page-markdown.md`](../feature-catalog/pages/update-page-markdown.md) | [`pages/update-page-markdown.md`](pages/update-page-markdown.md) |
| BLK-001 | Retrieve a block | Blocks | [`blocks/retrieve-a-block.md`](../feature-catalog/blocks/retrieve-a-block.md) | [`blocks/retrieve-a-block.md`](blocks/retrieve-a-block.md) |
| BLK-002 | Retrieve block children | Blocks | [`blocks/retrieve-block-children.md`](../feature-catalog/blocks/retrieve-block-children.md) | [`blocks/retrieve-block-children.md`](blocks/retrieve-block-children.md) |
| BLK-003 | Append block children | Blocks | [`blocks/append-block-children.md`](../feature-catalog/blocks/append-block-children.md) | [`blocks/append-block-children.md`](blocks/append-block-children.md) |
| BLK-004 | Update a block | Blocks | [`blocks/update-a-block.md`](../feature-catalog/blocks/update-a-block.md) | [`blocks/update-a-block.md`](blocks/update-a-block.md) |
| BLK-005 | Delete a block | Blocks | [`blocks/delete-a-block.md`](../feature-catalog/blocks/delete-a-block.md) | [`blocks/delete-a-block.md`](blocks/delete-a-block.md) |
| DS-001 | Retrieve a database | Data sources | [`data-sources/retrieve-a-database.md`](../feature-catalog/data-sources/retrieve-a-database.md) | [`data-sources/retrieve-a-database.md`](data-sources/retrieve-a-database.md) |
| DS-002 | Retrieve a data source | Data sources | [`data-sources/retrieve-a-data-source.md`](../feature-catalog/data-sources/retrieve-a-data-source.md) | [`data-sources/retrieve-a-data-source.md`](data-sources/retrieve-a-data-source.md) |
| DS-003 | Query a data source | Data sources | [`data-sources/query-data-source.md`](../feature-catalog/data-sources/query-data-source.md) | [`data-sources/query-data-source.md`](data-sources/query-data-source.md) |
| DS-004 | Update a data source | Data sources | [`data-sources/update-a-data-source.md`](../feature-catalog/data-sources/update-a-data-source.md) | [`data-sources/update-a-data-source.md`](data-sources/update-a-data-source.md) |
| DS-005 | Create a data source | Data sources | [`data-sources/create-a-data-source.md`](../feature-catalog/data-sources/create-a-data-source.md) | [`data-sources/create-a-data-source.md`](data-sources/create-a-data-source.md) |
| DS-006 | List data source templates | Data sources | [`data-sources/list-data-source-templates.md`](../feature-catalog/data-sources/list-data-source-templates.md) | [`data-sources/list-data-source-templates.md`](data-sources/list-data-source-templates.md) |
| CMT-001 | Create a comment | Comments | [`comments/create-a-comment.md`](../feature-catalog/comments/create-a-comment.md) | [`comments/create-a-comment.md`](comments/create-a-comment.md) |
| CMT-002 | List comments | Comments | [`comments/list-comments.md`](../feature-catalog/comments/list-comments.md) | [`comments/list-comments.md`](comments/list-comments.md) |
| USR-001 | List all users | Users | [`users/list-all-users.md`](../feature-catalog/users/list-all-users.md) | [`users/list-all-users.md`](users/list-all-users.md) |
| USR-002 | Retrieve a user | Users | [`users/retrieve-a-user.md`](../feature-catalog/users/retrieve-a-user.md) | [`users/retrieve-a-user.md`](users/retrieve-a-user.md) |
| USR-003 | Retrieve your bot user | Users | [`users/retrieve-bot-user.md`](../feature-catalog/users/retrieve-bot-user.md) | [`users/retrieve-bot-user.md`](users/retrieve-bot-user.md) |
| SRCH-001 | Search | Search | [`search/search.md`](../feature-catalog/search/search.md) | [`search/search.md`](search/search.md) |
| GAP-001 | File uploads | API-gap fills | [`api-gap-fills/file-uploads.md`](../feature-catalog/api-gap-fills/file-uploads.md) | [`api-gap-fills/file-uploads.md`](api-gap-fills/file-uploads.md) |
| GAP-002 | Views | API-gap fills | [`api-gap-fills/views.md`](../feature-catalog/api-gap-fills/views.md) | [`api-gap-fills/views.md`](api-gap-fills/views.md) |
| GAP-003 | Page property items | API-gap fills | [`api-gap-fills/page-property-items.md`](../feature-catalog/api-gap-fills/page-property-items.md) | [`api-gap-fills/page-property-items.md`](api-gap-fills/page-property-items.md) |
| GAP-004 | Async-task polling | API-gap fills | [`api-gap-fills/async-task-polling.md`](../feature-catalog/api-gap-fills/async-task-polling.md) | [`api-gap-fills/async-task-polling.md`](api-gap-fills/async-task-polling.md) |
| GAP-005 | Daily notes | API-gap fills | [`api-gap-fills/daily-notes.md`](../feature-catalog/api-gap-fills/daily-notes.md) | [`api-gap-fills/daily-notes.md`](api-gap-fills/daily-notes.md) |
| BACKEND-001 | Headless backend selection | Backend and failure | [`FEATURE-CATALOG.md`](../feature-catalog/FEATURE-CATALOG.md) | [`backend-and-failure/backend-selection.md`](backend-and-failure/backend-selection.md) |
| FAIL-001 | Missing token | Backend and failure | [`FEATURE-CATALOG.md`](../feature-catalog/FEATURE-CATALOG.md) | [`backend-and-failure/missing-token.md`](backend-and-failure/missing-token.md) |
| FAIL-002 | Invalid token | Backend and failure | [`FEATURE-CATALOG.md`](../feature-catalog/FEATURE-CATALOG.md) | [`backend-and-failure/invalid-token.md`](backend-and-failure/invalid-token.md) |
| FAIL-003 | Rate-limit backoff | Backend and failure | [`FEATURE-CATALOG.md`](../feature-catalog/FEATURE-CATALOG.md) | [`backend-and-failure/rate-limit-backoff.md`](backend-and-failure/rate-limit-backoff.md) |
