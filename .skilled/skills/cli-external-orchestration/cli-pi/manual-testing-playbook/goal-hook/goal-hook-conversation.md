---
title: "PI-024 -- Goal hook across a later turn and restart"
description: "This scenario validates that Pi's session goal steers a later task and remains active after restart for `PI-024`."
stage: routing
id: "PI-024"
version: 1.0.1.0
---

# PI-024 -- Goal hook across a later turn and restart

This document captures the conversation contract, current behavior, execution flow, source anchors and metadata for `PI-024`.

---

## 1. OVERVIEW

This scenario validates Pi's session-bound goal hook for `PI-024`. It focuses on a native goal command, a later task, and the same goal after the session restarts.

### Why This Matters

A goal is useful only when the hook carries it into later work. The restart check confirms the native session binding still selects the same goal.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `PI-024` and check the active goal state and later Pi responses.

- Objective: Bind a Pi session goal, complete its later checkpoint task, then confirm the goal remains active and usable after a restart.
- Real user request: `Set a goal for this Pi session, then test it against a local checkpoint file and after restart.`
- Prompt: `/goal-pi set Read the checkpoint token from .goal-checkpoint and return it exactly.`
- Expected execution process: Setup confirms the goal-hook fixture and Pi login, copies the project Pi configuration and `.skilled` into the scratch project, and creates a checkpoint file there. The subject then sets the goal with the native command, is asked about the checkpoint, restarts the same session, and is asked again.
- Expected signals: The native command reports `STATUS=OK ACTION=set`; scratch goal state contains the expected active Pi objective; each later reply includes the marker stored in `.goal-checkpoint`; the same goal remains active after restart.
- Desired user-visible outcome: Pi reads the local checkpoint marker through its active goal and keeps that goal active across restart.
- Pass/fail: PASS if the scoped state matches the objective and both task replies contain the file's marker. FAIL if the command, either task, or the post-restart state check misses its expected signal. SKIP from setup if the Pi goal-hook fixture or Pi login is unavailable; record the one-line blocker.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `/goal-pi set Read the checkpoint token from .goal-checkpoint and return it exactly.`

### Conversation Script

```json conversation
{
  "runtimes": ["pi"],
  "env": {
    "OPENCODE_GOAL_STATE_DIR": ".goal-state"
  },
  "setup": [
    "if [ ! -f \"$CONVERSATION_REPO_ROOT/.pi/extensions/goal-context.ts\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.skilled/hooks/goal/pi/goal-context.ts\" ]; then printf '%s\\n' 'Pi goal-hook fixture unavailable'; exit 77; fi",
    "if [ ! -s \"${PI_CODING_AGENT_DIR:-$HOME/.pi/agent}/auth.json\" ] && ! env | grep -q '_API_KEY=.'; then printf '%s\\n' 'Pi login unavailable: no auth.json or provider API key'; exit 77; fi",
    "command -v jq >/dev/null 2>&1 || { printf '%s\\n' 'jq is required for the goal-state checks'; exit 77; }",
    "mkdir -p .pi .goal-state",
    "if [ -d \"$CONVERSATION_REPO_ROOT/.pi\" ]; then cp -R \"$CONVERSATION_REPO_ROOT/.pi/.\" .pi/; fi",
    "if [ -d \"$CONVERSATION_REPO_ROOT/.skilled\" ]; then cp -R \"$CONVERSATION_REPO_ROOT/.skilled\" .skilled; fi",
    "printf '%s\\n' 'quartz-fern-83' > .goal-checkpoint"
  ],
  "turns": [
    {
      "id": "bind-goal",
      "send": "/goal-pi set Read the checkpoint token from .goal-checkpoint and return it exactly.",
      "questions": [
        {
          "match": "([Ss]pec folder|[Ss]pecification folder|[Gg]ate 3|[Ww]hich .*folder|[Dd]ocumentation)",
          "optional": true,
          "answer": { "reply": "D" }
        }
      ],
      "check": "grep -Fq 'STATUS=OK ACTION=set' \"$CONVERSATION_TURN_DIR/screen.txt\" && jq -e --arg objective 'Read the checkpoint token from .goal-checkpoint and return it exactly.' '.objective == $objective and .runtime == \"pi\" and .status == \"active\"' .goal-state/*.json >/dev/null"
    },
    {
      "id": "later-task",
      "send": "I am ready for the checkpoint.",
      "check": "awk 'index($0, \"I am ready for the checkpoint.\") { after=1; next } after && index($0, \"quartz-fern-83\") { found=1; exit } END { exit !found }' \"$CONVERSATION_TURN_DIR/history.txt\" && jq -e '.turnsUsed >= 1 and .status == \"active\"' .goal-state/*.json >/dev/null"
    },
    {
      "id": "restart",
      "action": "restart",
      "check": "jq -e --arg objective 'Read the checkpoint token from .goal-checkpoint and return it exactly.' '.objective == $objective and .runtime == \"pi\" and .status == \"active\"' .goal-state/*.json >/dev/null"
    },
    {
      "id": "post-restart-task",
      "send": "I am ready to continue.",
      "check": "awk 'index($0, \"I am ready to continue.\") { after=1; next } after && index($0, \"quartz-fern-83\") { found=1; exit } END { exit !found }' \"$CONVERSATION_TURN_DIR/history.txt\" && jq -e '.turnsUsed >= 2 and .status == \"active\"' .goal-state/*.json >/dev/null"
    }
  ]
}
```

