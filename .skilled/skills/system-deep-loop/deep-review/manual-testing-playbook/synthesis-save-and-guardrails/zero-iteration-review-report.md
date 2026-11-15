---
title: "DRV-069 -- Zero-iteration review report"
description: "Verify that a review which stops before its first iteration reports that it did not run, keeps the derived FAIL verdict, sets triggered false and reviewDidNotRun true, and names a /deep:review rerun."
version: 1.11.1.0
---

# DRV-069 -- Zero-iteration review report

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-069`.

---

## 1. OVERVIEW

This scenario validates the zero-iteration review report for `DRV-069`. The objective is to verify that a review which stops before its first dispatch reports that it did not run, keeps the verdict the verdict script derived, and sends the operator back to `/deep:review` instead of `/speckit:plan`.

### WHY THIS MATTERS

A state log with no iteration line holds no findings, so a report written straight from it can read like a clean review. The zero-iteration branch keeps the FAIL verdict the failed coverage gate produced and marks the packet not triggered, so the operator sees an unexamined target rather than a passing one. It also names the rerun, because the correction is a larger duration budget or a higher iteration cap and not planning against a review that never looked at the code.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify a zero-iteration report states "Review did not run", names the stop reason and 0 iterations dispatched, keeps the derived FAIL verdict, says the counts mean not examined, sets `triggered: false` and `reviewDidNotRun: true` with empty workstreams, and names `/deep:review` as the next step.
- Real user request: The review stopped before it examined anything. What does the report say about the run and what do I run next?
- Prompt: `Validate the deep-review report for a run that stopped before its first iteration.`
- Expected execution process: Reproduce a stop that fires before the first dispatch, confirm the state log holds no line with type `iteration`, run the terminal gate and verdict scripts on that state, then read the report's Executive Summary and Planning Packet.
- Desired user-facing outcome: The user understands that the review did not run, treats the FAIL verdict as the script's own output, and reruns `/deep:review` with a larger duration budget or iteration cap before anything is planned.
- Expected signals: The report opens with "Review did not run", states the stop reason and 0 iterations dispatched, keeps the FAIL verdict the verdict script printed, says the counts mean not examined, sets `triggered: false` and `reviewDidNotRun: true` with empty remediation workstreams, and names `/deep:review` with a larger duration budget or iteration cap as the next step.
- Pass/fail posture: PASS if every one of those signals holds. FAIL if the report asks for `/speckit:plan`, lists remediation workstreams, or shows a verdict the verdict script did not print.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Reproduce the stop: on a small target, set `maxDurationMinutes` to `1` in the packet config and run `/deep:review:auto` so the duration check fires before the first dispatch and the loop reaches synthesis with stop reason `maxDurationReached`. Any setup where the duration check fires first reproduces the same state.
3. Confirm the state log holds no line with type `iteration`, then run the gate and verdict scripts on that state.
4. Read the report's Executive Summary and Planning Packet, then capture the config line, the state log count, both script outputs, and the report sections as evidence.

### Prompt

Validate the deep-review report for a run that stopped before its first iteration.

### Commands

1. `bash: rg -n '"maxDurationMinutes"' .skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json`
2. `bash: rg -n 'maxDurationReached' .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md`
3. `bash: rg -c '"type":"iteration"' {artifact_dir}/deep-review-state.jsonl`
4. `bash: node .skilled/skills/system-deep-loop/runtime/scripts/terminal-gates.cjs --config-path {artifact_dir}/deep-review-config.json --state-log {artifact_dir}/deep-review-state.jsonl --registry-path {artifact_dir}/deep-review-findings-registry.json`
5. `bash: node .skilled/skills/system-deep-loop/runtime/scripts/review-verdict.cjs --registry-path {artifact_dir}/deep-review-findings-registry.json --state-log {artifact_dir}/deep-review-state.jsonl`
6. `bash: rg -n 'Review did not run|reviewDidNotRun|triggered|iterations|not examined|deep:review|speckit:plan' {artifact_dir}/review-report.md`

### Expected

The state log count comes back as 0 with `rg` exiting 1 on no match. The gate script reports the `coverage` row as `fail` and lists `coverage` in `failed_required_gate_ids`. The verdict script prints `FAIL`. The report opens with "Review did not run", repeats the stop reason and the 0 iterations dispatched, keeps that FAIL verdict, says the counts mean not examined, carries `triggered: false` and `reviewDidNotRun: true` with empty remediation workstreams, and names `/deep:review` as the next step.

### Evidence

Capture the config line carrying `maxDurationMinutes`, the empty iteration count from the state log, the gate script output, the verdict script output, and the report's Executive Summary plus Planning Packet.

### Pass/Fail

PASS if every expected signal holds. FAIL on any of these signals: the report asks for `/speckit:plan`, the report lists remediation workstreams, the report shows a verdict the verdict script did not print, the report omits the stop reason or the 0 iterations dispatched, or the Planning Packet carries `triggered: true`.

### Failure Triage

Read the verdict script output first, because the report repeats that verdict rather than deriving a new one. If the gate output is missing, run the gate script before touching the report. If the Planning Packet is triggered, check whether the report read an empty registry as evidence of a clean review.

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `feature-catalog/feature-catalog.md` | Synthesis entry for report compilation, the entry this scenario extends |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.skilled/commands/deep/assets/deep-review.yaml` | Report compilation step, verdict step, and the Planning Packet field list |
| `.skilled/skills/system-deep-loop/runtime/scripts/review-verdict.cjs` | Verdict derivation from active counts and failed gate ids |
| `.skilled/skills/system-deep-loop/runtime/scripts/terminal-gates.cjs` | Coverage gate row and the failed gate id list |
| `.skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json` | `maxDurationMinutes` limit used to reproduce the stop |
| `.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md` | `maxDurationReached` stop reason |
| `.skilled/skills/system-deep-loop/deep-review/SKILL.md` | Duration check that skips the dispatch and goes to synthesis |

---

## 5. SOURCE METADATA

- Group: SYNTHESIS, SAVE, AND GUARDRAILS
- Playbook ID: DRV-069
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `synthesis-save-and-guardrails/zero-iteration-review-report.md`
- Feature catalog status: `feature-catalog/` exists under `.skilled/skills/system-deep-loop/deep-review/`. This scenario cites the Synthesis entry for report compilation.
