---
title: "DOM Inspection and JS Evaluation"
description: "Chrome-DevTools DOM-panel and console-eval parity through the aside repl: page.$, page.$$, page.$eval, page.evaluate, page.content(), and the accessibility-tree snapshot, grounded in the Playwright page API the discovery fixture proves is available."
trigger_phrases:
  - "aside dom query"
  - "aside page evaluate"
  - "aside querySelector"
  - "aside dom inspection"
last_updated: "2026-07-17"
version: 1.0.0.0
---

# DOM Inspection and JS Evaluation (DevTools parity)

<!-- sk-doc-template: skill_asset_feature-catalog -->

## 1. OVERVIEW

Chrome DevTools' Elements panel and Console eval map onto the Aside REPL through the Playwright `page` API. The discovery fixture ([`../../references/discovery-fixture-2026-07-16.json`](../../references/discovery-fixture-2026-07-16.json)) confirms `page` is a real Playwright `Page` with the full API available, so `page.$`, `page.$$`, `page.$eval`, `page.evaluate`, and `page.content()` are reachable even though only `snapshot(page)` is pre-named as a helper. This is the honest analog of `bdg dom query` / `bdg dom eval` — same capability, expressed as Playwright rather than a typed `aside dom` subcommand (which does not exist).

Capability class: READ-ONLY against the DOM (evaluation can mutate the page if the expression does, so keep expressions read-only for inspection). The primary read path is `snapshot(page)`, which returns `{ tree, diff }` and the stable element refs the browser agent itself acts on — prefer it over screenshots for reading structure.

---

## 2. HOW IT WORKS

`snapshot(page)` is the PRIMARY read method (accessibility-tree text with stable refs). For targeted DOM work, drop to the Playwright API. Because `return`/last-expression does NOT return data from the repl, always finish with `console.log(...)`.

```js
// Accessibility snapshot (primary read; equivalent to DevTools a11y tree)
const s1 = await snapshot(page, { interactive: true });
console.log(s1.tree);

// Query one / many elements + text (bdg dom query analog)
const h1 = await page.$eval('h1', el => el.textContent);
console.log(h1);
const links = await page.$$eval('a', els => els.map(e => e.href));
console.log(JSON.stringify(links.slice(0, 20)));

// Existence / count without throwing
const count = await page.locator('button').count();
console.log(count);

// Arbitrary JS in page context (the DevTools Console-eval analog; bdg dom eval)
const t1 = await page.evaluate(() => document.title);
console.log(t1);

// Full serialized HTML (DevTools "Copy outerHTML" analog)
const html = await page.content();
console.log(html.length);
```

Constraints: run against a bound tab (open with `openTab`, or `attachActiveBrowserTab()` for the user's current page) — a fresh repl is browser-unbound and `page` is null. Keep evaluation expressions read-only for inspection; redact private DOM from saved evidence. Evaluate/argument edge cases are a known vendor-changelog theme — record the exact call form in any smoke fixture.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/discovery-fixture-2026-07-16.json` | Fixture | Proves `page` is a Playwright `Page` with the full API available |
| `references/aside-online-research-2026-07-17.md` | Reference | Online corroboration of the Playwright-shaped REPL (§4) |
| `references/aside-cli-reference.md` | Shared | REPL invocation form and helper boundary rules |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/devtools-parity/dom-query-inspection.md` | Manual playbook | ASD-016 DOM query + evaluate + snapshot round trip |

---

## 4. SOURCE METADATA

- Group: DevTools Parity
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `devtools-parity/dom-inspection.md`

Related references:
- [repl-evidence-capture.md](../repl/repl-evidence-capture.md) covers the deterministic evidence lane this parity family extends
- [screenshots-and-pdf.md](screenshots-and-pdf.md) covers visual capture; [navigation-and-tabs.md](navigation-and-tabs.md) covers binding a tab first
