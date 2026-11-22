---
title: "ASD-018 -- Console + network event capture"
description: "This scenario validates Chrome-DevTools Console/Network parity for `ASD-018` through Playwright page.on() listeners in the aside REPL, with the exact repl code, the honest HAR-assembly gap, and a SKIP-valid path when no bound session exists."
version: 1.0.2.0
---

# ASD-018 -- Console + network event capture

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-018`.

---

## 1. OVERVIEW

This scenario is the documented, API-grounded successor to the guarded probes ASD-012 (console) and ASD-013 (network). The discovery fixture proves `page` is a Playwright `Page`, so `page.on('console'|'request'|'response'|'requestfinished', …)` are the real capture paths. This scenario runs them against a bound tab and records the result shape. On Aside 1.26.626.1517 that inference did not hold: `page.on('console')`, `page.on('request')` and `page.on('response')` each throw an error that says the event is not supported, lists the supported page events (close, crash, dialog, domcontentloaded, download, filechooser, frameattached, framedetached, framenavigated, load, popup) and points to `page.console.logs()`. Each listener is therefore registered inside its own guard, and the per-event outcome is the evidence. The `page.console.logs()` pointer is recorded as the error's suggestion; its return shape is not yet evidenced.

### Why This Matters

Console and network capture are the top parity requests off `bdg console --list` and `bdg network har`. The `page.on` listener pattern is not supported for these events on Aside 1.26.626.1517, and two more honesty lines hold: live execution needs a bound authorized session (SKIP-valid otherwise), and there is **no native HAR export**; a network path would assemble a HAR-equivalent from events, never a HAR file.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-018` and confirm the expected signals without contradictory evidence.

- Objective: On a tab opened in the same evaluation, try to register console + request/response listeners, each inside its own guard, trigger a navigation, and log the per-event registration outcome plus any captured events, with no dedicated-tool or HAR-export parity claim.
- Real user request: `"Show me the console messages and network requests for this page."`
- Prompt: `Capture console and network events through the aside REPL with page.on listeners on a bound tab, and report the shape honestly.`
- Expected execution process: one REPL evaluation; tab opened first, since a separate `aside repl` call starts with `page` null; listeners attempted BEFORE the navigation; outcomes and arrays printed with `console.log`.
- Expected signals: a parseable `listeners` map with one entry per event; for a registered event, its array parses (console includes the sentinel, network has request and response phases); for an unsupported event, the verbatim error naming the supported events.
- Desired user-visible outcome: The captured console/network shapes, redacted, with an explicit "Playwright event capture; HAR-equivalent assembled by caller" note.
- Pass/fail: PASS when the output parses and every event's outcome is reported honestly, registered or unsupported; SKIP (valid) with the blocker "no bound Aside session available"; FAIL if a listener is left unguarded, the output does not parse, or the verdict claims a native console tool or HAR export.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Capture console and network events through the aside REPL with page.on listeners on a bound tab, and report the shape honestly.`

### Commands

1. Precondition: ASD-006 passed, so `openTab()` works on this profile. If no bound session is available, SKIP with that blocker.
2. `bash:` open the tab, try each listener inside its own guard, navigate, log the outcomes and captured events:
   `aside repl "await openTab('https://example.com'); const cmsg = []; const net = []; const listeners = {}; const handlers = { console: m => cmsg.push({ type: m.type(), text: m.text() }), request: r => net.push({ phase: 'req', url: r.url(), method: r.method() }), response: r => net.push({ phase: 'res', url: r.url(), status: r.status() }) }; for (const ev of Object.keys(handlers)) { try { page.on(ev, handlers[ev]); listeners[ev] = 'registered'; } catch (e) { listeners[ev] = 'UNSUPPORTED: ' + e.message; } } await page.evaluate(() => console.log('ASD-018 sentinel')); await page.goto('https://example.com/'); console.log(JSON.stringify({ listeners, cmsg: cmsg.slice(0, 20), net: net.slice(0, 20) }))" 2>&1`

### Expected

- Output parses to `{ listeners, cmsg, net }` and carries no error line. On Aside 1.26.626.1517 each `listeners` entry is `UNSUPPORTED:` followed by the error that lists the supported page events, and both arrays are empty. If a later version registers an event, its array holds the sentinel (console) or request and response phases (network). Redact bodies/headers before saving.
- Exit 0 alone is not a pass signal, because an `aside repl` error still exits 0.

### Evidence

The full REPL transcript and the parsed shapes (redacted). On success, save the result shape as an installed-version fixture (this is the first live capture fixture the packet has for these events).

### Pass / Fail

- **Pass**: the output parses AND every event is reported as registered, with its array matching, or as unsupported, with the verbatim error.
- **Skip**: no bound session — documented blocker.
- **Fail**: listener left unguarded, unparseable output against a bound tab, or a verdict claiming `bdg console --list`/HAR-export parity.

### Failure Triage

1. Empty arrays for a registered event: listeners must be registered before the navigation; confirm order and retry once.
2. `page` is null or a binding error: the tab was not opened in the same evaluation, or the profile is unbound; cross-reference ASD-006/ASD-010.
3. The error points to `page.console.logs()`: record the pointer only; its output shape is not part of this verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/feature-catalog/devtools-parity/console-and-network-capture.md` | Capability leaf with the repl code + HAR gap |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/manual-testing-playbook/probes-and-gaps/console-probe.md` | ASD-012 guarded probe this scenario supersedes |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/manual-testing-playbook/probes-and-gaps/network-probe.md` | ASD-013 guarded probe; HAR gap stays honest |

---

## 5. SOURCE METADATA

- Group: DEVTOOLS PARITY
- Playbook ID: ASD-018
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `devtools-parity/console-network-capture.md`
