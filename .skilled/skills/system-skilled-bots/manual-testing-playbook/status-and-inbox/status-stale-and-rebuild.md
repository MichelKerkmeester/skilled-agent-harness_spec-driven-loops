---
title: "BOT-022 -- Status says when its index is stale and a rebuild catches up"
description: "This scenario validates the status index for `BOT-022`. It focuses on status building its index on first read, flagging the index stale after a newer run and showing that run after a rebuild."
version: 1.0.0.0
---

# BOT-022 -- Status says when its index is stale and a rebuild catches up

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BOT-022`.

---

## 1. OVERVIEW

`bots status` reads one derived index, never the run folders. The first read builds the index. After a newer run, status must say the index is stale and name the rebuild command, and `bots status --rebuild` must bring the newer run into the row.

### Why This Matters

A status answer that is old without saying so is worse than none. The stale line is how the operator knows to rebuild.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BOT-022` and confirm the expected signals without contradictory evidence.

- Objective: Prove status flags a stale index after a newer run and a rebuild shows that run.
- Real user request: `Show me what my bot did last, and tell me if that answer is out of date.`
- Prompt: `Show me what my bot did last, and tell me if that answer is out of date.`
- Expected execution process: build the world, run the bot, read status, run it again, read status, rebuild, read the rebuilt status, then remove the world.
- Expected signals: the first status shows `index built ...` and a `pb-status` row with `last <first run id> converged`. The second shows a line starting `stale:` that ends with `run bots status --rebuild`. The rebuild prints `bots: rebuilt <index path>: 2 run row(s), 0 item row(s)` and a row with `last <second run id> converged`, with no `stale:` line.
- Desired user-visible outcome: the operator sees the latest run, or a clear note that the answer is behind.
- Pass/fail: PASS if the stale line appears only before the rebuild and the rebuilt row names the second run. FAIL if a stale index is shown without the stale line or the rebuild still names the first run.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show me what my bot did last, and tell me if that answer is out of date.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. `--rebuild` writes only the index under the world's state root.

### Commands

Run from the repository root in a POSIX shell.

```bash
# 1. Build a throwaway world: a checkout, a home, a state root and a run tree, all under one temp folder.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-status" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-status\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nTidy the notes folder.\n' > "$W/checkout/bots/pb-status/BOT.md"
# 2. Commit the world (the run binds its result to HEAD) and define two helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "bot world"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,String(r.exit.class),JSON.stringify(r.delivery),String(r.evidence.worktreePath),JSON.stringify(r.evidence.worktree??null)].join(" | "))}' "$W"/state/*/records; }
# 3. Run, read status, run again, read status.
pbots run pb-status; echo "exit=$?"
pbots status; echo "exit=$?"
pbots run pb-status; echo "exit=$?"
pbots status; echo "exit=$?"
# 4. Rebuild and read again.
pbots status --rebuild; echo "exit=$?"
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records
```

### Expected

- Both runs print `bots: pb-status run <run id> completed` with `exit=0`. Note both run ids.
- First status: `index built <time> (<index path>)` and a row for `pb-status` carrying `last <first run id> converged`, with `exit=0`.
- Second status: a line starting `stale: newer runs or items exist for local/bots-playbook` and ending `run bots status --rebuild`, with `exit=0`.
- Rebuild: `bots: rebuilt <index path>: 2 run row(s), 0 item row(s)`, a row carrying `last <second run id> converged`, no `stale:` line and `exit=0`.

### Evidence

Both run lines and all three status outputs, with exits.

### Pass / Fail

- **Pass**: the stale line appears only in the second status, and the rebuilt row names the second run.
- **Fail**: the second status has no stale line while naming the first run, the rebuild reports a run count other than 2, or the rebuilt row names the first run.
- **Skip**: only when node, git or the SQLite binding is unavailable, naming that blocker. A status that cannot load its modules prints `the status modules did not load` and exits 1.

### Failure Triage

1. No stale line and a current row: the runner refreshed the index after the run. That is not a failure, so record it and check `builtAt` moved.
2. No stale line and an old row: read the generation-stamp check in `runtime/lib/status.ts`.
3. A rebuild run count other than 2: read the record walk in `runtime/lib/status-index.ts`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `status-and-inbox/status-stale-and-rebuild.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/status.ts` | The status report, stale check and row format |
| `.skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` | Builds the derived index |
| `.skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` | The status mode's verb reference |
| `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts` | Automated status coverage |
| `.skilled/skills/system-skilled-bots/runtime/tests/status-index.vitest.ts` | Automated index coverage |

---

## 5. SOURCE METADATA

- Group: Status And Inbox
- Playbook ID: BOT-022
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `status-and-inbox/status-stale-and-rebuild.md`
