---
title: "VIB-HK-008 -- Turn end sends a prose option menu back once"
description: "This scenario validates that the Vibe turn-end composer sends a reply that closes on a prose option menu back through one ask-surface retry naming ask_user_question, judged from the session journal."
version: 1.0.0.0
---

# VIB-HK-008 -- Turn end sends a prose option menu back once

This document captures the operator contract for `VIB-HK-008`.

---

## 1. OVERVIEW

This scenario asks a live Vibe session for a two-option comparison written in prose, ending with a question. The `turn-end` `post_agent` hook must read the finished reply from the journal, recognise the closing menu, and send the turn back once with the ask-surface reprompt that names `ask_user_question`.

### Why This Matters

A prose menu leaves the operator to retype a choice that the question tool would have recorded as a decision. The deny is a retry message rather than a held turn, so only the journal shows that the hook judged the reply and that the reprompt named the tool.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn check and the journal evidence.

- Objective: verify that `turn-end` returns one `post_agent` retry whose feedback names `ask_user_question` when a reply closes on a prose option menu.
- Real user request: `I'm weighing two ways to cache the journal read: a small LRU inside the reader, or a memoized wrapper around it. Compare them as two labelled options, A) and B), with one trade-off each, reply in prose without opening the question box, and end by asking me which one I want.`
- Prompt: `I'm weighing two ways to cache the journal read: a small LRU inside the reader, or a memoized wrapper around it. Compare them as two labelled options, A) and B), with one trade-off each, reply in prose without opening the question box, and end by asking me which one I want.`
- Expected execution process: the runner creates a scratch project, renders the repository hooks into a fresh `VIBE_HOME`, starts Vibe and types the prompt. The subject replies with a closing A/B menu and a question. Vibe runs `turn-end` at `post_agent`, the ask-surface part denies, and Vibe injects the reason as a retry message. The subject asks through `ask_user_question`, the runner answers the box, and the retried turn ends.
- Expected signals: a journal `post_agent_turn` record whose output is `retry` and whose feedback carries `[ask-surface] Your reply ended with a prose option menu` and the backticked `ask_user_question` tool name, plus exactly one line in the session's ask-surface fire log.
- Desired user-visible outcome: the subject asks the same question through the question box instead of leaving the menu as prose.
- Pass/fail: PASS when the turn check passes. FAIL when the journal holds no ask-surface retry or the reprompt does not name the tool.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I'm weighing two ways to cache the journal read: a small LRU inside the reader, or a memoized wrapper around it. Compare them as two labelled options, A) and B), with one trade-off each, reply in prose without opening the question box, and end by asking me which one I want.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-008 | Turn-end ask surface | Send a reply that closes on a prose option menu back once | `I'm weighing two ways to cache the journal read: a small LRU inside the reader, or a memoized wrapper around it. Compare them as two labelled options, A) and B), with one trade-off each, reply in prose without opening the question box, and end by asking me which one I want.` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/turn-end-ask-surface-conversation.md --runtime vibe --scratch "$(mktemp -d)" --out specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-008` | A `post_agent_turn` `retry` whose feedback carries the ask-surface reprompt and `ask_user_question`; one fire in the ask-surface log | `matrix.md`, `checkpoints.tsv`, the turn's `screen.txt` and `check.txt` | PASS when the check passes. FAIL when no retry record exists, the feedback omits the tool name, or the guard fired more than once. | 1. Read the turn's check.txt. 2. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `turn-end`. 3. Confirm the reply in the journal really closes on a labelled menu. 4. Pipe a `post_agent` payload with the same session root into `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs` and read its output. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "setup": [],
  "env": {
    "SYSTEM_SPEC_GATE_DISABLED": "1"
  },
  "turns": [
    {
      "id": "prose-menu",
      "send": "I'm weighing two ways to cache the journal read: a small LRU inside the reader, or a memoized wrapper around it. Compare them as two labelled options, A) and B), with one trade-off each, reply in prose without opening the question box, and end by asking me which one I want.",
      "questions": [
        {
          "match": "[Cc]ache|LRU|memo|[Ww]hich|option|wrapper",
          "answer": {
            "other": "Go with the memoized wrapper."
          },
          "optional": true
        },
        {
          "match": "[Ss]pec folder|[Dd]ocumentation|[Pp]acket",
          "answer": {
            "other": "Skip the documentation question."
          },
          "optional": true
        }
      ],
      "check": "f=$(grep -rlF '[ask-surface] Your reply ended with a prose option menu' \"$VIBE_HOME/logs/session/unified\" | head -1); [ -n \"$f\" ] && grep -qF '\"type\":\"retry\"' \"$f\" && grep -qF '\"hook\":\"post_agent_turn\"' \"$f\" && grep -qF '`ask_user_question`' \"$f\" && [ \"$(grep -c . .skilled/skills/.state/ask-surface/fires.jsonl)\" -eq 1 ] && echo one-ask-surface-retry-naming-ask_user_question"
    }
  ]
}
```

The prompt asks for the menu in prose and rules out the question box, which is the state the guard exists for; without that clause the subject could ask through the tool and the guard would pass the turn as already asked. The labels are written as `A)` and `B)` because the detector needs a closing delimiter after the letter, and a live run showed that an em dash after the letter reads as ordinary prose. The tool-call entry is optional because the premise is that the subject does not ask through the tool; it only answers the call the reprompt asks for, so the retried turn can finish. The check requires the reprompt text, the `retry` output type and the `post_agent_turn` hook name in one journal file, and the fire log holds one line, which is the once-per-turn marker working. The spec gate is switched off because the subject may write a file while it compares the two options.

### Expected

Turn `prose-menu` finds the `post_agent_turn` `retry` whose feedback carries the ask-surface reprompt and the `ask_user_question` name, and the fire log holds one line.

### Evidence

Capture `matrix.md`, `checkpoints.tsv`, the turn's `screen.txt` and `check.txt`, plus `setup.log`.

### Pass / Fail

- **Pass**: the journal holds the `post_agent_turn` `retry` with the ask-surface reprompt naming `ask_user_question`, and the fire log holds one line.
- **Fail**: no retry record, a feedback that omits the tool name, or more than one fire for one turn.

### Failure Triage

1. Read turns/prose-menu/check.txt and turns/prose-menu/screen.txt.
2. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `turn-end`.
3. Read the last assistant reply in the journal and confirm it closes on two labelled options with a question beside them.
4. Confirm the session's tool catalog in the journal names `ask_user_question`; a catalog without it passes the turn by design.
5. Pipe a `post_agent` payload with the same session root into `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs` and read its output.

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
| `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs` | The hook under test |
| `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs` | The ask-surface part the hook composes |
| `.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs` | The menu detector, reprompt text and once-per-turn marker |
| `.vibe/hooks.toml` | The hook binding |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-008
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/turn-end-ask-surface-conversation.md`
