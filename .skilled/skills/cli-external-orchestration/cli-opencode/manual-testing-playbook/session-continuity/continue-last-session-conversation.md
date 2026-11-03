---
title: "CO-058 -- Continue the current session across turns"
description: "This scenario validates session continuity for `CO-058`. It checks that a later turn in the same OpenCode session uses an earlier fact."
version: 1.0.1.0
---

# CO-058 -- Continue the current session across turns

This document captures the realistic conversation contract, current behavior, execution flow, source anchors and metadata for `CO-058`.

---

## 1. OVERVIEW

This scenario validates session continuity for `CO-058`. It focuses on retaining conversational context across two turns in the same session.

### Why This Matters

When an operator continues a session, the next request depends on what was said earlier. The runtime should use that context without asking the operator to repeat it.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-058` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a follow-up turn in the same OpenCode session uses the phrase established in the first turn.
- Real user request: `Continue this OpenCode conversation and use a short detail from my first message in your next answer.`
- Prompt: `Remember this exact phrase for the next turn: silver maple 482. Reply only with CHECKPOINT.`
- Expected execution process: Copy the OpenCode project configuration into the scratch project, establish the phrase in the first turn, and ask for it in the next turn without restarting the session.
- Expected signals: The first response is `CHECKPOINT`; the second response contains `silver maple 482`.
- Evidence requirements: Both turn screens and their check outputs.
- Desired user-visible outcome: A PASS or FAIL verdict stating whether the follow-up used the earlier phrase.
- Pass/fail: PASS if the second response contains `silver maple 482`; FAIL if it omits or changes the phrase.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Remember this exact phrase for the next turn: silver maple 482. Reply only with CHECKPOINT.`

### Conversation Script

```json conversation
{
  "runtimes": ["opencode"],
  "setup": [
    "if ! command -v opencode >/dev/null 2>&1; then printf '%s\\n' 'OpenCode CLI is unavailable'; exit 77; fi",
    "if [ ! -f \"${XDG_DATA_HOME:-$HOME/.local/share}/opencode/auth.json\" ] || ! grep -Fq '\"llmgateway\"' \"${XDG_DATA_HOME:-$HOME/.local/share}/opencode/auth.json\"; then printf '%s\\n' 'OpenCode llmgateway login is unavailable'; exit 77; fi",
    "if ! command -v curl >/dev/null 2>&1 || ! curl -sS -o /dev/null -I --max-time 10 https://api.llmgateway.io/ >/dev/null 2>&1; then printf '%s\\n' 'LLM Gateway network access is unavailable'; exit 77; fi",
    "if [ ! -f \"$CONVERSATION_REPO_ROOT/opencode.json\" ]; then printf '%s\\n' 'OpenCode project config fixture is missing'; exit 77; fi",
    "cp \"$CONVERSATION_REPO_ROOT/opencode.json\" ./opencode.json"
  ],
  "turns": [
    {
      "id": "plant-phrase",
      "send": "Remember this exact phrase for the next turn: silver maple 482. Reply only with CHECKPOINT.",
      "check": "turn_output=$(awk 'index($0, \"Reply only with CHECKPOINT.\") { after=1; next } after { print }' \"$CONVERSATION_TURN_DIR/screen.txt\"); printf '%s\\n' \"$turn_output\" | grep -Fq 'CHECKPOINT'"
    },
    {
      "id": "follow-up",
      "send": "What exact phrase did I ask you to remember? Reply only with the phrase.",
      "check": "turn_output=$(awk 'index($0, \"Reply only with the phrase.\") { after=1; next } after { print }' \"$CONVERSATION_TURN_DIR/screen.txt\"); printf '%s\\n' \"$turn_output\" | grep -Fq 'silver maple 482'"
    }
  ]
}
```

- The first `send` matches the scenario contract prompt.
- The shell checks read the runtime screens and do not write to the repository.

### Commands

1. `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/continue-last-session-conversation.md --runtime opencode --scratch <scratch-dir> --out <evidence-dir>`

The scratch directory must be outside the repository.

### Expected

The first response confirms the phrase with `CHECKPOINT`. The next turn stays in the same session and repeats the phrase exactly.

### Evidence

The two turn screens and check outputs under the runtime evidence directory show the acknowledgement and the follow-up answer.

### Pass / Fail

- **Pass**: The second turn screen contains `silver maple 482`.
- **Fail**: The second turn screen omits or changes the phrase.

### Failure Triage

If the first check fails, inspect the first turn screen for the acknowledgement. If the second check fails, confirm the runner sent both requests to the same OpenCode session and that the follow-up was sent after the phrase was established.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-058 | Continue last session in conversation | Confirm the next turn uses a fact from the current session | `Remember this exact phrase for the next turn: silver maple 482. Reply only with CHECKPOINT.` | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/continue-last-session-conversation.md --runtime opencode --scratch <scratch-dir> --out <evidence-dir>` | First response is `CHECKPOINT`; the follow-up recalls `silver maple 482` | Both turn screens and check outputs in the evidence directory | PASS if the follow-up includes the phrase; FAIL if it omits or changes it | Confirm both requests used the same OpenCode session |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `session-continuity/continue-last-session.md` | Existing continue-last scenario and continuity contract |
| `../../references/cli-reference.md` | Documents the continue-session flag |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | OpenCode session flag reference |
| `../../references/cli-reference.md` | Continue flag and session behavior |

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: CO-058
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `session-continuity/continue-last-session-conversation.md`
