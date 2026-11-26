---
title: "ASD-012 -- Console capture probe (guarded)"
description: "This scenario validates the console-capture gap for `ASD-012`. It is a guarded probe: either a sentinel round trip succeeds and its shape is recorded, or the failure is captured and console capture stays unsupported."
version: 1.0.4.0
---

# ASD-012 -- Console capture probe (guarded)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-012`.

---

## 1. OVERVIEW

This scenario probes whether Playwright-style `page.on('console', ...)` works on a bound page inside the Aside REPL. **No dedicated console contract exists in any research lineage** — not in docs, not in the live tool schema — so this probe either records a first supported fixture or confirms the fail-closed posture.

On Aside 1.26.626.1517 the listener throws: the error says the `console` page event is not supported, lists the supported events (close, crash, dialog, domcontentloaded, download, filechooser, frameattached, framedetached, framenavigated, load, popup) and points to `page.console.logs()`. That pointer is recorded as the error's own suggestion; its return shape is not yet evidenced.

### Why This Matters

Console capture is the most likely parity request from users coming off `bdg console --list`. The packet's rule is to probe and fail closed rather than promise parity; this scenario is that rule made executable, and its outcome (either way) is the packet's evidence.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-012` and confirm the expected signals without contradictory evidence.

- Objective: Attempt a sentinel console round trip on a bound page; record the captured shape on success, or the verbatim failure on unsupported — with no parity claim in either verdict.
- Real user request: `"Can Aside show me the page's console output?"`
- Prompt: `Probe console capture on a bound page through the aside REPL with a sentinel message and report supported/unsupported honestly.`
- Expected execution process: one REPL evaluation that opens its own tab, registers the guarded listener, emits the sentinel, and prints the result with `console.log`, since a separate `aside repl` call starts with `page` null and a top-level `return` value is never printed.
- Expected signals: sentinel captured (supported) OR failure captured verbatim (unsupported, fail closed).
- Desired user-visible outcome: A supported/unsupported verdict with the exact evidence, plus cleanup confirmation.
- Pass/fail: PASS for either honest outcome; FAIL only if the probe is skipped, unguarded, or the verdict overclaims.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Probe console capture on a bound page through the aside REPL with a sentinel message and report supported/unsupported honestly.`

### Commands

1. Precondition: ASD-006 passed, so `openTab()` works on this profile. Its tab does not carry over to this call, so the evaluation opens its own.
2. `bash:` run a single REPL evaluation that opens the tab, registers a guarded listener, triggers a sentinel, waits briefly, and logs the captured messages:
   `aside repl "await openTab('https://example.com'); const seen = []; let unsupported = null; try { page.on('console', m => seen.push(String(m.text?.() ?? m))); } catch (e) { unsupported = 'LISTENER_UNSUPPORTED: ' + e.message; } if (unsupported) { console.log(unsupported); } else { await page.evaluate(() => console.log('ASD-012 sentinel')); await sleep(1000); console.log(JSON.stringify(seen)); }" 2>&1`

### Expected

- Supported path: the logged array contains `ASD-012 sentinel`; save the full result shape as a fixture.
- Unsupported path, the observed outcome on Aside 1.26.626.1517: `LISTENER_UNSUPPORTED:` followed by the error that lists the supported page events and points to `page.console.logs()`; save it verbatim; console capture remains unsupported through `page.on`.
- An empty output means the result was returned rather than logged. Exit 0 alone is not a signal, because an `aside repl` error still exits 0.

### Evidence

The full REPL transcript and, on success, the result-shape fixture (message text, any metadata fields). Note result-size limits if the output appears truncated.

### Pass / Fail

- **Pass**: either outcome, honestly evidenced and correctly worded (no `bdg console --list` parity claim). The saved reason opens with `supported:` or `unsupported:`, so a PASS row in the report index never reads as a working capture.
- **Fail**: probe skipped, listener left unguarded, or verdict claims capability beyond the evidence.

### Failure Triage

1. `page.evaluate` argument errors: evaluate-compatibility edge cases are a known vendor-changelog theme; record the exact call form and retry with the simplest form only once.
2. `page` is null or a binding error: the tab was not opened in the same evaluation, or the profile is unbound; cross-reference ASD-006/ASD-010.
3. The error points to `page.console.logs()`: record the pointer only. Probing that method is a separate scenario, and its output shape is not part of this verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/references/troubleshooting.md` | Capability-gap fail-closed policy |

---

## 5. SOURCE METADATA

- Group: PROBES AND GAPS
- Playbook ID: ASD-012
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `probes-and-gaps/console-probe.md`
