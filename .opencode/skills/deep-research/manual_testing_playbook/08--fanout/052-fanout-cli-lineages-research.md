---
title: "Fan-out research with two CLI lineages"
description: "Validate that a two-CLI-lineage fan-out research config triggers step_fanout_spawn → fanout-run.cjs pool → two isolated lineages sub-packets → step_fanout_merge → canonical research.md."
---

# DR-052 -- Fan-out research with two CLI lineages

This document captures the validation contract, execution flow, and metadata for `DR-052`.

---

## 1. OVERVIEW

End-to-end structural validation of the CLI fan-out path in the research loop.

### Why This Matters

The CLI fan-out path is the primary production scenario. If `step_fanout_spawn` is absent
or the `--executor` flag parsing produces `config.executor` instead of `config.fanout` when
two executors are specified, no fan-out dispatch happens silently.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the research YAML dispatches CLI lineages via `fanout-run.cjs` when two executor flags are present, that both lineages are isolated, and that the merged registry feeds `step_compile_research`.
- Real user request: `/deep:start-research-loop:auto "test topic" --executor=cli-codex --model=o4-mini --label=codex --executor=cli-claude-code --model=claude-opus-4-8 --label=claude --concurrency=2`
- Expected execution process: 1. Setup binds two executors → `config.fanout` (not `config.executor`). 2. `step_resolve_artifact_root` resolves base `artifact_dir`. 3. `step_fanout_spawn_cli` calls `fanout-run.cjs` with both CLI lineages. 4. Pool spawns two subprocesses in parallel. 5. Each writes to `lineages/codex/` and `lineages/claude/`. 6. `step_fanout_merge` reads both lineage registries, deduplicates. 7. `step_compile_research` emits canonical `research.md`.
- Expected signals: `step_fanout_spawn` present in YAML with `skip_when`; `step_fanout_merge` present in `phase_synthesis` with `skip_when`; `--executor` docs list 2+ → `config.fanout` default policy; `fanout-run.vitest.ts` confirms pool isolation.
- Pass/fail: PASS if source inspection confirms the full dispatch chain and unit tests agree; FAIL if any step is missing, `skip_when` guard absent, or docs lack the fan-out default policy.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep_start-research-loop_auto.yaml` and `start-research-loop.md` present.
- `fanout-run.cjs` and `fanout-merge.cjs` present.

### Steps

1. `bash: grep -n "step_fanout_spawn\|step_fanout_merge\|fanout_lineage_artifact_dir\|skip_when" .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml | head -20`
2. Confirm `step_fanout_spawn_cli` calls `fanout-run.cjs --loop-type research`.
3. Confirm `step_fanout_merge` calls `fanout-merge.cjs --loop-type research` and has `skip_when: "config.fanout is absent"`.
4. `bash: grep -n "fanout_executors\|--executor\|--executors\|--concurrency\|config.fanout\|config.executor" .opencode/commands/deep/start-research-loop.md | head -20`
5. Confirm default policy: 2+ `--executor` → `config.fanout`.
6. `bash: cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run ../../deep-loop-runtime/tests/unit/fanout-run.vitest.ts`
7. Confirm 5/5 pass (pool dispatch + lineage isolation confirmed by unit tests).

### RECOMMENDED ORCHESTRATION PROCESS

1. Check user-facing command docs before YAML internals.
2. Verify the `skip_when` guard before checking the command body.
3. Cross-reference `fanout-run.cjs` and `fanout-merge.cjs` paths match what the YAML calls.
4. Anchor the verdict on captured `grep` output and vitest results.

### Expected Outcome

Source inspection confirms dispatch chain. Unit tests confirm pool isolation and lineage dir creation.

### Failure Modes

- `step_fanout_spawn` absent from YAML: fan-out never triggers regardless of config.
- `skip_when` guard missing: fan-out step runs in single-executor mode, calling `fanout-run.cjs` with absent config.
- Default policy missing from docs: operators cannot understand when `config.fanout` vs `config.executor` is written.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | `step_fanout_spawn`, `step_fanout_merge`, `step_resolve_artifact_root` |
| `.opencode/commands/deep/start-research-loop.md` | `--executor` flag docs, default policy, fan-out examples |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Pool driver for CLI lineages |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Research dedup merge |

### Validation

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | CLI lineage spawn + isolation |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-merge.vitest.ts` | Research registry dedup |

---

## 5. SOURCE_METADATA

- Group: Fan-Out
- Canonical root source: `manual_testing_playbook/manual_testing_playbook.md`
- Scenario file path: `manual_testing_playbook/08--fanout/052-fanout-cli-lineages-research.md`
- Expected verdict mode: GREEN when source inspection + unit tests agree
- Wall-time estimate: 10-20 min
