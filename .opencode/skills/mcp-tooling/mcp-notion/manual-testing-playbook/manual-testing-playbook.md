---
title: "mcp-notion: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, and execution expectations for the mcp-notion skill: MCP tool round-trips via Code Mode, a direct-API gap call, backend selection, and auth/rate-limit failure -- read-only and scratch-safe, never destructive on a real workspace."
version: 0.1.0.1
---

# mcp-notion: Manual Testing Playbook

This document combines the full manual-validation contract for the `mcp-notion` skill into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide: it explains how realistic user-driven tests should be run, how evidence should be captured, how results should be graded, and where each scenario's execution contract lives. Because mcp-notion ships as a **single-file playbook** (11 scenarios, no per-feature split), every scenario's user request, orchestrator prompt, execution process, source anchors, and validation criteria live inline in this same document rather than in separate per-feature files.

---

This playbook package is intentionally **single-file** for `mcp-notion`: with 11 scenarios across 4 categories, the root document carries the full execution contract inline instead of splitting into per-feature files under category folders. The root document remains the directory, review surface, and orchestration guide, **and** the sole execution-truth source -- every scenario's 9-column contract lives inline in Sections 7-10 below.

Canonical package artifacts:
- `manual-testing-playbook.md` (this file -- mcp-notion ships no separate category folders or per-feature files)

### Result persistence

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL`, or `SKIP` outcome and reason are persisted through `run-manual-playbook-scenario.cjs` into `<skill>/benchmark/reports/<dated-run-label>/`; generated report Markdown is renderer-owned and never hand-authored.

---

**EXECUTION POLICY:** Every scenario MUST be executed for real against a scratch Notion workspace -- not mocked, not stubbed. Run actual Code Mode calls, inspect real return values, make real REST calls. Valid statuses: **PASS**, **FAIL**, or **SKIP** (with a documented blocker). "UNAUTOMATABLE" is not a valid status.

Notion is a live cloud workspace with no headless sandbox, so **every scenario here is read-only or scratch-safe**. Writes happen only inside a disposable scratch page or scratch data source, and the only "delete" used is Notion's reversible archive-to-trash. No scenario mutates real workspace content.

---

## 1. OVERVIEW

This playbook provides a derived census of deterministic scenarios across categories validating the `mcp-notion` skill surface. Each scenario keeps its original ID and its full execution contract inline in Sections 7-10.

Coverage note (2026-08-21): 11 operator scenarios across 4 categories cover 24 MCP tools plus 5 API-gap fills -- MCP tool round-trips (pages, blocks, data sources, comments, users, search) over Code Mode, one direct-API gap fill for non-truncated page property items, one backend-selection scenario confirming headless routing to local stdio, and three auth/rate-limit failure scenarios.

| Category | Capabilities | Scenarios |
|----------|-------------|-----------|
| MCP tool round-trip (Code Mode) | Pages, blocks, data sources, comments, users, search | 6 |
| API-gap direct call | Page property items (non-truncated) | 1 |
| Backend selection | Local stdio vs remote OAuth routing | 1 |
| Auth and failure | Missing / invalid `NOTION_TOKEN`, rate-limit backoff | 3 |
| **TOTAL** | **24 MCP tools + 5 gap fills** | **11 scenarios** |

### Realistic Test Model

An operator reads: "create a scratch page, add a paragraph, then read it back." The mode routes this to the official Notion MCP through Code Mode. The orchestrator calls:

1. `notion["notion_retrieve-bot-user"]({})` -- auth/connectivity preflight (returns the bot user).
2. `notion["notion_create-a-page"]({...})` -- create the scratch page under a known parent.
3. `notion["notion_append-block-children"]({...})` -- append a paragraph block.
4. `notion["notion_retrieve-a-page"]({...})` -- read the page back and confirm.
5. `notion["notion_archive-a-page"]({...})` -- trash the scratch page (reversible cleanup).

A scenario PASSES only when both the **execution process** (correct tool called, correct arguments) and the **observable outcome** (the returned object matches, the page is visible then trashed) are verified.

### What Each Feature File Should Explain

mcp-notion has no separate per-feature files -- this content lives inline in each scenario's `#### Description` and `#### Scenario Contract` blocks in Sections 7-10:

