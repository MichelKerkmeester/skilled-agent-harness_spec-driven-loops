---
title: "create-command: Manual Testing Playbook"
description: "Operator-facing reference for authoring, routing and validating OpenCode slash commands in the create-command workflow."
version: 1.0.0.0
---

# create-command: Manual Testing Playbook

> Validate the command surface, input gates and owned assets before a slash command is published.

This playbook covers the operator-visible contract of the `sk-create-command` workflow. It tests component choice, path resolution, argument handling, mode completeness and router ownership. Each scenario has its own execution contract in a category folder.

The package has no feature catalog. The scenario files name their source anchors directly.

Canonical package artifacts:

- `manual-testing-playbook.md`
- `component-and-path/`
- `input-and-modes/`
- `router-contract/`

### Result persistence

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are persisted through `run-manual-playbook-scenario.cjs` into the skill benchmark reports. Generated report Markdown is renderer-owned.

---

## 1. OVERVIEW

This playbook tests six scenarios across three categories. The scenarios cover the command decision, namespace and filename rules, required input gates, execution modes and the separation between a thin router and its presentation asset.

### Realistic Test Model

1. Give the operator a repeatable workflow request or a command draft.
2. Read the command contract and the reference that owns the behavior.
3. Inspect the path, frontmatter, gate or owned asset boundary.
4. Run the named validator and compare its output with the expected result.

### Coverage Boundary

Positive scenarios check behavior the mode must handle. Negative scenarios check requests that belong to a skill or a different command variant and must be left alone. A correct answer without a source read or validation command is a `FAIL`.

---

## 2. GLOBAL PRECONDITIONS

1. Run commands from the repository root.
2. Confirm the requested artifact is an OpenCode slash command before drafting.
3. Use an isolated fixture for any scenario that writes a command or owned asset. Recovery removes the fixture after validation.
4. Confirm `python3` and `node` are available before running shared checks.
5. Keep existing commands and packet files unchanged during every scenario.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- The user request as typed
- The resolved command path and invocation
- The mode or reference section read
- The frontmatter, gate or asset decision under review
- The exact validation commands and exit status
- The observed validator output
- The final `PASS`, `FAIL` or `SKIP` verdict with its reason

---

## 4. DETERMINISTIC COMMAND NOTATION

- Bash commands use `bash: <command>`.
- Agent actions use `agent: <instruction>`.
- `->` separates sequential steps.
- Paths are repository-relative.
- A fixture path must be recorded before a write and removed after the scenario.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. This root playbook
2. The linked scenario file
3. The exact prompt and command transcript
4. The command path, frontmatter or asset evidence
5. Triage notes for any non-pass outcome

### Scenario Acceptance Rules

1. The scenario uses the prompt and commands exactly as written.
2. The command type and output path are explicit.
3. Required inputs have a gate before workflow steps.
4. Advertised modes resolve to complete targets.
5. Router text does not duplicate presentation-owned wording.
6. The validator output and exit status are captured.

`PASS` means every acceptance check is true. `FAIL` means a required behavior is missing or a check fails. `SKIP` is allowed only for a named sandbox or runtime blocker.

### Feature Verdict Rules

- `PASS`: both scenarios in the category pass.
- `FAIL`: any scenario in the category fails.
- `SKIP`: both scenarios name the same sandbox or runtime blocker.

### Release Readiness Rule

The package is ready for operator use when every scenario has an exact prompt, a source-backed expected result, a validation command and a binary verdict rule. The root index must link to every scenario exactly once.

### Root-vs-Feature Rule

The root owns shared evidence, review and recovery policy. Scenario files own prompts, commands, expected signals and feature-specific triage.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

The scenarios can run in three waves. Each wave keeps its command fixtures and asset fixtures separate.

### Operational Rules

1. Run `COMPONENT AND PATH` first because it decides whether a command should exist and where it lives.
2. Run `INPUT AND MODES` second because gates and mode targets shape the command contract.
3. Run `ROUTER CONTRACT` last because ownership checks depend on the selected command type.
4. Keep the negative scenario beside its positive pair so the boundary is reviewed together.
5. Record the worker, scenario ID and evidence path for each run.

### What Belongs In Scenario Files

- The realistic user request
- The invocation and argument shape under test
- The exact source files to read
- The exact validator commands
- The acceptance caveat and recovery step

---

## 7. COMPONENT AND PATH (`CMD-001..CMD-002`)

### CMD-001 | Repeatable slash command

#### Description
Verify that a repeatable user-triggered workflow is selected as a command and receives a valid namespace path.

#### Scenario Contract
Prompt: `I want a repeatable /release:check command that takes a path and returns a structured status. It should run the same workflow each time.`

The answer selects a command because the workflow is repeatable and user-triggered. It resolves a lowercase hyphen-case namespace and action path.

Desired user-visible outcome: the operator receives a command type and path that match the invocation contract.

#### Test Execution
> **Feature File:** [CMD-001](component-and-path/repeatable-slash-command.md)
> **Catalog:** no feature-catalog entry exists for this package.

