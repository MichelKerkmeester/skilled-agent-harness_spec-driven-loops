---
title: "DR-068 -- Expansive depth flag and default byte identity"
description: "This scenario validates that --depth-mode defaults to default, that a default run matches the pre-change baseline byte for byte and that only the expansive-only agent paragraph differs on CLI lineage prompts, for `DR-068`."
version: 1.16.1.0
---

# DR-068 -- Expansive depth flag and default byte identity

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-068`.

---

## 1. OVERVIEW

This scenario validates the `--depth-mode` flag and its default. The objective is to confirm that a research run without the flag, or with `--depth-mode=default`, produces the same registry, dashboard, Next Focus, prompt pack and stop config as the loop produced before the expansive mode existed.

### Why This Matters

The expansive mode must stay opt-in. An operator who never passes the flag should see no change in what the loop writes or decides. That promise lets the mode ship without a migration.

---

## 2. SCENARIO CONTRACT

Operators run the exact commands below and confirm that the flag documents `default` as its value when absent and that the golden byte-identity suite passes.

- Objective: Confirm that `--depth-mode` defaults to `default`, that `--depth-mode=expansive` is the only opt-in value and that a default run matches the pre-change baseline on every compared artifact.
- Real user request: Run a deep research session without any new flag and tell me whether anything changed for me.
- Prompt: `Check that --depth-mode defaults to default and that a research run without the flag matches the pre-change baseline byte for byte. Name any byte that differs. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Read the flag row and the config default, read the golden helper that removes one paragraph, then run the golden suite by file stem.
- Expected signals: The flag row lists `default` as the value when the flag is absent. The config carries `"depthMode": "default"`. The golden suite passes 12 of 12 tests. The only paragraph the comparison removes is the expansive-only persona paragraph in the CLI lineage prompt.
- Desired user-visible outcome: The operator can say a default run matches the baseline byte for byte, except for one expansive-only paragraph in the embedded agent persona of CLI lineage prompts. That exception is a waiver pending operator ratification.
- Pass/fail: PASS if the flag row and the config default both name `default`, the golden suite passes and the helper removes only the persona paragraph; FAIL if any other byte differs or any golden case fails.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that --depth-mode defaults to default and that a research run without the flag matches the pre-change baseline byte for byte. Name any byte that differs. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `rg -n -- '--depth-mode' .skilled/commands/deep/research.md`
2. `rg -n '"depthMode"' .skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json`
3. `rg -n --glob 'research-depth-mode-golden.vitest.ts' 'withoutExpansiveOnlyPersona' .skilled/skills/system-deep-loop/runtime/tests`
4. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run research-depth-mode-golden.vitest`

### Expected

Command 1 prints two lines: the preflight `depth_mode` binding note and the flag row. Its value column reads `default`, the value when the flag is absent. Command 2 prints `"depthMode": "default"`. Command 3 prints three lines: a header comment that points at the helper, the helper definition, and its one call, which applies to the CLI lineage prompt. Command 4 prints `Tests  12 passed (12)` with no failed count. The six compared artifacts are the registry, the dashboard, Next Focus, the prompt pack, the lineage prompt and the stop-decision config, and each matches its baseline.

### Evidence

- The flag row from command 1 and the config line from command 2.
- The `rg` lines from command 3 and the vitest summary line and exit status from command 4.

### Pass / Fail

- **Pass**: The flag row names `default` as the value when the flag is absent, the config carries `"depthMode": "default"` and the golden suite passes with no failed count.
- **Fail**: The flag row or the config names a different default, a golden case fails, or the helper removes anything other than the expansive-only persona paragraph.

### Failure Triage

- A golden case fails on an artifact other than the lineage prompt: a default path changed. Check the reducer, the stop-decision config echo and the prompt pack in that order, and find the first byte that differs.
- The flag row names a different default: check the research command flag table and the `depthMode` value in the config.
- The helper removes more than the persona paragraph: its pattern no longer matches only that paragraph, so restore the narrow pattern before trusting the verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/commands/deep/research.md` | Flag table row for `--depth-mode` |
| `.skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json` | `antiConvergence.depthMode` with the default `default` |
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Echoes `depthMode` into the stop config only for an expansive run |
| `research-depth-mode-golden.vitest` | Byte identity for the absent key and for an explicit `default` |
| `stop-decision-yaml-contract.vitest` | The `depth_mode` binding beside `convergence_mode` |

---

## 5. SOURCE METADATA

- Group: ENTRY POINTS AND MODES
- Playbook ID: DR-068
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `entry-points-and-modes/expansive-depth-flag-and-default-identity.md`
- Feature catalog status: `feature-catalog/convergence/expansive-depth-mode.md` covers the expansive depth mode.