- The realistic user request that should trigger the behavior
- The orchestrator brief or agent-facing prompt that should drive the test
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
9. mcp-notion has no destructive scenarios. The nearest equivalent is FAIL-01 and FAIL-02, which deliberately break auth: both MUST restore `notion_NOTION_TOKEN` to a valid value immediately after execution and before any other scenario runs.

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

1. `manual-testing-playbook.md` -- the sole scenario-contract source; mcp-notion ships no separate per-feature files.
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
- `SKIP`: a specific sandbox or runtime blocker prevents execution (the blocker must be named -- e.g. GAP-01 with no pre-seeded many-item relation)

### Feature Verdict Rules

- `PASS`: all mapped scenarios for the feature are `PASS`
- `FAIL`: any mapped scenario is `FAIL`
- `SKIP`: every mapped scenario is blocked by a named sandbox or runtime blocker

Hard rule:
- Any critical-path scenario `FAIL` forces the feature verdict to `FAIL`. NOTION-01 is the critical-path gate -- its `FAIL` blocks every downstream scenario from running at all.

### Release Readiness Rule

Release is releasable only when:

1. No feature verdict is `FAIL`.
2. NOTION-01 (the critical-path gate) is `PASS`.
3. Coverage is 100% of the 11 scenarios defined in Section 1 (`COVERED_SCENARIOS == 11`).
4. No unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic in this root section. Scenario-specific acceptance caveats (for example GAP-01's pre-seeded-data dependency, or BACKEND-01's interactive-OAuth contrasting branch) stay inline with each scenario's `#### Scenario Contract` and `#### Test Execution` blocks in Sections 7-10 -- mcp-notion has no separate per-feature files to hold them.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the manual testing package. It is not a runtime support matrix by itself.

### Operational Rules

1. Probe runtime capacity at start (run NOTION-01 first -- it is the connectivity gate every other scenario depends on).
2. Reserve one coordinator.
3. Saturate remaining worker slots.
4. Pre-assign explicit scenario IDs to each wave before execution.
5. Run token-perturbing scenarios (FAIL-01, FAIL-02) in a dedicated last wave and restore `notion_NOTION_TOKEN` to a valid value immediately after each. mcp-notion has no destructive scenarios; this is the nearest equivalent isolation requirement.
6. After each wave, save context and evidence, then begin the next wave.
7. Record utilization table and evidence paths in the final report.

### What Belongs In Per-Feature Files

mcp-notion has no separate per-feature files -- this content lives inline in each scenario's `#### Scenario Contract` block in Sections 7-10:

- Real user request
- Prompt field following the natural-human voice contract (the actor is a human user, not an orchestrator delegating to another tool, for every scenario in this playbook)
- Expected delegation or alternate-CLI routing
- Desired user-visible outcome
- Feature-specific acceptance caveats or isolation constraints

### Suggested Waves

| Wave | Scenarios | Parallelizable | Constraint |
|------|-----------|-----------------|-----------|
| Wave 1 -- Connectivity Gate | NOTION-01 | No | Must PASS before any other wave starts |
| Wave 2 -- Read-Only | NOTION-04, NOTION-06, BACKEND-01, GAP-01 | Yes (no writes) | Requires Wave 1 PASS |
| Wave 3 -- Scratch Write Round-Trips | NOTION-02, NOTION-03, NOTION-05 | Sequential | NOTION-03 and NOTION-05 reuse the scratch page from NOTION-02; requires Wave 1 PASS |
| Wave 4 -- Auth and Rate-Limit Failure | FAIL-01, FAIL-02, FAIL-03 | Sequential, last | Restore `notion_NOTION_TOKEN` after each of FAIL-01 and FAIL-02 before proceeding |

---

## 7. MCP TOOL ROUND-TRIP SCENARIOS (`NOTION-01..NOTION-06`)

