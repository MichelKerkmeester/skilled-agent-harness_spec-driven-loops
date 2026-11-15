---
title: "VIB-HK-007 -- A mid-turn compaction re-injects at the next tool call"
description: "This scenario validates that the Vibe compaction-post-tool binding re-injects the compaction context at the tool call that follows an automatic compaction inside one turn, judged from the session journal."
version: 1.0.2.0
---

# VIB-HK-007 -- A mid-turn compaction re-injects at the next tool call

This document captures the operator contract for `VIB-HK-007`.

---

## 1. OVERVIEW

This scenario pins a small-window model in the session's Vibe home, then asks a live session to read a large document and a small one in one turn, so the model compacts while it works. The `compaction-post-tool` binding must then add the compaction context to the tool result the model reads next, because no turn start follows an automatic compaction that lands mid-turn.

### Why This Matters

A headless turn can compact in the middle of its work, and Vibe has no compaction event, so the goal slice, the history offer and the open handoff pointer are gone unless the binding notices the compaction at the next tool call. Only the journal shows whether the binding judged a real compaction, because the injected block rides a tool result rather than a visible message.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the journal evidence.

- Objective: verify that `compaction-post-tool` re-injects the compaction context at the first tool call after an automatic compaction inside one turn.
- Real user request: `Read big.txt with your file read tool, then read small.txt the same way, and reply with small.txt's only line.`, then `Create a file named answer.txt in this folder that holds only the line you read from small.txt.`
- Prompt: `Read big.txt with your file read tool, then read small.txt the same way, and reply with small.txt's only line.`
- Expected execution process: the runner creates a scratch project that is a Git root holding the printed lookup command's file, renders the repository hooks into a fresh `VIBE_HOME`, and its `launch_setup` pins the `compaction-probe` model row from `.vibe/plugins/repo-guards/fixtures/compaction/config.toml` with its window raised to 30,000 tokens, which puts Vibe's default compaction threshold at 15,000. The packet is bound through `VIBE_SPEC_FOLDER`. The subject reads `big.txt`, which crosses the automatic compaction threshold while the turn is still running, then reads `small.txt`. The follow-up turn asks it to act on what it read after the compaction.
- Expected signals: the session config pins `compaction-probe`; a `compaction` checkpoint in the session journal; a `post_tool_call` result with a later sequence whose output carries `Context restored after a compaction.`; and `answer.txt` holding `compaction-proof-ok` after the follow-up.
- Desired user-visible outcome: the session replies with `compaction-proof-ok`, then writes it to `answer.txt`, and no error appears.
- Pass/fail: PASS when all three turn checks pass. FAIL when the probe model is not active, when no compaction is recorded, when no `post_tool_call` after the compaction carries the re-injection, or when the follow-up leaves no `answer.txt` holding the line.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Read big.txt with your file read tool, then read small.txt the same way, and reply with small.txt's only line.`
- Follow-up: `Create a file named answer.txt in this folder that holds only the line you read from small.txt.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-007 | Compaction post-tool re-injection | Re-inject the compaction context at the tool call after an automatic mid-turn compaction | `Read big.txt with your file read tool, then read small.txt the same way, and reply with small.txt's only line.` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/compaction-post-tool.md --runtime vibe --scratch "$(mktemp -d)" --out /tmp/vib-hk-007` | The pinned `compaction-probe` model, a `kind` `compaction` checkpoint, then a later `post_tool_call` result holding `Context restored after a compaction.`, then `answer.txt` | matrix.md, checkpoints.tsv, launch-setup.log, each turn's screen.txt and check.txt | PASS when all three checks pass. FAIL on any other outcome. | 1. Read the read turn's check.txt and screen.txt. 2. Read launch-setup.log and confirm `$VIBE_HOME/config.toml` starts with `active_model = "compaction-probe"`. 3. Pipe a `post_tool` payload naming this session's `transcript_path` into `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs` and read its output. |

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
    "seq 1 2000 | sed 's/^/padding line /' > big.txt",
    "printf 'compaction-proof-ok\\n' > small.txt"
  ],
  "launch_setup": [
    "{ printf 'active_model = \"compaction-probe\"\\n'; cat \"$VIBE_HOME/config.toml\"; printf '\\n'; awk '/^\\[\\[models\\]\\]/{block=\"\"} {block=block $0 \"\\n\"} END{printf \"%s\", block}' \"$CONVERSATION_REPO_ROOT/.vibe/plugins/repo-guards/fixtures/compaction/config.toml\" | sed 's/^max_context_length = .*/max_context_length = 30000/'; } > \"$VIBE_HOME/config.next\" && mv \"$VIBE_HOME/config.next\" \"$VIBE_HOME/config.toml\"",
    "grep -qx 'alias = \"compaction-probe\"' \"$VIBE_HOME/config.toml\" && grep -qx 'max_context_length = 30000' \"$VIBE_HOME/config.toml\""
  ],
  "env": {
    "VIBE_SPEC_FOLDER": "specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios",
    "SYSTEM_SPEC_GATE_DISABLED": "1"
  },
  "turns": [
    {
      "id": "read",
      "send": "Read big.txt with your file read tool, then read small.txt the same way, and reply with small.txt's only line.",
      "questions": [
        {
          "match": "[Ss]pec folder|[Dd]ocumentation|[Ww]hich",
          "answer": {
            "other": "No documentation change; just read the two files."
          },
          "optional": true
        }
      ],
      "check": "node \"$CONVERSATION_REPO_ROOT/.vibe/plugins/repo-guards/fixtures/journal-check.cjs\" \"$VIBE_HOME/logs/session/unified\" model compaction-probe && for i in $(seq 1 30); do node \"$CONVERSATION_REPO_ROOT/.vibe/plugins/repo-guards/fixtures/journal-check.cjs\" \"$VIBE_HOME/logs/session/unified\" compaction && exit 0; sleep 1; done; exit 1",
      "timeout_ms": 480000
    },
    {
      "id": "reinject-after-tool",
      "check": "for i in $(seq 1 20); do node \"$CONVERSATION_REPO_ROOT/.vibe/plugins/repo-guards/fixtures/journal-check.cjs\" \"$VIBE_HOME/logs/session/unified\" reinjection && exit 0; sleep 1; done; exit 1"
    },
    {
      "id": "follow-up",
      "send": "Create a file named answer.txt in this folder that holds only the line you read from small.txt.",
      "questions": [
        {
          "match": "[Ss]pec folder|[Dd]ocumentation|[Ww]hich",
          "answer": {
            "other": "No documentation change; just write answer.txt."
          },
          "optional": true
        }
      ],
      "check": "grep -qx compaction-proof-ok answer.txt && echo answer-written-after-compaction"
    }
  ]
}
```

The composite `pre_agent` part and the `compaction-post-tool` entry share one detector, so the packet arrives through `VIBE_SPEC_FOLDER` and the history offer needs the scratch project to be a checkout root that holds the printed lookup command's file. The automatic compaction is a property of the model's context window, so `launch_setup` prepends `active_model = "compaction-probe"` to the home config and appends the fixture's probe row after the runner has written that config and before Vibe starts. The row's window is raised from the fixture's 20,000 to 30,000 tokens: Vibe's default threshold is half the window with a 10,000 floor, and an interactive session's own instructions and tools already fill about 10,000 tokens, so the fixture's window compacts on every request and never settles. At 30,000 the threshold is 15,000, which the 2,000-line `big.txt` crosses and the compacted history falls well below. The checks read the journal through `.vibe/plugins/repo-guards/fixtures/journal-check.cjs`, which orders the records by sequence, so the re-injection must sit in a `post_tool_call` result after the compaction rather than anywhere in the log.

### Expected

Turn `read` confirms the session pinned `compaction-probe` and finds the automatic compaction's checkpoint in the journal. Turn `reinject-after-tool` finds a `post_tool_call` result after that checkpoint carrying the compaction heading. Turn `follow-up` finds `answer.txt` holding `compaction-proof-ok`.

### Evidence

Capture matrix.md, checkpoints.tsv, each turn's screen.txt and check.txt, plus setup.log and launch-setup.log.

### Pass / Fail

- **Pass**: the probe model is active, the journal holds an automatic compaction checkpoint, a later `post_tool_call` result carries `Context restored after a compaction.`, and the follow-up writes `answer.txt`.
- **Fail**: any of those is missing.

### Failure Triage

1. Read turns/read/check.txt and screen.txt to see whether the turn settled before the document was read.
2. Read launch-setup.log, then confirm the session's `meta.json` under `$VIBE_HOME/logs/session/unified` records `active_model` `compaction-probe`. A different alias means the pin fell back to the default model, whose window never compacts.
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
| `.vibe/plugins/repo-guards/fixtures/compaction/config.toml` | The probe model row the scenario copies with a 30,000-token window |
| `.vibe/plugins/repo-guards/fixtures/journal-check.cjs` | The ordered journal check the turns run |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner, its `vibe` adapter and `launch_setup` |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-007
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/compaction-post-tool.md`
