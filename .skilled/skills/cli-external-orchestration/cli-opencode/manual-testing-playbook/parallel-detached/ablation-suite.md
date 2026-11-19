---
title: "CO-028 -- Ablation suite via parallel detached sessions"
description: "This scenario validates the ablation suite pattern for `CO-028`. It focuses on confirming TEMPLATE 7 from prompt-templates.md (CIDI framework, parallel detached) can drive a small ablation comparison with results captured to per-session state files."
version: 1.4.6.0
---

# CO-028 -- Ablation suite via parallel detached sessions

**Version note.** The commands in this scenario target OpenCode 2 (2.3.2). The effort level rides on the model id as `-m provider/model#<level>`, and `run` has no port flag, so each worker reaches a headless server started with `opencode serve` through `--server <url>`.

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-028`.

---

## 1. OVERVIEW

> **DESTRUCTIVE SCENARIO (CHK-033):** This scenario publishes nothing. `--share` is not a `run` flag, so both ablation workers publish nothing. Both workers still run inside the sandbox tmpdir it names (`/tmp/co-share-sandbox-028/`) so no dispatch touches the operator's real project tree. Recovery and teardown steps in section 3 (Failure Triage) MUST be executed after every run, pass or fail.

This scenario validates Ablation suite via parallel detached sessions for `CO-028`. It focuses on confirming TEMPLATE 7 (Ablation suite, CIDI framework) can drive a small ablation comparison across two configurations dispatched in parallel detached OpenCode sessions, with each session writing structured results to its own output file for downstream comparison.

### Why This Matters

Ablation suites are one of the canonical use cases for parallel detached sessions (per `references/opencode-tools.md` §3 + `references/integration-patterns.md` §3). Each ablation must run in an isolated session so plugin state, MCP state and conversation context never leak between configurations. The aggregator process compares the per-session outputs and produces the verdict. If the parallel detached sessions silently share state, ablation results become meaningless. This test proves the pattern with two real ablation configurations.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-028` and confirm the expected signals without contradictory evidence.

