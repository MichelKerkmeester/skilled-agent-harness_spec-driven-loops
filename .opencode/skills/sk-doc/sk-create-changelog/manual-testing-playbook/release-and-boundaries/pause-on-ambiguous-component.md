---
title: "CHG-007 -- Pause on an ambiguous component"
description: "This scenario validates unresolved component handling for CHG-007. The workflow asks for a component choice when path and hint evidence do not resolve one and writes nothing to a guessed folder."
version: 1.0.0.0
---

# CHG-007 -- Pause on an ambiguous component

This document captures the operator contract for unresolved global component routing.

## 1. OVERVIEW

This scenario validates ambiguous component handling for `CHG-007`. It focuses on the stop-before-write rule.

### Why This Matters

Global changelog placement is a source-resolution decision. When several component folders match equally or no folder matches, the workflow must ask rather than write to a guessed target. A polished entry in the wrong component is still incorrect.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHG-007` and confirm the pause.

- Objective: stop before writing when component resolution remains ambiguous
- Realistic user request: `Create the global changelog from these mixed changes, but the files touch several components equally.`
- Prompt: `Resolve the global changelog component from these mixed changes. If the evidence does not identify one existing folder, pause and ask for the component instead of guessing.`
- Expected execution process: component folders and changed paths are compared, the file-count tie-break is applied and the workflow stops when no primary component can be selected with confidence.
- Expected signals: the response names the competing folders or missing match and asks for a component choice. It proposes no write path and creates no file.
- Desired user-visible outcome: an explicit clarification request before a global changelog is written.
- Pass/fail: PASS if the workflow pauses with the ambiguity named. FAIL if it guesses a component or writes an entry.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Resolve the global changelog component from these mixed changes. If the evidence does not identify one existing folder, pause and ask for the component instead of guessing.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CHG-007 | Pause on an ambiguous component | Refuse to guess a global component folder | `Resolve the global changelog component from these mixed changes. If the evidence does not identify one existing folder, pause and ask for the component instead of guessing.` | 1. `agent: Read SKILL.md section 6 and README.md troubleshooting` -> 2. `bash: ls -d .opencode/changelog/*/` -> 3. `agent: Compare the supplied changed paths and component hints with the discovered folders` -> 4. `agent: State the clarification question and confirm that no write path is selected` | Step 1 states the ambiguity rule. Step 2 lists existing folders. Step 3 shows no dominant match. Step 4 asks for the missing component and selects no path | Exact prompt, rule text, folder listing and exit status, comparison notes, clarification question and no-write statement | PASS if ambiguity is named and no component or write path is guessed. FAIL if an entry is assigned to an arbitrary folder | 1. Re-run folder discovery. 2. Apply file-count and path-segment evidence. 3. Ask for the component when no primary remains |

### Commands

1. `agent: Read SKILL.md section 6 and README.md troubleshooting`
2. `bash: ls -d .opencode/changelog/*/`
3. `agent: Compare the supplied changed paths and component hints with the discovered folders`
4. `agent: State the clarification question and confirm that no write path is selected`

### Expected

The workflow discovers real component folders and uses changed paths, hints and file-count share to resolve the target. If no folder matches or several are equally likely, it pauses and asks which component owns the changelog. It does not create a guessed folder or file.

### Evidence

Capture the prompt, routing rule, folder listing and exit status, matching analysis, clarification question and no-write statement.

### Pass / Fail

- **Pass**: unresolved component evidence produces a clarification request and no target path.
- **Fail**: the run guesses a component, invents a folder or writes before the ambiguity is resolved.

### Failure Triage

1. Check all discovered folders.
2. Compare changed paths against component names.
3. Apply the dominant-file rule.
4. Pause if the result is still ambiguous.

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
| [`SKILL.md`](../../SKILL.md) | Component discovery and ambiguity rules |
| [`README.md`](../../README.md) | Troubleshooting for missing component matches |
| [`references/topology-edge-cases.md`](../../references/topology-edge-cases.md) | Multi-component tie-break guidance |

---

## 5. SOURCE METADATA

- Group: RELEASE AND BOUNDARIES
- Playbook ID: CHG-007
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `release-and-boundaries/pause-on-ambiguous-component.md`
