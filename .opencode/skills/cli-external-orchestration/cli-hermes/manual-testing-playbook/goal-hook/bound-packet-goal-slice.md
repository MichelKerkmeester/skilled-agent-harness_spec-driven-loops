---
title: "HERMES-020 -- Bound packet goal slice"
description: "Confirm `HERMES_SPEC_FOLDER` puts the bound packet's path and its durable goal slice into the session prompt, where the model can quote them for `HERMES-020`."
version: 1.0.0.0
---

# HERMES-020 -- Bound packet goal slice

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `HERMES-020`.

---

## 1. OVERVIEW

Hermes has no session identity the shared goal core can bind to, so the packet path arrives in the environment instead. With `HERMES_SPEC_FOLDER` set, the plugin reads that packet's `goal.md`, strips the frontmatter, takes the directive block, and appends `Bound packet: <path>` plus that slice to the session-context section.

This scenario asks for two named fields rather than a general quote, so a partial answer cannot pass.

### Why This Matters

A Hermes leaf that does not know its packet writes into the wrong one, or re-derives a goal the operator already set. The first pass found the section delivered but empty of packet identity; this is the check that it now carries it.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-020` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `HERMES_SPEC_FOLDER` puts the bound packet's path and its durable goal slice into the session prompt, where the model can quote them.
- Real user request: `Does the Hermes session know which packet it's bound to and what the objective is?`
- Prompt: `Quote verbatim the bound packet path and the Objective line from the session-context section a project plugin froze into your system prompt. If there is no bound packet, reply exactly NO_BOUND_PACKET.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on each dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0`; the agent log's prompt-section line for that session reports a character count in the thousands rather than the few hundred a goal-less section produces; stdout names the bound packet path exactly as passed in `HERMES_SPEC_FOLDER` and quotes the packet's own Objective line.
- Evidence: The agent-log prompt-section line with its character count, the quoted packet path, the quoted objective text, the packet's `goal.md` for comparison, the exit code, the elapsed seconds, and the session id.
- Desired user-visible outcome: a concise verdict naming the observed signal and the evidence behind it.
- Pass/fail: PASS when the quoted path equals the environment value and the quoted objective matches the packet's `goal.md`; FAIL when the session answers `NO_BOUND_PACKET` while the variable is set, or quotes a packet other than the bound one; SKIP only when a named environment blocker prevents the check, such as the plugin failing to load without its opt-in.

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
PACKET=specs/cli-external-orchestration/071-cli-hermes-creation

HERMES_ENABLE_PROJECT_PLUGINS=1 HERMES_SPEC_FOLDER="$PACKET" \
perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none \
  -t file,todo --max-turns 4 --run-budget 150 \
  -q "Quote verbatim the bound packet path and the Objective line from the session-context section a project plugin froze into your system prompt. If there is no bound packet, reply exactly NO_BOUND_PACKET." \
  </dev/null >out.txt 2>err.txt
echo $?
sid=$(grep -o 'session_id: .*' err.txt | awk '{print $2}')
grep "$sid" ~/.hermes/logs/agent.log | grep -i 'prompt section'
cat out.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-020 | Bound packet goal slice | Confirm `HERMES_SPEC_FOLDER` puts the bound packet's path and its durable goal slice into the session prompt, where the model can quote them | `Quote verbatim the bound packet path and the Objective line from the session-context section a project plugin froze into your system prompt. If there is no bound packet, reply exactly NO_BOUND_PACKET.` | 1. `HERMES_ENABLE_PROJECT_PLUGINS=1 HERMES_SPEC_FOLDER=<packet-path> perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none -t file,todo --max-turns 4 --run-budget 150 -q "Quote verbatim the bound packet path and the Objective line from the session-context section a project plugin froze into your system prompt. If there is no bound packet, reply exactly NO_BOUND_PACKET." </dev/null` -> 2. `echo $?` -> 3. `sid=$(grep -o 'session_id: .*' err.txt | awk '{print $2}')` -> 4. `grep "$sid" ~/.hermes/logs/agent.log | grep -i 'prompt section'` -> 5. `cat out.txt` -> 6. Compare the quoted objective against the packet's own `goal.md` | Exit code `0`; the agent log's prompt-section line for that session reports a character count in the thousands rather than the few hundred a goal-less section produces; stdout names the bound packet path exactly as passed in `HERMES_SPEC_FOLDER` and quotes the packet's own Objective line | The agent-log prompt-section line with its character count, the quoted packet path, the quoted objective text, the packet's `goal.md` for comparison, the exit code, the elapsed seconds, and the session id | PASS when the quoted path equals the environment value and the quoted objective matches the packet's `goal.md`; FAIL when the session answers `NO_BOUND_PACKET` while the variable is set, or quotes a packet other than the bound one; SKIP only when a named environment blocker prevents the check, such as the plugin failing to load without its opt-in | A `NO_BOUND_PACKET` answer with the variable set has three checks, cheapest first: the packet directory must hold a `goal.md`, the path must resolve inside the repository, and the plugin must be loaded. A section whose character count stays in the hundreds means the goal slice was empty, which points at a missing or unparsable directive block in `goal.md` rather than at the plugin |

### Recorded Result

**Executed 2026-09-14** with `HERMES_SPEC_FOLDER=specs/cli-external-orchestration/071-cli-hermes-creation`: exit 0 in 30 s for session `20260914_225245_8be1f9`; the agent log reports `chars=3402`, and stdout opens `Bound packet: specs/cli-external-orchestration/071-cli-hermes-creation` followed by the packet's objective, `Hermes Agent (~/.hermes) is integrated as cli-hermes, the seventh cli-external-orchestration runtime: a deep-loop executor, a skill packet, a repo-root .hermes/ folder, and bridges to this repo's agents, commands, skills, hooks and MCP servers.` Verdict PASS, closing the first pass's goal-content boundary.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `goal-hook/bound-packet-goal-slice.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [hook-contract.md](../../references/hook-contract.md) | The system-prompt section surface and the goal slice it carries |
| [plugin-session-context-section.md](./plugin-session-context-section.md) | The delivery check this scenario reads the goal half of |

---

## 5. SOURCE METADATA

- Group: Goal Hook
- Playbook ID: HERMES-020
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `goal-hook/bound-packet-goal-slice.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
