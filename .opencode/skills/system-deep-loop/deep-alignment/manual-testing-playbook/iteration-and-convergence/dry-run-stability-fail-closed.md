---
title: "DAL-022 -- Dry-run stability window fails closed on a fresh run"
description: "Verify computeDryRunStability fails closed to 'not stable' when fewer than window iterations are recorded, so a fresh run can never converge on its first iteration by construction."
version: 1.0.0.0
---

# DAL-022 -- Dry-run stability window fails closed on a fresh run

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-022`.

---

## 1. OVERVIEW

This scenario validates the dry-run stability fail-closed behavior for `DAL-022`. The objective is to verify that `computeDryRunStability` returns `{stable:false, reason:'fewer than N iterations recorded'}` when fewer than `window` (default 2) iterations exist, that the last `window` iterations must all report `newFindingsRatio === 0` to be stable, and that a single non-zero or unrecognized `newFindingsRatio` in the window keeps the run unstable — so a fresh run cannot converge on iteration 1 by construction.

### WHY THIS MATTERS

Failing closed on a too-short window prevents a run from declaring "stable" simply because it has not yet gathered enough evidence to know otherwise. Combined with the coverage AND-gate (DAL-020), this guarantees a first iteration is never mistaken for a converged state.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify stability fails closed with fewer than N recorded iterations, and a fresh run cannot converge on iteration 1.
- Real user request: Can the audit declare itself done after a single pass?
- Prompt: `Validate that deep-alignment's dry-run stability window fails closed: with fewer than N recorded iterations, stability is false and a fresh run cannot converge on iteration 1.`
- Expected execution process: Call `computeDryRunStability` directly with zero and one iteration record (expect not-stable, "fewer than N" reason), then with two zero-ratio records (expect stable), then with a mixed window (expect not-stable).
- Desired user-facing outcome: The user is told the run needs at least a full stability window of consecutive zero-finding iterations before it can be considered stable, so a first pass never counts as done.
- Expected signals: `computeDryRunStability(records, window)` returns `{stable:false, reason:'fewer than N iterations recorded'}` when `records.length < window`; the last-`window` iterations must all report `newFindingsRatio === 0` to be stable; a single non-zero (or unrecognized) `newFindingsRatio` in the window keeps it unstable.
- Pass/fail posture: PASS if a short window is not stable, a full zero window is stable, and a mixed window is not stable. FAIL if a fresh/short window ever reports stable.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the source contract is confirmed before the direct-call cases.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate that deep-alignment's dry-run stability window fails closed: with fewer than N recorded iterations, stability is false and a fresh run cannot converge on iteration 1.
### Commands
1. `bash: rg -n 'computeDryRunStability|fewer than|fail-closed|allZero|newFindingsRatio === 0' .opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs`
2. `bash: node -e "const {computeDryRunStability}=require('./.opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs'); const z={newFindingsRatio:0}, o={newFindingsRatio:1}; console.log('empty:', JSON.stringify(computeDryRunStability([],2))); console.log('one-zero:', JSON.stringify(computeDryRunStability([z],2))); console.log('two-zero:', JSON.stringify(computeDryRunStability([z,z],2))); console.log('mixed:', JSON.stringify(computeDryRunStability([o,z],2)));"`
### Expected
`empty` and `one-zero` both return `stable:false` with reason "fewer than 2 iterations recorded". `two-zero` returns `stable:true`. `mixed` (last two are one new-finding + one zero) returns `stable:false` because not all in the window are zero. This proves a fresh run cannot converge before a full stable window.
### Evidence
Capture the four `computeDryRunStability` results and the source lines proving the `records.length < window` fail-closed branch and the `allZero` requirement.
### Pass/Fail
PASS if a short window is not stable, a full zero window is stable, and a mixed window is not stable. FAIL if a fresh/short window ever reports stable.
### Failure Triage
If `empty` or `one-zero` returns `stable:true`, the fail-closed short-window guard is missing (the finding). If `mixed` returns stable, the `allZero`-over-the-window requirement is broken.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `iteration-and-convergence/` | Convergence category; `computeDryRunStability` is exercised directly here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs` | `computeDryRunStability` fail-closed short-window guard and `allZero` requirement |
| `.opencode/skills/system-deep-loop/deep-alignment/references/state-machine-wiring.md` | §4 dry-run stability definition ("fresh run can never converge on its first iteration") |

---

## 5. SOURCE METADATA

- Group: ITERATION AND CONVERGENCE
- Playbook ID: DAL-022
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `iteration-and-convergence/dry-run-stability-fail-closed.md`
