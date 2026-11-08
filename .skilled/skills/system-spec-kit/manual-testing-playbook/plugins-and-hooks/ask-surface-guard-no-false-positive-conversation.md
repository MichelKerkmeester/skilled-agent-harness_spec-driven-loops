---
title: "ask-surface-guard-no-false-positive-conversation -- Ask-surface guard no false positive conversation"
description: "This scenario validates that the ask-surface guard leaves an ordinary numbered summary alone in a real interactive turn."
trigger_phrases:
  - "ask surface guard false positive"
  - "numbered summary not a menu"
version: 1.0.1.0
---

# ask-surface-guard-no-false-positive-conversation -- Ask-surface guard no false positive conversation

This document captures the conversation contract, expected execution, checkpoint and source anchors for the ask-surface guard.

---

## 1. OVERVIEW

The subject summarises three notes as a numbered list, a reply that looks like a menu to a careless detector. The guard must not fire.

### Why This Matters

A guard that sends ordinary summaries back costs the operator a wasted turn every time. The fixture suite covers numbered steps; this run checks a live model's own formatting.

---

## 2. SCENARIO CONTRACT

Operators run this scenario in its own runner invocation and scratch project.

- Feature ID: ask-surface-guard-no-false-positive-conversation
- Objective: Prove that a numbered summary from a live subject records no guard fire.
- Real user request: Summarise what is in the notes folder as a numbered list.
- Prompt: Summarise what is in the notes folder as a numbered list.
- Expected execution process: Start a fresh scratch project holding three notes, send the request, answer any closing question with no, count guard fires.
- Expected signals: No `fires.jsonl` line, and the placement note appears in the summary.
- Desired user-visible outcome: A PASS or FAIL per runtime with the fire count and pane evidence path.
- Pass/fail: PASS when the fire count is 0 and the summary is present. FAIL when the guard fires.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: Summarise what is in the notes folder as a numbered list.

### Stage Table

| Stage | Human turn | Answer the human gives | Pause | Checkpoint observable | Expected |
|-------|-------------|-----------------------|-------|------------------------|----------|
| S1 | "Summarise what is in the notes folder as a numbered list." | reply No, that is all, if the subject asks | turn [5000, 15000]; answer [3000, 8000] | `fires.jsonl` line count and the placement note in history.txt | fires=0, listed=1 |

### Conversation Script

