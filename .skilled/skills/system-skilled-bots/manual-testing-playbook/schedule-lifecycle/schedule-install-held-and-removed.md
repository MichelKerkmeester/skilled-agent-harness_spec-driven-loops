---
title: "BOT-021 -- A schedule installs held disabled and uninstalls cleanly"
description: "This scenario validates the launchd installer for `BOT-021`. It focuses on a first install landing a linted job file that is held disabled, showing in status, and being removed by uninstall."
version: 1.0.0.0
---

# BOT-021 -- A schedule installs held disabled and uninstalls cleanly

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BOT-021`.

---

## 1. OVERVIEW

The operator installs a weekday cron bot's schedule from a throwaway checkout. The installer must write a valid job file into `~/Library/LaunchAgents`, hold it disabled so nothing fires and say so. Status must list the bot. Uninstall must remove the job file and unload the label, and the scenario ends with that removal.

### Why This Matters

A schedule is the moment an unattended agent gains a trigger. A first install that fired before the operator enabled it, or an uninstall that left a job behind, would run a bot nobody asked for.

> **Destructive step.** This scenario writes into the account's real `~/Library/LaunchAgents` and the user launchd domain. Never run `bots enable` here: a fired job starts with launchd's bare PATH, not the test executor, and could reach a real executor. The removal block in step 4 is mandatory and must run even when an earlier step failed.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BOT-021` and confirm the expected signals without contradictory evidence.

