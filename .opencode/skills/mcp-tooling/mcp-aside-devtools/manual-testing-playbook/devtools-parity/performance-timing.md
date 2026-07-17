---
title: "ASD-020 -- Performance timing + Lighthouse gap"
description: "This scenario validates Chrome-DevTools Performance parity for `ASD-020`: page.evaluate over the Performance API through the aside REPL, and an explicit assertion of the honest Lighthouse gap, with a SKIP-valid path when no bound session exists."
version: 1.0.0.0
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
- Expected execution process: `waitForLoadState('load')` then `page.evaluate` over `performance.getEntriesByType`.
- Expected signals: a parseable object with navigation timing (ttfb/dcl/load) and a paint array.
- Desired user-visible outcome: The timing metrics, plus an explicit "no Lighthouse score — requires external tooling" note.
- Pass/fail: PASS when timing parses AND the verdict states the Lighthouse gap; SKIP (valid) with the blocker "no bound Aside session available"; FAIL if the verdict claims a Lighthouse score or trace.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Capture Performance-API timing through the aside REPL on a bound tab, and state the Lighthouse gap.`

### Commands

1. Precondition: a bound tab (ASD-006). If none, SKIP with that blocker.
2. `bash:` capture timing after load:
   `aside repl "await page.waitForLoadState('load'); const perf = await page.evaluate(() => { const [n] = performance.getEntriesByType('navigation'); return { nav: n ? { ttfbMs: Math.round(n.responseStart), dclMs: Math.round(n.domContentLoadedEventEnd), loadMs: Math.round(n.loadEventEnd) } : null, paint: performance.getEntriesByType('paint').map(p => ({ name: p.name, startMs: Math.round(p.startTime) })) }; }); console.log(JSON.stringify(perf))" 2>&1`

### Expected

- Output parses to `{ nav: { ttfbMs, dclMs, loadMs }, paint: [{ name: 'first-contentful-paint', startMs }...] }`. The verdict explicitly notes no Lighthouse score is produced.

### Evidence

The REPL transcript and parsed timing JSON, plus the written Lighthouse-gap statement.

### Pass / Fail

- **Pass**: timing parses AND the verdict states the Lighthouse gap.
- **Skip**: no bound session — documented blocker.
- **Fail**: the verdict claims a Lighthouse score/trace, or timing errors against a genuinely bound tab.

### Failure Triage

1. Empty `paint`/`navigation`: measure after `waitForLoadState('load')` (or `'networkidle'`) and retry once.
2. Binding error: cross-reference ASD-006/ASD-010.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/devtools-parity/performance-timing.md` | Capability leaf with the repl code + Lighthouse gap |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/discovery-fixture-2026-07-16.json` | One-`repl`-tool inventory: no Lighthouse/trace tool |

---

## 5. SOURCE METADATA

- Group: DEVTOOLS PARITY
- Playbook ID: ASD-020
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `devtools-parity/performance-timing.md`
