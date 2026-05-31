---
title: "DOC-328 -- Doctor causal graph low coverage"
description: "This scenario validates /doctor causal-graph low-coverage reporting for DOC-328. It focuses on read-only causal coverage drift, degraded status, and explicit apply-mode recommendation."
---

# DOC-328 -- Doctor causal graph low coverage

## 1. OVERVIEW

This scenario validates the read-only `/doctor causal-graph` diagnostic path when the causal graph is below the 60% coverage target. It proves the command reports degraded causal coverage without mutating `causal_edges`, surfaces the observed coverage percentage, and recommends the safe apply path.

The scenario is intentionally operator-visible. A real user wants to know whether a recent deep-research session left enough causal links behind, so the pass condition depends on the final health report being clear enough to act on.

---

## 2. SCENARIO CONTRACT

- Objective: Low-coverage drift report for causal graph diagnostics.
- Playbook ID: DOC-328.
- Real user request: `Check causal graph coverage. We had a deep-research session last week and want to know if the edges are well-linked.`
- Prompt: `Check causal graph coverage. We had a deep-research session last week and want to know if the edges are well-linked.`
- Preconditions: the active resolved profile Memory MCP database exists and `memory_causal_stats({})` reports causal-edge coverage below 60%, such as 45%.
- Expected execution process: Run `/doctor causal-graph`, capture the read-only stats and drift report, verify no causal-edge mutation occurred, and return a concise verdict.
- Expected signals: status is `ATTENTION`, `STALE`, or `DEGRADED`; coverage is below 60%; recommendation names `/doctor causal-graph` with the default confidence floor.
- Desired user-visible outcome: A short report saying the graph is under target and naming the remediation command.
- Pass/fail: PASS if the report captures coverage below 60%, marks the graph degraded or attention-worthy, and explicitly recommends `/doctor causal-graph`.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, `SKIP`, or `UNAUTOMATABLE`.

---

## 3. TEST EXECUTION

### Prompt

```
Check causal graph coverage. We had a deep-research session last week and want to know if the edges are well-linked.
```

### Commands

1. Confirm the sandbox or target runtime uses an active resolved profile Memory MCP database whose `memory_causal_stats({})` coverage is below 60%.
2. Record the pre-run causal edge count from `memory_causal_stats({})`.
3. Run `/doctor causal-graph`.
4. Capture the health report, stats table, drift signals, recommendation block, and state-log path.
5. Run `memory_causal_stats({})` again and record the post-run causal edge count.
6. Compare pre-run and post-run edge counts to confirm read-only diagnostic flow was read-only.

### Expected

The command returns a causal graph health report with coverage below the 60% target, for example `coverage: 45%`. The status is degraded, attention-worthy, or stale rather than healthy. The recommendation explicitly points to `/doctor causal-graph` or `/doctor causal-graph --confidence-threshold=0.7`.

The pre-run and post-run causal edge counts are identical because the read-only diagnostic flow is read-only. No `memory_causal_link`, delete, update, or direct SQL mutation occurs.

### Evidence

- Pre-run `memory_causal_stats({})` output showing coverage below 60%.
- `/doctor causal-graph` transcript showing the status, coverage percentage, target coverage, drift signals, and recommendation.
- Post-run `memory_causal_stats({})` output showing the same causal edge count as the pre-run baseline.
- State-log path emitted by the command.

### Pass / Fail

- **PASS**: coverage below 60% is reported, the status is degraded or attention-worthy, the recommendation explicitly names `/doctor causal-graph`, and edge count is unchanged.
- **FAIL**: coverage is omitted, the report claims healthy status below the 60% target, the apply recommendation is missing, or read-only diagnostic flow mutates causal edges.
- **SKIP**: no sandbox or target active resolved profile Memory MCP database with below-target causal coverage is available.
- **UNAUTOMATABLE**: the runtime cannot execute `/doctor causal-graph` or the memory causal stats tool in the current environment.

### Failure Triage

If the report does not mark low coverage, inspect `.opencode/commands/doctor/assets/doctor_causal-graph.yaml` phase 2 recommendation rules and confirm `coverage_percent < 60` maps to an apply recommendation. If the edge count changes, fail immediately with `auto-mode-mutation-violation` and inspect the YAML for any accidental `memory_causal_link`, `DELETE FROM causal_edges`, or `UPDATE causal_edges` path.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: [.opencode/commands/doctor/speckit.md](../../../../commands/doctor/speckit.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor_causal-graph.yaml](../../../../commands/doctor/assets/doctor_causal-graph.yaml)
- Design context: local doctor command contract
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-328
- Feature name: Doctor causal graph low coverage
- Command mode: `/doctor causal-graph`
- YAML asset: `doctor_causal-graph.yaml`
- Coverage target: 60%
- Mutation policy: read-only diagnostic
- Feature file path: `23--doctor-commands/346-doctor-causal-graph-low-coverage.md`
