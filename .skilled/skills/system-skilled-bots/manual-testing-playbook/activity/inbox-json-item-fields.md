---
title: "BOT-041 -- The JSON inbox carries ten fields and hides an answered item until all is asked"
description: "This scenario proves that `bots inbox --json` prints each open and expired item with its ten fields, that an answered item is absent until `--all` is passed, and that an item whose expiry has passed reads `expired`."
version: 1.0.0.0
---

# BOT-041 -- The JSON inbox carries ten fields and hides an answered item until all is asked

This document is the execution contract for `BOT-041`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator parks a question and reads the JSON inbox, which prints one row with ten fields. The operator answers the item, and the JSON inbox prints no row. Passing `--all` brings the answered row back with its answer. A copied item whose expiry has passed reads `expired` in the same list.

### Why This Matters

A reader that cannot see the answer an item carries cannot tell an approval from a refusal after the fact. A reader that lists answered items by default buries the open ones. The expired state matters because an item past its expiry is not waiting on anyone, and a reader that shows it as open sends the operator to answer something that can no longer be answered.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the ten fields, the answered-item filter, the `--all` flag and the expired state.
- Real user request: `Show me my open questions as JSON, then show me the one I answered, then show me one that timed out.`
- Prompt: `Show me my open questions as JSON, then show me the one I answered, then show me one that timed out.`
- Expected execution process: build the world, park a question, read the JSON inbox, answer it, read the JSON inbox again, read it with `--all`, then copy the item with a past expiry and read the list.
- Expected signals: the first read carries one row with ten fields, the second carries no row, the third carries the answered row with its answer, and the fourth carries the copied row reading `expired`.
- Desired user-visible outcome: the operator sees open, answered and expired items each in the view that is meant to show them.
- Pass/fail: PASS if the ten fields are present, the answered item is hidden until `--all`, and the past-expiry item reads `expired`. FAIL if a field is missing, an answered item shows by default or the past-expiry item reads `open`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show me my open questions as JSON, then show me the one I answered, then show me one that timed out.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. `STUB:decide=` makes it print the decision marker, and each `STUB:option=` adds one choice.

### Commands

Run from the repository root in a POSIX shell. One block, six turns.

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
printf -- '---\nid: pb-ask\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nAsk a question.\nSTUB:decide=Ship the release notes now or wait for review?\nSTUB:option=ship now\nSTUB:option=wait for review\n' > "$W/checkout/bots/pb-ask/BOT.md"
# 2. Commit the world and define one helper.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "asking bot"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
# 3. Turn 1: park a question.
pbots chat pb-ask --message "Ask a question."; echo "exit=$?"
ITEM="$(ls -tr "$W"/state/*/needs-you | tail -1 | sed 's/\.json$//')" && echo "item: $ITEM"
# 4. Turn 2: read the open item as JSON and print its keys.
pbots inbox --json; echo "exit=$?"
pbots inbox --json | "$NODE" -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const o=JSON.parse(s);console.log("version: "+o.version);console.log("keys: "+Object.keys(o.items[0]).join(","));console.log("state: "+o.items[0].state)})'
# 5. Turn 3: answer the item, then read the JSON inbox again.
pbots answer "$ITEM" "ship now" --scope once; echo "exit=$?"
pbots inbox --json; echo "exit=$?"
# 6. Turn 4: ask for the answered item too.
pbots inbox --json --all; echo "exit=$?"
pbots inbox --json --all | "$NODE" -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const o=JSON.parse(s);for(const i of o.items)console.log([i.id,i.state,JSON.stringify(i.answer)].join(" | "))})'
# 7. Turn 5: copy the item with an expiry that has passed.
"$NODE" -e 'const fs=require("fs");const [src,dst]=process.argv.slice(1);const i=JSON.parse(fs.readFileSync(src,"utf8"));i.id=i.id+"-old";i.expiresAt="1970-01-01T00:00:00.000Z";delete i.answer;fs.writeFileSync(dst,JSON.stringify(i,null,2)+"\n")' "$ITEM.json" "$W/state/local%2Fbots-playbook/needs-you/old-item.json"
pbots inbox --json; echo "exit=$?"
pbots inbox --json | "$NODE" -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const o=JSON.parse(s);for(const i of o.items)console.log([i.id,i.state,String(i.expiresAt)].join(" | "))})'
# 8. Turn 6: the plain inbox agrees.
pbots inbox; echo "exit=$?"
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots
```

### Turn 1 -- the question parks

- Expected: `bots: pb-ask run <run id> is waiting on a decision: item <item id>. See bots inbox.` and `exit=5`.

### Turn 2 -- the open row carries ten fields

- Expected: an object with `version` reading `1` and an `items` array holding one row.
- Expected: `keys:` prints `id,botId,kind,question,state,at,options,createdAt,expiresAt,answer` and `state:` prints `open`.
- Expected: `kind` reads `null`, because no phase has given the item a review kind.

### Turn 3 -- an answered item is hidden by default

- Expected: `exit=0` on the answer, then a JSON object whose `items` array is empty.

### Turn 4 -- all brings the answered row back

- Expected: one row whose `state` reads `answered` and whose `answer` object carries the text `ship now` and the scope `once`.

### Turn 5 -- a past expiry reads expired

- Expected: two rows, the answered one and the copied one, and the copied row's `state` reads `expired` with its `expiresAt` reading the past instant.

### Turn 6 -- the plain inbox agrees

- Expected: the expired item listed as expired and the answered item absent.

### Expected

- One open row with ten keys and `kind` reading `null`.
- No row after the answer.
- One answered row with its answer under `--all`.
- One expired row after the copy.
- The plain inbox agreeing with the JSON.

### Evidence

The park line with its exit, both JSON reads with their exits, the printed key list, the printed state, the answer line, the `--all` row line, the expired row line and the plain inbox output.

### Pass / Fail

- **Pass**: the ten fields are present, the answered item is hidden until `--all`, and the past-expiry item reads `expired`.
- **Fail**: a field is missing, an answered item shows by default, `--all` omits it or the past-expiry item reads `open`.
- **Skip**: only when `node` or `git` is unavailable, or when the `--json` flag is missing from the inbox verb, naming the missing flag and phase 001 as the blocker.

### Failure Triage

1. `bots: inbox takes no --json`: phase 001 has not landed. Read the inbox verb's option table in `.skilled/bin/bots.cjs`.
2. Nine keys rather than ten: `kind` is absent rather than null. Read the row builder and write the key with a null value.
3. The answered row shows without `--all`: the default filter is missing. Read the state filter.
4. `--all` shows no answered row: the flag is parsed but not passed to the reader. Read the option plumbing.
5. The past-expiry row reads `open`: the state is read from the file rather than derived from `expiresAt`. Read the derived-state function.
6. `at` differs from `createdAt`: the row copies the wrong field. Read the row builder.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `activity/inbox-json-item-fields.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | Owns the inbox verb and its two flags |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Owns the item shape and the derived state |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Writes the answer the `--all` view prints |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor` | The stand-in executor, so no model is called |

The ten fields and the three states are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:153].

---

## 5. SOURCE METADATA

- Group: Activity
- Playbook ID: BOT-041
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `activity/inbox-json-item-fields.md`