- Objective: Confirm two parallel detached sessions running an ablation comparison (`#high` vs `#minimal`) produce two distinct outputs with measurably different reasoning depth, demonstrating the effort level drives the depth difference.
- Real user request: `Run a small ablation suite with two parallel detached opencode run sessions: one with #high and one with #minimal on the model id. Both ask the same multi-dimensional architecture question. Confirm the high-effort session produces a noticeably deeper response.`
- RCAF Prompt: `As an in-OpenCode operator (or fresh shell) running an ablation suite per TEMPLATE 7 (CIDI framework), dispatch two parallel detached opencode run sessions against a headless server, one with #high and one with #minimal on the model id, both asking the same multi-dimensional architecture trade-off question. Capture each session's output to its own log file. Compute the byte-count ratio between the two responses. Verify the high-effort response is at least 2x larger than the minimal-effort response. Return a concise pass/fail verdict naming the byte-count ratio and the session ids.`
- Expected execution process: The external-AI orchestrator pre-creates the output dir, starts a headless server with `opencode serve`, dispatches two parallel detached sessions with the same prompt but different effort levels, waits for both, computes byte counts of the two response payloads, validates the ratio is at least 2.0 and surfaces the session ids.
- Expected signals: Both dispatches exit 0. Two distinct `sessionID` values. High-effort response byte count is at least 2x minimal-effort byte count. Both responses reference the same architectural question.
- Desired user-visible outcome: Verdict naming the byte-count ratio, both session ids and the recommended effort level for ablation default.
- Pass/fail: PASS if both exit 0 AND distinct session ids AND ratio >= 2.0. FAIL if either dispatch fails, ids collide or ratio is below 2.0 (the effort level has no measurable effect).

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Pre-create the sandbox tmpdir and ablation dir: `rm -rf /tmp/co-share-sandbox-028/ /tmp/co-028-ablation/ && mkdir -p /tmp/co-share-sandbox-028/ /tmp/co-028-ablation/`. NEVER run the dispatch in the operator project tree.
3. Start a headless server with `opencode serve` and read the URL it prints.
4. Dispatch two parallel detached sessions from `/tmp/co-share-sandbox-028/` with `--server <url>`, the same prompt, but different effort levels.
5. Wait for both.
6. Compute byte counts and ratio.
7. Validate distinct session ids.
8. Confirm both workers passed no `--share`, so nothing was published. The sandbox directory MUST NOT be the operator project tree.
9. After the run (pass or fail) remove the sandbox tmpdir via `rm -rf /tmp/co-share-sandbox-028/` and confirm the ablation logs are outside the project tree.
10. Return a verdict naming ratio, ids and sandbox teardown confirmation.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-028 | Ablation suite via parallel detached sessions | Confirm that a 2-session ablation (`#high` vs `#minimal`) produces measurably different reasoning depth | `As an in-OpenCode operator (or fresh shell) running an ablation suite per TEMPLATE 7 (CIDI framework), dispatch two parallel detached opencode run sessions against a headless server, one with #high and one with #minimal on the model id, both asking the same multi-dimensional architecture trade-off question. Capture each session's output to its own log file. Compute the byte-count ratio between the two responses. Verify the high-effort response is at least 2x larger than the minimal-effort response. Return a concise pass/fail verdict naming the byte-count ratio and the session ids.` | 1. `bash: rm -rf /tmp/co-share-sandbox-028/ /tmp/co-028-ablation && mkdir -p /tmp/co-share-sandbox-028/ /tmp/co-028-ablation` -> 2. `bash: opencode serve > /tmp/co-028-serve.log 2>&1 & echo "SERVE_PID: $!"; sleep 3; head -5 /tmp/co-028-serve.log` -> 3. `bash: cd /tmp/co-share-sandbox-028/ && opencode run --server http://127.0.0.1:4096 -m llmgateway/deepseek-v4.1-flash-1017#high --format json "Ablation suite worker A (effort high). Compare event sourcing vs traditional CRUD for an order management system across consistency, query performance, learning curve, scalability, and ops cost. Recommend one with confidence." > /tmp/co-028-ablation/effort-high.jsonl 2>&1 </dev/null & pid_a=$!; opencode run --server http://127.0.0.1:4096 -m llmgateway/deepseek-v4.1-flash-1017#minimal --format json "Ablation suite worker B (effort minimal). Compare event sourcing vs traditional CRUD for an order management system across consistency, query performance, learning curve, scalability, and ops cost. Recommend one with confidence." > /tmp/co-028-ablation/effort-minimal.jsonl 2>&1 </dev/null & pid_b=$!; wait "$pid_a"; a=$?; wait "$pid_b"; b=$?; echo "$a" > /tmp/co-028-ablation/exit-high.txt; echo "$b" > /tmp/co-028-ablation/exit-minimal.txt; echo "WAIT_A: $a WAIT_B: $b"` -> 4. `bash: a=$(cat /tmp/co-028-ablation/exit-high.txt); b=$(cat /tmp/co-028-ablation/exit-minimal.txt); [ "$a" -eq 0 ] && [ "$b" -eq 0 ] && echo "DISPATCH_OK" \|\| echo "DISPATCH_FAIL a=$a b=$b"; HIGH=$(jq -r 'select(.type == "text") \| .part.text' /tmp/co-028-ablation/effort-high.jsonl \| wc -c); MIN=$(jq -r 'select(.type == "text") \| .part.text' /tmp/co-028-ablation/effort-minimal.jsonl \| wc -c); echo "HIGH=$HIGH MIN=$MIN RATIO=$(echo "scale=2; $HIGH/$MIN" \| bc 2>/dev/null \|\| echo NA)"` -> 5. `bash: SID_HIGH=$(jq -r 'select(.type == "step_start") \| .sessionID' /tmp/co-028-ablation/effort-high.jsonl \| head -1); SID_MIN=$(jq -r 'select(.type == "step_start") \| .sessionID' /tmp/co-028-ablation/effort-minimal.jsonl \| head -1); [ "$SID_HIGH" != "$SID_MIN" ] && [ -n "$SID_HIGH" ] && [ -n "$SID_MIN" ] && echo "DISTINCT_SESSIONS_OK" \|\| echo "DISTINCT_FAIL"` | Step 1: sandbox tmpdir and ablation dir created. Step 2: the server starts and prints its URL. Step 3: both `pid_a` and `pid_b` captured in the same shell invocation, `WAIT_A` and `WAIT_B` both exit 0, and both workers start in `/tmp/co-share-sandbox-028/`, not the operator project tree. Step 4: prints `DISPATCH_OK` (asserted before parsing outputs), HIGH and MIN byte counts captured. RATIO >= 2.0. Step 5: prints DISTINCT_SESSIONS_OK | `/tmp/co-028-ablation/effort-{high,minimal}.jsonl`, `/tmp/co-028-serve.log`, terminal ratio + session id output, sandbox tmpdir path | No `--share` is passed, so nothing is published. The sandbox directory MUST NOT be the operator project tree. PASS requires both `a` and `b` exit statuses equal 0 (captured via `pid_a`/`pid_b` in the dispatch shell, not a bare `wait`) AND distinct session ids AND RATIO >= 2.0 AND both workers started in the sandbox tmpdir. FAIL if either dispatch fails, ids collide, ratio < 2.0, OR either worker started outside the sandbox tmpdir | 1. Recovery / teardown (RUN AFTER EVERY RUN, pass or fail): (a) Remove the sandbox tmpdir with `rm -rf /tmp/co-share-sandbox-028/`. (b) Remove the ablation output dir with `rm -rf /tmp/co-028-ablation/` and `/tmp/co-028-serve.log`. 2. If RATIO is close to 1.0, the effort level may be silently ignored. See CO-012 for effort-effect troubleshooting. 3. If session ids collide, the parallel detached pattern is leaking state. Verify both workers reached the server and re-dispatch. 4. If `a` or `b` is non-zero, inspect the corresponding log file for stderr clues. 5. If ratio computation fails, `bc` may be missing. Fall back to manual computation: `printf "%d %d\n" $HIGH $MIN`. 6. If the server prints a URL other than `http://127.0.0.1:4096`, pass that URL to `--server` instead. 7. NEVER run the dispatch in the operator project tree |

### Optional Supplemental Checks

For per-session state isolation, run `opencode session export "$SID_HIGH"` and `opencode session export "$SID_MIN"` and confirm each returns its own session id and its own message history. Confirm no cross-session message leakage occurred. This stress-tests the session isolation contract under parallel ablation load.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../assets/prompt-templates.md` (TEMPLATE 7: ABLATION SUITE) | Canonical ablation suite pattern |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | ALWAYS rule 5 (background dispatch `</dev/null`) |
| `../../references/opencode-tools.md` (§3 PARALLEL DETACHED SESSIONS) | Documents the unique value prop |
| `../../references/integration-patterns.md` (§3 USE CASE 2) | The use case 2 contract |

---

## 5. SOURCE METADATA

- Group: Parallel Detached
- Playbook ID: CO-028
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `parallel-detached/ablation-suite.md`
