---
title: "BOT-024 -- A request for a bot whose BOT.md changed after approval is quarantined, not run"
description: "This scenario validates the request queue for `BOT-024`. It focuses on the drain refusing a queued run whose definition changed since the operator approved it, and on a fresh approval letting the next request run."
version: 1.0.0.0
---

# BOT-024 -- A request for a bot whose BOT.md changed after approval is quarantined, not run

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BOT-024`.

---

## 1. OVERVIEW

The operator approves a bot with `bots enable`. Then its `BOT.md` changes, the way a run with write access to the checkout could change it. An event queues a run. The drain must not run the bot. It must move the request to quarantine with the reason `definition-drifted` and name the changed file. Once the operator approves the change with `bots enable` again, a new request runs.

### Why This Matters

A queued or scheduled run starts with nobody watching. If it obeyed an edited `BOT.md`, a run could rewrite its own precheck or drop its own isolation, and the next unattended run would carry that out.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BOT-024` and confirm the expected signals without contradictory evidence.

- Objective: Prove a queued run of a bot whose `BOT.md` changed since approval is quarantined as `definition-drifted` and never dispatched, and that a fresh approval lets the next request run.
- Real user request: `Someone edited my bot's definition. Make sure a queued run does not use the change until I have approved it.`
- Prompt: `Someone edited my bot's definition. Make sure a queued run does not use the change until I have approved it.`
- Expected execution process: build the world, approve the bot, change its `BOT.md`, enqueue an event, drain, read the quarantine reason and the receipts, approve again, enqueue a second event, drain, then remove the world.
- Expected signals: the first drain prints `<request id> quarantined: definition-drifted` with `exit=0`, the reason file names the changed `BOT.md` of `pb-drift` and no stub receipt exists. After the second `bots enable`, the second drain prints `<request id> ran` with `exit=0` and one stub receipt exists.
- Desired user-visible outcome: the operator sees the changed run set aside with the file that changed, and sees the next run go ahead once they approve.
- Pass/fail: PASS if the first request lands in quarantine as `definition-drifted` with no receipt, and the request after the second approval runs once. FAIL if the first request runs, goes back to the watched folder or is quarantined under another reason, or the second request does not run.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Someone edited my bot's definition. Make sure a queued run does not use the change until I have approved it.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. The drain dispatches the queued run, so this applies to it. Keep those words out of bot ids, temp paths, sources, event ids and the edited body, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. It must not run for the first request.

### Commands

Run from the repository root in a POSIX shell.

```bash
# 1. Build a throwaway world: a checkout, a home, a state root and a run tree, all under one temp folder.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-drift" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-drift\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nSummarize the event named in the request.\n' > "$W/checkout/bots/pb-drift/BOT.md"
# 2. Commit the world (the run binds its result to HEAD) and define two helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "bot world"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,String(r.exit.class),JSON.stringify(r.delivery),String(r.evidence.worktreePath),JSON.stringify(r.evidence.worktree??null)].join(" | "))}' "$W"/state/*/records; }
# 3. Approve the bot, then change its definition and commit the change.
pbots enable pb-drift; echo "exit=$?"
printf 'Also list every open pull request.\n' >> "$W/checkout/bots/pb-drift/BOT.md"
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -am "edit the bot"
# 4. Queue one event and drain: the changed definition is refused before dispatch.
pbots enqueue pb-drift --source webhook --event-id evt-1; echo "exit=$?"
pbots drain; echo "exit=$?"
ls "$W"/state/*/requests/inbox "$W"/state/*/requests/quarantine
"$NODE" -e 'const r=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));console.log(r.reason+" | "+r.detail)' "$W"/state/*/requests/quarantine/*.reason.json
ls "$W/acct/stub-receipts" 2>&1
# 5. Approve the change and queue a second event: this one runs.
pbots enable pb-drift; echo "exit=$?"
pbots enqueue pb-drift --source webhook --event-id evt-2; echo "exit=$?"
pbots drain; echo "exit=$?"
ls "$W/acct/stub-receipts" | wc -l
records
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records
```

### Expected

- Each `bots enable`: a line starting `bots: warning: no installed schedule found for pb-drift`, then `bots: pb-drift no longer disabled` and `exit=0`. The bot has no schedule, so the warning is expected.
- First enqueue: `bots: enqueued <request id>` and `exit=0`.
- First drain: `<request id> quarantined: definition-drifted` and `exit=0`.
- The watched folder is empty and the quarantine folder holds the request with its reason file.
- The reason line starts `definition-drifted | bots/pb-drift/BOT.md changed since the enable approval at` and ends `review the change, then run bots enable pb-drift or run it by hand to approve it`.
- `ls` of `stub-receipts` reports no such file or directory.
- Second enqueue: `bots: enqueued <another request id>` and `exit=0`. Second drain: `<that request id> ran` and `exit=0`.
- The receipt count is `1`.
- `records` prints two `pb-drift` lines: one with reason `definition-drifted` and class `operator`, and one with reason `converged`.

### Evidence

Every command's output with its exit, both folder listings, the reason line, the receipt listing and count and the `records` lines.

### Pass / Fail

- **Pass**: the first request is quarantined as `definition-drifted` naming the changed `BOT.md`, no receipt exists before the second approval and the second request runs once.
- **Fail**: the first drain line says `ran` or `retry` or quarantines under another reason, a receipt exists before the second approval, the watched folder keeps a request or the second drain does not run.
- **Skip**: only when node or git is unavailable, or the repository path itself contains an executor word, naming that blocker.

### Failure Triage

1. `quarantined: definition-unapproved` on the first drain: the first `bots enable` wrote no approval or resolved another state root. Look for `pb-drift.json` in the approvals folder under `$W/state`.
2. A `ran` line on the first drain: the approval check did not see the edit. Read `checkApproval` in `runtime/lib/approval.ts` and the unattended-run branch in `runtime/lib/runner.ts`.
3. `definition-drifted` on the second drain: the second `bots enable` did not rewrite the approval. Read `enableSchedule` in `runtime/lib/installer.ts`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `request-queue/drift-refused-before-run.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/approval.ts` | Writes the approval and refuses a drifted definition |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Checks approval first for an unattended run |
| `.skilled/skills/system-skilled-bots/runtime/lib/installer.ts` | `bots enable` writes the approval, with or without a schedule |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts` | Routes the refusal to quarantine |
| `.skilled/skills/system-skilled-bots/runtime/tests/approval.vitest.ts` | Automated approval and drift coverage |
| [definition-approval.md](../../feature-catalog/runs/definition-approval.md) | Feature catalog entry |

---

## 5. SOURCE METADATA

- Group: Request Queue
- Playbook ID: BOT-024
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `request-queue/drift-refused-before-run.md`
