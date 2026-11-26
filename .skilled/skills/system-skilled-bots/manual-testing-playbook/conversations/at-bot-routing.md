---
title: "BOT-027 -- An at-bot address routes the message and an unknown bot is refused"
description: "This scenario proves that `@<bot-id>` at the start of a message routes it to that bot, and that a message naming a bot with no BOT.md is refused `bot-unknown` with nothing appended."
version: 1.0.0.0
---

# BOT-027 -- An at-bot address routes the message and an unknown bot is refused

This document is the execution contract for `BOT-027`. It names the verb, the record and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator sends two messages into one conversation. The first starts with `@pb-other`, so it must route to `pb-other` rather than to the conversation's own bot. The second starts with `@pb-missing`, a name with no `BOT.md`, so it must be refused `bot-unknown` and append nothing.

### Why This Matters

A conversation that ignores the address sends every message to one bot, and the operator's second bot never hears anything. A conversation that appends a message for a bot that does not exist leaves a line no run can answer.

---

## 2. SCENARIO CONTRACT

- Objective: Prove `@<bot-id>` routes a message to the named bot, and a name with no `BOT.md` is refused `bot-unknown` with nothing appended.
- Real user request: `Send this to my other bot, and tell me when I name a bot that does not exist.`
- Prompt: `Send this to my other bot, and tell me when I name a bot that does not exist.`
- Expected execution process: build the world with two bots, send an addressed message, send a message naming a missing bot, read the transcript, count the lines, then remove the world.
- Expected signals: the first send prints `bots: pb-other run <run id> completed` with `exit=0`, the second prints `bots: bot-unknown: pb-missing` with `exit=4`, the transcript holds one message whose `botId` is `pb-other`, and the line count is `2`.
- Desired user-visible outcome: the operator sees which bot answered and sees the refusal by name for the bot that does not exist.
- Pass/fail: PASS if the addressed message reaches `pb-other`, the missing name is refused by name and the file holds two lines. FAIL if the message reaches the conversation's own bot, the refusal names nothing or a third line appears.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Send this to my other bot, and tell me when I name a bot that does not exist.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model.

### Commands

Run from the repository root in a POSIX shell. One block, four turns.

```bash
# 1. Build a throwaway world with two bots, so the address has somewhere to route.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-chat" "$W/checkout/bots/pb-other" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-chat\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nPrepare the release notes.\n' > "$W/checkout/bots/pb-chat/BOT.md"
printf -- '---\nid: pb-other\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nSummarize the open pull requests.\n' > "$W/checkout/bots/pb-other/BOT.md"
# 2. Commit the world and define two helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "bot world"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,String(r.exit.class),JSON.stringify(r.delivery),String(r.evidence.worktreePath),JSON.stringify(r.evidence.worktree??null)].join(" | "))}' "$W"/state/*/records; }
# 3. Turn 1: address another bot from this conversation.
pbots chat pb-chat --message "@pb-other summarize the open pull requests"; echo "exit=$?"
# 4. Turn 2: name a bot that has no BOT.md.
pbots chat pb-chat --message "@pb-missing prepare the notes"; echo "exit=$?"
# 5. Turn 3: read the transcript and the records.
pbots chat pb-chat --transcript --json; echo "exit=$?"
records
# 6. Turn 4: count the lines the conversation file holds.
wc -l < "$W"/state/*/conversations/pb-chat.jsonl
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records
```

### Turn 1 -- the addressed bot runs

- Expected: `bots: pb-other run <run id> completed` and `exit=0`.
- Expected: the record's second field is `pb-other`, not `pb-chat`.

### Turn 2 -- the missing bot is refused by name

- Expected: `bots: bot-unknown: pb-missing` and `exit=4`.
- Expected: the stub receipt count is still `1`, so the refused message dispatched nothing.

### Turn 3 -- the transcript holds the addressed message only

- Expected: a transcript object whose `messages` array holds two entries, the human one with `botId` `pb-other` and the bot one with `botId` `pb-other`.
- Expected: no entry whose `botId` is `pb-missing`.

### Turn 4 -- the file holds two lines

- Expected: `2`, so the refused message appended nothing.

### Expected

- `bots: pb-other run <run id> completed` and `exit=0` on turn 1.
- `bots: bot-unknown: pb-missing` and `exit=4` on turn 2.
- A transcript whose two entries both name `pb-other`.
- `2` from the line count.

### Evidence

Both send lines with their exits, the whole transcript object, the `records` line and the line count. The refusal must name `pb-missing` and the record must name `pb-other`.

### Pass / Fail

- **Pass**: the addressed message reaches `pb-other`, the missing name is refused by name with exit 4 and the file holds two lines.
- **Fail**: the message reaches `pb-chat`, the refusal names nothing, a third line appears or the refused message dispatches a run.
- **Skip**: only when `node` or `git` is unavailable, or when the `chat` verb is absent from the CLI's verb table, naming that verb and phase 010.

### Failure Triage

1. `bots: unknown verb: chat`: phase 010 has not landed. Read the verb table in `.skilled/bin/bots.cjs`.
2. The message reaches `pb-chat`: read the address parser in the conversation module and confirm it reads the leading `@` before the conversation's own bot id.
3. A third line after the refusal: the append must come after the address resolves, so read the order in the chat verb.
4. A refusal with no name: the detail is the bot id the message named, which is what makes the line actionable.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `conversations/at-bot-routing.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | Owns the verb table and the exit codes |
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Resolves a bot id to its definition |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Dispatches the run the addressed message asks for |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor` | The stand-in executor, so no model is called |

The requirement this scenario proves is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:155]. The refusal row is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md:170].

---

## 5. SOURCE METADATA

- Group: Conversations
- Playbook ID: BOT-027
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `conversations/at-bot-routing.md`
