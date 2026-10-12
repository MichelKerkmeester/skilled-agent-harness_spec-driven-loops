---
title: "SRCH-001 -- Search"
description: "This scenario validates title-only search behavior - a title match succeeds and a body-only phrase does not - through the confirmed notion_search tool."
stage: routing
version: 0.1.0.0
---

# SRCH-001 -- Search

## 1. OVERVIEW

This scenario validates the confirmed `notion_search` tool by proving both halves of its title-only contract: a query matching a fixture page's title returns that page, and a query matching only the page's body text does not.

### Why This Matters

`search` is title-only by structural platform design, not a fillable gap — a claim this important must be proven with two real calls, not assumed from documentation. Confirming both the positive (title match) and negative (body-only miss) cases in one scenario is the only way to demonstrate the limit rather than merely restate it.

---

## 2. SCENARIO CONTRACT

- Feature ID: `SRCH-001`
- Feature Name: Search
- Scenario Objective: Confirm `search` finds a fixture page by a title-matching query, and confirm the same tool returns no result for a query matching only that page's body text.
- Exact Prompt: `Search Notion for the page titled "NotionPlaybookFixture" and confirm search won't find it by body text alone.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_search") -> 3. Code Mode: call_tool_chain({ code: "const titleHit = await notion[\"notion_search\"] ({ query: \"NotionPlaybookFixture\" }); const bodyMiss = await notion[\"notion_search\"] ({ query: \"body-only-marker-phrase\" }); return { titleHit, bodyMiss };" })`
- Expected Signals: `titleHit.results` contains the fixture page (title match); `bodyMiss.results` does NOT contain the fixture page — the body-only phrase returns no relevant result, confirming the title-only limit.
- Evidence: `list_tools()` result, `tool_info()` result, and the Code Mode response — both `titleHit` and `bodyMiss` result arrays.
- Pass/Fail Criteria: PASS if `titleHit` returns the fixture page by title AND `bodyMiss` returns no match for the body-only phrase; SKIP if no fixture page with a distinct title token and a distinct body-only phrase is confirmed available in the workspace — named blocker: "no distinctively-titled search fixture page confirmed in the workspace"; FAIL if `bodyMiss` unexpectedly returns the fixture page (would contradict the documented title-only behavior), or `titleHit` fails to find it.
- Failure Triage: 1. Confirm the fixture page is shared with the integration — `search` only returns shared content. 2. Re-run `tool_info()` to confirm which field the tool actually filters on. 3. If `bodyMiss` returns a hit, verify it is not accidentally matching part of the title before concluding search covers body content.

---

## 3. TEST EXECUTION

### Prerequisites

A page shared with the integration exists whose title contains a distinctive token (e.g. `NotionPlaybookFixture`) and whose body contains a different, distinctive phrase not present in the title (e.g. `body-only-marker-phrase`). This fixture must already exist in the workspace; if none is confirmed, the scenario is SKIP-able with the named blocker below.

### Prompt

`Search Notion for the page titled "NotionPlaybookFixture" and confirm search won't find it by body text alone.`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_search")`
3. Run the Code Mode chain shown in the scenario contract — one title-matching query and one body-only-phrase query.

### Expected

The title-matching query returns the fixture page; the body-only-phrase query returns no match for it, confirming `search` does not index body content.

### Evidence

Capture tool discovery, schema, and both result arrays (`titleHit`, `bodyMiss`).

### Pass / Fail

- **Pass:** the title query finds the fixture page and the body-only query does not.
- **Skip:** no fixture page with a distinct title token and distinct body-only phrase is confirmed available — named blocker "no distinctively-titled search fixture page confirmed in the workspace".
- **Fail:** the body-only query unexpectedly returns the fixture page, or the title query fails to find it.

### Failure Triage

1. Confirm the fixture page is shared with the integration — `search` only returns shared content.
2. Re-run `tool_info()` to confirm which field the tool actually filters on.
3. If `bodyMiss` returns a hit, verify it is not accidentally matching part of the title before concluding search covers body content.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SRCH-001 | Search | Prove title match succeeds and a body-only phrase returns no result | `Search Notion for the page titled "NotionPlaybookFixture" and confirm search won't find it by body text alone.` | 1. `list_tools()` -> 2. `tool_info("notion.notion_search")` -> 3. `call_tool_chain` title-query + body-only-query | Title query hits fixture; body-only query misses it | Discovery, schema, titleHit array, bodyMiss array | PASS on title hit + body-only miss; SKIP on no confirmed fixture page ("no distinctively-titled search fixture page confirmed in the workspace"); FAIL on unexpected body-only hit or missed title match | Confirm fixture shared, re-verify filtered field, check for title bleed-through |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [`../../feature-catalog/search/search.md`](../../feature-catalog/search/search.md) | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, API-version pin, and the title-only limit |
| [`../../examples/README.md`](../../examples/README.md) | Code Mode invocation pattern and preflight reference |

---

## 5. SOURCE METADATA

- Group: Search
- Playbook ID: `SRCH-001`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `search/search.md`
