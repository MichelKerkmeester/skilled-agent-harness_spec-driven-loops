---
title: "BOT-036 -- A cron start fires at the slot computed from the current clock"
description: "This scenario proves that a cron start two minutes from now parses into a summary, installs as a launchd job whose next fire names that slot, fires once at that slot and writes a run record, and that a cron whose shortest period is under 900 seconds is refused `routine-floor-15-minutes`."
version: 1.0.0.0
---

# BOT-036 -- A cron start fires at the slot computed from the current clock

This document is the execution contract for `BOT-036`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator computes a slot two minutes from the current clock, writes a bot whose routine starts at that minute and hour, and reads the parsed summary. The operator installs the schedule, reads the next-fire line, waits for the slot and finds a run record. A second bot whose cron fires every minute is refused because its period is under the floor. The schedule is removed and the world deleted.

### Why This Matters

A cron start that parses but never fires is a routine the operator believes is running. A slot the installer computes differently from the parser is the same failure one layer down. The floor matters because a bot on a one-minute cron spends the operator's quota faster than they can read its output, and the refusal has to arrive before the job is written rather than after the first hundred runs.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a computed cron slot parses, installs, fires once and writes a record, and a sub-floor cron is refused.
- Real user request: `Set my bot to run two minutes from now, wait for it, and show me it actually ran. Then show me why a one-minute schedule is rejected.`
- Prompt: `Set my bot to run two minutes from now, wait for it, and show me it actually ran. Then show me why a one-minute schedule is rejected.`
- Expected execution process: build the world, compute the slot from the clock, write the bot, read the summary, install the schedule, read the next fire, wait for the slot, read the record, try a one-minute cron, then uninstall and clean up.
- Expected signals: the summary names the computed hour and minute, the install prints a next-fire line naming the same slot, one run record exists after the slot, and the one-minute cron exits 4 with `routine-floor-15-minutes`.
- Desired user-visible outcome: the operator sees the slot they asked for, sees it fire and sees the too-frequent schedule rejected.
- Pass/fail: PASS if the summary and the next fire name the computed slot, a record exists after it and the sub-floor cron is refused. FAIL if the summary names another slot, no record appears, the sub-floor cron installs or the job is left behind.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Set my bot to run two minutes from now, wait for it, and show me it actually ran. Then show me why a one-minute schedule is rejected.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Real schedule, real wait.** The schedule verbs use the logged-in account's launchd, so this scenario installs a real job and waits for it. The job's `--repo` points at the throwaway checkout, so the fire writes its record under the throwaway state root and nothing touches the operator's own state. The wait is two minutes plus a poll. Run it on macOS as the logged-in user.

> **Executor at fire time.** The fire runs under launchd's own PATH, so the executor may not resolve and the run may fail. The record is the proof of the fire, not the exit class.

### Commands

Run from the repository root in a POSIX shell on macOS. One block, eight turns.

```bash
# 1. Build a throwaway world with a checkout, a home, a state root and a run tree.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-slot" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
# 2. Compute the slot two minutes from the current clock, on macOS or on GNU date.
SLOT_MIN="$(date -v+2M '+%M' 2>/dev/null || date -d '+2 minutes' '+%M')"
SLOT_HOUR="$(date -v+2M '+%H' 2>/dev/null || date -d '+2 minutes' '+%H')"
CRON="$((10#$SLOT_MIN)) $((10#$SLOT_HOUR)) * * *"
echo "slot: $SLOT_HOUR:$SLOT_MIN  cron: $CRON"
# 3. Write the bot whose routine starts at that slot, then commit it.
printf -- '---\nid: pb-slot\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\nroutine:\n  what: Summarize the commits merged since the last run.\n  starts:\n    - kind: cron\n      expression: "%s"\n  does: act\n---\nSummarize the commits merged since the last run.\n' "$CRON" > "$W/checkout/bots/pb-slot/BOT.md"
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "slot bot"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
sbots() { "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout"; }
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,String(r.exit.class),String(r.dispatch&&r.dispatch.dispatchedAt||null)].join(" | "))}' "$W"/state/*/records; }
# 4. Turn 1: read the parsed start and its summary.
pbots routines --json; echo "exit=$?"
# 5. Turn 2: install the schedule and read the next fire.
OUT="$(sbots schedule install pb-slot)"; RC=$?; echo "$OUT"; echo "exit=$RC"
LABEL="$(printf '%s\n' "$OUT" | sed -n 's/^bots: installed \([^ ,]*\) at .*/\1/p')" && echo "label: $LABEL"
# 6. Turn 3: wait for the slot, then poll for the record.
DEADLINE=$(( (10#$SLOT_HOUR * 60 + 10#$SLOT_MIN) * 60 ))
NOWSEC=$(( (10#$(date '+%H') * 60 + 10#$(date '+%M')) * 60 + 10#$(date '+%S') ))
WAIT=$(( DEADLINE - NOWSEC )); [ "$WAIT" -lt 0 ] && WAIT=$(( WAIT + 86400 ))
echo "waiting ${WAIT}s for the slot"
sleep "$WAIT"
for i in $(seq 1 12); do ls "$W"/state/*/records/*.json >/dev/null 2>&1 && break; sleep 10; done
records
# 7. Turn 4: a cron under the floor is refused.
mkdir -p "$W/checkout/bots/pb-fast"
printf -- '---\nid: pb-fast\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\nroutine:\n  what: Run every minute.\n  starts:\n    - kind: cron\n      expression: "* * * * *"\n  does: act\n---\nRun every minute.\n' > "$W/checkout/bots/pb-fast/BOT.md"
pbots run pb-fast; echo "exit=$?"
sbots schedule install pb-fast; echo "exit=$?"
# 8. Turn 5: remove the schedule, which is mandatory even when a step above failed.
sbots schedule uninstall pb-slot; echo "exit=$?"
ls "$HOME/Library/LaunchAgents/$LABEL.plist" 2>&1
launchctl print "gui/$(id -u)/$LABEL" >/dev/null 2>&1; echo "print exit=$?"
[ -n "$LABEL" ] && [ ! -e "$HOME/Library/LaunchAgents/$LABEL.plist" ] && launchctl enable "gui/$(id -u)/$LABEL"
launchctl print-disabled "gui/$(id -u)" | grep -c "$LABEL"
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots sbots records
```

