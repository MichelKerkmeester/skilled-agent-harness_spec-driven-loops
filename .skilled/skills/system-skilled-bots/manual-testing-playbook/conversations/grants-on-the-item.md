---
title: "BOT-030 -- The grant rides on the item, on the inbox line and on the resumed run"
description: "This scenario proves that a parked item carries a `grants` object with its action kind, its rung and a null scope, that `bots inbox` prints that grant on the item's own line, that `bots inbox --json` carries the same object, and that an item written before the grant existed reads with `grants: null`."
version: 1.0.0.0
---

# BOT-030 -- The grant rides on the item, on the inbox line and on the resumed run

This document is the execution contract for `BOT-030`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator parks one question and reads it three ways: the plain inbox line, the JSON inbox and the item file. The grant is present in all three and its scope is null while the item is open. The operator then copies the item without its `grants` key to stand in for an item written before this phase, and the inbox still lists it. The answer closes the loop, and the resumed run's record carries the same grant.

### Why This Matters

A grant that lives only in the run record cannot be read before the run happens, so the operator cannot see what kind of action they are about to allow. A grant that lives only in the item cannot be read after the item is gone, so the audit trail loses it. The two surfaces have to agree, and an inbox holding items from an older state root must keep listing rather than fail on a missing key.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the item, the inbox line, the JSON inbox and the resumed run all carry one grant, and a pre-phase item reads with `grants: null`.
- Real user request: `Before I answer my bot, show me what kind of action it is asking about. Then show me the same thing after I answer.`
- Prompt: `Before I answer my bot, show me what kind of action it is asking about. Then show me the same thing after I answer.`
- Expected execution process: build the world with a bot that asks, park a question, read the plain inbox, read the JSON inbox, copy the item without its `grants` key and read the inbox again, answer the item, drain, then read the run record.
- Expected signals: the plain inbox line carries the action kind, the rung and `-` for the scope, the JSON row carries a `grants` object with six keys, the copied item lists with `grants` reading `null`, and the resumed run's `request.grant` names the same item id and kind.
- Desired user-visible outcome: the operator sees the same grant before and after the answer, and an older item still lists.
- Pass/fail: PASS if all four surfaces carry one consistent grant and the pre-phase item reads `null`. FAIL if the inbox line omits the grant, the JSON row omits it, the older item fails to list or the run record disagrees with the item.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Before I answer my bot, show me what kind of action it is asking about. Then show me the same thing after I answer.`

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
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,JSON.stringify(r.request&&r.request.grant||null)].join(" | "))}' "$W"/state/*/records; }
grants() { "$NODE" -e 'const fs=require("fs"),p=require("path");const d=process.argv[1];for(const f of fs.readdirSync(d)){if(!f.endsWith(".json"))continue;const i=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([i.id,String(i.state),JSON.stringify(i.grants??null)].join(" | "))}' "$W"/state/*/needs-you; }
# 3. Turn 1: park the question.
pbots chat pb-ask --message "Prepare the release notes."; echo "exit=$?"
ITEM="$(ls -tr "$W"/state/*/needs-you | tail -1 | sed 's/\.json$//')" && echo "item: $ITEM"
# 4. Turn 2: read the plain inbox line.
pbots inbox; echo "exit=$?"
# 5. Turn 3: read the JSON inbox row.
pbots inbox --json; echo "exit=$?"
# 6. Turn 4: stand in for an item written before the grant existed.
"$NODE" -e 'const fs=require("fs");const [src,dst]=process.argv.slice(1);const i=JSON.parse(fs.readFileSync(src,"utf8"));delete i.grants;i.id=i.id+"-legacy";fs.writeFileSync(dst,JSON.stringify(i,null,2)+"\n")' "$ITEM.json" "$W/state/local%2Fbots-playbook/needs-you/legacy-item.json"
pbots inbox --json; echo "exit=$?"
grants
# 7. Turn 5: answer the open item.
pbots answer "$ITEM" "ship now" --scope once; echo "exit=$?"
grants
# 8. Turn 6: drain the resume.
pbots drain; echo "exit=$?"
# 9. Turn 7: read the grant the resumed run carried.
records
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records grants
```

