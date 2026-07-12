---
title: "DLR-029 -- Artifact-dir override and single-executor parity"
description: "Validate the YAML artifact-dir override branch is byte-identical to the original resolver in single-executor mode, and that step_fanout_spawn + step_fanout_merge are fully skipped when config.fanout is absent."
version: 1.4.0.4
---

# DLR-029 -- Artifact-dir override and single-executor parity

This document captures the validation contract, execution flow, and metadata for `DLR-029`.

---

## 1. OVERVIEW

Validates that the fan-out YAML changes preserve byte-identical single-executor behavior and
that the `config.fanout_lineage_artifact_dir` override correctly bypasses `resolveArtifactRoot`
in lineage sub-processes.

### Why This Matters

Any regression in single-executor mode would break all existing deep-research and deep-review
runs for users who never use fan-out. The `skip_when` guards are the primary protection.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `step_resolve_artifact_root` `if_absent` branch is byte-identical to the pre-change command, and `step_fanout_spawn` + `step_fanout_merge` have correct `skip_when` guards.
- Layer partition: YAML parity.
- Real user request: `Validate the fan-out YAML parity: confirm single-executor behavior is unchanged by inspecting the if_absent branch and skip_when guards, and run the full vitest suite to confirm 197/197.`
- Expected signals: `if_absent.command` = original `node -e "...resolveArtifactRoot('{spec_folder}', '...')..."` byte-for-byte; `step_fanout_spawn` has `skip_when: "config.fanout is absent"`; `step_fanout_merge` has `skip_when: "config.fanout is absent"`; full vitest suite passes.
- Pass/fail: PASS only if vitest exits 0 for the full runtime unit suite and source inspection confirms all guards; FAIL if the test is not run, exits non-zero, any `skip_when` guard is missing, or the `if_absent` branch has been modified.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- All 4 deep-loop YAML files present.

### Steps

1. `bash: grep -n "if_absent\|skip_when\|fanout_lineage_artifact_dir" .opencode/commands/deep/assets/deep_research_auto.yaml | head -20`
2. Confirm `if_absent.command` contains `resolveArtifactRoot('{spec_folder}', 'research')` — byte-identical to pre-change.
3. Confirm `step_fanout_spawn:` has `skip_when: "config.fanout is absent"`.
4. Confirm `step_fanout_merge:` has `skip_when: "config.fanout is absent"`.
5. Repeat steps 1–4 for `deep_review_auto.yaml` (substituting `'review'`).
6. `bash: cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run ../../runtime//tests/unit/`
7. Confirm 197/197 pass (or 196+1 known loop-lock flake that passes in isolation).

### Expected Outcome

Source inspection confirms `if_absent` branch is unchanged. Both fan-out steps skipped in single-executor mode. Full vitest suite green.

### Failure Modes

- `if_absent` branch modified: `resolveArtifactRoot` receives wrong arguments, breaking artifact dir resolution for all single-executor runs.
- `skip_when` guard removed from `step_fanout_spawn`: the spawn step runs even in single-executor mode, attempting to call `fanout-run.cjs` with an absent fanout config.
- `skip_when` guard removed from `step_fanout_merge`: merge step runs with no lineage sub-packets, producing an empty consolidated registry.

---

## 4. SOURCE ANCHORS

### Implementation

| File | Role |
|---|---|
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | `step_resolve_artifact_root` (if_present/if_absent), `step_fanout_spawn`, `step_fanout_merge` |
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | Same steps (review variant) |
| `.opencode/commands/deep/assets/deep_research_confirm.yaml` | Same steps (confirm variant) |
| `.opencode/commands/deep/assets/deep_review_confirm.yaml` | Same steps (review confirm) |

### Validation

| File | Role |
|---|---|
| Full vitest suite | 197/197 confirms no single-executor regression across all runtime/ tests |

---

## 5. SOURCE_METADATA

- Group: Fan-Out
- Playbook ID: DLR-029
- Feature catalog entry: `feature_catalog/fanout/fanout_config_schema.md`
- Scenario file path: `manual_testing_playbook/fanout/artifact_dir_override_parity.md`
- Expected verdict mode: GREEN when source inspection confirms guards and 197/197 vitest passes
- Wall-time estimate: 10-15 min
