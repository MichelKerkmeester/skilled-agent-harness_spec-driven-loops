---
title: "VIB-HK-026 -- The manual relaunch tier hands off and a fresh session claims it"
description: "This scenario validates the Vibe manual relaunch tier: a sender prepares a handoff note, the operator ends the session, and a fresh Vibe session started from the printed claim seed claims the note."
version: 1.0.7.0
---

# VIB-HK-026 -- The manual relaunch tier hands off and a fresh session claims it

This document captures the operator contract for `VIB-HK-026`.

---

## 1. OVERVIEW

This scenario covers the manual relaunch tier, the route a Vibe session takes when it runs outside `skilled-loop`. The sender writes a handoff note and prepares it, `prepare` prints the claim command because no loop will arm the record, the operator exits the session and runs that command, and the fresh Vibe session started from the seed claims the note and continues its remaining work. The automatic tier covers the nudge, the arm and the relaunch in `VIB-HK-027`, and a typed `/speckit-handoff` inside the loop takes that automatic route.

### Why This Matters

Vibe exports no session id to its tools. A session under `skilled-loop` records the payload id at turn start, so a typed `/speckit-handoff` prepares under that id and the turn end arms it, and the hop runs on the automatic tier. A Vibe session outside the loop has no recorded id, so the handoff command falls back to `uuidgen`, `prepare` writes no record and prints the claim command: the operator runs it, and the new session claims the note from the seed. With the switch off no nudge fires and prepare refuses, so this route needs the switch on. A broken claim leaves the note open and the sender's work stranded, and nothing in a session's reply proves which of the two happened.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the journal evidence.

- Objective: verify that the manual relaunch tier prepares a handoff and that a fresh Vibe session claims it.
- Real user request: `Hand this session's work to a fresh session, then claim the handoff there and continue it.`
- Prompt: `Hand this session's work to a fresh session, then claim the handoff there and continue it.`
- Expected execution process: the operator exports `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1`, because session handover is default-on for Claude Code only, and starts Vibe outside `skilled-loop`, for example as `command vibe --trust` in a shell that sources the shim. The sender follows `.skilled/commands/speckit/handoff.md`, which the operator names in words because Vibe has no command loader. Its `prepare --runtime vibe` exits 3, reports `STATUS=OK RESULT=manual`, and prints one claim command in the plain form, so the operator adds `--trust` when running it. The operator exits the session and runs the command, so a fresh Vibe session starts from the claim seed under `skilled-loop`. For the goal check the operator also exports `VIBE_SPEC_FOLDER` naming a packet that holds a `goal.md` before the sender starts, and unsets it before running the claim command.
- Expected signals: the note's frontmatter reads `status: claimed` with a `claimed_by` session id, the hop history holds one `claimed` line whose runtime column is `vibe`, and the fresh session's first turn carries the claim's output. With a packet bound, the note also carries `goal_packet`, and the fresh session's first input holds that packet's goal slice as hook context although its shell has no `VIBE_SPEC_FOLDER`.
- Desired user-visible outcome: the fresh session reads the note, names its remaining work and continues it.
- Pass/fail: PASS when the note reads claimed and the fresh session's first turn shows the claim. FAIL when the note stays open or the new session never claims it. The shared runner reports SKIP with the named blocker, because it cannot run the wrapper, cannot type a per-run absolute seed, and starts its subject in a scratch project that holds no relaunch CLI; the operator procedure carries the manual steps.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Hand this session's work to a fresh session, then claim the handoff there and continue it.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-026 | Manual relaunch tier | Prepare a handoff in one Vibe session and claim it in a fresh one | `Hand this session's work to a fresh session, then claim the handoff there and continue it.` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/relaunch-manual-tier.md --runtime vibe --scratch "$(mktemp -d)" --out /tmp/vib-hk-026` | A note whose frontmatter reads `status: claimed` with `claimed_by`, a `claimed` line in the relaunch history with runtime `vibe`, and the fresh session's first turn carrying the claim output | matrix.md, checkpoints.tsv, each turn's screen.txt and check.txt, and procedure.md | PASS when the note reads claimed and the fresh session's first turn shows the claim. FAIL when the note stays open. SKIP with the named blocker when the runner cannot drive the hop. | 1. Read the preflight turn's check.txt for the two probes it prints. 2. Follow procedure.md from an operator terminal. 3. Run `node .skilled/hooks/session-handover/bin/session-handover.cjs history` and read the `claimed` line. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "setup": [
    "printf 'The relaunch hop needs the operator terminal.\\n' > README.txt"
  ],
  "env": {
    "SYSTEM_SPEC_GATE_DISABLED": "1"
  },
  "turns": [
    {
      "id": "preflight",
      "check": "echo 'the manual relaunch tier needs skilled-loop vibe and a claim seed carrying this run absolute note path; the runner cannot run the wrapper, cannot type a per-run path, and starts its subject in a scratch project with no relaunch CLI'; if [ -d .skilled/hooks/session-handover ]; then echo relaunch-cli-in-project; else echo no-relaunch-cli-in-project; fi; if [ -f \"$CONVERSATION_REPO_ROOT/.skilled/hooks/session-handover/vibe/handover-parts.mjs\" ]; then echo automatic-tier-present; else echo automatic-tier-missing; fi; exit 77"
    }
  ]
}
```

