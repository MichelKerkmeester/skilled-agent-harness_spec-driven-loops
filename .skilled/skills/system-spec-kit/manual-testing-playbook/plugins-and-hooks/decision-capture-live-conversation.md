---
title: "decision-capture-live-conversation -- Decision capture live conversation"
description: "This scenario validates decision capture across a timed live conversation, queue and nudge checks, two saves, compaction and restart."
trigger_phrases:
  - "decision capture live conversation"
  - "decision capture runtime matrix"
  - "live decision capture scenario"
version: 1.0.5.0
---

# decision-capture-live-conversation -- Decision capture live conversation

This document captures the live conversation contract, expected execution, per-stage checks, source anchors and metadata for decision capture.

---

## 1. OVERVIEW

This scenario drives a real interactive subject through product questions, a full-auto save, context compaction, a restart and a repeat save in an isolated scratch project.

### Why This Matters

Fixture-based scenarios do not prove that real answers survive the runtime question surface, compaction and restart, or that save-time capture leaves the scratch record stable. The per-turn checks keep the queue, nudge and decision record visible as the conversation runs.

---

## 2. SCENARIO CONTRACT

Operators run the exact conversation script for decision-capture-live-conversation and record each stage result with its evidence path.

- Feature ID: decision-capture-live-conversation
- Objective: Prove that product answers are captured once, process questions are excluded, the save writes the expected decisions, compaction and restart preserve the queue, and a repeat save is byte-identical.
- Real user request: I am adding a status badge to the demo widget. Ask me the product questions, keep my answers through compaction and a restart, then show that saving them twice does not duplicate the record.
- Prompt: Add a status badge to the demo widget in this project. Once you know where it is documented, stop and wait: write nothing until I tell you, and ask me product questions only when I tell you to.
- Expected execution process: Build the scratch repository in the runner's current folder, run S0 through S11 in one interactive session, and copy queue, consumed log, nudge files and decision record into each turn evidence folder. Run the kill-switch scenario separately for S12.
- Expected signals: S1 asks the Gate 3 process question and records no process answer; S2 to S4 add three queued product answers; S5 adds a plain chat answer without a hook queue row; S6 saves four decisions; S7 to S9 add three more answers across compaction and restart; S10 saves seven decisions; S11 leaves the record byte-identical.
- Desired user-visible outcome: A PASS, FAIL or SKIP for every stage, with the observed value and evidence path, plus one populated runtime matrix row.
- Pass/fail: PASS when each applicable expected value is observed and the real repository baseline remains unchanged. FAIL when a subject deviation or an expected value mismatch is recorded. SKIP only when the stage cannot apply on the runtime and the named blocker is recorded.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: Add a status badge to the demo widget in this project. Once you know where it is documented, stop and wait: write nothing until I tell you, and ask me product questions only when I tell you to.

### Stage Table

Every turn uses delay_ms [5000, 15000]; every answer uses delay_ms [3000, 8000]. The runner draws the pauses from its recorded seed. Q is the project subfolder `queueDir(".")` returns under `.skilled/skills/.state/decision-capture` inside the scratch project, and a queue row is a record carrying a session id, so the consumed log is never counted as a row.

