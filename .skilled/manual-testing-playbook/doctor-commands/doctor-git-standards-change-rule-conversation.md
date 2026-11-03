---
title: "DOC-408 -- Doctor git standards change rule conversation"
description: "Conversation scenario validating a declined and approved commit subject length edit and its template prose follow-up."
version: 1.0.0.0
---

# DOC-408 -- Doctor git standards change rule conversation

## 1. OVERVIEW

This scenario runs the `/doctor:git standards` change flow in a disposable clone on Claude Code. It declines a 100-to-120-character subject limit edit, checks that the copied `.sk-git/` prose stays at 100, then approves the same rule edit and its prose update. OpenCode was tried on 2026-11-03 and dropped: its model merges the documentation question and the copy approval into one step, so this ten-turn flow, written for Claude Code's step order, does not fit.

### Why This Matters

The rules block and its prose must change only after their separate approvals. The declined answer must leave the template prose untouched.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for DOC-408 and inspect the plan, the approval branches and the copied template.

- Objective: Prove no leaves the `.sk-git/` prose unchanged, approval updates `subject.maxLength` to 120, the prose follow-up changes the named lines and the final standards check is clean.
- Real user request: `Raise the commit subject limit to 120 characters and show me any template prose that still states the old limit.`
- Prompt: `/doctor:git standards`
- Preconditions: Node, git and Claude Code are available. The runner creates a disposable clone where `.sk-git/` starts absent.
- Expected execution process: Approve the initial template copy, choose a rule setting, describe the subject-limit change, decline that plan, then repeat the concise request and approve the rule and prose writes.
- Expected signals: The change plan names `commit subject.maxLength: 100 -> 120` and the prose passages that still say 100. Claude Code checks the plan after the echoed request. Its run verifies the file hashes after no, the one-file rule diff after approval and the final clean standards check.
- Desired user-visible outcome: The operator sees the rule and prose drift before the write and controls each change with a separate approval.
- Pass/fail: PASS if Claude Code shows the decline and approval behavior, the named prose is the only follow-up change and the final standards check is clean. FAIL if a decline writes, an approval changes unnamed prose or the final check reports drift or a broken block.
- Classification: Manual scenario. Record PASS or FAIL. Record SKIP with a one-line blocker from Claude Code setup or the sandbox.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `/doctor:git standards`

### Conversation Script

