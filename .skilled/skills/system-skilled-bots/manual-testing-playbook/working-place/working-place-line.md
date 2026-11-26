---
title: "BOT-046 -- The prompt names the working place, its branch and the run folder"
description: "This scenario proves that `buildBotPrompt` emits one working-place line naming the directory the child starts in, its branch and the run folder, that a worktree run names the tree rather than the checkout, that a detached HEAD drops the branch clause, and that the record's `evidence.branch` agrees with the line."
version: 1.0.0.0
---

# BOT-046 -- The prompt names the working place, its branch and the run folder

This document is the execution contract for `BOT-046`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator runs a shared bot and reads the prompt the executor received, which carries one line naming the checkout, its branch and the run folder. The operator runs a worktree bot and the same line names the tree. The operator detaches the checkout's HEAD and runs again, and the line drops the branch clause. The record's `evidence.branch` agrees with the line in each case.

### Why This Matters

A child that is told it works in the checkout while it actually works in a tree edits the wrong files, and the operator reads a report about work that landed somewhere else. The line and the child's `cwd` come from one call, so they cannot disagree. The detached case matters because a branch name that is not there must be absent rather than the literal `HEAD`, which would send the child looking for a branch nobody can check out.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the working-place line in all three cases and its agreement with the record.
- Real user request: `Show me what my bot is told about where it works, for a shared run, a worktree run and a detached checkout.`
- Prompt: `Show me what my bot is told about where it works, for a shared run, a worktree run and a detached checkout.`
- Expected execution process: build the world with a shared bot and a worktree bot, run the shared one and read its receipt, run the worktree one and read its receipt, detach the checkout and run the shared one again, then read the three records.
- Expected signals: the shared line names the checkout and its branch, the worktree line names the tree, the detached line carries no branch clause, and each record's `evidence.branch` matches its line.
- Desired user-visible outcome: the operator sees the child told the truth about where it works in all three cases.
- Pass/fail: PASS if all three lines are correct and each record agrees. FAIL if a line names the wrong directory, a detached run names `HEAD` or a record disagrees with its line.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show me what my bot is told about where it works, for a shared run, a worktree run and a detached checkout.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. The stub writes the whole prompt it received to `$HOME/stub-receipts/<run id>.json`, which is how the line is read without a model.

### Commands

Run from the repository root in a POSIX shell. One block, six turns.

```bash
# 1. Build a throwaway world with a shared bot and a worktree bot.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-shared" "$W/checkout/bots/pb-tree" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-shared\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nReport where you work.\n' > "$W/checkout/bots/pb-shared/BOT.md"
printf -- '---\nid: pb-tree\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: worktree\ndelivery: local-only\n---\nReport where you work.\n' > "$W/checkout/bots/pb-tree/BOT.md"
# 2. Commit the world and define two helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "two bots"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
lines() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,String(r.evidence.branch),String(r.evidence.worktreePath)].join(" | "))}' "$W"/state/*/records; }
promptline() { "$NODE" -e 'const fs=require("fs"),p=require("path");const d=process.argv[1];for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));const l=String(r.prompt||"").split("\n").find(x=>x.startsWith("Your working place is "));console.log(f+" :: "+String(l))}' "$W/acct/stub-receipts"; }
# 3. Turn 1: run the shared bot and read the line it was given.
pbots run pb-shared; echo "exit=$?"
promptline
# 4. Turn 2: run the worktree bot and read its line.
pbots run pb-tree; echo "exit=$?"
promptline
# 5. Turn 3: read the branch and tree each record carries.
lines
# 6. Turn 4: detach the checkout and run the shared bot again.
git -C "$W/checkout" checkout --detach -q
pbots run pb-shared; echo "exit=$?"
promptline
lines
# 7. Turn 5: the detached line carries no branch clause.
promptline | grep -c ' on branch '
# 8. Turn 6: the run folder in the line exists.
promptline | sed -n 's/.*This run.s folder is \(.*\)\.$/\1/p' | while read -r d; do [ -d "$d" ] && echo "folder ok: $d" || echo "folder missing: $d"; done
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots lines promptline
```

### Turn 1 -- the shared line names the checkout and its branch

- Expected: `bots: pb-shared run <run id> completed` and `exit=0`.
- Expected: one line reading `Your working place is <checkout> on branch <branch>. This run's folder is <run folder>.`

### Turn 2 -- the worktree line names the tree

- Expected: `exit=0` and one line whose path is the tree rather than the checkout, with the branch the tree was made on.

### Turn 3 -- the records agree

- Expected: two record lines, the shared one carrying the checkout's branch and a null tree, the worktree one carrying the tree path and its branch.

### Turn 4 -- a detached checkout drops the branch clause

- Expected: `exit=0` and a third line reading `Your working place is <checkout>. This run's folder is <run folder>.`
- Expected: the third record's `evidence.branch` reads `null`.

### Turn 5 -- no line names HEAD

- Expected: `grep -c ' on branch '` prints `2`, because only the two branch runs carry the clause.

### Turn 6 -- every run folder exists

- Expected: three `folder ok:` lines and no `folder missing:` line.

### Expected

- A shared line naming the checkout and its branch.
- A worktree line naming the tree.
- A detached line with no branch clause and a null `evidence.branch`.
- Two lines carrying ` on branch ` and one without.
- Three run folders that exist.

### Evidence

All three run lines with their exits, the three prompt lines, the three record lines, the `grep -c` count and the three folder checks.

### Pass / Fail

- **Pass**: all three lines are correct, each record agrees and every run folder exists.
- **Fail**: a line names the wrong directory, a detached run names `HEAD`, a record disagrees or a run folder is missing.
- **Skip**: only when `node` or `git` is unavailable, or when the working-place line is missing from the prompt builder, naming the missing line and phase 004 as the blocker.

### Failure Triage

1. No line starts with `Your working place is `: the line is missing from the prompt builder. Read `buildBotPrompt` and the exported prefix constant.
2. The shared line names a tree: the runner passes the wrong directory. Read the dispatch call and confirm it passes the checkout for a shared run.
3. The worktree line names the checkout: the same call passes the root rather than the tree.
4. The detached line names `HEAD`: `checkoutBranch` does not map the literal to null. Read the four null cases.
5. The line and the record disagree: the line and `evidence.branch` come from two calls. Read the runner and make them read one value.
6. A run folder is missing: the line names a folder the runner never created. Read the folder creation and the line builder.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `working-place/working-place-line.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/prompt.ts` | Owns `workingPlaceLine` and the prefix constant |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Passes the directory and the branch it resolved |
| `.skilled/skills/system-skilled-bots/runtime/lib/isolation.ts` | Owns `checkoutBranch` and its four null cases |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor` | Writes the prompt it received to a receipt |

The line and its prefix constant are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:143]. The tree-versus-checkout rule is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:144]. The resumed-run rule is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:149].

---

## 5. SOURCE METADATA

- Group: Working Place
- Playbook ID: BOT-046
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `working-place/working-place-line.md`
