---
title: "BOT-033 -- A terminal chat links with a one-time code and answers a prompt by number"
description: "This scenario proves that an unlinked chat is denied `channel-unlinked`, that `bots channel link terminal` refuses `channel-roster-missing` until the roster names an actor and then prints a six-digit code, that sending the code links the chat, and that a numbered reply answers the parked prompt and queues one resume."
version: 1.0.0.0
---

# BOT-033 -- A terminal chat links with a one-time code and answers a prompt by number

This document is the execution contract for `BOT-033`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator sends a line to the terminal channel before any chat is linked and is refused. The operator asks for a link code before the roster names anyone and is refused again. The operator adds themselves as an owner, asks again and receives a six-digit code. Sending that code links the chat to the operator. A message then reaches the bot, the bot parks, the prompt is printed with numbered choices, and the operator answers `1`. The item closes with the scope `once` and the drain runs the resume.

### Why This Matters

An unlinked chat that reaches a bot is an open door, because anyone who finds the channel can drive the operator's bots. A link code that does not expire or that can be used twice is the same door with a lock that does not turn. The numbered reply matters because it is the only answer grammar the terminal, Signal and WhatsApp share, and a reply that records an approval where the operator typed `N` is the failure this seam exists to prevent.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the unlinked denial, the roster refusal, the six-digit code, the link, the numbered answer and the one resume.
- Real user request: `Link my terminal chat to my bot, then answer its question with a number and let it finish.`
- Prompt: `Link my terminal chat to my bot, then answer its question with a number and let it finish.`
- Expected execution process: send a line before linking, ask for a code before the roster exists, add an owner, ask for a code, send the code, send a message, answer the printed prompt with `1`, read the item, then drain.
- Expected signals: the first send exits 4 with `channel-unlinked`, the first link exits 4 with `channel-roster-missing`, the second link prints six digits, the code send links the chat, the prompt prints with numbered choices, the `1` closes the item with the scope `once` and the drain prints one `ran` line.
- Desired user-visible outcome: the operator sees two refusals, one code, one linked chat, one prompt and one resumed run.
- Pass/fail: PASS if both refusals exit 4, the code is six digits, the link holds, the numbered answer records `once` and one resume runs. FAIL if an unlinked chat reaches a bot, the code is not six digits, the answer records another scope or no resume is queued.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Link my terminal chat to my bot, then answer its question with a number and let it finish.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. `STUB:decide=` makes it print the decision marker, and each `STUB:option=` adds one choice.

> **No real account.** The terminal channel needs no account, so this scenario runs on the fake transport and records a verdict rather than a skip. A scenario that names a real Telegram, Slack, Signal or WhatsApp account records `SKIP` with the missing account as its blocker.

### Commands

