---
title: "RRD-005 -- Restraint refusal reversed by evidence"
description: "This scenario validates the restraint refusal for `RRD-005`. It checks that the refusal changes after the user names a concrete present-day failure."
stage: routing
version: 1.0.0.0
---

# RRD-005 -- Restraint refusal reversed by evidence

This document captures the conversation contract, current behavior, execution flow, source anchors, and metadata for `RRD-005`.

---

## 1. OVERVIEW

This scenario validates the restraint refusal for `RRD-005`. It checks that a missing failure causes a refusal, then that new evidence makes the same proposal eligible for authoring.

### Why This Matters

A refusal based on missing evidence is correct only while that evidence is missing. The follow-up must let the user change the outcome by naming a failure, while keeping the workflow from drafting a rule before that failure exists.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RRD-005` and confirm both turns against the expected signals.

- Objective: refuse a rule request that names no present-day failure, then author it after the user supplies a concrete failure
- Real user request: `Add a repo rule for working safely alongside another live session. It is best practice and I think we should have it written down.`
- Prompt: `Add a repo rule for working safely alongside another live session. It is best practice and I think we should have it written down.`
- Expected execution process: load and apply the decision tests in order on Claude Code, OpenCode and Pi. Setup copies `.skilled` and the matching runtime project configuration into the scratch project. The first request fails the restraint test because it names no failure and should invite the user to name one. The second turn describes lost uncommitted edits from two sessions in one checkout. Re-run the tests against that evidence and author the rule in the scratch project. A documentation question may appear in plain chat or a runtime question dialog. The optional plain-chat answer replies `D`; the optional dialog answer selects `D) Skip`. The question match accepts wording such as “spec folder,” “documentation path” and “where should the work be documented,” without matching either send.
- Expected signals: on all three runtimes, the first response names test 4 or the restraint test, says a present-day failure is missing, and leaves the requested rule path absent. Claude Code and Pi checks read after the echoed send in full history; OpenCode checks its final frame and the scratch filesystem. The second turn creates a titled rule with a numbered section covering safe work by parallel sessions.
- Desired user-visible outcome: the user sees that the refusal depends on its evidence and can change the result by reporting a failure that happens today.
- Pass/fail: PASS if Claude Code, OpenCode and Pi each refuse in turn 1 without writing the rule and write it in turn 2 after the concrete failure is supplied; FAIL if any runtime writes before the evidence, keeps refusing after the evidence, or leaves the rule absent.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Add a repo rule for working safely alongside another live session. It is best practice and I think we should have it written down.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RRD-005 | Evidence reopens restraint refusal | Verify a refusal is followed by authoring only after a concrete failure is named | `Add a repo rule for working safely alongside another live session. It is best practice and I think we should have it written down.` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook/rule-decision/no-observed-failure-refusal-conversation.md --runtime claude-code,opencode,pi --scratch <dir-outside-repository> --out <evidence-dir>` | For each runtime, turn 1 names test 4 or the restraint test, refuses for lack of a present-day failure, and creates no rule. Turn 2 accepts the concrete shared-checkout failure and creates `parallel-session-ownership.md` in that runtime’s scratch rule directory. | `matrix.md`, each runtime’s `result.json` and `checkpoints.tsv`, both turns’ `screen.txt`, `history.txt` and `check.txt`, and each authored scratch rule. Pi evidence uses full scrollback after the echoed send; OpenCode uses its final-frame reply and filesystem state. | PASS if both turn checks pass for Claude Code, OpenCode and Pi, and the rule appears only after the failure is named in each scratch project. FAIL if any runtime writes before the evidence, refuses after the evidence, or does not create the rule. | 1. For Claude Code and Pi, inspect turn 1’s `history.txt` and check output. For OpenCode, inspect the final-frame `screen.txt` and check output. 2. Inspect turn 2’s check output and scratch rule for each runtime. 3. If setup reports that the target rule already exists, refresh the target and checks against a rule name absent from the source project. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "claude-code",
    "opencode",
    "pi"
  ],
  "setup": [
    "if [ -z \"$CONVERSATION_REPO_ROOT\" ] || [ ! -d \"$CONVERSATION_REPO_ROOT/.skilled\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/AGENTS.md\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/REPO RULES.md\" ]; then printf '%s\\n' 'repository skills or instructions are missing'; exit 77; fi; case \"$CONVERSATION_RUNTIME\" in claude-code) test -d \"$CONVERSATION_REPO_ROOT/.claude\" || { printf '%s\\n' 'Claude project configuration is missing'; exit 77; } ;; opencode) test -f \"$CONVERSATION_REPO_ROOT/opencode.json\" && test -d \"$CONVERSATION_REPO_ROOT/.opencode\" || { printf '%s\\n' 'OpenCode project configuration is missing'; exit 77; } ;; pi) test -d \"$CONVERSATION_REPO_ROOT/.pi\" || { printf '%s\\n' 'Pi project configuration is missing'; exit 77; } ;; *) printf '%s\\n' 'unsupported conversation runtime'; exit 77 ;; esac",
    "test ! -e \"$CONVERSATION_REPO_ROOT/.skilled/repo-rules/parallel-session-ownership.md\" || { printf '%s\\n' 'parallel-session-ownership.md already exists in the source'; exit 77; }",
    "if ! command -v git >/dev/null 2>&1; then printf '%s\\n' 'git is required'; exit 77; fi",
    "if [ \"$CONVERSATION_RUNTIME\" = claude-code ]; then if [ ! -f \"$HOME/.claude/CLAUDE.md\" ]; then printf '%s\\n' 'global Claude instructions at ~/.claude/CLAUDE.md are missing'; exit 77; fi; if ! command -v claude >/dev/null 2>&1; then printf '%s\\n' 'Claude Code CLI is unavailable'; exit 77; fi; auth_status=$(claude auth status 2>&1 || true); if printf '%s\\n' \"$auth_status\" | grep -Eiq 'not[[:space:]]+(authenticated|logged in)|unauthenticated|authenticated[^[:alnum:]]+false|logged[[:space:]]+in[^[:alnum:]]+false|401|login required'; then printf '%s\\n' 'Claude Code OAuth is not authenticated'; exit 77; elif ! printf '%s\\n' \"$auth_status\" | grep -Eiq 'authenticated|logged in|oauth|setup-token'; then printf '%s\\n' 'Claude Code authentication status is unavailable'; exit 77; fi; if ! command -v curl >/dev/null 2>&1 || ! curl -sS -o /dev/null -I --max-time 10 https://api.anthropic.com/; then printf '%s\\n' 'Claude Code network access is unavailable'; exit 77; fi; fi",
    "if [ \"$CONVERSATION_RUNTIME\" = opencode ]; then if ! command -v opencode >/dev/null 2>&1; then printf '%s\\n' 'OpenCode CLI is unavailable'; exit 77; fi; opencode_auth=\"${XDG_DATA_HOME:-$HOME/.local/share}/opencode/auth.json\"; if [ ! -f \"$opencode_auth\" ] || ! grep -Fq '\"llmgateway\"' \"$opencode_auth\"; then printf '%s\\n' 'OpenCode llmgateway login is unavailable'; exit 77; fi; if ! command -v curl >/dev/null 2>&1 || ! curl -sS -o /dev/null -I --max-time 10 https://api.llmgateway.io/ >/dev/null 2>&1; then printf '%s\\n' 'LLM Gateway network access is unavailable'; exit 77; fi; fi",
    "if [ \"$CONVERSATION_RUNTIME\" = pi ]; then if ! command -v pi >/dev/null 2>&1; then printf '%s\\n' 'Pi CLI is unavailable'; exit 77; fi; if [ ! -s \"${PI_CODING_AGENT_DIR:-$HOME/.pi/agent}/auth.json\" ] && ! env | grep -q '_API_KEY=.'; then printf '%s\\n' 'Pi login unavailable: no auth.json or provider API key'; exit 77; fi; fi",
    "rm -rf .skilled .claude .opencode .pi opencode.json",
    "cp -R \"$CONVERSATION_REPO_ROOT/.skilled\" .skilled",
    "if [ \"$CONVERSATION_RUNTIME\" = claude-code ]; then cp -R \"$CONVERSATION_REPO_ROOT/.claude\" .claude; fi",
    "if [ \"$CONVERSATION_RUNTIME\" = opencode ]; then cp \"$CONVERSATION_REPO_ROOT/opencode.json\" ./opencode.json && cp -R \"$CONVERSATION_REPO_ROOT/.opencode\" .opencode; fi",
    "if [ \"$CONVERSATION_RUNTIME\" = pi ]; then cp -R \"$CONVERSATION_REPO_ROOT/.pi\" .pi; fi",
    "git init",
    "cp \"$CONVERSATION_REPO_ROOT/AGENTS.md\" AGENTS.md",
    "cp \"$CONVERSATION_REPO_ROOT/REPO RULES.md\" 'REPO RULES.md'"
  ],
  "turns": [
    {
      "id": "missing-failure-refusal",
      "send": "Add a repo rule for working safely alongside another live session. It is best practice and I think we should have it written down.",
      "questions": [
        {
          "match": "[Ww]here should this change live|[Ss]pec[- ]folder|[Dd]ocumentation.{0,50}([Ff]older|[Ss]cope|[Pp]ath)|[Ff]older.{0,30}([Ss]pec|[Dd]ocumentation)|[Ww]here.{0,50}documented|[Dd]ocument.{0,30}([Pp]ath|[Ff]older|[Ss]cope)",
          "answer": {
            "select": [
              "Skip"
            ]
          },
          "optional": true
        },
        {
          "match": "[Ww]here should this change live|[Ss]pec[- ]folder|[Dd]ocumentation.{0,50}([Ff]older|[Ss]cope|[Pp]ath)|[Ff]older.{0,30}([Ss]pec|[Dd]ocumentation)|[Ww]here.{0,50}documented|[Dd]ocument.{0,30}([Pp]ath|[Ff]older|[Ss]cope)",
          "answer": {
            "reply": "D"
          },
          "optional": true
        }
      ],
      "check": "case \"$CONVERSATION_RUNTIME\" in claude-code) reply=\"$(awk 'index($0, \"I think we should have it written down.\") { after=1; next } after { print }' \"$CONVERSATION_TURN_DIR/history.txt\")\" ;; opencode) reply=\"$(tail -n 45 \"$CONVERSATION_TURN_DIR/screen.txt\")\" ;; pi) reply=\"$(awk 'index($0, \"I think we should have it written down.\") { after=1; next } after { print }' \"$CONVERSATION_TURN_DIR/history.txt\")\" ;; *) printf '%s\\n' 'unsupported conversation runtime'; exit 1 ;; esac; test -n \"$reply\" && printf '%s\\n' \"$reply\" | grep -Eiq 'restraint|test[[:space:]]*4|name[sd]? (a|the) failure|what went wrong|hold off|best practice' && test ! -e .skilled/repo-rules/parallel-session-ownership.md && printf '%s\\n' 'refused under the restraint test; no rule drafted'"
    },
    {
      "id": "failure-supplied-rule-authored",
      "send": "Last week two agent sessions edited the same checkout and overwrote each other's uncommitted changes. We lost the only fix for the build and spent half a day reconstructing it. Please write a rule for working safely alongside another live session at .skilled/repo-rules/parallel-session-ownership.md.",
      "questions": [
        {
          "match": "[Ww]here should this change live|[Ss]pec[- ]folder|[Dd]ocumentation.{0,50}([Ff]older|[Ss]cope|[Pp]ath)|[Ff]older.{0,30}([Ss]pec|[Dd]ocumentation)|[Ww]here.{0,50}documented|[Dd]ocument.{0,30}([Pp]ath|[Ff]older|[Ss]cope)",
          "answer": {
            "select": [
              "Skip"
            ]
          },
          "optional": true
        },
        {
          "match": "[Ww]here should this change live|[Ss]pec[- ]folder|[Dd]ocumentation.{0,50}([Ff]older|[Ss]cope|[Pp]ath)|[Ff]older.{0,30}([Ss]pec|[Dd]ocumentation)|[Ww]here.{0,50}documented|[Dd]ocument.{0,30}([Pp]ath|[Ff]older|[Ss]cope)",
          "answer": {
            "reply": "D"
          },
          "optional": true
        }
      ],
      "check": "test -s .skilled/repo-rules/parallel-session-ownership.md && grep -Eq '^title:' .skilled/repo-rules/parallel-session-ownership.md && grep -Eq '^## [0-9]+\\.' .skilled/repo-rules/parallel-session-ownership.md && grep -Eiq '(parallel|session|concurrent)' .skilled/repo-rules/parallel-session-ownership.md && grep -Eiq '(ownership|uncommitted|overwrit|same checkout)' .skilled/repo-rules/parallel-session-ownership.md && printf '%s\\n' 'rule drafted for the named shared-checkout failure'"
    }
  ]
}
```

- The first `send` matches the scenario contract prompt exactly. The second send supplies the failure that makes the proposal eligible for authoring.

### Commands

1. `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook/rule-decision/no-observed-failure-refusal-conversation.md --runtime claude-code,opencode,pi --scratch <dir-outside-repository> --out <evidence-dir>`

The scratch directory must be outside the repository.

### Expected

Each runtime runs the two turns in its own scratch project. Turn 1 refuses the request under the restraint test and leaves `parallel-session-ownership.md` absent. Turn 2 supplies the concrete loss of uncommitted work, re-runs the decision tests and authors the rule. A plain-chat documentation question is answered with `reply: D`; a question dialog selects `D) Skip`.

### Evidence

Capture `matrix.md`, each runtime's `result.json` and `checkpoints.tsv`, both turns' `screen.txt`, `history.txt` and `check.txt`, and each authored rule under that runtime's scratch `.skilled/repo-rules/` directory. Turn 1 checks the reply after the echoed send in Claude Code and Pi `history.txt`; Pi uses the full scrollback, while OpenCode reads only the last 45 lines of its final-frame `screen.txt`, where the end of the reply remains visible. All three also check that the rule file is absent. The optional documentation answers cover plain chat with `reply: D` and question dialogs with `select: ["Skip"]`, which chooses whichever option contains "Skip", since each runtime words that option differently. Turn 2 checks the generated rule's title, numbered section and shared-session content from the scratch filesystem.

### Pass / Fail

- **Pass**: Claude Code, OpenCode and Pi each pass both turn checks. Turn 1 names the restraint test or test 4, identifies the missing present-day failure and writes no rule. Turn 2 accepts the supplied failure and creates the titled rule with a numbered section about parallel-session ownership. Optional documentation questions are answered on the runtime's observed surface without changing either state check.
- **Fail**: any runtime writes the rule in turn 1 or refuses after the failure is named in turn 2, or any runtime's expected rule file is missing or has no rule section.

### Failure Triage

1. Inspect Claude Code and Pi turn 1 `history.txt`, or OpenCode's final-frame `screen.txt`, alongside `check.txt` to distinguish a restraint refusal from an earlier decision test.
2. Inspect each runtime's turn 2 `check.txt` and scratch rule to confirm the incident was supplied and the rule was created.
3. If setup says the target path already exists in the source, choose a target name absent from the source and update the setup guard and both checks.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| No feature-catalog entry | This packet has no `feature-catalog/`, so no catalog cross-reference exists |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`references/decision-tests.md`](../../references/decision-tests.md) | The four decision tests and restraint test that govern both turns |
| [`rule-authoring/full-rule-authoring.md`](../rule-authoring/full-rule-authoring.md) | Existing valid shared-session proposal and full authoring outcome |
| [`SKILL.md`](../../SKILL.md) | Create workflow and required decision-test sequence |

---

## 5. SOURCE METADATA

- Group: RULE DECISION
- Playbook ID: RRD-005
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `rule-decision/no-observed-failure-refusal-conversation.md`