```json conversation
{
  "runtimes": [
    "claude-code"
  ],
  "setup": [
    "find . -mindepth 1 -maxdepth 1 ! -name .conversation-scratch -exec rm -rf {} + && rm -f .conversation-scratch && git clone --no-hardlinks \"$CONVERSATION_REPO_ROOT\" .",
    "rm -rf .skilled && cp -R \"$CONVERSATION_REPO_ROOT/.skilled\" .skilled",
    "if [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then command -v opencode >/dev/null 2>&1 || { printf '%s\\n' 'OpenCode CLI unavailable'; exit 77; }; fi",
    "if [ \"$CONVERSATION_RUNTIME\" = \"claude-code\" ]; then if [ -d \"$CONVERSATION_REPO_ROOT/.claude\" ]; then rm -rf .claude && cp -R \"$CONVERSATION_REPO_ROOT/.claude\" .claude; fi; elif [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then if [ ! -f \"$CONVERSATION_REPO_ROOT/opencode.json\" ] || [ ! -d \"$CONVERSATION_REPO_ROOT/.opencode\" ]; then printf '%s\\n' 'OpenCode project configuration is unavailable'; exit 77; fi; cp \"$CONVERSATION_REPO_ROOT/opencode.json\" ./opencode.json && rm -rf .opencode && cp -R \"$CONVERSATION_REPO_ROOT/.opencode\" .opencode; elif [ \"$CONVERSATION_RUNTIME\" = \"pi\" ] && [ -d \"$CONVERSATION_REPO_ROOT/.pi\" ]; then rm -rf .pi && cp -R \"$CONVERSATION_REPO_ROOT/.pi\" .pi; fi"
  ],
  "turns": [
    {
      "id": "start",
      "send": "/doctor:git standards",
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"claude-code\" ]; then awk 'index($0, \"❯ /doctor:git standards\") { after=1; prompt=0; next } after && index($0, \"Copy them into .sk-git/\") { prompt=1 } END { exit !(after && prompt) }' \"$CONVERSATION_TURN_DIR/screen.txt\"; elif [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then grep -Fq 'Copy them into .sk-git/' \"$CONVERSATION_TURN_DIR/screen.txt\"; elif [ \"$CONVERSATION_RUNTIME\" = \"pi\" ]; then awk 'index($0, \"❯ /doctor:git standards\") { after=1; next } after && index($0, \"Copy them into .sk-git/\") { found=1; exit } END { exit !found }' \"$CONVERSATION_TURN_DIR/history.txt\"; fi && test ! -e .sk-git/commit-message-template.md",
      "questions": [
        {
          "match": "Allow OpenCode to search the web|Web Search",
          "answer": {
            "select": [
              "Disable web search"
            ]
          },
          "optional": true
        },
        {
          "match": "[Ss]pec.*folder|[Ss]pec.*scope|[Dd]ocumentation|[Ww]hich .*folder|[Ww]here .*folder|[Gg]ate 3",
          "answer": {
            "select": [
              "Skip"
            ]
          },
          "optional": true
        },
        {
          "match": "[Ss]pec.*folder|[Ss]pec.*scope|[Dd]ocumentation|[Ww]hich .*folder|[Ww]here .*folder|[Gg]ate 3",
          "answer": {
            "reply": "D"
          },
          "optional": true
        }
      ]
    },
    {
      "id": "copy-templates",
      "send": "approve",
      "questions": [
        {
          "match": "[Ss]pec.*folder|[Ss]pec.*scope|[Dd]ocumentation.*(folder|scope)|[Ww]hich .*folder|[Ww]here .*folder|[Gg]ate 3",
          "answer": {
            "select": [
              "Skip"
            ]
          },
          "optional": true
        },
        {
          "match": "Allow OpenCode to search the web|Web Search",
          "answer": {
            "select": [
              "Disable web search"
            ]
          },
          "optional": true
        },
        {
          "match": "[Ss]pec.*folder|[Ss]pec.*scope|[Dd]ocumentation.*(folder|scope)|[Ww]hich .*folder|[Ww]here .*folder|[Gg]ate 3",
          "answer": {
            "reply": "D"
          },
          "optional": true
        }
      ],
      "check": "test -f .sk-git/commit-message-template.md && grep -Eq '100 characters .*subject.max-length' .sk-git/commit-message-template.md && find .sk-git -type f -exec shasum -a 256 {} + | sort > ../doctor-standards-before.sha256"
    },
    {
      "id": "choose-rule-decline",
      "send": "1",
      "check": "current=\"$(find .sk-git -type f -exec shasum -a 256 {} + | sort)\" && test \"$current\" = \"$(cat ../doctor-standards-before.sha256)\"",
      "questions": [
        {
          "match": "Allow OpenCode to search the web|Web Search",
          "answer": {
            "select": [
              "Disable web search"
            ]
          },
          "optional": true
        }
      ]
    },
    {
      "id": "plan-decline",
      "send": "Raise the commit subject limit to 120 characters.",
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"claude-code\" ]; then awk 'index($0, \"❯ Raise the commit subject limit to 120 characters.\") { after=1; plan=0; setting=0; next } after && index($0, \"RULE CHANGE PLAN\") { plan=1 } after && index($0, \"Setting: commit subject.maxLength: 100 -> 120\") { setting=1 } END { exit !(after && plan && setting) }' \"$CONVERSATION_TURN_DIR/screen.txt\"; elif [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then grep -Fq 'RULE CHANGE PLAN' \"$CONVERSATION_TURN_DIR/screen.txt\" && grep -Fq 'Setting: commit subject.maxLength: 100 -> 120' \"$CONVERSATION_TURN_DIR/screen.txt\" && grep -Fq 'Prose to update:' \"$CONVERSATION_TURN_DIR/screen.txt\"; elif [ \"$CONVERSATION_RUNTIME\" = \"pi\" ]; then awk 'index($0, \"❯ Raise the commit subject limit to 120 characters.\") { after=1; plan=0; setting=0; prose=0; next } after && index($0, \"RULE CHANGE PLAN\") { plan=1 } after && index($0, \"Setting: commit subject.maxLength: 100 -> 120\") { setting=1 } after && index($0, \"Prose to update:\") { prose=1 } END { exit !(after && plan && setting && prose) }' \"$CONVERSATION_TURN_DIR/history.txt\"; fi && grep -Eq '100 characters .*subject.max-length' .sk-git/commit-message-template.md && current=\"$(find .sk-git -type f -exec shasum -a 256 {} + | sort)\" && test \"$current\" = \"$(cat ../doctor-standards-before.sha256)\"",
      "questions": [
        {
          "match": "Allow OpenCode to search the web|Web Search",
          "answer": {
            "select": [
              "Disable web search"
            ]
          },
          "optional": true
        }
      ]
    },
    {
      "id": "decline",
      "send": "no",
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"claude-code\" ]; then awk 'index($0, \"❯ no\") { after=1; cancelled=0; next } after && tolower($0) ~ /cancel|no change|not applied|unchanged|nothing changed/ { cancelled=1 } END { exit !(after && cancelled) }' \"$CONVERSATION_TURN_DIR/history.txt\"; elif [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then grep -Eiq 'cancel|no change|not applied|unchanged|nothing changed' \"$CONVERSATION_TURN_DIR/screen.txt\"; elif [ \"$CONVERSATION_RUNTIME\" = \"pi\" ]; then awk 'index($0, \"❯ no\") { after=1; cancelled=0; next } after && tolower($0) ~ /cancel|no change|not applied|unchanged|nothing changed/ { cancelled=1 } END { exit !(after && cancelled) }' \"$CONVERSATION_TURN_DIR/history.txt\"; fi && current=\"$(find .sk-git -type f -exec shasum -a 256 {} + | sort)\" && test \"$current\" = \"$(cat ../doctor-standards-before.sha256)\"",
      "questions": [
        {
          "match": "Allow OpenCode to search the web|Web Search",
          "answer": {
            "select": [
              "Disable web search"
            ]
          },
          "optional": true
        }
      ]
    },
    {
      "id": "choose-rule-approve",
      "send": "1",
      "check": "current=\"$(find .sk-git -type f -exec shasum -a 256 {} + | sort)\" && test \"$current\" = \"$(cat ../doctor-standards-before.sha256)\"",
      "questions": [
        {
          "match": "Allow OpenCode to search the web|Web Search",
          "answer": {
            "select": [
              "Disable web search"
            ]
          },
          "optional": true
        }
      ]
    },
    {
      "id": "plan-approve",
      "send": "Raise the commit subject limit to 120 characters.",
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"claude-code\" ]; then awk 'index($0, \"❯ Raise the commit subject limit to 120 characters.\") { after=1; plan=0; setting=0; next } after && index($0, \"RULE CHANGE PLAN\") { plan=1 } after && index($0, \"Setting: commit subject.maxLength: 100 -> 120\") { setting=1 } END { exit !(after && plan && setting) }' \"$CONVERSATION_TURN_DIR/screen.txt\"; elif [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then grep -Fq 'RULE CHANGE PLAN' \"$CONVERSATION_TURN_DIR/screen.txt\" && grep -Fq 'Setting: commit subject.maxLength: 100 -> 120' \"$CONVERSATION_TURN_DIR/screen.txt\" && grep -Fq 'Prose to update:' \"$CONVERSATION_TURN_DIR/screen.txt\"; elif [ \"$CONVERSATION_RUNTIME\" = \"pi\" ]; then awk 'index($0, \"❯ Raise the commit subject limit to 120 characters.\") { after=1; plan=0; setting=0; prose=0; next } after && index($0, \"RULE CHANGE PLAN\") { plan=1 } after && index($0, \"Setting: commit subject.maxLength: 100 -> 120\") { setting=1 } after && index($0, \"Prose to update:\") { prose=1 } END { exit !(after && plan && setting && prose) }' \"$CONVERSATION_TURN_DIR/history.txt\"; fi && grep -Eq '100 characters .*subject.max-length' .sk-git/commit-message-template.md && current=\"$(find .sk-git -type f -exec shasum -a 256 {} + | sort)\" && test \"$current\" = \"$(cat ../doctor-standards-before.sha256)\" && rm -rf ../doctor-standards-pre-approve && cp -R .sk-git ../doctor-standards-pre-approve",
      "questions": [
        {
          "match": "Allow OpenCode to search the web|Web Search",
          "answer": {
            "select": [
              "Disable web search"
            ]
          },
          "optional": true
        }
      ]
    },
    {
      "id": "approve-rule",
      "send": "approve",
      "questions": [
        {
          "match": "[Ss]pec.*folder|[Ss]pec.*scope|[Dd]ocumentation.*(folder|scope)|[Ww]hich .*folder|[Ww]here .*folder|[Gg]ate 3",
          "answer": {
            "select": [
              "Skip"
            ]
          },
          "optional": true
        },
        {
          "match": "Allow OpenCode to search the web|Web Search",
          "answer": {
            "select": [
              "Disable web search"
            ]
          },
          "optional": true
        },
        {
          "match": "[Ss]pec.*folder|[Ss]pec.*scope|[Dd]ocumentation.*(folder|scope)|[Ww]hich .*folder|[Ww]here .*folder|[Gg]ate 3",
          "answer": {
            "reply": "D"
          },
          "optional": true
        }
      ],
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"claude-code\" ]; then awk 'index($0, \"❯ approve\") { after=1; prompt=0; next } after && index($0, \"prose still states the old rule\") { prompt=1 } END { exit !(after && prompt) }' \"$CONVERSATION_TURN_DIR/screen.txt\"; elif [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then grep -Fq 'prose still states the old rule' \"$CONVERSATION_TURN_DIR/screen.txt\"; elif [ \"$CONVERSATION_RUNTIME\" = \"pi\" ]; then awk 'index($0, \"❯ approve\") { after=1; prompt=0; next } after && index($0, \"prose still states the old rule\") { prompt=1 } END { exit !(after && prompt) }' \"$CONVERSATION_TURN_DIR/history.txt\"; fi && grep -Fq '\\\"maxLength\\\": 120' .sk-git/commit-message-template.md && grep -Eq '100 characters .*subject.max-length' .sk-git/commit-message-template.md && test \"$(diff -rq ../doctor-standards-pre-approve .sk-git | grep -c .)\" = 1 && diff -rq ../doctor-standards-pre-approve .sk-git | grep -q 'commit-message-template.md' && { diff -U0 ../doctor-standards-pre-approve/commit-message-template.md .sk-git/commit-message-template.md > ../doctor-standards-rule.diff || :; } && test \"$(grep -cE '^[-+][^-+]' ../doctor-standards-rule.diff)\" = 2 && grep -E '^-[^-]' ../doctor-standards-rule.diff | grep -Fq '\\\"maxLength\\\": 100' && grep -E '^\\\\+[^+]' ../doctor-standards-rule.diff | grep -Fq '\\\"maxLength\\\": 120' "
    },
    {
      "id": "approve-prose",
      "send": "approve",
      "questions": [
        {
          "match": "[Ss]pec.*folder|[Ss]pec.*scope|[Dd]ocumentation.*(folder|scope)|[Ww]hich .*folder|[Ww]here .*folder|[Gg]ate 3",
          "answer": {
            "select": [
              "Skip"
            ]
          },
          "optional": true
        },
        {
          "match": "Allow OpenCode to search the web|Web Search",
          "answer": {
            "select": [
              "Disable web search"
            ]
          },
          "optional": true
        },
        {
          "match": "[Ss]pec.*folder|[Ss]pec.*scope|[Dd]ocumentation.*(folder|scope)|[Ww]hich .*folder|[Ww]here .*folder|[Gg]ate 3",
          "answer": {
            "reply": "D"
          },
          "optional": true
        }
      ],
      "check": "grep -Eq '120 characters .*subject.max-length' .sk-git/commit-message-template.md && node .skilled/commands/doctor/scripts/git-standards.cjs check --json | grep -Fq 'STATUS=OK DRIFT=0 BROKEN=0'"
    },
    {
      "id": "finish",
      "send": "D",
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"claude-code\" ]; then awk 'index($0, \"❯ D\") { after=1; status=0; next } after && index($0, \"STATUS=OK\") { status=1 } END { exit !(after && status) }' \"$CONVERSATION_TURN_DIR/screen.txt\"; elif [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then grep -Fq 'STATUS=OK' \"$CONVERSATION_TURN_DIR/screen.txt\"; elif [ \"$CONVERSATION_RUNTIME\" = \"pi\" ]; then awk 'index($0, \"❯ D\") { after=1; status=0; next } after && index($0, \"STATUS=OK\") { status=1 } END { exit !(after && status) }' \"$CONVERSATION_TURN_DIR/history.txt\"; fi && grep -Eq '120 characters .*subject.max-length' .sk-git/commit-message-template.md",
      "questions": [
        {
          "match": "Allow OpenCode to search the web|Web Search",
          "answer": {
            "select": [
              "Disable web search"
            ]
          },
          "optional": true
        }
      ]
    }
  ]
}
```