Run from the repository root in a POSIX shell. One block, nine turns.

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
items() { "$NODE" -e 'const fs=require("fs"),p=require("path");const d=process.argv[1];for(const f of fs.readdirSync(d)){if(!f.endsWith(".json"))continue;const i=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([i.id,String(i.state),JSON.stringify(i.answer),JSON.stringify(i.grants??null)].join(" | "))}' "$W"/state/*/needs-you; }
links() { "$NODE" -e 'const fs=require("fs"),p=require("path");const d=process.argv[1];for(const f of fs.readdirSync(d)){if(!f.endsWith(".json"))continue;const l=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([f,String(l.actor),String(l.senderId),String(l.channel)].join(" | "))}' "$W"/state/*/links; }
# 3. Turn 1: send a line before any chat is linked.
printf 'Prepare the release notes.\n' | pbots channel listen terminal; echo "exit=$?"
# 4. Turn 2: ask for a code before the roster names an actor.
pbots channel link terminal; echo "exit=$?"
# 5. Turn 3: add the operator as an owner.
pbots channel roster add ada --role owner; echo "exit=$?"
# 6. Turn 4: ask for the code again.
CODE="$(pbots channel link terminal | tr -dc '0-9')"; echo "code: $CODE"
echo "digits: ${#CODE}"
# 7. Turn 5: send the code to link the chat.
printf '%s\n' "$CODE" | pbots channel listen terminal; echo "exit=$?"
links
# 8. Turn 6: send a message that reaches the bot and parks it.
printf 'Prepare the release notes.\n' | pbots channel listen terminal; echo "exit=$?"
# 9. Turn 7: answer the printed prompt by number.
printf '1\n' | pbots channel listen terminal; echo "exit=$?"
items
# 10. Turn 8: read the inbox.
pbots inbox; echo "exit=$?"
# 11. Turn 9: drain the resume the answer queued.
pbots drain; echo "exit=$?"
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots items links
```

### Turn 1 -- an unlinked chat reaches no bot

- Expected: `bots: channel-unlinked` and `exit=4`, with no run record written.

### Turn 2 -- the link needs a roster

- Expected: `bots: channel-roster-missing` and `exit=4`.

### Turn 3 -- the roster gains an owner

- Expected: `exit=0` and a line naming `ada` as an owner.

### Turn 4 -- the code is six digits

- Expected: `code: <six digits>` and `digits: 6`.

### Turn 5 -- the code links the chat

- Expected: `exit=0` and one `links` line naming the link file, `ada` as the actor, the provider sender id and `terminal` as the channel.

### Turn 6 -- the message reaches the bot and parks it

- Expected: a line naming the run and the item, and the prompt printed with its numbered choices, the first being `1` for `ship now`.
- Expected: `exit=0`, because the listener ends at end of input rather than on the park.

### Turn 7 -- the numbered answer closes the item

- Expected: `exit=0` and an `items` line whose state reads `closed`, whose answer text reads `ship now` and whose `grants.scope` reads `once`.

### Turn 8 -- the inbox agrees

- Expected: one line for the item, now closed, with no open item left.

### Turn 9 -- one resume runs

- Expected: one `<request id> ran` line and `exit=0`.

### Expected

- `bots: channel-unlinked` and `exit=4` on turn 1.
- `bots: channel-roster-missing` and `exit=4` on turn 2.
- Six digits on turn 4.
- One link line naming `ada` on turn 5.
- A numbered prompt on turn 6.
- `"scope":"once"` on the item after turn 7.
- One `ran` line on turn 9.

### Evidence

Both refusal lines with their exits, the roster line, the code with its digit count, the link line, the printed prompt, the `items` dump, the inbox output and the drain line. The item id in the prompt must match the id in the `items` dump.

### Pass / Fail

- **Pass**: both refusals exit 4, the code is six digits, the link names the operator, the numbered answer records `once` and one resume runs.
- **Fail**: an unlinked chat reaches a bot, the code is not six digits, the link names no actor, the answer records another scope or no resume is queued.
- **Skip**: only when `node` or `git` is unavailable, or when the `channel` verb is missing from the CLI's verb table, naming the missing verb and phase 011 as the blocker.

### Failure Triage

1. `bots: unknown verb: channel`: phase 011 has not landed. Read the verb table in `.skilled/bin/bots.cjs`.
2. Turn 1 exits 0: the unlinked denial is missing. Read the `channel-unlinked` row in `specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md`.
3. The code is not six digits: the generator is wrong. Read the code writer in the channels module.
4. The code send exits 4: the code expired or was consumed. Read the five-minute expiry and the first-use rule.
5. The prompt prints no numbers: the choice renderer is missing. Read the terminal adapter's prompt format.
6. `1` is treated as a chat message: the grammar does not read digits. Read the `1` to `n` rule in the terminal adapter.
7. The answer records `deny` for `1`: the grammar maps the wrong branch. Read the `YES` and `NO` mapping and confirm `1` maps to the first option.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `conversations/channel-link-and-reply.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | Owns the channel verb and its subcommands |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/channel.ts` | Defines the adapter contract and the link file |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/channel-terminal.ts` | Reads stdin lines and renders the numbered prompt |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Records the answer and queues the resume |

The link rule is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:185]. The prompt file rule is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:188]. The answer grammar is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:190]. The terminal listener is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:202].

---

## 5. SOURCE METADATA

- Group: Conversations
- Playbook ID: BOT-033
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `conversations/channel-link-and-reply.md`
