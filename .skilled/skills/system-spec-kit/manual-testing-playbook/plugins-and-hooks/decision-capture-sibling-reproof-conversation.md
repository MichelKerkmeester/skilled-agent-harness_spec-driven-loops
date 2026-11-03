---
title: "decision-capture-sibling-reproof-conversation -- Decision capture sibling re-proof conversation"
description: "This scenario re-proves hand-written table matching and mid-message chat questions in one live Claude Code conversation."
trigger_phrases:
  - "decision capture sibling re-proof conversation"
  - "decision capture table match live test"
  - "decision capture mid-message chat question live test"
version: 1.0.0.0
---

# decision-capture-sibling-reproof-conversation -- Decision capture sibling re-proof conversation

This document captures the sibling re-proof scenario contract, expected execution, checkpoints and source anchors.

---

## 1. OVERVIEW

This scenario extends decision-capture-live-conversation with two stages, without changing that scenario. S13 writes a hand-written decision row for an answer already queued, and S5b asks a plain chat question in the middle of a message.

### Why This Matters

A save must consume an answer that a hand-written decision table already holds under that row's id rather than write a second row. A chat question asked above the closing paragraph must still be offered to the save step, keyed stably and within the per-message cap.

---

## 2. SCENARIO CONTRACT

Operators run this scenario in its own runner invocation and scratch project on Claude Code, because chat candidates come from the Claude transcript sweep.

- Feature ID: decision-capture-sibling-reproof-conversation
- Objective: Prove in one live conversation that a queued answer matching a hand-written row is consumed under that row's id, and that a mid-message chat question is offered once.
- Real user request: Add a status badge to the demo widget, answer a colour question, keep a hand-written decision for it, answer a chat question asked mid-message, then save.
- Prompt: Add a status badge to the demo widget in this project. Once you know where it is documented, stop and wait: write nothing until I tell you, and ask me product questions only when I tell you to.
- Expected execution process: Answer Gate 3, select Amber, copy the queued answer into a hand-written row Q050, answer the mid-message chat question, run a full-auto save and read the queue, consumed log, record and nudge.
- Expected signals: The colour key is consumed as Q050, one table row mentions Amber, the chat answer is in the record, no process question is anywhere, nothing is pending and the nudge reads 0.
- Desired user-visible outcome: A PASS or FAIL verdict per stage with the observed values in each check output.
- Pass/fail: PASS when every stage check prints its observed line. FAIL when any check prints DEVIATION.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: Add a status badge to the demo widget in this project. Once you know where it is documented, stop and wait: write nothing until I tell you, and ask me product questions only when I tell you to.

### Stage Table

| Stage | Human turn | Answer the human gives | Pause | Checkpoint observable | Expected |
|-------|-------------|-----------------------|-------|------------------------|----------|
| S0 | none | none | [5000, 15000] | Queue rows | 0 rows |
| S1 | The prompt above | "A) Existing, specs/demo/001-demo-widget" to Gate 3 | turn [5000, 15000]; answer [3000, 8000] | Queue rows and screen | 0 rows, Gate 3 visible |
| S2 | "Before you write anything, ask me with your question tool which colour the badge uses, offering exactly Amber, Teal and Slate. One choice." | select Amber | turn [5000, 15000]; answer [3000, 8000] | Queue rows | 1 row |
| S13 | none | none | none | Hand-written row Q050 copied from the queued answer | `hand_row=Q050` |
| S5b | "Do not use the tool this time. In the middle of your reply, ask me one plain question about whether the badge shows a count, then end your reply with a one-line status that is not a question." | "Yes, show the count." | turn [5000, 15000]; answer [3000, 8000] | `sweep-transcript.mjs` chat candidates | 1 count candidate, keyed mid-message, at most 3 per message |
| S6 | "/speckit:save specs/demo/001-demo-widget --full-auto" | none | [5000, 15000] | Consumed log, record and pending count | Colour consumed as Q050, 1 Amber row, chat answer recorded, 0 pending, 0 process rows |
| S14 | none | none | [5000, 15000] | Nudge file | 0 |

