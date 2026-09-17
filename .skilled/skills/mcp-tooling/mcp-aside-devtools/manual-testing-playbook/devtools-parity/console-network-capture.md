---
title: "ASD-018 -- Console + network event capture"
description: "This scenario validates Chrome-DevTools Console/Network parity for `ASD-018` through Playwright page.on() listeners in the aside REPL, with the exact repl code, the honest HAR-assembly gap, and a SKIP-valid path when no bound session exists."
version: 1.0.0.0
---

# ASD-018 -- Console + network event capture

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-018`.

---

## 1. OVERVIEW

This scenario is the documented, API-grounded successor to the guarded probes ASD-012 (console) and ASD-013 (network). The discovery fixture proves `page` is a Playwright `Page`, so `page.on('console'|'request'|'response'|'requestfinished', …)` are the real capture paths. This scenario runs them against a bound tab and records the result shape.

### Why This Matters

Console and network capture are the top parity requests off `bdg console --list` and `bdg network har`. The pattern is now known (not UNKNOWN), but two honesty lines hold: live execution needs a bound authorized session (SKIP-valid otherwise), and there is **no native HAR export** — the network path assembles a HAR-equivalent from events, never a HAR file.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-018` and confirm the expected signals without contradictory evidence.

- Objective: On a bound tab, register console + request/response listeners, trigger a reload, and return parseable captured events — with no dedicated-tool or HAR-export parity claim.
- Real user request: `"Show me the console messages and network requests for this page."`
- Prompt: `Capture console and network events through the aside REPL with page.on listeners on a bound tab, and report the shape honestly.`
- Expected execution process: listeners registered BEFORE the reload, collected into arrays, logged.
- Expected signals: a parseable console array (includes the sentinel) and a parseable network array (request+response phases).
- Desired user-visible outcome: The captured console/network shapes, redacted, with an explicit "Playwright event capture; HAR-equivalent assembled by caller" note.
- Pass/fail: PASS when both arrays parse; SKIP (valid) with the blocker "no bound Aside session available"; FAIL only if a listener is left unguarded or the verdict claims a native console tool or HAR export.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Capture console and network events through the aside REPL with page.on listeners on a bound tab, and report the shape honestly.`

### Commands

1. Precondition: a bound tab (ASD-006). If none, SKIP with that blocker.
2. `bash:` register listeners, reload, log captured events:
   `aside repl "const cmsg = []; const net = []; page.on('console', m => cmsg.push({ type: m.type(), text: m.text() })); page.on('request', r => net.push({ phase: 'req', url: r.url(), method: r.method() })); page.on('response', r => net.push({ phase: 'res', url: r.url(), status: r.status() })); await page.evaluate(() => console.log('ASD-018 sentinel')); await page.reload({ waitUntil: 'load' }); console.log(JSON.stringify({ cmsg: cmsg.slice(0,20), net: net.slice(0,20) }))" 2>&1`

### Expected

- Output parses; `cmsg` includes `ASD-018 sentinel`; `net` has request and response phases. Redact bodies/headers before saving.

### Evidence

The full REPL transcript and the parsed shapes (redacted). On success, save the result shape as an installed-version fixture (this is the first live capture fixture the packet has for these events).

### Pass / Fail

- **Pass**: both arrays parse with the expected phases/sentinel.
- **Skip**: no bound session — documented blocker.
- **Fail**: listener left unguarded, unparseable output against a bound tab, or a verdict claiming `bdg console --list`/HAR-export parity.

### Failure Triage

1. Empty arrays: listeners must be registered before the reload; confirm order and retry once.
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
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/devtools-parity/console-and-network-capture.md` | Capability leaf with the repl code + HAR gap |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/probes-and-gaps/console-probe.md` | ASD-012 guarded probe this scenario supersedes |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/probes-and-gaps/network-probe.md` | ASD-013 guarded probe; HAR gap stays honest |

---

## 5. SOURCE METADATA

- Group: DEVTOOLS PARITY
- Playbook ID: ASD-018
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `devtools-parity/console-network-capture.md`
