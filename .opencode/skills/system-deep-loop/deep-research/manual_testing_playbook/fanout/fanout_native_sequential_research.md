---
title: "Fan-out native sequential research dispatch"
description: "Validate that native fan-out (count:N for the native executor) dispatches N sequential agent: deep-research runs with per-lineage isolated artifact dirs via config.fanout_lineage_artifact_dir."
version: 1.14.0.3
---

# DR-053 -- Fan-out native sequential research dispatch

This document captures the validation contract, execution flow, and metadata for `DR-053`.

---

## 1. OVERVIEW

Validates the native lineage path in the research fan-out: `step_fanout_spawn_native`
dispatches sequential `agent: deep-research` runs with isolated artifact dirs.

### Why This Matters

Native fan-out is the mechanism for running multiple Claude in-context research passes.
If the `agent:` dispatch block uses the wrong agent name or omits
`config.fanout_lineage_artifact_dir`, native lineages overwrite each other's outputs.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `step_fanout_spawn_native` dispatches `agent: deep-research` (not `deep-review`) with `config.fanout_lineage_artifact_dir` set per lineage.
- Real user request: `Validate native fan-out for deep-research: confirm step_fanout_spawn_native uses agent: deep-research and passes the correct lineage artifact dir override.`
- Expected signals: `step_fanout_spawn_native` present in YAML; `agent: deep-research` in dispatch block; `context` block references `config.fanout_lineage_artifact_dir: {artifact_dir}/lineages/{lineage.label}`; `skip_when: "no entries in config.fanout.executors with kind == 'native'"`.
- Pass/fail: PASS if all source signals are present; FAIL if agent name is wrong or lineage artifact dir override is absent.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep_research_auto.yaml` present.

### Steps

1. `bash: grep -n "step_fanout_spawn_native\|agent: deep-research\|fanout_lineage_artifact_dir" .opencode/commands/deep/assets/deep_research_auto.yaml`
2. Confirm `agent: deep-research` appears in the native dispatch block.
3. Confirm `context:` block includes `config.fanout_lineage_artifact_dir: {artifact_dir}/lineages/{lineage.label}`.
4. Confirm `skip_when: "no entries in config.fanout.executors with kind == 'native'"`.
5. `bash: grep -n "native.*count\|count.*native\|native fan-out" .opencode/commands/deep/research.md` — confirm native fan-out note in examples section.

### RECOMMENDED ORCHESTRATION PROCESS

1. Check the YAML dispatch block before the command docs.
2. Verify agent name exactly (`deep-research` not `deep-review`).
3. Confirm the `context:` block passes `fanout_lineage_artifact_dir` so `step_resolve_artifact_root` uses the override.

### Expected Outcome

Source inspection confirms native dispatch block uses `agent: deep-research`, passes the lineage dir override, and has the correct `skip_when` guard. Command docs include the native fan-out note.

### Failure Modes

- `agent: deep-review` instead of `agent: deep-research`: native lineages run the review loop, not research.
- `fanout_lineage_artifact_dir` absent from context: each native lineage resolves `artifact_dir` from `spec_folder` and overwrites the same dir.
- `skip_when` guard absent: native dispatch runs even when no native lineages are configured.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | `step_fanout_spawn_native`, `agent: deep-research` dispatch, `fanout_lineage_artifact_dir` context |
| `.opencode/commands/deep/research.md` | Native fan-out note in EXAMPLES section |

### Validation

| File | Role |
|---|---|
| Source inspection of YAML | Confirms correct agent name and dir override |

---

## 5. SOURCE_METADATA

- Group: Fan-Out
- Canonical root source: `manual_testing_playbook/manual_testing_playbook.md`
- Scenario file path: `manual_testing_playbook/fanout/fanout_native_sequential_research.md`
- Expected verdict mode: GREEN when source inspection confirms correct agent + dir override
- Wall-time estimate: 5-10 min
