---
title: "BACKEND-001 -- Headless Backend Selection"
description: "This scenario validates that headless Code Mode execution always selects the local stdio Notion backend, never the interactive remote OAuth backend."
stage: routing
version: 0.1.0.0
---

# BACKEND-001 -- Headless Backend Selection

## 1. OVERVIEW

This scenario validates the mode's backend routing doctrine: a headless run with `NOTION_TOKEN` set and no browser must select the **local stdio** backend (`npx @notionhq/notion-mcp-server`), never attempt the **remote** OAuth backend (`https://mcp.notion.com/mcp`).

### Why This Matters

Notion ships two backends that split cleanly by runtime. Code Mode has no browser, so any attempt to route a headless run through OAuth would hang or fail outright. This behavior is documented, not automated, so it needs a manual confirmation.

---

## 2. SCENARIO CONTRACT

- Feature ID: `BACKEND-001`
- Feature Name: Headless Backend Selection
- Scenario Objective: Confirm the `notion` manual is registered against the local stdio transport and that a call resolves with no OAuth step.
- Exact Prompt: `"In a headless run with NOTION_TOKEN set and no browser, confirm which backend the mode selects."`
- Exact Command Sequence: `1. bash: grep -c '"name": "notion"' .utcp_config.json -> 2. inspect the notion manual's transport field in .utcp_config.json -> 3. notion["notion_retrieve-bot-user"] ({})`
- Expected Signals: Step 1 returns `1`; Step 2 shows `transport: "stdio"` and command `npx -y @notionhq/notion-mcp-server`; Step 3 resolves with no OAuth prompt.
- Evidence: the `.utcp_config.json` manual entry, and the successful headless call transcript.
- Pass/Fail Criteria: PASS if the mode selects local stdio (no OAuth step) and the call resolves; FAIL if the mode attempts remote OAuth in a headless context; SKIP if `.utcp_config.json` is unavailable or the `notion` manual is not registered at all.
- Failure Triage: 1. Confirm the `notion` manual config still points at local `npx`. 2. Confirm no OAuth token is being injected into a headless run. 3. Re-check that the interactive-session branch (remote OAuth) is genuinely absent from this run's path.

---

## 3. TEST EXECUTION

### Prerequisites

`notion_NOTION_TOKEN` is set, the `notion` manual is registered in `.utcp_config.json`, and this run is headless (no browser session).

### Prompt

`"In a headless run with NOTION_TOKEN set and no browser, confirm which backend the mode selects."`

### Commands

1. `bash: grep -c '"name": "notion"' .utcp_config.json`.
2. Inspect the `notion` manual's `transport` field in `.utcp_config.json`.
3. `notion["notion_retrieve-bot-user"] ({})`.

### Expected

Exactly one `notion` manual entry is registered, its transport is `stdio` running `npx -y @notionhq/notion-mcp-server`, and the confirming call resolves without any OAuth redirect or browser prompt.

### Evidence

Capture the `.utcp_config.json` manual entry and the successful headless call transcript.

### Pass / Fail

- **Pass:** the manual entry uses local stdio transport and the confirming call resolves without an OAuth step.
- **Skip:** `.utcp_config.json` is unavailable or the `notion` manual is not registered.
- **Fail:** a headless run attempts OAuth, or the manual is misconfigured to a non-stdio transport.

### Failure Triage

1. Confirm the `notion` manual config still points at local `npx`.
2. Confirm no OAuth token is being injected into a headless run.
3. Re-check that the interactive-session branch (remote OAuth) is genuinely absent from this run's path.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| BACKEND-001 | Headless Backend Selection | Verify headless Code Mode always selects the local stdio backend | `"In a headless run with NOTION_TOKEN set and no browser, confirm which backend the mode selects."` | 1. `bash: grep -c '"name": "notion"' .utcp_config.json` -> 2. inspect `transport` field -> 3. `notion["notion_retrieve-bot-user"] ({})` | `1` manual entry; `transport: "stdio"`; call resolves with no OAuth prompt | `.utcp_config.json` entry, successful headless call transcript | PASS if local stdio selected and call resolves; FAIL if OAuth attempted headlessly; SKIP if manual unregistered | Check manual config, check no OAuth injection, re-verify interactive branch is absent |

Cleanup: none (read-only inspection).

**Contrasting branch (stated, not executed):** an interactive session with a browser and OAuth available would instead prefer the remote backend (`https://mcp.notion.com/mcp`). That branch is documented here as the alternative routing path; it is not exercised by this headless scenario.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy, wave order, and result-persistence contract |
| [`../../feature-catalog/FEATURE-CATALOG.md`](../../feature-catalog/FEATURE-CATALOG.md) | Root catalog, section 2 Backend selection |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Confirms the local-server tool naming and registration model this scenario checks |
| [`../../examples/README.md`](../../examples/README.md) | Shared Code Mode `call_tool_chain` pattern used for the confirming call |

---

## 5. SOURCE METADATA

- Group: Backend and failure
- Playbook ID: `BACKEND-001`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `backend-and-failure/backend-selection.md`
