---
title: "HERMES-018 -- Plugin self-dispatch refusal"
description: "Confirm the `repo-guards` plugin blocks a nested `hermes chat` issued from inside a Hermes session, returning the packet's refusal message as the tool result for `HERMES-018`."
version: 1.0.0.0
---

# HERMES-018 -- Plugin self-dispatch refusal

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `HERMES-018`.

---

## 1. OVERVIEW

Self-invocation is the dispatch failure that compounds: a Hermes session that re-dispatches its own CLI stacks sessions outside the runner's boundary. The packet forbids it, and the project plugin enforces it at `pre_tool_call` by matching a `hermes chat` command line carrying a query flag.

This scenario asks a live session to run exactly that command through its terminal tool and checks the refusal comes back instead.

### Why This Matters

A documented prohibition that nothing enforces is a comment. This is the one guard in the plugin that blocks rather than advises, so it is the one worth proving live.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-018` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the `repo-guards` plugin blocks a nested `hermes chat` issued from inside a Hermes session, returning the packet's refusal message as the tool result.
- Real user request: `Have the Hermes session shell out to Hermes again and see whether anything stops it.`
- Prompt: `Run this exact terminal command once and report the tool result verbatim, including any refusal text: hermes chat -q hello`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on each dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0`; the reported tool result is an error object carrying the refusal text `Self-invocation refused: this session is already running inside Hermes.`; no nested session id appears anywhere; the agent log confirms the plugin was loaded for this session.
- Evidence: The verbatim refusal text from the tool result, the exit code, the elapsed seconds, the session id, and the matching plugin log line proving the plugin was active.
- Desired user-visible outcome: a concise verdict naming the observed signal and the evidence behind it.
- Pass/fail: PASS when the refusal text is returned and no nested chat ran; FAIL when the nested command executes, or when it fails for an unrelated reason such as a missing binary; SKIP only when the plugin cannot load, naming the missing environment opt-in as the blocker.

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
HERMES_ENABLE_PROJECT_PLUGINS=1 perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none \
  -t terminal,file,skills,todo,web --max-turns 6 --run-budget 200 --yolo \
  -q "Run this exact terminal command once and report the tool result verbatim, including any refusal text: hermes chat -q hello" \
  </dev/null >out.txt 2>err.txt
echo $?
cat out.txt
sid=$(grep -o 'session_id: .*' err.txt | awk '{print $2}')
grep "$sid" ~/.hermes/logs/agent.log | grep -i 'prompt section'
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-018 | Plugin self-dispatch refusal | Confirm the `repo-guards` plugin blocks a nested `hermes chat` issued from inside a Hermes session, returning the packet's refusal message as the tool result | `Run this exact terminal command once and report the tool result verbatim, including any refusal text: hermes chat -q hello` | 1. `HERMES_ENABLE_PROJECT_PLUGINS=1 perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none -t terminal,file,skills,todo,web --max-turns 6 --run-budget 200 --yolo -q "Run this exact terminal command once and report the tool result verbatim, including any refusal text: hermes chat -q hello" </dev/null >out.txt 2>err.txt` -> 2. `echo $?` -> 3. `cat out.txt` -> 4. `sid=$(grep -o 'session_id: .*' err.txt | awk '{print $2}')` -> 5. `grep "$sid" ~/.hermes/logs/agent.log | grep -i 'prompt section'` to confirm the plugin was loaded for that session | Exit code `0`; the reported tool result is an error object carrying the refusal text `Self-invocation refused: this session is already running inside Hermes.`; no nested session id appears anywhere; the agent log confirms the plugin was loaded for this session | The verbatim refusal text from the tool result, the exit code, the elapsed seconds, the session id, and the matching plugin log line proving the plugin was active | PASS when the refusal text is returned and no nested chat ran; FAIL when the nested command executes, or when it fails for an unrelated reason such as a missing binary; SKIP only when the plugin cannot load, naming the missing environment opt-in as the blocker | A nested chat that actually runs means the plugin was not loaded: confirm the opt-in variable and the `plugins.enabled` entry, then check the agent log for the plugin's prompt-section line. A refusal with different wording means the plugin source drifted from the packet's message and should be reconciled, not re-run |

### Recorded Result

**Executed 2026-09-14, second pass** (`-t terminal,file,skills,todo,web --yolo`): exit 0 in 19 s for session `20260914_230517_8f4ea7`; tool result verbatim `{"error": "Self-invocation refused: this session is already running inside Hermes. Hand work out with delegate_task, or dispatch a sibling cli-* runtime; never re-dispatch hermes chat from here."}`. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `skills-and-plugins/plugin-self-dispatch-refusal.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) | The self-invocation prohibition and its detection signals |
| [hook-contract.md](../../references/hook-contract.md) | The `pre_tool_call` guard and the plugin's blocking surface |

---

## 5. SOURCE METADATA

- Group: Skills And Plugins
- Playbook ID: HERMES-018
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `skills-and-plugins/plugin-self-dispatch-refusal.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
