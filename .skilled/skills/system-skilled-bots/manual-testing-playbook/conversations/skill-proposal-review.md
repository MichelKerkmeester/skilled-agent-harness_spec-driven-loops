---
title: "BOT-032 -- A skill proposal writes a draft and a review item, and a stale target is refused"
description: "This scenario proves that `bots skill propose <run-id>` writes a draft and a `proposal.json` with five keys, writes one `skill-proposal` item under the `skill-proposals` sentinel, refuses a run id with no record, and refuses `proposal-stale` when the target changed after the proposal was read."
version: 1.0.0.0
---

# BOT-032 -- A skill proposal writes a draft and a review item, and a stale target is refused

This document is the execution contract for `BOT-032`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator runs a bot, then asks the CLI to turn that run into a skill proposal. The verb writes a draft `SKILL.md` and a `proposal.json` under the identity's proposals folder, and one review item under the `skill-proposals` sentinel. The operator reads the draft, asks for a proposal from a run id that does not exist and is refused, then creates the target file the proposal read as absent and answers the item. The answer is refused `proposal-stale` and the item stays open.

### Why This Matters

A proposal that writes straight into the skills tree is a bot editing its own instructions. The draft plus the review item is the seam that keeps that write with the operator. The stale check matters because the operator may edit the target between the proposal and the answer, and an answer that overwrites that edit loses work the operator did by hand.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the propose verb writes a draft and a five-key `proposal.json`, writes one review item, refuses an unknown run id and refuses a stale target.
- Real user request: `My bot wrote something worth keeping as a skill. Draft it, show me the draft, then refuse it because I changed the file in the meantime.`
- Prompt: `My bot wrote something worth keeping as a skill. Draft it, show me the draft, then refuse it because I changed the file in the meantime.`
- Expected execution process: build the world, run the bot, propose a skill from that run, read the draft and the proposal file, propose from a run id with no record, create the target file, answer the item, then read the item again.
- Expected signals: the propose exits 0 and prints the draft path, `proposal.json` holds five keys with `revisionRead` reading `null`, the inbox lists one `skill-proposal` item under `skill-proposals`, the unknown run id exits 4 with `run-record-missing`, and the answer exits 4 with `proposal-stale` while the item stays open.
- Desired user-visible outcome: the operator sees a draft they can read, one review item and two refusals that wrote nothing.
- Pass/fail: PASS if the draft and the five-key proposal file exist, one review item is written, both refusals exit 4 and the item stays open after the stale answer. FAIL if the verb writes into the skills tree, the proposal file carries another key count, either refusal exits 0 or the stale answer closes the item.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `My bot wrote something worth keeping as a skill. Draft it, show me the draft, then refuse it because I changed the file in the meantime.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. The stub prints one line of answer text, which is all the propose verb needs from the record.

### Commands

Run from the repository root in a POSIX shell. One block, seven turns.

```bash
# 1. Build a throwaway world with one bot.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-ask" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-ask\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nPrepare the release notes.\n' > "$W/checkout/bots/pb-ask/BOT.md"
# 2. Commit the world and define three helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "bot world"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,String(r.exit.class)].join(" | "))}' "$W"/state/*/records; }
items() { "$NODE" -e 'const fs=require("fs"),p=require("path");const d=process.argv[1];for(const f of fs.readdirSync(d)){if(!f.endsWith(".json"))continue;const i=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([i.id,i.botId,String(i.kind),String(i.state),JSON.stringify(i.options),JSON.stringify(i.grants??null)].join(" | "))}' "$W"/state/*/needs-you; }
# 3. Turn 1: run the bot so a record exists to propose from.
pbots run pb-ask; echo "exit=$?"
RUN_ID="$(ls -tr "$W"/state/*/records | tail -1 | sed 's/\.json$//')" && echo "run: $RUN_ID"
# 4. Turn 2: propose a skill from that run.
pbots skill propose "$RUN_ID" --name pb-notes; echo "exit=$?"
# 5. Turn 3: read the draft and the proposal file.
find "$W/state" -path '*proposals*' -type f | sort
cat "$W/state/local%2Fbots-playbook/proposals/$RUN_ID/proposal.json"
head -12 "$W/state/local%2Fbots-playbook/proposals/$RUN_ID/SKILL.md"
# 6. Turn 4: read the review item the verb wrote.
pbots inbox; echo "exit=$?"
items
# 7. Turn 5: propose from a run id with no record.
pbots skill propose no-such-run --name pb-notes; echo "exit=$?"
# 8. Turn 6: create the target the proposal read as absent, then answer.
mkdir -p "$W/checkout/.skilled/skills/pb-notes"
printf -- '---\nname: pb-notes\ndescription: "Hand written after the proposal was read."\n---\n\n# pb-notes\n' > "$W/checkout/.skilled/skills/pb-notes/SKILL.md"
pbots answer "$RUN_ID" confirm; echo "exit=$?"
items
# 9. Turn 7: confirm nothing was written into the skills tree.
cat "$W/checkout/.skilled/skills/pb-notes/SKILL.md"
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records items
```

### Turn 1 -- the run completes

- Expected: `bots: pb-ask run <run id> completed` and `exit=0`, then `run: <run id>` naming the same id.

### Turn 2 -- the proposal is written

- Expected: `exit=0` and a line naming the draft path under the identity's `proposals/<run id>/SKILL.md`.

### Turn 3 -- the draft and the five-key file exist

- Expected: two files under `proposals/<run id>/`, one named `SKILL.md` and one named `proposal.json`.
- Expected: `proposal.json` holds exactly the keys `schemaVersion`, `targetPath`, `revisionRead`, `runId` and `botId`, with `schemaVersion` reading `1`, `targetPath` reading `$W/skilled/.skilled/skills/pb-notes/SKILL.md`, `revisionRead` reading `null`, `runId` matching the run and `botId` reading `pb-ask`.
- Expected: the draft's first lines carry a `name` and a `description` in frontmatter.

### Turn 4 -- one review item under the sentinel

- Expected: one inbox line naming `skill-proposals` rather than `pb-ask`, carrying the question and both options.
- Expected: the `items` line carries `skill-proposal` as its kind, `open` as its state, the run id as its id and a `grants` object with an open scope.

### Turn 5 -- an unknown run id is refused

- Expected: `bots: run-record-missing` and `exit=4`, with no new folder under `proposals/`.

### Turn 6 -- the stale target is refused

- Expected: `bots: proposal-stale` and `exit=4`.
- Expected: the item is still `open`, so the operator can propose again.

### Turn 7 -- the hand edit survives

- Expected: the file still carries the description `Hand written after the proposal was read.`, so the refused answer wrote nothing.

### Expected

- `exit=0` on the run and on the propose.
- Two files under `proposals/<run id>/` and a five-key `proposal.json` with `revisionRead` reading `null`.
- One `skill-proposal` item under `skill-proposals`.
- `bots: run-record-missing` and `exit=4` on the unknown run id.
- `bots: proposal-stale` and `exit=4` on the answer, with the item still open and the hand edit intact.

### Evidence

The run line with its exit, the propose line with its exit, the file listing, the whole `proposal.json`, the draft's first lines, the inbox output, the `items` dump before and after the answer, both refusal lines with their exits and the final `cat` of the hand-edited file.

### Pass / Fail

- **Pass**: the draft and the five-key file exist, one review item is written, both refusals exit 4 and the item stays open after the stale answer.
- **Fail**: the verb writes into the skills tree, the proposal file carries another key count, either refusal exits 0, the stale answer closes the item or the hand edit is lost.
- **Skip**: only when `node` or `git` is unavailable, or when the `skill` verb is missing from the CLI's verb table, naming the missing verb and phase 009 as the blocker.

### Failure Triage

1. `bots: unknown verb: skill`: phase 009 has not landed. Read the verb table in `.skilled/bin/bots.cjs`.
2. No `proposal.json`: the writer is missing. Read the propose branch in the skills module.
3. `revisionRead` reads a digest rather than `null`: the target existed when it should not. Check that the world's checkout holds no `.skilled/skills/pb-notes` before turn 6.
4. The item's `botId` reads `pb-ask`: the sentinel is not applied. Read the `skill-proposals` constant in `needs-you.ts`.
5. The answer exits 0: the pin is checked after the write. Read the claim step in `specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md` section 3.
6. The hand edit is gone: the answer wrote the draft over the target. Read the settle step and confirm it writes only on a matching digest.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `conversations/skill-proposal-review.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | Owns the skill verb and the answer verb |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/skills.ts` | Writes the draft and the proposal file |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Writes the review item and its sentinel |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Runs the claim and settle steps |

The propose rule and the five keys are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:163]. The review item rule is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:164]. The stale refusal is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:165].

---

## 5. SOURCE METADATA

- Group: Conversations
- Playbook ID: BOT-032
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `conversations/skill-proposal-review.md`