| Stage | Human turn or action | Answer the human gives | Pause | Checkpoint observable | Expected |
|-------|----------------------|-----------------------|-------|------------------------|----------|
| S0 | Check-only turn: record the real repository baseline and the scratch queue state | none | turn range | Real specs file list plus real queue content in base.sha, scratch queue rows | Baseline saved, 0 scratch queue rows |
| S1 | "Add a status badge to the demo widget in this project. Once you know where it is documented, stop and wait: write nothing until I tell you, and ask me product questions only when I tell you to." | Gate 3: reply A) Existing, specs/demo/001-demo-widget | turn and answer ranges | Scratch queue rows and the Gate 3 question in screen.txt | 0 queue rows, Gate 3 question visible on Claude Code (other runtimes record whether a read-only first turn asked it), no process answer queued |
| S2 | "Before you write anything, ask me with your question tool which colour the badge uses, offering exactly Amber, Teal and Slate. One choice. Open the tool itself, not a chat message, and mark no option as recommended." | select Amber | turn and answer ranges | Queue rows and nudge file value, with the nudge line in screen.txt | 1 queue row, answer Amber, 1 nudge line, nudge value 1 |
| S3 | "Now ask me with your question tool which platforms the badge must support, offering exactly Web, iOS and Android. Let me pick several; if your tool takes one choice, use it anyway and I will type the rest as a note. Open the tool itself, not a chat message, and mark no option as recommended." | select every offered label: Web, iOS and Android | turn and answer ranges | Queue rows and nudge file value, with the joined answer in the queue row | 2 queue rows, answer joins the three labels, 1 nudge line, nudge value 2 |
| S4 | "Ask me with your question tool for the badge label, with a few options. I will type my own. Open the tool itself, not a chat message." | Other: Needs review | turn and answer ranges | Queue rows and nudge file value, with the typed answer in the queue row | 3 queue rows, answer Needs review, 1 nudge line, nudge value 3 |
| S5 | "Do not use the tool this time. End your reply with one plain question to me about whether the badge should blink." | reply No, keep it static. | turn and answer ranges | Queue rows and nudge file value, with the blink question and the reply in screen.txt | 3 queue rows unchanged, 0 nudge lines this turn, nudge value 3 |
| S6 | Run /speckit:save specs/demo/001-demo-widget --full-auto: follow .skilled/commands/speckit/save.md. | none | turn range | Decision rows and appendix items in the record, consumed rows and keys, pendingRecords, queue rows, SPECKIT_LEVEL before and after | 4 rows and 4 items, 4 consumed rows and keys, no decided text equals its verbatim answer, pending 0, queue still 3, level unchanged, nudge value 0 |
| S7 | "Ask me with the tool whether the badge sits left or right of the title, offering exactly Left and Right. Open the tool itself, not a chat message, and mark no option as recommended." | select Right | turn and answer ranges | Queue rows and the queue digest saved for the compaction stage, nudge line in screen.txt | 4 queue rows, answer Right, queue digest saved, 1 nudge line, nudge value 1 |
| S8 | S8-compact compacts context; S8-ask sends "Ask me with the tool which size the badge uses, offering exactly Small, Medium and Large. Open the tool itself, not a chat message, and mark no option as recommended." | select Small | each turn and answer use their ranges | Queue digest and rows across the compaction, then queue rows and nudge file value | Digest and 4 rows unchanged by the compaction; then 5 queue rows, answer Small, 1 nudge line, nudge value 2 |
| S9 | S9-restart restarts into the same session; S9-ask sends "Ask me with the tool whether the badge has a tooltip, offering exactly Yes and No. Open the tool itself, not a chat message, and mark no option as recommended." | select Yes | each turn and answer use their ranges | Queue rows and the distinct session ids across the queue, then the same after the answer | 5 rows and 1 session id after the restart; then 6 rows, answer Yes, still 1 session id, 1 nudge line |
| S10 | Run /speckit:save specs/demo/001-demo-widget --full-auto: follow .skilled/commands/speckit/save.md. | none | turn range | Decision rows and items, consumed rows and keys, pendingRecords, record copy for the repeat save | 7 rows and 7 items, 7 consumed rows and keys, pending 0, record copy saved, nudge value 0 |
| S11 | The S10 save request again | none | turn range | Byte comparison against the S10 record copy, decision rows, nudge file value | Comparison exits 0, 7 decision rows, 0 nudge lines, nudge value 0 |

### Conversation Script

