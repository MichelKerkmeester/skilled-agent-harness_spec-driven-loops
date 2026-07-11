---
title: "Fan-out native sequential review dispatch"
description: "Validate that native fan-out dispatches sequential agent: deep-review runs (not deep-research) with per-lineage isolated artifact dirs."
version: 1.11.0.3
---

# DRV-066 -- Fan-out native sequential review dispatch

This document captures the validation contract, execution flow, and metadata for `DRV-066`.

---

## 1. OVERVIEW

Validates the native lineage dispatch path in the review loop: `step_fanout_spawn_native`
must use `agent: deep-review`, not `agent: deep-research`.

### Why This Matters

The research and review loops share the fan-out YAML pattern but dispatch different agents.
A wrong agent name silently runs the research loop in a review fan-out context.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `step_fanout_spawn_native` in the review YAML dispatches `agent: deep-review` (not `deep-research`) with `config.fanout_lineage_artifact_dir` set per lineage.
- Real user request: `Validate native fan-out for deep-review: confirm step_fanout_spawn_native uses agent: deep-review and passes the correct lineage artifact dir override.`
- Expected signals: `agent: deep-review` in native dispatch block; `config.fanout_lineage_artifact_dir: {artifact_dir}/lineages/{lineage.label}` in context; correct `skip_when` guard.
- Pass/fail: PASS if source inspection confirms correct agent name and dir override; FAIL if `agent: deep-research` appears instead or the dir override is absent.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep_review_auto.yaml` present.

### Steps

1. `bash: grep -n "step_fanout_spawn_native\|agent: deep-review\|agent: deep-research\|fanout_lineage_artifact_dir" .opencode/commands/deep/assets/deep_review_auto.yaml`
2. Confirm `agent: deep-review` appears in the native dispatch block — NOT `agent: deep-research`.
3. Confirm `context:` block includes `config.fanout_lineage_artifact_dir: {artifact_dir}/lineages/{lineage.label}`.
4. Confirm `skip_when: "no entries in config.fanout.executors with kind == 'native'"`.
5. `bash: grep -n "native.*count\|native fan-out" .opencode/commands/deep/review.md` — confirm native fan-out note in examples.

### RECOMMENDED ORCHESTRATION PROCESS

1. Grep for BOTH agent names to confirm the right one appears and the wrong one does not.
2. Verify the dir override in the context block — it is easy to omit.

### Expected Outcome

Source inspection confirms `agent: deep-review`, correct dir override, correct `skip_when`. Review command docs include native fan-out note.

### Failure Modes

- `agent: deep-research` in review YAML native block: native lineages run the research loop, producing research.md instead of review-report.md.
- Dir override absent: each native lineage resolves `artifact_dir` from `spec_folder` and overwrites the same review dir.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | `step_fanout_spawn_native`, `agent: deep-review` dispatch, `fanout_lineage_artifact_dir` context |
| `.opencode/commands/deep/review.md` | Native fan-out note in EXAMPLES section |

### Validation

| File | Role |
|---|---|
| Source inspection of YAML | Confirms correct agent name and dir override |

---

## 5. SOURCE_METADATA

- Group: Fan-Out
- Canonical root source: `manual_testing_playbook/manual_testing_playbook.md`
- Scenario file path: `manual_testing_playbook/fanout/fanout-native-sequential-review.md`
- Expected verdict mode: GREEN when source inspection confirms agent: deep-review + dir override
- Wall-time estimate: 5-10 min
