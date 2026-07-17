---
title: "M-009 -- Runtime Family Count Census"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-009`."
version: 3.6.0.16
id: tooling-and-scripts-runtime-family-count-census
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# M-009 -- Runtime Family Count Census

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-009`.

---

## 2. SCENARIO CONTRACT


- Objective: This snippet preserves the canonical memory/spec-kit operator workflow for `M-009`.
- Real user request: `` Please validate Runtime Family Count Census against the documented validation surface and tell me whether the expected signals are present: all three commands return the same count (currently `12`). ``
- Prompt: `Validate Runtime Family Count Census against the documented validation surface and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: all three commands return the same count (currently `12`); the census exists to catch a missing runtime mirror, so equality across runtimes is the invariant
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: every family count is equal across the three runtimes (currently `12`).

---

## 3. TEST EXECUTION

### Prompt

`Validate Runtime Family Count Census against the documented validation surface and report cited pass/fail evidence.`
### Commands

```bash
  find .opencode/agents -maxdepth 1 -type f -name '*.md' | wc -l
  find .claude/agents -maxdepth 1 -type f -name '*.md' | wc -l
  find .opencode/agents -maxdepth 1 -type f -name '*.toml' | wc -l
  ```
### Expected

all three commands return the same count (currently `12`).
### Evidence

command output showing each family count.
### Pass/Fail

every family count is equal across the three runtimes (currently `12`).
### Failure Triage

any family missing files or has extras; collect counts and identify discrepancy.

---

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling_and_scripts/source_dist_alignment_enforcement.md](../../feature_catalog/tooling_and_scripts/source_dist_alignment_enforcement.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: M-009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/runtime_family_count_census.md`
