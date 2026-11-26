---
title: "BOT-031 -- A remember line becomes a proposal and only confirm appends it"
description: "This scenario proves that a `[REMEMBER]` line in a clean run's answer writes a `memory-proposal` item under the `memory-proposals` sentinel, that an answer other than `confirm` or `reject` is refused `review-answer-invalid` with exit 4, that `confirm` appends the fact with its actor and source, and that `reject` appends nothing."
version: 1.0.0.0
---

# BOT-031 -- A remember line becomes a proposal and only confirm appends it

This document is the execution contract for `BOT-031`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator runs a bot whose answer carries a `[REMEMBER]` line. The run ends `completed` and the line becomes a `memory-proposal` item rather than a memory entry. The operator tries an answer the item does not offer, is refused, then confirms. The fact lands in the bot's memory file with the operator as actor. A second run proposes another fact, the operator rejects it, and the file is unchanged.

### Why This Matters

A bot that writes its own memory is a bot that can be talked into remembering anything a page told it. The proposal is the seam that keeps the write with the operator. The refusal of a third answer matters because a review item with two options must not accept a third, and the reject path matters because a rejection that appends is the same failure as an approval that appends.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a `[REMEMBER]` line writes a proposal item, only `confirm` appends, `reject` appends nothing and a third answer is refused with exit 4.
- Real user request: `My bot wants to remember something. Show me the proposal, refuse a bad answer, then let me confirm one and reject another.`
- Prompt: `My bot wants to remember something. Show me the proposal, refuse a bad answer, then let me confirm one and reject another.`
- Expected execution process: build the world with a bot whose executor prints a `[REMEMBER]` line, run it, read the inbox, answer with a word the item does not offer, confirm, list the memory, run again, reject, then list the memory again.
- Expected signals: the run ends `completed` with exit 0, the inbox lists one `memory-proposal` item under `memory-proposals` with both options, the bad answer exits 4 with `review-answer-invalid`, the confirm appends one entry naming the operator and `bot:pb-ask`, and the reject leaves the entry count unchanged.
- Desired user-visible outcome: the operator sees one fact accepted and one refused, with the memory file holding only the accepted one.
- Pass/fail: PASS if the proposal is written, the bad answer exits 4, confirm appends one entry and reject appends none. FAIL if the run parks as a decision, the bad answer is accepted, reject appends or the entry carries no actor.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `My bot wants to remember something. Show me the proposal, refuse a bad answer, then let me confirm one and reject another.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** This scenario writes its own three-line executor at `$W/bin/codex`, ahead of the shipped stub on PATH, because the shipped stub has no `[REMEMBER]` directive. The stand-in reads the prompt from stdin, discards it and prints one `[REMEMBER]` line, so no model is called.

### Commands

Run from the repository root in a POSIX shell. One block, eight turns.

```bash
# 1. Build a throwaway world with one bot and a stand-in executor.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-ask" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state" "$W/bin"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-ask\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nPrepare the release notes.\n' > "$W/checkout/bots/pb-ask/BOT.md"
printf '#!/bin/sh\ncat > /dev/null\nprintf "[REMEMBER] preference The release notes ship on Friday.\\n"\n' > "$W/bin/codex"
chmod +x "$W/bin/codex"
# 2. Commit the world and define three helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "bot world"
pbots() { HOME="$W/acct" PATH="$W/bin:$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,String(r.exit.class)].join(" | "))}' "$W"/state/*/records; }
items() { "$NODE" -e 'const fs=require("fs"),p=require("path");const d=process.argv[1];for(const f of fs.readdirSync(d)){if(!f.endsWith(".json"))continue;const i=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([i.id,i.botId,String(i.kind),String(i.state),JSON.stringify(i.options),String(i.proposalType),String(i.proposalFact),String(i.proposalBotId)].join(" | "))}' "$W"/state/*/needs-you; }
# 3. Turn 1: run the bot, whose answer carries a remember line.
pbots run pb-ask; echo "exit=$?"
records
# 4. Turn 2: read the proposal the run wrote.
pbots inbox; echo "exit=$?"
items
# 5. Turn 3: answer with a word the item does not offer.
ITEM1="$(ls -tr "$W"/state/*/needs-you | tail -1 | sed 's/\.json$//')" && echo "item1: $ITEM1"
pbots answer "$ITEM1" maybe; echo "exit=$?"
items
# 6. Turn 4: confirm the proposal.
pbots answer "$ITEM1" confirm; echo "exit=$?"
items
# 7. Turn 5: list the memory the confirm wrote.
pbots remember --list; echo "exit=$?"
# 8. Turn 6: run again and reject the second proposal.
pbots run pb-ask; echo "exit=$?"
ITEM2="$(ls -tr "$W"/state/*/needs-you | tail -1 | sed 's/\.json$//')" && echo "item2: $ITEM2"
pbots answer "$ITEM2" reject; echo "exit=$?"
# 9. Turn 7: list the memory again, which must be unchanged.
pbots remember --list; echo "exit=$?"
# 10. Turn 8: read both run records.
records
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records items
```

### Turn 1 -- the run completes and writes a proposal

- Expected: `bots: pb-ask run <run id> completed` and `exit=0`, not a park and not exit 5.
- Expected: the record line's `exit.reason` reads `completed`.

### Turn 2 -- the proposal is an item under the sentinel

- Expected: one inbox line naming `memory-proposals` rather than `pb-ask`, carrying the fact and both options `confirm` and `reject`.
- Expected: the `items` line carries `memory-proposal` as its kind, `open` as its state, `["confirm","reject"]` as its options, a `proposalType` of `preference`, the fact text and `pb-ask` as `proposalBotId`.

### Turn 3 -- a third answer is refused

- Expected: `bots: review-answer-invalid` and `exit=4`.
- Expected: the item is still `open` and its options are unchanged.

### Turn 4 -- confirm closes the item

- Expected: `bots: item <item id> answered` and `exit=0`, with no `resume request` phrase, because a review item enqueues no resume.
- Expected: the item's state reads `closed` and its answer text reads `confirm`.

### Turn 5 -- the fact is in the memory file

- Expected: one entry carrying the fact, the operator as actor, `bot:pb-ask` as source and `(run <run id>)` naming the run from turn 1.

### Turn 6 -- the second proposal is rejected

- Expected: a second run completing with `exit=0`, a second item, then `bots: item <item id> answered` and `exit=0` on the reject.

### Turn 7 -- the reject appended nothing

- Expected: the same one entry as turn 5, with no second line.

### Turn 8 -- both runs completed

- Expected: two record lines, both with `exit.reason` reading `completed`.

### Expected

- `exit=0` and `completed` on both runs.
- One `memory-proposal` item under `memory-proposals` with options `["confirm","reject"]`.
- `bots: review-answer-invalid` and `exit=4` on the third answer.
- One memory entry after the confirm and the same one entry after the reject.
- No `resume request` phrase on either review answer.

### Evidence

Both run lines with their exits, both record lines, the inbox output, the three `items` dumps, the refusal line with its exit and both `remember --list` outputs. The run id in the memory entry must match the run id on the turn 1 record line.

### Pass / Fail

- **Pass**: the run completes and writes a proposal, the third answer exits 4, confirm appends one entry with its actor and source, and reject appends none.
- **Fail**: the run parks as a decision, the third answer is accepted, reject appends, the entry carries no actor or a review answer enqueues a resume.
- **Skip**: only when `node` or `git` is unavailable, or when the `remember` verb is missing from the CLI's verb table, naming the missing verb and phase 005 as the blocker.

### Failure Triage

1. `bots: unknown verb: remember`: phase 005 has not landed. Read the verb table in `.skilled/bin/bots.cjs`.
2. The run parks with exit 5: the `[REMEMBER]` line was read as a decision. Read the marker order in the dispatch module, where `[NEEDS-DECISION]` outranks `[REMEMBER]`.
3. No item is written: the proposal writer is missing. Read the clean-run branch in `needs-you.ts`.
4. The item's `botId` reads `pb-ask`: the sentinel is not applied. Read the `memory-proposals` constant in `needs-you.ts`.
5. `maybe` exits 0: the review answer is not validated. Read the `review-answer-invalid` row in `specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md`.
6. The reject appends: the settle branch does not branch on the answer. Read the review seam in `answer.ts`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `conversations/memory-proposal-confirm.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | Owns the run, answer and remember verbs |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Writes the proposal item and its sentinel |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Runs the review seam and appends the fact |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/memory.ts` | Owns the memory file and its entry shape |

The proposal rule is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:152]. The confirm and reject rule is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:153]. The sentinel and the hold filter are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:154].

---

## 5. SOURCE METADATA

- Group: Conversations
- Playbook ID: BOT-031
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `conversations/memory-proposal-confirm.md`