- The first `send` remains `/doctor:git standards`, matching the Prompt line. Claude Code keeps its turn-anchored checks after the echoed send.

### Commands

1. `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/manual-testing-playbook/doctor-commands/doctor-git-standards-change-rule-conversation.md --runtime claude-code --scratch <fresh-scratch-outside-repository> --out <evidence-directory>`

### Expected

After no, Claude Code's history records the cancellation, and every `.sk-git/` file hash still matches the baseline. After the rule approval, Claude Code leaves the template JSON value at 120 while its prose still says 100. The diff against the pre-approval copy shows one changed file and one changed line. The final approval changes the named prose, and the read-only check reports no drift.

### Evidence

- The rule plan and setting from Claude Code's turn screen after the echoed request.
- The final cancellation text and the template state after each approval.
- The pre-approve copy, the `doctor-standards-rule.diff` and the one-file, one-line result it proves.
- The follow-up prompt, updated prose and final standards-check output.
- The per-turn checkpoint statuses.

### Pass / Fail

- **Pass**: Claude Code proves that decline leaves `.sk-git/` unchanged, rule approval changes only the rules block, prose approval updates only the named line and the final standards check reports no drift or broken block.
- **Fail**: A decline changes a file, the follow-up is missing, an unnamed line changes, a required Claude Code screen or history check fails, or the final standards check is not clean.
- **Skip**: Claude Code is unavailable or cannot start, or setup reports a sandbox blocker.

