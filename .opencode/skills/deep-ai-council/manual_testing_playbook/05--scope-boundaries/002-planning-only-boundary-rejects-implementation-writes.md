---
title: "DAC-012 -- Planning-only boundary rejects implementation writes"
description: "This scenario validates planning-only write boundaries for DAC-012."
---

# DAC-012 -- Planning-only boundary rejects implementation writes

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-012`.

---

## 1. OVERVIEW

This scenario validates that the council rejects implementation writes.

### Why This Matters

The council is useful only if it remains a planning agent and hands implementation to the right actor.

---

## 2. SCENARIO CONTRACT

- Objective: Verify the council writes only packet-local `ai-council/**` artifacts.
- Real user request: Have the council pick a plan and implement it.
- Prompt: `As a planning-only validator, check whether the council may implement code after choosing a plan. Return the refusal boundary and handoff.`
- Expected execution process: Grep skill and runtime agent for planning-only and write-scope rules.
- Expected signals: Instructions reject application-code and authored spec-doc writes outside `ai-council/**`.
- Desired user-visible outcome: The user gets a plan handoff, not an implementation write.
- Pass/fail: PASS if implementation writes are forbidden; FAIL if council can patch code.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Inspect SKILL.md rules.
2. Inspect runtime agent permission/scope language.
3. Confirm implementation handoff is explicit.

### Prompt

`As a planning-only validator, check whether the council may implement code after choosing a plan. Return the refusal boundary and handoff.`

### Commands

1. `bash: rg -n "planning-only|ai-council/\\*\\*|application code|spec docs|patch|Bash" .opencode/skills/deep-ai-council/SKILL.md .opencode/agents/deep-ai-council.md`

### Expected

Scope language forbids implementation writes and limits council writes to `ai-council/**`.

### Evidence

Capture grep output with line numbers.

### Pass / Fail

- **Pass**: Council is planning-only and scoped to `ai-council/**`.
- **Fail**: Council can modify application code or authored spec docs.

### Failure Triage

Check SKILL.md rules first, then runtime permissions and output protocol.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-012 | Planning-only boundary | Verify implementation writes rejected | `As a planning-only validator, check whether the council may implement code after choosing a plan. Return the refusal boundary and handoff.` | `bash: rg -n "planning-only|ai-council/\\*\\*|application code|spec docs|patch|Bash" .opencode/skills/deep-ai-council/SKILL.md .opencode/agents/deep-ai-council.md` | Write scope is restricted | Grep output | PASS if implementation writes are forbidden | Inspect runtime permissions |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `feature_catalog/` | No feature catalog exists yet |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-ai-council/SKILL.md` | Skill rules and integration points |
| `.opencode/agents/deep-ai-council.md` | Runtime permission boundary |

---

## 5. SOURCE METADATA

- Group: SCOPE BOUNDARIES
- Playbook ID: DAC-012
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--scope-boundaries/002-planning-only-boundary-rejects-implementation-writes.md`
