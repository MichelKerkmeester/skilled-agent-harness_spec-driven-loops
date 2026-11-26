---
title: "BOT-028 -- A parked chat run is answered with scope once and the resume replies"
description: "This scenario proves that a chat run which parks a question appends a bot message carrying the item id, and that answering the item with `--scope once` queues one resume whose reply is appended to the same conversation."
version: 1.0.0.0
---

# BOT-028 -- A parked chat run is answered with scope once and the resume replies

This document is the execution contract for `BOT-028`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator sends a message to a bot that asks a question. The run parks, and the conversation gains a bot message carrying the question and the item id. The operator answers the item with `--scope once`, the answer queues one resume request, and the drain runs it. The conversation then gains a second bot message carrying the answer and the run id.

### Why This Matters

A parked chat run that appends nothing leaves the operator waiting for an answer that will never come. An answer that queues no resume leaves the bot held forever. The two appends and the one resume are the whole exchange.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a parked chat run appends its question, and an answer with `--scope once` queues one resume whose reply is appended to the same conversation.
- Real user request: `My bot asked me something in chat. Answer it and let it finish, then show me the whole exchange.`
- Prompt: `My bot asked me something in chat. Answer it and let it finish, then show me the whole exchange.`
- Expected execution process: build the world with a bot that asks, send the message, read the inbox and the item, answer with `--scope once`, drain the resume, read the transcript, then remove the world.
- Expected signals: the send exits 5 with `is waiting on a decision: item <item id>`, the item's `answer.scope` is `once`, the answer prints `resume request <request id> enqueued` with `exit=0`, the drain prints `<request id> ran`, and the transcript holds four messages.
- Desired user-visible outcome: the operator sees the question, the answer and the resumed reply in one conversation.
- Pass/fail: PASS if the send parks, the answer records `once` and queues one resume, the drain runs it and the transcript holds four messages. FAIL if the send completes, the scope reads another value or the transcript holds another count.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `My bot asked me something in chat. Answer it and let it finish, then show me the whole exchange.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. `STUB:decide=` makes it print the decision marker, and each `STUB:option=` adds one choice.

### Commands

Run from the repository root in a POSIX shell. One block, five turns.

```bash
# 1. Build a throwaway world with one bot that asks a question.
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
# 2. Commit the world and define three helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "bot world"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,String(r.exit.class),JSON.stringify(r.delivery),String(r.evidence.worktreePath),JSON.stringify(r.evidence.worktree??null)].join(" | "))}' "$W"/state/*/records; }
item() { "$NODE" -e 'const fs=require("fs"),p=require("path");const d=process.argv[1];for(const f of fs.readdirSync(d)){if(!f.endsWith(".json"))continue;const i=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([i.id,i.botId,String(i.kind),JSON.stringify(i.answer),JSON.stringify(i.grants),String(i.conversationId)].join(" | "))}' "$W"/state/*/needs-you; }
# 3. Turn 1: send the message, which parks the run.
pbots chat pb-ask --message "Prepare the release notes."; echo "exit=$?"
# 4. Turn 2: read the item the park wrote.
pbots inbox; echo "exit=$?"
item
# 5. Turn 3: answer the item with the scope once.
ITEM_ID="$(ls "$W"/state/*/needs-you | sed 's/\.json$//' | head -1)"
pbots answer "$ITEM_ID" "ship now" --scope once; echo "exit=$?"
item
# 6. Turn 4: drain the resume the answer queued.
pbots drain; echo "exit=$?"
# 7. Turn 5: read the whole conversation.
pbots chat pb-ask --transcript --json; echo "exit=$?"
records
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records item
```

### Turn 1 -- the run parks and the conversation gains its question

- Expected: `bots: pb-ask run <run id> is waiting on a decision: item <item id>. See bots inbox.` and `exit=5`.
- Expected: the transcript already holds two messages, the second carrying `needs you: Ship the release notes now or wait for review? (item <item id>)`.

### Turn 2 -- the item is open and carries the question

- Expected: the inbox lists one `open` line naming `pb-ask`, then the question and both options.
- Expected: the `item` helper prints the item id, `pb-ask`, `decision`, `null` for the answer, a `grants` object and the conversation id `pb-ask`.

### Turn 3 -- the answer records the scope once

- Expected: `bots: item <item id> answered; resume request <request id> enqueued` and `exit=0`.
- Expected: the `item` helper now prints an `answer` object whose `scope` is `once` and a `grants` object whose `scope` is `once` and whose `grantedBy` is the operator.

### Turn 4 -- the resume runs

- Expected: `<request id> ran` and `exit=0`.

### Turn 5 -- the conversation holds four messages

- Expected: a transcript object whose `messages` array holds four entries in the order human, bot, human, bot.
- Expected: the fourth entry's `text` carries the answer and the resumed run id.

### Expected

- `exit=5` on turn 1 with the item id named.
- One `open` inbox line with the question and both options.
- `resume request <request id> enqueued` and `exit=0` on turn 3, with `scope` reading `once`.
- `<request id> ran` on turn 4.
- Four messages in the transcript.

### Evidence

The turn 1 line with its exit, the inbox output, both `item` lines, the answer line, the drain line and the whole transcript. The item id must match across turn 1, the inbox and the answer.

### Pass / Fail

- **Pass**: the send parks with exit 5, the answer records `once` and queues one resume, the drain runs it and the transcript holds four messages.
- **Fail**: the send completes, the scope reads another value, no resume is queued or the transcript holds another count.
- **Skip**: only when `node` or `git` is unavailable, or when the `chat` verb is absent from the CLI's verb table, naming that verb and phase 010.

### Failure Triage

1. `bots: unknown verb: chat`: phase 010 has not landed. Read the verb table in `.skilled/bin/bots.cjs`.
2. The send exits 0: the decision marker was not read. Read the marker parser in the dispatch module.
3. Two messages rather than four: the resume's append is the drain's, so read the outcome branch that appends a resumed reply.
4. The scope reads `once` but the grant reads `null`: the answer and the grant are one write, so read the answer seam in `specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md` step 11.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `conversations/park-answer-scope-once.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | Owns the answer verb and its exit codes |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Writes the answer and queues the resume |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Writes and lists the item |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor` | The stand-in executor, so no model is called |

The requirement this scenario proves is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:168]. The parked message form is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:158]. The answer sequence is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md:27].

---

## 5. SOURCE METADATA

- Group: Conversations
- Playbook ID: BOT-028
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `conversations/park-answer-scope-once.md`