```json conversation
{
  "runtimes": [
    "claude-code",
    "opencode",
    "codex",
    "pi",
    "devin"
  ],
  "setup": [
    "git init -q",
    "mkdir -p specs/demo .claude .opencode .codex .pi .devin .skilled/skills/.state",
    "for d in .claude .opencode .codex .pi .devin; do cp -R \"$CONVERSATION_REPO_ROOT/$d/.\" \"$d/\"; done",
    "node -e 'const fs=require(\"fs\");const c=JSON.parse(fs.readFileSync(process.env.CONVERSATION_REPO_ROOT+\"/opencode.json\",\"utf8\"));delete c.mcp;fs.writeFileSync(\"opencode.json\",JSON.stringify(c,null,2))'",
    "python3 -c 'from pathlib import Path; p=Path(\".codex/config.toml\"); s=p.read_text(); k=\"default_mode_request_user_input\"; marker=\"[features]\\n\"; s=s if k in s else (s.replace(marker, marker+k+\" = true\\n\", 1) if marker in s else k+\" = true\\n\"+s); p.write_text(s)'",
    "cp \"$CONVERSATION_REPO_ROOT/AGENTS.md\" AGENTS.md && ln -s AGENTS.md CLAUDE.md",
    "ln -s \"$CONVERSATION_REPO_ROOT/.skilled/hooks\" .skilled/hooks && ln -s \"$CONVERSATION_REPO_ROOT/.skilled/bin\" .skilled/bin && ln -s \"$CONVERSATION_REPO_ROOT/.skilled/skills/system-spec-kit\" .skilled/skills/system-spec-kit",
    "ln -s \"$CONVERSATION_REPO_ROOT/.skilled/commands\" .skilled/commands && ln -s \"$CONVERSATION_REPO_ROOT/.skilled/repo-rules\" .skilled/repo-rules",
    "ln -s \"$CONVERSATION_REPO_ROOT/.skilled/hooks/decision-capture/lib/capture-core.mjs\" .dc.mjs",
    "bash \"$CONVERSATION_REPO_ROOT/.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh\" --path specs/demo/001-demo-widget --name \"demo widget\" --level 3 --with-lazy-addons",
    "git add -f specs && git -c user.name=demo -c user.email=demo@example.invalid commit -qm \"demo packet\""
  ],
  "turns": [
    {
      "id": "S0",
      "delay_ms": [
        5000,
        15000
      ],
      "check": "Q=$(node --input-type=module -e 'import{queueDir as q}from\"./.skilled/hooks/decision-capture/lib/capture-core.mjs\";console.log(q(\".\"))');case \"$Q\" in /*);; *) echo \"DEVIATION: queue folder unresolved\";exit 1;; esac;T=$CONVERSATION_TURN_DIR;R=$CONVERSATION_REPO_ROOT;cp $Q/* \"$T\" 2>/dev/null;(rg --files \"$R/specs\";find \"$R/.skilled/skills/.state/decision-capture\" -type f -exec cat {} + 2>/dev/null)|shasum>\"$T/base.sha\";rg -q '\"session_id\"' $Q/*.jsonl 2>/dev/null&&{ echo \"DEVIATION: queue rows\";exit 1;};echo \"rows=0 base=base.sha\""
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
            "other": "A) Existing, specs/demo/001-demo-widget. Keep waiting: write nothing until I tell you."
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
            "reply": "A) Existing, specs/demo/001-demo-widget. Keep waiting: write nothing until I tell you."
          },
          "delay_ms": [
            3000,
            8000
          ]
        }
      ],
      "check": "Q=$(node --input-type=module -e 'import{queueDir as q}from\"./.skilled/hooks/decision-capture/lib/capture-core.mjs\";console.log(q(\".\"))');case \"$Q\" in /*);; *) echo \"DEVIATION: queue folder unresolved\";exit 1;; esac;cp $Q/* \"$CONVERSATION_TURN_DIR\" 2>/dev/null;m=$(rg -c '\"session_id\"' $Q/*.jsonl 2>/dev/null);g=not-asked;rg -q -i 'gate 3|spec folder' \"$CONVERSATION_TURN_DIR/screen.txt\"&&g=visible;[ -z \"$m\" ]&&{ [ $CONVERSATION_RUNTIME != claude-code ]||[ $g = visible ]; }&&echo \"rows=0 gate3=$g\"||{ echo \"DEVIATION: rows=${m:-0} gate3=$g\";exit 1;}"
    },
    {
      "id": "S2",
      "send": "Before you write anything, ask me with your question tool which colour the badge uses, offering exactly Amber, Teal and Slate. One choice. Open the tool itself, not a chat message, and mark no option as recommended.",
      "delay_ms": [
        5000,
        15000
      ],
      "retry": 1,
      "questions": [
        {
          "match": "([Cc]olou?r|Amber|Teal|Slate|[Ff]ill|[Ss]hade|[Hh]ue)",
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
      "check": "[ $CONVERSATION_RUNTIME = codex ]&&echo \"no live queue on codex\"&&exit 77;Q=$(node --input-type=module -e 'import{queueDir as q}from\"./.skilled/hooks/decision-capture/lib/capture-core.mjs\";console.log(q(\".\"))');case \"$Q\" in /*);; *) echo \"DEVIATION: queue folder unresolved\";exit 1;; esac;cp $Q/* \"$CONVERSATION_TURN_DIR\" 2>/dev/null;n=$(jq -s 'map(select(.session_id))|length' $Q/*.jsonl);v=$(cat $Q/*.nudge 2>/dev/null);o=\"rows=$n nudge=$v\";case $CONVERSATION_RUNTIME in claude-code|opencode|devin|pi) w=1;; *) w=;; esac;[ \"$n\" = 1 ]&&[ \"$v\" = \"$w\" ]&&echo \"$o\"||{ echo \"DEVIATION: $o\";exit 1;}"
    },
    {
      "id": "S3",
      "send": "Now ask me with your question tool which platforms the badge must support, offering exactly Web, iOS and Android. Let me pick several; if your tool takes one choice, use it anyway and I will type the rest as a note. Open the tool itself, not a chat message, and mark no option as recommended.",
      "delay_ms": [
        5000,
        15000
      ],
      "retry": 1,
      "questions": [
        {
          "match": "([Pp]latform|Web|iOS|Android|[Tt]arget|[Dd]evice|[Aa]ppear|[Ss]hip|[Ss]upport)",
          "answer": {
            "select": [
              "Web",
              "iOS",
              "Android"
            ],
            "multi": true
          },
          "delay_ms": [
            3000,
            8000
          ]
        }
      ],
      "check": "[ $CONVERSATION_RUNTIME = codex ]&&echo \"no live queue on codex\"&&exit 77;Q=$(node --input-type=module -e 'import{queueDir as q}from\"./.skilled/hooks/decision-capture/lib/capture-core.mjs\";console.log(q(\".\"))');case \"$Q\" in /*);; *) echo \"DEVIATION: queue folder unresolved\";exit 1;; esac;cp $Q/* \"$CONVERSATION_TURN_DIR\" 2>/dev/null;n=$(jq -s 'map(select(.session_id))|length' $Q/*.jsonl);v=$(cat $Q/*.nudge 2>/dev/null);o=\"rows=$n nudge=$v\";case $CONVERSATION_RUNTIME in claude-code|opencode|devin|pi) w=2;; *) w=;; esac;[ \"$n\" = 2 ]&&[ \"$v\" = \"$w\" ]&&echo \"$o\"||{ echo \"DEVIATION: $o\";exit 1;}"
    },
    {
      "id": "S4",
      "send": "Ask me with your question tool for the badge label, with a few options. I will type my own. Open the tool itself, not a chat message.",
      "delay_ms": [
        5000,
        15000
      ],
      "retry": 1,
      "questions": [
        {
          "match": "([Ll]abel|[Tt]ext|[Ww]ording|say|show)",
          "answer": {
            "other": "Needs review"
          },
          "delay_ms": [
            3000,
            8000
          ]
        }
      ],
      "check": "[ $CONVERSATION_RUNTIME = codex ]&&echo \"no live queue on codex\"&&exit 77;Q=$(node --input-type=module -e 'import{queueDir as q}from\"./.skilled/hooks/decision-capture/lib/capture-core.mjs\";console.log(q(\".\"))');case \"$Q\" in /*);; *) echo \"DEVIATION: queue folder unresolved\";exit 1;; esac;cp $Q/* \"$CONVERSATION_TURN_DIR\" 2>/dev/null;n=$(jq -s 'map(select(.session_id))|length' $Q/*.jsonl);v=$(cat $Q/*.nudge 2>/dev/null);o=\"rows=$n nudge=$v\";case $CONVERSATION_RUNTIME in claude-code|opencode|devin|pi) w=3;; *) w=;; esac;[ \"$n\" = 3 ]&&[ \"$v\" = \"$w\" ]&&echo \"$o\"||{ echo \"DEVIATION: $o\";exit 1;}"
    },
    {
      "id": "S5",
      "send": "Do not use the tool this time. End your reply with one plain question to me about whether the badge should blink.",
      "delay_ms": [
        5000,
        15000
      ],
      "retry": 1,
      "questions": [
        {
          "match": "([Bb]link|[Aa]nimat|[Ff]lash|[Pp]ulse)",
          "answer": {
            "reply": "No, keep it static."
          },
          "delay_ms": [
            3000,
            8000
          ]
        }
      ],
      "check": "[ $CONVERSATION_RUNTIME = codex ]&&echo \"no live queue on codex\"&&exit 77;Q=$(node --input-type=module -e 'import{queueDir as q}from\"./.skilled/hooks/decision-capture/lib/capture-core.mjs\";console.log(q(\".\"))');case \"$Q\" in /*);; *) echo \"DEVIATION: queue folder unresolved\";exit 1;; esac;cp $Q/* \"$CONVERSATION_TURN_DIR\" 2>/dev/null;n=$(jq -s 'map(select(.session_id))|length' $Q/*.jsonl);v=$(cat $Q/*.nudge 2>/dev/null);o=\"rows=$n nudge=$v\";case $CONVERSATION_RUNTIME in claude-code|opencode|devin|pi) w=3;; *) w=;; esac;[ \"$n\" = 3 ]&&[ \"$v\" = \"$w\" ]&&echo \"$o\"||{ echo \"DEVIATION: $o\";exit 1;}"
    },
    {
      "id": "S6",
      "send": "Run /speckit:save specs/demo/001-demo-widget --full-auto: follow .skilled/commands/speckit/save.md.",
      "delay_ms": [
        5000,
        15000
      ],
      "check": "Q=$(node --input-type=module -e 'import{queueDir as q}from\"./.skilled/hooks/decision-capture/lib/capture-core.mjs\";console.log(q(\".\"))');case \"$Q\" in /*);; *) echo \"DEVIATION: queue folder unresolved\";exit 1;; esac;cp $Q/* \"$CONVERSATION_TURN_DIR\" 2>/dev/null;cp specs/demo/001-demo-widget/decision-record.md \"$CONVERSATION_TURN_DIR/\" 2>/dev/null;s=$(jq -sr 'map(.session_id//empty)|last' $Q/*.jsonl);p=$(node --input-type=module -e 'import{pendingRecords as p}from\"./.dc.mjs\";console.log(p(\".\",process.argv[1]).length)' \"$s\");r=$(grep -cE '^[|] Q[0-9]+ [|]' specs/demo/001-demo-widget/decision-record.md 2>/dev/null);o=\"pending=$p rows=$r\";[ \"$p\" = 0 ]&&[ \"$r\" = 4 ]&&echo \"$o\"||{ echo \"DEVIATION: $o\";exit 1;}"
    },
    {
      "id": "S7",
      "send": "Ask me with the tool whether the badge sits left or right of the title, offering exactly Left and Right. Open the tool itself, not a chat message, and mark no option as recommended.",
      "delay_ms": [
        5000,
        15000
      ],
      "retry": 1,
      "questions": [
        {
          "match": "([Ll]eft|[Rr]ight|[Pp]osition|[Ss]ide|[Pp]lace|[Ww]here|[Rr]elative|[Tt]itle|\\bsits?\\b)",
          "answer": {
            "select": [
              "Right"
            ]
          },
          "delay_ms": [
            3000,
            8000
          ]
        }
      ],
      "check": "[ $CONVERSATION_RUNTIME = codex ]&&echo \"no live queue on codex\"&&exit 77;Q=$(node --input-type=module -e 'import{queueDir as q}from\"./.skilled/hooks/decision-capture/lib/capture-core.mjs\";console.log(q(\".\"))');case \"$Q\" in /*);; *) echo \"DEVIATION: queue folder unresolved\";exit 1;; esac;cp $Q/* \"$CONVERSATION_TURN_DIR\" 2>/dev/null;n=$(jq -s 'map(select(.session_id))|length' $Q/*.jsonl);[ \"$n\" = 4 ]&&shasum $Q/*.jsonl>.queue.sha&&echo \"rows=$n digest=saved\"||{ echo \"DEVIATION: rows=$n\";exit 1;}"
    },
    {
      "id": "S8-compact",
      "action": "compact",
      "delay_ms": [
        5000,
        15000
      ],
      "check": "[ $CONVERSATION_RUNTIME = codex ]&&echo \"no live queue on codex\"&&exit 77;Q=$(node --input-type=module -e 'import{queueDir as q}from\"./.skilled/hooks/decision-capture/lib/capture-core.mjs\";console.log(q(\".\"))');case \"$Q\" in /*);; *) echo \"DEVIATION: queue folder unresolved\";exit 1;; esac;cp $Q/* \"$CONVERSATION_TURN_DIR\" 2>/dev/null;a=$(cat .queue.sha 2>/dev/null);b=$(shasum $Q/*.jsonl);n=$(jq -s 'map(select(.session_id))|length' $Q/*.jsonl);[ -n \"$a\" ]&&[ \"$a\" = \"$b\" ]&&[ \"$n\" = 4 ]&&echo \"rows=$n digest=unchanged\"||{ echo \"DEVIATION: rows=$n or the digest changed\";exit 1;}"
    },
    {
      "id": "S8-ask",
      "send": "Ask me with the tool which size the badge uses, offering exactly Small, Medium and Large. Open the tool itself, not a chat message, and mark no option as recommended.",
      "delay_ms": [
        5000,
        15000
      ],
      "retry": 1,
      "questions": [
        {
          "match": "([Ss]ize|[Ss]mall|[Mm]edium|[Ll]arge|[Bb]ig|[Dd]imension|[Ss]cale)",
          "answer": {
            "select": [
              "Small"
            ]
          },
          "delay_ms": [
            3000,
            8000
          ]
        }
      ],
      "check": "[ $CONVERSATION_RUNTIME = codex ]&&echo \"no live queue on codex\"&&exit 77;Q=$(node --input-type=module -e 'import{queueDir as q}from\"./.skilled/hooks/decision-capture/lib/capture-core.mjs\";console.log(q(\".\"))');case \"$Q\" in /*);; *) echo \"DEVIATION: queue folder unresolved\";exit 1;; esac;cp $Q/* \"$CONVERSATION_TURN_DIR\" 2>/dev/null;n=$(jq -s 'map(select(.session_id))|length' $Q/*.jsonl);v=$(cat $Q/*.nudge 2>/dev/null);o=\"rows=$n nudge=$v\";case $CONVERSATION_RUNTIME in claude-code|opencode|devin|pi) w=2;; *) w=;; esac;[ \"$n\" = 5 ]&&[ \"$v\" = \"$w\" ]&&echo \"$o\"||{ echo \"DEVIATION: $o\";exit 1;}"
    },
    {
      "id": "S9-restart",
      "action": "restart",
      "delay_ms": [
        5000,
        15000
      ],
      "check": "[ $CONVERSATION_RUNTIME = codex ]&&echo \"no live queue on codex\"&&exit 77;Q=$(node --input-type=module -e 'import{queueDir as q}from\"./.skilled/hooks/decision-capture/lib/capture-core.mjs\";console.log(q(\".\"))');case \"$Q\" in /*);; *) echo \"DEVIATION: queue folder unresolved\";exit 1;; esac;cp $Q/* \"$CONVERSATION_TURN_DIR\" 2>/dev/null;n=$(jq -s 'map(select(.session_id))|length' $Q/*.jsonl);c=$(jq -s 'map(.session_id//empty)|unique|length' $Q/*.jsonl);[ \"$n\" = 5 ]&&[ \"$c\" = 1 ]&&echo \"rows=$n sessions=$c\"||{ echo \"DEVIATION: rows=$n sessions=$c\";exit 1;}"
    },
    {
      "id": "S9-ask",
      "send": "Ask me with the tool whether the badge has a tooltip, offering exactly Yes and No. Open the tool itself, not a chat message, and mark no option as recommended.",
      "delay_ms": [
        5000,
        15000
      ],
      "retry": 1,
      "questions": [
        {
          "match": "([Tt]ooltip|[Hh]over)",
          "answer": {
            "select": [
              "Yes"
            ]
          },
          "delay_ms": [
            3000,
            8000
          ]
        }
      ],
      "check": "[ $CONVERSATION_RUNTIME = codex ]&&echo \"no live queue on codex\"&&exit 77;Q=$(node --input-type=module -e 'import{queueDir as q}from\"./.skilled/hooks/decision-capture/lib/capture-core.mjs\";console.log(q(\".\"))');case \"$Q\" in /*);; *) echo \"DEVIATION: queue folder unresolved\";exit 1;; esac;cp $Q/* \"$CONVERSATION_TURN_DIR\" 2>/dev/null;n=$(jq -s 'map(select(.session_id))|length' $Q/*.jsonl);c=$(jq -s 'map(.session_id//empty)|unique|length' $Q/*.jsonl);[ \"$n\" = 6 ]&&[ \"$c\" = 1 ]&&echo \"rows=$n sessions=$c\"||{ echo \"DEVIATION: rows=$n sessions=$c\";exit 1;}"
    },
    {
      "id": "S10",
      "send": "Run /speckit:save specs/demo/001-demo-widget --full-auto: follow .skilled/commands/speckit/save.md.",
      "delay_ms": [
        5000,
        15000
      ],
      "check": "Q=$(node --input-type=module -e 'import{queueDir as q}from\"./.skilled/hooks/decision-capture/lib/capture-core.mjs\";console.log(q(\".\"))');case \"$Q\" in /*);; *) echo \"DEVIATION: queue folder unresolved\";exit 1;; esac;cp $Q/* \"$CONVERSATION_TURN_DIR\" 2>/dev/null;cp specs/demo/001-demo-widget/decision-record.md .s10;cp .s10 \"$CONVERSATION_TURN_DIR/decision-record.md\";s=$(jq -sr 'map(.session_id//empty)|last' $Q/*.jsonl);p=$(node --input-type=module -e 'import{pendingRecords as p}from\"./.dc.mjs\";console.log(p(\".\",process.argv[1]).length)' \"$s\");r=$(grep -cE '^[|] Q[0-9]+ [|]' .s10);o=\"pending=$p rows=$r\";[ \"$p\" = 0 ]&&[ \"$r\" = 7 ]&&echo \"$o\"||{ echo \"DEVIATION: $o\";exit 1;}"
    },
    {
      "id": "S11",
      "send": "Run /speckit:save specs/demo/001-demo-widget --full-auto: follow .skilled/commands/speckit/save.md.",
      "delay_ms": [
        5000,
        15000
      ],
      "check": "Q=$(node --input-type=module -e 'import{queueDir as q}from\"./.skilled/hooks/decision-capture/lib/capture-core.mjs\";console.log(q(\".\"))');case \"$Q\" in /*);; *) echo \"DEVIATION: queue folder unresolved\";exit 1;; esac;cp $Q/* \"$CONVERSATION_TURN_DIR\" 2>/dev/null;g=$(rg -c '^\\| Q' specs/demo/001-demo-widget/decision-record.md);cmp -s .s10 specs/demo/001-demo-widget/decision-record.md&&[ \"$g\" = 7 ]&&echo \"record_rows=$g repeat=identical\"||{ echo \"DEVIATION: record_rows=$g or the copy no longer matches\";exit 1;}"
    }
  ]
}
```

