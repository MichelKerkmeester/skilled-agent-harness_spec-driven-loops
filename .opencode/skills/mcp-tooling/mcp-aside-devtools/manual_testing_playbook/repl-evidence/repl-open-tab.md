---
title: "ASD-006 -- REPL open tab"
description: "This scenario validates the deterministic REPL lane for `ASD-006`. It focuses on `aside repl` round-tripping an `openTab()` call against a bound browser context."
version: 1.0.0.0
---

# ASD-006 -- REPL open tab

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-006`.

---

## 1. OVERVIEW

This scenario exercises the deterministic lane's documented entry point: `aside repl "await openTab('https://example.com')"`.

### Why This Matters

`openTab(url)` is the one REPL pattern documented by the vendor and confirmed as a function by the live capability probe. It is also the cheapest way to hit the binding boundary: whether a CLI REPL invocation is browser-bound on this machine is exactly what the packet needs to know before promising deterministic evidence.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-006` and confirm the expected signals without contradictory evidence.

- Objective: Verify the REPL call exits 0 and either opens the tab or surfaces the unbound-profile state, correctly classified.
- Real user request: `"Open example.com in the Aside browser, scripted — no agent improvisation."`
- Prompt: `Open https://example.com deterministically through the aside REPL and report the result.`
- Expected execution process: single REPL invocation, result classification.
- Expected signals: exit 0 without a binding error; the tab observable in the Aside browser where verifiable.
- Desired user-visible outcome: A one-line report of the tab result (or a correctly-classified binding state).
- Pass/fail: PASS if the call round-trips without error; FAIL-with-binding-cause if the unbound-profile message appears (classified as PROFILE_UNBOUND, never as auth); FAIL otherwise.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Open https://example.com deterministically through the aside REPL and report the result.`

### Commands

1. Precondition: ASD-001 and ASD-003 passed.
2. `bash: aside repl "await openTab('https://example.com')" 2>&1`

### Expected

- Step 2: exits 0 with no `not bound to a browser profile` text

### Evidence

Full transcript including exit code; where the Aside browser UI is observable, note whether the tab appeared.

### Pass / Fail

- **Pass**: exit 0, no binding error.
- **Fail (binding)**: the unbound-profile message — report PROFILE_UNBOUND, cite that the supported binding procedure is an open question, and cross-reference ASD-010.
- **Fail (other)**: any other error — capture verbatim for triage.

### Failure Triage

1. Binding error: do not loop retries or improvise a binding workaround; escalate with the verbatim message.
2. Signed-out symptoms: cross-reference ASD-003 before blaming the REPL lane.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/aside-cli-reference.md` | REPL lane contract and helper list |

---

## 5. SOURCE METADATA

- Group: REPL EVIDENCE
- Playbook ID: ASD-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `repl-evidence/repl-open-tab.md`
