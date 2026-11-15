---
title: "Fan-out native sequential review dispatch"
description: "Validate that native fan-out runs sequential `deep/review` command lineages with isolated artifact dirs, not full-loop `@deep-review` agent dispatches."
version: 1.11.1.0
---

# DRV-066 -- Fan-out native sequential review dispatch

This document captures the validation contract, execution flow, and metadata for `DRV-066`.

---

## 1. OVERVIEW

Validates the native lineage dispatch path in the review loop: `step_fanout_spawn`
hands every lineage to `fanout-run.cjs`, which runs native lineages through the `deep/review`
command with `config.fanout_lineage_artifact_dir` set. The leaf `@deep-review` agent runs only
individual iterations.

### Why This Matters

The research and review loops share the fan-out pattern but run different commands. A native
lineage promoted to a full-loop leaf-agent dispatch skips packet init, synthesis, and save.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `step_fanout_spawn` runs native lineages through `fanout-run.cjs` and the `deep/review` command with `config.fanout_lineage_artifact_dir` set per lineage, and never dispatches `@deep-review` as a full-loop sub-agent.
- Real user request: `Validate native fan-out for deep-review: confirm step_fanout_spawn runs native lineages through fanout-run.cjs and passes the correct lineage artifact dir override.`
- Expected signals: `step_fanout_spawn` calls `fanout-run.cjs --loop-type review`. Native lineages run through the `deep/review` command. `config.fanout_lineage_artifact_dir` isolates each lineage. The `skip_when` guard is `no entries in config.fanout.executors`. No full-loop `agent: deep-review` dispatch appears in the fan-out block.
- Pass/fail: PASS if source inspection confirms the fanout-run path, the correct dir override, and no full-loop leaf dispatch. FAIL if `@deep-review` is dispatched as a full-loop sub-agent or the dir override is absent.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep-review.yaml` present.

### Prompt

- Prompt: `Validate native fan-out for deep-review: confirm step_fanout_spawn runs native lineages through fanout-run.cjs and passes the correct lineage artifact dir override.`

### Commands

1. `bash: grep -n "step_fanout_spawn\|fanout-run.cjs\|fanout_lineage_artifact_dir\|agent: deep-review" .skilled/commands/deep/assets/deep-review.yaml`
2. Confirm `step_fanout_spawn_cli` calls `fanout-run.cjs` with `--loop-type review` for native and CLI lineages.
3. Confirm the `context:` block includes `config.fanout_lineage_artifact_dir: {artifact_dir}/lineages/{lineage.label}`.
4. Confirm `skip_when: "no entries in config.fanout.executors"`.
5. `bash: grep -n "Native and CLI fan-out\|fanout-run.cjs\|fanout_lineage_artifact_dir" .skilled/commands/deep/assets/deep-review-presentation.txt | head -10` — confirm the native fan-out policy note.

### RECOMMENDED ORCHESTRATION PROCESS

1. Grep for the `fanout-run.cjs` call and the dir override together.
2. Verify the dir override in the context block — it is easy to omit.

### Expected Outcome

Source inspection confirms the `fanout-run.cjs` path, correct dir override, correct `skip_when`. Command presentation docs describe native lineages running through `fanout-run.cjs`.

### Evidence

- Grep output from step 1, saved to `/tmp/drv-066-grep.txt`, showing the `fanout-run.cjs` call, `config.fanout_lineage_artifact_dir`, and no full-loop `agent: deep-review` dispatch.
- Grep output from step 5, saved to `/tmp/drv-066-docs-grep.txt`, showing the native fan-out policy in `deep-review-presentation.txt`.

### Failure Triage

- Full-loop `agent: deep-review` in the fan-out block: the leaf agent skips packet init, synthesis, and save.
- Dir override absent: each native lineage resolves `artifact_dir` from `spec_folder` and overwrites the same review dir.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `.skilled/commands/deep/assets/deep-review.yaml` | `step_fanout_spawn`, `step_fanout_spawn_cli` fanout-run call, `fanout_lineage_artifact_dir` context |
| `.skilled/commands/deep/assets/deep-review-presentation.txt` | Native fan-out policy and `fanout-run.cjs` ownership |

### Validation

| File | Role |
|---|---|
| Source inspection of YAML | Confirms the fanout-run path and dir override |

---

## 5. SOURCE METADATA

- Group: Fan-Out
- Canonical root source: `manual-testing-playbook/manual-testing-playbook.md`
- Scenario file path: `manual-testing-playbook/fanout/fanout-native-sequential-review.md`
- Expected verdict mode: GREEN when source inspection confirms the fanout-run path + dir override
- Wall-time estimate: 5-10 min
