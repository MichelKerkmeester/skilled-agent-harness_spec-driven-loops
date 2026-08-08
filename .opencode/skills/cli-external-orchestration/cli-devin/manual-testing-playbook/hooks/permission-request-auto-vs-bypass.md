---
title: "DV-008 -- PermissionRequest auto versus dangerous"
description: "Document the unavailable headless PermissionRequest comparison under Devin's canonical permission modes."
version: 1.0.0.1
---

# DV-008 -- PermissionRequest auto versus dangerous

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-008`.

## 1. OVERVIEW

Record a documented `SKIP` for the headless `PermissionRequest` comparison between the canonical `auto` and `dangerous` modes. Current headless Devin does not expose a controllable event path for this comparison.

### Why This Matters

An absent event in two headless traces does not prove permission-mode parity. `PreToolUse` remains a separate hook-coverage claim and must not substitute for evidence about `PermissionRequest` delivery.

## 2. SCENARIO CONTRACT

- Objective: Record the unavailable headless `PermissionRequest` comparison without turning missing runtime control into a product failure.
- Real user request: `Check whether headless Devin exposes a controllable PermissionRequest event under auto and dangerous modes.`
- Prompt: `Compare PermissionRequest delivery under Devin's auto and dangerous permission modes only if headless Devin exposes a controllable event trigger; otherwise record the specific runtime blocker.`
- Expected execution process: Inspect the installed CLI's canonical permission modes, confirm that no supported headless control can deterministically trigger `PermissionRequest`, and record the scenario as `SKIP` without running a write probe. Test `PreToolUse` in its dedicated scenario only.
- Expected signals: The CLI exposes canonical `auto` and `dangerous` modes, but no controllable headless `PermissionRequest` event trigger is available.
- Desired user-visible outcome: `SKIP` with the exact blocker, not a false failure or a claim derived from `PreToolUse`.
- Pass/fail: `SKIP` -- blocker: headless Devin exposes no controllable `PermissionRequest` event to compare `auto` versus `dangerous`; the runtime event path is unavailable.

## 3. TEST EXECUTION

### Prompt

- Prompt: `Compare PermissionRequest delivery under Devin's auto and dangerous permission modes only if headless Devin exposes a controllable event trigger; otherwise record the specific runtime blocker.`

### Commands

1. `devin --help 2>&1 | sed -n '/permission-mode/,+4p'`
2. Do not run a write comparison unless the installed headless CLI documents a controllable `PermissionRequest` trigger.

### Expected

The help output identifies the canonical permission-mode surface. It does not provide a controllable headless `PermissionRequest` trigger, so this scenario remains a documented `SKIP`. `PreToolUse` evidence is out of scope here.

### Evidence

Capture the relevant `devin --help` excerpt and the blocker string: `headless Devin exposes no controllable PermissionRequest event to compare auto versus dangerous`.

### Pass / Fail

- **SKIP**: Blocker: the headless `PermissionRequest` event path is unavailable and cannot be controlled for an `auto` versus `dangerous` comparison.
- **PASS**: Available only after Devin exposes and documents a deterministic headless trigger and the comparison is rerun.
- **FAIL**: Available only after such a trigger exists and the observed event delivery contradicts the documented mode behavior.

### Failure Triage

If a future CLI exposes a controllable trigger, update this scenario to exercise that trigger directly. Keep `PreToolUse` validation in its separate scenario and do not infer `PermissionRequest` behavior from it.

| Feature ID | Feature Name | Scenario Name/Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-008 | PermissionRequest auto versus dangerous | Document the unavailable headless comparison | `Compare PermissionRequest delivery under Devin's auto and dangerous permission modes only if headless Devin exposes a controllable event trigger; otherwise record the specific runtime blocker.` | Run `devin --help 2>&1`; do not run a write probe without a controllable trigger. | Canonical modes are visible; no controllable headless event trigger is available. | Help excerpt plus the exact runtime blocker. | `SKIP` -- blocker: headless Devin exposes no controllable `PermissionRequest` event to compare `auto` versus `dangerous`; the event path is unavailable. | Reopen only when the CLI exposes a deterministic trigger; keep `PreToolUse` separate. |

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Permission and isolation policy |
| `../../feature-catalog/hooks/` | No catalog entry currently covers this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Canonical Devin permission modes and hook limitations |
| `../../../../../specs/cli-external-orchestration/029-cli-devin-revival/013-devin-permission-request-handler/implementation-summary.md` | Historical PermissionRequest behavior |
| `../../../../../specs/cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity/implementation-summary.md` | Historical hook-event matrix |

## 5. SOURCE METADATA

- Group: Hooks
- Playbook ID: DV-008
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hooks/permission-request-auto-vs-bypass.md`
