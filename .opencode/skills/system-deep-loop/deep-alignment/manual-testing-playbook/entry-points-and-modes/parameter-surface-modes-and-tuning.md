---
title: "DAL-002 -- Parameter surface: modes and loop tuning"
description: "Verify the :auto/:confirm mode flags and --max-iterations/--convergence tuning parameters reconcile with the config-template defaults and the runnable check-convergence.cjs flags."
version: 1.0.0.0
---

# DAL-002 -- Parameter surface: modes and loop tuning

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-002`.

---

## 1. OVERVIEW

This scenario validates the parameter surface for `DAL-002`. The objective is to verify that the `:auto|:confirm` mode flags and the `--max-iterations` / `--convergence` tuning parameters named in the argument-hint reconcile with the shipped config-template defaults and the runnable `check-convergence.cjs` CLI flags.

### WHY THIS MATTERS

An operator tuning audit depth needs to trust that the defaults documented in the argument-hint are the same defaults the convergence engine actually uses, and needs to understand that the single `--convergence` hint token maps to a two-field convergence object (coverage threshold + stability window), not a deep-review-style single float. Because the command-level glue is phase-009 work, this scenario pins the contract to the two surfaces that DO exist: the config template and the convergence script.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that :auto/:confirm and --max-iterations/--convergence reconcile with the config-template defaults and check-convergence.cjs flags.
- Real user request: I want a longer, stricter alignment run. What are the defaults for iterations and convergence, and how do I override them?
- Prompt: `Validate deep-alignment parameter handling for :auto/:confirm, --max-iterations, and --convergence across the SKILL argument-hint, the config template, and check-convergence.cjs.`
- Expected execution process: Read the argument-hint, then the config template's `maxIterations`/`convergence`/`executionMode` fields, then `check-convergence.cjs`'s default constants and CLI flags, confirming the numbers agree.
- Desired user-facing outcome: The user is told the defaults (10 iterations; 100% coverage AND a 2-iteration stability window), that the run mode is `:auto` or `:confirm`, and that overrides flow into the convergence engine's `--max-iterations` / `--coverage-threshold` / `--stability-window` flags.
- Expected signals: `deep-alignment-config-template.json` carries `maxIterations: 10`, `convergence.coverageThreshold: 1.0`, `convergence.stabilityWindow: 2`, `convergence.combination: "AND"`, and `executionMode: "auto"`; `check-convergence.cjs` defaults match (`DEFAULT_MAX_ITERATIONS=10`, `DEFAULT_COVERAGE_THRESHOLD=1.0`, `DEFAULT_STABILITY_WINDOW=2`) and expose `--max-iterations`, `--coverage-threshold`, `--stability-window`; the single argument-hint `--convergence` maps to the config's two-field convergence object.
- Pass/fail posture: PASS if the argument-hint, config template, and convergence-script defaults are numerically consistent and the mode flags are documented. FAIL if any default drifts between sources.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the documented hint is checked before the config template and the script constants.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate deep-alignment parameter handling for :auto/:confirm, --max-iterations, and --convergence across the SKILL argument-hint, the config template, and check-convergence.cjs.
### Commands
1. `bash: rg -n 'argument-hint|:auto|:confirm|max-iterations|convergence' .opencode/skills/system-deep-loop/deep-alignment/SKILL.md`
2. `bash: rg -n 'maxIterations|coverageThreshold|stabilityWindow|combination|executionMode' .opencode/skills/system-deep-loop/deep-alignment/assets/deep-alignment-config-template.json`
3. `bash: rg -n 'DEFAULT_MAX_ITERATIONS|DEFAULT_COVERAGE_THRESHOLD|DEFAULT_STABILITY_WINDOW|--max-iterations|--coverage-threshold|--stability-window' .opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs`
4. `bash: node .opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs --help`
### Expected
Config template: `maxIterations: 10`, `convergence.coverageThreshold: 1.0`, `convergence.stabilityWindow: 2`, `convergence.combination: "AND"`, `executionMode: "auto"`. Script: `DEFAULT_MAX_ITERATIONS=10`, `DEFAULT_COVERAGE_THRESHOLD=1.0`, `DEFAULT_STABILITY_WINDOW=2`, with `--max-iterations`/`--coverage-threshold`/`--stability-window` flags. The argument-hint's `--convergence` is the single-token user surface for the two-field convergence object.
### Evidence
Capture the argument-hint line, the config template's `convergence` object, and the script's default constants + `--help` usage together.
### Pass/Fail
PASS if the defaults are numerically consistent across all three sources and the mode flags are documented. FAIL if any default drifts.
### Failure Triage
Privilege the config template and the script constants as the authority for the numbers; if the argument-hint implies a value the script does not use, that mismatch is the finding. Note that the `--convergence`-token-to-two-field mapping is phase-009 command glue, not yet implemented, and should be reported as such rather than as a defect.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `entry-points-and-modes/` | Entry-point category; validates documented + runnable surfaces, not a live command file |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md` | Frontmatter argument-hint naming `:auto|:confirm`, `--max-iterations`, `--convergence` |
| `.opencode/skills/system-deep-loop/deep-alignment/assets/deep-alignment-config-template.json` | `maxIterations`, `convergence` object, `executionMode` defaults |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs` | Default constants + `--max-iterations`/`--coverage-threshold`/`--stability-window` CLI flags |

---

## 5. SOURCE METADATA

- Group: ENTRY POINTS AND MODES
- Playbook ID: DAL-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `entry-points-and-modes/parameter-surface-modes-and-tuning.md`
- Build-state note: The command-level mapping of the `--convergence` hint token onto the two-field convergence object is phase-009 work and not yet implemented; the config template and convergence script are the current authorities.