### NOTION-01 | Bot User Preflight (CRITICAL PATH)

#### Description
Verify `notion_retrieve-bot-user` returns the integration's bot user -- the connectivity and auth smoke test that gates every other scenario.

#### Scenario Contract
Prompt: `"Confirm the Notion integration is connected and report the bot user."`

Single read-only Code Mode call against the local stdio backend; no scratch content is created.

Desired user-visible outcome: the operator sees a confirmed bot identity with no error, clearing every other scenario to run.

#### Test Execution

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NOTION-01 | Bot User Preflight | Verify retrieve-bot-user returns the bot user (gate for all other scenarios) | `"Confirm the Notion integration is connected and report the bot user."` | 1. `notion["notion_retrieve-bot-user"]({})` | Step 1: return includes a `bot` type and the integration name; no error | Code Mode call code; return object (redact token) | PASS if bot object returned with no error; FAIL if error thrown or `bot` type missing | 1. Confirm `notion_NOTION_TOKEN` is set -> 2. Confirm the `notion` manual is registered (`grep -c '"name": "notion"' .utcp_config.json`) -> 3. Re-run `list_tools()` to confirm the callable name, then retry |

Cleanup: none (read-only).

> **Scenario Detail:** inline above -- mcp-notion ships no separate per-feature file.
> **Catalog:** [FEATURE-CATALOG.md, section 7 Users](../feature-catalog/FEATURE-CATALOG.md)

### NOTION-02 | Page Create -> Read -> Archive Round-Trip

#### Description
Verify a page lifecycle: `create-a-page -> retrieve-a-page -> archive-a-page`, all against the scratch parent.

#### Scenario Contract
Prompt: `"Create a scratch page titled 'MCP Test Page' under the scratch parent, read it back, then trash it."`

Creates one scratch page, confirms it round-trips through a read, then archives it as the scenario's own cleanup.

Desired user-visible outcome: the scratch page exists, is readable with the expected title, then is trashed and confirmed archived.

#### Test Execution

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NOTION-02 | Page Create -> Read -> Archive Round-Trip | Verify page lifecycle round-trip against the scratch parent | `"Create a scratch page titled 'MCP Test Page' under the scratch parent, read it back, then trash it."` | 1. `notion["notion_create-a-page"]({...})` -> 2. `notion["notion_retrieve-a-page"]({ page_id })` -> 3. `notion["notion_archive-a-page"]({ page_id })` -> 4. `notion["notion_retrieve-a-page"]({ page_id })` | Step 1: returns a `page_id`; Step 2: returns the same page with the title; Step 3: marks the page trashed; Step 4: shows `archived: true` | page_id; retrieved title; archived flag before and after | PASS if create returns a page_id, the retrieve matches the title, and the follow-up retrieve shows `archived: true`; FAIL if any step errors or the follow-up retrieve is not archived | 1. Confirm the scratch parent is shared with the integration -> 2. Confirm the properties payload matches the parent's schema -> 3. Re-run the follow-up retrieve to confirm archive propagation |

Cleanup: the page is archived by the scenario itself (this is the cleanup).

> **Scenario Detail:** inline above -- mcp-notion ships no separate per-feature file.
> **Catalog:** [FEATURE-CATALOG.md, section 3 Pages](../feature-catalog/FEATURE-CATALOG.md)

### NOTION-03 | Block Append -> Read Round-Trip

#### Description
Verify block content: `append-block-children -> retrieve-block-children` on the scratch page from NOTION-02 (recreate a scratch page if needed).

#### Scenario Contract
Prompt: `"Append a paragraph block to the scratch page, then list its children and confirm the paragraph is present."`

Appends one paragraph block to the NOTION-02 scratch page, then reads block children back to confirm content landed on the correct surface.

Desired user-visible outcome: the paragraph text is visible in the page and confirmed via the children listing.

