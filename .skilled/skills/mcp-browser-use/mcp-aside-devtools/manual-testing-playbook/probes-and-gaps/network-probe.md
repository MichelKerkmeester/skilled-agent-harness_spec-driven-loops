---
title: "ASD-013 -- Network capture probe (guarded)"
description: "This scenario validates the network-capture gap for `ASD-013`. It is a guarded probe for request/response listeners on a bound page; no HAR parity is promised in any outcome."
version: 1.0.4.0
---

# ASD-013 -- Network capture probe (guarded)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-013`.

---

## 1. OVERVIEW

This scenario probes whether `page.on('request', ...)` / `page.on('response', ...)` yield structured network events on a bound page. **No dedicated network tool was discovered in any research lineage**, and no HAR-export parity is promised regardless of outcome.

### Why This Matters

Users coming from `bdg network har <path>` will ask for network traces. Aside's architecture plausibly captures browser-authenticated requests, but the safe output contract is unverified — this probe either produces the first parseable fixture (with redaction) or confirms the fail-closed posture.

On Aside 1.26.626.1517 the `request` listener throws: the error says the event is not supported and lists the supported page events (close, crash, dialog, domcontentloaded, download, filechooser, frameattached, framedetached, framenavigated, load, popup).

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-013` and confirm the expected signals without contradictory evidence.

- Objective: Attempt guarded request/response listeners around a page load; on success capture parseable event records with a known marker (headers/bodies redacted); on failure capture the error verbatim.
- Real user request: `"Can Aside show me which requests the page makes?"`
- Prompt: `Probe network event capture on a bound page through the aside REPL and report supported/unsupported honestly, redacting headers and bodies.`
- Expected execution process: one REPL evaluation that opens its own tab, registers the guarded listeners, navigates, and prints the result with `console.log`, since a separate `aside repl` call starts with `page` null and a top-level `return` value is never printed.
- Expected signals: parseable event list containing the navigated URL (supported) OR the verbatim failure (unsupported).
- Desired user-visible outcome: A supported/unsupported verdict with redacted evidence; no HAR-parity claim.
- Pass/fail: PASS for either honest outcome; FAIL if unguarded, skipped, overclaiming, or leaking headers/bodies into evidence.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Probe network event capture on a bound page through the aside REPL and report supported/unsupported honestly, redacting headers and bodies.`

### Commands

1. Precondition: ASD-006 passed, so `openTab()` works on this profile. Its tab does not carry over to this call, so the evaluation opens its own before registering listeners.
2. `bash:` single REPL evaluation with guarded listeners capturing method + URL only:
   `aside repl "await openTab('https://example.com'); const events = []; let unsupported = null; try { page.on('request', r => events.push({ kind: 'req', method: r.method?.(), url: r.url?.() })); page.on('response', r => events.push({ kind: 'res', status: r.status?.(), url: r.url?.() })); } catch (e) { unsupported = 'LISTENER_UNSUPPORTED: ' + e.message; } if (unsupported) { console.log(unsupported); } else { await page.goto('https://example.com/'); await sleep(2000); console.log(JSON.stringify(events)); }" 2>&1`

### Expected

- Supported path: a logged, parseable array whose entries include `https://example.com`; save as a fixture (method/status/URL only).
- Unsupported path, the observed outcome on Aside 1.26.626.1517: `LISTENER_UNSUPPORTED:` followed by the error that lists the supported page events; save it verbatim; network capture remains unsupported.
- An empty output means the result was returned rather than logged. Exit 0 alone is not a signal, because an `aside repl` error still exits 0.

### Evidence

The REPL transcript and, on success, the redacted event fixture. Confirm no headers, cookies, or bodies were captured.

### Pass / Fail

- **Pass**: either outcome, honestly evidenced, redaction intact, no HAR-parity claim. The saved reason opens with `supported:` or `unsupported:`, so a PASS row in the report index never reads as a working capture.
- **Fail**: unguarded listeners, skipped probe, overclaimed verdict, or sensitive data in evidence.

### Failure Triage

1. Events array empty despite navigation: record the timing and retry once with a longer wait; an empty-but-supported result is distinct from listener failure and should be evidenced as such.
2. `page` is null or a binding error: the tab was not opened before the listeners, or the profile is unbound; cross-reference ASD-006/ASD-010. A `LISTENER_UNSUPPORTED` message that names a null `page` is this case, not an unsupported event.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/references/troubleshooting.md` | Capability-gap fail-closed policy and redaction rules |

---

## 5. SOURCE METADATA

- Group: PROBES AND GAPS
- Playbook ID: ASD-013
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `probes-and-gaps/network-probe.md`
