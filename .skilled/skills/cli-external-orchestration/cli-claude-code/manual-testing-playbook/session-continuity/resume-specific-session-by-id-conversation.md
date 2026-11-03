---
title: "CC-030 -- Resume specific session by ID conversation"
description: "This scenario validates session context after Claude Code resumes a selected session by ID. It focuses on recalling a marker sent before the runner restarts the session."
version: 1.0.1.0
---

# CC-030 -- Resume specific session by ID conversation

This document captures the conversation contract and evidence checks for `CC-030`, a companion to the command-level `CC-016` scenario.

---

## 1. OVERVIEW

This scenario checks whether Claude Code retains context when the runner restarts a selected session by ID. The follow-up asks for a marker sent before the restart.

### Why This Matters

`--resume SESSION_ID` reopens a chosen session. If the resumed session cannot recall the marker, the follow-up did not receive the earlier turn's context.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-030` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a Claude Code session resumed by ID retains a marker from its earlier turn.
- Real user request: `Remember a short project marker, then tell it back after I resume this conversation.`
- Prompt: Remember this project marker for my next question: MAPLE-LANTERN-582. Say it back.
- Expected execution process: The runner sends the marker prompt, restarts the same Claude Code session through its resume adapter, then asks for the marker in a later turn.
- Expected signals: The first reply repeats `MAPLE-LANTERN-582`, the restart check sees Claude Code's resumed input prompt, and the reply to the follow-up prompt repeats the same marker.
- Desired user-visible outcome: A pass or fail verdict that states whether the resumed session recalled the marker.
- Pass/fail: PASS if the restart check sees the resumed prompt and the reply after restart includes `MAPLE-LANTERN-582` after its prompt. FAIL if either check fails.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: Remember this project marker for my next question: MAPLE-LANTERN-582. Say it back.

### Conversation Script

```json conversation
{
  "runtimes": ["claude-code"],
  "turns": [
    {
      "id": "plant-marker",
      "send": "Remember this project marker for my next question: MAPLE-LANTERN-582. Say it back.",
      "check": "awk 'index($0, \"Say it back.\") { after=1; next } after && index($0, \"MAPLE-LANTERN-582\") { found=1; exit } END { exit !found }' \"$CONVERSATION_TURN_DIR/screen.txt\""
    },
    {
      "id": "restart-session",
      "action": "restart",
      "check": "grep -Eq '^❯[[:space:]]*$' \"$CONVERSATION_TURN_DIR/screen.txt\""
    },
    {
      "id": "recall-marker",
      "send": "What project marker did I ask you to remember? Answer with the exact marker only.",
      "check": "awk 'index($0, \"Answer with the exact marker only.\") { after=1; next } after && index($0, \"MAPLE-LANTERN-582\") { found=1; exit } END { exit !found }' \"$CONVERSATION_TURN_DIR/screen.txt\""
    }
  ]
}
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-030 | Resume specific session by ID conversation | Confirm a session resumed by ID retains a marker from its earlier turn | Remember this project marker for my next question: MAPLE-LANTERN-582. Say it back. | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/session-continuity/resume-specific-session-by-id-conversation.md --runtime claude-code --scratch <scratch-dir-outside-repository> --out <evidence-dir>` | The first reply repeats the marker, the restart screen shows the resumed prompt, and the follow-up reply repeats the marker again. | `matrix.md`, `result.json` and each turn's `screen.txt` and `check.txt` under `<evidence-dir>/claude-code/` | PASS if the restart screen shows the resumed prompt and the final reply repeats `MAPLE-LANTERN-582` after its prompt. FAIL if either check fails. | Review the three turn screens and `checkpoints.tsv`. If the first check passes but either restart or final recall fails, record where session resumption stopped with the screens and check outputs. |

### Commands

1. `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/session-continuity/resume-specific-session-by-id-conversation.md --runtime claude-code --scratch <scratch-dir-outside-repository> --out <evidence-dir>`

The scratch directory must be outside the repository.

### Expected

The first reply repeats the marker, the restart screen shows the resumed prompt, and the follow-up reply repeats the marker again.

### Evidence

Review `matrix.md`, `result.json`, `checkpoints.tsv` and the `screen.txt` and `check.txt` files for `plant-marker`, `restart-session` and `recall-marker` under `<evidence-dir>/claude-code/turns/`.

### Pass / Fail

- **Pass**: The restart screen shows the resumed prompt and the reply after restart includes `MAPLE-LANTERN-582` after its prompt.
- **Fail**: The restart check does not find the resumed prompt or the reply after restart omits the marker.

### Failure Triage

Review the plant, restart and recall screens with their check outputs. If the plant check passes but the restart or recall check fails, record where session resumption stopped. Keep the run evidence with the result.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `session-continuity/resume-specific-session-by-id.md` | Command-level scenario this conversation companion extends |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli-reference.md` | Documents `--resume SESSION_ID` |
| `../../references/integration-patterns.md` | Documents the session-continuity pattern |

No dedicated feature-catalog entry exists for this conversation companion. The `CC-016` scenario and the two reference files above provide its source contract.

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: CC-030
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `session-continuity/resume-specific-session-by-id-conversation.md`
- Companion to: CC-016
