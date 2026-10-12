---
title: "CHG-001 -- Route a global component changelog"
description: "This scenario validates global component routing for CHG-001. A component or git-history source maps to an existing component folder or a hub folder's link, with a unique four-part version."
version: 1.3.0.4
---

# CHG-001 -- Route a global component changelog

This document captures the operator contract for global changelog placement.

## 1. OVERVIEW

This scenario validates global component routing for `CHG-001`. It focuses on existing-folder discovery, hub resolution and versioned output.

### Why This Matters

A global changelog is release-facing. It belongs under an existing `.skilled/changelog/{component}/` folder and uses a four-part version. `sk-doc` is a hub. Its folder holds no entry of its own, only one link per mode plus `parent`, the hub's own changelog. A run that treats the hub folder as the component finds no version there and writes beside the links, so the hub's entry belongs under `sk-doc/parent/`.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHG-001` and confirm the expected output mode.

- Objective: route a component source to an existing global changelog folder, resolving a hub to one of its links
- Realistic user request: `Create the next release note for the sk-doc component from its recent changes.`
- Prompt: `Create a global changelog for the sk-doc component from its recent changes. Discover the existing component folder, calculate a unique four-part version and validate the entry before writing.`
- Expected execution process: `SKILL.md` sections 3 through 7 are read, the component folders are discovered, `sk-doc` is matched to a real folder and recognized as a hub, the hint resolves to `sk-doc/parent`, the latest version and bump are checked there and the global template is used.
- Expected signals: the target is `.skilled/changelog/sk-doc/parent/vX.Y.Z.B.md`, the `parent` link exists and the version is greater than the newest entry under it. A change under `.skilled/skills/sk-doc/sk-create-changelog/` would resolve to `sk-doc/create-changelog` instead. Nested generation is not used.
- Desired user-visible outcome: a release-facing changelog in the hub's own changelog with a unique version.
- Pass/fail: PASS if the hub resolution, target, version and validation steps are evidenced. FAIL if a folder is invented, the entry lands in the hub folder itself, a nested path is selected or an existing version is overwritten.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create a global changelog for the sk-doc component from its recent changes. Discover the existing component folder, calculate a unique four-part version and validate the entry before writing.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CHG-001 | Route a global component changelog | Resolve an existing component folder or a hub's link with a unique global version | `Create a global changelog for the sk-doc component from its recent changes. Discover the existing component folder, calculate a unique four-part version and validate the entry before writing.` | 1. `agent: Read SKILL.md sections 3 through 7 and state the global output rule` -> 2. `bash: ls -d .skilled/changelog/*/` -> 3. `bash: ls -l .skilled/changelog/sk-doc/` -> 4. `bash: test -d .skilled/changelog/sk-doc/parent` -> 5. `agent: State the target for the sk-doc hint and for a change under .skilled/skills/sk-doc/sk-create-changelog/, then the latest version, bump type, target path and validation command` | Step 1 selects global mode. Step 2 lists real folders. Step 3 shows `sk-doc` holds links, `parent` among them. Step 4 exits 0. Step 5 names `sk-doc/parent` and `sk-doc/create-changelog`, then a unique `vX.Y.Z.B` path and a changelog validator | Exact prompt, global output rule, folder and link listings with exit status, both resolved targets, version calculation, target path and validation command | PASS if the hub resolves to its links and the unique four-part target is evidenced. FAIL if the run guesses a folder, writes into the hub folder, uses a nested path or skips version validation | 1. Confirm the source is component-facing. 2. Re-run folder discovery and list the hub's links. 3. Compare the target version with the latest file under the resolved link before writing |

### Commands

1. `agent: Read SKILL.md sections 3 through 7 and state the global output rule`
2. `bash: ls -d .skilled/changelog/*/`
3. `bash: ls -l .skilled/changelog/sk-doc/`
4. `bash: test -d .skilled/changelog/sk-doc/parent`
5. `agent: State the target for the sk-doc hint and for a change under .skilled/skills/sk-doc/sk-create-changelog/, then the latest version, bump type, target path and validation command`

### Expected

Global mode writes to `.skilled/changelog/sk-doc/parent/v{VERSION}.md`, because `sk-doc` is a hub and `parent` is its own changelog. A change under `.skilled/skills/sk-doc/sk-create-changelog/` resolves to `sk-doc/create-changelog`, the link whose target is that packet's `changelog/`. The link exists. The version has four numeric parts and is strictly greater than the newest entry under the resolved link. The entry uses the global template and is validated before writing.

### Evidence

Capture the prompt, relevant workflow sections, the folder and link listings with exit status, both resolved targets, latest version, bump choice, target path and validator command.

### Pass / Fail

- **Pass**: global mode resolves the `sk-doc` hub to its `parent` link, a change under a mode resolves to that mode's link and the target version is unique and validated.
- **Fail**: the run invents a folder, writes into the hub folder itself, applies nested naming or overwrites an existing version.

### Failure Triage

1. Confirm the source type and release-facing intent.
2. Compare the component hint with the discovered folder names.
3. List the hub's links with `ls -l` and match their targets.
4. List existing versions under the resolved link and check the four-part sequence.
5. Validate the draft before any write.

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
| [`SKILL.md`](../../SKILL.md) | Input, topology, hub resolution, version and write workflow |
| [`README.md`](../../README.md) | Global routing and version overview |
| [`assets/changelog-template.md`](../../assets/changelog-template.md) | Global changelog format |
| [`create-changelog-auto.yaml`](../../../../../commands/create/assets/create-changelog-auto.yaml) | Step 2 hub resolution |

---

## 5. SOURCE METADATA

- Group: TOPOLOGY
- Playbook ID: CHG-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `topology/route-global-component.md`
