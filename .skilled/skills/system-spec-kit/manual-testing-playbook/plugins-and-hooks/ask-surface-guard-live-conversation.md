---
title: "ask-surface-guard-live-conversation -- Ask-surface guard live conversation"
description: "This scenario validates that a colour decision a real subject asks the operator lands in the runtime's question tool, with the guard sending a prose menu back where the runtime allows it."
trigger_phrases:
  - "ask surface guard live conversation"
  - "prose option menu live test"
  - "question tool enforcement scenario"
version: 1.0.1.0
---

# ask-surface-guard-live-conversation -- Ask-surface guard live conversation

This document captures the conversation contract, expected execution, checkpoint and source anchors for the ask-surface guard.

---

## 1. OVERVIEW

The request asks for the three colours as lettered options and a question, which is the prose menu the rule forbids. On Claude Code, OpenCode and Pi the decision must still reach the operator through the question tool, either asked there first or sent back there by the guard. Devin's guard only advises, so Devin runs in its own scenario.

### Why This Matters

Unit fixtures prove the detector, not that a live model, once sent back, actually re-asks through the tool. This run shows the end state the operator sees and counts the guard's fires.

---

## 2. SCENARIO CONTRACT

Operators run this scenario in its own runner invocation and scratch project.

- Feature ID: ask-surface-guard-live-conversation
- Objective: Prove that a live operator decision reaches the question tool on every enforcing runtime, and record how often the guard had to send the turn back.
- Real user request: The demo widget needs a status badge colour. Give me amber, teal and slate as options A, B and C with one trade-off each, then ask me which one I want.
- Prompt: The demo widget needs a status badge colour. Give me amber, teal and slate as options A, B and C with one trade-off each, then ask me which one I want.
- Expected execution process: Start a fresh scratch project, send the request, select Teal when the question tool asks, and never answer in chat, then count decision-capture queue rows and guard fires.
- Expected signals: Claude Code, OpenCode and Pi each show a queued tool answer of Teal, and every run records its fire count.
- Desired user-visible outcome: A PASS or FAIL per runtime with the tool flag, the fire count and the pane evidence path.
- Pass/fail: PASS when the runtime queued a Teal tool answer. FAIL when the turn ended without one.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: The demo widget needs a status badge colour. Give me amber, teal and slate as options A, B and C with one trade-off each, then ask me which one I want.

### Stage Table

| Stage | Human turn | Answer the human gives | Pause | Checkpoint observable | Expected |
|-------|-------------|-----------------------|-------|------------------------|----------|
| S1 | "The demo widget needs a status badge colour. Give me amber, teal and slate as options A, B and C with one trade-off each, then ask me which one I want." | select Teal in the tool; a chat menu gets no answer | turn [5000, 15000]; answer [3000, 8000] | Decision-capture queue rows holding Teal, `fires.jsonl` line count | tool=1, fires recorded |

### Conversation Script

```json conversation
{
  "runtimes": [
    "claude-code",
    "opencode",
    "pi"
  ],
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
        }
      ],
      "check": "F=\"$PWD/.skilled/skills/.state/ask-surface/fires.jsonl\"; T=\"$CONVERSATION_TURN_DIR\"; mkdir -p \"$T\"; fires=0; if [ -f \"$F\" ]; then cp -p \"$F\" \"$T/\"; fires=$(wc -l < \"$F\" | tr -d ' '); fi; Q=\"$PWD/.skilled/skills/.state/decision-capture\"; tool=0; if [ -d \"$Q\" ] && find \"$Q\" -type f -name '*.jsonl' -exec grep -l '\"session_id\"' {} + 2>/dev/null | xargs grep -l 'Teal' >/dev/null 2>&1; then tool=1; fi; teal=0; grep -Fq 'Teal' \"$T/history.txt\" 2>/dev/null && teal=1; obs=\"observed=runtime=$CONVERSATION_RUNTIME tool=$tool fires=$fires teal=$teal\"; ok=$tool; if [ \"$ok\" -ne 1 ]; then printf 'DEVIATION: the colour decision did not reach the expected surface\\n%s\\n' \"$obs\"; exit 1; fi; printf '%s\\n' \"$obs\""
    }
  ]
}
```

### Commands

1. Run `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/ask-surface-guard-live-conversation.md --runtime claude-code,opencode,pi --scratch /tmp/ask-surface-guard-live-conversation --out <evidence-dir>`.
2. Setup repoints the scratch project's models: OpenCode and Pi to `opencode-go/deepseek-v4.1-flash`. Claude Code keeps its account default. Record the model each runtime used beside `matrix.md`.

### Expected

The check finds a decision-capture queue row whose answer is Teal, which only a question-tool answer writes. The runner never answers in chat, so a menu the guard failed to send back leaves the turn without that row. The fire count shows whether the guard had to send the turn back.

### Evidence

The check copies `fires.jsonl` into `CONVERSATION_TURN_DIR` and prints the runtime, tool flag, fire count and Teal visibility as its observed value.

### Pass / Fail

- **Pass**: tool=1.
- **Fail**: tool=0.
- **Judged by the operator**: tool=1 with fires=0 means the subject asked through the tool first, so the guard was never exercised on that run. Note it in the runtime row; it is not a failure.

### Failure Triage

1. Read `screen.txt` and `history.txt` for the last reply before the answer.
2. tool=0 with fires=0 means the detector missed the menu: copy the reply into a new fixture.
3. tool=0 with fires=1 means the subject was sent back and still did not use the tool: quote its second reply.
4. A model or quota error belongs in the runtime row as the blocker, not as a guard failure.

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
| .skilled/repo-rules/communication-handoff.md section 5 | The question tool each runtime should use |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md | JSON conversation schema and exit outcomes |

Provenance: manual only - a live conversation that the shared conversation runner drives in a scratch project

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: ask-surface-guard-live-conversation
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/ask-surface-guard-live-conversation.md
