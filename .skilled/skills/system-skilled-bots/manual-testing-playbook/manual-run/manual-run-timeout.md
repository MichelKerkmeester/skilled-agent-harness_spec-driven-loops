---
title: "BOT-013 -- A run past its timeout fails with an environment class"
description: "This scenario validates the manual runner for `BOT-013`. It focuses on a run that outlives `timeoutSeconds` being stopped at the bound and recorded as a timeout."
version: 1.0.0.0
---

# BOT-013 -- A run past its timeout fails with an environment class

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BOT-013`.

---

## 1. OVERVIEW

The bot declares `timeoutSeconds: 5` and its executor sleeps for 30 seconds. The runner must stop the child at the bound, exit 1 and record the run as `timeout` in the `environment` class.

### Why This Matters

An unattended run that hangs holds its lease and its slot. The bound is the only thing that ends it, and the record must say why the run ended.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BOT-013` and confirm the expected signals without contradictory evidence.

- Objective: Prove the runner stops a child at `timeoutSeconds` and records the stop as a timeout.
- Real user request: `My bot hangs. Show me the runner stops it at the timeout and says so.`
- Prompt: `My bot hangs. Show me the runner stops it at the timeout and says so.`
- Expected execution process: build the world with a slow bot, time one run, read the record, then remove the world.
- Expected signals: stderr `bots: pb-slow run <run id> failed: timeout (class environment)` with `exit=1`, after roughly 5 seconds and well under 30.
- Desired user-visible outcome: the operator sees the hang ended at the bound, with the reason named.
- Pass/fail: PASS if exit 1, the timeout line, a wall time under 30 seconds and a record with reason `timeout` and class `environment`. FAIL if the run waits the full 30 seconds, completes or names another reason.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `My bot hangs. Show me the runner stops it at the timeout and says so.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that reads the `STUB:` lines in the bot body and never calls a model. `STUB:sleep=30` makes it sleep for 30 seconds.

### Commands

Run from the repository root in a POSIX shell.

```bash
# 1. Build a throwaway world: a checkout, a home, a state root and a run tree, all under one temp folder.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-slow" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-slow\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\nbudget: {timeoutSeconds: 5}\n---\nWork through the backlog.\nSTUB:sleep=30\n' > "$W/checkout/bots/pb-slow/BOT.md"
# 2. Commit the world (the run binds its result to HEAD) and define two helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "bot world"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,String(r.exit.class),JSON.stringify(r.delivery),String(r.evidence.worktreePath),JSON.stringify(r.evidence.worktree??null)].join(" | "))}' "$W"/state/*/records; }
# 3. Time one run, then read the record.
START=$(date +%s); pbots run pb-slow; echo "exit=$? seconds=$(( $(date +%s) - START ))"
records
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records
```

### Expected

- `bots: pb-slow run <run id> failed: timeout (class environment)` and `exit=1`.
- `seconds=` well under 30.
- `records` prints one line: `<run id> | pb-slow | timeout | environment | ...`.

### Evidence

The run line, the `exit=` and `seconds=` values and the `records` line.

### Pass / Fail

- **Pass**: exit 1, the timeout line, under 30 seconds and the matching record.
- **Fail**: the run lasts 30 seconds or more, completes, or records another reason or class.
- **Skip**: only when node or git is unavailable, or the repository path itself contains an executor word, naming that blocker.

### Failure Triage

1. Reason `maxDurationReached` with class `budget` means the duration budget was the tighter bound. Check that `maxDurationMinutes` was left at its default.
2. A run that waits the full 30 seconds: read how `runtime/lib/dispatch.ts` passes `boundSeconds` to the audited runner.
3. Exit 3: the recursion guard fired. Check the shell ancestry and the temp path.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `manual-run/manual-run-timeout.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | Classes a timeout by its bound |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Picks the tighter of timeout and duration budget |
| `.skilled/bin/bots.cjs` | Prints the failure line and maps it to exit 1 |
| `.skilled/skills/system-skilled-bots/runtime/tests/runner-hardening.vitest.ts` | Automated runner bound coverage |

---

## 5. SOURCE METADATA

- Group: Manual Run
- Playbook ID: BOT-013
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `manual-run/manual-run-timeout.md`
