---
title: "BOT-014 -- A run that asks a question parks and holds the next run"
description: "This scenario validates the manual runner for `BOT-014`. It focuses on a decision marker parking the run with exit 5, the inbox listing the item and a second run being refused until it is answered."
version: 1.0.0.0
---

# BOT-014 -- A run that asks a question parks and holds the next run

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BOT-014`.

---

## 1. OVERVIEW

The executor prints a `[NEEDS-DECISION]` line with two `[OPTION]` lines. The runner must park the run as a needs-you item and exit 5. The inbox must list the item with its question and options. A second run of the same bot must be refused before dispatch until the item is answered.

### Why This Matters

No process waits for an answer, so the item is the only trace of the question. If a later run went ahead anyway, it could act on the decision the operator has not made yet.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BOT-014` and confirm the expected signals without contradictory evidence.

- Objective: Prove a decision marker parks the run with exit 5, shows in the inbox and holds every later run of that bot.
- Real user request: `My bot needs me to decide something. Show me the question and make sure it waits.`
- Prompt: `My bot needs me to decide something. Show me the question and make sure it waits.`
- Expected execution process: build the world with an asking bot, run it, read the inbox, run it again, read the records and the stub receipt count, then remove the world.
- Expected signals: run one prints `bots: pb-ask run <run id> is waiting on a decision: item <item id>. See bots inbox.` with `exit=5`. The inbox lists `open`, the item id, `pb-ask`, the question and both options. Run two exits 4 with `refused before dispatch (awaiting-decision-hold): answer it first: bots inbox lists item <item id>`.
- Desired user-visible outcome: the operator sees the question and its options, and knows the bot is held until they answer.
- Pass/fail: PASS if every signal appears with matching item ids and the stub ran once. FAIL if run one exits other than 5, the inbox is empty or run two dispatches.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `My bot needs me to decide something. Show me the question and make sure it waits.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. `STUB:decide=` makes it print the decision marker, and each `STUB:option=` adds one choice.

### Commands

Run from the repository root in a POSIX shell.

```bash
# 1. Build a throwaway world: a checkout, a home, a state root and a run tree, all under one temp folder.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-ask" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-ask\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nPrepare the release notes.\nSTUB:decide=Ship the release notes now or wait for review?\nSTUB:option=ship now\nSTUB:option=wait for review\n' > "$W/checkout/bots/pb-ask/BOT.md"
# 2. Commit the world (the run binds its result to HEAD) and define two helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "bot world"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,String(r.exit.class),JSON.stringify(r.delivery),String(r.evidence.worktreePath),JSON.stringify(r.evidence.worktree??null)].join(" | "))}' "$W"/state/*/records; }
# 3. Run, read the inbox, run again, then read what both runs left.
pbots run pb-ask; echo "exit=$?"
pbots inbox; echo "exit=$?"
pbots run pb-ask; echo "exit=$?"
records
ls "$W/acct/stub-receipts" | wc -l
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records
```

### Expected

- Run one: `bots: pb-ask run <run id> is waiting on a decision: item <item id>. See bots inbox.` and `exit=5`.
- Inbox: a line `open<TAB><item id><TAB>pb-ask<TAB>created ...<TAB>expires ...`, then the question `Ship the release notes now or wait for review?`, then `- ship now` and `- wait for review`, and `exit=0`.
- Run two: `bots: pb-ask refused before dispatch (awaiting-decision-hold): answer it first: bots inbox lists item <item id>` and `exit=4`.
- `records` prints two `pb-ask` lines, the parked one with reason `blockedStop`.
- The stub receipt count is `1`.

### Evidence

Both run lines with their exits, the full inbox output and the `records` lines. The item id must match across run one, the inbox and run two.

### Pass / Fail

- **Pass**: exits 5, 0 and 4 in that order, matching item ids and one stub receipt.
- **Fail**: run one exits other than 5, the inbox misses the item, run two dispatches or the item ids disagree.
- **Skip**: only when node or git is unavailable, or the repository path itself contains an executor word, naming that blocker.

### Failure Triage

1. Exit 0 on run one: the marker was not read. Read `parseDecisionMarker` in `runtime/lib/dispatch.ts`.
2. An empty inbox: read `listNeedsYouItems` in `runtime/lib/needs-you.ts` and confirm the state root in `$W/checkout/bots/config.json`.
3. Run two dispatches: read the hold check near the top of the run in `runtime/lib/runner.ts`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `manual-run/needs-you-park-and-hold.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | Reads the decision marker |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Writes and lists needs-you items |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Parks the run and holds the next one |
| `.skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` | The status mode's inbox reference |
| `.skilled/skills/system-skilled-bots/runtime/tests/needs-you.vitest.ts` | Automated needs-you coverage |

---

## 5. SOURCE METADATA

- Group: Manual Run
- Playbook ID: BOT-014
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `manual-run/needs-you-park-and-hold.md`