### Runtime Matrix

Record one row per runtime with these columns: Runtime, CLI version, Model, Question tool (AskUserQuestion, question, request_user_input, ask-user-question, ask_user_question or no answer surface), Answer path (live hook, save-time sweep or none), S1 to S12 (each PASS, FAIL or SKIP with one reason), Nudge sequence observed, Verdict, Evidence folder.

Claude Code writes the nudge from its Stop hook and OpenCode from its system transform, so both carry a checked nudge sequence. Devin's Stop hook writes the same nudge file but discards the message, so its checks expect the nudge value without a displayed line. Pi queues each answer live and shows the nudge through its extension at the end of a turn, so its checks expect the same nudge sequence as Claude Code. Codex queues nothing live, because its answers are read at save time, so its nine live-queue cells, the five nudge-bearing ones plus S7, S8-compact, S9-restart and S9-ask, read SKIP with the blocker the check prints. Its answers are proven at S6, S10 and S11, which read the decision record. The nudge cells for S7 and S9 come from their pane captures, because those two checks assert the queue and the session ids instead.

### Checkpoint Derivation

For each runtime, derive the 13-row checkpoints.tsv from the runner's main run and the separate kill-switch run. Copy the main-run rows for S0 to S7 and S10 to S11, merge S8-compact and S8-ask into one S8 row and S9-restart and S9-ask into one S9 row, each with both evidence paths and observed values, then append S12 from the kill-switch run. Twelve rows come from the main run and the thirteenth from the kill-switch run. Keep the columns stage, status, evidence path and observed value.

