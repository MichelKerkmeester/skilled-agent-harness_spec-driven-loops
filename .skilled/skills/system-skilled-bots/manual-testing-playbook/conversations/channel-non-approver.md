---
title: "BOT-034 -- A chat whose actor left the roster cannot answer an item"
description: "This scenario proves that `bots channel roster` is the only writer of `operators.json`, that removing the last owner is refused `channel-roster-owner`, and that a linked chat whose actor is no longer on the roster is refused `answer-not-approver` with the item unchanged and no resume queued."
version: 1.0.0.0
---

# BOT-034 -- A chat whose actor left the roster cannot answer an item

This document is the execution contract for `BOT-034`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator builds a roster with one owner and one member, tries to remove the only owner and is refused, links a terminal chat, and parks a question. The operator then makes the member the owner and removes the first actor. The linked chat now belongs to someone the roster no longer names, so its numbered answer is refused `answer-not-approver`. The item stays open and the drain has nothing to run.

### Why This Matters

A roster that a chat can talk around is not a roster. The check has to resolve the provider sender id through the link record and then match that actor, so a chat cannot borrow a name by typing it. The last-owner refusal matters because a roster with no owner refuses every channel answer, which locks the operator out of their own bots.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the roster verbs, the last-owner refusal, the non-approver refusal and the unchanged item.
- Real user request: `I removed myself from the channel roster. Show me my chat can no longer answer my bot, and that the bot is still waiting.`
- Prompt: `I removed myself from the channel roster. Show me my chat can no longer answer my bot, and that the bot is still waiting.`
- Expected execution process: add an owner and a member, list the roster, try to remove the only owner, link a chat, park a question, move the owner role, remove the first actor, answer by number, then read the item and drain.
- Expected signals: the list prints one owner and one member, the last-owner removal exits 4 with `channel-roster-owner`, the answer exits 4 with `answer-not-approver`, the item is still open with a null answer and the drain prints no `ran` line.
- Desired user-visible outcome: the operator sees their own chat refused and the bot still waiting for someone on the roster.
- Pass/fail: PASS if the roster verbs work, the last-owner removal exits 4, the non-approver answer exits 4, the item is unchanged and no resume runs. FAIL if the removal succeeds, the answer is accepted, the item closes or a resume runs.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I removed myself from the channel roster. Show me my chat can no longer answer my bot, and that the bot is still waiting.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. `STUB:decide=` makes it print the decision marker, and each `STUB:option=` adds one choice.

> **No real account.** The terminal channel needs no account, so this scenario runs on the fake transport. A scenario that names a real Telegram, Slack, Signal or WhatsApp account records `SKIP` with the missing account as its blocker.

### Commands

