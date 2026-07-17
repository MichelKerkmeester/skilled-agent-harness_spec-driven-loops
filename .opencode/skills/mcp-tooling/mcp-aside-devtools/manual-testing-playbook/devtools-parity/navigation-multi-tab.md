---
title: "ASD-021 -- Navigation + multi-tab management"
description: "This scenario validates Chrome-DevTools page-lifecycle parity for `ASD-021`: attachActiveBrowserTab/openTab, page.goto/waitForLoadState, and tabs enumeration through the aside REPL, with the parallel-isolation gap noted and a SKIP-valid path when no bound session exists."
version: 1.0.0.0
---

# ASD-021 -- Navigation + multi-tab management

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-021`.

---

## 1. OVERVIEW

This scenario exercises the tab/navigation surface: enumerate open tabs with `listBrowserTabs()`, bind one with `attachActiveBrowserTab()` or open one with `openTab()`, navigate with `page.goto` + `waitForLoadState`, and enumerate the session's `tabs`. It documents the honest gap that Aside has no parallel isolated-instance model.

### Why This Matters

The Chrome DevTools MCP's `new_page`/`select_page`/`navigate_page` map onto Aside's single-session multi-tab helpers. But there is no `chrome_devtools_1`/`chrome_devtools_2` dual-manual and no `--isolated=true` — this scenario proves the achievable multi-tab path and records the isolation gap.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-021` and confirm the expected signals without contradictory evidence.

- Objective: Bind or open a tab, navigate it, enumerate the session tabs, and state the no-parallel-isolation gap.
- Real user request: `"Open the pricing page in a new tab and confirm both tabs are there."`
- Prompt: `Manage tabs and navigate through the aside REPL: enumerate, open/attach, goto, and list session tabs.`
- Expected execution process: `listBrowserTabs` -> `openTab`/attach -> `page.goto` + `waitForLoadState` -> read `tabs`.
- Expected signals: `page.url()` reflects the navigation; `tabs.length` >= 1.
- Desired user-visible outcome: The navigated URL and the tab count, plus a "no parallel isolated instances" note.
- Pass/fail: PASS when navigation + enumeration succeed; SKIP (valid) with the blocker "no bound Aside session available"; FAIL on error against a genuinely bound profile.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Manage tabs and navigate through the aside REPL: enumerate, open/attach, goto, and list session tabs.`

### Commands

1. Precondition: a signed-in, bound browser profile. If `listBrowserTabs()` throws "not bound to a browser profile", SKIP with that blocker (cross-reference ASD-010).
2. `bash:` enumerate, open, navigate, list:
   `aside repl "const open = await listBrowserTabs(); const p = await openTab('https://example.com'); await p.goto('https://example.com/'); await p.waitForLoadState('networkidle'); console.log(JSON.stringify({ openBefore: open.length, url: p.url(), sessionTabs: tabs.length }))" 2>&1`

### Expected

- Output parses to `{ openBefore: >= 0, url: /example\.com/, sessionTabs: >= 1 }`.

### Evidence

The REPL transcript and parsed JSON, plus the written "no parallel isolated instances (single manual, single writer per profile)" note.

### Pass / Fail

- **Pass**: navigation reflected in `page.url()` and `tabs` enumerated.
- **Skip**: unbound profile — documented blocker (ASD-010).
- **Fail**: error against a genuinely bound profile, or a verdict claiming parallel isolated instances.

### Failure Triage

1. `not bound to a browser profile`: PROFILE_UNBOUND — binding, not auth; cross-reference ASD-010.
2. `openTab` hang: the helper waits until interactive; if it exceeds the 120s timeout, record and retry once against a lighter URL.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/devtools-parity/navigation-and-tabs.md` | Capability leaf with the repl code + isolation gap |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/repl-evidence/repl-open-tab.md` | ASD-006 baseline deterministic tab open |

---

## 5. SOURCE METADATA

- Group: DEVTOOLS PARITY
- Playbook ID: ASD-021
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `devtools-parity/navigation-multi-tab.md`
