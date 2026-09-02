---
title: "create-readme: Manual Testing Playbook"
description: "Operator-facing reference for routing, authoring and validating READMEs and install guides in the create-readme workflow."
version: 1.1.0.1
---

# create-readme: Manual Testing Playbook

> Validate the artifact type, local evidence and reader path before a README or install guide is published.

This playbook covers the operator-visible contract of the `sk-create-readme` workflow. It tests README routing, current-state evidence, code-folder navigation and the folded five-phase install-guide flow. Each scenario has its own execution contract in a category folder.

The package has no feature catalog. The scenario files name their source anchors directly.

Canonical package artifacts:

- `manual-testing-playbook.md`
- `artifact-routing/`
- `evidence-and-shape/`
- `install-guide/`

### Result persistence

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are persisted through `run-manual-playbook-scenario.cjs` into the skill benchmark reports. Generated report Markdown is renderer-owned.

---

## 1. OVERVIEW

This playbook tests six scenarios across three categories. The scenarios cover general READMEs, code-folder READMEs, evidence-first writing, the decision to skip an unnecessary README and install guides with phase checkpoints.

### Realistic Test Model

1. Give the operator a target folder and an audience or tool context.
2. Read local files before making a claim about structure, commands or features.
3. Choose the smallest artifact shape that serves the reader.
4. Validate headings, links, commands and expected output before returning a result.

### Coverage Boundary

Positive scenarios check artifact types the mode must author. Negative scenarios check folders or tools that should keep existing documentation or use a parent README. A confident claim without local evidence or a validation command is a `FAIL`.

---

## 2. GLOBAL PRECONDITIONS

1. Run commands from the repository root.
2. Identify the target folder, audience and artifact type before drafting.
3. Use a disposable fixture for any scenario that writes a README or install guide. Recovery removes the fixture after validation.
4. Confirm `python3` is available before running shared checks.
5. Keep existing READMEs, source files and config files unchanged during every scenario.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- The user request as typed
- The target folder and intended reader
- The local files and config evidence read
- The selected artifact type and template
- The exact validation commands and exit status
- The observed validator output or command output
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
3. The target-folder evidence
4. The exact prompt and command transcript
5. Triage notes for any non-pass outcome

### Scenario Acceptance Rules

1. The artifact type matches the target and audience.
2. Claims are grounded in files or user evidence.
3. The selected template shape is complete for the artifact.
4. Local links and commands are checked.
5. Expected output is shown for verification commands.
6. The validator output and exit status are captured.

`PASS` means every acceptance check is true. `FAIL` means a required behavior is missing or a check fails. `SKIP` is allowed only for a named sandbox or runtime blocker.

### Feature Verdict Rules

- `PASS`: both scenarios in the category pass.
- `FAIL`: any scenario in the category fails.
- `SKIP`: both scenarios name the same sandbox or runtime blocker.

### Release Readiness Rule

The package is ready for operator use when every scenario has an exact prompt, local evidence, a source-backed expected result, a validation command and a binary verdict rule. The root index must link to every scenario exactly once.

### Root-vs-Feature Rule

The root owns shared evidence, review and recovery policy. Scenario files own prompts, commands, expected signals and feature-specific triage.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

The scenarios can run in three waves. Each wave keeps its target fixtures separate.

### Operational Rules

1. Run `ARTIFACT ROUTING` first because artifact type controls the template.
2. Run `EVIDENCE AND SHAPE` second because current-state evidence controls the content.
3. Run `INSTALL GUIDE` last because its five checkpoints need a complete tool setup model.
4. Keep each negative scenario beside its positive pair so the boundary is reviewed together.
5. Record the worker, scenario ID and evidence path for each run.

### What Belongs In Scenario Files

- The realistic user request
- The target folder or tool under test
- The exact evidence and template files to read
- The exact validator commands
- The acceptance caveat and recovery step

---

## 7. ARTIFACT ROUTING (`RMR-001..RMR-002`)

### RMR-001 | Skill README

#### Description
Verify that a skill folder receives a general README with orientation first and reference detail later.

#### Scenario Contract
Prompt: `Write a README for this skill folder so a new contributor can understand what it does and how to use it.`

The answer selects a general skill README. It reads the target folder and uses the general README template with a tagline, overview and only evidence-backed sections.

Desired user-visible outcome: a new contributor can decide relevance and find the first useful action quickly.

#### Test Execution
> **Feature File:** [RMR-001](artifact-routing/skill-readme.md)
> **Catalog:** no feature-catalog entry exists for this package.

### RMR-002 | Self-explanatory folder stays unchanged

#### Description
Verify that a self-explanatory folder with sufficient parent documentation is left without a new README.

#### Scenario Contract
Prompt: `This small folder already has clear parent documentation and no reader is expected to land here. Should I add another README?`

