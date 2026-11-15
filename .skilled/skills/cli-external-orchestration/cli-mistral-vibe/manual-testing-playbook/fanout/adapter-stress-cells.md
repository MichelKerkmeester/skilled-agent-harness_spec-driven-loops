---
title: "VIB-FAN-001 -- CLI adapter stress cells"
description: "This scenario validates the cli-mistral-vibe adapter stress cells: the hermetic manifest, command, timeout, stdin, gate and export contracts pass, and the live probe is the one skipped cell."
version: 1.0.0.0
---

# VIB-FAN-001 -- CLI adapter stress cells

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `VIB-FAN-001`.

---

## 1. OVERVIEW

This scenario validates the shared runtime's `cli-mistral-vibe` adapter through its checked-in Vitest stress file. It focuses on the hermetic cells and on the one cell that needs a live probe.

### Why This Matters

The adapter builds the lineage argv, closes stdin, applies the budgets and reads the run's outcome. A regression in any of those turns a lineage into an orphan, a hang or a false success. The cells exercise those paths against shims and fixtures without a provider, so they can run on every review. The live probe is a separate cell with its own switch.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the adapter stress file passes, with the live probe as the only skipped cell.
- Real user request: `Run the Vibe adapter stress cells and tell me how many passed, which one was skipped and why.`
- Prompt: `Run the cli-mistral-vibe adapter stress file from the shared runtime, report the test file and test counts, and name the skipped cell with its reason.`
- Expected execution process: Run the file from the runtime folder -> read the per-cell lines -> read the file and test counts -> read the exit code.
- Expected signals: The run exits `0`. `Test Files 1 passed (1)`. `Tests 22 passed | 1 skipped (23)`. The skipped cell is `live cli-mistral-vibe transport probe (dependency SKIP: live probe disabled: set DEEP_LOOP_CLI_MISTRAL_VIBE_LIVE=1)`. The manifest cell reports exactly fourteen implemented adapter cells.
- Evidence: The command transcript with the per-cell lines, the counts and the exit code.
- Desired user-visible outcome: A clear statement that the hermetic cells pass and that the only skipped cell is the live probe, with its switch named.
- Pass/fail: PASS if the file exits `0` with `22 passed` and the live probe as the only skipped cell. FAIL if any cell fails, if another cell is skipped, or if the file exits non-zero.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the file from the shared runtime folder, with stdin closed.
2. Read the per-cell lines before the counts.
3. Read the file and test counts and the exit code.
4. Confirm the skipped cell is the live probe and that its reason names the switch.

### Commands

```bash
cd .skilled/skills/system-deep-loop/runtime && npx --no-install vitest run --no-coverage tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts </dev/null
```

### Recorded Result

- Verdict: `PASS`.
- Date: 2026-11-14.
- Observed: the command exited `0` with `Test Files 1 passed (1)` and `Tests 22 passed | 1 skipped (23)`.
- Observed: the skipped cell printed `live cli-mistral-vibe transport probe (dependency SKIP: live probe disabled: set DEEP_LOOP_CLI_MISTRAL_VIBE_LIVE=1)`.
- Note: the cell is skipped because the live probe is unavailable until `DEEP_LOOP_CLI_MISTRAL_VIBE_LIVE=1` is set in the environment; the skip is an environment blocker, not a failure.
- Observed: the manifest cell printed `cli-mistral-vibe manifest integrity > binds exactly fourteen implemented adapter cells without forbidden overclaims`.
- Observed: the contract cells covered the shipped argv, a clean export, exit `3` with and without an export, and a partial lineage through the fan-out scheduler.
- Note: a second verbose run reproduced the same `22 passed | 1 skipped` result with the same skipped cell.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-FAN-001 | CLI adapter stress cells | Prove the hermetic cells pass and the live probe is the only skip | `Run the cli-mistral-vibe adapter stress file from the shared runtime, report the test file and test counts, and name the skipped cell with its reason.` | 1. `cd .skilled/skills/system-deep-loop/runtime` -> 2. `npx --no-install vitest run --no-coverage tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts </dev/null` -> 3. read the per-cell lines, counts and exit code | Step 2: exit `0`, `Test Files 1 passed (1)`, 22 passed and 1 skipped of 23, skipped cell is the live probe with `DEEP_LOOP_CLI_MISTRAL_VIBE_LIVE=1` named | The command transcript with the per-cell lines, the counts and the exit code | PASS if the file exits `0` with `22 passed` and only the live probe skipped. FAIL if a cell fails, another cell skips, or the file exits non-zero | 1. Read the failing cell name. 2. Confirm the shim and fixture it uses still exist. 3. Confirm the live probe stays skipped unless you intend to spend a keyed run |

### Failure Triage

1. Read the failing cell name; each one names the adapter path it exercises.
2. For an argv or export cell, compare the built command with the dispatch shape in [SKILL.md](../../SKILL.md).
3. For a timeout, stdin or process-group cell, confirm the shim and the fixture helper still exist.
4. For the manifest cell, confirm the adapter cell list still holds exactly fourteen entries.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Verdict rules and the automated-test boundary |
| [SKILL.md](../../SKILL.md) | The dispatch shape and the deep-loop integration |
| [cli-reference.md](../../references/cli-reference.md) | The argv, the budgets and the exit taxonomy the cells assert |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts` | The stress file this scenario runs |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/shims/vibe-shim.cjs` | The shim the hermetic cells spawn |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-suite.ts` | The shared adapter stress suite |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | The command builder the argv cells exercise |

---

## 5. SOURCE METADATA

- Group: Fan-Out Executor
- Playbook ID: VIB-FAN-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `fanout/adapter-stress-cells.md`
