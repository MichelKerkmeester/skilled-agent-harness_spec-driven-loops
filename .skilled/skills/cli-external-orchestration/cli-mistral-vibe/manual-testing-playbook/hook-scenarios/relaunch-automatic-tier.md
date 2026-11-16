---
title: "VIB-HK-027 -- The automatic relaunch tier nudges, ends and relaunches a Vibe session"
description: "This scenario validates the Vibe automatic relaunch tier: a session past its measured threshold writes a handoff note, the turn end arms the record, the killer ends Vibe and the wrapper relaunches it on the claim seed."
version: 1.0.2.0
---

# VIB-HK-027 -- The automatic relaunch tier nudges, ends and relaunches a Vibe session

This document captures the operator contract for `VIB-HK-027`.

---

## 1. OVERVIEW

This scenario covers the automatic relaunch tier Vibe shares with Claude Code, Pi, OpenCode and Codex. The turn-start part measures the session's journal and nudges once the measured `input_tokens` pass the threshold share of Vibe's own `compaction_threshold`. The `post_agent` turn-end part arms the prepared record and starts the killer. Vibe exits 0 on SIGTERM, and the wrapper relaunches `vibe` on the claim seed, which the next turn start expands into the claim instructions.

### Why This Matters

A hop is invisible in a reply. The nudge, the arm and the relaunch are hook events, so a session that armed and hopped looks the same as one that kept working. The relaunch log is the only record that separates them. An operator reads `prepare`, `killer-signal` and `relaunch reason=ready` there, then reads the note's own status to prove the receiver finished. An operator prompt typed after the arm withdraws the hop, and a hand-typed `/speckit-handoff` arms and hops too, because the turn-start part records the payload's session id and `prepare` uses it.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and follow procedure.md from an operator terminal.

- Objective: verify that a Vibe session past its measured threshold writes a handoff note, arms the record at the turn end, ends on the killer's SIGTERM and relaunches on the claim seed, where the receiver claims and completes the note.
- Real user request: `Carry this short task through a context handoff, then finish it in the new session. Start by reading README.md and reporting its first heading. Gate 3: D) Skip, no spec folder.`
- Prompt: `Carry this short task through a context handoff, then finish it in the new session. Start by reading README.md and reporting its first heading. Gate 3: D) Skip, no spec folder.`
- Expected execution process: the operator runs `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1 SESSION_HANDOVER_THRESHOLD=0.05 SESSION_HANDOVER_WINDOW_TOKENS=100 SESSION_HANDOVER_MAX_HOPS=1 bash .skilled/bin/skilled-loop vibe --trust --agent auto-approve "<task>"` from the repository root, the turn-start or post-tool part nudges, the session writes the note and runs `prepare --runtime vibe`, the turn end arms the record and starts the killer, Vibe exits 0, and the wrapper relaunches `vibe` with the claim seed.
- Expected signals: the relaunch log holds `prepare loopId=<id> status=pending`, `killer-signal targetPid=<pid> signal=SIGTERM` and `relaunch loopId=<id> reason=ready`, the handoff note ends at `status: done`, and the hop history shows `handed-over`, `claimed` and `done` for that note.
- Desired user-visible outcome: the fresh session continues the task and reports the README heading in the same terminal.
- Pass/fail: PASS when the three log lines appear and the note ends done. FAIL when the record stays pending or either the `killer-signal` or the `relaunch reason=ready` line is missing. The shared runner reports SKIP with the named blocker, because it cannot run the wrapper and starts its subject in a scratch project that holds no relaunch CLI. The operator procedure carries the manual steps.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Carry this short task through a context handoff, then finish it in the new session. Start by reading README.md and reporting its first heading. Gate 3: D) Skip, no spec folder.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-027 | Automatic relaunch tier | Nudge, end and relaunch a Vibe session, then claim and finish the note there | `Carry this short task through a context handoff, then finish it in the new session. Start by reading README.md and reporting its first heading. Gate 3: D) Skip, no spec folder.` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/relaunch-automatic-tier.md --runtime vibe --scratch "$(mktemp -d)" --out /tmp/vib-hk-027` | `prepare loopId=<id> status=pending`, `killer-signal targetPid=<pid> signal=SIGTERM` and `relaunch loopId=<id> reason=ready` in the relaunch log, plus a note at `status: done` | matrix.md, checkpoints.tsv, the preflight turn's screen.txt and check.txt, and procedure.md with the relaunch log and hop history lines | PASS when the three log lines appear and the note ends done. FAIL when the record stays pending or a log line is missing. SKIP with the named blocker when the runner cannot drive the hop. | 1. Read the preflight turn's check.txt for the two probes it prints. 2. Follow procedure.md from an operator terminal. 3. Run `node .skilled/hooks/session-handover/bin/session-handover.cjs history --last 3` and read the note status under `.skilled/skills/.state/session-handover/handoffs/`. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "setup": [
    "printf 'The automatic relaunch hop needs the operator terminal.\\n' > README.txt"
  ],
  "env": {
    "SYSTEM_SPEC_GATE_DISABLED": "1"
  },
  "turns": [
    {
      "id": "preflight",
      "check": "echo 'the automatic relaunch tier needs skilled-loop vibe and the terminal it owns across the hop; the runner cannot run the wrapper and starts its subject in a scratch project with no relaunch CLI'; if [ -d .skilled/hooks/session-handover ]; then echo relaunch-cli-in-project; else echo no-relaunch-cli-in-project; fi; if [ -f \"$CONVERSATION_REPO_ROOT/.skilled/hooks/session-handover/vibe/handover-parts.mjs\" ]; then echo automatic-tier-present; else echo automatic-tier-missing; fi; exit 77"
    }
  ]
}
```

