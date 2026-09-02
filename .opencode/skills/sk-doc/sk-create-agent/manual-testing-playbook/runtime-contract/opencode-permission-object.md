---
title: "AGR-001 -- OpenCode permission object"
description: "This scenario validates the OpenCode permission object, runtime placement and leaf authority boundary for a new agent."
version: 1.0.0.1
---

# AGR-001 -- OpenCode permission object

This document captures the OpenCode frontmatter contract for a leaf agent.

---

## 1. OVERVIEW

This scenario validates `AGR-001`. It focuses on `.opencode/agents/`, explicit permission values and denial of nested dispatch.

### Why This Matters

OpenCode enforces the `permission:` object. A leaf role must deny `task` unless orchestration is its explicit authority. A file in the wrong runtime directory can look correct and still never resolve.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `AGR-001`.

- Objective: author an OpenCode leaf agent with least-authority permissions.
- Realistic user request: `Create an OpenCode subagent that edits only the supplied fixture and must not start another agent.`
- Prompt: `Create an OpenCode subagent that edits only the supplied fixture and must not start another agent.`
- Expected execution process: read the permission reference, select `.opencode/agents/`, draft `permission:` values and set `task: deny`.
- Expected signals: filename stem matches `name`, `mode: subagent` is present, tools used by the role are allowed and high-risk unused tools are denied.
- Desired user-visible outcome: the draft exposes a narrow runtime contract.
- Pass/fail: PASS if the OpenCode schema and leaf boundary are present. FAIL if a bare `tools:` list replaces `permission:` or `task: allow` is granted.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create an OpenCode subagent that edits only the supplied fixture and must not start another agent.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| AGR-001 | OpenCode permission object | Author a least-authority OpenCode leaf agent | `Create an OpenCode subagent that edits only the supplied fixture and must not start another agent.` | 1. `agent: Read references/permission-design.md and state the least-authority rule` -> 2. `agent: Draft the fixture in .opencode/agents/ with permission and task deny` -> 3. `agent: Check that name matches the kebab-case filename stem` -> 4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/agents/release-note-reviewer.md --type agent` | Step 1: least authority and `task: deny` are stated. Step 2: `.opencode/agents/` and `permission:` are used. Step 3: name and stem match. Step 4: validator output and exit status are captured | The prompt, permission block, target path, name check and validator transcript | PASS if the runtime schema and leaf authority are explicit. FAIL if `tools:` replaces `permission:`, the path is wrong or task delegation is allowed | 1. Check the runtime directory before reviewing the YAML. 2. Compare each allow value with a body sentence that needs it. 3. Confirm `task` is denied for this leaf role |

### Commands

1. `agent: Read references/permission-design.md and state the least-authority rule`
2. `agent: Draft the fixture in .opencode/agents/ with permission and task deny`
3. `agent: Check that name matches the kebab-case filename stem`
4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/agents/release-note-reviewer.md --type agent`

### Expected

Step 1 establishes least authority. Step 2 uses the OpenCode path and unified permission object. Step 3 checks identity consistency. Step 4 validates the body and frontmatter.

### Evidence

Capture the prompt, draft frontmatter, target path, identity check and validator output with its exit status.

### Pass / Fail

- **Pass**: the draft uses `permission:`, has `mode: subagent`, matches the filename and denies `task`.
- **Fail**: the draft uses a Claude-only schema, grants unused tools or lets a leaf dispatch another agent.

### Failure Triage

1. Re-read the runtime schema in `SKILL.md` and confirm the target path.
2. Check every `allow` against an actual role need.
3. Inspect `task` and high-risk tools for accidental authority.

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
| [`../../SKILL.md`](../../SKILL.md) | OpenCode schema and validation gate |
| [`../../references/permission-design.md`](../../references/permission-design.md) | Least-authority permission design |
| [`../../assets/agent-template.md`](../../assets/agent-template.md) | Agent body scaffold |

---

## 5. SOURCE METADATA

- Group: RUNTIME CONTRACT
- Playbook ID: AGR-001
- Canonical root source: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `runtime-contract/opencode-permission-object.md`
