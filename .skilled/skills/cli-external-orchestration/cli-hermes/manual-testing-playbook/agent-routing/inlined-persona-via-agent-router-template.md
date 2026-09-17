---
title: "HERMES-008 -- Inlined persona via the agent-router template"
description: "Confirm the generated `.hermes/prompts/agent-router.md` template routes a Hermes session to the canonical OpenCode command definition when delivered through `--query-file -` for `HERMES-008`."
version: 1.0.0.0
---

# HERMES-008 -- Inlined persona via the agent-router template

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `HERMES-008`.

---

## 1. OVERVIEW

Hermes has no flag that loads an agent file, so a persona reaches a dispatch only by being inlined into the prompt. The repo's generated prompt templates are the repeatable vehicle: each one names the canonical command file and instructs the session to treat it as the operating contract, and the caller appends the user request below its last line.

This scenario runs the agent-router template end to end with a bounded task that proves routing without executing the routed work.

### Why This Matters

If a template does not reliably carry the session to its canonical definition, every command dispatched through Hermes silently degrades to whatever the model already believed. The proof is the session naming the canonical path it was told to read.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-008` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the generated `.hermes/prompts/agent-router.md` template routes a Hermes session to the canonical OpenCode command definition when delivered through `--query-file -`.
- Real user request: `Route this through our agent-router command on Hermes and tell me it picked up the right contract.`
- Prompt: `Do not execute the routed work. Read the canonical command file named above, then reply with exactly two lines: line 1 = ROUTER_OK, line 2 = the canonical command file path you were told to read.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on each dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0`; stdout is exactly two lines, the first `ROUTER_OK` and the second `.skilled/commands/agent-router.md`; stderr carries a `session_id:` line.
- Evidence: The composed prompt file, the complete stdout, the exit code, the elapsed seconds, and the stderr session id.
- Desired user-visible outcome: a concise verdict naming the observed signal and the evidence behind it.
- Pass/fail: PASS when both lines are present and the path matches the template's named canonical file; FAIL when the session invents a different path, executes the routed work, or returns an empty response; SKIP only when a named environment blocker prevents the check, such as an unreachable provider or a missing credential.

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
cat .hermes/prompts/agent-router.md > "$SCRATCH/qf-008.md"
printf 'Do not execute the routed work. Read the canonical command file named above, then reply with exactly two lines: line 1 = ROUTER_OK, line 2 = the canonical command file path you were told to read.\n' >> "$SCRATCH/qf-008.md"

perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none \
  -t file,todo --max-turns 8 --run-budget 200 \
  --query-file - <"$SCRATCH/qf-008.md" >out.txt 2>err.txt
echo $?
cat out.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-008 | Inlined persona via the agent-router template | Confirm the generated `.hermes/prompts/agent-router.md` template routes a Hermes session to the canonical OpenCode command definition when delivered through `--query-file -` | `Do not execute the routed work. Read the canonical command file named above, then reply with exactly two lines: line 1 = ROUTER_OK, line 2 = the canonical command file path you were told to read.` | 1. `cat .hermes/prompts/agent-router.md > <scratch>/qf-008.md` -> 2. Append the bounded request line to `<scratch>/qf-008.md` -> 3. `perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none -t file,todo --max-turns 8 --run-budget 200 --query-file - <<scratch>/qf-008.md >out.txt 2>err.txt` -> 4. `echo $?` -> 5. `cat out.txt` | Exit code `0`; stdout is exactly two lines, the first `ROUTER_OK` and the second `.skilled/commands/agent-router.md`; stderr carries a `session_id:` line | The composed prompt file, the complete stdout, the exit code, the elapsed seconds, and the stderr session id | PASS when both lines are present and the path matches the template's named canonical file; FAIL when the session invents a different path, executes the routed work, or returns an empty response; SKIP only when a named environment blocker prevents the check, such as an unreachable provider or a missing credential | A wrong path usually means the template drifted from its generator; re-run `sync-prompts-hermes.cjs --check`. An empty response is the tool-loop failure mode recorded under HERMES-009; check `~/.hermes/logs/agent.log` for a `Turn ended with pending tool result` warning before calling it a routing defect |

### Recorded Result

**Executed 2026-09-14, second pass** (`-t file,todo`): exit 0 after 23 s, stdout `ROUTER_OK` then `.skilled/commands/agent-router.md`, session `20260914_225638_fa77e9`. The first pass ran the same check on `-t search,todo` and took 107 s, so the file toolset is both correct and markedly faster. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `agent-routing/inlined-persona-via-agent-router-template.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [agent-delegation.md](../../references/agent-delegation.md) | Persona inlining and why Hermes has no agent-file surface |
| [SYNC.md](../../../../../../.hermes/SYNC.md) | How `.hermes/prompts/*.md` are generated and what a template is for |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: HERMES-008
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `agent-routing/inlined-persona-via-agent-router-template.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
