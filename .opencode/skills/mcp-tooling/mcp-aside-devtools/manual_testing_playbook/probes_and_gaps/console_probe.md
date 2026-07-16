---
title: "ASD-012 -- Console capture probe (guarded)"
description: "This scenario validates the console-capture gap for `ASD-012`. It is a guarded probe: either a sentinel round trip succeeds and its shape is recorded, or the failure is captured and console capture stays unsupported."
version: 1.0.0.0
---

# ASD-012 -- Console capture probe (guarded)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-012`.

---

## 1. OVERVIEW

This scenario probes whether Playwright-style `page.on('console', ...)` works on a bound page inside the Aside REPL. **No dedicated console contract exists in any research lineage** — not in docs, not in the live tool schema — so this probe either records a first supported fixture or confirms the fail-closed posture.

### Why This Matters

Console capture is the most likely parity request from users coming off `bdg console --list`. The packet's rule is to probe and fail closed rather than promise parity; this scenario is that rule made executable, and its outcome (either way) is the packet's evidence.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-012` and confirm the expected signals without contradictory evidence.

- Objective: Attempt a sentinel console round trip on a bound page; record the captured shape on success, or the verbatim failure on unsupported — with no parity claim in either verdict.
- Real user request: `"Can Aside show me the page's console output?"`
- Prompt: `Probe console capture on a bound page through the aside REPL with a sentinel message and report supported/unsupported honestly.`
- Expected execution process: guarded listener + sentinel evaluation in one persistent REPL context.
- Expected signals: sentinel captured (supported) OR failure captured verbatim (unsupported, fail closed).
- Desired user-visible outcome: A supported/unsupported verdict with the exact evidence, plus cleanup confirmation.
- Pass/fail: PASS for either honest outcome; FAIL only if the probe is skipped, unguarded, or the verdict overclaims.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Probe console capture on a bound page through the aside REPL with a sentinel message and report supported/unsupported honestly.`

### Commands

1. Precondition: ASD-006 opened a page (bound context).
2. `bash:` run a single REPL evaluation that registers a guarded listener, triggers a sentinel, waits briefly, and returns captured messages:
   `aside repl "const seen = []; try { page.on('console', m => seen.push(String(m.text?.() ?? m))); } catch (e) { return 'LISTENER_UNSUPPORTED: ' + e.message } await page.evaluate(() => console.log('ASD-012 sentinel')); await sleep(1000); return seen" 2>&1`

### Expected

- Supported path: returned array contains `ASD-012 sentinel` — save the full result shape as a fixture.
- Unsupported path: `LISTENER_UNSUPPORTED: ...` or an evaluation error — save verbatim; console capture remains unsupported.

### Evidence

The full REPL transcript and, on success, the result-shape fixture (message text, any metadata fields). Note result-size limits if the output appears truncated.

### Pass / Fail

- **Pass**: either outcome, honestly evidenced and correctly worded (no `bdg console --list` parity claim).
- **Fail**: probe skipped, listener left unguarded, or verdict claims capability beyond the evidence.

### Failure Triage

1. `page.evaluate` argument errors: evaluate-compatibility edge cases are a known vendor-changelog theme — record the exact call form and retry with the simplest form only once.
2. Binding error: precondition failed — cross-reference ASD-006/ASD-010.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/troubleshooting.md` | Capability-gap fail-closed policy |

---

## 5. SOURCE METADATA

- Group: PROBES AND GAPS
- Playbook ID: ASD-012
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `probes_and_gaps/console_probe.md`
