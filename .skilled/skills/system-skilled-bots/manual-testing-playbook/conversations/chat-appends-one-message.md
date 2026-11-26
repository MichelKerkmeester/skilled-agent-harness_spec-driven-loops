---
title: "BOT-026 -- A chat message appends one human and one bot message"
description: "This scenario proves that `bots chat --message` appends one human message, dispatches exactly one run and appends one bot message, so the conversation file holds two lines and the run record holds one."
version: 1.0.0.0
---

# BOT-026 -- A chat message appends one human and one bot message

This document is the execution contract for `BOT-026`. It names the verb, the record and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator sends one message to a bot through `bots chat --message`. The verb must append one human message to the conversation file, dispatch exactly one headless run of the addressed bot and append one bot message carrying the reply. The operator then reads the transcript as JSON and counts the lines in the file.

### Why This Matters

A chat that appends a message and dispatches nothing looks like a working chat until the operator notices the bot never answered. A chat that dispatches twice costs two runs for one message. The two counts, one run and two messages, are the whole contract.

---

## 2. SCENARIO CONTRACT

- Objective: Prove one chat message appends one human message, dispatches one run and appends one bot message.
- Real user request: `Send my bot a message and show me it answered, with the conversation saved.`
- Prompt: `Send my bot a message and show me it answered, with the conversation saved.`
- Expected execution process: build the world with one plain bot, send one message, read the transcript as JSON, count the conversation lines, read the run record, then remove the world.
- Expected signals: `bots: pb-chat run <run id> completed` with `exit=0`, a transcript object carrying `"version":1` and two messages whose `role` values are `human` and `bot`, a line count of `2`, and one `pb-chat` record.
- Desired user-visible outcome: the operator sees the bot's answer in the transcript and knows the conversation is on disk.
- Pass/fail: PASS if the run completes, the transcript holds two messages in order and the file holds two lines. FAIL if the run is missing, the transcript holds another count or the roles are out of order.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Send my bot a message and show me it answered, with the conversation saved.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. The stub prints `stub done` and leaves one receipt under the world's account folder.

### Commands

Run from the repository root in a POSIX shell. One block, four turns.

```bash
# 1. Build a throwaway world: a checkout, an account, a state root and a run tree, all under one temp folder.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-chat" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-chat\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nPrepare the release notes.\n' > "$W/checkout/bots/pb-chat/BOT.md"
# 2. Commit the world (the run binds its result to HEAD) and define two helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "bot world"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,String(r.exit.class),JSON.stringify(r.delivery),String(r.evidence.worktreePath),JSON.stringify(r.evidence.worktree??null)].join(" | "))}' "$W"/state/*/records; }
# 3. Turn 1: send one message and let the verb dispatch the run.
pbots chat pb-chat --message "Prepare the release notes."; echo "exit=$?"
# 4. Turn 2: read the transcript as JSON.
pbots chat pb-chat --transcript --json; echo "exit=$?"
# 5. Turn 3: count the lines the conversation file holds.
wc -l < "$W"/state/*/conversations/pb-chat.jsonl
# 6. Turn 4: read the run record the dispatch left.
records
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records
```

### Turn 1 -- the message is appended and one run is dispatched

- Expected: `bots: pb-chat run <run id> completed` and `exit=0`.
- Expected: the stub receipt count under `$W/acct/stub-receipts` is `1`, so one run dispatched.

### Turn 2 -- the transcript holds two messages in order

- Expected: one JSON object carrying `"version":1`, `"conversationId":"pb-chat"` and a `messages` array of two entries.
- Expected: the first entry's `role` is `human` and its `runId` is `null`, and the second entry's `role` is `bot` and its `runId` is the run id turn 1 printed.

### Turn 3 -- the file holds two lines

- Expected: `2`.

### Turn 4 -- one run record names the bot

- Expected: one line whose second field is `pb-chat` and whose third field is `converged`.

### Expected

- `bots: pb-chat run <run id> completed` and `exit=0` on turn 1.
- A transcript object with `"version":1` and two messages, `human` then `bot`.
- `2` from the line count.
- One `pb-chat` record with reason `converged`.

### Evidence

The turn 1 line with its exit, the whole transcript object, the line count and the `records` line. The run id must match across turn 1, the transcript's bot message and the record.

### Pass / Fail

- **Pass**: turn 1 exits 0 with one run, the transcript holds two messages in order and the file holds two lines.
- **Fail**: the run is missing, the transcript holds another count, the roles are out of order or the run id disagrees.
- **Skip**: only when `node` or `git` is unavailable, or when the `chat` verb is absent from the CLI's verb table, naming that verb and phase 010.

### Failure Triage

1. `bots: unknown verb: chat`: phase 010 has not landed. Read the verb table in `.skilled/bin/bots.cjs`.
2. Two runs for one message: read the enqueue path in the conversation module and confirm the message id is the request's event id.
3. One message in the transcript: the bot message is appended after the run, so read the outcome branch that appends it.
4. A transcript that is a bare array: the envelope is `specs/system-skilled-bots/003-openbot-parity-build/contracts/cli-json.md` section 3.1, which fixes an object with `version`, `conversationId` and `messages`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `conversations/chat-appends-one-message.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | Owns the verb table and the exit codes |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Dispatches the run the message asks for |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts` | Enqueues the request the message becomes |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor` | The stand-in executor, so no model is called |

The requirement this scenario proves is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:152]. The message shape is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md:339]. The envelope is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/cli-json.md:44].

---

## 5. SOURCE METADATA

- Group: Conversations
- Playbook ID: BOT-026
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `conversations/chat-appends-one-message.md`
