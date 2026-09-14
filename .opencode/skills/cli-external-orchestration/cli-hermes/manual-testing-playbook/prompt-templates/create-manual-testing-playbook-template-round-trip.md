---
title: "HERMES-009 -- Second template round trip"
description: "Confirm a second generated prompt template, one whose canonical command file is large, also carries a Hermes session to its named contract and returns a non-empty answer for `HERMES-009`."
version: 1.0.0.0
---

# HERMES-009 -- Second template round trip

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `HERMES-009`.

---

## 1. OVERVIEW

One template working is not evidence that the template surface works. This scenario repeats HERMES-008's shape against a different, much larger canonical command definition, which is where the transport's weak point turns out to be.

The check is deliberately the same two-line reply, so any difference in outcome is attributable to the template and the size of what it points at.

### Why This Matters

Templates are generated in bulk from every command in the repo. A surface that works only for small command files would fail silently on exactly the heavyweight commands most worth delegating.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-009` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a second generated prompt template, one whose canonical command file is large, also carries a Hermes session to its named contract and returns a non-empty answer.
- Real user request: `Run our create-manual-testing-playbook command through Hermes and confirm it loaded the right contract.`
- Prompt: `Do not author anything. Read the canonical command file named above, then reply with exactly two lines: line 1 = TEMPLATE_OK, line 2 = the canonical command file path you were told to read.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on each dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0`; stdout is exactly two lines, the first `TEMPLATE_OK` and the second `.opencode/commands/create/manual-testing-playbook.md`; `wc -c` reports a non-zero byte count.
- Evidence: The byte count of stdout, the complete stdout, the exit code, the elapsed seconds, the stderr session id, and the matching `~/.hermes/logs/agent.log` lines for that session id when the response is empty.
- Desired user-visible outcome: a concise verdict naming the observed signal and the evidence behind it.
- Pass/fail: PASS when both lines are present; FAIL when stdout is empty or the path is wrong, including the exit-0-with-empty-stdout case, because exit code alone is not evidence of a delivered answer; SKIP only when a named environment blocker prevents the check, such as an unreachable provider or a missing credential.

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
cat .hermes/prompts/create-manual-testing-playbook.md > "$SCRATCH/qf-009.md"
printf 'Do not author anything. Read the canonical command file named above, then reply with exactly two lines: line 1 = TEMPLATE_OK, line 2 = the canonical command file path you were told to read.\n' >> "$SCRATCH/qf-009.md"

perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none \
  -t file,todo --max-turns 12 --run-budget 240 \
  --query-file - <"$SCRATCH/qf-009.md" >out.txt 2>err.txt
echo $?
wc -c out.txt
grep -n 'Turn ended with pending tool result' ~/.hermes/logs/agent.log | tail -1
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-009 | Second template round trip | Confirm a second generated prompt template, one whose canonical command file is large, also carries a Hermes session to its named contract and returns a non-empty answer | `Do not author anything. Read the canonical command file named above, then reply with exactly two lines: line 1 = TEMPLATE_OK, line 2 = the canonical command file path you were told to read.` | 1. `cat .hermes/prompts/create-manual-testing-playbook.md > <scratch>/qf-009.md` -> 2. Append the bounded request line to `<scratch>/qf-009.md` -> 3. `perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none -t file,todo --max-turns 12 --run-budget 240 --query-file - <<scratch>/qf-009.md >out.txt 2>err.txt` -> 4. `echo $?` -> 5. `wc -c out.txt` -> 6. `grep -n 'Turn ended with pending tool result' ~/.hermes/logs/agent.log | tail -1` | Exit code `0`; stdout is exactly two lines, the first `TEMPLATE_OK` and the second `.opencode/commands/create/manual-testing-playbook.md`; `wc -c` reports a non-zero byte count | The byte count of stdout, the complete stdout, the exit code, the elapsed seconds, the stderr session id, and the matching `~/.hermes/logs/agent.log` lines for that session id when the response is empty | PASS when both lines are present; FAIL when stdout is empty or the path is wrong, including the exit-0-with-empty-stdout case, because exit code alone is not evidence of a delivered answer; SKIP only when a named environment blocker prevents the check, such as an unreachable provider or a missing credential | An empty or fragmentary stdout with exit 0 is a tool-loop failure, not a transport failure: grep the session id in `~/.hermes/logs/agent.log` for `is not a deferrable tool` and `Turn ended with pending tool result`. Raising `--max-turns` does not fix it; putting the file tools in `-t` does. `HERMES-022` is the scenario that asserts the caller-side check |

### Recorded Result

**Executed 2026-09-14, second pass** (`-t file,todo`, `--max-turns 12 --run-budget 240`): exit 0 after **21 s** with 65 bytes on stdout, `TEMPLATE_OK` then `.opencode/commands/create/manual-testing-playbook.md`, session `20260914_225022_582426`. Verdict PASS. The first pass ran this twice on `-t search,todo` and got zero bytes both times, at 115 s and 114 s; the cause was `read_file` reaching the model only through the deferred catalog, and the file toolset removes it. `HERMES-022` keeps the detection gate that caught the original failure.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `prompt-templates/create-manual-testing-playbook-template-round-trip.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [inlined-persona-via-agent-router-template.md](../agent-routing/inlined-persona-via-agent-router-template.md) | The passing template round trip this scenario is compared against |
| [hermes-tools.md](../../references/hermes-tools.md) | Toolset table: which tools a `-t file,todo` session actually holds |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: HERMES-009
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `prompt-templates/create-manual-testing-playbook-template-round-trip.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
