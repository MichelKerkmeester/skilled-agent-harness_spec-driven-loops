---
title: "CC-031 -- Continue previous conversation with a follow-up"
description: "This scenario validates context across consecutive Claude Code turns. It focuses on whether a later prompt can recall a label from the first turn."
version: 1.0.0.0
---

# CC-031 -- Continue previous conversation with a follow-up

This document captures the conversation contract and evidence checks for `CC-031`, a companion to the command-level `CC-015` scenario.

---

## 1. OVERVIEW

This scenario checks whether Claude Code retains context across consecutive turns in one session. The follow-up asks for a label sent in the first turn.

### Why This Matters

`--continue` supports sequential work that builds on an earlier turn. If the next turn cannot recall the label, the conversation lost the detail needed by the follow-up.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-031` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a later turn in one Claude Code session can recall a label from the first turn.
- Real user request: `Remember a short review label, then tell it back in my next message.`
- Prompt: Remember this review label for my next turn: COPPER-ORBIT-846. Say it back.
- Expected execution process: The runner sends the label prompt, restarts the same Claude Code session by ID, then sends a follow-up that asks for the original label.
- Expected signals: The first reply repeats `COPPER-ORBIT-846`, the restart check sees Claude Code's resumed input prompt, and the follow-up reply repeats the same label.
- Desired user-visible outcome: A pass or fail verdict that states whether the later turn recalled the label.
- Pass/fail: PASS if the restart check sees the resumed prompt and the follow-up reply includes `COPPER-ORBIT-846` after its prompt. FAIL if either check fails.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: Remember this review label for my next turn: COPPER-ORBIT-846. Say it back.

### Conversation Script

```json conversation
{
  "runtimes": ["claude-code"],
  "turns": [
    {
      "id": "plant-label",
      "send": "Remember this review label for my next turn: COPPER-ORBIT-846. Say it back.",
      "questions": [
        {
          "match": "[Ss]pec[- ]folder|[Ss]pecification folder|[Gg]ate 3|[Aa]sk about documentation|[Dd]ocumentation (scope|folder|path)",
          "answer": { "reply": "D" },
          "optional": true
        }
      ],
      "check": "awk 'index($0, \"Say it back.\") { after=1; next } after && index($0, \"COPPER-ORBIT-846\") { found=1; exit } END { exit !found }' \"$CONVERSATION_TURN_DIR/screen.txt\""
    },
    {
      "id": "restart-session",
      "action": "restart",
      "check": "grep -Eq '^❯[[:space:]]*$' \"$CONVERSATION_TURN_DIR/screen.txt\""
    },
    {
      "id": "recall-label",
      "send": "What review label did I ask you to remember? Answer with the exact label only.",
      "check": "awk 'index($0, \"Answer with the exact label only.\") { after=1; next } after && index($0, \"COPPER-ORBIT-846\") { found=1; exit } END { exit !found }' \"$CONVERSATION_TURN_DIR/screen.txt\""
    }
  ]
}
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-031 | Continue previous conversation with a follow-up | Confirm a later turn retains a label from the first turn | Remember this review label for my next turn: COPPER-ORBIT-846. Say it back. | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/session-continuity/continue-previous-conversation-conversation.md --runtime claude-code --scratch <scratch-dir-outside-repository> --out <evidence-dir>` | The first reply repeats the label, the restart screen shows the resumed prompt, and the follow-up reply repeats the label again. | `matrix.md`, `result.json` and each turn's `screen.txt` and `check.txt` under `<evidence-dir>/claude-code/` | PASS if the restart screen shows the resumed prompt and the follow-up reply repeats `COPPER-ORBIT-846` after its prompt. FAIL if either check fails. | Review the plant, restart and recall screens and `checkpoints.tsv`. If the first check passes but either restart or recall fails, record where continuation stopped with the screens and check outputs. |

### Commands

1. `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/session-continuity/continue-previous-conversation-conversation.md --runtime claude-code --scratch <scratch-dir-outside-repository> --out <evidence-dir>`

The scratch directory must be outside the repository.

### Expected

The first reply repeats the label, the restart screen shows the resumed prompt, and the follow-up reply repeats the label again.

### Evidence

Review `matrix.md`, `result.json`, `checkpoints.tsv` and the `screen.txt` and `check.txt` files for `plant-label`, `restart-session` and `recall-label` under `<evidence-dir>/claude-code/turns/`.

### Pass / Fail

- **Pass**: The restart screen shows the resumed prompt and the follow-up reply includes `COPPER-ORBIT-846` after its prompt.
- **Fail**: The restart check does not find the resumed prompt or the follow-up reply omits the label.

### Failure Triage

Review the plant, restart and recall screens with their check outputs. If the plant check passes but the restart or recall check fails, record where continuation stopped. Keep the run evidence with the result.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `session-continuity/continue-previous-conversation.md` | Command-level scenario this conversation companion extends |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli-reference.md` | Documents `--continue` |
| `../../references/integration-patterns.md` | Documents the session-continuity pattern |

No dedicated feature-catalog entry exists for this conversation companion. The `CC-015` scenario and the two reference files above provide its source contract.

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: CC-031
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `session-continuity/continue-previous-conversation-conversation.md`
- Companion to: CC-015