The preflight turn measures the two facts that keep this hop out of the runner: the scratch project holds no relaunch CLI, and the automatic part lives in the repository rather than in a scratch subject. The hop itself starts with `skilled-loop vibe`, which owns the terminal across the sender's exit and the fresh session's launch, so the operator runs it from the repository root as procedure.md records.

### Expected

Turn `preflight` reports SKIP with the blocker sentence above and prints both probe results: no relaunch CLI in the scratch project and `automatic-tier-present`. The operator procedure then runs the hop and records the three relaunch log lines, the hop history and the note status.

### Evidence

Capture matrix.md, checkpoints.tsv, the preflight turn's screen.txt and check.txt, plus procedure.md, the relaunch log and the hop history.

### Pass / Fail

- **Pass**: the relaunch log holds `prepare loopId=<id> status=pending`, `killer-signal targetPid=<pid> signal=SIGTERM` and `relaunch loopId=<id> reason=ready`, the hop history shows `handed-over`, `claimed` and `done` for the note, and the note's frontmatter reads `status: done`.
- **Fail**: the record stays pending after the turn end, the killer never signals Vibe, the wrapper declines the relaunch, or the receiver never claims the note.
- **Skip**: the runner cannot drive the hop, because it cannot run the wrapper and starts a subject in a scratch project without the relaunch CLI. The blocker names that limit and procedure.md carries the manual steps.

### Failure Triage

1. Read turns/preflight/check.txt for the two probes.
2. Read the relaunch log for `stop-arm-error`, `missing-transcript-path` and `killer-no-armed-record` when the record stays pending.
3. Compare the note path the nudge printed with the record's `handoff` field.
4. Read the note's frontmatter for `status`, then run the claim command by hand when the receiver never claims it.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
| [`guards-and-hooks.md`](../../references/guards-and-hooks.md) | Vibe hook and plugin classification |
| [`relaunch-manual-tier.md`](relaunch-manual-tier.md) | The manual fallback beside this automatic tier |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/hooks/session-handover/vibe/handover-parts.mjs` | The turn-start nudge, seed expansion, withdraw and turn-end arm |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | The one `pre_agent` entry that composes the turn-start parts |
| `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs` | The one `post_agent` entry that runs the hand-over part last |
| `.skilled/hooks/session-handover/lib/context-usage.cjs` | `readVibeUsage` and `resolveVibeWindow` |
| `.skilled/hooks/session-handover/lib/killer.cjs` | The killer that signals the Vibe process |
| `.skilled/bin/skilled-loop` | The wrapper that relaunches `vibe` on the claim seed |
| `.vibe/hooks.toml` | The hook bindings a Vibe session runs |
| `.skilled/hooks/session-handover/tests/vibe-adapters.test.cjs` | The adapter suite |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-027
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/relaunch-automatic-tier.md`
