---
title: "CC-027 -- Background execution"
description: "This scenario validates background execution for `CC-027`. It focuses on confirming a Claude Code dispatch can run in the background and the parent shell can collect output without blocking."
version: 1.1.0.7
---

# CC-027 -- Background execution

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-027`.

---

## 1. OVERVIEW

This scenario validates Background execution for `CC-027`. It focuses on confirming a Claude Code dispatch backgrounded with `&` runs without blocking the parent shell, that `wait` collects the exit code cleanly and that captured stdout contains the expected response. The companion comparative validation (incremental vs batch streaming) lives at `cli-invocation/stream-json-incremental-output.md`.

### Why This Matters

Background execution is the load-bearing pattern for parallel cross-AI workloads documented in SKILL.md §3 (How It Works). Operators that run multiple Claude Code dispatches in parallel rely on `&` plus `wait` to fan out without blocking. If a backgrounded dispatch silently consumes stdin from the parent loop, the canonical `</dev/null` redirect breaks or the parent cannot collect the exit code, parallel workloads regress to serial execution and budgets blow out.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-027` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a backgrounded `claude -p` dispatch with `</dev/null` runs without blocking, that `wait` collects exit 0 and that the captured stdout file contains the expected response.
- Real user request: `Kick off a quick Claude Code analysis in the background while I keep working in this shell, then collect the answer when it finishes.`
- Prompt: `Run Claude Code in the background, keep the shell responsive, then verify wait exit 0 and non-empty captured output.`
- Expected execution process: External-AI orchestrator dispatches a small read-only prompt with `&` plus `</dev/null` plus output redirection, runs an unrelated quick command in the parent while the dispatch runs, then `wait`s and verifies the captured response.
- Expected signals: `wait` returns exit 0. Captured stdout file is non-empty. Parent shell remained responsive (the unrelated command between dispatch and wait completed normally). Dispatched command line includes `&` and `</dev/null`.
- Desired user-visible outcome: A backgrounded analysis result the operator can use as proof the parallel-execution pattern works.
- Pass/fail: PASS if `wait` exits 0 AND captured file is non-empty AND parent shell stayed responsive. FAIL if `wait` errors, output is empty or parent shell blocked.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Define the small read-only prompt.
3. In ONE shell invocation: clear prior artifacts, dispatch in the background with `</dev/null` and output redirection, capture `$!`, run an unrelated quick command to confirm responsiveness, then `wait` for that same captured PID and print its exit code — a later, separate shell cannot `wait` on a PID it did not fork.
4. Verify the captured output file is non-empty.
5. Return a verdict naming the temp file, the wait exit code and a short response snippet.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-027 | Background execution | Confirm a backgrounded claude -p dispatch with `</dev/null` runs without blocking and wait collects exit 0 | `Run Claude Code in the background, keep the shell responsive, then verify wait exit 0 and non-empty captured output.` | 1. `bash: rm -f /tmp/cc-027-output.txt /tmp/cc-027-pid.txt; claude -p "Summarize the core principle of cli-claude-code in one sentence based on @./.opencode/skills/cli-external/cli-claude-code/SKILL.md." --permission-mode plan --output-format text > /tmp/cc-027-output.txt 2>&1 </dev/null & pid=$!; echo "$pid" > /tmp/cc-027-pid.txt; echo "PID: $pid"; date '+%H:%M:%S baseline'; wait "$pid"; echo "wait_exit=$?"; test -s /tmp/cc-027-output.txt && echo OK_NONEMPTY; head -c 80 /tmp/cc-027-output.txt` | Step 1 (single shell): prior artifacts cleared; PID captured immediately after backgrounding (parent did not block); PID and baseline timestamp printed without delay; `wait_exit=0` printed for the SAME captured PID; `OK_NONEMPTY` printed; first 80 chars of response printed | `/tmp/cc-027-output.txt`, `/tmp/cc-027-pid.txt`, terminal exit codes and snippet | PASS if wait exits 0 for the captured PID AND captured file is non-empty AND the PID/timestamp echo returned promptly (proving the parent shell stayed responsive before the `wait`); FAIL if wait errors, `wait: pid ... is not a child of this shell`, output is empty, or parent shell blocked | 1. If the parent shell blocked, the `</dev/null` redirect was missing, re-test with the redirect explicit; 2. If `wait` reports the PID is not a child of this shell, the launch and `wait` steps were split across separate tool-call shell invocations — re-run them as one shell block as shown above; 3. If wait returns non-zero, inspect the captured file for the error message and fix the prompt; 4. If output is empty but wait returned 0, check stderr was captured into the same file via `2>&1` |

### Optional Supplemental Checks

For full parallel validation, fan out 3 backgrounded dispatches with distinct prompts and verify all 3 produce non-empty outputs after `wait`. Record cumulative wall-clock and confirm it is materially less than the sum of serial runtimes for the same prompts.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/integration_patterns.md` | Background execution pattern |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` (line 257) | Background execution example with `&` |
| `../../references/integration_patterns.md` | Cross-AI orchestration patterns including parallel dispatch |

---

## 5. SOURCE METADATA

- Group: Cost And Background
- Playbook ID: CC-027
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `cost-and-background/background-execution.md`
