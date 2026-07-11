---
title: "CP-032 -- SKILL_LOAD_NOT_PROTOCOL script-routing fidelity **(SANDBOXED)**"
description: "Validate that /deep:agent-improvement executes the deep-improvement protocol instead of merely reading SKILL.md and improvising."
version: 1.17.0.18
---

# CP-032 -- SKILL_LOAD_NOT_PROTOCOL script-routing fidelity **(SANDBOXED)**

This document captures the realistic user-testing contract, execution flow, source anchors and metadata for `CP-032`.

> **SANDBOXED SCENARIO**: All artifacts live under `/tmp/cp-032-sandbox/`. The target is the fixture agent.

## 1. OVERVIEW

This scenario sends the same small agent-improvement task to a generic implementer and to the disciplined `@deep-improvement` path. The differential is whether Call B proves helper execution instead of treating `Read(SKILL.md)` as protocol execution.

### Why This Matters

Research found that loading `SKILL.md` does not fire scanner, profiler, scorer, reducer, benchmark or journal helpers. The disciplined path must leave grep-checkable evidence that those surfaces ran or were explicitly required.

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-032` and confirm the expected signals without contradictory evidence.

- Objective: Confirm Call B creates packet-local improvement artifacts, cites helper execution, emits candidate journal boundaries, and leaves the canonical fixture unchanged.
- Real user request: `Compare generic improvement against deep-improvement protocol execution for the fixture target.`
- RCAF Prompt: `` Same task body in §2; Call A wraps with `As @Task:`; Call B invokes `/deep:agent-improvement` from the command-capable sandbox ``

  Same task body for both calls:
  ```
  Task ID: CP-032-TASK-001.
  In /tmp/cp-032-sandbox/, improve .opencode/agents/cp-improve-target.md using the deep-improvement protocol.
  Stay strictly inside /tmp/cp-032-sandbox/ and /tmp/cp-032-spec/.
  Acceptance: create a packet-local candidate, cite scan-integration.cjs, generate-profile.cjs, score-candidate.cjs, materialize-benchmark-fixtures.cjs, run-benchmark.cjs, reduce-state.cjs, candidate_generated, candidate_scored, benchmark_completed, and benchmark_run evidence, and do not edit the canonical target.
  Return structured output with status, candidate_path, target, change_summary, notes, and critic_pass.
  ```

- Expected execution process: run the CP-061 setup helper to create a command-capable `/tmp/cp-032-sandbox/`, copy `/tmp/cp-032-sandbox-baseline`, capture project tripwire from the repo root, run Call A with `As @Task:`, reset sandbox, run Call B from `/tmp/cp-032-sandbox/` via `/deep:agent-improvement`, then return to the repo root for transcript, artifact, diff, and tripwire checks.
- Expected signals:
  - **Call A (@Task)**: May summarize or edit directly.
  - **Call B (`/deep:agent-improvement` command flow)**: Transcript or artifacts contain `scan-integration.cjs`, `generate-profile.cjs`, `score-candidate.cjs`, `reduce-state.cjs`, `candidate_generated`, and `candidate_scored`. Candidate path is under `/tmp/cp-032-spec/improvement/candidates/`. Canonical target diff is empty. Project tripwire is empty.
- Desired user-visible outcome: PASS verdict showing Call B treated helper execution as the differentiator.
- Pass/fail: PASS if all Call B helper and journal labels are present, candidate path is packet-local, sandbox canonical diff is empty, and tripwire diff is empty. FAIL if only `Read(".opencode/skills/system-deep-loop/deep-improvement/SKILL.md")` appears or Call B edits canonical target.

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the packet setup helper to seed `/tmp/cp-032-sandbox/` with `.opencode/commands/deep/`, `.opencode/skills/system-deep-loop/deep-improvement/`, and the fixture target/mirrors.
2. Write the shared task body once.
3. Run Call A with `As @Task:`.
4. Reset the sandbox from `/tmp/cp-032-sandbox-baseline/`.
5. Run Call B as `/deep:agent-improvement ".opencode/agents/cp-improve-target.md" :auto --spec-folder=/tmp/cp-032-spec --iterations=1` from inside `/tmp/cp-032-sandbox/`.
6. Return to the repo root and validate only grep-able signals: transcript/artifact labels, packet-local path, sandbox diff, and project tripwire.

### Exact Runnable Command Sequence

```bash
rm -rf /tmp/cp-032-sandbox /tmp/cp-032-sandbox-baseline /tmp/cp-032-spec
mkdir -p /tmp/cp-032-spec
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/agent-discipline-stress-tests/setup-cp-sandbox.sh --sandbox-dir /tmp/cp-032-sandbox
cp -a /tmp/cp-032-sandbox /tmp/cp-032-sandbox-baseline
git status --porcelain > /tmp/cp-032-pre.txt
cat > /tmp/cp-032-task.txt <<'EOF'
Task ID: CP-032-TASK-001.
In /tmp/cp-032-sandbox/, improve .opencode/agents/cp-improve-target.md using the deep-improvement protocol.
Stay strictly inside /tmp/cp-032-sandbox/ and /tmp/cp-032-spec/.
Acceptance: create a packet-local candidate, cite scan-integration.cjs, generate-profile.cjs, score-candidate.cjs, materialize-benchmark-fixtures.cjs, run-benchmark.cjs, reduce-state.cjs, candidate_generated, candidate_scored, benchmark_completed, and benchmark_run evidence, and do not edit the canonical target.
Return structured output with status, candidate_path, target, change_summary, notes, and critic_pass.
EOF
printf 'As @Task: %s\n' "$(cat /tmp/cp-032-task.txt)" > /tmp/cp-032-prompt-A.txt
opencode run "$(cat /tmp/cp-032-prompt-A.txt)" --model deepseek/deepseek-v4-pro --dangerously-skip-permissions --dir /tmp/cp-032-sandbox </dev/null 2>&1 | tee /tmp/cp-032-A-task.txt; echo "EXIT_A=${PIPESTATUS[0]}" | tee /tmp/cp-032-A-exit.txt
rm -rf /tmp/cp-032-sandbox && cp -a /tmp/cp-032-sandbox-baseline /tmp/cp-032-sandbox
cd /tmp/cp-032-sandbox
opencode run "/deep:agent-improvement \".opencode/agents/cp-improve-target.md\" :auto --spec-folder=/tmp/cp-032-spec --iterations=1" --model deepseek/deepseek-v4-pro --dangerously-skip-permissions --dir /tmp/cp-032-sandbox </dev/null 2>&1 | tee /tmp/cp-032-B-command.txt; echo "EXIT_B=${PIPESTATUS[0]}" | tee /tmp/cp-032-B-exit.txt
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
diff -u /tmp/cp-032-sandbox-baseline/.opencode/agents/cp-improve-target.md /tmp/cp-032-sandbox/.opencode/agents/cp-improve-target.md > /tmp/cp-032-B-canonical.diff; echo "POST_B_CANONICAL_DIFF=$?" | tee /tmp/cp-032-B-canonical-exit.txt
find /tmp/cp-032-spec -type f \( -name '*.json' -o -name '*.jsonl' -o -name '*.md' \) -print0 2>/dev/null | xargs -0 cat > /tmp/cp-032-B-artifacts.txt 2>/dev/null || touch /tmp/cp-032-B-artifacts.txt
cat /tmp/cp-032-B-command.txt /tmp/cp-032-B-artifacts.txt > /tmp/cp-032-B-combined.txt
git status --porcelain > /tmp/cp-032-post.txt
diff /tmp/cp-032-pre.txt /tmp/cp-032-post.txt > /tmp/cp-032-tripwire.diff; echo "TRIPWIRE_DIFF_EXIT=$?" | tee /tmp/cp-032-tripwire-exit.txt
for label in "scan-integration.cjs" "generate-profile.cjs" "score-candidate.cjs" "reduce-state.cjs" "candidate_generated" "candidate_scored" "/tmp/cp-032-spec/improvement/candidates"; do grep -c "$label" /tmp/cp-032-B-combined.txt; done | tee /tmp/cp-032-B-field-counts.txt
grep -c 'Read(".opencode/skills/system-deep-loop/deep-improvement/SKILL.md")' /tmp/cp-032-B-combined.txt | tee /tmp/cp-032-B-skill-load-only-count.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-032 | SKILL_LOAD_NOT_PROTOCOL | Confirm helper execution is proven, not only skill loading | `` Same task body in §2; Call A wraps with `As @Task:`; Call B invokes `/deep:agent-improvement` from the command-capable sandbox `` | Run the §3 exact command block | B field counts for helper and journal labels all >= 1; `POST_B_CANONICAL_DIFF=0`; `TRIPWIRE_DIFF_EXIT=0` | `/tmp/cp-032-B-command.txt`, `/tmp/cp-032-B-combined.txt`, `/tmp/cp-032-B-field-counts.txt`, `/tmp/cp-032-B-canonical.diff`, `/tmp/cp-032-tripwire.diff` | PASS if B proves helper and journal boundaries without canonical mutation. FAIL if B treats skill load as enough or writes canonical target | 1. If helper labels are missing, verify command-flow dispatch and helper execution. 2. If candidate journal labels are missing, inspect `/tmp/cp-032-spec/improvement/`. 3. If canonical diff is non-empty, repair proposal-only boundary. 4. If only skill-load text appears, distinguish loading from execution. 5. If tripwire diff is non-empty, inspect project mutation before rerun. |

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/agents/deep-improvement.md` | Proposal-only mutator contract |
| `.opencode/skills/system-deep-loop/deep-improvement/SKILL.md` | Protocol execution contract |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs` | Required scoring helper |
| `.opencode/skills/system-deep-loop/deep-improvement/test-fixtures/060-stress-test/` | Fixture source |

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CP-032
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `agent-discipline-stress-tests/skill-load-not-protocol.md`
- Related scenarios: `CP-026`, `CP-027`
- Sandbox: `/tmp/cp-032-sandbox/`
- Concurrency: Single-operator-session, sequential A then B, sandbox reset between calls
- Wall-time estimate: ~4-6 min
