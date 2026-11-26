---
title: "BOT-039 -- Ten consecutive failures fatigue a bot and one enable brings it back"
description: "This scenario proves that ten consecutive failed runs set the `disabled` switch, record `fatiguedAt` and raise one needs-you item under the bot's own id, that a later run is refused `routine-fatigued`, and that `bots enable` answers the item, clears the record and restarts the count."
version: 1.0.0.0
---

# BOT-039 -- Ten consecutive failures fatigue a bot and one enable brings it back

This document is the execution contract for `BOT-039`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator points a bot at an executor that always fails and runs it ten times in a short loop. The tenth failure sets the `disabled` switch, records `fatiguedAt` and raises one needs-you item under the bot's own id. A later run is refused `routine-fatigued`. The operator runs `bots enable`, which answers the item with the fixed text `enabled`, clears the switch and the record, and restarts the count. The next run dispatches again.

### Why This Matters

A bot that fails every minute forever is a bot that fills the state root with records nobody reads. The count has to stop at the first record that is not a failure, or a parked run would count as one and a bot that asks a question ten times would be stopped for asking. The enable path matters because a recovery that refused would leave the bot stopped with no way back except editing files by hand.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the ten-failure switch, the item, the fatigue refusal and the enable that clears all three.
- Real user request: `My bot keeps failing. Show me it stops after ten tries, then turn it back on and show me it runs again.`
- Prompt: `My bot keeps failing. Show me it stops after ten tries, then turn it back on and show me it runs again.`
- Expected execution process: build the world with a failing executor, run a ten-iteration loop, read the routine row and the inbox, run once more, enable the bot, read the row again, then run once more.
- Expected signals: the tenth run sets `switch` to `fatigued` with `failureStreak` reading `10`, the inbox lists one item under `pb-fail`, the next run exits 4 with `routine-fatigued`, the enable exits 0 and answers the item, and the row returns to `enabled` with a zero streak.
- Desired user-visible outcome: the operator sees the bot stop, sees why, and sees one command bring it back.
- Pass/fail: PASS if the switch trips at ten, the item is raised, the refusal follows and the enable clears all three. FAIL if the switch trips early or late, no item is raised, the refusal is missing or the enable leaves the record behind.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `My bot keeps failing. Show me it stops after ten tries, then turn it back on and show me it runs again.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** This scenario writes its own three-line executor at `$W/bin/codex`, ahead of the shipped stub on PATH, because the shipped stub always succeeds. The stand-in reads the prompt from stdin, discards it and exits 1, so every dispatched run fails and no model is called.

> **Short loop, no wait.** The ten failures are ten runs in one loop with no sleep, so the whole scenario finishes in seconds.

### Commands

Run from the repository root in a POSIX shell. One block, eight turns.

```bash
# 1. Build a throwaway world with one bot and a failing executor.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-fail" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state" "$W/bin"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-fail\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\nroutine:\n  what: Fail every time.\n  starts:\n    - kind: manual\n  does: act\n---\nFail every time.\n' > "$W/checkout/bots/pb-fail/BOT.md"
printf '#!/bin/sh\ncat > /dev/null\nexit 1\n' > "$W/bin/codex"
chmod +x "$W/bin/codex"
# 2. Commit the world and define two helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "failing bot"
pbots() { HOME="$W/acct" PATH="$W/bin:$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,String(r.exit.class),String(r.exit.refusal)].join(" | "))}' "$W"/state/*/records; }
# 3. Turn 1: ten consecutive failures in one short loop.
for i in $(seq 1 10); do pbots run pb-fail >/dev/null 2>&1; echo "run $i exit=$?"; done
records
# 4. Turn 2: read the routine row and its switch.
pbots routines --json; echo "exit=$?"
# 5. Turn 3: read the item the tenth failure raised.
pbots inbox; echo "exit=$?"
# 6. Turn 4: a fatigued bot refuses to run.
pbots run pb-fail; echo "exit=$?"
# 7. Turn 5: enable the bot, which answers the item and clears the record.
pbots enable pb-fail; echo "exit=$?"
pbots inbox; echo "exit=$?"
# 8. Turn 6: the row returns to enabled with a zero streak.
pbots routines --json; echo "exit=$?"
# 9. Turn 7: the next run dispatches again.
pbots run pb-fail; echo "exit=$?"
records
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records
```

### Turn 1 -- ten failures trip the switch

- Expected: ten `run <n> exit=1` lines, then ten record lines each carrying a non-null `exit.class`, a null `exit.refusal` and a reason other than `awaiting-decision`.

### Turn 2 -- the row reads fatigued

- Expected: the row's `switch` reads `fatigued` and its `failureStreak` reads `10`.
- Expected: `exit=0`.

### Turn 3 -- one item under the bot's own id

- Expected: one inbox line naming `pb-fail` rather than a sentinel, carrying the fatigue notice and the tenth run's id.
- Expected: the item's id equals the tenth run's id.

### Turn 4 -- a fatigued bot is refused by name

- Expected: `bots: routine-fatigued` and `exit=4`, with no eleventh record written.

### Turn 5 -- the enable answers the item

- Expected: `bots: pb-fail enabled` and `exit=0`.
- Expected: the inbox now lists the item as answered rather than open, and no resume request is queued.

### Turn 6 -- the row returns to enabled

- Expected: `switch` reading `enabled`, `failureStreak` reading `0` and `untilMetAt` reading `null`.

### Turn 7 -- the next run dispatches

- Expected: a run line with `exit=1`, because the executor still fails, and an eleventh record whose `exit.refusal` reads `null`, which proves the run was dispatched rather than refused.

### Expected

- Ten failures, then `switch` reading `fatigued` with a streak of `10`.
- One item under `pb-fail` whose id is the tenth run's id.
- `bots: routine-fatigued` and `exit=4` on turn 4.
- `bots: pb-fail enabled` and `exit=0` on turn 5, with the item answered.
- `switch` reading `enabled` with a zero streak on turn 6.
- An eleventh dispatched record on turn 7.

### Evidence

The ten loop lines, the ten record lines, both routine JSON outputs, the inbox before and after the enable, the fatigue refusal with its exit and the eleventh record line. The item id must equal the tenth run's id.

### Pass / Fail

- **Pass**: the switch trips at ten, the item is raised under the bot's id, the refusal follows and the enable clears the switch, the record and the count.
- **Fail**: the switch trips early or late, no item is raised, the item sits under a sentinel, the refusal is missing or the enable leaves the record behind.
- **Skip**: only when `node` or `git` is unavailable, or when the `enable` verb is missing from the CLI's verb table, naming the missing verb and phase 002 as the blocker.

### Failure Triage

1. The switch trips before ten: a parked run is being counted. Read the failure test and confirm it excludes `awaiting-decision`.
2. The switch never trips: a refused run is being counted as a failure, or the count resets. Read the count and confirm it stops at the first record that is not a failure.
3. The item's `botId` reads a sentinel: the fatigue item uses the wrong writer. Read the item write in the routine module.
4. The item's id differs from the tenth run's id: read the id rule and make them equal.
5. The refusal reads `disabled`: the fatigue name is decided at the wrong check. Read the `disabled` branch and confirm it reads `fatiguedAt`.
6. The enable leaves the streak at ten: `enabledAt` is not written. Read the three writes the enable makes.
7. A resume is queued by the enable: the no-resume option is missing. Read the answer call in the enable branch.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `routines/fatigue-after-ten-failures.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | Owns the run and enable verbs |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/routine.ts` | Counts the streak and writes the switch |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Writes the fatigue item |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Answers the item with the no-resume option |

The ten-failure rule, the item and the enable are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:170].

---

## 5. SOURCE METADATA

- Group: Routines
- Playbook ID: BOT-039
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `routines/fatigue-after-ten-failures.md`
