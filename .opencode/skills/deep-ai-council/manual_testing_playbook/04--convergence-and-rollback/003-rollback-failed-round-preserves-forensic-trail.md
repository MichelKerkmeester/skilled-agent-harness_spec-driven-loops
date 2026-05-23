---
title: "DAC-010 -- Rollback failed round preserves forensic trail"
description: "This scenario validates rollback forensic preservation for DAC-010."
---

# DAC-010 -- Rollback failed round preserves forensic trail

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-010`.

---

## 1. OVERVIEW

This scenario validates failed-round forensic preservation.

### Why This Matters

Rollback must preserve evidence so operators can inspect what failed without rewriting history.

---

## 2. SCENARIO CONTRACT

- Objective: Verify failed rounds move under `failed/` and state records rollback events.
- Real user request: Roll back this failed council round but keep the forensic trail.
- Prompt: `Roll back this failed council round but keep the forensic trail and show where it landed.`
- Expected execution process: Inspect failed round folder and state events.
- Expected signals: Failed artifacts remain under `failed/round-NNN-<timestamp>/`.
- Desired user-visible outcome: The user knows rollback preserved inspectable evidence.
- Pass/fail: PASS if failed artifacts and rollback events remain; FAIL if deleted or rewritten.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run in a sandbox packet only.
2. Inspect the failed-round folder.
3. Inspect rollback state events.

### Prompt

`Roll back this failed council round but keep the forensic trail and show where it landed.`

### Commands

1. `bash: find <packet>/ai-council/failed/round-NNN-<timestamp>/ -maxdepth 2 -type f | sort`
2. `bash: rg -n '"rollback"|"artifact_superseded"' <packet>/ai-council/ai-council-state.jsonl`

### Expected

Failed artifacts are preserved and state records rollback/audit events.

### Evidence

Capture failed folder listing and state event grep.

### Pass / Fail

- **Pass**: Rollback preserves artifacts and appends audit events.
- **Fail**: Rollback deletes evidence or rewrites old state.

### Failure Triage

Inspect rollback helper behavior, state append policy, and folder layout.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-010 | Rollback forensics | Verify failed-round preservation | `Roll back this failed council round but keep the forensic trail and show where it landed.` | `bash: find <packet>/ai-council/failed/round-NNN-<timestamp>/ -maxdepth 2 -type f | sort -> bash: rg -n '"rollback"|"artifact_superseded"' <packet>/ai-council/ai-council-state.jsonl` | Failed artifacts and audit events remain | Folder listing and state grep | PASS if evidence is preserved | Inspect rollback helper |

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
| `.opencode/skills/deep-ai-council/scripts/lib/rollback.js` | Rollback behavior |
| `.opencode/skills/deep-ai-council/references/folder_layout.md` | Failed folder layout |
| `.opencode/skills/deep-ai-council/references/state_format.md` | Rollback state events |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND ROLLBACK
- Playbook ID: DAC-010
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-and-rollback/003-rollback-failed-round-preserves-forensic-trail.md`
