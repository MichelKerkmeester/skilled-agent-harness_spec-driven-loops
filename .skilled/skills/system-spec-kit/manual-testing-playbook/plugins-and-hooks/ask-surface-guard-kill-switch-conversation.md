---
title: "ask-surface-guard-kill-switch-conversation -- Ask-surface guard kill-switch conversation"
description: "This scenario validates that SYSTEM_ASK_SURFACE_DISABLED=1 stops every ask-surface guard from firing in a real interactive turn."
trigger_phrases:
  - "ask surface guard kill switch"
  - "ask surface disabled live test"
version: 1.0.0.0
---

# ask-surface-guard-kill-switch-conversation -- Ask-surface guard kill-switch conversation

This document captures the conversation contract, expected execution, checkpoint and source anchors for the ask-surface guard.

---

## 1. OVERVIEW

The same colour request runs with `SYSTEM_ASK_SURFACE_DISABLED=1`. The subject may ask in the tool or in chat; the guard must never fire.

### Why This Matters

The kill switch is the rollback path for a guard that sends good turns back. It has to hold on every runtime, in a live session, not only in adapter tests.

---

## 2. SCENARIO CONTRACT

Operators run this scenario in its own runner invocation and scratch project, because the script carries one environment.

- Feature ID: ask-surface-guard-kill-switch-conversation
- Objective: Prove that the kill switch leaves no guard fire in a real turn on every runtime.
- Real user request: The demo widget needs a status badge colour. Give me amber, teal and slate as options A, B and C with one trade-off each, then ask me which one I want. Do not change any files.
- Prompt: The demo widget needs a status badge colour. Give me amber, teal and slate as options A, B and C with one trade-off each, then ask me which one I want. Do not change any files.
- Expected execution process: Start a fresh scratch project with SYSTEM_ASK_SURFACE_DISABLED=1, send the request, answer Teal, count guard fires.
- Expected signals: No `fires.jsonl` line, and Teal visible in the pane.
- Desired user-visible outcome: A PASS or FAIL per runtime with the fire count and pane evidence path.
- Pass/fail: PASS when the fire count is 0 and Teal is visible. FAIL when any fire is recorded.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: The demo widget needs a status badge colour. Give me amber, teal and slate as options A, B and C with one trade-off each, then ask me which one I want. Do not change any files.

### Stage Table

