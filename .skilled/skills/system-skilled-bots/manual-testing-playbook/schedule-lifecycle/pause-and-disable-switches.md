---
title: "BOT-020 -- Pause and disable stop a bot's runs until lifted"
description: "This scenario validates the run-layer switches for `BOT-020`. It focuses on a paused or disabled bot being refused before dispatch, and a lifted switch letting the next run complete."
version: 1.0.0.0
---

# BOT-020 -- Pause and disable stop a bot's runs until lifted

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BOT-020`.

---

## 1. OVERVIEW

The operator pauses a bot, runs it, resumes it, disables it, runs it again and enables it. Each switch that is set must refuse the run before dispatch with its own cause. Once both are lifted, the next run must complete. The bot has no installed schedule, so `disable` and `enable` must say that only the run-layer switch applies.

### Why This Matters

The switches are the operator's kill switch. They live under the state root, out of the run's reach, and every run reads them before it dispatches.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BOT-020` and confirm the expected signals without contradictory evidence.

- Objective: Prove pause and disable each refuse a run with their own cause, and lifting both lets a run complete.
- Real user request: `Stop my bot from running for now, then let it run again.`
- Prompt: `Stop my bot from running for now, then let it run again.`
- Expected execution process: build the world, pause, run, resume, disable, run, enable, run, count stub receipts, then remove the world.
- Expected signals: `refused before dispatch (paused)` and `refused before dispatch (disabled)`, each with `exit=4`. `disable` and `enable` each print the warning `no installed schedule found for pb-switch`. The last run prints `bots: pb-switch run <run id> completed` with `exit=0`.
- Desired user-visible outcome: the operator stops the bot and starts it again with one command each.
- Pass/fail: PASS if both refusals carry their cause, the final run completes and the stub ran exactly once. FAIL if a switched-off bot dispatches, a refusal names the wrong cause or the lifted bot stays refused.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Stop my bot from running for now, then let it run again.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. The throwaway identity has no launchd job, so `disable` and `enable` only read the scheduler and change nothing in it.

### Commands

Run from the repository root in a POSIX shell.

```bash
# 1. Build a throwaway world: a checkout, a home, a state root and a run tree, all under one temp folder.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-switch" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-switch\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nTidy the notes folder.\n' > "$W/checkout/bots/pb-switch/BOT.md"
# 2. Commit the world (the run binds its result to HEAD) and define two helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "bot world"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,String(r.exit.class),JSON.stringify(r.delivery),String(r.evidence.worktreePath),JSON.stringify(r.evidence.worktree??null)].join(" | "))}' "$W"/state/*/records; }
# 3. Pause, run, resume.
pbots pause pb-switch; echo "exit=$?"
pbots run pb-switch; echo "exit=$?"
pbots resume pb-switch; echo "exit=$?"
# 4. Disable, run, enable, run.
pbots disable pb-switch; echo "exit=$?"
pbots run pb-switch; echo "exit=$?"
pbots enable pb-switch; echo "exit=$?"
pbots run pb-switch; echo "exit=$?"
ls "$W/acct/stub-receipts" | wc -l
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records
```

### Expected

- `bots: pb-switch paused`, then `bots: pb-switch refused before dispatch (paused)` with `exit=4`, then `bots: pb-switch no longer paused`.
- `bots: pb-switch disabled` with the stderr warning `bots: warning: no installed schedule found for pb-switch; only the run-layer switch applies...`.
- `bots: pb-switch refused before dispatch (disabled)` with `exit=4`.
- The same warning, then `bots: pb-switch no longer disabled`.
- `bots: pb-switch run <run id> completed` and `exit=0`.
- The stub receipt count is `1`.

### Evidence

Every command's output with its exit, and the receipt count.

### Pass / Fail

- **Pass**: two refusals with causes `paused` and `disabled`, one completed run and one stub receipt.
- **Fail**: a switched-off run dispatches, a refusal names another cause or the final run is refused.
- **Skip**: only when node or git is unavailable, or the repository path itself contains an executor word, naming that blocker.

### Failure Triage

1. A refusal with the wrong cause: read the switch order in `runtime/lib/runner.ts`. Disable is read before the lease, pause after it.
2. A final refusal: list the `switches` folder under the world's state root for a file the lift did not remove.
3. Read `runtime/lib/switches.ts` for the switch files.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `schedule-lifecycle/pause-and-disable-switches.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | The `pause`, `resume`, `disable` and `enable` verbs |
| `.skilled/skills/system-skilled-bots/runtime/lib/switches.ts` | Sets and clears the switch files |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Reads the switches before dispatch |
| `.skilled/skills/system-skilled-bots/bots-schedule/references/schedule-lifecycle.md` | The schedule mode's lifecycle reference |
| `.skilled/skills/system-skilled-bots/runtime/tests/switches.vitest.ts` | Automated switch coverage |

---

## 5. SOURCE METADATA

- Group: Schedule Lifecycle
- Playbook ID: BOT-020
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `schedule-lifecycle/pause-and-disable-switches.md`
