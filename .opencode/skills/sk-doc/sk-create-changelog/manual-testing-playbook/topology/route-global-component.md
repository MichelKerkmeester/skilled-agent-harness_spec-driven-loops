---
title: "CHG-001 -- Route a global component changelog"
description: "This scenario validates global component routing for CHG-001. A component or git-history source maps to an existing component folder and a unique four-part version."
version: 1.0.0.1
---

# CHG-001 -- Route a global component changelog

This document captures the operator contract for global changelog placement.

## 1. OVERVIEW

This scenario validates global component routing for `CHG-001`. It focuses on existing-folder discovery and versioned output.

### Why This Matters

A global changelog is release-facing. It belongs under an existing `.opencode/changelog/{component}/` folder and uses a four-part version. A guessed component folder or a nested path would give users the wrong release record.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHG-001` and confirm the expected output mode.

- Objective: route a component source to an existing global changelog folder
- Realistic user request: `Create the next release note for the sk-doc component from its recent changes.`
- Prompt: `Create a global changelog for the sk-doc component from its recent changes. Discover the existing component folder, calculate a unique four-part version and validate the entry before writing.`
- Expected execution process: `SKILL.md` sections 3 through 7 are read, the component folders are discovered, `sk-doc` is matched to a real folder, the latest version and bump are checked and the global template is used.
- Expected signals: the target is `.opencode/changelog/sk-doc/vX.Y.Z.B.md`, the target folder already exists and the version is greater than the latest existing version. Nested generation is not used.
- Desired user-visible outcome: a release-facing changelog in the correct component folder with a unique version.
- Pass/fail: PASS if target, version and validation steps are evidenced. FAIL if a folder is invented, a nested path is selected or an existing version is overwritten.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create a global changelog for the sk-doc component from its recent changes. Discover the existing component folder, calculate a unique four-part version and validate the entry before writing.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CHG-001 | Route a global component changelog | Resolve an existing component folder and unique global version | `Create a global changelog for the sk-doc component from its recent changes. Discover the existing component folder, calculate a unique four-part version and validate the entry before writing.` | 1. `agent: Read SKILL.md sections 3 through 7 and state the global output rule` -> 2. `bash: ls -d .opencode/changelog/*/` -> 3. `bash: test -d .opencode/changelog/sk-doc` -> 4. `agent: State the latest version, bump type, target path and validation command` | Step 1 selects global mode. Step 2 lists real folders. Step 3 exits 0. Step 4 names a unique `vX.Y.Z.B` path and a changelog validator | Exact prompt, global output rule, folder listing and exit status, version calculation, target path and validation command | PASS if the existing folder and unique four-part target are evidenced. FAIL if the run guesses a folder, uses a nested path or skips version validation | 1. Confirm the source is component-facing. 2. Re-run folder discovery. 3. Compare the target version with the latest file before writing |

### Commands

1. `agent: Read SKILL.md sections 3 through 7 and state the global output rule`
2. `bash: ls -d .opencode/changelog/*/`
3. `bash: test -d .opencode/changelog/sk-doc`
4. `agent: State the latest version, bump type, target path and validation command`

### Expected

Global mode writes to `.opencode/changelog/sk-doc/v{VERSION}.md`. The folder exists. The version has four numeric parts and is strictly greater than the latest existing version. The entry uses the global template and is validated before writing.

### Evidence

Capture the prompt, relevant workflow sections, folder listing and exit status, latest version, bump choice, target path and validator command.

### Pass / Fail

- **Pass**: global mode resolves to the existing `sk-doc` folder and the target version is unique and validated.
- **Fail**: the run invents a folder, applies nested naming or overwrites an existing version.

### Failure Triage

1. Confirm the source type and release-facing intent.
2. Compare the component hint with the discovered folder names.
3. List existing versions and check the four-part sequence.
4. Validate the draft before any write.

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
| [`SKILL.md`](../../SKILL.md) | Input, topology, version and write workflow |
| [`README.md`](../../README.md) | Global routing and version overview |
| [`assets/changelog-template.md`](../../assets/changelog-template.md) | Global changelog format |

---

## 5. SOURCE METADATA

- Group: TOPOLOGY
- Playbook ID: CHG-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `topology/route-global-component.md`
