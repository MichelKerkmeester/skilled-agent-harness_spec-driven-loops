---
title: "AI-003: Documentation Write Routes Elsewhere"
description: "Verify documentation authoring prompts do not false-fire sk-design just because they mention the sk-design hub."
version: 1.0.1.0
id: AI-003
expected_workflow_mode: UNKNOWN
stage: negative
expected_leaf_resources: []
---

# AI-003: Documentation Write Routes Elsewhere

## 1. OVERVIEW

This scenario verifies that `sk-design` does not capture documentation authoring prompts whose target is prose rather than design judgment.

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer asks for documentation about how the hub routes modes.

**Exact prompt**:
```text
Write a README section explaining how the sk-design hub routes its six modes.
```

**Expected mode resolution**: none for `sk-design`; route elsewhere.

**Why**:
- `design-interface/SKILL.md` says skip interface when the work is documentation or prose, not interface.
- `sk-doc` is the markdown and playbook specialist; this prompt asks to write a README section.
- The prompt mentions `sk-design`, but the requested deliverable is documentation, not interface, foundations, motion, audit, or extraction work.

**Expected packet loaded**:
- None under `sk-design/`.

**Expected shared resources loaded or cited**:
- None under `sk-design/shared/`.

**Expected advisor behavior**: route elsewhere. Expected top-1 is `sk-doc` or another documentation owner; `sk-design` must not be top-1 at confidence `>= 0.80`.

## 3. TEST EXECUTION

### Preconditions

1. Advisor is callable.
2. The prompt is not changed to request visual design guidance.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-AI003-advisor.txt`.
2. Do not invoke `sk-design` if advisor routes elsewhere.
3. Record top-1 skill, score, and whether `sk-design` appeared in top-3.

### Pass/Fail Criteria

- **PASS** iff top-1 is `sk-doc` or another documentation owner, and `sk-design` is not top-1 at confidence `>= 0.80`.
- **FAIL** iff `sk-design` wins or a design packet loads for this documentation-only prompt.

### Failure Triage

1. If `sk-design` wins, inspect whether `sk-design` identity tokens overpower documentation intent.
2. If `sk-doc` is missing, inspect advisor graph health before changing sk-design signals.
3. If the prompt was expanded with UI examples, restore the exact prompt.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/design-interface/SKILL.md`

## 5. SOURCE METADATA

- **Critical path**: No
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending manual run
