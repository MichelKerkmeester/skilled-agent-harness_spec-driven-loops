---
title: "015 doctor code-graph route policy"
description: "Verify doctor-code-graph exposes mutating route metadata while the current YAML keeps Phase A diagnostic-only."
trigger_phrases:
  - "015"
  - "doctor apply mode policy"
  - "system-code-graph manual testing"
importance_tier: "normal"
---
# 015 doctor code-graph route policy

## 1. OVERVIEW

Verify doctor-code-graph exposes mutating route metadata while the current YAML keeps Phase A diagnostic-only.

---

## 2. SCENARIO CONTRACT

- Objective: Verify doctor-code-graph exposes mutating route metadata while the current YAML keeps Phase A diagnostic-only.
- Real user request: `Review doctor-code-graph routing and YAML to confirm the current workflow is diagnostic-only despite mutating route metadata.`
- Operator prompt: `Inspect doctor-code-graph route metadata and YAML. Show mk-code-index tool grants, read-only Phase A policy and packet-scratch write limits, then return PASS/FAIL.`
- Expected execution process: Read the route manifest and current doctor code-graph YAML line ranges, then run only diagnostic mode unless using a disposable workspace.
- Expected signals: Route metadata lists `mk-code-index` tools and mutating flags. Current YAML forbids mutation outside packet-local scratch and never invokes `code_graph_scan` in Phase A.
- Desired user-visible outcome: A concise verdict explaining whether the current doctor-code-graph workflow keeps diagnostics read-only.
- Pass/fail: PASS if route metadata and YAML boundaries are both visible and Phase A remains diagnostic-only. FAIL if the YAML mutates source/config/DB state or the route lacks `mk-code-index` grants.

---

## 3. TEST EXECUTION

### Commands

1. Read `.opencode/commands/doctor/_routes.yaml:54-79`.
2. Read `.opencode/commands/doctor/assets/doctor_code-graph.yaml:20-23` and `.opencode/commands/doctor/assets/doctor_code-graph.yaml:76-86`.
3. Read `.opencode/commands/doctor/assets/doctor_code-graph.yaml:131-187` and `.opencode/commands/doctor/assets/doctor_code-graph.yaml:191-206`.
4. Run only diagnostic mode unless using a disposable workspace.

### Expected Output / Verification

Route metadata lists `mk-code-index` tools and mutating flags. Current YAML forbids mutation outside packet-local scratch and never invokes `code_graph_scan` in Phase A.

### Cleanup

Remove scratch/apply artifacts from disposable copy.

### Variant Scenarios

Run `/doctor code-graph --scope=all --dry-run` in a disposable workspace and confirm any report writes stay under packet-local scratch.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 015
- Canonical root source: `manual_testing_playbook.md`
