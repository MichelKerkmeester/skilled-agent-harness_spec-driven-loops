---
title: "MTP-007 -- Drive a scripted conversation"
description: "This scenario validates the conversation runner for MTP-007. It checks tool questions, chat replies, restart, compaction and per-runtime evidence."
version: 1.0.0.0
---

# MTP-007 -- Drive a scripted conversation

This document captures the operator contract for MTP-007.

---

## 1. OVERVIEW

This scenario runs a scripted conversation against the five supported runtimes. It checks single-select, multi-select and Other answers, a chat reply, restart and compaction.

### Why This Matters

The runner needs to preserve the subject's answers across runtime actions and leave evidence for every turn. A repeatable script lets operators compare runtime behavior from the same starting project.

---

## 2. SCENARIO CONTRACT

Operators run the prompt and runner command for MTP-007, then compare each runtime's turn checks with its saved evidence.

- Objective: verify scripted question answers, a plain chat reply, restart, compaction and per-runtime evidence.
- Real user request: `Ask me one colour question with red, green and blue, then save my answer to answers.txt. Continue with a multi-select, an Other answer and a chat question. Keep each answer on its own line so I can check the saved file after restart and compaction.`
- Prompt: `Use your question tool to ask me one single-choice colour question with exactly these options: red, green and blue. After I answer, append the selected colour as one line to answers.txt.`
- Expected execution process: create a small Git project, copy each available runtime project configuration into its scratch project, then run the six scripted turns in order. Record the model and version used by every runtime in a note beside the results matrix.
- Expected signals: the answer file has the expected lines, it remains after restart, compaction leaves four lines and the evidence matrix names each requested runtime.
- Desired user-visible outcome: each runtime has a verdict, its turn evidence and a record of the model used.
- Pass/fail: PASS when the four answer lines and state checks succeed and each runtime's model is recorded. FAIL when an answer, state check or required model record is missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use your question tool to ask me one single-choice colour question with exactly these options: red, green and blue. After I answer, append the selected colour as one line to answers.txt.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MTP-007 | Drive a scripted conversation | Run scripted tool and chat questions, then check saved state after restart and compaction | `Use your question tool to ask me one single-choice colour question with exactly these options: red, green and blue. After I answer, append the selected colour as one line to answers.txt.` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook/conversation-runner/drive-a-scripted-conversation.md --runtime claude-code --scratch /tmp/conv-mtp007 --out /tmp/conv-mtp007-out` | Turn 1 writes green. Turn 2 writes small and large on line two. Turn 3 writes teal. Turn 4 writes yes. Restart preserves answers.txt. Compaction leaves four lines. A full matrix run has a row for each requested runtime. | `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt`, `question-N.txt` and `check.txt`, plus `models.md` beside the matrix | PASS when the answer and state checks pass and each requested runtime's model is recorded. FAIL when an answer or state check fails or a model record is missing. | 1. Read the failed turn's `screen.txt` and `check.txt`. 2. Compare the question evidence with its match rule. 3. Confirm the runtime model and project config in `models.md`. 4. Rerun with a fresh scratch and evidence path. |

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
    "git init",
    "printf '# Tiny conversation project\\n' > README.md",
    "rm -f answers.txt",
    "if [ -z \"$CONVERSATION_REPO_ROOT\" ]; then printf '%s\\n' 'CONVERSATION_REPO_ROOT is required'; exit 1; fi",
    "for name in .claude .opencode opencode.json .codex .pi .devin; do rm -rf \"$name\"; if [ -e \"$CONVERSATION_REPO_ROOT/$name\" ]; then cp -R \"$CONVERSATION_REPO_ROOT/$name\" \"$name\"; fi; done",
    "if [ \"$(basename \"$PWD\")\" = \"codex\" ]; then mkdir -p .codex; touch .codex/config.toml; awk -v key='default_mode_request_user_input = true' 'BEGIN { in_features = 0; has_features = 0; wrote_key = 0 } /^\\[[[:alnum:]_.-]+\\]$/ { if (in_features && !wrote_key) { print key; wrote_key = 1 } in_features = ($0 == \"[features]\"); if (in_features) has_features = 1; print; next } in_features && /^default_mode_request_user_input[[:space:]]*=/ { if (!wrote_key) print key; wrote_key = 1; next } { print } END { if (in_features && !wrote_key) print key; if (!has_features) { print \"\"; print \"[features]\"; print key } }' .codex/config.toml > .codex/config.toml.tmp && mv .codex/config.toml.tmp .codex/config.toml; fi"
  ],
  "turns": [
    {
      "id": "single-select",
      "send": "Use your question tool to ask me one single-choice colour question with exactly these options: red, green and blue. After I answer, append the selected colour as one line to answers.txt.",
      "questions": [
        {
          "match": "colou?r",
          "answer": {
            "select": [
              "green"
            ]
          },
          "optional": true
        },
        {
          "match": "[Ss]pec folder|[Dd]ocumentation",
          "answer": {
            "other": "Skip documentation. This is a throwaway scratch folder."
          },
          "optional": true
        }
      ],
      "check": "grep -qix green answers.txt && echo green"
    },
    {
      "id": "multi-select",
      "send": "Use your question tool to ask which sizes I want, with small, medium and large as multi-select options. Append the selected labels on one line to answers.txt, separated by commas.",
      "questions": [
        {
          "match": "sizes?",
          "answer": {
            "select": [
              "small",
              "large"
            ],
            "multi": true
          },
          "optional": true
        },
        {
          "match": "sizes?",
          "answer": {
            "reply": "small, large"
          },
          "optional": true
        },
        {
          "match": "[Ss]pec folder|[Dd]ocumentation",
          "answer": {
            "other": "Skip documentation. This is a throwaway scratch folder."
          },
          "optional": true
        }
      ],
      "check": "awk 'NR == 2 && tolower($0) ~ /small/ && tolower($0) ~ /large/ { print; found = 1 } END { exit !found }' answers.txt"
    },
    {
      "id": "other-answer",
      "send": "Use your question tool to ask what custom colour I want, with a free-text Other option. Append my answer as one line to answers.txt.",
      "questions": [
        {
          "match": "custom colou?r",
          "answer": {
            "other": "teal"
          },
          "optional": true
        },
        {
          "match": "[Ss]pec folder|[Dd]ocumentation",
          "answer": {
            "other": "Skip documentation. This is a throwaway scratch folder."
          },
          "optional": true
        }
      ],
      "check": "sed -n '3p' answers.txt | grep -qix teal && echo teal"
    },
    {
      "id": "chat-reply",
      "send": "Ask me in plain chat whether I want to keep the selected colours. Wait for my answer and append it as one line to answers.txt.",
      "questions": [
        {
          "match": "[Kk]eep",
          "answer": {
            "reply": "yes"
          }
        },
        {
          "match": "[Ss]pec folder|[Dd]ocumentation",
          "answer": {
            "other": "Skip documentation. This is a throwaway scratch folder."
          },
          "optional": true
        }
      ],
      "check": "sed -n '4p' answers.txt | grep -qix yes && echo yes"
    },
    {
      "id": "restart",
      "action": "restart",
      "check": "test -f answers.txt && echo present"
    },
    {
      "id": "compact",
      "action": "compact",
      "check": "test \"$(awk 'END { print NR }' answers.txt)\" -eq 4 && echo 4"
    }
  ]
}
```

The first three question entries are optional so the runner reaches their checks when a runtime does not show a tool dialog. Codex shows its question tool through `default_mode_request_user_input`, which setup enables, so its tool turns are tested like every other runtime's. Its dialog offers one choice per question, so the runner types a multi-select answer as a note on its `None of the above` row, and a subject that asks the sizes question in plain chat instead gets the optional chat reply.

### Commands

1. Run the Claude Code pass from the repository root:
   `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook/conversation-runner/drive-a-scripted-conversation.md --runtime claude-code --scratch /tmp/conv-mtp007 --out /tmp/conv-mtp007-out`
2. Run the full matrix from the repository root:
   `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook/conversation-runner/drive-a-scripted-conversation.md --runtime claude-code,opencode,codex,pi,devin --scratch /tmp/conv-mtp007-matrix-scratch --out /tmp/conv-mtp007-matrix-out`

### Expected

The first four turns append exactly one answer per line. The checks confirm green, small and large, teal and yes in order. They ignore letter case, because a model may write a label capitalized. The restart check confirms answers.txt still exists. The compaction check confirms four lines.

For a full matrix, every requested runtime has a row in `matrix.md` and an evidence folder. Record each runtime's model and CLI version in `models.md` beside the matrix. All five runtimes are probed; their versions and screen facts are in the reference's per-runtime notes.

### Evidence

Capture `matrix.md`, `models.md`, each runtime's `result.json` and `checkpoints.tsv`, every turn's `screen.txt`, `question-N.txt` and `check.txt`, plus `setup.log` and both repository snapshots. The snapshots let you check whether the run changed repository content.

### Pass / Fail

- **Pass**: all four answers appear on separate lines, restart preserves the file, compaction leaves four lines and each requested runtime has model and version notes.
- **Fail**: an answer is missing or out of order, restart loses the file, compaction changes the four-line file, a runtime lacks its evidence row or a model record is missing.

### Failure Triage

1. Read the failed turn's `screen.txt`, question evidence and `check.txt`.
2. Confirm the subject used the copied project configuration and the expected model.
3. Check the repository snapshots for `REPO_CHANGED`.
4. Rerun with fresh scratch and evidence paths. Add `--overwrite` only when you intend to replace evidence.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
| No feature-catalog entry | This package has no feature catalog |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`run-conversation-scenario.cjs`](../../scripts/run-conversation-scenario.cjs) | Drives the scripted conversation and writes runtime evidence |
| [`conversation-scenarios.md`](../../references/conversation-scenarios.md) | Defines the conversation script and runner contract |
| `specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/scratch/probes.md` | Records the current runtime probe facts |

---

## 5. SOURCE METADATA

- Group: CONVERSATION RUNNER
- Playbook ID: MTP-007
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `conversation-runner/drive-a-scripted-conversation.md`
