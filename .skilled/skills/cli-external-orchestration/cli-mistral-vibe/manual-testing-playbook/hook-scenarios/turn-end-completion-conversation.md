---
title: "VIB-HK-009 -- Turn-end leaves a completion advisory and never blocks"
description: "This scenario validates that a Vibe turn that ends on a completion claim with no recorded evidence leaves one pending advisory and still ends on a post_agent accept, judged from the session journal and the hook-written file."
version: 1.0.0.0
---

# VIB-HK-009 -- Turn-end leaves a completion advisory and never blocks

This document captures the operator contract for `VIB-HK-009`.

---

## 1. OVERVIEW

This scenario asks a live Vibe session to do a small piece of work and say when it is completed, with the packet named in `VIBE_SPEC_FOLDER` holding no implementation summary. The `turn-end` completion part must record one advisory for the next turn and must not deny the finished turn.

### Why This Matters

Vibe turns a `post_agent` deny into a retry user message, so a completion guard that denied would cost the operator a second model turn for a reminder. The advisory is meant to be free: the claim has no evidence, the operator hears about it once, and the turn still ends where the agent left it.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks, the hook-written advisory file and the journal evidence.

- Objective: verify that the `turn-end` completion part records one pending advisory and leaves the turn on a `post_agent` accept with no retry.
- Real user request: `Create notes.txt in this folder with one line of text, then reply with one short sentence that says the work is completed.`
- Prompt: `Create notes.txt in this folder with one line of text, then reply with one short sentence that says the work is completed.`
- Expected execution process: the runner starts Vibe in a scratch project with the repository hooks rendered into a fresh `VIBE_HOME` and `VIBE_SPEC_FOLDER` naming a packet with no implementation summary. Vibe ends turn 1 on a completion claim and runs the `post_agent` `turn-end` hook.
- Expected signals: the journal holds a `post_agent` hook run completion with no `post_agent` deny notice, which is how Vibe records an accept, and the pending advisory file under the scratch project holds `claimed done` with the reread reminder.
- Desired user-visible outcome: the reply names the work as completed, the session returns to the prompt, and the next turn carries the reminder instead of the current turn repeating itself.
- Pass/fail: PASS when both turn checks pass. FAIL when the hook retried the turn or wrote no advisory.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create notes.txt in this folder with one line of text, then tell me the work is completed.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-009 | Turn-end completion evidence | Leave one advisory and keep the finished turn on an accept | `Create notes.txt in this folder with one line of text, then reply with one short sentence that says the work is completed.` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/turn-end-completion-conversation.md --runtime vibe --scratch "$(mktemp -d)" --out /tmp/vib-hk-009` | A completed `post_agent` hook run with no deny notice, and one pending advisory file holding `claimed done` | `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt` | PASS when the journal records the accept and the advisory file exists with no retry. FAIL when the turn was retried or no advisory was written. | 1. Read the check output in turns/claim/check.txt and turns/no-retry/check.txt. 2. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `turn-end`. 3. Pipe a `post_agent` payload with the same `VIBE_SPEC_FOLDER` into `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs` and read whether it prints a deny. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "env": {
    "SYSTEM_SPEC_GATE_DISABLED": "1",
    "SYSTEM_ASK_SURFACE_DISABLED": "1",
    "VIBE_SPEC_FOLDER": "specs/scenario-absent-packet/998-unrecorded-completion"
  },
  "turns": [
    {
      "id": "claim",
      "send": "Create notes.txt in this folder with one line of text, then reply with one short sentence that says the work is completed.",
      "check": "f=.skilled/skills/.state/completion-sentinel/vibe-pending-advisory.txt; test -s \"$f\" || { echo no-pending-advisory; exit 1; }; grep -rqsF '\"kind\":\"hook_run_completed\",\"scope\":\"post_agent\"' \"$VIBE_HOME/logs/session/unified\" || { echo no-post-agent-run; exit 1; }; if grep -rqsF '\"kind\":\"hook_completed\",\"scope\":\"post_agent\"' \"$VIBE_HOME/logs/session/unified\"; then echo post-agent-denied; exit 1; fi; echo \"post-agent-accept advisory-recorded\""
    },
    {
      "id": "no-retry",
      "check": "grep -qF 'reread the request' .skilled/skills/.state/completion-sentinel/vibe-pending-advisory.txt || { echo advisory-missing-reread; exit 1; }; if grep -rqsF '\"kind\":\"hook_completed\",\"scope\":\"post_agent\"' \"$VIBE_HOME/logs/session/unified\"; then echo retry-recorded; exit 1; fi; echo \"no-retry advisory-holds-reread\""
    }
  ]
}
```

The completion part only runs for an operator-named packet, so the script names one in `VIBE_SPEC_FOLDER`; the path resolves under the checkout and holds no implementation summary, which is the recorded-evidence gap the sentinel reports. The pending file is written under the session's own project root, which is the scratch project, so both checks read it there. The prompt asks for the claim as the reply's closing sentence, because the sentinel reads only the last stretch of the reply: a claim buried above verification detail does not fire it. A `post_agent` deny is recorded as a `hook_completed` notice scoped to `post_agent`, and an accept leaves only the run start and completion notices, which is what the first check asserts. The ask surface is switched off because this run judges only the completion part and its own reprompt would be a retry this scenario would then have to explain. The spec gate is switched off because no step of this scenario needs a documentation answer. The second turn is a check-only step, so the pending advisory is still unread when it runs.

### Expected

Turn `claim` leaves the journal with a completed `post_agent` hook run, no `post_agent` deny notice, and the pending advisory file holding `claimed done` plus the reread reminder. Turn `no-retry` finds no deny notice and the advisory still in place.

### Evidence

Capture `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt`, plus `setup.log`, and quote the pending advisory text from the turn check output.

### Pass / Fail

- **Pass**: the journal holds the completed `post_agent` run with no deny notice, and one pending advisory file.
- **Fail**: a `post_agent` deny notice was recorded, or no advisory file was written.

### Failure Triage

1. Read turns/claim/check.txt and turns/no-retry/check.txt.
2. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `turn-end`.
3. Pipe a `post_agent` payload with the same `VIBE_SPEC_FOLDER` into `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs`; printed output means the composer denied, and silence with no pending file means the completion part never reached its advisory.

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
| `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs` | The hook under test |
| `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs` | The completion part and the pending advisory it writes |
| `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs` | The part that may deny the same turn, switched off for this run |
| `.vibe/hooks.toml` | The hook binding |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-009
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/turn-end-completion-conversation.md`