### CMD-002 | Reference guidance stays a skill

#### Description
Verify that reusable workflow guidance without a slash invocation is left to a skill or reference.

#### Scenario Contract
Prompt: `Write a reusable standard for release checks. It should explain the process and should not add a slash command.`

The answer selects a skill or reference. It does not create a command file for prose that has no invocation contract.

Desired user-visible outcome: the user is told why a command is not needed and which workflow owns reusable guidance.

#### Test Execution
> **Feature File:** [CMD-002](component-and-path/reference-guidance-stays-a-skill.md)
> **Catalog:** no feature-catalog entry exists for this package.

---

## 8. INPUT AND MODES (`CMI-001..CMI-002`)

### CMI-001 | Required argument gate

#### Description
Verify that a required argument is shown in `argument-hint` and checked before the command body runs.

#### Scenario Contract
Prompt: `Create a command that requires a target path. It must stop and ask when the path is missing instead of guessing from open files.`

The draft places the mandatory gate immediately after frontmatter. It checks empty or whitespace-only input and ignores a mode suffix while deciding whether the target exists.

Desired user-visible outcome: the command asks for explicit input and does not infer a target.

#### Test Execution
> **Feature File:** [CMI-001](input-and-modes/required-argument-gate.md)
> **Catalog:** no feature-catalog entry exists for this package.

### CMI-002 | Complete auto and confirm modes

#### Description
Verify that every advertised `:auto` or `:confirm` mode has a realized workflow target and the correct execution behavior.

#### Scenario Contract
Prompt: `Create a command with :auto and :confirm modes. Auto should self-validate and confirm should pause for approval at meaningful checkpoints.`

The answer checks the hint, mode table, workflow assets and execution targets together. It does not advertise a mode that has no target.

Desired user-visible outcome: each visible mode maps to an executable path with the correct pace.

#### Test Execution
> **Feature File:** [CMI-002](input-and-modes/complete-auto-and-confirm-modes.md)
> **Catalog:** no feature-catalog entry exists for this package.

---

## 9. ROUTER CONTRACT (`CMR-001..CMR-002`)

### CMR-001 | Thin router and presentation boundary

#### Description
Verify that a split command keeps routing in the router and visible prompts, dashboards and result wording in the presentation asset.

#### Scenario Contract
Prompt: `Split this mode-based command so the router selects the workflow and the presentation asset owns the startup prompt and result text.`

The answer moves display wording without changing input gates, modes or permissions. The router keeps the owned-assets table and presentation boundary.

Desired user-visible outcome: the command remains behaviorally equivalent and easier to inspect by ownership.

#### Test Execution
> **Feature File:** [CMR-001](router-contract/thin-router-presentation-boundary.md)
> **Catalog:** no feature-catalog entry exists for this package.

### CMR-002 | Direct dispatch needs no YAML

#### Description
Verify that a direct-dispatch command is not given workflow YAML only because it has a split router.

#### Scenario Contract
Prompt: `This command dispatches directly to a script. Do I need auto and confirm YAML files just because it has a router?`

The answer reads the command family contract, identifies direct dispatch and keeps only the assets that the family needs. It does not add unused workflow files.

Desired user-visible outcome: the command package matches its selected topology without extra assets.

#### Test Execution
> **Feature File:** [CMR-002](router-contract/direct-dispatch-without-yaml.md)
> **Catalog:** no feature-catalog entry exists for this package.

---

## 10. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `shared/scripts/validate_document.py` | Command frontmatter, gates and sections | CMD-001, CMI-001, CMI-002, CMR-001 |
| `shared/scripts/check_authored_name_kebab.py` | Command and namespace name shape | CMD-001, CMI-001 |
| `assets/command-contract.json` | Command family topology and owned asset rules | CMR-001, CMR-002 |

These checks validate a command draft. They do not decide whether reusable prose needs a command or whether a direct-dispatch family needs workflow YAML. Those boundaries remain manual checks.

---

## 11. FEATURE CATALOG CROSS-REFERENCE INDEX

This package has no feature catalog. The index below is the playbook catalog.

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| CMD-001 | Repeatable slash command | COMPONENT AND PATH | [CMD-001](component-and-path/repeatable-slash-command.md) |
| CMD-002 | Reference guidance stays a skill | COMPONENT AND PATH | [CMD-002](component-and-path/reference-guidance-stays-a-skill.md) |
| CMI-001 | Required argument gate | INPUT AND MODES | [CMI-001](input-and-modes/required-argument-gate.md) |
| CMI-002 | Complete auto and confirm modes | INPUT AND MODES | [CMI-002](input-and-modes/complete-auto-and-confirm-modes.md) |
| CMR-001 | Thin router and presentation boundary | ROUTER CONTRACT | [CMR-001](router-contract/thin-router-presentation-boundary.md) |
| CMR-002 | Direct dispatch needs no YAML | ROUTER CONTRACT | [CMR-002](router-contract/direct-dispatch-without-yaml.md) |