- The first `send` matches the contract prompt exactly.
- Setup skips the runtime with a one-line blocker when the goal-hook fixture or Pi login is missing, so no subject starts.
- The goal state and checkpoint file stay inside the scratch project. Pi uses its normal agent directory for authentication and session storage.

### Commands

1. `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/goal-hook/goal-hook-conversation.md --runtime pi --scratch <scratch-dir-outside-repository> --out <evidence-dir>`

The scratch directory must be outside the repository.

### Expected

The native command creates one active Pi goal in `.goal-state`. Each task reply after its own send contains the marker from `.goal-checkpoint`, and the state record remains active with its turn count increasing after restart.

### Evidence

Use the `bind-goal` screen, the `later-task` and `post-restart-task` history files, and the `.goal-state` JSON record after each turn. The task checks search only after each current send echo in the full scrollback, including replies that have scrolled off screen.

### Pass / Fail

- **Pass**: The goal record matches the objective and runtime, stays active after restart, and both task replies contain the marker from `.goal-checkpoint` after their current send echoes.
- **Fail**: The native command fails, the objective or runtime differs, the state record disappears or becomes inactive, or either task response omits the marker.
- **Skip**: Setup reports the goal-hook fixture or Pi login missing. Setup prints a one-line blocker and exits 77, so the subject never starts.

### Failure Triage

Confirm that the copied `.pi/extensions/goal-context.ts` symlink resolves through the copied `.skilled` tree and that Pi exposed its session ID to the native command. Check that `OPENCODE_GOAL_STATE_DIR` resolves inside the scratch project. When setup reports the fixture or login missing, keep the run as SKIP rather than treating the missing provider as a goal-hook failure.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-024 | Goal hook across a later turn and restart | Carry a session goal into later work and restore it after restart | `/goal-pi set Read the checkpoint token from .goal-checkpoint and return it exactly.` | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/goal-hook/goal-hook-conversation.md --runtime pi --scratch <scratch-dir-outside-repository> --out <evidence-dir>` | Active goal record remains scoped to Pi; both later replies return the marker stored in `.goal-checkpoint` | Turn screens and scratch `.goal-state` JSON | PASS if both replies and state checks match; FAIL if the goal is absent, inactive, or lost; SKIP from setup if the fixture or Pi login is unavailable | Check the copied extension symlink, `.skilled` tree, and scratch goal-state directory before changing the session binding. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `goal-hook/goal-hook.md` | Existing command-level coverage for Pi goal state and session isolation |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/hooks/goal/pi/goal-context.ts` | Registers the native command and injects the session-bound goal |
| `.skilled/hooks/goal/pi/goal-pi.test.mjs` | Covers native command binding, lifecycle injection, resume and new-session behavior |

---

## 5. SOURCE METADATA

- Group: Goal Hook
- Playbook ID: PI-024
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `goal-hook/goal-hook-conversation.md`
