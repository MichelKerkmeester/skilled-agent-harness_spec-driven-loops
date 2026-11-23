---
title: "BOT-017 -- A desktop delivery target sends one notice and records it"
description: "This scenario validates delivery for `BOT-017`. It focuses on a completed run sending one macOS desktop notice and recording that send as attempted."
version: 1.0.0.0
---

# BOT-017 -- A desktop delivery target sends one notice and records it

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BOT-017`.

---

## 1. OVERVIEW

A bot that names the `desktop` target must show one macOS notification after its run, and record the send. Nothing acknowledges a desktop notice, so the recorded state is `attempted`, never `delivered`. Status must show the same delivery state.

### Why This Matters

An unattended run is silent unless it tells someone. The record must keep the run's outcome and the delivery's outcome apart, and must not claim a delivery nothing confirmed.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BOT-017` and confirm the expected signals without contradictory evidence.

- Objective: Prove a desktop target sends one notice after a completed run and records it as `attempted`.
- Real user request: `Have my bot pop up a desktop notice when it finishes, and show me it was sent.`
- Prompt: `Have my bot pop up a desktop notice when it finishes, and show me it was sent.`
- Expected execution process: build the world with a desktop-delivery bot, run it, watch for the notification, read the record and status, then remove the world.
- Expected signals: the run exits 0 with `bots: pb-notice run <run id> completed`. One notification appears naming `pb-notice`. The record's delivery holds one entry with `"channel":"desktop"` and `"state":"attempted"`. Status prints `delivery desktop:attempted` on the bot's row.
- Desired user-visible outcome: the operator sees the notice and status confirms it was sent.
- Pass/fail: PASS if exit 0, one notification, the `attempted` entry and the status field all appear. FAIL if the run's outcome changes because of delivery, the state reads `delivered` or two notices appear.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Have my bot pop up a desktop notice when it finishes, and show me it was sent.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. The notice itself is real: it goes through `osascript`.

### Commands

Run from the repository root in a POSIX shell, on a Mac with a logged-in desktop session.

```bash
# 1. Build a throwaway world: a checkout, a home, a state root and a run tree, all under one temp folder.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-notice" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-notice\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: {targets: [desktop], onFailure: null}\n---\nTidy the notes folder.\n' > "$W/checkout/bots/pb-notice/BOT.md"
# 2. Commit the world (the run binds its result to HEAD) and define two helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "bot world"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,String(r.exit.class),JSON.stringify(r.delivery),String(r.evidence.worktreePath),JSON.stringify(r.evidence.worktree??null)].join(" | "))}' "$W"/state/*/records; }
# 3. Run, watch the screen for one notice, then read the record and status.
pbots run pb-notice; echo "exit=$?"
records
pbots status; echo "exit=$?"
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records
```

### Expected

- `bots: pb-notice run <run id> completed` and `exit=0`.
- One notification on screen naming `pb-notice`.
- `records` prints one line whose delivery JSON holds one entry with `"channel":"desktop"` and `"state":"attempted"`.
- Status prints a row for `pb-notice` carrying `last <run id> converged` and `delivery desktop:attempted`, and `exit=0`.

### Evidence

The run line, a screenshot or note of the notification, the `records` line and the status output.

### Pass / Fail

- **Pass**: exit 0, one notice, the `attempted` entry and the status field.
- **Fail**: no notice and no failure entry, a `delivered` state, two notices or a run whose exit changes with delivery.
- **Skip**: only when the machine is not macOS or has no desktop session, so `osascript` is unavailable, naming that blocker.

### Failure Triage

1. A `failed` entry: run `osascript -e 'display notification "test"'` by hand to see whether notifications are allowed for the terminal.
2. No entry at all: read `deliverRecord` in `runtime/lib/delivery.ts` and the target parse in the same file.
3. A status row without delivery: read `formatStatus` in `runtime/lib/status.ts`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `worktree-and-delivery/desktop-delivery-recorded.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/delivery.ts` | Claims, sends and records each delivery |
| `.skilled/skills/system-skilled-bots/runtime/lib/status.ts` | Prints the delivery state on the status row |
| `.skilled/skills/system-skilled-bots/runtime/tests/delivery.vitest.ts` | Automated delivery coverage |

---

## 5. SOURCE METADATA

- Group: Worktree And Delivery
- Playbook ID: BOT-017
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `worktree-and-delivery/desktop-delivery-recorded.md`
