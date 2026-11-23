---
title: "BOT-023 -- Status and the inbox agree on an open needs-you item"
description: "This scenario validates status and the inbox for `BOT-023`. It focuses on a parked run's item showing in text status, in `--json` status and in the inbox under the same item id."
version: 1.0.0.0
---

# BOT-023 -- Status and the inbox agree on an open needs-you item

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BOT-023`.

---

## 1. OVERVIEW

A run parks on a question. Text status, JSON status and the inbox are three ways to read the same fact. All three must name the same item id, and the JSON must parse.

### Why This Matters

The operator asks "what do the bots need from me" in whichever form fits. Three answers that disagree would leave the question unanswered.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BOT-023` and confirm the expected signals without contradictory evidence.

- Objective: Prove text status, JSON status and the inbox all report the parked item under one id.
- Real user request: `What do my bots need from me right now? Give it to me as JSON too.`
- Prompt: `What do my bots need from me right now? Give it to me as JSON too.`
- Expected execution process: build the world with an asking bot, run it until it parks, read text status, JSON status and the inbox, then remove the world.
- Expected signals: the run exits 5 and names an item id. Text status prints an `open` line with that item id ending `see bots inbox`. The JSON parses and holds the item id. The inbox lists the same id as `open`.
- Desired user-visible outcome: the operator sees one open question, the same in every view.
- Pass/fail: PASS if all three views carry the run's item id and the JSON parses. FAIL if any view misses the item, the ids differ or the JSON does not parse.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `What do my bots need from me right now? Give it to me as JSON too.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. `STUB:decide=` makes it ask.

### Commands

Run from the repository root in a POSIX shell.

```bash
# 1. Build a throwaway world: a checkout, a home, a state root and a run tree, all under one temp folder.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-query" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-query\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nPrepare the release notes.\nSTUB:decide=Publish the notes today?\n' > "$W/checkout/bots/pb-query/BOT.md"
# 2. Commit the world (the run binds its result to HEAD) and define two helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "bot world"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,String(r.exit.class),JSON.stringify(r.delivery),String(r.evidence.worktreePath),JSON.stringify(r.evidence.worktree??null)].join(" | "))}' "$W"/state/*/records; }
# 3. Park one run, then read all three views.
OUT="$(pbots run pb-query)"; echo "$OUT exit=$?"
ITEM="$(printf '%s\n' "$OUT" | sed -n 's/.*decision: item \([^ ]*\)\. See bots inbox\./\1/p')"; echo "item: $ITEM"
pbots status; echo "exit=$?"
pbots status --json > "$W/status.json"; echo "exit=$?"
"$NODE" -e 'const s=require("fs").readFileSync(process.argv[1],"utf8");JSON.parse(s);console.log("json ok, item present:",s.includes(process.argv[2]))' "$W/status.json" "$ITEM"
pbots inbox; echo "exit=$?"
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records
```

### Expected

- `bots: pb-query run <run id> is waiting on a decision: item <item id>. See bots inbox.` and `exit=5`, then `item: <item id>`.
- Text status: a line `open<TAB>local/bots-playbook<TAB>pb-query<TAB>item <item id><TAB>run <run id><TAB>expires ...<TAB>see bots inbox` and `exit=0`.
- JSON status: `exit=0`, then `json ok, item present: true`.
- Inbox: `open<TAB><item id><TAB>pb-query...`, the question `Publish the notes today?` and `exit=0`.

### Evidence

The run line, the item id, the text status, the JSON check line, `status.json` itself and the inbox output.

### Pass / Fail

- **Pass**: the same item id in text status, JSON status and the inbox, and the JSON parses.
- **Fail**: any view misses the item, an id differs or the JSON check throws.
- **Skip**: only when node, git or the SQLite binding is unavailable, naming that blocker.

### Failure Triage

1. An empty `ITEM`: the run did not park. Run BOT-014 first.
2. Status without the item: the index may predate the item. Run `pbots status --rebuild` and compare, then read the item rows in `runtime/lib/status-index.ts`.
3. JSON that does not parse: check `status.json` for log lines. Info lines go to stderr under `--json`, so any on stdout are a defect in `.skilled/bin/bots.cjs`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `status-and-inbox/status-json-open-item.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | The `status` and `inbox` verbs and the JSON output |
| `.skilled/skills/system-skilled-bots/runtime/lib/status.ts` | The status rows for open items |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Lists the items the inbox shows |
| `.skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` | The status mode's verb reference |
| `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts` | Automated status coverage |

---

## 5. SOURCE METADATA

- Group: Status And Inbox
- Playbook ID: BOT-023
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `status-and-inbox/status-json-open-item.md`
