---
title: "VIB-HK-005 -- Turn start raises the save nudge for a captured answer"
description: "This scenario validates that the Vibe turn-start composer raises the decision-capture save nudge once, at the turn start after an operator answer is captured, judged from the session journal."
version: 1.0.2.0
---

# VIB-HK-005 -- Turn start raises the save nudge for a captured answer

This document captures the operator contract for `VIB-HK-005`.

---

## 1. OVERVIEW

This scenario asks a live Vibe session to settle one small design question through the question tool. The `decision-capture-ask` `post_tool` hook records the operator's answer, and the next operator message must open with one save reminder line added by the `turn-start` `pre_agent` hook.

### Why This Matters

An answer only reaches a decision record through a save, so a captured answer that nobody is reminded about becomes a silent backlog. The reminder is composed at `pre_agent`, and only the journal shows whether the composer ran before the answer existed and after it.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the journal evidence.

- Objective: verify that `turn-start` adds one decision-capture save reminder to the turn start that follows a captured answer.
- Real user request: `I'm adding a retry helper to the uploader. Before you write anything, ask me one thing: should it live in lib/retry.mjs or stay inline in src/uploader.mjs?`
- Prompt: `I'm adding a retry helper to the uploader. Before you write anything, ask me one thing: should it live in lib/retry.mjs or stay inline in src/uploader.mjs?`
- Expected execution process: the runner creates a scratch project, renders the repository hooks into a fresh `VIBE_HOME`, starts Vibe and types the prompt. The subject calls `ask_user_question`, the runner answers the box with a typed answer, and `decision-capture-ask` appends one queue record. The second turn's `pre_agent` composer reads the pending count and adds the reminder.
- Expected signals: the first turn leaves exactly one queue record and no save reminder anywhere in the journal; the second turn's journal record for `pre_agent_turn` carries the one-line `[decision-capture] 1 operator answer(s) ... Run /speckit:save to record them.` text, and the session's nudge cursor holds `1`.
- Desired user-visible outcome: the second turn shows `[turn-start] Added context for the model` with the save reminder, and the subject mentions the pending answer or the save.
- Pass/fail: PASS when both turn checks pass. FAIL when the answer is not captured, the reminder appears before the answer, or the second turn carries no reminder.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I'm adding a retry helper to the uploader. Before you write anything, ask me one thing: should it live in lib/retry.mjs or stay inline in src/uploader.mjs?`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-005 | Turn-start save nudge | Raise one save reminder at the turn start after a captured answer | `I'm adding a retry helper to the uploader. Before you write anything, ask me one thing: should it live in lib/retry.mjs or stay inline in src/uploader.mjs?` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/turn-start-save-nudge.md --runtime vibe --scratch "$(mktemp -d)" --out specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-005` | One queue record after the answer and no reminder yet; then a `pre_agent_turn` record carrying the one-line save reminder, and a nudge cursor of `1` | `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt` | PASS when both checks pass. FAIL when the queue holds no record, the reminder appears in the answer's own turn, or the next turn carries none. | 1. Read the second turn's check.txt. 2. Confirm the queue file under the scratch project's `.skilled/skills/.state/decision-capture` holds one row. 3. Pipe a `pre_agent` payload with the same session id into `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` and read its output. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "setup": [
    "mkdir -p src lib",
    "printf 'export async function upload(file) {\\n  return fetch(\"/upload\", { method: \"POST\", body: file });\\n}\\n' > src/uploader.mjs"
  ],
  "env": {
    "SYSTEM_SPEC_GATE_DISABLED": "1"
  },
  "turns": [
    {
      "id": "answer-question",
      "send": "I'm adding a retry helper to the uploader. Before you write anything, ask me one thing: should it live in lib/retry.mjs or stay inline in src/uploader.mjs?",
      "questions": [
        {
          "match": "[Rr]etry|retry\\.mjs|[Ii]nline|uploader|where",
          "answer": {
            "other": "Put it in lib/retry.mjs, please."
          }
        },
        {
          "match": "[Ss]pec folder|[Dd]ocumentation|[Pp]acket",
          "answer": {
            "other": "Skip the documentation question."
          },
          "optional": true
        }
      ],
      "check": "q=$(find .skilled/skills/.state/decision-capture -name '*.jsonl' ! -name consumed.jsonl 2>/dev/null | head -1); [ -n \"$q\" ] && [ \"$(grep -c . \"$q\")\" -eq 1 ] && ! grep -rqsF 'are not in a decision record yet' \"$VIBE_HOME/logs/session/unified\" && echo one-answer-captured-no-nudge-yet"
    },
    {
      "id": "next-turn",
      "send": "Good. Now tell me in one sentence which file you will touch first.",
      "check": "f=$(grep -rlF '[decision-capture] 1 operator answer(s) captured this session are not in a decision record yet. Run /speckit:save to record them.' \"$VIBE_HOME/logs/session/unified\" | head -1); [ -n \"$f\" ] && grep -qF '\"hook\":\"pre_agent_turn\"' \"$f\" && grep -qx 1 .skilled/skills/.state/decision-capture/*/*.nudge && echo save-nudge-in-turn-start-context"
    }
  ]
}
```

The first turn answers the subject's question with the free-text row, so the captured answer is the operator's own wording rather than a label the scenario guessed. The first check proves the answer reached the queue and that the answer's own turn start carried no reminder, because `takeNudge` runs at `pre_agent` and the answer arrives after it. The second check requires the full one-line reminder inside a journal file that also carries the `pre_agent_turn` hook record, so a paraphrase in the reply cannot satisfy it. The nudge cursor holds the count the composer reported, which is `1` for one pending answer. The spec gate is switched off because the scenario judges only the save nudge and the subject may write a file. Setup seeds an uploader module in the scratch project's src folder and an empty lib folder, and the prompt names the module's file, so the subject has no reason to ask a second question about where the uploader lives; a second answer would put two records in the queue, and the check requires exactly one.

### Expected

Turn `answer-question` leaves one queue record for the session and no save reminder in the journal. Turn `next-turn` finds the one-line reminder in the `pre_agent_turn` record and a nudge cursor of `1`.

### Evidence

Capture `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt`, plus `setup.log`.

### Pass / Fail

- **Pass**: the first turn holds exactly one queue record and no reminder, and the second turn's `pre_agent_turn` record carries the one-line save reminder.
- **Fail**: no queue record, a reminder before the answer, or no reminder at the next turn start.

### Failure Triage

1. Read turns/answer-question/check.txt and turns/next-turn/check.txt.
2. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `turn-start` and `decision-capture-ask`.
3. Read the queue file under the scratch project's `.skilled/skills/.state/decision-capture` and the nudge file beside it.
4. Pipe a `pre_agent` payload with the same session id and project directory into `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` and read its output.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
| [`guards-and-hooks.md`](../../references/guards-and-hooks.md) | Vibe hook and plugin classification |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | The hook under test |
| `.skilled/hooks/decision-capture/lib/capture-core.mjs` | The queue and nudge counter the hook reads |
| `.skilled/hooks/decision-capture/vibe/decision-capture-post-tool.mjs` | The capture hook that fills the queue |
| `.vibe/hooks.toml` | The hook bindings |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-005
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/turn-start-save-nudge.md`
