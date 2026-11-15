---
title: "VIB-HK-004 -- Turn-start delivers the turn-end completion advisory once"
description: "This scenario validates that a Vibe turn that ends on a completion claim records an advisory file at turn end and that the next turn start injects it once and consumes it, judged from the session journal and the hook-written file."
version: 1.0.0.0
---

# VIB-HK-004 -- Turn-start delivers the turn-end completion advisory once

This document captures the operator contract for `VIB-HK-004`.

---

## 1. OVERVIEW

This scenario asks a live Vibe session to do a small piece of work and say when it is finished, with the packet named in `VIBE_SPEC_FOLDER` holding no implementation summary. The `turn-end` completion part must record an advisory, and the next `turn-start` must inject it exactly once and delete the file it read.

### Why This Matters

A completion claim with no recorded evidence is the failure the sentinel exists for, and Vibe has no stop event to deliver it in. The pending file is the whole transport between the two turns: if either half regresses, the operator gets silence instead of the reminder, or the reminder on every later turn.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks, the hook-written advisory file and the journal evidence.

- Objective: verify that the `turn-end` completion part writes its pending advisory and that the next turn's `turn-start` injects it once and removes it.
- Real user request: `Please create hello.txt in this folder with the single line hello, then reply with one short sentence that says the task is finished.`
- Prompt: `Please create hello.txt in this folder with the single line hello, then reply with one short sentence that says the task is finished.`
- Expected execution process: the runner starts Vibe in a scratch project with the repository hooks rendered into a fresh `VIBE_HOME` and `VIBE_SPEC_FOLDER` naming a packet with no implementation summary. Vibe ends turn 1 on a completion claim and runs the `post_agent` `turn-end` hook, then starts turn 2 and runs the `pre_agent` `turn-start` hook.
- Expected signals: after turn 1 the pending advisory file under the scratch project exists and holds `claimed done`; after turn 2 the journal carries more `[completion-evidence]` occurrences than turn 1 recorded and the pending file is gone.
- Desired user-visible outcome: turn 2 shows `[turn-start] Added context for the model: "[completion-evidence] claimed done but no implementation-summary.md recorded ..."`.
- Pass/fail: PASS when both turn checks pass. FAIL when turn 1 records no advisory, or turn 2 delivers it zero times or more than once.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Please create hello.txt in this folder with the single line hello, then tell me when the task is finished.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-004 | Turn-start completion advisory | Record an advisory at turn end and deliver it once at the next turn start | `Please create hello.txt in this folder with the single line hello, then reply with one short sentence that says the task is finished.` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/turn-start-completion-advisory-conversation.md --runtime vibe --scratch "$(mktemp -d)" --out /tmp/vib-hk-004` | The pending advisory file holding `claimed done` after turn 1, and more `[completion-evidence]` occurrences than turn 1 recorded after turn 2 | `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt` | PASS when turn 1 records the advisory and turn 2 delivers it once. FAIL when turn 1 records nothing or turn 2 delivers it a different number of times. | 1. Read the check output in turns/claim/check.txt and turns/follow-up/check.txt. 2. Pipe a `post_agent` payload into `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs` with the same environment and read whether a pending file appears. 3. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `turn-end` and `turn-start`. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "env": {
    "SYSTEM_SPEC_GATE_DISABLED": "1",
    "SYSTEM_ASK_SURFACE_DISABLED": "1",
    "VIBE_SPEC_FOLDER": "specs/scenario-absent-packet/999-unrecorded-completion"
  },
  "turns": [
    {
      "id": "claim",
      "send": "Please create hello.txt in this folder with the single line hello, then reply with one short sentence that says the task is finished.",
      "check": "f=.skilled/skills/.state/completion-sentinel/vibe-pending-advisory.txt; test -s \"$f\" || { echo no-pending-advisory; exit 1; }; grep -qF 'claimed done' \"$f\" || { echo advisory-missing-detail; exit 1; }; c=$(grep -rohF '[completion-evidence]' \"$VIBE_HOME/logs/session/unified\" | wc -l | tr -d ' '); printf '%s\\n' \"$c\" > \"$CONVERSATION_RUN_DIR/evidence-count-turn1.txt\"; echo \"advisory-recorded baseline=$c\""
    },
    {
      "id": "follow-up",
      "send": "Thanks. Which files are in this folder now?",
      "check": "n=$(grep -rohF '[completion-evidence]' \"$VIBE_HOME/logs/session/unified\" | wc -l | tr -d ' '); base=$(tr -d ' ' < \"$CONVERSATION_RUN_DIR/evidence-count-turn1.txt\"); test \"$n\" -gt \"$base\" || { echo no-delivery; exit 1; }; test ! -f .skilled/skills/.state/completion-sentinel/vibe-pending-advisory.txt || { echo still-pending; exit 1; }; echo \"advisory-delivered turn1=$base turn2=$n pending=consumed\""
    }
  ]
}
```

The completion part only runs for an operator-named packet, so the script names one in `VIBE_SPEC_FOLDER`; the path resolves under the checkout and holds no implementation summary, which is the recorded-evidence gap the sentinel reports. The pending file is written under the session's own project root, which is the scratch project, so the turn-1 check reads it there and the turn-2 check reads the delivery in the journal. The prompt asks for the claim as the reply's closing sentence, because the sentinel reads only the last stretch of the reply and a claim buried above verification detail does not fire it. Turn 1 saves the delivery count and turn 2 compares against it, so the second check sees only what the second turn added and the deleted pending file proves the one-shot delivery. The ask surface is switched off because this run judges only the completion part, and its reprompt would add a second model turn to turn 1. The spec gate is switched off because no step of this scenario needs a documentation answer.

### Expected

Turn `claim` leaves the pending advisory file holding `claimed done`. Turn `follow-up` finds more `[completion-evidence]` occurrences than turn 1 did and no pending file left, because the composer deletes the file it delivered.

### Evidence

Capture `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt`, plus `setup.log`, and quote the pending advisory text from the turn check output.

### Pass / Fail

- **Pass**: turn 1 writes a pending advisory carrying `claimed done`, and turn 2 delivers it and consumes it.
- **Fail**: no pending file after turn 1, or no delivery and no consumption after turn 2.

### Failure Triage

1. Read turns/claim/check.txt and turns/follow-up/check.txt.
2. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `turn-end` and `turn-start`.
3. Pipe a `post_agent` payload with the same `VIBE_SPEC_FOLDER` into `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs`; a null part means the part itself, not the binding, is at fault, and the fingerprint store under the checkout's state folder explains a suppressed second advisory for an identical claim.

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
| `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs` | The turn-end composer that runs the completion part |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | The turn-start composer that delivers the pending advisory |
| `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs` | The completion part, the pending file and its path |
| `.vibe/hooks.toml` | The hook bindings |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-004
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/turn-start-completion-advisory-conversation.md`
