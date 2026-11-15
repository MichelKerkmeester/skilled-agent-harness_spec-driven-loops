---
title: "VIB-HK-016 -- Post-edit quality returns a comment-hygiene finding in the tool result"
description: "This scenario validates that the Vibe post-edit-quality post_tool hook appends the comment-hygiene finding for an edited source file to the tool result the model reads, judged from the session journal."
version: 1.0.2.0
---

# VIB-HK-016 -- Post-edit quality returns a comment-hygiene finding in the tool result

This document captures the operator contract for `VIB-HK-016`.

---

## 1. OVERVIEW

This scenario asks a live Vibe session to add a review note that names a review finding to a TypeScript file. The `post-edit-quality` `post_tool` hook must run the comment-hygiene checker on the edited file and append its finding to the tool result.

### Why This Matters

A finding the hook appends is the only channel the model has: the hook never denies, so a broken router or a missing checker leaves the edit looking clean. The journal records the appended text beside the tool output, which is what makes a silent failure visible at all.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the journal evidence.

- Objective: verify that `post-edit-quality` appends the comment-hygiene finding for an edited `.ts` file to the tool result.
- Real user request: `In src/greeting.ts, add this comment line directly above the greet function and keep it verbatim: // review finding: the concatenation should be a template literal`
- Prompt: `In src/greeting.ts, add this comment line directly above the greet function and keep it verbatim: // review finding: the concatenation should be a template literal`
- Expected execution process: the runner creates a scratch project holding a small TypeScript file, renders the repository hooks into a fresh `VIBE_HOME`, starts Vibe and types the prompt. The subject edits the file, and the hook resolves the comment-hygiene checker from the checkout, runs it on the edited file and appends the finding as additional context.
- Expected signals: a journal `post_tool_call` record whose tool result carries the advisory banner, the `comment-hygiene` label and the checker's `review finding reference` reason for the edited file.
- Desired user-visible outcome: the session reports the finding, or at least carries it beside the edit, and the file keeps the comment the operator asked for.
- Pass/fail: PASS when all three turn checks pass. FAIL when the journal holds no advisory, or the advisory names neither the checker label nor the rule reason.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `In src/greeting.ts, add this comment line directly above the greet function and keep it verbatim: // review finding: the concatenation should be a template literal`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-016 | Post-edit quality | Return the comment-hygiene finding for an edit that breaks a code standard | `In src/greeting.ts, add this comment line directly above the greet function and keep it verbatim: // review finding: the concatenation should be a template literal` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/post-edit-quality.md --runtime vibe --scratch "$(mktemp -d)" --out specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-016` | A `post_tool_call` result carrying the advisory banner, the `comment-hygiene` label and the `review finding reference` reason | `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt` | PASS when both checks pass. FAIL when the advisory or its rule reason is missing. | 1. Read the edit turn's check.txt. 2. Confirm `$VIBE_HOME/hooks.toml` lists `post-edit-quality` with `match = "re:write_file|edit"`. 3. Pipe the same post_tool payload into the hook by hand and read its output. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "setup": [
    "mkdir -p src",
    "printf 'export function greet(name: string): string {\\n  return \"Hello, \" + name;\\n}\\n' > src/greeting.ts"
  ],
  "env": {
    "SYSTEM_SPEC_GATE_DISABLED": "1"
  },
  "turns": [
    {
      "id": "edit",
      "send": "In src/greeting.ts, add this comment line directly above the greet function and keep it verbatim: // review finding: the concatenation should be a template literal",
      "questions": [
        {
          "match": "[Ww]hich file|[Cc]omment|[Ss]pec folder|[Dd]ocumentation|[Cc]onfirm|[Cc]reate",
          "answer": {
            "other": "Use src/greeting.ts and add the comment line exactly as I wrote it."
          },
          "optional": true
        }
      ],
      "check": "grep -rqs 'Advisory findings from the edited file' \"$VIBE_HOME/logs/session/unified\" && grep -rqsF '[comment-hygiene]' \"$VIBE_HOME/logs/session/unified\" && echo finding-returned"
    },
    {
      "id": "rule",
      "check": "grep -rqs 'review finding reference' \"$VIBE_HOME/logs/session/unified\" && grep -rqs 'greeting.ts' \"$VIBE_HOME/logs/session/unified\" && echo rule-named"
    },
    {
      "id": "clean-edit",
      "send": "Now remove that comment line and change the concatenation in greet to a template literal.",
      "questions": [
        {
          "match": "[Ss]pec folder|[Dd]ocumentation|[Ww]hich|[Cc]onfirm",
          "answer": {
            "other": "Edit src/greeting.ts as asked."
          },
          "optional": true
        }
      ],
      "check": "grep -q 'review finding' src/greeting.ts && { echo comment-still-there; exit 1; }; grep -qF '`Hello, ${name}`' src/greeting.ts || { echo no-template-literal; exit 1; }; for i in $(seq 1 20); do node \"$CONVERSATION_REPO_ROOT/.vibe/plugins/repo-guards/fixtures/journal-check.cjs\" \"$VIBE_HOME/logs/session/unified\" post-tool-lacks 'greeting.ts' '[comment-hygiene]' && echo clean-edit-earned-no-hygiene-finding && exit 0; sleep 1; done; exit 1"
    }
  ]
}
```

The router resolves the comment-hygiene checker from the hub copy beside the router, so the scratch project needs no checker of its own and setup only has to give the edit a file to change. The note names a review finding because that is the rule the checker reports without needing a build, a linter or a language server. The spec gate is switched off for this run, because the scenario judges only the post-edit hook and a spec-gate refusal would stop the edit before it happened. The optional question lets the subject confirm the file or the comment wording before it edits.

### Expected

Turn `edit` finds the advisory banner and the `comment-hygiene` label in the journal's tool result. Turn `rule` finds the checker's `review finding reference` reason beside the edited file's name, which is what tells an operator the finding came from the rule table rather than from a bare exit status. Turn `clean-edit` asks for the comment to go and the concatenation to become a template literal: the file holds the template literal and no review-finding comment, and the latest post-tool result for `greeting.ts` carries no `[comment-hygiene]` finding, so the finding clears once its cause is fixed.

### Evidence

Capture `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt`, plus `setup.log`.

### Pass / Fail

- **Pass**: the journal holds the advisory with the `comment-hygiene` label, and the same advisory names the `review finding reference` reason and the edited file, and the follow-up clean edit earns no `[comment-hygiene]` finding.
- **Fail**: no advisory record, or an advisory that names neither the checker label nor the rule reason, or the follow-up clean edit still earns the finding.

### Failure Triage

1. Read turns/edit/check.txt and screen.txt.
2. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `post-edit-quality` with `match = "re:write_file|edit"`.
3. Pipe a `post_tool` payload naming the edited `.ts` file into `.vibe/plugins/repo-guards/post-edit-quality.mjs` and read its output.

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
| `.vibe/plugins/repo-guards/post-edit-quality.mjs` | The hook under test |
| `.vibe/hooks.toml` | The hook binding |
| `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` | The runtime-neutral core that dispatches the checker and shapes the finding |
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` | The checker whose rule table produces the finding |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-016
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/post-edit-quality.md`