### Turn 1 -- the parsed start names the computed slot

- Expected: one JSON row whose `starts` entry carries the parsed trigger and a `summary` naming the computed hour and minute, such as `daily 14:07`.
- Expected: `exit=0`.

### Turn 2 -- the install names the same slot

- Expected: step lines for the transaction, then `bots: installed com.skilled.bots.<...> at <plist path>`, `bots: next fire: <the computed slot>`, `bots: check: ...` and `exit=0`.
- Expected: the next-fire line names the same hour and minute the summary named.

### Turn 3 -- the slot fires and writes a record

- Expected: `waiting <n>s for the slot`, then one record line whose `botId` reads `pb-slot`.
- Expected: the record's `dispatchedAt` falls inside the computed minute.

### Turn 4 -- a one-minute cron is refused

- Expected: `bots: routine-floor-15-minutes` and `exit=4` on the run, and the same refusal on the install.
- Expected: no plist is written for `pb-fast`.

### Turn 5 -- the schedule is gone

- Expected: `bots: uninstalled ...` and `exit=0`, then `ls` reporting no such file, `print exit=1` and a `grep -c` of `0`.

### Expected

- A summary naming the computed hour and minute.
- A next-fire line naming the same slot.
- One record for `pb-slot` after the slot.
- `bots: routine-floor-15-minutes` and `exit=4` for the one-minute cron.
- No plist and no disabled override left behind.

### Evidence

The computed slot line, the JSON row, the whole install output with its exit, the wait line, the record line, both floor refusals with their exits, the uninstall output and the three cleanup checks.

### Pass / Fail

- **Pass**: the summary and the next fire name the computed slot, a record exists after it and the sub-floor cron is refused on both verbs.
- **Fail**: the summary names another slot, no record appears, the sub-floor cron installs or the job is left behind.
- **Skip**: only when `node` or `git` is unavailable, when `launchctl` is missing because the host is not macOS, or when the `schedule` verb is missing from the CLI's verb table, naming the missing piece and phase 002 as the blocker.

### Failure Triage

1. `bots: unknown verb: routines`: phase 002 has not landed. Read the verb table in `.skilled/bin/bots.cjs`.
2. The summary names another slot: the parser reads the expression in another timezone. Read the cron parser and confirm it uses local time.
3. The install refuses `routine-floor-15-minutes` for a daily cron: the period is computed from the wrong field. Read the period calculation.
4. No record after the slot: the job did not fire. Read `launchctl print` for the label and the plist's `StartCalendarInterval`.
5. The record exists but its `dispatchedAt` is outside the minute: the job fired late because the machine was asleep. Read the slot snapshot and confirm the skip is recorded rather than caught up.
6. The plist survives the uninstall: read the uninstall branch and confirm it removes the file before it clears the override.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `routines/cron-start-fires-at-computed-slot.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | Owns the routines and schedule verbs |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/routine.ts` | Parses the start and renders the summary |
| `.skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts` | Computes the slot and records a skip |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/schedule.ts` | Writes and removes the launchd job |

The cron start and its render are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:165]. The floor and the skipped slot are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:169].

---

## 5. SOURCE METADATA

- Group: Routines
- Playbook ID: BOT-036
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `routines/cron-start-fires-at-computed-slot.md`
