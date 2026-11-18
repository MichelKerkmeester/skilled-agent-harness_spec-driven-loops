---
title: "DRV-074 -- Configured custom dimension joins the review dimension set"
description: "This scenario validates that a custom review dimension named at setup joins the dimension set for `DRV-074`. It focuses on the normalized name list, the canonical-first order and the review prompt line."
version: 1.0.1.0
---

# DRV-074 -- Configured custom dimension joins the review dimension set

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-074`.

---

## 1. OVERVIEW

This scenario validates how a custom review dimension enters a review run at setup for `DRV-074`. It focuses on three steps: the setup rule normalizes the configured names, the dimension universe lists the four canonical dimensions first and each custom name after them, and the review prompt names every configured dimension in that order.

### Why This Matters

A review that names only the four canonical dimensions cannot check a property such as performance. A custom name that the setup rule rejects, drops, or places in the wrong order would leave the run checking a different set of dimensions than the operator asked for, and the review prompt would not tell the reviewer about the extra dimension.

---

## 2. SCENARIO CONTRACT

Operators run this as a setup check. They read the rule that accepts the custom name, the universe that the reducer builds from it and the prompt line that the reviewer receives. No live review iteration is needed.

- Objective: Confirm that a custom dimension named at setup is accepted, normalized, ordered after the canonical four, and listed in the review prompt.
- Real user request: I want the review to check performance as well as correctness. Make sure performance is included and that the reviewer is told about it.
- Prompt: `Start a deep review with review_dimensions: correctness,performance and confirm that performance is accepted as a custom dimension, ordered after the four canonical dimensions, and listed in the review prompt.`
- Expected execution process: Read the review_dimensions input text and the normalize rule in the deep-review workflow, then read the dimension universe builder in the reducer, then run the reducer and prompt-pack cases that name a custom dimension.
- Expected signals: The workflow input names custom names as allowed, and the normalize rule trims, lowercases and drops duplicates, and fails an empty name. The universe builder returns the four canonical names followed by each configured custom name. The prompt-pack case renders the dimension line as `correctness, security, traceability, maintainability, performance`.
- Desired user-visible outcome: The operator is told that performance is checked after the four canonical dimensions, and that the reviewer receives it in the prompt.
- Pass/fail: PASS if the setup rule accepts `performance`, the universe lists it after the four canonical names, and the reducer and prompt-pack cases pass; FAIL if a custom name is rejected or dropped, if it appears before a canonical name, or if the prompt line omits it.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Start a deep review with review_dimensions: correctness,performance and confirm that performance is accepted as a custom dimension, ordered after the four canonical dimensions, and listed in the review prompt.`

### Commands

1. `rg -n "custom dimension" .skilled/commands/deep/assets/deep-review.yaml`
2. `rg -n "function buildDimensionUniverse" .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`
3. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run deep-review-state-reducer.vitest -t "custom dimension"`
4. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run prompt-pack.vitest -t "custom dimension"`

### Expected

Command 1 prints the review_dimensions input line, the risk-order line and the normalize rule among its other custom-dimension lines, each placing custom dimensions after the canonical four. Command 2 prints one line, the `buildDimensionUniverse(config)` definition. Command 3 exits 0 with the cases `tracks and covers a configured custom dimension after the canonical four` and `attributes a finding that names a custom dimension to it, not to the first addressed one` reported as passed, and no failed test. Command 4 exits 0 with `renders a configured custom dimension after the canonical four` reported as passed.

### Evidence

Capture the command 1 matches for the normalize rule, the command 2 definition line, and the names and pass lines that command 3 and command 4 print.

### Pass / Fail

- **Pass**: The setup rule accepts a custom name and normalizes it, the universe builder places it after the four canonical names, and command 3 and command 4 exit 0 with the named cases passing.
- **Fail**: The setup rule rejects or drops the custom name, the universe places it before a canonical name, the prompt line omits it, or a named case fails.

### Failure Triage

If command 1 shows no custom-name wording, the workflow input or normalize rule has drifted, so check the review_dimensions line and the normalize rule in `deep-review.yaml`. If command 3 fails on the universe cases, read `buildDimensionUniverse` and `deriveDimension` in `reduce-state.cjs`, since the canonical names must come first and the configured names follow in order. If command 4 fails, read the `review_dimensions_list` binding in `deep-review.yaml` and the dimension line in `prompt-pack-iteration.md.tmpl`.

### Optional Supplemental Checks

- Canonical-only input: run command 3 and confirm that the case `keeps the canonical keys unchanged for a canonical-subset config` is also reported as passed, since a run that names only the four canonical dimensions must keep the same registry keys.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `feature-catalog/` | `feature-catalog/review-dimensions/custom-review-dimensions.md` covers custom review dimensions; the implementation anchors below are the contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/commands/deep/assets/deep-review.yaml` | The review_dimensions input line, the risk order, the normalize rule and the `review_dimensions_list` binding |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | `buildDimensionUniverse`, the canonical four followed by configured custom names |
| `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl` | The `{review_dimensions_list}` line the reviewer receives |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` | Universe, coverage and finding-attribution cases for a custom dimension |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts` | The custom-list render case and the default-line byte-identity case |

---

## 5. SOURCE METADATA

- Group: INITIALIZATION AND STATE SETUP
- Playbook ID: DRV-074
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `initialization-and-state-setup/custom-dimension-setup-and-universe.md`
