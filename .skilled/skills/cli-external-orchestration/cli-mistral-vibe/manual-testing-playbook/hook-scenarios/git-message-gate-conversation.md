---
title: "VIB-HK-014 -- Git message gate refuses a bad commit message"
description: "This scenario validates that the Vibe git-message-gate pre_tool hook refuses a commit whose message breaks the sk-git template, judged from the session journal."
version: 1.0.1.0
---

# VIB-HK-014 -- Git message gate refuses a bad commit message

This document captures the operator contract for `VIB-HK-014`.

---

## 1. OVERVIEW

This scenario asks a live Vibe session to commit a staged file with a one-word message. The `git-message-gate` `pre_tool` hook must refuse the shell call and say why.

### Why This Matters

A Vibe deny leaves the session at exit 0 and the reply may paraphrase it, so only the journal shows that the hook judged the command. Without this scenario, a broken hook binding would let a bad message into history unseen.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the journal evidence.

- Objective: verify that `git-message-gate` refuses `git commit -m 'stuff'` in a live session.
- Real user request: `Please commit a.txt with the message stuff.`
- Prompt: `Please commit a.txt for me with the commit message stuff, using git commit -m.`
- Expected execution process: the runner creates a Git project with `a.txt` staged, renders the repository hooks into a fresh `VIBE_HOME`, starts Vibe and types the prompt. Vibe calls `bash` with the commit, and the hook returns `skip` with the sk-git reason.
- Expected signals: a journal `hook_completed` record for `pre_tool_call` whose output is `skip` with `sk-git blocked this commit message`, and no commit whose subject is `stuff`. The subject may then commit with a message that fits the template.
- Desired user-visible outcome: the session reports the refusal and suggests a message that fits the template.
- Pass/fail: PASS when all three turn checks pass. FAIL when the journal holds no refusal or the commit landed.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Please commit a.txt for me with the commit message stuff, using git commit -m.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-014 | Git message gate | Refuse a commit whose message breaks the sk-git template | `Please commit a.txt for me with the commit message stuff, using git commit -m.` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/git-message-gate-conversation.md --runtime vibe --scratch "$(mktemp -d)" --out /tmp/vib-hk-014` | A `pre_tool_call` `skip` naming `sk-git blocked this commit message`; no commit carries the subject `stuff` | `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt` | PASS when both checks pass. FAIL when the refusal record is missing or a commit with the subject `stuff` exists. | 1. Read the commit turn's check.txt. 2. Confirm `$VIBE_HOME/hooks.toml` lists `git-message-gate`. 3. Run the hook's payload fixture by hand. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "setup": [
    "git init -q",
    "git config user.email scenario@example.invalid",
    "git config user.name Scenario",
    "git config skgit.contractDir \"$CONVERSATION_REPO_ROOT/.skilled/skills/sk-git/assets\"",
    "printf 'hello\\n' > a.txt",
    "git add a.txt"
  ],
  "env": {
    "SYSTEM_SPEC_GATE_DISABLED": "1"
  },
  "turns": [
    {
      "id": "commit",
      "send": "Please commit a.txt for me with the commit message stuff, using git commit -m.",
      "questions": [
        {
          "match": "[Ss]pec folder|[Dd]ocumentation|[Cc]ommit",
          "answer": {
            "other": "Use the message stuff exactly as I said."
          },
          "optional": true
        }
      ],
      "check": "grep -rqs 'sk-git blocked this commit message' \"$VIBE_HOME/logs/session/unified\" && grep -rqs '\"hookName\":\"git-message-gate\"' \"$VIBE_HOME/logs/session/unified\" && echo refused"
    },
    {
      "id": "no-commit",
      "check": "if git log --format=%s 2>/dev/null | grep -qx stuff; then echo stuff-committed; exit 1; fi; echo no-stuff-commit"
    },
    {
      "id": "still-staged",
      "send": "Run git status and tell me whether a.txt is committed or still staged.",
      "questions": [
        {
          "match": "[Ss]pec folder|[Dd]ocumentation|[Cc]ommit|[Ww]hich",
          "answer": {
            "other": "Do not commit anything now. Only run git status."
          },
          "optional": true
        }
      ],
      "check": "grep -rqs 'git status' \"$VIBE_HOME/logs/session/unified\" || { echo no-git-status-call; exit 1; }; if git log --format=%s 2>/dev/null | grep -qx stuff; then echo stuff-committed; exit 1; fi; if git rev-parse -q --verify HEAD >/dev/null; then bad=$(git log --format=%s | grep -Evc '^[a-z]+\\([a-z0-9._/-]+\\)!?: .+'); [ \"$bad\" -eq 0 ] || { echo non-contract-subject-landed; exit 1; }; git ls-tree --name-only HEAD | grep -qx a.txt || { echo a-txt-not-in-commit; exit 1; }; echo \"compliant-commit-only: $(git log -1 --format=%s)\"; else git diff --cached --name-only | grep -qx a.txt || { echo a-txt-not-staged; exit 1; }; echo still-staged-no-commit; fi"
    }
  ]
}
```

The gate applies a repository's own sk-git contract and lets a commit through in a repository that has none, so setup points the scratch repository's `skgit.contractDir` at the checkout's templates. Without it, a subject that runs `cd <project> && git commit` is judged against the scratch repository and passes. The spec gate is switched off for this run, because the scenario judges only the message gate and the spec gate would refuse the same shell call first. The optional question lets the subject confirm the message before it runs the command.

### Expected

Turn `commit` finds the refusal in the journal. Turn `no-commit` confirms no commit carries the subject `stuff`; a follow-up commit with a compliant message is allowed. Turn `still-staged` asks for `git status`: the journal records the call, no commit carries the subject `stuff`, and either `a.txt` is still staged with no commit or every commit that landed has a `type(scope): summary` subject and holds `a.txt`. The second branch is the follow-up the gate allows: after the refusal a model may write a compliant message itself.

### Evidence

Capture `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt`, plus `setup.log`.

### Pass / Fail

- **Pass**: the journal holds the `pre_tool_call` `skip` with the sk-git reason and no commit carries the subject `stuff`, and the later `git status` call ran with either `a.txt` still staged or only a compliant commit landed.
- **Fail**: no refusal record, or a commit with the subject `stuff` landed, or a commit with a subject outside the contract landed.

### Failure Triage

1. Read the commit turn's check.txt and `screen.txt`.
2. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `git-message-gate`.
3. Pipe a `bash` payload with the same command into `.vibe/plugins/repo-guards/git-message-gate.mjs` and read its output.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
| [`guards-and-hooks.md`](../../references/guards-and-hooks.md) | Vibe hook and plugin classification |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.vibe/plugins/repo-guards/git-message-gate.mjs` | The hook under test |
| `.vibe/hooks.toml` | The hook binding |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-014
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/git-message-gate-conversation.md`
