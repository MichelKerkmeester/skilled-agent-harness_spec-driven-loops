---
title: "ASD-016 -- DOM query + inspection"
description: "This scenario validates Chrome-DevTools DOM-panel parity for `ASD-016` through the aside REPL: page.$eval / page.evaluate / snapshot against a bound tab, with the exact repl code and a SKIP-valid path when no bound session exists."
version: 1.0.2.0
---

# ASD-016 -- DOM query + inspection

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-016`.

---

## 1. OVERVIEW

This scenario exercises the DOM-inspection parity path: read structure with `snapshot(page)`, query elements with `page.$eval`/`page.$$eval`, and eval page-context JS with `page.evaluate`. The Playwright `page` API is fixture-confirmed available; this scenario is the documented pattern made executable.

### Why This Matters

`bdg dom query` / `bdg dom eval` are common parity requests. Aside has no typed `aside dom` subcommand — the honest equivalent is the Playwright API in the repl. This scenario proves the pattern and records the live result shape once a bound session runs it.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-016` and confirm the expected signals without contradictory evidence.

- Objective: On an `example.com` tab opened in the same evaluation, read the `<title>` element via `page.$eval`, the h1 count and `document.title` via `page.evaluate`, and a `snapshot(page)` tree; confirm each returns the expected value.
- Real user request: `"On the page you opened, what's the title and headings, and show me the structure."`
- Prompt: `Query the DOM and evaluate page JS through the aside REPL on a bound tab, and read the accessibility snapshot.`
- Expected execution process: one REPL evaluation that opens its own tab first, since a separate `aside repl` call starts with `page` null.
- Expected signals: `$eval` title text = "Example Domain"; `document.title` contains "Example"; the h1 count is reported as a number (0 on example.com, which has no `h1`); snapshot tree is non-empty.
- Desired user-visible outcome: The H1, title, and a short structure summary, each traced to a real call.
- Pass/fail: PASS when all three signals hold; SKIP (valid) with the blocker "no bound Aside session available"; FAIL on error against a genuinely bound tab.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Query the DOM and evaluate page JS through the aside REPL on a bound tab, and read the accessibility snapshot.`

### Commands

1. Precondition: ASD-006 passed, so `openTab()` works on this profile. If no bound session is available, SKIP with that blocker.
2. `bash:` open the tab, then DOM query + eval + snapshot in the same evaluation:
   `aside repl "await openTab('https://example.com'); const titleEl = await page.\$eval('title', el => el.textContent); const dom = await page.evaluate(() => ({ title: document.title, h1Count: document.querySelectorAll('h1').length })); const snap = await snapshot(page); console.log(JSON.stringify({ titleEl, title: dom.title, h1Count: dom.h1Count, treeLen: snap.tree.length }))" 2>&1`

### Expected

- Output parses to `{ titleEl: "Example Domain", title: /Example/, h1Count: <number>, treeLen: > 0 }` and carries no error line. example.com no longer has an `h1`, so `h1Count` is 0 there; a heading check needs a page that has one. Exit 0 alone is not a pass signal, because an `aside repl` error still exits 0.

### Evidence

The full REPL transcript and the parsed JSON. Record the `snapshot` result shape (`tree`/`diff` fields) as an installed-version fixture.

### Pass / Fail

- **Pass**: `$eval` title text, `document.title`, a numeric h1 count, and a non-empty snapshot tree all returned from real calls.
- **Skip**: no bound session — documented blocker "no bound Aside session available".
- **Fail**: error against a genuinely bound tab, or a value fabricated without a real call.

### Failure Triage

1. `page` is null or a binding error: the tab was not opened in the same evaluation, or the profile is unbound; cross-reference ASD-006/ASD-010.
2. `Selector ... not found` from `page.$eval`: the element is not on the page; `$eval` throws rather than returning null, so query only elements the page is known to have.
3. `page.$eval` argument errors: evaluate edge cases are a known vendor-changelog theme; record the exact call form and retry the simplest form once.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/feature-catalog/devtools-parity/dom-inspection.md` | Capability leaf with the repl code patterns |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/references/discovery-fixture-2026-07-16.json` | Proves the Playwright `page` API is available |

---

## 5. SOURCE METADATA

- Group: DEVTOOLS PARITY
- Playbook ID: ASD-016
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `devtools-parity/dom-query-inspection.md`
