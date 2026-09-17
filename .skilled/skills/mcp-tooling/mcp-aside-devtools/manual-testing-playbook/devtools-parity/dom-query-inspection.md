---
title: "ASD-016 -- DOM query + inspection"
description: "This scenario validates Chrome-DevTools DOM-panel parity for `ASD-016` through the aside REPL: page.$eval / page.evaluate / snapshot against a bound tab, with the exact repl code and a SKIP-valid path when no bound session exists."
version: 1.0.0.0
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

- Objective: On a bound `example.com` tab, read the h1 via `page.$eval`, the title via `page.evaluate`, and a `snapshot(page)` tree; confirm each returns the expected value.
- Real user request: `"On the page you opened, what's the H1 and title, and show me the structure."`
- Prompt: `Query the DOM and evaluate page JS through the aside REPL on a bound tab, and read the accessibility snapshot.`
- Expected execution process: one persistent REPL context after ASD-006 opened a tab.
- Expected signals: h1 text = "Example Domain"; title contains "Example"; snapshot tree is non-empty.
- Desired user-visible outcome: The H1, title, and a short structure summary, each traced to a real call.
- Pass/fail: PASS when all three signals hold; SKIP (valid) with the blocker "no bound Aside session available"; FAIL on error against a genuinely bound tab.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Query the DOM and evaluate page JS through the aside REPL on a bound tab, and read the accessibility snapshot.`

### Commands

1. Precondition: ASD-006 opened `https://example.com` (bound context). If no bound session is available, SKIP with that blocker.
2. `bash:` DOM query + eval + snapshot in one persistent context:
   `aside repl "const h1 = await page.\$eval('h1', el => el.textContent); const title = await page.evaluate(() => document.title); const snap = await snapshot(page); console.log(JSON.stringify({ h1, title, treeLen: snap.tree.length }))" 2>&1`

### Expected

- Output parses to `{ h1: "Example Domain", title: /Example/, treeLen: > 0 }`.

### Evidence

The full REPL transcript and the parsed JSON. Record the `snapshot` result shape (`tree`/`diff` fields) as an installed-version fixture.

### Pass / Fail

- **Pass**: h1, title, and non-empty snapshot tree all returned from real calls.
- **Skip**: no bound session — documented blocker "no bound Aside session available".
- **Fail**: error against a genuinely bound tab, or a value fabricated without a real call.

### Failure Triage

1. `page` is null / binding error: precondition failed — cross-reference ASD-006/ASD-010.
2. `page.$eval` argument errors: evaluate edge cases are a known vendor-changelog theme — record the exact call form and retry the simplest form once.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/devtools-parity/dom-inspection.md` | Capability leaf with the repl code patterns |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/discovery-fixture-2026-07-16.json` | Proves the Playwright `page` API is available |

---

## 5. SOURCE METADATA

- Group: DEVTOOLS PARITY
- Playbook ID: ASD-016
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `devtools-parity/dom-query-inspection.md`
