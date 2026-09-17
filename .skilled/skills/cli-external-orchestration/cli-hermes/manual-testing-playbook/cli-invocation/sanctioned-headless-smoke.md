---
title: "HERMES-001 -- Sanctioned headless smoke"
description: "Confirm the sanctioned headless dispatch shape reaches the llmgateway provider, answers on stdout, and emits `session_id:` on stderr with exit 0 for `HERMES-001`."
version: 1.0.0.0
---

# HERMES-001 -- Sanctioned headless smoke

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `HERMES-001`.

---

## 1. OVERVIEW

This scenario is the package's liveness gate. It runs the exact sanctioned headless shape from the packet's CLI reference against the smallest possible task, so a failure anywhere else in the package can be attributed to the scenario rather than to a missing binary, a missing provider block, or a broken credential.

It is also the scenario that supplies the captured `session_id` every session-continuity check resumes from, so it runs first in any wave.

### Why This Matters

Every other Hermes scenario inherits this one's preconditions. Running it first turns a package-wide failure into a one-line diagnosis: no binary, no provider, or no credential.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-001` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the sanctioned headless dispatch shape reaches the llmgateway provider, answers on stdout, and emits `session_id:` on stderr with exit 0.
- Real user request: `Check that our Hermes executor is actually alive before I hand it any real work.`
- Prompt: `Reply with exactly the single word ALIVE and nothing else.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on each dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0`; stdout is exactly `ALIVE`; stderr carries one `session_id: <id>` line and nothing else.
- Evidence: The resolved binary path, the reported Hermes version, exit code, complete stdout, complete stderr, elapsed seconds, and the captured session id for later reuse.
- Desired user-visible outcome: a concise verdict naming the observed signal and the evidence behind it.
- Pass/fail: PASS when the exit code is 0, stdout carries the requested word, and stderr carries a `session_id:` line; FAIL when the exit code is non-zero, stdout is empty, or no session id is emitted; SKIP only when `command -v hermes` fails or `hermes status` reports no provider, naming that exact blocker.

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
command -v hermes
hermes --version </dev/null

perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none \
  -t file,todo --max-turns 4 --run-budget 120 \
  -q "Reply with exactly the single word ALIVE and nothing else." \
  </dev/null >out.txt 2>err.txt
echo $?
cat out.txt
cat err.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-001 | Sanctioned headless smoke | Confirm the sanctioned headless dispatch shape reaches the llmgateway provider, answers on stdout, and emits `session_id:` on stderr with exit 0 | `Reply with exactly the single word ALIVE and nothing else.` | 1. `command -v hermes` -> 2. `hermes --version </dev/null` -> 3. `perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none -t file,todo --max-turns 4 --run-budget 120 -q "Reply with exactly the single word ALIVE and nothing else." </dev/null >out.txt 2>err.txt` -> 4. `echo $?` -> 5. `cat out.txt` -> 6. `cat err.txt` | Exit code `0`; stdout is exactly `ALIVE`; stderr carries one `session_id: <id>` line and nothing else | The resolved binary path, the reported Hermes version, exit code, complete stdout, complete stderr, elapsed seconds, and the captured session id for later reuse | PASS when the exit code is 0, stdout carries the requested word, and stderr carries a `session_id:` line; FAIL when the exit code is non-zero, stdout is empty, or no session id is emitted; SKIP only when `command -v hermes` fails or `hermes status` reports no provider, naming that exact blocker | Read the exit code first, then stdout, then stderr. An exit 1 with `No inference provider configured` on stdout is an operator provider-block gap, not a dispatch defect. An empty stdout with exit 0 is the silent-failure mode recorded under HERMES-009 and is a FAIL here |

### Recorded Result

**Executed 2026-09-14, second pass** (`glm-5.3-flash`, `--reasoning none`, `-t file,todo`): exit 0 in 13 s, stdout `ALIVE`, stderr `session_id: 20260914_225534_91804d`. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `cli-invocation/sanctioned-headless-smoke.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-reference.md](../../references/cli-reference.md) | The sanctioned dispatch shape, exit-code table, and the `session_id:` stderr contract |
| [SKILL.md](../../SKILL.md) | The dispatch shape, the closed model roster, and the hard rules this command satisfies |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: HERMES-001
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `cli-invocation/sanctioned-headless-smoke.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
