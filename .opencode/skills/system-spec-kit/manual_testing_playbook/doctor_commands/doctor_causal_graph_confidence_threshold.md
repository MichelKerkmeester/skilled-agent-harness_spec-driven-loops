---
title: "DOC-329 -- Doctor causal graph confidence threshold"
description: "This scenario validates /doctor causal-graph confidence threshold enforcement for DOC-329. It focuses on linking only candidates with confidence >= 0.7 and logging lower-confidence candidates as skipped."
version: 3.6.0.10
---

# DOC-329 -- Doctor causal graph confidence threshold

## 1. OVERVIEW

This scenario validates the autonomous apply path for `/doctor causal-graph` when candidate causal edges have mixed confidence values. It proves the command applies only high-confidence links and leaves lower-confidence records unlinked with explicit skip reasons.

The threshold matters because causal links are evidence, not cleanup churn. The command may improve lineage recall, but it must not create weak causal edges from loose keyword overlap or ambiguous packet relationships.

---

## 2. SCENARIO CONTRACT

- Objective: Confidence threshold enforcement for add-only causal graph auto-linking.
- Playbook ID: DOC-329.
- Real user request: `Auto-link causal edges. I want only high-confidence links applied.`
- Prompt: `Auto-link causal edges. I want only high-confidence links applied.`
- Preconditions: A sandbox or target active resolved profile Memory MCP database has candidate causal edges with mixed confidence, including at least one `0.85`, one `0.65`, and one `0.40` candidate.
- Expected execution process: Run `/doctor causal-graph --confidence-threshold=0.7`, capture the candidate list, snapshot path, inserted count, skipped candidates, and post-run stats.
- Expected signals: candidates with confidence `>= 0.7` are linked; candidates below `0.7` are skipped with `skipped: below threshold`; causal edge count delta equals the number of newly inserted `>= 0.7` candidates.
- Desired user-visible outcome: A concise applied verdict that names inserted high-confidence edges and skipped lower-confidence records.
- Pass/fail: PASS if only candidates at or above 0.7 are inserted and all lower-confidence candidates are logged as skipped.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, `SKIP`, or `UNAUTOMATABLE`.

---

## 3. TEST EXECUTION

### Prompt

```
Auto-link causal edges. I want only high-confidence links applied.
```

### Commands

1. Confirm candidate analysis includes mixed confidence values such as `0.85`, `0.65`, and `0.40`.
2. Record baseline `memory_causal_stats({})` totals and the pre-run causal edge count.
3. Run `/doctor causal-graph --confidence-threshold=0.7`.
4. Capture the Phase 1 `candidate_edges` and `skipped_candidates` output.
5. Capture the Phase 2 snapshot path and Phase 3 `attempted`, `inserted`, `skipped`, and `threshold` fields.
6. Run `memory_causal_stats({})` after apply and calculate the causal edge count delta.
7. Compare the count delta with the number of candidates whose confidence was `>= 0.7` and whose existing-edge check passed.

### Expected

The command filters candidate edges before mutation. A `0.85` candidate can be linked if the existing-edge check passes. The `0.65` and `0.40` candidates are not linked and appear in skipped output with a reason equivalent to `skipped: below threshold`.

The state log or final report shows `threshold: 0.7`, the attempted count, inserted count, skipped count, and post-verify status. The causal edge count delta equals the number of inserted candidates at or above the threshold, not the total candidate count.

### Evidence

- Command/read evidence for routed workflow contract:
  - Read `.opencode/commands/doctor/speckit.md`; frontmatter allows `mcp__mk_spec_memory__memory_causal_stats`, `mcp__mk_spec_memory__memory_drift_why`, and `mcp__mk_spec_memory__memory_search` for `/doctor causal-graph`.
  - Read `.opencode/commands/doctor/_routes.yaml`; route `causal-graph` has `allowed_flags: ["--confidence-threshold=N"]`, `mutating: read-only`, and `gate3_location: "n/a (read-only diagnostic; samples causal_edges and recommends candidates, no writes)"`.
  - Read `.opencode/commands/doctor/assets/doctor_causal-graph.yaml`; lines observed in command output include `purpose: Read-only causal graph stats and drift sampling with user review gates. No mutations.` and `This command is READ-ONLY by contract. Any attempted write or delete halts with STATUS=FAIL and ERROR='confirm-mode-mutation-violation'.`
