---
title: "ASD-011 -- Code Mode discovery"
description: "This scenario validates post-registration Code Mode discovery for `ASD-011` against the registered aside manual and confirms the exact aside callable name."
version: 1.0.0.0
---

# ASD-011 -- Code Mode discovery

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-011`.

---

## 1. OVERVIEW

This scenario confirms that Code Mode discovery surfaces the Aside callables from the registered `aside` manual in `.utcp_config.json` — expected `aside.aside_repl` per the `{manual_name}.{manual_name}_{tool_name}` convention.

> **PRECONDITION**: A session with the code_mode MCP loaded. The `aside` manual **is registered** in `.utcp_config.json` (2026-07-16), and Code Mode loads manuals at startup — so discovery needs a session started after registration. Without a Code Mode session, the correct outcome is SKIP with the blocker "no Code Mode session available".

### Why This Matters

`aside.aside_repl` is a naming-convention expectation, not an observed fact — the research explicitly classifies it as a post-registration discovery result to confirm. This scenario is the confirmation, and it closes (or reopens) the packet's expected-callable claim.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-011` and confirm the expected signals without contradictory evidence.

- Objective: Verify Code Mode `search_tools()` finds Aside tools and `tool_info()` confirms the exact callable name; record the actual name whether or not it matches `aside.aside_repl`.
- Real user request: `"Can I call Aside from a Code Mode tool chain now?"`
- Prompt: `Discover the registered Aside callables through Code Mode and confirm their exact names.`
- Expected execution process: registration check, search, per-callable info, name confirmation.
- Expected signals: manual present; tools discovered; exact callable names recorded.
- Desired user-visible outcome: The confirmed callable list with a PASS verdict, or a SKIP with the no-Code-Mode-session blocker.
- Pass/fail: PASS if discovery confirms callables; SKIP (documented) when no Code Mode session is available; FAIL if the manual is missing (registration regressed) or discovery returns nothing in a loaded session.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Discover the registered Aside callables through Code Mode and confirm their exact names.`

### Commands

1. `bash: jq '.manual_call_templates[] | select(.name == "aside")' .utcp_config.json` — registration check; the manual is registered, so empty output is a FAIL (registration regressed), not a SKIP.
2. Code Mode: `search_tools({ task_description: "Aside browser automation", limit: 20 })`
3. Code Mode: `tool_info()` on every returned Aside callable.

### Expected

- Step 1: the manual object (stdio, `command: "aside"`, `args: ["mcp"]`, `env: {}`)
- Step 2: at least one Aside tool discovered
- Step 3: exact callable names — expected `aside.aside_repl`, actual recorded either way

### Evidence

The registration object, the discovery output, and the confirmed callable names with their input schemas.

### Pass / Fail

- **Pass**: callables discovered and names confirmed.
- **SKIP**: no Code Mode session available — the only valid blocker.
- **Fail**: the manual is missing from `.utcp_config.json` (registration regressed), or discovery returns nothing in a loaded session (triage below).

### Failure Triage

1. Registered but undiscovered: verify `jq empty .utcp_config.json`, confirm the Code Mode session started after registration (manuals load at startup — reconnect if not), then check whether the Code Mode server's PATH resolves `aside` (absolute-path substitution may be needed), then re-run discovery.
2. Callable name differs from `aside.aside_repl`: update the packet's MCP reference with the confirmed name — the convention-based expectation was wrong for this environment.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/mcp-servers/aside-mcp/README.md` | Registered manual pointer and post-registration checklist |
| `.opencode/skills/mcp-code-mode/SKILL.md` | Discovery and naming-convention contract |

---

## 5. SOURCE METADATA

- Group: MCP TRANSPORT
- Playbook ID: ASD-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `mcp_transport/code_mode_discovery.md`
