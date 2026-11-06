---
title: "MCP-M020 -- Remove Divider Gaps in a Background Tab"
description: "This scenario validates Remove Divider Gaps in a Background Tab for `MCP-M020`. Objective: Verify the divider gap pass removes every empty block under a divider in a background tab, leaves the text unchanged and closes only its own tab."
version: 1.0.0.0
---

# MCP-M020 -- Remove Divider Gaps in a Background Tab

---

## 1. OVERVIEW

Validates that **Remove Divider Gaps in a Background Tab** behaves as `references/mcp-tools.md` describes. Tool names and parameters come from the hosted server's schema, captured on 2026-11-06.

### Why This Matters

ClickUp's import leaves an empty block under each divider, and only the editor can remove it. The pass works in the user's own signed-in browser, so it must stay out of the user's way.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify the divider gap pass removes every empty block under a divider in a background tab, leaves the text unchanged and closes only its own tab
- **Real user request:** `Push this page with its dividers and keep it tidy, I am still working in my browser.`
- **Prompt:** `Run the divider gap pass on page PAGE_ID of document DOC_ID.`
- **Expected signals:** The Aside program from `references/mcp-tools.md` section 8 reports `gapsLeft: 0`, `textUnchanged: true` and `login: false`. The user's own tabs and window stay as they were, and the program's tab is gone afterwards.
- **Desired user-visible outcome:** The page shows no blank line under its dividers, the text reads as sent, and the user saw no tab switch.
- **Pass/fail:** PASS if `gapsLeft` is 0, the text is unchanged and no tab of the user's moved or closed; FAIL if a gap remains on a page without an image, the text changed, or a user tab was touched

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: MCP configured. Aside open and logged in to ClickUp, with another tab in view. A page PAGE_ID with at least two dividers, written with `content_format: 'text/md'`.
1. Note which tab is active in the user's browser
2. Code Mode: run the Aside gap-pass program with PAGES set to PAGE_ID
3. Confirm the report reads `gapsLeft: 0` and `textUnchanged: true`
4. Confirm the same tab is still active and no extra tab is left open
5. Repeat with the Chrome live program when Aside is closed, and confirm it closes only the page ID it opened

Each Code Mode step runs inside an async function passed to `mcp__code_mode__call_tool_chain`, with the result printed through `console.log`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-M020 | Remove Divider Gaps in a Background Tab | Verify the divider gap pass removes every empty block under a divider in a background tab, leaves the text unchanged and closes only its own tab | `Run the divider gap pass on page PAGE_ID of document DOC_ID.` | 1. Note which tab is active in the user's browser 2. Code Mode: run the Aside gap-pass program with PAGES set to PAGE_ID 3. Confirm the report reads `gapsLeft: 0` and `textUnchanged: true` 4. Confirm the same tab is still active and no extra tab is left open 5. Repeat with the Chrome live program when Aside is closed, and confirm it closes only the page ID it opened | The Aside program from `references/mcp-tools.md` section 8 reports `gapsLeft: 0`, `textUnchanged: true` and `login: false`. The user's own tabs and window stay as they were, and the program's tab is gone afterwards. | Code Mode logs plus the questions the agent asked | PASS if `gapsLeft` is 0, the text is unchanged and no tab of the user's moved or closed; FAIL if a gap remains on a page without an image, the text changed, or a user tab was touched | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual-testing-playbook.md`](../../manual-testing-playbook/manual-testing-playbook.md) | Root directory and scenario summary |
| [`../../feature-catalog/mcp-low-priority/create-doc-page.md`](../../feature-catalog/mcp-low-priority/create-doc-page.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | MCP tool reference, readiness check and divider gap pass |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Documents
- Playbook ID: MCP-M020
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-documents/divider-gap-pass.md`
