---
title: "BOT-012 -- A manual run completes and leaves one record"
description: "This scenario validates the manual runner for `BOT-012`. It focuses on one dispatch, exit 0, one terminal record and a dispatch receipt under the state root."
version: 1.0.0.0
---

# BOT-012 -- A manual run completes and leaves one record

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BOT-012`.

---

## 1. OVERVIEW

An operator runs a throwaway bot by hand. The runner must dispatch the executor once, exit 0, print the run id and leave exactly one terminal record and one receipt folder under the state root.

### Why This Matters

Every other runtime behavior builds on this path. A run that completes without a record, or dispatches twice, breaks status, delivery and the queue alike.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BOT-012` and confirm the expected signals without contradictory evidence.

- Objective: Prove one manual run dispatches once, exits 0 and leaves one record and one receipt folder.
- Real user request: `Run my test bot now and show me that it finished and left a record.`
- Prompt: `Run my test bot now and show me that it finished and left a record.`
- Expected execution process: build the world, run the bot, read the record, count the stub receipts, list the receipt folder, then remove the world.
- Expected signals: stdout `bots: pb-ok run <run id> completed` with `exit=0`. `records` prints one `pb-ok` line whose exit reason is `converged` and whose class is `null`.
- Desired user-visible outcome: the operator sees the run finished and where its evidence sits.
- Pass/fail: PASS if exit 0, one record with reason `converged`, one stub receipt and one receipt folder for that run id. FAIL on any other exit, a second dispatch or a missing record.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run my test bot now and show me that it finished and left a record.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that reads the `STUB:` lines in the bot body and never calls a model. The runner, guard, records and receipts all run for real.

### Commands

Run from the repository root in a POSIX shell.

```bash
# 1. Build a throwaway world: a checkout, a home, a state root and a run tree, all under one temp folder.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-ok" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-ok\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nTidy the notes folder.\n' > "$W/checkout/bots/pb-ok/BOT.md"
# 2. Commit the world (the run binds its result to HEAD) and define two helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "bot world"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,String(r.exit.class),JSON.stringify(r.delivery),String(r.evidence.worktreePath),JSON.stringify(r.evidence.worktree??null)].join(" | "))}' "$W"/state/*/records; }
# 3. Run once, then read what the run left.
pbots run pb-ok; echo "exit=$?"
records
ls "$W/acct/stub-receipts"
ls "$W"/state/*/receipts
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records
```

### Expected

- `bots: pb-ok run <run id> completed` and `exit=0`.
- `records` prints one line: `<run id> | pb-ok | converged | null | ...`.
- `stub-receipts` holds exactly one `<run id>.json`.
- The state root's `receipts` folder holds one folder named for the same run id.

### Evidence

The run line with its exit, the `records` line and both `ls` listings. The run id must match across all four.

### Pass / Fail

- **Pass**: exit 0, reason `converged`, one stub receipt and one receipt folder, all for the same run id.
- **Fail**: any other exit, a second stub receipt, a missing record or run ids that disagree.
- **Skip**: only when node or git is unavailable, or the repository path itself contains an executor word, naming that blocker.

### Failure Triage

1. Exit 3: the recursion guard fired. Check the shell ancestry, the temp path and any executor session variables exported in the shell.
2. Exit 4 with `run-folder-refused`: the temp run tree is not ignored by git. Check `$W/skilled/.gitignore`.
3. Exit 4 with `executor-unavailable`: PATH did not reach the stub. Check `STUB_DIR`.
4. A missing record: read the record write in `runtime/lib/runner.ts` and `runtime/lib/run-record.ts`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `manual-run/manual-run-completes.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | The `bots run` verb and its exit codes |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Runs one bot once and writes its record |
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | The one headless dispatch |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Where records and receipts live |
| `.skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` | The run mode's verb and exit-code reference |
| `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts` | Automated runner coverage |

---

## 5. SOURCE METADATA

- Group: Manual Run
- Playbook ID: BOT-012
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `manual-run/manual-run-completes.md`
