---
title: "DOC-407 -- Doctor git hooks switch gate conversation"
description: "Conversation scenario validating the decline and approval branches for the cardSync hook gate."
version: 1.0.0.0
---

# DOC-407 -- Doctor git hooks switch gate conversation

## 1. OVERVIEW

This scenario runs `/doctor:git hooks` in a disposable clone. It declines a `cardSync off` plan, confirms local Git configuration stays unchanged, then approves the same plan and confirms only that key changes.

### Why This Matters

The exact command must be visible before the approval. A decline must write nothing, and an approval must change one local gate only.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for DOC-407 and inspect the plan, approval outcome and scratch checkout state.

- Objective: Prove declining the hook-gate plan leaves local configuration unchanged and approving it changes only `speckit.hooks.cardSync` to `off`.
- Real user request: `Switch the cardSync hook gate off for this repository after showing me the git config command.`
- Prompt: `/doctor:git hooks`
- Preconditions: Node, git, Claude Code or OpenCode, and that runtime's project config are available. The runner creates a disposable clone and isolates global Git config.
- Expected execution process: Open the hooks menu, request `cardSync off`, answer no, repeat the request, approve it and finish with `done`.
- Expected signals: The plan names `git config --local --replace-all speckit.hooks.cardSync off`. The no answer says the change was cancelled or made no change and returns to the gate menu, and the baseline gate settings stay unchanged. The approved answer reads `cardSync` back as off using `git config --local --get speckit.hooks.cardSync`, and every other local gate setting stays unchanged. Checks account for `git config --get-regexp` lowercasing key names. The decline and approve checks prove their branch from local Git config, because the workflow only renders `STATUS=CANCELLED` in its final report and a collapsed Bash result can hide the apply status.
- Desired user-visible outcome: The operator sees the exact local config change and its undo before any write, then gets a verified one-key result.
- Pass/fail: PASS if the declined request leaves the baseline unchanged and approval changes only `cardSync` to off. FAIL if a write happens before approval, the command differs from the plan or another gate changes.
- Classification: Manual scenario. Record PASS, FAIL or SKIP with a specific runtime or sandbox blocker.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `/doctor:git hooks`

### Conversation Script

```json conversation
{
  "runtimes": ["claude-code", "opencode"],
  "setup": [
    "case \"$CONVERSATION_RUNTIME\" in claude-code) test -d \"$CONVERSATION_REPO_ROOT/.claude\" || { printf '%s\\n' 'Claude Code project config is unavailable'; exit 77; } ;; opencode) test -f \"$CONVERSATION_REPO_ROOT/opencode.json\" && test -d \"$CONVERSATION_REPO_ROOT/.opencode\" || { printf '%s\\n' 'OpenCode project config is unavailable'; exit 77; } ;; *) printf '%s\\n' \"Unsupported runtime: $CONVERSATION_RUNTIME\"; exit 77 ;; esac",
    "find . -mindepth 1 -maxdepth 1 ! -name .conversation-scratch -exec rm -rf {} + && rm -f .conversation-scratch && git clone --no-hardlinks \"$CONVERSATION_REPO_ROOT\" .",
    "rm -rf .skilled && cp -R \"$CONVERSATION_REPO_ROOT/.skilled\" .skilled",
    "case \"$CONVERSATION_RUNTIME\" in claude-code) rm -rf .claude && cp -R \"$CONVERSATION_REPO_ROOT/.claude\" .claude ;; opencode) rm -f opencode.json && cp \"$CONVERSATION_REPO_ROOT/opencode.json\" opencode.json && rm -rf .opencode && cp -R \"$CONVERSATION_REPO_ROOT/.opencode\" .opencode ;; esac",
    "git config --local --unset-all speckit.hooks.cardSync || true",
    "git config --local --get-regexp '^speckit\\.hooks\\.' > ../doctor-hooks-before.txt 2>/dev/null || :"
  ],
  "env": {
    "GIT_CONFIG_GLOBAL": "/dev/null"
  },
  "turns": [
    {
      "id": "open-menu",
      "send": "/doctor:git hooks",
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then grep -Fq 'cardSync' \"$CONVERSATION_TURN_DIR/screen.txt\"; else awk 'index($0, \"❯ /doctor:git hooks\") { after=1; found=0; next } after && index($0, \"cardSync\") { found=1 } END { exit !(after && found) }' \"$CONVERSATION_TURN_DIR/screen.txt\"; fi"
    },
    {
      "id": "declined-plan",
      "send": "cardSync off",
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then grep -Fq 'GATE CHANGE PLAN' \"$CONVERSATION_TURN_DIR/screen.txt\" && grep -Fq 'git config --local --replace-all speckit.hooks.cardSync off' \"$CONVERSATION_TURN_DIR/screen.txt\"; else awk 'index($0, \"❯ cardSync off\") { after=1; plan=0; command=0; next } after && index($0, \"GATE CHANGE PLAN\") { plan=1 } after && index($0, \"git config --local --replace-all speckit.hooks.cardSync off\") { command=1 } END { exit !(after && plan && command) }' \"$CONVERSATION_TURN_DIR/screen.txt\"; fi && current=\"$(git config --local --get-regexp '^speckit\\.hooks\\.' 2>/dev/null || true)\" && test \"$current\" = \"$(cat ../doctor-hooks-before.txt)\""
    },
    {
      "id": "decline",
      "send": "no",
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then grep -Eiq 'cancel|no change|not applied|unchanged|nothing changed' \"$CONVERSATION_TURN_DIR/screen.txt\"; else awk 'index($0, \"❯ no\") { after=1; cancelled=0; next } after && tolower($0) ~ /cancel|no change|not applied|unchanged|nothing changed/ { cancelled=1 } END { exit !(after && cancelled) }' \"$CONVERSATION_TURN_DIR/history.txt\"; fi && current=\"$(git config --local --get-regexp '^speckit\\.hooks\\.' 2>/dev/null || true)\" && test \"$current\" = \"$(cat ../doctor-hooks-before.txt)\""
    },
    {
      "id": "approved-plan",
      "send": "cardSync off",
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then grep -Fq 'GATE CHANGE PLAN' \"$CONVERSATION_TURN_DIR/screen.txt\" && grep -Fq 'git config --local --replace-all speckit.hooks.cardSync off' \"$CONVERSATION_TURN_DIR/screen.txt\"; else awk 'index($0, \"❯ cardSync off\") { after=1; plan=0; next } after && index($0, \"GATE CHANGE PLAN\") { plan=1 } END { exit !(after && plan) }' \"$CONVERSATION_TURN_DIR/screen.txt\"; fi && current=\"$(git config --local --get-regexp '^speckit\\.hooks\\.' 2>/dev/null || true)\" && test \"$current\" = \"$(cat ../doctor-hooks-before.txt)\""
    },
    {
      "id": "approve",
      "send": "approve",
      "questions": [
        { "match": "[Ss]pec[- ]folder|documentation[ -]scope", "answer": { "reply": "D" }, "optional": true },
        { "match": "[Ss]elect", "answer": { "select": ["select"] }, "optional": true }
      ],
      "check": "current=\"$(git config --local --get-regexp '^speckit\\.hooks\\.' 2>/dev/null || true)\" && before=\"$(cat ../doctor-hooks-before.txt)\" && before_other=\"$(printf '%s\\n' \"$before\" | grep -Eiv '^speckit\\.hooks\\.cardsync ' || true)\" && after_other=\"$(printf '%s\\n' \"$current\" | grep -Eiv '^speckit\\.hooks\\.cardsync ' || true)\" && test \"$before_other\" = \"$after_other\" && test \"$(git config --local --get speckit.hooks.cardSync)\" = off"
    },
    {
      "id": "finish",
      "send": "done",
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then grep -Fq 'STATUS=OK' \"$CONVERSATION_TURN_DIR/screen.txt\"; else awk 'index($0, \"❯ done\") { after=1; status=0; next } after && index($0, \"STATUS=OK\") { status=1 } END { exit !(after && status) }' \"$CONVERSATION_TURN_DIR/screen.txt\"; fi && test \"$(git config --local --get speckit.hooks.cardSync)\" = off"
    }
  ]
}
```

