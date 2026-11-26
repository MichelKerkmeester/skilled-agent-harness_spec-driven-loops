---
title: "BOT-029 -- A denied scope records a denial and an unsupported scope is refused"
description: "This scenario proves that `--scope deny` records a denial on the item's grant, that `--scope always` is refused `grant-scope-unsupported` with exit 2 and leaves the item open, and that a bare `no` records a denial with no scope flag."
version: 1.0.0.0
---

# BOT-029 -- A denied scope records a denial and an unsupported scope is refused

This document is the execution contract for `BOT-029`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator parks two questions and answers them three ways. The first answer passes `--scope deny`. The second passes `--scope always`, which the verb refuses. The third passes the text `no` with no scope flag. Both items end with a grant whose scope is `deny`, and the refused answer leaves its item open.

### Why This Matters

A denial recorded as an approval is the worst failure this seam can have, because the operator's refusal becomes consent. A scope the verb does not support must be refused before the write rather than stored as a value no reader understands. The bare `no` path matters because the screen and the channel grammar both send it, so a denial typed on another surface has to land as a denial here too.

---

## 2. SCENARIO CONTRACT

- Objective: Prove `--scope deny` and a bare `no` both record `deny`, and `--scope always` is refused with exit 2 and writes nothing.
- Real user request: `I said no to my bot twice. Show me both refusals were recorded as refusals, and that a scope it does not support is rejected instead of stored.`
- Prompt: `I said no to my bot twice. Show me both refusals were recorded as refusals, and that a scope it does not support is rejected instead of stored.`
- Expected execution process: build the world with a bot that asks, park a question, answer it with `--scope deny`, park a second question, answer it with `--scope always`, answer it again with the text `no`, then drain and read the run records.
- Expected signals: the first answer exits 0 and its grant reads `deny`, the `--scope always` answer exits 2 with `bots: --scope takes once or deny` and the item stays open, the bare `no` answer exits 0 and its grant reads `deny`, and both run records carry a `request.grant` object whose scope is `deny`.
- Desired user-visible outcome: the operator sees two denials recorded as denials and one unsupported scope rejected without a write.
- Pass/fail: PASS if both denials read `deny` on the item and on the run record, and the unsupported scope exits 2 with the item still open. FAIL if any denial reads `once`, the unsupported scope exits 0 or the item closes on the refused answer.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I said no to my bot twice. Show me both refusals were recorded as refusals, and that a scope it does not support is rejected instead of stored.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. `STUB:decide=` makes it print the decision marker, and each `STUB:option=` adds one choice.

### Commands

