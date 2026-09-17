---
title: "ASD-010 -- Unbound-profile error classification"
description: "This scenario validates browser-binding failure classification for `ASD-010`. It focuses on reproducing the not-bound-to-a-browser-profile error and classifying it as PROFILE_UNBOUND, not auth."
version: 1.0.0.0
---

# ASD-010 -- Unbound-profile error classification

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-010`.

---

## 1. OVERVIEW

This scenario calls `listBrowserTabs()` through `tools/call(repl)` on a fresh `aside mcp` process and verifies the browser-unbound state is returned and classified correctly.

### Why This Matters

This error is the first thing real MCP users will hit: a fresh server process is transport-healthy but not browser-capable. The live-probed message — "This task is not bound to a browser profile. Open it in Aside browser and try again." — must be reported as a binding state (PROFILE_UNBOUND), because misdiagnosing it as missing auth sends operators hunting for credentials that do not exist. The supported binding procedure is an open research question, so honest reporting is the entire fix.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-010` and confirm the expected signals without contradictory evidence.

- Objective: Reproduce the unbound-profile error on a fresh MCP process and verify the report names PROFILE_UNBOUND, cites the undocumented binding procedure, and never mentions missing credentials.
- Real user request: `"The Aside MCP server says my task isn't bound to a browser profile — what's wrong?"`
- Prompt: `Call listBrowserTabs() via the MCP repl tool on a fresh aside mcp process and classify the result.`
- Expected execution process: spawn, handshake, tools/call(repl) with `listBrowserTabs()`, classification.
- Expected signals: the binding-error text returned; classification PROFILE_UNBOUND with the open-question citation.
- Desired user-visible outcome: The verbatim error plus its correct classification and the escalation guidance.
- Pass/fail: PASS if the error reproduces and is classified correctly; if the installed version instead returns tabs (behavior change), PASS with the new behavior recorded as the finding.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Call listBrowserTabs() via the MCP repl tool on a fresh aside mcp process and classify the result.`

### Commands

1. Spawn and handshake as in ASD-008, then send:
   `tools/call` → `{"name":"repl","arguments":{"title":"binding probe","code":"return await listBrowserTabs()"}}`
2. Capture the result text and close the process.

### Expected

- Step 1: on the research-pinned version, the result contains `This task is not bound to a browser profile`
- Step 2: clean shutdown, no leaked process

### Evidence

The JSON-RPC transcript, the verbatim error text, the classification statement, and the leak check.

### Pass / Fail

- **Pass**: error reproduced AND classified PROFILE_UNBOUND (or new behavior recorded as a version-drift finding).
- **Fail**: the report attributes the failure to authentication, or improvises a binding workaround.

### Failure Triage

1. If tabs are returned: the process was somehow bound (or behavior changed) — record how the environment differed (Aside app open? prior task?) as evidence toward the open binding-procedure question.
2. If the call times out: cross-reference ASD-008 (transport) before classifying anything.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/mcp-wiring.md` | Binding-state contract |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/troubleshooting.md` | PROFILE_UNBOUND taxonomy entry |

---

## 5. SOURCE METADATA

- Group: MCP TRANSPORT
- Playbook ID: ASD-010
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-transport/unbound-profile-error.md`
