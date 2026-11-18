---
title: "DRV-076 -- Expansive depth flag and default byte identity"
description: "This scenario validates that `--depth-mode` defaults to `default`, that a review run without the flag matches the pre-change baseline on every compared artifact and that only the expansive-only agent paragraph differs on CLI lineage prompts, for `DRV-076`."
version: 1.13.4.0
---

# DRV-076 -- Expansive depth flag and default byte identity

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-076`.

---

## 1. OVERVIEW

This scenario validates the `--depth-mode` flag on `/deep:review` and its default. The objective is to confirm that a review run without the flag, or with `--depth-mode=default`, produces the same registry, dashboard, Next Focus, prompt pack, pivot seeds, lineage prompt and stop config as the loop produced before the expansive mode existed.

### Why This Matters

The expansive mode must stay opt-in. An operator who never passes the flag should see no change in what the review writes or decides. That promise lets the mode ship without a migration of existing review runs.

An operator who does pass `--depth-mode=expansive` should know its budget rule. Admission caps the live frontier at half of `maxIterations`, and the seed counts toward that cap. When `--max-iterations` is left at its default, the run sizes its budget from the seed, `min(24, max(7, 2 × D × (S + maxDepth − 1)))` iterations for S seeded depth-1 nodes and D configured dimensions, or 7 when every seed was pruned, and the seed step prints the derived budget. An explicit `--max-iterations` always wins, even below the derived value, and the seed warns when it leaves no room past depth 1.

---

## 2. SCENARIO CONTRACT

Operators run the commands below and confirm that the flag documents `default` as its value when absent and that the golden byte-identity suite passes.

- Objective: Confirm that `--depth-mode` defaults to `default`, that `--depth-mode=expansive` is the only opt-in value and that a default review run matches the pre-change baseline on every compared artifact.
- Real user request: Run a deep review without any new flag and tell me whether anything changed for me.
- Prompt: `Check that --depth-mode defaults to default and that a review run without the flag matches the pre-change baseline byte for byte, except for the expansive-only agent paragraph. Name any byte that differs. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Read the flag row and the config default, read the golden helper that removes one paragraph, then run the golden suite by file stem.
- Expected signals: The flag row lists `default` as the value when the flag is absent. The config carries `"depthMode": "default"` under `antiConvergence`. The golden suite passes 14 of 14 cases, seven artifacts for each of two variants: the absent key and an explicit `default`. The only text the comparison removes is the expansive-only paragraph of the review persona in the CLI lineage prompt.
- Desired user-visible outcome: The operator can say a default review run matches the baseline byte for byte, except for one expansive-only paragraph in the embedded agent persona of CLI lineage prompts. That paragraph is waived pending operator ratification, and the comparison strips it.
- Pass/fail: PASS if the flag row and the config default both name `default`, the golden suite passes with no failed count and the helper removes only the persona paragraph; FAIL if any other byte differs or any golden case fails.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that --depth-mode defaults to default and that a review run without the flag matches the pre-change baseline byte for byte, except for the expansive-only agent paragraph. Name any byte that differs. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `rg -n -- '--depth-mode' .skilled/commands/deep/review.md`
2. `rg -n '"depthMode"' .skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json`
3. `rg -n --glob 'review-depth-mode-golden.vitest.ts' 'withoutExpansiveOnlyPersona' .skilled/skills/system-deep-loop/runtime`
4. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run review-depth-mode-golden.vitest`

### Expected

Command 1 prints two lines: the preflight `depth_mode` binding note and the flag row. The row's value column reads `default`, the value when the flag is absent. Command 2 prints `"depthMode": "default"`. Command 3 prints three lines: a header comment that points at the helper, the helper definition, and its one call, which applies to the CLI lineage prompt. Command 4 prints `Tests  14 passed (14)` with no failed count. The seven compared artifacts are `registry.json`, `dashboard.md`, `next-focus.txt`, `prompt-pack.md`, `pivot-seeds.json`, `lineage-prompt.txt` and `stop-decision-config.json`, and each matches its baseline.

### Evidence

- The flag row from command 1 and the config line from command 2.
- The `rg` lines from command 3, and the vitest summary line and exit status from command 4.

### Pass / Fail

- **Pass**: The flag row names `default` as the value when the flag is absent, the config carries `"depthMode": "default"` and the golden suite passes with no failed count.
- **Fail**: The flag row or the config names a different default, a golden case fails, or the helper removes anything other than the expansive-only persona paragraph.

### Failure Triage

1. A golden case fails on an artifact other than the lineage prompt: a default path changed. Check the reducer output, the stop-decision config echo and the prompt pack in that order, and find the first byte that differs.
2. The flag row names a different default: check the review command flag table and the `depthMode` value under `antiConvergence` in the config.
3. The helper removes more than the persona paragraph: its pattern no longer matches only that paragraph, so restore the narrow pattern before trusting the verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/commands/deep/review.md` | Flag table row for `--depth-mode` |
| `.skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json` | `antiConvergence.depthMode` with the default `default` |
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Echoes `depthMode` into the stop config only for an expansive run |
| `review-depth-mode-golden.vitest` | Byte identity for the absent key and for an explicit `default` |
| `stop-decision-yaml-contract.vitest` | The `depth_mode` binding beside `convergence_mode` |

---

## 5. SOURCE METADATA

- Group: ENTRY POINTS AND MODES
- Playbook ID: DRV-076
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `entry-points-and-modes/expansive-depth-flag-and-default-identity.md`