### Stage Marks and Siblings

A subject deviation is FAIL, and its check prints a `DEVIATION: ...` line carrying what was measured. A stage that does not apply is a SKIP from a check that exits 77 and prints its blocker as the first output line, which is why the nine live-queue checks read CONVERSATION_RUNTIME before anything else: on codex they print `no live queue on codex` and exit 77, and the run continues with the later stages. On every other runtime they count the queue rows, and they expect the nudge value on claude-code, opencode and devin.

Sibling folders extend this scenario without changing it: 002-table-row-matching, 003-codex-and-pi-capture, 004-opencode-devin-live-capture and 005-chat-question-detection. A sibling adds a stage as S13 and up, or a variant such as S5b, and never renumbers an existing stage. It reruns the conversation on its runtime and appends a matrix row with the commit it tests. 002 adds a hand-written row to the demo record before S6 and checks it is matched rather than duplicated. 003 fills the Codex and Pi rows, including the Codex question surface. 004 turns the OpenCode and Devin nudge cells from SKIP to a checked sequence. 005 adds S5b, a chat question asked mid-message.

### Commands

1. Run the scenario once for each runtime with the 065 runner, recording its seed and model. The setup links the capture core into the scratch project as .dc.mjs so the two save checks import pendingRecords on a short line.
2. Run the kill-switch scenario separately for the same runtime and scratch-project isolation.
3. Preserve each runner turn folder, the queue and consumed copies, nudge files, the record copies, the real-repository baseline and the final repository snapshot.
4. Derive the 13-row checkpoints.tsv and append the runtime matrix row from the two runs.