- The first `send` matches the Prompt line. Claude Code checks anchor on the echoed send in `screen.txt` or `history.txt`; OpenCode checks text retained in its final `screen.txt` frame. Both runtimes' state checks read local Git config in the scratch clone.

### Commands

1. `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/manual-testing-playbook/doctor-commands/doctor-git-hooks-switch-gate-conversation.md --runtime claude-code,opencode --scratch <fresh-scratch-outside-repository> --out <evidence-directory>`

### Expected

Both listed runtimes return to the gate menu with cancel or no-change wording after the decline and leave the saved hook keys equal to the setup baseline. Approval adds only the local `cardSync=off` key, proven by the config re-read, and the final result names the undo. Claude Code checks reply text after each echoed send; OpenCode checks reply text in the final frame because earlier sends are redrawn away.

### Evidence

- The plan and its exact `git config` command, read after the echoed send for Claude Code and from OpenCode's final-frame text.
- The cancel or no-change wording and unchanged local config after `no`, read from Claude Code's turn history or OpenCode's final frame plus the saved baseline.
- The local config after approval, with the target key read using its canonical case and other keys compared case-insensitively; the apply status line is not asserted because a collapsed Bash result can hide it.
- Per-turn screens, checks and checkpoint statuses for each runtime.

### Pass / Fail

- **Pass**: All Claude Code and OpenCode checks pass, the decline leaves config unchanged and the approval changes only `cardSync` to off.
- **Fail**: Any write happens before approval, the declined branch changes config or an unrelated gate differs from the baseline.

### Failure Triage

If the plan omits the command, inspect the presentation in `doctor-git-presentation.txt`. If a gate changes unexpectedly, compare the scratch config with `doctor-hooks-before.txt` and inspect `git-hook-gates.cjs`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Existing command-level scenario: [DOC-370](doctor-git-hooks-switch-gate.md)
- Command entrypoint: [.skilled/commands/doctor/git.md](../../commands/doctor/git.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-git-hooks.yaml](../../commands/doctor/assets/doctor-git-hooks.yaml)
- Gate writer: [.skilled/commands/doctor/scripts/git-hook-gates.cjs](../../commands/doctor/scripts/git-hook-gates.cjs)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-git-presentation.txt](../../commands/doctor/assets/doctor-git-presentation.txt)

Provenance: manual only - /doctor:git hooks

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-407
- Feature name: Doctor git hooks switch gate conversation
- Command mode: `/doctor:git hooks`
- Mutation boundary: Only the local `speckit.hooks.cardSync` value changes in the disposable clone, after approval.
- Feature file path: `doctor-commands/doctor-git-hooks-switch-gate-conversation.md`
