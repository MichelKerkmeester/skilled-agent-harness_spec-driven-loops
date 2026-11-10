---
title: "decision-capture-kill-switch-conversation -- Decision capture kill-switch conversation"
description: "This scenario validates that the decision-capture kill switch leaves no queued answer and prints no Stop nudge."
trigger_phrases:
  - "decision capture kill switch conversation"
  - "decision capture disabled live test"
version: 1.0.3.0
---

# decision-capture-kill-switch-conversation -- Decision capture kill-switch conversation

This document captures the kill-switch scenario contract, expected execution, checkpoint and source anchors.

---

## 1. OVERVIEW

This scenario asks one product question in a fresh scratch project with SYSTEM_DECISION_CAPTURE_DISABLED=1.

### Why This Matters

The environment switch must prevent the answer from entering a queue and must suppress the Stop nudge while leaving the subject's answer visible to the operator.

---

## 2. SCENARIO CONTRACT

Operators run this scenario in its own runner invocation and scratch project because the conversation script carries one environment.

- Feature ID: decision-capture-kill-switch-conversation
- Objective: Prove that the decision-capture kill switch suppresses queue writes and the Stop nudge in a real interactive turn.
- Real user request: Ask me which colour the status badge should use, with a single-select question, while decision capture is disabled.
- Prompt: Ask me with the tool which colour the badge uses, offering exactly Amber, Teal and Slate.
- Expected execution process: Start a fresh scratch project with SYSTEM_DECISION_CAPTURE_DISABLED=1, ask one question, select Amber and inspect queue and pane evidence.
- Expected signals: No queue JSONL exists, the pane contains no Stop nudge line, and the answer Amber is visible.
- Desired user-visible outcome: A PASS or FAIL verdict with the queue-file count, nudge-line count and pane evidence path.
- Pass/fail: PASS when there are no queue JSONL files, no nudge line and the answer is visible. FAIL when any assertion is false.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: Ask me with the tool which colour the badge uses, offering exactly Amber, Teal and Slate.

### Stage Table

