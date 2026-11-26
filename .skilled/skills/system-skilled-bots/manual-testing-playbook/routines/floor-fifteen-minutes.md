---
title: "BOT-038 -- A cron under fifteen minutes is refused by the run and by the install"
description: "This scenario proves that a cron start whose shortest period is under 900 seconds is refused `routine-floor-15-minutes` by the run verb and by the schedule installer, that a fifteen-minute cron is accepted, and that a fourteen-minute cron is refused."
version: 1.0.0.0
---

# BOT-038 -- A cron under fifteen minutes is refused by the run and by the install

This document is the execution contract for `BOT-038`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator writes three bots whose cron starts fire every five, fourteen and fifteen minutes. The five-minute and fourteen-minute bots are refused by the run verb and by the installer. The fifteen-minute bot is accepted by both. The routines list holds only the accepted bot.

### Why This Matters

A bot on a five-minute cron spends the operator's quota faster than they can read its output, and the refusal has to arrive before the job is written rather than after the first hundred runs. The boundary matters in both directions: a floor that refuses fifteen minutes is a floor nobody can meet, and a floor that accepts fourteen is not the floor the docs name.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the 900-second floor refuses five and fourteen minutes on both verbs and accepts fifteen.
- Real user request: `Show me the shortest schedule my bot is allowed to have, and that anything faster is rejected before it is installed.`
- Prompt: `Show me the shortest schedule my bot is allowed to have, and that anything faster is rejected before it is installed.`
- Expected execution process: build the world with three cron bots, run each, install each, then read the routines list.
- Expected signals: the five-minute and fourteen-minute bots exit 4 with `routine-floor-15-minutes` on both verbs, the fifteen-minute bot exits 0 on both, and the list holds one row.
- Desired user-visible outcome: the operator sees the floor enforced at the same boundary by both verbs.
- Pass/fail: PASS if both fast bots are refused by both verbs and the fifteen-minute bot is accepted by both. FAIL if a fast bot is accepted, the fifteen-minute bot is refused or the two verbs disagree.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show me the shortest schedule my bot is allowed to have, and that anything faster is rejected before it is installed.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. Every bot here is refused or installed before a run is dispatched, so no executor starts.

> **Real schedule, real cleanup.** The install verbs use the logged-in account's launchd. Only the fifteen-minute bot installs, and the uninstall is mandatory even when a step above failed.

### Commands

Run from the repository root in a POSIX shell on macOS. One block, six turns.

```bash
# 1. Build a throwaway world with three cron bots.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
for pair in pb-five:*/5 pb-fourteen:*/14 pb-fifteen:*/15; do
  id="${pair%%:*}"; expr="${pair#*:}"
  mkdir -p "$W/checkout/bots/$id"
  printf -- '---\nid: %s\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\nroutine:\n  what: Run on a %s minute cron.\n  starts:\n    - kind: cron\n      expression: "%s * * * *"\n  does: act\n---\nRun on a %s minute cron.\n' "$id" "$expr" "$expr" "$expr" > "$W/checkout/bots/$id/BOT.md"
done
# 2. Commit the world and define two helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "cron bots"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
sbots() { "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout"; }
# 3. Turn 1: the five-minute bot is refused by the run verb.
pbots run pb-five; echo "exit=$?"
# 4. Turn 2: the fourteen-minute bot is refused by the run verb.
pbots run pb-fourteen; echo "exit=$?"
# 5. Turn 3: the fifteen-minute bot is accepted by the run verb.
pbots run pb-fifteen; echo "exit=$?"
# 6. Turn 4: the installer refuses the same two and accepts the third.
sbots schedule install pb-five; echo "exit=$?"
sbots schedule install pb-fourteen; echo "exit=$?"
OUT="$(sbots schedule install pb-fifteen)"; RC=$?; echo "$OUT"; echo "exit=$RC"
LABEL="$(printf '%s\n' "$OUT" | sed -n 's/^bots: installed \([^ ,]*\) at .*/\1/p')" && echo "label: $LABEL"
# 7. Turn 5: the list holds only the accepted bot.
pbots routines --json; echo "exit=$?"
# 8. Turn 6: remove the schedule, which is mandatory even when a step above failed.
sbots schedule uninstall pb-fifteen; echo "exit=$?"
ls "$HOME/Library/LaunchAgents/$LABEL.plist" 2>&1
[ -n "$LABEL" ] && [ ! -e "$HOME/Library/LaunchAgents/$LABEL.plist" ] && launchctl enable "gui/$(id -u)/$LABEL"
launchctl print-disabled "gui/$(id -u)" | grep -c "$LABEL"
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots sbots
```

### Turn 1 and turn 2 -- the fast bots are refused

- Expected: `bots: routine-floor-15-minutes` and `exit=4` on each, with no run record written.

### Turn 3 -- the fifteen-minute bot is accepted

- Expected: `bots: pb-fifteen run <run id> completed` and `exit=0`.

### Turn 4 -- the installer agrees at the same boundary

- Expected: `bots: routine-floor-15-minutes` and `exit=4` for `pb-five` and for `pb-fourteen`.
- Expected: `bots: installed com.skilled.bots.<...> at <plist path>` and `exit=0` for `pb-fifteen`, with a next-fire line.

### Turn 5 -- the list holds one row

- Expected: one row for `pb-fifteen` and no row for either refused bot.

### Turn 6 -- the schedule is gone

- Expected: `bots: uninstalled ...` and `exit=0`, then `ls` reporting no such file and a `grep -c` of `0`.

### Expected

- `bots: routine-floor-15-minutes` and `exit=4` on turns 1, 2 and the first two installs.
- `exit=0` on the fifteen-minute run and install.
- One row in the routines list.
- No plist and no disabled override left behind.

### Evidence

All five refusal lines with their exits, the accepted run line, the whole install output for the accepted bot, the routines JSON and the two cleanup checks.

### Pass / Fail

- **Pass**: both fast bots are refused by both verbs and the fifteen-minute bot is accepted by both.
- **Fail**: a fast bot is accepted, the fifteen-minute bot is refused, the two verbs disagree or the job is left behind.
- **Skip**: only when `node` or `git` is unavailable, when `launchctl` is missing because the host is not macOS, or when the `schedule` verb is missing from the CLI's verb table, naming the missing piece and phase 002 as the blocker.

### Failure Triage

1. `pb-five` runs: the floor check is missing from the run path. Read the definition validator.
2. `pb-fourteen` runs: the period is computed as fifteen for a fourteen-minute cron. Read the period calculation and confirm it uses the gap between consecutive slots.
3. `pb-fifteen` is refused: the comparison is strict where it should be inclusive. Read the 900-second comparison.
4. The installer accepts a fast bot: the installer does not call the checker. Read the install branch and add the call.
5. The two verbs disagree: one reads the expression and the other reads the rendered trigger. Read both and make them read the same field.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `routines/floor-fifteen-minutes.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | Owns the run and schedule verbs |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/routine.ts` | Computes the shortest period |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/schedule.ts` | Calls the checker before it writes the job |

The floor and the skipped slot are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:169].

---

## 5. SOURCE METADATA

- Group: Routines
- Playbook ID: BOT-038
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `routines/floor-fifteen-minutes.md`
