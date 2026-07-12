---
title: "GATE-001 -- Mandatory sk-design Precondition"
description: "This scenario validates the hard sk-design precondition for `GATE-001`. It focuses on confirming a design generation RUN, and a design-feeding READ, are blocked when sk-design is not loaded, that the work proceeds once it is loaded and ground -> token-system -> critique is applied, and that pure transport is exempt."
version: 1.4.0.2
---

# GATE-001 -- Mandatory sk-design Precondition

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GATE-001`.

---

## 1. OVERVIEW

This scenario validates that `sk-design` is a hard precondition for any Open Design design work, not an optional or on-demand add-on. It focuses on three controls: a NEGATIVE control proving a design generation RUN, and a design-feeding READ, are refused or blocked when `sk-design` is not loaded; a POSITIVE control proving that once `sk-design` is loaded and its ground -> token-system -> critique has been applied, the design work proceeds; and an EXEMPTION control proving that pure transport (wiring the MCP server, a bare inventory listing that feeds no design decision) succeeds without `sk-design`.

### Why This Matters

The transport half of the skill is powerful, but Open Design generates without taste of its own. If a design RUN or a design-feeding READ proceeds without `sk-design`, the agent ships templated AI defaults under the appearance of a real design system, which is the failure the pairing exists to prevent. The heart of this scenario is the NEGATIVE control: a design step attempted without `sk-design` loaded must be refused or blocked, not merely run unconfirmed and not silently allowed. The second risk this scenario guards is over-blocking: pure transport (wiring, a bare `list_projects` inventory that feeds no design decision) makes no design decision and must NOT be gated, so the exemption stays usable.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `GATE-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm a design generation RUN and a design-feeding READ are blocked without `sk-design` loaded, that the work proceeds once it is loaded and ground -> token-system -> critique is applied, and that pure transport is exempt
- Real user request: `Generate a landing page in Open Design grounded in one of its design systems.`
- Prompt: `Ground a design in an Open Design system and commission a run for it.`
- Expected execution process: attempt a design RUN and a design-feeding READ with `sk-design` NOT loaded and confirm both are refused/blocked; load `sk-design` and run ground -> token-system -> critique, then confirm the same design work proceeds; separately run pure transport (`od mcp install` wiring, a bare `list_projects` that feeds no design decision) and confirm it succeeds with no `sk-design` requirement
- Expected signals: the unloaded design RUN is blocked before any `start_run` fires, the unloaded design-feeding READ is blocked before it is treated as grounding, the loaded path runs ground -> token-system -> critique and then proceeds to the brief/form, and the pure-transport calls (`od mcp install`, bare `list_projects`) complete without requiring `sk-design`
- Desired user-visible outcome: the agent shows it refused the design step that lacked `sk-design`, that the same step succeeded only after the design skill was loaded and applied, and that pure transport ran unblocked
- Pass/fail: PASS if BOTH the design RUN and the design-feeding READ were blocked without `sk-design` AND the work proceeded after it was loaded and ground -> token-system -> critique was applied AND pure transport ran without it. FAIL if any design RUN or design-feeding READ proceeded with `sk-design` unloaded, OR a pure-transport call was wrongly gated behind `sk-design`, OR the unloaded design step was merely left unconfirmed rather than refused/blocked

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. The design-gate checks stay local.
3. Execute the deterministic steps exactly as written, including both the negative and the exemption controls.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: The desktop app is open so the daemon socket exists. Start the negative control with `sk-design` confirmed NOT loaded.

1. NEGATIVE CONTROL (RUN): attempt a design generation run with `sk-design` NOT loaded  # -> blocked before turn 1; no `start_run` fires
2. NEGATIVE CONTROL (READ): attempt to treat an Open Design system read as grounding with `sk-design` NOT loaded  # -> blocked; the read is not accepted as a design decision input
3. load `sk-design` and run ground -> token-system -> critique on the subject  # -> design judgment established
4. POSITIVE CONTROL: re-attempt the grounded design work now that `sk-design` is loaded and applied  # -> proceeds; the brief and discovery-form answers are shaped by the design skill
5. EXEMPTION (wiring): `node "$OD_BIN" mcp install opencode --print --json`  # -> pure transport, succeeds with no `sk-design` requirement
6. EXEMPTION (bare inventory): `open-design.list_projects({})` (a listing that feeds no design decision)  # -> pure transport, succeeds with no `sk-design` requirement

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| GATE-001 | Mandatory sk-design precondition | Verify a design RUN and a design-feeding READ are blocked without `sk-design`, the work proceeds once it is loaded and applied, and pure transport is exempt | `Ground a design in an Open Design system and commission a run for it.` | 1. NEGATIVE CONTROL (RUN) unloaded -> 2. NEGATIVE CONTROL (READ) unloaded -> 3. load `sk-design`, run ground -> token-system -> critique -> 4. POSITIVE CONTROL: grounded work proceeds -> 5. EXEMPTION `od mcp install --print --json` -> 6. EXEMPTION bare `list_projects` | Step 1: design run blocked before `start_run`. Step 2: design-feeding read blocked. Step 3: ground -> token-system -> critique runs. Step 4: brief/form proceed under the design skill. Steps 5-6: pure transport succeeds with no `sk-design` requirement | Transcript of the two refused unloaded design steps, the loaded ground -> token-system -> critique, the proceeding grounded work, and the two unblocked pure-transport calls | PASS if both unloaded design steps were blocked AND the work proceeded after `sk-design` was loaded and applied AND pure transport ran without it. FAIL if any unloaded design step proceeded, OR pure transport was wrongly gated, OR the unloaded design step was only left unconfirmed rather than refused/blocked | 1. Confirm the design RUN was blocked before any `start_run` fired, not merely left unconfirmed. 2. Confirm the design-feeding READ was refused as grounding, not accepted. 3. Confirm the exemption calls (`od mcp install`, bare `list_projects`) were NOT gated behind `sk-design`. |

### Optional Supplemental Checks

Confirm the block is a refusal and not a silent skip: the unloaded design RUN must produce an explicit "load `sk-design` first" stop, not a turn-1 form. Separately, confirm a `list_projects` that DOES feed a design decision (resolving which system to ground in) is treated as a design-feeding READ and gated, while the same call used only as bare inventory is exempt — the boundary is whether the read feeds a design decision, not the tool name.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/grounding/design_system_grounding.md` | Feature-catalog source describing the mandatory precondition |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/design_parity_transport.md` | The Open Design transport for the real-UI loop, applied with `sk-design`'s judgment |
| `../../../design-interface/references/design_process/real_ui_loop.md` | The real-UI loop and the design judgment the gate enforces |

---

## 5. SOURCE METADATA

- Group: Design Gate
- Playbook ID: GATE-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `design-gate/mandatory-design-gate.md`