#### Test Execution

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NOTION-03 | Block Append -> Read Round-Trip | Verify a paragraph block append is visible in the children listing | `"Append a paragraph block to the scratch page, then list its children and confirm the paragraph is present."` | 1. `notion["notion_append-block-children"]({ block_id, children })` -> 2. `notion["notion_retrieve-block-children"]({ block_id })` | Step 1: returns the new block(s); Step 2: listing shows the paragraph text | Appended block id(s); children-listing content | PASS if the appended paragraph text is present in the children listing; FAIL if the block is missing or the append errors | 1. Confirm the NOTION-02 scratch page still exists (recreate if it was already archived) -> 2. Confirm the block payload matches the paragraph block-type schema -> 3. Re-run the children listing to rule out pagination truncation |

Cleanup: archive the scratch page.

> **Scenario Detail:** inline above -- mcp-notion ships no separate per-feature file.
> **Catalog:** [FEATURE-CATALOG.md, section 4 Blocks](../feature-catalog/FEATURE-CATALOG.md)

### NOTION-04 | Data-Source Query (READ-ONLY)

#### Description
Verify `query-data-source` returns rows from a scratch data source without mutating anything.

#### Scenario Contract
Prompt: `"Query the scratch data source and return the first page of rows with no filter."`

Single read-only query against a scratch data source; an empty result set is a valid outcome, not a failure.

Desired user-visible outcome: the operator sees the first page of rows (or a confirmed-empty result) with no mutation.

#### Test Execution

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NOTION-04 | Data-Source Query | Verify an unfiltered query returns a paginated row list | `"Query the scratch data source and return the first page of rows with no filter."` | 1. `notion["notion_query-data-source"]({ data_source_id })` | Step 1: returns a paginated list of pages (rows); `[]` for an empty data source is valid | Returned rows (or confirmed-empty array); data_source_id used | PASS if a paginated list object is returned (empty or populated) with no error; FAIL if the call errors or the object is not a paginated list | 1. Confirm the id used is a **data-source id**, not a database id -> 2. Confirm the integration has access to the parent database -> 3. Re-run with an explicit `filter: {}` to rule out a malformed default |

Cleanup: none (read-only).

> **Scenario Detail:** inline above -- mcp-notion ships no separate per-feature file.
> **Catalog:** [FEATURE-CATALOG.md, section 5 Databases and data sources](../feature-catalog/FEATURE-CATALOG.md)

### NOTION-05 | Comment Create -> List Round-Trip

#### Description
Verify comments: `create-a-comment -> list-comments` on the scratch page.

#### Scenario Contract
Prompt: `"Add a comment 'MCP test comment' to the scratch page, then list its comments and confirm it appears."`

Creates one comment on the NOTION-02 scratch page, then confirms it is present in the comment listing.

Desired user-visible outcome: the comment is visible on the scratch page and confirmed via the listing call.

#### Test Execution

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NOTION-05 | Comment Create -> List Round-Trip | Verify a created comment appears in the listing | `"Add a comment 'MCP test comment' to the scratch page, then list its comments and confirm it appears."` | 1. `notion["notion_create-a-comment"]({ parent, rich_text })` -> 2. `notion["notion_list-comments"]({ block_id })` | Step 1: returns a comment object; Step 2: listing returns the comment with matching text | Comment id; listed comment text | PASS if the listed comments include the created text; FAIL if the comment is missing or either call errors | 1. Confirm the scratch page still exists -> 2. Confirm the `rich_text` payload shape matches the comment schema -> 3. Re-run the list call to rule out propagation delay |

Cleanup: archive the scratch page (comments go with it).

> **Scenario Detail:** inline above -- mcp-notion ships no separate per-feature file.
> **Catalog:** [FEATURE-CATALOG.md, section 6 Comments](../feature-catalog/FEATURE-CATALOG.md)

### NOTION-06 | Search Is Title-Only (STRUCTURAL LIMIT)

#### Description
Verify `search` matches on title and does **not** perform full-text content search.

#### Scenario Contract
Prompt: `"Search for the scratch page by its title, then search for a unique phrase that only appears in its body."`

Two read-only search calls confirming the documented title-only structural limit; no scratch content is created.

Desired user-visible outcome: the operator sees confirmation that title search finds the page while body-content search does not, matching the documented limit.

