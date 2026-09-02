---
title: "create-agent: Manual Testing Playbook"
description: "Operator-facing reference for choosing, authoring and validating runtime agent markdown files in the create-agent workflow."
version: 1.0.0.1
---

# create-agent: Manual Testing Playbook

> Validate the runtime persona, its authority boundary and its delivery checks before the agent is used.

This playbook covers the operator-visible contract of the `sk-create-agent` workflow. It tests component choice, runtime-specific frontmatter, authority limits and the body sections required for a usable agent. Each scenario has its own execution contract in a category folder.

The package has no feature catalog. The scenario files name their source anchors directly.

Canonical package artifacts:

- `manual-testing-playbook.md`
- `component-choice/`
- `runtime-contract/`
- `body-validation/`

### Result persistence

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are persisted through `run-manual-playbook-scenario.cjs` into the skill benchmark reports. Generated report Markdown is renderer-owned.

---

## 1. OVERVIEW

This playbook tests six scenarios across three categories. The scenarios cover the decisions that make an agent a runtime component instead of reusable knowledge or a slash command. They also cover placement, permissions, body shape and validation.

### Realistic Test Model

1. Give the operator a user request that names a role or a runtime artifact.
2. Read the mode contract and the relevant reference before deciding.
3. Draft or inspect an agent fixture without changing the shipped mode files.
4. Run the named validator and compare its output with the user-facing result.

### Coverage Boundary

Positive scenarios check behavior the mode must handle. Negative scenarios check requests that belong to a skill or another component and must be left alone. A correct answer without a source read or validation command is a `FAIL`.

---

## 2. GLOBAL PRECONDITIONS

1. Run commands from the repository root.
2. Identify the runtime directory before drafting. OpenCode uses `.opencode/agents/`. Claude Code uses `.claude/agents/`.
3. Use an isolated fixture for any scenario that writes an agent file. Recovery removes the fixture after the validator run.
4. Confirm `python3` is available before running shared validators.
5. Keep the shipped `SKILL.md`, references and assets unchanged during every scenario.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- The user request as typed
- The runtime profile and target path
- The mode or reference section read
- The proposed frontmatter and body section list
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
4. The fixture diff or clean status
5. Triage notes for any non-pass outcome

### Scenario Acceptance Rules

1. The scenario uses the prompt and commands exactly as written.
2. The runtime directory and component type are explicit.
3. The expected signals match the mode contract.
4. The validator output and exit status are captured.
5. No shipped mode file changes.

`PASS` means every acceptance check is true. `FAIL` means a required behavior is missing or a check fails. `SKIP` is allowed only for a named sandbox or runtime blocker.

### Feature Verdict Rules

- `PASS`: both scenarios in the category pass.
- `FAIL`: any scenario in the category fails.
- `SKIP`: both scenarios name the same sandbox or runtime blocker.

### Release Readiness Rule

The package is ready for operator use when every scenario has a reproducible prompt, a source-backed expected result, a validation command and a binary verdict rule. The root index must link to every scenario exactly once.

### Root-vs-Feature Rule

The root owns shared evidence, review and recovery policy. Scenario files own prompts, commands, expected signals and feature-specific triage.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

The scenarios can run in three waves. Each wave keeps its fixture paths separate.

### Operational Rules

1. Run `COMPONENT CHOICE` first because it decides whether an agent should exist.
2. Run `RUNTIME CONTRACT` second because placement and permission schema constrain every draft.
3. Run `BODY VALIDATION` last because the body checks depend on a resolved runtime profile.
4. Keep the negative scenarios in the same wave as their positive pair so the mode boundary is reviewed together.
5. Record the worker, scenario ID and evidence path for each run.

### What Belongs In Scenario Files

- The realistic user request
- The runtime profile or component choice under test
- The exact source files to read
- The exact validator commands
- The acceptance caveat and recovery step

---

## 7. COMPONENT CHOICE (`AGC-001..AGC-002`)

### AGC-001 | Named runtime persona

#### Description
Verify that a request for a stable persona with explicit permissions is routed to an agent.

#### Scenario Contract
Prompt: `I need a named OpenCode persona that reviews release notes and can read files but cannot delegate work. Create the agent file.`

The answer names an agent as the component because the request needs a stable role, authority boundary and tool policy. It does not move the reusable review rules into the agent body.

Desired user-visible outcome: the operator receives an agent plan with a runtime path, least-authority permissions and linked domain guidance.

#### Test Execution
> **Feature File:** [AGC-001](component-choice/named-runtime-persona.md)
> **Catalog:** no feature-catalog entry exists for this package.

### AGC-002 | Reusable knowledge stays a skill

#### Description
Verify that a request for reusable rules without a runtime persona is left to the skill workflow.

#### Scenario Contract
Prompt: `Write a reusable guide for reviewing release notes. It should be reference knowledge and should not define a runtime role.`

