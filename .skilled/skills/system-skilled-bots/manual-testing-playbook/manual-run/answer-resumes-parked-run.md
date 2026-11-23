---
title: "BOT-015 -- Answering a needs-you item resumes the parked run"
description: "This scenario validates the answer path for `BOT-015`. It focuses on `bots answer` queueing one resume request, a repeated answer staying a duplicate and the drain running the resumed bot to completion."
version: 1.0.0.0
---

# BOT-015 -- Answering a needs-you item resumes the parked run

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BOT-015`.

---

## 1. OVERVIEW

The executor edits a file and asks whether to keep it, so the run parks. The operator answers the item. `bots answer` must queue one resume request, a second identical answer must not queue another, and `bots drain` must run the resumed bot. The resumed run sees the answer, finds the parked edit and finishes.

### Why This Matters

The answer is how a parked run continues. A lost answer strands the bot, and a doubled answer runs it twice.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BOT-015` and confirm the expected signals without contradictory evidence.

- Objective: Prove one answer queues one resume request, a repeat stays a duplicate and the drain completes the resumed run.
- Real user request: `Answer my bot's question with keep it and let it finish the job.`
- Prompt: `Answer my bot's question with keep it and let it finish the job.`
- Expected execution process: build the world, run the bot until it parks, take the item id from its output, answer twice, drain, check the resumed file and the inbox, then remove the world.
- Expected signals: the run exits 5. The first answer prints `bots: item <item id> answered; resume request <request id> enqueued`. The second prints `duplicate: already queued` for the same request. The drain prints `<request id> ran` with `exit=0`. The checkout then holds `parked-note.txt.resumed`.
- Desired user-visible outcome: the operator answers once, and the bot picks up where it stopped.
- Pass/fail: PASS if every signal appears, the request ids match and the inbox shows no open item afterwards. FAIL if the answer queues nothing, the repeat queues a second request or the drain does not complete the resumed run.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Answer my bot's question with keep it and let it finish the job.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. The drain dispatches the resumed run, so this applies to it too. Keep those words out of bot ids, temp paths, the answer text and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. `STUB:park-edit=parked-note.txt` writes that file and asks on the first run. On a run whose prompt carries the answer, it checks the file is still there and writes `parked-note.txt.resumed`.

### Commands

Run from the repository root in a POSIX shell.

```bash
# 1. Build a throwaway world: a checkout, a home, a state root and a run tree, all under one temp folder.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-park" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-park\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nDraft the parked note.\nSTUB:park-edit=parked-note.txt\n' > "$W/checkout/bots/pb-park/BOT.md"
# 2. Commit the world (the run binds its result to HEAD) and define two helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "bot world"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,String(r.exit.class),JSON.stringify(r.delivery),String(r.evidence.worktreePath),JSON.stringify(r.evidence.worktree??null)].join(" | "))}' "$W"/state/*/records; }
# 3. Run until it parks and take the item id from the output.
OUT="$(pbots run pb-park)"; echo "$OUT exit=$?"
ITEM="$(printf '%s\n' "$OUT" | sed -n 's/.*decision: item \([^ ]*\)\. See bots inbox\./\1/p')"; echo "item: $ITEM"
# 4. Answer twice, drain, then check the resumed work and the inbox.
pbots answer "$ITEM" "keep it"; echo "exit=$?"
pbots answer "$ITEM" "keep it"; echo "exit=$?"
pbots drain; echo "exit=$?"
ls "$W/checkout/parked-note.txt" "$W/checkout/parked-note.txt.resumed"
pbots inbox; echo "exit=$?"
records
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records
```

### Expected

- The run: `bots: pb-park run <run id> is waiting on a decision: item <item id>. See bots inbox.` and `exit=5`.
- First answer: `bots: item <item id> answered; resume request <request id> enqueued` and `exit=0`.
- Second answer: `bots: item <item id> answered; resume request <request id> duplicate: already queued` and `exit=0`, with the same request id.
- Drain: one line `<request id> ran` and `exit=0`.
- Both files exist in the checkout.
- Inbox: `bots: no open or expired needs-you items`.
- `records` prints two `pb-park` lines: the parked run with `blockedStop` and the resumed run with `converged`.

### Evidence

Every command's output with its exit, the extracted item id, the `ls` result and the `records` lines.

### Pass / Fail

- **Pass**: one resume request, a duplicate on the repeat, a drain line `ran` and the `.resumed` file.
- **Fail**: the answer refuses, the repeat enqueues a new request id, the drain quarantines or retries, or the `.resumed` file is missing.
- **Skip**: only when node or git is unavailable, or the repository path itself contains an executor word, naming that blocker.

### Failure Triage

1. An empty `ITEM`: the run did not park. Read BOT-014 first and its triage.
2. `item-unknown` on the answer: the answer resolved another state root. Check `$W/checkout/bots/config.json`.
3. The drain quarantines with `held-needs-you`: the answer did not land on the item before the request. Read the order in `runtime/lib/answer.ts`.
4. The stub exits 7: the resumed run did not find the parked edit. Read the shared-isolation resume path in `runtime/lib/runner.ts`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `manual-run/answer-resumes-parked-run.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Records the answer, then queues one resume request |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts` | Claims and runs the resume request |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Builds the resumed prompt with the answer |
| `.skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` | The run mode's answer reference |
| `.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts` | Automated answer coverage |
| `.skilled/skills/system-skilled-bots/runtime/tests/resume.vitest.ts` | Automated resume coverage |

---

## 5. SOURCE METADATA

- Group: Manual Run
- Playbook ID: BOT-015
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `manual-run/answer-resumes-parked-run.md`
