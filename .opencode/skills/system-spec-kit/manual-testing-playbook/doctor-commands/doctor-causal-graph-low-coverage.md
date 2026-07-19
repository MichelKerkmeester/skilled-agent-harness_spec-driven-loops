---
title: "DOC-328 -- Doctor causal graph low coverage"
description: "This scenario validates /doctor causal-graph low-coverage reporting for DOC-328. It focuses on read-only causal coverage drift, degraded status, and explicit apply-mode recommendation."
version: 3.6.0.10
id: doctor-commands-doctor-causal-graph-low-coverage
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
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

- Pre-run `memory_causal_stats({})` MCP attempt 1 output: `MCP error -32001: backend recycled; retry`.
- Pre-run `memory_causal_stats({})` MCP attempt 2 output: `MCP error -32001: backend recycled; retry`.
- Warm CLI fallback command: `node .opencode/bin/spec-memory.cjs memory_causal_stats --json '{"backfill":{"dryRun":true,"limit":10,"actor":"manual-playbook-doc-328","similarity":false,"contradicts":false,"similarityThreshold":80}}' --format json --timeout-ms 3000 --warm-only`.
- Warm CLI fallback output: `@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp-server && npm run build`.
- Exact Phase 0 database stat command output for `stat -f '%m %z' mcp-server/database/context-index.sqlite`: `stat: mcp-server/database/context-index.sqlite: stat: No such file or directory`.
- `/doctor causal-graph` was not executed because the scenario precondition could not be confirmed: the required `memory_causal_stats({})` call was unavailable, the fallback required a build that would write outside this scenario's allowed write path, and the workflow's exact Phase 0 database path was missing.
- Post-run `memory_causal_stats({})` was not run because the pre-run stats command never succeeded and the diagnostic command was blocked before execution.
- State-log path was not emitted because executing the command to Phase 3 would require a state-log write outside the single allowed scenario file.

### Pass / Fail

- **BLOCKED**: the required precondition could not be confirmed because `memory_causal_stats({})` failed with `MCP error -32001: backend recycled; retry`, the warm CLI fallback reported `@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp-server && npm run build`, and the exact workflow database path `mcp-server/database/context-index.sqlite` was missing.

### Failure Triage

If the report does not mark low coverage, inspect `.opencode/commands/doctor/assets/doctor-causal-graph.yaml` phase 2 recommendation rules and confirm `coverage_percent < 60` maps to an apply recommendation. If the edge count changes, fail immediately with `auto-mode-mutation-violation` and inspect the YAML for any accidental `memory_causal_link`, `DELETE FROM causal_edges`, or `UPDATE causal_edges` path.

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.opencode/commands/doctor/speckit.md](../../../../commands/doctor/speckit.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor-causal-graph.yaml](../../../../commands/doctor/assets/doctor-causal-graph.yaml)
- Design context: local doctor command contract
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-328
- Feature name: Doctor causal graph low coverage
- Command mode: `/doctor causal-graph`
- YAML asset: `doctor-causal-graph.yaml`
- Coverage target: 60%
- Mutation policy: read-only diagnostic
- Feature file path: `doctor-commands/doctor-causal-graph-low-coverage.md`
