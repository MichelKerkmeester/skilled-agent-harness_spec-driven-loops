---
title: "BOT-042 -- The actor rides on the run record and the answer names its approver"
description: "This scenario proves that every run record carries `actor`, that `--as` naming another person is refused `bots: --as needs a tty` with exit 2 outside a tty, that `--as` naming the OS user is accepted, that a run requested by one person and answered by another carries both names, and that `bots activity` prints the actor."
version: 1.0.0.0
---

# BOT-042 -- The actor rides on the run record and the answer names its approver

This document is the execution contract for `BOT-042`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator runs a bot and reads the record's `actor`. The operator parks a question, tries to answer it as another person and is refused because the command has no terminal. The operator answers as themselves, which is accepted, and the record carries both the requester and the approver. The activity view prints the actor on its row.

### Why This Matters

A record with no actor cannot answer who asked for a run, and a script that can claim another person's name makes every actor field a guess. The two names matter because the person who asked and the person who approved are often not the same, and a record that keeps only one loses the other.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the actor on the record, the tty refusal, the accepted self-answer and the two names on an answered run.
- Real user request: `Show me who asked for each run and who approved it, and show me a script cannot pretend to be someone else.`
- Prompt: `Show me who asked for each run and who approved it, and show me a script cannot pretend to be someone else.`
- Expected execution process: build the world, run a bot, read its record, park a question, try to answer as another person, answer as the OS user, read the record and the activity row.
- Expected signals: the first record's `actor` is the OS user, the foreign `--as` exits 2 with `bots: --as needs a tty`, the self `--as` exits 0, the resumed record carries `actor` and `answeredBy`, and the activity row prints the actor.
- Desired user-visible outcome: the operator sees who asked, who approved and a refused impersonation.
- Pass/fail: PASS if every record carries an actor, the foreign name is refused with exit 2, the self name is accepted and the answered run carries both names. FAIL if a record has no actor, the foreign name is accepted or the answered run carries one name.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show me who asked for each run and who approved it, and show me a script cannot pretend to be someone else.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **No tty.** Every command here runs from a script or a pipe, so the tty refusal is exercised rather than avoided. That is the point of the scenario: the refusal has to be provable without a terminal.

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
# 2. Commit the world and define two helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "asking bot"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
actors() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,String(r.actor),String(r.answeredBy??null),r.exit.reason].join(" | "))}' "$W"/state/*/records; }
# 3. Turn 1: run a bot and read the actor on its record.
pbots run pb-ask; echo "exit=$?"
actors
# 4. Turn 2: park a question.
pbots chat pb-ask --message "Ask a question."; echo "exit=$?"
ITEM="$(ls -tr "$W"/state/*/needs-you | tail -1 | sed 's/\.json$//')" && echo "item: $ITEM"
# 5. Turn 3: try to answer as another person with no tty.
pbots answer "$ITEM" "ship now" --as someone-else; echo "exit=$?"
# 6. Turn 4: answer as the OS user with no tty.
pbots answer "$ITEM" "ship now" --as "$(id -un)"; echo "exit=$?"
# 7. Turn 5: read the record the answer produced.
pbots drain; echo "exit=$?"
actors
# 8. Turn 6: read the actor on the activity row.
pbots activity; echo "exit=$?"
pbots activity --json | "$NODE" -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const o=JSON.parse(s);for(const g of o.groups)for(const r of g.rows)console.log([g.id,r.botId,String(r.actor),String(r.runId)].join(" | "))})'
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots actors
```

### Turn 1 -- the record carries the OS user

- Expected: `bots: pb-ask run <run id> completed` and `exit=0`, then one record line whose `actor` is `$(id -un)` and whose `answeredBy` reads `null`.

### Turn 2 -- the question parks

- Expected: `exit=5` and an item id.

### Turn 3 -- a foreign name is refused without a tty

- Expected: `bots: --as needs a tty` and `exit=2`, with the item still open.

### Turn 4 -- the OS user's own name is accepted

- Expected: `bots: item <item id> answered; resume request <request id> enqueued` and `exit=0`.

### Turn 5 -- the resumed record carries both names

- Expected: `<request id> ran` and `exit=0`, then a second record line whose `actor` is the OS user and whose `answeredBy` is also the OS user.

### Turn 6 -- activity prints the actor

- Expected: a `done` group holding both runs, and each row's `actor` reading the OS user.

### Expected

- `actor` on every record, never empty.
- `bots: --as needs a tty` and `exit=2` on the foreign name.
- `exit=0` on the self name.
- `actor` and `answeredBy` both naming the OS user on the resumed record.
- The actor printed on every activity row.

### Evidence

Both run lines with their exits, both `actors` dumps, the park line, the refusal line with its exit, the answer line, the drain line, the plain activity output and the JSON row lines.

### Pass / Fail

- **Pass**: every record carries an actor, the foreign name is refused with exit 2, the self name is accepted and the answered run carries both names.
- **Fail**: a record has no actor, the foreign name is accepted, the self name is refused or the answered run carries one name.
- **Skip**: only when `node` or `git` is unavailable, or when the `--as` flag is missing from the answer verb, naming the missing flag and phase 001 as the blocker.

### Failure Triage

1. `actor` reads `null`: the record writer does not fill it. Read the record builder and the OS user lookup.
2. The foreign name is accepted: the tty check is missing from `bots.cjs`. Read the `--as` branch and confirm it compares the name to the OS user.
3. The self name is refused: the comparison is inverted or reads the wrong user. Read the same branch.
4. `answeredBy` reads `null` on the resumed record: the answer does not stamp it. Read the resume request and the record write.
5. The activity row prints no actor: the status index summary omits it. Read the index write and the row reader.
6. The refusal exits 4 rather than 2: the tty refusal is filed as an answer refusal. Read the exit table in `specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md` section 4.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `activity/actor-on-answer-and-record.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | Owns the `--as` flag and the tty refusal |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Writes `actor` and `answeredBy` |
| `.skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` | Carries the actor in the row summary |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor` | The stand-in executor, so no model is called |

The two names on a record are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:155]. The actor in the status index is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:163]. The tty refusal is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:164].

---

## 5. SOURCE METADATA

- Group: Activity
- Playbook ID: BOT-042
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `activity/actor-on-answer-and-record.md`
