---
title: "VIB-HK-003 -- Turn-start advisor adds the skill advisor brief once"
description: "This scenario validates that the Vibe turn-start pre_agent hook injects the skill advisor brief on the first turn and delivers nothing for an identical repeat message, judged from the session journal."
version: 1.0.2.0
---

# VIB-HK-003 -- Turn-start advisor adds the skill advisor brief once

This document captures the operator contract for `VIB-HK-003`.

---

## 1. OVERVIEW

This scenario asks a live Vibe session for advice on a task that routes to one skill, then sends the same message a second time. The `turn-start` `pre_agent` hook must add the advisor brief to the first turn and add nothing to the second, because its delivery receipts are file-backed and a repeated route adds no information.

### Why This Matters

The brief costs context on every turn, so the receipts that keep it from repeating are what make it affordable. Vibe runs a fresh hook process per turn, so only the file-backed receipts can suppress the repeat; if they regress, the operator pays the same block on every message and nothing on screen shows it.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the journal evidence.

- Objective: verify that the `turn-start` advisor part injects a context starting `Advisor:` on the first turn and adds no second brief for an identical repeat message.
- Real user request: `I need to write a README for a brand new skill, where do I start?`
- Prompt: `I need to write a README for a brand new skill, where do I start?`
- Expected execution process: the runner starts Vibe in a scratch project with the repository hooks rendered into a fresh `VIBE_HOME`, types the message, and types the same message again on the second turn. Vibe runs the `pre_agent` `turn-start` hook on each turn and records its result in the session journal.
- Expected signals: after turn 1 the journal holds a `pre_agent` context notice whose text leads with `Advisor:` and the advisor head receipt exists for the session; after turn 2 the receipt's modification time is unchanged, so the second turn delivered nothing.
- Desired user-visible outcome: turn 1 shows `[turn-start] Added context for the model: "Advisor: ..."`, and turn 2 shows no such line.
- Pass/fail: PASS when both turn checks pass. FAIL when turn 1 carries no brief or turn 2 adds a second one.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I need to write a README for a brand new skill, where do I start?`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-003 | Turn-start advisor brief | Add the brief on turn 1 and add nothing for an identical repeat message | `I need to write a README for a brand new skill, where do I start?` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/turn-start-advisor.md --runtime vibe --scratch "$(mktemp -d)" --out /tmp/vib-hk-003` | A `pre_agent` context notice leading with `Advisor:` after turn 1, and the session's head receipt unchanged after turn 2 | `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt` | PASS when turn 1 finds the brief and turn 2 adds none. FAIL when turn 1 is empty or turn 2 adds a second brief. | 1. Read the check output in turns/advisor-1/check.txt and turns/advisor-2/check.txt. 2. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `turn-start`. 3. Pipe a `pre_agent` payload into `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` twice with one session id and compare the two outputs. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "env": {
    "SYSTEM_SPEC_GATE_DISABLED": "1"
  },
  "turns": [
    {
      "id": "advisor-1",
      "send": "I need to write a README for a brand new skill, where do I start?",
      "questions": [
        {
          "match": "[Mm]ode|[Ww]hich|[Rr]eference|[Ss]kill|[Tt]ype of",
          "answer": {
            "other": "Just give me the first step, no need to open anything."
          },
          "optional": true
        }
      ],
      "check": "sid=$(ls \"$VIBE_HOME/logs/session/unified\" | head -1); h=$(printf '%s' \"$sid\" | shasum -a 256 | cut -c1-16); f=\"$TMPDIR/speckit-advisor/vibe-turn-start/$h.head\"; test -s \"$f\" || { echo no-head-receipt; exit 1; }; stat -f %m \"$f\" > \"$CONVERSATION_RUN_DIR/receipt-turn1.txt\"; grep -rohF '\"kind\":\"hook_run_completed\",\"scope\":\"pre_agent\"' \"$VIBE_HOME/logs/session/unified\" | wc -l | tr -d ' ' > \"$CONVERSATION_RUN_DIR/pre-agent-runs-turn1.txt\"; grep -rqsF 'Added context for the model: \\\"Advisor:' \"$VIBE_HOME/logs/session/unified\" || { echo context-does-not-lead-with-advisor; exit 1; }; echo \"brief-delivered receipt=$(cat \"$CONVERSATION_RUN_DIR/receipt-turn1.txt\")\""
    },
    {
      "id": "advisor-2",
      "send": "I need to write a README for a brand new skill, where do I start?",
      "check": "sid=$(ls \"$VIBE_HOME/logs/session/unified\" | head -1); h=$(printf '%s' \"$sid\" | shasum -a 256 | cut -c1-16); f=\"$TMPDIR/speckit-advisor/vibe-turn-start/$h.head\"; test -s \"$f\" || { echo head-receipt-missing; exit 1; }; n=$(grep -rohF '\"kind\":\"hook_run_completed\",\"scope\":\"pre_agent\"' \"$VIBE_HOME/logs/session/unified\" | wc -l | tr -d ' '); base=$(tr -d ' ' < \"$CONVERSATION_RUN_DIR/pre-agent-runs-turn1.txt\"); [ \"$n\" -gt \"$base\" ] || { echo pre-agent-hooks-did-not-run-on-turn2 base=$base now=$n; exit 1; }; now=$(stat -f %m \"$f\"); first=$(tr -d ' ' < \"$CONVERSATION_RUN_DIR/receipt-turn1.txt\"); test \"$now\" = \"$first\" && echo \"no-second-brief receipt=unchanged-since-turn1 pre-agent-runs=$base->$n\""
    }
  ]
}
```

Turn 2 sends turn 1's message word for word, because the suppression under test only applies while the route stays the same; a differently worded second message can change the routing and would then prove nothing. The advisor part keeps a per-session head receipt under the operator's temporary folder and rewrites it on every delivery, so the receipt's modification time is the delivery clock: turn 1 records it, and turn 2 requires it unchanged. A count of the brief's text in the journal cannot carry this check, because Vibe rewrites the journal between turns and the copies of one delivered context move and shrink as it does. The first check also reads the journal notice Vibe writes for the injected context, which is what pairs the brief with the hook that added it. The spec gate is switched off for this run, because the scenario judges only the advisor part and no step of it needs a documentation answer. The optional question lets the subject ask which mode of the routed skill applies.

### Expected

Turn `advisor-1` finds the head receipt for the session and a journal notice whose context leads with `Advisor:`, then saves the receipt's modification time. Turn `advisor-2` finds that time unchanged and more completed `pre_agent` hook-run notices than turn 1 left, so the turn-start hook ran on the second turn and injected nothing.

### Evidence

Capture `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt`, plus `setup.log`.

### Pass / Fail

- **Pass**: turn 1 records the brief in the journal with a head receipt, and turn 2 runs the hook again but leaves the receipt untouched.
- **Fail**: turn 1 records no brief, or turn 2 rewrites the receipt.

### Failure Triage

1. Read turns/advisor-2/check.txt and turns/advisor-2/screen.txt.
2. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `turn-start`.
3. Pipe the same `pre_agent` payload twice with one session id into `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs`; a second non-empty context means the receipt, not the binding, is at fault, and a receipt file that does not exist means the advisor part never reached its delivery path.

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
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | The hook under test |
| `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` | The advisor part and its head receipt || `.vibe/hooks.toml` | The hook binding |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-003
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/turn-start-advisor.md`
