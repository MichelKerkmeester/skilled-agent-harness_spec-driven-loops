---
title: "HERMES-013 -- Max-turns bound"
description: "Confirm `--max-turns` caps the agent loop, ends the run at the cap with exit 0, and produces a response that states the cap was hit rather than inventing results for `HERMES-013`."
version: 1.0.0.0
---

# HERMES-013 -- Max-turns bound

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `HERMES-013`.

---

## 1. OVERVIEW

`--max-turns` is the turn-count bound that sits alongside the wall-clock budget. Where the budget asks the agent to wrap up, the turn cap stops the loop outright.

This scenario sets the cap to one against a task that explicitly requires several tool round trips, so the cap must bite, and checks that the truncated result is honest about what did not happen.

### Why This Matters

A turn cap that silently produces a confident but unsupported answer is worse than no cap. The property worth proving is that the bound is both enforced and visible in the response.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-013` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--max-turns` caps the agent loop, ends the run at the cap with exit 0, and produces a response that states the cap was hit rather than inventing results.
- Real user request: `Cap the Hermes run at one turn and show me it stops there instead of making things up.`
- Prompt: `Use the file-search tool at least three separate times to find the string 'llmgateway' in this repository, then report every file path you found.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on each dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0`; measured elapsed time far below the 200-second budget; `~/.hermes/logs/agent.log` records `Reached maximum iterations (1). Requesting summary...` and `Turn ended: reason=max_iterations_reached(1/1)` for that session id; the returned summary reports only work the single iteration actually did.
- Evidence: The exit code, the measured elapsed seconds, the complete stdout including the cap statement, and the stderr session id.
- Desired user-visible outcome: a concise verdict naming the observed signal and the evidence behind it.
- Pass/fail: PASS when the agent log records `max_iterations_reached` for that session and the response reports only what the capped run actually did; FAIL when the response lists file paths it could not have searched for, or when the run continues past the cap; SKIP only when a named environment blocker prevents the check, such as an unreachable provider or a missing credential.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including `command -v hermes`.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr, exit code and elapsed seconds separately for every dispatch.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
s=$(date +%s)
perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none \
  -t file,todo --max-turns 1 --run-budget 200 \
  -q "Use the file-search tool at least three separate times to find the string 'llmgateway' in this repository, then report every file path you found." \
  </dev/null >out.txt 2>err.txt
echo $?
echo "elapsed=$(( $(date +%s) - s ))s"
cat out.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-013 | Max-turns bound | Confirm `--max-turns` caps the agent loop, ends the run at the cap with exit 0, and produces a response that states the cap was hit rather than inventing results | `Use the file-search tool at least three separate times to find the string 'llmgateway' in this repository, then report every file path you found.` | 1. `perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none -t file,todo --max-turns 1 --run-budget 200 -q "Use the file-search tool at least three separate times to find the string 'llmgateway' in this repository, then report every file path you found." </dev/null >out.txt 2>err.txt` -> 2. `echo $?` -> 3. Record the measured elapsed seconds -> 4. `cat out.txt` | Exit code `0`; measured elapsed time far below the 200-second budget; `~/.hermes/logs/agent.log` records `Reached maximum iterations (1). Requesting summary...` and `Turn ended: reason=max_iterations_reached(1/1)` for that session id; the returned summary reports only work the single iteration actually did | The exit code, the measured elapsed seconds, the complete stdout including the cap statement, and the stderr session id | PASS when the agent log records `max_iterations_reached` for that session and the response reports only what the capped run actually did; FAIL when the response lists file paths it could not have searched for, or when the run continues past the cap; SKIP only when a named environment blocker prevents the check, such as an unreachable provider or a missing credential | A response containing plausible file paths under a one-turn cap is a fabrication and should be escalated with the transcript, not re-run. A run that clearly performs several turns means the cap was not applied; confirm `--max-turns` was accepted and not overridden by a configured default |

### Recorded Result

**Executed 2026-09-14, second pass** with `--max-turns 1` and `-t file,todo`: exit 0 after 64 s (session `20260914_225938_85c996`). The agent log records `⚠️  Reached maximum iterations (1). Requesting summary...` and `Turn ended: reason=max_iterations_reached(1/1) ... api_calls=1/1 tool_turns=1`. The forced summary reports real file paths found in that single iteration and closes with its own caveat that both content searches hit the 250-result cap. Verdict PASS. Note the behavioural change from the first pass: with the file tools direct rather than deferred, one iteration completes real work, so the cap's proof is the log line rather than a bare refusal to answer.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `cost-and-background/max-turns-bound.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-reference.md](../../references/cli-reference.md) | `--max-turns N` and the Hermes default of 500 |
| [run-budget-expiry.md](./run-budget-expiry.md) | The wall-clock bound this turn cap sits alongside |

---

## 5. SOURCE METADATA

- Group: Cost And Background
- Playbook ID: HERMES-013
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `cost-and-background/max-turns-bound.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
