---
title: "Navigation and Multi-Tab Management"
description: "Chrome-DevTools page-lifecycle parity through the aside repl: openTab, tabs, attachBrowserTab/attachActiveBrowserTab, closeTab, plus page.goto and waitForLoadState — the single-session multi-tab surface, with an honest gap on parallel isolated instances."
trigger_phrases:
  - "aside open tab"
  - "aside navigate"
  - "aside multi tab"
  - "aside attach browser tab"
last_updated: "2026-07-17"
version: 1.0.0.0
---

# Navigation and Multi-Tab Management (DevTools parity)

<!-- sk-doc-template: skill_asset_feature-catalog -->

## 1. OVERVIEW

Chrome DevTools MCP's `new_page` / `select_page` / `navigate_page` / `list_pages` map onto Aside's fixture-named tab helpers plus the Playwright navigation API: `openTab(url)`, `tabs` (`Page[]`), `attachBrowserTab(targetId)`, `attachActiveBrowserTab()`, `getTabByTargetId(targetId)`, `closeTab(tab)`, and on `page` itself `page.goto()` and `page.waitForLoadState()`. `listBrowserTabs()` enumerates open Aside Browser tabs without attaching.

Capability class: MUTATING (browser navigation, tab open/close). Honest gap: Aside has **no parallel isolated-instance model** — there is no `chrome_devtools_1` / `chrome_devtools_2` dual-manual, no `--isolated=true` equivalent. Multi-tab within ONE session is supported; parallel isolated browsers are NOT. Keep a single writer per account/profile.

---

## 2. HOW IT WORKS

A fresh repl starts neutral — `page` may be null. Bind first: attach the user's active tab, attach a specific open tab, or open a new one.

```js
// See what is already open (no attach) — do this before assuming a page
const open = await listBrowserTabs();
console.log(JSON.stringify(open));

// Attach the user's current tab (preferred for "the page I'm on" requests)
const p1 = await attachActiveBrowserTab();
console.log(p1.url());

// Or open a fresh tab (only when no relevant tab exists)
const p2 = await openTab('https://example.com'); // waits until interactive; mutates page + tabs
console.log(p2.url());

// Navigate + wait for load (DevTools navigate_page analog)
await page.goto('https://example.com/pricing', { waitUntil: 'load' });
await page.waitForLoadState('networkidle');
console.log(page.url());

// Viewport emulation (DevTools device-toolbar / Emulation.setDeviceMetricsOverride analog)
await page.setViewportSize({ width: 390, height: 844 }); // e.g. mobile
console.log(page.viewportSize());

// Enumerate this session's attached tabs, then close one
console.log(tabs.length);
await closeTab(p2); // if you close the last tab, page becomes null
```

Viewport emulation is INFERRED from the Playwright `page` API (fixture proves `page` is a real `Page`), not from a per-method online enumeration — confirm the result shape on first bound-session run.

Constraints: `attachBrowserTab`/`attachActiveBrowserTab` require a bound browser profile — a fresh `aside mcp` process is unbound (`listBrowserTabs()` throws "not bound to a browser profile"); that is a binding state, not auth. Only `openTab()` when no relevant tab exists or the operator asks for a new page.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/discovery-fixture-2026-07-16.json` | Fixture | Documents `openTab`/`tabs`/`attachBrowserTab`/`attachActiveBrowserTab`/`closeTab` and the neutral-session rule |
| `references/session-management.md` | Shared | Browser-profile binding layer and single-writer posture |
| `references/troubleshooting.md` | Shared | PROFILE_UNBOUND classification (binding, not auth) |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/devtools-parity/navigation-multi-tab.md` | Manual playbook | ASD-021 attach/open + goto + multi-tab enumeration (SKIP-valid without a bound session) |
| `manual-testing-playbook/repl-evidence/repl-open-tab.md` | Manual playbook | ASD-006 baseline deterministic tab open |

---

## 4. SOURCE METADATA

- Group: DevTools Parity
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `devtools-parity/navigation-and-tabs.md`

Related references:
- [dom-inspection.md](dom-inspection.md) covers reading a bound tab once attached
- [console-and-network-capture.md](console-and-network-capture.md) covers listeners registered before navigation