Run from the repository root in a POSIX shell. One block, seven turns.

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
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,String(r.exit.class),JSON.stringify(r.request&&r.request.grant||null)].join(" | "))}' "$W"/state/*/records; }
item() { "$NODE" -e 'const fs=require("fs"),p=require("path");const d=process.argv[1];for(const f of fs.readdirSync(d)){if(!f.endsWith(".json"))continue;const i=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([i.id,String(i.state),JSON.stringify(i.answer),JSON.stringify(i.grants??null)].join(" | "))}' "$W"/state/*/needs-you; }
# 3. Turn 1: park the first question.
pbots chat pb-ask --message "Prepare the release notes."; echo "exit=$?"
ITEM1="$(ls -tr "$W"/state/*/needs-you | tail -1 | sed 's/\.json$//')" && echo "item1: $ITEM1"
# 4. Turn 2: answer it with the scope deny.
pbots answer "$ITEM1" "wait for review" --scope deny; echo "exit=$?"
item
# 5. Turn 3: park the second question.
pbots chat pb-ask --message "Prepare the release notes."; echo "exit=$?"
ITEM2="$(ls -tr "$W"/state/*/needs-you | tail -1 | sed 's/\.json$//')" && echo "item2: $ITEM2"
# 6. Turn 4: ask for a scope the verb does not support.
pbots answer "$ITEM2" "ship now" --scope always; echo "exit=$?"
item
# 7. Turn 5: answer the same item with a bare no.
pbots answer "$ITEM2" "no"; echo "exit=$?"
item
# 8. Turn 6: drain both resumes.
pbots drain; echo "exit=$?"
# 9. Turn 7: read the grant each resumed run carried.
records
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records item
```

### Turn 1 -- the first question parks

- Expected: `bots: pb-ask run <run id> is waiting on a decision: item <item id>. See bots inbox.` and `exit=5`.
- Expected: `item1: <item id>` names the same id the line named.

### Turn 2 -- the denial is recorded as a denial

- Expected: `bots: item <item id> answered; resume request <request id> enqueued` and `exit=0`.
- Expected: the `item` line for that id carries `"scope":"deny"` in its `grants` object and a `grantedBy` naming the operator.

### Turn 3 -- the second question parks

- Expected: a second `is waiting on a decision` line and `exit=5`, with an item id different from the first.

### Turn 4 -- the unsupported scope is refused before the write

- Expected: `bots: --scope takes once or deny` and `exit=2`.
- Expected: the `item` line for the second id still carries `"scope":null` and a `null` answer, so the refused answer wrote nothing.

### Turn 5 -- a bare no records a denial

- Expected: `bots: item <item id> answered; resume request <request id> enqueued` and `exit=0`.
- Expected: the `item` line now carries `"scope":"deny"` and an answer whose text is `no`.

### Turn 6 -- both resumes run

- Expected: two `<request id> ran` lines and `exit=0`.

### Turn 7 -- both run records carry the denial

- Expected: two record lines, each ending in a `request.grant` object whose `scope` is `deny` and whose `kind` is one of the seven action kinds.
- Expected: the two `itemId` values in those objects are the two ids the earlier turns printed.

### Expected

- `exit=5` on turns 1 and 3, each naming an item id.
- `exit=0` on turns 2 and 5, with `"scope":"deny"` on the item.
- `bots: --scope takes once or deny` and `exit=2` on turn 4, with the item still open.
- Two `ran` lines on turn 6.
- Two `request.grant` objects with scope `deny` on turn 7.

### Evidence

The two park lines with their exits, both `item` dumps after turn 4 and after turn 5, the refusal line with its exit, the two drain lines and the two record lines. The item ids must match across the park line, the `item1` and `item2` echoes and the `request.grant` objects.

### Pass / Fail

- **Pass**: both denials read `deny` on the item and on the run record, and the unsupported scope exits 2 with the item still open.
- **Fail**: a denial reads `once`, the unsupported scope exits 0, the refused answer closes the item or a run record carries no grant.
- **Skip**: only when `node` or `git` is unavailable, or when the `answer` verb is missing its `--scope` flag, naming the missing flag and phase 006 as the blocker.

### Failure Triage

1. `bots: unknown option: --scope`: phase 001 has not landed. Read the answer verb's option table in `.skilled/bin/bots.cjs`.
2. The denial reads `once`: the NO rule is not applied. Read the scope decision in `answerItem` and the three accepted words `deny`, `no` and `n`.
3. `--scope always` exits 0: the unsupported-scope refusal is missing. Read the `grant-scope-unsupported` row in `specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md` section 4.
4. The refused answer closed the item: the refusal runs after the write. Read the order in `specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md` and move the check before the item write.
5. `request.grant` reads `null` on a resumed run: the grant is stamped on the request after the review seam. Read the resume stamp in `answer.ts`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `conversations/scope-deny-and-unsupported.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | Owns the answer verb, its `--scope` flag and its exit codes |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Writes the answer, the grant and the resume request |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Writes and lists the item |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor` | The stand-in executor, so no model is called |

The requirement this scenario proves is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:163]. The unsupported-scope refusal is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:164]. The refusal row with its exit code is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md:65].

---

## 5. SOURCE METADATA

- Group: Conversations
- Playbook ID: BOT-029
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `conversations/scope-deny-and-unsupported.md`
