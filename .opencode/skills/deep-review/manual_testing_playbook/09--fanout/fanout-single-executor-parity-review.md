---
title: "Fan-out single-executor parity for review loop"
description: "Validate that all three fan-out YAML steps are fully bypassed in single-executor review mode, and that the if_absent branch is byte-identical to the original resolver."
---

# DRV-067 -- Fan-out single-executor parity for review loop

This document captures the validation contract, execution flow, and metadata for `DRV-067`.

---

## 1. OVERVIEW

Validates that the fan-out YAML modifications leave single-executor review runs fully
unchanged — the review-specific analogue of DLR-029/DR-054.

### Why This Matters

All existing users running the default single-executor review loop must be unaffected. The
review loop has an additional concern: `step_fanout_merge` must not run in single-executor
mode because there are no lineage registries to read — it would produce an empty merged
verdict.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `if_absent` branch = original `resolveArtifactRoot` for review; both fan-out steps skipped; vitest suite 197/197.
- Real user request: `Validate single-executor parity for deep-review: confirm the fan-out YAML steps have correct skip_when guards and the if_absent branch is unchanged.`
- Expected signals: `if_absent.command` contains `resolveArtifactRoot('{spec_folder}', 'review')`; `step_fanout_spawn` has `skip_when: "config.fanout is absent"`; `step_fanout_merge` has `skip_when: "config.fanout is absent"`; vitest 197/197.
- Pass/fail: PASS if all guards confirmed and vitest passes; FAIL if any `skip_when` guard missing or `if_absent` changed.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.

### Steps

1. `bash: grep -n "if_absent\|skip_when\|resolveArtifactRoot" .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml | head -20`
2. Confirm `if_absent.command` = `node -e "...resolveArtifactRoot('{spec_folder}', 'review')..."` (unchanged from pre-fan-out).
3. Confirm `step_fanout_spawn:` has `skip_when: "config.fanout is absent"`.
4. Confirm `step_fanout_merge:` has `skip_when: "config.fanout is absent"`.
5. Repeat for `deep_start-review-loop_confirm.yaml`.
6. `bash: cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run ../../deep-loop-runtime/tests/unit/`
7. Confirm 197/197 pass.

### RECOMMENDED ORCHESTRATION PROCESS

1. Check the `if_absent` branch first — this is the parity-critical path.
2. Check both `skip_when` guards.
3. Run vitest last as the definitive regression check.

### Expected Outcome

Source inspection confirms all guards. vitest 197/197.

### Failure Modes

- `if_absent` branch uses `'research'` instead of `'review'`: review runs write to the wrong artifact dir.
- `step_fanout_merge` `skip_when` missing: merge runs with no lineage registries → empty merged registry → step_derive_verdict reads zero P0/P1/P2 → incorrect PASS.
- Loop-lock flake: if it fails in the full suite but passes in isolation, it is the pre-existing timing flake.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | `step_resolve_artifact_root` if_absent branch, `step_fanout_spawn` skip_when, `step_fanout_merge` skip_when |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Same (confirm variant) |

### Validation

| File | Role |
|---|---|
| Full vitest suite | 197/197 confirms no single-executor regressions |

---

## 5. SOURCE_METADATA

- Group: Fan-Out
- Canonical root source: `manual_testing_playbook/manual_testing_playbook.md`
- Scenario file path: `manual_testing_playbook/09--fanout/fanout-single-executor-parity-review.md`
- Expected verdict mode: GREEN when source inspection confirmed and 197/197 vitest passes
- Wall-time estimate: 10-15 min
