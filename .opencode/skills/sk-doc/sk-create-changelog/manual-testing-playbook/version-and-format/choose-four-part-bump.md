---
title: "CHG-003 -- Choose the four-part bump"
description: "This scenario validates four-part bump selection for CHG-003. Major, minor, patch and build each map to a documented change type and auto detection follows the stated order."
version: 1.0.0.1
---

# CHG-003 -- Choose the four-part bump

This document captures the operator contract for global version bump selection.

## 1. OVERVIEW

This scenario validates four-part bump selection for `CHG-003`. It focuses on change intent and the auto-detection order.

### Why This Matters

The four version segments carry different release meaning. A large change is not automatically major. A new subsystem is minor. A fix or documentation update is patch. A same-day correction to an existing version is build. Applying the wrong rule makes release history hard to trust.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHG-003` and confirm the documented mapping.

- Objective: choose the correct global bump from the change type and source signals
- Realistic user request: `The change adds a new changelog workflow. Which version segment should increase?`
- Prompt: `Choose the global changelog bump for this change. Read the spec intent and recent commit prefixes, then explain whether major, minor, patch or build applies.`
- Expected execution process: the bump table and version-bump reference are read, explicit flags are checked first, spec intent and commit prefixes are considered next and the default is patch only when no clear signal exists.
- Expected signals: a new subsystem maps to minor. A breaking rewrite maps to major. A fix or docs update maps to patch. A same-day correction maps to build.
- Desired user-visible outcome: one bump choice with the rule and source signal that support it.
- Pass/fail: PASS if the four choices and precedence order are applied. FAIL if effort size alone selects major or auto detection skips explicit input.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Choose the global changelog bump for this change. Read the spec intent and recent commit prefixes, then explain whether major, minor, patch or build applies.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CHG-003 | Choose the four-part bump | Map change intent to major, minor, patch or build | `Choose the global changelog bump for this change. Read the spec intent and recent commit prefixes, then explain whether major, minor, patch or build applies.` | 1. `agent: Read SKILL.md section 4 and references/version-bump-rules.md` -> 2. `agent: Map a new subsystem, breaking rewrite, bug fix and same-day correction to bump types` -> 3. `agent: State the auto-detection precedence` -> 4. `agent: Apply the mapping to the supplied change` | Step 1 gives the table. Step 2 maps minor, major, patch and build. Step 3 says explicit bump then spec keywords then commit prefixes then patch default. Step 4 gives one justified result | Exact prompt, source references, four mapping examples, precedence statement and selected result | PASS if the mapping and precedence are stated accurately. FAIL if major is chosen only because a change is large or a default is used despite explicit input | 1. Re-read the major rule. 2. Check for an explicit bump. 3. Compare spec and commit signals before accepting patch as the default |

### Commands

1. `agent: Read SKILL.md section 4 and references/version-bump-rules.md`
2. `agent: Map a new subsystem, breaking rewrite, bug fix and same-day correction to bump types`
3. `agent: State the auto-detection precedence`
4. `agent: Apply the mapping to the supplied change`

### Expected

Major is for breaking or platform-level change. Minor is for a significant new feature or subsystem. Patch is for a fix, refactor, docs update or cleanup. Build is for a hotfix or same-day correction. Explicit input wins over source inference.

### Evidence

Capture the prompt, rule text, four example mappings, precedence order and selected bump.

### Pass / Fail

- **Pass**: the selected bump follows the change intent and the stated precedence.
- **Fail**: the run chooses major because the work is large, ignores an explicit bump or applies global rules to nested output.

### Failure Triage

1. Identify whether the output is global or nested.
2. Check explicit input first.
3. Re-read the concrete bump examples and the major distinction.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root policy and scenario index |
| No feature-catalog entry | This mode has no catalog package for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`SKILL.md`](../../SKILL.md) | Four-part bump table and auto detection |
| [`references/version-bump-rules.md`](../../references/version-bump-rules.md) | Concrete bump examples |
| [`assets/changelog-template.md`](../../assets/changelog-template.md) | Global release format |

---

## 5. SOURCE METADATA

- Group: VERSION AND FORMAT
- Playbook ID: CHG-003
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `version-and-format/choose-four-part-bump.md`
