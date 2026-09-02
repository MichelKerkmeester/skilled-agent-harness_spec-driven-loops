---
title: "MTP-003 -- Keep policy in the root"
description: "This scenario validates the root-policy boundary for `MTP-003`. It focuses on keeping review guidance in the root and canonical scenarios in category folders."
version: 1.0.0.3
---

# MTP-003 -- Keep policy in the root

This document captures the operator contract for `MTP-003`.

---

## 1. OVERVIEW

This scenario validates the package shape rules that keep one root file as the review surface. It checks the prohibition on `snippets/`, `review_protocol.md` and `subagent_utilization_ledger.md` as canonical sidecars.

### Why This Matters

Shared policy is easier to review when it has one home. Per-feature execution truth is easier to run when each feature has one canonical file. Splitting either source creates duplicate or hidden rules.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MTP-003` and compare the package shape with the mode contract.

- Objective: keep shared review and orchestration guidance in the root and keep canonical scenarios in category folders
- Realistic user request: `Split the playbook review rules into review_protocol.md and put each scenario under snippets so the root stays short.`
- Prompt: `Split the playbook review rules into review_protocol.md and put each scenario under snippets so the root stays short.`
- Expected execution process: read the package contract, refuse the forbidden sidecar and subtree, place shared policy in the root and keep one scenario file per feature in a root-level kebab-case category.
- Expected signals: the response names the root responsibilities, refuses `snippets/`, refuses the separate review files and preserves root index links to each scenario.
- Desired user-visible outcome: one navigable package with one source of truth for shared policy.
- Pass/fail: PASS if the root retains shared policy and category files hold scenario truth. FAIL if canonical scenarios move under `snippets/` or if shared policy is split into a sidecar file.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Split the playbook review rules into review_protocol.md and put each scenario under snippets so the root stays short.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MTP-003 | Keep policy in the root | Keep shared policy in the root and canonical scenarios in category folders | `Split the playbook review rules into review_protocol.md and put each scenario under snippets so the root stays short.` | 1. `agent: Read the package shape and root responsibilities in SKILL.md` -> 2. `agent: List the requested sidecar and subtree changes as forbidden` -> 3. `agent: Keep review policy in manual-testing-playbook.md and scenarios in root-level category folders` -> 4. `bash: find .opencode/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook -type d -name snippets -o -type f -name 'review_protocol.md' -o -type f -name 'subagent_utilization_ledger.md'` | Step 1: root and feature responsibilities are named. Step 2: all three forbidden shapes are named. Step 3: the package shape remains canonical. Step 4: no forbidden path is found | The exact prompt, the package rule, the refusal, the root policy location and the command output with its exit status | PASS if shared policy stays in the root and no forbidden sidecar or subtree exists. FAIL if any canonical scenario is placed under `snippets/` or shared policy is moved to a separate file | 1. Check whether the root still contains review and release rules. 2. Search the package for forbidden sidecar names. 3. Confirm each scenario remains linked from the root index |

### Commands

1. `agent: Read the package shape and root responsibilities in SKILL.md`
2. `agent: List the requested sidecar and subtree changes as forbidden`
3. `agent: Keep review policy in manual-testing-playbook.md and scenarios in root-level category folders`
4. `bash: find .opencode/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook -type d -name snippets -o -type f -name 'review_protocol.md' -o -type f -name 'subagent_utilization_ledger.md'`

### Expected

Step 1 identifies the root as the package directory, review surface and orchestration guide. Step 2 applies the package contract. Step 3 keeps one canonical scenario file per feature. Step 4 returns no forbidden path.

### Evidence

Capture the prompt, the root responsibility statement, the forbidden-shape list, the final package paths and the literal search output.

### Pass / Fail

- **Pass**: the root keeps shared policy, scenario files stay in root-level categories and the forbidden search returns no path.
- **Fail**: `snippets/` exists, a sidecar review file is canonical or the root index no longer links each scenario.

### Failure Triage

1. Inspect the root sections for review, release and orchestration policy.
2. Search for the three forbidden names and the `snippets/` directory.
3. Compare the root links with the files found below category directories.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
| No feature-catalog entry | This package has no feature catalog |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`SKILL.md`](../../SKILL.md) | Canonical package shape and forbidden files |
| [`assets/manual-testing-playbook-template.md`](../../assets/manual-testing-playbook-template.md) | Integrated root review and orchestration sections |

---

## 5. SOURCE METADATA

- Group: PACKAGE AUTHORING
- Playbook ID: MTP-003
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `package-authoring/keep-policy-in-root.md`
