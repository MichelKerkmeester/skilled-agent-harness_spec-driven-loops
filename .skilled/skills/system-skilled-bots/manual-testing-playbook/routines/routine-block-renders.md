---
title: "BOT-035 -- A routine block renders on the routines verb and its conflicts are refused"
description: "This scenario proves that `bots routines` and `bots routines --json` list every bot carrying a routine block with its what, its parsed start, its does, its until and its switch, and that a routine beside a trigger and a tell beside a delivery target are each refused by name."
version: 1.0.0.0
---

# BOT-035 -- A routine block renders on the routines verb and its conflicts are refused

This document is the execution contract for `BOT-035`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator asks for the routines in a checkout that has none, then adds a bot whose `BOT.md` carries a `routine` block with all five parts. The plain verb prints one row and the JSON verb prints the same row as an object. The operator then adds two bots that each break one rule: one carries a routine beside a trigger, and one carries `does: tell` beside a delivery target. Both are refused by name and neither joins the list.

### Why This Matters

A routine is the one place a bot says when it runs and what done means, so a second source of truth for the trigger makes the schedule ambiguous. The `does: tell` conflict matters because a tell routine delivers to the operator and nowhere else, so a delivery target beside it is a contradiction the author has to resolve rather than one the runner silently picks a side of.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the routines verb renders every field of a routine block and refuses the two conflicts by name.
- Real user request: `Show me every routine in this repo with what it does and when it runs, then tell me why these two bots are rejected.`
- Prompt: `Show me every routine in this repo with what it does and when it runs, then tell me why these two bots are rejected.`
- Expected execution process: ask for routines in an empty checkout, add a valid routine bot, read the plain and JSON output, add the two conflicting bots, run each, then read the list again.
- Expected signals: the empty list exits 0, the valid bot renders one row with its what, its summary, `act` and its until, the JSON object carries all ten fields, and the two conflicts exit 4 with `routine-trigger-conflict` and `routine-tell-with-targets`.
- Desired user-visible outcome: the operator sees one routine listed with everything they need to read it, and two bots rejected with a name they can act on.
- Pass/fail: PASS if the list renders every field and both conflicts are refused by name with exit 4. FAIL if a field is missing, a conflict exits 0 or a refused bot joins the list.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show me every routine in this repo with what it does and when it runs, then tell me why these two bots are rejected.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. The two conflicting bots are refused before dispatch, so no executor starts for them at all.

### Commands

Run from the repository root in a POSIX shell. One block, seven turns.

```bash
# 1. Build a throwaway world with no routine bot yet.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
# 2. Commit the world and define one helper.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "empty world"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
# 3. Turn 1: ask for routines in a checkout that has none.
pbots routines; echo "exit=$?"
pbots routines --json; echo "exit=$?"
# 4. Turn 2: add a bot carrying all five routine parts.
mkdir -p "$W/checkout/bots/pb-digest"
printf -- '---\nid: pb-digest\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\nroutine:\n  what: Summarize the commits merged since the last run.\n  starts:\n    - kind: cron\n      expression: "0 9 * * 1-5"\n  does: act\n  until: The summary is posted and the operator has read it.\n  until_check: test -s notes/summary.md\n---\nSummarize the commits merged since the last run.\n' > "$W/checkout/bots/pb-digest/BOT.md"
pbots routines; echo "exit=$?"
# 5. Turn 3: read the same row as JSON.
pbots routines --json; echo "exit=$?"
# 6. Turn 4: add a bot carrying a routine beside a trigger.
mkdir -p "$W/checkout/bots/pb-both"
printf -- '---\nid: pb-both\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\nroutine:\n  what: Two sources of truth.\n  starts:\n    - kind: manual\n  does: act\n---\nTwo sources of truth.\n' > "$W/checkout/bots/pb-both/BOT.md"
pbots run pb-both; echo "exit=$?"
# 7. Turn 5: add a tell routine beside a delivery target.
mkdir -p "$W/checkout/bots/pb-tell"
printf -- '---\nid: pb-tell\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: {kind: file, path: out/tell.md}\nroutine:\n  what: Tell the operator.\n  starts:\n    - kind: manual\n  does: tell\n---\nTell the operator.\n' > "$W/checkout/bots/pb-tell/BOT.md"
pbots run pb-tell; echo "exit=$?"
# 8. Turn 6: the list still holds only the valid bot.
pbots routines --json; echo "exit=$?"
# 9. Turn 7: read the routine state file the list reads.
find "$W/state" -name 'routine*.json' -o -name 'routines*.json' | sort
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots
```

