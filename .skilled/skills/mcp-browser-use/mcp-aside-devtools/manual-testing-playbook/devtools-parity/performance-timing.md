---
title: "ASD-020 -- Performance timing + Lighthouse gap"
description: "This scenario validates Chrome-DevTools Performance parity for `ASD-020`: page.evaluate over the Performance API through the aside REPL, and an explicit assertion of the honest Lighthouse gap, with a SKIP-valid path when no bound session exists."
version: 1.0.2.0
---

# ASD-020 -- Performance timing + Lighthouse gap

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-020`.

---

## 1. OVERVIEW

This scenario captures navigation-timing and paint metrics via `page.evaluate` over the Performance API, and asserts the honest gap: Aside has no built-in Lighthouse audit and no trace-recording tool. Timing metrics are available; a Lighthouse score is NOT.

### Why This Matters

Users coming off the Chrome DevTools MCP's `lighthouse_audit` / `performance_start_trace` will ask for a score or a trace. The packet must not fabricate one. This scenario proves the achievable timing path and documents the Lighthouse-parity gap as a hard boundary.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-020` and confirm the expected signals without contradictory evidence.

- Objective: On a bound tab, return navigation timing + paint entries via the Performance API; explicitly state that no Lighthouse score is produced.
- Real user request: `"How fast does this page load — give me the timing metrics."`
- Prompt: `Capture Performance-API timing through the aside REPL on a bound tab, and state the Lighthouse gap.`
- Expected execution process: one REPL evaluation that opens its own tab, since a separate `aside repl` call starts with `page` null, then `waitForLoadState('load')` and `page.evaluate` over `performance.getEntriesByType`.
- Expected signals: a parseable object with navigation timing (ttfb/dcl/load) and a paint array.
- Desired user-visible outcome: The timing metrics, plus an explicit "no Lighthouse score — requires external tooling" note.
- Pass/fail: PASS when timing parses AND the verdict states the Lighthouse gap; SKIP (valid) with the blocker "no bound Aside session available"; FAIL if the verdict claims a Lighthouse score or trace.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Capture Performance-API timing through the aside REPL on a bound tab, and state the Lighthouse gap.`

### Commands

1. Precondition: ASD-006 passed, so `openTab()` works on this profile. If no bound session is available, SKIP with that blocker.
2. `bash:` open the tab and capture timing after load:
   `aside repl "await openTab('https://example.com'); await page.waitForLoadState('load'); const perf = await page.evaluate(() => { const [n] = performance.getEntriesByType('navigation'); return { nav: n ? { ttfbMs: Math.round(n.responseStart), dclMs: Math.round(n.domContentLoadedEventEnd), loadMs: Math.round(n.loadEventEnd) } : null, paint: performance.getEntriesByType('paint').map(p => ({ name: p.name, startMs: Math.round(p.startTime) })) }; }); console.log(JSON.stringify(perf))" 2>&1`

### Expected

- Output parses to `{ nav: { ttfbMs, dclMs, loadMs }, paint: [{ name: 'first-contentful-paint', startMs }...] }`. The verdict explicitly notes no Lighthouse score is produced. The output carries no error line; exit 0 alone is not a pass signal, because an `aside repl` error still exits 0.

### Evidence

The REPL transcript and parsed timing JSON, plus the written Lighthouse-gap statement.

### Pass / Fail

- **Pass**: timing parses AND the verdict states the Lighthouse gap.
- **Skip**: no bound session — documented blocker.
- **Fail**: the verdict claims a Lighthouse score/trace, or timing errors against a genuinely bound tab.

### Failure Triage

1. Empty `paint`/`navigation`: measure after `waitForLoadState('load')` (or `'networkidle'`) and retry once.
2. `page` is null or a binding error: the tab was not opened in the same evaluation, or the profile is unbound; cross-reference ASD-006/ASD-010.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/feature-catalog/devtools-parity/performance-timing.md` | Capability leaf with the repl code + Lighthouse gap |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/references/discovery-fixture-2026-07-16.json` | One-`repl`-tool inventory: no Lighthouse/trace tool |

---

## 5. SOURCE METADATA

- Group: DEVTOOLS PARITY
- Playbook ID: ASD-020
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `devtools-parity/performance-timing.md`
