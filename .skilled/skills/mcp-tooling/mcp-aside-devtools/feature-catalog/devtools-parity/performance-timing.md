---
title: "Performance Timing and Web Vitals"
description: "Chrome-DevTools Performance parity through the aside repl via page.evaluate over the Performance API (navigation timing, resource entries, paint/web-vitals), with an honest gap: no built-in Lighthouse audit — Lighthouse-parity requires external tooling."
trigger_phrases:
  - "aside performance"
  - "aside web vitals"
  - "aside navigation timing"
  - "aside lighthouse"
last_updated: "2026-07-17"
version: 1.0.0.0
---

# Performance Timing and Web Vitals (DevTools parity)

<!-- sk-doc-template: skill_asset_feature-catalog -->

## 1. OVERVIEW

Chrome DevTools' Performance panel and the Chrome DevTools MCP's `performance_start_trace` / `lighthouse_audit` map only PARTIALLY onto Aside. The fixture-confirmed path is `page.evaluate` over the browser Performance API — navigation timing, resource entries, and paint/web-vitals metrics. There is **no built-in Lighthouse audit and no trace-recording tool** in the one-`repl`-tool inventory. That is the honest gap: timing metrics via the Performance API are available; a Lighthouse-score / performance-trace equivalent is NOT — it requires external tooling (e.g. a separate Lighthouse run against the URL).

Capability class: READ-ONLY (measurement only). The Performance API path is grounded in the fixture (`page` is a Playwright `Page`, `page.evaluate` runs page-context JS); the Lighthouse gap is grounded in the tool inventory (no such tool exists).

---

## 2. HOW IT WORKS

```js
// Navigation timing (DevTools "Timing" / performance_start_trace analog, coarse)
const nav = await page.evaluate(() => {
  const [n] = performance.getEntriesByType('navigation');
  return n ? { ttfbMs: n.responseStart, domContentLoadedMs: n.domContentLoadedEventEnd, loadMs: n.loadEventEnd } : null;
});
console.log(JSON.stringify(nav));

// Paint / web-vitals-style metrics
const paint = await page.evaluate(() =>
  performance.getEntriesByType('paint').map(p => ({ name: p.name, startMs: p.startTime }))
);
console.log(JSON.stringify(paint)); // includes first-contentful-paint

// Slowest resources (Network waterfall analog, coarse)
const slow = await page.evaluate(() =>
  performance.getEntriesByType('resource')
    .map(r => ({ name: r.name, durationMs: Math.round(r.duration) }))
    .sort((a, b) => b.durationMs - a.durationMs).slice(0, 10)
);
console.log(JSON.stringify(slow));
```

Honest gap wording: report these as "Performance-API timing metrics", never as a Lighthouse score or a DevTools performance trace. If a Lighthouse-parity audit is required, state that Aside does not provide it and route to external Lighthouse tooling. Constraints: needs a bound tab; measure after `waitForLoadState('load')` (or `'networkidle'`) so the entries are populated.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/discovery-fixture-2026-07-16.json` | Fixture | Proves `page.evaluate` (page-context JS) is available; no trace/Lighthouse tool present |
| `references/aside-online-research-2026-07-17.md` | Reference | §4 records the Playwright envelope and the Lighthouse-gap boundary |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/devtools-parity/performance-timing.md` | Manual playbook | ASD-020 Performance-API timing capture + Lighthouse-gap assertion (SKIP-valid without a bound session) |

---

## 4. SOURCE METADATA

- Group: DevTools Parity
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `devtools-parity/performance-timing.md`

Related references:
- [console-and-network-capture.md](console-and-network-capture.md) covers request-level timing via `requestfinished`
- [dom-inspection.md](dom-inspection.md) covers the `page.evaluate` primitive these metrics build on
