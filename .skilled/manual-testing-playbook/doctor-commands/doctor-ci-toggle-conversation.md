---
title: "DOC-410 -- Doctor CI toggle conversation"
description: "Conversation scenario validating that declining the CI switch plan leaves the scratch tree and GitHub variable unchanged."
version: 1.0.0.0
---

# DOC-410 -- Doctor CI toggle conversation

## 1. OVERVIEW

This scenario runs `/doctor:ci toggle` in Claude Code and OpenCode from a disposable clone. It asks to turn `SKILLED_CI_REPORTS` off, declines the plan and compares the scratch checkout and GitHub variable with their setup baselines.

### Why This Matters

A no answer must cancel the planned remote change. The local tree and the Actions variable must both retain their starting state.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for DOC-410 in Claude Code and OpenCode, then confirm the plan, cancellation result and unchanged remote value in both runs.

- Objective: Prove the CI toggle shows its planned command in both runtimes, treats no as cancellation and leaves the scratch tree and remote variable unchanged.
- Real user request: `Turn the SKILLED_CI_REPORTS switch off, show me the command and wait for my approval.`
- Prompt: `/doctor:ci toggle --variable=SKILLED_CI_REPORTS --state=off`
- Preconditions: The runner creates a disposable clone and records the remote variable value before the conversation. Missing `gh`, authentication, network access or variable-read permission records SKIP with a one-line reason. A scratch `gh` shim passes reads through and refuses variable set or delete commands, and it is first on the subject's `PATH` for both zsh and bash.
- Expected execution process: Capture the remote baseline through the real `gh` read commands, show the off plan through a scratch-first `gh` shim, answer no and compare the remote variable and scratch tree with their baselines.
- Expected signals: The plan names `SKILLED_CI_REPORTS` and `gh variable set SKILLED_CI_REPORTS --body off`. The no answer reports `STATUS=CANCELLED ACTION=cancelled` and `Changed: none`. The read-only remote query returns the same variable value as setup, and `git status --porcelain` matches its setup baseline.
- Desired user-visible outcome: The operator sees the exact GitHub command before deciding, and no leaves local or remote state unchanged.
- Pass/fail: PASS if both runtimes show the plan and cancellation output and each run leaves the GitHub variable and scratch tree at their baselines. FAIL if either runtime omits the command, the no answer changes the variable or the checkout differs.
- Classification: Manual scenario. Record PASS, FAIL or SKIP with the specific GitHub authentication, network or permission blocker.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `/doctor:ci toggle --variable=SKILLED_CI_REPORTS --state=off`

### Conversation Script

