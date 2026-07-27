---
title: "DV-002 -- Devin availability probe"
description: "Verify the fail-closed availability preflight checks the Devin binary before constructing a dispatch."
version: 1.0.0.0
---

# DV-002 -- Devin availability probe

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-002`.

## 1. OVERVIEW

Verify the binary and version probes that precede every routed dispatch. The probe itself is read-only and does not require a model turn.

### Why This Matters

The skill contract requires `command -v devin` before dispatch and must refuse the route when the binary is absent instead of fabricating a command.

## 2. SCENARIO CONTRACT

- Objective: Confirm the installed binary is discoverable and reports a version before a route is considered available.
- Real user request: `Can you check whether Devin is installed before sending anything to it?`
- Prompt: `Do not perform a coding task. Report the installed Devin CLI version and whether the binary is available.`
- Expected execution process: Run `command -v devin`, then `devin --version`; only after both succeed run the bounded print prompt.
- Expected signals: Non-empty path, version output, and a print response only after the preflight succeeds.
- Desired user-visible outcome: An explicit availability result with no blind dispatch.
- Pass/fail: PASS when the ordered preflight is recorded and the binary is available; FAIL if a dispatch is constructed before the probe; SKIP if `devin` is not installed.

## 3. TEST EXECUTION

1. `command -v devin`
2. `devin --version`
3. `devin -p "Do not edit files. Reply with the single word AVAILABLE." --model adaptive --permission-mode normal </dev/null > /tmp/cli-devin-dv002.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv002.txt`
4. Record the path, version, output, and exit code.

| Feature ID | Exact command | Expected signal | Verdict |
|---|---|---|---|
| DV-002 | `command -v devin -> devin --version -> devin -p ...` | Ordered preflight, version, bounded response | PASS/FAIL/SKIP |

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Global availability and fail-closed policy |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | `devin-availability-required` hard rule |
| `../../../../system-deep-loop/runtime/scripts/fanout-run.cjs` | Shared execution authority referenced by the skill |

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: DV-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-invocation/availability-probe.md`