#### Test Execution

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NOTION-06 | Search Is Title-Only | Verify search matches on title, not full-text body content | `"Search for the scratch page by its title, then search for a unique phrase that only appears in its body."` | 1. `notion["notion_search"]({ query: "<page title>" })` -> 2. `notion["notion_search"]({ query: "<unique body phrase>" })` | Step 1: returns the page; Step 2: does not return the page | Both search result sets | PASS if the title search finds the page and the body-phrase search does not; FAIL if the body-phrase search unexpectedly returns the page, or the title search misses it | 1. Confirm the title used matches exactly -> 2. Confirm the page is shared with the integration -> 3. Re-run the title search alone to isolate a search-index propagation delay |

Cleanup: none (read-only).

> **Scenario Detail:** inline above -- mcp-notion ships no separate per-feature file.
> **Catalog:** [FEATURE-CATALOG.md, section 8 Search](../feature-catalog/FEATURE-CATALOG.md)

---

## 8. API-GAP DIRECT-CALL SCENARIOS (`GAP-01`)

### GAP-01 | Non-Truncated Page Property Items

#### Description
Verify the direct-API fill for property truncation: `retrieve-a-page` truncates a relation/rollup/people property past ~25 items, and the direct page-property-item endpoint returns the full paginated list.

#### Scenario Contract
Prompt: `"Read a page whose relation property has more than 25 items via the MCP, then fetch the full list via the direct property-item endpoint."`

Requires an existing scratch page pre-seeded with a many-item relation property; falls back to `SKIP` with a named blocker if none exists. Uses `Notion-Version: 2025-09-03` and the Bearer token from `$notion_NOTION_TOKEN`, never hardcoded.

Desired user-visible outcome: the operator confirms the gap and its fill -- the MCP shows a truncated property, and the direct call recovers the complete paginated set.

#### Test Execution

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| GAP-01 | Non-Truncated Page Property Items | Verify the property-item direct call recovers the full list past the ~25-item MCP truncation | `"Read a page whose relation property has more than 25 items via the MCP, then fetch the full list via the direct property-item endpoint."` | 1. `notion["notion_retrieve-a-page"]({ page_id })` -> 2. `GET /v1/pages/{page_id}/properties/{property_id}?page_size=100` (Bearer `$notion_NOTION_TOKEN`, `Notion-Version: 2025-09-03`) | Step 1: shows a truncated / `has_more` property; Step 2: paginates to the complete set, following `start_cursor` until `has_more` is false | MCP page-read truncation flag; direct-call paginated result set; item-count comparison | PASS if the direct call returns the full item count past the ~25-item MCP truncation; FAIL if the direct call also truncates or errors | 1. Confirm a scratch page pre-seeded with a many-item relation exists, else SKIP with that blocker -> 2. Confirm the `Notion-Version: 2025-09-03` header is set -> 3. Confirm the token is read from `$notion_NOTION_TOKEN`, never hardcoded |

Cleanup: none (read-only). Use an existing scratch page pre-seeded with a many-item relation, or SKIP with a documented blocker if none exists.

> **Scenario Detail:** inline above -- mcp-notion ships no separate per-feature file.
> **Catalog:** [FEATURE-CATALOG.md, section 9 API-gap fills](../feature-catalog/FEATURE-CATALOG.md)

---

## 9. BACKEND SELECTION SCENARIOS (`BACKEND-01`)

### BACKEND-01 | Headless Routes to Local Stdio

#### Description
Verify the smart router selects the **local stdio** backend for headless Code Mode execution, not the remote OAuth server.

#### Scenario Contract
Prompt: `"In a headless run with NOTION_TOKEN set and no browser, confirm which backend the mode selects."`

Read-only inspection of `.utcp_config.json` plus one confirming call; an interactive session with OAuth available would instead prefer remote -- that is the contrasting branch, stated but not executed headlessly.

Desired user-visible outcome: the operator confirms the headless path always resolves through local stdio, never attempting remote OAuth without a browser session.