Run from the repository root in a POSIX shell. One block, ten turns.

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
# 2. Commit the world and define two helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "bot world"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
items() { "$NODE" -e 'const fs=require("fs"),p=require("path");const d=process.argv[1];for(const f of fs.readdirSync(d)){if(!f.endsWith(".json"))continue;const i=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([i.id,String(i.state),JSON.stringify(i.answer),JSON.stringify(i.grants??null)].join(" | "))}' "$W"/state/*/needs-you; }
# 3. Turn 1: add an owner.
pbots channel roster add ada --role owner; echo "exit=$?"
# 4. Turn 2: add a member.
pbots channel roster add bob --role member; echo "exit=$?"
# 5. Turn 3: list the roster.
pbots channel roster list; echo "exit=$?"
cat "$W/state/local%2Fbots-playbook/operators.json"
# 6. Turn 4: try to remove the only owner.
pbots channel roster remove ada; echo "exit=$?"
# 7. Turn 5: link a terminal chat to the operator.
CODE="$(pbots channel link terminal | tr -dc '0-9')" && echo "code: $CODE"
printf '%s\n' "$CODE" | pbots channel listen terminal; echo "exit=$?"
# 8. Turn 6: send a message that parks the bot.
printf 'Prepare the release notes.\n' | pbots channel listen terminal; echo "exit=$?"
items
# 9. Turn 7: move the owner role to the member and remove the first actor.
pbots channel roster add bob --role owner; echo "exit=$?"
pbots channel roster remove ada; echo "exit=$?"
pbots channel roster list; echo "exit=$?"
# 10. Turn 8: answer the open prompt from the chat that is no longer on the roster.
printf '1\n' | pbots channel listen terminal; echo "exit=$?"
# 11. Turn 9: read the item, which must be unchanged.
items
# 12. Turn 10: drain, which must run nothing.
pbots drain; echo "exit=$?"
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots items
```

### Turn 1 and turn 2 -- the roster is built

- Expected: `exit=0` on both adds, with a line naming the actor and the role.

### Turn 3 -- the list prints one owner and one member

- Expected: a line naming `ada` as the owner and a line naming `bob` as a member.
- Expected: `operators.json` holds `{"owner": "ada", "members": ["bob"]}`.

### Turn 4 -- the last owner cannot be removed

- Expected: `bots: channel-roster-owner` and `exit=4`, with `operators.json` unchanged.

### Turn 5 -- the chat links

- Expected: a six-digit code and `exit=0` on the code send.

### Turn 6 -- the message parks the bot

- Expected: a line naming the run and the item, the numbered prompt, and `exit=0`.
- Expected: the `items` line reads `open` with a `null` answer.

### Turn 7 -- the roster moves

- Expected: `exit=0` on the owner add, `exit=0` on the removal, and a list naming `bob` as the owner with no member.

### Turn 8 -- the answer is refused

- Expected: `bots: answer-not-approver` and `exit=4`.

### Turn 9 -- the item is unchanged

- Expected: the same `items` line as turn 6, still `open`, still a `null` answer and still a `null` scope.

### Turn 10 -- nothing runs

- Expected: `exit=0` and no `<request id> ran` line, because no resume was queued.

### Expected

- `exit=0` on both roster adds and on the list.
- `bots: channel-roster-owner` and `exit=4` on the last-owner removal.
- `bots: answer-not-approver` and `exit=4` on the answer.
- The item still `open` with a `null` answer after the refused answer.
- No `ran` line on the drain.

### Evidence

Both roster adds with their exits, the list output, the whole `operators.json`, the last-owner refusal with its exit, the code and the link send, the park line, the `items` dump before and after the refused answer, the refusal line with its exit and the drain output.

### Pass / Fail

- **Pass**: the roster verbs work, the last-owner removal exits 4, the non-approver answer exits 4, the item is unchanged and no resume runs.
- **Fail**: the removal succeeds, the answer is accepted, the item closes, the scope is written or a resume runs.
- **Skip**: only when `node` or `git` is unavailable, or when the `channel` verb is missing its `roster` subcommand, naming the missing subcommand and phase 011 as the blocker.

### Failure Triage

1. `bots: unknown verb: channel`: phase 011 has not landed. Read the verb table in `.skilled/bin/bots.cjs`.
2. The removal exits 0: the last-owner guard is missing. Read the `channel-roster-owner` row in `specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md`.
3. The answer exits 0: the roster check runs after the write or not at all. Read the check order in `answer.ts` and confirm it runs before the answer is written.
4. The answer exits 4 with `channel-roster-missing`: the roster file is unreadable. Check the path under the identity's state root.
5. The item's `by` names `bob`: the actor came from the roster rather than from the link record. Read `isApprover` and confirm it resolves the sender id through the link first.
6. A resume runs: the refusal happens after the request is built. Read the order in `specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `conversations/channel-non-approver.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | Owns the channel verb and its roster subcommands |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/channel.ts` | Owns `operators.json` and `isApprover` |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Runs the roster check before the write |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/channel-terminal.ts` | Reads stdin lines and passes the linked actor |

The approver rule is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:187]. The roster verbs are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:207]. The check order and the surface argument are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:208].

---

## 5. SOURCE METADATA

- Group: Conversations
- Playbook ID: BOT-034
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `conversations/channel-non-approver.md`
