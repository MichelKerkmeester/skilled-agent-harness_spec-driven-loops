---
title: "CO-057 -- Resume a specific session after restart"
description: "This scenario validates session continuity for `CO-057`. It checks that OpenCode retains a session's fact after the runner restarts that session."
version: 1.0.0.0
---

# CO-057 -- Resume a specific session after restart

This document captures the realistic conversation contract, current behavior, execution flow, source anchors and metadata for `CO-057`.

---

## 1. OVERVIEW

This scenario validates session continuity for `CO-057`. It focuses on retaining session context after a restart and using that context in the next turn.

### Why This Matters

An operator may need to restart a specific OpenCode session before continuing work. The resumed session must retain its earlier context so the operator does not need to restate a fact.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-057` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the runner restarts the same OpenCode session and the resumed turn recalls a fact from before the restart.
- Real user request: `I need to restart this OpenCode session and continue without re-entering a detail. Please remember one short phrase and repeat it after the restart.`
- Prompt: `Remember this exact phrase for the next turn: amber otter 731. Reply only with CHECKPOINT.`
- Expected execution process: Copy the OpenCode project configuration into the scratch project, plant the phrase in one turn, restart the same session, then ask for the phrase.
- Expected signals: The first response is `CHECKPOINT`; the restart produces runtime output; the final response contains `amber otter 731`.
- Evidence requirements: The three turn screens and their check outputs.
- Desired user-visible outcome: A PASS or FAIL verdict stating whether the restarted session recalled the phrase.
- Pass/fail: PASS if the final response contains `amber otter 731`; FAIL if it omits or changes the phrase.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Remember this exact phrase for the next turn: amber otter 731. Reply only with CHECKPOINT.`

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
      "send": "Remember this exact phrase for the next turn: amber otter 731. Reply only with CHECKPOINT.",
      "check": "turn_output=$(awk 'index($0, \"Reply only with CHECKPOINT.\") { after=1; next } after { print }' \"$CONVERSATION_TURN_DIR/screen.txt\"); printf '%s\\n' \"$turn_output\" | grep -Fq 'CHECKPOINT'"
    },
    {
      "id": "restart-session",
      "action": "restart",
      "check": "grep -Fq 'ctrl+p commands' \"$CONVERSATION_TURN_DIR/screen.txt\" && awk 'index($0, \"Reply only with CHECKPOINT.\") { next } index($0, \"CHECKPOINT\") { found=1; exit } END { exit !found }' \"$CONVERSATION_TURN_DIR/screen.txt\""
    },
    {
      "id": "recall-phrase",
      "send": "What exact phrase did I ask you to remember? Reply only with the phrase.",
      "check": "turn_output=$(awk 'index($0, \"Reply only with the phrase.\") { after=1; next } after { print }' \"$CONVERSATION_TURN_DIR/screen.txt\"); printf '%s\\n' \"$turn_output\" | grep -Fq 'amber otter 731'"
    }
  ]
}
```

- The first `send` matches the scenario contract prompt.
- The restart check requires the OpenCode prompt footer and a `CHECKPOINT` row other than the restored prompt row, so a toast border on the assistant row cannot hide it.
- The shell checks read the runtime screens and do not write to the repository.

### Commands

1. `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/resume-by-session-id-conversation.md --runtime opencode --scratch <scratch-dir> --out <evidence-dir>`

The scratch directory must be outside the repository.

### Expected

The first response confirms the phrase with `CHECKPOINT`. After the runner restarts the same session, the final response repeats the phrase exactly.

### Evidence

The turn screens and check outputs under the runtime evidence directory show the acknowledgement, successful restart output and recalled phrase.

### Pass / Fail

- **Pass**: The final turn screen contains `amber otter 731` after the restart.
- **Fail**: The final turn screen omits or changes the phrase.

### Failure Triage

If the first check fails, inspect the first turn screen for the acknowledgement. If the restart check fails, confirm the OpenCode session launched again with the same runner session id. If the last check fails, compare the final prompt and the restarted session's visible history.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-057 | Resume session by id after restart | Confirm a restarted session retains its earlier fact | `Remember this exact phrase for the next turn: amber otter 731. Reply only with CHECKPOINT.` | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/resume-by-session-id-conversation.md --runtime opencode --scratch <scratch-dir> --out <evidence-dir>` | First response is `CHECKPOINT`; after restart the response recalls `amber otter 731` | Three turn screens and check outputs in the evidence directory | PASS if the final response includes the phrase; FAIL if it omits or changes it | Check the same-session restart and whether the final prompt followed it |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `session-continuity/resume-by-session-id.md` | Existing session-id scenario and continuity contract |
| `../../references/cli-reference.md` | Documents the session-id resume flag |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | OpenCode session flag reference |
| `../../references/cli-reference.md` | Session persistence and resume behavior |

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: CO-057
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `session-continuity/resume-by-session-id-conversation.md`