- Objective: Prove a first install is linted, held disabled and visible in status, and that uninstall leaves no job file and no loaded label.
- Real user request: `Put my bot on a weekday schedule, but do not let it fire yet. Then take the schedule off again.`
- Prompt: `Put my bot on a weekday schedule, but do not let it fire yet. Then take the schedule off again.`
- Expected execution process: build the world with a cron bot, install the schedule, inspect the job file and the scheduler's disabled list, read status, uninstall, prove the job is gone, then remove the world.
- Expected signals: install exits 0 and prints `bots: installed <label> at <plist path>`, `bots: held disabled (...); nothing fires until: bots enable pb-weekday` and `bots: next fire: ...`. The label starts with `com.skilled.bots.`. Uninstall exits 0 and prints `bots: removed <label>`.
- Desired user-visible outcome: the operator sees the schedule is in place but off, and then sees it gone.
- Pass/fail: PASS if every install signal appears, the job file lints, the label is disabled, status lists the bot and after uninstall the file is gone and `launchctl print` fails for the label. FAIL if the install loads the job enabled, the file fails lint, or anything of the job remains after uninstall.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Put my bot on a weekday schedule, but do not let it fire yet. Then take the schedule off again.`

The install never dispatches a run, so no executor starts. Keep executor words out of the bot id and temp paths anyway, because the job file records the command a fire would run.

### Commands

Run from the repository root in a POSIX shell on macOS, as the logged-in user.

```bash
# 1. Build a throwaway world: a checkout, a home, a state root and a run tree, all under one temp folder.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-weekday" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-weekday\ntrigger: {kind: cron, expression: "0 9 * * 1-5"}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nSummarize the commits merged since the last run.\n' > "$W/checkout/bots/pb-weekday/BOT.md"
# 2. Commit the world (the run binds its result to HEAD) and define two helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "bot world"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,String(r.exit.class),JSON.stringify(r.delivery),String(r.evidence.worktreePath),JSON.stringify(r.evidence.worktree??null)].join(" | "))}' "$W"/state/*/records; }
# The schedule verbs use the real account and the real run tree, so they get their own helper.
sbots() { "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout"; }
# 3. Install, then inspect the job file, the disabled list and status.
OUT="$(sbots schedule install pb-weekday)"; RC=$?; echo "$OUT"; echo "exit=$RC"
LABEL="$(printf '%s\n' "$OUT" | sed -n 's/^bots: installed \([^ ,]*\) at .*/\1/p')"; echo "label: $LABEL"
plutil -lint "$HOME/Library/LaunchAgents/$LABEL.plist"
plutil -p "$HOME/Library/LaunchAgents/$LABEL.plist" | grep -A12 ProgramArguments
launchctl print-disabled "gui/$(id -u)" | grep "$LABEL"
sbots status; echo "exit=$?"
# 4. Removal (mandatory, run it even when a step above failed).
sbots schedule uninstall pb-weekday; echo "exit=$?"
ls "$HOME/Library/LaunchAgents/$LABEL.plist" 2>&1
launchctl print "gui/$(id -u)/$LABEL" >/dev/null 2>&1; echo "print exit=$?"
# Uninstall leaves the label's disabled override behind. With the job file gone, clear it so no residue stays.
[ -n "$LABEL" ] && [ ! -e "$HOME/Library/LaunchAgents/$LABEL.plist" ] && launchctl enable "gui/$(id -u)/$LABEL"
launchctl print-disabled "gui/$(id -u)" | grep -c "$LABEL"
unset -f sbots
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records
```

### Expected

- Install: step lines for the transaction, then `bots: installed com.skilled.bots.<...> at <plist path>`, `bots: held disabled (...); nothing fires until: bots enable pb-weekday`, `bots: next fire: ...`, `bots: check: ...` and `exit=0`.
- `plutil -lint` prints `OK`.
- `ProgramArguments` holds an absolute node path, the absolute `bots.cjs` path, `run`, `pb-weekday`, `--schedule-index` and `--repo` with the world's checkout.
- The disabled list shows the label as disabled (`=> disabled` or `=> true`, depending on the macOS version).
- Status prints a row for `pb-weekday` with `no run` and `exit=0`.
- Uninstall: `bots: removed <label>`, `bots: run folders and run records were left in place` and `exit=0`. A line that the label stays in the disabled list is allowed.
- `ls` reports no such file, and `print exit=` is non-zero.
- After the override is cleared, the `grep -c` count is `0`. A rerun of this scenario installs cleanly either way, because a disabled label with no install record is treated as a first install.

### Evidence

The install output and label, the lint result, the `ProgramArguments` excerpt, the disabled-list line, the status output, the uninstall output, the `ls` result and the `print exit=` value.

### Pass / Fail

- **Pass**: a held, linted install visible in status, then no job file and no loaded label after uninstall.
- **Fail**: the install reports enabled, lint fails, the label is missing from the disabled list, or the job file or loaded label remains after uninstall.
- **Skip**: only when the machine is not macOS or has no user launchd domain, so `launchctl` is unavailable, naming that blocker. A SKIP still runs the removal block if an install happened.

### Failure Triage

1. Install exits 4: the preflight names its refusal, such as `job-env-diverges` or `state-home-changed`. Read the preflight in `runtime/lib/installer.ts`.
2. A label not held disabled: stop and run the removal block at once, then read the hold step in `runtime/lib/installer.ts`.
3. A job file left after uninstall: remove it with `launchctl bootout "gui/$(id -u)/$LABEL"` and `rm` of the file, then read `uninstallSchedule`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `schedule-lifecycle/schedule-install-held-and-removed.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/installer.ts` | Preflight, install transaction, hold and uninstall |
| `.skilled/skills/system-skilled-bots/runtime/lib/plist-render.ts` | Renders the job file |
| `.skilled/skills/system-skilled-bots/runtime/lib/label.ts` | The label grammar |
| `.skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts` | Turns the cron expression into calendar entries |
| `.skilled/skills/system-skilled-bots/bots-schedule/references/schedule-lifecycle.md` | The schedule mode's lifecycle reference |
| `.skilled/skills/system-skilled-bots/runtime/tests/installer.vitest.ts` | Automated installer coverage |

---

## 5. SOURCE METADATA

- Group: Schedule Lifecycle
- Playbook ID: BOT-021
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `schedule-lifecycle/schedule-install-held-and-removed.md`
