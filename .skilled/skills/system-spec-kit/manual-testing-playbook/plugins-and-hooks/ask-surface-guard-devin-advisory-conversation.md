---
title: "ask-surface-guard-devin-advisory-conversation -- Ask-surface guard Devin advisory conversation"
description: "This scenario validates that on Devin, where Stop cannot block, the ask-surface guard only advises and logs, and the decision still reaches the operator."
trigger_phrases:
  - "ask surface guard devin advisory"
  - "devin prose menu advisory test"
version: 1.0.1.0
---

# ask-surface-guard-devin-advisory-conversation -- Ask-surface guard Devin advisory conversation

This document captures the conversation contract, expected execution, checkpoint and source anchors for the ask-surface guard on Devin.

---

## 1. OVERVIEW

Devin's Stop hook has no documented way to block a finished turn, so the guard there writes an advisory to stderr and a `fires.jsonl` line, and never re-prompts. The request asks for lettered options, so the subject may answer with a prose menu, which the runner answers in chat, or with `ask_user_question`, which the runner answers in the dialog.

### Why This Matters

An advisory adapter that blocked or re-prompted would break Devin sessions. This run proves it stays advisory in a live turn and records each menu it saw.

---

## 2. SCENARIO CONTRACT

Operators run this scenario in its own runner invocation and scratch project.

- Feature ID: ask-surface-guard-devin-advisory-conversation
- Objective: Prove that on Devin the guard only advises, and that the colour decision still reaches the operator.
- Real user request: The demo widget needs a status badge colour. Give me amber, teal and slate as options A, B and C with one trade-off each, then ask me which one I want.
- Prompt: The demo widget needs a status badge colour. Give me amber, teal and slate as options A, B and C with one trade-off each, then ask me which one I want.
- Expected execution process: Start a fresh scratch project, send the request, answer Teal in the dialog or in chat, then count guard fires and advisory fires.
- Expected signals: Teal in the pane, and every `fires.jsonl` line in `advise` mode.
- Desired user-visible outcome: A PASS or FAIL with the fire count, the advisory count and the pane evidence path.
- Pass/fail: PASS when Teal is visible and every fire is an advisory. FAIL when Teal is missing or any fire has another mode.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: The demo widget needs a status badge colour. Give me amber, teal and slate as options A, B and C with one trade-off each, then ask me which one I want.

### Stage Table

| Stage | Human turn | Answer the human gives | Pause | Checkpoint observable | Expected |
|-------|-------------|-----------------------|-------|------------------------|----------|
| S1 | "The demo widget needs a status badge colour. Give me amber, teal and slate as options A, B and C with one trade-off each, then ask me which one I want." | select Teal in the dialog, or reply Teal to a lettered chat menu | turn [5000, 15000]; answer [3000, 8000] | `fires.jsonl` line and advise counts, Teal in history.txt | teal=1, fires equal to advise |

### Conversation Script

```json conversation
{
  "runtimes": [
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
      "send": "The demo widget needs a status badge colour. Give me amber, teal and slate as options A, B and C with one trade-off each, then ask me which one I want.",
      "delay_ms": [
        5000,
        15000
      ],
      "timeout_ms": 600000,
      "questions": [
        {
          "match": "([Ww]hich (status|colou?r|badge|option)|[Ww]hat colou?r|[Pp]ick|[Cc]hoose|[Pp]refer|[Gg]o with|[Ss]elect)",
          "optional": true,
          "answer": {
            "select": [
              "Teal"
            ]
          },
          "delay_ms": [
            3000,
            8000
          ]
        },
        {
          "match": "\\n\\s*[-*]?\\s*\\**\\(?C[).:]",
          "optional": true,
          "answer": {
            "reply": "Teal"
          },
          "delay_ms": [
            3000,
            8000
          ]
        }
      ],
      "check": "F=\"$PWD/.skilled/skills/.state/ask-surface/fires.jsonl\"; T=\"$CONVERSATION_TURN_DIR\"; mkdir -p \"$T\"; fires=0; advise=0; if [ -f \"$F\" ]; then cp -p \"$F\" \"$T/\"; fires=$(wc -l < \"$F\" | tr -d ' '); advise=$(grep -c '\"mode\":\"advise\"' \"$F\"); fi; teal=0; grep -Fq 'Teal' \"$T/history.txt\" 2>/dev/null && teal=1; obs=\"observed=runtime=$CONVERSATION_RUNTIME fires=$fires advise=$advise teal=$teal\"; if [ \"$teal\" -ne 1 ] || [ \"$fires\" -ne \"$advise\" ]; then printf 'DEVIATION: Teal never reached the pane, or the guard did more than advise\\n%s\\n' \"$obs\"; exit 1; fi; printf '%s\\n' \"$obs\""
    }
  ]
}
```

### Commands

1. Run `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/ask-surface-guard-devin-advisory-conversation.md --runtime devin --scratch /tmp/ask-surface-guard-devin-advisory-conversation --out <evidence-dir>`.
2. Setup pins Devin to `deepseek-v4-1-flash-1017-max` through `DEVIN_MODEL`. Record the model shown in the pane footer beside `matrix.md`.

### Expected

The check finds Teal in `history.txt`, and every `fires.jsonl` line carries `"mode":"advise"`. advise=1 means the subject wrote a prose menu and the guard logged it; advise=0 means it asked through `ask_user_question` first.

### Evidence

The check copies `fires.jsonl` into `CONVERSATION_TURN_DIR` and prints the runtime, fire count, advisory count and Teal visibility as its observed value.

### Pass / Fail

- **Pass**: teal=1 and fires equals advise.
- **Fail**: teal=0, or a fire in a mode other than `advise`.
- **Judged by the operator**: advise=0 means the guard was never exercised on that run. Note it in the runtime row; it is not a failure.

### Failure Triage

1. Read `screen.txt` and `history.txt` for the last reply before the answer.
2. teal=0 with a lettered menu on screen means the chat reply never matched: compare the menu's label format with the `C)` pattern in the script.
3. A model, quota or session-start hook error belongs in the runtime row as the blocker, not as a guard failure.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root playbook and scenario index |

### Implementation And Test Anchors

| File | Role |
|---|---|
| .skilled/hooks/ask-surface-guard/devin/ask-surface-stop.cjs | Devin Stop entry point |
| .skilled/hooks/ask-surface-guard/lib/advisory-stop.cjs | Advisory Stop runner: stderr notice and `fires.jsonl` line, never a block |
| .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs | Detector and the `fires.jsonl` log the check counts |
| .skilled/repo-rules/communication-handoff.md section 5 | The question tool each runtime should use |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md | JSON conversation schema and exit outcomes |

Provenance: manual only - a live conversation that the shared conversation runner drives in a scratch project

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: ask-surface-guard-devin-advisory-conversation
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/ask-surface-guard-devin-advisory-conversation.md
