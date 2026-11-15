---
title: "VIB-HK-026 -- The manual relaunch tier hands off and a fresh session claims it"
description: "This scenario validates the Vibe manual relaunch tier: a sender prepares a handoff note, the operator ends the session, and a fresh Vibe session started from the wrapper's claim seed claims the note."
version: 1.0.2.0
---

# VIB-HK-026 -- The manual relaunch tier hands off and a fresh session claims it

This document captures the operator contract for `VIB-HK-026`.

---

## 1. OVERVIEW

This scenario covers the command-only relaunch tier Vibe shares with Cursor and Devin: the sender writes a handoff note and prepares it, the operator exits the session, `skilled-loop vibe` consumes the pending record and prints the claim command, and the fresh Vibe session started from that seed claims the note and continues its remaining work.

### Why This Matters

Vibe arms no hook that ends a session and no hook that expands a claim seed, so the hop is the operator's: the wrapper prints a command, the operator runs it, and the new session claims the note from the seed. A broken claim leaves the note open and the sender's work stranded, and nothing in a session's reply proves which of the two happened.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the journal evidence.

- Objective: verify that the manual relaunch tier prepares a handoff and that a fresh Vibe session claims it.
- Real user request: `Hand this session's work to a fresh session, then claim the handoff there and continue it.`
- Prompt: `Hand this session's work to a fresh session, then claim the handoff there and continue it.`
- Expected execution process: the operator's terminal runs `skilled-loop vibe`, the sender runs `/speckit-handoff` and `prepare --runtime vibe`, the operator exits the session, the wrapper consumes the pending record and prints one claim command, and the operator runs it so a fresh Vibe session starts with the claim seed.
- Expected signals: the note's frontmatter reads `status: claimed` with a `claimed_by` session id, the hop history holds one `claimed` line whose runtime column is `vibe`, and the fresh session's first turn carries the claim's output.
- Desired user-visible outcome: the fresh session reads the note, names its remaining work and continues it.
- Pass/fail: PASS when the note reads claimed and the fresh session's first turn shows the claim. FAIL when the note stays open or the new session never claims it. The shared runner reports SKIP with the named blocker, because it cannot run the wrapper, cannot type a per-run absolute seed, and starts its subject in a scratch project that holds no relaunch CLI; the operator procedure carries the manual steps.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Hand this session's work to a fresh session, then claim the handoff there and continue it.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-026 | Manual relaunch tier | Prepare a handoff in one Vibe session and claim it in a fresh one | `Hand this session's work to a fresh session, then claim the handoff there and continue it.` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/relaunch-manual-tier-conversation.md --runtime vibe --scratch "$(mktemp -d)" --out /tmp/vib-hk-026` | A note whose frontmatter reads `status: claimed` with `claimed_by`, a `claimed` line in the relaunch history with runtime `vibe`, and the fresh session's first turn carrying the claim output | matrix.md, checkpoints.tsv, each turn's screen.txt and check.txt, and procedure.md | PASS when the note reads claimed and the fresh session's first turn shows the claim. FAIL when the note stays open. SKIP with the named blocker when the runner cannot drive the hop. | 1. Read the preflight turn's check.txt for the two probes it prints. 2. Follow procedure.md from an operator terminal. 3. Run `node .skilled/hooks/session-handover/bin/session-handover.cjs history` and read the `claimed` line. |

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
      "check": "echo 'the manual relaunch tier needs skilled-loop vibe and a claim seed carrying this run absolute note path; the runner cannot run the wrapper, cannot type a per-run path, and starts its subject in a scratch project with no relaunch CLI'; if [ -d .skilled/hooks/session-handover ]; then echo relaunch-cli-in-project; else echo no-relaunch-cli-in-project; fi; if grep -rqs 'claim and continue handoff' \"$CONVERSATION_REPO_ROOT/.skilled/hooks/session-lifecycle/vibe\"; then echo claim-seed-part-present; else echo no-vibe-claim-seed-part; fi; exit 77"
    }
  ]
}
```

The preflight turn measures the two facts that keep this hop out of the runner: the scratch project holds no relaunch CLI, and no Vibe hook expands a claim seed, so the receiver must run the claim command the seed names through its absolute path. The hop itself starts with `skilled-loop vibe`, which owns the terminal across the sender's exit and the fresh session's launch, so the operator runs it from the repository root as procedure.md records.

### Expected

Turn `preflight` reports SKIP with the blocker sentence above and prints both probe results: no relaunch CLI in the scratch project and no Vibe claim-seed part. The operator procedure then runs the hop and records the note's claimed state and the fresh session's first turn.

### Evidence

Capture matrix.md, checkpoints.tsv, the preflight turn's screen.txt and check.txt, plus procedure.md and the operator's recorded hop.

### Pass / Fail

- **Pass**: the note's frontmatter reads `status: claimed` with a `claimed_by` session, the relaunch history holds one `claimed` line for runtime `vibe`, and the fresh session's first turn shows the claim's output.
- **Fail**: the note stays open after the fresh session's first turn, or the claim fails in that session.
- **Skip**: the runner cannot drive the hop, because it cannot run the wrapper, cannot type the per-run absolute seed, and starts a subject in a scratch project without the relaunch CLI; the blocker names the first of those and procedure.md carries the manual steps.

### Failure Triage

1. Read turns/preflight/check.txt for the two probes.
2. Compare the seed the wrapper printed with the note path under `.skilled/skills/.state/session-handover/handoffs/`.
3. Run the claim command by hand and read whether the note's frontmatter flips to `claimed`.

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
| `.skilled/bin/skilled-loop` | The wrapper that consumes the record and starts the fresh Vibe session |
| `.vibe/hooks.toml` | The hook bindings a Vibe session runs |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-026
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/relaunch-manual-tier-conversation.md`
