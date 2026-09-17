---
title: "HERMES-012 -- Run-budget expiry"
description: "Confirm `--run-budget` ends a long run with exit 0 and a partial answer rather than a distinct failure code, and that wall-clock overrun past the budget is expected for `HERMES-012`."
version: 1.0.0.0
---

# HERMES-012 -- Run-budget expiry

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `HERMES-012`.

---

## 1. OVERVIEW

`--run-budget` is a wrap-up signal, not a kill. The agent is told to finish as the budget expires, which means the process can and does run past the stated seconds, and the result is a truncated answer that still exits 0.

This scenario sets a deliberately tiny budget against a deliberately large task and records both the overrun and the truncation.

### Why This Matters

A caller that treats `--run-budget` as a hard bound will under-provision its own timeout and see lineages killed mid-write. The budget must sit one margin under the caller's timeout precisely because it does not itself bound the run.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-012` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--run-budget` ends a long run with exit 0 and a partial answer rather than a distinct failure code, and that wall-clock overrun past the budget is expected.
- Real user request: `Give Hermes a big job but a tiny time budget and show me what actually comes back.`
- Prompt: `Search the repository for every file under .skilled/skills/cli-external-orchestration and summarise each sibling cli-* packet in one paragraph each. Be exhaustive.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on each dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0`; measured elapsed time well above the 15-second budget; `~/.hermes/logs/agent.log` records `Run budget wrap-up notice injected (budget=15s, elapsed=<n>s)` for that session; stdout carries a partial answer that stops mid-work, with no distinct budget-expiry marker and no non-zero code.
- Evidence: The stated budget, the measured elapsed seconds, the exit code, the truncated stdout tail, and the stderr session id.
- Desired user-visible outcome: a concise verdict naming the observed signal and the evidence behind it.
- Pass/fail: PASS when the run exits 0 with a partial answer and the elapsed time exceeds the budget, matching the documented wrap-up semantics; FAIL when a distinct budget exit code appears, or when the run is killed at exactly the budget, since either would contradict the documented contract; SKIP only when a named environment blocker prevents the check, such as an unreachable provider or a missing credential.

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
  -t file,todo --max-turns 30 --run-budget 15 \
  -q "Search the repository for every file under .skilled/skills/cli-external-orchestration and summarise each sibling cli-* packet in one paragraph each. Be exhaustive." \
  </dev/null >out.txt 2>err.txt
echo $?
echo "elapsed=$(( $(date +%s) - s ))s"
tail -c 400 out.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-012 | Run-budget expiry | Confirm `--run-budget` ends a long run with exit 0 and a partial answer rather than a distinct failure code, and that wall-clock overrun past the budget is expected | `Search the repository for every file under .skilled/skills/cli-external-orchestration and summarise each sibling cli-* packet in one paragraph each. Be exhaustive.` | 1. `perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none -t file,todo --max-turns 30 --run-budget 15 -q "Search the repository for every file under .skilled/skills/cli-external-orchestration and summarise each sibling cli-* packet in one paragraph each. Be exhaustive." </dev/null >out.txt 2>err.txt` -> 2. `echo $?` -> 3. Record the measured elapsed seconds -> 4. `tail -c 400 out.txt` | Exit code `0`; measured elapsed time well above the 15-second budget; `~/.hermes/logs/agent.log` records `Run budget wrap-up notice injected (budget=15s, elapsed=<n>s)` for that session; stdout carries a partial answer that stops mid-work, with no distinct budget-expiry marker and no non-zero code | The stated budget, the measured elapsed seconds, the exit code, the truncated stdout tail, and the stderr session id | PASS when the run exits 0 with a partial answer and the elapsed time exceeds the budget, matching the documented wrap-up semantics; FAIL when a distinct budget exit code appears, or when the run is killed at exactly the budget, since either would contradict the documented contract; SKIP only when a named environment blocker prevents the check, such as an unreachable provider or a missing credential | A run that hits the outer `alarm` instead of wrapping up means the budget never fired; check that `--run-budget` was accepted and that no provider stream stalled, because the stale-stream watchdog fires at 600 s and retries rather than honouring the budget. In that case the caller's own timeout is the real bound, which is the documented behaviour, not a defect |

### Recorded Result

**Executed 2026-09-14, second pass** with `--run-budget 15` and `-t file,todo`: exit 0 after a measured **73 s** (session `20260914_230206_e76232`). The agent log records `Run budget wrap-up notice injected (budget=15s, elapsed=14s)`, and the response ends `Not done (cut off by the notice): reading any file bodies, completing the second page of the skills/ sweep ...`. Verdict PASS; the overrun and the truncation are both the documented behaviour, and the wrap-up notice is the host-side signal.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `cost-and-background/run-budget-expiry.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-reference.md](../../references/cli-reference.md) | Exit-code table, including run-budget expiry as exit 0 with a partial response |
| [SKILL.md](../../SKILL.md) | Why `--run-budget` stays one margin under the caller's timeout |

---

## 5. SOURCE METADATA

- Group: Cost And Background
- Playbook ID: HERMES-012
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `cost-and-background/run-budget-expiry.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