### Conversation Script

```json conversation
{
  "runtimes": [
    "claude-code"
  ],
  "setup": [
    "git init -q",
    "mkdir -p specs/demo .claude .opencode .codex .pi .devin .skilled/skills/.state",
    "for d in .claude .opencode .codex .pi .devin; do cp -R \"$CONVERSATION_REPO_ROOT/$d/.\" \"$d/\"; done",
    "python3 -c 'from pathlib import Path; p=Path(\".codex/config.toml\"); s=p.read_text(); k=\"default_mode_request_user_input\"; marker=\"[features]\\n\"; s=s if k in s else (s.replace(marker, marker+k+\" = true\\n\", 1) if marker in s else k+\" = true\\n\"+s); p.write_text(s)'",
    "cp \"$CONVERSATION_REPO_ROOT/AGENTS.md\" AGENTS.md && ln -s AGENTS.md CLAUDE.md",
    "ln -s \"$CONVERSATION_REPO_ROOT/.skilled/hooks\" .skilled/hooks && ln -s \"$CONVERSATION_REPO_ROOT/.skilled/bin\" .skilled/bin && ln -s \"$CONVERSATION_REPO_ROOT/.skilled/skills/system-spec-kit\" .skilled/skills/system-spec-kit",
    "ln -s \"$CONVERSATION_REPO_ROOT/.skilled/commands\" .skilled/commands && ln -s \"$CONVERSATION_REPO_ROOT/.skilled/repo-rules\" .skilled/repo-rules",
    "ln -s \"$CONVERSATION_REPO_ROOT/.skilled/hooks/decision-capture/lib/capture-core.mjs\" .dc.mjs",
    "bash \"$CONVERSATION_REPO_ROOT/.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh\" --path specs/demo/001-demo-widget --name \"demo widget\" --level 3 --with-lazy-addons"
  ],
  "turns": [
    {
      "id": "S0",
      "delay_ms": [
        5000,
        15000
      ],
      "check": "Q=.skilled/skills/.state/decision-capture;T=$CONVERSATION_TURN_DIR;R=$CONVERSATION_REPO_ROOT;cp $Q/* \"$T\" 2>/dev/null;(rg --files \"$R/specs\";cat \"$R/.skilled/skills/.state/decision-capture/\"* 2>/dev/null)|shasum>\"$T/base.sha\";rg -q '\"session_id\"' $Q/*.jsonl 2>/dev/null&&{ echo \"DEVIATION: queue rows\";exit 1;};echo \"rows=0 base=base.sha\""
    },
    {
      "id": "S1",
      "send": "Add a status badge to the demo widget in this project. Once you know where it is documented, stop and wait: write nothing until I tell you, and ask me product questions only when I tell you to.",
      "delay_ms": [
        5000,
        15000
      ],
      "questions": [
        {
          "match": "([Ss]pec folder|[Gg]ate 3|[Ww]hich .*folder|[Dd]ocumentation|specs/demo)",
          "optional": true,
          "answer": {
            "other": "A) Existing, specs/demo/001-demo-widget"
          },
          "delay_ms": [
            3000,
            8000
          ]
        },
        {
          "match": "([Ss]pec folder|[Gg]ate 3|[Ww]hich .*folder|[Dd]ocumentation|specs/demo)",
          "optional": true,
          "answer": {
            "reply": "A) Existing, specs/demo/001-demo-widget"
          },
          "delay_ms": [
            3000,
            8000
          ]
        }
      ],
      "check": "Q=.skilled/skills/.state/decision-capture;cp $Q/* \"$CONVERSATION_TURN_DIR\" 2>/dev/null;m=$(rg -c '\"session_id\"' $Q/*.jsonl 2>/dev/null);[ -z \"$m\" ]&&rg -q -i 'gate 3|spec folder' \"$CONVERSATION_TURN_DIR/screen.txt\"&&echo \"rows=0 gate3=visible\"||{ echo \"DEVIATION: queue rows or no Gate 3 question\";exit 1;}"
    },
    {
      "id": "S2",
      "send": "Before you write anything, ask me with your question tool which colour the badge uses, offering exactly Amber, Teal and Slate. One choice.",
      "delay_ms": [
        5000,
        15000
      ],
      "retry": 1,
      "questions": [
        {
          "match": "([Cc]olou?r|Amber|Teal|Slate)",
          "answer": {
            "select": [
              "Amber"
            ]
          },
          "delay_ms": [
            3000,
            8000
          ]
        }
      ],
      "check": "Q=.skilled/skills/.state/decision-capture;T=\"$CONVERSATION_TURN_DIR\";cp $Q/* \"$T\" 2>/dev/null;n=$(jq -s 'map(select(.session_id))|length' $Q/*.jsonl);[ \"$n\" = 1 ]&&echo \"rows=$n\"||{ echo \"DEVIATION: rows=$n\";exit 1;}"
    },
    {
      "id": "S13",
      "check": "Q=.skilled/skills/.state/decision-capture;T=\"$CONVERSATION_TURN_DIR\";cp $Q/* \"$T\" 2>/dev/null;node --input-type=module -e 'import{readFileSync as r,readdirSync as l,appendFileSync as a,writeFileSync as w}from\"node:fs\";const d=\".skilled/skills/.state/decision-capture\";const f=l(d).find((n)=>n.endsWith(\".jsonl\")&&n!==\"consumed.jsonl\");const rec=r(d+\"/\"+f,\"utf8\").trim().split(\"\\n\").map((x)=>JSON.parse(x)).find((x)=>x.kind===\"tool\");const c=(s)=>String(s).replace(/[|]/g,\"/\").replace(/\\n/g,\" \");const row=[\"Q050\",rec.captured_at.slice(0,10),c(rec.header),c(rec.question),rec.options.map(c).join(\"; \"),c(rec.answer)];a(\"specs/demo/001-demo-widget/decision-record.md\",\"\\n## Hand-Written Decisions\\n\\n| ID | Date | Topic | Question | Options offered | Answer (verbatim) |\\n|----|------|-------|----------|-----------------|-------------------|\\n| \"+row.join(\" | \")+\" |\\n\");w(\".hand.key\",rec.key);console.log(\"hand_row=Q050 answer=\"+rec.answer);'||{ echo \"DEVIATION: no queued tool answer to copy\";exit 1;}"
    },
    {
      "id": "S5b",
      "send": "Do not use the tool this time. In the middle of your reply, ask me one plain question about whether the badge shows a count, then end your reply with a one-line status that is not a question.",
      "delay_ms": [
        5000,
        15000
      ],
      "questions": [
        {
          "match": "([Cc]ount|[Nn]umber)",
          "answer": {
            "reply": "Yes, show the count."
          },
          "delay_ms": [
            3000,
            8000
          ]
        }
      ],
      "check": "Q=.skilled/skills/.state/decision-capture;T=\"$CONVERSATION_TURN_DIR\";cp $Q/* \"$T\" 2>/dev/null;node .skilled/hooks/decision-capture/bin/sweep-transcript.mjs>\"$T/sweep.json\"||{ echo \"DEVIATION: sweep failed\";exit 1;};o=$(jq -r '[.chat_candidates[]|select(.question|test(\"count\";\"i\"))] as $c|[$c[]|select(.key|test(\":p[0-9a-f]{12}(-[0-9]+)?$\"))] as $m|((.chat_candidates|group_by(.question_turn_id)|map(length)|max)//0) as $x|\"count_candidates=\\($c|length) mid_message=\\($m|length) max_per_message=\\($x)\"' \"$T/sweep.json\");case \"$o\" in \"count_candidates=1 mid_message=1 max_per_message=\"[0-3])echo \"$o\";;*)echo \"DEVIATION: $o\";exit 1;;esac"
    },
    {
      "id": "S6",
      "send": "/speckit:save specs/demo/001-demo-widget --full-auto",
      "delay_ms": [
        5000,
        15000
      ],
      "check": "Q=.skilled/skills/.state/decision-capture;T=\"$CONVERSATION_TURN_DIR\";cp $Q/* \"$T\" 2>/dev/null;D=specs/demo/001-demo-widget/decision-record.md;cp $D \"$T/decision-record.md\";k=$(cat .hand.key);s=$(jq -sr 'map(.session_id//empty)|last' $Q/*.jsonl);id=$(jq -r --arg k \"$k\" 'select(.key==$k)|.id' $Q/consumed.jsonl 2>/dev/null|head -1);amber=$(rg -c -i '^[|] Q[0-9]+ [|].*amber' $D);chat=$(rg -c 'show the count' $D);proc=$( (rg -i '^[|] Q.*(spec folder|gate 3)' $D;rg -i 'spec folder|gate 3' $Q/*.jsonl) 2>/dev/null|wc -l|tr -d ' ');p=$(node --input-type=module -e 'import{pendingRecords as p}from\"./.dc.mjs\";console.log(p(\".\",process.argv[1]).length)' \"$s\");o=\"hand_id=$id amber_rows=$amber chat_rows=${chat:-0} pending=$p process_rows=$proc\";[ \"$id\" = Q050 ]&&[ \"$amber\" = 1 ]&&[ \"${chat:-0}\" -ge 1 ]&&[ \"$p\" = 0 ]&&[ \"$proc\" = 0 ]&&echo \"$o\"||{ echo \"DEVIATION: $o\";exit 1;}"
    },
    {
      "id": "S14",
      "delay_ms": [
        5000,
        15000
      ],
      "check": "Q=.skilled/skills/.state/decision-capture;T=\"$CONVERSATION_TURN_DIR\";cp $Q/* \"$T\" 2>/dev/null;v=$(cat $Q/*.nudge 2>/dev/null);[ \"$v\" = 0 ]&&echo \"nudge=0\"||{ echo \"DEVIATION: nudge=$v\";exit 1;}"
    }
  ]
}
```