### Expected

S0 writes base.sha, which holds the real repository's specs file list and the real decision-capture queue content, and finds no scratch queue row. S1 still finds no row and finds the Gate 3 question in screen.txt. S2 to S4 add one queue row each, with the nudge value rising 1, 2 then 3 on claude-code. S5 adds the static badge answer as a plain chat reply and leaves the queue at three rows with nudge 3. S6 consumes four answers, reports pending 0 and leaves three hook rows queued. S7 saves the queue digest at four rows, which S8-compact must reproduce after the compaction. S8-ask reaches five rows and nudge 2, S9-restart finds five rows under one session id, and S9-ask reaches six rows under the same single session id. S10 records the repeat-save copy and reports pending 0. S11 compares the record with that copy and counts seven decision rows.

### Evidence

Keep the runner's screen.txt, question screens, check output and exit code for every turn. Each check copies the queue JSONL files, the nudge files and the record it reads into CONVERSATION_TURN_DIR, and S0 also saves the real-repository baseline there. S10 leaves an .s10 copy of the record in the scratch project for S11's byte comparison. A passing check prints one observed line such as `rows=5 nudge=2`, a failing check prints a DEVIATION line with the same measured values and exits non-zero, and a skipped check prints its blocker first. The runner's checkpoint row records the turn id, status, attempts, evidence folder and that last output line.