```json conversation
{
  "runtimes": [
    "claude-code",
    "opencode"
  ],
  "setup": [
    "find . -mindepth 1 -maxdepth 1 ! -name .conversation-scratch -exec rm -rf {} + && rm -f .conversation-scratch && git clone --no-hardlinks \"$CONVERSATION_REPO_ROOT\" .",
    "rm -rf .skilled && cp -R \"$CONVERSATION_REPO_ROOT/.skilled\" .skilled",
    "if [ -d \"$CONVERSATION_REPO_ROOT/.claude\" ]; then rm -rf .claude && cp -R \"$CONVERSATION_REPO_ROOT/.claude\" .claude; fi",
    "remote=\"$(git -C \"$CONVERSATION_REPO_ROOT\" remote get-url origin)\" && git remote set-url origin \"$remote\"",
    "mkdir -p .doctor-bin && real_gh=\"$(command -v gh || true)\" && printf '%s\\n' \"$real_gh\" > .doctor-bin/gh-real && cat > .doctor-bin/gh <<'EOF'\n#!/bin/sh\nif [ \"$1\" = variable ] && { [ \"$2\" = set ] || [ \"$2\" = delete ]; }; then printf '%s\\n' 'Blocked: GitHub variable writes are disabled in this scenario' >&2; exit 97; fi\nreal_gh=\"$(cat \"$(dirname \"$0\")/gh-real\")\"\nif [ -z \"$real_gh\" ] || [ ! -x \"$real_gh\" ]; then printf '%s\\n' 'gh CLI unavailable' >&2; exit 127; fi\nexec \"$real_gh\" \"$@\"\nEOF\nchmod +x .doctor-bin/gh",
    "printf '%s\\n' 'PATH=\"$(pwd)/.doctor-bin:$PATH\"' 'export PATH' > .doctor-bin/activate-path.sh",
    "case \"$CONVERSATION_RUNTIME\" in\n  claude-code)\n    node -e 'const fs=require(\"fs\");fs.mkdirSync(\".claude\",{recursive:true});const p=\".claude/settings.local.json\";const cur=fs.existsSync(p)?JSON.parse(fs.readFileSync(p,\"utf8\")):{};cur.env=Object.assign({},cur.env,{PATH:process.cwd()+\"/.doctor-bin:\"+process.env.PATH});fs.writeFileSync(p,JSON.stringify(cur,null,2))'\n    ;;\n  opencode)\n    if [ ! -f \"$CONVERSATION_REPO_ROOT/opencode.json\" ]; then printf '%s\\n' 'OpenCode project config fixture is missing'; exit 77; fi\n    if [ ! -d \"$CONVERSATION_REPO_ROOT/.opencode\" ]; then printf '%s\\n' 'OpenCode project configuration is missing'; exit 77; fi\n    cp \"$CONVERSATION_REPO_ROOT/opencode.json\" ./opencode.json\n    rm -rf .opencode && cp -R \"$CONVERSATION_REPO_ROOT/.opencode\" .opencode\n    ;;\n  pi)\n    if [ -d \"$CONVERSATION_REPO_ROOT/.pi\" ]; then rm -rf .pi && cp -R \"$CONVERSATION_REPO_ROOT/.pi\" .pi; fi\n    ;;\n  *)\n    printf '%s\\n' \"Unsupported runtime: $CONVERSATION_RUNTIME\" >&2\n    exit 2\n    ;;\nesac",
    "real_gh=\"$(cat .doctor-bin/gh-real)\"; if [ -z \"$real_gh\" ] || [ ! -x \"$real_gh\" ]; then printf '%s\\n' 'SKIP: gh CLI unavailable'; exit 77; fi; if ! \"$real_gh\" auth status >/dev/null 2>&1; then printf '%s\\n' 'SKIP: gh authentication unavailable'; exit 77; fi; repo=\"$(cd \"$CONVERSATION_REPO_ROOT\" && \"$real_gh\" repo view --json nameWithOwner --jq .nameWithOwner 2>/dev/null)\"; if [ -z \"$repo\" ]; then printf '%s\\n' 'SKIP: GitHub repository or network read unavailable'; exit 77; fi; value=\"$(\"$real_gh\" variable list --repo \"$repo\" --json name,value --jq '[.[] | select(.name == \"SKILLED_CI_REPORTS\") | .value] | .[0] // \"unset\"' 2>/dev/null)\"; if [ -z \"$value\" ]; then printf '%s\\n' 'SKIP: GitHub Actions variable read unavailable'; exit 77; fi; if [ \"$value\" = off ]; then printf '%s\\n' 'SKIP: SKILLED_CI_REPORTS is already off'; exit 77; fi; printf '%s\\n' \"$repo\" > ../doctor-gh-repo.txt && printf '%s\\n' \"$value\" > ../doctor-ci-reports-before.txt && git status --porcelain > ../doctor-ci-status-before.txt"
  ],
  "env": {
    "BASH_ENV": "./.doctor-bin/activate-path.sh"
  },
  "turns": [
    {
      "id": "plan",
      "send": "/doctor:ci toggle --variable=SKILLED_CI_REPORTS --state=off",
      "questions": [
        {
          "match": "[Ss]pec[- ]folder|[Ss]pecification folder|[Gg]ate 3|[Aa]sk about documentation|[Dd]ocumentation (scope|folder|path)",
          "answer": {
            "reply": "D"
          },
          "optional": true
        },
        {
          "match": "[Ss]elect",
          "answer": {
            "select": [
              "select"
            ]
          },
          "optional": true
        }
      ],
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"claude-code\" ]; then awk 'index($0, \"❯ /doctor:ci toggle --variable=SKILLED_CI_REPORTS\") { after=1; plan=0; variable=0; command=0; next } after && index($0, \"SWITCH CHANGE PLAN\") { plan=1 } after && index($0, \"Variable: SKILLED_CI_REPORTS\") { variable=1 } after && index($0, \"gh variable set SKILLED_CI_REPORTS --body off\") { command=1 } END { exit !(after && plan && variable && command) }' \"$CONVERSATION_TURN_DIR/screen.txt\" && grep -Fq '.doctor-bin' .claude/settings.local.json; elif [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then grep -Fq 'SWITCH CHANGE PLAN' \"$CONVERSATION_TURN_DIR/screen.txt\" && grep -Fq 'Variable: SKILLED_CI_REPORTS' \"$CONVERSATION_TURN_DIR/screen.txt\" && grep -Fq 'gh variable set SKILLED_CI_REPORTS --body off' \"$CONVERSATION_TURN_DIR/screen.txt\" && cmp -s opencode.json \"$CONVERSATION_REPO_ROOT/opencode.json\" && diff -qr .opencode \"$CONVERSATION_REPO_ROOT/.opencode\" >/dev/null; else printf '%s\\n' \"Unsupported runtime: $CONVERSATION_RUNTIME\" >&2; exit 2; fi && repo=\"$(cat ../doctor-gh-repo.txt)\" && value=\"$(gh variable list --repo \"$repo\" --json name,value --jq '[.[] | select(.name == \"SKILLED_CI_REPORTS\") | .value] | .[0] // \"unset\"')\" && test \"$value\" = \"$(cat ../doctor-ci-reports-before.txt)\" && git status --porcelain | diff - ../doctor-ci-status-before.txt"
    },
    {
      "id": "decline",
      "send": "no",
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"claude-code\" ]; then awk 'index($0, \"❯ no\") { after=1; status=0; changed=0; next } after && index($0, \"STATUS=CANCELLED ACTION=cancelled\") { status=1 } after && index($0, \"Changed: none\") { changed=1 } END { exit !(after && status && changed) }' \"$CONVERSATION_TURN_DIR/screen.txt\"; elif [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then grep -Fq 'STATUS=CANCELLED ACTION=cancelled' \"$CONVERSATION_TURN_DIR/screen.txt\" && grep -Fq 'Changed: none' \"$CONVERSATION_TURN_DIR/screen.txt\"; else printf '%s\\n' \"Unsupported runtime: $CONVERSATION_RUNTIME\" >&2; exit 2; fi && repo=\"$(cat ../doctor-gh-repo.txt)\" && value=\"$(gh variable list --repo \"$repo\" --json name,value --jq '[.[] | select(.name == \"SKILLED_CI_REPORTS\") | .value] | .[0] // \"unset\"')\" && test \"$value\" = \"$(cat ../doctor-ci-reports-before.txt)\" && git status --porcelain | diff - ../doctor-ci-status-before.txt",
      "questions": [
        {
          "match": "[Ss]pec[- ]folder|[Ss]pecification folder|[Gg]ate 3|[Aa]sk about documentation|[Dd]ocumentation (scope|folder|path)",
          "answer": {
            "reply": "D"
          },
          "optional": true
        },
        {
          "match": "[Ss]elect",
          "answer": {
            "select": [
              "select"
            ]
          },
          "optional": true
        }
      ]
    }
  ]
}
```