The answer selects a skill or reference instead of an agent. It does not create a named persona or permission block.

Desired user-visible outcome: the user is told why an agent is not needed and which workflow owns reusable guidance.

#### Test Execution
> **Feature File:** [AGC-002](component-choice/reusable-knowledge-stays-a-skill.md)
> **Catalog:** no feature-catalog entry exists for this package.

---

## 8. RUNTIME CONTRACT (`AGR-001..AGR-002`)

### AGR-001 | OpenCode permission object

#### Description
Verify that an OpenCode agent uses explicit `permission:` values and denies delegation for a leaf role.

#### Scenario Contract
Prompt: `Create an OpenCode subagent that edits only the supplied fixture and must not start another agent.`

The draft uses `.opencode/agents/`, sets `mode: subagent`, gives only the permissions used by the role and sets `task: deny`. A standalone `tools:` list is not used.

Desired user-visible outcome: the frontmatter matches the OpenCode runtime contract and the authority boundary is visible before the body is read.

#### Test Execution
> **Feature File:** [AGR-001](runtime-contract/opencode-permission-object.md)
> **Catalog:** no feature-catalog entry exists for this package.

### AGR-002 | Claude tools allow-list

#### Description
Verify that a Claude Code agent uses a least-authority `tools:` allow-list and omits OpenCode-only fields.

#### Scenario Contract
Prompt: `Create this role for Claude Code. It may read and edit the assigned file but it must not use permission, mode or temperature fields.`

The draft uses `.claude/agents/`, includes a comma-separated `tools:` list and omits `permission:`, `mode:` and `temperature:`. This is the runtime-specific branch the mode must preserve.

Desired user-visible outcome: the user receives a Claude Code agent file that does not inherit an unrestricted tool set.

#### Test Execution
> **Feature File:** [AGR-002](runtime-contract/claude-tools-allow-list.md)
> **Catalog:** no feature-catalog entry exists for this package.

---

## 9. BODY VALIDATION (`AGV-001..AGV-002`)

### AGV-001 | Required body sections

#### Description
Verify that a new agent carries a hard boundary, core workflow, capability scan, output verification, anti-patterns and related resources.

#### Scenario Contract
Prompt: `Review this new agent draft and tell me whether it has every required body section before I use it.`

The mode checks the body against `assets/agent-template.md` and runs the shared document validator plus structure extraction. A missing section is a failure even when frontmatter parses.

Desired user-visible outcome: the operator gets a section-level result with the missing heading named when the draft is incomplete.

#### Test Execution
> **Feature File:** [AGV-001](body-validation/required-agent-sections.md)
> **Catalog:** no feature-catalog entry exists for this package.

### AGV-002 | Leaf denies delegation

#### Description
Verify that a leaf agent is not granted `task: allow` when its role does not orchestrate.

#### Scenario Contract
Prompt: `This leaf agent only edits the assigned fixture. Can I enable task permission in case it needs help later?`

The mode rejects the extra authority. It states that `task: allow` belongs only to explicit orchestrators and keeps the leaf at `task: deny`.

Desired user-visible outcome: the authority boundary stays narrow and the reason for denying delegation is clear.

#### Test Execution
> **Feature File:** [AGV-002](body-validation/leaf-denies-delegation.md)
> **Catalog:** no feature-catalog entry exists for this package.

---

## 10. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `shared/scripts/validate_document.py` | Agent sections, frontmatter and links | AGV-001, AGR-001, AGR-002 |
| `shared/scripts/extract_structure.py` | Heading structure for review | AGV-001 |
| `shared/scripts/check_authored_name_kebab.py` | Runtime filename shape | AGR-001, AGR-002 |

These checks validate the authored fixture. They do not decide whether the request needs an agent or whether a leaf should delegate. Those boundaries remain manual checks.

---

## 11. FEATURE CATALOG CROSS-REFERENCE INDEX

This package has no feature catalog. The index below is the playbook catalog.

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| AGC-001 | Named runtime persona | COMPONENT CHOICE | [AGC-001](component-choice/named-runtime-persona.md) |
| AGC-002 | Reusable knowledge stays a skill | COMPONENT CHOICE | [AGC-002](component-choice/reusable-knowledge-stays-a-skill.md) |
| AGR-001 | OpenCode permission object | RUNTIME CONTRACT | [AGR-001](runtime-contract/opencode-permission-object.md) |
| AGR-002 | Claude tools allow-list | RUNTIME CONTRACT | [AGR-002](runtime-contract/claude-tools-allow-list.md) |
| AGV-001 | Required body sections | BODY VALIDATION | [AGV-001](body-validation/required-agent-sections.md) |
| AGV-002 | Leaf denies delegation | BODY VALIDATION | [AGV-002](body-validation/leaf-denies-delegation.md) |