| Stage | Human turn | Answer the human gives | Pause | Checkpoint observable | Expected |
|-------|-------------|-----------------------|-------|------------------------|----------|
| S1 | "The demo widget needs a status badge colour. Give me amber, teal and slate as options A, B and C with one trade-off each, then ask me which one I want. Do not change any files." | select Teal in the tool, or reply Teal in chat | turn [5000, 15000]; answer [3000, 8000] | `fires.jsonl` line count and Teal in history.txt | fires=0, teal=1 |

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
    "SYSTEM_ASK_SURFACE_DISABLED": "1",
    "DEVIN_MODEL": "deepseek-v4-1-flash-1017-max"
  },
  "setup": [
    "git init -q",
    "mkdir -p .claude .opencode .pi .devin .skilled/skills/.state notes",
    "for d in .claude .opencode .pi .devin; do cp -R \"$CONVERSATION_REPO_ROOT/$d/.\" \"$d/\"; done",
    "node -e 'const fs=require(\"fs\");const c=JSON.parse(fs.readFileSync(process.env.CONVERSATION_REPO_ROOT+\"/opencode.json\",\"utf8\"));delete c.mcp;c.model=\"opencode-go/deepseek-v4.1-flash\";for(const a of Object.values(c.agent||{}))a.model=c.model;fs.writeFileSync(\"opencode.json\",JSON.stringify(c,null,2))'",
    "node -e 'const fs=require(\"fs\");const p=\".pi/settings.json\";const c=JSON.parse(fs.readFileSync(p,\"utf8\"));c.defaultProvider=\"opencode-go\";c.defaultModel=\"deepseek-v4.1-flash\";fs.writeFileSync(p,JSON.stringify(c,null,2))'",
    "node -e 'const fs=require(\"fs\");const p=\".devin/config.json\";const c=JSON.parse(fs.readFileSync(p,\"utf8\"));c.agent={...(c.agent||{}),model:\"deepseek-v4-1-flash-1017-max\"};fs.writeFileSync(p,JSON.stringify(c,null,2))'",
    "cp \"$CONVERSATION_REPO_ROOT/AGENTS.md\" AGENTS.md && ln -s AGENTS.md CLAUDE.md",
    "ln -s \"$CONVERSATION_REPO_ROOT/.skilled/hooks\" .skilled/hooks && ln -s \"$CONVERSATION_REPO_ROOT/.skilled/bin\" .skilled/bin && ln -s \"$CONVERSATION_REPO_ROOT/.skilled/skills/system-spec-kit\" .skilled/skills/system-spec-kit",
    "ln -s \"$CONVERSATION_REPO_ROOT/.skilled/commands\" .skilled/commands && ln -s \"$CONVERSATION_REPO_ROOT/.skilled/repo-rules\" .skilled/repo-rules",
    "ln -s \"$CONVERSATION_REPO_ROOT/.skilled/scripts\" .skilled/scripts && for s in sk-code sk-git; do ln -s \"$CONVERSATION_REPO_ROOT/.skilled/skills/$s\" \".skilled/skills/$s\"; done",
    "printf 'Badge colours under review: amber, teal, slate.\\n' > notes/colours.md && printf 'The badge sits beside the widget title.\\n' > notes/placement.md && printf 'Release target: the next demo build.\\n' > notes/release.md"
  ],
  "turns": [
    {
      "id": "S1",
      "send": "The demo widget needs a status badge colour. Give me amber, teal and slate as options A, B and C with one trade-off each, then ask me which one I want. Do not change any files.",
      "delay_ms": [
        5000,
        15000
      ],
      "timeout_ms": 600000,
      "questions": [
        {
          "match": "([Ww]hich|[Pp]ick|[Cc]hoose|[Pp]refer|[Gg]o with)",
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
      "check": "F=\"$PWD/.skilled/skills/.state/ask-surface/fires.jsonl\"; T=\"$CONVERSATION_TURN_DIR\"; mkdir -p \"$T\"; fires=0; if [ -f \"$F\" ]; then cp -p \"$F\" \"$T/\"; fires=$(wc -l < \"$F\" | tr -d ' '); fi; Q=\"$PWD/.skilled/skills/.state/decision-capture\"; tool=0; if [ -d \"$Q\" ] && find \"$Q\" -type f -name '*.jsonl' -exec grep -l '\"session_id\"' {} + 2>/dev/null | xargs grep -l 'Teal' >/dev/null 2>&1; then tool=1; fi; teal=0; grep -Fq 'Teal' \"$T/history.txt\" 2>/dev/null && teal=1; obs=\"observed=runtime=$CONVERSATION_RUNTIME tool=$tool fires=$fires teal=$teal\"; if [ \"$fires\" -ne 0 ] || [ \"$teal\" -ne 1 ]; then printf 'DEVIATION: the guard fired while disabled, or the answer is missing\\n%s\\n' \"$obs\"; exit 1; fi; printf '%s\\n' \"$obs\""
    }
  ]
}
```

### Commands

1. Run `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/ask-surface-guard-kill-switch-conversation.md --runtime claude-code,opencode,pi,devin --scratch /tmp/ask-surface-guard-kill-switch-conversation --out <evidence-dir>`.
2. Setup repoints the scratch project's models: OpenCode and Pi to `opencode-go/deepseek-v4.1-flash`, Devin to `deepseek-v4-1-flash-1017-max`. Claude Code keeps its account default. Record the model each runtime used beside `matrix.md`.

### Expected

The check finds no `fires.jsonl` in the scratch project and finds Teal in `history.txt`.

### Evidence

The check copies any `fires.jsonl` into `CONVERSATION_TURN_DIR` and prints the runtime, tool flag, fire count and Teal visibility.

### Pass / Fail

- **Pass**: fires=0 and teal=1.
- **Fail**: any fire is recorded, or the answer is missing.

### Failure Triage

1. A fire here means an adapter skipped `isHookEnabled('ask-surface')`: name the runtime and its adapter file.
2. Confirm the runner started the subject with the switch set; it is a script-level `env`.
3. A missing answer with fires=0 is a subject or quota problem, not a kill-switch failure.

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
- Playbook ID: ask-surface-guard-kill-switch-conversation
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/ask-surface-guard-kill-switch-conversation.md