- Baseline DB stat command:
  ```
  stat -f '%m %z' .opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite
  ```
  Output:
  ```
  1783038505 1327964160
  ```
- Baseline `memory_causal_stats({})` command attempted through the warm Spec Memory CLI fallback:
  ```
  node .opencode/bin/spec-memory.cjs memory_causal_stats --json '{}' --format json --timeout-ms 3000 --warm-only
  ```
  Output:
  ```
  @spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
  ```
- Spec Memory plugin status after the failed `memory_causal_stats` attempt:
  ```
  plugin_id=mk-spec-memory
  enabled=true
  disabled_reason=none
  cache_ttl_ms=5000
  max_brief_chars=2400
  max_cache_entries=200
  runtime_ready=false
  node_binary=node
  bridge_timeout_ms=3000
  cli_timeout_ms=2500
  bridge_path=[spec-memory-bridge]
  last_bridge_status=fail_open
  last_error_code=EXIT_69
  last_duration_ms=51
  bridge_invocations=8
  continuity_lookups=7
  cache_entries=0
  cache_hits=0
  cache_misses=7
  cache_hit_rate=0
  warm_status=fail_open
  warm_error=EXIT_69
  warm_route=cli
  warm_retryable=false
  warm_exit_code=69
  ```
- Candidate list with confidence values: not available because `memory_causal_stats({})` could not execute and the required mixed-confidence candidate precondition could not be confirmed.
- Snapshot path emitted before mutation: not available; current routed `/doctor causal-graph` workflow is read-only and the scenario run was blocked before candidate analysis.
- Link results showing `memory_causal_link` calls only for `confidence >= 0.7`: not available; current routed `/doctor causal-graph` workflow explicitly says it never calls `memory_causal_link`.
- Skipped-candidate log entries for `0.65` and `0.40` records: not available because candidate analysis could not run.
- Pre-run and post-run causal edge counts proving the delta equals the eligible insert count: not available because `memory_causal_stats({})` could not execute.
- Final state-log path and gold-battery result: not available because the command sequence was blocked by stale Spec Memory MCP dist/runtime readiness.

### Pass / Fail

- **BLOCKED**: `memory_causal_stats({})` could not execute because the Spec Memory MCP dist is stale (`@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build`) and the plugin reports `runtime_ready=false`, `last_error_code=EXIT_69`, `warm_status=fail_open`, `warm_retryable=false`. Rebuilding would modify files outside this scenario's allowed write path, so the mixed-confidence candidate precondition and expected link/skip evidence could not be verified.

### Failure Triage

If a `0.65` or `0.40` candidate is linked, fail with `confidence-threshold-violation` and inspect `candidate_selection.confidence_threshold` plus Phase 3 validation in `.opencode/commands/doctor/assets/doctor_causal-graph.yaml`. If skip evidence is missing, inspect Phase 1 output assembly and state-log serialization before rerunning.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: [.opencode/commands/doctor/speckit.md](../../../../commands/doctor/speckit.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor_causal-graph.yaml](../../../../commands/doctor/assets/doctor_causal-graph.yaml)
- Design context: local doctor command contract
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-329
- Feature name: Doctor causal graph confidence threshold
- Command mode: `/doctor causal-graph --confidence-threshold=0.7`
- YAML asset: `doctor_causal-graph.yaml`
- Confidence floor: 0.7
- Mutation policy: add-only links through `memory_causal_link`
- Feature file path: `doctor_commands/doctor_causal_graph_confidence_threshold.md`
