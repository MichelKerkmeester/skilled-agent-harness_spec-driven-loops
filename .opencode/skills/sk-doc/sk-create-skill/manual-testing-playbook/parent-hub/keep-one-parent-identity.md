---
title: "SKL-006 -- Keep one parent identity"
description: "This scenario validates the nested-packet identity boundary for `SKL-006`. It focuses on hub-owned identity and child packets without graph metadata."
version: 1.0.0.0
---

# SKL-006 -- Keep one parent identity

This document captures the operator contract for `SKL-006`.

---

## 1. OVERVIEW

This scenario validates the parent identity boundary for nested packets. It checks that the hub owns `graph-metadata.json` and that child packets route through registry membership instead of carrying another advisor identity.

### Why This Matters

A second identity makes the advisor graph ambiguous. Parent membership already provides packet routing. Adding identity files to children creates a competing public skill surface and breaks the class contract.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKL-006` and confirm that the child packet stays identity-free.

- Objective: refuse packet-local graph metadata and preserve one parent advisor identity
- Realistic user request: `Add graph metadata to each child packet so the advisor can discover every mode directly.`
- Prompt: `Add graph-metadata.json to each child packet so the advisor can discover every mode directly.`
- Expected execution process: read the parent identity rule, identify the hub as the sole advisor identity, decline child `graph-metadata.json` and use the registry and hub membership for packet discovery.
- Expected signals: the response names the parent hub as the identity owner, states that child packets do not carry `graph-metadata.json` and proposes no second identity.
- Desired user-visible outcome: one advisor-routable hub with nested packets under its registry.
- Pass/fail: PASS if the child identity is refused and the parent rule is cited. FAIL if any child receives `graph-metadata.json` or the response treats each packet as a standalone advisor skill.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Add graph-metadata.json to each child packet so the advisor can discover every mode directly.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKL-006 | Keep one parent identity | Refuse packet-local graph metadata and preserve one parent advisor identity | `Add graph-metadata.json to each child packet so the advisor can discover every mode directly.` | 1. `agent: Read the parent identity rule in references/parent-skill/parent-skills-nested-packets.md` -> 2. `agent: Identify graph-metadata.json at the hub as the only advisor identity` -> 3. `agent: Decline child graph-metadata.json and keep packet discovery in the registry` -> 4. `bash: node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Step 1: the one-identity rule is quoted. Step 2: the hub owner is named. Step 3: no child identity is proposed. Step 4: the metadata gate reports no nested identity violation | The exact prompt, the cited identity rule, the refusal, the final root and child file listing, the gate output and its exit status | PASS if only the hub owns graph metadata and the gate is clean. FAIL if a child identity is added or packet routing is treated as a second advisor root | 1. Search below the hub for nested graph metadata. 2. Confirm registry membership names each child packet. 3. Read the gate output for nested identity findings |

### Commands

1. `agent: Read the parent identity rule in references/parent-skill/parent-skills-nested-packets.md`
2. `agent: Identify graph-metadata.json at the hub as the only advisor identity`
3. `agent: Decline child graph-metadata.json and keep packet discovery in the registry`
4. `bash: node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`

### Expected

Step 1 establishes the parent identity rule. Step 2 separates hub identity from packet membership. Step 3 declines the child files. Step 4 checks the final tree for nested identity violations.

### Evidence

Capture the prompt, identity rule, refusal, root and child file listing, gate output and exit status.

### Pass / Fail

- **Pass**: the parent remains the only advisor identity and the child packets route through registry membership.
- **Fail**: a child carries graph metadata, a second advisor identity is created or the gate is not run.

### Failure Triage

1. Search the hub and all child directories for graph metadata.
2. Compare child folders with the `modes[]` registry.
3. Re-run the metadata gate and read its nested-identity result.

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
| [`SKILL.md`](../../SKILL.md) | Parent identity and packet creation rules |
| [`references/parent-skill/parent-skills-nested-packets.md`](../../references/parent-skill/parent-skills-nested-packets.md) | Single advisor identity and nested packet rules |
| [`references/shared/skill-root-metadata-contract.md`](../../references/shared/skill-root-metadata-contract.md) | Nested identity enforcement |
| [`scripts/ci-skill-root-metadata.cjs`](../../scripts/ci-skill-root-metadata.cjs) | Identity and metadata gate |

---

## 5. SOURCE METADATA

- Group: PARENT HUB
- Playbook ID: SKL-006
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `parent-hub/keep-one-parent-identity.md`