The answer skips README authoring and explains that inline comments or parent documentation are enough for this folder.

Desired user-visible outcome: the repository does not gain a redundant document.

#### Test Execution
> **Feature File:** [RMR-002](artifact-routing/self-explanatory-folder-stays-unchanged.md)
> **Catalog:** no feature-catalog entry exists for this package.

---

## 8. EVIDENCE AND SHAPE (`RME-001..RME-002`)

### RME-001 | Evidence-first current-state README

#### Description
Verify that a README uses local evidence for files, commands, features and expected output.

#### Scenario Contract
Prompt: `Refresh this folder README from the current files. Do not document a command or feature unless you can confirm it locally.`

The answer reads the target folder, nearby docs, package files, config and existing commands before drafting. It tests commands when feasible and marks examples when they cannot be tested.

Desired user-visible outcome: the README describes the current folder and does not repeat stale or invented claims.

#### Test Execution
> **Feature File:** [RME-001](evidence-and-shape/evidence-first-current-state.md)
> **Catalog:** no feature-catalog entry exists for this package.

### RME-002 | Code-folder navigation shape

#### Description
Verify that a code-folder README chooses a directory tree for nested folders or a complete file inventory for a flat folder.

#### Scenario Contract
Prompt: `Write a README for this source folder. Use the actual folder shape to decide between a directory tree and a complete direct-file table.`

The answer counts immediate subdirectories. A nested folder gets a fenced tree. A flat folder gets a `KEY FILES` or `CONTENTS` table naming every direct file other than the README.

Desired user-visible outcome: a developer can navigate the folder without a guessed structure.

#### Test Execution
> **Feature File:** [RME-002](evidence-and-shape/code-folder-navigation-shape.md)
> **Catalog:** no feature-catalog entry exists for this package.

---

## 9. INSTALL GUIDE (`RMI-001..RMI-002`)

### RMI-001 | Five-phase install guide

#### Description
Verify that a multi-step tool setup receives the five-phase install-guide flow with a checkpoint and STOP condition after each phase.

#### Scenario Contract
Prompt: `Create an install guide for this tool. It needs prerequisites, installation, initialization, configuration and end-to-end verification.`

The answer uses the install-guide template. It adds the AI-first prompt, Core Principle blockquote, phase checkpoints named `phase_N_complete`, STOP blocks and actionable troubleshooting rows.

Desired user-visible outcome: an operator can install the tool and stop at the first failed checkpoint.

#### Test Execution
> **Feature File:** [RMI-001](install-guide/five-phase-install-flow.md)
> **Catalog:** no feature-catalog entry exists for this package.

### RMI-002 | One-line install stays inline

#### Description
Verify that a tool needing one documented install command and no project-specific setup is not given a full install guide.

#### Scenario Contract
Prompt: `This tool has clear official documentation and needs one install command with no project settings. Should I write a five-phase guide?`

The answer links to official documentation or gives the one-line command inline. It does not create a five-phase guide without project-specific setup.

Desired user-visible outcome: the documentation stays proportional to the setup work.

#### Test Execution
> **Feature File:** [RMI-002](install-guide/one-line-install-stays-inline.md)
> **Catalog:** no feature-catalog entry exists for this package.

---

## 10. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `shared/scripts/validate_document.py` | README and install-guide structure | RMR-001, RME-001, RME-002, RMI-001 |
| `shared/scripts/quick_validate.py` | Fast authored-markdown checks | RME-001, RMI-001 |
| `sk-create-readme/scripts/audit_readmes.py` | Repository README inventory and coverage | RMR-001, RME-001, RMR-002 |

These checks validate an authored artifact. They do not decide whether a folder needs a README or whether a one-line install should stay outside a guide. Those boundaries remain manual checks.

---

## 11. FEATURE CATALOG CROSS-REFERENCE INDEX

This package has no feature catalog. The index below is the playbook catalog.

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| RMR-001 | Skill README | ARTIFACT ROUTING | [RMR-001](artifact-routing/skill-readme.md) |
| RMR-002 | Self-explanatory folder stays unchanged | ARTIFACT ROUTING | [RMR-002](artifact-routing/self-explanatory-folder-stays-unchanged.md) |
| RME-001 | Evidence-first current-state README | EVIDENCE AND SHAPE | [RME-001](evidence-and-shape/evidence-first-current-state.md) |
| RME-002 | Code-folder navigation shape | EVIDENCE AND SHAPE | [RME-002](evidence-and-shape/code-folder-navigation-shape.md) |
| RMI-001 | Five-phase install guide | INSTALL GUIDE | [RMI-001](install-guide/five-phase-install-flow.md) |
| RMI-002 | One-line install stays inline | INSTALL GUIDE | [RMI-002](install-guide/one-line-install-stays-inline.md) |
