---
title: "AGR-002 -- Claude tools allow-list"
description: "This scenario validates the Claude Code tools allow-list and omission of OpenCode-only frontmatter fields."
version: 1.0.0.3
---

# AGR-002 -- Claude tools allow-list

This document captures the Claude Code frontmatter branch for an agent role.

---

## 1. OVERVIEW

This scenario validates `AGR-002`. It focuses on `.claude/agents/`, the `tools:` allow-list and the fields that belong only to OpenCode.

### Why This Matters

Claude Code enforces `tools:` and silently ignores the OpenCode `permission:` object. Missing `tools:` can inherit the parent session's full tool set. The runtime path is part of the contract.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `AGR-002`.

- Objective: author a Claude Code agent with a comma-separated least-authority tool list.
- Realistic user request: `Create this role for Claude Code. It may read and edit the assigned file but it must not use permission, mode or temperature fields.`
- Prompt: `Create this role for Claude Code. It may read and edit the assigned file but it must not use permission, mode or temperature fields.`
- Expected execution process: read the runtime-specific schema, select `.claude/agents/`, include `tools: Read, Edit` and omit OpenCode-only keys.
- Expected signals: the path and filename are valid, `tools:` is present and neither `permission:` nor `mode:` or `temperature:` appears.
- Desired user-visible outcome: the role cannot inherit tools that its contract does not name.
- Pass/fail: PASS if Claude Code uses the allow-list schema. FAIL if the draft uses only `permission:` or omits `tools:`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create this role for Claude Code. It may read and edit the assigned file but it must not use permission, mode or temperature fields.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| AGR-002 | Claude tools allow-list | Author a Claude Code agent with only the named read and edit tools | `Create this role for Claude Code. It may read and edit the assigned file but it must not use permission, mode or temperature fields.` | 1. `agent: Read SKILL.md section 3 and state the Claude Code schema` -> 2. `agent: Draft the fixture in .claude/agents/ with tools Read, Edit` -> 3. `agent: Check that permission, mode and temperature are absent` -> 4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/check_authored_name_kebab.py .claude/agents/release-note-editor.md` | Step 1: `tools:` is selected for Claude Code. Step 2: the `.claude/agents/` path and allow-list are present. Step 3: OpenCode-only keys are absent. Step 4: the name check output and exit status are captured | The prompt, runtime decision, frontmatter, absent-key check and validator transcript | PASS if the Claude schema is present and least-authority tools are named. FAIL if `permission:` is used, `tools:` is missing or OpenCode-only fields are emitted | 1. Confirm the runtime profile is Claude Code. 2. Check that `tools:` is not empty. 3. Verify no OpenCode fields were copied into the Claude frontmatter |

### Commands

1. `agent: Read SKILL.md section 3 and state the Claude Code schema`
2. `agent: Draft the fixture in .claude/agents/ with tools Read, Edit`
3. `agent: Check that permission, mode and temperature are absent`
4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/check_authored_name_kebab.py .claude/agents/release-note-editor.md`

### Expected

Step 1 selects `tools:` for Claude Code. Step 2 drafts the role under `.claude/agents/`. Step 3 keeps OpenCode-only fields out. Step 4 confirms the authored name shape.

### Evidence

Capture the prompt, runtime schema, complete frontmatter, absent-key check and validator output with its exit status.

### Pass / Fail

- **Pass**: `tools:` is present, least-authority tools are named and OpenCode-only fields are absent.
- **Fail**: `permission:` is used, `tools:` is omitted or the role inherits a broader tool set than the request allows.

### Failure Triage

1. Re-read the runtime table and confirm the target directory.
2. Check that every listed tool is used by the body.
3. Search the frontmatter for `permission:`, `mode:` and `temperature:`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory and scenario summary |
| No feature-catalog entry | This package has no feature catalog |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Runtime-specific frontmatter schema |
| [`../../references/permission-design.md`](../../references/permission-design.md) | Least-authority design |
| [`../../assets/agent-template.md`](../../assets/agent-template.md) | Agent body scaffold |

---

## 5. SOURCE METADATA

- Group: RUNTIME CONTRACT
- Playbook ID: AGR-002
- Canonical root source: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `runtime-contract/claude-tools-allow-list.md`
