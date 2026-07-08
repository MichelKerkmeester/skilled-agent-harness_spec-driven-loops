---
title: "Fan-out single-executor parity for research loop"
description: "Validate that all three fan-out YAML steps (step_resolve_artifact_root if_absent, step_fanout_spawn, step_fanout_merge) are fully bypassed in single-executor mode, preserving byte-identical behavior."
version: 1.14.0.3
---

# DR-054 -- Fan-out single-executor parity for research loop

This document captures the validation contract, execution flow, and metadata for `DR-054`.

---

## 1. OVERVIEW

Validates that the fan-out YAML modifications leave single-executor research runs fully
unchanged — no new code paths execute, no new artifacts are written.

### Why This Matters

All existing users running the default single-executor research loop must be unaffected.
If any `skip_when` guard is missing or `if_absent` was modified, every existing run breaks.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `if_absent` branch = original `resolveArtifactRoot` command; `step_fanout_spawn` skipped; `step_fanout_merge` skipped when `config.fanout` absent.
- Real user request: `Validate single-executor parity for deep-research: confirm the fan-out YAML steps have correct skip_when guards and the if_absent branch is unchanged.`
- Expected signals: `if_absent.command` contains `resolveArtifactRoot('{spec_folder}', 'research')` byte-for-byte; both `step_fanout_spawn` and `step_fanout_merge` have `skip_when: "config.fanout is absent"`; full vitest suite 197/197 (no single-executor regression).
- Pass/fail: PASS if all guards confirmed and vitest passes; FAIL if any `skip_when` guard is missing or `if_absent` branch has changed.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.

### Steps

1. `bash: grep -n "if_absent\|skip_when\|resolveArtifactRoot" .opencode/commands/deep/assets/deep_research_auto.yaml | head -20`
2. Confirm `if_absent.command` = `node -e "const { resolveArtifactRoot } = require('.opencode/skills/system-spec-kit/shared/review-research-paths.cjs'); console.log(JSON.stringify(resolveArtifactRoot('{spec_folder}', 'research')));"` (unchanged from pre-fan-out).
3. Confirm `step_fanout_spawn:` has `skip_when: "config.fanout is absent"`.
4. Confirm `step_fanout_merge:` has `skip_when: "config.fanout is absent"`.
5. Repeat for `deep_research_confirm.yaml`.
6. `bash: cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run ../../runtime//tests/unit/`
7. Confirm 197/197 pass.

### RECOMMENDED ORCHESTRATION PROCESS

1. Inspect the YAML `if_absent` branch first (regression risk is highest here).
2. Check both `step_fanout_spawn` and `step_fanout_merge` `skip_when` guards.
3. Run vitest last as the definitive regression check.

### Expected Outcome

Source inspection confirms all guards. vitest suite passes 197/197 with no new failures beyond the known loop-lock timing flake.

### Failure Modes

- `if_absent` branch modified: single-executor artifact dir resolution breaks for all research runs.
- `skip_when` guard missing on `step_fanout_spawn`: every single-executor run attempts to call `fanout-run.cjs` with absent fanout config, failing with exit code 3.
- Loop-lock flake newly fails: investigate `loop-lock.vitest.ts` in isolation — if it passes alone, it is the pre-existing timing flake, not a regression.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | `step_resolve_artifact_root` if_absent branch, `step_fanout_spawn` skip_when, `step_fanout_merge` skip_when |
| `.opencode/commands/deep/assets/deep_research_confirm.yaml` | Same (confirm variant) |

### Validation

| File | Role |
|---|---|
| Full vitest suite | 197/197 confirms no regressions |

---

## 5. SOURCE_METADATA

- Group: Fan-Out
- Canonical root source: `manual_testing_playbook/manual_testing_playbook.md`
- Scenario file path: `manual_testing_playbook/08--fanout/fanout-single-executor-parity-research.md`
- Expected verdict mode: GREEN when source inspection confirmed and 197/197 vitest passes
- Wall-time estimate: 10-15 min