### Failure Triage

If a Claude Code plan check fails, inspect the turn's screen and confirm the change plan and setting remain visible after the echoed request. If the cancellation signal is missing, inspect the turn's full `history.txt` after the echoed `no`. If the plan omits prose drift, inspect `git-standards.cjs` and `doctor-git-standards.yaml`. If the follow-up does not appear, inspect the prose-update phase in that YAML. If the final check reports drift, compare the named passages in the scratch template with the rules block.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Existing command-level scenario: [DOC-372](doctor-git-standards-change-rule.md)
- Command entrypoint: [.skilled/commands/doctor/git.md](../../commands/doctor/git.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-git-standards.yaml](../../commands/doctor/assets/doctor-git-standards.yaml)
- Standards writer: [.skilled/commands/doctor/scripts/git-standards.cjs](../../commands/doctor/scripts/git-standards.cjs)
- Shipped template: [.skilled/skills/sk-git/assets/commit-message-template.md](../../skills/sk-git/assets/commit-message-template.md)

Provenance: manual only - /doctor:git standards

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-408
- Feature name: Doctor git standards change rule conversation
- Command mode: `/doctor:git standards`
- Mutation boundary: Only the `.sk-git/` copy in the disposable clone changes, first after rule approval and then after prose approval.
- Feature file path: `doctor-commands/doctor-git-standards-change-rule-conversation.md`
