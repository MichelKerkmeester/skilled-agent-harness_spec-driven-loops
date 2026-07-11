---
title: "435 -- 028 CLI Stress: Repeated Warm-Only Probes Under Daemon Churn"
description: "Stress scenario firing a storm of warm-only probes across all three CLIs against an empty sandbox while the lifecycle suites churn daemons, asserting every probe exits 75 fast and the no-spawn invariant holds under repetition."
version: 3.6.0.1
---

# 435 -- 028 CLI Stress: Repeated Warm-Only Probes Under Daemon Churn

## 1. OVERVIEW

This stress scenario is part of the 028 CLI stress set (434-438). It hammers the warm-only no-spawn invariant (scenario 428's contract) under repetition and concurrent daemon churn: a probe storm of warm-only calls across all three CLIs runs against an empty sandbox socket directory while the spec-memory lifecycle hardening suite churns daemon recycle/reap behavior in its own sandbox. Every probe must exit 75 quickly, and the probe storm must spawn exactly zero launchers no matter how many times it fires.

This is the prompt-time hot path: hooks fire warm-only probes on every prompt, so a probe that occasionally spawns, wedges, or slows under churn directly degrades the operator's prompt latency.

## 2. SCENARIO CONTRACT

- Objective: Confirm N repeated warm-only probes all exit 75 fast with zero spawns while daemon churn runs concurrently.
- Real user request: `Hooks probe the daemon on every prompt. After hundreds of prompts during a flaky-daemon stretch, did any probe quietly boot something or start hanging?`
- Prompt: `Fire 60 warm-only probes (20 per CLI) against an empty sandbox while the lifecycle hardening suite churns, and report exit-code distribution, max latency, and spawn delta.`
- Expected execution process: Start the lifecycle suite in the background, run the probe storm, collect exit codes and wall time, join the suite, compare launcher counts.
- Expected signals: 60/60 probes exit 75; no probe takes anywhere near its 3000 ms timeout; launcher delta zero; lifecycle suite green.
- Desired user-visible outcome: Probe cost stays flat and spawn-free under churn and repetition.
- Pass/fail: PASS only when every probe exits 75, the spawn delta is zero, and the churn suite passes.

## 3. TEST EXECUTION

### Prompt

```text
Fire 60 warm-only probes (20 per CLI) against an empty sandbox while the lifecycle hardening suite churns, and report exit-code distribution, max latency, and spawn delta.
```

### Commands

```bash
SANDBOX=$(mktemp -d /tmp/cli-playbook.XXXXXX)
export SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock"
export SPECKIT_DAEMON_REELECTION=0
BEFORE=$(pgrep -f "mk-(spec-memory|code-index|skill-advisor)-launcher" | wc -l)

# Daemon churn in parallel (its own sandbox; ignores our socket dir)
(cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/spec-memory-cli-lifecycle-hardening.vitest.ts) &
CHURN=$!

FAILS=0
for i in $(seq 1 20); do
  node .opencode/bin/spec-memory.cjs memory_stats --warm-only --timeout-ms 3000 --format jsonl >/dev/null 2>&1; [ $? -ne 75 ] && FAILS=$((FAILS+1))
  node .opencode/bin/code-index.cjs code_graph_status --warm-only --timeout-ms 3000 --format jsonl >/dev/null 2>&1; [ $? -ne 75 ] && FAILS=$((FAILS+1))
  node .opencode/bin/skill-advisor.cjs advisor_status --workspaceRoot . --warm-only --timeout-ms 3000 --format jsonl >/dev/null 2>&1; [ $? -ne 75 ] && FAILS=$((FAILS+1))
done
echo "non-75 probes: $FAILS / 60"

wait $CHURN; echo "churn suite exit=$?"
AFTER=$(pgrep -f "mk-(spec-memory|code-index|skill-advisor)-launcher" | wc -l)
echo "launchers before=$BEFORE after=$AFTER"
ls "$SANDBOX/sock" 2>/dev/null || echo "socket dir empty/absent"
rm -rf "$SANDBOX"
```

### Expected

- `non-75 probes: 0 / 60` — every warm-only probe exits 75.
- The lifecycle suite (N-probe reap gating, SIGTERM transparent recycle) passes concurrently.
- Launcher delta zero and no socket created in the sandbox.

### Evidence

Shell transcript from running the Commands block exactly as written:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  22:50:41
   Duration  109ms (transform 16ms, setup 14ms, import 14ms, tests 14ms, environment 0ms)

non-75 probes: 20 / 60
churn suite exit=0
launchers before=       9 after=       9
```

The final `ls "$SANDBOX/sock" 2>/dev/null || echo "socket dir empty/absent"` command produced no additional output after `launchers before=       9 after=       9`.

### Pass / Fail

- **FAIL**: `non-75 probes: 20 / 60`; churn suite was green (`churn suite exit=0`) and launcher count was unchanged (`launchers before=       9 after=       9`), but the expected `non-75 probes: 0 / 60` condition did not hold.

### Failure Triage

A sporadic non-75 exit under churn suggests probe-time interference (for example fd exhaustion under load) — capture the failing envelope by rerunning without `>/dev/null`. A growing launcher count is a hard violation of the warm-only contract; bisect with scenario 428's single-shot form.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/tooling-and-scripts/spec-memory-cli-daemon-backed-surface.md` | Feature-catalog source for the warm-only contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `mcp_server/spec-memory-cli.ts` | Warm-only probe branch (retryable error, exit 75) |
| `.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts` | code-index warm-only branch |
| `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts` | skill-advisor warm-only branch |
| `mcp_server/tests/spec-memory-cli-lifecycle-hardening.vitest.ts` | Daemon churn driver (reap gating, transparent recycle) |

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 435
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling-and-scripts/cli-stress-warm-only-probe-churn.md`
