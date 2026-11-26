---
title: "BOT-040 -- Activity prints its rows under the seven ids in one fixed order"
description: "This scenario proves that `bots activity` prints its run and item rows under the seven ids `needs_you`, `working`, `scheduled`, `done`, `stopped`, `failed` and `recurring` in that order, leaves out a group with no rows, and that `bots activity --json` prints the same groups with their titles and six-field rows."
version: 1.0.0.0
---

# BOT-040 -- Activity prints its rows under the seven ids in one fixed order

This document is the execution contract for `BOT-040`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator builds five bots that reach five different states: one parks a question, one completes, one fails, one is paused and one carries a routine. The activity verb prints four groups in the fixed order and leaves out the three with no rows. The JSON verb prints the same groups with their titles and their six-field rows.

### Why This Matters

A screen that reorders its groups between runs is a screen the operator has to re-read every time. The fixed order is what lets the terminal screen draw the same rows in the same places. Leaving out an empty group matters because seven headings with nothing under them is noise, and the JSON form has to agree with the plain form or the screen and the operator read different states.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the seven-id order, the omission of empty groups and the JSON shape.
- Real user request: `Show me everything my bots are doing, grouped, and in the same order every time.`
- Prompt: `Show me everything my bots are doing, grouped, and in the same order every time.`
- Expected execution process: build five bots, drive each into its state, read the plain activity output, read the JSON output, then compare the group order against the seven ids.
- Expected signals: the plain output carries the groups `needs_you`, `done`, `stopped` and `failed` in that order with no `working`, `scheduled` or `recurring` heading, and the JSON output carries the same four groups with `id`, `title` and `rows`, each row carrying `botId`, `identity`, `state`, `at`, `actor` and `runId`.
- Desired user-visible outcome: the operator sees one grouped view whose order never changes and whose empty groups are absent.
- Pass/fail: PASS if the four groups appear in the fixed order, the three empty ones are absent and every JSON row carries six fields. FAIL if a group is out of order, an empty group appears or a row is missing a field.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show me everything my bots are doing, grouped, and in the same order every time.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. `STUB:decide=` makes it print the decision marker, and `STUB:exit=1` makes it exit non-zero.

### Commands

Run from the repository root in a POSIX shell. One block, six turns.

```bash
# 1. Build a throwaway world with five bots.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-ask\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nAsk a question.\nSTUB:decide=Ship the release notes now or wait for review?\nSTUB:option=ship now\nSTUB:option=wait for review\n' > "$W/checkout/bots/pb-ask/BOT.md"
printf -- '---\nid: pb-done\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nFinish the work.\n' > "$W/checkout/bots/pb-done/BOT.md"
printf -- '---\nid: pb-fail\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nFail the work.\nSTUB:exit=1\n' > "$W/checkout/bots/pb-fail/BOT.md"
printf -- '---\nid: pb-paused\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nWait to be resumed.\n' > "$W/checkout/bots/pb-paused/BOT.md"
printf -- '---\nid: pb-routine\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\nroutine:\n  what: Summarize the week.\n  starts:\n    - kind: manual\n  does: act\n---\nSummarize the week.\n' > "$W/checkout/bots/pb-routine/BOT.md"
# 2. Commit the world and define one helper.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "five bots"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
# 3. Turn 1: read activity before any run, which must print no group.
pbots activity; echo "exit=$?"
# 4. Turn 2: drive four bots into four states.
pbots chat pb-ask --message "Ask a question."; echo "exit=$?"
pbots run pb-done; echo "exit=$?"
pbots run pb-fail; echo "exit=$?"
pbots pause pb-paused; echo "exit=$?"
# 5. Turn 3: read the grouped plain output.
pbots activity; echo "exit=$?"
# 6. Turn 4: read the group ids in the order they printed.
pbots activity | grep -oE '^(needs_you|working|scheduled|done|stopped|failed|recurring)$'
# 7. Turn 5: read the JSON output.
pbots activity --json; echo "exit=$?"
# 8. Turn 6: read the group ids and row keys from the JSON.
pbots activity --json | "$NODE" -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const o=JSON.parse(s);for(const g of o.groups){console.log([g.id,g.title,Object.keys(g.rows[0]||{}).join(",")].join(" | "))}})'
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots
```

### Turn 1 -- an empty state prints no group

- Expected: `exit=0` and no group heading, because every group is empty.

### Turn 2 -- four bots reach four states

- Expected: `exit=5` on the chat, because the run parks, and `exit=0` on the completed run, `exit=1` on the failed run and `exit=0` on the pause.

### Turn 3 -- four groups print in the fixed order

- Expected: a `needs_you` group holding the parked item, then `done`, then `stopped`, then `failed`.
- Expected: no `working`, `scheduled` or `recurring` heading, because no row belongs to them.

### Turn 4 -- the ids print in the documented order

- Expected: exactly `needs_you`, `done`, `stopped`, `failed`, one per line, in that order.

### Turn 5 -- the JSON carries the same four groups

- Expected: `exit=0` and an object whose `groups` array holds four entries in the same order.

### Turn 6 -- every row carries six fields

- Expected: four lines, each naming the group id, its title and the row keys `botId,identity,state,at,actor,runId`.
- Expected: each row's `state` equals its group's `id`.

### Expected

- No group on an empty state.
- Four groups in the order `needs_you`, `done`, `stopped`, `failed`.
- The same four groups in the JSON, in the same order.
- Six keys on every row, with `state` equal to the group id.

### Evidence

The empty activity output, the four state-driving lines with their exits, the plain grouped output, the four printed ids, the JSON output and the four key lines.

### Pass / Fail

- **Pass**: the four groups appear in the fixed order, the three empty ones are absent and every JSON row carries six fields.
- **Fail**: a group is out of order, an empty group appears, the JSON order differs or a row is missing a field.
- **Skip**: only when `node` or `git` is unavailable, or when the `activity` verb is missing from the CLI's verb table, naming the missing verb and phase 001 as the blocker.

### Failure Triage

1. `bots: unknown verb: activity`: phase 001 has not landed. Read the verb table in `.skilled/bin/bots.cjs`.
2. An empty group prints: the renderer does not skip empty groups. Read the group loop.
3. `failed` prints before `stopped`: the order is read from a map rather than the fixed list. Read the seven-id constant.
4. A row's `state` differs from its group: the row is filed under the wrong group. Read the state mapping.
5. A row carries five keys: `actor` is missing from the status index summary. Read the index write and the row reader.
6. The JSON order differs from the plain order: the two renderers sort separately. Read both and make them read one list.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `activity/activity-groups-seven-ids.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | Owns the activity verb and its `--json` flag |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/activity.ts` | Owns the seven ids and the group order |
| `.skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` | Writes the rows the verb reads |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor` | The stand-in executor, so no model is called |

The seven ids and their order are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:151]. The JSON shape and the six row fields are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:152].

---

## 5. SOURCE METADATA

- Group: Activity
- Playbook ID: BOT-040
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `activity/activity-groups-seven-ids.md`
