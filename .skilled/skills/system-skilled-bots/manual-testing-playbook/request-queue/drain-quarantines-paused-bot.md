---
title: "BOT-019 -- A request for a paused bot is quarantined, not run"
description: "This scenario validates the request queue for `BOT-019`. It focuses on the drain moving a paused bot's request to quarantine with its reason and leaving the watched folder empty."
version: 1.0.0.0
---

# BOT-019 -- A request for a paused bot is quarantined, not run

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BOT-019`.

---

## 1. OVERVIEW

The operator pauses a bot, then an event queues a run for it. The drain must not run the bot. It must move the request to quarantine with the reason `paused` and leave nothing in the watched folder, so a queue agent does not keep firing on it. Resuming the bot does not replay the quarantined request.

### Why This Matters

A refused request that went back into the watched folder would loop forever. One that ran anyway would ignore the operator's pause.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BOT-019` and confirm the expected signals without contradictory evidence.

- Objective: Prove a paused bot's request is quarantined with its reason and never dispatched.
- Real user request: `I paused my bot. If an event comes in, make sure it does not run and tell me why.`
- Prompt: `I paused my bot. If an event comes in, make sure it does not run and tell me why.`
- Expected execution process: build the world, approve the bot with `bots enable`, pause it, enqueue an event, drain, list the watched and quarantine folders, resume the bot, drain again, then remove the world.
- Expected signals: `bots: pb-hold no longer disabled` from the enable, `bots: pb-hold paused`, then `bots: enqueued <request id>`, then the drain prints `<request id> quarantined: paused` with `exit=0`. The second drain prints nothing and exits 0.
- Desired user-visible outcome: the operator sees the request was set aside because of the pause, with nothing run.
- Pass/fail: PASS if the request lands in quarantine with reason `paused`, the stub never runs and the watched folder ends empty. FAIL if the bot runs, the request goes back to the watched folder or the second drain replays it.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I paused my bot. If an event comes in, make sure it does not run and tell me why.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths, sources and event ids, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. It should not run at all here.

### Commands

Run from the repository root in a POSIX shell.

```bash
# 1. Build a throwaway world: a checkout, a home, a state root and a run tree, all under one temp folder.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-hold" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-hold\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nSummarize the event named in the request.\n' > "$W/checkout/bots/pb-hold/BOT.md"
# 2. Commit the world (the run binds its result to HEAD) and define two helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "bot world"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,String(r.exit.class),JSON.stringify(r.delivery),String(r.evidence.worktreePath),JSON.stringify(r.evidence.worktree??null)].join(" | "))}' "$W"/state/*/records; }
# 3. Approve the bot (a queued run uses only an approved definition), pause it, queue one event and drain.
pbots enable pb-hold; echo "exit=$?"
pbots pause pb-hold; echo "exit=$?"
pbots enqueue pb-hold --source webhook --event-id evt-7; echo "exit=$?"
pbots drain; echo "exit=$?"
ls "$W"/state/*/requests/inbox "$W"/state/*/requests/quarantine
ls "$W/acct/stub-receipts" 2>&1
# 4. Resume and drain again: the quarantined request is not replayed.
pbots resume pb-hold; echo "exit=$?"
pbots drain; echo "exit=$?"
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records
```

### Expected

- Enable: a line starting `bots: warning: no installed schedule found for pb-hold`, then `bots: pb-hold no longer disabled` and `exit=0`. The bot has no schedule, so the warning is expected.
- `bots: pb-hold paused` and `exit=0`.
- `bots: enqueued <request id>` and `exit=0`.
- First drain: `<request id> quarantined: paused` and `exit=0`.
- The watched folder is empty and the quarantine folder holds the request with its reason file.
- `ls` of `stub-receipts` reports no such file or directory.
- `bots: pb-hold no longer paused`, then a second drain that prints no request line and exits 0.

### Evidence

Every command's output with its exit, and both folder listings.

### Pass / Fail

- **Pass**: one quarantine line with reason `paused`, an empty watched folder, no stub receipt and a second drain with nothing to do.
- **Fail**: the bot runs, the drain line says `ran` or `retry`, the watched folder keeps the request or the second drain runs it.
- **Skip**: only when node or git is unavailable, or the repository path itself contains an executor word, naming that blocker.

### Failure Triage

1. A `ran` line: the pause switch was not read. Check that `bots pause` and the drain resolved the same state root.
2. A `retry` line: the refusal was routed as a failure. Read `routeOutcome` in `runtime/lib/request-drain.ts`.
3. A `quarantined: definition-unapproved` line: the enable step did not run or resolved another state root, so the approval check refused the run before the pause was read.
4. Read `runtime/lib/switches.ts` for where the pause file lives.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `request-queue/drain-quarantines-paused-bot.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts` | Routes a refusal to quarantine |
| `.skilled/skills/system-skilled-bots/runtime/lib/switches.ts` | The pause and disable switches |
| `.skilled/skills/system-skilled-bots/runtime/tests/quarantine.vitest.ts` | Automated quarantine coverage |

---

## 5. SOURCE METADATA

- Group: Request Queue
- Playbook ID: BOT-019
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `request-queue/drain-quarantines-paused-bot.md`
