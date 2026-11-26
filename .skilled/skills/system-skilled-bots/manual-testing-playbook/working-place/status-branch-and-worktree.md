---
title: "BOT-047 -- Status prints the branch and the worktree the last run recorded"
description: "This scenario proves that `bots status` prints `branch <name>` for a run that recorded a branch and `worktree <path>` for a run that recorded a tree, that `bots status --json` carries `lastRun.branch` and `lastRun.worktreePath` as a string or null, and that a bot with no run prints neither."
version: 1.0.0.0
---

# BOT-047 -- Status prints the branch and the worktree the last run recorded

This document is the execution contract for `BOT-047`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator runs a shared bot and a worktree bot, then reads the status row for each. The shared row carries `branch <name>` and the worktree row carries `worktree <path>`. The JSON form carries both fields on every row, as a string or null. A third bot with no run carries neither, and the status index still opens with its schema version unchanged.

### Why This Matters

A status row that names no branch leaves the operator unable to tell which tree a report came from, and a row that names a tree the run did not use sends them to the wrong directory. The two fields have to be present on every row rather than only on the rows that have them, because a reader that has to test for a missing key is a reader that will get it wrong once.

---

## 2. SCENARIO CONTRACT

- Objective: Prove both status parts, both JSON fields and the empty case.
- Real user request: `Show me which branch and which tree each of my bots last ran on, including the one that never ran.`
- Prompt: `Show me which branch and which tree each of my bots last ran on, including the one that never ran.`
- Expected execution process: build the world with three bots, run two of them, read the plain status, read the JSON status, then read the status index.
- Expected signals: the shared row carries `branch <name>`, the worktree row carries `worktree <path>`, every JSON row carries both keys as a string or null, the never-run row carries neither part, and the index reports schema version `2`.
- Desired user-visible outcome: the operator sees where each bot last worked and sees the never-run bot say nothing rather than guess.
- Pass/fail: PASS if both parts print on the right rows, both JSON keys are present on every row and the never-run row prints neither. FAIL if a part is missing, a JSON key is absent or the never-run row prints a part.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show me which branch and which tree each of my bots last ran on, including the one that never ran.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model.

### Commands

Run from the repository root in a POSIX shell. One block, six turns.

```bash
# 1. Build a throwaway world with a shared bot, a worktree bot and a bot that never runs.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-shared" "$W/checkout/bots/pb-tree" "$W/checkout/bots/pb-idle" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-shared\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nReport where you work.\n' > "$W/checkout/bots/pb-shared/BOT.md"
printf -- '---\nid: pb-tree\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: worktree\ndelivery: local-only\n---\nReport where you work.\n' > "$W/checkout/bots/pb-tree/BOT.md"
printf -- '---\nid: pb-idle\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nNever run.\n' > "$W/checkout/bots/pb-idle/BOT.md"
# 2. Commit the world and define one helper.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "three bots"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
# 3. Turn 1: run the shared bot and the worktree bot.
pbots run pb-shared; echo "exit=$?"
pbots run pb-tree; echo "exit=$?"
# 4. Turn 2: read the plain status rows.
pbots status; echo "exit=$?"
# 5. Turn 3: read the two parts each row carries.
pbots status | grep -E 'branch |worktree '
# 6. Turn 4: read the JSON status and its two keys.
pbots status --json; echo "exit=$?"
pbots status --json | "$NODE" -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const o=JSON.parse(s);for(const r of o.bots)console.log([r.botId,JSON.stringify(r.lastRun&&r.lastRun.branch??null),JSON.stringify(r.lastRun&&r.lastRun.worktreePath??null)].join(" | "))})'
# 7. Turn 5: the never-run row carries neither part.
pbots status | grep -A1 'pb-idle'
# 8. Turn 6: the status index still opens at its schema version.
"$NODE" -e 'const fs=require("fs"),p=require("path");const d=process.argv[1];for(const f of fs.readdirSync(d)){if(!f.endsWith(".json"))continue;const i=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log(f+" schemaVersion="+String(i.schemaVersion))}' "$W/state/index"
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots
```

### Turn 1 -- both runs complete

- Expected: two `completed` lines with `exit=0`.

### Turn 2 -- the plain rows carry their parts

- Expected: `exit=0`, a row for `pb-shared` carrying `branch <name>` and a row for `pb-tree` carrying `worktree <path>`.

### Turn 3 -- exactly two parts print

- Expected: two lines, one `branch ` and one `worktree `, and no third.

### Turn 4 -- the JSON carries both keys on every row

- Expected: three lines, one per bot, each printing a `branch` value and a `worktreePath` value.
- Expected: `pb-shared` prints a branch string and a null tree, `pb-tree` prints a branch string and a tree string, and `pb-idle` prints null for both.

### Turn 5 -- the never-run row prints neither part

- Expected: the `pb-idle` row and its continuation carry no `branch ` and no `worktree `.

### Turn 6 -- the index still opens

- Expected: one line naming the index file with `schemaVersion=2`.

### Expected

- Two `completed` runs.
- `branch <name>` on the shared row and `worktree <path>` on the tree row.
- Both JSON keys present on all three rows, null where absent.
- No part on the never-run row.
- `schemaVersion=2` on the index.

### Evidence

Both run lines with their exits, the plain status output, the two part lines, the JSON output, the three key lines, the never-run row and the index line.

### Pass / Fail

- **Pass**: both parts print on the right rows, both JSON keys are present on every row and the never-run row prints neither.
- **Fail**: a part is missing, a JSON key is absent, the never-run row prints a part or the index reports another version.
- **Skip**: only when `node` or `git` is unavailable, or when the `status` verb is missing its `--json` flag, naming the missing flag and phase 004 as the blocker.

### Failure Triage

1. No `branch ` part: the row renderer was not extended. Read the status row builder.
2. `worktree ` prints on the shared row: the tree path is read from the wrong record field. Read `evidence.worktreePath`.
3. A JSON row has no `branch` key: the reader drops an absent key rather than coalescing to null. Read `lastRunOf` and its coalesce rule.
4. The never-run row prints a part: the row reads the checkout rather than the last run. Read the row builder and confirm it reads the record.
5. The index reports another version: `SCHEMA_VERSION` moved. Read the constant and restore `'2'`.
6. An index built before this phase fails to open: the reader requires the new keys. Read the coalesce rule and make an absent key read null.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `working-place/status-branch-and-worktree.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | Owns the status verb and its `--json` flag |
| `.skilled/skills/system-skilled-bots/runtime/lib/status.ts` | Renders the row and its two parts |
| `.skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` | Carries both fields in `RunSummary` |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor` | The stand-in executor, so no model is called |

The two printed parts are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:146]. The two JSON fields are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:147]. The index fields and the coalesce rule are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:148].

---

## 5. SOURCE METADATA

- Group: Working Place
- Playbook ID: BOT-047
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `working-place/status-branch-and-worktree.md`
