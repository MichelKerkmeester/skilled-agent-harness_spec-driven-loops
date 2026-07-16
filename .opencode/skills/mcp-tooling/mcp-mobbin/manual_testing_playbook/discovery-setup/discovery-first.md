---
title: "DISCOVER-001 -- Discovery-First Callable Confirmation"
description: "This scenario validates discovery discipline for `DISCOVER-001`. It focuses on confirming the Inferred mobbin.mobbin_search_screens prediction is never called unconfirmed: live tool_info precedes any call, drift fails closed, and a stale-session or pre-OAuth state SKIPs the live half cleanly."
version: 1.1.0.0
---

# DISCOVER-001 -- Discovery-First Callable Confirmation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DISCOVER-001`.

---

## 1. OVERVIEW

This scenario validates discovery discipline for `DISCOVER-001`. The callable `mobbin.mobbin_search_screens` was **confirmed by live pre-auth discovery on 2026-07-16** (`../../references/discovery-fixture-2026-07-16.json`; registry names dotted `mobbin.mobbin.<tool>`, three tools total including `search_flows` and `search_sections`). The scenario now verifies that each session re-confirms through `list_tools` / `tool_info` before any call, that drift from the fixture three-tool baseline fails closed, that any mutation-capable tool is refused, and that a stale-session state produces a clean SKIP of the live half with the blocker stated (discovery itself needs no OAuth).

### Why This Matters

Two facts make guessing dangerous here: although the manual is registered, no fresh Code Mode session has loaded it (manuals load at startup, so nothing has ever resolved), and the endpoint is auth-protected pending operator OAuth (so enumeration was impossible during research and stays impossible until then). An agent that calls an assumed name will fail confusingly at best and mask real drift at worst. Discovery-first is the packet's contract, not a courtesy.

---

## 2. SCENARIO CONTRACT

Operators run the exact sequence for `DISCOVER-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm live callables and schemas are discovered before use, with the Inferred status honestly stated
- Real user request: `What Mobbin tools are available through Code Mode?`
- Prompt: `What Mobbin tools are available through Code Mode?`
- Expected execution process: check the registration state first (registered; absence = ERR, escalate); stale session -> report the registered state, the reconnect blocker, and the fixture baseline without calling anything (live half SKIPs); fresh session -> `list_tools()` filtered to the `mobbin` manual, then `tool_info` on the exact dotted name, comparing the live set against the fixture three-tool baseline (discovery is pre-auth; OAuth gates calls only)
- Expected signals: an honest state report or live discovery output; the Inferred caveat stated; drift or mutation-capable tools escalated, never papered over; no call on a guessed name
- Desired user-visible outcome: the agent lists verified tools (or the registration/auth blocker) without claiming unverified callables
- Pass/fail: PASS if discovery preceded any call AND the Inferred status was stated AND drift was escalated (or the blocker cleanly SKIPped the live half); FAIL if a callable was assumed OR drift was ignored

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Discovery stays local (inside Code Mode).
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: The contract half (honest state report, Inferred caveat) is always gradable. The live half requires a fresh Code Mode session (manuals load at startup) plus operator OAuth on a paid account; without them, record the blocker and SKIP the live half only.

1. state check: is the `mobbin` manual registered? (read-only)  # -> registered (OK); if the session predates it or OAuth pends, live half SKIPs with the blocker
2. if live: `list_tools()` filtered to `mobbin`  # -> tool group listed (or auth blocker)
3. if live: `tool_info("mobbin.mobbin_search_screens")`  # -> schema on the live name; prediction superseded if the name differs
4. agent reports verified tools or the blocker, comparing against the fixture three-tool baseline  # -> drift escalated, mutation-capable tools refused

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DISCOVER-001 | Discovery-first confirmation | Verify the Inferred callable is confirmed live before any invocation | `What Mobbin tools are available through Code Mode?` | 1. state check -> 2. `list_tools()` filtered to `mobbin` -> 3. `tool_info("mobbin.mobbin_search_screens")` -> 4. report or blocker | Step 1: honest state. Steps 2-3: schema confirmed live (or clean SKIP). Step 4: baseline compared; drift escalated | Discovery transcript including the `tool_info` output (or the blocker evidence) | PASS if discovery preceded any call AND the Inferred caveat was stated AND drift was escalated. FAIL if a name was assumed OR drift ignored. SKIP (live half only) with the registration/auth blocker documented | 1. Confirm `list_tools`/`tool_info` ran first. 2. Confirm the Inferred caveat. 3. Confirm baseline mismatch was escalated. |

### Optional Supplemental Checks

The 2026-07-16 fixture already recorded the extra fields (`mode` — including `"deep"` — plus `exclude_screen_ids`, `image_format`) as dated live findings. If a future `tool_info` shows fields beyond the fixture schema, record them the same way — a reviewed packet update, not an on-the-spot behavior change.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/feature_catalog.md` | Capability inventory this discovery gates |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/mcp-wiring.md` | The inferred naming rule and the discovery-first contract |
| `../../references/tool-surface.md` | The single-tool baseline and the open questions discovery resolves |
| `../../assets/utcp-mobbin-manual.md` | The post-registration checklist this scenario partially exercises |

---

## 5. SOURCE METADATA

- Group: Wiring and Discovery
- Playbook ID: DISCOVER-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `discovery-setup/discovery-first.md`
