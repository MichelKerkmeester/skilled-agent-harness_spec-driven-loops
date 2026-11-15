---
title: "VIB-HK-007 -- A mid-turn compaction re-injects at the next tool call"
description: "This scenario validates that the Vibe compaction-post-tool binding re-injects the compaction context at the tool call that follows an automatic compaction inside one turn, judged from the session journal."
version: 1.0.0.0
---

# VIB-HK-007 -- A mid-turn compaction re-injects at the next tool call

This document captures the operator contract for `VIB-HK-007`.

---

## 1. OVERVIEW

This scenario asks a live Vibe session to read a document large enough that a small-window model compacts while it works. The `compaction-post-tool` binding must then add the compaction context to the tool result the model reads next, because no turn start follows an automatic compaction that lands mid-turn.

### Why This Matters

A headless turn can compact in the middle of its work, and Vibe has no compaction event, so the goal slice, the history offer and the open handoff pointer are gone unless the binding notices the compaction at the next tool call. Only the journal shows whether the binding judged a real compaction, because the injected block rides a tool result rather than a visible message.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the journal evidence.

- Objective: verify that `compaction-post-tool` re-injects the compaction context at the first tool call after an automatic compaction inside one turn.
- Real user request: `Read big.txt and tell me in one sentence what it contains.`
- Prompt: `Read big.txt and tell me in one sentence what it contains.`
- Expected execution process: the runner creates a scratch project that is a Git root holding the printed lookup command's file, renders the repository hooks into a fresh `VIBE_HOME`, binds the packet through `VIBE_SPEC_FOLDER` and starts Vibe. The subject reads the document, and the read crosses the model's automatic compaction threshold while the turn is still running.
- Expected signals: a `compaction` checkpoint in the session journal, then a `post_tool_call` record whose added context carries `Context restored after a compaction.` and the packet's goal slice.
- Desired user-visible outcome: the session answers the request in one sentence and no error appears.
- Pass/fail: PASS when both turn checks pass. FAIL when a compaction is recorded and no tool call after it carries the re-injection. A run that records no compaction reports SKIP with the blocker the first check names, because the runner cannot install the small-window model config the compaction needs.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Read big.txt and tell me in one sentence what it contains.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-007 | Compaction post-tool re-injection | Re-inject the compaction context at the tool call after an automatic mid-turn compaction | `Read big.txt and tell me in one sentence what it contains.` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/compaction-post-tool-conversation.md --runtime vibe --scratch "$(mktemp -d)" --out /tmp/vib-hk-007` | A `kind` `compaction` checkpoint, then a `post_tool_call` context holding `Context restored after a compaction.` and the packet's goal slice | matrix.md, checkpoints.tsv, each turn's screen.txt and check.txt | PASS when both checks pass. FAIL when a compaction is recorded and the next tool call carries no re-injection. SKIP with the named blocker when no compaction is recorded. | 1. Read the read turn's check.txt and screen.txt. 2. Confirm `$VIBE_HOME/hooks.toml` lists `compaction-post-tool` and `$VIBE_HOME/config.toml` pins no small context window. 3. Pipe a `post_tool` payload naming this session's `transcript_path` into `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs` and read its output. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "setup": [
    "git init -q",
    "mkdir -p .skilled/skills/system-spec-kit/runtime/dist/hooks/lib/history",
    "printf '// the printed lookup command\\n' > .skilled/skills/system-spec-kit/runtime/dist/hooks/lib/history/cli.js",
    "seq 1 1200 | sed 's/^/padding line /' > big.txt"
  ],
  "env": {
    "VIBE_SPEC_FOLDER": "specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios",
    "SYSTEM_SPEC_GATE_DISABLED": "1"
  },
  "turns": [
    {
      "id": "read",
      "send": "Read big.txt and tell me in one sentence what it contains.",
      "questions": [
        {
          "match": "[Ss]pec folder|[Dd]ocumentation|[Ww]hich",
          "answer": {
            "other": "No documentation change; just read big.txt."
          },
          "optional": true
        }
      ],
      "check": "for i in $(seq 1 30); do if grep -rqs '\"kind\":\"compaction\"' \"$VIBE_HOME/logs/session/unified\"; then echo compaction-checkpoint-recorded; exit 0; fi; sleep 1; done; echo 'no automatic compaction: the runner installs the repository model config, so the subject keeps its full context window'; exit 77"
    },
    {
      "id": "reinject-after-tool",
      "check": "if ! grep -rqs '\"kind\":\"compaction\"' \"$VIBE_HOME/logs/session/unified\"; then echo 'no automatic compaction: the runner installs the repository model config, so the subject keeps its full context window'; exit 77; fi; for i in $(seq 1 20); do if grep -rqsF 'Context restored after a compaction.\\n\\n# Goal' \"$VIBE_HOME/logs/session/unified\" && grep -rqs '\"hook\":\"post_tool_call\"' \"$VIBE_HOME/logs/session/unified\"; then echo reinjection-on-next-tool-call; exit 0; fi; sleep 1; done; echo no-reinjection-after-compaction; exit 1"
    }
  ]
}
```

The composite `pre_agent` part and the `compaction-post-tool` entry share one detector, so the packet arrives through `VIBE_SPEC_FOLDER` and the history offer needs the scratch project to be a checkout root that holds the printed lookup command's file. The automatic compaction this scenario needs is a property of the model's context window: the runner copies the repository's model config into the fresh home, so the subject runs with the full window and only a long turn on a real window compacts. The first check names that as its blocker instead of reporting a failure, and the second check judges the re-injection once a run does record a compaction.

### Expected

Turn `read` finds the automatic compaction's checkpoint in the journal, or names the missing small-window config as its blocker. Turn `reinject-after-tool` finds one record carrying the compaction heading and the packet's goal slice, and that record is the added context of a `post_tool_call`.

### Evidence

Capture matrix.md, checkpoints.tsv, each turn's screen.txt and check.txt, plus setup.log.

### Pass / Fail

- **Pass**: the journal holds an automatic compaction checkpoint and a `post_tool_call` context carrying `Context restored after a compaction.` with the packet's goal slice.
- **Fail**: a compaction is recorded and no tool call after it carries the re-injection.
- **Skip**: no compaction is recorded, because the runner cannot install the small-window model config the behavior needs; the blocker line names it and the operator procedure carries the manual steps.

### Failure Triage

1. Read turns/read/check.txt and screen.txt to see whether the turn settled before the document was read.
2. Confirm `$VIBE_HOME/config.toml` carries the repository model rows and no `max_context_length` or `auto_compact_threshold`, which keeps the compaction from triggering.
3. Pipe a `post_tool` payload naming this session's `transcript_path` into `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs` and read its output.

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
| `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs` | The hook under test |
| `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` | The detector, its journal-size check and the re-injected text |
| `.vibe/hooks.toml` | The hook binding |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-007
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/compaction-post-tool-conversation.md`