| Stage | Human turn | Answer the human gives | Pause | Checkpoint observable | Expected |
|-------|-------------|-----------------------|-------|------------------------|----------|
| S12 | "Ask me with the tool which colour the badge uses, offering exactly Amber, Teal and Slate." | select Amber | turn [5000, 15000]; answer [3000, 8000] | Queue JSONL files, nudge lines in screen.txt, and visible answer | No queue JSONL file, 0 nudge lines, answer Amber visible |

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
  "env": {
    "SYSTEM_DECISION_CAPTURE_DISABLED": "1"
  },
  "setup": [
    "git init -q",
    "mkdir -p specs .claude .opencode .codex .pi .devin .skilled/skills/.state",
    "for d in .claude .opencode .codex .pi .devin; do cp -R \"$CONVERSATION_REPO_ROOT/$d/.\" \"$d/\"; done",
    "node -e 'const fs=require(\"fs\");const c=JSON.parse(fs.readFileSync(process.env.CONVERSATION_REPO_ROOT+\"/opencode.json\",\"utf8\"));delete c.mcp;fs.writeFileSync(\"opencode.json\",JSON.stringify(c,null,2))'",
    "cp \"$CONVERSATION_REPO_ROOT/AGENTS.md\" AGENTS.md && ln -s AGENTS.md CLAUDE.md",
    "ln -s \"$CONVERSATION_REPO_ROOT/.skilled/hooks\" .skilled/hooks && ln -s \"$CONVERSATION_REPO_ROOT/.skilled/bin\" .skilled/bin && ln -s \"$CONVERSATION_REPO_ROOT/.skilled/skills/system-spec-kit\" .skilled/skills/system-spec-kit",
    "ln -s \"$CONVERSATION_REPO_ROOT/.skilled/commands\" .skilled/commands && ln -s \"$CONVERSATION_REPO_ROOT/.skilled/repo-rules\" .skilled/repo-rules",
    "python3 -c 'from pathlib import Path; p=Path(\".codex/config.toml\"); s=p.read_text(); k=\"default_mode_request_user_input\"; marker=\"[features]\\n\"; s=s if k in s else (s.replace(marker, marker+k+\" = true\\n\", 1) if marker in s else k+\" = true\\n\"+s); p.write_text(s)'"
  ],
  "turns": [
    {
      "id": "S12",
      "send": "Ask me with the tool which colour the badge uses, offering exactly Amber, Teal and Slate.",
      "delay_ms": [
        5000,
        15000
      ],
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
      "check": "set -euo pipefail; Q=\"$PWD/.skilled/skills/.state/decision-capture\"; T=\"$CONVERSATION_TURN_DIR\"; mkdir -p \"$T\"; if [ -d \"$Q\" ]; then find \"$Q\" -type f \\( -name '*.jsonl' -o -name '*.nudge' \\) -exec cp -p {} \"$T/\" \\; 2>/dev/null || true; fi; if [ -f \"$PWD/specs/demo/001-demo-widget/decision-record.md\" ]; then cp -p \"$PWD/specs/demo/001-demo-widget/decision-record.md\" \"$T/decision-record.md\"; fi; queue_jsonl=0; if [ -d \"$Q\" ]; then queue_jsonl=$(find \"$Q\" -type f -name '*.jsonl' | wc -l | tr -d ' '); fi; screen=\"$T/screen.txt\"; nudge_lines=0; if [ -f \"$screen\" ]; then nudge_lines=$(grep -cF 'operator answer(s) captured this session are not in a decision record yet' \"$screen\" || true); fi; color_question=0; if [ -f \"$screen\" ] && grep -Eiq 'colou?r' \"$screen\"; then color_question=1; fi; amber_visible=0; if [ -f \"$screen\" ] && grep -Fq 'Amber' \"$screen\"; then amber_visible=1; fi; if [ \"$queue_jsonl\" -ne 0 ] || [ \"$nudge_lines\" -ne 0 ] || [ \"$color_question\" -ne 1 ] || [ \"$amber_visible\" -ne 1 ]; then printf 'DEVIATION: kill-switch turn did not meet the queue, nudge, question and answer expectations\\n'; printf 'observed=runtime=%s queue_jsonl=%s nudge_lines=%s color_question=%s amber_visible=%s\\n' \"$CONVERSATION_RUNTIME\" \"$queue_jsonl\" \"$nudge_lines\" \"$color_question\" \"$amber_visible\"; exit 1; fi; printf 'observed=runtime=%s queue_jsonl=%s nudge_lines=%s color_question=%s amber_visible=%s\\n' \"$CONVERSATION_RUNTIME\" \"$queue_jsonl\" \"$nudge_lines\" \"$color_question\" \"$amber_visible\""
    }
  ]
}
```

### Commands

1. Run this scenario separately from the S0 to S11 conversation so its disabled environment applies to a fresh scratch project.
2. Preserve screen.txt, the check output and the copied queue, consumed, nudge and decision-record files in the turn evidence folder.

### Expected

The check sees no queue JSONL file anywhere under .skilled/skills/.state/decision-capture, including the project subfolder, finds no Stop nudge line in CONVERSATION_TURN_DIR/screen.txt, and finds the selected Amber answer in the same pane capture.

### Evidence

The check copies any queue JSONL files, consumed.jsonl, nudge files and decision-record.md into CONVERSATION_TURN_DIR. It prints the runtime, queue-file count, nudge-line count, question visibility and answer visibility as its final observed-value line.

### Pass / Fail

- **Pass**: The queue-file count is 0, the nudge-line count is 0, the colour question is visible and Amber is visible in the pane.
- **Fail**: A queue JSONL file exists, a nudge line appears, the question is absent or the selected answer is not visible.

### Failure Triage

1. If DEVIATION appears, quote it in the runtime row and retain screen.txt, the check output and any copied state files.
2. Confirm the runner launched the subject with SYSTEM_DECISION_CAPTURE_DISABLED=1; the environment is set at the conversation-script level and remains isolated to this run.
3. If the runtime has no answer surface, record no answer surface with pane or transcript evidence rather than treating the answer as captured.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root playbook and scenario index |
| [operator-decision-capture](../../feature-catalog/ux-hooks/operator-decision-capture.md) | Feature contract for operator decision capture |

### Implementation And Test Anchors

| File | Role |
|---|---|
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/006-live-conversation-test/plan.md section 3 | Kill-switch stage and expected queue and nudge signals |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/006-live-conversation-test/spec.md REQ-008 | Kill-switch requirement |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md | JSON conversation schema and exit outcomes |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts | Stop nudge text and behavior |

Provenance: manual only - a live multi-turn conversation that the shared conversation runner drives in a scratch project

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: decision-capture-kill-switch-conversation
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/decision-capture-kill-switch-conversation.md

