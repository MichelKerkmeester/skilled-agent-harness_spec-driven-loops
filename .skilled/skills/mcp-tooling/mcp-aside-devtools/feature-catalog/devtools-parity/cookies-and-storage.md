---
title: "Cookies and Web Storage"
description: "Chrome-DevTools Application-panel parity through the aside repl: page.context().cookies() and addCookies() for cookies, and page.evaluate against localStorage/sessionStorage for web storage, with redaction discipline on all captured state."
trigger_phrases:
  - "aside cookies"
  - "aside localStorage"
  - "aside sessionStorage"
  - "aside context cookies"
last_updated: "2026-07-17"
version: 1.0.0.0
---

# Cookies and Web Storage (DevTools parity)

<!-- sk-doc-template: skill_asset_feature-catalog -->

## 1. OVERVIEW

Chrome DevTools' Application panel (Cookies, Local Storage, Session Storage) maps onto the Playwright browser-context API plus `page.evaluate`. The discovery fixture ([`../../references/discovery-fixture-2026-07-16.json`](../../references/discovery-fixture-2026-07-16.json)) confirms `page` is a real Playwright `Page`, so `page.context().cookies()` and `page.context().addCookies()` (the `bdg network getCookies` / `Network.setCookie` analog) and storage reads via `evaluate` are reachable.

Capability class: READ-ONLY for reads (`cookies()`, storage reads); MUTATING for writes (`addCookies()`, `localStorage.setItem`). Cookies and storage are sensitive: redact values from any saved evidence and never write captured cookies into default logs (SKILL.md ALWAYS rule 6). Saved-password values are never exposed to the agent (confirmed online, `security.md`).

---

## 2. HOW IT WORKS

```js
// Read cookies for the current context (bdg network getCookies analog)
const cookies = await page.context().cookies();
console.log(JSON.stringify(cookies.map(c => ({ name: c.name, domain: c.domain })))); // redact values

// Inject a cookie (Network.setCookie analog) — MUTATING
await page.context().addCookies([{ name: 'demo', value: '1', url: page.url() }]);
console.log('cookie set');

// Read web storage via page context (DevTools Local/Session Storage)
const store = await page.evaluate(() => ({
  local: Object.keys(localStorage),
  session: Object.keys(sessionStorage),
}));
console.log(JSON.stringify(store)); // keys only; redact values

// Write a storage key — MUTATING
await page.evaluate(() => localStorage.setItem('demo', '1'));
console.log('storage set');
```

Constraints: needs a bound tab. Aside has no cross-context isolation flag (single manual, single writer per profile), so cookie/storage state is shared within a profile — do not assume `chrome_devtools_1`/`chrome_devtools_2`-style isolation. Redact all values; log names/keys only unless the operator explicitly needs a value.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/discovery-fixture-2026-07-16.json` | Fixture | Proves `page.context()` (Playwright BrowserContext) is reachable |
| `references/aside-online-research-2026-07-17.md` | Reference | §5 confirms saved passwords stay hidden from the agent |
| `references/session-management.md` | Shared | Single-writer-per-profile posture (no context isolation) |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/devtools-parity/cookies-storage.md` | Manual playbook | ASD-019 cookie read + storage-key read (SKIP-valid without a bound session) |

---

## 4. SOURCE METADATA

- Group: DevTools Parity
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `devtools-parity/cookies-and-storage.md`

Related references:
- [console-and-network-capture.md](console-and-network-capture.md) covers request/response events for the same context
- [navigation-and-tabs.md](navigation-and-tabs.md) covers binding a tab before reading its state
