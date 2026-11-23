---
title: "BOT-018 -- An event queued twice runs once when the queue drains"
description: "This scenario validates the request queue for `BOT-018`. It focuses on a repeated event staying one request and the drain running that request once and emptying the watched folder."
version: 1.0.0.0
---

# BOT-018 -- An event queued twice runs once when the queue drains

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BOT-018`.

---

## 1. OVERVIEW

An event source sends the same event twice. `bots enqueue` must store it once and report the second send as a duplicate of the same request. `bots drain` must claim that request, run the bot once and leave the watched folder empty.

### Why This Matters

Webhooks and hooks retry. Without the seen-key marker a retried event would run the bot twice.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BOT-018` and confirm the expected signals without contradictory evidence.

- Objective: Prove a repeated event is one request and the drain runs it once.
- Real user request: `Queue a run for my bot from this event, and make sure a resent event does not run it twice.`
- Prompt: `Queue a run for my bot from this event, and make sure a resent event does not run it twice.`
- Expected execution process: build the world, approve the bot with `bots enable`, enqueue the same event twice, list the watched folder, drain, list the watched and done folders, read the records, then remove the world.
- Expected signals: `bots enable` prints `bots: pb-queue no longer disabled` with `exit=0`. The first enqueue prints `bots: enqueued <request id>`, the second `bots: duplicate <request id>`, both with `exit=0`. The watched folder holds one file. The drain prints `<request id> ran` with `exit=0`.
- Desired user-visible outcome: the operator sees one queued request and one run, whatever the event source does.
- Pass/fail: PASS if the ids match, the drain runs once and the watched folder ends empty. FAIL if the second enqueue stores a new request, the drain runs twice or the watched folder keeps a file.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Queue a run for my bot from this event, and make sure a resent event does not run it twice.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. The drain dispatches the queued run, so this applies to it. Keep those words out of bot ids, temp paths, sources, event ids and prompts, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model.

### Commands

Run from the repository root in a POSIX shell.

```bash
# 1. Build a throwaway world: a checkout, a home, a state root and a run tree, all under one temp folder.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-queue" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-queue\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nSummarize the event named in the request.\n' > "$W/checkout/bots/pb-queue/BOT.md"
# 2. Commit the world (the run binds its result to HEAD) and define two helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "bot world"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,String(r.exit.class),JSON.stringify(r.delivery),String(r.evidence.worktreePath),JSON.stringify(r.evidence.worktree??null)].join(" | "))}' "$W"/state/*/records; }
# 3. Approve the bot (a queued run uses only an approved definition), send the same event twice, then look at the watched folder.
pbots enable pb-queue; echo "exit=$?"
pbots enqueue pb-queue --source webhook --event-id evt-42 --prompt "first payload"; echo "exit=$?"
pbots enqueue pb-queue --source webhook --event-id evt-42 --prompt "changed payload"; echo "exit=$?"
ls "$W"/state/*/requests/inbox
# 4. Drain once, then look again.
pbots drain; echo "exit=$?"
ls "$W"/state/*/requests/inbox "$W"/state/*/requests/done
records
ls "$W/acct/stub-receipts" | wc -l
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records
```

### Expected

- Enable: a line starting `bots: warning: no installed schedule found for pb-queue`, then `bots: pb-queue no longer disabled` and `exit=0`. The bot has no schedule, so the warning is expected.
- `bots: enqueued <request id>` then `bots: duplicate <request id>`, the same id both times, each with `exit=0`.
- The watched folder lists one file, `<request id>.json`.
- The drain prints `<request id> ran` and `exit=0`.
- Afterwards the watched folder is empty and the done folder holds the request.
- `records` prints one `pb-queue` line with reason `converged`, and the stub receipt count is `1`.

### Evidence

The enable lines, both enqueue lines, the three folder listings, the drain line, the `records` line and the receipt count.

### Pass / Fail

- **Pass**: one request id, one drain line `ran`, an empty watched folder and one stub receipt.
- **Fail**: two request ids, a second run, a `retry` or `quarantined` drain line or a file left in the watched folder.
- **Skip**: only when node or git is unavailable, or the repository path itself contains an executor word, naming that blocker.

### Failure Triage

1. A second request id: the seen-key marker did not hold. Read `runtime/lib/request-queue.ts`.
2. Drain exit 4: the drain could not resolve identity or the state root. Check `$W/checkout/bots/config.json`.
3. A `quarantined` line: its reason names the cause. `definition-unapproved` means the enable step did not run or resolved another state root. Read the routing in `runtime/lib/request-drain.ts`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `request-queue/enqueue-dedupe-and-drain.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts` | The file queue and its seen-key marker |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-record.ts` | The request shape and source rule |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts` | One pass over the watched folder |
| `.skilled/skills/system-skilled-bots/runtime/tests/dedupe.vitest.ts` | Automated duplicate and drain coverage |

---

## 5. SOURCE METADATA

- Group: Request Queue
- Playbook ID: BOT-018
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `request-queue/enqueue-dedupe-and-drain.md`
