---
title: "CHG-002 -- Route a phase child to nested output"
description: "This scenario validates phase-child topology for CHG-002. A phase child uses the packet-local nested generator and a deterministic changelog filename instead of global versioning."
version: 1.0.0.0
---

# CHG-002 -- Route a phase child to nested output

This document captures the operator contract for packet-local changelog placement.

## 1. OVERVIEW

This scenario validates phase-child topology for `CHG-002`. It focuses on nested output and the exclusion of global version rules.

### Why This Matters

A phase child is part of a larger packet. Its changelog records packet-local completion and must not look like a public component release. The nested generator selects a deterministic `changelog-<packet>-<phase>.md` path and uses spec-kit templates.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHG-002` and confirm the nested route.

- Objective: route a phase-child spec folder to packet-local nested output
- Realistic user request: `Record the completed phase in its packet changelog. Do not make a global release for this phase.`
- Prompt: `Create the packet-local changelog for this phase child. Detect the nested topology, use the spec-kit generator and report the deterministic output path. Do not calculate a global version.`
- Expected execution process: the topology rules are read, the phase-child path is inspected, the nested generator is queried with `--json` and the phase template is used. The global component folder is not selected.
- Expected signals: the output path is under the phase parent `changelog/` folder and uses the fixed `changelog-` prefix. No `vX.Y.Z.B` filename is proposed.
- Desired user-visible outcome: a packet-local changelog at the path selected by the nested generator.
- Pass/fail: PASS if nested mode and the deterministic path are evidenced. FAIL if global versioning is applied or the phase is written to a component folder.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create the packet-local changelog for this phase child. Detect the nested topology, use the spec-kit generator and report the deterministic output path. Do not calculate a global version.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CHG-002 | Route a phase child to nested output | Select nested mode and deterministic phase output | `Create the packet-local changelog for this phase child. Detect the nested topology, use the spec-kit generator and report the deterministic output path. Do not calculate a global version.` | 1. `agent: Read SKILL.md section 4 and references/topology-edge-cases.md` -> 2. `bash: test -d specs/sk-doc/001-authoring-surfaces` -> 3. `bash: node .opencode/skills/system-spec-kit/scripts/dist/spec-folder/nested-changelog.js specs/sk-doc/001-authoring-surfaces --json` -> 4. `agent: State why no global version applies` | Step 1 names phase-child nested mode. Step 2 exits 0. Step 3 returns the generator's deterministic output path. Step 4 says nested output is not four-part versioned | Exact prompt, topology rule, target-directory output and exit status, generator JSON and exit status, nested-version explanation | PASS if the generator selects a packet-local path and global versioning is excluded. FAIL if a global component file or version is proposed | 1. Confirm the folder is a phase child. 2. Use the generator output as the path authority. 3. Remove any global version calculation |

### Commands

1. `agent: Read SKILL.md section 4 and references/topology-edge-cases.md`
2. `bash: test -d specs/sk-doc/001-authoring-surfaces`
3. `bash: node .opencode/skills/system-spec-kit/scripts/dist/spec-folder/nested-changelog.js specs/sk-doc/001-authoring-surfaces --json`
4. `agent: State why no global version applies`

### Expected

The phase-child topology selects nested mode. The generator resolves the packet-local output. The path uses the fixed `changelog-` prefix and phase suffix. The global `vX.Y.Z.B` contract is not used.

### Evidence

Capture the prompt, topology references, target-directory output and exit status, generator JSON and exit status and the explanation for skipping global versioning.

### Pass / Fail

- **Pass**: nested mode is selected from the phase-child shape and the generator supplies the output path.
- **Fail**: the run writes or proposes a global component version for the phase.

### Failure Triage

1. Confirm phase-child topology from the source path.
2. Check the generator output instead of guessing a filename.
3. Verify that no global version sequence was applied.

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
| [`SKILL.md`](../../SKILL.md) | Nested mode detection and generator workflow |
| [`references/topology-edge-cases.md`](../../references/topology-edge-cases.md) | Placement table and nested edge cases |
| [`references/worked-examples.md`](../../references/worked-examples.md) | Packet-local entry shape |

---

## 5. SOURCE METADATA

- Group: TOPOLOGY
- Playbook ID: CHG-002
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `topology/route-phase-child-nested.md`
