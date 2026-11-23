---
title: "BOT-016 -- A worktree bot runs in its own tree and the clean tree is removed"
description: "This scenario validates worktree isolation for `BOT-016`. It focuses on a run happening in a numbered tree outside the checkout and that tree being removed after a clean run."
version: 1.0.0.0
---

# BOT-016 -- A worktree bot runs in its own tree and the clean tree is removed

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BOT-016`.

---

## 1. OVERVIEW

A bot that declares `isolation: worktree` must run in a tree of its own under the configured worktree base, never in the operator's checkout. When the run leaves the tree clean and at its base commit, the runner removes it and records that it did.

### Why This Matters

An unattended run must never write into the tree the operator is working in. And a clean tree left behind after every run would fill the disk.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BOT-016` and confirm the expected signals without contradictory evidence.

- Objective: Prove a worktree run happens under the worktree base and a clean tree is removed, with the record saying so.
- Real user request: `Run my bot in its own worktree so it cannot touch my checkout, and clean up after.`
- Prompt: `Run my bot in its own worktree so it cannot touch my checkout, and clean up after.`
- Expected execution process: build the world with a worktree bot and an empty shared-path list, point the worktree base into the world, run the bot, read the record, list the base and the checkout's worktrees, then remove the world.
- Expected signals: the run exits 0 with `bots: pb-tree run <run id> completed`. The record's worktree path sits under `$W/wt`, its `disposition` is `removed` and its `postureSource` is `definition`.
- Desired user-visible outcome: the operator's checkout is untouched and no tree is left behind.
- Pass/fail: PASS if exit 0, the record shows a path under the base with disposition `removed`, `git worktree list` shows only the checkout and `git status` in the checkout is clean. FAIL if the run happens in the checkout, the tree is kept without a reason or a tree remains.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run my bot in its own worktree so it cannot touch my checkout, and clean up after.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model and writes nothing into its working folder, so the tree stays clean.

### Commands

Run from the repository root in a POSIX shell.

```bash
# 1. Build a throwaway world: a checkout, a home, a state root and a run tree, all under one temp folder.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-tree" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
# Worktree runs link no shared paths here, and the base sits inside the world.
printf '{"identity": "local/bots-playbook", "stateRoot": "%s", "worktreeSharedPaths": []}\n' "$W/state" > "$W/checkout/bots/config.json"
mkdir -p "$W/wt" && export SPECKIT_WORKTREE_BASE="$W/wt"
printf -- '---\nid: pb-tree\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: worktree\ndelivery: local-only\n---\nTidy the notes folder.\n' > "$W/checkout/bots/pb-tree/BOT.md"
# 2. Commit the world (the run binds its result to HEAD) and define two helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "bot world"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,String(r.exit.class),JSON.stringify(r.delivery),String(r.evidence.worktreePath),JSON.stringify(r.evidence.worktree??null)].join(" | "))}' "$W"/state/*/records; }
# 3. Run, then read the record and look for any tree left behind.
pbots run pb-tree; echo "exit=$?"
records
ls -A "$W/wt"
git -C "$W/checkout" worktree list
git -C "$W/checkout" status --short
unset SPECKIT_WORKTREE_BASE
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records
```

### Expected

- `bots: pb-tree run <run id> completed` and `exit=0`.
- `records` prints one line whose worktree path starts with the world's `wt` folder and whose worktree JSON holds `"disposition":"removed"` and `"postureSource":"definition"`.
- `ls -A` of the base lists no tree folder.
- `git worktree list` prints only the checkout itself.
- `git status --short` prints nothing.

### Evidence

The run line, the `records` line, the base listing, the worktree list and the empty status.

### Pass / Fail

- **Pass**: exit 0, a recorded path under the base, disposition `removed`, one worktree in the list and a clean checkout.
- **Fail**: the recorded path is the checkout, the disposition is `kept` or `active`, a tree folder remains or the checkout shows changes.
- **Skip**: only when node or git is unavailable, the repository path contains an executor word or the sk-git numbering script is missing, naming that blocker.

### Failure Triage

1. Exit 4 with a worktree base refusal: `SPECKIT_WORKTREE_BASE` did not reach the run. Check the `export` step.
2. Exit 4 with `worktree-shared-paths-unresolved`: the config rewrite did not land. Check `$W/checkout/bots/config.json`.
3. Disposition `kept`: read `keptReason` in the record. A tree is kept on purpose as `dirty` when it holds changes and as `ignored-changes` when its only changes are gitignored files, so check whether the stub wrote into it.
4. Read `runtime/lib/isolation.ts` for the numbering, link and removal order.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `worktree-and-delivery/worktree-run-cleans-up.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/isolation.ts` | Creates, provisions and removes the bot tree |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | The worktree evidence fields |
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` | Allocates the tree number |
| `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts` | Automated isolation coverage |

---

## 5. SOURCE METADATA

- Group: Worktree And Delivery
- Playbook ID: BOT-016
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `worktree-and-delivery/worktree-run-cleans-up.md`
