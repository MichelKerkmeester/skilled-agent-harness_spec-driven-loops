---
title: "Console and Network Capture"
description: "Chrome-DevTools Console and Network panel parity through the aside repl using Playwright page.on() event listeners, plus honest scope on the HAR gap: Aside gives you the request/response events, you assemble a HAR-equivalent — there is no native HAR export."
trigger_phrases:
  - "aside console capture"
  - "aside network capture"
  - "aside page.on request"
  - "aside har"
last_updated: "2026-07-17"
version: 1.0.0.0
---

# Console and Network Capture (DevTools parity)

<!-- sk-doc-template: skill_asset_feature-catalog -->

## 1. OVERVIEW

Chrome DevTools' Console list and Network panel map onto Playwright event listeners in the repl. Earlier research flagged console/network capture as UNKNOWN because Aside exposes no dedicated `console`/`network` tool. The discovery fixture ([`../../references/discovery-fixture-2026-07-16.json`](../../references/discovery-fixture-2026-07-16.json)) **resolves the pattern**: `page` is a real Playwright `Page`, so `page.on('console', …)`, `page.on('request', …)`, `page.on('response', …)`, and `page.on('requestfinished', …)` are the API-grounded capture paths. What remains open is a live-executed result-shape fixture — running these needs a bound, authorized session, so the matching playbook scenario is SKIP-valid until then (superseding the fail-closed framing of ASD-012/ASD-013 with a documented pattern).

Capability class: READ-ONLY (listeners observe; they do not mutate). Honest gap: there is **no native HAR export** (contrast `bdg network har`). You collect `request`/`response` events and assemble a HAR-equivalent yourself; call it "Playwright-assembled HAR-equivalent", never a HAR export.

---

## 2. HOW IT WORKS

Register listeners BEFORE the navigation/action that produces the events, collect into a persistent array, then `console.log` the collected shape. Because the repl scope persists across calls, use fresh variable names each call.

```js
// Console capture (bdg console --list analog)
const consoleMsgs = [];
page.on('console', m => consoleMsgs.push({ type: m.type(), text: m.text() }));
page.on('pageerror', e => consoleMsgs.push({ type: 'pageerror', text: String(e) }));
await page.reload({ waitUntil: 'load' });
console.log(JSON.stringify(consoleMsgs.slice(0, 50)));

// Network capture -> HAR-equivalent assembly (NOT a native HAR export)
const net = [];
page.on('request', r => net.push({ phase: 'request', url: r.url(), method: r.method() }));
page.on('response', r => net.push({ phase: 'response', url: r.url(), status: r.status() }));
page.on('requestfinished', async r => {
  const t = r.timing();
  net.push({ phase: 'finished', url: r.url(), durationMs: t.responseEnd });
});
await page.goto(page.url(), { waitUntil: 'networkidle' });
console.log(JSON.stringify(net.slice(0, 50)));

// Response body when needed (redact before saving)
// const resp = await page.waitForResponse(u => u.url().includes('/api/'));
// console.log((await resp.text()).slice(0, 500));
```

Constraints: needs a bound tab. Redact cookies, credentials, and request/response headers and bodies from saved evidence. Never claim parity with a dedicated console tool or a native HAR file — the honest wording is "Playwright event capture, HAR-equivalent assembled by the caller". Evaluate/argument edge cases apply; record the exact listener form in any fixture.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/discovery-fixture-2026-07-16.json` | Fixture | Proves `page` is a Playwright `Page`, so `page.on(...)` events are available |
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
