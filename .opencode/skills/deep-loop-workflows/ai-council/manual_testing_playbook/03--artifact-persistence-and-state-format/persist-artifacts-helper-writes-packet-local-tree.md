---
title: "DAC-005 -- Persist-artifacts helper writes packet-local tree"
description: "This scenario validates packet-local artifact persistence for DAC-005."
version: 2.3.0.7
---

# DAC-005 -- Persist-artifacts helper writes packet-local tree

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-005`.

---

## 1. OVERVIEW

This scenario validates that the persistence helper writes the expected `ai-council/` tree.

### Why This Matters

Council output must survive beyond chat as inspectable packet-local artifacts.

---

## 2. SCENARIO CONTRACT

- Objective: Verify helper-created artifact layout.
- Real user request: Persist this council report for the current packet.
- Prompt: `Persist this council report for the current packet and show the artifact tree that was written.`
- Expected execution process: Run the helper against a packet and valid report, then inspect the resulting tree.
- Expected signals: Config, state, seats, deliberation, and report files exist under `ai-council/`.
- Desired user-visible outcome: The user sees where the council artifacts were written.
- Pass/fail: PASS if helper exits 0 and writes the packet-local tree; FAIL otherwise.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Prepare a valid report fixture.
2. Run the helper.
3. Inspect the packet-local `ai-council/` tree.

### Prompt

`Persist this council report for the current packet and show the artifact tree that was written.`

### Commands

1. `bash: node .opencode/skills/deep-loop-workflows/ai-council/scripts/persist-artifacts.cjs <packet> --input-file <report>`

### Expected

The command exits 0 and writes packet-local artifacts.

### Evidence

Capture command output and artifact listing.

### Pass / Fail

- **Pass**: `ai-council/` contains config, state, seats, deliberation, and report.
- **Fail**: Helper exits nonzero or writes outside the packet.

### Failure Triage

Check required headings in the report, packet path, and write permissions.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-005 | Persist artifacts | Verify packet-local tree | `Persist this council report for the current packet and show the artifact tree that was written.` | `bash: node .opencode/skills/deep-loop-workflows/ai-council/scripts/persist-artifacts.cjs <packet> --input-file <report>` | Helper exits 0 and writes tree | Command output and tree | PASS if artifacts land under packet | Check report schema |

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
| `.opencode/skills/deep-loop-workflows/ai-council/scripts/persist-artifacts.cjs` | CLI wrapper |
| `.opencode/skills/deep-loop-workflows/ai-council/references/structure/folder_layout.md` | Artifact layout |

---

## 5. SOURCE METADATA

- Group: ARTIFACT PERSISTENCE AND STATE FORMAT
- Playbook ID: DAC-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--artifact-persistence-and-state-format/persist-artifacts-helper-writes-packet-local-tree.md`
