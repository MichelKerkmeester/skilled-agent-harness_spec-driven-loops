---
title: "ASD-010 -- Unbound-profile error classification"
description: "This scenario validates browser-binding failure classification for `ASD-010`. It focuses on recording the binding state of a fresh MCP process and classifying a not-bound-to-a-browser-profile error as PROFILE_UNBOUND, not auth."
version: 1.0.3.0
---

# ASD-010 -- Unbound-profile error classification

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-010`.

---

## 1. OVERVIEW

This scenario calls `listBrowserTabs()` through `tools/call(repl)` on a fresh `aside mcp` process and verifies the binding state is reported and classified correctly. On Aside 1.26.626.1517, with the Aside app running and signed in, a fresh `aside mcp` process is bound and lists tabs, and the not-bound error no longer reproduces. The scenario therefore records whichever state appears. The MCP `repl` tool prints only `console.log` output, never a returned value, so the result is logged.

### Why This Matters

On earlier versions this error was the first thing real MCP users hit: a fresh server process was transport-healthy but not browser-capable. On 1.26.626.1517 with the app running and signed in, a fresh process is bound. The live-probed message — "This task is not bound to a browser profile. Open it in Aside browser and try again." — must be reported as a binding state (PROFILE_UNBOUND), because misdiagnosing it as missing auth sends operators hunting for credentials that do not exist. The supported binding procedure is an open research question, so honest reporting is the entire fix.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-010` and confirm the expected signals without contradictory evidence.

- Objective: Call `listBrowserTabs()` on a fresh MCP process and record the binding state: a tab count when bound, or the unbound-profile error classified as PROFILE_UNBOUND with the undocumented binding procedure cited, never as missing credentials.
- Real user request: `"The Aside MCP server says my task isn't bound to a browser profile — what's wrong?"`
- Prompt: `Call listBrowserTabs() via the MCP repl tool on a fresh aside mcp process and classify the result.`
- Expected execution process: spawn, handshake, tools/call(repl) with `listBrowserTabs()`, classification.
- Expected signals: either a logged tab count (bound, the observed state on Aside 1.26.626.1517 with the app running and signed in) or the binding-error text classified PROFILE_UNBOUND with the open-question citation.
- Desired user-visible outcome: The verbatim error plus its correct classification and the escalation guidance.
- Pass/fail: PASS if a tab count is logged and the bound state is recorded, or if the error appears and is classified correctly; FAIL if the result text is empty, which means the code returned instead of logging, or if the report blames authentication.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Call listBrowserTabs() via the MCP repl tool on a fresh aside mcp process and classify the result.`

### Commands

1. Spawn and handshake as in ASD-008, then send:
   `tools/call` → `{"name":"repl","arguments":{"title":"binding probe","code":"const bindingTabs = await listBrowserTabs(); console.log(JSON.stringify({ tabCount: bindingTabs.length }))"}}`
2. Capture the result text and close the process.

### Expected

- Step 1: on Aside 1.26.626.1517 with the app running and signed in, the result text carries `{"tabCount":<n>}` with n >= 0; on the research-pinned version, the result contains `This task is not bound to a browser profile`. Only the count is logged, so no tab title or URL from the user's browser lands in the evidence.
- Step 2: clean shutdown, no leaked process

### Evidence

The JSON-RPC transcript, the verbatim error text, the classification statement, and the leak check.

### Pass / Fail

- **Pass**: tab count logged AND the bound state recorded as the installed-version behavior, OR error reproduced AND classified PROFILE_UNBOUND.
- **Fail**: empty result text (the value was returned, not logged), the report attributes a failure to authentication, or improvises a binding workaround.

### Failure Triage

1. If a tab count is returned: the process is bound; record the environment (Aside app open and signed in, prior task) as evidence toward the open binding-procedure question.
2. If the result text is empty: the code used `return`; the MCP `repl` tool prints only `console.log` output.
3. If the call times out: cross-reference ASD-008 (transport) before classifying anything.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/references/mcp-wiring.md` | Binding-state contract |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/references/troubleshooting.md` | PROFILE_UNBOUND taxonomy entry |

---

## 5. SOURCE METADATA

- Group: MCP TRANSPORT
- Playbook ID: ASD-010
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-transport/unbound-profile-error.md`
