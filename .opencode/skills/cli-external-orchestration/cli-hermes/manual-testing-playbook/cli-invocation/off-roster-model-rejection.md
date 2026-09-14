---
title: "HERMES-003 -- Off-roster model rejection"
description: "Confirm an off-roster model id fails fast with exit 1 and a gateway diagnostic on stdout rather than silently falling back to another model for `HERMES-003`."
version: 1.0.0.0
---

# HERMES-003 -- Off-roster model rejection

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `HERMES-003`.

---

## 1. OVERVIEW

The packet pins a closed two-id roster. The guarantee that matters operationally is not that the roster is documented but that an id outside it cannot quietly succeed against some other model, which would make a cross-validation result meaningless.

This scenario dispatches a deliberately nonexistent id and checks the failure is loud, immediate, and readable on stdout.

### Why This Matters

A silent model fallback turns every downstream comparison into a comparison against an unknown model. Fail-fast is the property being proved, and the exit code plus stdout is where it shows.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-003` and confirm the expected signals without contradictory evidence.

- Objective: Confirm an off-roster model id fails fast with exit 1 and a gateway diagnostic on stdout rather than silently falling back to another model.
- Real user request: `What happens if I point the Hermes executor at a model that is not on our roster?`
- Prompt: `Say OK.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on each dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `1`; stdout carries the gateway rejection naming the requested id, of the shape `HTTP 400: Requested model <id> not supported`; stderr still carries a `session_id:` line; no answer text appears.
- Evidence: The exact rejected model id, the exit code, the complete stdout diagnostic, the stderr session id, and the elapsed seconds showing the failure was pre-inference.
- Desired user-visible outcome: a concise verdict naming the observed signal and the evidence behind it.
- Pass/fail: PASS when the exit code is 1 and stdout names the rejected id; FAIL when the exit code is 0, an answer is produced, or the diagnostic omits the id; SKIP only when a named environment blocker prevents the check, such as an unreachable provider or a missing credential, which is a different failure and must be named as such.

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
perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool \
  --provider llmgateway --model deepseek-v9.9-nonexistent --reasoning none \
  -t file,todo --max-turns 2 --run-budget 60 \
  -q "Say OK." </dev/null >out.txt 2>err.txt
echo $?
cat out.txt
cat err.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-003 | Off-roster model rejection | Confirm an off-roster model id fails fast with exit 1 and a gateway diagnostic on stdout rather than silently falling back to another model | `Say OK.` | 1. `perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model deepseek-v9.9-nonexistent --reasoning none -t file,todo --max-turns 2 --run-budget 60 -q "Say OK." </dev/null >out.txt 2>err.txt` -> 2. `echo $?` -> 3. `cat out.txt` -> 4. `cat err.txt` | Exit code `1`; stdout carries the gateway rejection naming the requested id, of the shape `HTTP 400: Requested model <id> not supported`; stderr still carries a `session_id:` line; no answer text appears | The exact rejected model id, the exit code, the complete stdout diagnostic, the stderr session id, and the elapsed seconds showing the failure was pre-inference | PASS when the exit code is 1 and stdout names the rejected id; FAIL when the exit code is 0, an answer is produced, or the diagnostic omits the id; SKIP only when a named environment blocker prevents the check, such as an unreachable provider or a missing credential, which is a different failure and must be named as such | A zero exit with an answer means a fallback model served the request; capture the gateway's response body and escalate, because the roster guarantee is broken. A diagnostic mentioning `reasoning_effort` instead means the id exists but rejects the reasoning parameter, which is a different, weaker signal and should be re-run with a clearly nonexistent id |

### Recorded Result

**Executed 2026-09-14, second pass** (`-t file,todo`): exit 1 in 4 s, stdout `HTTP 400: Requested model deepseek-v9.9-nonexistent not supported`, stderr `session_id: 20260914_225519_1af6b3`. Verdict PASS. A second probe with a real but non-reasoning id (`gpt-4o-mini`) also exited 1, with `HTTP 400: Model gpt-4o-mini does not support reasoning`, so an off-roster id can fail on either axis.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `cli-invocation/off-roster-model-rejection.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-reference.md](../../references/cli-reference.md) | Exit-code table, including `result.failed` exit 1 with the gateway error on stdout |
| [providers-and-models.md](../../references/providers-and-models.md) | The closed two-id roster and the llmgateway provider contract |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: HERMES-003
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `cli-invocation/off-roster-model-rejection.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
