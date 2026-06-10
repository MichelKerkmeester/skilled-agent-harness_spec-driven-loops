---
title: "CP-037 -- BENCHMARK_COMPLETED_BOUNDARY action is not evidence **(SANDBOXED)**"
description: "Validate that benchmark execution emits a benchmark_completed journal boundary, not only a repeatability file or action prose."
---

# CP-037 -- BENCHMARK_COMPLETED_BOUNDARY action is not evidence **(SANDBOXED)**

This document captures the realistic user-testing contract, execution flow, source anchors and metadata for `CP-037`.

> **SANDBOXED SCENARIO**: All artifacts live under `/tmp/cp-037-sandbox/`. Benchmark completion is proven by static fixture materialization plus `benchmark-outputs/report.json`, not by prose.

## 1. OVERVIEW

Call B must run or require `materialize-benchmark-fixtures.cjs`, run `run-benchmark.cjs`, write `benchmark-outputs/report.json`, append a `benchmark_run` state row, and emit `benchmark_completed` only after the report exists; action text alone is not evidence.

### Why This Matters

Research found that benchmark execution can be an action placeholder. The legal-stop `evidenceGate` depends on a benchmark boundary that is grep-checkable from journal output and file artifacts.

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-037` and confirm the expected signals without contradictory evidence.

- Objective: Confirm Call B produces materialized fixture markdown, `benchmark-outputs/report.json`, a `benchmark_run` state row, and `benchmark_completed` journal boundary.
- Real user request: `Compare generic benchmark narration against real benchmark-completed evidence.`
- RCAF Prompt: `` Same task body in §2; Call A wraps with `As @Task:`; Call B invokes `/deep:start-agent-improvement-loop` from the command-capable sandbox ``

  Same task body for both calls:
  ```
  Task ID: CP-037-TASK-001.
  In /tmp/cp-037-sandbox/, evaluate .opencode/agents/cp-improve-target.md and prove the benchmark actually completed.
  Stay strictly inside /tmp/cp-037-sandbox/ and /tmp/cp-037-spec/.
  Acceptance: Call B must create /tmp/cp-037-spec/improvement/benchmark-outputs/report.json with status:"benchmark-complete", append benchmark_run, emit benchmark_completed after the report exists, and avoid treating action prose as completion evidence.
  Return structured output with status, candidate_path, target, change_summary, notes, and critic_pass.
  ```

- Expected execution process: run the CP-061 setup helper to create a command-capable `/tmp/cp-037-sandbox/`, run A, reset, run B from `/tmp/cp-037-sandbox/` via `/deep:start-agent-improvement-loop`, then grep B transcript, benchmark report, state log, and journal artifacts.
- Expected signals:
  - **Call A (@Task)**: May create ad hoc output or narrate benchmark success.
  - **Call B (`/deep:start-agent-improvement-loop` command flow)**: Contains `benchmark-outputs/report.json`, `status:"benchmark-complete"`, a `benchmark_run` state row, and report-gated `benchmark_completed`; `benchmark_completed` is not accepted unless `report.json` exists first.
- Desired user-visible outcome: PASS verdict showing benchmark evidence has a real boundary.
- Pass/fail: PASS if `benchmark-outputs/report.json`, `status:"benchmark-complete"`, `benchmark_run`, and report-gated `benchmark_completed` exist in causal order. FAIL if action prose appears without file-backed report evidence.

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the packet setup helper to seed `/tmp/cp-037-sandbox/` with the command, skill, target, mirror, benchmark profile, and benchmark fixture surfaces.
2. Run Call A with `As @Task:`, reset the sandbox from baseline, and run Call B with `/deep:start-agent-improvement-loop`.
3. Grep B transcript and artifacts for `benchmark-outputs/report.json`, `status:"benchmark-complete"`, `benchmark_run`, and report-gated `benchmark_completed`.
4. Check `benchmark-outputs/report.json` directly.

### Exact Runnable Command Sequence

```bash
rm -rf /tmp/cp-037-sandbox /tmp/cp-037-sandbox-baseline /tmp/cp-037-spec
mkdir -p /tmp/cp-037-spec
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/setup-cp-sandbox.sh --sandbox-dir /tmp/cp-037-sandbox
cp -a /tmp/cp-037-sandbox /tmp/cp-037-sandbox-baseline
git status --porcelain > /tmp/cp-037-pre.txt
cat > /tmp/cp-037-task.txt <<'EOF'
Task ID: CP-037-TASK-001.
In /tmp/cp-037-sandbox/, evaluate .opencode/agents/cp-improve-target.md and prove the benchmark actually completed.
Stay strictly inside /tmp/cp-037-sandbox/ and /tmp/cp-037-spec/.
Acceptance: Call B must create /tmp/cp-037-spec/improvement/benchmark-outputs/report.json with status:"benchmark-complete", append benchmark_run, emit benchmark_completed after the report exists, and avoid treating action prose as completion evidence.
Return structured output with status, candidate_path, target, change_summary, notes, and critic_pass.
EOF
printf 'As @Task: %s\n' "$(cat /tmp/cp-037-task.txt)" > /tmp/cp-037-prompt-A.txt
opencode run "$(cat /tmp/cp-037-prompt-A.txt)" --model deepseek/deepseek-v4-pro --dangerously-skip-permissions --dir /tmp/cp-037-sandbox </dev/null 2>&1 | tee /tmp/cp-037-A-task.txt; echo "EXIT_A=${PIPESTATUS[0]}" | tee /tmp/cp-037-A-exit.txt
rm -rf /tmp/cp-037-sandbox && cp -a /tmp/cp-037-sandbox-baseline /tmp/cp-037-sandbox
cd /tmp/cp-037-sandbox
opencode run "/deep:start-agent-improvement-loop \".opencode/agents/cp-improve-target.md\" :auto --spec-folder=/tmp/cp-037-spec --iterations=1" --model deepseek/deepseek-v4-pro --dangerously-skip-permissions --dir /tmp/cp-037-sandbox </dev/null 2>&1 | tee /tmp/cp-037-B-command.txt; echo "EXIT_B=${PIPESTATUS[0]}" | tee /tmp/cp-037-B-exit.txt
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
find /tmp/cp-037-spec -type f \( -name '*.json' -o -name '*.jsonl' -o -name '*.md' \) -print0 2>/dev/null | xargs -0 cat > /tmp/cp-037-B-artifacts.txt 2>/dev/null || touch /tmp/cp-037-B-artifacts.txt
cat /tmp/cp-037-B-command.txt /tmp/cp-037-B-artifacts.txt > /tmp/cp-037-B-combined.txt
test -f /tmp/cp-037-spec/improvement/benchmark-outputs/report.json; echo "BENCHMARK_REPORT_EXISTS=$?" | tee /tmp/cp-037-report-exit.txt
git status --porcelain > /tmp/cp-037-post.txt
diff /tmp/cp-037-pre.txt /tmp/cp-037-post.txt > /tmp/cp-037-tripwire.diff; echo "TRIPWIRE_DIFF_EXIT=$?" | tee /tmp/cp-037-tripwire-exit.txt
{
  grep -c "benchmark-outputs/report.json" /tmp/cp-037-B-combined.txt
  STATUS_TRANSCRIPT_COUNT=$(grep -c 'status":"benchmark-complete' /tmp/cp-037-B-combined.txt || true)
  if test -f /tmp/cp-037-spec/improvement/benchmark-outputs/report.json && node -e "const r=require('/tmp/cp-037-spec/improvement/benchmark-outputs/report.json'); process.exit(r.status === 'benchmark-complete' ? 0 : 1)" 2>/dev/null; then
    echo $((STATUS_TRANSCRIPT_COUNT + 1))
  else
    echo "$STATUS_TRANSCRIPT_COUNT"
  fi
  grep -c "benchmark_run" /tmp/cp-037-B-combined.txt
  grep -c "benchmark_completed" /tmp/cp-037-B-combined.txt
} | tee /tmp/cp-037-B-field-counts.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-037 | BENCHMARK_COMPLETED_BOUNDARY | Confirm benchmark completion is evented and file-backed | `` Same task body in §2; Call A wraps with `As @Task:`; Call B invokes `/deep:start-agent-improvement-loop` from the command-capable sandbox `` | Run the §3 exact command block | B field counts for `benchmark-outputs/report.json`, `status:"benchmark-complete"`, `benchmark_run`, and `benchmark_completed` are >= 1; `BENCHMARK_REPORT_EXISTS=0`; `TRIPWIRE_DIFF_EXIT=0` | `/tmp/cp-037-B-command.txt`, `/tmp/cp-037-B-combined.txt`, `/tmp/cp-037-B-field-counts.txt`, `/tmp/cp-037-report-exit.txt`, `/tmp/cp-037-tripwire.diff` | PASS if report, status, benchmark_run, and report-gated benchmark_completed evidence exist. FAIL if action prose alone is accepted | 1. If report is absent, benchmark runner did not execute or wrote to the wrong path. 2. If event is absent, add report-gated journal emission. 3. If `benchmark_run` is absent, check state-log append. 4. If `benchmark_completed` appears without `report.json`, restore report-gated event ordering. |

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml` | Benchmark-completed event path |
| `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml` | Benchmark-completed event path |
| `.opencode/skills/deep-improvement/assets/model_benchmark/benchmark-profiles/default.json` | Static benchmark profile |
| `.opencode/skills/deep-improvement/assets/model_benchmark/benchmark-fixtures/*.json` | Static benchmark fixtures |
| `.opencode/skills/deep-improvement/scripts/shared/materialize-benchmark-fixtures.cjs` | Fixture materializer |

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CP-037
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--agent-discipline-stress-tests/benchmark-completed-boundary.md`
- Related scenarios: `CP-035`, `CP-036`
- Sandbox: `/tmp/cp-037-sandbox/`
- Concurrency: Single-operator-session, sequential A then B, sandbox reset between calls
- Wall-time estimate: ~4-6 min