### Commands

1. Run this scenario on Claude Code in its own runner invocation, after decision-capture-live-conversation, so its scratch project starts empty.
2. Keep every turn folder: S5b holds `sweep.json`, and S6 holds the record after the save.

### Expected

S13 prints `hand_row=Q050`. S5b prints `count_candidates=1 mid_message=1` with a per-message maximum of 3 or less. S6 prints `hand_id=Q050 amber_rows=1`, a chat row count of 1 or more, `pending=0` and `process_rows=0`. S14 prints `nudge=0`.

### Evidence

Each check copies the queue, consumed log and nudge files into CONVERSATION_TURN_DIR. S5b also writes the sweep output, and S6 copies the demo packet's `decision-record.md`.

### Pass / Fail

- **Pass**: Every stage check prints its observed line and exits 0.
- **Fail**: A check prints DEVIATION, or the subject asks the chat question in its closing paragraph instead of mid-message.

### Failure Triage

1. If S5b reports `mid_message=0` with one count candidate, the subject ended its reply with the question. Quote the pane line and rerun; that is a subject deviation, not a sweep defect.
2. If S6 reports an empty `hand_id`, check whether the subject ran `match-decision-table.js` as the save step says. A second Amber row means it wrote an entry instead.
3. If S14 reports a nudge above 0, read the S6 consumed log for the keys still pending.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root playbook and scenario index |
| [decision-capture-live-conversation](decision-capture-live-conversation.md) | The scenario these stages extend |
| [operator-decision-capture](../../feature-catalog/ux-hooks/operator-decision-capture.md) | Feature contract for operator decision capture |

### Implementation And Test Anchors

| File | Role |
|---|---|
| .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts | Consumes a hand-written row's id for a matching answer |
| .skilled/hooks/decision-capture/bin/sweep-transcript.mjs | Offers chat candidates from every asking paragraph |
| .skilled/commands/speckit/save.md | Tells the save step to match hand-written rows and to write chat entries |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md | JSON conversation schema and exit outcomes |

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: decision-capture-sibling-reproof-conversation
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/decision-capture-sibling-reproof-conversation.md