### Turn 1 -- an empty checkout lists nothing

- Expected: `exit=0` on both verbs, with no row and a JSON object whose `routines` array is empty.

### Turn 2 -- the valid routine renders one row

- Expected: one row naming `pb-digest`, its what, a summary phrase such as `weekdays 09:00`, `act` and its until text.
- Expected: `exit=0`.

### Turn 3 -- the JSON row carries every field

- Expected: one object `{"version": 1, "routines": [...]}` whose single row carries `botId`, `what`, `starts`, `does`, `until`, `untilMetAt`, `failureStreak` and `switch`.
- Expected: `starts` holds one entry with the parsed trigger and a `summary`, `does` reads `act`, `untilMetAt` reads `null`, `failureStreak` reads `0` and `switch` reads `enabled`.

### Turn 4 -- a routine beside a trigger is refused

- Expected: `bots: routine-trigger-conflict` and `exit=4`, with no run record written.

### Turn 5 -- a tell beside a delivery target is refused

- Expected: `bots: routine-tell-with-targets` and `exit=4`, with no run record written.

### Turn 6 -- neither refused bot joins the list

- Expected: the same single row as turn 3, with no `pb-both` and no `pb-tell`.

### Turn 7 -- the state file is where the list reads

- Expected: at most one path printed, and when it prints, its content carries the bot id and a `failureStreak` of `0`.

### Expected

- `exit=0` on both verbs in an empty checkout.
- One row with the what, the summary, `act` and the until.
- Eight fields on the JSON row, with `untilMetAt` null and `failureStreak` zero.
- `bots: routine-trigger-conflict` and `exit=4` on turn 4.
- `bots: routine-tell-with-targets` and `exit=4` on turn 5.
- One row on turn 6, unchanged.

### Evidence

Both empty-list outputs with their exits, the plain row, the whole JSON object, both refusal lines with their exits and the second JSON object. The `botId` in the row must match the folder name.

### Pass / Fail

- **Pass**: the list renders every field and both conflicts are refused by name with exit 4.
- **Fail**: a field is missing, a conflict exits 0, a refused bot joins the list or the empty checkout exits non-zero.
- **Skip**: only when `node` or `git` is unavailable, or when the `routines` verb is missing from the CLI's verb table, naming the missing verb and phase 002 as the blocker.

### Failure Triage

1. `bots: unknown verb: routines`: phase 002 has not landed. Read the verb table in `.skilled/bin/bots.cjs`.
2. The empty checkout exits 4: the verb treats no routines as an error. Read the list branch and make an empty list exit 0.
3. The summary reads the raw cron expression: the summary renderer is missing. Read the start renderer in the routine module.
4. `pb-both` runs: the conflict check is missing. Read the definition validator and add `routine-trigger-conflict`.
5. `pb-tell` runs: the tell check is missing. Read the delivery resolution and add `routine-tell-with-targets`.
6. `switch` reads `enabled` for a paused bot: the switch order is wrong. Read the five-value order in the routine state reader.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `routines/routine-block-renders.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | Owns the routines verb and its `--json` flag |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/routine.ts` | Parses the routine block and renders the row |
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Refuses the two conflicts by name |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor` | The stand-in executor, so no model is called |

The routine block and its five parts are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:165]. The routines verb and its fields are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:176]. The two conflicts are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:166] and [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:167].

---

## 5. SOURCE METADATA

- Group: Routines
- Playbook ID: BOT-035
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `routines/routine-block-renders.md`
