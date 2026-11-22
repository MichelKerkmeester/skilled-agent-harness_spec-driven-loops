---
title: "BDG-017 -- Multi-tab same instance"
description: "This scenario validates `new_page` for `BDG-017`. It focuses on confirming additional pages can be opened within a single `chrome_devtools_1` instance and switched between via `select_page`."
version: 1.0.2.0
---

# BDG-017 -- Multi-tab same instance

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-017`.

---

## 1. OVERVIEW

This scenario validates `new_page` for `BDG-017`. It focuses on confirming an operator can open an additional page (beyond the initial one) inside `chrome_devtools_1`, that a list-pages call shows >= 2 pages, and that `select_page` works for both. This depends on CM-014..CM-016 (Chrome via Code Mode patterns).

### Why This Matters

`new_page` is how operators model multi-tab user flows (e.g., "open the product page in tab 1, the cart in tab 2") inside a single MCP instance, avoiding the cost of provisioning a second instance. If `new_page` only sometimes returns an ID, or if listing pages drops the new entry, every multi-tab workflow becomes unreliable. BDG-016 validated close + select; this scenario isolates the additive (open new) contract.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BDG-017` and confirm the expected signals without contradictory evidence.

- Objective: Verify `new_page` adds a page; the `list_pages` result lists >= 2 pages with distinct IDs; `select_page` selects each ID in turn.
- Real user request: `"Open a new tab in the same browser instance and confirm both tabs are reachable."`
- Prompt: `As a manual-testing orchestrator, open a new page in chrome_devtools_1 (additional to the initial page) through Code Mode against the chrome_devtools_1 MCP instance. Verify both pages are accessible via select_page. Return a concise user-facing pass/fail verdict with the main reason.` (RCAF format)
- Expected execution process: navigate first page; call `new_page` for second; list pages and read both IDs from the `## Pages` text, matched by URL; switch via `select_page` for both IDs; write the script as plain synchronous JavaScript with no `await`, since Code Mode tool calls block until they return.
- Expected signals: `new_page` returns without throwing; the parsed page list has >= 2 entries with distinct numeric IDs; each `select_page` result marks the requested ID as `[selected]`.
- Desired user-visible outcome: A short report listing both page IDs, the page count, and "both pages reachable" with a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if `new_page` throws, list shows < 2 pages, or `select_page` throws for either ID.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, open a new page in chrome_devtools_1 (additional to the initial page) through Code Mode against the chrome_devtools_1 MCP instance. Verify both pages are accessible via select_page. Return a concise user-facing pass/fail verdict with the main reason.` (RCAF format)

### Commands

1. Precondition: `chrome_devtools_1` registered (cross-reference BDG-014)
2. Code Mode script — build and dispatch via `call_tool_chain`:
   ```js
   const listOf = (r) => {
     const out = [];
     let inPages = false;
     for (const raw of (typeof r === 'string' ? r : JSON.stringify(r)).split(/\n|\\n/)) {
       const l = raw.replace(/^"/, '');
       if (l.startsWith('## ')) { inPages = l.startsWith('## Pages'); continue; }
       const m = inPages && l.match(/^(\d+): ([^\s"\\]+)/);
       if (m) out.push({ id: Number(m[1]), url: m[2], selected: l.includes('[selected]') });
     }
     return out;
   };
   const selectedIn = (r) => (listOf(r).find(p => p.selected) || {}).id;
   chrome_devtools_1.chrome_devtools_1_navigate_page({ url: 'https://example.com' });
   chrome_devtools_1.chrome_devtools_1_new_page({ url: 'https://example.org' });
   const pages = listOf(chrome_devtools_1.chrome_devtools_1_list_pages({}));
   const id1 = (pages.find(p => p.url.startsWith('https://example.com')) || {}).id;
   const id2 = (pages.find(p => p.url.startsWith('https://example.org')) || {}).id;
   const sel1 = selectedIn(chrome_devtools_1.chrome_devtools_1_select_page({ pageId: id1 }));
   const sel2 = selectedIn(chrome_devtools_1.chrome_devtools_1_select_page({ pageId: id2 }));
   return { id1, id2, pageCount: pages.length, sel1, sel2 };
   ```
   The page tools return text, not page objects. `list_pages` and `select_page` answer with a `## Pages` section of `<id>: <url>` lines, with ` [selected]` on the selected page; `listOf` reads that section.
3. Assert: `id1` and `id2` are distinct numbers; `pageCount >= 2`; `sel1 === id1` and `sel2 === id2`

### Expected

- Step 2: returns `{ id1, id2, pageCount, sel1, sel2 }`
- Step 3: `pageCount >= 2` AND `sel1 === id1` AND `sel2 === id2`; the logs carry no `[ERROR] Code execution failed` line

### Evidence

Capture the Code Mode script, returned object, and the resolved page count.

### Pass / Fail

- **Pass**: distinct numeric IDs read from the page list AND `pageCount >= 2` AND each `select_page` result marks its requested ID selected.
- **Fail**: `new_page` throws (cross-reference CM-014); list shows only 1 page (the new page wasn't persisted to the instance's tab list); either `select_page` throws.

### Failure Triage

1. If the call fails with `await is only valid in async functions`: the script still uses `await`; drop it, since Code Mode tool calls are synchronous.
2. If `pageCount` is 0 or 1 after a clean `new_page`: return the raw `list_pages` result and compare it with the `<id>: <url>` line format, since a format change upstream breaks `listOf` before it breaks the tool; cross-reference CM-016 for the canonical multi-page response shape.
3. If `select_page` fails validation with `expected number`: `id1` or `id2` is undefined because no line matched its URL; cross-reference BDG-016 (close + select) for the same ID handling.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `.skilled/skills/mcp-code-mode/manual-testing-playbook/manual-testing-playbook.md` | CM playbook (CM-014..CM-016 Chrome via CM) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/SKILL.md` | new_page / list_pages / select_page reference |
| `.skilled/skills/mcp-code-mode/SKILL.md` | Code Mode invocation contract |
| `chrome-devtools-mcp` 0.26.0 package source, its page tools and response formatter | `pageId` is a number; page tools answer with a `## Pages` list of `<id>: <url>` lines |

---

## 5. SOURCE METADATA

- Group: MCP PARALLEL INSTANCES
- Playbook ID: BDG-017
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-parallel-instances/multi-tab-same-instance.md`