- The first `send` matches the Prompt line. Setup exits 77 with a one-line reason when `gh`, authentication, network access or the variable read is unavailable, so no subject starts. Every check reads the runtime screen, scratch Git status or GitHub variable list.

### Commands

1. `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/manual-testing-playbook/doctor-commands/doctor-ci-toggle-conversation.md --runtime claude-code,opencode --scratch <fresh-scratch-outside-repository> --out <evidence-directory>`

### Expected

Each runtime prints the plan and waits for the decline. After `no`, it reports cancellation, and the checkout status and remote variable match their setup baselines. Setup installs the scratch `.doctor-bin/gh` shim and makes it first on `PATH` for Bash through `BASH_ENV`; reads pass through to the real CLI and variable set/delete commands exit 97. Claude Code also gets the shim path in `.claude/settings.local.json`. OpenCode gets the repository `opencode.json` and `.opencode` project configuration. The plan check verifies the runtime configuration and the GitHub variable and checkout baselines.

### Evidence

- Claude Code reads the plan from `screen.txt` after the echoed send and reads the cancellation lines from `screen.txt` after the echoed `no`. OpenCode reads both replies from the final `screen.txt` frame without anchoring on the echoed send.
- Both runtimes read the GitHub variable through the scratch `gh` shim and compare `git status --porcelain` with the saved setup baseline after each turn.
- The Claude Code plan check reads `.claude/settings.local.json` for the shim path. The OpenCode plan check compares scratch `opencode.json` and `.opencode` with the repository copies.
- Per-turn screens, checks and checkpoint statuses.

### Pass / Fail

- **Pass**: Both Claude Code and OpenCode pass both turn checks, the `no` answer cancels the plan and neither checkout nor remote variable changes.
- **Skip**: Setup reports that the real `gh` CLI, authentication, network access or Actions variable read permission is unavailable, or the variable is already off.
- **Fail**: Either runtime misses the plan or cancellation output, the remote value changes or the checkout status differs from setup.

### Failure Triage

If the remote query fails, check `gh auth status` and repository variable read access. If the tree differs, inspect the scratch clone diff. If the cancellation output is missing, inspect phase 3 of `doctor-ci-toggle.yaml`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Existing command-level scenario: [DOC-394](doctor-ci-toggle.md)
- Command entrypoint: [.skilled/commands/doctor/ci.md](../../commands/doctor/ci.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-ci-toggle.yaml](../../commands/doctor/assets/doctor-ci-toggle.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-ci-presentation.txt](../../commands/doctor/assets/doctor-ci-presentation.txt)
- Switch documentation: [.github/workflows/README.md](../../../.github/workflows/README.md)

Provenance: manual only - /doctor:ci toggle

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-410
- Feature name: Doctor CI toggle conversation
- Command mode: `/doctor:ci toggle`
- Mutation boundary: No GitHub variable or tracked checkout file changes on the declined branch.
- Feature file path: `doctor-commands/doctor-ci-toggle-conversation.md`