#### Test Execution

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| BACKEND-01 | Headless Routes to Local Stdio | Verify headless Code Mode always selects the local stdio backend | `"In a headless run with NOTION_TOKEN set and no browser, confirm which backend the mode selects."` | 1. `bash: grep -c '"name": "notion"' .utcp_config.json` -> 2. inspect the `notion` manual's `transport` field in `.utcp_config.json` -> 3. `notion["notion_retrieve-bot-user"]({})` to confirm calls resolve through the local server | Step 1: returns `1`; Step 2: `transport: "stdio"`, command `npx -y @notionhq/notion-mcp-server`; Step 3: call resolves with no OAuth prompt | `.utcp_config.json` manual entry; successful headless call transcript | PASS if the mode selects local stdio (no OAuth step) and the call resolves; FAIL if the mode attempts remote OAuth in a headless context | 1. Confirm the `notion` manual config still points at local `npx` -> 2. Confirm no OAuth token is being injected into a headless run -> 3. Re-check that the interactive-session branch is genuinely absent |

Cleanup: none (read-only inspection).

> **Scenario Detail:** inline above -- mcp-notion ships no separate per-feature file.
> **Catalog:** [FEATURE-CATALOG.md, section 2 Backend selection](../feature-catalog/FEATURE-CATALOG.md)

---

## 10. AUTH AND FAILURE SCENARIOS (`FAIL-01..FAIL-03`)

### FAIL-01 | Missing Token

#### Description
Verify a clear failure when `NOTION_TOKEN` / `notion_NOTION_TOKEN` is unset.

#### Scenario Contract
Prompt: `"Call retrieve-bot-user with no Notion token configured."`

Token-perturbing scenario -- run in the last wave (Section 6) and restore the valid token immediately after.

Desired user-visible outcome: the operator sees a clear, named-credential error rather than a generic crash, with an obvious recovery path.

#### Test Execution

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FAIL-01 | Missing Token | Verify retrieve-bot-user fails with a named-credential error when the token is unset | `"Call retrieve-bot-user with no Notion token configured."` | 1. unset `notion_NOTION_TOKEN` -> 2. `notion["notion_retrieve-bot-user"]({})` | Step 2: call fails with an auth error naming the token, not a generic crash; exit non-zero | Error message/body; exit code | PASS if the failure names the missing token credential; FAIL if it crashes generically or silently returns empty | 1. Confirm the token was actually unset for this run -> 2. Confirm the error path is reached (not a cached client) -> 3. Restore `notion_NOTION_TOKEN` and re-run NOTION-01 to confirm recovery |

Cleanup: restore the token before continuing.

> **Scenario Detail:** inline above -- mcp-notion ships no separate per-feature file.
> **Catalog:** [FEATURE-CATALOG.md, section 2 Backend selection](../feature-catalog/FEATURE-CATALOG.md)

### FAIL-02 | Invalid Token

#### Description
Verify an invalid token produces a `401 unauthorized` rather than a silent empty result.

#### Scenario Contract
Prompt: `"Call retrieve-bot-user with a deliberately wrong Notion token."`

Token-perturbing scenario -- run in the last wave (Section 6) and restore the valid token immediately after.

Desired user-visible outcome: the operator sees an explicit `401`/unauthorized error, never a silent empty success that could be mistaken for a valid but empty result.

#### Test Execution

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FAIL-02 | Invalid Token | Verify retrieve-bot-user surfaces 401 unauthorized for a wrong token, never a silent empty success | `"Call retrieve-bot-user with a deliberately wrong Notion token."` | 1. set `notion_NOTION_TOKEN` to a deliberately invalid value -> 2. `notion["notion_retrieve-bot-user"]({})` | Step 2: `401` / unauthorized error surfaced with a meaningful message; exit non-zero | Error status code; error body | PASS if `401`/unauthorized is surfaced with a message; FAIL if the call returns an empty success | 1. Confirm the invalid token was actually applied -> 2. Confirm the error is `401`, not a different failure mode -> 3. Restore the valid token and re-run NOTION-01 |

Cleanup: restore the valid token.

