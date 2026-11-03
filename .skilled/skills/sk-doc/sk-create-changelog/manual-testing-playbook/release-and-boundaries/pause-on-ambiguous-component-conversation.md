---
title: "CHG-014 -- Choose the component after clarification"
description: "This scenario validates answer-dependent component selection for CHG-014. It focuses on proposing the named component's global changelog directory after an ambiguous mixed-change request."
stage: routing
id: "CHG-014"
version: 1.0.0.0
---

# CHG-014 -- Choose the component after clarification

This document captures the conversation contract for selecting a component after the workflow pauses on a mixed-change request.

## 1. OVERVIEW

This scenario validates answer-dependent component selection for `CHG-014`. It focuses on using the operator's answer to choose the proposed global changelog directory.

### Why This Matters

When changed paths split evenly between components, the workflow must ask before choosing a destination. The operator's answer must determine the proposed directory, and the entry must remain unwritten until the operator asks for it.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHG-014` on Claude Code, OpenCode and Pi, then confirm that the selected component determines the proposed path. Setup copies each runtime's project configuration into the scratch project.

- Objective: use the named component after asking about an ambiguous mixed change set
- Real user request: `Create the global changelog from mixed changes that touch sk-doc and system-spec-kit equally, then tell me the proposed directory without writing any files.`
- Prompt: `Create the global changelog from these mixed changes, but the files touch several components equally: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md, .skilled/skills/sk-doc/sk-create-changelog/references/topology-edge-cases.md, .skilled/skills/system-spec-kit/SKILL.md and .skilled/skills/system-spec-kit/references/workflows/quick-reference.md. Tell me the proposed global changelog directory. Do not write any files.`
- Expected execution process: inspect the supplied paths and existing global component folders, pause because the evidence is tied, then use the operator's component selection to propose its existing global changelog directory without writing an entry.
- Expected signals: the workflow asks which component should own the entry. After selecting `system-spec-kit`, it proposes `.skilled/changelog/system-spec-kit/` and creates no changelog file.
- Desired user-visible outcome: a clear proposed destination that follows the operator's answer, with no file written.
- Pass/fail: PASS if Claude Code, OpenCode and Pi ask before selecting, use the answer to propose `.skilled/changelog/system-spec-kit/` and create no changelog file. FAIL if any runtime selects without asking, proposes a different component or writes a file.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create the global changelog from these mixed changes, but the files touch several components equally: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md, .skilled/skills/sk-doc/sk-create-changelog/references/topology-edge-cases.md, .skilled/skills/system-spec-kit/SKILL.md and .skilled/skills/system-spec-kit/references/workflows/quick-reference.md. Tell me the proposed global changelog directory. Do not write any files.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CHG-014 | Choose the component after clarification | Use the operator's selection after an even component match | `Create the global changelog from these mixed changes, but the files touch several components equally: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md, .skilled/skills/sk-doc/sk-create-changelog/references/topology-edge-cases.md, .skilled/skills/system-spec-kit/SKILL.md and .skilled/skills/system-spec-kit/references/workflows/quick-reference.md. Tell me the proposed global changelog directory. Do not write any files.` | 1. `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/release-and-boundaries/pause-on-ambiguous-component-conversation.md --runtime claude-code,opencode,pi --scratch <dir-outside-repo> --out <evidence-dir>` | The workflow asks which component should own the entry. After selecting `system-spec-kit`, it proposes `.skilled/changelog/system-spec-kit/` and writes no file. | Each `question-*.txt` captures the clarification. Claude Code and Pi's `history.txt` and OpenCode's final-frame `screen.txt` show the reply. Each `check.txt`, `result.json` and the scratch changelog tree show the outcome. | PASS if Claude Code, OpenCode and Pi each ask before selecting a component, name `.skilled/changelog/system-spec-kit/` in the final response and leave the scratch changelog tree without files. FAIL if a runtime selects without asking, maps the answer to another directory or writes a changelog file. | Inspect the captured question and `actions.jsonl` selection, then read Claude Code and Pi's `history.txt` or OpenCode's final-frame `screen.txt`. Confirm the `check.txt`, `result.json` and scratch changelog tree agree. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "claude-code",
    "opencode",
    "pi"
  ],
  "setup": [
    "cp -R \"$CONVERSATION_REPO_ROOT/.skilled\" .skilled",
    "case \"$CONVERSATION_RUNTIME\" in claude-code) cp -R \"$CONVERSATION_REPO_ROOT/.claude\" .claude ;; opencode) cp \"$CONVERSATION_REPO_ROOT/opencode.json\" ./opencode.json && cp -R \"$CONVERSATION_REPO_ROOT/.opencode\" .opencode ;; pi) cp -R \"$CONVERSATION_REPO_ROOT/.pi\" .pi ;; *) printf '%s\\n' \"Unsupported runtime: $CONVERSATION_RUNTIME\"; exit 2 ;; esac",
    "find .skilled/changelog -type f -delete",
    "mkdir -p .skilled/changelog/sk-doc .skilled/changelog/system-spec-kit"
  ],
  "turns": [
    {
      "id": "choose-component",
      "send": "Create the global changelog from these mixed changes, but the files touch several components equally: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md, .skilled/skills/sk-doc/sk-create-changelog/references/topology-edge-cases.md, .skilled/skills/system-spec-kit/SKILL.md and .skilled/skills/system-spec-kit/references/workflows/quick-reference.md. Tell me the proposed global changelog directory. Do not write any files.",
      "questions": [
        {
          "match": "(?:[Ww]hich|[Ww]hat|[Ww]ho|[Ss]hould|[Pp]ick|[Cc]hoose|[Ss]elect).{0,80}(?:[Cc]omponent|[Ff]older|[Dd]irectory|[Oo]wner|[Ee]ntry|[Oo]ne|[Pp]roject|[Ss]kill|[Cc]hangelog)|(?:[Cc]omponent|[Ff]older|[Cc]hangelog|[Ee]ntry).{0,40}(?:[Oo]wn|[Bb]elong|[Oo]wner|[Cc]hoose|[Pp]ick|[Ss]hould)|(?:[Cc]omponent|[Ff]older).{0,30}(?:[Gg]lobal )?[Cc]hangelog|(?:[Gg]lobal )?(?:[Cc]hangelog [Ee]ntry|[Cc]hangelog [Oo]wner|[Cc]omponent [Oo]wner)",
          "answer": {
            "select": [
              "system-spec-kit"
            ]
          },
          "optional": true
        },
        {
          "match": "(?:[Ww]hich|[Ww]hat|[Ww]ho|[Ss]hould|[Pp]ick|[Cc]hoose|[Ss]elect).{0,80}(?:[Cc]omponent|[Ff]older|[Dd]irectory|[Oo]wner|[Ee]ntry|[Oo]ne|[Pp]roject|[Ss]kill|[Cc]hangelog)|(?:[Cc]omponent|[Ff]older|[Cc]hangelog|[Ee]ntry).{0,40}(?:[Oo]wn|[Bb]elong|[Oo]wner|[Cc]hoose|[Pp]ick|[Ss]hould)|(?:[Cc]omponent|[Ff]older).{0,30}(?:[Gg]lobal )?[Cc]hangelog|(?:[Gg]lobal )?(?:[Cc]hangelog [Ee]ntry|[Cc]hangelog [Oo]wner|[Cc]omponent [Oo]wner)",
          "answer": {
            "reply": "system-spec-kit"
          },
          "optional": true
        },
        {
          "match": "[Ss]pec[- ]folder|[Ss]pec.{0,20}(?:folder|packet)|[Gg]ate 3|AGENTS\\.md.{0,50}(?:[Dd]ocumentation|[Ss]pec|[Ss]cope)|[Dd]ocumentation.{0,30}(?:[Ss]cope|[Ss]pec)|(?:[Ss]cope|[Ss]pec).{0,30}[Dd]ocumentation",
          "answer": {
            "reply": "D"
          },
          "optional": true
        }
      ],
      "check": "grep -Eiq 'component' \"$CONVERSATION_TURN_DIR\"/question-*.txt 2>/dev/null || { printf '%s\\n' 'the subject asked no component question'; exit 1; }; case \"$CONVERSATION_RUNTIME\" in\n  claude-code)\n    awk 'index($0, \"⏺ \") { in_reply=1; found=0 } in_reply && index($0, \".skilled/changelog/system-spec-kit/\") { found=1 } END { exit !found }' \"$CONVERSATION_TURN_DIR/history.txt\"\n    ;;\n  opencode)\n    grep -Fq '.skilled/changelog/system-spec-kit/' \"$CONVERSATION_TURN_DIR/screen.txt\"\n    ;;\n  pi)\n    awk 'index($0, \" ● \") { in_reply=1; found=0 } in_reply && index($0, \".skilled/changelog/system-spec-kit/\") { found=1 } END { exit !found }' \"$CONVERSATION_TURN_DIR/history.txt\"\n    ;;\n  *) exit 2 ;;\nesac && test -z \"$(find .skilled/changelog -type f -print -quit)\" && printf '%s\\n' 'system-spec-kit directory proposed; no changelog file written' "
    }
  ]
}
```

- The first `send` matches the contract prompt exactly. The component matcher accepts full clarification wording and OpenCode's shortened `entry?` title, which is the only question text its TUI parser captures. The optional `D` reply matches explicit spec-folder or Gate 3 documentation questions and cannot match a component or changelog question. The component dialog answer remains a `select` action.

### Commands

1. `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/release-and-boundaries/pause-on-ambiguous-component-conversation.md --runtime claude-code,opencode,pi --scratch <dir-outside-repo> --out <evidence-dir>`

The check reads Claude Code and Pi's final assistant replies from `history.txt`, OpenCode's final frame from `screen.txt`, and the scratch changelog tree. The captured `question-*.txt` file records the clarification the runner matched. The final-reply check means a directory named only in the clarification cannot pass.

### Expected

Each runtime asks which component owns the entry because the changed paths split evenly. After the scripted selection, the final response names `.skilled/changelog/system-spec-kit/` as the proposed directory. No changelog entry is written.

### Evidence

Capture the matched clarification in `question-*.txt`, the scripted selection in `actions.jsonl`, and the outcome in `check.txt` and `result.json`. The check reads Claude Code and Pi's `history.txt`, OpenCode's final-frame `screen.txt`, and the scratch changelog tree. A live pass requires every turn to report `PASS` and `repo.changed` to be false.

### Pass / Fail

- **Pass**: Claude Code, OpenCode and Pi ask before selecting a component, use the scripted `system-spec-kit` selection, propose `.skilled/changelog/system-spec-kit/` in the final response and leave the scratch changelog tree without files.
- **Fail**: any runtime skips the component question, maps the answer to a different directory or writes a changelog file.

### Failure Triage

1. Read `question-*.txt` to confirm what the runtime asked and `actions.jsonl` to confirm which scripted answer it received.
2. Read `history.txt` for Claude Code or Pi, or the final-frame `screen.txt` for OpenCode, and `check.txt` to see which directory was proposed.
3. Inspect `result.json` and the scratch changelog tree for the turn verdict and any file written.
4. Compare the result with [CHG-007](pause-on-ambiguous-component.md), which covers the unresolved pause before a component is named.

### Optional Supplemental Checks

None.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root policy and scenario index |
| [`pause-on-ambiguous-component.md`](pause-on-ambiguous-component.md) | Companion scenario for the clarification before a component is named |
| [`../../../sk-create-manual-testing-playbook/references/conversation-scenarios.md`](../../../sk-create-manual-testing-playbook/references/conversation-scenarios.md) | Conversation script schema and turn outcomes |
| No feature-catalog entry | This mode has no catalog package for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Component resolution and global changelog placement rules |
| [`../../README.md`](../../README.md) | Changelog workflow overview |
| [`../../references/topology-edge-cases.md`](../../references/topology-edge-cases.md) | Global component placement and ambiguous-match guidance |

---

## 5. SOURCE METADATA

- Group: RELEASE AND BOUNDARIES
- Playbook ID: CHG-014
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `release-and-boundaries/pause-on-ambiguous-component-conversation.md`
