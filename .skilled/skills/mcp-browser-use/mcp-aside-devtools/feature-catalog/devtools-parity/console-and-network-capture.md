---
title: "Console and Network Capture"
description: "Chrome-DevTools Console and Network panel parity in the aside repl is a gap on Aside 1.26.626.1517: page.on() throws for console, request and response events. There is no native HAR export. A guarded probe records the per-event outcome."
trigger_phrases:
  - "aside console capture"
  - "aside network capture"
  - "aside page.on request"
  - "aside har"
last_updated: "2026-11-24"
version: 1.0.3.0
---

# Console and Network Capture (DevTools parity)

## 1. OVERVIEW

Chrome DevTools' Console list and Network panel map onto Playwright event listeners in the repl. Earlier research flagged console/network capture as UNKNOWN because Aside exposes no dedicated `console`/`network` tool. The discovery fixture ([`../../references/discovery-fixture-2026-07-16.json`](../../references/discovery-fixture-2026-07-16.json)) suggested Playwright event listeners: `page.on('console', …)`, `page.on('request', …)`, `page.on('response', …)` and `page.on('requestfinished', …)`. The live result below shows Aside 1.26.626.1517 rejects all four, so neither console nor network capture works on this version. The guarded probes ASD-012 and ASD-013 report each listener as unsupported.

**Live result on Aside 1.26.626.1517 (2026-11-22, ASD-012, ASD-013 and ASD-018).** `page.on` accepts only close, crash, dialog, domcontentloaded, download, filechooser, frameattached, framedetached, framenavigated, load and popup. It throws for `console`, `request`, `response` and `requestfinished`, so neither capture works through these listeners on this version. The error points to `page.console.logs()` for console output. That call has not been run. The guarded probe below records this per-event outcome.

Capability class: READ-ONLY. Listeners only observe. There is **no native HAR export** (contrast `bdg network har`). On a version that accepts the `request` and `response` events, the caller would assemble a HAR-equivalent from them. Call that a "Playwright-assembled HAR-equivalent", never a HAR export.

---

## 2. HOW IT WORKS

On 1.26.626.1517 every `page.on` call for these events throws, so no capture runs. The form below follows the guarded probe from the ASD-018 live run. It registers each listener inside its own `try`/`catch` and prints the per-event outcome. On this version each event reports `UNSUPPORTED` with the error text. On a later version that accepts the events, the same form collects them. Register listeners before the action that produces the events.

```js
await openTab('https://example.com');
const cmsg = [];
const net = [];
const listeners = {};
const handlers = {
  console: m => cmsg.push({ type: m.type(), text: m.text() }),
  request: r => net.push({ phase: 'req', url: r.url(), method: r.method() }),
  response: r => net.push({ phase: 'res', url: r.url(), status: r.status() }),
};
for (const ev of Object.keys(handlers)) {
  // Each event is guarded on its own, because 1.26.626.1517 throws for all three
  try { page.on(ev, handlers[ev]); listeners[ev] = 'registered'; }
  catch (e) { listeners[ev] = 'UNSUPPORTED: ' + e.message; }
}
await page.evaluate(() => console.log('capture sentinel'));
await page.goto('https://example.com/');
console.log(JSON.stringify({ listeners, cmsg: cmsg.slice(0, 20), net: net.slice(0, 20) }));
```

Aside's error points to `page.console.logs()` for console output. That call has not been run, so this entry does not teach it.

Constraints: needs a bound tab and a version whose `page.on` accepts the events. Redact cookies, credentials, and request/response headers and bodies from saved evidence. Never claim parity with a dedicated console tool or a native HAR file. The honest wording is "Playwright event capture, HAR-equivalent assembled by the caller". Evaluate/argument edge cases apply; record the exact listener form in any fixture.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/discovery-fixture-2026-07-16.json` | Fixture | Proves `page` is a Playwright `Page`. ASD-018 shows `page.on` rejects the console and network events on 1.26.626.1517 |
| `references/aside-online-research-2026-07-17.md` | Reference | §7 records this as the resolved-pattern change from UNKNOWN |
| `references/troubleshooting.md` | Shared | Fail-closed policy for capability gaps (HAR export gap) |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/devtools-parity/console-network-capture.md` | Manual playbook | ASD-018 documented console + network event capture (SKIP-valid without a bound session) |
| `manual-testing-playbook/probes-and-gaps/console-probe.md` | Manual playbook | ASD-012 guarded console probe this file supersedes with a documented pattern |
| `manual-testing-playbook/probes-and-gaps/network-probe.md` | Manual playbook | ASD-013 guarded network probe; HAR gap stays honest |

---

## 4. SOURCE METADATA

- Group: DevTools Parity
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `devtools-parity/console-and-network-capture.md`

Related references:
- [cookies-and-storage.md](cookies-and-storage.md) covers the request-context state parity
- [performance-timing.md](performance-timing.md) covers timing measurement without a Lighthouse export
