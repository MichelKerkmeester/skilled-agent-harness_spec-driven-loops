---
title: "Cookies and Web Storage"
description: "Chrome-DevTools Application-panel parity through the aside repl: page-visible cookie names and localStorage/sessionStorage keys through page.evaluate, redacted. page.context() is undefined on Aside 1.26.626.1517. Context cookies are a gap there."
trigger_phrases:
  - "aside cookies"
  - "aside localStorage"
  - "aside sessionStorage"
  - "aside context cookies"
last_updated: "2026-11-24"
version: 1.0.4.0
---

# Cookies and Web Storage (DevTools parity)

## 1. OVERVIEW

Chrome DevTools' Application panel (Cookies, Local Storage, Session Storage) maps onto `page.evaluate` in the repl. The discovery fixture ([`../../references/discovery-fixture-2026-07-16.json`](../../references/discovery-fixture-2026-07-16.json)) confirms `page` is a real Playwright `Page`. That suggested `page.context().cookies()` and `page.context().addCookies()` as the `bdg network getCookies` and `Network.setCookie` analogs. The live run below shows they throw on Aside 1.26.626.1517.

**Live result on Aside 1.26.626.1517 (2026-11-22, ASD-019).** `page.context` is undefined, so `page.context().cookies()` and `addCookies()` fail and context cookies, including HttpOnly ones and their domains, cannot be read this way. Page-visible cookie names through `document.cookie` and storage keys through `page.evaluate` ran without error, on example.com, which sets no cookies. Retry `page.context().cookies()` only when a later version reports `typeof page.context` as `"function"`.

Capability class: READ-ONLY for reads (cookie names, storage keys), MUTATING for writes (`localStorage.setItem`). Cookies and storage are sensitive: redact values from every log, transcript, saved capture, report and reply, and record names and keys only (SKILL.md ALWAYS rule 6). Saved-password values are never exposed to the agent (confirmed online, `security.md`).

---

## 2. HOW IT WORKS

The read below is the ASD-019 live-run form. It opens its own tab, records whether the context API exists and reads names and keys only. The storage write after it has not been run live.

```js
await openTab('https://example.com');
// Records the context-cookie gap instead of calling page.context(), which throws on 1.26.626.1517
const contextApi = typeof page.context;
// Page-visible cookie names and storage keys, with values left out
const st = await page.evaluate(() => ({
  cookieNames: document.cookie.split('; ').filter(Boolean).map(c => c.split('=')[0]),
  local: Object.keys(localStorage),
  session: Object.keys(sessionStorage),
}));
console.log(JSON.stringify({ contextApi, cookieNames: st.cookieNames, storage: { local: st.local, session: st.session } }));

// Write a storage key (MUTATING)
await page.evaluate(() => localStorage.setItem('demo', '1'));
console.log('storage set');
```

`document.cookie` cannot see HttpOnly cookies or cookie domains, and the live run used a page that sets no cookies. Reading context cookies and injecting a cookie through `addCookies()` are gaps on 1.26.626.1517.

Constraints: needs a bound tab. Aside has no cross-context isolation flag (single manual, single writer per profile), so cookie/storage state is shared within a profile — do not assume `chrome_devtools_1`/`chrome_devtools_2`-style isolation. Redact all values; log names/keys only unless the operator explicitly needs a value.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/discovery-fixture-2026-07-16.json` | Fixture | Proves `page` is a Playwright `Page`; ASD-019 shows `page.context` is undefined on 1.26.626.1517 |
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
