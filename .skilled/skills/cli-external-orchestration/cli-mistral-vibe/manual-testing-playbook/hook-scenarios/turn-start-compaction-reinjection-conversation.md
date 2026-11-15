---
title: "VIB-HK-006 -- Turn start re-injects the goal slice after a compaction"
description: "This scenario validates that the Vibe turn-start compaction part re-injects the bound packet's goal slice at the first turn start after a manual compaction, judged from the session journal."
version: 1.0.1.0
---

# VIB-HK-006 -- Turn start re-injects the goal slice after a compaction

This document captures the operator contract for `VIB-HK-006`.

---

## 1. OVERVIEW

This scenario starts a live Vibe session that is bound to a spec packet, lets it answer one message, compacts the conversation with `/compact`, and then types one more message. The compaction part of the `turn-start` composer must find the new compaction in the session journal and add the packet's goal slice to that turn's start context.

### Why This Matters

Vibe raises no compaction event and never runs `session_start` again, so the goal slice a session started with is gone for the rest of the run. The re-injection reaches the model as a hidden context item rather than a visible message, so only the journal shows whether the detector answered a real compaction or stayed silent.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the journal evidence.

- Objective: verify that `turn-start` re-injects the bound packet's goal slice at the first turn start after `/compact`.
- Real user request: `Read notes.txt and tell me in one sentence what it says.`
- Prompt: `Read notes.txt and tell me in one sentence what it says.`
- Expected execution process: the runner creates a scratch project that is a Git root, renders the repository hooks into a fresh `VIBE_HOME`, binds the packet through `VIBE_SPEC_FOLDER` and starts Vibe. The subject reads the file, the runner sends `/compact` through the adapter's `compact` action, and the next message starts a new turn.
- Expected signals: a `compaction` checkpoint in the session journal, then a `pre_agent_turn` hook result whose injected text carries `Context restored after a compaction.` and the slice's `# Goal:` heading.
- Desired user-visible outcome: the session answers both messages, the compaction reports that context was compacted, and no error appears.
- Pass/fail: PASS when all three turn checks pass. FAIL when the journal holds no compaction checkpoint, or no re-injection after one.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Read notes.txt and tell me in one sentence what it says.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-006 | Turn-start compaction re-injection | Re-inject the goal slice at the first turn start after `/compact` | `Read notes.txt and tell me in one sentence what it says.` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/turn-start-compaction-reinjection-conversation.md --runtime vibe --scratch "$(mktemp -d)" --out /tmp/vib-hk-006` | A `kind` `compaction` checkpoint, then a `pre_agent_turn` context holding `Context restored after a compaction.` and the packet's `# Goal:` slice | matrix.md, checkpoints.tsv, each turn's screen.txt and check.txt | PASS when all three checks pass. FAIL when the journal holds no compaction checkpoint or no re-injection after it. | 1. Read the compact turn's check.txt and screen.txt. 2. Confirm `$VIBE_HOME/hooks.toml` lists `turn-start`. 3. Pipe a `pre_agent` payload with this session's `transcript_path` into `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` and read its output. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "setup": [
    "git init -q",
    "printf 'alpha\\n' > notes.txt"
  ],
  "env": {
    "VIBE_SPEC_FOLDER": "specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios",
    "SYSTEM_SPEC_GATE_DISABLED": "1"
  },
  "turns": [
    {
      "id": "first-turn",
      "send": "Read notes.txt and tell me in one sentence what it says.",
      "questions": [
        {
          "match": "[Ss]pec folder|[Dd]ocumentation",
          "answer": {
            "other": "No documentation change; just read notes.txt."
          },
          "optional": true
        }
      ],
      "check": "if grep -rqsF 'Context restored after a compaction.' \"$VIBE_HOME/logs/session/unified\"; then echo reinjection-before-compaction; exit 1; fi; if grep -rqs '\"hook\":\"pre_agent_turn\"' \"$VIBE_HOME/logs/session/unified\"; then echo turn-start-with-no-compaction-context; else echo no-pre-agent-turn-record; exit 1; fi"
    },
    {
      "id": "compact",
      "action": "compact",
      "check": "for i in $(seq 1 40); do if grep -rqs '\"kind\":\"compaction\"' \"$VIBE_HOME/logs/session/unified\"; then echo compaction-checkpoint-recorded; exit 0; fi; sleep 1; done; echo no-compaction-checkpoint; exit 1"
    },
    {
      "id": "reinject",
      "send": "Thanks. What should I pick up next in this packet?",
      "questions": [
        {
          "match": "[Ss]pec folder|[Dd]ocumentation|[Ww]hich",
          "answer": {
            "reply": "Pick the next unfinished task in the packet."
          },
          "optional": true
        }
      ],
      "check": "for i in $(seq 1 40); do if grep -rqsF 'Context restored after a compaction.\\n\\n# Goal' \"$VIBE_HOME/logs/session/unified\"; then echo reinjection-with-goal-slice; exit 0; fi; sleep 1; done; echo no-reinjection-with-goal-slice; exit 1"
    }
  ]
}
```

The compaction part reads the packet from `VIBE_SPEC_FOLDER`, which every Vibe hook resolves against the checkout, so setup points it at this phase's folder rather than copying a goal document. The spec gate is switched off for this run, because the scenario judges the compaction part and a refused write would derail the conversation instead.

### Expected

Turn `first-turn` finds the first turn's start record and no compaction context. Turn `compact` finds the manual compaction's checkpoint in the journal. Turn `reinject` finds one record carrying the compaction heading and the packet's goal slice.

### Evidence

Capture matrix.md, checkpoints.tsv, each turn's screen.txt and check.txt, plus setup.log.

### Pass / Fail

- **Pass**: the journal holds a compaction checkpoint, then one record carrying `Context restored after a compaction.` with the packet's goal slice.
- **Fail**: no compaction checkpoint, or no re-injection carrying the goal slice after one.

### Failure Triage

1. Read turns/compact/check.txt and screen.txt to see whether the compaction started and finished.
2. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `turn-start` and that `VIBE_SPEC_FOLDER` reached the subject.
3. Look for the checkpoint in the whole session store, not only its journal: `grep -rqs '"kind":"compaction"' "$VIBE_HOME/logs/session/unified"`. A store that folded the record into `chunks/` and `generations/` while `journal/` keeps only a later tail leaves the detector nothing to read, because it reads the journal directory alone.
4. Pipe a `pre_agent` payload naming this session's `transcript_path` into `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` and read its output.

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
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | The composer that runs the compaction part |
| `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` | The detector, its watermark and the re-injected text |
| `.skilled/hooks/goal/vibe/goal-inject.mjs` | The goal slice renderer the detector calls |
| `.vibe/hooks.toml` | The hook binding |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-006
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/turn-start-compaction-reinjection-conversation.md`