> **Scenario Detail:** inline above -- mcp-notion ships no separate per-feature file.
> **Catalog:** [FEATURE-CATALOG.md, section 2 Backend selection](../feature-catalog/FEATURE-CATALOG.md)

### FAIL-03 | Rate-Limit Backoff

#### Description
Verify the mode honors Notion's **3 requests/second** limit and backs off on `429` using `Retry-After`.

#### Scenario Contract
Prompt: `"Issue a burst of read calls above 3/second and confirm the mode backs off instead of hammering."`

Keep the burst small and read-only; the scenario proves backoff discipline, not throughput.

Desired user-visible outcome: the burst eventually succeeds after an observed backoff-and-retry, never a tight immediate-retry loop that would compound the rate limit.

#### Test Execution

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FAIL-03 | Rate-Limit Backoff | Verify the mode backs off on 429 per Retry-After instead of hammering | `"Issue a burst of read calls above 3/second and confirm the mode backs off instead of hammering."` | 1. issue a small burst of read calls (e.g. repeated `notion["notion_retrieve-bot-user"]({})`) above 3 req/s -> 2. observe a `429` -> 3. confirm the retry honors `Retry-After` plus jitter, then succeeds | Step 2: `429` observed; Step 3: retry waits per `Retry-After` plus jitter, not a tight immediate-retry loop, then succeeds | Request timing/transcript; observed `Retry-After` header value; eventual success | PASS if the mode backs off per `Retry-After` and then succeeds; FAIL if it retries immediately in a tight loop or gives up | 1. Confirm the burst actually exceeded ~3 req/s -> 2. Confirm the `429` response carried a `Retry-After` header -> 3. Re-run with a slightly larger burst if `429` was not triggered |

Cleanup: none (read-only).

> **Scenario Detail:** inline above -- mcp-notion ships no separate per-feature file.
> **Catalog:** [FEATURE-CATALOG.md, section 10 Knowledge-layer references](../feature-catalog/FEATURE-CATALOG.md)

---

## 11. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| _None_ | mcp-notion has no automated test suite. `scripts/doctor.sh` performs read-only Node/npx/manual/token diagnostics; `scripts/install.sh` prints registration state. Neither asserts a pass/fail scenario outcome. | All 11 scenarios remain manual-only |

No automated regression tests exist for this mode yet. `scripts/doctor.sh` and `scripts/install.sh` are non-mutating diagnostics, not tests -- they confirm the preconditions in Section 2 but provide no scenario-level assertion overlap.

---

## 12. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Playbook Section |
|---|---|---|---|
| NOTION-01 | Bot User Preflight | MCP tool round-trip | Section 7, `### NOTION-01` |
| NOTION-02 | Page Create -> Read -> Archive Round-Trip | MCP tool round-trip | Section 7, `### NOTION-02` |
| NOTION-03 | Block Append -> Read Round-Trip | MCP tool round-trip | Section 7, `### NOTION-03` |
| NOTION-04 | Data-Source Query | MCP tool round-trip | Section 7, `### NOTION-04` |
| NOTION-05 | Comment Create -> List Round-Trip | MCP tool round-trip | Section 7, `### NOTION-05` |
| NOTION-06 | Search Is Title-Only | MCP tool round-trip | Section 7, `### NOTION-06` |
| GAP-01 | Non-Truncated Page Property Items | API-gap direct call | Section 8, `### GAP-01` |
| BACKEND-01 | Headless Routes to Local Stdio | Backend selection | Section 9, `### BACKEND-01` |
| FAIL-01 | Missing Token | Auth and failure | Section 10, `### FAIL-01` |
| FAIL-02 | Invalid Token | Auth and failure | Section 10, `### FAIL-02` |
| FAIL-03 | Rate-Limit Backoff | Auth and failure | Section 10, `### FAIL-03` |

mcp-notion ships as a single-file playbook, so the "Feature File" column used by multi-file packages is replaced here with a same-document `Playbook Section` pointer -- every scenario's full execution contract is inline at the referenced heading, not in a separate file.