### Turn 1 -- the question parks

- Expected: `bots: pb-ask run <run id> is waiting on a decision: item <item id>. See bots inbox.` and `exit=5`.

### Turn 2 -- the plain line carries the grant

- Expected: one `open` line naming `pb-ask`, the question and both options, and on that same line the action kind, the rung and `-` where the scope would sit.
- Expected: `exit=0`.

### Turn 3 -- the JSON row carries the same grant

- Expected: a JSON object whose `items` array holds one row, and that row's `grants` object holds `kind`, `action`, `rung`, `scope`, `grantedBy` and `grantedAt`.
- Expected: `scope`, `grantedBy` and `grantedAt` all read `null`, and `action` repeats the question clipped to 120 characters.

### Turn 4 -- an item without the key still lists

- Expected: the JSON inbox now holds two rows, and the row whose id ends `-legacy` carries `grants` reading `null`.
- Expected: the `grants` helper prints two lines, the second ending in `null`, and neither command fails.

### Turn 5 -- the answer fills the grant

- Expected: `bots: item <item id> answered; resume request <request id> enqueued` and `exit=0`.
- Expected: the `grants` helper now prints `"scope":"once"` with a `grantedBy` naming the operator and a `grantedAt` timestamp for the open item, and `null` for the legacy item.

### Turn 6 -- the resume runs

- Expected: `<request id> ran` and `exit=0`.

### Turn 7 -- the run record agrees with the item

- Expected: one record line ending in a `request.grant` object whose `itemId` is the parked item's id, whose `kind` equals the item's `grants.kind`, whose `scope` is `once` and whose `by` names the operator.

### Expected

- One plain inbox line carrying the kind, the rung and `-`.
- One JSON row with a six-key `grants` object whose scope is `null`.
- Two JSON rows after the legacy copy, the second with `grants` reading `null`.
- `"scope":"once"` on the item after the answer.
- One `request.grant` on the run record naming the same item id and kind.

### Evidence

The park line with its exit, the plain inbox output, both JSON inbox outputs, both `grants` helper outputs and the record line. The item id must match across the park line, the `item` echo, the JSON row and the `request.grant` object.

### Pass / Fail

- **Pass**: the item, the plain line, the JSON row and the run record carry one consistent grant, and the item without the key reads `null` and still lists.
- **Fail**: the plain line omits the grant, the JSON row omits it, the older item fails to list or the run record disagrees with the item.
- **Skip**: only when `node` or `git` is unavailable, or when the `grants` key is missing from the item writer, naming the missing key and phase 006 as the blocker.

### Failure Triage

1. The plain line carries no kind: the row renderer was not extended. Read the inbox row format in `specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md` section 3.
2. The JSON row has no `grants`: the item writer does not fill it. Read the needs-you gate in `needs-you.ts`.
3. The legacy item fails to list: the reader treats `grants` as required. Read the nullability column for `grants` in `specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md` section 1 and make the key optional, because an item written before 006 carries no `grants`.
4. The item reads `once` but the record reads `null`: the resume stamp runs before the answer writes the grant. Read the order in `specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md`.
5. `grants.kind` reads `decision`: the reader took the item's review kind. Read the two-vocabulary note in `specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md` section 3.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `conversations/grants-on-the-item.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | Owns the inbox verb and its `--json` flag |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Writes and lists the item and its grant |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Writes the grant and stamps it on the resume request |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor` | The stand-in executor, so no model is called |

The item's grant field table is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:159]. The inbox line and JSON rule is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:170]. The pre-phase item rule is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:171].

---

## 5. SOURCE METADATA

- Group: Conversations
- Playbook ID: BOT-030
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `conversations/grants-on-the-item.md`