```json conversation
{
  "runtimes": [
    "claude-code",
    "opencode",
    "pi",
    "devin"
  ],
  "env": {
    "DEVIN_MODEL": "deepseek-v4-1-flash-1017-max"
  },
  "setup": [
    "git init -q",
    "mkdir -p .claude .opencode .pi .devin notes",
    "for d in .claude .opencode .pi .devin; do cp -R \"$CONVERSATION_REPO_ROOT/$d/.\" \"$d/\"; done",
    "node -e 'const fs=require(\"fs\");const c=JSON.parse(fs.readFileSync(process.env.CONVERSATION_REPO_ROOT+\"/opencode.json\",\"utf8\"));delete c.mcp;c.model=\"opencode-go/deepseek-v4.1-flash\";for(const a of Object.values(c.agent||{}))a.model=c.model;fs.writeFileSync(\"opencode.json\",JSON.stringify(c,null,2))'",
    "node -e 'const fs=require(\"fs\");const p=\".pi/settings.json\";const c=JSON.parse(fs.readFileSync(p,\"utf8\"));c.defaultProvider=\"opencode-go\";c.defaultModel=\"deepseek-v4.1-flash\";fs.writeFileSync(p,JSON.stringify(c,null,2))'",
    "node -e 'const fs=require(\"fs\");const p=\".devin/config.json\";const c=JSON.parse(fs.readFileSync(p,\"utf8\"));c.agent={...(c.agent||{}),model:\"deepseek-v4-1-flash-1017-max\"};fs.writeFileSync(p,JSON.stringify(c,null,2))'",
    "cp \"$CONVERSATION_REPO_ROOT/AGENTS.md\" AGENTS.md && ln -s AGENTS.md CLAUDE.md",
    "cp -R \"$CONVERSATION_REPO_ROOT/.skilled\" .skilled && rm -rf .skilled/skills/.state && mkdir -p .skilled/skills/.state",
    "printf 'Badge colours under review: amber, teal, slate.\\n' > notes/colours.md && printf 'The badge sits beside the widget title.\\n' > notes/placement.md && printf 'Release target: the next demo build.\\n' > notes/release.md"
  ],
  "turns": [
    {
      "id": "S1",
      "send": "Summarise what is in the notes folder as a numbered list.",
      "delay_ms": [
        5000,
        15000
      ],
      "timeout_ms": 600000,
      "questions": [
        {
          "match": "([Ww]ant|[Ss]hould I|[Ww]ould you|[Aa]nything else)",
          "optional": true,
          "answer": {
            "reply": "No, that is all."
          },
          "delay_ms": [
            3000,
            8000
          ]
        }
      ],
      "check": "F=\"$PWD/.skilled/skills/.state/ask-surface/fires.jsonl\"; T=\"$CONVERSATION_TURN_DIR\"; mkdir -p \"$T\"; fires=0; if [ -f \"$F\" ]; then cp -p \"$F\" \"$T/\"; fires=$(wc -l < \"$F\" | tr -d ' '); fi; listed=0; grep -Eq '[Pp]lacement|beside the widget title' \"$T/history.txt\" 2>/dev/null && listed=1; obs=\"observed=runtime=$CONVERSATION_RUNTIME fires=$fires listed=$listed\"; if [ \"$fires\" -ne 0 ] || [ \"$listed\" -ne 1 ]; then printf 'DEVIATION: the guard fired on a plain numbered summary, or the summary is missing\\n%s\\n' \"$obs\"; exit 1; fi; printf '%s\\n' \"$obs\""
    }
  ]
}
```

### Commands

1. Run `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/ask-surface-guard-no-false-positive-conversation.md --runtime claude-code,opencode,pi,devin --scratch /tmp/ask-surface-guard-no-false-positive-conversation --out <evidence-dir>`.
2. Setup repoints the scratch project's models: OpenCode and Pi to `opencode-go/deepseek-v4.1-flash`, Devin to `deepseek-v4-1-flash-1017-max`. Claude Code keeps its account default. Record the model each runtime used beside `matrix.md`.

### Expected

The check finds no `fires.jsonl` in the scratch project and finds the placement note in `history.txt`.

### Evidence

The check copies any `fires.jsonl` into `CONVERSATION_TURN_DIR` and prints the runtime, fire count and summary flag.

### Pass / Fail

- **Pass**: fires=0 and listed=1.
- **Fail**: the guard fired on the summary, or the summary is missing.

### Failure Triage

1. A fire here is a detector false positive: copy the subject's reply from `history.txt` into a new fixture with `expected: pass`.
2. A missing summary is a subject or quota problem, not a guard failure.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root playbook and scenario index |

### Implementation And Test Anchors

| File | Role |
|---|---|
| .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs | Detector, verdict, per-turn marker and the `fires.jsonl` log the checks count |
| .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs | Claude Code synchronous Stop guard |
| .opencode/plugins/ask-surface-guard.js | OpenCode `session.idle` guard |
| .skilled/hooks/ask-surface-guard/pi/ask-surface-guard.ts | Pi `agent_end` guard |
| .skilled/hooks/ask-surface-guard/lib/advisory-stop.cjs | Devin and Codex advisory Stop runner |
| .skilled/repo-rules/communication-handoff.md section 5 | The question tool each runtime should use |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md | JSON conversation schema and exit outcomes |

Provenance: manual only - a live conversation that the shared conversation runner drives in a scratch project

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: ask-surface-guard-no-false-positive-conversation
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/ask-surface-guard-no-false-positive-conversation.md
