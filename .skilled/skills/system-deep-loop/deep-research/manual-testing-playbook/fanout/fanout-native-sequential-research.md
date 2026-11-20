---
title: "Fan-out native lineage refusal"
description: "Validate that a research fan-out whose lineage kind is `native` is refused before any lineage spawns, with a message containing `native fan-out lineages are not supported`, and that the same run with two `cli-*` executors is accepted."
version: 1.14.2.0
---

# DR-053 -- Fan-out native lineage refusal

This document captures the validation contract, execution flow, and metadata for `DR-053`.

---

## 1. OVERVIEW

Validates the native lineage guard in the research fan-out: `fanout-run.cjs` refuses a
fan-out config that holds a `native` lineage before any lineage directory or subprocess
exists. `native` remains the single, in-session executor and is never a fan-out kind.

### Why This Matters

A native lineage used to run the whole loop as `opencode run --command deep/research`.
OpenCode 2 `run` has no `--command` and does not expand a slash message, so that adapter
has no supported host. Without the guard, a native lineage would either fail mid-run after
other lineages had already spawned, or silently skip packet init, synthesis, and save.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a research fan-out config holding a `native` lineage is refused with the `native fan-out lineages are not supported` message and spawns nothing, and that the same run with two `cli-*` executors is accepted.
- Real user request: `Validate native fan-out refusal for deep-research: confirm fanout-run.cjs refuses a native lineage before any spawn, and accepts the same run with two cli-* executors.`
- Expected signals: `NATIVE_LINEAGE_REFUSAL` in `fanout-run.cjs` reads `native fan-out lineages are not supported`; the guard runs on `expandLineages` output before the pool starts; the refusal names the offending lineage labels; exit code is 3 (`INPUT_VALIDATION`); no `lineages/{label}/` directory is created; the same config with two `cli-*` kinds reaches the pool.
- Pass/fail: PASS if the native config is refused with that message, exits 3, and creates no lineage directory, and the two-`cli-*` config is accepted. FAIL if a native lineage spawns, if the message is absent, or if the two-`cli-*` config is also refused.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep-research.yaml` present.

### Prompt

- Prompt: `Validate native fan-out refusal for deep-research: confirm fanout-run.cjs refuses a native lineage before any spawn, and accepts the same run with two cli-* executors.`

### Commands

1. `bash: grep -n "NATIVE_LINEAGE_REFUSAL" -A 6 .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`: confirm the message text and the `native` branch in `buildLineageCommand`.
2. `bash: grep -n "nativeLineages" -A 5 .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`: confirm the guard runs on `expandLineages` output before the pool starts and names the lineage labels.
3. `bash: cd .skilled/skills/system-deep-loop/runtime && npx vitest run fanout-run.vitest.ts -t "refuses to build a command for a native lineage" --reporter=verbose`: confirm the per-lineage builder guard refuses a `native` kind.
4. `bash: cd .skilled/skills/system-deep-loop/runtime && npx vitest run fanout-run.vitest.ts -t "names the lineage when the fan-out config holds a native lineage" --reporter=verbose`: confirm the pre-spawn refusal: exit 3, message contains `fan-out refused for lineage(s) native-a: native fan-out lineages are not supported`, and `lineages/opencode-a` does not exist.
5. `bash: cd .skilled/skills/system-deep-loop/runtime && npx vitest run fanout-run.vitest.ts -t "two-lineage" --reporter=verbose`: confirm the same shape with two `cli-*` executors is accepted and runs.
6. `bash: grep -n "native fan-out lineage is refused" .skilled/commands/deep/assets/deep-research.yaml`: confirm the workflow instructions state the refusal and the `cli-*` requirement.

### RECOMMENDED ORCHESTRATION PROCESS

1. Read the refusal constant first, so the message you assert on is the shipped one.
2. Confirm the guard sits before the pool start, not inside the per-lineage command builder alone.
3. Run the refusal test, then the two-lineage acceptance test, so a guard that refuses everything is caught.

### Expected Outcome

Source inspection confirms the refusal constant and the pre-spawn guard. The refusal test passes with exit 3, the expected message, and no lineage directory. The two-lineage `cli-*` test passes, so the guard is specific to `native`.

### Evidence

- Grep output from steps 1 and 2, saved to `/tmp/dr-053-grep.txt`, showing `NATIVE_LINEAGE_REFUSAL` and the pre-spawn guard.
- Vitest verbose output from steps 3 to 5, saved to `/tmp/dr-053-vitest.txt`, showing both refusal tests and the two-lineage acceptance test passing.

### Failure Triage

- Native lineage spawns: the guard is missing or runs after the pool start, so other lineages have already written into the shared artifact dir.
- Message absent or reworded: operators cannot match the refusal to the documented remedy.
- Two-`cli-*` config also refused: the guard is matching on the wrong field, and every fan-out is blocked.
- Exit code other than 3: the refusal is not classified as `INPUT_VALIDATION`, so callers cannot distinguish it from a lineage failure.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | `NATIVE_LINEAGE_REFUSAL`, the pre-spawn native guard, and the `native` branch in `buildLineageCommand` |
| `.skilled/commands/deep/assets/deep-research.yaml` | `step_fanout_spawn` instructions stating the refusal and the `cli-*` requirement |

### Validation

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Native lineage refusal test and two-lineage acceptance test |

---

## 5. SOURCE METADATA

- Group: Fan-Out
- Canonical root source: `manual-testing-playbook/manual-testing-playbook.md`
- Scenario file path: `manual-testing-playbook/fanout/fanout-native-sequential-research.md`
- Expected verdict mode: GREEN when the native config is refused with the expected message and the two-`cli-*` config is accepted
- Wall-time estimate: 5-10 min
