---
title: "DISCOVER-001 -- Discovery-First Callable Confirmation"
description: "This scenario validates discovery for `DISCOVER-001`. It focuses on confirming the doubled-prefix callables are confirmed through Code Mode list_tools and tool_info before any call, with fail-closed handling of catalog drift."
version: 1.0.0.0
---

# DISCOVER-001 -- Discovery-First Callable Confirmation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DISCOVER-001`.

---

## 1. OVERVIEW

This scenario validates discovery for `DISCOVER-001`. It focuses on confirming the doubled-prefix callables (`refero.refero_refero_<tool>`) are confirmed through Code Mode discovery (`list_tools` / `tool_info`) before any call, that no callable name is assumed, and that any drift from the eight documented tools fails closed.

### Why This Matters

The doubled prefix was the packet's preserved naming conflict; live registry evidence closed it on 2026-07-16 (`../../references/discovery-fixture-2026-07-16.json`): `list_tools` returned all eight dotted doubled names `refero.refero.refero_<tool>` pre-auth, and the TS callable is `refero.refero_refero_<tool>(...)`. The single-prefix derivation is refuted. Per-session confirmation stays mandatory — an agent that hard-codes any form without `tool_info` is running on an assumption the packet explicitly forbids.

---

## 2. SCENARIO CONTRACT

Operators run the exact sequence for `DISCOVER-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the live callables and schemas are discovered before use, with the doubled prefix
- Real user request: `What Refero tools are available through Code Mode?`
- Prompt: `What Refero tools are available through Code Mode?`
- Expected execution process: `list_tools()` filtered to the `refero` group, then `tool_info` on a concrete doubled-prefix name; if unauthenticated, surface the auth blocker and SKIP the live half; never call a guessed name
- Expected signals: discovery returns the refero tools (or a clean auth blocker); `tool_info` confirms a doubled-prefix schema; the live set matches the eight documented tools or the drift is escalated
- Desired user-visible outcome: the agent lists verified tools (or the auth blocker) without claiming unverified callables
- Pass/fail: PASS if discovery preceded any call AND the doubled prefix was confirmed (or the auth blocker cleanly SKIPped the live half) AND no guessed name was invoked; FAIL if a callable was assumed OR drift was ignored

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Discovery runs inside Code Mode.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: The live branch requires a completed operator OAuth on a Pro (or higher) account. Without it, record the auth evidence (401 or unresolved tools) and grade the contract half only: the agent must still refuse to guess names.

1. `list_tools()` filtered to the `refero` prefix  # -> refero group listed, or auth blocker surfaced
2. `tool_info("refero.refero_refero_search_styles")`  # -> concrete schema on the doubled prefix
3. agent compares the live set against the eight documented tools  # -> match stated, or drift escalated (fail closed)
4. agent reports verified tools or the auth blocker  # -> no unverified claim

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DISCOVER-001 | Discovery-first confirmation | Verify doubled-prefix callables are confirmed live before any invocation | `What Refero tools are available through Code Mode?` | 1. `list_tools()` filtered to `refero` -> 2. `tool_info("refero.refero_refero_search_styles")` -> 3. eight-tool comparison -> 4. report | Step 1: refero group (or auth blocker). Step 2: doubled-prefix schema. Step 3: match or escalated drift. Step 4: no unverified claim | Discovery transcript including the `tool_info` output (or the 401/auth evidence) | PASS if discovery preceded any call AND the doubled prefix was confirmed (or the live half SKIPped on the auth blocker) AND no guessed name was invoked. FAIL if a callable was assumed OR drift was ignored | 1. Confirm `list_tools`/`tool_info` ran first. 2. Confirm the doubled-prefix form was used. 3. Confirm any eight-tool mismatch was escalated, not papered over. |

### Optional Supplemental Checks

If the single-prefix form (`refero.refero_search_styles`) appears anywhere in the transcript as an attempted call, the scenario FAILs even if a later doubled-prefix call succeeded: the contract is confirm-then-call, not trial-and-error.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/feature_catalog.md` | The eight-tool inventory the discovery is compared against |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/mcp-wiring.md` | The doubled-prefix rule, the preserved conflict, and the discovery-first contract |
| `../../references/tool-surface.md` | The eight documented tools discovery must match |

---

## 5. SOURCE METADATA

- Group: Wiring and Discovery
- Playbook ID: DISCOVER-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `discovery-setup/discovery-first.md`