### Pass / Fail

- **Pass**: Every applicable check matches the Stage Table, the S6 and S10 saves report pending 0, the compaction and restart preserve the queue, and S11's comparison exits 0 with seven decision rows.
- **Fail**: A check prints DEVIATION, a question or answer differs from the script, a queue key is duplicated, a save omits or duplicates an answer, the nudge value differs, the compaction or restart changes the queue, the repeat record changes, or the real-repository baseline differs from S0's.
- **Skip**: The runtime queues nothing live, which today is Codex, so the check prints its blocker as the first output line and exits 77.

### Failure Triage

1. If a check prints DEVIATION, quote that line in the runtime row, retain both attempts when the turn has retry 1, and mark the stage FAIL.
2. S3 needs the labels the subject actually offers. If the offered labels differ from Web, iOS and Android, update answer.select to their exact text before the run, because the runner picks by label.
3. If the runner cannot answer a question because the runtime shows no question surface, keep the screen capture and record no answer surface in the matrix. Do not record a successful answer.
4. The nudge file is written on Claude Code, OpenCode, Devin and Pi, and shown on all but Devin. On Codex the check prints its blocker and exits 77, and the cell is SKIP with that blocker.
5. If S6 or S10 reports a nonzero pending count, compare the queue keys with consumed.jsonl before treating the save as successful; a key the save skipped is the usual cause.
6. If S8-compact reports a changed digest, compare the copied queue file with the S7 copy: a compaction that rewrites the queue file is the failure, not a lost row count.
7. If S11 differs, retain both record copies and the comparison output, because a second save that appends or rewrites a row is the defect this stage exists to catch.
8. If a question-tool answer never reaches the queue, check whether the runtime wrote the question to its transcript instead, and record which producer was expected in the matrix's Answer path cell.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root playbook and scenario index |
| [operator-decision-capture](../../feature-catalog/ux-hooks/operator-decision-capture.md) | Feature contract for operator decision capture |
| [decision-capture-claude-hook](./decision-capture-claude-hook.md) | Unit-level check of the Claude capture hook |
| [decision-capture-transcript-sweeps](./decision-capture-transcript-sweeps.md) | Unit-level check of the save-time sweeps |
| [decision-capture-save-writer](./decision-capture-save-writer.md) | Unit-level check of the decision-record writer |

### Implementation And Test Anchors

| File | Role |
|---|---|
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/006-live-conversation-test/plan.md section 3 | Stage values, scratch project, evidence store, runtime matrix and sibling rule |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/006-live-conversation-test/spec.md REQ-001 to REQ-013 | Conversation, capture, save, kill-switch and matrix requirements |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md | JSON conversation schema and turn outcomes |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts | Stop nudge text and behavior |
| .skilled/hooks/decision-capture/lib/capture-core.mjs | Queue layout, session token, consumed keys and pendingRecords |
| .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts | Decision rows, verbatim appendix and consumed keys |

Provenance: manual only - a live multi-turn conversation that the shared conversation runner drives in a scratch project

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: decision-capture-live-conversation
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/decision-capture-live-conversation.md