The preflight turn measures the two facts that keep this hop out of the runner: the scratch project holds no relaunch CLI, and the automatic part lives in the repository, so a scratch subject that starts without it never arms the record. That keeps the receiver on the claim command the seed names through its absolute path. The fresh session starts from that command, which runs `skilled-loop vibe` and owns the terminal across the launch, so the operator runs it from the repository root as procedure.md records.

### Expected

Turn `preflight` reports SKIP with the blocker sentence above and prints both probe results: no relaunch CLI in the scratch project and `automatic-tier-present`. The operator procedure then runs the hop and records the note's claimed state and the fresh session's first turn.

### Evidence

Capture matrix.md, checkpoints.tsv, the preflight turn's screen.txt and check.txt, plus procedure.md and the operator's recorded hop.

### Pass / Fail

- **Pass**: the note's frontmatter reads `status: claimed` with a `claimed_by` session, the relaunch history holds one `claimed` line for runtime `vibe`, and the fresh session's first turn shows the claim's output. With a packet bound, the note carries `goal_packet` and the fresh session starts with that packet's goal slice.
- **Fail**: the note stays open after the fresh session's first turn, or the claim fails in that session. With a packet bound, the note carries no `goal_packet`, or the fresh session starts without the goal slice.
- **Skip**: the runner cannot drive the hop, because it cannot run the wrapper, cannot type the per-run absolute seed, and starts a subject in a scratch project without the relaunch CLI; the blocker names the first of those and procedure.md carries the manual steps.

### Failure Triage

1. Read turns/preflight/check.txt for the two probes.
2. Compare the seed `prepare` printed with the note path under `.skilled/skills/.state/session-handover/handoffs/`.
3. Run the claim command by hand and read whether the note's frontmatter flips to `claimed`.
4. With a packet bound and no `goal_packet` in the note, run `prepare` again with `VIBE_SPEC_FOLDER` set and read the `[session-handover] goal not carried:` line, if any; a note with the field but a receiver without the goal points at `.skilled/hooks/goal/vibe/goal-inject.mjs`.

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
| `.skilled/hooks/session-handover/lib/nudge.cjs` | The claim-seed and claim-command builders |
| `.skilled/hooks/session-handover/bin/session-handover.cjs` | The prepare, claim and history subcommands |
| `.skilled/hooks/session-handover/lib/relaunch-core.cjs` | Resolves the packet a Vibe sender's note carries |
| `.skilled/hooks/goal/vibe/goal-inject.mjs` | Renders the receiver's goal slice from the claimed packet |
| `.skilled/bin/skilled-loop` | The wrapper the printed claim command runs, which starts the fresh Vibe session on the claim seed |
| `.vibe/hooks.toml` | The hook bindings a Vibe session runs |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-026
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/relaunch-manual-tier.md`
